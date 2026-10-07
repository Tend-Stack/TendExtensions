#!/usr/bin/env python3
"""Write a review sheet of every extension glyph (not shipped).

    python tools/glyph_sheet.py            # local/glyph-sheet.html
    python tools/glyph_sheet.py --png      # also local/glyph-sheet.png (headless Chromium)

Each glyph is drawn the way the panel draws it: a rounded tile (22.4 % radius)
with the glyph used as a CSS mask over 60 % of the tile, on three tiles: the
default palette, a dark theme pack, and Mono. Sizes 32 px (the dock) and 64 px.
Every glyph is validated first, so a broken file stops the sheet.
"""
from __future__ import annotations

import argparse
import base64
import html
import json
import shutil
import subprocess
import sys
from pathlib import Path

try:
    from tools import glyph as glyph_rules
except ImportError:  # run as a script: tools/ is on sys.path
    import glyph as glyph_rules

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "local"

TILES = (
    ("Default", "linear-gradient(145deg,#3b82f6,#6366f1)", "linear-gradient(180deg,#ffffff,#dbe4ff)"),
    ("Dark pack", "linear-gradient(145deg,#2a1b4d,#0f1a3a)", "linear-gradient(180deg,#f5d0fe,#f0abfc)"),
    ("Mono", "linear-gradient(145deg,#3f3f46,#18181b)", "linear-gradient(180deg,#fafafa,#d4d4d8)"),
)


def collect() -> list[tuple[str, str, str]]:
    rows = []
    for ext_dir in sorted((REPO_ROOT / "extensions").iterdir()):
        manifest = json.loads((ext_dir / "extension.json").read_text(encoding="utf-8"))
        if "glyph" not in manifest:
            continue
        svg = glyph_rules.validate_glyph_package(ext_dir, manifest, required=True)
        rows.append((manifest["name"], ext_dir.name, svg or ""))
    return rows


def tile(svg: str, size: int, bg: str, fg: str) -> str:
    url = "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode("ascii")
    mask = f"url({url}) no-repeat center / 60%"
    return (
        f'<span class="tile" style="width:{size}px;height:{size}px;background:{bg}">'
        f'<span style="background:{fg};-webkit-mask:{mask};mask:{mask}"></span></span>'
    )


def render(rows: list[tuple[str, str, str]]) -> str:
    head = "".join(f"<th colspan=\"2\">{html.escape(name)}</th>" for name, _, _ in TILES)
    body = []
    for name, ext_id, svg in rows:
        cells = "".join(
            f"<td>{tile(svg, 32, bg, fg)}</td><td>{tile(svg, 64, bg, fg)}</td>" for _, bg, fg in TILES
        )
        body.append(f"<tr><th class=\"n\">{html.escape(name)}<small>{html.escape(ext_id)}</small></th>{cells}</tr>")
    return f"""<!doctype html><meta charset="utf-8"><title>Glyph review sheet</title>
<style>
body{{font:13px system-ui,sans-serif;background:#0b0f14;color:#cbd5e1;margin:20px}}
table{{border-collapse:separate;border-spacing:10px 8px}}
th{{font-weight:600;text-align:left}} th.n{{min-width:190px}} small{{display:block;color:#64748b;font-weight:400}}
.tile{{display:inline-grid;place-items:center;border-radius:22.4%}}
.tile span{{display:block;width:100%;height:100%;border-radius:0}}
</style>
<h1 style="font-size:16px">Extension glyphs ({len(rows)})</h1>
<table><tr><th></th>{head}</tr>{''.join(body)}</table>
"""


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--png", action="store_true", help="also render local/glyph-sheet.png with headless Chromium")
    args = parser.parse_args(argv)
    try:
        rows = collect()
    except glyph_rules.GlyphError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    OUT_DIR.mkdir(exist_ok=True)
    page = OUT_DIR / "glyph-sheet.html"
    page.write_text(render(rows), encoding="utf-8")
    print(f"wrote {page} ({len(rows)} glyphs)")
    if args.png:
        browser = next((b for b in ("chromium", "chromium-browser", "google-chrome") if shutil.which(b)), None)
        if browser is None:
            print("error: no headless Chromium on PATH for --png", file=sys.stderr)
            return 1
        png = OUT_DIR / "glyph-sheet.png"
        subprocess.run(
            [browser, "--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
             "--force-device-scale-factor=2", f"--screenshot={png}", f"--window-size=700,{len(rows) * 78 + 130}", page.as_uri()],
            check=True, capture_output=True,
        )
        print(f"wrote {png}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
