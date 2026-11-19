# 自动化运营

三条红线：**自动化不 push main**、**AI 产物走 PR**、**凭证缺失只跳过不失败**。

## 脚本

| 命令 | 作用 | 退出码 |
|---|---|---|
| `./scripts/check-content --all` | 合规闸门：免责声明、禁用表述、法条全称、四段式、脱敏 | 0/1/2 |
| `./scripts/check-links <site>` | 死链、canonical 域名、sitemap 一致性 | 0/1/2 |
| `./scripts/submit-urls <site>` | 增量提交 IndexNow / 百度 | 0/1 |
| `./scripts/report` | 健康报告（Markdown，可直接当 issue 正文） | 0/1 |
| `python3 -m unittest discover -s scripts/tests` | 脚本自测 | 0/1 |

站点清单来自 `site.facts.yml` 的 `sites[].path`，`sites/starter` 之类的模板不会被检查。

## 工作流

| 文件 | 触发 | 内容 |
|---|---|---|
| `.github/workflows/ci.yml` | push / PR | 构建 → 单测 → 合规 → 死链 → 设计检查，任一失败阻断合并 |
| `.github/workflows/automation.yml` | 每天 01:00 UTC（北京 09:00）/ 手动 | 构建 → 增量提交收录 → 健康报告 → 异常开 issue，恢复后自动关闭 |

## 需要的 Secrets

| 名称 | 必需 | 说明 |
|---|---|---|
| `INDEXNOW_KEY` | 是 | 值等于 `sites/<domain>/public/<key>.txt` 的文件名 |
| `BAIDU_PUSH_TOKEN` | 否 | 百度搜索资源平台 → 普通收录 → API 提交 |

没配的渠道在日志里显示 `skipped`，不会让任务失败，也不会丢 URL——下次配好会补提交。

## 提交状态

`.automation/submitted.json` 由 Actions 缓存保存，不进仓库。本地跑会生成这个目录，已在 `.gitignore` 里。

想重跑全量：

```bash
./scripts/submit-urls sites/labor.lawyerch.cn --all
```

## 写内容

见工作区技能 `.agents/skills/content-draft/SKILL.md`。
