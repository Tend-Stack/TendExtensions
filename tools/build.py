#!/usr/bin/env python3
"""Build the TendExtensions registry.

For every folder under `extensions/`:
  1. Load `extension.json` and `listing.json`.
  2. Rebuild the manifest's `integrity` map from the files actually on disk
     (every shipped file except `extension.json` and `listing.json` itself)
     and rewrite `extension.json` in place — the integrity map is generated,
     never hand-edited.
  3. Validate the manifest against the same rules the panel's
     `parse_manifest` enforces (re-implemented here; this script never
     imports the panel at runtime — see `validate_with_panel.py` for that).
  4. Build a deterministic ZIP at `dist/<id>-<version>.zip` (sorted
     members, fixed mtime, no directory entries, no dotfiles, no
     `listing.json` inside the archive, manifest at the root).

Then writes `dist/registry.json` (schema 1) covering every extension,
sorted by id. `--sequence`/`--revision` override the git-derived defaults
(`git rev-list --count HEAD` / `git rev-parse HEAD`) for tests and for CI
runs on a shallow or detached checkout.

Running this script twice against an unchanged `extensions/` tree produces
byte-identical ZIPs (registry.json legitimately differs — it carries
`generated_at`).
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
import subprocess
import sys
import time
import zipfile
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent

# ---------- re-implementation of the panel's manifest rules ----------
# Mirrors app.services.extensions.parse_manifest in the Tend panel core
# (backend/app/services/extensions.py). Kept in sync by hand; a stricter,
# ground-truth check against the real panel code runs in
# validate_with_panel.py.

_ID_RE = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9._\-]{1,127}$")
_VERSION_RE = re.compile(r"^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$")

KNOWN_PERMISSIONS = {
    "storage",
    "notifications",
    "network",
    "files.read",
    "documents.read",
    "documents.write",
    "documents.backup",
    "sites.source.read",
    "sites.source.connect",
    "sites.source.write",
    "sites.create",
    "sites.preview",
    "sites.publish",
}
KNOWN_UI_KINDS = {"shell-app", "tool-window"}
KNOWN_RUNTIME_KINDS = {"game", "utility"}
KNOWN_CATEGORIES = {
    "games",
    "utilities",
    "productivity",
    "media",
    "developer-tools",
    "communication",
    "other",
}
KNOWN_RUNTIME_MODULES = {"phaser@4"}
KNOWN_RUNTIME_KEYS = {"api", "kind", "modules", "pauseWhenHidden", "targetFps"}

# Files never shipped inside the ZIP or covered by the integrity map.
_LISTING_NAME = "listing.json"
_MANIFEST_NAME = "extension.json"


class BuildError(Exception):
    """A problem with an extension's manifest, listing, or on-disk files.
    Raised with a message specific enough to fix without re-reading this
    script."""


def _valid_id(ext_id: str) -> bool:
    if not isinstance(ext_id, str) or not _ID_RE.match(ext_id):
        return False
    return "/" not in ext_id and "\\" not in ext_id and ".." not in ext_id


def validate_manifest(manifest: dict[str, Any], *, ext_id_hint: str) -> None:
    """Raise BuildError on anything the panel's parse_manifest would also
    reject. Assumes `manifest["integrity"]` already reflects the files on
    disk (rebuild_integrity runs before this)."""
    if not isinstance(manifest, dict):
        raise BuildError(f"{ext_id_hint}: extension.json must be a JSON object")

    schema = manifest.get("schema", 1)
    if schema not in (1, 2):
        raise BuildError(f"{ext_id_hint}: 'schema' must be 1 or 2, got {schema!r}")

    for field in ("id", "name", "version"):
        if not isinstance(manifest.get(field), str) or not manifest[field].strip():
            raise BuildError(f"{ext_id_hint}: missing required field '{field}'")

    if manifest["id"] != ext_id_hint:
        raise BuildError(
            f"{ext_id_hint}: manifest id {manifest['id']!r} does not match its folder name"
        )
    if not _valid_id(manifest["id"]):
        raise BuildError(
            f"{ext_id_hint}: 'id' must be reverse-DNS-style "
            "(letters, digits, dots, dashes, underscores; 2-128 chars)"
        )
    if not _VERSION_RE.match(manifest["version"]):
        raise BuildError(
            f"{ext_id_hint}: 'version' must be strict x.y.z, got {manifest['version']!r}"
        )

    perms = manifest.get("permissions") or []
    if not isinstance(perms, list) or not all(isinstance(p, str) for p in perms):
        raise BuildError(f"{ext_id_hint}: 'permissions' must be a list of strings")
    unknown_perms = sorted(set(perms) - KNOWN_PERMISSIONS)
    if unknown_perms:
        raise BuildError(
            f"{ext_id_hint}: unknown permission(s): {', '.join(unknown_perms)}"
        )

    category = manifest.get("category")
    if category is not None and (
        not isinstance(category, str) or category not in KNOWN_CATEGORIES
    ):
        raise BuildError(
            f"{ext_id_hint}: 'category' must be one of {sorted(KNOWN_CATEGORIES)}"
        )

    ui = manifest.get("ui")
    if ui is not None:
        if not isinstance(ui, dict):
            raise BuildError(f"{ext_id_hint}: 'ui' must be an object")
        if schema == 1:
            if not isinstance(ui.get("entry"), str) or not ui["entry"].strip():
                raise BuildError(f"{ext_id_hint}: 'ui.entry' is required when 'ui' is set")
            kind = ui.get("kind") or "shell-app"
            if kind not in KNOWN_UI_KINDS:
                raise BuildError(f"{ext_id_hint}: 'ui.kind' must be one of {sorted(KNOWN_UI_KINDS)}")
        else:
            if not isinstance(ui.get("module"), str) or not ui["module"].strip():
                raise BuildError(f"{ext_id_hint}: schema-2 'ui.module' is required when 'ui' is set")
            mount = ui.get("mount") or "shell-app"
            if mount not in KNOWN_UI_KINDS:
                raise BuildError(f"{ext_id_hint}: 'ui.mount' must be one of {sorted(KNOWN_UI_KINDS)}")

    if schema == 2:
        runtime = manifest.get("runtime")
        if runtime is not None:
            if not isinstance(runtime, dict):
                raise BuildError(f"{ext_id_hint}: schema-2 'runtime' must be an object")
            unknown_keys = sorted(set(runtime) - KNOWN_RUNTIME_KEYS)
            if unknown_keys:
                raise BuildError(
                    f"{ext_id_hint}: 'runtime' has unknown field(s): {', '.join(unknown_keys)}"
                )
            if runtime.get("api") != 1:
                raise BuildError(f"{ext_id_hint}: 'runtime.api' must be 1")
            if runtime.get("kind") not in KNOWN_RUNTIME_KINDS:
                raise BuildError(
                    f"{ext_id_hint}: 'runtime.kind' must be one of {sorted(KNOWN_RUNTIME_KINDS)}"
                )
            modules = runtime.get("modules", [])
            if not isinstance(modules, list) or not all(isinstance(m, str) for m in modules):
                raise BuildError(f"{ext_id_hint}: 'runtime.modules' must be a list of strings")
            if len(modules) != len(set(modules)):
                raise BuildError(f"{ext_id_hint}: 'runtime.modules' cannot contain duplicates")
            unknown_modules = sorted(set(modules) - KNOWN_RUNTIME_MODULES)
            if unknown_modules:
                raise BuildError(
                    f"{ext_id_hint}: unsupported runtime module(s): {', '.join(unknown_modules)}"
                )
            pause_when_hidden = runtime.get("pauseWhenHidden", True)
            if not isinstance(pause_when_hidden, bool):
                raise BuildError(f"{ext_id_hint}: 'runtime.pauseWhenHidden' must be true or false")
            target_fps = runtime.get("targetFps", 60)
            if isinstance(target_fps, bool) or not isinstance(target_fps, int) or not 15 <= target_fps <= 120:
                raise BuildError(f"{ext_id_hint}: 'runtime.targetFps' must be an integer from 15 to 120")

        integrity = manifest.get("integrity")
        if not isinstance(integrity, dict) or not integrity:
            raise BuildError(f"{ext_id_hint}: schema-2 manifest must include a non-empty 'integrity' map")
        for key, value in integrity.items():
            if not isinstance(key, str) or not isinstance(value, str) or not value.startswith("sha256-"):
                raise BuildError(
                    f"{ext_id_hint}: 'integrity' entries must be 'sha256-<base64>' strings (bad key {key!r})"
                )


LISTING_REQUIRED_STR_FIELDS = ("publisher", "category", "release_notes")
LISTING_REQUIRED_BOOL_FIELDS = ("featured", "reviewed")


def validate_listing(listing: dict[str, Any], ext_id: str) -> None:
    if not isinstance(listing, dict):
        raise BuildError(f"{ext_id}: listing.json must be a JSON object")
    for field in LISTING_REQUIRED_STR_FIELDS:
        if not isinstance(listing.get(field), str) or not listing[field].strip():
            raise BuildError(f"{ext_id}: listing.json missing required string field '{field}'")
    if listing["category"] not in KNOWN_CATEGORIES:
        raise BuildError(f"{ext_id}: listing.json 'category' must be one of {sorted(KNOWN_CATEGORIES)}")
    for field in LISTING_REQUIRED_BOOL_FIELDS:
        if not isinstance(listing.get(field), bool):
            raise BuildError(f"{ext_id}: listing.json field '{field}' must be true or false")
    features = listing.get("features")
    if not isinstance(features, list) or not all(isinstance(f, str) and f.strip() for f in features):
        raise BuildError(f"{ext_id}: listing.json 'features' must be a list of non-empty strings")
    if not 3 <= len(features) <= 6:
        raise BuildError(f"{ext_id}: listing.json 'features' must have 3-6 entries, got {len(features)}")
    requirements = listing.get("requirements")
    if not isinstance(requirements, list) or not requirements or not all(
        isinstance(r, str) and r.strip() for r in requirements
    ):
        raise BuildError(f"{ext_id}: listing.json 'requirements' must be a non-empty list of strings")
    homepage = listing.get("homepage")
    if homepage is not None and not isinstance(homepage, str):
        raise BuildError(f"{ext_id}: listing.json 'homepage' must be a string when present")


# ---------- files on disk ----------


def _reject_dotfiles(ext_dir: Path, rel_parts: tuple[str, ...]) -> None:
    if any(part.startswith(".") for part in rel_parts):
        raise BuildError(f"{ext_dir.name}: dotfile not allowed: {'/'.join(rel_parts)}")


def iter_ext_files(ext_dir: Path) -> list[tuple[Path, str]]:
    """Every real file under an extension folder, sorted by posix-relative
    path. Rejects dotfiles and directory entries are never yielded (we
    only walk real files, so a ZIP built from this list never carries
    directory entries)."""
    out: list[tuple[Path, str]] = []
    for path in sorted(ext_dir.rglob("*")):
        if path.is_dir():
            continue
        rel = path.relative_to(ext_dir)
        _reject_dotfiles(ext_dir, rel.parts)
        out.append((path, rel.as_posix()))
    out.sort(key=lambda item: item[1])
    return out


def package_files(ext_dir: Path) -> list[tuple[Path, str]]:
    """Files that ship inside the ZIP: everything except listing.json."""
    return [(p, r) for p, r in iter_ext_files(ext_dir) if r != _LISTING_NAME]


def integrity_files(ext_dir: Path) -> list[tuple[Path, str]]:
    """Files that must be covered by the integrity map: everything except
    listing.json (never shipped) and extension.json itself (can't hash
    itself while its own content is the thing being written)."""
    return [
        (p, r)
        for p, r in iter_ext_files(ext_dir)
        if r not in (_LISTING_NAME, _MANIFEST_NAME)
    ]


def sha256_b64(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(64 * 1024), b""):
            h.update(chunk)
    return "sha256-" + base64.b64encode(h.digest()).decode("ascii")


def rebuild_integrity(ext_dir: Path) -> dict[str, str]:
    return {rel: sha256_b64(path) for path, rel in integrity_files(ext_dir)}


def check_full_coverage(ext_dir: Path, integrity: dict[str, str]) -> None:
    """Both directions: every file that needs a hash has one, and no
    integrity entry survives for a file that isn't there."""
    on_disk = {rel for _, rel in integrity_files(ext_dir)}
    mapped = set(integrity)
    missing = sorted(on_disk - mapped)
    if missing:
        raise BuildError(f"{ext_dir.name}: file(s) not covered by integrity map: {missing}")
    stale = sorted(mapped - on_disk)
    if stale:
        raise BuildError(f"{ext_dir.name}: integrity map references missing file(s): {stale}")


# ---------- per-extension build ----------


def load_json(path: Path, *, what: str) -> dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise BuildError(f"{path.parent.name}: missing {what} ({path})") from None
    except json.JSONDecodeError as exc:
        raise BuildError(f"{path.parent.name}: {what} is not valid JSON: {exc}") from exc


def rewrite_manifest(ext_dir: Path, manifest: dict[str, Any]) -> None:
    text = json.dumps(manifest, indent=2, ensure_ascii=True) + "\n"
    (ext_dir / _MANIFEST_NAME).write_text(text, encoding="utf-8")


def build_zip(ext_dir: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        dest.unlink()
    with zipfile.ZipFile(dest, "w") as zf:
        for path, rel in package_files(ext_dir):
            info = zipfile.ZipInfo(rel, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (0o644 & 0xFFFF) << 16
            zf.writestr(info, path.read_bytes())


def build_one(ext_dir: Path, dist_dir: Path, *, revision: str) -> dict[str, Any]:
    ext_id = ext_dir.name
    manifest = load_json(ext_dir / _MANIFEST_NAME, what="extension.json")
    listing = load_json(ext_dir / _LISTING_NAME, what="listing.json")

    validate_listing(listing, ext_id)

    integrity = rebuild_integrity(ext_dir)
    check_full_coverage(ext_dir, integrity)
    manifest["integrity"] = integrity
    validate_manifest(manifest, ext_id_hint=ext_id)
    rewrite_manifest(ext_dir, manifest)

    version = manifest["version"]
    zip_name = f"{ext_id}-{version}.zip"
    zip_path = dist_dir / zip_name
    build_zip(ext_dir, zip_path)
    zip_bytes = zip_path.read_bytes()

    return {
        "id": ext_id,
        "name": manifest["name"],
        "version": version,
        "publisher": listing["publisher"],
        "description": manifest.get("description", ""),
        "category": listing["category"],
        "featured": listing["featured"],
        "reviewed": listing["reviewed"],
        "features": listing["features"],
        "requirements": listing["requirements"],
        "permissions": manifest.get("permissions") or [],
        "release_notes": listing["release_notes"],
        "path": f"extensions/{ext_id}",
        "homepage": (
            f"https://github.com/Tend-Stack/TendExtensions/tree/{revision}/extensions/{ext_id}"
        ),
        "package": {
            "name": zip_name,
            "bytes": len(zip_bytes),
            "sha256": hashlib.sha256(zip_bytes).hexdigest(),
        },
    }


def discover_extension_ids(extensions_dir: Path) -> list[str]:
    if not extensions_dir.is_dir():
        raise BuildError(f"{extensions_dir} does not exist")
    return sorted(p.name for p in extensions_dir.iterdir() if p.is_dir())


def _git(repo_root: Path, *args: str) -> str:
    return subprocess.check_output(["git", "-C", str(repo_root), *args], text=True).strip()


def run(
    repo_root: Path,
    *,
    sequence: int | None = None,
    revision: str | None = None,
) -> dict[str, Any]:
    extensions_dir = repo_root / "extensions"
    dist_dir = repo_root / "dist"
    dist_dir.mkdir(parents=True, exist_ok=True)

    if revision is None:
        revision = _git(repo_root, "rev-parse", "HEAD")
    if not re.fullmatch(r"[0-9a-f]{40}", revision):
        raise BuildError(f"revision must be a 40-hex commit sha, got {revision!r}")

    if sequence is None:
        sequence = int(_git(repo_root, "rev-list", "--count", "HEAD"))
    if sequence < 0:
        raise BuildError(f"sequence must be >= 0, got {sequence}")

    ids = discover_extension_ids(extensions_dir)
    if not ids:
        raise BuildError("no extensions found under extensions/")

    entries = [build_one(extensions_dir / ext_id, dist_dir, revision=revision) for ext_id in ids]
    entries.sort(key=lambda e: e["id"])

    registry = {
        "schema": 1,
        "registry_id": "tend-extensions",
        "sequence": sequence,
        "revision": revision,
        "generated_at": int(time.time()),
        "extensions": entries,
    }
    (dist_dir / "registry.json").write_text(
        json.dumps(registry, indent=2, ensure_ascii=True) + "\n", encoding="utf-8"
    )
    return registry


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build the TendExtensions registry")
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT)
    parser.add_argument("--sequence", type=int, default=None)
    parser.add_argument("--revision", type=str, default=None)
    args = parser.parse_args(argv)

    try:
        registry = run(args.repo_root, sequence=args.sequence, revision=args.revision)
    except BuildError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    for entry in registry["extensions"]:
        print(f"  {entry['id']}  {entry['version']}  {entry['package']['name']}")
    print(f"sequence={registry['sequence']} revision={registry['revision']}")
    print(f"wrote {len(registry['extensions'])} package(s) + dist/registry.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
