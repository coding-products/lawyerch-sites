# lawyerch-sites

本站点遵循通用规范 [`.agents/standard.md`](.agents/standard.md)（version 2026-11-20.5）。

> 本文件由 `scripts/sync-standard` 生成，不要手改。
> 站点信息改 `site.facts.yml`，规范改工作区的 `.agents/standards/site-standard.md`。
> 项目本地内容（Agent skills 配置、`PROJECT-LOCAL` 标记块）同步时原样保留。

## 技术栈

Astro 7 + Tailwind CSS 4 + pnpm workspace + Turborepo

分类：`cn`（国内站点，必须备案）。规则见 `.agents/standard.md` 的「站点分类」。

## 站点

| 域名 | 分类 | 路径 | 部署 |
|---|---|---|---|
| lawyerch.cn | `cn` | `sites/lawyerch.cn` | lawyerch-cn |
| labor.lawyerch.cn | `cn` | `sites/labor.lawyerch.cn` | labor-lawyerch-cn |


## 命令

通用命令（安装、构建）见 `.agents/standard.md`。本站入口：

```bash
pnpm dev --filter=lawyerch.cn
./scripts/deploy-oss sites/lawyerch.cn
./scripts/deploy-oss sites/labor.lawyerch.cn
```

## 启用的扩展

- `content-legal` → [`.agents/extensions/content-legal.md`](.agents/extensions/content-legal.md)

## 分发的工具脚本

由工作区 `scripts/` 分发，不要手改：

- `scripts/design-check`
- `scripts/seo-audit`
- `scripts/check-tokens`
- `scripts/deploy-oss`
- `scripts/deploy-ecs`

## 通用流程

部署、DNS、SEO 的详细步骤见工作区 `.agents/skills/`。
本项目单独克隆时，按上面「命令」一节操作即可。
