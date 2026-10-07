---
name: tend-extension
description: Build a Tend UI extension end to end (schema-2 manifest, permissions, glyph.svg icon, integrity map, tool-window or shell-app mount, shelf widgets, build and validate, listing.json, registry pull request). Use when the user wants to create or update an extension for the Tend panel. Not for theme packs (use tend-theme-pack).
---

# Build a Tend extension

Human review applies: every extension is inspected by people before it is published, and you (with the user) are
responsible for inspecting, testing and fixing generated code first. Reviewers reject code its author can't explain.

## 1. Layout

Work inside a checkout of this registry (`TendExtensions`). Start from `templates/extension/`.

```
extensions/<id>/            folder name must equal the manifest id
  extension.json            schema-2 manifest
  listing.json              store listing; registry metadata, never shipped in the ZIP
  index.js                  the entry module (any further .js modules you need)
  glyph.svg                 the one-colour icon shape
  README.md                 what it does, permissions and why, third-party code and licences
```

No dotfiles anywhere under the folder (the build refuses them). Ids: letters, digits, dots, dashes, underscores,
2 to 128 characters, reverse-DNS style (`com.yourname.tool`). `host.tend.*` and `com.tendstack.*` are reserved for
first-party extensions. An id is never reused for a different extension.

## 2. Manifest

```json
{
  "schema": 2,
  "id": "com.example.timer",
  "name": "Timer",
  "version": "1.0.0",
  "author": "Your name",
  "description": "One sentence on what it does.",
  "category": "utilities",
  "glyph": "glyph.svg",
  "ui": { "module": "index.js", "mount": "tool-window", "size": { "w": 420, "h": 560 } },
  "permissions": ["storage"],
  "integrity": { "index.js": "sha256-rebuilt-by-the-build" }
}
```

| Field | Rule |
|---|---|
| `schema` | `2` (schema 1 is the legacy iframe path; do not write new ones). `glyph`, `widgets` and `integrity` need schema 2 |
| `id`, `name`, `version` | required; `version` is strict `x.y.z` and must increase on every update |
| `category` | `games`, `utilities`, `productivity`, `media`, `developer-tools`, `communication`, `other` (`themes` is for theme packs only). Omitted: `utilities` |
| `ui.module` | entry ES module, relative path |
| `ui.mount` | `tool-window` (floating window) or `shell-app` (full route). Default `shell-app`. `ui.size` `{w,h}` sets the window size; first-party extensions also use `minSize` and `maxSize` |
| `permissions` | list of strings from the table below; anything else is refused |
| `glyph` | path to `glyph.svg` (section 4). `icon` is deprecated: only for panels older than themed icons, new extensions can omit it |
| `runtime` | games only: `{ "api": 1, "kind": "game" or "utility", "modules": ["phaser@4"], "pauseWhenHidden": true, "targetFps": 15-120 }`. `phaser@4` is the only shared module |
| `widgets` | up to 8 shelf widgets (section 6) |
| `integrity` | `{ "<path>": "sha256-<base64>" }` for every shipped file. Generated, never hand-edited |

## 3. Module contract and permissions

The panel imports `ui.module`, calls the default export (a named `activate` export is also accepted) with `host`,
and mounts what it returns:

```js
export default function activate(host) {
  const el = document.createElement('div');
  return {
    async mount(container) {
      const saved = await host.storage.get('count');   // needs "storage"
      el.textContent = `Count: ${saved ?? 0}`;
      container.appendChild(el);
    },
    unmount() { el.remove(); },
  };
}
```

`host` carries `id`, `permissions`, `user` (`id`, `name`, `role`), `theme` (`name`, `isDark`), `storage`
(`get`, `set`, `delete`), `notify(level, title, message?)` with level `success`, `warning`, `error` or `info`, and
`onUnmount(fn)` for cleanup. Release timers and listeners in `unmount()`. Everything else is behind a permission:

| Permission | Unlocks | Scan rule that enforces it |
|---|---|---|
| `storage` | `host.storage.*`, scoped per extension | `needs-storage` |
| `notifications` | `host.notify(...)`, `host.reminders.*` | `needs-notifications` |
| `email` | `host.email.*` (panel email service, daily quota per extension) | `needs-email` |
| `network` | `host.network.fetch(url)`: GET text only, user consents per host (see below) | `needs-network` |
| `files.read` | `host.files.listImageLibraries()`, `listImages()` (opaque ids, thumbnails) | `needs-files-read` |
| `documents.read`, `documents.write`, `documents.backup` | `host.documents.*` | `needs-documents-*` |
| `sites.source.read`, `sites.source.connect`, `sites.source.write`, `sites.create`, `sites.preview`, `sites.publish` | `host.sites.*` | `needs-sites-*` |
| `ondacast` | read-only OndaCast catalog and media session | `needs-ondacast` |
| `mascot` | drive the Sprout mascot through `host.mascot.exec` | none |

Ask for the fewest permissions that work. Sensitive ones (`email`, `documents.*`, `sites.*`, `network`) need a
sentence in the README and in the PR saying why.

**Network.** Extension code never opens sockets. With `network` declared, `host.network.fetch(url, { accept?,
timeoutMs? })` asks the panel to GET the URL. The user is asked per host (allow once, always, block) before
anything is contacted. You get `{ status, finalUrl, contentType, body, truncated }` as text only: allowed types are
`text/calendar`, `application/json`, `text/plain`, `text/xml`, `application/xml`; 2 MiB ceiling; 10 calls a minute
and 200 a day per user per extension. Handle the error codes `consent_required`, `declined`, `blocked_host`,
`blocked_private_host`, `not_allowed_type`, `too_large`, `timeout`, `unreachable`, `quota_exceeded`,
`rate_limited`, `invalid_url`, and never retry in a loop on `declined`, `blocked_host` or `quota_exceeded`. Registry
house rule: no direct `fetch`, `XMLHttpRequest`, `WebSocket` or `EventSource` in your own code.

### The install-time safety scan

Every `.js` and `.mjs` file is scanned line by line when a panel installs the package. Always blocked: `eval(`,
`new Function(` and `Function('...')`, `import(...)` with anything but a string literal, `createElement('script')`,
`document.write(`, `document.cookie =`. Blocked unless the matching permission is declared: bare `fetch(`,
`XMLHttpRequest(`, `WebSocket(`, `EventSource(`, `navigator.sendBeacon(`, and each `host.*` call in the table.
`localStorage` and `sessionStorage` only warn (use `host.storage`). Findings with an undeclared permission refuse
the install. The scan is a tripwire, not a sandbox: do not write code that works around it, because reviewers read
the source.

## 4. Icon: glyph.svg

One colour only; the panel draws it on a tile coloured from the active theme. Rules (full list in
[`docs/icons.md`](../../../docs/icons.md)):

- at most 4096 bytes, `xmlns="http://www.w3.org/2000/svg"`, `viewBox="0 0 N N"` with integer N from 16 to 256;
- elements only `svg g path circle ellipse rect line polyline polygon title`; no `style`, `class`, `id`, `href`,
  `use`, `text`, `defs`, gradients, filters, images, scripts, `url(`;
- `fill` and `stroke` only `none`, `currentColor`, `black`, `#000`, `#000000`; secondary marks use `opacity`,
  `fill-opacity` or `stroke-opacity` from 0.3 to 1; cut holes with `fill-rule="evenodd"`;
- keep the drawing inside a 2-unit margin on a 24 grid; it must stay readable at 18 px.

Start from `templates/extension/glyph.svg`. Preview with `python tools/glyph_sheet.py --png`. A non-theme package
without a conforming glyph is refused by the registry.

## 5. Integrity

Never hand-write hashes. `python tools/build.py` recomputes the `integrity` map for every shipped file (except
`extension.json` and `listing.json`) and rewrites `extension.json`. A shipped file missing from the map, or a stale
entry, fails the install.

## 6. Widgets (optional)

A widget is a fixed-size shelf card running the same kind of module. Schema 2 only, up to 8 per extension:

```json
"widgets": [{
  "id": "upcoming", "name": "Upcoming", "description": "Next events.",
  "sizes": ["small", "wide"], "module": "widgets/upcoming.js", "preview": "widgets/upcoming-preview.svg"
}]
```

`id` matches `^[a-z0-9][a-z0-9-]{0,39}$` and is stored on the user's shelf (renaming drops their card); `name` up to
60 characters; `description` up to 160; `sizes` a non-empty subset of `small`, `wide` (default `small`); `module` a
relative `.js` or `.mjs` path listed in `integrity`; `preview` an optional `.svg`, `.png` or `.webp`. Unknown keys
in a widget are refused. The module has the same `activate(host)` contract plus
`host.widget = { id, size, preview }`: when `preview` is true render sample content and do not write storage or
start background work. A card is about 155 px tall, content is clipped, the top-right corner belongs to the shelf.
More: [tend.host/docs/extension-widgets](https://tend.host/docs/extension-widgets).

## 7. listing.json

```json
{
  "publisher": "Your name or org",
  "category": "utilities",
  "featured": false,
  "reviewed": true,
  "features": ["3 to 6 short bullets", "second", "third"],
  "requirements": ["A Tend panel running extension runtime API 1"],
  "release_notes": "Initial release."
}
```

Required: `publisher`, `category` (a valid category; `themes` for packs), `release_notes`, booleans `featured` and
`reviewed`, `features` (3 to 6 non-empty strings), `requirements` (non-empty list). Optional `homepage` string. Keep
the template's `featured` and `reviewed` values: maintainers decide them. Update `release_notes` on every version.

## 8. Build, validate, test

```bash
pip install -r tools/requirements.txt
python tools/build.py        # validates, rewrites integrity, writes dist/<id>-<version>.zip and dist/registry.json
pytest tests/
bun test tests/js            # only if you added pure-logic tests under tests/js/<id>/
```

Then install `dist/<id>-<version>.zip` into a panel you administer (Extensions, upload): that runs the panel's real
manifest, integrity and scan checks and shows the findings. Open it, exercise every permission, try light and dark
themes, then uninstall it. Packages over 20 MB are refused.

## 9. Submit

See [`tend-git-and-pr`](../tend-git-and-pr/SKILL.md), and finish with
[`tend-review-before-pr`](../tend-review-before-pr/SKILL.md). One extension per folder and per PR. Updating: change
the files, bump `version`, update `release_notes`, rebuild.

## Common refusals

- "unknown permission(s)": not in the table above. Never invent one.
- "does not match its folder name", "'version' must be strict x.y.z", or a version that did not increase.
- Missing or non-conforming `glyph.svg` (the refusal names the rule in brackets, such as `[paint]`).
- A `.js` file or shipped file not covered by `integrity`, or a stale entry: rerun the build.
- Safety scan findings: `eval`, dynamic import, direct network calls without `network`, `host.*` calls without the
  permission.
- Dotfiles or build artefacts in the folder; `listing.json` `features` not 3 to 6.

Source: `tools/build.py` (`KNOWN_PERMISSIONS`, `validate_manifest`, `validate_listing`), `CONTRIBUTING.md`,
`docs/icons.md`; the Tend panel's manifest parser (`internal/api/extensions_lifecycle.go`), safety scan
(`internal/extscan/rules.go`), module loader and `host` API; public docs
[extension-registry](https://tend.host/docs/extension-registry), [extension-network](https://tend.host/docs/extension-network),
[extension-widgets](https://tend.host/docs/extension-widgets), [extension-reminders](https://tend.host/docs/extension-reminders),
[extension-icons](https://tend.host/docs/extension-icons).
