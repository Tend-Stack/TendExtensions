---
name: tend-app-recipe
description: Describe an app as a Tend App Store recipe (the install description: image or Git build, port, environment hints, volumes, databases) and publish it as a community catalog feed; also explains the first-party recipe format and why third parties cannot self-certify one. Use when the user wants an app to appear in the App Store or asks how recipes are proposed.
---

# App Store recipes

Human review applies. Every App Store recipe is inspected by humans before Tend publishes it as first-party, and a
community feed is something each panel administrator reads before adding. You and the user must test the recipe
(a real install on a real panel) before sharing it. Reviewers reject recipes their author can't explain.

## What is and is not available (read first)

There are two different things called a recipe:

| | First-party recipe | Community catalog entry |
|---|---|---|
| Where it lives | `builtin.json` inside Tend's own source (a private repository) | a JSON file you host over HTTPS |
| Who changes it | Tend maintainers, with lifecycle evidence and human review | you |
| How users get it | shipped in every panel's App Store | an administrator adds your URL under **Settings, Catalog sources** |
| Status shown | `candidate` until evidence-backed review grants more | always `community`, publisher shown as your source, never certified |

**There is no public pull-request or submission flow into the first-party catalog today.** Do not tell the user to open
a PR for one. What you can do: publish a community feed, and, if you believe the app belongs in the first-party
catalog, contact the Tend maintainers through [tend.host](https://tend.host) with a tested recipe and expect human
review that may say no. Nothing here lets you grant `tested` or `certified` yourself.

## Community feed format (what you write)

A JSON document with an `entries` array. Hosting limit: the body is at most 2,000,000 bytes. Panels refresh a source
on adding it, on demand and hourly.

```json
{
  "name": "Example Apps",
  "version": "1",
  "entries": [
    {
      "slug": "example-notes",
      "name": "Example Notes",
      "tagline": "A small self-hosted notes app",
      "category": "Productivity",
      "icon": "📝",
      "source": "image",
      "source_ref": "ghcr.io/example/notes:1.4.2",
      "default_port": 8080,
      "suggested_name": "notes",
      "env_hints": [
        { "key": "ADMIN_PASSWORD", "kind": "password", "default": "", "description": "Admin password for first sign-in.", "required": true },
        { "key": "TZ", "kind": "timezone", "default": "UTC", "description": "Time zone.", "required": false }
      ],
      "volumes": [ { "name_suffix": "data", "mount_path": "/data", "description": "Notes and attachments." } ],
      "docs_url": "https://example.com/notes/docs",
      "notes": "First run: open the site and create your account.",
      "tags": ["notes"],
      "needs_dbs": []
    }
  ]
}
```

| Field | Rule |
|---|---|
| `slug`, `name`, `source_ref` | required; an entry missing any is silently skipped. `slug` must not equal a built-in slug (the built-in wins) |
| `source` | `image` (default) or `git`; anything else is treated as `image`. `source_ref` is the image reference or the repository URL |
| `default_port` | the in-container HTTP port the panel routes to and checks |
| `env_hints[]` | `key`, `kind` (`text`, `password`, `url`, `timezone`), `default`, `description`, `required` |
| `volumes[]` | `name_suffix` (combined with the app name, `data` and `blog` give `blog-data`) and `mount_path`; entries missing either are dropped |
| `needs_db` or `needs_dbs[]` | database engine kinds the app needs (first-party recipes use `postgres`, `mysql`, `redis`, `clickhouse`) |
| `tagline`, `category`, `icon`, `suggested_name`, `docs_url`, `notes`, `tags` | presentation |

The panel then **replaces** publisher, provenance and assurance with your source's identity and `community`, denies
launch priority and drops anything first-party-only (`build`, `fixed_internal_port`, `runtime_command`,
`post_install`, `runtime_security`, artwork and screenshots). Everything else (health probe, backup units from your
volumes, update policy, confinement) is filled in by the panel from facts it enforces. A recipe can never grant
itself privileges.

Write recipes that deserve trust:

- Pin an exact version in `source_ref` (`1.4.2`, or `repo@sha256:...`), never `latest`. A mutable tag is not
  reproducible evidence.
- Declare every path that holds state as a volume so the first deploy cannot lose data.
- Never ship a default password or token in `default`; mark secrets `kind: password` and `required: true`.
- One container per entry. Databases are linked through `needs_dbs`, not bundled.
- Say in `notes` what the user must do on first run. Link real documentation in `docs_url`.

### Signing a feed (optional)

Publish `<feed-url>.sig` (a raw 64-byte or base64 Ed25519 signature over the exact feed bytes) and the base64 public
key at `<origin>/.well-known/tend-catalog-pubkey`. On the first refresh the panel pins that key and labels the source
**Verified community**; later refreshes must verify against the pinned key, and a changed key is reported as a
mismatch while the last good entries stay. A signature authenticates the source, not the safety of its apps. Unsigned
feeds work and stay **Unverified**.

Other formats a panel understands from a source URL: Portainer App Templates v2/v3, linuxserver.io's index
(filtered to a reviewed set), and a GitHub repository of `Apps/<name>/docker-compose.yml` files
([`tend-compose`](../tend-compose/SKILL.md)).

## First-party recipe format (for reference, and for a maintainer proposal)

Each entry additionally carries, with fixed vocabularies: `build` (`branch`, `dockerfile_name`) for pinned Git
builds, `fixed_internal_port`, `recipe_schema`/`recipe_revision`, `publisher`, `provenance` (`source_type`,
`upstream_url`, `upstream_license`, `recipe_license`), `assurance` (`status`: `candidate`, `community`, `tested`,
`certified`, `deprecated`, `revoked`, with `evidence_url`, `tested_at`, `expires_at`), `artifact` (`digest_status`:
`tag-unresolved`, `digest-pinned`, `source-pinned`, `unknown`), `resources`, `runtime_security` (`cap_drop`, `cap_add`
with a stated exception, `no_new_privileges`, `pids_limit`, `memory_mb`, `cpu_cores`), `health` (declarative `tcp` or
`http` probes only, never shell commands), `backup` (`restic-volume-snapshot` units, restore order), `updates`
(channel, `replace-container`, rollback `previous-verified-image`), `needs_dbs[]` (with `env_mapping`), `post_install`.
Status moves only with published evidence and an expiry (install, readiness, function, persistence, restart,
backup and restore, upgrade, rollback, confinement and cleanup are exercised on an immutable digest, then a human
reviews). Do not fabricate any of these fields.

## Verify

```bash
jq -e '.entries | length > 0 and all(.[]; .slug and .name and .source_ref)' feed.json
docker pull <source_ref> && docker run --rm -p 8080:<default_port> <source_ref>    # does it start, on that port?
```

Then add the feed to a panel you administer (**Settings, Catalog sources**), check the entry appears with the right
badge, and run a real install: readiness, first sign-in, restart, data still there.

## Common refusals

- "Mark it certified/tested/official": no; only Tend's own review sets that.
- `latest` tags, secrets in defaults, `privileged`/host networking/Docker socket requirements, several containers in
  one entry, an entry that cannot be installed without manual file edits.
- Inventing recipe fields. Unknown fields are ignored, so they silently do nothing.

Source: panel `internal/catalog/types.go` and `builtin.json` (first-party entry shape), `internal/catalog/catalog.go`
(`Normalize`), `internal/api/catalog_source_adapters.go` (`parseNative`, formats),
`internal/api/orchestrator_catalog_sources.go` (`federatedEntryToCatalogEntry`, the trust boundary, refresh),
`internal/api/catalog_sig.go` (signatures, pinning), `docs/agent/certification-review.md`,
public docs [applications](https://tend.host/docs/applications) (federated catalog sources).
