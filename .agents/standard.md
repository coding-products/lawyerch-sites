---
version: 2026-11-19.1
applies-to: 所有 Astro 站点项目
---

# 站点通用规范

本文件由工作区统一维护，项目内的 `.agents/standard.md` 是它的副本。
不要直接改项目里的副本，改工作区的 `.agents/standards/site-standard.md`，然后跑 `./scripts/sync-standard`。

## 结构约定

单站项目：

```
src/
├── config/site.ts      站名、描述、联系方式、社交
├── config/theme.ts     品牌色（覆盖 CSS 变量）
├── i18n/ui.ts          多语言字典
├── content/            内容集合，按语言分目录
├── data/               首页数据（hero / stats / process / faq）
└── pages/              路由（默认语言在根，其他语言加前缀）
public/                 logo、图片、验证文件、llms.txt
```

多站 monorepo：

```
sites/<domain>/       每个站点一套上述结构
packages/             共用组件与配置
```

新文件放对应位置，不要另起目录。

## 开发

```bash
pnpm install
pnpm dev                    # 单站项目
pnpm dev --filter=<site>    # monorepo
```

构建必须带正式域名，否则 canonical 和 sitemap 指向错误：

```bash
SITE_URL=https://<domain> pnpm build
```

## 部署

Netlify 主用，Cloudflare 备用。

```bash
netlify deploy --dir=$(pwd)/dist --prod --site=<netlify-site> --no-build
```

必须用 `--dir=$(pwd)/dist` 绝对路径。monorepo 里用相对路径会被解析到仓库根，报 `deploy directory not found`。

Cloudflare：

```bash
wrangler deploy
```

`*.workers.dev` 国内直连不通，只作海外备用或绑定自定义域名后使用。

详细步骤见工作区技能 `deploy`。

## 域名与 DNS

DNS 用工作区脚本操作，不手点控制台：

```bash
./scripts/dns add <domain> <rr> <target>
./scripts/dns check <domain> <rr>
```

绑定流程：加 DNS → Netlify 后台加 Custom domain → 等 Let's Encrypt 证书 → `dns check` 验证。

## SEO

上线后必须做：

1. 构建时 `SITE_URL` 等于正式域名
2. Google Search Console 验证 + 提交 `sitemap-index.xml`
3. 百度搜索资源平台验证 + 填备案号（否则配额为 0）
4. IndexNow 提交（Bing / Yandex / Naver）
5. 主动推送见工作区技能 `seo`

每篇新文章发布后当天推送一次。

## 内容

frontmatter 必填：

```yaml
title: 标题（用真实提问句）
description: 一句话说清结论
pubDate: YYYY-MM-DD
category: 分类
tags: [标签]
```

写作规则：

1. 标题用用户会搜的问句
2. 结构：结论 → 依据 → 情形 → 提示
3. 每篇结尾写免责声明（内容类型见扩展）
4. 客户信息、真实姓名、联系方式必须脱敏
5. 多语言站要同步写对应语言版本

## 多语言

- 字典：`src/i18n/ui.ts`
- 路由：默认语言在根，其他语言加前缀（如 `/en/`）
- 内容：`content/<collection>/<lang>/*.md`，frontmatter 带 `lang`
- 新增文案时所有语言都要加，避免回落

## 主题

每个站点用 `src/config/theme.ts` 覆盖 CSS 变量，不改 `src/styles/tokens.css` 默认值。

## 纪律

1. **先构建后部署**：`pnpm build` 通过再发
2. **构建必带 SITE_URL**
3. **部署用绝对路径**
4. **密钥走环境变量**：`.env` 本地，`.env.example` 占位
5. **客户信息不入库**：公开仓库必须脱敏
6. **改内容不改主题**：新增站点只动配置和内容
7. **发布后推送收录**
