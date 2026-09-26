from __future__ import annotations

import hashlib
import json
import urllib.error
from pathlib import Path

import pytest
from conftest import REVISION_A

from tools import mcp_release, mcp_window
from tools.release import ReleaseError

VERSION = "0.1.0"
TAG = "mcp-runtime-0.1.0"
UPLOAD_URL = "https://uploads.github.com/repos/Tend-Stack/TendExtensions/releases/7/assets{?name,label}"


def _digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def write_release_dir(
    directory: Path,
    *,
    version: str = VERSION,
    break_field: str | None = None,
    min_core: str = "0.6.0",
    max_core: str = "0.9.0",
    salt: bytes = b"",
) -> dict[str, bytes]:
    """Write the five assets a runtime release publishes.

    The envelopes are shaped like the real ones (schema, key_id, payload,
    signature) but are not signed: nothing under test verifies a signature —
    the workflow's `tend-mcp-release verify` step does that with the panel's own
    code — and a fixture that pretended to would be testing the wrong tool.
    """
    directory.mkdir(parents=True, exist_ok=True)
    bodies: dict[str, bytes] = {
        # `salt` stands in for a build that produced different bytes: two runtime
        # versions whose images were byte-identical would not exercise replacement.
        "service-linux-amd64.zip": b"amd64 worker image bytes" + salt,
        "service-linux-arm64.zip": b"arm64 worker image bytes" + salt,
        "tend-mcp-ui.zip": b"browser package bytes",
    }
    ui_digest = _digest(bodies["tend-mcp-ui.zip"])
    for architecture in ("amd64", "arm64"):
        service = bodies[f"service-linux-{architecture}.zip"]
        payload = {
            "component_id": "host.tend.mcp",
            "version": version,
            "platform": f"linux/{architecture}",
            "ui_sha256": ui_digest,
            "service_sha256": _digest(service),
            "capabilities": ["mcp.apps.summary.read", "mcp.deployments.status.read"],
            # The window and the sequence the publisher derives rather than types:
            # the sequence is the one the panel derives from the version, because
            # the panel refuses any other value.
            "min_core_version": min_core,
            "max_core_version": max_core,
            "sequence": mcp_window.sequence_of(version),
            "issued_at": 1790357825,
            "expires_at": 1821893825,
        }
        if break_field == "version":
            payload["version"] = "9.9.9"
        elif break_field == "platform":
            payload["platform"] = "linux/amd64"
        elif break_field == "service_sha256":
            payload["service_sha256"] = "0" * 64
        elif break_field == "ui_sha256":
            payload["ui_sha256"] = "0" * 64
        elif break_field == "missing_digest":
            payload.pop("service_sha256")
        bodies[f"runtime-linux-{architecture}.json"] = json.dumps(
            {"schema": 1, "key_id": mcp_release.EXPECTED_KEY_ID, "payload": payload, "signature": "x"}
        ).encode("utf-8")
    for name, body in bodies.items():
        (directory / name).write_bytes(body)
    return bodies


class FakeAPI:
    """A GitHub API that records every call and serves one release."""

    def __init__(self, release: dict | None):
        self.release = release
        self.calls: list[tuple[str, str]] = []

    def __call__(self, path: str, *, method: str = "GET", payload=None, binary=None):
        self.calls.append((method, path))
        if method == "GET" and path == f"/releases/tags/{TAG}":
            if self.release is None:
                raise urllib.error.HTTPError(path, 404, "not found", {}, None)
            return self.release
        if method == "POST" and path == "/releases":
            assert payload["tag_name"] == TAG
            assert payload["target_commitish"] == REVISION_A
            assert payload["make_latest"] == "false"
            self.release = {"upload_url": UPLOAD_URL, "assets": []}
            return self.release
        if method == "DELETE" and path.startswith("/releases/assets/"):
            return {}
        if method == "POST" and path.startswith("https://uploads.github.com/"):
            return {"id": 1, "name": path.split("name=")[1]}
        raise AssertionError(f"unexpected call: {method} {path}")

    def uploads(self) -> list[str]:
        return [
            p.split("name=")[1]
            for m, p in self.calls
            if m == "POST" and p.startswith("https://uploads.github.com/")
        ]

    def deletes(self) -> list[str]:
        return sorted(p for m, p in self.calls if m == "DELETE")


def _published(bodies: dict[str, bytes], *, only: tuple[str, ...] | None = None) -> dict:
    names = only if only is not None else tuple(bodies)
    return {
        "upload_url": UPLOAD_URL,
        "assets": [
            {
                "name": name,
                "id": 100 + index,
                "browser_download_url": f"https://example.invalid/{name}",
            }
            for index, name in enumerate(names)
        ],
    }


def _fetch_from(bodies: dict[str, bytes]):
    def fetch(url: str) -> bytes:
        return bodies[url.rsplit("/", 1)[1]]

    return fetch


# ---------- the pinned key ----------


def test_committed_public_key_has_the_pinned_key_id() -> None:
    """The one fact a panel's own source pins. If this file ever changes, every
    panel that trusts the old key stops trusting this registry's releases."""
    key = (Path(mcp_release.REPO_ROOT) / mcp_release.PUBLIC_KEY_PATH).read_text(encoding="utf-8")
    assert mcp_release.key_id_for(key) == mcp_release.EXPECTED_KEY_ID


@pytest.mark.parametrize("bad", ["not base64!", "", "c2hvcnQ="])
def test_key_id_refuses_anything_that_is_not_a_32_byte_key(bad: str) -> None:
    with pytest.raises(ReleaseError):
        mcp_release.key_id_for(bad)


# ---------- the asset set ----------


def test_collect_assets_requires_all_five(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path)
    (tmp_path / "tend-mcp-ui.zip").unlink()
    with pytest.raises(ReleaseError, match="missing expected asset"):
        mcp_release.collect_assets(tmp_path)
    assert set(mcp_release.ASSET_NAMES) == set(bodies)


def test_collect_assets_refuses_an_empty_asset(tmp_path: Path) -> None:
    write_release_dir(tmp_path)
    (tmp_path / "service-linux-arm64.zip").write_bytes(b"")
    with pytest.raises(ReleaseError, match="is empty"):
        mcp_release.collect_assets(tmp_path)


# ---------- the envelope cross-check ----------


def test_check_envelopes_accepts_a_matching_release(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path)
    mcp_release.check_envelopes(bodies, VERSION)


@pytest.mark.parametrize(
    "break_field,message",
    [
        ("version", "signs version"),
        ("platform", "signs platform"),
        ("service_sha256", "service_sha256"),
        ("ui_sha256", "ui_sha256"),
        ("missing_digest", "no valid service_sha256"),
    ],
)
def test_check_envelopes_refuses_a_mismatch(tmp_path: Path, break_field: str, message: str) -> None:
    """Every one of these publishes cleanly and then fails on a panel, after the
    browser package has already been installed. They belong here."""
    bodies = write_release_dir(tmp_path, break_field=break_field)
    with pytest.raises(ReleaseError, match=message):
        mcp_release.check_envelopes(bodies, VERSION)


def test_check_envelopes_refuses_a_non_envelope(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path)
    bodies["runtime-linux-amd64.json"] = b"not json"
    with pytest.raises(ReleaseError, match="not a JSON release envelope"):
        mcp_release.check_envelopes(bodies, VERSION)


# ---------- the per-asset decision ----------


def test_decide_uploads_when_absent() -> None:
    assert mcp_release.decide("x.zip", b"bytes", None, overwrite=False, fetch=_boom) == "upload"


def test_decide_keeps_identical_bytes() -> None:
    body = b"identical bytes"
    existing = {"name": "x.zip", "id": 1, "browser_download_url": "https://example.invalid/x.zip"}
    action = mcp_release.decide("x.zip", body, existing, overwrite=False, fetch=lambda url: body)
    assert action == "keep"


def test_decide_refuses_different_bytes() -> None:
    existing = {"name": "x.zip", "id": 1, "browser_download_url": "https://example.invalid/x.zip"}
    with pytest.raises(ReleaseError, match="already published with different bytes"):
        mcp_release.decide("x.zip", b"new", existing, overwrite=False, fetch=lambda url: b"old")


def test_decide_refuses_when_the_published_bytes_cannot_be_read() -> None:
    """Undecidable is treated as different. A panel may already have pinned those
    bytes, and "the download failed" is not evidence that it has not."""
    existing = {"name": "x.zip", "id": 1, "browser_download_url": "https://example.invalid/x.zip"}

    def fetch(url: str) -> bytes:
        raise urllib.error.URLError("connection reset")

    with pytest.raises(ReleaseError, match="could not be read back"):
        mcp_release.decide("x.zip", b"new", existing, overwrite=False, fetch=fetch)


def test_decide_refuses_an_asset_with_no_download_url() -> None:
    with pytest.raises(ReleaseError, match="cannot read it back"):
        mcp_release.decide("x.zip", b"new", {"name": "x.zip", "id": 1}, overwrite=False, fetch=_boom)


def test_decide_replaces_under_overwrite_without_reading_anything() -> None:
    existing = {"name": "x.zip", "id": 1, "browser_download_url": "https://example.invalid/x.zip"}
    assert mcp_release.decide("x.zip", b"new", existing, overwrite=True, fetch=_boom) == "replace"


def _boom(url: str) -> bytes:
    raise AssertionError("no asset should have been fetched")


# ---------- the whole publish ----------


def test_sync_creates_the_release_and_uploads_five_assets(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path)
    fake = FakeAPI(None)

    result = mcp_release.sync_runtime_release(
        tmp_path, VERSION, REVISION_A, api_fn=fake, fetch_fn=_boom
    )

    assert result == {
        "tag": TAG, "version": VERSION, "revision": REVISION_A,
        "created": True, "uploaded": 5, "replaced": 0, "kept": 0,
    }
    # Upload order is the contract: the envelope a panel reads first is written
    # last, so an interrupted publish has no metadata rather than metadata whose
    # artifacts are missing.
    assert fake.uploads() == list(mcp_release.ASSET_NAMES)
    assert fake.uploads()[-2:] == list(mcp_release.ENVELOPE_ASSETS)
    assert fake.deletes() == []
    assert set(bodies) == set(mcp_release.ASSET_NAMES)


def test_sync_is_a_no_op_when_everything_is_already_published(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path)
    fake = FakeAPI(_published(bodies))

    result = mcp_release.sync_runtime_release(
        tmp_path, VERSION, REVISION_A, api_fn=fake, fetch_fn=_fetch_from(bodies)
    )

    assert result["kept"] == 5
    assert result["created"] is False
    assert fake.uploads() == []
    assert fake.deletes() == []
    # An existing release is reused, never recreated.
    assert ("POST", "/releases") not in fake.calls


def test_sync_uploads_only_what_is_missing(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path)
    already = ("service-linux-amd64.zip", "tend-mcp-ui.zip")
    fake = FakeAPI(_published(bodies, only=already))

    result = mcp_release.sync_runtime_release(
        tmp_path, VERSION, REVISION_A, api_fn=fake, fetch_fn=_fetch_from(bodies)
    )

    assert result["kept"] == 2
    assert result["uploaded"] == 3
    assert sorted(fake.uploads()) == sorted(set(mcp_release.ASSET_NAMES) - set(already))
    assert fake.deletes() == []


def test_sync_refuses_a_changed_asset_before_writing_anything(tmp_path: Path) -> None:
    """The refusal has to come before the first upload, or a half-replaced
    release is what an operator is left to clean up."""
    bodies = write_release_dir(tmp_path)
    stale = dict(bodies)
    stale["service-linux-arm64.zip"] = b"the bytes a panel already pinned"
    fake = FakeAPI(_published(bodies))

    with pytest.raises(ReleaseError, match="already published with different bytes"):
        mcp_release.sync_runtime_release(
            tmp_path, VERSION, REVISION_A, api_fn=fake, fetch_fn=_fetch_from(stale)
        )

    assert fake.uploads() == []
    assert fake.deletes() == []


def test_sync_replaces_everything_under_overwrite(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path)
    fake = FakeAPI(_published(bodies))

    result = mcp_release.sync_runtime_release(
        tmp_path, VERSION, REVISION_A, overwrite=True, api_fn=fake, fetch_fn=_boom
    )

    assert result["replaced"] == 5
    assert result["kept"] == 0
    assert len(fake.deletes()) == 5
    assert sorted(fake.uploads()) == sorted(mcp_release.ASSET_NAMES)


def test_sync_touches_no_other_release(tmp_path: Path) -> None:
    """Every endpoint this tool calls names either its own tag, its own release's
    assets, or the upload url that release handed back."""
    bodies = write_release_dir(tmp_path)
    fake = FakeAPI(None)
    mcp_release.sync_runtime_release(tmp_path, VERSION, REVISION_A, api_fn=fake, fetch_fn=_boom)

    for method, path in fake.calls:
        assert (
            path == f"/releases/tags/{TAG}"
            or path == "/releases"
            or path.startswith(UPLOAD_URL.split("{")[0])
            or path.startswith("/releases/assets/")
        ), (method, path)
    assert not any("registry-" in path for _, path in fake.calls)


@pytest.mark.parametrize("version", ["1", "1.2", "v1.2.3", "1.2.3-rc1", "01.2.3", ""])
def test_sync_refuses_a_non_canonical_version(tmp_path: Path, version: str) -> None:
    write_release_dir(tmp_path)
    with pytest.raises(ReleaseError, match="version must be x.y.z"):
        mcp_release.sync_runtime_release(tmp_path, version, REVISION_A, api_fn=_no_api)


def test_sync_refuses_a_revision_that_is_not_a_full_sha(tmp_path: Path) -> None:
    write_release_dir(tmp_path)
    with pytest.raises(ReleaseError, match="40-hex"):
        mcp_release.sync_runtime_release(tmp_path, VERSION, "abc1234", api_fn=_no_api)


def _no_api(*args, **kwargs):
    raise AssertionError("no API call should have been made")


def test_tag_for_is_the_download_path_a_panel_pins() -> None:
    assert mcp_release.tag_for("0.1.0") == "mcp-runtime-0.1.0"
