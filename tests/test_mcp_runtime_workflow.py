"""The publish workflow, read as data.

A workflow is the one file here that no unit test exercises at runtime, so what
is checked is what a reviewer would otherwise have to re-read every time: that it
parses, that the window is passed from the resolver instead of typed, and that the
two manual escapes are inputs rather than edits.
"""
from __future__ import annotations

import re
from pathlib import Path

import pytest

from tools import mcp_window

WORKFLOW = Path(__file__).resolve().parent.parent / ".gitea/workflows/mcp-runtime.yml"


def _workflow() -> dict:
    yaml = pytest.importorskip("yaml", reason="PyYAML is not installed")
    return yaml.safe_load(WORKFLOW.read_text(encoding="utf-8"))


def _steps() -> list[dict]:
    return _workflow()["jobs"]["publish"]["steps"]


def _script(fragment: str) -> str:
    for step in _steps():
        run = step.get("run", "")
        if fragment in run:
            return run
    raise AssertionError(f"no step runs {fragment!r}")


def test_the_workflow_parses_and_has_one_publish_job() -> None:
    workflow = _workflow()
    assert list(workflow["jobs"]) == ["publish"]
    assert workflow["permissions"] == {"contents": "read"}


def test_the_dispatch_inputs_are_the_documented_ones() -> None:
    # `on` is the YAML boolean True once parsed, which is why it is looked up both ways.
    workflow = _workflow()
    on = workflow.get("on", workflow.get(True))
    inputs = on["workflow_dispatch"]["inputs"]
    assert set(inputs) == {
        "core_commit",
        "runtime_version",
        "max_core_version",
        "force",
        "dry_run",
        "overwrite",
    }
    # Only the commit is required: the version, the window and the guard all have
    # a derived default, which is the whole point of the automation.
    assert inputs["core_commit"]["required"] is True
    for optional in ("runtime_version", "max_core_version"):
        assert inputs[optional].get("required", False) is False
        assert inputs[optional]["default"] == ""
    for flag in ("force", "dry_run", "overwrite"):
        assert inputs[flag]["default"] is False


def test_the_window_is_resolved_and_never_typed() -> None:
    resolve = _script("tools.mcp_window")
    assert "--core core" in resolve
    assert '--env-out "$GITHUB_ENV"' in resolve
    assert "--json-out" in resolve

    sign = _script("tend-mcp-release sign")
    assert '--min-core "$MIN_CORE_VERSION"' in sign
    assert '--max-core "$MAX_CORE_VERSION"' in sign
    assert '--version "$RUNTIME_VERSION"' in sign
    # No literal version anywhere in the signing step: a hand-typed window is the
    # failure this package removed.
    assert not re.search(r"--(min|max)-core \d", sign)


def test_the_envelope_is_verified_at_both_ends_of_the_window() -> None:
    sign = _script("tend-mcp-release verify")
    assert 'for CORE_VERSION in "$MIN_CORE_VERSION" "$MAX_CORE_VERSION"' in sign
    assert '--core-version "$CORE_VERSION"' in sign


def test_the_publish_step_passes_the_resolved_plan_and_moves_the_alias() -> None:
    publish = _script("ARGS=(--version")
    assert '--plan "$RUNNER_TEMP/mcp-plan.json"' in publish
    # No --no-alias: the alias moves on every publish, which is what lets a core
    # pin one URL forever.
    assert "--no-alias" not in publish
    for step in _steps():
        if "tools.mcp_release" in step.get("run", "") and "--dry-run-out" not in step["run"]:
            assert step.get("if", "").strip() == "${{ gitea.event.inputs.dry_run != 'true' }}"
            break
    else:
        raise AssertionError("no publish step found")


def test_a_dry_run_step_precedes_every_publish() -> None:
    names = [step.get("name", "") for step in _steps()]
    plan_index = names.index("Write the publish plan without touching the network")
    publish_index = names.index("Create or update the release and move the alias")
    assert plan_index < publish_index


def test_the_signing_secret_reaches_exactly_one_step() -> None:
    with_secret = [
        step.get("name")
        for step in _steps()
        if "TEND_MCP_SIGNING_KEY_B64" in str(step.get("env", {}))
    ]
    assert with_secret == ["Sign and verify both envelopes"]


def test_the_pinned_key_id_agrees_with_the_tools() -> None:
    from tools import mcp_release

    assert f"EXPECTED_KEY_ID: {mcp_release.EXPECTED_KEY_ID}" in WORKFLOW.read_text(encoding="utf-8")


def test_the_documented_dispatch_body_matches_the_workflow_file_name() -> None:
    doc = (WORKFLOW.parent.parent.parent / "docs/mcp-runtime.md").read_text(encoding="utf-8")
    assert "actions/workflows/mcp-runtime.yml/dispatches" in doc
    assert mcp_window.ALIAS_TAG in doc
    assert WORKFLOW.name == "mcp-runtime.yml"
