#!/usr/bin/env python3
"""Create or update the GitHub release that publishes one version of the TEND
MCP component runtime.

Run from the repository root as a module, so `tools.release`'s HTTP boundary is
importable rather than duplicated:

    python -m tools.mcp_release --version 0.1.0 --revision <published main sha> \\
        --dist dist/mcp-runtime [--overwrite]

Tag and release name: `mcp-runtime-<version>`, on the published main sha. Assets,
all five required and named exactly:

    runtime-linux-amd64.json   runtime-linux-arm64.json   the signed envelopes
    service-linux-amd64.zip    service-linux-arm64.zip    the worker images
    tend-mcp-ui.zip                                       the browser package

Those names are not this tool's choice: a panel builds its download URLs from
them (`internal/mcp/distribution.assetName` in the panel core), so an asset
under any other name is one no panel can fetch.

Two things make this different from `tools/release.py`, and both are about a
release nobody may quietly change:

  * A published runtime is pinned by digest. A panel that installed
    `mcp-runtime-0.1.0` verified `service_sha256` against the bytes it
    downloaded, so replacing those bytes under the same tag would break that
    panel's next verification rather than upgrade it. This tool therefore
    refuses to replace an existing asset unless it can prove the bytes are
    identical — and re-uploads nothing when they are, so a retried run
    converges. `--overwrite` is the deliberate escape hatch for a release that
    was never consumed.
  * The envelopes are cross-checked against the artifacts before anything is
    uploaded: version, platform and both digests. Signing the wrong build is the
    one mistake that produces a release which looks valid and can never install.

It touches one release and nothing else: the tag it was given, that release's own
assets, and no other endpoint. It never prints a token, and the bytes it compares
are fetched without an Authorization header.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Callable

from tools.release import ReleaseError, api, classify_failure

REPO_ROOT = Path(__file__).resolve().parent.parent

# The five published assets, in upload order. Envelopes last is deliberate: the
# envelope is what a panel reads first, so an interrupted publish leaves a
# release whose metadata is absent rather than one whose metadata names artifacts
# that are not there yet.
SERVICE_ASSETS = ("service-linux-amd64.zip", "service-linux-arm64.zip")
UI_ASSET = "tend-mcp-ui.zip"
ENVELOPE_ASSETS = ("runtime-linux-amd64.json", "runtime-linux-arm64.json")
ASSET_NAMES = SERVICE_ASSETS + (UI_ASSET,) + ENVELOPE_ASSETS

_VERSION_RE = re.compile(r"^(?:0|[1-9][0-9]{0,5})\.(?:0|[1-9][0-9]{0,5})\.(?:0|[1-9][0-9]{0,5})$")
_HEX40_RE = re.compile(r"[0-9a-f]{40}")
_DIGEST_RE = re.compile(r"^[0-9a-f]{64}$")

# The public key this registry publishes under, and its id: the first 16 hex of
# the SHA-256 of the raw 32-byte Ed25519 public key, which is what a panel pins.
PUBLIC_KEY_PATH = "keys/tend-mcp-runtime.pub"
EXPECTED_KEY_ID = "17949d0c35c1eb4d"

# An asset is compared, never trusted: 32 MiB is far above the largest artifact
# (a worker image is a few megabytes) and far below anything worth streaming.
MAX_COMPARE_BYTES = 32 * 1024 * 1024

ApiFn = Callable[..., Any]
FetchFn = Callable[[str], bytes]


def tag_for(version: str) -> str:
    return f"mcp-runtime-{version}"


def key_id_for(public_key_b64: str) -> str:
    """The key id a panel pins, from the base64 public key this repo commits."""
    try:
        raw = base64.b64decode(public_key_b64.strip(), validate=True)
    except (ValueError, TypeError) as exc:
        raise ReleaseError(f"{PUBLIC_KEY_PATH} is not valid base64") from exc
    if len(raw) != 32:
        raise ReleaseError(f"{PUBLIC_KEY_PATH} must decode to 32 raw bytes, got {len(raw)}")
    return hashlib.sha256(raw).hexdigest()[:16]


def digest_of(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def collect_assets(dist_dir: Path) -> dict[str, bytes]:
    """Read the five assets, refusing a partial build rather than publishing one.

    A release with four of five assets is worse than no release: a panel that
    finds the envelope and not the image fails at install time, after it has
    already written the browser package.
    """
    assets: dict[str, bytes] = {}
    missing: list[str] = []
    for name in ASSET_NAMES:
        path = dist_dir / name
        if not path.is_file():
            missing.append(name)
            continue
        body = path.read_bytes()
        if not body:
            raise ReleaseError(f"{name} is empty")
        assets[name] = body
    if missing:
        raise ReleaseError(
            f"missing expected asset(s) in {dist_dir}: {missing} "
            "— run core/scripts/mcp-runtime-release.sh first"
        )
    return assets


def envelope_payload(body: bytes, name: str) -> dict[str, Any]:
    """The payload of one signed envelope, without verifying its signature.

    Verification belongs to the panel and to `tend-mcp-release verify` in the
    workflow, which runs the panel's own code against the pinned public key. What
    this reads the payload for is the cross-check below.
    """
    try:
        envelope = json.loads(body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError) as exc:
        raise ReleaseError(f"{name} is not a JSON release envelope") from exc
    if not isinstance(envelope, dict):
        raise ReleaseError(f"{name} is not a JSON object")
    payload = envelope.get("payload")
    if not isinstance(payload, dict):
        raise ReleaseError(f"{name} carries no payload object")
    return payload


def check_envelopes(assets: dict[str, bytes], version: str) -> None:
    """Refuse a release whose envelopes do not describe the artifacts beside them.

    Every field checked here is one that makes an install fail *after* it has
    started: a version the installed UI package will not match, a platform the
    panel asked for and did not get, or a digest that will not match the bytes
    the panel just downloaded and hashed.
    """
    ui_digest = digest_of(assets[UI_ASSET])
    for envelope_name, service_name in zip(ENVELOPE_ASSETS, SERVICE_ASSETS):
        payload = envelope_payload(assets[envelope_name], envelope_name)
        architecture = service_name.removeprefix("service-linux-").removesuffix(".zip")
        expected_platform = f"linux/{architecture}"

        if payload.get("version") != version:
            raise ReleaseError(
                f"{envelope_name} signs version {payload.get('version')!r}, not {version!r}"
            )
        if payload.get("platform") != expected_platform:
            raise ReleaseError(
                f"{envelope_name} signs platform {payload.get('platform')!r}, "
                f"not {expected_platform!r}"
            )
        for field, expected, described in (
            ("ui_sha256", ui_digest, UI_ASSET),
            ("service_sha256", digest_of(assets[service_name]), service_name),
        ):
            claimed = payload.get(field)
            if not isinstance(claimed, str) or not _DIGEST_RE.match(claimed):
                raise ReleaseError(f"{envelope_name} has no valid {field}")
            if claimed != expected:
                raise ReleaseError(
                    f"{envelope_name} signs a {field} that is not the digest of {described} "
                    "— the envelopes were signed against a different build"
                )


def _plain_fetch(url: str) -> bytes:
    """Download one published asset with no credential attached.

    No Authorization header is the point: this reads bytes that are already
    public, and a download is never a reason for the publish token to leave the
    two API hosts `tools.release.api` allows.
    """
    request = urllib.request.Request(url, headers={"User-Agent": "TendExtensions-mcp-release"})
    with urllib.request.urlopen(request, timeout=120) as response:
        body = response.read(MAX_COMPARE_BYTES + 1)
    if len(body) > MAX_COMPARE_BYTES:
        raise ReleaseError("a published asset is larger than this tool will compare")
    return body


def decide(
    name: str,
    local: bytes,
    existing: dict | None,
    *,
    overwrite: bool,
    fetch: FetchFn,
) -> str:
    """What to do with one asset: "upload", "keep" or "replace".

    Absent is an upload. Present and provably identical is a keep, which is what
    makes a retried run a no-op instead of a churn of deletes and uploads.
    Present and different — or present and undecidable, because the published
    bytes could not be read — is a refusal, because a panel may already have
    pinned them. `--overwrite` turns a refusal into a replace and nothing else.
    """
    if existing is None:
        return "upload"
    if overwrite:
        return "replace"
    url = existing.get("browser_download_url")
    if not isinstance(url, str) or not url.startswith("https://"):
        raise ReleaseError(
            f"{name} is already published and this tool cannot read it back to compare; "
            "re-run with overwrite to replace it deliberately"
        )
    try:
        published = fetch(url)
    except (urllib.error.HTTPError, urllib.error.URLError, OSError) as exc:
        raise ReleaseError(
            f"{name} is already published and could not be read back to compare "
            f"({type(exc).__name__}); re-run with overwrite to replace it deliberately"
        ) from None
    if digest_of(published) == digest_of(local):
        return "keep"
    raise ReleaseError(
        f"{name} is already published with different bytes. A panel that installed this "
        "version verified those bytes by digest, so replacing them breaks it rather than "
        "updating it — publish a new version, or re-run with overwrite if this release "
        "was never consumed."
    )


def find_release(tag: str, *, api_fn: ApiFn = api) -> dict | None:
    try:
        return api_fn(f"/releases/tags/{tag}")
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return None
        raise


def create_release(tag: str, revision: str, version: str, *, api_fn: ApiFn = api) -> dict:
    return api_fn(
        "/releases",
        method="POST",
        payload={
            "tag_name": tag,
            "target_commitish": revision,
            "name": f"MCP runtime {version}",
            "body": (
                f"TEND MCP component runtime {version}.\n"
                f"Revision: {revision}\n"
                f"Signing key id: {EXPECTED_KEY_ID}\n\n"
                "A panel reaches these assets only when its own source pins this "
                "release URL and that key id in internal/mcp/distribution."
            ),
            "draft": False,
            "prerelease": False,
            # Never the repository's "latest": that belongs to the extension
            # registry's own releases, and a component runtime is not one.
            "make_latest": "false",
        },
    )


def sync_runtime_release(
    dist_dir: Path,
    version: str,
    revision: str,
    *,
    overwrite: bool = False,
    api_fn: ApiFn = api,
    fetch_fn: FetchFn = _plain_fetch,
) -> dict:
    """Publish one runtime version, idempotently.

    Every decision is made before the first write: the assets are read, the
    envelopes are cross-checked, and each asset's action is decided against what
    is already published. A refusal therefore refuses before it has uploaded
    half a release.
    """
    if not _VERSION_RE.match(version):
        raise ReleaseError(f"version must be x.y.z, got {version!r}")
    if not _HEX40_RE.fullmatch(revision):
        raise ReleaseError(f"revision must be a 40-hex commit sha, got {revision!r}")

    assets = collect_assets(dist_dir)
    check_envelopes(assets, version)

    tag = tag_for(version)
    release = find_release(tag, api_fn=api_fn)
    created = release is None
    if release is None:
        release = create_release(tag, revision, version, api_fn=api_fn)

    published = {
        asset["name"]: asset for asset in release.get("assets", []) if isinstance(asset, dict)
    }
    actions = {
        name: decide(name, body, published.get(name), overwrite=overwrite, fetch=fetch_fn)
        for name, body in assets.items()
    }

    upload_url = release.get("upload_url")
    if not isinstance(upload_url, str) or "://" not in upload_url:
        raise ReleaseError("the release carries no usable upload url")
    upload_url = upload_url.split("{")[0]

    uploaded = 0
    kept = 0
    replaced = 0
    for name in ASSET_NAMES:
        action = actions[name]
        if action == "keep":
            kept += 1
            continue
        if action == "replace":
            api_fn(f"/releases/assets/{published[name]['id']}", method="DELETE")
            replaced += 1
        else:
            uploaded += 1
        api_fn(f"{upload_url}?name={name}", method="POST", binary=assets[name])

    return {
        "tag": tag,
        "version": version,
        "revision": revision,
        "created": created,
        "uploaded": uploaded,
        "replaced": replaced,
        "kept": kept,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Create/update the GitHub release for one TEND MCP runtime version"
    )
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT)
    parser.add_argument("--version", required=True)
    parser.add_argument("--revision", required=True, help="the published main sha to tag")
    parser.add_argument("--dist", type=Path, default=None, help="default <repo-root>/dist/mcp-runtime")
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--retries", type=int, default=3)
    args = parser.parse_args(argv)

    dist_dir = args.dist if args.dist is not None else args.repo_root / "dist" / "mcp-runtime"

    # The committed public key is checked here as well as in the workflow: this
    # tool is what names the key id in the release body, and a body that claimed
    # a key nobody pins would be worse than no body at all.
    try:
        key_path = args.repo_root / PUBLIC_KEY_PATH
        actual = key_id_for(key_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"error: {key_path} not found", file=sys.stderr)
        return 1
    except ReleaseError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    if actual != EXPECTED_KEY_ID:
        print(
            f"error: {PUBLIC_KEY_PATH} has key id {actual}, not the pinned {EXPECTED_KEY_ID}",
            file=sys.stderr,
        )
        return 1

    last_message = "release did not run"
    for attempt in range(1, max(1, args.retries) + 1):
        try:
            result = sync_runtime_release(
                dist_dir, args.version, args.revision, overwrite=args.overwrite
            )
        except ReleaseError as exc:
            print(f"error: {exc}", file=sys.stderr)
            return 1
        except (urllib.error.HTTPError, urllib.error.URLError) as exc:
            last_message, permanent = classify_failure(exc)
            print(f"attempt {attempt}/{args.retries}: {last_message}", file=sys.stderr)
            if permanent:
                return 1
            if attempt < args.retries:
                time.sleep(min(2**attempt, 10))
            continue
        else:
            print(
                f"published {result['tag']} "
                f"({result['uploaded']} uploaded, {result['replaced']} replaced, "
                f"{result['kept']} already identical) "
                f"revision={result['revision']} key={EXPECTED_KEY_ID}"
            )
            return 0

    print(f"error: {last_message} (exhausted {args.retries} attempt(s))", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
