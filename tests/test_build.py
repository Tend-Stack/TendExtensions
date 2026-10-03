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
    assert manifest["permissions"] == ["storage", "notifications"]
    build.check_full_coverage(dst, manifest["integrity"])  # every shipped file hashed, nothing stale

    core_checkout = os.environ.get("TEND_CORE_CHECKOUT")
    if not core_checkout:
        pytest.skip("TEND_CORE_CHECKOUT not set; skipping real-core validation")
    try:
        validate_with_panel._require_go_core(Path(core_checkout))
    except validate_with_panel.ValidationError as exc:
        pytest.skip(f"core checkout not usable: {exc}")
    zip_path = tmp_path / "dist" / registry["extensions"][0]["package"]["name"]
    results = validate_with_panel.run_validator(Path(core_checkout), [zip_path])
    assert len(results) == 1
    assert results[0]["ok"] is True, results[0]
    assert results[0]["id"] == "host.tend.calendar"


# ---------- validate_with_panel: JSON parsing and reporting ----------


class _FakeCompletedProcess:
    def __init__(self, returncode: int, stdout: str, stderr: str = "") -> None:
        self.returncode = returncode
        self.stdout = stdout
        self.stderr = stderr


def test_run_validator_parses_json_and_report_prints_ok_fail_lines(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    """No Go toolchain and no core checkout needed: subprocess.run is
    stubbed with a fixed cmd/tend-validate-extension --json payload, so this
    proves run_validator's parsing and report()'s OK/FAIL formatting on
    every run, not just when TEND_CORE_CHECKOUT happens to be set."""
    fake_stdout = json.dumps(
        [
            {"file": "/x/host.tend.a-1.0.0.zip", "ok": True, "id": "host.tend.a", "version": "1.0.0", "schema": 2, "warnings": 1},
            {"file": "/x/host.tend.b-1.0.0.zip", "ok": False, "reason": "extension.json is not valid UTF-8 JSON: ..."},
        ]
    )

    def fake_run(cmd, *, cwd, capture_output, text):  # noqa: ANN001 - matches subprocess.run's call shape
        assert cmd[:4] == ["go", "run", "./cmd/tend-validate-extension", "--json"]
        assert cwd == tmp_path
        assert capture_output is True
        assert text is True
        return _FakeCompletedProcess(returncode=1, stdout=fake_stdout)

    monkeypatch.setattr(validate_with_panel.subprocess, "run", fake_run)

    zips = [Path("/x/host.tend.a-1.0.0.zip"), Path("/x/host.tend.b-1.0.0.zip")]
    results = validate_with_panel.run_validator(tmp_path, zips)
    assert [r["file"] for r in results] == [str(p) for p in zips]
    assert results[0]["id"] == "host.tend.a"
    assert results[1]["reason"].startswith("extension.json")

    exit_code = validate_with_panel.report(results)
    out = capsys.readouterr().out
    assert exit_code == 1
    assert "OK    host.tend.a-1.0.0.zip  (host.tend.a)" in out
    assert "FAIL  host.tend.b-1.0.0.zip: extension.json is not valid UTF-8 JSON: ..." in out
    assert "1/2 package(s) passed panel validation" in out


def test_run_validator_rejects_a_usage_or_build_failure(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """An exit status outside {0, 1} means cmd/tend-validate-extension never
    produced a per-package report at all (bad flags, a compile error in the
    checkout) — that is a ValidationError, not a wrongly-parsed empty
    result list."""

    def fake_run(cmd, *, cwd, capture_output, text):  # noqa: ANN001 - matches subprocess.run's call shape
        return _FakeCompletedProcess(returncode=2, stdout="", stderr="usage: tend-validate-extension ...")

    monkeypatch.setattr(validate_with_panel.subprocess, "run", fake_run)

    with pytest.raises(validate_with_panel.ValidationError, match="exited 2"):
        validate_with_panel.run_validator(tmp_path, [Path("/x/a.zip")])


def test_require_go_core_refuses_a_pre_go_checkout(tmp_path: Path) -> None:
    (tmp_path / "go.mod").write_text("module tend.host\n", encoding="utf-8")
    # No cmd/tend-validate-extension directory — the pre-Go-cutover shape.
    with pytest.raises(validate_with_panel.ValidationError, match="pre-Go pin"):
        validate_with_panel._require_go_core(tmp_path)


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


# ---------- theme packs (category "themes") ----------

THEME_PACK_IDS = [
    "host.tend.theme.nebula",
    "host.tend.theme.synthwave",
    "host.tend.theme.inkwell",
    "host.tend.theme.prism",
    "host.tend.theme.skyline",
]


def _copy_theme_pack(tmp_path: Path, pack_id: str = "host.tend.theme.nebula") -> Path:
    dst = tmp_path / "extensions" / pack_id
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(REPO_ROOT / "extensions" / pack_id, dst)
    return dst


def _edit_theme(ext_dir: Path, mutate) -> None:  # noqa: ANN001 - callback over the parsed manifest
    manifest = json.loads((ext_dir / "extension.json").read_text())
    mutate(manifest)
    (ext_dir / "extension.json").write_text(json.dumps(manifest), encoding="utf-8")


@pytest.mark.parametrize("pack_id", THEME_PACK_IDS)
def test_first_party_theme_packs_build(tmp_path: Path, pack_id: str) -> None:
    ext_dir = _copy_theme_pack(tmp_path, pack_id)

    registry = build.run(tmp_path, sequence=1, revision=REVISION_A)

    entry = registry["extensions"][0]
    assert entry["id"] == pack_id
    assert entry["category"] == "themes"
    assert entry["permissions"] == []
    manifest = json.loads((ext_dir / "extension.json").read_text())
    # Images are hashed too, and every shipped file is covered.
    assert {"wallpaper.webp", "thumb.webp"} <= set(manifest["integrity"])
    build.check_full_coverage(ext_dir, manifest["integrity"])
    wallpaper = (ext_dir / "wallpaper.webp").stat().st_size
    thumb = (ext_dir / "thumb.webp").stat().st_size
    assert wallpaper <= 4 * 1024 * 1024 and thumb <= 512 * 1024


def test_committed_theme_pack_manifests_are_already_rebuilt() -> None:
    """The integrity map committed in each real pack matches the files on
    disk, so CI's rebuild leaves the tree clean."""
    for pack_id in THEME_PACK_IDS:
        ext_dir = REPO_ROOT / "extensions" / pack_id
        manifest = json.loads((ext_dir / "extension.json").read_text())
        assert manifest["integrity"] == build.rebuild_integrity(ext_dir), pack_id


def test_theme_pack_zip_is_deterministic_and_has_no_listing(tmp_path: Path) -> None:
    _copy_theme_pack(tmp_path)
    build.run(tmp_path, sequence=1, revision=REVISION_A)
    first = _zip_hashes(tmp_path / "dist")
    build.run(tmp_path, sequence=1, revision=REVISION_A)
    assert first == _zip_hashes(tmp_path / "dist")
    import zipfile

    with zipfile.ZipFile(tmp_path / "dist" / "host.tend.theme.nebula-1.0.0.zip") as zf:
        assert zf.namelist() == ["README.md", "extension.json", "thumb.webp", "wallpaper.webp"]


def test_theme_pack_template_builds_when_copied_into_extensions(tmp_path: Path) -> None:
    dst = tmp_path / "extensions" / "com.example.my-theme"
    dst.parent.mkdir(parents=True)
    shutil.copytree(REPO_ROOT / "templates" / "theme-pack", dst)

    registry = build.run(tmp_path, sequence=1, revision=REVISION_A)

    assert [e["id"] for e in registry["extensions"]] == ["com.example.my-theme"]
    assert registry["extensions"][0]["category"] == "themes"


def test_templates_folder_is_never_built_as_a_package() -> None:
    assert build.discover_extension_ids(REPO_ROOT / "extensions") == sorted(
        p.name for p in (REPO_ROOT / "extensions").iterdir() if p.is_dir()
    )
    assert "theme-pack" not in build.discover_extension_ids(REPO_ROOT / "extensions")


@pytest.mark.parametrize(
    "bad",
    [
        "red",
        "rgb(0,0,0)",
        "rgb(0 0 0)",
        "hsl(120 50% 50%)",
        "var(--x)",
        "url(x)",
        "calc(1 + 1)",
        "oklch(50% 0.1 120); background:url(x)",
        "oklch(50% 0.1 120) /* c */",
        "oklch(5e1% 0.1 120)",
        "oklch(50% 1e-1 120)",
        "oklch(50% 0.1 1.2e2)",
        "oklch(50 0.1 120)",
        "oklch(101% 0.1 120)",
        "oklch(50% 0.41 120)",
        "oklch(50% 0.1 361)",
        "oklch(50% 0.1 120 / 1.5)",
        "oklch(-5% 0.1 120)",
        "oklch(50% 0.1 120 / 0.5 0.5)",
        "#12",
        "#12345",
        "#gggggg",
        "#1234567",
        "#fff; x",
        "oklch(50% 0.1 120)\\",
        "'oklch(50% 0.1 120)'",
        "oklch(" + "5" * 70 + "% 0.1 120)",
        "",
        12,
    ],
)
def test_theme_colour_grammar_refuses_injection_and_garbage(tmp_path: Path, bad: object) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    _edit_theme(ext_dir, lambda m: m["theme"]["shell"].update({"topBar": {"tint": {"dark": bad, "light": "oklch(97% 0.01 300)"}}}))
    with pytest.raises(build.BuildError, match="theme"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


@pytest.mark.parametrize(
    "good",
    [
        "oklch(50% 0.1 120)",
        "OKLCH(50.5% 0.1234 120.25 / 0.5)",
        "  oklch(0% 0 0)  ",
        "oklch(100% 0.4 360 / 1)",
        "#abc",
        "#A1B2C3",
        "#a1b2c3d4",
    ],
)
def test_theme_colour_grammar_accepts_valid_colours(tmp_path: Path, good: str) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    _edit_theme(ext_dir, lambda m: m["theme"]["shell"].update({"topBar": {"tint": {"dark": good, "light": "oklch(97% 0.01 300)"}}}))
    build.run(tmp_path, sequence=1, revision=REVISION_A)


@pytest.mark.parametrize(
    "path,value",
    [
        (("surface", "hue"), 361),
        (("surface", "hue"), -1),
        (("surface", "chroma"), 0.06),
        (("icons", "hueRotate"), 181),
        (("icons", "saturate"), 2.1),
        (("icons", "brightness"), 0.4),
        (("icons", "brightness"), 1.6),
        (("shell", "topBar"), {"opacity": 0.3}),
        (("shell", "topBar"), {"opacity": 1.1}),
        (("shell", "glass"), {"blur": 41}),
        (("shell", "glass"), {"saturate": 0.9}),
        (("shell", "shadow"), 1.5),
        (("shell", "wallpaperDim"), 0.9),
        (("shell", "shape"), "pill"),
        (("shell", "desktopLabels"), "grey"),
        (("shell", "shadow"), "0.5"),
        (("shell", "shadow"), True),
        (("wallpaper", "position"), "middle"),
        (("wallpaper", "veil"), {"dark": {"color": "oklch(10% 0.03 290)", "top": 1.2, "middle": 0, "bottom": 0}}),
        (("wallpaper", "veil"), {"dark": {"color": "oklch(10% 0.03 290)", "top": 0.5}}),
        (("modes",), []),
        (("modes",), ["dark", "dark"]),
        (("modes",), ["dusk"]),
        (("api",), 2),
        (("api",), True),
    ],
)
def test_theme_numeric_and_enum_rules(tmp_path: Path, path: tuple[str, ...], value: object) -> None:
    ext_dir = _copy_theme_pack(tmp_path)

    def mutate(manifest: dict) -> None:
        node = manifest["theme"]
        for key in path[:-1]:
            node = node[key]
        node[path[-1]] = value

    _edit_theme(ext_dir, mutate)
    with pytest.raises(build.BuildError, match="theme"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


@pytest.mark.parametrize(
    "where",
    ["theme", "wallpaper", "palette.dark", "surface", "icons", "shell", "shell.glass", "wallpaper.veil.dark"],
)
def test_theme_unknown_keys_are_refused(tmp_path: Path, where: str) -> None:
    ext_dir = _copy_theme_pack(tmp_path)

    def mutate(manifest: dict) -> None:
        node = manifest["theme"]
        node["shell"].setdefault("glass", {"blur": 20})
        if where != "theme":
            for key in where.split("."):
                node = node[key]
        node["extra"] = 1

    _edit_theme(ext_dir, mutate)
    with pytest.raises(build.BuildError, match="unknown key"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


@pytest.mark.parametrize(
    "image",
    ["../wallpaper.webp", "/wallpaper.webp", "a//b.webp", "./wallpaper.webp", "c:wallpaper.webp",
     "dir\\wallpaper.webp", "wallpaper.gif", "missing.webp", "x" * 130 + ".webp", ""],
)
def test_theme_image_paths_must_be_safe_and_covered(tmp_path: Path, image: str) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    _edit_theme(ext_dir, lambda m: m["theme"]["wallpaper"].update({"image": image}))
    with pytest.raises(build.BuildError, match="wallpaper.image"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_theme_wallpaper_needs_exactly_one_of_image_or_gradient(tmp_path: Path) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    _edit_theme(
        ext_dir,
        lambda m: m["theme"]["wallpaper"].update(
            {"gradient": {"dark": {"base": "#000"}, "light": {"base": "#fff"}}}
        ),
    )
    with pytest.raises(build.BuildError, match="exactly one"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)

    def neither(m: dict) -> None:
        for key in ("image", "thumb", "gradient"):
            m["theme"]["wallpaper"].pop(key, None)

    _edit_theme(ext_dir, neither)
    with pytest.raises(build.BuildError, match="exactly one"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def _copy_template(tmp_path: Path) -> Path:
    dst = tmp_path / "extensions" / "com.example.my-theme"
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(REPO_ROOT / "templates" / "theme-pack", dst)
    return dst


def _write_image(path: Path, size: tuple[int, int], fmt: str | None = None) -> None:
    from PIL import Image

    Image.new("RGB", size, (30, 40, 90)).save(path, format=fmt)


def test_theme_thumb_is_required_for_photo_and_gradient_packs(tmp_path: Path) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    _edit_theme(ext_dir, lambda m: m["theme"]["wallpaper"].pop("thumb"))
    with pytest.raises(build.BuildError, match="wallpaper.thumb: is required"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)

    template = tmp_path / "t"
    dst = _copy_template(template)
    _edit_theme(dst, lambda m: m["theme"]["wallpaper"].pop("thumb"))
    with pytest.raises(build.BuildError, match="wallpaper.thumb: is required"):
        build.run(template, sequence=1, revision=REVISION_A)


def test_theme_gradient_pack_with_thumb_builds(tmp_path: Path) -> None:
    dst = _copy_template(tmp_path)
    assert "gradient" in json.loads((dst / "extension.json").read_text())["theme"]["wallpaper"]
    build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_theme_gradient_glow_limits(tmp_path: Path) -> None:
    dst = tmp_path / "extensions" / "com.example.my-theme"
    dst.parent.mkdir(parents=True)
    shutil.copytree(REPO_ROOT / "templates" / "theme-pack", dst)
    glow = {"x": 10, "y": 10, "w": 50, "h": 50, "color": "#123456", "alpha": 0.5}

    def set_glows(glows: list) -> None:
        _edit_theme(dst, lambda m: m["theme"]["wallpaper"]["gradient"]["dark"].update({"glows": glows}))

    set_glows([glow] * 4)
    build.run(tmp_path, sequence=1, revision=REVISION_A)
    set_glows([glow] * 5)
    with pytest.raises(build.BuildError, match="at most 4"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)
    for bad in ({"x": 101}, {"y": -1}, {"w": 9}, {"h": 151}, {"alpha": 1.1}, {"color": "red"}):
        set_glows([{**glow, **bad}])
        with pytest.raises(build.BuildError, match="theme"):
            build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_theme_contrast_failure_is_refused(tmp_path: Path) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    # Same lightness for button and button text: ratio 1:1.
    _edit_theme(
        ext_dir,
        lambda m: m["theme"]["palette"]["light"].update({"primaryContent": m["theme"]["palette"]["light"]["primary"]}),
    )
    with pytest.raises(build.BuildError, match="contrast"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_theme_contrast_boundary_uses_wcag_ratio() -> None:
    black = build.parse_theme_color("#000", ext_id="x", where="x")
    white = build.parse_theme_color("#fff", ext_id="x", where="x")
    assert build.contrast_ratio(black, white) == pytest.approx(21.0)
    assert build.contrast_ratio(white, white) == pytest.approx(1.0)


def test_theme_pack_refuses_code_and_markup_files(tmp_path: Path) -> None:
    for name in ("index.js", "mod.mjs", "page.html", "page.htm", "style.css", "icon.svg", "m.wasm", "UPPER.JS"):
        shutil.rmtree(tmp_path / "extensions", ignore_errors=True)
        ext_dir = _copy_theme_pack(tmp_path)
        (ext_dir / name).write_bytes(b"x")
        with pytest.raises(build.BuildError, match="must not ship"):
            build.run(tmp_path, sequence=1, revision=REVISION_A)


@pytest.mark.parametrize("key,value", [("ui", {"module": "i.js"}), ("runtime", {"api": 1}), ("widgets", [])])
def test_theme_pack_refuses_ui_runtime_widgets(tmp_path: Path, key: str, value: object) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    _edit_theme(ext_dir, lambda m: m.update({key: value}))
    with pytest.raises(build.BuildError, match=f"must not declare '{key}'"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_theme_pack_refuses_permissions_and_wrong_category(tmp_path: Path) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    _edit_theme(ext_dir, lambda m: m.update({"permissions": ["storage"]}))
    with pytest.raises(build.BuildError, match="no permissions"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)

    _edit_theme(ext_dir, lambda m: m.update({"permissions": [], "category": "games"}))
    with pytest.raises(build.BuildError, match="requires category 'themes'"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)

    _edit_theme(ext_dir, lambda m: (m.update({"category": "themes"}), m.pop("theme")))
    with pytest.raises(build.BuildError, match="requires a 'theme' object"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_theme_images_must_match_their_extension_and_size(tmp_path: Path) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    original = (ext_dir / "wallpaper.webp").read_bytes()

    (ext_dir / "wallpaper.webp").write_bytes(b"\x89PNG\r\n\x1a\n" + b"0" * 64)
    with pytest.raises(build.BuildError, match="not a valid .webp"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)

    (ext_dir / "wallpaper.webp").write_bytes(original + b"0" * (4 * 1024 * 1024))
    with pytest.raises(build.BuildError, match="over the"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)

    (ext_dir / "wallpaper.webp").write_bytes(original)
    (ext_dir / "thumb.webp").write_bytes(b"RIFF\x00\x00\x00\x00WEBP" + b"0" * (512 * 1024))
    with pytest.raises(build.BuildError, match="over the"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_theme_image_magic_bytes_for_other_formats() -> None:
    check = build._image_matches_extension
    assert check(b"\xff\xd8\xff\xe0" + b"0" * 28, ".jpg")
    assert check(b"\xff\xd8\xff\xe0" + b"0" * 28, ".jpeg")
    assert check(b"\x89PNG\r\n\x1a\n" + b"0" * 24, ".png")
    assert not check(b"\x00\x00\x00\x1cftypavif" + b"0" * 20, ".avif")
    assert not check(b"\xff\xd8\xff\xe0" + b"0" * 28, ".png")
    assert not check(b"GIF89a" + b"0" * 26, ".webp")


# Contract Addendum B: the group field rules Go, the frontend and this mirror share.
@pytest.mark.parametrize(
    "path,value",
    [
        (("surface",), {"hue": 290}),
        (("surface",), {"chroma": 0.03}),
        (("shell", "topBar"), {}),
        (("shell", "topBar"), {"tint": {"dark": "oklch(20% 0.03 290)"}}),
        (("shell", "glass"), {"blur": 20}),
        (("shell", "glass"), {"saturate": 1.4}),
        (("wallpaper", "fallback"), {"dark": "oklch(12% 0.03 290)"}),
    ],
)
def test_theme_group_rules_refuse_incomplete_groups(tmp_path: Path, path: tuple[str, ...], value: object) -> None:
    ext_dir = _copy_theme_pack(tmp_path)

    def mutate(manifest: dict) -> None:
        node = manifest["theme"]
        for key in path[:-1]:
            node = node.setdefault(key, {})
        node[path[-1]] = value

    _edit_theme(ext_dir, mutate)
    with pytest.raises(build.BuildError, match="theme"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


@pytest.mark.parametrize(
    "top_bar",
    [
        {"opacity": 0.6},
        {"tint": {"dark": "oklch(20% 0.03 290)", "light": "oklch(97% 0.01 300)"}},
        {"opacity": 0.8, "tint": {"dark": "#101020", "light": "#f4f2fa"}},
    ],
)
def test_theme_top_bar_fields_are_individually_optional(tmp_path: Path, top_bar: dict) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    _edit_theme(ext_dir, lambda m: m["theme"]["shell"].update({"topBar": top_bar}))
    build.run(tmp_path, sequence=1, revision=REVISION_A)


# Contract Addendum C: mandatory thumbnail and image dimensions.
@pytest.mark.parametrize(
    "size,fmt,ok",
    [((480, 270), "WEBP", True), ((480, 262), "WEBP", True), ((480, 240), "PNG", True), ((480, 320), "JPEG", True),
     ((512, 300), "WEBP", False), ((480, 239), "PNG", False), ((480, 321), "PNG", False), ((479, 270), "PNG", False)],
)
def test_theme_thumb_dimensions(tmp_path: Path, size: tuple[int, int], fmt: str, ok: bool) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    ext = {"WEBP": "webp", "PNG": "png", "JPEG": "jpg"}[fmt]
    (ext_dir / "thumb.webp").unlink()
    _write_image(ext_dir / f"thumb.{ext}", size, fmt)
    _edit_theme(ext_dir, lambda m: m["theme"]["wallpaper"].update({"thumb": f"thumb.{ext}"}))
    if ok:
        build.run(tmp_path, sequence=1, revision=REVISION_A)
        return
    with pytest.raises(build.BuildError, match=rf"thumb\.{ext} is {size[0]}x{size[1]}; a theme pack thumbnail must be 480 px wide and 240-320 px tall"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


@pytest.mark.parametrize(
    "size,ok",
    [((1600, 900), True), ((4096, 2560), True), ((2000, 1091), True),
     ((1200, 900), False), ((1599, 900), False), ((1600, 899), False), ((4097, 2000), False),
     ((2000, 2561), False), ((1000, 2000), False), ((1600, 1600), False)],
)
def test_theme_wallpaper_dimensions(tmp_path: Path, size: tuple[int, int], ok: bool) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    _write_image(ext_dir / "wallpaper.webp", size, "WEBP")
    if ok:
        build.run(tmp_path, sequence=1, revision=REVISION_A)
        return
    with pytest.raises(build.BuildError, match=rf"wallpaper\.webp is {size[0]}x{size[1]}; a theme pack wallpaper must be"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_theme_avif_is_refused(tmp_path: Path) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    (ext_dir / "thumb.avif").write_bytes(b"\x00\x00\x00\x1cftypavif" + b"0" * 64)
    _edit_theme(ext_dir, lambda m: m["theme"]["wallpaper"].update({"thumb": "thumb.avif"}))
    with pytest.raises(build.BuildError, match=r"wallpaper\.thumb.*\.webp"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


@pytest.mark.parametrize("field,name", [("thumb", "thumb.webp"), ("image", "wallpaper.webp")])
def test_theme_corrupt_image_header_is_refused(tmp_path: Path, field: str, name: str) -> None:
    ext_dir = _copy_theme_pack(tmp_path)
    (ext_dir / name).write_bytes(b"RIFF\x00\x00\x00\x00WEBP" + b"0" * 64)
    with pytest.raises(build.BuildError, match="unreadable image header"):
        build.run(tmp_path, sequence=1, revision=REVISION_A)


def test_theme_pack_template_ships_a_valid_thumb() -> None:
    from PIL import Image

    with Image.open(REPO_ROOT / "templates" / "theme-pack" / "thumb.png") as img:
        assert img.size == (480, 270)
