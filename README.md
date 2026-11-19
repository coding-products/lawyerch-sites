# lawyerch-sites

多领域站点集合。一个 Astro monorepo，多站点独立域名、独立 SEO，共用组件与构建流程。

基于 [astro-fleet](https://github.com/Indivar/astro-fleet)（MIT）。

## 站点

| 站点 | 域名 | 定位 |
|---|---|---|
| 劳动法 | `labor.lawyerch.cn` | 劳动争议、用工合规、规章制度、裁员方案 |

## 开发

```bash
pnpm install
pnpm dev --filter=labor.lawyerch.cn
```

构建单个站点：

```bash
pnpm build --filter=labor.lawyerch.cn
```

## 新增站点

```bash
./scripts/new-site.sh <domain> [corporate|saas|warm]
pnpm install
```

然后修改三处：

1. `sites/<domain>/src/lib/site-config.ts` — 站名、导航、页脚、联系方式
2. `sites/<domain>/astro.config.mjs` — `site` 域名
3. `sites/<domain>/public/robots.txt` — sitemap 地址

## 目录

```
sites/
├── labor.lawyerch.cn/      # 劳动法站
│   ├── src/content/insights/   # 文章（Markdown）
│   ├── src/lib/site-config.ts  # 品牌与导航
│   └── astro.config.mjs
└── starter/                # 新站点模板，勿直接部署
packages/
├── shared-ui/              # 共用布局、组件、设计 tokens
└── config/                 # 共用 Astro/TS 配置
```

## 部署

每个站点独立构建、独立部署。以 Cloudflare Pages 为例：

- Build command：`pnpm build --filter=labor.lawyerch.cn`
- Output directory：`sites/labor.lawyerch.cn/dist`
- 环境变量：无（纯静态）
- 绑定独立域名，开启自动 HTTPS

Vercel / Netlify 同理，构建命令和输出目录一致。

## 内容规范

- 文章放在 `sites/<domain>/src/content/insights/`
- frontmatter：`title`、`description`、`date`、`tags`、`draft`
- 标题用真实提问句，方便搜索与 AI 检索
- 每篇结尾注明「一般信息，不构成法律意见」
- 客户信息必须脱敏

## 原则

- 每个站点只做一个领域，信息架构独立
- 共用组件，不共用品牌
- 跨站内容不重复；重复内容必须设 canonical
- 公开内容不等于法律意见
