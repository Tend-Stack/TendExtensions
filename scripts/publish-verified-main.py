"""Fast-forward GitHub main to the exact commit approved by the Gitea job graph."""
from __future__ import annotations

import os
from pathlib import Path
import re
import subprocess
import tempfile


def git(*args: str, env=None) -> str:
    return subprocess.check_output(['git', *args], env=env, text=True).strip()


def ancestor(older: str, newer: str) -> bool:
    result = subprocess.run(['git', 'merge-base', '--is-ancestor', older, newer], capture_output=True)
    if result.returncode not in (0, 1):
        raise RuntimeError('Could not establish publication ancestry')
    return result.returncode == 0


def push_failure(stderr: bytes) -> tuple[str, bool]:
    """Classify Git's rejection without reflecting remote text or credentials.

    The boolean marks a recognized permanent refusal, not proof that any
    credential or server policy is correct. Unknown failures stay generic.
    """
    text = stderr[:65536].lower()
    if b'gh007' in text or b'push would publish a private email address' in text:
        return ('GitHub rejected commit email privacy (GH007); use an approved privacy-safe commit identity and revalidate changed SHAs', True)
    if any(value in text for value in (b'gh006', b'gh013', b'protected branch hook declined', b'repository rule violations')):
        return ('GitHub branch or repository rules rejected publication; inspect rules and publisher authorization', True)
    if b'refusing to allow' in text and b'workflow' in text:
        return ('GitHub credential lacks permission to update workflow files', True)
    if any(value in text for value in (b'write access to repository not granted', b'permission denied', b'authentication failed', b'invalid username or token', b'error: 403')) or (b'permission to ' in text and b' denied to ' in text):
        return ('GitHub write authorization was rejected; verify the CI publisher credential and repository permissions', True)
    if any(value in text for value in (b'non-fast-forward', b'fetch first', b'cannot lock ref')):
        return ('GitHub publication did not converge after concurrent ref changes', False)
    if any(value in text for value in (b'could not resolve host', b'failed to connect', b'connection reset', b'timed out', b'remote end hung up', b'error: 502', b'error: 503', b'error: 504')):
        return ('GitHub publication transport failed; check CI connectivity before retrying', False)
    return ('GitHub publication failed with an unclassified rejection; raw remote output withheld', False)


def publish(sha: str, remote: str, env=None) -> str:
    if not re.fullmatch(r'[0-9a-f]{40}', sha) or git('rev-parse', 'HEAD') != sha:
        raise RuntimeError('Publication requires the exact verified checkout')
    if git('status', '--porcelain', '--untracked-files=no'):
        raise RuntimeError('Publication requires an unchanged checkout')
    for _ in range(3):
        git('-c', 'credential.helper=', 'fetch', '--no-tags', remote, 'refs/heads/main', env=env)
        current = git('rev-parse', 'FETCH_HEAD')
        if current == sha or ancestor(sha, current):
            return 'already published' if current == sha else 'superseded by a newer published commit'
        if not ancestor(current, sha):
            raise RuntimeError('GitHub main has diverged; refusing to overwrite it')
        result = subprocess.run(['git', '-c', 'credential.helper=', 'push', remote,
                                 sha + ':refs/heads/main'], env=env, capture_output=True)
        if result.returncode == 0:
            # Verify the remote after the push; a newer concurrent publication
            # is acceptable, but a missing or unrelated commit is not.
            git('-c', 'credential.helper=', 'fetch', '--no-tags', remote, 'refs/heads/main', env=env)
            if ancestor(sha, git('rev-parse', 'FETCH_HEAD')):
                return 'published'
            raise RuntimeError('Could not verify the published commit')
        failure, permanent = push_failure(result.stderr)
        if permanent:
            raise RuntimeError(failure) from None
    raise RuntimeError(failure) from None


def main() -> None:
    if os.environ.get('GITEA_EVENT_NAME') != 'push' or os.environ.get('GITEA_REF') != 'refs/heads/main':
        raise RuntimeError('Only Gitea main push runs may publish')
    if not os.environ.get('GH_PUBLISH_TOKEN'):
        raise RuntimeError('Configure the GH_PUBLISH_TOKEN Gitea Actions secret')
    with tempfile.TemporaryDirectory() as directory:
        askpass = Path(directory) / 'askpass.py'
        askpass.write_text('#!/usr/bin/env python3\nimport os,sys\nprint("x-access-token" if "Username" in sys.argv[1] else os.environ["GH_PUBLISH_TOKEN"])\n')
        askpass.chmod(0o700)
        env = {key: value for key, value in os.environ.items() if not key.startswith('GIT_TRACE')}
        env.update(GIT_ASKPASS=str(askpass), GIT_TERMINAL_PROMPT='0')
        sha = os.environ.get('VERIFIED_SHA', '')
        result = publish(sha, 'https://github.com/Tend-Stack/TendExtensions.git', env)
        print(f'{sha}: {result}')


if __name__ == '__main__':
    main()
