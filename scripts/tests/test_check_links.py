#!/usr/bin/env python3
"""check-links 的行为测试。运行：python3 -m unittest discover scripts/tests"""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "check-links"
ORIGIN = "https://example.com"


def page(hrefs: tuple[str, ...] = ("/about/",), canonical: str | None = None) -> str:
    canon = canonical if canonical is not None else f"{ORIGIN}/"
    links = "".join(f'<a href="{h}">x</a>' for h in hrefs)
    return f'<html><head><link rel="canonical" href="{canon}"></head><body>{links}</body></html>'


class CheckLinksTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.site = Path(self.tmp.name) / "site"
        self.dist = self.site / "dist"
        self.dist.mkdir(parents=True)
        (self.site / "astro.config.mjs").write_text(
            f"const DEFAULT_SITE = '{ORIGIN}';\n", encoding="utf-8"
        )
        self.write_page("index.html", page(hrefs=("/", "/about/")))
        self.write_page("about/index.html", page(hrefs=("/",)))
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

    def run_script(self) -> subprocess.CompletedProcess:
        return subprocess.run(
            [sys.executable, str(SCRIPT), str(self.site)], capture_output=True, text=True
        )

    def test_clean_site_passes(self) -> None:
        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_dead_link_fails(self) -> None:
        self.write_page("about/index.html", page(hrefs=("/missing/",)))
        result = self.run_script()
        self.assertEqual(result.returncode, 1)
        self.assertIn("/missing/", result.stdout)

    def test_external_and_anchor_links_ignored(self) -> None:
        self.write_page(
            "about/index.html",
            page(hrefs=("https://other.com/x/", "mailto:hi@example.org", "#faq", "tel:+123")),
        )
        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_canonical_wrong_origin_fails(self) -> None:
        self.write_page("about/index.html", page(canonical="https://wrong.com/"))
        result = self.run_script()
        self.assertEqual(result.returncode, 1)
        self.assertIn("canonical 域名不符", result.stdout)

    def test_sitemap_url_missing_fails(self) -> None:
        self.write_sitemap([f"{ORIGIN}/", f"{ORIGIN}/gone/"])
        result = self.run_script()
        self.assertEqual(result.returncode, 1)
        self.assertIn("/gone/", result.stdout)

    def test_missing_dist_fails(self) -> None:
        shutil.rmtree(self.dist)
        result = self.run_script()
        self.assertEqual(result.returncode, 1)


if __name__ == "__main__":
    unittest.main()
