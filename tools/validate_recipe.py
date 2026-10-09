#!/usr/bin/env python3
"""Validate community App Store recipes under `recipes/` and build the community catalog.

A recipe is `recipes/<slug>/recipe.json` plus `recipes/<slug>/listing.json`. `recipe.json` is one entry of the
panel's native community catalog feed, and a panel reads exactly this subset of fields from any feed (see
`federatedEntryToCatalogEntry` in the panel; it replaces publisher, provenance and assurance, denies launch
priority and drops every first-party-only field). So this validator:

  * requires the fields a panel reads and rejects every other key, because an unknown key silently does nothing
    and a recipe must not look like it grants itself anything;
  * adds the registry's own review rules (pinned image tag, no default secrets, one container, safe mount paths).

A recipe with `"kind": "stack"` is a whole compose file instead of one image: `recipes/<slug>/` then holds
`recipe.json`, `listing.json` and `compose.yaml`, the compose file is checked by `validate_stack_compose` (stricter
than the panel's own subset), and the catalog entry carries the file inline with its sha256. Panels that predate
stacks skip an entry whose `source_ref` is empty, so a stack never installs as an image app there.

Pure standard library (plus PyYAML for stack recipes): it runs on a plain GitHub-hosted runner with no panel
checkout and no secrets. The rules
are re-implemented here from the public contract (types, vocabularies and the feed format documented in
`developers/skills/tend-app-recipe/SKILL.md`); they are kept in step by hand, and the panel's own
`Entry.Normalize` is the final authority when it reads the feed.

CLI: `python tools/validate_recipe.py [recipes-dir | recipe-dir ...]` (default `recipes/`). Add `--annotate` for
GitHub workflow annotations. Exit 0 when every recipe passes, 1 otherwise.
"""
from __future__ import annotations

import argparse
import hashlib
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
COMPOSE_FILE = "compose.yaml"
ALLOWED_FILES = {RECIPE_FILE, LISTING_FILE}
STACK_ALLOWED_FILES = {RECIPE_FILE, LISTING_FILE, COMPOSE_FILE}
MAX_FILE_BYTES = 32 * 1024
# The panel withholds a stack entry whose compose text is larger (maxCatalogStackComposeBytes).
MAX_COMPOSE_BYTES = 64 * 1024
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
# A stack recipe.json: the catalog entry is built from these plus the compose file (see `stack_catalog_entry`).
STACK_KIND = "stack"
STACK_RECIPE_KEYS = (
    "slug", "name", "tagline", "category", "icon", "kind", "suggested_name", "docs_url", "notes", "tags",
)
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


def _check_identity(
    recipe: dict[str, Any], folder: str | None, builtin_slugs: set[str] | None, errors: list[str]
) -> None:
    """slug, name, tagline, category and icon: the same rules for an image recipe and a stack."""
    w = "recipe.json"
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



def _check_suggested_name(recipe: dict[str, Any], errors: list[str]) -> None:
    w = "recipe.json"
    if "suggested_name" in recipe and not (
        isinstance(recipe["suggested_name"], str) and _NAME_SUFFIX_RE.match(recipe["suggested_name"])
    ):
        errors.append(f"{w}: suggested_name must be lowercase letters, digits or dashes, up to 31 characters")



def _check_docs_notes_tags(recipe: dict[str, Any], errors: list[str]) -> None:
    w = "recipe.json"
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



def validate_recipe_data(
    recipe: dict[str, Any], *, folder: str | None = None, builtin_slugs: set[str] | None = None
) -> list[str]:
    """Return every problem found in one recipe.json object (empty list = valid)."""
    if recipe.get("kind") == STACK_KIND:
        return validate_stack_recipe_data(recipe, folder=folder, builtin_slugs=builtin_slugs)
    errors: list[str] = []
    w = "recipe.json"
    _unknown_keys(recipe, RECIPE_KEYS, w, errors)
    for key in RECIPE_KEYS:
        if key not in recipe:
            errors.append(f"{w}: missing required key {key!r}")

    _check_identity(recipe, folder, builtin_slugs, errors)

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

    _check_suggested_name(recipe, errors)

    _validate_env_hints(recipe.get("env_hints"), "env_hints" in recipe, errors)
    _validate_volumes(recipe.get("volumes"), "volumes" in recipe, errors)

    _check_docs_notes_tags(recipe, errors)

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


# ---------------------------------------------------------------------------------------------------------------
# Stack recipes (`"kind": "stack"`): one compose file, several services.
# ---------------------------------------------------------------------------------------------------------------

# recipe.json keys an image recipe carries and a stack does not: the compose file says all of it.
STACK_FORBIDDEN_KEYS = ("source", "source_ref", "default_port", "env_hints", "volumes", "needs_dbs")


def validate_stack_recipe_data(
    recipe: dict[str, Any], *, folder: str | None = None, builtin_slugs: set[str] | None = None
) -> list[str]:
    """Problems in the recipe.json of a stack recipe (the compose file is checked by `validate_stack_compose`)."""
    errors: list[str] = []
    w = "recipe.json"
    for key in STACK_FORBIDDEN_KEYS:
        if key in recipe:
            errors.append(f"{w}: {key!r} belongs to an image recipe; a stack recipe has none, its compose.yaml says it all")
    _unknown_keys({k: v for k, v in recipe.items() if k not in STACK_FORBIDDEN_KEYS}, STACK_RECIPE_KEYS, w, errors)
    for key in STACK_RECIPE_KEYS:
        if key not in recipe:
            errors.append(f"{w}: missing required key {key!r}")
    if "kind" in recipe and recipe["kind"] != STACK_KIND:
        errors.append(f"{w}: kind must be \"stack\" (or leave the key out for an image recipe)")
    _check_identity(recipe, folder, builtin_slugs, errors)
    _check_suggested_name(recipe, errors)
    _check_docs_notes_tags(recipe, errors)
    return errors


_SERVICE_NAME_RE = re.compile(r"^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$")
_VOLUME_NAME_RE = re.compile(r"^[a-z0-9][a-z0-9_.-]{0,62}$")
_ADDRESS_LABEL_RE = re.compile(r"^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$")
_DURATION_RE = re.compile(r"^(?:\d+(?:\.\d+)?(?:ms|s|m|h))+$")
_USER_RE = re.compile(r"^[A-Za-z0-9_.:-]{1,64}$")
_CAP_RE = re.compile(r"^[A-Z_]{2,32}$")
_EXPOSE_RE = re.compile(r"^(\d{1,5})(?:/tcp)?$")
_DEVICE_RE = re.compile(r"^(/dev/dri(?:/renderD\d{1,3})?)(?::(/dev/dri(?:/renderD\d{1,3})?)(?::(rw|rwm))?)?$")
_REF_RE = re.compile(r"\$\{([A-Za-z_][A-Za-z0-9_]*)(:?[-?+][^}]*)?\}")
_BARE_DOLLAR_RE = re.compile(r"\$(?![{$])")
_SECRET_REF_RE = re.compile(r"^\$\{[A-Za-z_][A-Za-z0-9_]*(?::-)?\}$")
_MOUNT_BAD_RE = re.compile(r"[:,\s\x00-\x1f\x7f]")
_RESTART = ("no", "always", "unless-stopped", "on-failure")
_CONDITIONS = ("service_started", "service_healthy", "service_completed_successfully")
_SERVICE_KEYS = (
    "image", "restart", "environment", "volumes", "expose", "depends_on", "command", "entrypoint", "user",
    "working_dir", "init", "healthcheck", "devices", "cap_drop", "security_opt", "read_only", "x-tend",
)
_SERVICE_HINTS = {
    "build": "a recipe ships an image, never a build",
    "ports": "use expose: Tend routes web addresses, it never publishes raw ports",
    "privileged": "privileged containers are never allowed",
    "network_mode": "host or shared networking is never allowed",
    "cap_add": "adding capabilities is not allowed in a public recipe",
    "volumes_from": "share a named volume instead",
    "env_file": "write the variables under environment",
    "container_name": "Tend names the containers",
    "extends": "one compose file per stack",
    "secrets": "put secret values in an env set, not in the recipe",
    "configs": "configs are not supported",
}
_STORAGE_KEYS = ("prompt", "mount_root")


def _yaml_module():
    try:
        import yaml  # PyYAML, see tools/requirements.txt
    except ImportError as exc:  # pragma: no cover - requirements.txt installs it
        raise RecipeError([
            f"{COMPOSE_FILE}: PyYAML is needed to check a stack recipe (pip install -r tools/requirements.txt)"
        ]) from exc
    return yaml


def _load_compose_yaml(text: str) -> Any:
    """safe_load that refuses duplicate keys (YAML would silently keep the last)."""
    yaml = _yaml_module()

    class Loader(yaml.SafeLoader):
        pass

    def construct_mapping(loader: Any, node: Any, deep: bool = False) -> Any:
        seen: set[Any] = set()
        for key_node, _ in node.value:
            key = loader.construct_object(key_node, deep=True)
            try:
                if key in seen:
                    raise yaml.constructor.ConstructorError(None, None, f"duplicate key {key!r}", key_node.start_mark)
                seen.add(key)
            except TypeError:
                raise yaml.constructor.ConstructorError(None, None, "unusable mapping key", key_node.start_mark) from None
        return yaml.SafeLoader.construct_mapping(loader, node, deep)

    Loader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, construct_mapping)
    return yaml.load(text, Loader=Loader)  # noqa: S506 - SafeLoader subclass


def _mount_target_problem(path: Any) -> str | None:
    """A container mount target: the container-path rules plus no ':' ',' or whitespace (bind options hide there)."""
    if isinstance(path, str) and _MOUNT_BAD_RE.search(path):
        return "must not contain ':', ',' or whitespace (they smuggle mount options)"
    return check_mount_path(path)


def _check_text_refs(value: str, where: str, hosts: set[str], secret_key: bool, errors: list[str]) -> None:
    """Interpolation inside a string: only ${VAR} and ${VAR:-default}; a bare ${VAR} only for Tend's own variables."""
    value = value.replace("$$", "")  # an escaped literal dollar
    if _BARE_DOLLAR_RE.search(value):
        errors.append(f"{where}: write $$ for a literal dollar sign or ${{VAR:-default}} for a variable")
    for match in _REF_RE.finditer(value):
        name, modifier = match.group(1), match.group(2)
        if modifier and not modifier.startswith((":-", "-")):
            errors.append(f"{where}: ${{{name}{modifier}}} is not allowed; use ${{{name}:-default}}")
        elif modifier is None and not secret_key:
            m = re.fullmatch(r"TEND_(?:URL|HOST)_([A-Z0-9_]+)", name)
            if not m or m.group(1) not in hosts:
                errors.append(
                    f"{where}: ${{{name}}} has no default; only TEND_URL_<SERVICE> and TEND_HOST_<SERVICE> of a "
                    f"service in this file may be written without one (use ${{{name}:-default}})"
                )


def _env_items(env: Any, where: str, errors: list[str]) -> list[tuple[str, Any]]:
    items: list[tuple[str, Any]] = []
    if isinstance(env, dict):
        items = list(env.items())
    elif isinstance(env, list):
        for i, entry in enumerate(env):
            if not isinstance(entry, str) or "=" not in entry:
                errors.append(f"{where}[{i}]: must be KEY=value")
                continue
            key, _, value = entry.partition("=")
            items.append((key, value))
    else:
        errors.append(f"{where}: must be a mapping of variables")
    return items


def _service_env_key(name: str) -> str:
    return re.sub(r"[^A-Z0-9]", "_", name.upper()).strip("_")


def validate_stack_compose(text: str) -> list[str]:
    """Every problem in a stack recipe's compose.yaml (empty list = valid).

    Stricter than the panel's own subset on purpose: images pinned, no build, no host paths, `expose` not `ports`,
    only the GPU render device and only as `x-tend.gpu: optional`, no literal secrets, and storage questions that
    carry a prompt and a container path and nothing else. The panel (`cmd/tend-validate-compose`) has the last word.
    """
    errors: list[str] = []
    w = COMPOSE_FILE
    if len(text.encode("utf-8")) > MAX_COMPOSE_BYTES:
        return [f"{w}: larger than {MAX_COMPOSE_BYTES} bytes"]
    if "\r" in text or "\x00" in text or "\t" in text:
        return [f"{w}: must use plain line feeds and spaces (no carriage returns, tabs or NUL bytes)"]
    try:
        doc = _load_compose_yaml(text)
    except Exception as exc:  # PyYAML raises several error types; report the first line of the message
        return [f"{w}: not valid YAML ({str(exc).splitlines()[0] if str(exc) else type(exc).__name__})"]
    if not isinstance(doc, dict):
        return [f"{w}: must be a mapping with services"]
    for key in doc:
        if key not in ("services", "volumes", "x-tend"):
            errors.append(f"{w}: top-level key {key!r} is not allowed in a public stack recipe (services, volumes, x-tend)")

    services = doc.get("services")
    volumes = doc.get("volumes", {})
    if not isinstance(services, dict) or not services:
        return errors + [f"{w}: services must be a mapping with at least one service"]
    if len(services) > 12:
        errors.append(f"{w}: more than 12 services")
    if volumes is None:
        volumes = {}
    if not isinstance(volumes, dict):
        errors.append(f"{w}: volumes must be a mapping of named volumes")
        volumes = {}
    for name, cfg in volumes.items():
        if not isinstance(name, str) or not _VOLUME_NAME_RE.match(name):
            errors.append(f"{w}: volumes.{name}: name must be lowercase letters, digits, dots, dashes or underscores")
        if cfg not in (None, {}):
            errors.append(f"{w}: volumes.{name}: must be empty ({{}}): drivers, external volumes and options are not allowed")

    hosts = {_service_env_key(str(n)) for n in services}
    mounts: dict[str, dict[str, list[tuple[str, str]]]] = {}  # volume -> service -> [(target, path)]
    used_volumes: set[str] = set()
    for name, svc in services.items():
        _validate_stack_service(str(name), svc, services, volumes, hosts, mounts, used_volumes, errors)
    _check_dependency_cycles(services, errors)
    for name in volumes:
        if name not in used_volumes:
            errors.append(f"{w}: volumes.{name}: declared but no service mounts it")

    _validate_stack_storage(doc.get("x-tend"), volumes, services, mounts, errors)
    return errors


def _validate_stack_service(
    name: str, svc: Any, services: dict[str, Any], volumes: dict[str, Any], hosts: set[str],
    mounts: dict[str, dict[str, list[tuple[str, str]]]], used_volumes: set[str], errors: list[str],
) -> None:
    w = f"{COMPOSE_FILE}: services.{name}"
    if not _SERVICE_NAME_RE.match(name):
        errors.append(f"{w}: service name must be lowercase letters, digits or dashes")
    if not isinstance(svc, dict):
        errors.append(f"{w}: must be a mapping")
        return
    for key in svc:
        if key not in _SERVICE_KEYS:
            hint = _SERVICE_HINTS.get(key)
            errors.append(f"{w}.{key}: not allowed in a public stack recipe" + (f" ({hint})" if hint else ""))

    problem = check_image_reference(svc.get("image"))
    if problem:
        errors.append(f"{w}.image {problem}")

    restart = svc.get("restart")
    if "restart" in svc and not (isinstance(restart, str) and re.fullmatch(r"(?:no|always|unless-stopped|on-failure(?::\d{1,3})?)", restart)):
        errors.append(f"{w}.restart: must be one of {', '.join(_RESTART)}; quote it (\"no\"), YAML reads a bare no as false")

    for key in ("init", "read_only"):
        if key in svc and not isinstance(svc[key], bool):
            errors.append(f"{w}.{key}: must be true or false")
    if "user" in svc and not (isinstance(svc["user"], (str, int)) and not isinstance(svc["user"], bool) and _USER_RE.match(str(svc["user"]))):
        errors.append(f"{w}.user: must be a user or uid[:gid]")
    if "working_dir" in svc:
        problem = _mount_target_problem(svc["working_dir"])
        if problem:
            errors.append(f"{w}.working_dir {problem}")
    for key in ("command", "entrypoint"):
        if key in svc:
            values = svc[key] if isinstance(svc[key], list) else [svc[key]]
            if not values or not all(isinstance(v, str) for v in values):
                errors.append(f"{w}.{key}: must be a string or a list of strings")
            else:
                for v in values:
                    _check_text_refs(v, f"{w}.{key}", hosts, False, errors)
    if "cap_drop" in svc and not (
        isinstance(svc["cap_drop"], list) and all(isinstance(c, str) and _CAP_RE.match(c) for c in svc["cap_drop"])
    ):
        errors.append(f"{w}.cap_drop: must be a list of capability names such as ALL")
    if "security_opt" in svc and svc["security_opt"] != ["no-new-privileges:true"]:
        errors.append(f"{w}.security_opt: only [no-new-privileges:true] is allowed")

    _validate_stack_env(w, svc, hosts, errors)
    _validate_stack_volumes(name, w, svc, volumes, mounts, used_volumes, errors)

    exposed: list[int] = []
    if "expose" in svc:
        if not isinstance(svc["expose"], list):
            errors.append(f"{w}.expose: must be a list of container ports")
        else:
            for i, entry in enumerate(svc["expose"]):
                m = _EXPOSE_RE.match(str(entry)) if not isinstance(entry, bool) else None
                if not m or not 1 <= int(m.group(1)) <= 65535:
                    errors.append(f"{w}.expose[{i}]: must be a TCP port from 1 to 65535")
                else:
                    exposed.append(int(m.group(1)))

    _validate_stack_healthcheck(w, svc, errors)
    ext = svc.get("x-tend")
    gpu = _validate_stack_service_ext(w, ext, exposed, errors)
    _validate_stack_devices(w, svc, gpu, errors)

    deps = svc.get("depends_on")
    if deps is not None:
        entries = deps.items() if isinstance(deps, dict) else [(d, {}) for d in deps] if isinstance(deps, list) else None
        if entries is None:
            errors.append(f"{w}.depends_on: must be a list or a mapping")
        else:
            for target, cfg in entries:
                cond = cfg.get("condition", "service_started") if isinstance(cfg, dict) else None
                if target not in services or target == name:
                    errors.append(f"{w}.depends_on: {target!r} is not another service in this file")
                elif cond not in _CONDITIONS:
                    errors.append(f"{w}.depends_on.{target}: condition must be one of {', '.join(_CONDITIONS)}")
                elif cond == "service_healthy" and not (isinstance(services[target], dict) and "healthcheck" in services[target]):
                    errors.append(f"{w}.depends_on.{target}: service_healthy needs a healthcheck on {target}")


def _validate_stack_env(w: str, svc: dict[str, Any], hosts: set[str], errors: list[str]) -> None:
    if "environment" not in svc:
        return
    seen: set[str] = set()
    for key, value in _env_items(svc["environment"], f"{w}.environment", errors):
        if not isinstance(key, str) or not _ENV_KEY_RE.match(key):
            errors.append(f"{w}.environment: {key!r} is not a valid variable name")
            continue
        if key in seen:
            errors.append(f"{w}.environment.{key}: set twice")
        seen.add(key)
        if value is None:
            errors.append(f"{w}.environment.{key}: needs a value (a bare name would read the server's own environment)")
            continue
        if isinstance(value, (dict, list)):
            errors.append(f"{w}.environment.{key}: must be a single value")
            continue
        text = str(value) if not isinstance(value, bool) else ("true" if value else "false")
        secret = bool(_SECRETISH_KEY_RE.search(key))
        if secret and not _SECRET_REF_RE.match(text):
            errors.append(f"{w}.environment.{key}: looks like a secret; write it only as ${{{key}}} so the person supplies it")
        elif not secret:
            _check_text_refs(text, f"{w}.environment.{key}", hosts, False, errors)


def _validate_stack_volumes(
    name: str, w: str, svc: dict[str, Any], volumes: dict[str, Any],
    mounts: dict[str, dict[str, list[tuple[str, str]]]], used_volumes: set[str], errors: list[str],
) -> None:
    if "volumes" not in svc:
        return
    if not isinstance(svc["volumes"], list):
        errors.append(f"{w}.volumes: must be a list")
        return
    targets: set[str] = set()
    for i, entry in enumerate(svc["volumes"]):
        where = f"{w}.volumes[{i}]"
        if isinstance(entry, dict):
            # Long form: only a named volume at a target, with nothing else.
            if set(entry) - {"type", "source", "target", "read_only"} or entry.get("type") != "volume":
                errors.append(f"{where}: write a named volume as `name:/path` or {{type: volume, source, target}}")
                continue
            source, target, opts = entry.get("source"), entry.get("target"), []
            if entry.get("read_only") is True:
                opts = ["ro"]
        elif isinstance(entry, str):
            parts = entry.split(":")
            if len(parts) not in (2, 3) or (len(parts) == 3 and parts[2] not in ("ro", "rw")):
                errors.append(f"{where}: must be `volume:/path` or `volume:/path:ro`")
                continue
            source, target = parts[0], parts[1]
        else:
            errors.append(f"{where}: must be a string such as `data:/data`")
            continue
        if not isinstance(source, str) or source.startswith(("/", ".", "~", "$")) or "/" in source:
            errors.append(f"{where}: host paths are not allowed in a recipe; use a named volume")
            continue
        if source not in volumes:
            errors.append(f"{where}: {source!r} is not declared under volumes")
            continue
        problem = _mount_target_problem(target)
        if problem:
            errors.append(f"{where}: target {problem}")
            continue
        if target in targets:
            errors.append(f"{where}: {target} is mounted twice")
        targets.add(target)
        used_volumes.add(source)
        mounts.setdefault(source, {}).setdefault(name, []).append((target, where))


def _validate_stack_healthcheck(w: str, svc: dict[str, Any], errors: list[str]) -> None:
    if "healthcheck" not in svc:
        return
    hc = svc["healthcheck"]
    if not isinstance(hc, dict) or "test" not in hc:
        errors.append(f"{w}.healthcheck: must be a mapping with a test")
        return
    for key in hc:
        if key not in ("test", "interval", "timeout", "start_period", "retries"):
            errors.append(f"{w}.healthcheck.{key}: not allowed (test, interval, timeout, start_period, retries)")
    test = hc["test"]
    if not (isinstance(test, str) or (isinstance(test, list) and test and all(isinstance(t, str) for t in test))):
        errors.append(f"{w}.healthcheck.test: must be a string or a list of strings")
    for key in ("interval", "timeout", "start_period"):
        if key in hc and not (isinstance(hc[key], str) and _DURATION_RE.match(hc[key])):
            errors.append(f"{w}.healthcheck.{key}: must be a duration such as 30s")
    if "retries" in hc and not _is_int(hc["retries"]):
        errors.append(f"{w}.healthcheck.retries: must be a whole number")


def _validate_stack_service_ext(w: str, ext: Any, exposed: list[int], errors: list[str]) -> str | None:
    """The per-service x-tend block; returns its gpu value."""
    if ext is None:
        if exposed:
            errors.append(f"{w}: exposes {exposed[0]} but has no x-tend.web_port; say which port the address routes to")
        return None
    where = f"{w}.x-tend"
    if not isinstance(ext, dict):
        errors.append(f"{where}: must be a mapping")
        return None
    for key in ext:
        if key not in ("address", "web_port", "internal", "swap", "gpu"):
            errors.append(f"{where}.{key}: unknown key (address, web_port, internal, swap, gpu)")
    internal = ext.get("internal") is True
    if "internal" in ext and not isinstance(ext["internal"], bool):
        errors.append(f"{where}.internal: must be true or false")
    if "address" in ext and not (isinstance(ext["address"], str) and _ADDRESS_LABEL_RE.match(ext["address"])):
        errors.append(f"{where}.address: must be lowercase letters, digits or dashes")
    if "swap" in ext and ext["swap"] not in ("side-by-side", "stop-first"):
        errors.append(f"{where}.swap: must be side-by-side or stop-first")
    if "web_port" in ext:
        port = ext["web_port"]
        if not _is_int(port) or port not in exposed:
            errors.append(f"{where}.web_port: must be one of the ports the service exposes")
    elif exposed and not internal:
        errors.append(f"{w}: exposes {exposed[0]} but has no x-tend.web_port; say which port the address routes to")
    if internal and ({"address", "web_port", "swap"} & set(ext)):
        errors.append(f"{where}.internal: cannot be combined with address, web_port or swap")
    if "gpu" in ext and ext["gpu"] != "optional":
        errors.append(f"{where}.gpu: the only value is optional")
    return ext.get("gpu") if ext.get("gpu") == "optional" else None


def _validate_stack_devices(w: str, svc: dict[str, Any], gpu: str | None, errors: list[str]) -> None:
    devices = svc.get("devices")
    if devices is None:
        if gpu:
            errors.append(f"{w}.x-tend.gpu: needs a /dev/dri entry under devices")
        return
    if not isinstance(devices, list) or not devices:
        errors.append(f"{w}.devices: must be a list")
        return
    for i, entry in enumerate(devices):
        m = _DEVICE_RE.match(entry) if isinstance(entry, str) else None
        if not m or (m.group(2) and m.group(2) != m.group(1)):
            errors.append(f"{w}.devices[{i}]: only /dev/dri or /dev/dri/renderD<N>, mapped to the same path, is allowed")
    if not gpu:
        errors.append(f"{w}.devices: a graphics device needs `x-tend: {{gpu: optional}}` so a server without one still deploys")


def _check_dependency_cycles(services: dict[str, Any], errors: list[str]) -> None:
    graph: dict[str, list[str]] = {}
    for name, svc in services.items():
        deps = svc.get("depends_on") if isinstance(svc, dict) else None
        graph[name] = [d for d in (deps.keys() if isinstance(deps, dict) else deps if isinstance(deps, list) else []) if d in services]
    state: dict[str, int] = {}

    def visit(node: str) -> bool:
        if state.get(node) == 1:
            return True
        if state.get(node) == 2:
            return False
        state[node] = 1
        if any(visit(n) for n in graph.get(node, [])):
            return True
        state[node] = 2
        return False

    if any(visit(n) for n in graph):
        errors.append(f"{COMPOSE_FILE}: depends_on forms a cycle")


def _validate_stack_storage(
    ext: Any, volumes: dict[str, Any], services: dict[str, Any],
    mounts: dict[str, dict[str, list[tuple[str, str]]]], errors: list[str],
) -> None:
    w = f"{COMPOSE_FILE}: x-tend"
    if ext is None:
        return
    if not isinstance(ext, dict):
        errors.append(f"{w}: must be a mapping")
        return
    for key in ext:
        if key != "storage":
            errors.append(f"{w}.{key}: unknown key (storage)")
    storage = ext.get("storage")
    if storage is None:
        return
    if not isinstance(storage, dict):
        errors.append(f"{w}.storage: must be a mapping of questions")
        return
    roots: dict[str, str] = {}
    for qname, q in storage.items():
        where = f"{w}.storage.{qname}"
        if qname not in volumes:
            errors.append(f"{where}: no volume of the same name under volumes; a question binds to the volume with its key")
        if not isinstance(q, dict):
            errors.append(f"{where}: must be a mapping with a prompt")
            continue
        for key in q:
            if key not in _STORAGE_KEYS:
                errors.append(
                    f"{where}.{key}: not allowed; a question carries only prompt and mount_root, "
                    "never a folder, a default path or an answer"
                )
        if not _is_text(q.get("prompt"), limit=120):
            errors.append(f"{where}.prompt: required, plain text up to 120 characters")
        root = q.get("mount_root")
        if "mount_root" in q:
            problem = _mount_target_problem(root)
            if problem:
                errors.append(f"{where}.mount_root {problem}")
            else:
                roots[qname] = root
                for svc, entries in mounts.get(qname, {}).items():
                    for target, path in entries:
                        if target != root:
                            errors.append(f"{COMPOSE_FILE}: services.{svc}: {path}: must mount at {root} (x-tend.storage.{qname})")
    # No two questions may share or nest a target inside one service.
    for svc in services:
        seen: list[tuple[str, str]] = []
        for qname in storage:
            for target, _ in mounts.get(qname, {}).get(svc, []):
                for other_q, other_t in seen:
                    if target == other_t or target.startswith(other_t + "/") or other_t.startswith(target + "/"):
                        errors.append(
                            f"{COMPOSE_FILE}: services.{svc}: storage questions {other_q} ({other_t}) and {qname} ({target}) "
                            "share or nest a mount target"
                        )
                seen.append((qname, target))
    # The same holds for the questions' own roots, even in a service that mounts only one of them.
    items = sorted(roots.items())
    for i, (qa, ra) in enumerate(items):
        for qb, rb in items[i + 1:]:
            if ra == rb or ra.startswith(rb + "/") or rb.startswith(ra + "/"):
                errors.append(f"{w}.storage: {qa} ({ra}) and {qb} ({rb}) share or nest a mount_root")


def stack_catalog_entry(recipe: dict[str, Any], compose_text: str) -> dict[str, Any]:
    """The community-catalog entry of a stack recipe (decision D5): the file inline, its sha256, no image."""
    entry = {key: recipe[key] for key in STACK_RECIPE_KEYS}
    entry.update(
        source="compose",
        source_ref="",
        default_port=0,
        env_hints=[],
        volumes=[],
        needs_dbs=[],
        compose=compose_text,
        compose_sha256=hashlib.sha256(compose_text.encode("utf-8")).hexdigest(),
    )
    return entry



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
    """Validate one `recipes/<slug>/` folder; return its catalog entry or raise RecipeError.

    An image recipe's entry is its recipe.json; a stack recipe's is built from recipe.json and compose.yaml."""
    errors: list[str] = []
    if folder.is_symlink() or not folder.is_dir():
        raise RecipeError([f"{folder.name}: must be a directory"])
    names = {p.name for p in folder.iterdir()}
    recipe: dict[str, Any] = {}
    recipe_errors: list[str] = []
    if RECIPE_FILE in names:
        try:
            recipe = read_json_object(folder / RECIPE_FILE)
            recipe_errors = validate_recipe_data(recipe, folder=folder.name, builtin_slugs=builtin_slugs)
        except RecipeError as exc:
            recipe_errors = exc.errors
    is_stack = recipe.get("kind") == STACK_KIND
    allowed = STACK_ALLOWED_FILES if is_stack else ALLOWED_FILES
    only = f"{RECIPE_FILE}, {LISTING_FILE} and {COMPOSE_FILE}" if is_stack else f"{RECIPE_FILE} and {LISTING_FILE}"
    for extra in sorted(names - allowed):
        errors.append(f"{extra}: not allowed in a recipe folder (only {only})")
    for needed in sorted(allowed - names):
        errors.append(f"{needed}: missing")
    errors.extend(recipe_errors)
    compose_text = ""
    if is_stack and COMPOSE_FILE in names:
        path = folder / COMPOSE_FILE
        if path.is_symlink() or not path.is_file():
            errors.append(f"{COMPOSE_FILE}: must be a regular file")
        elif path.stat().st_size > MAX_COMPOSE_BYTES:
            errors.append(f"{COMPOSE_FILE}: larger than {MAX_COMPOSE_BYTES} bytes")
        else:
            try:
                compose_text = path.read_bytes().decode("utf-8")
            except UnicodeDecodeError:
                errors.append(f"{COMPOSE_FILE}: must be UTF-8 text")
            else:
                try:
                    errors.extend(validate_stack_compose(compose_text))
                except RecipeError as exc:
                    errors.extend(exc.errors)
    if LISTING_FILE in names:
        try:
            errors.extend(validate_listing_data(read_json_object(folder / LISTING_FILE)))
        except RecipeError as exc:
            errors.extend(exc.errors)
    if errors:
        raise RecipeError([f"recipes/{folder.name}/{e}" for e in errors])
    return stack_catalog_entry(recipe, compose_text) if is_stack else recipe


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
