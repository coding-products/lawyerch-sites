"""脚本共用的最小工具。只依赖标准库。"""
from __future__ import annotations

import re
from pathlib import Path


def sites_from_facts(root: Path) -> list[Path]:
    """按 site.facts.yml 里的 sites[].path 列出真实站点，排除模板目录。"""
    facts = root / "site.facts.yml"
    if facts.is_file():
        text = facts.read_text(encoding="utf-8")
        paths = re.findall(r"^\s*path:\s*(\S+)\s*$", text, re.M)
        found = [root / p for p in paths if (root / p).is_dir()]
        if found:
            return sorted(found)
    return sorted(
        p for p in (root / "sites").iterdir() if p.is_dir() and (p / "src").is_dir()
    )
