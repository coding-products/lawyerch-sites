# lawyerch-sites

多站点 Astro monorepo。一套主题，多个领域站，各自独立域名与部署。

基于 [astro-fleet](https://github.com/Indivar/astro-fleet)（MIT）。

## 站点

| 站点 | 域名 | 定位 | Netlify 项目 |
|---|---|---|---|
| `sites/lawyerch.cn` | lawyerch.cn | 个人品牌首页 | `lawyerch-cn` |
| `sites/labor.lawyerch.cn` | labor.lawyerch.cn | 劳动法领域站 | `labor-lawyerch-cn` |
| `templates/starter` | — | 新站点模板，不部署 | — |

## 快速开始

```bash
pnpm install

# 开发单个站
pnpm dev --filter=lawyerch.cn

# 构建（必须带正式域名）
cd sites/lawyerch.cn
SITE_URL=https://lawyerch.cn pnpm build

# 部署
netlify deploy --dir=$(pwd)/dist --prod --site=lawyerch-cn --no-build
```

## 结构

```
sites/
├── lawyerch.cn/          主站
└── labor.lawyerch.cn/    劳动法站
templates/
└── starter/              新站模板（不部署，不参与 turbo 构建）
packages/
├── shared-ui/            共用布局、组件、设计 tokens
└── config/               共用 Astro/TS 配置
```

每个站点：

```
src/
├── config/site.ts        站名、描述、联系方式
├── config/theme.ts       品牌色
├── i18n/ui.ts            中英字典
├── content/              services/、blog/（按语言分目录）
├── data/                 首页数据
└── pages/                路由（中文根路径，英文 /en/）
```

## 新增站点

```bash
./scripts/new-site.sh <domain> corporate
pnpm install
```

然后改 `site.ts`、`theme.ts`、`astro.config.mjs`、`i18n/ui.ts`。

## 部署

两个平台配置都已就绪：

- **Netlify**（主用）：`netlify.toml`，国内访问稳定
- **Cloudflare Workers**（备用）：`wrangler.jsonc`，`workers.dev` 国内不通，需绑域名

## 详细文档

- `AGENTS.md` — Agent 工作手册（结构、命令、纪律）
- `.agents/skills/` — site-dev / site-deploy / site-seo 技能
- `docs/` — 上游 astro-fleet 的组件、i18n、图片、SEO 文档

## 许可

代码 MIT。站点内容版权归作者。
