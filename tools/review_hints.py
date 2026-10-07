#!/usr/bin/env python3
"""Reviewer hints for a pull request: what a human should look at first.

Runs in the public pull-request workflow (`.github/workflows/validate-pr.yml`, no secrets) and on a maintainer's
machine. Hints are GitHub workflow annotations (warnings) plus a Markdown summary, and a warning never fails the
run. It reads only the added lines of the diff, so an unchanged file never produces noise. The one error is a change
outside the paths a contributor may change (`CONTRIBUTOR_PREFIXES`): workflows, tooling, signing keys and
publishing scripts belong to maintainers, and the importer refuses such a pull request too.

    python tools/review_hints.py --base <base-sha> [--head HEAD] [--repo-root .] [--summary FILE]

Exit 0 normally, 1 when a path outside the contributor paths changed (the importer's own check, repeated here so
the author learns it early). The findings are heuristics: absence of a hint is not a safety statement.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# What a contributor pull request may change. Everything else (`.github/`, `.gitea/`, `tools/`, `scripts/`,
# `keys/`, `templates/`, `docs/`, the root files, Python tests) needs a maintainer to make the change.
CONTRIBUTOR_PREFIXES = ("extensions/", "recipes/", "tests/js/")
# Loose files directly under recipes/ (README, schema) are maintainer-owned; only recipe folders are open.
MAINTAINER_ONLY_RECIPE_FILES = re.compile(r"^recipes/[^/]+$")

JS_SUFFIXES = (".js", ".mjs", ".cjs")
WEB_SUFFIXES = JS_SUFFIXES + (".html", ".htm")
MAX_FILE_BYTES = 2_000_000


@dataclass(frozen=True)
class Rule:
    code: str
    pattern: re.Pattern[str]
    suffixes: tuple[str, ...]
    message: str


RULES = (
    Rule("eval", re.compile(r"(?<![\w.$])eval\s*\("), JS_SUFFIXES + (".html", ".htm"),
         "eval() runs text as code; extensions must not build code at run time"),
    Rule("new-function", re.compile(r"\bnew\s+Function\b|(?<![\w.$])Function\s*\(\s*['\"`]"), JS_SUFFIXES + (".html", ".htm"),
         "Function constructor runs text as code"),
    Rule("network", re.compile(r"(?<![\w.$])fetch\s*\(|\bXMLHttpRequest\b|\bnavigator\.sendBeacon\b|\bnew\s+(?:WebSocket|EventSource)\b"),
         JS_SUFFIXES + (".html", ".htm"),
         "direct network access; extensions reach the network only through host.network.fetch with the network permission"),
    Rule("import-scripts", re.compile(r"\bimportScripts\s*\("), JS_SUFFIXES,
         "importScripts loads more code at run time"),
    Rule("cookie", re.compile(r"\bdocument\s*\.\s*cookie\b"), JS_SUFFIXES + (".html", ".htm"),
         "reads or writes cookies"),
    Rule("remote-import", re.compile(r"""(?:\bimport\s*\(\s*|\bfrom\s+|\bimport\s+)['"`](?:https?:)?//"""), JS_SUFFIXES,
         "imports code from a remote URL"),
    Rule("dynamic-import", re.compile(r"\bimport\s*\(\s*(?:(?!['\"`])|`[^`]*\$\{)"), JS_SUFFIXES,
         "dynamically built import path"),
    Rule("remote-script", re.compile(r"""<script\b[^>]*\bsrc\s*=\s*['"]?(?:https?:)?//""", re.I), (".html", ".htm", ".svg"),
         "loads a script from a remote URL"),
    Rule("inline-script", re.compile(r"<script\b|\bon[a-z]+\s*=\s*['\"]|<foreignObject\b", re.I), (".svg", ".html", ".htm"),
         "markup that can run code (script, event handler, foreignObject)"),
)

# Rules for recipe.json: text that points at Docker control, host networking or system paths.
RECIPE_RULES = (
    ("recipe-docker", re.compile(r"docker\.sock|privileged|network_mode|host network|/proc\b|/sys\b", re.I),
     "recipe text mentions Docker control, host networking or system paths"),
)


@dataclass(frozen=True)
class Finding:
    level: str  # "warning" | "error"
    code: str
    path: str
    line: int | None
    message: str


def git(root: Path, *args: str, check: bool = True) -> bytes:
    result = subprocess.run(["git", "-C", str(root), *args], capture_output=True)
    if check and result.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {result.stderr.decode('utf-8', 'replace').strip()}")
    return result.stdout if result.returncode == 0 else b""


def is_contributor_path(path: str) -> bool:
    if not path.startswith(CONTRIBUTOR_PREFIXES):
        return False
    return not MAINTAINER_ONLY_RECIPE_FILES.match(path)


def changed_paths(root: Path, base: str, head: str) -> list[str]:
    """Every path touched between base and head, both sides of a rename (--no-renames)."""
    out = git(root, "diff", "--name-only", "--no-renames", "-z", base, head).decode("utf-8", "surrogateescape")
    return sorted(p for p in out.split("\0") if p)


def added_lines(root: Path, base: str, head: str, paths: list[str]) -> dict[str, list[tuple[int, str]]]:
    """Added lines per path with their line numbers in head (`git diff -U0`)."""
    if not paths:
        return {}
    raw = git(root, "diff", "--unified=0", "--no-renames", "--no-color", base, head, "--", *paths)
    found: dict[str, list[tuple[int, str]]] = {}
    current: str | None = None
    lineno = 0
    for line in raw.decode("utf-8", "replace").splitlines():
        if line.startswith("+++ "):
            current = line[6:] if line.startswith("+++ b/") else None
            continue
        if line.startswith("@@"):
            match = re.match(r"@@ -\d+(?:,\d+)? \+(\d+)", line)
            lineno = int(match.group(1)) if match else 0
            continue
        if current and line.startswith("+") and not line.startswith("+++"):
            found.setdefault(current, []).append((lineno, line[1:]))
            lineno += 1
    return found


def _show(root: Path, rev: str, path: str) -> bytes | None:
    result = subprocess.run(["git", "-C", str(root), "show", f"{rev}:{path}"], capture_output=True)
    return result.stdout if result.returncode == 0 else None


def minified_reason(data: bytes) -> str | None:
    if len(data) < 2000:
        return None
    lines = data.splitlines() or [data]
    longest = max(len(line) for line in lines)
    if longest > 500 or len(data) / len(lines) > 200:
        return f"looks minified or packed (longest line {longest} characters); ship readable sources"
    return None


def permission_findings(root: Path, base: str, head: str, paths: list[str]) -> list[Finding]:
    findings: list[Finding] = []
    for path in paths:
        if not re.fullmatch(r"extensions/[^/]+/extension\.json", path):
            continue
        new = _show(root, head, path)
        if new is None:
            continue
        try:
            new_perms = set(json.loads(new).get("permissions") or [])
        except (ValueError, AttributeError, TypeError):
            continue
        old = _show(root, base, path)
        old_perms: set = set()
        if old is not None:
            try:
                old_perms = set(json.loads(old).get("permissions") or [])
            except (ValueError, AttributeError, TypeError):
                old_perms = set()
        added = sorted(p for p in new_perms - old_perms if isinstance(p, str))
        if added:
            what = "new extension asks for" if old is None else "now also asks for"
            findings.append(Finding("warning", "new-permission", path, None, f"{what} permission(s): {', '.join(added)}"))
    return findings


def scan(root: Path, base: str, head: str) -> list[Finding]:
    paths = changed_paths(root, base, head)
    findings: list[Finding] = []
    outside = [p for p in paths if not is_contributor_path(p)]
    for path in outside:
        findings.append(Finding(
            "error", "maintainer-path", path, None,
            "contributors cannot change this path (allowed: extensions/, recipes/<slug>/, tests/js/); "
            "open an issue or ask a maintainer",
        ))

    inside = [p for p in paths if is_contributor_path(p)]
    lines = added_lines(root, base, head, inside)
    for path, added in sorted(lines.items()):
        suffix = os.path.splitext(path)[1].lower()
        for lineno, text in added:
            for rule in RULES:
                if suffix in rule.suffixes and rule.pattern.search(text):
                    findings.append(Finding("warning", rule.code, path, lineno, rule.message))
            if path.startswith("recipes/") and path.endswith("recipe.json"):
                for code, pattern, message in RECIPE_RULES:
                    if pattern.search(text):
                        findings.append(Finding("warning", code, path, lineno, message))
    for path in inside:
        if path.startswith("extensions/") and path.lower().endswith(JS_SUFFIXES):
            data = _show(root, head, path)
            if data is not None and len(data) <= MAX_FILE_BYTES:
                reason = minified_reason(data)
                if reason:
                    findings.append(Finding("warning", "minified", path, 1, reason))
    findings.extend(permission_findings(root, base, head, inside))
    return findings


def _escape_data(text: str) -> str:
    return text.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")


def _escape_prop(text: str) -> str:
    return _escape_data(text).replace(":", "%3A").replace(",", "%2C")


def annotation(finding: Finding) -> str:
    props = f"file={_escape_prop(finding.path)}"
    if finding.line:
        props += f",line={finding.line}"
    props += f",title={_escape_prop('Review hint: ' + finding.code)}"
    return f"::{finding.level} {props}::{_escape_data(finding.message)}"


def summary_markdown(findings: list[Finding], paths_changed: int) -> str:
    out = ["### Reviewer hints", ""]
    if not findings:
        out.append(f"No hints on {paths_changed} changed file(s). This is a heuristic scan, not a safety statement.")
        return "\n".join(out) + "\n"
    out.append("| Level | Hint | File | Line | Why |")
    out.append("|---|---|---|---|---|")
    for f in findings:
        out.append(f"| {f.level} | `{f.code}` | `{f.path}` | {f.line or ''} | {f.message.replace('|', '/')} |")
    out.append("")
    out.append("Hints tell a reviewer where to look first; they are heuristics, not a verdict.")
    return "\n".join(out) + "\n"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Reviewer hints for the diff between two commits")
    parser.add_argument("--base", required=True, help="base commit (the target branch tip)")
    parser.add_argument("--head", default="HEAD")
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT, help="the checkout holding the pull request")
    parser.add_argument("--summary", type=Path, help="append the Markdown summary to this file (GITHUB_STEP_SUMMARY)")
    args = parser.parse_args(argv)

    try:
        findings = scan(args.repo_root, args.base, args.head)
        total = len(changed_paths(args.repo_root, args.base, args.head))
    except RuntimeError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    for finding in findings:
        print(annotation(finding))
    markdown = summary_markdown(findings, total)
    if args.summary:
        with args.summary.open("a", encoding="utf-8") as handle:
            handle.write(markdown)
    print(markdown)
    return 1 if any(f.level == "error" for f in findings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
