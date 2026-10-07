"""The developer kit under developers/ must stay self-consistent: every relative
Markdown link resolves, every skill has name + description front matter matching
its folder, and the mandatory human-review notice is present where promised."""
from __future__ import annotations

import re
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
KIT = ROOT / "developers"
LINK = re.compile(r"\[[^\]]*\]\(([^)\s]+)\)")
SKILLS = sorted(p for p in (KIT / "skills").iterdir() if p.is_dir())
EXPECTED = {
    "tend-extension", "tend-theme-pack", "tend-dockerfile", "tend-compose", "tend-deploy-app",
    "tend-app-recipe", "tend-git-and-pr", "tend-api-and-mcp", "tend-review-before-pr",
}


def _markdown_files() -> list[Path]:
    return sorted(KIT.rglob("*.md")) + [ROOT / "README.md", ROOT / "CONTRIBUTING.md", ROOT / "AGENTS.md"]


def _strip_code(text: str) -> str:
    # fenced blocks and inline code can hold example text that only looks like a link
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    return re.sub(r"`[^`\n]*`", "", text)


@pytest.mark.parametrize("path", _markdown_files(), ids=lambda p: str(p.relative_to(ROOT)))
def test_relative_links_resolve(path: Path) -> None:
    for target in LINK.findall(_strip_code(path.read_text(encoding="utf-8"))):
        if re.match(r"^[a-z][a-z0-9+.-]*:", target) or target.startswith("#"):
            continue
        file_part = target.split("#", 1)[0]
        assert (path.parent / file_part).resolve().exists(), f"{path.relative_to(ROOT)}: broken link {target}"


def test_skill_set_is_complete() -> None:
    assert {p.name for p in SKILLS} == EXPECTED


@pytest.mark.parametrize("skill", SKILLS, ids=lambda p: p.name)
def test_skill_front_matter(skill: Path) -> None:
    text = (skill / "SKILL.md").read_text(encoding="utf-8")
    match = re.match(r"^---\nname: (.+)\ndescription: (.+)\n---\n", text)
    assert match, f"{skill.name}: front matter must be exactly name then description"
    assert match.group(1) == skill.name
    assert "Use when" in match.group(2) or "use when" in match.group(2).lower()
    assert "\nSource:" in text, f"{skill.name}: cite its sources"


@pytest.mark.parametrize("name", ["README.md", "AGENTS.md"])
def test_review_notice_present(name: str) -> None:
    text = " ".join((KIT / name).read_text(encoding="utf-8").replace("\n> ", "\n").split())
    assert "inspected by humans before it is published" in text
    assert "convenience, not the default" in text
    assert "can't explain" in text
