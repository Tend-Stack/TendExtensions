# My Extension

Starter extension template.

## Using this template (delete this section before you publish)

1. Copy this folder into the registry, named after your extension's id:
   `cp -r templates/extension extensions/com.example.my-extension`
2. In `extension.json` change `id` (it must equal the folder name), `name`, `author`, `description`,
   `permissions` and `ui`. Reverse-DNS ids (`com.yourname.name`) are yours; `host.tend.*` and
   `com.tendstack.*` are reserved for first-party extensions.
3. Draw `glyph.svg` (the icon the panel colours from the active theme; see
   [docs/icons.md](../../docs/icons.md)). Keep `icon.svg` for panels older than the glyph release.
4. Edit `listing.json`, then run `python tools/build.py` (it rewrites the `integrity` map) and `pytest tests/`.
