#!/usr/bin/env python3
"""Create or update the GitHub release that publishes one version of the TEND
MCP component runtime.

Run from the repository root as a module, so `tools.release`'s HTTP boundary is
importable rather than duplicated:

    python -m tools.mcp_release --version 0.1.1 --revision <published main sha> \\
        --dist dist/mcp-runtime --plan dist/mcp-runtime/plan.json [--overwrite] [--no-alias]

    # decide everything and touch no network (the plan and both envelopes land in OUT):
    python -m tools.mcp_release --version 0.1.1 --revision <sha> --dist dist/mcp-runtime \\
        --dry-run-out OUT [--alias-envelope current-alias.json]

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

Besides the version release it publishes the alias release `mcp-runtime-latest`,
whose assets are the same five bytes. The alias is what a panel may pin instead of
a version, so that a new runtime needs no source change in the core — and it is
the one release here whose assets are *meant* to change, which is why it is
guarded differently: the alias only ever moves forward, proved by the sequence in
the envelope it currently serves, and never by a flag.

It touches two releases and nothing else: the version tag it was given, the alias
tag, those releases' own assets, and no other endpoint. It never prints a token,
and the bytes it compares are fetched without an Authorization header.
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

from tools.mcp_window import (
    ALIAS_TAG,
    alias_state,
    check_sequence_increases,
    sequence_of,
)
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


def release_body(
    version: str,
    revision: str,
    *,
    alias: bool,
    note_lines: list[str] | None = None,
) -> str:
    """The text an auditor reads instead of the run log.

    Every note the publish resolved — a derived window, an overridden one, a
    forced publish — belongs here, because the run that produced it is a log line
    that expires and this is the artifact that does not.
    """
    lines = [
        f"TEND MCP component runtime {version}.",
        f"Revision: {revision}",
        f"Signing key id: {EXPECTED_KEY_ID}",
    ]
    lines.extend(note_lines or [])
    lines.append("")
    if alias:
        lines.append(
            "This is the moving alias release. Its assets are replaced by every "
            f"runtime publish and currently carry {version}. A panel that pins this "
            "release URL and the key id above follows new runtimes without a source "
            "change; the signed envelope's sequence only ever increases, so a panel "
            "refuses an older runtime served here as a rollback."
        )
    else:
        lines.append(
            "A panel reaches these assets only when its own source pins this "
            "release URL and that key id in internal/mcp/distribution."
        )
    return "\n".join(lines)


def create_release(
    tag: str,
    revision: str,
    version: str,
    *,
    alias: bool = False,
    note_lines: list[str] | None = None,
    api_fn: ApiFn = api,
) -> dict:
    return api_fn(
        "/releases",
        method="POST",
        payload={
            "tag_name": tag,
            "target_commitish": revision,
            "name": "MCP runtime (latest)" if alias else f"MCP runtime {version}",
            "body": release_body(version, revision, alias=alias, note_lines=note_lines),
            "draft": False,
            "prerelease": False,
            # Never the repository's "latest": that belongs to the extension
            # registry's own releases, and a component runtime is not one.
            "make_latest": "false",
        },
    )


def update_release_body(
    release: dict,
    version: str,
    revision: str,
    *,
    note_lines: list[str] | None = None,
    api_fn: ApiFn = api,
) -> None:
    """Re-describe the alias release for the runtime it now serves.

    The tag is not moved. A tag that pointed somewhere else each publish would
    invalidate nothing and confirm nothing — the authority is the signature over
    the envelope, not the commit a tag names — while breaking every archived
    reference to it. The body therefore carries the revision instead.
    """
    release_id = release.get("id")
    if not isinstance(release_id, int):
        raise ReleaseError("the alias release has no id to update")
    api_fn(
        f"/releases/{release_id}",
        method="PATCH",
        payload={
            "name": "MCP runtime (latest)",
            "body": release_body(version, revision, alias=True, note_lines=note_lines),
        },
    )


def envelope_notes(assets: dict[str, bytes]) -> list[str]:
    """The window, sequence and expiry the envelopes actually carry.

    Read from the signed bytes rather than from the arguments: the release body
    must describe what was signed, not what somebody meant to sign.
    """
    payload = envelope_payload(assets[ENVELOPE_ASSETS[0]], ENVELOPE_ASSETS[0])
    window = f"{payload.get('min_core_version')} to {payload.get('max_core_version')}"
    return [
        f"Core compatibility window: {window}",
        f"Release sequence: {payload.get('sequence')}",
        f"Envelope expires at (unix): {payload.get('expires_at')}",
    ]


def published_assets(release: dict) -> dict[str, dict]:
    return {
        asset["name"]: asset for asset in release.get("assets", []) if isinstance(asset, dict)
    }


def alias_sequence_floor(release: dict | None, *, fetch: FetchFn) -> int:
    """The sequence the alias currently serves, or 0 before its first publish.

    Undecidable is a refusal, not a zero: an alias whose envelope cannot be read
    back might be serving a newer runtime than this build, and overwriting it
    with an older one is the rollback the sequence exists to stop.
    """
    if release is None:
        return 0
    existing = published_assets(release).get(ENVELOPE_ASSETS[0])
    if existing is None:
        return 0
    url = existing.get("browser_download_url")
    if not isinstance(url, str) or not url.startswith("https://"):
        raise ReleaseError(
            f"the alias's {ENVELOPE_ASSETS[0]} cannot be read back, so the sequence it "
            "serves is unknown; refusing to move the alias"
        )
    try:
        body = fetch(url)
    except (urllib.error.HTTPError, urllib.error.URLError, OSError) as exc:
        raise ReleaseError(
            f"the alias's {ENVELOPE_ASSETS[0]} could not be read back "
            f"({type(exc).__name__}); refusing to move the alias"
        ) from None
    return alias_state(body).sequence


def decide_alias(name: str, local: bytes, existing: dict | None, *, fetch: FetchFn) -> str:
    """What to do with one alias asset: "upload", "keep" or "replace".

    The alias moves, so different bytes are a replace rather than a refusal — the
    guard that makes that safe is the sequence, checked once for the whole release
    before anything is written. Identical bytes are still a keep, so a retried run
    converges instead of churning assets a panel may be downloading right now.
    """
    if existing is None:
        return "upload"
    url = existing.get("browser_download_url")
    if isinstance(url, str) and url.startswith("https://"):
        try:
            if digest_of(fetch(url)) == digest_of(local):
                return "keep"
        except (urllib.error.HTTPError, urllib.error.URLError, OSError):
            return "replace"
    return "replace"


def sync_alias_release(
    assets: dict[str, bytes],
    version: str,
    revision: str,
    *,
    note_lines: list[str] | None = None,
    api_fn: ApiFn = api,
    fetch_fn: FetchFn = _plain_fetch,
) -> dict:
    """Move the alias release `mcp-runtime-latest` onto this runtime, idempotently.

    The order inside the release is the same as a version release — images, then
    the browser package, then the envelopes — because the envelope is what a panel
    reads first, and a half-moved alias must look like the old runtime rather than
    like a runtime whose artifacts are missing.
    """
    sequence = sequence_of(version)
    release = find_release(ALIAS_TAG, api_fn=api_fn)
    floor = alias_sequence_floor(release, fetch=fetch_fn)
    if sequence <= floor:
        raise ReleaseError(
            f"the alias already serves sequence {floor}; publishing {version} "
            f"(sequence {sequence}) would move it backwards, and a panel refuses a "
            "sequence it has already passed"
        )

    notes = list(note_lines or []) + envelope_notes(assets)
    created = release is None
    if release is None:
        release = create_release(
            ALIAS_TAG, revision, version, alias=True, note_lines=notes, api_fn=api_fn
        )
    else:
        update_release_body(release, version, revision, note_lines=notes, api_fn=api_fn)

    published = published_assets(release)
    actions = {
        name: decide_alias(name, body, published.get(name), fetch=fetch_fn)
        for name, body in assets.items()
    }

    upload_url = release.get("upload_url")
    if not isinstance(upload_url, str) or "://" not in upload_url:
        raise ReleaseError("the alias release carries no usable upload url")
    upload_url = upload_url.split("{")[0]

    uploaded = replaced = kept = 0
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
        "tag": ALIAS_TAG,
        "version": version,
        "revision": revision,
        "created": created,
        "uploaded": uploaded,
        "replaced": replaced,
        "kept": kept,
        "previous_sequence": floor,
        "sequence": sequence,
    }


def dry_run(
    dist_dir: Path,
    version: str,
    revision: str,
    out_dir: Path,
    *,
    alias_envelope: bytes | None = None,
    note_lines: list[str] | None = None,
) -> dict:
    """Everything a publish decides, written to a directory and sent nowhere.

    No API call and no download: the five assets are read, the envelopes are
    cross-checked against them, the sequence is checked against an alias envelope
    handed in as a file, and the result — the plan plus copies of both envelopes —
    is written where a reviewer can read it. This is how the automation is
    inspected before it is trusted with a key.
    """
    if not _VERSION_RE.match(version):
        raise ReleaseError(f"version must be x.y.z, got {version!r}")
    if not _HEX40_RE.fullmatch(revision):
        raise ReleaseError(f"revision must be a 40-hex commit sha, got {revision!r}")
    assets = collect_assets(dist_dir)
    check_envelopes(assets, version)
    alias = alias_state(alias_envelope) if alias_envelope else None
    sequence = check_sequence_increases(version, alias)

    out_dir.mkdir(parents=True, exist_ok=True)
    for name in ENVELOPE_ASSETS:
        (out_dir / name).write_bytes(assets[name])
    plan = {
        "dry_run": True,
        "tag": tag_for(version),
        "alias_tag": ALIAS_TAG,
        "version": version,
        "revision": revision,
        "sequence": sequence,
        "alias_version": None if alias is None else alias.version,
        "alias_sequence": 0 if alias is None else alias.sequence,
        "key_id": EXPECTED_KEY_ID,
        "assets": {name: digest_of(body) for name, body in sorted(assets.items())},
        "notes": list(note_lines or []) + envelope_notes(assets),
    }
    (out_dir / "plan.json").write_text(
        json.dumps(plan, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    return plan


def sync_runtime_release(
    dist_dir: Path,
    version: str,
    revision: str,
    *,
    overwrite: bool = False,
    note_lines: list[str] | None = None,
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
        release = create_release(
            tag,
            revision,
            version,
            note_lines=list(note_lines or []) + envelope_notes(assets),
            api_fn=api_fn,
        )

    published = published_assets(release)
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
    parser.add_argument(
        "--no-alias",
        dest="alias",
        action="store_false",
        help=f"publish only the version release, not {ALIAS_TAG}",
    )
    parser.add_argument(
        "--plan",
        type=Path,
        default=None,
        help="the JSON tools.mcp_window wrote: its notes go into both release bodies",
    )
    parser.add_argument(
        "--dry-run-out",
        type=Path,
        default=None,
        help="decide everything, write the plan and both envelopes here, and call nothing",
    )
    parser.add_argument(
        "--alias-envelope",
        type=Path,
        default=None,
        help="the alias's current envelope, for a dry run's sequence check",
    )
    args = parser.parse_args(argv)

    dist_dir = args.dist if args.dist is not None else args.repo_root / "dist" / "mcp-runtime"

    note_lines: list[str] = []
    if args.plan is not None:
        try:
            plan = json.loads(args.plan.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            print(f"error: {args.plan} is not readable JSON", file=sys.stderr)
            return 1
        if not isinstance(plan, dict) or plan.get("runtime_version") != args.version:
            print(
                f"error: {args.plan} resolved runtime version "
                f"{plan.get('runtime_version') if isinstance(plan, dict) else None!r}, "
                f"not the {args.version!r} being published",
                file=sys.stderr,
            )
            return 1
        note_lines = [
            line
            for line in plan.get("release_notes", [])
            if isinstance(line, str) and "\n" not in line and len(line) <= 400
        ]

    if args.dry_run_out is not None:
        alias_envelope = None
        if args.alias_envelope is not None:
            try:
                alias_envelope = args.alias_envelope.read_bytes()
            except OSError:
                print(f"error: cannot read {args.alias_envelope}", file=sys.stderr)
                return 1
        try:
            result = dry_run(
                dist_dir,
                args.version,
                args.revision,
                args.dry_run_out,
                alias_envelope=alias_envelope,
                note_lines=note_lines,
            )
        except ReleaseError as exc:
            print(f"error: {exc}", file=sys.stderr)
            return 1
        print(
            f"dry run: would publish {result['tag']} and move {result['alias_tag']} "
            f"to {result['version']} (sequence {result['sequence']}, "
            f"alias was {result['alias_sequence']}); plan in {args.dry_run_out}"
        )
        return 0

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

    version_result = _attempt(
        lambda: sync_runtime_release(
            dist_dir,
            args.version,
            args.revision,
            overwrite=args.overwrite,
            note_lines=note_lines,
        ),
        retries=args.retries,
    )
    if version_result is None:
        return 1
    _report(version_result)

    # The alias moves only after the version release exists. A panel that followed
    # the alias to a runtime whose immutable release was never published would have
    # nothing to fall back to.
    if args.alias:
        alias_result = _attempt(
            lambda: sync_alias_release(
                collect_assets(dist_dir),
                args.version,
                args.revision,
                note_lines=note_lines,
            ),
            retries=args.retries,
        )
        if alias_result is None:
            return 1
        _report(alias_result)
    return 0


def _attempt(action: Callable[[], dict], *, retries: int) -> dict | None:
    """Run one publish step, retrying only what is worth retrying.

    A ReleaseError is a refusal this tool decided and never a transient
    condition, so it ends the run; a transport failure is classified the way
    `tools/release.py` classifies one, and a permanent classification is not
    retried either.
    """
    last_message = "release did not run"
    for attempt in range(1, max(1, retries) + 1):
        try:
            return action()
        except ReleaseError as exc:
            print(f"error: {exc}", file=sys.stderr)
            return None
        except (urllib.error.HTTPError, urllib.error.URLError) as exc:
            last_message, permanent = classify_failure(exc)
            print(f"attempt {attempt}/{retries}: {last_message}", file=sys.stderr)
            if permanent:
                return None
            if attempt < retries:
                time.sleep(min(2**attempt, 10))
    print(f"error: {last_message} (exhausted {retries} attempt(s))", file=sys.stderr)
    return None


def _report(result: dict) -> None:
    print(
        f"published {result['tag']} "
        f"({result['uploaded']} uploaded, {result['replaced']} replaced, "
        f"{result['kept']} already identical) "
        f"revision={result['revision']} version={result['version']} key={EXPECTED_KEY_ID}"
    )


if __name__ == "__main__":
    raise SystemExit(main())
