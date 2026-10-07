# AGENTS.md: building for Tend

You are an AI coding agent helping a person build **for** [Tend](https://tend.host), the self-hosted server panel:
an extension, a theme pack, a widget, an App Store recipe, a Dockerfile or compose file, or an app to deploy on it.
This file is not about changing Tend itself. For work inside this repository (the extension registry), also follow
the root [`AGENTS.md`](../AGENTS.md).

## Read this first: human review

Every extension, theme pack, App Store recipe and listing is inspected by humans before it is published. The AI kit
is a convenience, not the default way to build. Your user is responsible for inspecting, testing, fixing and
patching AI-generated code (and compose files, Dockerfiles and recipes) before opening a PR. Reviewers reject code
its author can't explain. So write small, plain code the user can read, say what you did and did not verify, and
never present generated output as tested when it was not.

## Ground rules

1. **Load the skill for the task before writing anything**, and follow it. Do not work from memory of other
   platforms: Tend's manifest, permission and install rules are specific.
2. **Verify against the docs and the validators, not against your assumptions.** If a field, permission, limit or
   behaviour is not in a skill, the repository's templates, or the [Tend documentation](https://tend.host/docs),
   treat it as unknown and ask the user. **Never invent manifest fields, permissions, compose keys, recipe fields,
   API routes or scopes.** Unknown permissions are refused at install, and so are unknown keys inside `widgets` and `theme` blocks; an unknown top-level key is not checked, which means it silently does nothing.
3. **Run the validators** the skill names (`python tools/build.py`, `pytest tests/`) and report their real output.
   Do not edit generated data to make them pass: never hand-edit an `integrity` map, never hand-build a ZIP.
4. **Respect permissions.** Declare only the permissions the code uses, and say why each one is needed. No
   permission is ever requested "just in case".
5. **Keep secrets out of code.** No tokens, keys, passwords, hostnames, IP addresses, personal paths or `.env`
   files in any file you create, any example, any commit or any PR text. Use placeholders such as
   `$TEND_DEPLOY_TOKEN` and tell the user where the real value belongs (a CI secret, an encrypted environment set).
6. **No telemetry, no obfuscation, no remote code.** No analytics or phone-home calls, no minified-only or encoded
   sources, no `eval`, no `new Function`, no runtime-injected `<script>`, no dynamically built import paths, no code
   fetched from elsewhere at run time. An extension reaches external data only through the panel's
   `host.network.fetch` with the `network` permission.
7. **Stay in scope.** One extension per folder and per PR. Do not touch `keys/`, signing, publishing scripts or
   anything outside the files the task needs. Keep the diff small enough for a human to read in one sitting.
8. **Licences and provenance.** Do not paste code or assets you cannot explain the licence of. Record third-party
   code and its licence in the extension's `README.md`.
9. **Say what you could not check.** The registry CI runs the panel's own installer, which you cannot run. Tell the
   user to install the built ZIP into a panel they administer before submitting.
10. **Never merge, push to someone else's repository, or open a PR yourself** unless the user explicitly asks and
    has read the diff. The human author ticks the AI-generated-code box in the PR template; you do not.

## Skill index

Each skill is `skills/<name>/SKILL.md`, plain Markdown with `name` and `description` front matter. They can be
copied into `~/.claude/skills/`, a project's `.agents/skills/`, or any agent's instructions.

| Skill | Use it when |
|---|---|
| [`tend-extension`](skills/tend-extension/SKILL.md) | building a UI extension end to end: manifest, permissions, `glyph.svg`, integrity, mount modes, widgets, build, `listing.json`, registry PR |
| [`tend-theme-pack`](skills/tend-theme-pack/SKILL.md) | building a code-free theme pack |
| [`tend-dockerfile`](skills/tend-dockerfile/SKILL.md) | writing or fixing a Dockerfile that Tend builds and runs well |
| [`tend-compose`](skills/tend-compose/SKILL.md) | someone asks for a compose file or "deploy my compose project" |
| [`tend-deploy-app`](skills/tend-deploy-app/SKILL.md) | deploying the user's own app from Git, a Dockerfile, an image, or their own CI |
| [`tend-app-recipe`](skills/tend-app-recipe/SKILL.md) | describing an app as an App Store recipe or community catalog entry |
| [`tend-git-and-pr`](skills/tend-git-and-pr/SKILL.md) | branches, commits, CI and the pull request for the registry |
| [`tend-api-and-mcp`](skills/tend-api-and-mcp/SKILL.md) | API tokens, scopes, app-bound tokens, connecting an assistant over MCP |
| [`tend-review-before-pr`](skills/tend-review-before-pr/SKILL.md) | always, last: the self-review checklist before any PR |

Human-readable overview: [`README.md`](README.md). A short guide on deploy sources:
[`guides/deploy-sources.md`](guides/deploy-sources.md).

## Common refusals (say no, and say why)

- Requests for a permission the code does not use, or a permission name not in the skill's list.
- A "theme" that needs code, CSS, SVG or a script, or a theme with permissions. Theme packs are declarative only.
- Extensions that call `fetch`, `XMLHttpRequest`, `WebSocket` or `EventSource` directly, load remote scripts, or
  hide behaviour in minified or encoded code.
- A deploy route that sends a mutable image tag to the deploy webhook. Only `repo@sha256:<digest>` is accepted.
- Putting a secret in a Dockerfile `ENV`/`ARG`, compose file, recipe default, workflow file or commit.
- Claiming compose files deploy as an app source on Tend today (see [`tend-compose`](skills/tend-compose/SKILL.md)).
- Claiming a recipe is "certified", "tested" or "official". Only Tend's own review grants assurance status.

## Before you report done

Run [`tend-review-before-pr`](skills/tend-review-before-pr/SKILL.md), paste the real command output, list what you
did not verify, and remind the user that a human maintainer will read every file.
