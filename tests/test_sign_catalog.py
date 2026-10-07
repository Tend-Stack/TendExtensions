"""Signing the community catalog in the format a panel verifies (raw 64-byte detached Ed25519 over the exact bytes,
base64 public key), and shipping it only as a complete signed set."""
from __future__ import annotations

import base64
import os
import shutil
import subprocess
from pathlib import Path

import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

from tools import release, sign_catalog as sc

BODY = b'{"entries": [], "name": "Tend Community", "version": "1"}\n'


def make_key() -> Ed25519PrivateKey:
    return Ed25519PrivateKey.generate()


def seed_b64(key: Ed25519PrivateKey) -> str:
    return base64.b64encode(key.private_bytes_raw()).decode()


def pem(key: Ed25519PrivateKey) -> str:
    return key.private_bytes(
        serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()
    ).decode()


def setup_dist(tmp_path: Path) -> Path:
    dist = tmp_path / "dist"
    dist.mkdir()
    (dist / sc.CATALOG_NAME).write_bytes(BODY)
    return dist


@pytest.mark.parametrize("encode", [seed_b64, pem], ids=["seed", "pem"])
def test_sign_writes_verifiable_detached_signature_and_pubkey(tmp_path: Path, monkeypatch, encode) -> None:
    key = make_key()
    dist = setup_dist(tmp_path)
    monkeypatch.setenv(sc.KEY_ENV, encode(key))
    assert sc.main(["--repo-root", str(tmp_path), "sign"]) == 0
    signature = (dist / sc.SIG_NAME).read_bytes()
    assert len(signature) == 64
    pub = (dist / sc.PUBKEY_NAME).read_text()
    assert pub == sc.public_key_b64(key) + "\n" and len(base64.b64decode(pub)) == 32
    sc.verify_bytes(BODY, signature, pub)
    assert sc.main(["verify", str(dist / sc.CATALOG_NAME), "--public-key", pub.strip()]) == 0


def test_tampering_and_wrong_key_fail(tmp_path: Path, monkeypatch, capsys) -> None:
    key = make_key()
    dist = setup_dist(tmp_path)
    monkeypatch.setenv(sc.KEY_ENV, seed_b64(key))
    assert sc.main(["--repo-root", str(tmp_path), "sign"]) == 0
    pub = sc.public_key_b64(key)
    (dist / sc.CATALOG_NAME).write_bytes(BODY + b" ")
    assert sc.main(["verify", str(dist / sc.CATALOG_NAME), "--public-key", pub]) == 1
    (dist / sc.CATALOG_NAME).write_bytes(BODY)
    assert sc.main(["verify", str(dist / sc.CATALOG_NAME), "--public-key", sc.public_key_b64(make_key())]) == 1
    assert "FAIL" in capsys.readouterr().err
    with pytest.raises(sc.CatalogSignError):
        sc.verify_bytes(BODY, b"short", pub)
    with pytest.raises(sc.CatalogSignError):
        sc.verify_bytes(BODY, b"x" * 64, "not base64!")


def test_sign_refuses_missing_key_catalog_and_garbage_key(tmp_path: Path, monkeypatch, capsys) -> None:
    monkeypatch.delenv(sc.KEY_ENV, raising=False)
    assert sc.main(["--repo-root", str(tmp_path), "sign"]) == 1
    monkeypatch.setenv(sc.KEY_ENV, seed_b64(make_key()))
    assert sc.main(["--repo-root", str(tmp_path), "sign"]) == 1  # no dist/community-catalog.json
    setup_dist(tmp_path)
    for bad in ("???", base64.b64encode(b"short").decode(), "-----BEGIN PRIVATE KEY-----\nnope\n-----END PRIVATE KEY-----"):
        monkeypatch.setenv(sc.KEY_ENV, bad)
        assert sc.main(["--repo-root", str(tmp_path), "sign"]) == 1
    err = capsys.readouterr().err
    assert "garbage" not in err and "nope" not in err  # never echo key material


def test_registry_key_domain_separation_is_not_reused() -> None:
    # The catalog signature covers the raw body with no domain prefix (the panel's format), so it can never be
    # mistaken for a registry envelope signature, which is over DOMAIN + canonical payload.
    from tools import sign

    key = make_key()
    signature = sc.sign_bytes(BODY, key)
    with pytest.raises(sc.CatalogSignError):
        sc.verify_bytes(sign.DOMAIN + BODY, signature, sc.public_key_b64(key))


def test_release_attaches_the_catalog_only_as_a_signed_set(tmp_path: Path) -> None:
    dist = tmp_path / "dist"
    dist.mkdir()
    for name in ("a-1.0.0.zip", "registry.json", "tend-extension-registry-v1.json", sc.CATALOG_NAME):
        (dist / name).write_bytes(b"x")
    names = [p.name for p in release.dist_assets(dist)]
    assert sc.CATALOG_NAME not in names  # unsigned: not published
    (dist / sc.SIG_NAME).write_bytes(b"x")
    assert sc.CATALOG_NAME not in [p.name for p in release.dist_assets(dist)]
    (dist / sc.PUBKEY_NAME).write_bytes(b"x")
    names = [p.name for p in release.dist_assets(dist)]
    assert {sc.CATALOG_NAME, sc.SIG_NAME, sc.PUBKEY_NAME} <= set(names)


@pytest.mark.skipif(
    not (os.environ.get("TEND_CORE_CHECKOUT") and shutil.which("go")),
    reason="needs a Tend core checkout and Go (TEND_CORE_CHECKOUT)",
)
def test_core_tend_sign_catalog_verifies_our_signature(tmp_path: Path, monkeypatch) -> None:
    """Interop with the panel's own tool: a catalog signed here verifies with `tend-sign-catalog verify`."""
    core = Path(os.environ["TEND_CORE_CHECKOUT"])
    if not (core / "cmd" / "tend-sign-catalog").is_dir():
        pytest.skip("core checkout has no cmd/tend-sign-catalog")
    key = make_key()
    dist = setup_dist(tmp_path)
    monkeypatch.setenv(sc.KEY_ENV, pem(key))
    assert sc.main(["--repo-root", str(tmp_path), "sign"]) == 0
    result = subprocess.run(
        ["go", "run", "./cmd/tend-sign-catalog", "verify", str(dist / sc.PUBKEY_NAME), str(dist / sc.CATALOG_NAME)],
        cwd=core, capture_output=True, text=True,
    )
    assert result.returncode == 0, result.stderr
