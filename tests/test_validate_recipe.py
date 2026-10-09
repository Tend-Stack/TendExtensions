"""The public recipe validator: field rules mirrored from the panel's community-feed contract, the registry's own
review rules, folder layout, and the deterministic catalog a panel reads."""
from __future__ import annotations

import copy
import json
import shutil
from pathlib import Path

import pytest
from conftest import REPO_ROOT, REVISION_A

from tools import build, validate_recipe as vr

TEMPLATE = REPO_ROOT / "templates" / "recipe" / "example-notes"
BUILTIN = vr.load_builtin_slugs()


def good() -> dict:
    return json.loads((TEMPLATE / "recipe.json").read_text(encoding="utf-8"))


def problems(recipe: dict, **kwargs) -> list[str]:
    return vr.validate_recipe_data(recipe, builtin_slugs=BUILTIN, **kwargs)


def write_recipe(root: Path, slug: str = "example-notes", *, recipe: dict | None = None, listing: dict | None = None) -> Path:
    folder = root / slug
    folder.mkdir(parents=True)
    r = recipe if recipe is not None else good()
    r = {**r, "slug": slug}
    (folder / "recipe.json").write_text(json.dumps(r), encoding="utf-8")
    shutil.copy(TEMPLATE / "listing.json", folder / "listing.json")
    if listing is not None:
        (folder / "listing.json").write_text(json.dumps(listing), encoding="utf-8")
    return folder


def test_template_recipe_passes_and_matches_the_schema_file() -> None:
    assert vr.validate_recipe_dir(TEMPLATE, builtin_slugs=BUILTIN)["slug"] == "example-notes"
    assert problems(good(), folder="example-notes") == []
    schema = json.loads((REPO_ROOT / "recipes" / "recipe.schema.json").read_text(encoding="utf-8"))
    assert set(schema["properties"]) == set(vr.RECIPE_KEYS) == set(schema["required"])
    env = schema["properties"]["env_hints"]["items"]
    assert set(env["properties"]) == set(vr.ENV_HINT_KEYS)
    vol = schema["properties"]["volumes"]["items"]
    assert set(vol["properties"]) == set(vr.VOLUME_KEYS)
    assert list(schema["properties"]["category"]["enum"]) == list(vr.CATEGORIES)
    assert list(schema["properties"]["needs_dbs"]["items"]["enum"]) == list(vr.DB_KINDS)
    assert list(env["properties"]["kind"]["enum"]) == list(vr.ENV_KINDS)


def test_builtin_slug_list_is_sorted_unique_and_non_empty() -> None:
    lines = [l for l in (REPO_ROOT / "tools/data/builtin-slugs.txt").read_text().splitlines() if l and not l.startswith("#")]
    assert lines == sorted(set(lines)) and len(lines) >= 35 and "vaultwarden" in lines


@pytest.mark.parametrize(
    "mutate,fragment",
    [
        (lambda r: r.pop("slug"), "missing required key 'slug'"),
        (lambda r: r.update(slug="Bad Slug"), "slug must be"),
        (lambda r: r.update(slug="vaultwarden"), "built-in app"),
        (lambda r: r.update(name=""), "name must be"),
        (lambda r: r.update(name="x" * 61), "name must be"),
        (lambda r: r.update(tagline="two\nlines"), "tagline must be"),
        (lambda r: r.update(category="Games"), "category must be one of"),
        (lambda r: r.update(icon="notes"), "icon must be a single emoji"),
        (lambda r: r.update(icon="<svg>"), "icon must be a single emoji"),
        (lambda r: r.update(source="git"), 'source must be "image"'),
        (lambda r: r.update(source_ref="ghcr.io/example/notes"), "must pin a version"),
        (lambda r: r.update(source_ref="ghcr.io/example/notes:latest"), "moving tag"),
        (lambda r: r.update(source_ref="ghcr.io/example/notes:stable"), "moving tag"),
        (lambda r: r.update(source_ref="https://ghcr.io/example/notes:1.0.0"), "not a URL"),
        (lambda r: r.update(source_ref="Example Notes:1.0.0"), "image reference"),
        (lambda r: r.update(default_port=0), "default_port"),
        (lambda r: r.update(default_port=70000), "default_port"),
        (lambda r: r.update(default_port=True), "default_port"),
        (lambda r: r.update(default_port="8080"), "default_port"),
        (lambda r: r.update(suggested_name="Has Space"), "suggested_name"),
        (lambda r: r.update(docs_url="http://example.com/docs"), "docs_url must be an https URL"),
        (lambda r: r.update(docs_url="https://user:pw@example.com/docs"), "credentials"),
        (lambda r: r.update(notes=""), "notes must be"),
        (lambda r: r.update(tags=["a"] * 2), "tags must be"),
        (lambda r: r.update(tags=["Has Caps"]), "tags must be"),
        (lambda r: r.update(needs_dbs=["oracle"]), "needs_dbs must be"),
        (lambda r: r.update(needs_dbs=["redis", "redis"]), "needs_dbs must be"),
        (lambda r: r.update(needs_db="postgres"), "first-party only"),
        (lambda r: r.update(assurance={"status": "certified"}), "first-party only"),
        (lambda r: r.update(publisher={"name": "Tend"}), "first-party only"),
        (lambda r: r.update(runtime_security={}), "first-party only"),
        (lambda r: r.update(surprise=1), "unknown key 'surprise'"),
    ],
)
def test_recipe_field_rules(mutate, fragment: str) -> None:
    recipe = good()
    mutate(recipe)
    found = problems(recipe)
    assert any(fragment in p for p in found), found


@pytest.mark.parametrize(
    "ref",
    ["ghcr.io/example/notes:1.4.2", "example/notes:2", "notes:1.0", "docker.io/library/nginx:1.27.0-alpine",
     "registry.example.com:5000/team/app:v3.1", "ghcr.io/example/notes@sha256:" + "a" * 64,
     "ghcr.io/example/notes:1.4.2@sha256:" + "b" * 64],
)
def test_pinned_image_references_pass(ref: str) -> None:
    assert vr.check_image_reference(ref) is None


@pytest.mark.parametrize("ref", ["notes", "notes:latest", "notes:nightly", "notes:edge", "notes:abc", "a b:1.0", "", None, "x://y:1.0"])
def test_unpinned_or_malformed_references_fail(ref) -> None:
    assert vr.check_image_reference(ref)


@pytest.mark.parametrize("path", ["/", "data", "/data/", "/a/../b", "/proc/x", "/sys", "/dev/sda", "/var/run/docker.sock", "/run/docker.sock", "/x//y", "/etc/docker/daemon"])
def test_unsafe_mount_paths_fail(path: str) -> None:
    assert vr.check_mount_path(path)


@pytest.mark.parametrize("path", ["/data", "/var/lib/app", "/config"])
def test_ordinary_mount_paths_pass(path: str) -> None:
    assert vr.check_mount_path(path) is None


def test_env_hint_rules() -> None:
    r = good()
    r["env_hints"][0]["default"] = "changeme"
    assert any("must not ship a default" in p for p in problems(r))
    r = good()
    r["env_hints"][0]["required"] = False
    assert any("must be required" in p for p in problems(r))
    r = good()
    r["env_hints"].append({"key": "API_TOKEN", "kind": "text", "default": "abc123", "description": "x", "required": False})
    assert any("looks like a secret" in p for p in problems(r))
    r = good()
    r["env_hints"].append({"key": "TZ", "kind": "timezone", "default": "UTC", "description": "dup", "required": False})
    assert any("duplicate key" in p for p in problems(r))
    r = good()
    r["env_hints"][0]["kind"] = "secret"
    assert any("kind must be one of" in p for p in problems(r))
    r = good()
    r["env_hints"][0]["generate"] = True
    assert any("unknown key 'generate'" in p for p in problems(r))
    r = good()
    r["env_hints"][0]["key"] = "1BAD"
    assert any("environment variable name" in p for p in problems(r))
    r = good()
    r["env_hints"] = {"key": "x"}
    assert any("env_hints must be a list" in p for p in problems(r))


def test_volume_rules() -> None:
    r = good()
    r["volumes"].append(dict(r["volumes"][0]))
    found = problems(r)
    assert any("duplicate name_suffix" in p for p in found)
    r = good()
    r["volumes"][0]["mount_path"] = "/proc/self"
    assert any("must not be under /proc" in p for p in problems(r))
    r = good()
    r["volumes"][0]["extra"] = 1
    assert any("unknown key 'extra'" in p for p in problems(r))
    r = good()
    r["volumes"] = []  # a stateless app is fine
    assert problems(r) == []


def test_folder_must_match_slug() -> None:
    assert any("must equal the folder name" in p for p in problems(good(), folder="other"))


def test_listing_rules() -> None:
    base = json.loads((TEMPLATE / "listing.json").read_text())
    assert vr.validate_listing_data(base) == []
    bad = {**base, "recipe_license": "GPL-3.0"}
    assert any("recipe_license" in p for p in vr.validate_listing_data(bad))
    bad = {**base, "upstream_url": "http://x.example.com"}
    assert any("upstream_url" in p for p in vr.validate_listing_data(bad))
    bad = {**base, "verified": True}
    assert any("unknown key 'verified'" in p for p in vr.validate_listing_data(bad))
    bad = copy.deepcopy(base)
    del bad["tested_with"]
    assert any("missing required key 'tested_with'" in p for p in vr.validate_listing_data(bad))


def test_folder_layout_rules(tmp_path: Path) -> None:
    folder = write_recipe(tmp_path)
    assert vr.validate_recipe_dir(folder, builtin_slugs=BUILTIN)["slug"] == "example-notes"
    (folder / "icon.svg").write_text("<svg/>")
    with pytest.raises(vr.RecipeError, match="icon.svg: not allowed"):
        vr.validate_recipe_dir(folder, builtin_slugs=BUILTIN)
    (folder / "icon.svg").unlink()
    (folder / ".hidden").write_text("x")
    with pytest.raises(vr.RecipeError, match=r"\.hidden: not allowed"):
        vr.validate_recipe_dir(folder, builtin_slugs=BUILTIN)
    (folder / ".hidden").unlink()
    (folder / "listing.json").unlink()
    with pytest.raises(vr.RecipeError, match="listing.json: missing"):
        vr.validate_recipe_dir(folder, builtin_slugs=BUILTIN)


def test_json_hygiene(tmp_path: Path) -> None:
    folder = write_recipe(tmp_path)
    path = folder / "recipe.json"
    path.write_text('{"slug": "a", "slug": "b"}')
    with pytest.raises(vr.RecipeError, match="duplicate key"):
        vr.read_json_object(path)
    path.write_text('{"default_port": NaN}')
    with pytest.raises(vr.RecipeError, match="not valid JSON"):
        vr.read_json_object(path)
    path.write_text("[1]")
    with pytest.raises(vr.RecipeError, match="JSON object"):
        vr.read_json_object(path)
    path.write_bytes(b"\xff\xfe")
    with pytest.raises(vr.RecipeError, match="not valid JSON"):
        vr.read_json_object(path)
    path.write_text("{" + " " * (vr.MAX_FILE_BYTES + 1) + "}")
    with pytest.raises(vr.RecipeError, match="byte limit"):
        vr.read_json_object(path)
    path.unlink()
    path.symlink_to(folder / "listing.json")
    with pytest.raises(vr.RecipeError, match="regular file"):
        vr.read_json_object(path)


def test_load_recipes_reports_every_problem_and_sorts(tmp_path: Path) -> None:
    write_recipe(tmp_path, "zeta-notes")
    write_recipe(tmp_path, "alpha-notes")
    (tmp_path / "README.md").write_text("loose files are fine")
    assert [r["slug"] for r in vr.load_recipes(tmp_path, builtin_slugs=BUILTIN)] == ["alpha-notes", "zeta-notes"]
    broken = good()
    broken["source_ref"] = "notes:latest"
    broken["default_port"] = 0
    write_recipe(tmp_path, "broken-one", recipe=broken)
    with pytest.raises(vr.RecipeError) as err:
        vr.load_recipes(tmp_path, builtin_slugs=BUILTIN)
    assert len(err.value.errors) >= 2 and all(e.startswith("recipes/broken-one/") for e in err.value.errors)


def test_catalog_is_deterministic_and_in_the_feed_shape_panels_read(tmp_path: Path) -> None:
    write_recipe(tmp_path, "alpha-notes")
    recipes = vr.load_recipes(tmp_path, builtin_slugs=BUILTIN)
    body = vr.build_catalog(recipes, sequence=9, revision=REVISION_A)
    assert body == vr.build_catalog(recipes, sequence=9, revision=REVISION_A) and body.endswith(b"\n")
    catalog = json.loads(body)
    assert catalog["name"] == "Tend Community" and catalog["registry_sequence"] == 9
    # parseNative keeps an entry only with slug, name and source_ref; every entry here has them, verbatim.
    assert all(e["slug"] and e["name"] and e["source_ref"] for e in catalog["entries"])
    assert set(catalog["entries"][0]) == set(vr.RECIPE_KEYS)


def test_catalog_size_limit(tmp_path: Path, monkeypatch) -> None:
    monkeypatch.setattr(vr, "MAX_CATALOG_BYTES", 100)
    with pytest.raises(vr.RecipeError, match="exceeds the panel limit"):
        vr.build_catalog([good()], sequence=1, revision=REVISION_A)


def test_build_emits_the_catalog_and_refuses_a_bad_recipe(tmp_path: Path) -> None:
    from conftest import write_fixture_extension

    write_fixture_extension(tmp_path / "extensions")
    (tmp_path / "recipes").mkdir()
    write_recipe(tmp_path / "recipes", "good-app")
    build.run(tmp_path, sequence=3, revision=REVISION_A)
    catalog = json.loads((tmp_path / "dist" / "community-catalog.json").read_text())
    assert [e["slug"] for e in catalog["entries"]] == ["good-app"] and catalog["revision"] == REVISION_A
    broken = good()
    broken["source_ref"] = "app:latest"
    write_recipe(tmp_path / "recipes", "bad-app", recipe=broken)
    with pytest.raises(build.BuildError, match="invalid recipe"):
        build.run(tmp_path, sequence=3, revision=REVISION_A)


def test_build_without_a_recipes_directory_writes_no_catalog(tmp_path: Path) -> None:
    from conftest import write_fixture_extension

    write_fixture_extension(tmp_path / "extensions")
    build.run(tmp_path, sequence=3, revision=REVISION_A)
    assert not (tmp_path / "dist" / "community-catalog.json").exists()


def test_cli(tmp_path: Path, capsys) -> None:
    write_recipe(tmp_path, "ok-app")
    assert vr.main([str(tmp_path)]) == 0
    assert "1 recipe(s) valid" in capsys.readouterr().out
    broken = good()
    broken["category"] = "Nope"
    write_recipe(tmp_path, "bad-app", recipe=broken)
    assert vr.main(["--annotate", str(tmp_path)]) == 1
    out = capsys.readouterr()
    assert "::error file=recipes/bad-app/recipe.json" in out.out and "category must be one of" in out.err
    assert vr.main([str(tmp_path / "ok-app")]) == 0


# ---------------------------------------------------------------------------------------------------------------
# Stack recipes (kind "stack"): recipe.json + listing.json + compose.yaml, the Media Recipe as the reference.
# ---------------------------------------------------------------------------------------------------------------

MEDIA = REPO_ROOT / "recipes" / "media-recipe"


def media_compose() -> str:
    return (MEDIA / "compose.yaml").read_text(encoding="utf-8")


def stack_problems(text: str) -> list[str]:
    return vr.validate_stack_compose(text)


def write_stack(root: Path, slug: str = "media-recipe", *, compose: str | None = None, recipe: dict | None = None) -> Path:
    folder = root / slug
    folder.mkdir(parents=True)
    r = recipe if recipe is not None else json.loads((MEDIA / "recipe.json").read_text(encoding="utf-8"))
    (folder / "recipe.json").write_text(json.dumps({**r, "slug": slug}), encoding="utf-8")
    shutil.copy(MEDIA / "listing.json", folder / "listing.json")
    (folder / "compose.yaml").write_text(compose if compose is not None else media_compose(), encoding="utf-8")
    return folder


def test_media_recipe_passes_and_matches_the_stack_schema() -> None:
    entry = vr.validate_recipe_dir(MEDIA, builtin_slugs=BUILTIN)
    assert entry["kind"] == "stack" and entry["source"] == "compose" and entry["source_ref"] == ""
    assert entry["default_port"] == 0 and entry["env_hints"] == [] and entry["volumes"] == [] and entry["needs_dbs"] == []
    assert entry["compose"] == media_compose()
    import hashlib

    assert entry["compose_sha256"] == hashlib.sha256(media_compose().encode("utf-8")).hexdigest()
    schema = json.loads((REPO_ROOT / "recipes" / "stack.schema.json").read_text(encoding="utf-8"))
    assert set(schema["properties"]) == set(vr.STACK_RECIPE_KEYS) == set(schema["required"])
    assert list(schema["properties"]["category"]["enum"]) == list(vr.CATEGORIES)


def test_media_recipe_shape() -> None:
    import yaml

    doc = yaml.safe_load(media_compose())
    services = doc["services"]
    assert sorted(services) == ["folders", "plex", "prowlarr", "radarr", "seerr", "sonarr"]
    # Only Plex maps the graphics device, and only as an optional one.
    gpu = [n for n, s in services.items() if "devices" in s]
    assert gpu == ["plex"] and services["plex"]["x-tend"]["gpu"] == "optional"
    assert services["plex"]["environment"]["ADVERTISE_IP"] == "${TEND_URL_PLEX}:443"
    assert services["plex"]["environment"]["PLEX_CLAIM"] == "${PLEX_CLAIM:-}"
    # Three storage questions, each at its own path, none nested.
    storage = doc["x-tend"]["storage"]
    assert {k: v["mount_root"] for k, v in storage.items()} == {"movies": "/movies", "tv": "/tv", "downloads": "/downloads"}
    assert all(set(v) == {"prompt", "mount_root"} for v in storage.values())
    # Every image is pinned (no latest, no bare name).
    assert all(vr.check_image_reference(s["image"]) is None for s in services.values())
    assert "first person" in json.loads((MEDIA / "recipe.json").read_text())["notes"]


def test_stack_recipe_json_rules() -> None:
    recipe = json.loads((MEDIA / "recipe.json").read_text(encoding="utf-8"))
    assert vr.validate_recipe_data(recipe, folder="media-recipe", builtin_slugs=BUILTIN) == []
    for key in ("source", "source_ref", "default_port", "env_hints", "volumes", "needs_dbs"):
        errs = vr.validate_recipe_data({**recipe, key: "x"}, builtin_slugs=BUILTIN)
        assert any(key in e and "image recipe" in e for e in errs), key
    missing = {k: v for k, v in recipe.items() if k != "suggested_name"}
    assert any("missing required key 'suggested_name'" in e for e in vr.validate_recipe_data(missing, builtin_slugs=BUILTIN))
    assert any("unknown key 'extra'" in e for e in vr.validate_recipe_data({**recipe, "extra": 1}, builtin_slugs=BUILTIN))
    # An image recipe may not use the key.
    errs = vr.validate_recipe_data({**good(), "kind": "app"}, builtin_slugs=BUILTIN)
    assert any("'kind'" in e for e in errs)


def test_stack_folder_layout(tmp_path: Path) -> None:
    folder = write_stack(tmp_path)
    assert vr.validate_recipe_dir(folder, builtin_slugs=BUILTIN)["kind"] == "stack"
    (folder / "README.md").write_text("no")
    with pytest.raises(vr.RecipeError, match="README.md: not allowed"):
        vr.validate_recipe_dir(folder, builtin_slugs=BUILTIN)
    (folder / "README.md").unlink()
    (folder / "compose.yaml").unlink()
    with pytest.raises(vr.RecipeError, match="compose.yaml: missing"):
        vr.validate_recipe_dir(folder, builtin_slugs=BUILTIN)
    # An image recipe may not ship a compose file.
    image = write_recipe(tmp_path, "image-app")
    (image / "compose.yaml").write_text("services: {}\n")
    with pytest.raises(vr.RecipeError, match="compose.yaml: not allowed"):
        vr.validate_recipe_dir(image, builtin_slugs=BUILTIN)


@pytest.mark.parametrize(
    "old,new,fragment",
    [
        ("plexinc/pms-docker:1.43.4.10903-e5521bd8c", "plexinc/pms-docker:latest", "moving tag"),
        ("plexinc/pms-docker:1.43.4.10903-e5521bd8c", "plexinc/pms-docker", "must pin a version"),
        ("    expose:\n      - \"5055\"\n", "    ports:\n      - \"5055:5055\"\n", "ports: not allowed"),
        ("    image: lscr.io/linuxserver/sonarr:4.0.20\n", "    build: .\n", "build: not allowed"),
        ("      - sonarr-config:/config\n", "      - /srv/sonarr:/config\n", "host paths are not allowed"),
        ("      - sonarr-config:/config\n", "      - ./sonarr:/config\n", "host paths are not allowed"),
        ("      - sonarr-config:/config\n", "      - /var/run/docker.sock:/config\n", "host paths are not allowed"),
        ("    restart: unless-stopped\n    environment:\n      TZ: ${TZ:-Etc/UTC}\n      PUID", "    privileged: true\n    restart: unless-stopped\n    environment:\n      TZ: ${TZ:-Etc/UTC}\n      PUID", "privileged: not allowed"),
        ("      - /dev/dri:/dev/dri\n", "      - /dev/sda:/dev/sda\n", "only /dev/dri"),
        ("      - /dev/dri:/dev/dri\n", "      - /dev/dri:/dev/video0\n", "same path"),
        ("      gpu: optional\n", "", "needs `x-tend: {gpu: optional}`"),
        ("      web_port: 9696\n", "", "has no x-tend.web_port"),
        ("      web_port: 9696\n", "      web_port: 1234\n", "must be one of the ports the service exposes"),
        ("      PUID: \"1000\"\n      PGID: \"1000\"\n    volumes:\n      - prowlarr", "      PUID: \"1000\"\n      PGID: \"1000\"\n      API_TOKEN: abc123\n    volumes:\n      - prowlarr", "looks like a secret"),
        ("      TZ: ${TZ:-Etc/UTC}\n    volumes:\n      - seerr-config", "      TZ: ${TZ}\n    volumes:\n      - seerr-config", "has no default"),
        ("      TZ: ${TZ:-Etc/UTC}\n    volumes:\n      - seerr-config", "      TZ: ${TEND_URL_NOPE}\n    volumes:\n      - seerr-config", "has no default"),
        ("      TZ: ${TZ:-Etc/UTC}\n    volumes:\n      - seerr-config", "      TZ: $HOME\n    volumes:\n      - seerr-config", "literal dollar"),
        ("  prowlarr-config: {}\n", "  prowlarr-config: {}\n  unused: {}\n", "no service mounts it"),
        ("  prowlarr-config: {}\n", "  prowlarr-config:\n    driver: local\n", "must be empty"),
        ("      folders:\n        condition: service_completed_successfully\n    x-tend:\n      web_port: 8989", "      nope:\n        condition: service_started\n    x-tend:\n      web_port: 8989", "not another service"),
        ("    restart: \"no\"\n", "    restart: no\n", "restart"),
        ("services:\n  # Runs once", "networks: {}\nservices:\n  # Runs once", "top-level key 'networks'"),
    ],
)
def test_stack_compose_rules(old: str, new: str, fragment: str) -> None:
    text = media_compose()
    assert old in text, old
    errors = stack_problems(text.replace(old, new, 1))
    assert any(fragment in e for e in errors), (fragment, errors)


def test_stack_compose_hygiene() -> None:
    assert any("not valid YAML" in e for e in stack_problems("services: [unclosed"))
    assert any("duplicate key" in e for e in stack_problems("services:\n  a:\n    image: x/a:1\n  a:\n    image: x/a:2\n"))
    assert any("carriage returns" in e for e in stack_problems(media_compose().replace("\n", "\r\n")))
    assert any("larger than" in e for e in stack_problems("# " + "x" * vr.MAX_COMPOSE_BYTES + "\nservices: {}\n"))
    assert any("at least one service" in e for e in stack_problems("services: {}\n"))
    cyc = "services:\n  a:\n    image: x/a:1\n    depends_on: [b]\n  b:\n    image: x/b:1\n    depends_on: [a]\n"
    assert any("cycle" in e for e in stack_problems(cyc))
    # secrets as bare references and an empty default are fine; the key looks secret but ships no value
    ok = "services:\n  a:\n    image: x/a:1\n    environment:\n      API_TOKEN: ${API_TOKEN}\n      DB_PASSWORD: ${DB_PASSWORD:-}\n"
    assert stack_problems(ok) == []


# The P7a security review: bind options cannot hide in a mount target or mount_root, a recipe carries no folder or
# default path, and no two questions share or nest a target.


def storage_compose(questions: str, volumes: str = "      - movies:/movies\n      - tv:/tv\n") -> str:
    return (
        "x-tend:\n  storage:\n" + questions + "services:\n  app:\n    image: x/app:1.2.3\n    volumes:\n" + volumes
        + "volumes:\n  movies: {}\n  tv: {}\n"
    )


MOVIES_TV = "    movies:\n      prompt: Movies\n      mount_root: /movies\n    tv:\n      prompt: Shows\n      mount_root: /tv\n"


def test_storage_baseline_is_valid() -> None:
    assert stack_problems(storage_compose(MOVIES_TV)) == []


@pytest.mark.parametrize("target", ["/data:z", "/data:rshared", "/data,ro", "/da ta", "/data\\t"])
def test_mount_target_and_mount_root_refuse_bind_options_and_whitespace(target: str) -> None:
    root = f'    movies:\n      prompt: Movies\n      mount_root: "{target}"\n'
    errors = stack_problems(storage_compose(root, volumes='      - type: volume\n        source: movies\n        target: /movies\n'))
    assert any("mount_root" in e and "smuggle" in e for e in errors), errors
    ok_root = "    movies:\n      prompt: Movies\n      mount_root: /movies\n"
    errors = stack_problems(storage_compose(ok_root, volumes=f'      - type: volume\n        source: movies\n        target: "{target}"\n      - tv:/tv\n'))
    assert any("target" in e and "smuggle" in e for e in errors), errors
    # The short form splits on ':' so the option shows up as a bad third part.
    errors = stack_problems(storage_compose(ok_root, volumes=f"      - movies:{target}\n      - tv:/tv\n"))
    assert errors, "a short-form mount with an option-carrying target must be refused"


@pytest.mark.parametrize("extra", ["      path: /mnt/movies\n", "      default: /mnt/movies\n", "      kind: folder\n", "      host_path: /etc\n", "      answer: {}\n"])
def test_storage_question_carries_only_prompt_and_mount_root(extra: str) -> None:
    errors = stack_problems(storage_compose(MOVIES_TV.replace("      mount_root: /movies\n", "      mount_root: /movies\n" + extra)))
    assert any("never a folder, a default path or an answer" in e for e in errors), errors


def test_storage_mount_root_must_be_absolute_and_normalised() -> None:
    for root in ("movies", "/movies/", "/a/../b", "/"):
        text = storage_compose(MOVIES_TV.replace("mount_root: /movies", f"mount_root: {root}"))
        assert any("mount_root" in e for e in stack_problems(text)), root


@pytest.mark.parametrize(
    "roots",
    [("/media", "/media"), ("/media", "/media/tv"), ("/media/tv", "/media")],
    ids=["same", "outer-first", "inner-first"],
)
def test_storage_questions_cannot_share_or_nest_a_target(roots: tuple[str, str]) -> None:
    questions = (
        f"    movies:\n      prompt: Movies\n      mount_root: {roots[0]}\n"
        f"    tv:\n      prompt: Shows\n      mount_root: {roots[1]}\n"
    )
    errors = stack_problems(storage_compose(questions, volumes=f"      - movies:{roots[0]}\n      - tv:{roots[1]}\n"))
    assert any("share or nest" in e for e in errors), errors


def test_storage_question_rules() -> None:
    wrong = storage_compose(MOVIES_TV.replace("    tv:", "    music:"))
    assert any("no volume of the same name" in e for e in stack_problems(wrong))
    off = storage_compose(MOVIES_TV, volumes="      - movies:/elsewhere\n      - tv:/tv\n")
    assert any("must mount at /movies" in e for e in stack_problems(off))
    noprompt = storage_compose(MOVIES_TV.replace("      prompt: Movies\n", ""))
    assert any("prompt" in e for e in stack_problems(noprompt))


def test_load_recipes_sorts_stacks_with_image_recipes_and_builds_the_catalog(tmp_path: Path) -> None:
    write_recipe(tmp_path, "zeta-notes")
    write_stack(tmp_path, "alpha-media")
    recipes = vr.load_recipes(tmp_path, builtin_slugs=BUILTIN)
    assert [r["slug"] for r in recipes] == ["alpha-media", "zeta-notes"]
    body = vr.build_catalog(recipes, sequence=9, revision=REVISION_A)
    assert body == vr.build_catalog(recipes, sequence=9, revision=REVISION_A)
    entries = {e["slug"]: e for e in json.loads(body)["entries"]}
    stack, image = entries["alpha-media"], entries["zeta-notes"]
    # A panel that predates stacks keeps an entry only with a source_ref: the stack has none, the app has one.
    assert stack["source_ref"] == "" and image["source_ref"]
    assert set(image) == set(vr.RECIPE_KEYS)
    assert {"kind", "compose", "compose_sha256"} <= set(stack) and "kind" not in image
    assert len(stack["compose_sha256"]) == 64 and stack["compose_sha256"] == stack["compose_sha256"].lower()


def test_build_emits_a_stack_entry_and_refuses_a_bad_stack(tmp_path: Path) -> None:
    from conftest import write_fixture_extension

    write_fixture_extension(tmp_path / "extensions")
    (tmp_path / "recipes").mkdir()
    write_stack(tmp_path / "recipes", "media-recipe")
    build.run(tmp_path, sequence=3, revision=REVISION_A)
    first = (tmp_path / "dist" / "community-catalog.json").read_bytes()
    build.run(tmp_path, sequence=3, revision=REVISION_A)
    assert (tmp_path / "dist" / "community-catalog.json").read_bytes() == first  # reproducible
    entry = json.loads(first)["entries"][0]
    assert entry["kind"] == "stack" and entry["compose"] == media_compose()
    write_stack(tmp_path / "recipes", "bad-stack", compose=media_compose().replace(":1.43.4.10903-e5521bd8c", ":latest"))
    with pytest.raises(build.BuildError, match="invalid recipe"):
        build.run(tmp_path, sequence=3, revision=REVISION_A)


def test_cli_reports_stack_problems_with_annotations(tmp_path: Path, capsys) -> None:
    write_stack(tmp_path, "bad-stack", compose=media_compose().replace("    expose:\n      - \"5055\"\n", "    ports:\n      - \"5055:5055\"\n"))
    assert vr.main(["--annotate", str(tmp_path / "bad-stack")]) == 1
    out = capsys.readouterr()
    assert "::error file=recipes/bad-stack/compose.yaml" in out.out and "ports: not allowed" in out.err
    assert vr.main([str(MEDIA)]) == 0
