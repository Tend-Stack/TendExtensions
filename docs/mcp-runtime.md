# Publishing the TEND MCP runtime

This registry publishes two unrelated things. Its own extension packages, on
every green push to `main` (`.gitea/workflows/ci.yml`), and — manually, one
version at a time — the runtime of the optional `host.tend.mcp` panel component
(`.gitea/workflows/mcp-runtime.yml`).

The second one is the only thing here that a panel *executes*, on a server the
panel's operator owns. That is why it is a dispatch with an explicit core commit,
and why the workflow refuses more than it does. What it no longer asks for is a
version or a compatibility window: both are derived from the core checkout, so a
core release can re-sign the runtime for itself without a human remembering to
(see "The automation" below).

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

- **core_commit** (the only required input) — the full 40-hex commit on
  `Rubirosa/tend.host` to build from. The runtime is built from the panel core's
  own source (`cmd/tend-mcp-worker`, `cmd/tend-mcp-pack`, `extensions/mcp-ui`), so
  naming the commit is what makes the build auditable: anybody with that commit
  can rebuild it and get the same three artifact digests.
- **runtime_version** — `x.y.z`, or empty for the patch bump of the version the
  alias currently serves. It becomes the tag, and is written into the browser
  package's manifest and both envelopes; the panel refuses an installation whose
  parts disagree about it.
- **max_core_version** — empty in the ordinary case. An emergency override; see
  "The two manual escapes".
- **force** — empty in the ordinary case. The other escape.
- **dry_run** — build, sign, verify and print the plan; publish nothing.
- **overwrite** — off unless you mean it. See below.

The run resolves the window and the version with `tools/mcp_window.py`, builds and
packs both platforms with `core/scripts/mcp-runtime-release.sh`, signs the two
envelopes with `secrets.TEND_MCP_SIGNING_KEY_B64`, verifies each one with the
panel's own verifier against the public key committed at
`keys/tend-mcp-runtime.pub` at **both ends** of the derived window, prints the five
digests and the plan, publishes `mcp-runtime-<version>`, and then moves the alias.

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
- Moving the alias `mcp-runtime-latest` to a runtime whose sequence does not
  exceed the one it already serves — or whose current sequence could not be read
  back at all. The alias is the one release here whose assets are *meant* to
  change, so `overwrite` has nothing to do with it: the sequence is what makes
  replacing them safe. See "The sequence rule".
- A core commit that is not a release above the window the alias already covers,
  unless `force` is set. See "The guard".
- A window that would be empty (`min` above `max`) or would reach below core
  `0.6.0`, the oldest core that can verify an envelope.

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

A panel may pin the moving alias instead of a version:

```
https://github.com/Tend-Stack/TendExtensions/releases/download/mcp-runtime-latest
```

Pinning the alias is still a reviewed source change — it is made once. After it,
every new runtime reaches panels without another one, which is what the automation
below is for.

## The automation

### Why it exists

The compatibility window inside a signed envelope used to be typed into the
dispatch form: `min_core_version 0.6.0`, `max_core_version 0.9.0`. A core release
above `0.9.0` therefore needed a human to re-sign the runtime *and* a core source
change to re-pin the new release URL, or MCP would simply stop being available on
new panels — a failure whose only warning was somebody remembering. Now the window
comes from the core, the alias absorbs the URL change, and a core release can
trigger the publish itself.

### The window rule

`tools/mcp_window.py` reads two files from the core checkout at `core_commit`:

- **`VERSION`** → `max_core_version`. That commit's core is the newest core this
  runtime was built from, so it is the newest one the envelope may claim.
- **`RELEASE_COMPATIBILITY.json`** → `min_core_version`: its
  `mcp_min_core_version` when the core states one explicitly, otherwise the higher
  of its `minimum_direct_upgrade_from` (below which the core refuses a direct
  upgrade, so no panel should still be there) and `0.6.0`, the first core release
  that contains an MCP verifier at all. A window reaching below that floor would
  promise compatibility with a panel that cannot read an envelope.

Today, with `VERSION` 0.9.0 and `minimum_direct_upgrade_from` 0.1.0, that derives
exactly the window that used to be typed: **0.6.0 to 0.9.0**. The resolved window
is printed, written into both release bodies, and verified against the panel's own
verifier at both ends before anything is published.

### The sequence rule

The sequence is **not** a timestamp and **not** "the previous one plus one",
because the core will not accept either: `internal/mcp/release` derives it from the
runtime version and refuses any other value, at signing time and at verification
time alike.

```
sequence = major*1_000_000_000_000 + minor*1_000_000 + patch
```

Monotonicity is therefore enforced on the version. Before publishing, the tool
reads the envelope the alias currently serves and refuses unless the new version's
sequence is **strictly greater** than the one already there — and the default
version, the patch bump of the alias's version, always is. A publish that could
only move the alias backwards is refused before a single byte is written, and a
panel that already accepted a higher sequence refuses a lower one as a rollback
anyway, which is the second half of the same guarantee. `tests/test_mcp_window.py`
and `tests/test_mcp_alias.py` prove both halves.

An envelope whose sequence cannot be read back at all — a failed download, a
missing asset — is a refusal, not a zero. "The download broke" is not evidence that
the alias is behind this build.

### The alias release

After `mcp-runtime-<version>` is published, the workflow publishes or updates
`mcp-runtime-latest` with the same five assets. Its assets are replaced on every
publish (an asset that is byte-identical is left alone, so a retried run
converges), and its body is rewritten to name the runtime, the revision, the
window, the sequence and the expiry it now carries. The tag itself is not moved:
the authority is the signature over the envelope, not the commit a tag names.

The order matters. The version release is published first, so the alias never
points a panel at a runtime whose own immutable release does not exist; and inside
each release the envelopes are uploaded last, so an interrupted publish leaves the
old runtime rather than a new one whose artifacts are missing.

### Triggered by a core release

Gitea exposes `workflow_dispatch` over its API, so the core's release workflow
publishes a runtime by calling it — no `repository_dispatch` handler and no second
trigger to keep in step:

```
POST https://j.santanafam.com/api/v1/repos/Rubirosa/TendExtensions/actions/workflows/mcp-runtime.yml/dispatches
Authorization: token <a Gitea token with write access to TendExtensions Actions>
Content-Type: application/json

{
  "ref": "main",
  "inputs": {
    "core_commit": "<the 40-hex commit of the core release>"
  }
}
```

Everything else is optional and defaults to the derived value:
`runtime_version` (patch bump of the alias), `max_core_version` (the core's own
`VERSION`), `force` and `dry_run` and `overwrite` (`"false"`). Inputs are strings
over the API, including the booleans.

### The guard

A publish is meant to follow a core *release*. If the core at `core_commit` still
reports the version the alias's window already reaches — or an older one, or a
`VERSION` its own `RELEASE_COMPATIBILITY.json` disagrees with, i.e. a mid-release
commit — the run refuses. Without that, a second dispatch for the same core would
replace a working alias with an envelope that adds nothing, reset every panel's
expiry clock and burn a sequence.

### The two manual escapes

- **`max_core_version`** — sign a window wider than the built core, for a core
  release that changes nothing this runtime touches. The override is recorded in
  both release bodies (`MANUAL OVERRIDE: max_core_version was set by hand ...`),
  so it is visible to whoever reads the release rather than only to whoever read
  the run.
- **`force=true`** — publish past the guard above. Also recorded in both release
  bodies, naming the guard it bypassed.

Neither escape can weaken the trust chain: they move the window and the guard, and
nothing else. The key is still the pinned one, the sequence must still climb, the
envelopes are still verified with the panel's own verifier before publication, and
an envelope still expires (365 days).

### The trust chain, end to end

1. The panel's source pins one URL (the alias) and one public key
   (`17949d0c35c1eb4d`). Neither is a setting, so a compromised panel database
   cannot re-point the publisher.
2. Every envelope is signed by the key whose public half is committed at
   `keys/tend-mcp-runtime.pub`, and the workflow refuses to publish if the
   committed key is not the pinned one.
3. The envelope names the two artifacts by SHA-256; the panel hashes what it
   downloaded and refuses a mismatch. `tools/mcp_release.py` cross-checks those
   digests against the artifacts before uploading, because signing the wrong
   build is the one mistake that publishes a release which looks valid and can
   never install.
4. The envelope's sequence only increases, so an older runtime served under the
   alias is refused as a rollback by every panel that already saw a newer one.
5. The envelope expires, so an abandoned alias stops being installable rather
   than staying installable forever.

### Inspecting it without publishing

```
python -m tools.mcp_window --core <core checkout> --alias-envelope current.json
python -m tools.mcp_release --version 0.1.1 --revision <sha> --dist dist/mcp-runtime \
    --dry-run-out /tmp/plan --alias-envelope current.json
```

Neither call needs a credential and neither writes to a release: the first prints
the resolved window, version and sequence; the second writes the plan and both
envelopes to a directory. The workflow runs the dry run on every dispatch before
it publishes, so the plan is in the log even when the publish then fails, and
`dry_run: "true"` stops the job right after it.

## The secret

`TEND_MCP_SIGNING_KEY_B64` — single-line base64 of the PEM PKCS#8 Ed25519 private
key whose public half is `keys/tend-mcp-runtime.pub`. It is not the registry's own
`TEND_REGISTRY_SIGNING_KEY` (a raw 32-byte seed for a different domain and a
different trust decision), and the two must never be interchanged.

`CORE_REPOSITORY_TOKEN` (read access to `Rubirosa/tend.host`) and
`GH_PUBLISH_TOKEN` (release write on `Tend-Stack/TendExtensions`) are the same
secrets `ci.yml` already uses.
