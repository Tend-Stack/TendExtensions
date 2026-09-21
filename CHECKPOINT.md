# P1 build checkpoint (delete before final commit)

Branch: main (local clone of empty Gitea repo)
Reference core checkout: /home/rubirosa/Projects/Apps/tend.host/local/claude-tray-fixes-r1

## Done
- Cloned repo, set commit identity.
- Scaffold: .gitignore, LICENSE (MIT/TEND Stack), README.md, CONTRIBUTING.md,
  .gitea/PULL_REQUEST_TEMPLATE.md.

## Mapping findings (see report for full detail)
- 19 extensions to seed. 16 from default_extensions/*.zip as-is, 1
  (host.tend.calculator) prefers the extensions/extensions/calculator source
  folder (tie at 3.0.0), 3 from More_Games (host.tend.flappybird SKIPPED —
  requires unknown runtime module phaser@3; host.tend.sudoku and
  host.tend.wordle included, unique ids, pass parse_manifest).
- gem-crush/match-puzzle/memory-game source folders superseded by newer
  ZIP versions (3.0.4/2.1.1/2.2.0 vs 1.1.0) - ZIP wins, source unused.
- go-game (host.tend.gogame) has NO default_extensions ZIP counterpart -
  not a "bundled default", skipped per literal instruction scope.
- hello-world: schema-1 legacy iframe extension, explicitly skipped.
- Loose html samples (minigame2.html, "memorygame sample.html"): skipped.
- 10 More_Games entries (breakout, cookie-clicker, fruit-ninja, minesweeper,
  peggle, simon-says, snake, solitaire, tetris, twenty-forty-eight) are
  duplicate/older-versioned ids already seeded from the newer bundled ZIPs -
  skipped as superseded duplicates (ids must be unique).
- catalog.json only has host.tend.sites / host.tend.notes - neither matches
  any seeded id, so publisher="TEND Stack" (fallback) for all 19, featured
  only calculator, reviewed true for all. catalog's `requirements` and
  `release_notes` fields are arrays of strings in the real catalog; contract
  overrides release_notes to a fixed string "Initial registry release." for
  registry entries; requirements kept as array-of-strings per catalog shape.
- build.py design: rewrites extensions/<id>/extension.json's integrity map
  in place (core's own extensions/extensions/build.py precedent), covering
  every shipped file except extension.json itself; then builds ZIP from the
  now-updated file. Deterministic: sorted members, mtime 1980-01-01, no dirs,
  no dotfiles, no listing.json.

## Next
- Seed extensions/ directories (unzip + copy source folder).
- Hand-author listing.json per extension.
- Write tools/*.py, scripts/publish-verified-main.py, ci.yml, tests/.
- Run build, validate_with_panel, pytest; commit series; report.
