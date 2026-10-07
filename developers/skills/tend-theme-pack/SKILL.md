---
name: tend-theme-pack
description: Build a Tend theme pack, a code-free extension that adds a wallpaper theme (gradient or photo, dark and light palettes, shell settings). Use when the user wants a new look for the Tend panel, a wallpaper pack, or a recolour. Never use it for anything that needs code, CSS, SVG or permissions.
---

# Build a Tend theme pack

Human review applies: every theme pack is looked at by people, in both modes, in a real panel before it is
published. Reviewers reject what its author can't explain, and they check the rights to any wallpaper.

A theme pack is an ordinary schema-2 extension with `category: "themes"` and a declarative `theme` object. It
carries **no code, no permissions, no `ui`, `runtime`, `widgets`, `glyph` or `icon`**. The panel builds all CSS
itself from the fields below; a pack can only change how the panel looks.

## Steps

1. `cp -r templates/theme-pack extensions/<id>` (folder name equals manifest `id`, reverse-DNS such as
   `com.yourname.dusk`; `host.tend.*` and `com.tendstack.*` are reserved).
2. Edit `extension.json` and `listing.json` (`category` is `themes` in **both**).
3. Make the thumbnail (required for every pack) and, for a photo pack, the wallpaper.
4. `python tools/build.py` (validates every rule, rewrites `integrity`, builds `dist/`) then `pytest tests/`.
5. Install `dist/<id>-<version>.zip` into a panel you administer, enable it, and look at it in the wallpaper
   picker in dark and light mode with windows open and with an empty home screen.
6. Open one PR per pack ([`tend-git-and-pr`](../tend-git-and-pr/SKILL.md)), after
   [`tend-review-before-pr`](../tend-review-before-pr/SKILL.md).

## Manifest (gradient pack, from the template)

```json
{
  "schema": 2, "id": "com.example.my-theme", "name": "My Theme", "version": "1.0.0",
  "author": "Your name", "description": "One sentence, at most 160 characters.",
  "category": "themes", "permissions": [],
  "theme": {
    "api": 1,
    "modes": ["dark", "light"],
    "wallpaper": {
      "thumb": "thumb.png",
      "gradient": {
        "dark":  { "base": "oklch(14% 0.030 260)", "glows": [ { "x": 18, "y": 22, "w": 80, "h": 60, "color": "oklch(55% 0.16 280)", "alpha": 0.55 } ] },
        "light": { "base": "oklch(97% 0.012 260)", "glows": [] }
      }
    },
    "palette": {
      "dark":  { "primary": "oklch(76% 0.14 280)", "secondary": "oklch(82% 0.10 250)", "primaryContent": "oklch(15% 0.030 270)", "highlight": "oklch(82% 0.11 200)" },
      "light": { "primary": "oklch(50% 0.17 280)", "secondary": "oklch(56% 0.13 250)", "primaryContent": "oklch(98.5% 0.008 280)", "highlight": "oklch(54% 0.11 200)" }
    },
    "surface": { "hue": 270, "chroma": 0.030 },
    "shell": { "desktopLabels": "light", "shadow": 0.6 }
  },
  "integrity": { "README.md": "sha256-rebuilt-by-the-build" }
}
```

For a photo pack replace `gradient` with `"image": "wallpaper.webp"` and optionally add `position`
(`center|top|bottom|left|right`), `veil` and `fallback` (each with both `dark` and `light`).

## Rules (all enforced by `tools/build.py` and by the panel)

- `name` at most 40 characters, `description` at most 160. `theme.api` must be `1`. `modes` is a non-empty subset
  of `dark`, `light`. `wallpaper` has exactly one of `image` or `gradient`, and always `thumb`.
- Unknown keys anywhere inside `theme` are refused. Numbers are JSON numbers in range.
- **Colours**: only `oklch(L% C H)` / `oklch(L% C H / A)` (L 0 to 100 with `%`, C 0 to 0.4, H 0 to 360, A 0 to 1,
  plain decimals) or `#rgb`, `#rrggbb`, `#rrggbbaa`; at most 64 characters. No named colours, `rgb()`, `hsl()`,
  `var()`, `calc()`, `url()`, no `; { } \` quotes or comments.
- **Contrast**: in each mode `palette.primaryContent` on `palette.primary` must reach WCAG 4.5:1.
- **Gradient**: up to 4 `glows` per mode; `x`,`y` 0 to 100, `w`,`h` 10 to 150, `alpha` 0 to 1.
- `surface`: `hue` 0 to 360 and `chroma` 0 to 0.05, both required. `icons`: `hueRotate` -180 to 180,
  `saturate` 0 to 2, `brightness` 0.5 to 1.5. `shell`: `topBar` (`opacity` 0.4 to 1 and/or `tint`), `glass`
  (`blur` 0 to 40 and `saturate` 1 to 2, both), `shape` `sharp|default|round`, `desktopLabels` `light|dark`,
  `shadow` 0 to 1, `wallpaperDim` 0 to 0.85.
- **Images**: `.webp`, `.jpg`, `.jpeg` or `.png` (no AVIF), really that format (magic bytes are checked).
  Thumbnail: exactly 480 px wide, 240 to 320 px tall, at most 512 KiB. Wallpaper (photo packs): landscape, 1600 to
  4096 px wide, 900 to 2560 px tall, at most 4 MiB. Strip metadata. Paths: relative, `/` separators, at most 128
  characters, letters digits `. _ - /` only.
- **Forbidden files**: `.js`, `.mjs`, `.html`, `.htm`, `.css`, `.svg`, `.wasm`, and any dotfile.
- Every shipped file except `extension.json` is pinned in `integrity` by the build; never hand-edit it.
- You must own the rights to the wallpaper or use a licence that allows redistribution under MIT-compatible terms.

```bash
magick source.png -resize 2000x -strip -quality 82 wallpaper.webp
magick wallpaper.webp -resize 480x -strip -quality 78 thumb.webp
```

## Common refusals

- "a theme pack must declare no permissions" / "must not declare 'ui'": remove them. Do not argue for a
  "theme with a little script".
- Contrast below 4.5:1: move `primary` and `primaryContent` further apart in lightness.
- Thumbnail size wrong (the message states both sizes). Missing thumbnail.
- A `.svg` or `.css` file in the folder, or a CSS-looking string in a colour.
- `listing.json` `category` not `themes`.

Source: `docs/themes.md`, `templates/theme-pack/`, `tools/build.py` (theme section), `CONTRIBUTING.md`; public docs
[extension-themes](https://tend.host/docs/extension-themes); the panel's theme validator
(`internal/api/extensions_theme.go`) applies the same rules at install.
