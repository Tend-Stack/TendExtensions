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
    resulting ZIP through the actual panel core's parse_manifest,
    _validated_archive_members, and extension_waf (integrity + WAF scan).

    Skipped when TEND_CORE_CHECKOUT isn't set, or when the checkout's own
    dependencies (aiosqlite, httpx, Pillow — none of which this repo's
    own tooling needs) aren't importable in the current environment. CI
    always sets both, against the pinned core commit.
    """
    core_checkout = _core_checkout()
    if core_checkout is None:
        pytest.skip("TEND_CORE_CHECKOUT not set")
    if not core_checkout.is_dir():
        pytest.fail(f"TEND_CORE_CHECKOUT={core_checkout} does not exist")

    try:
        extensions_module = validate_with_panel._import_panel_extensions(core_checkout)
    except validate_with_panel.ValidationError as exc:
        pytest.skip(f"panel core dependencies not importable: {exc}")

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
    failures = []
    for zip_path in sorted(dist_dir.glob("*.zip")):
        try:
            validate_with_panel.validate_zip(zip_path, extensions_module)
        except validate_with_panel.ValidationError as exc:
            failures.append(str(exc))

    assert not failures, "\n".join(failures)
    assert len(list(dist_dir.glob("*.zip"))) == len(registry["extensions"])
