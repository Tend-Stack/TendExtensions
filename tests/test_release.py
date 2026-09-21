from __future__ import annotations

import json
import urllib.error
from pathlib import Path

import pytest
from conftest import REVISION_A

from tools import release


def _http_error(code: int) -> urllib.error.HTTPError:
    return urllib.error.HTTPError("https://api.github.com/repos/x", code, "boom", {}, None)


@pytest.mark.parametrize(
    "code,expect_permanent",
    [(401, True), (403, True), (404, True), (422, True), (502, False), (503, False)],
)
def test_classify_failure_http_status(code: int, expect_permanent: bool) -> None:
    message, permanent = release.classify_failure(_http_error(code))
    assert isinstance(message, str) and message
    assert permanent is expect_permanent


def test_classify_failure_transport_error_is_transient() -> None:
    message, permanent = release.classify_failure(urllib.error.URLError("connection reset"))
    assert permanent is False
    assert "transport" in message


def test_api_refuses_unexpected_host() -> None:
    with pytest.raises(release.ReleaseError, match="unexpected endpoint"):
        release.api("https://evil.example.com/steal")


def _write_dist(dist_dir: Path) -> None:
    dist_dir.mkdir(parents=True, exist_ok=True)
    (dist_dir / "host.tend.fixture-1.0.0.zip").write_bytes(b"pretend zip bytes")
    (dist_dir / "registry.json").write_text(json.dumps({"schema": 1, "sequence": 5}), encoding="utf-8")
    (dist_dir / "tend-extension-registry-v1.json").write_text(json.dumps({"schema": 1}), encoding="utf-8")


def test_sync_release_creates_when_no_existing_release(tmp_path: Path) -> None:
    dist_dir = tmp_path / "dist"
    _write_dist(dist_dir)
    calls: list[tuple[str, str]] = []

    def fake_api(path: str, *, method: str = "GET", payload=None, binary=None):
        calls.append((method, path))
        if method == "GET" and path == "/releases/tags/registry-5":
            raise urllib.error.HTTPError(path, 404, "not found", {}, None)
        if method == "POST" and path == "/releases":
            assert payload["tag_name"] == "registry-5"
            assert payload["target_commitish"] == REVISION_A
            return {"upload_url": "https://uploads.github.com/repos/Tend-Stack/TendExtensions/releases/1/assets{?name,label}", "assets": []}
        if method == "POST" and path.startswith("https://uploads.github.com/"):
            return {"id": 1, "name": path.split("name=")[1]}
        raise AssertionError(f"unexpected call: {method} {path}")

    result = release.sync_release(dist_dir, 5, REVISION_A, api_fn=fake_api)

    assert result == {"tag": "registry-5", "sequence": 5, "revision": REVISION_A, "asset_count": 3}
    upload_calls = [p for m, p in calls if m == "POST" and p.startswith("https://uploads.github.com/")]
    assert len(upload_calls) == 3
    delete_calls = [p for m, p in calls if m == "DELETE"]
    assert delete_calls == []


def test_sync_release_replaces_existing_assets(tmp_path: Path) -> None:
    dist_dir = tmp_path / "dist"
    _write_dist(dist_dir)
    calls: list[tuple[str, str]] = []

    existing_release = {
        "upload_url": "https://uploads.github.com/repos/Tend-Stack/TendExtensions/releases/9/assets{?name,label}",
        "assets": [
            {"name": "registry.json", "id": 111},
            {"name": "tend-extension-registry-v1.json", "id": 222},
            {"name": "host.tend.fixture-1.0.0.zip", "id": 333},
        ],
    }

    def fake_api(path: str, *, method: str = "GET", payload=None, binary=None):
        calls.append((method, path))
        if method == "GET" and path == "/releases/tags/registry-5":
            return existing_release
        if method == "DELETE":
            return {}
        if method == "POST" and path.startswith("https://uploads.github.com/"):
            return {"id": 999, "name": path.split("name=")[1]}
        raise AssertionError(f"unexpected call: {method} {path}")

    release.sync_release(dist_dir, 5, REVISION_A, api_fn=fake_api)

    delete_calls = sorted(p for m, p in calls if m == "DELETE")
    assert delete_calls == [
        "/releases/assets/111",
        "/releases/assets/222",
        "/releases/assets/333",
    ]
    upload_calls = [p for m, p in calls if m == "POST" and p.startswith("https://uploads.github.com/")]
    assert len(upload_calls) == 3
    # No second POST /releases — an existing release is reused, not recreated.
    assert ("POST", "/releases") not in calls


def test_sync_release_rejects_short_revision(tmp_path: Path) -> None:
    dist_dir = tmp_path / "dist"
    _write_dist(dist_dir)
    with pytest.raises(release.ReleaseError, match="40-hex"):
        release.sync_release(dist_dir, 5, "not-a-sha", api_fn=lambda *a, **k: {})


def test_dist_assets_requires_all_three_kinds(tmp_path: Path) -> None:
    dist_dir = tmp_path / "dist"
    dist_dir.mkdir()
    (dist_dir / "only.zip").write_bytes(b"x")
    with pytest.raises(release.ReleaseError, match="missing expected"):
        release.dist_assets(dist_dir)
