## What

<!-- New extension, or a version bump of an existing one? -->

## Checklist

- [ ] `extensions/<id>/extension.json` is a valid schema-2 manifest (id,
      name, version `x.y.z`, permissions, `ui.module` + `ui.mount`).
- [ ] `extensions/<id>/listing.json` is present with `publisher`, `category`,
      `featured`, `reviewed`, `features`, `requirements`, `release_notes`.
- [ ] No dotfiles or stray build artifacts under `extensions/<id>/`.
- [ ] `python tools/build.py` runs clean locally (validates the manifest,
      rebuilds the integrity map, builds the ZIP and `dist/registry.json`).
- [ ] `TEND_CORE_CHECKOUT=<path> python tools/validate_with_panel.py` passes
      against a local checkout of the Tend panel core, if available.
- [ ] `pytest tests/` passes.
- [ ] Version bumped (updates only) and `release_notes` describes the change.

## Notes for reviewers

<!-- Anything that needs a second look: new permission, new runtime module,
     unusually large package, etc. -->
