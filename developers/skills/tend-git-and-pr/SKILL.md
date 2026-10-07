---
name: tend-git-and-pr
description: Git and pull-request workflow for contributing an extension or theme pack to the TendExtensions registry (fork, branch, commits, local checks, CI, the PR template, what reviewers check, updating an existing extension). Use when the user is ready to commit and open a PR, or asks how submission works.
---

# Git and pull requests for the registry

Human review applies: a maintainer reads every file of every PR, installs it in a panel and tries it. Reviewers
reject code its author can't explain. The human author opens, and answers for, the PR. If you are an agent, prepare
the branch and the description, tell the user what to read, and do not push or open the PR yourself unless
explicitly asked.

## Repository layout

```
extensions/<id>/             one folder per extension or theme pack (folder = manifest id)
    extension.json  listing.json  glyph.svg  README.md  *.js ...
templates/extension/         starter for a code extension
templates/theme-pack/        starter for a gradient theme pack
tools/build.py               validate, rebuild integrity, build ZIPs and dist/registry.json
tools/glyph_sheet.py         glyph preview
tests/                       tooling tests; tests/js/<id>/ for your own pure-JS unit tests
docs/icons.md  docs/themes.md
.gitea/PULL_REQUEST_TEMPLATE.md   the PR checklist
```

`dist/` is never committed. `keys/`, `tools/sign.py`, `tools/release.py`, `scripts/` and the workflows are the
maintainers'; do not edit them in an extension PR.

## Steps

1. **Fork** `https://github.com/Tend-Stack/TendExtensions` and clone your fork. Create a branch from the current
   `main`: `git switch -c add-<short-name>` (or `update-<short-name>`). One extension per branch and per PR.
2. **Work** inside `extensions/<id>/` only (plus tests under `tests/js/<id>/` if you add them). Follow
   [`tend-extension`](../tend-extension/SKILL.md) or [`tend-theme-pack`](../tend-theme-pack/SKILL.md).
3. **Check locally**, from the repository root, until clean:

   ```bash
   pip install -r tools/requirements.txt
   python tools/build.py
   pytest tests/
   bun test tests/js      # only if you added JS unit tests
   git status --short     # nothing outside your folder; no dist/, no dotfiles
   ```

   Install the built `dist/<id>-<version>.zip` into a panel you administer and use it. The registry's own CI also runs
   every package through the panel's real installer, which you cannot run; your own panel is the public equivalent.
4. **Commit** small and conventional, with explicit paths (`git add extensions/<id>`; never `git add -A` over a tree
   with build output). The history uses `feat(<id>): ...`, `fix(<id>): ...`, `docs: ...`, `test: ...`:

   ```
   feat(com.example.timer): Timer 1.0.0, a countdown tool window

   Permissions: storage (saves the last duration). No network.
   ```

   Rebuilding rewrites `extension.json`'s `integrity`: commit that result. Do not commit secrets, local paths or
   machine-generated noise. Do not rewrite history after review starts; add commits.
5. **Push** your branch to your fork and **open the PR** against `main` of `Tend-Stack/TendExtensions`. Fill in
   the template: what it is (new, or a version bump), every checklist item honestly, and under "Notes for reviewers"
   every permission and why, any third-party code and licence, and whether an AI agent helped. The AI-generated-code
   box is ticked only by the human author who has read, run and understood every line.
6. **CI and review.** CI rebuilds the package (`tools/build.py`), checks the build is reproducible and validates it
   against the panel's installer; you may not see those checks on GitHub, so paste your local summary lines in the PR.
   A maintainer reads the code, tries the extension, and asks for changes or merges. Answer questions; fix by
   pushing more commits.
7. **After merge**, `main` builds, signs `registry.json` and publishes a `registry-<n>` release; panels pick it up on
   their next check. `main` is fast-forward only, so rebase your branch if asked.

## Updating an existing extension

Edit the files, bump `version` in `extension.json` (strict `x.y.z`, must increase), rewrite `release_notes` in
`listing.json` to describe this version, rebuild, test, PR. A new permission stops users' updates for review: say why
in the PR. An extension id is never reused for a different extension.

## What reviewers check

- Does it do only what the manifest and README say, with the fewest permissions, each justified?
- Source readable (no minified-only or encoded code), no remote scripts, no direct network calls, no telemetry,
  no `eval` or dynamic import, no obfuscation.
- Safe handling of user data and storage; no secrets, tokens or personal paths in files.
- Glyph conforms and looks right on the themed tile; theme packs: contrast, thumbnail, rights to images.
- Package size sensible (the hard ceiling is 20 MB), a clean `README.md`, licences recorded.
- That the author can explain it.

## Verify

`git diff --stat origin/main...HEAD` shows only `extensions/<id>/` (and optional `tests/js/<id>/`); the PR template is
filled in; `python tools/build.py` and `pytest tests/` summaries are pasted.

## Common refusals

- Several extensions in one PR; edits to `keys/`, signing or workflows; committed `dist/`.
- `git push --force` to someone else's branch, merging your own PR, or opening a PR on the user's behalf unasked.
- Hand-editing `integrity` or `dist/registry.json`.

Source: `CONTRIBUTING.md`, `README.md` (how an extension reaches a panel), `.gitea/PULL_REQUEST_TEMPLATE.md`,
`.gitea/workflows/ci.yml`, `tools/build.py`, the registry's commit history. There is no public pull-request path for
App Store recipes: see [`tend-app-recipe`](../tend-app-recipe/SKILL.md).
