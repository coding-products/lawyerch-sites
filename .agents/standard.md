---
version: 2026-11-20.4
applies-to: 所有站点项目
---

# 站点通用规范

本文件由工作区统一维护，项目内的 `.agents/standard.md` 是它的副本。
不要直接改项目里的副本，改工作区的 `.agents/standards/site-standard.md`，然后跑 `./scripts/sync-standard`。

## 站点分类

每个站点必须归入一类，在 `site.facts.yml` 用 `region` 标明。这是所有差异的唯一开关：部署、备案、SEO、内容合规都以它为准，不要凭印象判断。

| region | 定位 | 部署 | 备案 | 主要收录 |
|---|---|---|---|---|
| `cn` | 国内站点，主战场 | 阿里云 OSS + CDN | **必须** | 百度 + Google |
| `overseas` | 海外站点，副业 | Cloudflare Pages | **不做** | Google + Bing |

判断方法：**目标用户在哪**。国内用户为主 → `cn`；海外为主、国内只是顺带能打开 → `overseas`。

- 顶层 `region` 是项目默认值，单个 `sites[]` 条目可以用自己的 `region` 覆盖
- 不写 `region` 时默认 `cn`（国内是主业），新站必须显式写明
- monorepo 允许混装：同一个仓库里，国内站和海外站各标各的
- 分类一旦定了就写进 facts，不许同一个域名在两类规则之间来回切
- 国内站内容不得镜像到海外站规避备案；海外站也不得挂国内备案号

`site.facts.yml` 里与部署相关的字段，按站点填一个：

| 字段 | 部署形态 | 用法 |
|---|---|---|
| `oss` | 阿里云 OSS + CDN | bucket 名 |
| `cloudflare` | Cloudflare Pages | 项目名 |
| `server` | ECS + nginx（`cn` 例外形态） | `ssh主机:远端目录` |
| `netlify` | 旧站遗留 | 站点名 |

### 国内站点（`cn`）

**硬性门槛，缺一条不上线：**

1. 域名注册商必须有工信部资质。境外注册商（Cloudflare Registrar、Namecheap 等）先转入万网/腾讯云，再做实名认证，持有人姓名与备案主体一致
2. 完成 ICP 备案，备案号放页脚，链接到 `beian.miit.gov.cn`
3. 备案通过后 30 日内完成公安联网备案
4. 部署到阿里云 OSS + CDN，加速区域选「仅中国大陆」
5. 百度搜索资源平台验证并填写备案号（没有备案号百度不给配额）
6. 备案接入资源（ECS / 轻量应用服务器）必须在账号内存活且包年包月，否则备案有被「取消接入」的风险

内容合规：不做经营性内容（除非有 ICP 许可证），不碰需要前置审批的行业，客户信息脱敏。

### 海外站点（`overseas`）

**定位是副业和试验，不投入国内合规成本：**

1. 不备案、不接入国内 CDN、不使用阿里云国内地域的 OSS/CDN
2. 部署在 Cloudflare Pages / Vercel / Netlify 等境外平台
3. 保证国内「能打开」，不承诺国内速度。可选的加速手段只有香港/新加坡反代，**不得为此去备案**
4. 页脚不放备案号，不挪用国内站的备案信息
5. 只做 Google / Bing / IndexNow 收录，不做百度
6. 默认选 Cloudflare：免费、节点多，国内虽慢但可达

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

按 `region` 分两套，不混用。`cn` 内部的 OSS 与 ECS 两种形态，按 facts 字段区分。

### 国内站点（`cn`）

默认走阿里云 OSS + CDN。构建产物上传到站点对应的 bucket，CDN 负责域名、HTTPS 与国内加速。

```bash
cd sites/<project>
pnpm build
./scripts/deploy-oss sites/<domain>
```

- bucket 命名：域名里的点换成横线（`labor.lawyerch.cn` → `labor-lawyerch-cn`）
- bucket 要开静态网站托管：默认首页 `index.html`、错误页 `404.html`、`SupportSubDir=true`
- 账号若开了「阻止公共访问」，需在 bucket 上关掉，否则匿名访问返回 403
- CDN 缓存：`css`/`js` 长缓存；HTML 即便设了 `ttl=0` 仍会被边缘短暂缓存，所以部署后要刷新目录
- push 到 main 后 `.github/workflows/deploy.yml` 自动跑构建、检查、上传、刷新

详细步骤见工作区技能 `deploy`。

### ECS + nginx 例外形态（`cn`）

只给两种情况用：需要常驻进程（动态接口、后台），或已经有服务器且迁移 OSS 不划算。纯静态内容站默认还是走 OSS。

前提与 OSS 形态相同：ICP 备案、公安联网备案、HTTPS、页脚备案号，一条不少。区别只在产物怎么上线：

```yaml
sites:
  - domain: example.cn
    path: .
    server: <ssh主机>:<远端目录>
```

```bash
./scripts/deploy-ecs sites/<project>          # 预演，只打印 rsync 命令
./scripts/deploy-ecs sites/<project> --yes    # 实际同步（rsync --delete）
```

- `server` 冒号前是 ssh 主机，可以写 `~/.ssh/config` 里的别名；冒号后是 nginx 站点根目录
- 源目录优先 `dist/`，没有就用 `public/`
- 不建 OSS bucket，不走 `deploy-oss`
- 加速可选阿里云 CDN 回源 ECS；用 Cloudflare 代理时国内速度不承诺，且不能因此省掉备案
- 这台机器要自己管：进程守护、日志、证书续期、磁盘，都在工作区脚本之外

### 海外站点（`overseas`）

Cloudflare Pages。推 GitHub 自动构建部署，不碰阿里云。

- 项目名与 facts 的 `cloudflare` 字段一致
- 自定义域在 Cloudflare 绑定，DNS 由 Cloudflare 托管
- 缓存交给 Cloudflare，不单独配 CDN
- 发布前压缩资源：图片转 WebP/AVIF，首屏静态资源 ≤ 300KB
- 不接国内 CDN，不买国内服务器，不为加速去备案

## 域名与 DNS

`./scripts/dns` 面向 lawyerch.cn 的阿里云云解析，只用于国内站点。

### 国内站点（`cn`）

DNS 用工作区脚本操作，不手点控制台：

```bash
./scripts/dns add <domain> <rr> <target>
./scripts/dns check <domain> <rr>
```

绑定流程：加 DNS → CDN 添加加速域名（源站选 OSS bucket）→ 上传证书并开启 HTTPS → `dns check` 验证。

域名注册商必须是境内有资质的服务商；境外注册的先转入万网，再做实名认证。

### 海外站点（`overseas`）

DNS 交给 Cloudflare 托管，不用工作区脚本。域名可以在任意注册商，不需要转入境内，也不需要实名。

## SEO

### 国内站点（`cn`）

1. 构建时 `SITE_URL` 等于正式域名
2. 百度搜索资源平台验证 + 填备案号（否则配额为 0）
3. Google Search Console 验证 + 提交 `sitemap-index.xml`
4. IndexNow 提交（Bing / Yandex / Naver）
5. 主动推送见工作区技能 `seo`

### 海外站点（`overseas`）

1. 构建时 `SITE_URL` 等于正式域名
2. Google Search Console 验证 + 提交 sitemap
3. IndexNow 提交（Bing / Yandex / Naver）
4. 不做百度提交，不填备案号

每篇新内容发布后当天推送一次。

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

做任何界面（新页面、改版、调样式）都不能直接写代码：先定方向，再跑检查。

方向判断在工作区技能里（`design-taste` / `ui-ux-pro-max` / `resources`），只在打开整个工作区时可用。单独克隆项目时没有这几份技能，按下面的硬性规则自查。

### 必跑检查

```bash
cd <工作区根>
./scripts/design-check <站点目录>
```

检查这些项，有硬性错误不许上线：

| 自动检查 | 说明 |
|---|---|
| 对比度 | 读 `src/config/theme.ts` 的前景/背景色 |
| 字号 | CSS 中 `font-size` < 12px 直接报错 |
| 动效降级 | 有 `animation`/`transition` 但没写 `prefers-reduced-motion` 报错 |
| 图片尺寸 | 缺 `width`/`height`/`aspect-ratio` 超过 20% 报错 |
| emoji 图标、多个 h1、缺 viewport/description | 报错 |

自动检查之外，上线前人工确认：触控目标 ≥ 44×44、圆角不超过 2 种、阴影只有 1 套、动效全站 2–3 处且时长 200–400ms。这些靠肉眼和 `design-review` 技能，不要假装脚本能覆盖。

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

完整索引：https://github.com/coding-products/dev-resources

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
8. **界面先定方向，再跑 design-check**
9. **改站点先本地确认**：界面和内容调整只在本地预览，确认后再 push 部署，不频繁上线
10. **自动化噪音直接修**：Actions 弃用告警、依赖升级、配额报错、日志噪音，发现就改，不用逐条确认
11. **先定分类再动手**：新站先写 `region`，按类执行部署和 SEO，两套规则不混用
