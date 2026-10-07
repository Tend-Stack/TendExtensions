"""Reviewer hints: heuristic annotations on added lines, and the one hard error (maintainer-only paths)."""
from __future__ import annotations

import json
from pathlib import Path

import pytest
from gitfixture import commit_all, git, init_repo, write

from tools import review_hints as rh

MANIFEST = {"id": "com.example.demo", "name": "Demo", "version": "1.0.0", "permissions": ["storage"]}


@pytest.fixture
def repo(tmp_path: Path) -> Path:
    root = init_repo(tmp_path / "repo")
    write(root, "README.md", "# repo\n")
    write(root, "extensions/com.example.demo/extension.json", json.dumps(MANIFEST))
    write(root, "extensions/com.example.demo/index.js", "export const a = 1;\n")
    write(root, "tools/build.py", "print('trusted')\n")
    commit_all(root, "base")
    return root


def scan_change(repo: Path, files: dict[str, str | bytes]):
    base = git(repo, "rev-parse", "HEAD")
    for rel, content in files.items():
        write(repo, rel, content)
    head = commit_all(repo, "change")
    return rh.scan(repo, base, head)


def codes(findings) -> set[str]:
    return {f.code for f in findings}


@pytest.mark.parametrize(
    "line,code",
    [
        ("eval(code);", "eval"),
        ("const f = new Function('return 1');", "new-function"),
        ("fetch('https://x.example');", "network"),
        ("const w = new WebSocket(u);", "network"),
        ("navigator.sendBeacon(u, d);", "network"),
        ("importScripts('a.js');", "import-scripts"),
        ("const c = document.cookie;", "cookie"),
        ("import x from 'https://cdn.example/x.js';", "remote-import"),
        ("const m = await import(`./${name}.js`);", "dynamic-import"),
    ],
)
def test_js_rules_flag_added_lines(repo: Path, line: str, code: str) -> None:
    findings = scan_change(repo, {"extensions/com.example.demo/index.js": f"export const a = 1;\n{line}\n"})
    hit = [f for f in findings if f.code == code]
    assert hit and hit[0].line == 2 and hit[0].level == "warning"
    assert not any(f.level == "error" for f in findings)


def test_only_added_lines_are_scanned_and_clean_code_has_no_hints(repo: Path) -> None:
    write(repo, "extensions/com.example.demo/index.js", "const old = eval('1');\n")
    commit_all(repo, "pre-existing")
    findings = scan_change(repo, {"extensions/com.example.demo/index.js": "const old = eval('1');\nexport const b = 2;\n"})
    assert findings == []


def test_safe_lookalikes_are_not_flagged(repo: Path) -> None:
    code = "const x = host.network.fetch(u);\nconst y = obj.eval(2);\nconst s = 'import path';\nimport('./static.js');\n"
    assert scan_change(repo, {"extensions/com.example.demo/index.js": code}) == []


def test_svg_and_html_markup_hints(repo: Path) -> None:
    findings = scan_change(repo, {
        "extensions/com.example.demo/glyph.svg": '<svg xmlns="http://www.w3.org/2000/svg"><script>x()</script></svg>',
        "extensions/com.example.demo/index.html": '<script src="https://cdn.example/a.js"></script>',
    })
    assert ("inline-script", "extensions/com.example.demo/glyph.svg") in {(f.code, f.path) for f in findings}
    assert "remote-script" in codes(findings)


def test_minified_file_is_flagged(repo: Path) -> None:
    packed = "var a=" + "x+" * 1200 + "1;\n" * 3
    findings = scan_change(repo, {"extensions/com.example.demo/bundle.js": packed})
    assert "minified" in codes(findings)
    readable = "".join(f"export const v{i} = {i};\n" for i in range(150))
    assert "minified" not in codes(scan_change(repo, {"extensions/com.example.demo/ok.js": readable}))


def test_new_permissions_are_called_out(repo: Path) -> None:
    manifest = {**MANIFEST, "permissions": ["storage", "network", "email"], "version": "1.1.0"}
    findings = scan_change(repo, {"extensions/com.example.demo/extension.json": json.dumps(manifest)})
    perm = [f for f in findings if f.code == "new-permission"]
    assert len(perm) == 1 and "email, network" in perm[0].message
    brand_new = {**MANIFEST, "id": "com.example.other", "permissions": ["files.read"]}
    findings = scan_change(repo, {"extensions/com.example.other/extension.json": json.dumps(brand_new)})
    assert any("new extension asks for" in f.message for f in findings)
    # unchanged permissions say nothing
    same = {**MANIFEST, "version": "1.2.0"}
    assert "new-permission" not in codes(scan_change(repo, {"extensions/com.example.demo/extension.json": json.dumps(same)}))


def test_recipe_text_hint(repo: Path) -> None:
    findings = scan_change(repo, {"recipes/x-app/recipe.json": '{\n  "notes": "mount /var/run/docker.sock",\n  "name": "X"\n}\n'})
    assert any(f.code == "recipe-docker" and f.line == 2 for f in findings)


@pytest.mark.parametrize(
    "path,allowed",
    [
        ("extensions/a/index.js", True), ("recipes/my-app/recipe.json", True), ("tests/js/a/x.test.js", True),
        ("recipes/README.md", False), ("recipes/recipe.schema.json", False), ("tools/build.py", False),
        (".github/workflows/validate-pr.yml", False), (".gitea/workflows/ci.yml", False), ("scripts/publish-verified-main.py", False),
        ("keys/registry.pub", False), ("tests/test_build.py", False), ("README.md", False), ("templates/recipe/x", False),
        ("extensionsX/a", False),
    ],
)
def test_contributor_paths(path: str, allowed: bool) -> None:
    assert rh.is_contributor_path(path) is allowed


def test_maintainer_paths_are_errors_and_exit_nonzero(repo: Path, capsys) -> None:
    base = git(repo, "rev-parse", "HEAD")
    write(repo, "tools/build.py", "print('rigged')\n")
    write(repo, ".github/workflows/x.yml", "name: x\n")
    write(repo, "extensions/com.example.demo/index.js", "export const a = 2;\n")
    commit_all(repo, "change")
    assert rh.main(["--repo-root", str(repo), "--base", base]) == 1
    out = capsys.readouterr().out
    assert "::error file=tools/build.py,title=Review hint%3A maintainer-path::" in out
    assert "::error file=.github/workflows/x.yml" in out


def test_clean_pr_exits_zero_and_writes_summary(repo: Path, tmp_path: Path, capsys) -> None:
    base = git(repo, "rev-parse", "HEAD")
    write(repo, "extensions/com.example.demo/index.js", "export const a = 2;\n")
    commit_all(repo, "change")
    summary = tmp_path / "summary.md"
    assert rh.main(["--repo-root", str(repo), "--base", base, "--summary", str(summary)]) == 0
    assert "No hints on 1 changed file(s)" in summary.read_text()


def test_annotation_escapes_workflow_command_syntax() -> None:
    f = rh.Finding("warning", "eval", "extensions/a,b:c/x.js", 3, "50% bad\nline")
    text = rh.annotation(f)
    assert text.startswith("::warning file=extensions/a%2Cb%3Ac/x.js,line=3,title=")
    assert text.endswith("::50%25 bad%0Aline") and "\n" not in text


def test_bad_revision_is_an_error_not_a_crash(repo: Path, capsys) -> None:
    assert rh.main(["--repo-root", str(repo), "--base", "deadbeef" * 5]) == 2
