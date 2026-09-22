from __future__ import annotations

import hashlib
import json
import os
import shutil
from pathlib import Path

import pytest
from conftest import REVISION_A, REVISION_B, write_fixture_extension

from tools import build, validate_with_panel

REPO_ROOT = Path(__file__).resolve().parent.parent


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


def test_calendar_extension_builds_and_validates(tmp_path: Path) -> None:
    """The real `host.tend.calendar` package (not a fixture) builds on
    its own with full integrity coverage and, when a panel core
    checkout is available, passes the same real-core validation
    (parse_manifest, archive members, integrity, WAF scan) as every
    other shipped extension."""
    src = REPO_ROOT / "extensions" / "host.tend.calendar"
    dst = tmp_path / "extensions" / "host.tend.calendar"
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(src, dst)

    registry = build.run(tmp_path, sequence=1, revision=REVISION_A)
    assert [e["id"] for e in registry["extensions"]] == ["host.tend.calendar"]

    manifest = json.loads((dst / "extension.json").read_text())
    assert manifest["schema"] == 2
    assert manifest["ui"]["mount"] == "tool-window"
    assert manifest["permissions"] == ["storage"]
    build.check_full_coverage(dst, manifest["integrity"])  # every shipped file hashed, nothing stale

    core_checkout = os.environ.get("TEND_CORE_CHECKOUT")
    if not core_checkout:
        pytest.skip("TEND_CORE_CHECKOUT not set; skipping real-core validation")
    try:
        extensions_module = validate_with_panel._import_panel_extensions(Path(core_checkout))
    except validate_with_panel.ValidationError as exc:
        pytest.skip(f"panel core dependencies not importable: {exc}")
    zip_path = tmp_path / "dist" / registry["extensions"][0]["package"]["name"]
    ext_id = validate_with_panel.validate_zip(zip_path, extensions_module)
    assert ext_id == "host.tend.calendar"


def test_listing_requires_three_to_six_features(fixture_repo: Path) -> None:
    ext_dir = fixture_repo / "extensions" / "host.tend.fixture"
    listing = json.loads((ext_dir / "listing.json").read_text())
    listing["features"] = ["only one"]
    (ext_dir / "listing.json").write_text(json.dumps(listing), encoding="utf-8")

    with pytest.raises(build.BuildError, match="3-6 entries"):
        build.run(fixture_repo, sequence=1, revision=REVISION_A)


# ---------- extension.json 'widgets' block (schema-2 shelf widgets) ----------

VALID_WIDGET = {
    "id": "upcoming",
    "name": "Upcoming",
    "description": "Next events.",
    "sizes": ["small", "wide"],
    "module": "widgets/upcoming.js",
    "preview": "widgets/upcoming-preview.svg",
}

_WIDGET_FILES = {
    "widgets/upcoming.js": b"export default function activate(host) { return { mount(){}, unmount(){} }; }\n",
    "widgets/upcoming-preview.svg": b"<svg xmlns='http://www.w3.org/2000/svg'></svg>\n",
}


def _valid_widget(**overrides: object) -> dict:
    widget = dict(VALID_WIDGET)
    widget.update(overrides)
    return widget


def _write_widget_extension(extensions_dir: Path, *, widgets: object, extra_files: dict | None = None) -> Path:
    files = dict(_WIDGET_FILES)
    if extra_files:
        files.update(extra_files)
    ext_dir = write_fixture_extension(extensions_dir, extra_files=files)
    manifest = json.loads((ext_dir / "extension.json").read_text())
    manifest["widgets"] = widgets
    (ext_dir / "extension.json").write_text(json.dumps(manifest), encoding="utf-8")
    return ext_dir


def test_widgets_block_valid_normalizes_and_builds(tmp_path: Path) -> None:
    extensions_dir = tmp_path / "extensions"
    _write_widget_extension(extensions_dir, widgets=[VALID_WIDGET])

    registry = build.run(tmp_path, sequence=1, revision=REVISION_A)

    manifest = json.loads((extensions_dir / "host.tend.fixture" / "extension.json").read_text())
    assert manifest["widgets"] == [VALID_WIDGET]
    assert registry["extensions"][0]["id"] == "host.tend.fixture"


def test_widgets_must_be_a_list(tmp_path: Path) -> None:
    extensions_dir = tmp_path / "extensions"
    _write_widget_extension(extensions_dir, widgets={"id": "upcoming"})

    with pytest.raises(build.BuildError, match="must be a list"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_widgets_entry_must_be_an_object(tmp_path: Path) -> None:
    extensions_dir = tmp_path / "extensions"
    _write_widget_extension(extensions_dir, widgets=["not-an-object"])

    with pytest.raises(build.BuildError, match="must be an object"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_widgets_max_eight_enforced(tmp_path: Path) -> None:
    extensions_dir = tmp_path / "extensions"
    widgets = [_valid_widget(id=f"w{i}") for i in range(9)]
    _write_widget_extension(extensions_dir, widgets=widgets)

    with pytest.raises(build.BuildError, match="at most 8"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_widgets_duplicate_id_rejected(tmp_path: Path) -> None:
    extensions_dir = tmp_path / "extensions"
    _write_widget_extension(extensions_dir, widgets=[VALID_WIDGET, dict(VALID_WIDGET)])

    with pytest.raises(build.BuildError, match="duplicate widget id"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_widget_module_must_be_covered_by_integrity(tmp_path: Path) -> None:
    extensions_dir = tmp_path / "extensions"
    _write_widget_extension(extensions_dir, widgets=[_valid_widget(module="widgets/missing.js")])

    with pytest.raises(build.BuildError, match="not covered by the integrity map"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_widget_preview_must_be_covered_by_integrity(tmp_path: Path) -> None:
    extensions_dir = tmp_path / "extensions"
    _write_widget_extension(extensions_dir, widgets=[_valid_widget(preview="widgets/missing.svg")])

    with pytest.raises(build.BuildError, match="not covered by the integrity map"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_widgets_require_schema_2(tmp_path: Path) -> None:
    extensions_dir = tmp_path / "extensions"
    ext_dir = _write_widget_extension(extensions_dir, widgets=[VALID_WIDGET])
    manifest = json.loads((ext_dir / "extension.json").read_text())
    manifest["schema"] = 1
    manifest["ui"] = None
    (ext_dir / "extension.json").write_text(json.dumps(manifest), encoding="utf-8")

    with pytest.raises(build.BuildError, match="requires schema 2"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


@pytest.mark.parametrize(
    "mutation,match",
    [
        ({"id": "Upcoming"}, "lowercase letters"),
        ({"id": "-bad"}, "lowercase letters"),
        ({"id": "way-too-long-" + "x" * 40}, "lowercase letters"),
        ({"name": ""}, "non-empty string"),
        ({"name": "x" * 61}, "non-empty string"),
        ({"description": "x" * 161}, "field 'description'"),
        ({"sizes": []}, "field 'sizes'"),
        ({"sizes": ["small", "small"]}, "field 'sizes'"),
        ({"sizes": ["huge"]}, "field 'sizes'"),
        ({"module": "../escape.js"}, "field 'module'"),
        ({"module": "widgets/upcoming.txt"}, "field 'module'"),
        ({"module": "/abs/path.js"}, "field 'module'"),
        ({"preview": "widgets/upcoming.txt"}, "field 'preview'"),
        ({"bogus": True}, "unknown field"),
    ],
)
def test_widget_entry_field_rejections(tmp_path: Path, mutation: dict, match: str) -> None:
    extensions_dir = tmp_path / "extensions"
    _write_widget_extension(extensions_dir, widgets=[_valid_widget(**mutation)])

    with pytest.raises(build.BuildError, match=match):
        build.run(tmp_path, sequence=1, revision=REVISION_A)
