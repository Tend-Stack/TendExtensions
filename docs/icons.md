# Extension icons (the glyph)

The panel never paints colour an extension supplies. Every extension icon, in the dock, the launcher, a
window's title bar, the store and the shelf, is a rounded tile the panel draws from the active theme, with
your extension's **glyph** on top. A glyph is a one-colour SVG used only as a CSS mask, so it can't run
code, restyle the page or fetch anything, and it follows every theme, including theme packs and each
account's tuning.

## What to ship

- `glyph.svg` next to `extension.json`, declared as `"glyph": "glyph.svg"` and listed in `integrity`
  (`tools/build.py` does the latter). Registry builds refuse a non-theme package without one.
- Keep `"icon": "icon.svg"` too. Panels older than the glyph release still show it as a picture; new
  panels ignore it for display. It is deprecated, not removed.
- Theme packs (`category: "themes"`) carry no glyph; their card is the wallpaper thumbnail.
- A package installed without a glyph still works; the panel shows a themed monogram (the first letter
  of the name) instead.

## Rules (checked by `tools/glyph.py` and, identically, by the panel's Go validator)

Every refusal names its rule id in brackets, for example `[viewbox]`.

| Rule | What it requires |
|---|---|
| `size`, `utf8` | at most 4096 bytes, valid UTF-8 |
| `doctype`, `entity`, `procinst` | no DOCTYPE, entities or processing instructions (an XML declaration and comments are fine) |
| `root`, `namespace` | exactly one root `<svg xmlns="http://www.w3.org/2000/svg">` |
| `viewbox`, `dimensions` | `viewBox="0 0 N N"`, N an integer from 16 to 256; `width`/`height` optional and equal |
| `element` | only `svg g path circle ellipse rect line polyline polygon title` |
| `attribute` | geometry (`d cx cy r rx ry x y width height x1 y1 x2 y2 points transform viewBox xmlns`) and paint (`fill stroke stroke-width stroke-linecap stroke-linejoin stroke-miterlimit fill-rule clip-rule opacity fill-opacity stroke-opacity`) only; no `style`, `class`, `id`, `href`, `xlink:*`, `on*` |
| `paint` | `fill` and `stroke` only `none`, `currentColor`, `black`, `#000`, `#000000` |
| `opacity` | opacity values from 0.3 to 1: the only tonal variation allowed |
| `url` | no `url(` anywhere |
| `text` | no text outside `<title>` (draw letters as paths) |
| `empty` | at least one drawing element |

The manifest-level rules are `path` (`glyph` is a safe relative `.svg` path), `integrity` (the file is
covered) and `missing` (a non-theme package declares one).

## Drawing guide

1. Start from [`templates/extension/glyph.svg`](../templates/extension/glyph.svg): a 24 x 24 grid with a
   2-unit keyline. Keep the shape inside 2..22.
2. Draw the foreground shape of your old icon, not its tile: drop the background rectangle and every
   colour. Use `fill="currentColor"`.
3. Cut-outs (a hole in a card, an eye) use one `<path>` with `fill-rule="evenodd"`. Secondary marks use
   `fill-opacity` (0.5 to 0.7 reads well).
4. Strokes are fine (`fill="none" stroke="currentColor"`) with round caps and joins; keep them 1.5 units
   or thicker so they survive at dock size.
5. The panel paints the glyph at 60 % of the tile, so a 32 px dock icon shows it about 19 px wide. Check
   it small.
6. Preview: `python tools/glyph_sheet.py --png` writes `local/glyph-sheet.html` and `.png`, every glyph on
   the default palette, a dark theme pack and Mono at 32 px and 64 px. Not shipped.

## Registry index

`python tools/build.py --emit-glyph-svg` adds each package's glyph text to its `registry.json` entry as
`glyph_svg`, so the store can preview an extension before it is installed. It is off by default: a panel
from before the glyph release checks each index entry against an exact key set and would reject the whole
catalog. Turn it on only once every supported panel accepts the key.
