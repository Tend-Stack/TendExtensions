---
name: tend-review-before-pr
description: Self-review checklist to run before opening any pull request or sharing anything built for Tend (extension, theme pack, widget, Dockerfile, compose file, recipe, CI snippet). Covers security, permissions, secrets, licences, accessibility, the glyph or theme icon, size, and inspecting AI-generated code. Use when you are about to open a PR or share anything built for Tend; run it last, every time.
---

# Review before you open the PR

Every extension, theme pack, App Store recipe and listing is inspected by humans before it is published. The AI kit
is a convenience, not the default. The author is responsible for inspecting, testing, fixing and patching
AI-generated code (and compose files, Dockerfiles and recipes) before opening a PR. Reviewers reject code its author
can't explain. This checklist is for the human author; an agent runs it and reports real results, never "looks fine".

Work through it in order. Anything you cannot check, write down under "Notes for reviewers".

## 1. Inspect the generated code yourself

- [ ] I read every file in the diff, not the summary. I can say in one sentence what each file is for.
- [ ] No code I cannot explain: no clever one-liners, encoded strings, minified-only files, `eval`, `new Function`,
      dynamic imports, runtime `<script>` injection, `document.write`, `document.cookie`.
- [ ] No dependency, snippet or asset copied from somewhere I cannot name; licences recorded in the README.
- [ ] I ran it. I did not trust "it should work" from the agent. I installed the built ZIP (or ran the container) in
      a panel or Docker host I control and used every feature once.
- [ ] I fixed or removed anything speculative: unused permissions, unused files, dead code, invented fields.

## 2. Security and permissions

- [ ] `permissions` lists only what the code calls; each has a sentence in the README and the PR saying why.
      Sensitive ones (`network`, `email`, `documents.*`, `sites.*`, `files.read`) were deliberately chosen.
- [ ] No direct `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`; external data goes through
      `host.network.fetch`, with every failure code handled and no retry loops.
- [ ] No telemetry, analytics, tracking pixels or phone-home calls; no remote code or remote configuration.
- [ ] User data (storage, documents, files) is only used for what the extension says; nothing is sent elsewhere.
- [ ] Rendering untrusted text (feeds, titles, imported files) uses `textContent` or escaping, never raw `innerHTML`.
- [ ] Dockerfile: non-root, no secrets in `ARG`/`ENV`/layers, pinned base images, no privileged or host networking.
- [ ] Compose file or recipe: no secrets or default passwords, no Docker socket mount, pinned image versions,
      one container per recipe entry.
- [ ] CI snippet: secrets only from the CI secret store; deploy by `repo@sha256:digest`, never a tag.

## 3. Secrets and private data

- [ ] `git grep -nEi 'token|secret|password|api[_-]?key|BEGIN [A-Z ]*PRIVATE'` shows only placeholders and names.
- [ ] No `.env`, key files, hostnames, IP addresses, personal paths, emails or customer data in files, history,
      screenshots or PR text. If one slipped into an earlier commit, rotate it and rewrite the branch before review.

## 4. Packaging and size

- [ ] `python tools/build.py` and `pytest tests/` finish clean (paste the summary lines in the PR).
- [ ] `integrity` was rebuilt by the build, not edited. No dotfiles, `node_modules`, build output or editor files.
- [ ] Package is well under the 20 MB ceiling; images are compressed and metadata-stripped; no unused assets.
- [ ] `version` is strict `x.y.z` and higher than before (updates); `release_notes` describes this version.
- [ ] `listing.json`: valid `category`, 3 to 6 honest `features`, real `requirements`; nothing the extension cannot do.

## 5. Icon, theme and accessibility

- [ ] Extensions: `glyph.svg` is declared, one colour only, readable at 18 px, previewed with
      `python tools/glyph_sheet.py --png`, and looks right on the tile in light and dark themes.
- [ ] Theme packs: no glyph or icon (the thumbnail is the store card); thumbnail 480 px wide and 240 to 320 tall; both
      modes tried with windows open; `primaryContent` on `primary` passes 4.5:1; wallpaper rights are mine.
- [ ] UI: usable by keyboard (tab order, visible focus, Escape closes), controls have text labels or `aria-label`,
      text contrast is readable in both themes, motion respects `prefers-reduced-motion`, touch targets are not tiny,
      the layout holds at narrow widths, and state is not shown by colour alone.
- [ ] Widgets: lay out for every declared size, handle `host.widget.preview` (no storage writes), and clean up in
      `unmount()`.

## 6. Lifecycle and manners

- [ ] `unmount()` and `host.onUnmount` release timers, listeners and observers; nothing runs when the window is closed.
- [ ] Errors are shown to the user in plain words; no stack traces or secrets in messages.
- [ ] The PR is one extension, titled `feat(<id>): ...` or `fix(<id>): ...`, with the template filled in, every
      permission explained, and a line saying whether an AI agent helped.

## 7. Say what you did not verify

The registry's CI runs the panel's real installer, which only maintainers can run. Write what you tested and where
(panel version, browser, theme), and what you did not.

## Common refusals (for agents)

- Do not tick "I have read and understood" on the author's behalf, do not claim tests that were not run, and do not
  open or merge the PR yourself unless the user explicitly asked and has read the diff.

Source: this kit's other skills; `CONTRIBUTING.md`, `.gitea/PULL_REQUEST_TEMPLATE.md`, `docs/icons.md`,
`docs/themes.md`, `tools/build.py`.
