#!/usr/bin/env python3
"""Resolve everything about one MCP runtime publish that used to be typed by hand:
the core compatibility window, the runtime version, and the release sequence.

    python -m tools.mcp_window --core core \
        --alias-url https://github.com/Tend-Stack/TendExtensions/releases/download/mcp-runtime-latest/runtime-linux-amd64.json \
        [--runtime-version 0.1.1] [--max-core-version 0.9.0] [--force] \
        [--env-out "$GITHUB_ENV"]

It reads only files and one public URL, holds no credential, and writes nothing
but the JSON it prints and the optional env file. Every refusal happens here,
before a build, so a run that cannot publish a trustworthy release fails before
the signing key is ever decoded.

The window rule (why it is derived and not typed)
------------------------------------------------
A signed envelope carries `min_core_version` and `max_core_version`, and a panel
refuses a runtime outside that window (`internal/mcp/release.checkCoreRange`).
Typed by hand, the window goes stale the moment the core releases past it. So both
ends are derived from the core checkout at `core_commit`:

  * **max** = `<major>.999999.999999`, an open ceiling inside the core's major.
    The worker imports only `internal/mcp/runtime`; the protocol it speaks is
    pinned by `WorkerProtocol` at readiness and a capability the panel does not
    know fails `Verify`, so a version ceiling protected nothing and only produced
    the 0.11.9 outage (every core release past the window lost the component).
    `--max-core-version` overrides it for an emergency and the override is
    recorded in the release notes.
  * **min** = the oldest core `RELEASE_COMPATIBILITY.json` says this runtime
    supports: `mcp_min_core_version` when the core states it explicitly,
    otherwise the higher of `minimum_direct_upgrade_from` (below which the core
    itself refuses a direct upgrade, so no panel should be running it) and
    MCP_CORE_FLOOR, the first core release that contains an MCP verifier at all.
    When the new runtime declares a capability the currently published envelope
    does not, an older core would refuse it, so min is the core `VERSION` instead.

The publish rule (why it is the inputs digest and not the core version)
------------------------------------------------------------------------
`cmd/tend-mcp-inputs` fingerprints every file the runtime release is built from
(`internal/mcp/inputs.Roots`). A publish is worth doing exactly when that digest
differs from the one recorded beside the published release
(`runtime-inputs.json`); an equal digest would only reset every panel's expiry
clock and burn a sequence, so it is refused unless `--force`. The core version
plays no part, which retires the old "no core release since the last runtime"
guard. A release still has to be cut from a release commit (VERSION equals
RELEASE_COMPATIBILITY.json), or `--force` records why not.

The sequence rule (why it is not a timestamp)
---------------------------------------------
The core derives the sequence from the runtime version and refuses any other
value, at signing time and at verification time alike:

    sequence == major*1_000_000_000_000 + minor*1_000_000 + patch

(`internal/mcp/release.SequenceOf`, checked in both `Build` and `Verify`). So the
sequence is not free: a monotonic timestamp or "previous + 1" would be rejected
by the panel that matters. Monotonicity is therefore enforced on the *version*
instead — a publish must name a runtime version whose derived sequence is
strictly greater than the sequence in the envelope the alias currently serves —
and the default version is the patch bump of the alias's version, which always
satisfies it. A panel holding a higher sequence refuses a lower one as a
rollback, so an alias that moved backwards would be rejected rather than
installed.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable

from tools.release import ReleaseError, fetch_public_asset

# The mutable tag a consumer may pin instead of a version. See docs/mcp-runtime.md.
ALIAS_TAG = "mcp-runtime-latest"

# The first core release that carries internal/mcp/distribution, i.e. the oldest
# core able to verify one of these envelopes at all. A derived window never
# reaches below it.
MCP_CORE_FLOOR = "0.6.0"

# `runtime-inputs.json` beside the alias: the inputs digest the published runtime was built from.
PUBLISHED_INPUTS_URL = (
    "https://github.com/Tend-Stack/TendExtensions/releases/download/"
    f"{ALIAS_TAG}/runtime-inputs.json"
)

# The ceiling suffix of a derived window: `<major>.999999.999999`.
OPEN_CEILING_SUFFIX = ".999999.999999"

_DIGEST_RE = re.compile(r"^[0-9a-f]{64}$")
_COMMIT_RE = re.compile(r"^[0-9a-f]{40}$")

# The public URL the alias's amd64 envelope sits at. Read with no credential:
# these bytes are what every panel reads too.
ALIAS_ENVELOPE_URL = (
    "https://github.com/Tend-Stack/TendExtensions/releases/download/"
    f"{ALIAS_TAG}/runtime-linux-amd64.json"
)

_VERSION_RE = re.compile(r"^(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})$")

# An envelope is a few hundred bytes; MaxEnvelopeBytes in the core is 64 KiB.
MAX_ENVELOPE_BYTES = 64 * 1024

FetchFn = Callable[[str], bytes]


def parse_version(version: str) -> tuple[int, int, int]:
    match = _VERSION_RE.match(version or "")
    if not match:
        raise ReleaseError(f"version must be x.y.z, got {version!r}")
    return int(match[1]), int(match[2]), int(match[3])


def sequence_of(version: str) -> int:
    """The anti-rollback ordering a version maps to.

    Identical to `internal/mcp/release.SequenceOf` in the core, deliberately: the
    publisher and the panel must not hold two opinions about ordering.
    """
    major, minor, patch = parse_version(version)
    return major * 1_000_000_000_000 + minor * 1_000_000 + patch


def bump_patch(version: str) -> str:
    major, minor, patch = parse_version(version)
    if patch >= 999_999:
        raise ReleaseError(
            f"cannot bump the patch of {version}: name the next minor with runtime_version"
        )
    return f"{major}.{minor}.{patch + 1}"


@dataclass(frozen=True)
class Window:
    """The compatibility window one publish will sign, and where it came from."""

    min_core_version: str
    max_core_version: str
    core_version: str
    compatibility_version: str
    min_source: str
    max_overridden: bool

    def as_dict(self) -> dict[str, Any]:
        return {
            "min_core_version": self.min_core_version,
            "max_core_version": self.max_core_version,
            "core_version": self.core_version,
            "compatibility_version": self.compatibility_version,
            "min_source": self.min_source,
            "max_overridden": self.max_overridden,
        }


@dataclass(frozen=True)
class AliasState:
    """What the alias currently serves, read from its published envelope."""

    version: str
    sequence: int
    max_core_version: str
    min_core_version: str
    # None: the envelope did not say (never the case for a real one).
    capabilities: tuple[str, ...] | None = None


@dataclass(frozen=True)
class Inputs:
    """What `cmd/tend-mcp-inputs` printed for the core checkout being published."""

    digest: str
    capabilities: tuple[str, ...]


@dataclass(frozen=True)
class PublishedInputs:
    """What `runtime-inputs.json` beside the published release records."""

    digest: str
    core_commit: str


def _capabilities(raw: object, where: str) -> tuple[str, ...]:
    if not isinstance(raw, list) or not all(isinstance(item, str) and item for item in raw):
        raise ReleaseError(f"{where} carries no capabilities list")
    return tuple(raw)


def parse_inputs(body: bytes) -> Inputs:
    """Read the JSON line `go run ./cmd/tend-mcp-inputs` prints."""
    try:
        raw = json.loads(body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        raise ReleaseError("the runtime inputs are not JSON") from None
    if not isinstance(raw, dict) or raw.get("schema") != 1:
        raise ReleaseError("the runtime inputs are not schema 1")
    digest = raw.get("inputs_digest")
    if not isinstance(digest, str) or not _DIGEST_RE.match(digest):
        raise ReleaseError("the runtime inputs carry no inputs_digest")
    return Inputs(digest=digest, capabilities=_capabilities(raw.get("capabilities"), "the runtime inputs"))


def published_inputs_state(body: bytes) -> PublishedInputs:
    """Read a published `runtime-inputs.json` (the core's `inputs.Published` shape)."""
    if not body or len(body) > MAX_ENVELOPE_BYTES:
        raise ReleaseError("the published runtime inputs are empty or implausibly large")
    try:
        raw = json.loads(body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        raise ReleaseError("the published runtime inputs are not JSON") from None
    if not isinstance(raw, dict) or raw.get("schema") != 1:
        raise ReleaseError("the published runtime inputs are not schema 1")
    digest = raw.get("inputs_digest")
    commit = raw.get("core_commit")
    if not isinstance(digest, str) or not _DIGEST_RE.match(digest):
        raise ReleaseError("the published runtime inputs carry no inputs_digest")
    if not isinstance(commit, str) or not _COMMIT_RE.match(commit):
        raise ReleaseError("the published runtime inputs carry no core_commit")
    return PublishedInputs(digest=digest, core_commit=commit)


def published_inputs_document(inputs: Inputs, *, core_commit: str, core_version: str) -> bytes:
    """The `runtime-inputs.json` asset: the core's `inputs.Published` shape, byte-stable."""
    if not _COMMIT_RE.match(core_commit or ""):
        raise ReleaseError(f"core_commit must be a 40-hex commit sha, got {core_commit!r}")
    parse_version(core_version)
    document = {
        "schema": 1,
        "inputs_digest": inputs.digest,
        "core_commit": core_commit,
        "core_version": core_version,
        "capabilities": sorted(inputs.capabilities),
    }
    return (json.dumps(document, indent=2) + "\n").encode("utf-8")


def read_core_window(
    core_root: Path,
    *,
    max_core_override: str | None = None,
    capabilities: tuple[str, ...] | None = None,
    alias: AliasState | None = None,
) -> Window:
    """Derive the window from the core checkout at `core_commit`.

    Both files are read, and a disagreement between them is not smoothed over:
    `RELEASE_COMPATIBILITY.json`'s own `version` is what the core release says it
    is, and if that is not `VERSION` then this commit is mid-release. That is a
    condition for the release-commit guard below to judge, not something to
    average out here, so it is carried in the Window rather than raised.
    """
    version_path = core_root / "VERSION"
    compat_path = core_root / "RELEASE_COMPATIBILITY.json"
    try:
        core_version = version_path.read_text(encoding="utf-8").strip()
    except OSError as exc:
        raise ReleaseError(f"cannot read {version_path}: {type(exc).__name__}") from None
    try:
        compatibility = json.loads(compat_path.read_text(encoding="utf-8"))
    except OSError as exc:
        raise ReleaseError(f"cannot read {compat_path}: {type(exc).__name__}") from None
    except ValueError:
        raise ReleaseError(f"{compat_path.name} is not valid JSON") from None
    if not isinstance(compatibility, dict):
        raise ReleaseError(f"{compat_path.name} is not a JSON object")

    parse_version(core_version)
    compatibility_version = compatibility.get("version")
    if not isinstance(compatibility_version, str):
        raise ReleaseError(f"{compat_path.name} carries no version string")
    parse_version(compatibility_version)

    explicit_min = compatibility.get("mcp_min_core_version")
    if explicit_min is not None:
        if not isinstance(explicit_min, str):
            raise ReleaseError(f"{compat_path.name} mcp_min_core_version must be a string")
        parse_version(explicit_min)
        if sequence_of(explicit_min) < sequence_of(MCP_CORE_FLOOR):
            raise ReleaseError(
                f"{compat_path.name} asks for min core {explicit_min}, below the MCP floor "
                f"{MCP_CORE_FLOOR}: no such core can verify an envelope"
            )
        min_core_version, min_source = explicit_min, "mcp_min_core_version"
    else:
        upgrade_floor = compatibility.get("minimum_direct_upgrade_from")
        if not isinstance(upgrade_floor, str):
            raise ReleaseError(f"{compat_path.name} carries no minimum_direct_upgrade_from string")
        parse_version(upgrade_floor)
        if sequence_of(upgrade_floor) > sequence_of(MCP_CORE_FLOOR):
            min_core_version, min_source = upgrade_floor, "minimum_direct_upgrade_from"
        else:
            min_core_version, min_source = MCP_CORE_FLOOR, "mcp_core_floor"

    # An older core cannot verify a capability it does not know, so a runtime that grew its capability
    # list starts at the core that declares it; otherwise the derived minimum stands.
    if (
        capabilities is not None
        and alias is not None
        and alias.capabilities is not None
        and not set(capabilities) <= set(alias.capabilities)
    ):
        min_core_version, min_source = core_version, "core_version_capabilities_grew"

    if max_core_override is not None:
        parse_version(max_core_override)
        max_core_version = max_core_override
    else:
        max_core_version = f"{parse_version(core_version)[0]}{OPEN_CEILING_SUFFIX}"

    if sequence_of(min_core_version) > sequence_of(max_core_version):
        raise ReleaseError(
            f"the derived window is empty: min {min_core_version} > max {max_core_version}"
            + (" (from --max-core-version)" if max_core_override is not None else "")
        )
    return Window(
        min_core_version=min_core_version,
        max_core_version=max_core_version,
        core_version=core_version,
        compatibility_version=compatibility_version,
        min_source=min_source,
        max_overridden=max_core_override is not None,
    )


def alias_state(envelope_body: bytes) -> AliasState:
    """Read the alias's current version, sequence and window from its envelope.

    No signature check here on purpose: this is read to decide whether a publish
    moves forward, and the trust decision belongs to the panel's own verifier
    (run against the pinned public key in the workflow's verify step). Treating
    these bytes as authority would be the mistake; treating them as a floor to
    climb above is safe even if they were tampered with, because a tampered
    higher sequence only makes this run refuse.
    """
    if not envelope_body or len(envelope_body) > MAX_ENVELOPE_BYTES:
        raise ReleaseError("the alias envelope is empty or implausibly large")
    try:
        envelope = json.loads(envelope_body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        raise ReleaseError("the alias envelope is not JSON") from None
    payload = envelope.get("payload") if isinstance(envelope, dict) else None
    if not isinstance(payload, dict):
        raise ReleaseError("the alias envelope carries no payload object")
    version = payload.get("version")
    sequence = payload.get("sequence")
    max_core = payload.get("max_core_version")
    min_core = payload.get("min_core_version")
    if not isinstance(version, str):
        raise ReleaseError("the alias envelope has no version")
    if not isinstance(sequence, int) or isinstance(sequence, bool) or sequence < 1:
        raise ReleaseError("the alias envelope has no usable sequence")
    if not isinstance(max_core, str) or not isinstance(min_core, str):
        raise ReleaseError("the alias envelope has no core window")
    parse_version(version)
    parse_version(max_core)
    parse_version(min_core)
    if sequence != sequence_of(version):
        raise ReleaseError(
            f"the alias envelope's sequence {sequence} is not the one version {version} derives; "
            "the panel would refuse it, so this run will not build on top of it"
        )
    raw_capabilities = payload.get("capabilities")
    capabilities = (
        tuple(raw_capabilities)
        if isinstance(raw_capabilities, list) and all(isinstance(c, str) for c in raw_capabilities)
        else None
    )
    return AliasState(
        version=version,
        sequence=sequence,
        max_core_version=max_core,
        min_core_version=min_core,
        capabilities=capabilities,
    )


def fetch_public(url: str) -> bytes:
    """Read one published asset with no credential attached."""
    return fetch_public_asset(url, timeout=60, max_bytes=MAX_ENVELOPE_BYTES,
                              user_agent="TendExtensions-mcp-window")


def read_alias(url: str, *, fetch: FetchFn = fetch_public) -> AliasState | None:
    """The alias's state, or None when no alias has been published yet.

    Absent (404) is a first publish. Any other failure is a refusal: "the
    download broke" is not evidence that the alias is behind this build, and
    publishing a lower sequence over a higher one is exactly the rollback the
    sequence exists to prevent.
    """
    try:
        body = fetch(url)
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return None
        raise ReleaseError(
            f"the alias envelope could not be read (HTTP {exc.code}); refusing to publish "
            "without knowing which sequence the alias serves"
        ) from None
    except (urllib.error.URLError, OSError) as exc:
        raise ReleaseError(
            f"the alias envelope could not be read ({type(exc).__name__}); refusing to publish "
            "without knowing which sequence the alias serves"
        ) from None
    return alias_state(body)


def read_published_inputs(url: str, *, fetch: FetchFn = fetch_public) -> PublishedInputs | None:
    """The published inputs record, or None when the alias has none yet (404).

    Absent is not a refusal: a release published before this record existed has no digest to compare, and
    refusing would make the first publish after this change impossible. Any other failure is a refusal,
    for the same reason as `read_alias`: an unreadable record is not evidence that the inputs changed."""
    try:
        body = fetch(url)
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return None
        raise ReleaseError(
            f"the published runtime inputs could not be read (HTTP {exc.code}); refusing to publish "
            "without knowing which inputs the alias was built from"
        ) from None
    except (urllib.error.URLError, OSError) as exc:
        raise ReleaseError(
            f"the published runtime inputs could not be read ({type(exc).__name__}); refusing to publish "
            "without knowing which inputs the alias was built from"
        ) from None
    return published_inputs_state(body)


def resolve_runtime_version(requested: str | None, alias: AliasState | None) -> tuple[str, str]:
    """The version this publish will carry, and how it was chosen."""
    if requested:
        parse_version(requested)
        return requested, "requested"
    if alias is None:
        raise ReleaseError(
            "no alias has been published yet, so there is no version to bump: "
            "dispatch with an explicit runtime_version"
        )
    return bump_patch(alias.version), "patch_bump_of_alias"


def check_sequence_increases(version: str, alias: AliasState | None) -> int:
    """The sequence this publish signs, refused unless it climbs.

    A panel keeps a durable per-platform sequence floor, so an envelope at or
    below the one it already accepted is a rollback and is rejected. Publishing
    such an envelope under the alias would therefore do nothing but break the
    alias for every panel that had already installed the newer one.
    """
    sequence = sequence_of(version)
    if alias is not None and sequence <= alias.sequence:
        raise ReleaseError(
            f"runtime version {version} has sequence {sequence}, which does not exceed the "
            f"{alias.sequence} the alias already serves (version {alias.version}): a panel "
            "refuses a sequence it has already passed, so this publish would only break the alias"
        )
    return sequence


@dataclass
class Plan:
    """Everything resolved for one publish, and every note that must be visible."""

    runtime_version: str
    version_source: str
    sequence: int
    window: Window
    alias: AliasState | None
    force: bool
    notes: list[str] = field(default_factory=list)
    inputs: Inputs | None = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "runtime_version": self.runtime_version,
            "version_source": self.version_source,
            "sequence": self.sequence,
            "alias_tag": ALIAS_TAG,
            "alias_version": None if self.alias is None else self.alias.version,
            "alias_sequence": 0 if self.alias is None else self.alias.sequence,
            "force": self.force,
            "notes": list(self.notes),
            "release_notes": self.release_note_lines(),
            "inputs_digest": None if self.inputs is None else self.inputs.digest,
            **self.window.as_dict(),
        }

    def release_note_lines(self) -> list[str]:
        """The lines that go into both release bodies.

        The two manual escapes are written down where an auditor reads the
        release, not only where an operator clicked: an overridden window or a
        forced publish is a fact about the release, not about the run.
        """
        lines = [
            f"Runtime version: {self.runtime_version} (sequence {self.sequence}, "
            f"chosen by {self.version_source})",
            f"Core compatibility window: {self.window.min_core_version} to "
            f"{self.window.max_core_version} "
            f"(min from {self.window.min_source}, max from "
            f"{'--max-core-version override' if self.window.max_overridden else 'the open ceiling of the core major'})",
        ]
        if self.inputs is not None:
            lines.append(f"Runtime inputs digest: {self.inputs.digest}")
        if self.window.max_overridden:
            lines.append(
                "MANUAL OVERRIDE: max_core_version was set by hand rather than derived from "
                f"the core VERSION ({self.window.core_version})."
            )
        if self.force:
            lines.append(
                "FORCED: the release-commit guard was bypassed with force=true."
            )
        lines.extend(self.notes)
        return lines


def build_plan(
    core_root: Path,
    *,
    requested_version: str | None = None,
    max_core_override: str | None = None,
    alias: AliasState | None,
    force: bool = False,
    inputs: Inputs | None = None,
    published: PublishedInputs | None = None,
) -> Plan:
    """Resolve and check one publish, or refuse it.

    The guards: a publish must follow a core *release* commit (VERSION equals
    RELEASE_COMPATIBILITY.json), and it must change what is published: when the
    runtime inputs digest at `core_commit` equals the one recorded beside the
    published release, the run would replace a working alias with an envelope
    that adds nothing, reset every panel's expiry clock and burn a sequence.
    `force` is the escape, and it is recorded.
    """
    window = read_core_window(
        core_root,
        max_core_override=max_core_override,
        capabilities=None if inputs is None else inputs.capabilities,
        alias=alias,
    )
    runtime_version, version_source = resolve_runtime_version(requested_version, alias)
    sequence = check_sequence_increases(runtime_version, alias)
    notes: list[str] = []

    problems: list[str] = []
    if window.compatibility_version != window.core_version:
        problems.append(
            f"the core checkout is mid-release: VERSION is {window.core_version} but "
            f"RELEASE_COMPATIBILITY.json says {window.compatibility_version}"
        )
    if inputs is not None and published is not None and inputs.digest == published.digest:
        problems.append(
            f"the runtime inputs are unchanged since {published.core_commit[:12]}: the published "
            "runtime already contains everything this core commit would build"
        )
    if alias is not None and sequence_of(window.max_core_version) < sequence_of(alias.max_core_version):
        problems.append(
            f"the max core {window.max_core_version} is below the {alias.max_core_version} the "
            "alias already serves: this would narrow the window for panels that already trust the alias"
        )
    if problems and not force:
        raise ReleaseError(
            "refusing to publish: "
            + "; ".join(problems)
            + ". Re-dispatch with force=true if this is deliberate."
        )
    for problem in problems:
        notes.append(f"FORCED past a guard: {problem}.")

    return Plan(
        runtime_version=runtime_version,
        version_source=version_source,
        sequence=sequence,
        window=window,
        alias=alias,
        force=force,
        notes=notes,
        inputs=inputs,
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Resolve the core window, runtime version and sequence for an MCP runtime publish"
    )
    parser.add_argument("--core", type=Path, required=True, help="the core checkout at core_commit")
    parser.add_argument("--runtime-version", default=None, help="x.y.z; default: bump the alias patch")
    parser.add_argument("--max-core-version", default=None, help="emergency override, logged in the notes")
    parser.add_argument("--force", action="store_true", help="bypass the release-commit and unchanged-inputs guards")
    parser.add_argument("--inputs", type=Path, default=None, help="what `go run ./cmd/tend-mcp-inputs` printed for --core")
    parser.add_argument("--core-commit", default=None, help="the 40-hex core commit (for --inputs-out)")
    parser.add_argument(
        "--inputs-out", type=Path, default=None, help="write runtime-inputs.json (the published-inputs record) here"
    )
    published_source = parser.add_mutually_exclusive_group()
    published_source.add_argument("--published-inputs-url", default=PUBLISHED_INPUTS_URL)
    published_source.add_argument(
        "--published-inputs", type=Path, default=None, help="read the published inputs record from a file"
    )
    alias_source = parser.add_mutually_exclusive_group()
    alias_source.add_argument("--alias-url", default=ALIAS_ENVELOPE_URL)
    alias_source.add_argument("--alias-envelope", type=Path, default=None, help="read the alias state from a file")
    alias_source.add_argument("--no-alias", action="store_true", help="treat the alias as unpublished")
    parser.add_argument("--json-out", type=Path, default=None)
    parser.add_argument("--env-out", type=Path, default=None, help="append KEY=value lines (e.g. $GITHUB_ENV)")
    args = parser.parse_args(argv)

    try:
        if args.no_alias:
            alias = None
        elif args.alias_envelope is not None:
            alias = alias_state(args.alias_envelope.read_bytes())
        else:
            alias = read_alias(args.alias_url)
        inputs = parse_inputs(args.inputs.read_bytes()) if args.inputs is not None else None
        published = None
        if inputs is not None and alias is not None and not args.no_alias:
            if args.published_inputs is not None:
                published = published_inputs_state(args.published_inputs.read_bytes())
            else:
                published = read_published_inputs(args.published_inputs_url)
        plan = build_plan(
            args.core,
            requested_version=args.runtime_version,
            max_core_override=args.max_core_version,
            alias=alias,
            force=args.force,
            inputs=inputs,
            published=published,
        )
        if args.inputs_out is not None:
            if inputs is None:
                raise ReleaseError("--inputs-out needs --inputs")
            document = published_inputs_document(
                inputs, core_commit=args.core_commit or "", core_version=plan.window.core_version
            )
            args.inputs_out.parent.mkdir(parents=True, exist_ok=True)
            args.inputs_out.write_bytes(document)
    except ReleaseError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    except OSError as exc:
        print(f"error: {type(exc).__name__} reading or writing a file", file=sys.stderr)
        return 1

    resolved = plan.as_dict()
    text = json.dumps(resolved, indent=2, sort_keys=True)
    print(text)
    for line in plan.release_note_lines():
        print(f"note: {line}", file=sys.stderr)
    if args.json_out is not None:
        args.json_out.write_text(text + "\n", encoding="utf-8")
    if args.env_out is not None:
        with args.env_out.open("a", encoding="utf-8") as handle:
            handle.write(f"RUNTIME_VERSION={plan.runtime_version}\n")
            handle.write(f"MIN_CORE_VERSION={plan.window.min_core_version}\n")
            handle.write(f"MAX_CORE_VERSION={plan.window.max_core_version}\n")
            handle.write(f"RUNTIME_SEQUENCE={plan.sequence}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
