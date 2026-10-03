# My Theme

A gradient-based TEND theme pack: no images, no code, no permissions.

## Using this template (delete this section before you publish)

1. Copy this folder into the registry, named after your pack's id:
   `cp -r templates/theme-pack extensions/com.example.my-theme`
2. In `extension.json`, change `id` (it must equal the folder name), `name`, `author`,
   `description`, and the colours. Reverse-DNS ids (`com.yourname.theme-name`) are yours;
   `host.tend.*` and `com.tendstack.*` are reserved for first-party packs.
3. Edit `listing.json` (publisher, three to six feature bullets that describe the look).
4. Validate and build: `python tools/build.py` (it rewrites the `integrity` map for you).
5. Read [docs/themes.md](../../docs/themes.md) for the full rules, then open a pull request.

To use a photo instead of a gradient, replace the `gradient` block with
`"image": "wallpaper.webp"` and `"thumb": "thumb.webp"` and add both files; see the docs.
