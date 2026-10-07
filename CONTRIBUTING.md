# Contributing an extension, theme pack or recipe

## Adding a new extension

1. Create `extensions/<id>/` where `<id>` is your extension's reverse-DNS-style
   manifest id (letters, digits, dots, dashes, underscores; 2-128 chars).
2. Add `extension.json`, a schema-2 manifest following the panel's rules
   (`id`, `name`, `version` x.y.z, `permissions`, `ui.module` + `ui.mount`,
   and — because it's schema 2 — an `integrity` map). The `integrity` map
   only needs to exist and be non-empty when you first write the file;
   `tools/build.py` recomputes and rewrites it from the files actually on
   disk every time it runs, so don't hand-maintain the hashes.
3. Add every other file your extension ships (JS modules, `README.md`, ...)
   under the same folder. Don't add dotfiles — `build.py` refuses to package
   them. Start from `templates/extension/`.
4. Draw `glyph.svg`, the one-colour icon the panel colours from the active
   theme, and declare it as `"glyph": "glyph.svg"` in `extension.json`; the
   build lists it in `integrity`. The panel never shows a colour you supply.
   `"icon": "icon.svg"` is deprecated and only for panels older than themed
   icons. The rules and a drawing guide are in [docs/icons.md](docs/icons.md);
   `tools/build.py` refuses a non-theme package without a conforming glyph.
   Preview it with `python tools/glyph_sheet.py --png`.
5. Add `listing.json` next to it with the store-catalog fields the manifest
   doesn't carry:
   ```json
   {
     "publisher": "Your name or org",
     "category": "games | utilities | productivity | media | developer-tools | communication | themes | other",
     "featured": false,
     "reviewed": true,
     "features": ["3 to 6 short bullets"],
     "requirements": ["plain-language requirement strings, catalog-entry shape"],
     "release_notes": "What's new in this version."
   }
   ```
   `listing.json` is never shipped inside the extension's ZIP — it's registry
   metadata only.
6. Build locally and fix anything `tools/build.py` rejects:
   ```
   pip install -r tools/requirements.txt
   python tools/build.py
   ```
   This validates every extension's manifest, rebuilds its integrity map,
   and writes `dist/<id>-<version>.zip` plus `dist/registry.json`.
7. If you have a checkout of the Tend core, validate against its real
   install-path checks before opening a PR — this needs a Go toolchain on
   `PATH` for the checkout's own `go run` (a checkout from before the core's
   `backend/` was retired has no `cmd/tend-validate-extension` and is
   refused with a clear error rather than silently skipped):
   ```
   TEND_CORE_CHECKOUT=/path/to/tend.host python tools/validate_with_panel.py
   ```
8. Run the tests: `pytest tests/`.
9. If your extension ships its own pure (no DOM, no host) JS modules with
   real logic — date maths, parsing, id/schedule computation — add
   `bun:test` unit tests next to a mirror of the extension under
   `tests/js/<extension-id>/*.test.js` (never inside `extensions/<id>/`
   itself — `tools/build.py` ships every file it finds there, tests
   included, so they stay out). Run them with:
   ```
   bun test tests/js
   ```
   `extensions/host.tend.calendar`'s `reminders.js` and `ics.js` are the
   reference example.
10. Open a PR. A public check on the PR (see [What happens to your pull
    request](#what-happens-to-your-pull-request)) re-runs the build and the
    tests; after approval, the maintainers' pipeline validates against the
    pinned core commit.

## Adding a theme pack

A theme pack is an extension with `category: "themes"` and a declarative `theme` block instead of code
(no `.js`/`.mjs`/`.html`/`.css`/`.svg`/`.wasm` files, so no `glyph` or `icon` either, no `ui`/`runtime`/`widgets`,
no permissions). Its store card is the wallpaper thumbnail.

1. Copy `templates/theme-pack/` to `extensions/<id>/` (the folder name must equal the manifest `id`) and
   edit `extension.json` and `listing.json` (`category` is `themes` in both).
2. Every pack needs a thumbnail, `theme.wallpaper.thumb`: `.webp`, `.jpg`, `.jpeg` or `.png` (no AVIF),
   exactly 480 px wide and 240-320 px tall. The store card and the wallpaper picker show it. For a photo
   pack downscale the wallpaper to 480 px wide; for a gradient pack render it or screenshot the shell in
   your theme (the template ships one to replace). A photo pack also adds `wallpaper.webp` (1600-4096 px
   wide, 900-2560 px tall, landscape) and references it as `theme.wallpaper.image`.
3. Run `python tools/build.py` and `pytest tests/`; the build enforces the colour grammar, numeric ranges,
   image checks and the WCAG 4.5:1 `primary`/`primaryContent` contrast.
4. Open a PR with one pack. The full reference is [docs/themes.md](docs/themes.md).

## Adding an App Store recipe

A recipe describes how a panel installs one app from a container image: image, port, environment hints, volumes
and databases. Merged recipes are published in the signed **Tend Community** catalog, which panels show by default
as "Community · reviewed by Tend". That never means `tested` or `certified`; only Tend's own first-party catalog
carries those, and a pull request here does not ask for it.

1. Copy [`templates/recipe/example-notes`](templates/recipe/example-notes) to `recipes/<slug>/` (the folder name is
   the recipe's `slug`) and edit `recipe.json` and `listing.json`. Nothing else goes in the folder.
2. Pin an exact image version (never `latest`), declare every state-holding path as a volume, ship no default
   passwords, one container per recipe. The full rules are in [docs/recipes.md](docs/recipes.md).
3. Install the app on a panel you administer and say in `listing.json` (`tested_with`) what you actually did.
4. Validate: `python tools/validate_recipe.py recipes/<slug>`, then `python tools/build.py` and `pytest tests/`.
5. Open a PR with one recipe.

## Updating an existing extension

1. Edit the extension's files under `extensions/<id>/`.
2. Bump `extension.json`'s `version` (strict `x.y.z`, must increase).
3. Update `listing.json`'s `release_notes` to describe what changed in this
   version — it is registry metadata, not a changelog list.
4. Re-run `tools/build.py` and the tests, then open a PR as above.

## What happens to your pull request

Contributions arrive as GitHub pull requests. Only `extensions/<id>/`, `recipes/<slug>/` and `tests/js/` can be
changed by a contributor pull request; everything else (tooling, workflows, keys, templates, docs, the Python tests)
is maintainer-only and is reported as an error.

1. **Public checks.** [`validate-pr.yml`](.github/workflows/validate-pr.yml) runs on GitHub-hosted runners with no
   secrets and a read-only token: `tools/build.py` (manifests, integrity maps, glyphs, themes, recipes),
   `tools/validate_recipe.py`, `pytest`, `bun test tests/js`, and reviewer hints (`tools/review_hints.py`) that
   point a human at `eval`, network calls, remote imports, minified files, new permissions and similar. Hints are
   not failures. The validators come from the base branch, so a pull request cannot change how it is graded.
2. **Human review.** A maintainer reads the diff and the checks and approves one exact commit. Pushing again
   voids the approval, so push your final version before asking for review.
3. **Import.** The maintainers' pipeline takes the approved commit (rebased onto `main`, your authorship kept),
   revalidates it against the real panel installer, and releases it. The pull request is closed with a comment naming
   the `registry-N` release.

The details, and what the maintainers set up, are in [docs/community-review.md](docs/community-review.md).

## What happens on merge to `main`

`main` is fast-forward-only. Every push to `main` runs the full build and
validation again, mirrors the verified commit to the public GitHub mirror,
then signs `registry.json` and creates (or updates) a GitHub release tagged
`registry-<sequence>` with the built ZIPs and the signed envelope attached.
Panels pick up the new registry on their next scheduled or manual check. If the release includes recipes, it also
carries the signed community catalog (`community-catalog.json`, its `.sig` and `tend-catalog-pubkey`).

## Using an AI coding agent

You may use one; you do not have to. This repository ships a kit for agents:
[`developers/AGENTS.md`](developers/AGENTS.md) and the [skills](developers/skills) (extension, theme
pack, Dockerfile, compose, deploy, recipe, Git and PR, API and MCP, review before PR). Point your agent at them, and
this repository's own [`AGENTS.md`](AGENTS.md) for the rules here.

- Every extension, theme pack, App Store recipe and listing is inspected by humans before it is published.
- The AI kit is a convenience, not the default.
- You are responsible for inspecting, testing, fixing and patching AI-generated code (and Dockerfiles, compose
  files and recipes) before you open a PR. Run `python tools/build.py` and `pytest tests/` yourself and read the
  diff line by line.
- Reviewers reject code its author can't explain. Be ready to answer questions about every file in your PR.

## House rules

- Extension ids are unique and never reused for a different extension.
- Every shipped file except `extension.json` itself must be covered by the
  manifest's `integrity` map — `tools/build.py` enforces this both ways (no
  uncovered file, no stale entry for a file that no longer exists).
- Only permissions and runtime modules the panel already knows about are
  allowed (`tools/build.py` and `tools/validate_with_panel.py` both check
  this — the second one by running the real core's own
  `cmd/tend-validate-extension`).
- Every non-theme extension ships a conforming `glyph.svg` (monochrome, no
  colour of its own); the panel draws the icon tile from the theme. See
  [docs/icons.md](docs/icons.md).
- Recipes: one folder per slug under `recipes/`, only `recipe.json` and `listing.json`, an exact pinned image
  version, no default secrets (`tools/validate_recipe.py` enforces it; see [docs/recipes.md](docs/recipes.md)).
- Keep ZIPs deterministic: no dotfiles, no directory entries, sorted member
  order. `tools/build.py` does this for you; don't hand-build the ZIP.
