# lawyerch-sites · Agent 工作手册

多站点 Astro monorepo。一个主站 + 多个领域站，共用一套主题。

## 站点清单

| 站点 | 路径 | 域名 | Netlify 项目 |
|---|---|---|---|
| 主站 | `sites/lawyerch.cn` | lawyerch.cn | `lawyerch-cn` |
| 劳动法 | `sites/labor.lawyerch.cn` | labor.lawyerch.cn | `labor-lawyerch-cn` |
| 模板 | `sites/starter` | — | 不部署 |

新增站点后必须更新这张表。

## 技术栈

- Astro 7 + Tailwind CSS 4
- SWP Freelancer Portfolio 设计系统（`src/styles/tokens.css`）
- pnpm workspace + Turborepo
- 内容：Markdown + Astro Content Collections
- 多语言：`src/i18n/ui.ts` + `/en/` 路由
- 主题：每站 `src/config/theme.ts` 覆盖 CSS 变量

## 依赖的 CLI

| CLI | 用途 | 检查 | 安装 |
|---|---|---|---|
| `pnpm` | 依赖安装、构建 | `pnpm -v` | `brew install pnpm` |
| `netlify` | 部署、域名绑定 | `netlify status` | `brew install netlify-cli` |
| `wrangler` | Cloudflare 备用部署 | `wrangler whoami` | `brew install wrangler` |
| `aliyun` | DNS 解析（在 `我的网站/scripts/dns`） | `aliyun alidns DescribeDomains --PageSize 1` | `brew install aliyun-cli` |
| `git` / `gh` | 版本管理 | `gh auth status` | `brew install gh` |

## 常用命令

```bash
# 安装（仓库根目录）
pnpm install

# 开发
pnpm dev --filter=lawyerch.cn
pnpm dev --filter=labor.lawyerch.cn

# 构建（必须带正式域名）
cd sites/lawyerch.cn && SITE_URL=https://lawyerch.cn pnpm build

# 部署
netlify deploy --dir=$(pwd)/dist --prod --site=lawyerch-cn --no-build

# SEO 推送
SITE_URL=https://lawyerch.cn BAIDU_TOKEN=... node scripts/seo-push.mjs
```

## 工作纪律

1. **改内容不改主题**：新增站点只改 `site.ts`、`theme.ts`、`i18n/ui.ts`、`content/`
2. **构建必带 SITE_URL**：否则 canonical 和 sitemap 指向错误
3. **部署用绝对路径**：`--dir=$(pwd)/dist`，相对路径会被解析到 monorepo 根
4. **先构建后部署**：`pnpm build` 通过再发
5. **不把密钥写进代码**：环境变量 + `.env.example`
6. **客户信息不入库**：文章和案例必须脱敏
7. **发布后推送收录**：见 site-seo 技能

## 技能

- `.agents/skills/site-dev` — 新建站点、主题、i18n、内容、预览
- `.agents/skills/site-deploy` — Netlify / Cloudflare 部署、域名、证书
- `.agents/skills/site-seo` — 百度、谷歌、IndexNow 收录

## 外部资源

- 仓库：https://github.com/lawyerch-dev/lawyerch-sites
- 主站：https://lawyerch.cn
- 劳动法站：https://labor.lawyerch.cn
