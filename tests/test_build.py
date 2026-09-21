from __future__ import annotations

import hashlib
import json
from pathlib import Path

import pytest
from conftest import REVISION_A, REVISION_B, write_fixture_extension

from tools import build


def _zip_hashes(dist_dir: Path) -> dict[str, str]:
    return {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(dist_dir.glob("*.zip"))}


def test_build_produces_deterministic_zip_bytes(fixture_repo: Path) -> None:
    build.run(fixture_repo, sequence=1, revision=REVISION_A)
    first = _zip_hashes(fixture_repo / "dist")
    assert first  # at least one zip was built

    build.run(fixture_repo, sequence=1, revision=REVISION_A)
    second = _zip_hashes(fixture_repo / "dist")

    assert first == second


def test_second_build_is_stable_even_after_a_manifest_rewrite(fixture_repo: Path) -> None:
    # The first run rewrites extension.json's integrity map in place (it
    # ships with a deliberately wrong placeholder in the fixture). A
    # second run against the now-rewritten file must still produce the
    # same bytes.
    build.run(fixture_repo, sequence=1, revision=REVISION_A)
    manifest_after_first = (fixture_repo / "extensions" / "host.tend.fixture" / "extension.json").read_text()

    build.run(fixture_repo, sequence=1, revision=REVISION_A)
    manifest_after_second = (fixture_repo / "extensions" / "host.tend.fixture" / "extension.json").read_text()

    assert manifest_after_first == manifest_after_second


def test_integrity_map_covers_every_shipped_file_and_only_those(fixture_repo: Path) -> None:
    build.run(fixture_repo, sequence=1, revision=REVISION_A)
    ext_dir = fixture_repo / "extensions" / "host.tend.fixture"
    manifest = json.loads((ext_dir / "extension.json").read_text())
    integrity = manifest["integrity"]

    assert set(integrity) == {"README.md", "icon.svg", "index.js"}
    for rel, expected in integrity.items():
        actual = build.sha256_b64(ext_dir / rel)
        assert actual == expected, rel
    # extension.json and listing.json are never covered.
    assert "extension.json" not in integrity
    assert "listing.json" not in integrity


def test_check_full_coverage_detects_missing_and_stale_entries(fixture_repo: Path) -> None:
    ext_dir = fixture_repo / "extensions" / "host.tend.fixture"

    missing = build.rebuild_integrity(ext_dir)
    del missing["index.js"]
    with pytest.raises(build.BuildError, match="not covered"):
        build.check_full_coverage(ext_dir, missing)

    stale = build.rebuild_integrity(ext_dir)
    stale["nonexistent.js"] = "sha256-AAAA="
    with pytest.raises(build.BuildError, match="missing file"):
        build.check_full_coverage(ext_dir, stale)

    exact = build.rebuild_integrity(ext_dir)
    build.check_full_coverage(ext_dir, exact)  # no raise


def test_rejects_dotfiles(fixture_repo: Path) -> None:
    ext_dir = fixture_repo / "extensions" / "host.tend.fixture"
    (ext_dir / ".DS_Store").write_bytes(b"junk")
    with pytest.raises(build.BuildError, match="dotfile"):
        build.run(fixture_repo, sequence=1, revision=REVISION_A)


def test_registry_json_shape_and_sorting(tmp_path: Path) -> None:
    extensions_dir = tmp_path / "extensions"
    write_fixture_extension(extensions_dir, "host.tend.zzz", version="2.0.0")
    write_fixture_extension(extensions_dir, "host.tend.aaa", version="1.0.0")

    registry = build.run(tmp_path, sequence=7, revision=REVISION_B)

    assert registry["schema"] == 1
    assert registry["registry_id"] == "tend-extensions"
    assert registry["sequence"] == 7
    assert registry["revision"] == REVISION_B
    assert isinstance(registry["generated_at"], int)

    ids = [e["id"] for e in registry["extensions"]]
    assert ids == sorted(ids)
    assert ids == ["host.tend.aaa", "host.tend.zzz"]
    assert len(set(ids)) == len(ids)

    for entry in registry["extensions"]:
        assert entry["path"] == f"extensions/{entry['id']}"
        assert entry["homepage"] == (
            f"https://github.com/Tend-Stack/TendExtensions/tree/{REVISION_B}/extensions/{entry['id']}"
        )
        package = entry["package"]
        zip_path = tmp_path / "dist" / package["name"]
        data = zip_path.read_bytes()
        assert package["bytes"] == len(data)
        assert package["sha256"] == hashlib.sha256(data).hexdigest()

    on_disk = json.loads((tmp_path / "dist" / "registry.json").read_text())
    assert on_disk == registry


def test_manifest_id_must_match_folder_name(fixture_repo: Path) -> None:
    ext_dir = fixture_repo / "extensions" / "host.tend.fixture"
    manifest = json.loads((ext_dir / "extension.json").read_text())
    manifest["id"] = "host.tend.somethingelse"
    (ext_dir / "extension.json").write_text(json.dumps(manifest), encoding="utf-8")

    with pytest.raises(build.BuildError, match="does not match its folder name"):
        build.run(fixture_repo, sequence=1, revision=REVISION_A)


def test_unknown_permission_is_rejected(fixture_repo: Path) -> None:
    ext_dir = fixture_repo / "extensions" / "host.tend.fixture"
    manifest = json.loads((ext_dir / "extension.json").read_text())
    manifest["permissions"] = ["storage", "not-a-real-permission"]
    (ext_dir / "extension.json").write_text(json.dumps(manifest), encoding="utf-8")

    with pytest.raises(build.BuildError, match="unknown permission"):
        build.run(fixture_repo, sequence=1, revision=REVISION_A)


def test_listing_requires_three_to_six_features(fixture_repo: Path) -> None:
    ext_dir = fixture_repo / "extensions" / "host.tend.fixture"
    listing = json.loads((ext_dir / "listing.json").read_text())
    listing["features"] = ["only one"]
    (ext_dir / "listing.json").write_text(json.dumps(listing), encoding="utf-8")

    with pytest.raises(build.BuildError, match="3-6 entries"):
        build.run(fixture_repo, sequence=1, revision=REVISION_A)
