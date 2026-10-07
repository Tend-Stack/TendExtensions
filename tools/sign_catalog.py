#!/usr/bin/env python3
"""Sign dist/community-catalog.json in the format a panel verifies for a federated catalog source.

A panel fetches `<catalog-url>`, then `<catalog-url>.sig` (the raw 64-byte Ed25519 signature over the exact catalog
bytes), then the base64 public key at `<origin>/.well-known/tend-catalog-pubkey`; it pins that key on first use.
This is the same format `cmd/tend-sign-catalog` in the Tend core writes and `verifyCatalogSourceSignature`
checks, so a key made by `tend-sign-catalog keygen` works here and the other way round.

    TEND_COMMUNITY_CATALOG_SIGNING_KEY   the private key: base64 of the raw 32-byte seed, or the PKCS8 PEM
                                          file `tend-sign-catalog keygen` writes (kept as a CI secret)

    python tools/sign_catalog.py sign                       -> dist/community-catalog.json.sig
                                                              dist/tend-catalog-pubkey (publish as-is)
    python tools/sign_catalog.py verify dist/community-catalog.json --public-key <base64>

This key is separate from the registry signing key (TEND_REGISTRY_SIGNING_KEY): the registry key signs what a
panel executes, this one only vouches for catalog text.
"""
from __future__ import annotations

import argparse
import base64
import os
import sys
from pathlib import Path

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey, Ed25519PublicKey
from cryptography.hazmat.primitives.serialization import load_pem_private_key

REPO_ROOT = Path(__file__).resolve().parent.parent
CATALOG_NAME = "community-catalog.json"
SIG_NAME = CATALOG_NAME + ".sig"
PUBKEY_NAME = "tend-catalog-pubkey"
KEY_ENV = "TEND_COMMUNITY_CATALOG_SIGNING_KEY"


class CatalogSignError(Exception):
    """A problem with the key, the catalog, or a signature being verified."""


def load_private_key(material: str) -> Ed25519PrivateKey:
    text = material.strip()
    if text.startswith("-----BEGIN"):
        try:
            key = load_pem_private_key(text.encode("ascii"), password=None)
        except (ValueError, TypeError, UnicodeEncodeError) as exc:
            raise CatalogSignError("signing key PEM could not be parsed") from exc
        if not isinstance(key, Ed25519PrivateKey):
            raise CatalogSignError("signing key must be an Ed25519 key")
        return key
    try:
        seed = base64.b64decode(text, validate=True)
    except (ValueError, TypeError) as exc:
        raise CatalogSignError("signing key is neither a PEM nor valid base64") from exc
    if len(seed) != 32:
        raise CatalogSignError(f"signing key must decode to 32 raw bytes, got {len(seed)}")
    return Ed25519PrivateKey.from_private_bytes(seed)


def public_key_b64(key: Ed25519PrivateKey) -> str:
    return base64.b64encode(key.public_key().public_bytes_raw()).decode("ascii")


def sign_bytes(body: bytes, key: Ed25519PrivateKey) -> bytes:
    return key.sign(body)


def verify_bytes(body: bytes, signature: bytes, public_key: str) -> None:
    """Raise CatalogSignError unless signature verifies body under the base64 public key."""
    try:
        raw = base64.b64decode(public_key.strip(), validate=True)
    except (ValueError, TypeError) as exc:
        raise CatalogSignError("public key is not valid base64") from exc
    if len(raw) != 32:
        raise CatalogSignError(f"public key must decode to 32 raw bytes, got {len(raw)}")
    if len(signature) != 64:
        raise CatalogSignError(f"signature must be 64 raw bytes, got {len(signature)}")
    try:
        Ed25519PublicKey.from_public_bytes(raw).verify(signature, body)
    except InvalidSignature as exc:
        raise CatalogSignError("signature does not verify against the public key") from exc


def cmd_sign(args: argparse.Namespace) -> int:
    material = os.environ.get(KEY_ENV)
    if not material:
        print(f"error: {KEY_ENV} is not set", file=sys.stderr)
        return 1
    dist = args.repo_root / "dist"
    catalog = dist / CATALOG_NAME
    if not catalog.is_file():
        print(f"error: {catalog} not found; run tools/build.py first", file=sys.stderr)
        return 1
    try:
        key = load_private_key(material)
    except CatalogSignError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    body = catalog.read_bytes()
    signature = sign_bytes(body, key)
    pub = public_key_b64(key)
    # Verify what we are about to publish before publishing it.
    verify_bytes(body, signature, pub)
    (dist / SIG_NAME).write_bytes(signature)
    (dist / PUBKEY_NAME).write_text(pub + "\n", encoding="ascii")
    print(f"wrote dist/{SIG_NAME} and dist/{PUBKEY_NAME} (public key {pub})")
    return 0


def cmd_verify(args: argparse.Namespace) -> int:
    catalog = Path(args.catalog)
    sig_path = Path(args.sig) if args.sig else catalog.with_name(catalog.name + ".sig")
    try:
        body = catalog.read_bytes()
        signature = sig_path.read_bytes()
        verify_bytes(body, signature, args.public_key)
    except FileNotFoundError as exc:
        print(f"error: {exc.filename} not found", file=sys.stderr)
        return 1
    except CatalogSignError as exc:
        print(f"FAIL  {exc}", file=sys.stderr)
        return 1
    print(f"OK    {catalog.name} verifies")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Sign or verify the community catalog")
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT)
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("sign", help="sign dist/community-catalog.json").set_defaults(func=cmd_sign)
    p_verify = sub.add_parser("verify", help="verify a catalog against its .sig and a public key")
    p_verify.add_argument("catalog")
    p_verify.add_argument("--public-key", required=True, help="base64 raw 32-byte Ed25519 public key")
    p_verify.add_argument("--sig", help="signature path (default: <catalog>.sig)")
    p_verify.set_defaults(func=cmd_verify)
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
