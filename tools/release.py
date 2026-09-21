#!/usr/bin/env python3
"""Create or update the GitHub release for a registry sequence.

Tag `registry-<sequence>` on the published commit. Assets: every
`dist/<id>-<version>.zip`, `dist/registry.json`, and
`dist/tend-extension-registry-v1.json`. Talks to the GitHub REST API
directly with `urllib` (no extra dependency) using `GH_PUBLISH_TOKEN`.
Idempotent: re-running for an existing tag deletes and re-uploads any
asset with a matching name, so a retried CI run converges instead of
piling up duplicate assets or failing on a name collision.

Reads `sequence` and `revision` from `dist/registry.json` (written by
`tools/build.py`) unless overridden on the command line.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Callable

REPO_SLUG = "Tend-Stack/TendExtensions"
API_ROOT = f"https://api.github.com/repos/{REPO_SLUG}"
REPO_ROOT = Path(__file__).resolve().parent.parent
_HEX40_RE = re.compile(r"[0-9a-f]{40}")

ApiFn = Callable[..., Any]


class ReleaseError(Exception):
    """A permanent (non-retryable) failure. The message is safe to print —
    never derived from response bodies that could echo the token."""


class _NoAuthenticatedRedirect(urllib.request.HTTPRedirectHandler):
    """Refuse to follow a redirect while carrying the Authorization header —
    a redirect to an attacker-controlled host must never receive the
    token."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: D102
        raise urllib.error.HTTPError(req.full_url, code, "Authenticated redirects are forbidden", headers, fp)


_OPENER = urllib.request.build_opener(_NoAuthenticatedRedirect())


def _token() -> str:
    token = os.environ.get("GH_PUBLISH_TOKEN")
    if not token:
        raise ReleaseError("GH_PUBLISH_TOKEN is not set")
    return token


def api(path: str, *, method: str = "GET", payload: dict | None = None, binary: bytes | None = None) -> Any:
    """One GitHub REST API call. `path` is either an API-relative path
    (`/releases/tags/foo`) or a full `https://api.github.com/repos/...` or
    `https://uploads.github.com/repos/...` URL (what upload_url gives us).
    Refuses to call anywhere else — the token never leaves those two
    hosts."""
    url = path if path.startswith("https://") else API_ROOT + path
    if not url.startswith(("https://api.github.com/repos/", "https://uploads.github.com/repos/")):
        raise ReleaseError("refusing to call an unexpected endpoint (redacted host check failed)")
    data = binary if binary is not None else (json.dumps(payload).encode("utf-8") if payload is not None else None)
    request = urllib.request.Request(
        url,
        method=method,
        data=data,
        headers={
            "Authorization": f"Bearer {_token()}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "TendExtensions-release",
            "Content-Type": "application/octet-stream" if binary is not None else "application/json",
        },
    )
    with _OPENER.open(request, timeout=120) as response:
        body = response.read()
        return json.loads(body) if body else {}


def classify_failure(exc: BaseException) -> tuple[str, bool]:
    """Classify a release failure the way scripts/publish-verified-main.py
    classifies git push failures: a message safe to print (never the raw
    response body, which could contain incidental token fragments or other
    authority text) plus whether it's a permanent, non-retryable failure."""
    if isinstance(exc, urllib.error.HTTPError):
        status = exc.code
        if status in (401, 403):
            return (
                "GitHub rejected the publish token (401/403); verify GH_PUBLISH_TOKEN scope and repository access",
                True,
            )
        if status == 404:
            return ("GitHub reported the release repository or endpoint does not exist", True)
        if status == 422:
            return ("GitHub rejected the request as unprocessable (422); check tag/asset naming for a collision", True)
        if status in (502, 503, 504):
            return (f"GitHub API returned a transient server error ({status})", False)
        return (f"GitHub API returned an unclassified HTTP {status} error", False)
    if isinstance(exc, urllib.error.URLError):
        return ("GitHub API transport failed (connection, DNS, or timeout)", False)
    return (f"unclassified release failure: {type(exc).__name__}", False)


def dist_assets(dist_dir: Path) -> list[Path]:
    assets = sorted(dist_dir.glob("*.zip"))
    for name in ("registry.json", "tend-extension-registry-v1.json"):
        assets.append(dist_dir / name)
    missing = [p for p in assets if not p.is_file()]
    if missing:
        raise ReleaseError(f"missing expected dist asset(s): {[str(p) for p in missing]}")
    return assets


def find_release(tag: str, *, api_fn: ApiFn = api) -> dict | None:
    try:
        return api_fn(f"/releases/tags/{tag}")
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return None
        raise


def create_release(tag: str, revision: str, sequence: int, *, api_fn: ApiFn = api) -> dict:
    return api_fn(
        "/releases",
        method="POST",
        payload={
            "tag_name": tag,
            "target_commitish": revision,
            "name": f"Registry sequence {sequence}",
            "body": f"TendExtensions registry sequence {sequence}.\nRevision: {revision}",
            "draft": False,
            "prerelease": False,
            "make_latest": "false",
        },
    )


def sync_release(dist_dir: Path, sequence: int, revision: str, *, api_fn: ApiFn = api) -> dict:
    if not _HEX40_RE.fullmatch(revision):
        raise ReleaseError(f"revision must be a 40-hex commit sha, got {revision!r}")
    tag = f"registry-{sequence}"
    assets = dist_assets(dist_dir)

    release = find_release(tag, api_fn=api_fn)
    if release is None:
        release = create_release(tag, revision, sequence, api_fn=api_fn)

    existing = {asset["name"]: asset["id"] for asset in release.get("assets", [])}
    upload_url = release["upload_url"].split("{")[0]
    for path in assets:
        name = path.name
        if name in existing:
            api_fn(f"/releases/assets/{existing[name]}", method="DELETE")
        api_fn(f"{upload_url}?name={name}", method="POST", binary=path.read_bytes())

    return {"tag": tag, "sequence": sequence, "revision": revision, "asset_count": len(assets)}


def _load_registry(dist_dir: Path) -> dict:
    path = dist_dir / "registry.json"
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ReleaseError(f"{path} not found — run tools/build.py first") from None


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Create/update the GitHub release for a registry sequence")
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT)
    parser.add_argument("--sequence", type=int, default=None)
    parser.add_argument("--revision", type=str, default=None)
    parser.add_argument("--retries", type=int, default=3)
    args = parser.parse_args(argv)

    dist_dir = args.repo_root / "dist"
    try:
        registry = _load_registry(dist_dir)
    except ReleaseError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    sequence = args.sequence if args.sequence is not None else registry["sequence"]
    revision = args.revision or registry["revision"]

    last_message = "release did not run"
    for attempt in range(1, max(1, args.retries) + 1):
        try:
            result = sync_release(dist_dir, sequence, revision)
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
                f"published {result['tag']} ({result['asset_count']} asset(s)) "
                f"sequence={result['sequence']} revision={result['revision']}"
            )
            return 0

    print(f"error: {last_message} (exhausted {args.retries} attempt(s))", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
