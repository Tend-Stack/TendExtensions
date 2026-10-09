from __future__ import annotations

import os
from pathlib import Path

import pytest
from conftest import REVISION_A

from tools import build, validate_with_panel

REPO_ROOT = Path(__file__).resolve().parent.parent


def _core_checkout() -> Path | None:
    raw = os.environ.get("TEND_CORE_CHECKOUT")
    return Path(raw) if raw else None


def test_validate_every_built_extension_against_the_reference_core(tmp_path: Path) -> None:
    """Builds the repository's real extensions/ tree and runs every
    resulting ZIP through the actual core's own cmd/tend-validate-extension
    — the same parse-manifest, archive-member, integrity and install-time
    safety-scan checks the panel's install path runs.

    Skipped when TEND_CORE_CHECKOUT isn't set, or when the checkout has no
    cmd/tend-validate-extension (a pre-Go pin) or no `go` toolchain on
    PATH. CI always sets both, against the pinned core commit.
    """
    core_checkout = _core_checkout()
    if core_checkout is None:
        pytest.skip("TEND_CORE_CHECKOUT not set")
    if not core_checkout.is_dir():
        pytest.fail(f"TEND_CORE_CHECKOUT={core_checkout} does not exist")

    try:
        validate_with_panel._require_go_core(core_checkout)
    except validate_with_panel.ValidationError as exc:
        pytest.skip(f"core checkout not usable: {exc}")

    # Build into a throwaway dist/ so this test never mutates the real
    # repository's extensions/ (build.py rewrites integrity maps in
    # place) — copy the real extensions/ tree read-only-adjacent instead.
    import shutil

    extensions_src = REPO_ROOT / "extensions"
    extensions_dst = tmp_path / "extensions"
    shutil.copytree(extensions_src, extensions_dst)

    registry = build.run(tmp_path, sequence=1, revision=REVISION_A)
    assert registry["extensions"], "expected at least one seeded extension"

    dist_dir = tmp_path / "dist"
    zips = sorted(dist_dir.glob("*.zip"))
    results = validate_with_panel.run_validator(core_checkout, zips)

    failures = [f"{r['file']}: {r.get('reason')}" for r in results if not r.get("ok")]
    assert not failures, "\n".join(failures)
    assert len(results) == len(registry["extensions"])


def test_find_stack_recipes_lists_only_stack_kind(tmp_path: Path) -> None:
    import json

    for slug, recipe in (("a-stack", {"kind": "stack", "suggested_name": "alpha"}), ("an-app", {"source": "image"})):
        folder = tmp_path / "recipes" / slug
        folder.mkdir(parents=True)
        (folder / "recipe.json").write_text(json.dumps(recipe))
    (tmp_path / "recipes" / "broken").mkdir()
    found = validate_with_panel.find_stack_recipes(tmp_path)
    assert found == [("alpha", tmp_path / "recipes" / "a-stack" / "compose.yaml")]
    assert validate_with_panel.find_stack_recipes(tmp_path / "nowhere") == []


def test_report_stacks_fails_on_refusals_and_missing_variables(capsys) -> None:
    ok = {"ok": True, "refused": [], "missing": [], "services": ["a"]}
    bad = {"ok": False, "refused": [{"path": "services.a.privileged", "message": "refused"}], "missing": [{"path": "X", "message": "no value"}]}
    assert validate_with_panel.report_stacks([(Path("recipes/a/compose.yaml"), ok)]) == 0
    assert validate_with_panel.report_stacks([(Path("recipes/b/compose.yaml"), bad)]) == 1
    out = capsys.readouterr().out
    assert "OK    a/compose.yaml" in out and "FAIL  b/compose.yaml" in out and "services.a.privileged" in out and "no value" in out


def test_every_stack_recipe_loads_in_the_reference_core() -> None:
    """Runs each stack recipe's compose.yaml through the core's own cmd/tend-validate-compose (the panel's compose
    engine). Skipped without TEND_CORE_CHECKOUT, or when the checkout predates the command."""
    core_checkout = _core_checkout()
    if core_checkout is None:
        pytest.skip("TEND_CORE_CHECKOUT not set")
    if not (core_checkout / "cmd" / "tend-validate-compose").is_dir():
        pytest.skip("core checkout has no cmd/tend-validate-compose")
    try:
        validate_with_panel._require_go_core(core_checkout)
    except validate_with_panel.ValidationError as exc:
        pytest.skip(f"core checkout not usable: {exc}")
    stacks = validate_with_panel.find_stack_recipes(REPO_ROOT)
    assert stacks, "expected the Media Recipe"
    failures = []
    for name, compose_file in stacks:
        result = validate_with_panel.run_compose_validator(core_checkout, name, compose_file)
        if not result.get("ok"):
            failures.append(f"{compose_file}: {result.get('refused')} {result.get('missing')}")
    assert not failures, "\n".join(failures)
