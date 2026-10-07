"""Validate an extension's `glyph.svg` (the themed-icon contract, docs/icons.md).

The panel never paints colour an extension supplies. An extension icon is a
monochrome SVG the panel uses only as a CSS mask over a tile it draws from the
active theme, so the file is reduced to geometry plus a short allow-list of
paint attributes. These rules are identical to the Go validator in the panel
(`internal/api/extensions_glyph.go`); both run against the same fixtures in
`tests/fixtures/glyphs/{ok,bad}`, and a bad fixture's file name starts with the
rule id its refusal must name. Every error message carries its rule id in
brackets, for example `[viewbox]`.

The XML is read with expat's event API, never a tree builder, so a DOCTYPE,
an entity, a processing instruction, a second root or stray text is refused
the moment the parser reports it.
"""
from __future__ import annotations

import math
import re
from pathlib import Path
from typing import Any
from xml.parsers import expat

MAX_GLYPH_BYTES = 4096
SVG_NAMESPACE = "http://www.w3.org/2000/svg"
MIN_VIEWBOX = 16
MAX_VIEWBOX = 256
MIN_OPACITY = 0.3
MAX_OPACITY = 1.0
MAX_PATH_CHARS = 128

ELEMENTS = frozenset(
    {"svg", "g", "path", "circle", "ellipse", "rect", "line", "polyline", "polygon", "title"}
)
DRAWING = frozenset({"path", "circle", "ellipse", "rect", "line", "polyline", "polygon"})
ATTRIBUTES = frozenset(
    {
        # geometry
        "d", "cx", "cy", "r", "rx", "ry", "x", "y", "width", "height", "x1", "y1",
        "x2", "y2", "points", "transform", "viewBox", "xmlns",
        # paint
        "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin",
        "stroke-miterlimit", "fill-rule", "clip-rule", "opacity", "fill-opacity",
        "stroke-opacity",
    }
)
COLOUR_VALUES = frozenset({"none", "currentColor", "black", "#000", "#000000"})
OPACITY_ATTRIBUTES = frozenset({"opacity", "fill-opacity", "stroke-opacity"})

_VIEWBOX_RE = re.compile(r"^0 0 (\d{1,3}) (\d{1,3})$")
_PATH_CHARS_RE = re.compile(r"^[A-Za-z0-9._\-/]+$")
# expat reports a second root and a missing root as parse errors; the Go
# validator counts roots itself, so both map to the same `root` rule.
_JUNK_AFTER_ROOT = expat.errors.codes[expat.errors.XML_ERROR_JUNK_AFTER_DOC_ELEMENT]
_NO_ELEMENTS = expat.errors.codes[expat.errors.XML_ERROR_NO_ELEMENTS]


class GlyphError(ValueError):
    """A glyph refusal. `rule` is the id in the message's leading brackets."""

    def __init__(self, rule: str, message: str):
        super().__init__(f"[{rule}] {message}")
        self.rule = rule
        self.detail = message


def _clip(value: str, limit: int = 60) -> str:
    return value if len(value) <= limit else value[:limit] + "..."


def _split_qname(name: str, scopes: list[dict[str, str]]) -> tuple[str, str]:
    """Resolve an element name against the open xmlns declarations."""
    prefix, sep, local = name.partition(":")
    if not sep:
        prefix, local = "", name
    for scope in reversed(scopes):
        if prefix in scope:
            return scope[prefix], local
    return "", local


def _check_root(local: str, space: str, attrs: dict[str, str]) -> None:
    if local != "svg":
        raise GlyphError("root", f"the root element is <{local}>; it must be <svg>")
    if space != SVG_NAMESPACE:
        raise GlyphError("namespace", f'the root <svg> must declare xmlns="{SVG_NAMESPACE}"')
    view_box = attrs.get("viewBox", "")
    m = _VIEWBOX_RE.match(view_box)
    if not m:
        raise GlyphError(
            "viewbox", f'the root <svg> needs viewBox="0 0 N N" with integer N, got {_clip(view_box)!r}'
        )
    w, h = int(m.group(1)), int(m.group(2))
    if w != h:
        raise GlyphError("viewbox", f"the viewBox must be square, got {w} x {h}")
    if not MIN_VIEWBOX <= w <= MAX_VIEWBOX:
        raise GlyphError("viewbox", f"the viewBox size must be {MIN_VIEWBOX} to {MAX_VIEWBOX}, got {w}")
    has_w, has_h = "width" in attrs, "height" in attrs
    if has_w != has_h or (has_w and attrs["width"].strip() != attrs["height"].strip()):
        raise GlyphError("dimensions", "width and height must both be absent or equal")


def _opacity_ok(value: str) -> bool:
    text = value.strip()
    if not text or "_" in text:
        return False
    try:
        number = float(text)
    except ValueError:
        return False
    return math.isfinite(number) and MIN_OPACITY <= number <= MAX_OPACITY


def _check_element(local: str, space: str, attrs: dict[str, str]) -> None:
    if space != SVG_NAMESPACE or local not in ELEMENTS:
        raise GlyphError(
            "element",
            f"<{local}> is not allowed; the allowed elements are svg, g, path, circle, ellipse, "
            "rect, line, polyline, polygon and title",
        )
    for name, value in attrs.items():
        if ":" in name or name not in ATTRIBUTES:
            raise GlyphError("attribute", f"attribute {_clip(name)!r} on <{local}> is not allowed")
        if name == "xmlns":
            if value != SVG_NAMESPACE:
                raise GlyphError("namespace", f'xmlns must be "{SVG_NAMESPACE}"')
        elif name in ("fill", "stroke"):
            if value not in COLOUR_VALUES:
                raise GlyphError(
                    "paint",
                    f"{name}={_clip(value)!r} is not allowed; use none, currentColor, black, #000 or #000000",
                )
        elif name in OPACITY_ATTRIBUTES:
            if not _opacity_ok(value):
                raise GlyphError(
                    "opacity", f"{name}={_clip(value)!r} must be a number from {MIN_OPACITY} to {MAX_OPACITY:.0f}"
                )


def validate_glyph(raw: bytes, *, ext_id: str = "", where: str = "glyph.svg") -> str:
    """Apply the glyph rules to the file bytes and return the exact text.

    Raises GlyphError, whose message starts with `[rule]`, on the first
    violation; `ext_id` and `where` only prefix the message.
    """
    try:
        return _validate(raw)
    except GlyphError as exc:
        prefix = f"{ext_id}: " if ext_id else ""
        raise GlyphError(exc.rule, f"{prefix}{where}: {exc.detail}") from None


def _validate(raw: bytes) -> str:
    if len(raw) > MAX_GLYPH_BYTES:
        raise GlyphError("size", f"the file is {len(raw)} bytes; the limit is {MAX_GLYPH_BYTES}")
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        raise GlyphError("utf8", "the file is not valid UTF-8") from None
    if "url(" in text.lower():
        raise GlyphError("url", "'url(' is not allowed anywhere in the file")

    parser = expat.ParserCreate()
    parser.buffer_text = False
    state: dict[str, Any] = {"stack": [], "scopes": [], "roots": 0, "drawing": 0, "tokens": 0, "error": None}

    def fail(rule: str, message: str) -> None:
        if state["error"] is None:
            state["error"] = GlyphError(rule, message)
        raise _Stop

    def on_doctype(*_args: Any) -> None:
        fail("doctype", "DOCTYPE and entity declarations are not allowed")

    def on_pi(target: str, _data: str) -> None:
        fail("procinst", f"processing instruction <?{target}?> is not allowed; only a leading XML declaration is")

    def on_text(data: str) -> None:
        in_title = bool(state["stack"]) and state["stack"][-1] == "title"
        if not in_title and data.strip():
            fail("text", "text outside <title> is not allowed")

    def on_start(name: str, attributes: dict[str, str]) -> None:
        scope = {}
        for key, value in attributes.items():
            if key == "xmlns":
                scope[""] = value
            elif key.startswith("xmlns:"):
                scope[key[6:]] = value
        state["scopes"].append(scope)
        space, local = _split_qname(name, state["scopes"])
        try:
            if not state["stack"]:
                state["roots"] += 1
                if state["roots"] > 1:
                    raise GlyphError("root", "the file must have exactly one root <svg>")
                _check_root(local, space, attributes)
            _check_element(local, space, attributes)
        except GlyphError as exc:
            state["error"] = exc
            raise _Stop from None
        if local in DRAWING:
            state["drawing"] += 1
        state["stack"].append(local)

    def on_end(_name: str) -> None:
        state["stack"].pop()
        state["scopes"].pop()

    parser.StartDoctypeDeclHandler = on_doctype
    parser.ProcessingInstructionHandler = on_pi
    parser.CharacterDataHandler = on_text
    parser.StartElementHandler = on_start
    parser.EndElementHandler = on_end
    parser.SetParamEntityParsing(expat.XML_PARAM_ENTITY_PARSING_NEVER)
    try:
        parser.Parse(raw, True)
    except _Stop:
        raise state["error"] from None
    except expat.ExpatError as exc:
        message = str(exc)
        if state["error"] is not None:
            raise state["error"] from None
        if "entity" in message:
            raise GlyphError("entity", f"entities are not allowed ({message})") from None
        if exc.code == _JUNK_AFTER_ROOT or (exc.code == _NO_ELEMENTS and state["roots"] == 0):
            raise GlyphError("root", "the file must have exactly one root <svg>") from None
        raise GlyphError("xml", f"the file is not well-formed XML ({message})") from None
    if state["roots"] == 0:
        raise GlyphError("root", "the file has no <svg> root")
    if state["drawing"] == 0:
        raise GlyphError(
            "empty",
            "the glyph draws nothing; add at least one path, circle, ellipse, rect, line, polyline or polygon",
        )
    return text


class _Stop(Exception):
    """Unwinds out of an expat handler once a rule has been broken."""


def glyph_path(raw: object) -> str:
    """Check the shape of the manifest's `glyph` value and return it."""
    if not isinstance(raw, str):
        raise GlyphError("path", "extension.json 'glyph' must be a string path such as \"glyph.svg\"")
    why = ""
    if raw == "":
        why = "is empty"
    elif len(raw) > MAX_PATH_CHARS:
        why = f"is longer than {MAX_PATH_CHARS} characters"
    elif raw.startswith("/"):
        why = "must be relative (no leading '/')"
    elif ":" in raw:
        why = "must not contain ':'"
    elif "\\" in raw:
        why = "must use '/' separators"
    elif not _PATH_CHARS_RE.match(raw):
        why = "may only use letters, digits, '.', '_', '-' and '/'"
    elif any(seg in ("", ".") or ".." in seg for seg in raw.split("/")):
        why = "must not contain empty, '.' or '..' segments"
    if why:
        raise GlyphError("path", f"extension.json 'glyph' path {_clip(raw)!r} {why}")
    if not raw.endswith(".svg"):
        raise GlyphError("path", f"extension.json 'glyph' must be a .svg path of at most {MAX_PATH_CHARS} characters")
    return raw


def validate_glyph_package(ext_dir: Path, manifest: dict[str, Any], *, required: bool) -> str | None:
    """Package-level half: the manifest's `glyph` path is well formed, covered
    by the integrity map, a regular file inside the package, and conforms.

    Returns the exact file text (for the registry's `glyph_svg`), or None when
    the manifest has no glyph and none is required.
    """
    ext_id = ext_dir.name
    raw = manifest.get("glyph")
    if raw is None:
        if required:
            raise GlyphError(
                "missing", f"{ext_id}: a non-theme extension must declare \"glyph\": \"glyph.svg\" (see docs/icons.md)"
            )
        return None
    rel = glyph_path(raw)
    integrity = manifest.get("integrity") or {}
    if rel not in integrity:
        raise GlyphError("integrity", f"{ext_id}: {rel} is not listed in the manifest 'integrity' map")
    target = ext_dir / rel
    if target.is_symlink() or not target.is_file():
        raise GlyphError("path", f"{ext_id}: {rel} is not a regular file in the package")
    return validate_glyph(target.read_bytes(), ext_id=ext_id, where=rel)
