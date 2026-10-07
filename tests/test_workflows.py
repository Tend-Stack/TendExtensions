"""Guards for the workflows that handle strangers' pull requests and approved imports.

The public workflow runs contributor code, so these checks are the contract: no secrets, read-only token,
`pull_request` (never `pull_request_target`), pinned actions, no credentials kept, trusted tooling from the base
commit, and no pull-request-controlled text interpolated into a shell script. Text-based on purpose: the PR
workflow runs these tests on a runner that has no YAML library."""
from __future__ import annotations

import re
from pathlib import Path

import pytest
from conftest import REPO_ROOT

PUBLIC = REPO_ROOT / ".github" / "workflows" / "validate-pr.yml"
IMPORT = REPO_ROOT / ".gitea" / "workflows" / "import-approved.yml"
CI = REPO_ROOT / ".gitea" / "workflows" / "ci.yml"
GITHUB_WORKFLOWS = sorted((REPO_ROOT / ".github" / "workflows").glob("*.yml"))


def lines_of(path: Path) -> list[str]:
    return path.read_text(encoding="utf-8").splitlines()


def code_lines(path: Path) -> list[tuple[int, str]]:
    """Non-comment lines with their numbers."""
    return [(i, l) for i, l in enumerate(lines_of(path), 1) if not l.lstrip().startswith("#")]


def run_block_lines(path: Path) -> list[tuple[int, str]]:
    """Lines that belong to a `run:` script (inline or block)."""
    out: list[tuple[int, str]] = []
    rows = code_lines(path)
    i = 0
    while i < len(rows):
        number, line = rows[i]
        m = re.match(r"^(\s*)(?:- )?run:\s*(.*)$", line)
        if m:
            indent = len(m.group(1)) + (2 if line.lstrip().startswith("- ") else 0)
            if m.group(2) and not m.group(2).startswith(("|", ">")):
                out.append((number, m.group(2)))
            j = i + 1
            while j < len(rows) and (not rows[j][1].strip() or len(rows[j][1]) - len(rows[j][1].lstrip()) > indent):
                out.append(rows[j])
                j += 1
            i = j
            continue
        i += 1
    return out


def test_there_is_exactly_the_one_public_workflow() -> None:
    assert [p.name for p in GITHUB_WORKFLOWS] == ["validate-pr.yml"]


@pytest.mark.parametrize("path", GITHUB_WORKFLOWS, ids=lambda p: p.name)
def test_public_workflow_has_no_secrets_and_never_pull_request_target(path: Path) -> None:
    text = "\n".join(l for _, l in code_lines(path))
    assert "secrets." not in text and "secrets[" not in text and "toJSON(secrets" not in text
    assert "pull_request_target" not in text and "workflow_run" not in text
    assert "github.token" not in text and "GITHUB_TOKEN" not in text.replace("GITHUB_STEP_SUMMARY", "")
    assert re.search(r"^on:\n  pull_request:\n", text, re.M), "the only trigger is pull_request"
    triggers = re.search(r"^on:\n((?:  .*\n|\n)+)", text + "\n", re.M).group(1)
    assert re.findall(r"^  ([a-z_]+):", triggers, re.M) == ["pull_request"]


@pytest.mark.parametrize("path", GITHUB_WORKFLOWS, ids=lambda p: p.name)
def test_public_workflow_permissions_are_contents_read_only(path: Path) -> None:
    text = "\n".join(l for _, l in code_lines(path))
    blocks = re.findall(r"^[ \t]*permissions:[ \t]*(.*)\n((?:[ \t]{2,}\S.*\n)*)", text + "\n", re.M)
    assert len(blocks) == 1, "one top-level permissions block and no per-job override"
    inline, body = blocks[0]
    assert inline == "" and [l.strip() for l in body.splitlines() if l.strip()] == ["contents: read"]
    assert re.search(r"^permissions:", text, re.M), "permissions is declared at the top level"


@pytest.mark.parametrize("path", GITHUB_WORKFLOWS, ids=lambda p: p.name)
def test_public_workflow_actions_are_pinned_to_full_shas(path: Path) -> None:
    uses = [l for _, l in code_lines(path) if re.match(r"^\s*(- )?uses:", l)]
    assert uses
    for line in uses:
        assert re.search(r"uses:\s*[\w.-]+/[\w./-]+@[0-9a-f]{40}(\s+#.*)?$", line), line


@pytest.mark.parametrize("path", GITHUB_WORKFLOWS, ids=lambda p: p.name)
def test_public_workflow_checkouts_keep_no_credentials(path: Path) -> None:
    text = "\n".join(l for _, l in code_lines(path))
    checkouts = len(re.findall(r"uses:\s*actions/checkout@", text))
    assert checkouts >= 2 and text.count("persist-credentials: false") == checkouts


@pytest.mark.parametrize("path", GITHUB_WORKFLOWS, ids=lambda p: p.name)
def test_public_workflow_interpolates_nothing_untrusted_into_shell(path: Path) -> None:
    for number, line in run_block_lines(path):
        assert "${{" not in line, f"{path.name}:{number} interpolates an expression into a script; pass it through env:"
    text = "\n".join(l for _, l in code_lines(path))
    for expression in re.findall(r"\$\{\{\s*([^}]+?)\s*\}\}", text):
        assert expression in {
            "github.event.pull_request.number", "github.event.pull_request.base.sha", "!cancelled()",
        }, f"unreviewed expression {expression!r}: head refs, titles and bodies are attacker-controlled"


def test_public_workflow_runs_the_documented_checks_from_trusted_tooling() -> None:
    text = "\n".join(l for _, l in code_lines(PUBLIC))
    assert "ref: ${{ github.event.pull_request.base.sha }}" in text and "path: trusted" in text
    for needle in (
        "trusted/tools/review_hints.py", "trusted/tools/build.py --repo-root pr",
        "trusted/tools/validate_recipe.py", "pytest tests/", "bun test tests/js",
    ):
        assert needle in text, needle
    assert "runs-on: ubuntu-24.04" in text and "tend-ci" not in text, "strangers' code never runs on the self-hosted runner"


def test_import_workflow_is_trusted_only_and_scheduled() -> None:
    text = "\n".join(l for _, l in code_lines(IMPORT))
    assert "pull_request" not in text and "ref: main" in text
    assert re.findall(r"^  ([a-z_]+):", re.search(r"^on:\n((?:  .*\n|\n|    .*\n)+)", text + "\n", re.M).group(1), re.M)[:2] == ["schedule", "workflow_dispatch"]
    assert "tools/import_approved.py" in text and "concurrency:" in text and "cancel-in-progress: false" in text
    for number, line in run_block_lines(IMPORT):
        assert "${{" not in line, f"{IMPORT.name}:{number}"
    assert "bun" not in text and "pytest" not in text, "contributor code is never executed on the Gitea runner"


def test_catalog_signing_key_is_used_only_in_the_release_job() -> None:
    rows = code_lines(CI)
    uses = [n for n, l in rows if "secrets.TEND_COMMUNITY_CATALOG_SIGNING_KEY" in l]
    release_at = next(n for n, l in rows if re.match(r"^  release:", l))
    assert len(uses) == 1 and uses[0] > release_at
    assert not any("secrets." in l for _, l in code_lines(PUBLIC))
