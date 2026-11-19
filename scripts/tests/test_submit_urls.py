#!/usr/bin/env python3
"""submit-urls 的行为测试（不联网）。运行：python3 -m unittest discover scripts/tests"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "submit-urls"
ORIGIN = "https://example.com"


class SubmitUrlsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.site = self.root / "site"
        self.dist = self.site / "dist"
        self.dist.mkdir(parents=True)
        self.state = self.root / "submitted.json"
        self.write_page("index.html", "<html>home</html>")
        self.write_page("about/index.html", "<html>about</html>")
        self.write_sitemap([f"{ORIGIN}/", f"{ORIGIN}/about/"])

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def write_page(self, rel: str, html: str) -> None:
        path = self.dist / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(html, encoding="utf-8")

    def write_sitemap(self, urls: list[str]) -> None:
        locs = "".join(f"<url><loc>{u}</loc></url>" for u in urls)
        (self.dist / "sitemap-0.xml").write_text(f"<urlset>{locs}</urlset>", encoding="utf-8")

    def run_script(self, *extra: str, env: dict | None = None) -> subprocess.CompletedProcess:
        base_env = {k: v for k, v in os.environ.items() if k not in ("INDEXNOW_KEY", "BAIDU_PUSH_TOKEN")}
        base_env.update(env or {})
        return subprocess.run(
            [sys.executable, str(SCRIPT), str(self.site), "--state", str(self.state), *extra],
            capture_output=True,
            text=True,
            env=base_env,
        )

    def test_dry_run_lists_pending_without_writing_state(self) -> None:
        result = self.run_script("--dry-run", "--json", env={"INDEXNOW_KEY": "k" * 32})
        report = json.loads(result.stdout)
        self.assertEqual(result.returncode, 0)
        self.assertEqual(report["channels"]["indexnow"]["status"], "dry-run")
        self.assertEqual(report["channels"]["indexnow"]["pending"], 2)
        self.assertFalse(self.state.exists())

    def test_missing_credentials_skip_and_exit_zero(self) -> None:
        result = self.run_script("--json")
        report = json.loads(result.stdout)
        self.assertEqual(result.returncode, 0)
        self.assertEqual(report["channels"]["indexnow"]["status"], "skipped")
        self.assertEqual(report["channels"]["baidu"]["status"], "skipped")

    def test_all_ignores_existing_state(self) -> None:
        import hashlib

        def h(rel: str) -> str:
            return hashlib.sha256((self.dist / rel).read_bytes()).hexdigest()[:12]

        self.state.write_text(
            json.dumps(
                {"indexnow": {f"{ORIGIN}/": h("index.html"), f"{ORIGIN}/about/": h("about/index.html")}}
            ),
            encoding="utf-8",
        )
        incremental = json.loads(self.run_script("--dry-run", "--json", env={"INDEXNOW_KEY": "k"}).stdout)
        full = json.loads(
            self.run_script("--dry-run", "--all", "--json", env={"INDEXNOW_KEY": "k"}).stdout
        )
        self.assertEqual(incremental["channels"]["indexnow"]["pending"], 0)
        self.assertEqual(full["channels"]["indexnow"]["pending"], 2)

    def test_changed_content_is_pending(self) -> None:
        self.state.write_text(json.dumps({"indexnow": {f"{ORIGIN}/": "stale"}}), encoding="utf-8")
        report = json.loads(self.run_script("--dry-run", "--json", env={"INDEXNOW_KEY": "k"}).stdout)
        self.assertEqual(report["channels"]["indexnow"]["pending"], 2)

    def test_missing_dist_fails(self) -> None:
        import shutil

        shutil.rmtree(self.dist)
        result = self.run_script()
        self.assertEqual(result.returncode, 1)


if __name__ == "__main__":
    unittest.main()
