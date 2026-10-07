## What

<!-- New extension, theme pack or recipe, or an update? One per pull request. -->

## Checklist

For an extension or theme pack:

- [ ] `extensions/<id>/extension.json` is a valid schema-2 manifest (id,
      name, version `x.y.z`, permissions, `ui.module` + `ui.mount`).
- [ ] `extensions/<id>/listing.json` is present with `publisher`, `category`,
      `featured`, `reviewed`, `features`, `requirements`, `release_notes`.
- [ ] Code extensions ship a conforming `glyph.svg` declared as `"glyph": "glyph.svg"`
      ([docs/icons.md](../docs/icons.md)); no colour of your own, `icon.svg`
      only for older panels. Theme packs carry neither.
- [ ] No dotfiles or stray build artifacts under `extensions/<id>/`.
- [ ] Version bumped (updates only) and `release_notes` describes the change.

For an App Store recipe ([docs/recipes.md](../docs/recipes.md)):

- [ ] `recipes/<slug>/` holds only `recipe.json` and `listing.json`; the folder name is the slug.
- [ ] `python tools/validate_recipe.py recipes/<slug>` passes.
- [ ] The image is pinned to an exact version or digest (no `latest`), no default passwords or tokens,
      every path that holds state is a volume, one container.
- [ ] I installed it on a Tend panel I administer, and `tested_with` says exactly what I did.

For every pull request:

- [ ] `python tools/build.py` runs clean locally (validates the manifest,
      rebuilds the integrity map, builds the ZIP and `dist/registry.json`) and I committed the result.
- [ ] `TEND_CORE_CHECKOUT=<path> python tools/validate_with_panel.py` passes
      against a local checkout of the Tend panel core, if available.
- [ ] `pytest tests/` passes.
- [ ] I changed only `extensions/<id>/`, `recipes/<slug>/` and `tests/js/`. Changes to tools, workflows, keys,
      templates and docs are maintainer-only and make the pull request fail its checks.
- [ ] I will not push to this pull request after it is approved without asking for a new review (a new commit
      voids the approval).

## AI-generated code

- [ ] I wrote this, or I have read, run and understood every line an AI tool
      wrote for me (including any Dockerfile, compose file or recipe), and I can
      explain it. Reviewers reject code its author can't explain.
- [ ] If an AI agent helped, I said so under "Notes for reviewers".

## Notes for reviewers

<!-- Anything that needs a second look: new permission, new runtime module,
     unusually large package, an unusual recipe field value, etc. -->
