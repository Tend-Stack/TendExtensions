# Build for Tend: the developer kit

For people, and the AI coding agents they work with, who want to build **for** [Tend](https://tend.host), the
self-hosted server panel: extensions, theme packs, shelf widgets, App Store recipes, and apps (Dockerfiles, images,
compose files) that deploy well on it.

> **Read this first.** Every extension, theme pack, App Store recipe and listing is inspected by humans before it is
> published. The AI kit is a convenience, not the default way to build. You are responsible for inspecting, testing,
> fixing and patching AI-generated code (and compose files, Dockerfiles and recipes) before you open a PR. Reviewers
> reject code its author can't explain.

This folder is not for changing Tend itself. It is for building things that run on, install into, or deploy onto a
Tend panel.

## What you can build

| You can build | What it is | Where it ends up |
|---|---|---|
| **An extension** | A small ES-module package (schema-2 `extension.json` + JavaScript + a one-colour `glyph.svg`) mounted in a panel window or as a shell app, with only the permissions it declares | This repository's registry, via a pull request |
| **A shelf widget** | A fixed-size card an extension provides for the user's shelf (up to eight per extension) | Part of an extension |
| **A theme pack** | A code-free extension: wallpaper, palette and shell settings | This repository's registry |
| **An app that deploys on Tend** | Your own project, deployed from Git (with a `Dockerfile`), from a prebuilt image, or from your own CI | Your Tend panel |
| **An App Store recipe** | The install description of an app (image or Git build, port, env hints, volumes, database needs) | A community catalog feed users add to their panel; first-party recipes are curated by Tend |

## Pick your path

| I want to... | Start with | Canonical documentation |
|---|---|---|
| Build an extension | [`skills/tend-extension`](skills/tend-extension/SKILL.md) | [Extension registry](https://tend.host/docs/extension-registry), [network](https://tend.host/docs/extension-network), [reminders](https://tend.host/docs/extension-reminders), [icons](https://tend.host/docs/extension-icons) |
| Add a shelf widget | [`skills/tend-extension`](skills/tend-extension/SKILL.md) (widgets section) | [Widgets](https://tend.host/docs/extension-widgets) |
| Make a theme pack | [`skills/tend-theme-pack`](skills/tend-theme-pack/SKILL.md) | [Theme packs](https://tend.host/docs/extension-themes), [`../docs/themes.md`](../docs/themes.md) |
| Write a Dockerfile Tend builds well | [`skills/tend-dockerfile`](skills/tend-dockerfile/SKILL.md) | [Managing applications](https://tend.host/docs/applications) |
| Write a compose file Tend deploys as a stack | [`skills/tend-compose`](skills/tend-compose/SKILL.md) | [Deploy a Compose file](https://tend.host/docs/compose) |
| Deploy my own app (Git, Dockerfile, image, compose, my CI) | [`skills/tend-deploy-app`](skills/tend-deploy-app/SKILL.md), [`guides/deploy-sources.md`](guides/deploy-sources.md) | [Applications](https://tend.host/docs/applications), [Deploy from your own CI](https://tend.host/docs/deploy-from-your-own-ci) |
| Describe an app as a recipe | [`skills/tend-app-recipe`](skills/tend-app-recipe/SKILL.md) | [Managing applications](https://tend.host/docs/applications) (catalog sources) |
| Automate a panel with a token or an assistant | [`skills/tend-api-and-mcp`](skills/tend-api-and-mcp/SKILL.md) | [API tokens](https://tend.host/docs/api-tokens), [MCP](https://tend.host/docs/mcp) |
| Open a good pull request | [`skills/tend-git-and-pr`](skills/tend-git-and-pr/SKILL.md), [`../CONTRIBUTING.md`](../CONTRIBUTING.md) | |
| Check my work before I submit | [`skills/tend-review-before-pr`](skills/tend-review-before-pr/SKILL.md) | |

Using an AI agent? Point it at [`AGENTS.md`](AGENTS.md). The skills are plain Markdown files with `name` and
`description` front matter; copy the ones you need into `~/.claude/skills/`, a project's `.agents/skills/`, or paste
them into any agent's instructions.

## Tools you actually have

| Tool | What it does | Needs |
|---|---|---|
| [`tools/build.py`](../tools/build.py) | Validates every extension's manifest and listing, rebuilds each `integrity` map, builds the deterministic `dist/<id>-<version>.zip` and `dist/registry.json` | Python 3, `pip install -r tools/requirements.txt` (`cryptography`, `Pillow`) |
| `pytest tests/` | The registry's tooling tests, including the glyph and theme-pack rules | the same virtualenv |
| `bun test tests/js` | Unit tests for pure JS logic, kept in `tests/js/<id>/` (never inside `extensions/<id>/`) | [Bun](https://bun.sh) |
| [`tools/glyph_sheet.py`](../tools/glyph_sheet.py) | Previews every `glyph.svg` (`--png` renders it with headless Chromium) | Python |
| [`templates/extension`](../templates/extension), [`templates/theme-pack`](../templates/theme-pack) | Starting points to copy into `extensions/<id>/` | |
| Your own Tend panel | The real installer: upload the built ZIP as an administrator (Extensions) to run the same manifest, integrity and safety-scan checks a user's panel runs | A Tend panel you administer |

What runs on your pull request, and you cannot run yourself: the registry's CI repeats `tools/build.py`, then runs
every built package through the panel's own validator (`tend-validate-extension`, part of the private Tend source)
before anything is published. `tools/validate_with_panel.py` is that step; it needs a checkout of the Tend source, so
it is for maintainers. Your own panel is the public way to see the same result.

## Test locally

1. Copy a template to `extensions/<your.id>/` (the folder name must equal the manifest `id`).
2. `python tools/build.py` until it is clean, then `pytest tests/`.
3. Install `dist/<id>-<version>.zip` into a panel you administer (Extensions, upload). Open it, try every
   permission path, check it in light and dark themes, and uninstall it again.
4. For a theme pack, enable it and look at it in the wallpaper picker in both modes.

## How submission and review work

1. Fork this repository, add **one** extension per folder and per pull request, and open the PR with the template's
   checklist filled in honestly ([`skills/tend-git-and-pr`](skills/tend-git-and-pr/SKILL.md)).
2. CI rebuilds and validates your package. A maintainer then reads the code, tries it in a panel, and either merges
   or asks for changes.
3. On merge, the registry release is signed and published and panels offer it on their next check.

Humans inspect every extension, theme pack, App Store recipe and listing before it is published. Expect questions
about every file. Reviewers reject code its author can't explain, however it was produced.

There is no automated path that puts a recipe into Tend's first-party App Store: see
[`skills/tend-app-recipe`](skills/tend-app-recipe/SKILL.md) for what is and is not available to you.

## Where to get help

- The panel documentation at [tend.host/docs](https://tend.host/docs) (also in your panel under Help).
- [`CONTRIBUTING.md`](../CONTRIBUTING.md), [`docs/icons.md`](../docs/icons.md) and [`docs/themes.md`](../docs/themes.md) in this repository.
- Open an issue on this repository for a question about the registry or this kit.
- Security problems: **Security, Report a vulnerability** on this repository; never a public issue.
