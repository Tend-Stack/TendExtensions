# Contributing an extension

## Adding a new extension

1. Create `extensions/<id>/` where `<id>` is your extension's reverse-DNS-style
   manifest id (letters, digits, dots, dashes, underscores; 2-128 chars).
2. Add `extension.json`, a schema-2 manifest following the panel's rules
   (`id`, `name`, `version` x.y.z, `permissions`, `ui.module` + `ui.mount`,
   and — because it's schema 2 — an `integrity` map). The `integrity` map
   only needs to exist and be non-empty when you first write the file;
   `tools/build.py` recomputes and rewrites it from the files actually on
   disk every time it runs, so don't hand-maintain the hashes.
3. Add every other file your extension ships (JS modules, `icon.svg`,
   `README.md`, ...) under the same folder. Don't add dotfiles — `build.py`
   refuses to package them.
4. Add `listing.json` next to it with the store-catalog fields the manifest
   doesn't carry:
   ```json
   {
     "publisher": "Your name or org",
     "category": "games | utilities | productivity | media | developer-tools | communication | other",
     "featured": false,
     "reviewed": true,
     "features": ["3 to 6 short bullets"],
     "requirements": ["plain-language requirement strings, catalog-entry shape"],
     "release_notes": "What's new in this version."
   }
   ```
   `listing.json` is never shipped inside the extension's ZIP — it's registry
   metadata only.
5. Build locally and fix anything `tools/build.py` rejects:
   ```
   pip install -r tools/requirements.txt
   python tools/build.py
   ```
   This validates every extension's manifest, rebuilds its integrity map,
   and writes `dist/<id>-<version>.zip` plus `dist/registry.json`.
6. If you have a checkout of the Tend panel core, validate against its real
   manifest parser before opening a PR:
   ```
   TEND_CORE_CHECKOUT=/path/to/tend.host python tools/validate_with_panel.py
   ```
7. Run the tests: `pytest tests/`.
8. Open a PR. CI re-runs the same build and validates against the pinned
   core commit.

## Updating an existing extension

1. Edit the extension's files under `extensions/<id>/`.
2. Bump `extension.json`'s `version` (strict `x.y.z`, must increase).
3. Update `listing.json`'s `release_notes` to describe what changed in this
   version — it is registry metadata, not a changelog list.
4. Re-run `tools/build.py` and the tests, then open a PR as above.

## What happens on merge to `main`

`main` is fast-forward-only. Every push to `main` runs the full build and
validation again, mirrors the verified commit to the public GitHub mirror,
then signs `registry.json` and creates (or updates) a GitHub release tagged
`registry-<sequence>` with the built ZIPs and the signed envelope attached.
Panels pick up the new registry on their next scheduled or manual check.

## House rules

- Extension ids are unique and never reused for a different extension.
- Every shipped file except `extension.json` itself must be covered by the
  manifest's `integrity` map — `tools/build.py` enforces this both ways (no
  uncovered file, no stale entry for a file that no longer exists).
- Only permissions and runtime modules the panel already knows about are
  allowed (`tools/build.py` and `tools/validate_with_panel.py` both check
  this — the second one against the real panel code).
- Keep ZIPs deterministic: no dotfiles, no directory entries, sorted member
  order. `tools/build.py` does this for you; don't hand-build the ZIP.
