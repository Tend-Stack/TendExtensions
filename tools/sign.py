#!/usr/bin/env python3
"""Sign dist/registry.json into the published envelope
dist/tend-extension-registry-v1.json.

Envelope shape and canonicalisation mirror `_verify_envelope` /
`_canonical_payload` in the Tend panel core
(backend/app/services/extension_release_discovery.py) byte for byte, with
this registry's own domain separation string and key:

    { "schema": 1, "key_id": "<sha256(pubkey)[:16] hex>",
      "payload": <registry.json object, plus issued_at/expires_at>,
      "signature": "<base64 Ed25519 signature>" }

    signature = Ed25519.sign(DOMAIN + canonical_payload)
    DOMAIN = b"tend-extension-registry-v1\\n"
    canonical_payload = json.dumps(payload, sort_keys=True,
                                    separators=(",", ":"),
                                    ensure_ascii=True).encode("ascii")

The private key comes from TEND_REGISTRY_SIGNING_KEY: base64 of the raw
32-byte Ed25519 seed. `--verify` checks an existing envelope against a
given public key without needing the private key at all.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import sys
import time
from pathlib import Path
from typing import Any

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)

DOMAIN = b"tend-extension-registry-v1\n"
EXPIRY_SECONDS = 365 * 24 * 60 * 60
ENVELOPE_NAME = "tend-extension-registry-v1.json"
REPO_ROOT = Path(__file__).resolve().parent.parent


class SignError(Exception):
    """A problem with the signing key, the registry payload, or an
    envelope being verified."""


def canonical_payload(payload: dict[str, Any]) -> bytes:
    return json.dumps(
        payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode("ascii")


def key_id_for(public_bytes: bytes) -> str:
    return hashlib.sha256(public_bytes).hexdigest()[:16]


def _load_private_key(seed_b64: str) -> Ed25519PrivateKey:
    try:
        seed = base64.b64decode(seed_b64, validate=True)
    except (ValueError, TypeError) as exc:
        raise SignError("signing key is not valid base64") from exc
    if len(seed) != 32:
        raise SignError(f"signing key must decode to 32 raw bytes, got {len(seed)}")
    return Ed25519PrivateKey.from_private_bytes(seed)


def sign_registry(registry: dict[str, Any], seed_b64: str, *, issued_at: int | None = None) -> dict[str, Any]:
    private_key = _load_private_key(seed_b64)
    public_bytes = private_key.public_key().public_bytes_raw()
    key_id = key_id_for(public_bytes)

    if issued_at is None:
        issued_at = int(time.time())
    expires_at = issued_at + EXPIRY_SECONDS

    payload = dict(registry)
    payload["issued_at"] = issued_at
    payload["expires_at"] = expires_at

    canonical = canonical_payload(payload)
    signature = private_key.sign(DOMAIN + canonical)

    return {
        "schema": 1,
        "key_id": key_id,
        "payload": payload,
        "signature": base64.b64encode(signature).decode("ascii"),
    }


def verify_envelope(envelope: dict[str, Any], public_key_b64: str) -> dict[str, Any]:
    """Verify an envelope against a base64 raw-32-byte public key. Returns
    the payload on success; raises SignError on any mismatch. Mirrors the
    strict shape checks in the panel's `_verify_envelope`."""
    if not isinstance(envelope, dict) or set(envelope) != {"schema", "key_id", "payload", "signature"}:
        raise SignError("envelope must have exactly schema/key_id/payload/signature")
    if envelope.get("schema") != 1:
        raise SignError(f"envelope 'schema' must be 1, got {envelope.get('schema')!r}")

    try:
        public_bytes = base64.b64decode(public_key_b64, validate=True)
    except (ValueError, TypeError) as exc:
        raise SignError("public key is not valid base64") from exc
    if len(public_bytes) != 32:
        raise SignError(f"public key must decode to 32 raw bytes, got {len(public_bytes)}")

    expected_key_id = key_id_for(public_bytes)
    if envelope["key_id"] != expected_key_id:
        raise SignError(
            f"envelope key_id {envelope['key_id']!r} does not match the given public key ({expected_key_id!r})"
        )

    payload = envelope["payload"]
    if not isinstance(payload, dict):
        raise SignError("envelope 'payload' must be an object")

    signature_text = envelope.get("signature")
    if not isinstance(signature_text, str):
        raise SignError("envelope 'signature' must be a base64 string")
    try:
        signature = base64.b64decode(signature_text, validate=True)
    except (ValueError, TypeError) as exc:
        raise SignError("envelope 'signature' is not valid base64") from exc
    if len(signature) != 64:
        raise SignError(f"signature must decode to 64 raw bytes, got {len(signature)}")

    canonical = canonical_payload(payload)
    try:
        Ed25519PublicKey.from_public_bytes(public_bytes).verify(signature, DOMAIN + canonical)
    except InvalidSignature as exc:
        raise SignError("signature does not verify against the given public key") from exc

    issued_at = payload.get("issued_at")
    expires_at = payload.get("expires_at")
    if not isinstance(issued_at, int) or not isinstance(expires_at, int):
        raise SignError("payload 'issued_at'/'expires_at' must be integers")
    if expires_at - issued_at != EXPIRY_SECONDS:
        raise SignError(
            f"validity window must be exactly {EXPIRY_SECONDS} seconds, got {expires_at - issued_at}"
        )

    return payload


def cmd_sign(args: argparse.Namespace) -> int:
    seed_b64 = os.environ.get("TEND_REGISTRY_SIGNING_KEY")
    if not seed_b64:
        print("error: TEND_REGISTRY_SIGNING_KEY is not set", file=sys.stderr)
        return 1

    registry_path = args.repo_root / "dist" / "registry.json"
    try:
        registry = json.loads(registry_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"error: {registry_path} not found — run tools/build.py first", file=sys.stderr)
        return 1

    try:
        envelope = sign_registry(registry, seed_b64)
    except SignError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    out_path = args.repo_root / "dist" / ENVELOPE_NAME
    out_path.write_text(json.dumps(envelope, indent=2, sort_keys=True, ensure_ascii=True) + "\n", encoding="utf-8")
    print(f"wrote {out_path}  key_id={envelope['key_id']}  sequence={envelope['payload']['sequence']}")
    return 0


def cmd_verify(args: argparse.Namespace) -> int:
    try:
        envelope = json.loads(Path(args.envelope).read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"error: {args.envelope} not found", file=sys.stderr)
        return 1
    except json.JSONDecodeError as exc:
        print(f"error: {args.envelope} is not valid JSON: {exc}", file=sys.stderr)
        return 1

    try:
        verify_envelope(envelope, args.public_key)
    except SignError as exc:
        print(f"FAIL  {exc}", file=sys.stderr)
        return 1

    print(f"OK    envelope verifies (key_id={envelope['key_id']}, sequence={envelope['payload'].get('sequence')})")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Sign or verify the TendExtensions registry envelope")
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT)
    sub = parser.add_subparsers(dest="cmd")

    p_sign = sub.add_parser("sign", help="sign dist/registry.json (default action)")
    p_sign.set_defaults(func=cmd_sign)

    p_verify = sub.add_parser("verify", help="verify an existing envelope against a public key")
    p_verify.add_argument("envelope", help="path to a signed envelope JSON file")
    p_verify.add_argument("--public-key", required=True, help="base64 raw 32-byte Ed25519 public key")
    p_verify.set_defaults(func=cmd_verify)

    # `--verify` as a flag is the CI-friendly form: `sign.py --verify dist/... --public-key ...`
    parser.add_argument("--verify", metavar="ENVELOPE", help=argparse.SUPPRESS)
    parser.add_argument("--public-key", dest="top_public_key", metavar="KEY", help=argparse.SUPPRESS)

    args = parser.parse_args(argv)

    if args.verify:
        if not args.top_public_key:
            parser.error("--verify requires --public-key")
        args.envelope = args.verify
        args.public_key = args.top_public_key
        return cmd_verify(args)

    if not getattr(args, "cmd", None):
        args.func = cmd_sign
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
