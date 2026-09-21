from __future__ import annotations

import base64
import copy
import json

import pytest
from conftest import REVISION_A
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)

from tools import sign

CONTRACT_PUBLIC_KEY_B64 = "yi68zm6gAuttvyH9TUyo/oiC002cCzgrGHbjp8BdxOA="
CONTRACT_KEY_ID = "51f460b512853065"


def _keypair() -> tuple[str, str]:
    private_key = Ed25519PrivateKey.generate()
    seed_b64 = base64.b64encode(private_key.private_bytes_raw()).decode("ascii")
    pub_b64 = base64.b64encode(private_key.public_key().public_bytes_raw()).decode("ascii")
    return seed_b64, pub_b64


def _fake_registry() -> dict:
    return {
        "schema": 1,
        "registry_id": "tend-extensions",
        "sequence": 3,
        "revision": REVISION_A,
        "generated_at": 1_758_000_000,
        "extensions": [],
    }


def test_pinned_public_key_hashes_to_the_contract_key_id() -> None:
    # Regression pin: if this ever drifts, every deployed panel's pinned
    # key stops matching what this registry signs with.
    assert sign.key_id_for(base64.b64decode(CONTRACT_PUBLIC_KEY_B64)) == CONTRACT_KEY_ID


def test_sign_round_trips_against_cryptography_directly() -> None:
    """Independent of our own verify_envelope: recompute the canonical
    payload and check the signature with cryptography's own verify(),
    using the contract's exact domain string."""
    seed_b64, pub_b64 = _keypair()
    registry = _fake_registry()

    envelope = sign.sign_registry(registry, seed_b64, issued_at=1_758_000_000)

    assert envelope["schema"] == 1
    assert envelope["key_id"] == sign.key_id_for(base64.b64decode(pub_b64))
    assert envelope["payload"]["issued_at"] == 1_758_000_000
    assert envelope["payload"]["expires_at"] == 1_758_000_000 + sign.EXPIRY_SECONDS
    assert sign.DOMAIN == b"tend-extension-registry-v1\n"

    canonical = sign.canonical_payload(envelope["payload"])
    # Exact separators/ordering the contract specifies.
    assert canonical == json.dumps(
        envelope["payload"], sort_keys=True, separators=(",", ":"), ensure_ascii=True
    ).encode("ascii")

    signature = base64.b64decode(envelope["signature"])
    public_key = Ed25519PublicKey.from_public_bytes(base64.b64decode(pub_b64))
    public_key.verify(signature, sign.DOMAIN + canonical)  # raises on mismatch

    # And our own verifier agrees.
    payload = sign.verify_envelope(envelope, pub_b64)
    assert payload == envelope["payload"]


def test_verify_rejects_a_tampered_payload() -> None:
    seed_b64, pub_b64 = _keypair()
    envelope = sign.sign_registry(_fake_registry(), seed_b64)

    tampered = copy.deepcopy(envelope)
    tampered["payload"]["sequence"] += 1

    with pytest.raises(sign.SignError, match="does not verify"):
        sign.verify_envelope(tampered, pub_b64)

    # The untampered envelope still verifies (sanity: the test above
    # failed because of the tamper, not because verification is broken).
    sign.verify_envelope(envelope, pub_b64)


def test_verify_rejects_wrong_public_key() -> None:
    seed_b64, _pub_b64 = _keypair()
    envelope = sign.sign_registry(_fake_registry(), seed_b64)
    _other_seed, other_pub_b64 = _keypair()

    with pytest.raises(sign.SignError, match="key_id"):
        sign.verify_envelope(envelope, other_pub_b64)


def test_verify_rejects_bad_validity_window() -> None:
    seed_b64, pub_b64 = _keypair()
    envelope = sign.sign_registry(_fake_registry(), seed_b64)
    envelope["payload"]["expires_at"] -= 1  # window is now off by one second

    # The signature no longer matches the mutated payload either, so this
    # is caught as a signature mismatch before the window check runs.
    with pytest.raises(sign.SignError):
        sign.verify_envelope(envelope, pub_b64)


def test_sign_rejects_a_malformed_key() -> None:
    with pytest.raises(sign.SignError, match="32 raw bytes"):
        sign.sign_registry(_fake_registry(), base64.b64encode(b"too-short").decode())
