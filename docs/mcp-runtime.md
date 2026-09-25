# Publishing the TEND MCP runtime

This registry publishes two unrelated things. Its own extension packages, on
every green push to `main` (`.gitea/workflows/ci.yml`), and — manually, one
version at a time — the runtime of the optional `host.tend.mcp` panel component
(`.gitea/workflows/mcp-runtime.yml`).

The second one is the only thing here that a panel *executes*, on a server the
panel's operator owns. That is why it is a manual dispatch with an explicit core
commit and an explicit version, and why the workflow refuses more than it does.

## What a release contains

Five assets, under the GitHub release and tag `mcp-runtime-<version>` on
`Tend-Stack/TendExtensions`:

| Asset | What it is |
|---|---|
| `runtime-linux-amd64.json` | the signed envelope for amd64: the version, the panel versions it fits, the capabilities it requests, and the SHA-256 of the two artifacts below |
| `runtime-linux-arm64.json` | the same for arm64 |
| `service-linux-amd64.zip` | the confined worker image, as an OCI layout in a stored zip |
| `service-linux-arm64.zip` | the same for arm64 |
| `tend-mcp-ui.zip` | the browser package, installed through the panel's ordinary extension pipeline |

Those names are not a convention this repository chose. A panel builds each
download URL by appending one of them to the release URL its own source pins
(`internal/mcp/distribution.assetName` in the panel core), so an asset under any
other name is one no panel can fetch.

## Running it

**Extensions → Actions → Publish the TEND MCP runtime → Run workflow**, from
`main` only, with:

- **core_commit** — the full 40-hex commit on `Rubirosa/tend.host` to build from.
  The runtime is built from the panel core's own source (`cmd/tend-mcp-worker`,
  `cmd/tend-mcp-pack`, `extensions/mcp-ui`), so naming the commit is what makes
  the build auditable: anybody with that commit can rebuild it and get the same
  three artifact digests.
- **version** — `x.y.z`. Becomes the tag, and is written into the browser
  package's manifest and both envelopes; the panel refuses an installation whose
  parts disagree about it.
- **overwrite** — off unless you mean it. See below.

The run builds and packs both platforms with `core/scripts/mcp-runtime-release.sh`,
signs the two envelopes with `secrets.TEND_MCP_SIGNING_KEY_B64`, verifies each one
with the panel's own verifier against the public key committed at
`keys/tend-mcp-runtime.pub`, prints the five digests, and publishes.

## What the workflow refuses

- A dispatch from any ref but `main`. The tag points at the registry commit the
  run checked out, and only `main` is mirrored to GitHub, so a tag from a branch
  would name a commit GitHub has never seen.
- A signing key that is not the pinned one. The committed public key's id is
  checked (`17949d0c35c1eb4d`, the first 16 hex of the SHA-256 of the raw 32-byte
  public key) and each envelope's `verify` output must name it. A rotated key
  fails the run instead of publishing a release no panel trusts.
- An envelope that does not describe the artifacts beside it: `tools/mcp_release.py`
  cross-checks the version, the platform and both digests before it uploads
  anything. Signing the wrong build is the one mistake that publishes a release
  which looks valid and can never install.
- Replacing an asset already published under this version, unless **overwrite**
  is set. A panel that installed `mcp-runtime-0.1.0` verified those exact bytes by
  digest, so changing them under the same tag breaks that panel's next
  verification rather than upgrading it. Publish a new version instead;
  `overwrite` exists for a release nothing has installed. An asset that is
  already published *and byte-identical* is left alone, so a retried run
  converges rather than churning.

The signing secret reaches exactly one step, is written to the runner's own
temporary directory with mode 0600, and is removed on every exit path including a
failure.

## How a panel reaches it

It does not, until a panel release says so. A panel's own source pins the release
URL and the trusted key in `internal/mcp/distribution`:

```
https://github.com/Tend-Stack/TendExtensions/releases/download/mcp-runtime-<version>
```

Until a panel release carries that pin, MCP reports `available: false` with the
reason `no_publisher_pinned` and every write route refuses. That pin is a reviewed
source change in the panel, not a setting and not a step this repository can take
— whoever holds the signing key decides which image an operator's server would
import, which is too much authority to leave to a configuration value.

## The secret

`TEND_MCP_SIGNING_KEY_B64` — single-line base64 of the PEM PKCS#8 Ed25519 private
key whose public half is `keys/tend-mcp-runtime.pub`. It is not the registry's own
`TEND_REGISTRY_SIGNING_KEY` (a raw 32-byte seed for a different domain and a
different trust decision), and the two must never be interchanged.

`CORE_REPOSITORY_TOKEN` (read access to `Rubirosa/tend.host`) and
`GH_PUBLISH_TOKEN` (release write on `Tend-Stack/TendExtensions`) are the same
secrets `ci.yml` already uses.
