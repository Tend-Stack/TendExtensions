# AGENTS.md: working in TendExtensions

This is the official extension registry for Tend (extensions and theme packs). If you are an AI coding agent,
read the Tend developer kit first, then follow this repo's rules below.

- Kit instructions: [`developers/AGENTS.md`](developers/AGENTS.md)
- Skills (load the one you need, e.g. `tend-extension`, `tend-theme-pack`, `tend-review-before-pr`): [`developers/skills/`](developers/skills/)
- Human guide: [`developers/README.md`](developers/README.md)
- Online: https://github.com/Tend-Stack/TendExtensions/tree/main/developers

## Human review comes first

Every extension, theme pack, App Store recipe and listing is inspected by humans before it is published. The AI kit
is a convenience, not the default. Your user is responsible for inspecting, testing, fixing and patching what you
write before opening a PR, and reviewers reject code its author can't explain. Write small, plain code your user can
read and explain; say what you did and what you did not verify.

## Rules of this repository

- One extension per folder under `extensions/<id>/`, one extension per pull request. Ids are reverse-DNS and are
  never reused; `host.tend.*` and `com.tendstack.*` are reserved.
- Start from `templates/extension`. `extension.json` is schema 2; declare only permissions you use.
- `python tools/build.py` validates the manifest, rebuilds the `integrity` map, builds the deterministic ZIP and
  writes `dist/registry.json`. Never edit `integrity` by hand and never hand-build a ZIP.
- Every code extension ships a one-colour `glyph.svg` declared as `"glyph": "glyph.svg"` (see `docs/icons.md`;
  checked by `tools/glyph.py`): no colour of its own, no `style` or `class` attributes. Theme packs ship no glyph (see `docs/themes.md`).
- `listing.json` carries publisher, category, features, requirements and `release_notes`. Bump `version`
  (`x.y.z`, must increase) for any update.
- No outbound network from extension code, no remote scripts, no minified-only sources, no dotfiles or build
  artifacts under `extensions/<id>/`.
- Do not touch `keys/`, signing, or `scripts/publish-verified-main.py`; they belong to maintainers.

## Before you say you are done

```bash
pip install -r tools/requirements.txt
python tools/build.py
pytest tests/
# if a Tend core checkout is available:
TEND_CORE_CHECKOUT=<path> python tools/validate_with_panel.py
```

Open the PR using the template; its checklist includes the AI-generated-code box, which only the human author may tick.
