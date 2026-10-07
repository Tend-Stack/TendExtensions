# My Theme

A gradient-based Tend theme pack: no wallpaper photo, no code, no permissions.

## Using this template (delete this section before you publish)

1. Copy this folder into the registry, named after your pack's id:
   `cp -r templates/theme-pack extensions/com.example.my-theme`
2. In `extension.json`, change `id` (it must equal the folder name), `name`, `author`,
   `description`, and the colours. Reverse-DNS ids (`com.yourname.theme-name`) are yours;
   `host.tend.*` and `com.tendstack.*` are reserved for first-party packs.
3. Edit `listing.json` (publisher, three to six feature bullets that describe the look).
4. Replace `thumb.png` (480 px wide, 240-320 px tall: a render or screenshot of your theme; the store and
   the wallpaper picker show it). It is required for every pack.
5. Validate and build: `python tools/build.py` (it rewrites the `integrity` map for you).
6. Read [docs/themes.md](../../docs/themes.md) for the full rules, then open a pull request.

To use a photo instead of a gradient, replace the `gradient` block with
`"image": "wallpaper.webp"` (1600-4096 px wide, landscape), keep `thumb`, and add the files; see the docs.
