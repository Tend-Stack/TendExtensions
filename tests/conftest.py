from __future__ import annotations

import base64
import hashlib
import json
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))
REVISION_A = "a" * 40
REVISION_B = "b" * 40


def _sha256_b64(data: bytes) -> str:
    return "sha256-" + base64.b64encode(hashlib.sha256(data).digest()).decode("ascii")


def write_fixture_extension(
    extensions_dir: Path,
    ext_id: str = "host.tend.fixture",
    *,
    version: str = "1.0.0",
    extra_files: dict[str, bytes] | None = None,
) -> Path:
    """Write a minimal, valid schema-2 extension folder (index.js, icon.svg,
    README.md, extension.json with a deliberately WRONG integrity map —
    build.py is responsible for rebuilding it — and listing.json)."""
    ext_dir = extensions_dir / ext_id
    ext_dir.mkdir(parents=True, exist_ok=True)

    files = {
        "index.js": b"export function mount() { return 1; }\n",
        "icon.svg": b"<svg xmlns='http://www.w3.org/2000/svg'></svg>\n",
        "README.md": b"# Fixture\n\nA fixture extension for tests.\n",
    }
    if extra_files:
        files.update(extra_files)
    for name, data in files.items():
        (ext_dir / name).write_bytes(data)

    manifest = {
        "schema": 2,
        "id": ext_id,
        "name": "Fixture",
        "version": version,
        "author": "Tests",
        "description": "A fixture extension used by the tooling test suite.",
        "icon": "icon.svg",
        "ui": {"module": "index.js", "mount": "tool-window", "size": {"w": 400, "h": 400}},
        "permissions": ["storage"],
        "integrity": {"index.js": "sha256-not-yet-rebuilt="},
    }
    (ext_dir / "extension.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    listing = {
        "publisher": "TEND Stack",
        "category": "utilities",
        "featured": False,
        "reviewed": True,
        "features": ["Fixture feature one", "Fixture feature two", "Fixture feature three"],
        "requirements": ["A Tend panel running extension runtime API 1"],
        "release_notes": "Initial registry release.",
    }
    (ext_dir / "listing.json").write_text(json.dumps(listing, indent=2) + "\n", encoding="utf-8")

    return ext_dir


@pytest.fixture
def fixture_repo(tmp_path: Path) -> Path:
    """A minimal repo root with one valid extension under extensions/."""
    extensions_dir = tmp_path / "extensions"
    write_fixture_extension(extensions_dir)
    return tmp_path
