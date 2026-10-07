#!/usr/bin/env python3
"""Validate community App Store recipes under `recipes/` and build the community catalog.

A recipe is `recipes/<slug>/recipe.json` plus `recipes/<slug>/listing.json`. `recipe.json` is one entry of the
panel's native community catalog feed, and a panel reads exactly this subset of fields from any feed (see
`federatedEntryToCatalogEntry` in the panel; it replaces publisher, provenance and assurance, denies launch
priority and drops every first-party-only field). So this validator:

  * requires the fields a panel reads and rejects every other key, because an unknown key silently does nothing
    and a recipe must not look like it grants itself anything;
  * adds the registry's own review rules (pinned image tag, no default secrets, one container, safe mount paths).

Pure standard library: it runs on a plain GitHub-hosted runner with no panel checkout and no secrets. The rules
are re-implemented here from the public contract (types, vocabularies and the feed format documented in
`developers/skills/tend-app-recipe/SKILL.md`); they are kept in step by hand, and the panel's own
`Entry.Normalize` is the final authority when it reads the feed.

CLI: `python tools/validate_recipe.py [recipes-dir | recipe-dir ...]` (default `recipes/`). Add `--annotate` for
GitHub workflow annotations. Exit 0 when every recipe passes, 1 otherwise.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path, PurePosixPath
from typing import Any
from urllib.parse import urlsplit

REPO_ROOT = Path(__file__).resolve().parent.parent
RECIPES_DIRNAME = "recipes"
BUILTIN_SLUGS_FILE = REPO_ROOT / "tools" / "data" / "builtin-slugs.txt"

RECIPE_FILE = "recipe.json"
LISTING_FILE = "listing.json"
ALLOWED_FILES = {RECIPE_FILE, LISTING_FILE}
MAX_FILE_BYTES = 32 * 1024
# The panel refuses a catalog body above this size (maxCatalogSourceBodyBytes).
MAX_CATALOG_BYTES = 2_000_000
COMMUNITY_CATALOG_NAME = "community-catalog.json"
COMMUNITY_CATALOG_TITLE = "Tend Community"

# Fields the panel reads from a native feed entry (`federatedCatalogEntry`).
RECIPE_KEYS = (
    "slug", "name", "tagline", "category", "icon", "source", "source_ref", "default_port", "suggested_name",
    "env_hints", "volumes", "docs_url", "notes", "tags", "needs_dbs",
)
ENV_HINT_KEYS = ("key", "kind", "default", "description", "required")
VOLUME_KEYS = ("name_suffix", "mount_path", "description")
# First-party-only: a panel drops these from any feed, so naming them is a mistake worth saying out loud.
FIRST_PARTY_ONLY_KEYS = {
    "build", "fixed_internal_port", "launch_priority", "recipe_schema", "recipe_revision", "publisher",
    "provenance", "assurance", "artifact", "resources", "runtime_security", "health", "backup", "updates",
    "runtime_command", "post_install", "source_meta", "feature", "screenshots", "needs_db",
}

# Categories the first-party catalog uses today, plus "Other".
CATEGORIES = (
    "AI", "Analytics", "Automation", "Content", "Database", "Developer", "Education", "Mail", "Media",
    "Monitoring", "Observability", "Productivity", "Other",
)
ENV_KINDS = ("text", "password", "url", "timezone")
DB_KINDS = ("postgres", "mysql", "mariadb", "redis", "clickhouse")
LISTING_KEYS = ("publisher", "upstream_url", "upstream_license", "recipe_license", "tested_with", "release_notes")
RECIPE_LICENSES = ("MIT", "Apache-2.0", "CC0-1.0")

_SLUG_RE = re.compile(r"^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$")
_NAME_SUFFIX_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,30}$")
_TAG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,23}$")
_ENV_KEY_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]{0,63}$")
_SECRETISH_KEY_RE = re.compile(r"(PASSWORD|PASSWD|SECRET|TOKEN|API_?KEY|PRIVATE_?KEY|CREDENTIAL)", re.I)
_IMAGE_COMPONENT = r"[a-z0-9]+(?:(?:[._]|__|-+)[a-z0-9]+)*"
_IMAGE_RE = re.compile(
    rf"^(?P<name>(?:[a-zA-Z0-9.-]+(?::[0-9]+)?/)?{_IMAGE_COMPONENT}(?:/{_IMAGE_COMPONENT})*)"
    r"(?::(?P<tag>[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}))?"
    r"(?:@sha256:(?P<digest>[a-f0-9]{64}))?$"
)
_MOVING_TAGS = {"latest", "stable", "main", "master", "edge", "nightly", "dev", "develop", "rolling", "current"}
_FORBIDDEN_MOUNT_PREFIXES = ("/proc", "/sys", "/dev", "/run", "/var/run", "/etc/docker", "/boot")
_CONTROL_RE = re.compile(r"[\x00-\x1f\x7f]")
_ICON_FORBIDDEN_RE = re.compile(r"[A-Za-z0-9<>&:/\\\"'`\s]")

LIMITS = {
    "name": 60, "tagline": 100, "icon_codepoints": 8, "notes": 600, "env_hints": 40, "env_default": 200,
    "env_description": 200, "volumes": 10, "volume_description": 200, "tags": 8, "needs_dbs": 5,
    "url": 300, "listing_text": 200, "release_notes": 600,
}


class RecipeError(Exception):
    """One or more problems with a recipe; `errors` holds every one found."""

    def __init__(self, errors: list[str]):
        super().__init__("; ".join(errors))
        self.errors = errors


def _no_duplicate_keys(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for key, value in pairs:
        if key in out:
            raise ValueError(f"duplicate key {key!r}")
        out[key] = value
    return out


def _reject_constant(name: str) -> Any:
    raise ValueError(f"{name} is not valid JSON")


def read_json_object(path: Path) -> dict[str, Any]:
    """Read one small JSON object: UTF-8, no duplicate keys, no NaN, bounded size."""
    if path.is_symlink() or not path.is_file():
        raise RecipeError([f"{path.name}: must be a regular file"])
    size = path.stat().st_size
    if size > MAX_FILE_BYTES:
        raise RecipeError([f"{path.name}: {size} bytes exceeds the {MAX_FILE_BYTES} byte limit"])
    try:
        data = json.loads(
            path.read_bytes().decode("utf-8"),
            object_pairs_hook=_no_duplicate_keys,
            parse_constant=_reject_constant,
        )
    except (UnicodeDecodeError, ValueError) as exc:
        raise RecipeError([f"{path.name}: not valid JSON ({exc})"]) from exc
    if not isinstance(data, dict):
        raise RecipeError([f"{path.name}: must be a JSON object"])
    return data


def load_builtin_slugs(path: Path = BUILTIN_SLUGS_FILE) -> set[str]:
    if not path.is_file():
        return set()
    return {line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip() and not line.startswith("#")}


def _is_text(value: Any, *, limit: int, allow_empty: bool = False) -> bool:
    return (
        isinstance(value, str)
        and (allow_empty or bool(value.strip()))
        and len(value) <= limit
        and not _CONTROL_RE.search(value)
        and value == value.strip()
    )


def _is_int(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


def _https_url(value: Any) -> str | None:
    """Return a problem description, or None when value is an acceptable https URL."""
    if not isinstance(value, str) or not value or len(value) > LIMITS["url"] or _CONTROL_RE.search(value) or " " in value:
        return "must be an https URL up to 300 characters"
    try:
        parts = urlsplit(value)
        _ = parts.port
    except ValueError:
        return "is not a valid URL"
    if parts.scheme != "https" or not parts.hostname or "." not in parts.hostname:
        return "must be an https URL with a public host name"
    if parts.username or parts.password:
        return "must not carry credentials"
    return None


def check_image_reference(ref: Any) -> str | None:
    """Return a problem with an image reference, or None. A recipe must pin an exact version."""
    if not isinstance(ref, str) or not ref or len(ref) > 255 or _CONTROL_RE.search(ref) or " " in ref:
        return "must be an image reference such as ghcr.io/example/notes:1.4.2"
    if "://" in ref:
        return "must be an image reference, not a URL"
    match = _IMAGE_RE.match(ref)
    if not match:
        return "is not a valid image reference"
    tag, digest = match.group("tag"), match.group("digest")
    if not tag and not digest:
        return "must pin a version: add an exact tag (:1.4.2) or a digest (@sha256:...)"
    if tag and not digest:
        if tag.lower() in _MOVING_TAGS:
            return f"must not use the moving tag {tag!r}; pin an exact version or a digest"
        if not re.search(r"\d", tag):
            return f"tag {tag!r} does not look like a version; pin an exact version or a digest"
    return None


def check_mount_path(path: Any) -> str | None:
    if not isinstance(path, str) or not path.startswith("/") or len(path) > 200 or _CONTROL_RE.search(path):
        return "must be an absolute container path such as /data"
    posix = PurePosixPath(path)
    if str(posix) != path or path == "/" or ".." in posix.parts or path.endswith("/"):
        return "must be a normalised path below /, without .. or a trailing slash"
    for prefix in _FORBIDDEN_MOUNT_PREFIXES:
        if path == prefix or path.startswith(prefix + "/"):
            return f"must not be under {prefix}"
    if "docker.sock" in path:
        return "must not mount the Docker socket"
    return None


def _unknown_keys(obj: dict[str, Any], allowed: tuple[str, ...], where: str, errors: list[str]) -> None:
    for key in obj:
        if key in allowed:
            continue
        if where == "recipe.json" and key in FIRST_PARTY_ONLY_KEYS:
            errors.append(f"{where}: {key!r} is first-party only and panels drop it from a community feed; remove it")
        else:
            errors.append(f"{where}: unknown key {key!r} (panels ignore it silently); allowed: {', '.join(allowed)}")


def validate_recipe_data(
    recipe: dict[str, Any], *, folder: str | None = None, builtin_slugs: set[str] | None = None
) -> list[str]:
    """Return every problem found in one recipe.json object (empty list = valid)."""
    errors: list[str] = []
    w = "recipe.json"
    _unknown_keys(recipe, RECIPE_KEYS, w, errors)
    for key in RECIPE_KEYS:
        if key not in recipe:
            errors.append(f"{w}: missing required key {key!r}")

    slug = recipe.get("slug")
    if "slug" in recipe:
        if not isinstance(slug, str) or not _SLUG_RE.match(slug):
            errors.append(f"{w}: slug must be 1-40 lowercase letters, digits or dashes, not starting or ending with a dash")
        else:
            if folder is not None and slug != folder:
                errors.append(f"{w}: slug {slug!r} must equal the folder name {folder!r}")
            if builtin_slugs and slug in builtin_slugs:
                errors.append(f"{w}: slug {slug!r} is a built-in app; a panel shows the built-in and hides this recipe")

    if "name" in recipe and not _is_text(recipe["name"], limit=LIMITS["name"]):
        errors.append(f"{w}: name must be 1-{LIMITS['name']} characters without line breaks")
    if "tagline" in recipe and not _is_text(recipe["tagline"], limit=LIMITS["tagline"]):
        errors.append(f"{w}: tagline must be 1-{LIMITS['tagline']} characters without line breaks")
    if "category" in recipe and recipe["category"] not in CATEGORIES:
        errors.append(f"{w}: category must be one of {', '.join(CATEGORIES)}")

    if "icon" in recipe:
        icon = recipe["icon"]
        if (
            not isinstance(icon, str)
            or not icon
            or len(icon) > LIMITS["icon_codepoints"]
            or _ICON_FORBIDDEN_RE.search(icon)
        ):
            errors.append(f"{w}: icon must be a single emoji (up to {LIMITS['icon_codepoints']} code points; no letters, digits, markup or URLs)")

    if "source" in recipe and recipe["source"] != "image":
        errors.append(f"{w}: source must be \"image\" (git builds cannot be pinned in a community feed)")
    if "source_ref" in recipe:
        problem = check_image_reference(recipe["source_ref"])
        if problem:
            errors.append(f"{w}: source_ref {problem}")

    if "default_port" in recipe:
        port = recipe["default_port"]
        if not _is_int(port) or not 1 <= port <= 65535:
            errors.append(f"{w}: default_port must be an integer from 1 to 65535")

    if "suggested_name" in recipe and not (
        isinstance(recipe["suggested_name"], str) and _NAME_SUFFIX_RE.match(recipe["suggested_name"])
    ):
        errors.append(f"{w}: suggested_name must be lowercase letters, digits or dashes, up to 31 characters")

    _validate_env_hints(recipe.get("env_hints"), "env_hints" in recipe, errors)
    _validate_volumes(recipe.get("volumes"), "volumes" in recipe, errors)

    if "docs_url" in recipe:
        problem = _https_url(recipe["docs_url"])
        if problem:
            errors.append(f"{w}: docs_url {problem}")
    if "notes" in recipe and not _is_text(recipe["notes"], limit=LIMITS["notes"]):
        errors.append(f"{w}: notes must be 1-{LIMITS['notes']} characters and say what to do on first run")

    if "tags" in recipe:
        tags = recipe["tags"]
        if (
            not isinstance(tags, list)
            or len(tags) > LIMITS["tags"]
            or not all(isinstance(t, str) and _TAG_RE.match(t) for t in tags)
            or len(set(tags)) != len(tags)
        ):
            errors.append(f"{w}: tags must be up to {LIMITS['tags']} unique lowercase words (letters, digits, dashes)")

    if "needs_dbs" in recipe:
        dbs = recipe["needs_dbs"]
        if (
            not isinstance(dbs, list)
            or len(dbs) > LIMITS["needs_dbs"]
            or not all(isinstance(d, str) and d in DB_KINDS for d in dbs)
            or len(set(dbs)) != len(dbs)
        ):
            errors.append(f"{w}: needs_dbs must be a list of unique engines from {', '.join(DB_KINDS)}")
    return errors


def _validate_env_hints(hints: Any, present: bool, errors: list[str]) -> None:
    if not present:
        return
    w = "recipe.json: env_hints"
    if not isinstance(hints, list) or len(hints) > LIMITS["env_hints"]:
        errors.append(f"{w} must be a list of at most {LIMITS['env_hints']} objects")
        return
    seen: set[str] = set()
    for i, hint in enumerate(hints):
        where = f"{w}[{i}]"
        if not isinstance(hint, dict):
            errors.append(f"{where} must be an object")
            continue
        _unknown_keys(hint, ENV_HINT_KEYS, where, errors)
        for key in ENV_HINT_KEYS:
            if key not in hint:
                errors.append(f"{where}: missing required key {key!r}")
        key = hint.get("key")
        if "key" in hint:
            if not isinstance(key, str) or not _ENV_KEY_RE.match(key):
                errors.append(f"{where}: key must be a valid environment variable name")
            elif key in seen:
                errors.append(f"{where}: duplicate key {key!r}")
            else:
                seen.add(key)
        kind = hint.get("kind")
        if "kind" in hint and kind not in ENV_KINDS:
            errors.append(f"{where}: kind must be one of {', '.join(ENV_KINDS)}")
        default = hint.get("default")
        if "default" in hint and not _is_text(default, limit=LIMITS["env_default"], allow_empty=True):
            errors.append(f"{where}: default must be a short string without line breaks")
        elif isinstance(default, str) and default:
            if kind == "password":
                errors.append(f"{where}: a password variable must not ship a default; leave default empty and mark it required")
            elif isinstance(key, str) and _SECRETISH_KEY_RE.search(key):
                errors.append(f"{where}: {key} looks like a secret and must not ship a default value")
        if "description" in hint and not _is_text(hint["description"], limit=LIMITS["env_description"]):
            errors.append(f"{where}: description must be 1-{LIMITS['env_description']} characters")
        if "required" in hint and not isinstance(hint["required"], bool):
            errors.append(f"{where}: required must be true or false")
        if kind == "password" and hint.get("required") is False and "required" in hint:
            errors.append(f"{where}: a password variable must be required (the user supplies it at install)")


def _validate_volumes(volumes: Any, present: bool, errors: list[str]) -> None:
    if not present:
        return
    w = "recipe.json: volumes"
    if not isinstance(volumes, list) or len(volumes) > LIMITS["volumes"]:
        errors.append(f"{w} must be a list of at most {LIMITS['volumes']} objects")
        return
    suffixes: set[str] = set()
    mounts: set[str] = set()
    for i, vol in enumerate(volumes):
        where = f"{w}[{i}]"
        if not isinstance(vol, dict):
            errors.append(f"{where} must be an object")
            continue
        _unknown_keys(vol, VOLUME_KEYS, where, errors)
        for key in VOLUME_KEYS:
            if key not in vol:
                errors.append(f"{where}: missing required key {key!r}")
        suffix = vol.get("name_suffix")
        if "name_suffix" in vol:
            if not isinstance(suffix, str) or not _NAME_SUFFIX_RE.match(suffix):
                errors.append(f"{where}: name_suffix must be lowercase letters, digits or dashes, up to 31 characters")
            elif suffix in suffixes:
                errors.append(f"{where}: duplicate name_suffix {suffix!r}")
            else:
                suffixes.add(suffix)
        mount = vol.get("mount_path")
        if "mount_path" in vol:
            problem = check_mount_path(mount)
            if problem:
                errors.append(f"{where}: mount_path {problem}")
            elif mount in mounts:
                errors.append(f"{where}: duplicate mount_path {mount!r}")
            else:
                mounts.add(mount)
        if "description" in vol and not _is_text(vol["description"], limit=LIMITS["volume_description"]):
            errors.append(f"{where}: description must be 1-{LIMITS['volume_description']} characters")


def validate_listing_data(listing: dict[str, Any]) -> list[str]:
    """Registry metadata for reviewers; never part of the catalog a panel reads."""
    errors: list[str] = []
    w = "listing.json"
    _unknown_keys(listing, LISTING_KEYS, w, errors)
    for key in LISTING_KEYS:
        if key not in listing:
            errors.append(f"{w}: missing required key {key!r}")
    for key in ("publisher", "upstream_license", "tested_with"):
        if key in listing and not _is_text(listing[key], limit=LIMITS["listing_text"]):
            errors.append(f"{w}: {key} must be 1-{LIMITS['listing_text']} characters")
    if "upstream_url" in listing:
        problem = _https_url(listing["upstream_url"])
        if problem:
            errors.append(f"{w}: upstream_url {problem}")
    if "recipe_license" in listing and listing["recipe_license"] not in RECIPE_LICENSES:
        errors.append(f"{w}: recipe_license must be one of {', '.join(RECIPE_LICENSES)} (the registry is MIT)")
    if "release_notes" in listing and not _is_text(listing["release_notes"], limit=LIMITS["release_notes"]):
        errors.append(f"{w}: release_notes must be 1-{LIMITS['release_notes']} characters")
    return errors


def validate_recipe_dir(folder: Path, *, builtin_slugs: set[str] | None = None) -> dict[str, Any]:
    """Validate one `recipes/<slug>/` folder; return the recipe object or raise RecipeError."""
    errors: list[str] = []
    if folder.is_symlink() or not folder.is_dir():
        raise RecipeError([f"{folder.name}: must be a directory"])
    names = {p.name for p in folder.iterdir()}
    for extra in sorted(names - ALLOWED_FILES):
        errors.append(f"{extra}: not allowed in a recipe folder (only {RECIPE_FILE} and {LISTING_FILE})")
    for needed in sorted(ALLOWED_FILES - names):
        errors.append(f"{needed}: missing")
    recipe: dict[str, Any] = {}
    if RECIPE_FILE in names:
        try:
            recipe = read_json_object(folder / RECIPE_FILE)
            errors.extend(validate_recipe_data(recipe, folder=folder.name, builtin_slugs=builtin_slugs))
        except RecipeError as exc:
            errors.extend(exc.errors)
    if LISTING_FILE in names:
        try:
            errors.extend(validate_listing_data(read_json_object(folder / LISTING_FILE)))
        except RecipeError as exc:
            errors.extend(exc.errors)
    if errors:
        raise RecipeError([f"recipes/{folder.name}/{e}" for e in errors])
    return recipe


def discover_recipe_dirs(recipes_dir: Path) -> list[Path]:
    if not recipes_dir.is_dir():
        return []
    # Loose files (README.md, the schema) are allowed at the top level; anything that is a folder is a recipe.
    return sorted(p for p in recipes_dir.iterdir() if p.is_dir() or p.is_symlink())


def load_recipes(recipes_dir: Path, *, builtin_slugs: set[str] | None = None) -> list[dict[str, Any]]:
    """Validate every recipe folder; return the recipe objects sorted by slug, or raise one RecipeError."""
    if builtin_slugs is None:
        builtin_slugs = load_builtin_slugs()
    recipes: list[dict[str, Any]] = []
    errors: list[str] = []
    for folder in discover_recipe_dirs(recipes_dir):
        try:
            recipes.append(validate_recipe_dir(folder, builtin_slugs=builtin_slugs))
        except RecipeError as exc:
            errors.extend(exc.errors)
    if errors:
        raise RecipeError(errors)
    return sorted(recipes, key=lambda r: r["slug"])


def build_catalog(recipes: list[dict[str, Any]], *, sequence: int, revision: str) -> bytes:
    """The exact bytes that get signed: deterministic for a given set of recipes and commit."""
    catalog = {
        "name": COMMUNITY_CATALOG_TITLE,
        "version": "1",
        "registry_sequence": sequence,
        "revision": revision,
        "entries": recipes,
    }
    body = (json.dumps(catalog, indent=2, sort_keys=True, ensure_ascii=True) + "\n").encode("ascii")
    if len(body) > MAX_CATALOG_BYTES:
        raise RecipeError([f"{COMMUNITY_CATALOG_NAME}: {len(body)} bytes exceeds the panel limit of {MAX_CATALOG_BYTES}"])
    return body


def _annotate(error: str) -> str:
    path, _, message = error.partition(": ")
    text = (message or error).replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")
    file = path.replace("%", "%25").replace(",", "%2C").replace(":", "%3A")
    return f"::error file={file},title=Recipe validation::{text}"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate community recipes (recipes/<slug>/recipe.json + listing.json)")
    parser.add_argument("paths", nargs="*", type=Path, help="the recipes directory (default recipes/) or recipe folders")
    parser.add_argument("--annotate", action="store_true", help="also print GitHub workflow error annotations")
    args = parser.parse_args(argv)

    targets = args.paths or [REPO_ROOT / RECIPES_DIRNAME]
    builtin = load_builtin_slugs()
    errors: list[str] = []
    count = 0
    for target in targets:
        folders = [target] if (target / RECIPE_FILE).exists() or (target / LISTING_FILE).exists() else discover_recipe_dirs(target)
        for folder in folders:
            try:
                validate_recipe_dir(folder, builtin_slugs=builtin)
                count += 1
            except RecipeError as exc:
                errors.extend(exc.errors)
    for error in errors:
        print(f"error: {error}", file=sys.stderr)
        if args.annotate:
            print(_annotate(error))
    if errors:
        print(f"{len(errors)} problem(s) in the recipes", file=sys.stderr)
        return 1
    print(f"{count} recipe(s) valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
