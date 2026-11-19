#!/usr/bin/env python3
"""check-content 的行为测试。运行：python3 -m unittest discover scripts/tests"""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "check-content"

GOOD_BLOG = """---
title: 劳动合同到期不续签，需要支付经济补偿吗？
description: 取决于谁提出不续签。
pubDate: 2026-11-19
category: 劳动合同
tags: ['劳动合同']
---

**结论：多数情况下需要。**

## 法律依据

《劳动合同法》第四十六条第五项规定，依照本法第四十四条第一项终止固定期限劳动合同的，应当支付经济补偿。

## 常见情形

| 情形 | 是否支付 |
|---|---|
| 单位提出 | 需要 |

## 实务提示

- 保留书面通知。

> 本文为一般信息，不构成针对具体案件的法律意见。
"""


def run(site: Path, *extra: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, str(SCRIPT), str(site), *extra],
        capture_output=True,
        text=True,
    )


class CheckContentTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.site = Path(self.tmp.name) / "site"
        self.blog = self.site / "src" / "content" / "blog" / "zh"
        self.blog.mkdir(parents=True)

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def write(self, text: str, name: str = "post.md") -> Path:
        path = self.blog / name
        path.write_text(text, encoding="utf-8")
        return path

    def test_good_blog_passes(self) -> None:
        self.write(GOOD_BLOG)
        result = run(self.site)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_missing_disclaimer_fails(self) -> None:
        self.write(GOOD_BLOG.replace("> 本文为一般信息，不构成针对具体案件的法律意见。", ""))
        result = run(self.site)
        self.assertEqual(result.returncode, 1)
        self.assertIn("缺少免责声明", result.stdout)

    def test_forbidden_phrase_fails(self) -> None:
        self.write(GOOD_BLOG + "\n我们保证胜诉。\n")
        result = run(self.site)
        self.assertEqual(result.returncode, 1)
        self.assertIn("保证胜诉", result.stdout)

    def test_law_citation_without_brackets_fails(self) -> None:
        self.write(GOOD_BLOG + "\n依据劳动合同法第四十六条规定。\n")
        result = run(self.site)
        self.assertEqual(result.returncode, 1)
        self.assertIn("法条缺少《》全称", result.stdout)

    def test_referential_citation_not_flagged(self) -> None:
        self.write(GOOD_BLOG + "\n依照本法第四十四条规定处理。\n")
        result = run(self.site)
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_missing_section_fails(self) -> None:
        self.write(GOOD_BLOG.replace("## 实务提示", "## 其他"))
        result = run(self.site)
        self.assertEqual(result.returncode, 1)
        self.assertIn("实务提示", result.stdout)

    def test_phone_number_fails(self) -> None:
        self.write(GOOD_BLOG + "\n电话 " + "13800138000" + "。\n")
        result = run(self.site)
        self.assertEqual(result.returncode, 1)
        self.assertIn("手机号", result.stdout)

    def test_service_page_skips_disclaimer(self) -> None:
        service = self.site / "src" / "content" / "services" / "zh" / "labor.md"
        service.parent.mkdir(parents=True)
        service.write_text(
            "---\ntitle: 劳动争议代理\ndescription: 代理劳动争议。\n---\n\n正文。\n\n> 方案需单独制定。\n",
            encoding="utf-8",
        )
        result = run(self.site)
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_json_output(self) -> None:
        self.write(GOOD_BLOG + "\n我们保证胜诉。\n")
        result = run(self.site, "--json")
        payload = json.loads(result.stdout)
        self.assertEqual(payload["errors"], 1)
        self.assertEqual(result.returncode, 1)


if __name__ == "__main__":
    unittest.main()
