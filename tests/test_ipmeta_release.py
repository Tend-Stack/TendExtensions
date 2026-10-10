"""The signed offline IP data release: signature layout, manifest shape, month fallback, publish order,
and the workflow's secret scoping. Nothing touches the network; keys are throwaway."""
from __future__ import annotations

import base64
import datetime as dt
import gzip
import hashlib
import io
import json
import re
import urllib.error
from pathlib import Path

import pytest
from conftest import REPO_ROOT, REVISION_A
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

from tools import ipmeta_release as ip

WORKFLOW = REPO_ROOT / ".gitea" / "workflows" / "ipmeta.yml"


def _keys() -> tuple[str, str, Ed25519PrivateKey]:
    key = Ed25519PrivateKey.generate()
    return (
        base64.b64encode(key.private_bytes_raw()).decode(),
        base64.b64encode(key.public_key().public_bytes_raw()).decode(),
        key,
    )


def _dir(tmp_path: Path, *, city: bool = True) -> Path:
    d = tmp_path / "ipmeta"
    d.mkdir()
    (d / "country.mmdb").write_bytes(b"country-bytes")
    (d / "asn.mmdb").write_bytes(b"asn-bytes")
    if city:
        (d / "city.mmdb").write_bytes(b"city-bytes")
    return d


def test_domain_prefix_is_exact() -> None:
    assert ip.DOMAIN == b"tend-ipmeta-manifest-v1\n"


def test_signature_covers_domain_plus_exact_manifest_bytes(tmp_path: Path) -> None:
    seed, pub, key = _keys()
    raw = ip.build_manifest(_dir(tmp_path), "2026.10", published_at="2026-10-03T04:00:00Z", attribution=ip.DEFAULT_ATTRIBUTION)
    sig = ip.sign_manifest(raw, seed)
    assert len(sig) == 64
    key.public_key().verify(sig, b"tend-ipmeta-manifest-v1\n" + raw)
    with pytest.raises(Exception):
        key.public_key().verify(sig, raw)  # not valid without the domain prefix
    assert ip.verify_manifest(raw, sig, pub)["version"] == "2026.10"
    assert ip.verify_manifest(raw, base64.b64encode(sig) + b"\n", pub)["version"] == "2026.10"


def test_a_registry_signature_never_verifies_as_a_manifest(tmp_path: Path) -> None:
    seed, pub, key = _keys()
    raw = ip.build_manifest(_dir(tmp_path), "2026.10", published_at="2026-10-03T04:00:00Z", attribution="a")
    registry_sig = key.sign(b"tend-extension-registry-v1\n" + raw)
    with pytest.raises(ip.IpmetaError):
        ip.verify_manifest(raw, registry_sig, pub)


def test_tampered_manifest_and_wrong_key_are_refused(tmp_path: Path) -> None:
    seed, pub, _ = _keys()
    raw = ip.build_manifest(_dir(tmp_path), "2026.10", published_at="2026-10-03T04:00:00Z", attribution="a")
    sig = ip.sign_manifest(raw, seed)
    with pytest.raises(ip.IpmetaError):
        ip.verify_manifest(raw + b" ", sig, pub)
    with pytest.raises(ip.IpmetaError):
        ip.verify_manifest(raw, sig, _keys()[1])
    with pytest.raises(ip.IpmetaError):
        ip.sign_manifest(raw, "not base64!")


def test_manifest_shape_matches_the_panel(tmp_path: Path) -> None:
    d = _dir(tmp_path)
    m = json.loads(ip.build_manifest(d, "2026.10", published_at="2026-10-03T04:00:00Z", attribution="attr"))
    assert list(m) == ["schema", "version", "published_at", "source", "licence", "attribution", "files"]
    assert m["schema"] == 1 and m["source"] == "DB-IP Lite" and m["licence"] == "CC BY 4.0"
    assert [f["name"] for f in m["files"]] == ["country.mmdb", "asn.mmdb", "city.mmdb"]
    country = m["files"][0]
    assert country == {"name": "country.mmdb", "sha256": hashlib.sha256(b"country-bytes").hexdigest(), "size": 13}
    assert m["files"][2]["optional"] is True and "optional" not in country
    d2 = tmp_path / "nocity"; d2.mkdir(); (d2 / "country.mmdb").write_bytes(b"c"); (d2 / "asn.mmdb").write_bytes(b"a")
    no_city = json.loads(ip.build_manifest(d2, "2026.10", published_at="t", attribution="a"))
    assert [f["name"] for f in no_city["files"]] == ["country.mmdb", "asn.mmdb"]


def test_manifest_refuses_bad_version_missing_required_and_oversize(tmp_path: Path) -> None:
    d = _dir(tmp_path)
    with pytest.raises(ip.IpmetaError):
        ip.build_manifest(d, "2026-10", published_at="t", attribution="a")
    (d / "asn.mmdb").unlink()
    with pytest.raises(ip.IpmetaError):
        ip.build_manifest(d, "2026.10", published_at="t", attribution="a")


def test_verify_files_catches_a_swapped_file(tmp_path: Path) -> None:
    d = _dir(tmp_path)
    m = json.loads(ip.build_manifest(d, "2026.10", published_at="t", attribution="a"))
    ip.verify_files(m, d)
    (d / "asn.mmdb").write_bytes(b"other-bytes")
    with pytest.raises(ip.IpmetaError):
        ip.verify_files(m, d)


def test_month_pair_handles_january() -> None:
    assert ip.month_pair(dt.date(2026, 10, 3)) == ["2026-10", "2026-09"]
    assert ip.month_pair(dt.date(2027, 1, 3)) == ["2027-01", "2026-12"]


def _opener(available: set[str]):
    def opener(url: str):
        m = re.search(r"dbip-(\w+)-lite-(\d{4}-\d{2})\.mmdb\.gz$", url)
        assert m, url
        if f"{m.group(1)}-{m.group(2)}" not in available:
            raise urllib.error.HTTPError(url, 404, "nf", {}, None)
        return io.BytesIO(gzip.compress(f"{m.group(1)}-{m.group(2)}".encode()))

    return opener


def test_fetch_uses_the_current_month_when_out(tmp_path: Path) -> None:
    out = tmp_path / "o"
    v = ip.fetch(out, months=["2026-10", "2026-09"], opener=_opener({"country-2026-10", "asn-2026-10", "city-2026-10"}))
    assert v == "2026.10" and (out / "city.mmdb").read_bytes() == b"city-2026-10"


def test_fetch_falls_back_to_the_previous_month_and_drops_partial_files(tmp_path: Path) -> None:
    out = tmp_path / "o"
    avail = {"country-2026-10", "country-2026-09", "asn-2026-09", "city-2026-09"}  # asn not out for October
    v = ip.fetch(out, months=["2026-10", "2026-09"], opener=_opener(avail))
    assert v == "2026.09"
    assert (out / "country.mmdb").read_bytes() == b"country-2026-09"  # not the October country file


def test_fetch_skips_a_missing_city_and_fails_when_neither_month_has_the_required_files(tmp_path: Path) -> None:
    v = ip.fetch(tmp_path / "a", months=["2026-10", "2026-09"], opener=_opener({"country-2026-10", "asn-2026-10"}))
    assert v == "2026.10" and not (tmp_path / "a" / "city.mmdb").exists()
    with pytest.raises(ip.IpmetaError):
        ip.fetch(tmp_path / "b", months=["2026-10", "2026-09"], opener=_opener(set()))


def test_fetch_enforces_the_size_cap(tmp_path: Path, monkeypatch) -> None:
    monkeypatch.setitem(ip.FILES, "country.mmdb", ("country", 8, False))
    with pytest.raises(ip.IpmetaError):
        ip.fetch(tmp_path, months=["2026-10"], opener=lambda url: io.BytesIO(gzip.compress(b"x" * 9)))
    assert not (tmp_path / "country.mmdb").exists()


def test_publish_creates_the_versioned_release_then_moves_the_alias(tmp_path: Path) -> None:
    seed, pub, _ = _keys()
    d = _dir(tmp_path)
    raw = ip.build_manifest(d, "2026.10", published_at="t", attribution="a")
    (d / "manifest.json").write_bytes(raw)
    (d / "manifest.json.sig").write_bytes(ip.sign_manifest(raw, seed))
    calls: list[tuple[str, str]] = []
    created_payloads: list[dict] = []
    releases: dict[str, dict] = {
        "ipmeta-latest": {"id": 7, "upload_url": "https://uploads.github.com/repos/Tend-Stack/TendExtensions/releases/7/assets{?name}",
                          "assets": [{"name": "city.mmdb", "id": 70}, {"name": "old.bin", "id": 71}]}
    }

    def fake(path: str, *, method: str = "GET", payload=None, binary=None):
        calls.append((method, path))
        if method == "GET" and path.startswith("/commits/"):
            return {}
        if method == "GET":
            tag = path.rsplit("/", 1)[1]
            if tag in releases:
                return releases[tag]
            raise urllib.error.HTTPError(path, 404, "nf", {}, None)
        if method == "POST" and path == "/releases":
            releases[payload["tag_name"]] = {"id": 5, "upload_url": "https://uploads.github.com/repos/Tend-Stack/TendExtensions/releases/5/assets{?name}", "assets": []}
            assert payload["target_commitish"] == REVISION_A
            created_payloads.append(payload)
            return releases[payload["tag_name"]]
        return {}

    result = ip.publish(d, "2026.10", REVISION_A, api_fn=fake)
    assert result["tags"] == ["ipmeta-2026.10", "ipmeta-latest"]
    uploads = [p.split("name=")[1] for m, p in calls if m == "POST" and p.startswith("https://uploads")]
    # per release: data files, then the signature, the manifest last
    assert uploads == ["country.mmdb", "asn.mmdb", "city.mmdb", "manifest.json.sig", "manifest.json"] * 2
    # the request GitHub sees: exactly these keys, a 40-hex sha as target, string make_latest, short body
    assert [sorted(p) for p in created_payloads] == [sorted(["tag_name", "target_commitish", "name", "body", "draft", "prerelease", "make_latest"])]
    p = created_payloads[0]
    assert p["tag_name"] == "ipmeta-2026.10" and re.fullmatch(r"[0-9a-f]{40}", p["target_commitish"])
    assert p["draft"] is False and p["prerelease"] is False and p["make_latest"] == "false" and len(p["body"]) < 1000
    created = [i for i, (m, p) in enumerate(calls) if (m, p) == ("POST", "/releases")]
    assert len(created) == 1 and created[0] < calls.index(("DELETE", "/releases/assets/70"))
    assert ("DELETE", "/releases/assets/71") in calls  # stale asset dropped from the alias
    assert ("DELETE", "/releases/assets/70") in calls  # same-name asset replaced


def test_publish_refuses_a_manifest_for_another_version(tmp_path: Path) -> None:
    d = _dir(tmp_path)
    (d / "manifest.json").write_bytes(ip.build_manifest(d, "2026.09", published_at="t", attribution="a"))
    (d / "manifest.json.sig").write_bytes(b"x" * 64)
    with pytest.raises(ip.IpmetaError):
        ip.publish(d, "2026.10", REVISION_A, api_fn=lambda *a, **k: {})


# --- the workflow ------------------------------------------------------------------------------------


def _text() -> str:
    return "\n".join(l for l in WORKFLOW.read_text(encoding="utf-8").splitlines() if not l.lstrip().startswith("#"))


def test_workflow_schedule_and_dry_default() -> None:
    t = _text()
    assert 'cron: "0 4 3 * *"' in t and "workflow_dispatch:" in t
    assert re.search(r"dry_run:\n(?:\s+.*\n)*?\s+default: true", t)


def test_workflow_secrets_are_scoped_to_their_one_step() -> None:
    t = _text()
    for secret in ("TEND_REGISTRY_SIGNING_KEY", "GH_PUBLISH_TOKEN"):
        assert t.count(f"secrets.{secret}") == 1, secret
    sign_at, publish_at = t.index("secrets.TEND_REGISTRY_SIGNING_KEY"), t.index("secrets.GH_PUBLISH_TOKEN")
    assert sign_at < publish_at
    assert "echo" not in t[sign_at : t.index("ipmeta_release verify")].replace('echo "TEND', "")


def test_workflow_interpolates_nothing_into_shell() -> None:
    inside = False
    for line in _text().splitlines():
        if re.match(r"^\s*(?:- )?run:", line):
            inside = True
        elif re.match(r"^\s*(?:- )?(name|uses|with|env|if):", line):
            inside = False
        if inside:
            assert "${{" not in line, line


def test_workflow_publishes_only_when_not_dry() -> None:
    t = _text()
    block = t[t.index("Create or update the GitHub releases") :]
    assert "env.DRY_RUN == 'false'" in block.split("run:")[0]


def test_publish_waits_for_the_mirrored_commit_then_gives_up(tmp_path: Path) -> None:
    d = _dir(tmp_path)
    raw = ip.build_manifest(d, "2026.10", published_at="t", attribution="a")
    (d / "manifest.json").write_bytes(raw)
    (d / "manifest.json.sig").write_bytes(b"x" * 64)
    waits: list[float] = []

    def missing(path: str, **kw):
        raise urllib.error.HTTPError(path, 422, "no", {}, None)

    with pytest.raises(ip.IpmetaError, match="never appeared"):
        ip.publish(d, "2026.10", REVISION_A, api_fn=missing, sleep=waits.append)
    assert len(waits) == 29


def test_error_detail_reports_message_and_errors_but_never_the_token(monkeypatch) -> None:
    from tools import release

    monkeypatch.setenv("GH_PUBLISH_TOKEN", "s3cret-token")
    body = json.dumps({"message": "Validation Failed s3cret-token", "errors": [{"resource": "Release", "code": "invalid", "field": "target_commitish"}]})
    exc = urllib.error.HTTPError("https://api.github.com/repos/x/releases", 422, "x", {}, io.BytesIO(body.encode()))
    text, permanent = release.classify_failure(exc)
    assert "Validation Failed ***" in text and "Release/target_commitish/invalid" in text and "s3cret" not in text and permanent
