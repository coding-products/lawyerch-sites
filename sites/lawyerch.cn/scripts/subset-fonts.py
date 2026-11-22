#!/usr/bin/env python3
"""
重新生成思源宋体子集。

为什么要子集：全量思源宋体中文两个字重 3MB，首屏会明显变慢。
这里只保留站点源码里实际出现的字符，两个文件加起来约 250KB。

什么时候跑：
  改了文案、加了新词，且新出现的字不在当前子集里（浏览器会掉回系统宋体，
  字形会突变，一眼能看出来）—— 跑一次这个脚本即可。

依赖：
  python3 -m pip install --user fonttools brotli

用法：
  python3 scripts/subset-fonts.py

源字体缓存在 .font-cache/（已在 .gitignore 里），换机器首次会自动下载。
"""

from __future__ import annotations

import pathlib
import subprocess
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = ROOT / ".font-cache"
OUT = ROOT / "public" / "fonts"

CDN = "https://cdn.jsdelivr.net/fontsource/fonts/noto-serif-sc@latest/chinese-simplified-{w}-normal.woff2"

# 站点里用不到但排版会碰到的符号，一并带上，避免标点掉字
EXTRA = (
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    "0123456789"
    " .,:;!?()[]{}<>/\\|-+*=@#$%&'\"`~^_"
    "·—–…、。，：；！？（）《》【】「」『』・％＃＠"
)

SCAN_SUFFIXES = (".astro", ".ts", ".tsx", ".js", ".mjs", ".md", ".json", ".css", ".html")


def collect_chars() -> str:
    chars: set[str] = set(EXTRA)
    for path in ROOT.rglob("*"):
        if ".git" in path.parts or "node_modules" in path.parts or "dist" in path.parts:
            continue
        if path.suffix not in SCAN_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        for ch in text:
            cp = ord(ch)
            # 汉字 / 中日韩标点 / 全角字符
            if 0x4E00 <= cp <= 0x9FFF or 0x3000 <= cp <= 0x303F or 0xFF00 <= cp <= 0xFF65:
                chars.add(ch)
    return "".join(sorted(chars))


def fetch(weight: str) -> pathlib.Path:
    CACHE.mkdir(exist_ok=True)
    dest = CACHE / f"noto-serif-sc-{weight}.woff2"
    if dest.exists() and dest.stat().st_size > 100_000:
        return dest
    url = CDN.format(w=weight)
    print(f"下载 {url}")
    urllib.request.urlretrieve(url, dest)
    return dest


def subset(src: pathlib.Path, text: str, weight: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / f"noto-serif-sc-{weight}.woff2"
    cmd = [
        sys.executable,
        "-m",
        "fontTools.subset",
        str(src),
        f"--text={text}",
        f"--output-file={dest}",
        "--flavor=woff2",
        "--layout-features=kern,liga",
        "--no-hinting",
        "--desubroutinize",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode:
        print(result.stderr[-800:], file=sys.stderr)
        raise SystemExit(f"子集化失败：{weight}")
    print(f"{dest.relative_to(ROOT)}  {dest.stat().st_size // 1024} KB")


def main() -> None:
    text = collect_chars()
    print(f"收集到 {len(text)} 个字符")
    for weight in ("400", "700"):
        subset(fetch(weight), text, weight)
    print("完成。字体栈见 src/styles/stage.css 的 --rp-song。")


if __name__ == "__main__":
    main()
