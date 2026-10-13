"""The window, the version and the sequence a runtime publish resolves.

Everything here used to be typed into a workflow dispatch by hand, which is why
the tests are mostly about refusals: a window derived from the wrong files, a
version that does not climb, or a publish that follows no core release are all
mistakes a human made silently before.
"""
from __future__ import annotations

import json
import urllib.error
from pathlib import Path

import pytest

from tools import mcp_window
from tools.mcp_window import MCP_CORE_FLOOR, ReleaseError


def write_core(
    root: Path,
    *,
    version: str = "0.9.0",
    compatibility_version: str | None = None,
    minimum_direct_upgrade_from: str | None = "0.1.0",
    mcp_min_core_version: str | None = None,
    compatibility: dict | None = None,
) -> Path:
    """A fixture core tree: the two files the window is derived from."""
    root.mkdir(parents=True, exist_ok=True)
    (root / "VERSION").write_text(version + "\n", encoding="utf-8")
    if compatibility is None:
        compatibility = {
            "schema": 1,
            "version": compatibility_version or version,
            "required_checkpoint": None,
        }
        if minimum_direct_upgrade_from is not None:
            compatibility["minimum_direct_upgrade_from"] = minimum_direct_upgrade_from
        if mcp_min_core_version is not None:
            compatibility["mcp_min_core_version"] = mcp_min_core_version
    (root / "RELEASE_COMPATIBILITY.json").write_text(
        json.dumps(compatibility, indent=2) + "\n", encoding="utf-8"
    )
    return root


def envelope_bytes(
    version: str,
    *,
    max_core: str = "0.9.0",
    min_core: str = "0.6.0",
    capabilities: list[str] | None = None,
) -> bytes:
    payload = {
        "version": version,
        "sequence": mcp_window.sequence_of(version),
        "min_core_version": min_core,
        "max_core_version": max_core,
    }
    if capabilities is not None:
        payload["capabilities"] = capabilities
    return json.dumps(
        {"schema": 1, "key_id": "17949d0c35c1eb4d", "payload": payload, "signature": "x"}
    ).encode("utf-8")


def alias_at(
    version: str, *, max_core: str = "0.9.0", capabilities: list[str] | None = None
) -> mcp_window.AliasState:
    return mcp_window.alias_state(envelope_bytes(version, max_core=max_core, capabilities=capabilities))


DIGEST_A = "a" * 64
DIGEST_B = "b" * 64
COMMIT = "c" * 40


def inputs_bytes(digest: str = DIGEST_A, capabilities: list[str] | None = None) -> bytes:
    return json.dumps(
        {"schema": 1, "inputs_digest": digest, "files": 9, "capabilities": capabilities or ["mcp.a.read"]}
    ).encode("utf-8")


def published_bytes(digest: str = DIGEST_A) -> bytes:
    return json.dumps(
        {
            "schema": 1,
            "inputs_digest": digest,
            "core_commit": COMMIT,
            "core_version": "0.9.0",
            "capabilities": ["mcp.a.read"],
        }
    ).encode("utf-8")


# ---------- the sequence rule ----------


@pytest.mark.parametrize(
    "version,sequence",
    [
        ("0.0.1", 1),
        ("0.1.0", 1_000_000),
        ("0.1.1", 1_000_001),
        ("0.9.0", 9_000_000),
        ("1.0.0", 1_000_000_000_000),
        ("1.2.3", 1_000_002_000_003),
    ],
)
def test_sequence_is_the_one_the_core_derives(version: str, sequence: int) -> None:
    """The same arithmetic as internal/mcp/release.SequenceOf. The core refuses an
    envelope whose sequence is anything else, at signing time and at verification
    time, which is why the sequence can be neither a timestamp nor previous+1."""
    assert mcp_window.sequence_of(version) == sequence


def test_a_chain_of_patch_bumps_is_strictly_monotonic() -> None:
    version = "0.1.0"
    sequences = [mcp_window.sequence_of(version)]
    for _ in range(5):
        version = mcp_window.bump_patch(version)
        sequences.append(mcp_window.sequence_of(version))
    assert version == "0.1.5"
    assert sequences == sorted(sequences)
    assert len(set(sequences)) == len(sequences)


@pytest.mark.parametrize(
    "ordered",
    [["0.1.0", "0.1.1", "0.2.0", "0.10.0", "1.0.0"], ["0.6.0", "0.6.1", "0.7.0"]],
)
def test_version_order_is_sequence_order(ordered: list[str]) -> None:
    sequences = [mcp_window.sequence_of(v) for v in ordered]
    assert sequences == sorted(sequences)
    assert len(set(sequences)) == len(sequences)


def test_sequence_must_exceed_the_one_the_alias_serves() -> None:
    alias = alias_at("0.1.4")
    assert mcp_window.check_sequence_increases("0.1.5", alias) == mcp_window.sequence_of("0.1.5")
    assert mcp_window.check_sequence_increases("0.2.0", alias) > alias.sequence
    for refused in ("0.1.4", "0.1.3", "0.0.9"):
        with pytest.raises(ReleaseError, match="does not exceed"):
            mcp_window.check_sequence_increases(refused, alias)


def test_the_first_publish_has_no_floor_to_climb() -> None:
    assert mcp_window.check_sequence_increases("0.1.0", None) == 1_000_000


@pytest.mark.parametrize("bad", ["1", "1.2", "v1.2.3", "1.2.3-rc1", "01.2.3", "", None])
def test_a_version_must_be_canonical(bad) -> None:
    with pytest.raises(ReleaseError, match="version must be x.y.z"):
        mcp_window.sequence_of(bad)


def test_bump_refuses_to_run_out_of_patches() -> None:
    with pytest.raises(ReleaseError, match="cannot bump the patch"):
        mcp_window.bump_patch("0.1.999999")


# ---------- the window rule ----------


def test_open_ceiling(tmp_path: Path) -> None:
    """The window ends at `<major>.999999.999999`, whatever the core version is: the worker's
    compatibility is decided by its inputs and capabilities, not by the core release number.
    RELEASE_COMPATIBILITY.json allows a direct upgrade from 0.1.0, below the first core that can
    verify an envelope at all, so the MCP floor is what the window starts at."""
    core = write_core(tmp_path, version="0.9.0", minimum_direct_upgrade_from="0.1.0")
    window = mcp_window.read_core_window(core)
    assert window.max_core_version == "0.999999.999999"
    assert mcp_window.sequence_of(window.max_core_version) > mcp_window.sequence_of("0.11.9")
    assert mcp_window.parse_version(window.max_core_version) == (0, 999999, 999999)
    assert window.min_core_version == MCP_CORE_FLOOR == "0.6.0"
    assert window.min_source == "mcp_core_floor"
    assert window.max_overridden is False
    assert window.core_version == "0.9.0"


def test_min_rises_with_the_cores_own_upgrade_floor(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="1.2.0", minimum_direct_upgrade_from="0.8.0")
    window = mcp_window.read_core_window(core)
    assert (window.min_core_version, window.max_core_version) == ("0.8.0", "1.999999.999999")
    assert window.min_source == "minimum_direct_upgrade_from"


def test_the_core_may_state_the_mcp_minimum_itself(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="1.0.0", mcp_min_core_version="0.7.0")
    window = mcp_window.read_core_window(core)
    assert (window.min_core_version, window.max_core_version) == ("0.7.0", "1.999999.999999")
    assert window.min_source == "mcp_min_core_version"


def test_a_stated_minimum_below_the_mcp_floor_is_refused(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="1.0.0", mcp_min_core_version="0.3.0")
    with pytest.raises(ReleaseError, match="below the MCP floor"):
        mcp_window.read_core_window(core)


def test_min_is_version_when_capabilities_grow(tmp_path: Path) -> None:
    """An older core refuses a capability it does not know, so a runtime that grew its
    capability list starts at the core that declares it; the same or a smaller list keeps
    the derived minimum."""
    core = write_core(tmp_path, version="0.12.0", minimum_direct_upgrade_from="0.1.0")
    alias = alias_at("0.1.40", capabilities=["mcp.a.read", "mcp.b.read"])

    same = mcp_window.read_core_window(core, capabilities=("mcp.b.read",), alias=alias)
    assert (same.min_core_version, same.min_source) == (MCP_CORE_FLOOR, "mcp_core_floor")

    grown = mcp_window.read_core_window(core, capabilities=("mcp.a.read", "mcp.c.read"), alias=alias)
    assert (grown.min_core_version, grown.min_source) == ("0.12.0", "core_version_capabilities_grew")
    assert grown.max_core_version == "0.999999.999999"

    # Nothing to compare with (first publish, or an envelope that lists none): the derived minimum stands.
    assert mcp_window.read_core_window(core, capabilities=("mcp.z.read",), alias=None).min_core_version == MCP_CORE_FLOOR
    assert (
        mcp_window.read_core_window(core, capabilities=("mcp.z.read",), alias=alias_at("0.1.40")).min_core_version
        == MCP_CORE_FLOOR
    )


def test_the_max_override_is_recorded_as_an_override(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="0.9.0")
    window = mcp_window.read_core_window(core, max_core_override="1.4.0")
    assert window.max_core_version == "1.4.0"
    assert window.core_version == "0.9.0"
    assert window.max_overridden is True

    plan = mcp_window.build_plan(
        core, requested_version="0.2.0", max_core_override="1.4.0", alias=alias_at("0.1.0")
    )
    notes = plan.release_note_lines()
    assert any("MANUAL OVERRIDE" in line for line in notes)
    assert any("1.4.0" in line for line in notes)


def test_an_override_below_the_minimum_is_an_empty_window(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="0.9.0", minimum_direct_upgrade_from="0.8.0")
    with pytest.raises(ReleaseError, match="the derived window is empty"):
        mcp_window.read_core_window(core, max_core_override="0.7.0")


@pytest.mark.parametrize("missing", ["VERSION", "RELEASE_COMPATIBILITY.json"])
def test_a_core_checkout_missing_either_file_is_refused(tmp_path: Path, missing: str) -> None:
    core = write_core(tmp_path)
    (core / missing).unlink()
    with pytest.raises(ReleaseError, match="cannot read"):
        mcp_window.read_core_window(core)


def test_a_compatibility_file_without_the_fields_is_refused(tmp_path: Path) -> None:
    core = write_core(tmp_path, minimum_direct_upgrade_from=None)
    with pytest.raises(ReleaseError, match="minimum_direct_upgrade_from"):
        mcp_window.read_core_window(core)

    core = write_core(tmp_path / "two", compatibility={"schema": 1})
    with pytest.raises(ReleaseError, match="carries no version string"):
        mcp_window.read_core_window(core)

    (tmp_path / "three").mkdir()
    (tmp_path / "three" / "VERSION").write_text("0.9.0\n")
    (tmp_path / "three" / "RELEASE_COMPATIBILITY.json").write_text("{not json")
    with pytest.raises(ReleaseError, match="not valid JSON"):
        mcp_window.read_core_window(tmp_path / "three")


# ---------- the version default ----------


def test_the_default_version_is_the_alias_patch_bump(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="1.0.0")
    plan = mcp_window.build_plan(core, alias=alias_at("0.1.4"))
    assert plan.runtime_version == "0.1.5"
    assert plan.version_source == "patch_bump_of_alias"
    assert plan.sequence == mcp_window.sequence_of("0.1.5")


def test_a_requested_version_wins_and_is_recorded(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="1.0.0")
    plan = mcp_window.build_plan(core, requested_version="0.2.0", alias=alias_at("0.1.4"))
    assert (plan.runtime_version, plan.version_source) == ("0.2.0", "requested")


def test_the_first_publish_must_name_its_version(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="0.9.0")
    with pytest.raises(ReleaseError, match="no alias has been published yet"):
        mcp_window.build_plan(core, alias=None)
    plan = mcp_window.build_plan(core, requested_version="0.1.0", alias=None)
    assert plan.runtime_version == "0.1.0"


# ---------- the release-commit guard ----------


def test_guard_refuses_equal_inputs_digest(tmp_path: Path) -> None:
    """The guard the automation needs: dispatched for a commit whose runtime inputs are what is
    already published, the run would replace a working alias with an envelope that adds nothing and
    burns a sequence. The core version is irrelevant: only the inputs digest decides."""
    core = write_core(tmp_path, version="0.9.0")
    alias = alias_at("0.1.4", max_core="0.9.0")
    inputs = mcp_window.parse_inputs(inputs_bytes(DIGEST_A))
    same = mcp_window.published_inputs_state(published_bytes(DIGEST_A))
    with pytest.raises(ReleaseError, match="runtime inputs are unchanged since cccccccccccc"):
        mcp_window.build_plan(core, alias=alias, inputs=inputs, published=same)

    plan = mcp_window.build_plan(core, alias=alias, inputs=inputs, published=same, force=True)
    assert plan.runtime_version == "0.1.5"
    assert any("FORCED" in line for line in plan.release_note_lines())

    # A changed digest publishes even though the core version did not move, with no escape.
    other = mcp_window.published_inputs_state(published_bytes(DIGEST_B))
    plan = mcp_window.build_plan(core, alias=alias, inputs=inputs, published=other)
    assert plan.force is False and plan.notes == []
    assert any(DIGEST_A in line for line in plan.release_note_lines())
    # No published record (a release from before the record existed): nothing to compare, so it publishes.
    assert mcp_window.build_plan(core, alias=alias, inputs=inputs, published=None).force is False


def test_a_max_override_that_narrows_the_alias_window_is_refused(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="0.8.0")
    alias = alias_at("0.1.4", max_core="0.9.0")
    with pytest.raises(ReleaseError, match="would narrow"):
        mcp_window.build_plan(core, alias=alias, max_core_override="0.8.0")
    assert mcp_window.build_plan(
        core, alias=alias, max_core_override="0.8.0", force=True
    ).window.max_core_version == "0.8.0"


def test_a_mid_release_core_commit_is_refused(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="1.0.0", compatibility_version="0.9.0")
    with pytest.raises(ReleaseError, match="mid-release"):
        mcp_window.build_plan(core, alias=alias_at("0.1.4"))
    plan = mcp_window.build_plan(core, alias=alias_at("0.1.4"), force=True)
    assert any("mid-release" in line for line in plan.release_note_lines())


def test_a_core_release_above_the_alias_window_needs_no_escape(tmp_path: Path) -> None:
    """A core release past the runtime's old window publishes without a human typing a
    window or forcing anything."""
    core = write_core(tmp_path, version="1.0.0", minimum_direct_upgrade_from="0.1.0")
    plan = mcp_window.build_plan(core, alias=alias_at("0.1.4", max_core="0.9.0"))
    assert plan.force is False and plan.notes == []
    assert (plan.window.min_core_version, plan.window.max_core_version) == ("0.6.0", "1.999999.999999")
    assert plan.runtime_version == "0.1.5"
    assert plan.sequence > alias_at("0.1.4").sequence


# ---------- reading the alias ----------


def test_alias_state_reads_version_sequence_and_window() -> None:
    state = mcp_window.alias_state(envelope_bytes("0.1.4", max_core="1.0.0", min_core="0.7.0"))
    assert state.version == "0.1.4"
    assert state.sequence == mcp_window.sequence_of("0.1.4")
    assert (state.min_core_version, state.max_core_version) == ("0.7.0", "1.0.0")


def test_alias_state_refuses_a_sequence_the_core_would_refuse() -> None:
    body = json.loads(envelope_bytes("0.1.4"))
    body["payload"]["sequence"] = 99
    with pytest.raises(ReleaseError, match="is not the one version"):
        mcp_window.alias_state(json.dumps(body).encode("utf-8"))


@pytest.mark.parametrize(
    "mutate,message",
    [
        (lambda b: b.pop("payload"), "no payload object"),
        (lambda b: b["payload"].pop("version"), "no version"),
        (lambda b: b["payload"].update(sequence=None), "no usable sequence"),
        (lambda b: b["payload"].update(sequence=True), "no usable sequence"),
        (lambda b: b["payload"].pop("max_core_version"), "no core window"),
    ],
)
def test_alias_state_refuses_a_malformed_envelope(mutate, message: str) -> None:
    body = json.loads(envelope_bytes("0.1.4"))
    mutate(body)
    with pytest.raises(ReleaseError, match=message):
        mcp_window.alias_state(json.dumps(body).encode("utf-8"))


def test_alias_state_refuses_bytes_that_are_not_an_envelope() -> None:
    with pytest.raises(ReleaseError, match="not JSON"):
        mcp_window.alias_state(b"not json")
    with pytest.raises(ReleaseError, match="empty or implausibly large"):
        mcp_window.alias_state(b"")


def test_read_alias_treats_only_404_as_a_first_publish() -> None:
    def missing(url: str) -> bytes:
        raise urllib.error.HTTPError(url, 404, "not found", {}, None)

    assert mcp_window.read_alias("https://example.invalid/e.json", fetch=missing) is None

    def broken(url: str) -> bytes:
        raise urllib.error.HTTPError(url, 503, "unavailable", {}, None)

    with pytest.raises(ReleaseError, match="refusing to publish without knowing"):
        mcp_window.read_alias("https://example.invalid/e.json", fetch=broken)

    def offline(url: str) -> bytes:
        raise urllib.error.URLError("no route to host")

    with pytest.raises(ReleaseError, match="refusing to publish without knowing"):
        mcp_window.read_alias("https://example.invalid/e.json", fetch=offline)


def test_read_alias_returns_the_published_state() -> None:
    state = mcp_window.read_alias(
        "https://example.invalid/e.json", fetch=lambda url: envelope_bytes("0.3.1")
    )
    assert state is not None and state.version == "0.3.1"


def test_real_public_alias_reader_recovers_transient_response_before_sequence_check(monkeypatch) -> None:
    from tools import release
    calls = []
    class Response:
        def __enter__(self): return self
        def __exit__(self, *args): pass
        def read(self, count):
            assert count == mcp_window.MAX_ENVELOPE_BYTES + 1
            return envelope_bytes("0.3.1")
    def fetch(request, *, timeout):
        calls.append(True)
        assert request.get_header("Authorization") is None and timeout == 60
        if len(calls) == 1:
            raise urllib.error.HTTPError(request.full_url, 503, "private-token", {}, None)
        return Response()
    monkeypatch.setattr(release.urllib.request, "urlopen", fetch)
    monkeypatch.setattr(release.time, "sleep", lambda seconds: None)
    # read_alias's default bound function uses the actual retrying public fetch.
    state = mcp_window.read_alias("https://example.invalid/e.json")
    assert state.version == "0.3.1" and len(calls) == 2


def test_real_public_alias_reader_stays_fail_closed_after_bounded_exhaustion(monkeypatch) -> None:
    from tools import release
    calls = []
    def fetch(*args, **kwargs):
        calls.append(True)
        raise TimeoutError("private-token")
    monkeypatch.setattr(release.urllib.request, "urlopen", fetch)
    monkeypatch.setattr(release.time, "sleep", lambda seconds: None)
    with pytest.raises(ReleaseError, match="refusing to publish without knowing") as result:
        mcp_window.read_alias("https://example.invalid/e.json")
    assert len(calls) == 3 and "private-token" not in str(result.value)


def test_the_alias_url_is_the_one_a_consumer_pins() -> None:
    assert mcp_window.ALIAS_TAG == "mcp-runtime-latest"
    assert mcp_window.ALIAS_ENVELOPE_URL == (
        "https://github.com/Tend-Stack/TendExtensions/releases/download/"
        "mcp-runtime-latest/runtime-linux-amd64.json"
    )


# ---------- the CLI the workflow calls ----------


def test_cli_prints_the_plan_and_writes_the_env_file(tmp_path: Path, capsys) -> None:
    core = write_core(tmp_path / "core", version="1.0.0")
    alias_file = tmp_path / "alias.json"
    alias_file.write_bytes(envelope_bytes("0.1.4", max_core="0.9.0"))
    env_out = tmp_path / "env"
    json_out = tmp_path / "plan.json"

    code = mcp_window.main(
        [
            "--core", str(core),
            "--alias-envelope", str(alias_file),
            "--env-out", str(env_out),
            "--json-out", str(json_out),
        ]
    )

    assert code == 0
    resolved = json.loads(json_out.read_text(encoding="utf-8"))
    assert resolved["runtime_version"] == "0.1.5"
    assert resolved["min_core_version"] == "0.6.0"
    assert resolved["max_core_version"] == "1.999999.999999"
    assert resolved["sequence"] == mcp_window.sequence_of("0.1.5")
    assert resolved["alias_tag"] == "mcp-runtime-latest"
    assert json.loads(capsys.readouterr().out) == resolved
    env = dict(line.split("=", 1) for line in env_out.read_text().splitlines())
    assert env == {
        "RUNTIME_VERSION": "0.1.5",
        "MIN_CORE_VERSION": "0.6.0",
        "MAX_CORE_VERSION": "1.999999.999999",
        "RUNTIME_SEQUENCE": str(mcp_window.sequence_of("0.1.5")),
    }


def test_cli_refuses_and_writes_nothing_when_a_guard_fails(tmp_path: Path, capsys) -> None:
    core = write_core(tmp_path / "core", version="0.9.0")
    alias_file = tmp_path / "alias.json"
    alias_file.write_bytes(envelope_bytes("0.1.4", max_core="0.9.0"))
    inputs_file = tmp_path / "inputs.json"
    inputs_file.write_bytes(inputs_bytes(DIGEST_A))
    published_file = tmp_path / "published.json"
    published_file.write_bytes(published_bytes(DIGEST_A))
    env_out = tmp_path / "env"
    inputs_out = tmp_path / "out" / "runtime-inputs.json"

    code = mcp_window.main(
        [
            "--core", str(core), "--alias-envelope", str(alias_file),
            "--inputs", str(inputs_file), "--published-inputs", str(published_file),
            "--core-commit", COMMIT, "--inputs-out", str(inputs_out), "--env-out", str(env_out),
        ]
    )

    assert code == 1
    assert "runtime inputs are unchanged" in capsys.readouterr().err
    assert not env_out.exists() and not inputs_out.exists()


def test_cli_writes_the_published_inputs_record(tmp_path: Path, capsys) -> None:
    core = write_core(tmp_path / "core", version="0.9.0")
    alias_file = tmp_path / "alias.json"
    alias_file.write_bytes(envelope_bytes("0.1.4", max_core="0.9.0", capabilities=["mcp.a.read"]))
    inputs_file = tmp_path / "inputs.json"
    inputs_file.write_bytes(inputs_bytes(DIGEST_B, ["mcp.a.read", "mcp.z.read"]))
    published_file = tmp_path / "published.json"
    published_file.write_bytes(published_bytes(DIGEST_A))
    inputs_out = tmp_path / "out" / "runtime-inputs.json"

    code = mcp_window.main(
        [
            "--core", str(core), "--alias-envelope", str(alias_file),
            "--inputs", str(inputs_file), "--published-inputs", str(published_file),
            "--core-commit", COMMIT, "--inputs-out", str(inputs_out),
        ]
    )

    assert code == 0
    resolved = json.loads(capsys.readouterr().out)
    # The capability list grew past the published envelope, so the window starts at the core version.
    assert resolved["min_core_version"] == "0.9.0"
    assert resolved["min_source"] == "core_version_capabilities_grew"
    assert resolved["inputs_digest"] == DIGEST_B
    assert json.loads(inputs_out.read_text()) == {
        "schema": 1,
        "inputs_digest": DIGEST_B,
        "core_commit": COMMIT,
        "core_version": "0.9.0",
        "capabilities": ["mcp.a.read", "mcp.z.read"],
    }
    # The record round-trips through the reader the next publish uses.
    state = mcp_window.published_inputs_state(inputs_out.read_bytes())
    assert (state.digest, state.core_commit) == (DIGEST_B, COMMIT)


def test_inputs_and_published_records_are_validated() -> None:
    for bad in (b"", b"{", b'{"schema":2}', json.dumps({"schema": 1, "inputs_digest": "x", "capabilities": []}).encode()):
        with pytest.raises(ReleaseError):
            mcp_window.parse_inputs(bad)
    with pytest.raises(ReleaseError, match="capabilities"):
        mcp_window.parse_inputs(json.dumps({"schema": 1, "inputs_digest": DIGEST_A}).encode())
    for bad in (b"", b"{", b'{"schema":1}', json.dumps({"schema": 1, "inputs_digest": DIGEST_A, "core_commit": "z"}).encode()):
        with pytest.raises(ReleaseError):
            mcp_window.published_inputs_state(bad)
    with pytest.raises(ReleaseError, match="40-hex"):
        mcp_window.published_inputs_document(mcp_window.parse_inputs(inputs_bytes()), core_commit="abc", core_version="0.9.0")


def test_read_published_inputs_treats_only_404_as_absent() -> None:
    def fail(code: int):
        def fetch(url: str) -> bytes:
            raise urllib.error.HTTPError(url, code, "x", {}, None)  # type: ignore[arg-type]

        return fetch

    assert mcp_window.read_published_inputs("https://x/y", fetch=fail(404)) is None
    with pytest.raises(ReleaseError, match="HTTP 500"):
        mcp_window.read_published_inputs("https://x/y", fetch=fail(500))
    assert mcp_window.read_published_inputs("https://x/y", fetch=lambda url: published_bytes()).digest == DIGEST_A
    assert mcp_window.PUBLISHED_INPUTS_URL.endswith("/mcp-runtime-latest/runtime-inputs.json")


def test_cli_first_publish_with_no_alias(tmp_path: Path, capsys) -> None:
    core = write_core(tmp_path / "core", version="0.9.0")
    code = mcp_window.main(
        ["--core", str(core), "--no-alias", "--runtime-version", "0.1.0"]
    )
    assert code == 0
    resolved = json.loads(capsys.readouterr().out)
    assert resolved["alias_version"] is None
    assert resolved["runtime_version"] == "0.1.0"
    assert resolved["force"] is False
