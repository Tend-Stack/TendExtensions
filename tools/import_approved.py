#!/usr/bin/env python3
"""Import approved community pull requests into `main` (runs on Gitea, on a schedule).

The review platform ("Tend Review", a GitHub App) never pushes. When a reviewer approves a pull request it posts a
review as the App whose body is exactly `tend-review: approve <40-hex head sha>`. This script, run by
`.gitea/workflows/import-approved.yml` with the trusted checkout of `main`, does the rest:

  1. list open pull requests on GitHub and read each one's reviews;
  2. accept only a review by the App's bot login (type Bot) naming the pull request's *current* head sha; a head
     that moved after approval voids it (nothing is imported until the reviewer approves the new head);
  3. fetch `refs/pull/<n>/head` as plain git objects (nothing from the pull request is executed here), and refuse
     when it touches a path contributors may not change, adds a symlink or submodule, or does not rebase cleanly;
  4. rebase onto `main` (authors are kept), run `tools/build.py` from the trusted tree over the result, and refuse if
     it fails or would rewrite a committed file;
  5. push to `main` without force; the normal pipeline then revalidates, signs, mirrors and releases;
  6. comment the release tag it will ship in and close the pull request.

Idempotent: a pull request whose commits already landed (a retried run) is only commented and closed. Refusals are
commented once per head and reason. The importer holds no signing key.

    TEND_REVIEW_APP_LOGIN   login of the App's bot account, e.g. tend-review[bot]  (or --app-login)
    GH_PUBLISH_TOKEN        optional GitHub token: raises the API rate limit; needs "Pull requests: write" to
                            comment and close. Without it the import still happens and the PR stays open.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Protocol

try:  # imported as `tools.import_approved` (tests) or run as `python tools/import_approved.py`
    from tools import review_hints
except ImportError:  # pragma: no cover - script mode puts tools/ itself on sys.path
    import review_hints

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_GITHUB_REPO = "Tend-Stack/TendExtensions"
APPROVAL_RE = re.compile(r"^tend-review: approve ([0-9a-f]{40})$")
WITHDRAW_PREFIX = "tend-review: withdraw"
COMMITTER = ("Tend Registry Importer", "registry-importer@users.noreply.tend.host")
FORBIDDEN_MODES = {"120000", "160000"}  # symlink, submodule


class GitHub(Protocol):
    def get(self, path: str) -> Any: ...
    def post(self, path: str, body: dict[str, Any]) -> Any: ...
    def patch(self, path: str, body: dict[str, Any]) -> Any: ...


class GitHubApi:
    """Minimal GitHub REST client over urllib, outbound to api.github.com only."""

    def __init__(self, token: str | None, base: str = "https://api.github.com") -> None:
        self.token = token
        self.base = base

    def _request(self, method: str, path: str, body: dict[str, Any] | None = None) -> Any:
        data = json.dumps(body).encode("utf-8") if body is not None else None
        request = urllib.request.Request(self.base + path, data=data, method=method)
        request.add_header("Accept", "application/vnd.github+json")
        request.add_header("X-GitHub-Api-Version", "2022-11-28")
        request.add_header("User-Agent", "tend-registry-importer")
        if data is not None:
            request.add_header("Content-Type", "application/json")
        if self.token:
            request.add_header("Authorization", f"Bearer {self.token}")
        with urllib.request.urlopen(request, timeout=30) as response:  # noqa: S310 - fixed https host
            return json.loads(response.read(5_000_000) or b"null")

    def get(self, path: str) -> Any:
        return self._request("GET", path)

    def post(self, path: str, body: dict[str, Any]) -> Any:
        return self._request("POST", path, body)

    def patch(self, path: str, body: dict[str, Any]) -> Any:
        return self._request("PATCH", path, body)


@dataclass
class Config:
    root: Path
    github_repo: str
    app_login: str
    clone_url: str
    remote: str = "origin"
    branch: str = "main"
    dry_run: bool = False
    results: list[tuple[int, str, str]] = field(default_factory=list)  # (pr, outcome, detail)


class Refusal(Exception):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


def approved_sha(reviews: list[dict[str, Any]], app_login: str) -> str | None:
    """The head sha the App last approved and has not withdrawn, or None. Only the App's bot account counts."""
    approved: str | None = None
    for review in sorted(reviews, key=lambda r: r.get("id", 0)):
        user = review.get("user") or {}
        if user.get("login") != app_login or user.get("type") != "Bot":
            continue
        if review.get("state") == "DISMISSED":
            continue
        body = (review.get("body") or "").strip()
        match = APPROVAL_RE.match(body)
        if match:
            approved = match.group(1)
        elif body.startswith(WITHDRAW_PREFIX):
            approved = None
    return approved


def _git(cfg: Config, *args: str, check: bool = True) -> str:
    env = dict(os.environ)
    env.update(
        GIT_COMMITTER_NAME=COMMITTER[0], GIT_COMMITTER_EMAIL=COMMITTER[1],
        GIT_TERMINAL_PROMPT="0", GIT_CONFIG_NOSYSTEM="1",
    )
    result = subprocess.run(
        ["git", "-C", str(cfg.root), "-c", "core.hooksPath=/dev/null", *args],
        capture_output=True, text=True, env=env,
    )
    if check and result.returncode != 0:
        raise RuntimeError(f"git {args[0]} failed: {result.stderr.strip() or result.stdout.strip()}")
    return result.stdout.strip() if result.returncode == 0 else ""


def _git_ok(cfg: Config, *args: str) -> bool:
    env = dict(os.environ, GIT_COMMITTER_NAME=COMMITTER[0], GIT_COMMITTER_EMAIL=COMMITTER[1], GIT_TERMINAL_PROMPT="0")
    return subprocess.run(
        ["git", "-C", str(cfg.root), "-c", "core.hooksPath=/dev/null", *args], capture_output=True, env=env
    ).returncode == 0


def check_paths_and_modes(cfg: Config, base: str, head: str) -> None:
    paths = review_hints.changed_paths(cfg.root, base, head)
    if not paths:
        raise Refusal("empty", "the pull request changes nothing")
    outside = [p for p in paths if not review_hints.is_contributor_path(p)]
    if outside:
        raise Refusal(
            "maintainer-path",
            "it changes paths only maintainers may change: " + ", ".join(f"`{p}`" for p in outside[:8])
            + ("" if len(outside) <= 8 else f" and {len(outside) - 8} more"),
        )
    raw = _git(cfg, "diff", "--raw", "--no-renames", base, head)
    for line in raw.splitlines():
        fields = line.split()
        if len(fields) >= 2 and (fields[0].lstrip(":") in FORBIDDEN_MODES or fields[1] in FORBIDDEN_MODES):
            raise Refusal("special-file", "it adds a symlink or a submodule")


def build_check(cfg: Config) -> None:
    """Run the trusted tree's own build over the rebased result; refuse on failure or a rewritten file."""
    result = subprocess.run(
        [sys.executable, str(cfg.root / "tools" / "build.py"), "--repo-root", str(cfg.root)],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        tail = (result.stderr.strip() or result.stdout.strip()).splitlines()[-12:]
        raise Refusal("build-failed", "`tools/build.py` refused it:\n```\n" + "\n".join(tail) + "\n```")
    dirty = _git(cfg, "status", "--porcelain", "--untracked-files=no")
    if dirty:
        files = [line[3:] for line in dirty.splitlines()]
        _git(cfg, "checkout", "--", ".")
        raise Refusal(
            "stale-integrity",
            "`tools/build.py` rewrites committed files (" + ", ".join(f"`{f}`" for f in files[:6])
            + "); run it locally and commit the result",
        )


def list_comments(gh: GitHub, cfg: Config, number: int) -> list[dict[str, Any]]:
    return gh.get(f"/repos/{cfg.github_repo}/issues/{number}/comments?per_page=100") or []


def comment(gh: GitHub, cfg: Config, number: int, body: str) -> None:
    if cfg.dry_run:
        print(f"[dry-run] would comment on #{number}: {body.splitlines()[0]}")
        return
    try:
        gh.post(f"/repos/{cfg.github_repo}/issues/{number}/comments", {"body": body})
    except (urllib.error.URLError, OSError) as exc:
        print(f"warning: could not comment on #{number}: {exc}", file=sys.stderr)


def close_pr(gh: GitHub, cfg: Config, number: int) -> None:
    if cfg.dry_run:
        print(f"[dry-run] would close #{number}")
        return
    try:
        gh.patch(f"/repos/{cfg.github_repo}/pulls/{number}", {"state": "closed"})
    except (urllib.error.URLError, OSError) as exc:
        print(f"warning: could not close #{number}: {exc}", file=sys.stderr)


def refuse_once(gh: GitHub, cfg: Config, number: int, sha: str, refusal: Refusal) -> None:
    marker = f"<!-- tend-import:{sha}:{refusal.code} -->"
    try:
        if any(marker in (c.get("body") or "") for c in list_comments(gh, cfg, number)):
            return
    except (urllib.error.URLError, OSError):
        return
    comment(
        gh, cfg, number,
        f"{marker}\nThe approved head `{sha[:12]}` was not imported: {refusal.message}\n\n"
        "A maintainer can fix this by hand, or push a corrected head and ask for a new review.",
    )


def _finish_already_imported(gh: GitHub, cfg: Config, number: int) -> str:
    comment(gh, cfg, number, f"Already imported into `{cfg.branch}`; closing.")
    close_pr(gh, cfg, number)
    return "already-imported"


def import_one(gh: GitHub, cfg: Config, pr: dict[str, Any]) -> str:
    """Handle one open pull request; return an outcome code. Never raises on a refusal."""
    number = int(pr["number"])
    if pr.get("draft") or (pr.get("base") or {}).get("ref") != cfg.branch:
        return "skipped"
    reviews = gh.get(f"/repos/{cfg.github_repo}/pulls/{number}/reviews?per_page=100") or []
    sha = approved_sha(reviews, cfg.app_login)
    if sha is None:
        return "not-approved"
    if pr["head"]["sha"] != sha:
        return "superseded"

    _git(cfg, "fetch", "--quiet", cfg.remote, cfg.branch)
    base = f"{cfg.remote}/{cfg.branch}"
    _git(cfg, "-c", "transfer.fsckObjects=true", "fetch", "--quiet", "--no-tags", cfg.clone_url, f"refs/pull/{number}/head")
    head = _git(cfg, "rev-parse", "FETCH_HEAD")
    if head != sha:
        return "superseded"

    try:
        _git(cfg, "checkout", "--quiet", "--detach", head)
        if _git_ok(cfg, "merge-base", "--is-ancestor", head, base):
            return _finish_already_imported(gh, cfg, number)
        merge_base = _git(cfg, "merge-base", base, head)
        check_paths_and_modes(cfg, merge_base, head)
        if not _git_ok(cfg, "rebase", "--quiet", base):
            _git_ok(cfg, "rebase", "--abort")
            raise Refusal("conflict", f"it does not rebase cleanly onto `{cfg.branch}`; the author needs to rebase")
        ahead = int(_git(cfg, "rev-list", "--count", f"{base}..HEAD"))
        if ahead == 0:
            return _finish_already_imported(gh, cfg, number)
        check_paths_and_modes(cfg, base, "HEAD")
        build_check(cfg)
    except Refusal as refusal:
        _git_ok(cfg, "checkout", "--quiet", "--detach", base)
        refuse_once(gh, cfg, number, sha, refusal)
        cfg.results.append((number, refusal.code, refusal.message))
        return refusal.code

    if cfg.dry_run:
        print(f"[dry-run] would push {ahead} commit(s) of #{number} to {cfg.branch}")
        return "would-import"
    if not _git_ok(cfg, "push", "--quiet", cfg.remote, f"HEAD:refs/heads/{cfg.branch}"):
        return "main-moved"  # fast-forward refused: another push won; the next run retries
    sequence = int(_git(cfg, "rev-list", "--count", "HEAD"))
    comment(
        gh, cfg, number,
        f"Imported into `{cfg.branch}` ({ahead} commit(s), authors kept). It ships in release `registry-{sequence}` "
        "once the registry pipeline finishes; thank you.",
    )
    close_pr(gh, cfg, number)
    return "imported"


def run(gh: GitHub, cfg: Config) -> dict[int, str]:
    outcomes: dict[int, str] = {}
    prs = gh.get(f"/repos/{cfg.github_repo}/pulls?state=open&base={cfg.branch}&per_page=50") or []
    for pr in sorted(prs, key=lambda p: p["number"]):
        outcome = import_one(gh, cfg, pr)
        outcomes[int(pr["number"])] = outcome
        print(f"#{pr['number']}: {outcome}")
    return outcomes


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Import community pull requests the Tend Review App approved")
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT)
    parser.add_argument("--github-repo", default=DEFAULT_GITHUB_REPO)
    parser.add_argument("--app-login", default=os.environ.get("TEND_REVIEW_APP_LOGIN", ""))
    parser.add_argument("--remote", default="origin")
    parser.add_argument("--branch", default="main")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)
    if not args.app_login:
        print("error: set TEND_REVIEW_APP_LOGIN or --app-login", file=sys.stderr)
        return 2
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", args.github_repo):
        print("error: --github-repo must be owner/name", file=sys.stderr)
        return 2
    cfg = Config(
        root=args.repo_root, github_repo=args.github_repo, app_login=args.app_login,
        clone_url=f"https://github.com/{args.github_repo}.git", remote=args.remote, branch=args.branch,
        dry_run=args.dry_run,
    )
    try:
        run(GitHubApi(os.environ.get("GH_PUBLISH_TOKEN") or None), cfg)
    except (RuntimeError, urllib.error.URLError, OSError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
