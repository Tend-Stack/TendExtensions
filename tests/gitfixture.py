"""Tiny helpers to build throw-away git repositories for the review and import tests."""
from __future__ import annotations

import os
import subprocess
from pathlib import Path

_ENV = {
    "GIT_AUTHOR_NAME": "Contributor", "GIT_AUTHOR_EMAIL": "contributor@example.invalid",
    "GIT_COMMITTER_NAME": "Maintainer", "GIT_COMMITTER_EMAIL": "maintainer@example.invalid",
    "GIT_CONFIG_NOSYSTEM": "1", "GIT_TERMINAL_PROMPT": "0",
}


def git(root: Path, *args: str, author: str | None = None) -> str:
    env = {**os.environ, **_ENV}
    if author:
        env["GIT_AUTHOR_NAME"] = author
        env["GIT_AUTHOR_EMAIL"] = f"{author.lower()}@example.invalid"
    result = subprocess.run(["git", "-C", str(root), *args], capture_output=True, text=True, env=env)
    assert result.returncode == 0, f"git {' '.join(args)}: {result.stderr}"
    return result.stdout.strip()


def init_repo(root: Path, *, bare: bool = False) -> Path:
    root.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init", "-q", "-b", "main", *(["--bare"] if bare else []), str(root)], check=True)
    return root


def write(root: Path, rel: str, content: str | bytes) -> None:
    path = root / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content if isinstance(content, bytes) else content.encode())


def commit_all(root: Path, message: str, *, author: str | None = None) -> str:
    git(root, "add", "-A")
    git(root, "commit", "-q", "-m", message, author=author)
    return git(root, "rev-parse", "HEAD")
