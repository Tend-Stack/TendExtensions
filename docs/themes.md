# Building and publishing a theme pack

A theme pack is an ordinary schema-2 extension whose `category` is `"themes"`. It carries a declarative
`theme` object and, usually, a wallpaper photo. It contains **no code**: no scripts, no stylesheets, no
markup, no permissions. The panel builds all CSS itself from the structured fields below, so a theme can
never run anything or inject styles.

Enabling a pack in **Settings -> Extensions** makes it selectable in the wallpaper picker for every account
on that panel. Each account still chooses its own theme and can tune it (hue, dim, top-bar opacity,
shadow); "Restore official look" drops the tuning. If the pack is later disabled or uninstalled, accounts
that used it fall back to the default theme, and their tuning is kept in case the pack returns.

Requires a panel with theme pack support (core 0.10.26 or newer).

## Quick start

```bash
cp -r templates/theme-pack extensions/com.example.my-theme   # folder name = manifest id
# edit extensions/com.example.my-theme/extension.json and listing.json
pip install -r tools/requirements.txt
python tools/build.py          # validates every rule below, rewrites the integrity map, builds dist/
pytest tests/                  # tooling tests, including the theme-pack rules
```

`tools/build.py` refuses anything outside the rules and says which field is wrong. The `templates/` folder
is never built as a package; only `extensions/<id>/` is.

## Files in a pack

```
extensions/<id>/
    extension.json     manifest with the theme block
    listing.json       store listing (never shipped inside the ZIP)
    README.md          optional
    wallpaper.webp     optional, 2000 px wide
    thumb.webp         required with a wallpaper, 480 px wide
```

Forbidden anywhere in a pack: `.js`, `.mjs`, `.html`, `.htm`, `.css`, `.svg`, `.wasm`, and dotfiles.
Every shipped file except `extension.json` is pinned in `integrity`; never edit that map by hand, the build
rewrites it (images included).

## extension.json reference

```jsonc
{
  "schema": 2,
  "id": "com.example.my-theme",      // reverse-DNS; host.tend.* and com.tendstack.* are first-party only
  "name": "My Theme",                // <= 40 chars, shown in the picker
  "version": "1.0.0",                // strict x.y.z
  "author": "Your name",
  "description": "One sentence.",    // <= 160 chars
  "category": "themes",
  "permissions": [],                 // must be empty
  // no "ui", no "runtime", no "widgets"
  "theme": {
    "api": 1,                        // required, must be 1
    "modes": ["dark", "light"],      // optional; non-empty subset of dark|light, default both
    "wallpaper": {                   // required; exactly one of image | gradient
      "image": "wallpaper.webp",     // .webp .jpg .jpeg .png .avif, listed in integrity, <= 4 MiB
      "thumb": "thumb.webp",         // required with image, same formats, <= 512 KiB
      "position": "center",          // center | top | bottom | left | right (default center)
      "veil": {                      // optional, per mode: weighted gradient laid over the photo
        "dark":  { "color": "oklch(10% 0.03 290)", "top": 0.50, "middle": 0.12, "bottom": 0.50 },
        "light": { "color": "oklch(97% 0.02 300)", "top": 0.34, "middle": 0.10, "bottom": 0.30 }
      },                             // top/middle/bottom: 0..1
      "gradient": {                  // the alternative to image; both modes required
        "dark":  { "base": "<color>", "glows": [ { "x": 18, "y": 25, "w": 80, "h": 60, "color": "<color>", "alpha": 0.55 } ] },
        "light": { "base": "<color>", "glows": [] }
      },                             // glows: 0..4 per mode; x,y 0..100 (%), w,h 10..150 (%), alpha 0..1
      "fallback": { "dark": "<color>", "light": "<color>" }   // optional solid colour under the photo
    },
    "palette": {                     // required, both modes
      "dark":  { "primary": "<color>", "secondary": "<color>", "primaryContent": "<color>", "highlight": "<color>" },
      "light": { "primary": "<color>", "secondary": "<color>", "primaryContent": "<color>", "highlight": "<color>" }
    },                               // highlight optional
    "surface": { "hue": 290, "chroma": 0.032 },      // optional; hue 0..360, chroma 0..0.05
    "icons": { "hueRotate": 137, "saturate": 0.75, "brightness": 1.0 },
                                     // optional; hueRotate -180..180 (deg, relative to the emerald icon base
                                     // oklch(70% 0.15 162)), saturate 0..2, brightness 0.5..1.5
    "shell": {                       // optional; every field optional
      "topBar": { "opacity": 1.0, "tint": { "dark": "<color>", "light": "<color>" } },  // opacity 0.4..1
      "glass": { "blur": 24, "saturate": 1.4 },      // blur 0..40 (px), saturate 1..2
      "shape": "default",            // sharp | default | round
      "desktopLabels": "light",      // light | dark (home-screen label colour)
      "shadow": 0.75,                // 0..1
      "wallpaperDim": 0              // 0..0.85
    }
  },
  "integrity": { }                   // generated by tools/build.py
}
```

Unknown keys anywhere inside `theme` are refused, so typos fail at build time and new keys need a new
`api`. Numbers must be JSON numbers inside the stated ranges (not strings). Paths are relative,
`/`-separated, at most 128 characters, with no `..`, no empty or `.` segments, no `:` and no leading `/`.

## The colour grammar

Colours are the security boundary: nothing free-form is ever accepted. A colour is a string of at most 64
characters (surrounding whitespace and letter case are ignored), in one of these forms:

- `oklch(L% C H)` or `oklch(L% C H / A)`: `L` 0..100 with a required `%`, `C` 0..0.4, `H` 0..360, `A` 0..1.
  Numbers are plain decimals such as `76`, `0.15`, `97.5`: no exponents, no `calc`, no `var`.
- `#rgb`, `#rrggbb`, `#rrggbbaa`.

Refused: named colours (`red`), `rgb()`, `hsl()`, `var()`, `calc()`, `url()`, and any of `; { } \ " '` or
comments. Examples that fail: `rgb(0,0,0)`, `oklch(50% 1e-1 120)`, `oklch(50% 0.1 120); background:url(x)`.

## Contrast

In each mode, `palette.primary` against `palette.primaryContent` (button fill versus its text) must reach
a WCAG contrast ratio of at least 4.5:1. The build computes it from the colours (gamut-clipped sRGB, alpha
ignored) and refuses a pack below that.

## Image specs

| | Wallpaper | Thumbnail |
|---|---|---|
| Format | WebP (JPEG, PNG, AVIF also accepted) | same |
| Size | 2000 px wide, keep the aspect (16:9 works best) | 480 px wide |
| Quality | about 82 | about 78 |
| File size | 150-480 KB is typical, hard limit 4 MiB | hard limit 512 KiB, 15-40 KB is typical |
| Metadata | stripped | stripped |

The file contents must match the extension (the build checks magic bytes). Example with ImageMagick:

```bash
magick source.png -resize 2000x -strip -quality 82 wallpaper.webp
magick wallpaper.webp -resize 480x -strip -quality 78 thumb.webp
```

The picker tiles and the store card use the thumbnail, so make sure it is the same photo and not washed out.

## Design checklist

- The wallpaper must stay calm behind windows and the dock. Use `veil` to darken (dark mode) or lighten
  (light mode) the top, middle and bottom, and `wallpaperDim` for a flat extra dim.
- Pick `palette.primary` and `primaryContent` for contrast first, then the accents. Check both modes.
- Dark mode usually needs a lighter `primary` (L 70-85%); light mode a darker one (L 45-58%).
- Use `surface.hue` to tint the glass and base tokens toward the photo; keep `chroma` small (0.01-0.04).
- `icons.hueRotate` recolours the desktop icons relative to emerald (`oklch(70% 0.15 162)`); aim it at your
  primary hue and keep `saturate` and `brightness` near 1.
- Keep `desktopLabels` at `light` for photos; use `dark` only if the photo is pale under the labels.
- Test on a bright and a dark moment of the photo, with windows open and with the home screen empty.
- Describe the look in `description` and the `listing.json` bullets; do not describe features the pack
  does not have.
- Own the rights to the wallpaper (or use a licence that allows redistribution under MIT-compatible terms).

## listing.json

```json
{
  "publisher": "Your name or org",
  "category": "themes",
  "featured": false,
  "reviewed": true,
  "features": ["3 to 6 bullets that describe the look"],
  "requirements": ["A Tend panel with theme pack support (core 0.10.26 or newer)"],
  "release_notes": "Initial release."
}
```

`listing.category` must also be `themes`. The listing format has no screenshot field; the store card
uses the pack's `thumb`.

## Publishing

1. Fork, copy the template (or an existing pack) into `extensions/<id>/`, and make it yours.
2. `python tools/build.py` and `pytest tests/` must pass.
3. Open a pull request with one pack per PR. CI rebuilds the package, checks it is reproducible, and runs
   the panel's own installer over it. A maintainer reviews the look, tries it in a panel in both modes, and
   merges. The pack ships in the next `registry-N` release.
4. To update a pack, change it, bump `version`, and update `release_notes`.
