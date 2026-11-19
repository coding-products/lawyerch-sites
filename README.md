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

每个站点独立构建、独立部署，两套配置都已就绪。

### Netlify（国内访问更稳）

站点：`labor-lawyerch-cn` → https://labor-lawyerch-cn.netlify.app

```bash
cd sites/labor.lawyerch.cn
pnpm build
netlify deploy --dir=dist --prod --site=labor-lawyerch-cn --no-build
```

`netlify.toml` 已配置 `base`、`publish` 和 404 规则。

### Cloudflare Workers

站点：`labor-lawyerch-cn`

```bash
cd sites/labor.lawyerch.cn
pnpm build
wrangler deploy
```

`wrangler.jsonc` 已配置静态资产目录和 404 处理。

> 注意：`*.workers.dev` 在国内直连不通，需要绑定自定义域名或仅作海外备用。

### 绑定自定义域名

以 `labor.lawyerch.cn` 为例（DNS 在阿里云）：

- **Netlify**：在 Netlify 后台添加 Custom domain，阿里云 DNS 加 CNAME 指向 `<site>.netlify.app`
- **Cloudflare**：域名需托管在 Cloudflare，或在阿里云加 CNAME 并在 Cloudflare 配置 Custom Hostname

两套都支持，最终选一个主用即可。

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
