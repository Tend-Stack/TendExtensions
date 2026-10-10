#!/usr/bin/env python3
"""Build, sign and publish the signed offline IP data release (`ipmeta-YYYY.MM`).

Subcommands (see docs/ipmeta.md and .gitea/workflows/ipmeta.yml):

  fetch     download the DB-IP Lite country/ASN/(city) mmdb.gz for a month, falling back to the
            previous month when the files are not out yet, gunzip them with the size caps the panel
            enforces, and write country.mmdb / asn.mmdb / city.mmdb into --out
  manifest  write manifest.json (schema 1) describing the files in --dir
  sign      sign manifest.json with TEND_REGISTRY_SIGNING_KEY (the registry key) and write
            manifest.json.sig (64 raw bytes)
  verify    check manifest.json.sig against a public key, exactly as the panel does
  publish   create or refresh the `ipmeta-<version>` release and move the `ipmeta-latest` assets
            (GH_PUBLISH_TOKEN, the same token and REST helper as tools/release.py)

The signature covers DOMAIN + the exact bytes of manifest.json. DOMAIN differs from the registry's
domain prefix, so a registry envelope can never verify as an ipmeta manifest or the reverse.
Contract: SI5 in the panel repository (internal/ipmeta/update.go).
"""
from __future__ import annotations

import argparse
import base64
import datetime as dt
import gzip
import hashlib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Callable

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from cryptography.exceptions import InvalidSignature  # noqa: E402
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey  # noqa: E402

from tools import release, sign  # noqa: E402

DOMAIN = b"tend-ipmeta-manifest-v1\n"
SCHEMA = 1
MANIFEST = "manifest.json"
SIGNATURE = "manifest.json.sig"
SOURCE = "DB-IP Lite"
LICENCE = "CC BY 4.0"
# The panel's ipmeta.Attribution constant. `manifest --attribution` takes it from the output of
# tend-ipmeta-check (which prints the constant of the very core the check was built from), so the two
# cannot drift; this is only the fallback for local runs.
DEFAULT_ATTRIBUTION = "IP geolocation by DB-IP (https://db-ip.com), CC BY 4.0"
VERSION_RE = re.compile(r"^\d{4}\.\d{2}$")

MIB = 1 << 20
# name -> (DB-IP product, cap in bytes on the decompressed file, optional). The caps are the panel's
# (internal/ipmeta/update.go fileCap): a file over its cap would be refused by every panel.
FILES = {
    "country.mmdb": ("country", 64 * MIB, False),
    "asn.mmdb": ("asn", 64 * MIB, False),
    "city.mmdb": ("city", 160 * MIB, True),
}
DOWNLOAD = "https://download.db-ip.com/free/dbip-{product}-lite-{month}.mmdb.gz"
ASSET_ORDER = ("country.mmdb", "asn.mmdb", "city.mmdb", SIGNATURE, MANIFEST)  # manifest last: it names the rest


class IpmetaError(Exception):
    """A refusal. The message is safe to print."""


def month_pair(now: dt.date) -> list[str]:
    """[current month, previous month] as YYYY-MM."""
    first = now.replace(day=1)
    prev = first - dt.timedelta(days=1)
    return [f"{first.year:04d}-{first.month:02d}", f"{prev.year:04d}-{prev.month:02d}"]


# --- fetch -----------------------------------------------------------------------------------------


def _gunzip_capped(src, dest: Path, cap: int) -> int:
    total = 0
    with gzip.GzipFile(fileobj=src) as gz, dest.open("wb") as out:
        while True:
            chunk = gz.read(1 << 20)
            if not chunk:
                break
            total += len(chunk)
            if total > cap:
                out.close()
                dest.unlink(missing_ok=True)
                raise IpmetaError(f"{dest.name} is over its {cap} byte cap once decompressed")
            out.write(chunk)
    if total == 0:
        raise IpmetaError(f"{dest.name} decompressed to nothing")
    return total


def _open_url(url: str):
    request = urllib.request.Request(url, headers={"User-Agent": "TendExtensions-ipmeta"})
    return urllib.request.urlopen(request, timeout=600)


def fetch(out: Path, *, months: list[str], opener: Callable[[str], object] = _open_url) -> str:
    """Download into `out`; returns the YYYY.MM that was found. Country and ASN must exist for the
    month; the city file is taken when published and skipped (with a notice) when not."""
    out.mkdir(parents=True, exist_ok=True)
    for month in months:
        found: dict[str, Path] = {}
        missing = []
        for name, (product, cap, optional) in FILES.items():
            url = DOWNLOAD.format(product=product, month=month)
            try:
                response = opener(url)
            except urllib.error.HTTPError as exc:
                if exc.code != 404:
                    raise IpmetaError(f"DB-IP answered HTTP {exc.code} for {product} {month}") from None
                if not optional:
                    missing.append(product)
                else:
                    print(f"notice: {product} {month} is not published; the release carries no city file")
                continue
            with response:
                dest = out / name
                size = _gunzip_capped(response, dest, cap)
            found[name] = dest
            print(f"fetched {name} {month} ({size} bytes)")
        if not missing:
            return month.replace("-", ".")
        print(f"notice: {', '.join(missing)} for {month} is not out yet")
        for path in found.values():
            path.unlink(missing_ok=True)
    raise IpmetaError(f"DB-IP has no country+ASN files for {' or '.join(months)}")


# --- manifest, sign, verify -------------------------------------------------------------------------


def build_manifest(directory: Path, version: str, *, published_at: str, attribution: str) -> bytes:
    if not VERSION_RE.fullmatch(version):
        raise IpmetaError(f"version {version!r} is not YYYY.MM")
    files = []
    for name, (_, cap, optional) in FILES.items():
        path = directory / name
        if not path.is_file():
            if optional:
                continue
            raise IpmetaError(f"{name} is missing from {directory}")
        data = path.read_bytes()
        if not 0 < len(data) <= cap:
            raise IpmetaError(f"{name} is {len(data)} bytes, outside 1..{cap}")
        entry = {"name": name, "sha256": hashlib.sha256(data).hexdigest(), "size": len(data)}
        if optional:
            entry["optional"] = True
        files.append(entry)
    manifest = {
        "schema": SCHEMA,
        "version": version,
        "published_at": published_at,
        "source": SOURCE,
        "licence": LICENCE,
        "attribution": attribution,
        "files": files,
    }
    return (json.dumps(manifest, indent=2, ensure_ascii=True) + "\n").encode("ascii")


def sign_manifest(raw: bytes, seed_b64: str) -> bytes:
    try:
        key = sign._load_private_key(seed_b64)
    except sign.SignError as exc:
        raise IpmetaError(str(exc)) from None
    return key.sign(DOMAIN + raw)


def verify_manifest(raw: bytes, signature: bytes, public_key_b64: str) -> dict:
    """The panel's VerifyManifest in Python: signature over DOMAIN + raw, then the shape checks."""
    if len(signature) != 64:
        try:
            signature = base64.b64decode(signature.strip(), validate=True)
        except ValueError:
            raise IpmetaError("signature is neither 64 raw bytes nor base64 of them") from None
        if len(signature) != 64:
            raise IpmetaError("signature is neither 64 raw bytes nor base64 of them")
    public = base64.b64decode(public_key_b64, validate=True)
    try:
        Ed25519PublicKey.from_public_bytes(public).verify(signature, DOMAIN + raw)
    except InvalidSignature:
        raise IpmetaError("the manifest signature does not verify") from None
    manifest = json.loads(raw)
    if manifest.get("schema") != SCHEMA or not VERSION_RE.fullmatch(str(manifest.get("version", ""))):
        raise IpmetaError("manifest schema or version not acceptable")
    return manifest


def verify_files(manifest: dict, directory: Path) -> None:
    names = {f["name"] for f in manifest["files"]}
    if not {"country.mmdb", "asn.mmdb"} <= names:
        raise IpmetaError("the manifest must list country.mmdb and asn.mmdb")
    for f in manifest["files"]:
        data = (directory / f["name"]).read_bytes()
        if len(data) != f["size"] or hashlib.sha256(data).hexdigest() != f["sha256"]:
            raise IpmetaError(f"{f['name']} does not match the manifest")


# --- publish ---------------------------------------------------------------------------------------


def _ensure_release(tag: str, revision: str, name: str, body: str, *, api_fn) -> dict:
    existing = release.find_release(tag, api_fn=api_fn)
    if existing is not None:
        return existing
    return api_fn(
        "/releases",
        method="POST",
        payload={
            "tag_name": tag,
            "target_commitish": revision,
            "name": name,
            "body": body,
            "draft": False,
            "prerelease": False,
            "make_latest": "false",
        },
    )


def _sync_assets(rel: dict, paths: list[Path], *, api_fn) -> None:
    existing = {a["name"]: a["id"] for a in rel.get("assets", [])}
    upload_url = rel["upload_url"].split("{")[0]
    for path in paths:
        if path.name in existing:
            api_fn(f"/releases/assets/{existing[path.name]}", method="DELETE")
        api_fn(f"{upload_url}?name={path.name}", method="POST", binary=path.read_bytes())


def wait_for_commit(revision: str, *, api_fn, attempts: int = 30, delay: float = 20.0, sleep=time.sleep) -> None:
    """The release tag is created on `revision`, which only exists on GitHub once the mirror job has pushed
    main. A dispatch right after a push can get ahead of it; GitHub then answers 422 on the release create."""
    for attempt in range(attempts):
        try:
            api_fn(f"/commits/{revision}")
            return
        except urllib.error.HTTPError as exc:
            if exc.code not in (404, 422):
                raise
        if attempt + 1 < attempts:
            print(f"commit {revision[:12]} is not on GitHub yet; waiting ({attempt + 1}/{attempts})")
            sleep(delay)
    raise IpmetaError(f"commit {revision[:12]} never appeared on GitHub; the mirror job has not published it")


def publish(directory: Path, version: str, revision: str, *, api_fn=release.api, sleep=time.sleep) -> dict:
    if not VERSION_RE.fullmatch(version):
        raise IpmetaError(f"version {version!r} is not YYYY.MM")
    if not re.fullmatch(r"[0-9a-f]{40}", revision):
        raise IpmetaError(f"revision must be a 40-hex commit sha, got {revision!r}")
    raw = (directory / MANIFEST).read_bytes()
    if json.loads(raw)["version"] != version:
        raise IpmetaError("the manifest in the directory is for another version")
    names = [n for n in ASSET_ORDER if (directory / n).is_file()]
    if SIGNATURE not in names or MANIFEST not in names:
        raise IpmetaError("manifest.json and manifest.json.sig must both exist")
    paths = [directory / n for n in names]
    wait_for_commit(revision, api_fn=api_fn, sleep=sleep)
    # The immutable versioned release first, then the moving alias, so the alias never points at a
    # version whose own release does not exist. Inside the alias the data files are replaced before the
    # manifest: a panel that reads in between sees a checksum mismatch, keeps its data and tries later.
    for tag, title in ((f"ipmeta-{version}", f"Offline IP data {version}"), ("ipmeta-latest", "Offline IP data (latest)")):
        body = f"Offline IP origin data for the Tend panel, {version}.\nRevision: {revision}\n{DEFAULT_ATTRIBUTION}"
        rel = _ensure_release(tag, revision, title, body, api_fn=api_fn)
        if tag == "ipmeta-latest":
            # drop assets of a former run that this release no longer carries (a city file that stopped shipping)
            for stale in rel.get("assets", []):
                if stale["name"] not in names:
                    api_fn(f"/releases/assets/{stale['id']}", method="DELETE")
            api_fn(f"/releases/{rel['id']}", method="PATCH", payload={"name": title, "body": body})
        _sync_assets(rel, paths, api_fn=api_fn)
    return {"tags": [f"ipmeta-{version}", "ipmeta-latest"], "assets": names}


# --- cli -------------------------------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("fetch")
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--today", help="YYYY-MM-DD, for tests; default: today (UTC)")
    p.add_argument("--version-out", type=Path, help="write the found YYYY.MM here")

    p = sub.add_parser("manifest")
    p.add_argument("--dir", type=Path, required=True)
    p.add_argument("--version", required=True)
    p.add_argument("--attribution", default=DEFAULT_ATTRIBUTION)
    p.add_argument("--published-at", help="RFC 3339 UTC; default: now")

    p = sub.add_parser("sign")
    p.add_argument("--dir", type=Path, required=True)

    p = sub.add_parser("verify")
    p.add_argument("--dir", type=Path, required=True)
    p.add_argument("--public-key", required=True, help="base64 raw 32-byte Ed25519 public key")

    p = sub.add_parser("publish")
    p.add_argument("--dir", type=Path, required=True)
    p.add_argument("--version", required=True)
    p.add_argument("--revision", required=True)

    args = parser.parse_args(argv)
    try:
        if args.cmd == "fetch":
            today = dt.date.fromisoformat(args.today) if args.today else dt.datetime.now(dt.timezone.utc).date()
            version = fetch(args.out, months=month_pair(today))
            print(f"version {version}")
            if args.version_out:
                args.version_out.write_text(version + "\n")
        elif args.cmd == "manifest":
            stamp = args.published_at or dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
            raw = build_manifest(args.dir, args.version, published_at=stamp, attribution=args.attribution)
            (args.dir / MANIFEST).write_bytes(raw)
            print(raw.decode("ascii"), end="")
        elif args.cmd == "sign":
            seed = os.environ.get("TEND_REGISTRY_SIGNING_KEY")
            if not seed:
                raise IpmetaError("TEND_REGISTRY_SIGNING_KEY is not set")
            (args.dir / SIGNATURE).write_bytes(sign_manifest((args.dir / MANIFEST).read_bytes(), seed))
            print(f"wrote {args.dir / SIGNATURE}")
        elif args.cmd == "verify":
            manifest = verify_manifest((args.dir / MANIFEST).read_bytes(), (args.dir / SIGNATURE).read_bytes(), args.public_key)
            verify_files(manifest, args.dir)
            print(f"verified ipmeta {manifest['version']}: signature and {len(manifest['files'])} file(s)")
        elif args.cmd == "publish":
            release.API_TIMEOUT = 1800  # the city file is ~127 MB
            print(json.dumps(publish(args.dir, args.version, args.revision)))
    except (IpmetaError, release.ReleaseError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    except urllib.error.URLError as exc:
        message, _ = release.classify_failure(exc)
        where = f" [{exc.code} {exc.url.split('?')[0]}]" if isinstance(exc, urllib.error.HTTPError) else ""
        print(f"error: {message}{where}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
