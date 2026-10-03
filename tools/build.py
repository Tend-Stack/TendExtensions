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
import math
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
    "email",
    "mascot",
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
    "ondacast",
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
    "themes",
    "other",
}
KNOWN_RUNTIME_MODULES = {"phaser@4"}
KNOWN_RUNTIME_KEYS = {"api", "kind", "modules", "pauseWhenHidden", "targetFps"}

# ---------- shelf widgets (schema-2 only) ----------
# Mirrors app.services.extensions._parse_widgets in the panel core: same
# field rules, same normalized shape. A package that fails this never
# reaches validate_with_panel.py's ground-truth check.
KNOWN_WIDGET_SIZES = ("small", "wide")
KNOWN_WIDGET_KEYS = {"id", "name", "description", "sizes", "module", "preview"}
MAX_WIDGETS_PER_EXTENSION = 8
MAX_WIDGET_NAME_CHARS = 60
MAX_WIDGET_DESCRIPTION_CHARS = 160
WIDGET_MODULE_SUFFIXES = (".js", ".mjs")
WIDGET_PREVIEW_SUFFIXES = (".svg", ".png", ".webp")
_WIDGET_ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,39}$")

# ---------- theme packs (schema-2, category "themes") ----------
# Mirrors the panel core's theme-pack rules (THEME_CONTRACT v1): a pack is a
# declarative `theme` object plus images, never code. Every value that ends up
# in CSS passes the closed colour grammar below; nothing free-form is accepted.
THEME_CATEGORY = "themes"
THEME_API = 1
THEME_MODES = ("dark", "light")
THEME_POSITIONS = ("center", "top", "bottom", "left", "right")
THEME_SHAPES = ("sharp", "default", "round")
THEME_LABELS = ("light", "dark")
THEME_IMAGE_SUFFIXES = (".webp", ".jpg", ".jpeg", ".png", ".avif")
THEME_FORBIDDEN_SUFFIXES = (".js", ".mjs", ".html", ".htm", ".css", ".svg", ".wasm")
THEME_FORBIDDEN_MANIFEST_KEYS = ("ui", "runtime", "widgets")
THEME_MAX_WALLPAPER_BYTES = 4 * 1024 * 1024
THEME_MAX_THUMB_BYTES = 512 * 1024
THEME_MAX_GLOWS = 4
THEME_MIN_CONTRAST = 4.5
THEME_MAX_PATH_CHARS = 128
THEME_MAX_COLOR_CHARS = 64
THEME_MAX_NAME_CHARS = 40
THEME_MAX_DESCRIPTION_CHARS = 160

_NUM = r"\d{1,3}(?:\.\d{1,4})?"
_OKLCH_RE = re.compile(
    rf"^oklch\(\s*({_NUM})%\s+({_NUM})\s+({_NUM})(?:\s*/\s*(\d(?:\.\d{{1,4}})?))?\s*\)$"
)
_HEX_RE = re.compile(r"^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$")

KNOWN_THEME_KEYS = {"api", "modes", "wallpaper", "palette", "surface", "icons", "shell"}
KNOWN_WALLPAPER_KEYS = {"image", "thumb", "position", "veil", "gradient", "fallback"}
KNOWN_PALETTE_KEYS = {"primary", "secondary", "primaryContent", "highlight"}
KNOWN_SHELL_KEYS = {"topBar", "glass", "shape", "desktopLabels", "shadow", "wallpaperDim"}


def _theme_error(ext_id: str, where: str, message: str) -> BuildError:
    return BuildError(f"{ext_id}: theme{'.' + where if where else ''}: {message}")


def _theme_object(raw: object, allowed: set[str], *, ext_id: str, where: str) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise _theme_error(ext_id, where, "must be an object")
    unknown = sorted(set(raw) - allowed)
    if unknown:
        raise _theme_error(ext_id, where, f"unknown key(s): {', '.join(unknown)}")
    return raw


def _theme_number(raw: object, lo: float, hi: float, *, ext_id: str, where: str) -> float:
    if isinstance(raw, bool) or not isinstance(raw, (int, float)) or not math.isfinite(raw):
        raise _theme_error(ext_id, where, "must be a JSON number")
    if not lo <= raw <= hi:
        raise _theme_error(ext_id, where, f"must be between {lo} and {hi}, got {raw!r}")
    return float(raw)


def _theme_enum(raw: object, allowed: tuple[str, ...], *, ext_id: str, where: str) -> str:
    if not isinstance(raw, str) or raw not in allowed:
        raise _theme_error(ext_id, where, f"must be one of {list(allowed)}")
    return raw


def parse_theme_color(raw: object, *, ext_id: str, where: str) -> tuple[float, float, float]:
    """Validate a `<color>` against the closed grammar and return its
    approximate sRGB triple (0..1, gamut-clipped, alpha ignored)."""
    if not isinstance(raw, str):
        raise _theme_error(ext_id, where, "colour must be a string")
    text = raw.strip().lower()
    if len(text) > THEME_MAX_COLOR_CHARS:
        raise _theme_error(ext_id, where, f"colour is longer than {THEME_MAX_COLOR_CHARS} characters")
    match = _OKLCH_RE.fullmatch(text)
    if match:
        lightness, chroma, hue = (float(match.group(i)) for i in (1, 2, 3))
        alpha = match.group(4)
        if lightness > 100 or chroma > 0.4 or hue > 360 or (alpha is not None and float(alpha) > 1):
            raise _theme_error(
                ext_id, where, f"oklch out of range (L 0-100%, C 0-0.4, H 0-360, A 0-1): {raw!r}"
            )
        return _oklch_to_srgb(lightness / 100, chroma, hue)
    if _HEX_RE.fullmatch(text):
        digits = text[1:]
        if len(digits) in (3, 4):
            digits = "".join(c * 2 for c in digits)
        return tuple(int(digits[i : i + 2], 16) / 255 for i in (0, 2, 4))  # type: ignore[return-value]
    raise _theme_error(
        ext_id, where, f"colour must be oklch(L% C H [/ A]) or #rgb/#rrggbb/#rrggbbaa, got {raw!r}"
    )


def _oklch_to_srgb(lightness: float, chroma: float, hue: float) -> tuple[float, float, float]:
    a = chroma * math.cos(math.radians(hue))
    b = chroma * math.sin(math.radians(hue))
    l_ = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m_ = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s_ = (lightness - 0.0894841775 * a - 1.2914855480 * b) ** 3
    linear = (
        4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
        -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
        -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_,
    )

    def encode(c: float) -> float:
        c = max(0.0, min(1.0, c))
        return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055

    return tuple(encode(c) for c in linear)  # type: ignore[return-value]


def _relative_luminance(rgb: tuple[float, float, float]) -> float:
    def lin(c: float) -> float:
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (lin(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(a: tuple[float, float, float], b: tuple[float, float, float]) -> float:
    la, lb = _relative_luminance(a), _relative_luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def _theme_path(raw: object, suffixes: tuple[str, ...], integrity: dict[str, Any], *, ext_id: str, where: str) -> str:
    if not isinstance(raw, str) or not raw:
        raise _theme_error(ext_id, where, "must be a package-relative file path")
    if (
        len(raw) > THEME_MAX_PATH_CHARS
        or "\\" in raw
        or ":" in raw
        or raw.startswith("/")
        or any(part in ("", ".", "..") for part in raw.split("/"))
    ):
        raise _theme_error(
            ext_id, where, f"must be a relative '/'-separated path inside the package (no '..', no ':'), got {raw!r}"
        )
    if not raw.lower().endswith(suffixes):
        raise _theme_error(ext_id, where, f"must end with one of {', '.join(suffixes)}, got {raw!r}")
    if raw not in integrity:
        raise _theme_error(ext_id, where, f"{raw!r} is not covered by the integrity map (file must exist in the package)")
    return raw


def _validate_mode_map(
    raw: object, *, ext_id: str, where: str, required: bool, check: Any
) -> None:
    # Contract Addendum B: every per-mode object (veil, fallback, gradient,
    # topBar.tint, palette) needs both modes. `required` is kept for call-site
    # readability; a present map is always complete.
    obj = _theme_object(raw, set(THEME_MODES), ext_id=ext_id, where=where)
    for mode in THEME_MODES:
        if mode not in obj:
            raise _theme_error(ext_id, where, f"missing '{mode}'")
        check(obj[mode], f"{where}.{mode}")


def validate_theme(manifest: dict[str, Any], ext_id: str) -> None:
    """Validate a theme pack's manifest (the `theme` block and the rules
    around it). File-level rules (sizes, magic bytes, forbidden files) live in
    `validate_theme_files`."""
    theme = manifest.get("theme")
    is_theme_category = manifest.get("category") == THEME_CATEGORY
    if theme is None:
        if is_theme_category:
            raise BuildError(f"{ext_id}: category 'themes' requires a 'theme' object")
        return
    if not is_theme_category:
        raise BuildError(f"{ext_id}: a 'theme' object requires category 'themes'")
    if manifest.get("schema") != 2:
        raise BuildError(f"{ext_id}: theme packs require schema 2")
    if manifest.get("permissions"):
        raise BuildError(f"{ext_id}: a theme pack must declare no permissions")
    if len(manifest["name"]) > THEME_MAX_NAME_CHARS:
        raise BuildError(f"{ext_id}: theme pack 'name' must be at most {THEME_MAX_NAME_CHARS} characters")
    description = manifest.get("description", "")
    if not isinstance(description, str) or len(description) > THEME_MAX_DESCRIPTION_CHARS:
        raise BuildError(
            f"{ext_id}: theme pack 'description' must be a string of at most {THEME_MAX_DESCRIPTION_CHARS} characters"
        )
    integrity = manifest["integrity"]

    def color(raw: object, where: str) -> tuple[float, float, float]:
        return parse_theme_color(raw, ext_id=ext_id, where=where)

    def number(raw: object, lo: float, hi: float, where: str) -> float:
        return _theme_number(raw, lo, hi, ext_id=ext_id, where=where)

    theme = _theme_object(theme, KNOWN_THEME_KEYS, ext_id=ext_id, where="")
    if theme.get("api") != THEME_API or isinstance(theme.get("api"), bool):
        raise _theme_error(ext_id, "api", f"must be {THEME_API}")

    if "modes" in theme:
        modes = theme["modes"]
        if (
            not isinstance(modes, list)
            or not modes
            or not all(isinstance(m, str) and m in THEME_MODES for m in modes)
            or len(set(modes)) != len(modes)
        ):
            raise _theme_error(ext_id, "modes", f"must be a non-empty list of distinct values from {list(THEME_MODES)}")

    # wallpaper
    wallpaper = _theme_object(theme.get("wallpaper"), KNOWN_WALLPAPER_KEYS, ext_id=ext_id, where="wallpaper")
    has_image, has_gradient = "image" in wallpaper, "gradient" in wallpaper
    if has_image == has_gradient:
        raise _theme_error(ext_id, "wallpaper", "must set exactly one of 'image' or 'gradient'")
    if has_image:
        _theme_path(wallpaper["image"], THEME_IMAGE_SUFFIXES, integrity, ext_id=ext_id, where="wallpaper.image")
        if "thumb" not in wallpaper:
            raise _theme_error(ext_id, "wallpaper.thumb", "is required with 'image'")
        _theme_path(wallpaper["thumb"], THEME_IMAGE_SUFFIXES, integrity, ext_id=ext_id, where="wallpaper.thumb")
    elif "thumb" in wallpaper:
        raise _theme_error(ext_id, "wallpaper.thumb", "is only allowed together with 'image'")
    if "position" in wallpaper:
        _theme_enum(wallpaper["position"], THEME_POSITIONS, ext_id=ext_id, where="wallpaper.position")

    def check_veil(raw: object, where: str) -> None:
        veil = _theme_object(raw, {"color", "top", "middle", "bottom"}, ext_id=ext_id, where=where)
        if set(veil) != {"color", "top", "middle", "bottom"}:
            raise _theme_error(ext_id, where, "needs color, top, middle and bottom")
        color(veil["color"], f"{where}.color")
        for key in ("top", "middle", "bottom"):
            number(veil[key], 0, 1, f"{where}.{key}")

    if "veil" in wallpaper:
        _validate_mode_map(wallpaper["veil"], ext_id=ext_id, where="wallpaper.veil", required=False, check=check_veil)

    def check_gradient(raw: object, where: str) -> None:
        grad = _theme_object(raw, {"base", "glows"}, ext_id=ext_id, where=where)
        if "base" not in grad:
            raise _theme_error(ext_id, where, "needs a 'base' colour")
        color(grad["base"], f"{where}.base")
        glows = grad.get("glows", [])
        if not isinstance(glows, list) or len(glows) > THEME_MAX_GLOWS:
            raise _theme_error(ext_id, f"{where}.glows", f"must be a list of at most {THEME_MAX_GLOWS} glows")
        for i, glow in enumerate(glows):
            gwhere = f"{where}.glows[{i}]"
            glow = _theme_object(glow, {"x", "y", "w", "h", "color", "alpha"}, ext_id=ext_id, where=gwhere)
            if set(glow) != {"x", "y", "w", "h", "color", "alpha"}:
                raise _theme_error(ext_id, gwhere, "needs x, y, w, h, color and alpha")
            number(glow["x"], 0, 100, f"{gwhere}.x")
            number(glow["y"], 0, 100, f"{gwhere}.y")
            number(glow["w"], 10, 150, f"{gwhere}.w")
            number(glow["h"], 10, 150, f"{gwhere}.h")
            number(glow["alpha"], 0, 1, f"{gwhere}.alpha")
            color(glow["color"], f"{gwhere}.color")

    if has_gradient:
        _validate_mode_map(
            wallpaper["gradient"], ext_id=ext_id, where="wallpaper.gradient", required=True, check=check_gradient
        )
    if "fallback" in wallpaper:
        _validate_mode_map(
            wallpaper["fallback"], ext_id=ext_id, where="wallpaper.fallback", required=False,
            check=lambda raw, where: color(raw, where),
        )

    # palette
    def check_palette(raw: object, where: str) -> None:
        pal = _theme_object(raw, KNOWN_PALETTE_KEYS, ext_id=ext_id, where=where)
        for key in ("primary", "secondary", "primaryContent"):
            if key not in pal:
                raise _theme_error(ext_id, where, f"missing '{key}'")
        colours = {key: color(value, f"{where}.{key}") for key, value in pal.items()}
        ratio = contrast_ratio(colours["primary"], colours["primaryContent"])
        if ratio < THEME_MIN_CONTRAST:
            raise _theme_error(
                ext_id, where,
                f"primary/primaryContent contrast is {ratio:.2f}:1, needs at least {THEME_MIN_CONTRAST}:1",
            )

    if "palette" not in theme:
        raise _theme_error(ext_id, "palette", "is required")
    _validate_mode_map(theme["palette"], ext_id=ext_id, where="palette", required=True, check=check_palette)

    if "surface" in theme:
        surface = _theme_object(theme["surface"], {"hue", "chroma"}, ext_id=ext_id, where="surface")
        for key in ("hue", "chroma"):
            if key not in surface:
                raise _theme_error(ext_id, f"surface.{key}", "is required when 'surface' is set")
        number(surface["hue"], 0, 360, "surface.hue")
        number(surface["chroma"], 0, 0.05, "surface.chroma")

    if "icons" in theme:
        icons = _theme_object(theme["icons"], {"hueRotate", "saturate", "brightness"}, ext_id=ext_id, where="icons")
        if "hueRotate" in icons:
            number(icons["hueRotate"], -180, 180, "icons.hueRotate")
        if "saturate" in icons:
            number(icons["saturate"], 0, 2, "icons.saturate")
        if "brightness" in icons:
            number(icons["brightness"], 0.5, 1.5, "icons.brightness")

    if "shell" in theme:
        shell = _theme_object(theme["shell"], KNOWN_SHELL_KEYS, ext_id=ext_id, where="shell")
        if "topBar" in shell:
            bar = _theme_object(shell["topBar"], {"opacity", "tint"}, ext_id=ext_id, where="shell.topBar")
            if not bar:
                raise _theme_error(ext_id, "shell.topBar", "must set 'opacity', 'tint', or both")
            if "opacity" in bar:
                number(bar["opacity"], 0.4, 1, "shell.topBar.opacity")
            if "tint" in bar:
                _validate_mode_map(
                    bar["tint"], ext_id=ext_id, where="shell.topBar.tint", required=False,
                    check=lambda raw, where: color(raw, where),
                )
        if "glass" in shell:
            glass = _theme_object(shell["glass"], {"blur", "saturate"}, ext_id=ext_id, where="shell.glass")
            for key in ("blur", "saturate"):
                if key not in glass:
                    raise _theme_error(ext_id, f"shell.glass.{key}", "is required when 'glass' is set")
            number(glass["blur"], 0, 40, "shell.glass.blur")
            number(glass["saturate"], 1, 2, "shell.glass.saturate")
        if "shape" in shell:
            _theme_enum(shell["shape"], THEME_SHAPES, ext_id=ext_id, where="shell.shape")
        if "desktopLabels" in shell:
            _theme_enum(shell["desktopLabels"], THEME_LABELS, ext_id=ext_id, where="shell.desktopLabels")
        if "shadow" in shell:
            number(shell["shadow"], 0, 1, "shell.shadow")
        if "wallpaperDim" in shell:
            number(shell["wallpaperDim"], 0, 0.85, "shell.wallpaperDim")


def _image_matches_extension(head: bytes, suffix: str) -> bool:
    if suffix == ".webp":
        return head[:4] == b"RIFF" and head[8:12] == b"WEBP"
    if suffix in (".jpg", ".jpeg"):
        return head[:3] == b"\xff\xd8\xff"
    if suffix == ".png":
        return head[:8] == b"\x89PNG\r\n\x1a\n"
    if suffix == ".avif":
        return head[4:8] == b"ftyp" and (b"avif" in head[8:32] or b"avis" in head[8:32])
    return False


def validate_theme_files(ext_dir: Path, manifest: dict[str, Any]) -> None:
    """File-level theme-pack rules: no executable or markup files, and the
    images the theme references are real images of the right size."""
    if not isinstance(manifest.get("theme"), dict):
        return
    ext_id = ext_dir.name
    for _, rel in package_files(ext_dir):
        if rel.lower().endswith(THEME_FORBIDDEN_SUFFIXES):
            raise BuildError(
                f"{ext_id}: a theme pack must not ship {rel!r} "
                f"(no {', '.join(THEME_FORBIDDEN_SUFFIXES)} files)"
            )
    wallpaper = manifest["theme"]["wallpaper"]
    for field, limit in (("image", THEME_MAX_WALLPAPER_BYTES), ("thumb", THEME_MAX_THUMB_BYTES)):
        rel = wallpaper.get(field)
        if rel is None:
            continue
        path = ext_dir / rel
        size = path.stat().st_size
        if size > limit:
            raise BuildError(f"{ext_id}: theme.wallpaper.{field} {rel!r} is {size} bytes, over the {limit}-byte limit")
        with path.open("rb") as handle:
            head = handle.read(32)
        if not _image_matches_extension(head, Path(rel).suffix.lower()):
            raise BuildError(f"{ext_id}: theme.wallpaper.{field} {rel!r} is not a valid {Path(rel).suffix.lower()} image")


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

    if manifest.get("category") == THEME_CATEGORY or "theme" in manifest:
        for key in THEME_FORBIDDEN_MANIFEST_KEYS:
            if key in manifest:
                raise BuildError(f"{ext_id_hint}: a theme pack must not declare '{key}'")

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

    validate_theme(manifest, ext_id_hint)

    widgets = manifest.get("widgets")
    if widgets is not None:
        if schema != 2:
            raise BuildError(
                f"{ext_id_hint}: 'widgets' requires schema 2 (schema-1 packages cannot ship shelf widgets)"
            )
        manifest["widgets"] = validate_widgets(widgets, manifest["integrity"], ext_id_hint)


def _widget_package_path(
    raw: object,
    *,
    field: str,
    widget_id: str,
    suffixes: tuple[str, ...],
    ext_id_hint: str,
) -> str:
    """Same tightness as the panel's `_widget_package_path`: no absolute
    paths, no parent refs, no empty path segments, a known suffix."""
    if not isinstance(raw, str) or not raw.strip():
        raise BuildError(
            f"{ext_id_hint}: widget {widget_id!r} must set '{field}' to a file path inside the package"
        )
    path = raw.strip().replace("\\", "/")
    if path.startswith("/"):
        raise BuildError(
            f"{ext_id_hint}: widget {widget_id!r} field '{field}' must be a relative package path "
            f"without a leading '/', got {raw!r}"
        )
    parts = path.split("/")
    if any(part in ("", ".", "..") for part in parts) or ":" in path:
        raise BuildError(
            f"{ext_id_hint}: widget {widget_id!r} field '{field}' must stay inside the package "
            f"(no '..', no empty path segments), got {raw!r}"
        )
    if not path.lower().endswith(suffixes):
        raise BuildError(
            f"{ext_id_hint}: widget {widget_id!r} field '{field}' must end with one of "
            f"{', '.join(suffixes)}, got {raw!r}"
        )
    return path


def validate_widgets(
    raw_widgets: object,
    integrity: dict[str, Any],
    ext_id_hint: str,
) -> list[dict[str, Any]]:
    """Validate + normalize extension.json's schema-2 `widgets` block.
    Raises BuildError on anything the panel's `_parse_widgets` would also
    reject; returns the normalized list so a hand-written manifest gets
    the exact same defaults (empty description, ordered sizes, null
    preview) the panel would store."""
    if not isinstance(raw_widgets, list):
        raise BuildError(f"{ext_id_hint}: 'widgets' must be a list of widget declarations")
    if len(raw_widgets) > MAX_WIDGETS_PER_EXTENSION:
        raise BuildError(
            f"{ext_id_hint}: declares {len(raw_widgets)} widgets; at most "
            f"{MAX_WIDGETS_PER_EXTENSION} are allowed per extension"
        )
    normalized: list[dict[str, Any]] = []
    seen: set[str] = set()
    for entry in raw_widgets:
        if not isinstance(entry, dict):
            raise BuildError(f"{ext_id_hint}: each entry in 'widgets' must be an object")
        widget_id = entry.get("id")
        if not isinstance(widget_id, str) or not _WIDGET_ID_RE.match(widget_id):
            raise BuildError(
                f"{ext_id_hint}: widget 'id' must be lowercase letters, digits and dashes "
                f"(1-40 chars, starting with a letter or digit), got {widget_id!r}"
            )
        if widget_id in seen:
            raise BuildError(f"{ext_id_hint}: declares duplicate widget id {widget_id!r}")
        seen.add(widget_id)
        unknown_keys = sorted(set(entry) - KNOWN_WIDGET_KEYS)
        if unknown_keys:
            raise BuildError(
                f"{ext_id_hint}: widget {widget_id!r} contains unknown field(s): {', '.join(unknown_keys)}"
            )
        name = entry.get("name")
        if not isinstance(name, str) or not name.strip() or len(name) > MAX_WIDGET_NAME_CHARS:
            raise BuildError(
                f"{ext_id_hint}: widget {widget_id!r} must set 'name' to a non-empty string of at "
                f"most {MAX_WIDGET_NAME_CHARS} characters"
            )
        description = entry.get("description", "")
        if not isinstance(description, str) or len(description) > MAX_WIDGET_DESCRIPTION_CHARS:
            raise BuildError(
                f"{ext_id_hint}: widget {widget_id!r} field 'description' must be a string of at "
                f"most {MAX_WIDGET_DESCRIPTION_CHARS} characters"
            )
        sizes = entry.get("sizes", ["small"])
        if (
            not isinstance(sizes, list)
            or not sizes
            or not all(isinstance(s, str) for s in sizes)
            or len(set(sizes)) != len(sizes)
            or any(s not in KNOWN_WIDGET_SIZES for s in sizes)
        ):
            raise BuildError(
                f"{ext_id_hint}: widget {widget_id!r} field 'sizes' must be a non-empty list of "
                f"distinct values from {list(KNOWN_WIDGET_SIZES)}"
            )
        module = _widget_package_path(
            entry.get("module"), field="module", widget_id=widget_id,
            suffixes=WIDGET_MODULE_SUFFIXES, ext_id_hint=ext_id_hint,
        )
        if module not in integrity:
            raise BuildError(
                f"{ext_id_hint}: widget {widget_id!r} module {module!r} is not covered by the "
                f"integrity map (file must exist in the package)"
            )
        preview_raw = entry.get("preview")
        preview = (
            _widget_package_path(
                preview_raw, field="preview", widget_id=widget_id,
                suffixes=WIDGET_PREVIEW_SUFFIXES, ext_id_hint=ext_id_hint,
            )
            if preview_raw is not None
            else None
        )
        if preview is not None and preview not in integrity:
            raise BuildError(
                f"{ext_id_hint}: widget {widget_id!r} preview {preview!r} is not covered by the "
                f"integrity map (file must exist in the package)"
            )
        normalized.append({
            "id": widget_id,
            "name": name.strip(),
            "description": description.strip(),
            "sizes": [s for s in KNOWN_WIDGET_SIZES if s in sizes],
            "module": module,
            "preview": preview,
        })
    return normalized


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
    validate_theme_files(ext_dir, manifest)
    if manifest.get("category") == THEME_CATEGORY and listing["category"] != THEME_CATEGORY:
        raise BuildError(f"{ext_id}: listing.json 'category' must be 'themes' for a theme pack")
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
