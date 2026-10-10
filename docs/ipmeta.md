# Offline IP data (`ipmeta`)

The panel can say where an address comes from (country, network, hosting provider) without ever sending the
address anywhere: it reads three local database files. This repository publishes those files, signed, once a
month.

## What a release contains

GitHub release `ipmeta-YYYY.MM` on `Tend-Stack/TendExtensions` (immutable per month) and the moving release
`ipmeta-latest`, which panels read from
`https://github.com/Tend-Stack/TendExtensions/releases/download/ipmeta-latest/`:

| Asset | What it is |
|---|---|
| `country.mmdb` | DB-IP "IP to Country Lite" |
| `asn.mmdb` | DB-IP "IP to ASN Lite" |
| `city.mmdb` | DB-IP "IP to City Lite" (large, optional; a panel downloads it only when the administrator enables city data) |
| `manifest.json` | schema 1: `version` (`YYYY.MM`), `published_at`, `source`, `licence`, `attribution` and, per file, `name`, `sha256`, `size` (`optional` for city) |
| `manifest.json.sig` | 64 raw bytes, Ed25519 over `"tend-ipmeta-manifest-v1\n"` followed by the exact bytes of `manifest.json` |

The key is the registry signing key (`TEND_REGISTRY_SIGNING_KEY`); a panel verifies against the registry public key
it already pins. The different domain prefix means a registry envelope can never verify as an `ipmeta` manifest, or
the reverse. A panel refuses the data on a bad signature, a size or sha256 mismatch, or a failed sanity lookup, and
keeps what it has.

## When and how

`.gitea/workflows/ipmeta.yml` runs on the 3rd of every month at 04:00 UTC (DB-IP publishes at the start of the
month) and on dispatch. It downloads the current month's files, falling back to the previous month if they are not
out yet, enforces the panel's size caps, runs the panel's own `tend-ipmeta-check` (record field names, the sanity
answers 1.1.1.1 is AS13335 and 8.8.8.8 is US, and the organisation recorded for each hosting ASN, printed in the log
for a reviewer), writes and signs `manifest.json`, verifies the signature against the pinned public key, and
publishes. `tend-ipmeta-check` is built from the core commit pinned in the workflow (`PINNED_CORE_COMMIT`), or from
the `core_commit` dispatch input.

Manual runs are dry by default (`dry_run` true): everything except the publish, and the manifest is printed.
Dispatch with `dry_run` false to publish by hand. Code: `tools/ipmeta_release.py`, tests:
`tests/test_ipmeta_release.py`.

## Licence and attribution

The data is DB-IP Lite, licensed CC BY 4.0, which allows redistribution with attribution. The attribution string
travels in `manifest.json` and with every lookup result in the panel: "IP geolocation by DB-IP (https://db-ip.com),
CC BY 4.0". Do not publish these files without it. (MaxMind GeoLite2 and IPinfo were rejected: account or token
required, and redistribution restrictions.)
