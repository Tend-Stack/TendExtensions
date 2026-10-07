"""The glyph contract against the shared fixtures (docs/icons.md).

`tests/fixtures/glyphs/{ok,bad}` is the same set the panel's Go test iterates
(`internal/api/testdata/glyphs`): every `ok` file is accepted, every `bad` file
is refused with a message naming the rule its file name starts with.
"""
from __future__ import annotations

from pathlib import Path

import pytest

from tools import glyph

FIXTURES = Path(__file__).parent / "fixtures" / "glyphs"
OK = sorted((FIXTURES / "ok").glob("*.svg"))
BAD = sorted((FIXTURES / "bad").glob("*.svg"))
HEAD = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">'


def test_fixtures_exist() -> None:
    assert len(OK) >= 10 and len(BAD) >= 40


@pytest.mark.parametrize("path", OK, ids=lambda p: p.name)
def test_ok_fixture_is_accepted(path: Path) -> None:
    raw = path.read_bytes()
    assert glyph.validate_glyph(raw, ext_id="x.y", where=path.name) == raw.decode("utf-8")


@pytest.mark.parametrize("path", BAD, ids=lambda p: p.name)
def test_bad_fixture_is_refused_naming_the_rule(path: Path) -> None:
    rule = path.stem.split("-", 1)[0]
    with pytest.raises(glyph.GlyphError) as err:
        glyph.validate_glyph(path.read_bytes(), ext_id="x.y", where=path.name)
    assert f"[{rule}]" in str(err.value)
    assert err.value.rule == rule
    assert str(err.value).count(f"[{rule}]") == 1


@pytest.mark.parametrize(
    "name,svg",
    {
        "non-square": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20"><path d="M0 0h1v1z"/></svg>',
        "script": HEAD + '<script>alert(1)</script><path d="M0 0h1v1z"/></svg>',
        "style": HEAD + "<style>*{fill:red}</style><path d=\"M0 0h1v1z\"/></svg>",
        "image": HEAD + '<image/><path d="M0 0h1v1z"/></svg>',
        "href": HEAD + '<path d="M0 0h1v1z" href="x"/></svg>',
        "style attr": HEAD + '<path d="M0 0h1v1z" style="fill:red"/></svg>',
        "onload": HEAD + '<path d="M0 0h1v1z" onload="x()"/></svg>',
        "url(": HEAD + '<path d="M0 0h1v1z" fill="url(#a)"/></svg>',
        "red": HEAD + '<path d="M0 0h1v1z" fill="#ff0000"/></svg>',
        "doctype": '<!DOCTYPE svg [<!ENTITY x "y">]>' + HEAD + '<path d="M0 0h1v1z"/></svg>',
        "entity": HEAD + '<title>&x;</title><path d="M0 0h1v1z"/></svg>',
        "oversize": HEAD + '<path d="M0 0h1v1z"/><!--' + "x" * 4097 + "--></svg>",
        "no drawing": HEAD + "<g/></svg>",
        "not svg": '{"not":"svg"}',
        "empty bytes": "",
    }.items(),
)
def test_named_attacks_are_refused(name: str, svg: str) -> None:
    with pytest.raises(glyph.GlyphError):
        glyph.validate_glyph(svg.encode(), ext_id="x.y")


def test_nan_opacity_is_refused() -> None:
    with pytest.raises(glyph.GlyphError, match=r"\[opacity\]"):
        glyph.validate_glyph((HEAD + '<path d="M0 0h1v1z" opacity="NaN"/></svg>').encode())


@pytest.mark.parametrize("value", ["glyph.svg", "art/glyph.svg"])
def test_glyph_path_accepts_package_relative_svg(value: str) -> None:
    assert glyph.glyph_path(value) == value


@pytest.mark.parametrize(
    "value", ["", "/glyph.svg", "../glyph.svg", "a/../glyph.svg", "a\\glyph.svg", "http://x/g.svg", "glyph.png", 7, None]
)
def test_glyph_path_refuses_unsafe_values(value: object) -> None:
    with pytest.raises(glyph.GlyphError, match=r"\[path\]"):
        glyph.glyph_path(value)
