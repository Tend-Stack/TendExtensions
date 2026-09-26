"""The moving alias release and the release tool's dry run.

The version release is tested in test_mcp_release.py. What is tested here is the
part that is *meant* to change: `mcp-runtime-latest` carries whichever runtime was
published last, so its only protection is the sequence in the envelope it already
serves — and the dry run, which is how the whole decision is inspected before a
signing key is ever involved.
"""
from __future__ import annotations

import json
import urllib.error
from pathlib import Path

import pytest
from conftest import REVISION_A
from test_mcp_release import TAG, VERSION, _boom, _digest, _fetch_from, write_release_dir

from tools import mcp_release, mcp_window
from tools.release import ReleaseError

ALIAS_TAG = mcp_window.ALIAS_TAG
ALIAS_UPLOAD_URL = (
    "https://uploads.github.com/repos/Tend-Stack/TendExtensions/releases/9/assets{?name,label}"
)


class FakeAliasAPI:
    """A GitHub API serving the alias release, recording every call."""

    def __init__(self, release: dict | None):
        self.release = release
        self.calls: list[tuple[str, str]] = []
        self.bodies: list[str] = []

    def __call__(self, path: str, *, method: str = "GET", payload=None, binary=None):
        self.calls.append((method, path))
        if method == "GET" and path == f"/releases/tags/{ALIAS_TAG}":
            if self.release is None:
                raise urllib.error.HTTPError(path, 404, "not found", {}, None)
            return self.release
        if method == "POST" and path == "/releases":
            assert payload["tag_name"] == ALIAS_TAG
            assert payload["make_latest"] == "false"
            self.bodies.append(payload["body"])
            self.release = {"id": 9, "upload_url": ALIAS_UPLOAD_URL, "assets": []}
            return self.release
        if method == "PATCH" and path == "/releases/9":
            self.bodies.append(payload["body"])
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
        return [p for m, p in self.calls if m == "DELETE"]


def _alias_published(bodies: dict[str, bytes]) -> dict:
    return {
        "id": 9,
        "upload_url": ALIAS_UPLOAD_URL,
        "assets": [
            {
                "name": name,
                "id": 200 + index,
                "browser_download_url": f"https://example.invalid/{name}",
            }
            for index, name in enumerate(bodies)
        ],
    }


def test_alias_tag_is_the_one_a_consumer_pins() -> None:
    assert ALIAS_TAG == "mcp-runtime-latest"


def test_alias_is_created_and_carries_all_five_assets(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path)
    fake = FakeAliasAPI(None)

    result = mcp_release.sync_alias_release(bodies, VERSION, REVISION_A, api_fn=fake, fetch_fn=_boom)

    assert result["tag"] == ALIAS_TAG
    assert result["created"] is True
    assert (result["uploaded"], result["replaced"], result["kept"]) == (5, 0, 0)
    assert result["previous_sequence"] == 0
    assert result["sequence"] == mcp_window.sequence_of(VERSION)
    # Envelopes last, as in a version release: a half-moved alias must look like
    # the old runtime, never like one whose artifacts are missing.
    assert fake.uploads() == list(mcp_release.ASSET_NAMES)
    assert "moving alias release" in fake.bodies[0]


def test_alias_replaces_the_assets_of_the_runtime_it_leaves_behind(tmp_path: Path) -> None:
    """Asset replacement: an alias asset whose bytes differ is deleted and
    re-uploaded once, in the contract's order, with no refusal — the alias is the
    one release here that is meant to move. An asset that did not change is kept.
    """
    previous = write_release_dir(tmp_path / "previous", version="0.1.0")
    newer_dir = tmp_path / "newer"
    newer = write_release_dir(newer_dir, version="0.1.1", salt=b" rebuilt")
    # The browser package did not change between the two builds.
    (newer_dir / "tend-mcp-ui.zip").write_bytes(previous["tend-mcp-ui.zip"])
    newer = mcp_release.collect_assets(newer_dir)
    # ... and the envelopes still describe this build, digest for digest.
    mcp_release.check_envelopes(newer, "0.1.1")

    fake = FakeAliasAPI(_alias_published(previous))
    result = mcp_release.sync_alias_release(
        newer, "0.1.1", REVISION_A, api_fn=fake, fetch_fn=_fetch_from(previous)
    )

    assert result["created"] is False
    assert (result["kept"], result["replaced"], result["uploaded"]) == (1, 4, 0)
    assert result["previous_sequence"] == mcp_window.sequence_of("0.1.0")
    assert len(fake.deletes()) == 4
    assert fake.uploads() == [n for n in mcp_release.ASSET_NAMES if n != "tend-mcp-ui.zip"]
    assert fake.uploads()[-2:] == list(mcp_release.ENVELOPE_ASSETS)
    # The body is re-described for the runtime the alias now serves.
    assert ("PATCH", "/releases/9") in fake.calls
    assert "0.1.1" in fake.bodies[-1]


def test_alias_refuses_to_move_backwards(tmp_path: Path) -> None:
    published = write_release_dir(tmp_path / "published", version="0.2.0")
    older = write_release_dir(tmp_path / "older", version="0.1.9")
    fake = FakeAliasAPI(_alias_published(published))

    with pytest.raises(ReleaseError, match="would move it backwards"):
        mcp_release.sync_alias_release(
            older, "0.1.9", REVISION_A, api_fn=fake, fetch_fn=_fetch_from(published)
        )

    assert fake.uploads() == [] and fake.deletes() == []


def test_alias_refuses_the_sequence_it_already_serves(tmp_path: Path) -> None:
    """Equal is refused as well as lower. A panel keeps a durable sequence floor
    and rejects an envelope at or below it, so re-publishing the same version under
    the alias changes nothing a panel would accept while resetting its expiry."""
    bodies = write_release_dir(tmp_path)
    fake = FakeAliasAPI(_alias_published(bodies))

    with pytest.raises(ReleaseError, match="already serves sequence"):
        mcp_release.sync_alias_release(
            bodies, VERSION, REVISION_A, api_fn=fake, fetch_fn=_fetch_from(bodies)
        )

    assert fake.uploads() == [] and fake.deletes() == []


def test_alias_refuses_when_the_sequence_it_serves_cannot_be_read(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path, version="0.9.9")
    fake = FakeAliasAPI(_alias_published(bodies))

    def fetch(url: str) -> bytes:
        raise urllib.error.URLError("connection reset")

    with pytest.raises(ReleaseError, match="refusing to move the alias"):
        mcp_release.sync_alias_release(bodies, "0.9.9", REVISION_A, api_fn=fake, fetch_fn=fetch)

    assert fake.uploads() == [] and fake.deletes() == []


def test_alias_sequence_climbs_across_a_chain_of_publishes(tmp_path: Path) -> None:
    """Monotonicity end to end: each publish reads the alias envelope it is
    replacing and every accepted publish has a strictly greater sequence."""
    sequences: list[int] = []
    published = None
    for index, version in enumerate(["0.1.0", "0.1.1", "0.2.0", "1.0.0"]):
        assets = write_release_dir(tmp_path / f"build-{index}", version=version)
        fake = FakeAliasAPI(None if published is None else _alias_published(published))
        fetch = _boom if published is None else _fetch_from(published)
        result = mcp_release.sync_alias_release(
            assets, version, REVISION_A, api_fn=fake, fetch_fn=fetch
        )
        sequences.append(result["sequence"])
        published = assets
    assert sequences == sorted(set(sequences))


def test_alias_touches_no_release_but_its_own(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path)
    fake = FakeAliasAPI(None)
    mcp_release.sync_alias_release(bodies, VERSION, REVISION_A, api_fn=fake, fetch_fn=_boom)

    for method, path in fake.calls:
        assert (
            path == f"/releases/tags/{ALIAS_TAG}"
            or path in ("/releases", "/releases/9")
            or path.startswith(ALIAS_UPLOAD_URL.split("{")[0])
            or path.startswith("/releases/assets/")
        ), (method, path)
    assert not any(TAG in path for _, path in fake.calls)


def test_release_body_records_the_window_and_the_key(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path)
    body = mcp_release.release_body(
        VERSION, REVISION_A, alias=True, note_lines=mcp_release.envelope_notes(bodies)
    )
    assert "0.6.0 to 0.9.0" in body
    assert f"Release sequence: {mcp_window.sequence_of(VERSION)}" in body
    assert mcp_release.EXPECTED_KEY_ID in body
    assert REVISION_A in body


def test_decide_alias_keeps_identical_replaces_everything_else() -> None:
    """The per-asset decision, on its own. Unlike a version release, an alias asset
    that cannot be read back is a replace rather than a refusal: the sequence has
    already established that this build is newer, so the worst case is re-uploading
    bytes that were already correct."""
    existing = {"name": "x.zip", "id": 1, "browser_download_url": "https://example.invalid/x.zip"}
    assert mcp_release.decide_alias("x.zip", b"same", existing, fetch=lambda url: b"same") == "keep"
    assert mcp_release.decide_alias("x.zip", b"new", existing, fetch=lambda url: b"old") == "replace"
    assert mcp_release.decide_alias("x.zip", b"new", None, fetch=_boom) == "upload"
    assert mcp_release.decide_alias("x.zip", b"new", {"name": "x.zip", "id": 1}, fetch=_boom) == "replace"

    def offline(url: str) -> bytes:
        raise urllib.error.URLError("connection reset")

    assert mcp_release.decide_alias("x.zip", b"new", existing, fetch=offline) == "replace"


# ---------- the dry run ----------


def test_dry_run_writes_the_plan_and_the_envelopes_and_calls_nothing(tmp_path: Path) -> None:
    bodies = write_release_dir(tmp_path / "dist")
    out = tmp_path / "out"

    plan = mcp_release.dry_run(tmp_path / "dist", VERSION, REVISION_A, out)

    assert json.loads((out / "plan.json").read_text(encoding="utf-8")) == plan
    assert plan["dry_run"] is True
    assert plan["tag"] == TAG and plan["alias_tag"] == ALIAS_TAG
    assert plan["sequence"] == mcp_window.sequence_of(VERSION)
    assert plan["alias_version"] is None and plan["alias_sequence"] == 0
    assert set(plan["assets"]) == set(mcp_release.ASSET_NAMES)
    for name in mcp_release.ENVELOPE_ASSETS:
        assert (out / name).read_bytes() == bodies[name]
        assert plan["assets"][name] == _digest(bodies[name])


def test_dry_run_checks_the_sequence_against_an_alias_envelope_file(tmp_path: Path) -> None:
    newer = write_release_dir(tmp_path / "dist", version="0.2.0")
    current = write_release_dir(tmp_path / "alias", version="0.1.4")

    plan = mcp_release.dry_run(
        tmp_path / "dist",
        "0.2.0",
        REVISION_A,
        tmp_path / "out",
        alias_envelope=current["runtime-linux-amd64.json"],
    )
    assert plan["alias_version"] == "0.1.4"
    assert plan["sequence"] > plan["alias_sequence"]

    with pytest.raises(ReleaseError, match="does not exceed"):
        mcp_release.dry_run(
            tmp_path / "alias",
            "0.1.4",
            REVISION_A,
            tmp_path / "out2",
            alias_envelope=newer["runtime-linux-amd64.json"],
        )


def test_dry_run_refuses_envelopes_that_do_not_match_the_build(tmp_path: Path) -> None:
    write_release_dir(tmp_path / "dist", break_field="service_sha256")
    with pytest.raises(ReleaseError, match="service_sha256"):
        mcp_release.dry_run(tmp_path / "dist", VERSION, REVISION_A, tmp_path / "out")


def test_main_dry_run_needs_no_network_and_no_token(tmp_path: Path, capsys) -> None:
    write_release_dir(tmp_path / "dist")
    out = tmp_path / "out"

    code = mcp_release.main(
        [
            "--version", VERSION,
            "--revision", REVISION_A,
            "--dist", str(tmp_path / "dist"),
            "--dry-run-out", str(out),
        ]
    )

    assert code == 0
    assert "dry run: would publish" in capsys.readouterr().out
    assert (out / "plan.json").is_file()


def test_main_refuses_a_plan_that_resolved_another_version(tmp_path: Path, capsys) -> None:
    """The plan and the build must agree. A plan resolved for one version and a
    build made for another is how a release gets signed for the wrong core window.
    """
    write_release_dir(tmp_path / "dist")
    plan_file = tmp_path / "plan.json"
    plan_file.write_text(json.dumps({"runtime_version": "0.9.9", "release_notes": []}))

    code = mcp_release.main(
        [
            "--version", VERSION,
            "--revision", REVISION_A,
            "--dist", str(tmp_path / "dist"),
            "--plan", str(plan_file),
            "--dry-run-out", str(tmp_path / "out"),
        ]
    )

    assert code == 1
    assert "not the '0.1.0' being published" in capsys.readouterr().err


def test_main_carries_the_plan_notes_into_the_release_body(tmp_path: Path) -> None:
    write_release_dir(tmp_path / "dist")
    plan_file = tmp_path / "plan.json"
    plan_file.write_text(
        json.dumps(
            {
                "runtime_version": VERSION,
                "release_notes": ["MANUAL OVERRIDE: max_core_version was set by hand.", "x" * 500],
            }
        )
    )

    code = mcp_release.main(
        [
            "--version", VERSION,
            "--revision", REVISION_A,
            "--dist", str(tmp_path / "dist"),
            "--plan", str(plan_file),
            "--dry-run-out", str(tmp_path / "out"),
        ]
    )

    assert code == 0
    plan = json.loads((tmp_path / "out" / "plan.json").read_text(encoding="utf-8"))
    assert "MANUAL OVERRIDE: max_core_version was set by hand." in plan["notes"]
    # An implausibly long line from the plan file is dropped rather than pasted
    # into a release body.
    assert not any(len(note) > 400 for note in plan["notes"])
