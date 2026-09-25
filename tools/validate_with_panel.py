#!/usr/bin/env python3
"""Validate every built package against the real Tend core.

`tools/build.py` re-implements the core's manifest rules so a plain
`pip install cryptography` checkout can build without a Go toolchain at
all. This script is the ground-truth check: given a checkout of the Tend
core (`TEND_CORE_CHECKOUT`, or `--core` on the command line), it runs every
ZIP in `dist/` through `cmd/tend-validate-extension` — the core's own
command for validating a package exactly as its install path would (the
same parse-manifest, archive-member, integrity and install-time safety-scan
checks the panel itself runs) — so a PR can never ship a package the real
panel would refuse to install.

The core was a Python (FastAPI) checkout through commit 64361cd3, when
`backend/` — and the `app.services.extensions` module this script used to
import directly — was deleted for good: the whole stack is Go now. A
checkout older than that has no `cmd/tend-validate-extension` and is
refused outright rather than silently skipped.

Requires `dist/*.zip` to already exist — run `tools/build.py` first — and
the core checkout's own `go` toolchain on `PATH` (CI installs it from
`public-core/go.mod`; locally, whatever `go` you use to build tend.host
works, since `go run` builds against the checkout's own go.mod/go.sum).
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


class ValidationError(Exception):
    """The validation run itself could not be completed — a missing or
    pre-Go core checkout, a missing `go` toolchain, or output the validator
    command did not produce. A single package failing validation is NOT
    this: that is reported per-package in the parsed --json list instead,
    so one bad package never stops the rest from being reported."""


def _require_go_core(core_checkout: Path) -> None:
    """Refuses clearly, before ever shelling out, when core_checkout is not
    a Go tend.host checkout new enough to carry cmd/tend-validate-extension
    (the command this script depends on)."""
    if not (core_checkout / "go.mod").is_file():
        raise ValidationError(f"{core_checkout} does not look like a Tend core checkout (no go.mod)")
    if not (core_checkout / "cmd" / "tend-validate-extension").is_dir():
        raise ValidationError(
            f"{core_checkout} has no cmd/tend-validate-extension — this is a pre-Go pin, from "
            "before the core's backend/ was deleted at 64361cd3. Point TEND_CORE_CHECKOUT / --core "
            "at a checkout on or after the Go cutover."
        )
    if shutil.which("go") is None:
        raise ValidationError('the "go" toolchain is not on PATH')


def run_validator(core_checkout: Path, zips: list[Path]) -> list[dict]:
    """Runs `go run ./cmd/tend-validate-extension --json <zips>` from
    core_checkout (so `go run` resolves the checkout's own module) and
    returns the parsed JSON list: one dict per package, in the exact shape
    cmd/tend-validate-extension/main.go's packageResult marshals (file, ok,
    and — id/version/schema/warnings on success or reason on failure).

    zips are passed as absolute paths: core_checkout is the subprocess's
    cwd, and dist/ lives under the registry's own repo root, not under
    core_checkout.
    """
    cmd = ["go", "run", "./cmd/tend-validate-extension", "--json"] + [str(p.resolve()) for p in zips]
    proc = subprocess.run(cmd, cwd=core_checkout, capture_output=True, text=True)
    # Exit 0 (everything validated) and 1 (at least one package failed) both
    # still print the JSON list this function needs; anything else means the
    # command itself never ran to completion (a usage error, a build
    # failure in the checkout) and there is no per-package report to parse.
    if proc.returncode not in (0, 1):
        raise ValidationError(
            f"cmd/tend-validate-extension exited {proc.returncode} (not a per-package failure):\n"
            f"{proc.stderr}"
        )
    try:
        results = json.loads(proc.stdout)
    except json.JSONDecodeError as exc:
        raise ValidationError(
            f"cmd/tend-validate-extension --json did not print valid JSON: {exc}\n"
            f"stdout: {proc.stdout}\nstderr: {proc.stderr}"
        ) from exc
    return results


def report(results: list[dict]) -> int:
    """Prints one OK/FAIL line per package and a summary line, then returns
    the process exit status — the same report shape this script has always
    produced, now sourced from cmd/tend-validate-extension's parsed --json
    output instead of a direct Python import."""
    failures = 0
    for r in results:
        name = Path(r["file"]).name
        if r.get("ok"):
            print(f"OK    {name}  ({r.get('id')})")
        else:
            failures += 1
            print(f"FAIL  {name}: {r.get('reason')}")

    print(f"\n{len(results) - failures}/{len(results)} package(s) passed panel validation")
    return 1 if failures else 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT)
    parser.add_argument(
        "--core",
        type=Path,
        default=None,
        help="path to a Tend core checkout (defaults to $TEND_CORE_CHECKOUT)",
    )
    args = parser.parse_args(argv)

    core_checkout = args.core or (Path(os.environ["TEND_CORE_CHECKOUT"]) if os.environ.get("TEND_CORE_CHECKOUT") else None)
    if core_checkout is None:
        print("error: set TEND_CORE_CHECKOUT or pass --core <path>", file=sys.stderr)
        return 1
    core_checkout = core_checkout.resolve()

    dist_dir = args.repo_root / "dist"
    zips = sorted(dist_dir.glob("*.zip"))
    if not zips:
        print(f"error: no ZIPs found in {dist_dir} — run tools/build.py first", file=sys.stderr)
        return 1

    try:
        _require_go_core(core_checkout)
        results = run_validator(core_checkout, zips)
    except ValidationError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    return report(results)


if __name__ == "__main__":
    raise SystemExit(main())
