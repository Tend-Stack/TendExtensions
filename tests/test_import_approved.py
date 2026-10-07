"""The importer: an approval by the App's bot for the current head, rebased onto main behind the same build,
refused on anything outside the contributor paths, idempotent on retry. Real git repositories, a fake GitHub."""
from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path

import pytest
from conftest import REPO_ROOT, write_fixture_extension
from gitfixture import commit_all, git, init_repo, write

from tools import build, import_approved as ia

APP = "tend-review[bot]"
BOT = {"login": APP, "type": "Bot"}


def approval(sha: str, *, rid: int = 1, user: dict | None = None, state: str = "APPROVED", body: str | None = None) -> dict:
    return {"id": rid, "user": user or BOT, "state": state, "body": body if body is not None else f"tend-review: approve {sha}"}


class FakeGitHub:
    def __init__(self) -> None:
        self.prs: list[dict] = []
        self.reviews: dict[int, list[dict]] = {}
        self.comments: dict[int, list[dict]] = {}
        self.closed: list[int] = []

    def get(self, path: str):
        if re.match(r"/repos/[^/]+/[^/]+/pulls\?", path):
            return self.prs
        if m := re.match(r"/repos/[^/]+/[^/]+/pulls/(\d+)/reviews", path):
            return self.reviews.get(int(m.group(1)), [])
        if m := re.match(r"/repos/[^/]+/[^/]+/issues/(\d+)/comments", path):
            return self.comments.get(int(m.group(1)), [])
        raise AssertionError(path)

    def post(self, path: str, body: dict):
        m = re.match(r"/repos/[^/]+/[^/]+/issues/(\d+)/comments", path)
        assert m, path
        self.comments.setdefault(int(m.group(1)), []).append(body)

    def patch(self, path: str, body: dict):
        m = re.match(r"/repos/[^/]+/[^/]+/pulls/(\d+)$", path)
        assert m and body == {"state": "closed"}
        self.closed.append(int(m.group(1)))


class World:
    """gitea.git (the trusted origin), github.git (holds refs/pull/N/head), a work clone and a contributor clone."""

    def __init__(self, tmp: Path) -> None:
        seed = init_repo(tmp / "seed")
        shutil.copytree(REPO_ROOT / "tools", seed / "tools", ignore=shutil.ignore_patterns("__pycache__"))
        write(seed, ".gitignore", "dist/\n__pycache__/\n")
        write(seed, "README.md", "registry\n")
        write(seed, "tests/test_x.py", "def test_x(): pass\n")
        write_fixture_extension(seed / "extensions", "com.example.base")
        build.run(seed, sequence=1, revision="a" * 40)
        self.base_commit = commit_all(seed, "seed", author="Maintainer")
        self.gitea = init_repo(tmp / "gitea.git", bare=True)
        self.github = init_repo(tmp / "github.git", bare=True)
        for bare in (self.gitea, self.github):
            git(seed, "push", "-q", str(bare), "main")
        self.work = tmp / "work"
        subprocess.run(["git", "clone", "-q", str(self.gitea), str(self.work)], check=True)
        self.contrib = tmp / "contrib"
        subprocess.run(["git", "clone", "-q", str(self.github), str(self.contrib)], check=True)
        self.gh = FakeGitHub()
        self.cfg = ia.Config(root=self.work, github_repo="Tend-Stack/TendExtensions", app_login=APP, clone_url=str(self.github))

    def open_pr(self, number: int, branch_edit, *, message: str = "Add a thing", approve: bool = True) -> str:
        c = self.contrib
        git(c, "fetch", "-q", "origin")
        git(c, "checkout", "-q", "-B", f"pr{number}", "origin/main")
        branch_edit(c)
        head = commit_all(c, message, author="Alice")
        git(c, "push", "-q", str(self.github), f"HEAD:refs/pull/{number}/head")
        self.gh.prs.append({"number": number, "draft": False, "base": {"ref": "main"}, "head": {"sha": head}})
        if approve:
            self.gh.reviews[number] = [approval(head)]
        return head

    def gitea_main(self) -> str:
        return git(self.gitea, "rev-parse", "main")

    def run(self) -> dict[int, str]:
        return ia.run(self.gh, self.cfg)


def add_extension(ext_id: str):
    def edit(root: Path) -> None:
        write_fixture_extension(root / "extensions", ext_id)
        build.run(root, sequence=2, revision="b" * 40)  # the author runs the build and commits the result

    return edit


@pytest.fixture
def world(tmp_path: Path) -> World:
    return World(tmp_path)


def test_approved_pr_is_imported_with_authors_kept_then_commented_and_closed(world: World) -> None:
    head = world.open_pr(7, add_extension("com.example.new"))
    before = world.gitea_main()
    assert world.run() == {7: "imported"}
    after = world.gitea_main()
    assert after != before and git(world.gitea, "merge-base", "--is-ancestor", before, after) == ""
    assert git(world.gitea, "log", "-1", "--format=%an|%s", "main") == "Alice|Add a thing"
    assert (git(world.gitea, "ls-tree", "-r", "--name-only", "main")).count("extensions/com.example.new/extension.json") == 1
    count = git(world.gitea, "rev-list", "--count", "main")
    assert f"registry-{count}" in world.gh.comments[7][-1]["body"] and world.gh.closed == [7]
    assert head == after  # already on top of main: a fast-forward keeps the author's commit as is


def test_retry_after_a_failed_close_only_comments_and_closes(world: World) -> None:
    world.open_pr(7, add_extension("com.example.new"))
    assert world.run() == {7: "imported"}
    world.gh.closed.clear()
    main_after = world.gitea_main()
    assert world.run() == {7: "already-imported"}
    assert world.gitea_main() == main_after and world.gh.closed == [7]


def test_no_review_non_bot_review_wrong_head_and_withdrawal_import_nothing(world: World) -> None:
    head = world.open_pr(1, add_extension("com.example.one"), approve=False)
    main = world.gitea_main()
    assert world.run() == {1: "not-approved"}
    world.gh.reviews[1] = [approval(head, user={"login": APP, "type": "User"})]
    assert world.run() == {1: "not-approved"}
    world.gh.reviews[1] = [approval(head, user={"login": "someone-else", "type": "Bot"})]
    assert world.run() == {1: "not-approved"}
    world.gh.reviews[1] = [approval(head, state="DISMISSED")]
    assert world.run() == {1: "not-approved"}
    world.gh.reviews[1] = [approval("f" * 40)]
    assert world.run() == {1: "superseded"}
    world.gh.reviews[1] = [approval(head, rid=1), approval(head, rid=2, body="tend-review: withdraw")]
    assert world.run() == {1: "not-approved"}
    world.gh.reviews[1] = [approval(head, rid=1, body=f"tend-review: approve {head}\nplus text"), approval(head[:39], rid=2, body=f"tend-review: approve {head[:39]}")]
    assert world.run() == {1: "not-approved"}
    assert world.gitea_main() == main and world.gh.closed == [] and world.gh.comments == {}


def test_head_moved_after_approval_is_superseded_even_if_the_listing_is_stale(world: World) -> None:
    head = world.open_pr(1, add_extension("com.example.one"))
    # the listing still shows the approved head, but the ref now points at a different commit
    c = world.contrib
    write(c, "extensions/com.example.one/index.js", "export function mount() { return 2; }\n")
    commit_all(c, "sneaky follow-up", author="Alice")
    git(c, "push", "-q", "-f", str(world.github), "HEAD:refs/pull/1/head")
    main = world.gitea_main()
    assert world.run() == {1: "superseded"} and world.gitea_main() == main


def test_pr_touching_maintainer_paths_is_refused_and_commented_once(world: World) -> None:
    def edit(root: Path) -> None:
        add_extension("com.example.new")(root)
        write(root, "tools/build.py", "raise SystemExit(0)\n")
        write(root, ".gitea/workflows/ci.yml", "name: evil\n")

    head = world.open_pr(3, edit)
    main = world.gitea_main()
    assert world.run() == {3: "maintainer-path"}
    assert world.run() == {3: "maintainer-path"}  # second run: refused again, not commented again
    assert world.gitea_main() == main and world.gh.closed == []
    assert len(world.gh.comments[3]) == 1
    body = world.gh.comments[3][0]["body"]
    assert head[:12] in body and "`tools/build.py`" in body and ".gitea/workflows/ci.yml" in body


@pytest.mark.parametrize("mode", ["symlink", "recipe-loose-file"])
def test_special_files_and_loose_recipe_files_are_refused(world: World, mode: str) -> None:
    def edit(root: Path) -> None:
        add_extension("com.example.new")(root)
        if mode == "symlink":
            (root / "extensions/com.example.new/link").symlink_to("/etc/passwd")
        else:
            write(root, "recipes/README.md", "hijack\n")

    world.open_pr(4, edit)
    main = world.gitea_main()
    outcome = world.run()[4]
    assert outcome == ("special-file" if mode == "symlink" else "maintainer-path")
    assert world.gitea_main() == main


def test_conflicting_rebase_is_refused_without_touching_main(world: World) -> None:
    world.open_pr(5, lambda c: write(c, "extensions/com.example.base/README.md", "# contributor\n"))
    # main moves under the pull request, editing the same file
    seed = world.contrib
    git(seed, "checkout", "-q", "-B", "m", "origin/main")
    write(seed, "extensions/com.example.base/README.md", "# maintainer\n")
    commit_all(seed, "main moves", author="Maintainer")
    git(seed, "push", "-q", str(world.gitea), "HEAD:main")
    main = world.gitea_main()
    assert world.run() == {5: "conflict"}
    assert world.gitea_main() == main and "does not rebase cleanly" in world.gh.comments[5][0]["body"]


def test_a_build_failure_blocks_the_import(world: World) -> None:
    def edit(root: Path) -> None:
        add_extension("com.example.new")(root)
        write(root, "extensions/com.example.new/extension.json", "{ not json")

    world.open_pr(6, edit)
    main = world.gitea_main()
    assert world.run() == {6: "build-failed"}
    assert world.gitea_main() == main and "build.py" in world.gh.comments[6][0]["body"]


def test_stale_integrity_map_is_refused_with_the_fix(world: World) -> None:
    def edit(root: Path) -> None:
        write_fixture_extension(root / "extensions", "com.example.new")  # integrity left stale on purpose

    world.open_pr(8, edit)
    assert world.run() == {8: "stale-integrity"}
    assert "run it locally and commit" in world.gh.comments[8][0]["body"]
    assert git(world.work, "status", "--porcelain", "--untracked-files=no") == ""


def test_dry_run_changes_nothing(world: World) -> None:
    world.open_pr(9, add_extension("com.example.new"))
    main = world.gitea_main()
    world.cfg.dry_run = True
    assert world.run() == {9: "would-import"}
    assert world.gitea_main() == main and world.gh.comments == {} and world.gh.closed == []


def test_drafts_and_other_bases_are_skipped(world: World) -> None:
    world.open_pr(10, add_extension("com.example.new"))
    world.gh.prs[0]["draft"] = True
    assert world.run() == {10: "skipped"}
    world.gh.prs[0].update(draft=False, base={"ref": "release"})
    assert world.run() == {10: "skipped"}


def test_two_approved_prs_both_land_in_number_order(world: World) -> None:
    world.open_pr(11, add_extension("com.example.eleven"), message="Eleven")
    head12 = world.open_pr(12, add_extension("com.example.twelve"), message="Twelve")
    assert world.run() == {11: "imported", 12: "imported"}
    assert head12 not in git(world.gitea, "rev-list", "main")  # rebased over #11, author kept
    assert git(world.gitea, "log", "-1", "--format=%an", "main") == "Alice"
    subjects = git(world.gitea, "log", "-2", "--format=%s", "main").splitlines()
    assert subjects == ["Twelve", "Eleven"]


def test_main_requires_an_app_login(monkeypatch, capsys) -> None:
    monkeypatch.delenv("TEND_REVIEW_APP_LOGIN", raising=False)
    assert ia.main([]) == 2
    assert ia.main(["--app-login", "x[bot]", "--github-repo", "not a repo"]) == 2
