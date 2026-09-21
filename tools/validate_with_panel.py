#!/usr/bin/env python3
"""Validate every built package against the real Tend panel core.

`tools/build.py` re-implements the panel's manifest rules so a plain
`pip install cryptography` checkout can build without ever importing the
panel. This script is the ground-truth check: given a checkout of the
panel core (`TEND_CORE_CHECKOUT`, or `--core` on the command line), it
imports `app.services.extensions.parse_manifest` and
`app.services.extensions._validated_archive_members` directly and runs
every ZIP in `dist/` through them, so a PR can never ship a package the
real panel would refuse to install.

Requires `dist/*.zip` to already exist — run `tools/build.py` first.
"""
from __future__ import annotations

import argparse
import importlib
import os
import sys
import zipfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


class ValidationError(Exception):
    """A built package failed panel validation."""


def _import_panel_extensions(core_checkout: Path):
    backend = core_checkout / "backend"
    if not backend.is_dir():
        raise ValidationError(f"{backend} does not look like a Tend panel core checkout (no backend/)")
    sys.path.insert(0, str(backend))
    try:
        module = importlib.import_module("app.services.extensions")
    except Exception as exc:  # noqa: BLE001 - surface the real import failure
        raise ValidationError(f"could not import app.services.extensions from {backend}: {exc}") from exc
    return module


def validate_zip(zip_path: Path, extensions_module) -> str:
    """Run one built ZIP through the panel's manifest parser and archive
    member validation (the parts that don't need a database or an event
    loop). Returns the manifest id on success."""
    with zipfile.ZipFile(zip_path) as zf:
        manifest_name = None
        for name in zf.namelist():
            parts = name.split("/")
            if parts[-1] == "extension.json" and len(parts) <= 2:
                manifest_name = name
                break
        if manifest_name is None:
            raise ValidationError(f"{zip_path.name}: no extension.json at the root of the ZIP")

        try:
            extensions_module._validated_archive_members(zf)
        except extensions_module.ManifestError as exc:
            raise ValidationError(f"{zip_path.name}: archive member validation failed: {exc}") from exc

        raw_manifest = zf.read(manifest_name)
        try:
            manifest = extensions_module.parse_manifest(raw_manifest)
        except extensions_module.ManifestError as exc:
            raise ValidationError(f"{zip_path.name}: parse_manifest rejected the manifest: {exc}") from exc

        # Integrity verification needs the files on disk, not just inside
        # the open ZipFile handle — extract to a throwaway directory and
        # run the same WAF check the installer runs before promoting a
        # staged extension. Neither call touches a database.
        if manifest.get("schema") == 2:
            import shutil
            import tempfile

            from app.services import extension_waf

            with tempfile.TemporaryDirectory() as tmp:
                tmp_path = Path(tmp)
                for info in zf.infolist():
                    if info.is_dir():
                        continue
                    target = tmp_path / info.filename
                    target.parent.mkdir(parents=True, exist_ok=True)
                    with zf.open(info) as src, target.open("wb") as dst:
                        shutil.copyfileobj(src, dst)
                try:
                    extension_waf.verify_integrity(tmp_path, manifest["integrity"])
                except extension_waf.IntegrityError as exc:
                    raise ValidationError(f"{zip_path.name}: integrity verification failed: {exc}") from exc
                scan = extension_waf.scan_extension(tmp_path, manifest.get("permissions", []))
                if scan.has_blocks():
                    lines = "; ".join(f"[{f.rule_id}] {f.file}:{f.line} {f.message}" for f in scan.blocks)
                    raise ValidationError(f"{zip_path.name}: WAF scan blocked install: {lines}")

        return manifest["id"]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT)
    parser.add_argument(
        "--core",
        type=Path,
        default=None,
        help="path to a Tend panel core checkout (defaults to $TEND_CORE_CHECKOUT)",
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
        extensions_module = _import_panel_extensions(core_checkout)
    except ValidationError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    failures: list[str] = []
    for zip_path in zips:
        try:
            ext_id = validate_zip(zip_path, extensions_module)
        except ValidationError as exc:
            failures.append(str(exc))
            print(f"FAIL  {zip_path.name}: {exc}")
        else:
            print(f"OK    {zip_path.name}  ({ext_id})")

    print(f"\n{len(zips) - len(failures)}/{len(zips)} package(s) passed panel validation")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
