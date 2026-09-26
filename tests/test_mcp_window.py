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


def envelope_bytes(version: str, *, max_core: str = "0.9.0", min_core: str = "0.6.0") -> bytes:
    return json.dumps(
        {
            "schema": 1,
            "key_id": "17949d0c35c1eb4d",
            "payload": {
                "version": version,
                "sequence": mcp_window.sequence_of(version),
                "min_core_version": min_core,
                "max_core_version": max_core,
            },
            "signature": "x",
        }
    ).encode("utf-8")


def alias_at(version: str, *, max_core: str = "0.9.0") -> mcp_window.AliasState:
    return mcp_window.alias_state(envelope_bytes(version, max_core=max_core))


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


def test_max_is_the_core_version_and_min_is_the_floor(tmp_path: Path) -> None:
    """The live shape today: RELEASE_COMPATIBILITY.json allows a direct upgrade from
    0.1.0, which is below the first core that can verify an envelope at all, so the
    MCP floor is what the window starts at."""
    core = write_core(tmp_path, version="0.9.0", minimum_direct_upgrade_from="0.1.0")
    window = mcp_window.read_core_window(core)
    assert window.max_core_version == "0.9.0"
    assert window.min_core_version == MCP_CORE_FLOOR == "0.6.0"
    assert window.min_source == "mcp_core_floor"
    assert window.max_overridden is False
    assert window.core_version == "0.9.0"


def test_min_rises_with_the_cores_own_upgrade_floor(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="1.2.0", minimum_direct_upgrade_from="0.8.0")
    window = mcp_window.read_core_window(core)
    assert (window.min_core_version, window.max_core_version) == ("0.8.0", "1.2.0")
    assert window.min_source == "minimum_direct_upgrade_from"


def test_the_core_may_state_the_mcp_minimum_itself(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="1.0.0", mcp_min_core_version="0.7.0")
    window = mcp_window.read_core_window(core)
    assert (window.min_core_version, window.max_core_version) == ("0.7.0", "1.0.0")
    assert window.min_source == "mcp_min_core_version"


def test_a_stated_minimum_below_the_mcp_floor_is_refused(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="1.0.0", mcp_min_core_version="0.3.0")
    with pytest.raises(ReleaseError, match="below the MCP floor"):
        mcp_window.read_core_window(core)


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


def test_a_core_that_has_not_released_since_the_last_runtime_is_refused(tmp_path: Path) -> None:
    """The guard the automation needs: dispatched twice for the same core, the
    second run would replace a working alias with an envelope that adds nothing and
    burns a sequence."""
    core = write_core(tmp_path, version="0.9.0")
    with pytest.raises(ReleaseError, match="no core release has happened"):
        mcp_window.build_plan(core, alias=alias_at("0.1.4", max_core="0.9.0"))

    plan = mcp_window.build_plan(core, alias=alias_at("0.1.4", max_core="0.9.0"), force=True)
    assert plan.runtime_version == "0.1.5"
    assert any("FORCED" in line for line in plan.release_note_lines())


def test_a_core_older_than_the_alias_window_is_refused(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="0.8.0")
    with pytest.raises(ReleaseError, match="below the"):
        mcp_window.build_plan(core, alias=alias_at("0.1.4", max_core="0.9.0"))
    assert mcp_window.build_plan(
        core, alias=alias_at("0.1.4", max_core="0.9.0"), force=True
    ).window.max_core_version == "0.8.0"


def test_a_mid_release_core_commit_is_refused(tmp_path: Path) -> None:
    core = write_core(tmp_path, version="1.0.0", compatibility_version="0.9.0")
    with pytest.raises(ReleaseError, match="mid-release"):
        mcp_window.build_plan(core, alias=alias_at("0.1.4"))
    plan = mcp_window.build_plan(core, alias=alias_at("0.1.4"), force=True)
    assert any("mid-release" in line for line in plan.release_note_lines())


def test_a_core_release_above_the_alias_window_needs_no_escape(tmp_path: Path) -> None:
    """The whole point: a core release above the runtime's window publishes without
    a human typing a window or forcing anything."""
    core = write_core(tmp_path, version="1.0.0", minimum_direct_upgrade_from="0.1.0")
    plan = mcp_window.build_plan(core, alias=alias_at("0.1.4", max_core="0.9.0"))
    assert plan.force is False and plan.notes == []
    assert (plan.window.min_core_version, plan.window.max_core_version) == ("0.6.0", "1.0.0")
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
    assert resolved["max_core_version"] == "1.0.0"
    assert resolved["sequence"] == mcp_window.sequence_of("0.1.5")
    assert resolved["alias_tag"] == "mcp-runtime-latest"
    assert json.loads(capsys.readouterr().out) == resolved
    env = dict(line.split("=", 1) for line in env_out.read_text().splitlines())
    assert env == {
        "RUNTIME_VERSION": "0.1.5",
        "MIN_CORE_VERSION": "0.6.0",
        "MAX_CORE_VERSION": "1.0.0",
        "RUNTIME_SEQUENCE": str(mcp_window.sequence_of("0.1.5")),
    }


def test_cli_refuses_and_writes_nothing_when_a_guard_fails(tmp_path: Path, capsys) -> None:
    core = write_core(tmp_path / "core", version="0.9.0")
    alias_file = tmp_path / "alias.json"
    alias_file.write_bytes(envelope_bytes("0.1.4", max_core="0.9.0"))
    env_out = tmp_path / "env"

    code = mcp_window.main(
        ["--core", str(core), "--alias-envelope", str(alias_file), "--env-out", str(env_out)]
    )

    assert code == 1
    assert "no core release has happened" in capsys.readouterr().err
    assert not env_out.exists()


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
