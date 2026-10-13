"""The signed registry listing of the optional Tend MCP component (`host.tend.mcp`).

The listing is a plain JSON file, `components/host.tend.mcp.json`, that the
registry build copies into `registry-v1.2.json` under the top-level key
`components`. It only *announces* a published runtime release: a panel still
verifies the runtime envelope (signature, window, capabilities) and its artifacts
before it runs anything, so nothing here carries authority. What the listing adds
is the pin of the envelope bytes (`envelopes`), so the badge and the install name
the same release.

`mcp_release.py` rewrites the release fields after each publish and `build.py`
validates the file on every build, with this one module: standard library only,
because the publish job has no third-party packages. The panel core validates the
same shape again when it reads the signed registry.
"""
from __future__ import annotations

import re
from typing import Any

COMPONENT_ID = "host.tend.mcp"
COMPONENT_FILE = f"{COMPONENT_ID}.json"
RELEASE_TAG_PREFIX = "mcp-runtime-"
PLATFORMS = ("linux/amd64", "linux/arm64")

KEYS = frozenset(
    {
        "id",
        "name",
        "description",
        "version",
        "release_tag",
        "sequence",
        "min_core_version",
        "max_core_version",
        "envelopes",
        "inputs_digest",
        "core_commit",
        "release_notes",
    }
)

# `<major>.999999.999999`: the ceiling a runtime window signs since the worker's compatibility is
# decided by its inputs and capabilities, not by the core version (docs/mcp-runtime.md).
OPEN_CEILING_SUFFIX = ".999999.999999"

MAX_NAME_CHARS = 60
MAX_DESCRIPTION_CHARS = 240
MAX_NOTE_LINES = 10
MAX_NOTE_CHARS = 200

# Same grammar as `internal/mcp/release` and `tools/mcp_window.py`: three numbers, no
# leading zeros, at most six digits each, so the sequence below never overflows.
_VERSION_RE = re.compile(r"^(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})$")
_DIGEST_RE = re.compile(r"^[0-9a-f]{64}$")
_COMMIT_RE = re.compile(r"^[0-9a-f]{40}$")


class ComponentError(ValueError):
    """The listing is not one the registry may publish."""


def version_parts(version: object, where: str) -> tuple[int, int, int]:
    match = _VERSION_RE.match(version) if isinstance(version, str) else None
    if not match:
        raise ComponentError(f"{where} must be x.y.z, got {version!r}")
    return int(match[1]), int(match[2]), int(match[3])


def sequence_of(version: str) -> int:
    """Identical to `tools.mcp_window.sequence_of` and the core's `release.SequenceOf`."""
    major, minor, patch = version_parts(version, "version")
    return major * 1_000_000_000_000 + minor * 1_000_000 + patch


def window_note(min_core: str, max_core: str) -> str:
    """The one-line compatibility note a listing carries, from the signed window."""
    if min_core == max_core:
        return f"Works with Tend {min_core}."
    if max_core.endswith(OPEN_CEILING_SUFFIX):
        return f"Needs Tend {min_core} or newer."
    return f"Works with Tend {min_core} to {max_core}."


def _text(raw: dict[str, Any], key: str, limit: int) -> str:
    value = raw[key]
    if not isinstance(value, str) or not value.strip() or len(value) > limit or "\n" in value:
        raise ComponentError(f"{key} must be one non-empty line of at most {limit} characters")
    return value


def validate_component(raw: object) -> dict[str, Any]:
    """Return the listing unchanged if it is exactly the allowed shape, else raise."""
    if not isinstance(raw, dict):
        raise ComponentError("the listing must be a JSON object")
    if set(raw) != KEYS:
        missing = sorted(KEYS - set(raw))
        unknown = sorted(set(raw) - KEYS)
        raise ComponentError(f"listing keys differ from the allowed set (missing {missing}, unknown {unknown})")
    if raw["id"] != COMPONENT_ID:
        raise ComponentError(f"id must be {COMPONENT_ID!r}, got {raw['id']!r}")
    _text(raw, "name", MAX_NAME_CHARS)
    _text(raw, "description", MAX_DESCRIPTION_CHARS)

    version = raw["version"]
    version_parts(version, "version")
    if raw["release_tag"] != RELEASE_TAG_PREFIX + version:
        raise ComponentError(f"release_tag must be {RELEASE_TAG_PREFIX + version!r}, got {raw['release_tag']!r}")
    sequence = raw["sequence"]
    if isinstance(sequence, bool) or not isinstance(sequence, int) or sequence != sequence_of(version):
        raise ComponentError(f"sequence must be {sequence_of(version)} for version {version}, got {sequence!r}")

    version_parts(raw["min_core_version"], "min_core_version")
    version_parts(raw["max_core_version"], "max_core_version")
    if sequence_of(raw["max_core_version"]) < sequence_of(raw["min_core_version"]):
        raise ComponentError("max_core_version is below min_core_version")

    envelopes = raw["envelopes"]
    if not isinstance(envelopes, dict) or set(envelopes) != set(PLATFORMS):
        raise ComponentError(f"envelopes must have exactly the platforms {list(PLATFORMS)}")
    for platform, digest in envelopes.items():
        if not isinstance(digest, str) or not _DIGEST_RE.match(digest):
            raise ComponentError(f"envelopes[{platform!r}] must be 64 lowercase hex characters")

    if not isinstance(raw["inputs_digest"], str) or not _DIGEST_RE.match(raw["inputs_digest"]):
        raise ComponentError("inputs_digest must be 64 lowercase hex characters")
    if not isinstance(raw["core_commit"], str) or not _COMMIT_RE.match(raw["core_commit"]):
        raise ComponentError("core_commit must be a 40-hex commit sha")

    notes = raw["release_notes"]
    if not isinstance(notes, list) or len(notes) > MAX_NOTE_LINES:
        raise ComponentError(f"release_notes must be a list of at most {MAX_NOTE_LINES} lines")
    for line in notes:
        if not isinstance(line, str) or not line.strip() or "\n" in line or len(line) > MAX_NOTE_CHARS:
            raise ComponentError(f"each release note must be one non-empty line of at most {MAX_NOTE_CHARS} characters")
    return raw
