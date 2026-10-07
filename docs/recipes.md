# Community recipes

A **recipe** tells a panel how to install one app from the App Store: an image, a port, a few environment hints,
volumes and the databases it needs. This page is the rulebook for recipes in this repository. Every recipe is read
by a human before it is published, and the person who submits it is expected to have installed it on a real panel.

Merged recipes are published in the signed **Tend Community** catalog, which panels show by default, labelled
"Community · reviewed by Tend". That label means a person reviewed the recipe's text. It never means `tested` or
`certified`: those statuses, and the first-party catalog, belong to Tend's private catalog and need lifecycle
evidence this repository does not collect.

## Layout

```
recipes/<slug>/recipe.json     one entry of the community catalog feed a panel reads
recipes/<slug>/listing.json    reviewer metadata: who, upstream licence, what you tested (never shipped to panels)
```

Nothing else may live in a recipe folder (no icons, no READMEs, no dotfiles). Start from
[`templates/recipe/example-notes`](../templates/recipe/example-notes), copy it to `recipes/<your-slug>/` and edit
both files. The folder name must equal `slug`. One recipe per pull request. The machine-readable shape is
[`recipes/recipe.schema.json`](../recipes/recipe.schema.json); [`tools/validate_recipe.py`](../tools/validate_recipe.py)
is the authority and adds the rules a schema cannot express.

## `recipe.json`

Every key below is required (lists may be empty), and no other key is allowed. A panel reads exactly these fields
from a community feed and replaces everything else (publisher, provenance, assurance, health, backup and update
contracts, confinement) with facts it enforces itself, so an extra key cannot do anything except mislead a reader.
Fields that only first-party recipes may carry (`build`, `publisher`, `assurance`, `runtime_security`, `health`,
`post_install`, `needs_db`, ...) are rejected by name.

| Field | Rule |
|---|---|
| `slug` | lowercase letters, digits and dashes, 1 to 40 characters, equal to the folder name; never a built-in app's slug (the panel would show the built-in and hide yours; see [`tools/data/builtin-slugs.txt`](../tools/data/builtin-slugs.txt)) |
| `name`, `tagline` | plain text, one line, up to 60 and 100 characters |
| `category` | one of `AI`, `Analytics`, `Automation`, `Content`, `Database`, `Developer`, `Education`, `Mail`, `Media`, `Monitoring`, `Observability`, `Productivity`, `Other` |
| `icon` | a single emoji; panels draw it as the app's tile. No letters, digits, markup or URLs; artwork is first-party only |
| `source` | `"image"`. A git build cannot be pinned in a community feed, so it is not accepted |
| `source_ref` | an image reference with an **exact version** (`ghcr.io/example/notes:1.4.2`) or a digest (`@sha256:...`). `latest`, `stable`, `main`, `edge`, `nightly` and tag-less references are refused: a mutable tag is not reproducible evidence |
| `default_port` | the in-container HTTP port the panel routes to and probes, 1 to 65535 |
| `suggested_name` | default instance name, lowercase letters, digits, dashes |
| `env_hints[]` | `key`, `kind` (`text`, `password`, `url`, `timezone`), `default`, `description`, `required`. A `password` variable has an empty `default` and is `required`; any variable whose name looks like a secret (`PASSWORD`, `SECRET`, `TOKEN`, `API_KEY`, ...) ships no default |
| `volumes[]` | `name_suffix` (`data` and an app named `blog` give `blog-data`), `mount_path` (absolute, no `..`, not under `/proc`, `/sys`, `/dev`, `/run`, `/var/run`, never the Docker socket), `description`. Declare every path that holds state, so a first deploy cannot lose data |
| `docs_url` | an `https` URL to real documentation |
| `notes` | what the user must do on first run |
| `tags` | up to 8 lowercase words |
| `needs_dbs` | engines Tend links for the app: `postgres`, `mysql`, `mariadb`, `redis`, `clickhouse` |

One container per recipe: databases are linked through `needs_dbs`, never bundled. Refused on sight: privileged
mode, host networking, the Docker socket, default credentials, an entry that needs manual file edits to start.

## `listing.json`

`publisher`, `upstream_url` (https), `upstream_license`, `recipe_license` (`MIT`, `Apache-2.0` or `CC0-1.0`; the
recipe is yours to license, and this registry is MIT), `tested_with` (the panel version and what you exercised:
installed, signed in, restarted, data kept) and `release_notes`. Only describe what you did. Reviewers read it
first, and it is never part of what panels download.

## Check it

```bash
pip install -r tools/requirements.txt
python tools/validate_recipe.py recipes/<slug>     # the recipe rules, with every problem listed
python tools/build.py                              # also builds dist/community-catalog.json
pytest tests/
```

Then install the image yourself: `docker run --rm -p 8080:<default_port> <source_ref>` starts it, and a real install
on a panel you administer shows readiness, first sign-in, restart and persistence. The public validator re-implements
the panel's community-feed rules from their documented contract; the panel itself has the last word when it reads
the feed, so a recipe that passes here but misbehaves in a panel is a bug in this validator, and we want to hear
about it.

## How it is published

1. Your pull request is checked on GitHub by [`validate-pr.yml`](../.github/workflows/validate-pr.yml) (no secrets, see
   [`community-review.md`](community-review.md)).
2. A reviewer reads the diff and the checks in Tend Review and approves the exact commit.
3. The registry importer puts the approved commit on `main`; the normal pipeline revalidates and releases.
4. `tools/build.py` writes `dist/community-catalog.json` (every recipe, sorted by slug, deterministic bytes). The
   release job signs it with the community catalog key and attaches three files to the `registry-N` release:
   `community-catalog.json`, `community-catalog.json.sig` (raw 64-byte Ed25519 signature) and `tend-catalog-pubkey`
   (the base64 public key). This is the format panels already verify for any federated catalog source.
5. Tend's site serves the latest signed catalog at `https://tend.host/catalog/community.json` (with `.sig` and
   `/.well-known/tend-catalog-pubkey`), and panels list it by default. A panel pins the key on first use; rotating
   the key makes every panel show a mismatch until its administrator clears the pin, so the key is rotated only for
   cause.

Promoting a recipe into Tend's first-party catalog is a separate, private maintainer decision with its own evidence
bar; opening a pull request here does not request it.
