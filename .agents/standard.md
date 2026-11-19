---
version: 2026-11-20.1
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

阿里云 OSS + CDN 为主。构建产物上传到站点对应的 bucket，CDN 负责域名、HTTPS 与国内加速。

```bash
pnpm build
./scripts/deploy-oss sites/<domain>
```

- bucket 命名：域名里的点换成横线（`labor.lawyerch.cn` → `labor-lawyerch-cn`）
- bucket 要开静态网站托管：默认首页 `index.html`、错误页 `404.html`、`SupportSubDir=true`
- 账号若开了「阻止公共访问」，需在 bucket 上关掉，否则匿名访问返回 403
- CDN 缓存：`css`/`js` 长缓存；HTML 即便设了 `ttl=0` 仍会被边缘短暂缓存，所以部署后要刷新目录
- push 到 main 后 `.github/workflows/deploy.yml` 自动跑构建、检查、上传、刷新

Netlify / Cloudflare 只在迁移前的旧站使用，新站不再接。

详细步骤见工作区技能 `deploy`。

## 域名与 DNS

DNS 用工作区脚本操作，不手点控制台：

```bash
./scripts/dns add <domain> <rr> <target>
./scripts/dns check <domain> <rr>
```

绑定流程：加 DNS → CDN 添加加速域名（源站选 OSS bucket）→ 上传证书并开启 HTTPS → `dns check` 验证。

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

## 界面设计

做任何界面（新页面、改版、调样式）必须走两步，不能直接写代码。

### 第一步：读技能判断方向

| 任务 | 读 |
|---|---|
| 落地页、品牌站、产品页整体 | `.agents/skills/design-taste/SKILL.md` |
| 组件、配色、字体、间距、动效 | `.agents/skills/ui-ux-pro-max/SKILL.md` |
| 动效库、图标库、组件库选型 | `.agents/skills/resources/SKILL.md` |

`ui-ux-pro-max` 可查询：

```bash
cd .agents/skills/ui-ux-pro-max
python3 scripts/search.py "<关键词>" --domain style|color|typography|ux|landing|icons
```

### 第二步：跑脚本卡底线

```bash
cd <工作区根>
./scripts/design-check <站点目录>
```

检查对比度、字号、图片尺寸、emoji 图标、h1 数量、meta 完整性。有硬性错误不许上线。

### 硬性规则

1. 正文对比度 ≥ 4.5:1，大字 ≥ 3:1
2. 正文字号 ≥ 16px，不使用 < 12px
3. 触控目标 ≥ 44×44px
4. 图片必须有 width/height 或 aspect-ratio
5. 不用 emoji 当图标
6. 每页只有一个 h1，标题不跳级
7. 尊重 `prefers-reduced-motion`
8. 不引入第二套设计系统

### 反模板脸

- 一屏一节，不要把所有内容挤在首屏
- 留白节奏要有变化，不要均匀网格到底
- 真实内容优先于占位图和 lorem ipsum
- 动效全站 2–3 处足够，时长 200–400ms
- 圆角收敛到 2 种，阴影 1 套

## 资源选型

完整索引：https://github.com/lawyerch-dev/dev-resources

本站点已定的选择：

| 类别 | 默认 | 说明 |
|---|---|---|
| 动效 | 原生 CSS 优先 | 复杂序列才用 `motion` |
| 图标 | `lucide` | 品牌图标用 `simple-icons` |
| 音效 | 默认不加 | 专业服务站点加音效显得不专业 |
| 组件 | 本站 `packages/shared-ui` | 不引入整套组件库 |

引入新依赖前确认：许可证友好、近半年有提交、体积可接受、有 TS 类型。

## 纪律

1. **先构建后部署**：`pnpm build` 通过再发
2. **构建必带 SITE_URL**
3. **部署用绝对路径**
4. **密钥走环境变量**：`.env` 本地，`.env.example` 占位
5. **客户信息不入库**：公开仓库必须脱敏
6. **改内容不改主题**：新增站点只动配置和内容
7. **发布后推送收录**
8. **界面先读设计技能，再跑 design-check**
