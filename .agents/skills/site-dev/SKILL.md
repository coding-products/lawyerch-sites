---
name: site-dev
description: 开发或新增个人站点时使用。覆盖目录结构、主题色、i18n、内容创作、本地预览。适用于 lawyerch-sites 多站 monorepo。
---

# 站点开发

## 何时使用

- 新增一个领域站点
- 修改主站或劳动法站的页面、主题、文案
- 写文章、案例、服务页
- 本地预览和构建检查

## 结构约定

每个站点是 `sites/<domain>/` 下的独立 Astro 项目，共享 `packages/`：

```
sites/<domain>/
├── src/
│   ├── config/site.ts      站名、描述、联系方式、社交
│   ├── config/theme.ts     品牌色（覆盖 CSS 变量）
│   ├── i18n/ui.ts          中英文案字典
│   ├── data/              首页数据（hero/stats/process/faq/headings）
│   ├── content/
│   │   ├── services/{zh,en}/
│   │   └── blog/{zh,en}/
│   ├── layouts/BaseLayout.astro
│   └── pages/              路由（中文根路径，英文 /en/）
├── public/                 logo、图片、验证文件、llms.txt
├── astro.config.mjs        site 域名
├── netlify.toml
└── wrangler.jsonc
```

## 新增站点

```bash
cd lawyerch-sites
./scripts/new-site.sh <domain> corporate
pnpm install
```

然后改四处：

1. `src/config/site.ts` — 站名、描述、邮箱、社交
2. `src/config/theme.ts` — 品牌色
3. `astro.config.mjs` — `site: 'https://<domain>'`
4. `src/i18n/ui.ts` — 导航、Hero、通用文案

新增站点后同步更新根 `AGENTS.md` 的站点清单。

## 主题色

只改 `src/config/theme.ts`：

```ts
export const theme = {
  lime: '#c9a227',        // 强调色
  'lime-deep': '#b08a1e',
  ink: '#0f1b2d',         // 主深色
  graphite: '#1c2e4a',
  mist: '#f5f2ea',        // 浅背景
  line: '#e5e0d3',
  slate: '#5b6472',
  faint: '#8b8778',
};
```

不要直接改 `src/styles/tokens.css` 的默认值，站点级覆盖在 `theme.ts`。

## 多语言

- 字典：`src/i18n/ui.ts`（zh / en）
- 路由：中文在根，英文在 `/en/`
- 内容：`content/<collection>/{zh,en}/*.md`，frontmatter 加 `lang: zh|en`
- 页面按 `getLangFromUrl(Astro.url)` 取语言

新增文案时，zh 和 en 两个字典都要加，避免英文页回落成中文。

## 写内容（劳动法站示例）

文章放 `src/content/blog/zh/`，frontmatter：

```yaml
---
lang: zh
title: 劳动合同到期不续签，需要支付经济补偿吗？
description: 一句话说清结论。
pubDate: 2026-11-19
category: 劳动合同
readingTime: 6 分钟
author: 陈恒律师
tags: ['劳动合同', '经济补偿']
image:
  src: /images/reel-poster.webp
  alt: 配图说明
  width: 1000
  height: 625
featured: false
---
```

写作规范：

1. 标题用真实提问句
2. 正文结构：结论 → 法律依据 → 常见情形（表格）→ 实务提示
3. 结尾必须写「一般信息，不构成法律意见」
4. 客户信息必须脱敏
5. 同步写英文版到 `blog/en/`

## 本地预览

```bash
cd sites/<domain>
pnpm dev          # http://localhost:4321
pnpm build        # 构建检查
```

构建通过再部署。构建时建议带正式域名：

```bash
SITE_URL=https://<domain> pnpm build
```

## 常见问题

- **页面 404**：检查 `src/pages/` 路径是否与导航 href 一致
- **英文页显示中文**：检查 `i18n/ui.ts` 是否漏了 en 字段
- **内容不显示**：检查 frontmatter 的 `lang` 是否与页面过滤条件一致
- **样式丢失**：确认 `BaseLayout` 引入了 `global.css`，主题变量在 `theme.ts`
