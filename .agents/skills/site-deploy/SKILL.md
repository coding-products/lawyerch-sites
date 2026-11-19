---
name: site-deploy
description: 部署站点、绑定域名、处理证书时使用。覆盖 Netlify、Cloudflare Workers、自定义域名和回滚。
---

# 站点部署

## 何时使用

- 发布新版本
- 新增 Netlify / Cloudflare 站点
- 绑定或切换自定义域名
- 排查证书、404、部署失败

## 前置检查

```bash
cd sites/<domain>
SITE_URL=https://<domain> pnpm build
```

构建必须通过，且 `dist/` 里有 `sitemap-index.xml` 和 `index.html`。

## Netlify（主用）

项目已登录，站点：

| 站点 | Netlify 项目名 | 域名 |
|---|---|---|
| 主站 | `lawyerch-cn` | `lawyerch.cn` |
| 劳动法 | `labor-lawyerch-cn` | `labor.lawyerch.cn` |

部署：

```bash
cd sites/<domain>
SITE_URL=https://<domain> pnpm build
netlify deploy --dir=$(pwd)/dist --prod --site=<netlify-site> --no-build
```

**必须用 `--dir=$(pwd)/dist` 绝对路径**。在 monorepo 里用相对 `--dir=dist` 会被解析到仓库根，报：
`The deploy directory ".../lawyerch-sites/dist" has not been found`。

首次创建站点：

```bash
netlify deploy --dir=$(pwd)/dist --prod --site-name=<name>
```

如果提示 build 失败，加 `--no-build`，或检查站点 UI 里的 base/publish 配置。

## 绑定域名

DNS 用工作区脚本 `我的网站/scripts/dns` 操作（不在本仓库内），不要手点控制台。

```bash
cd ~/Documents/vibecoding/我的网站

# 子域
./scripts/dns add lawyerch.cn contract contract-lawyerch-cn.netlify.app

# 主域
./scripts/dns set lawyerch.cn @ lawyerch-cn.netlify.app

# 查看现有记录
./scripts/dns records lawyerch.cn
```

然后在 Netlify 项目 → Domain management → Add a domain，等待证书签发。

验证：

```bash
./scripts/dns check lawyerch.cn contract
```

输出应包含：CNAME 指向 netlify.app、HTTPS 200、证书 `CN=<domain>`（Let's Encrypt）。

### 现有解析

| 主机记录 | 类型 | 值 |
|---|---|---|
| `@` | CNAME | `lawyerch-cn.netlify.app` |
| `www` | CNAME | `lawyerch-cn.netlify.app` |
| `labor` | CNAME | `labor-lawyerch-cn.netlify.app` |

新增站点时，按 `./scripts/dns add lawyerch.cn <rr> <site>.netlify.app` 加一条即可。

## Cloudflare Workers（备用）

`wrangler.jsonc` 已配置静态资产：

```bash
cd sites/<domain>
SITE_URL=https://<domain> pnpm build
wrangler deploy
```

注意：`*.workers.dev` 国内直连不通，只作海外备用或绑定自定义域名后使用。

## 旧服务器（已弃用）

`lawyerch.cn` 曾经指向阿里云 `8.134.251.42`，站点已下线。除非明确要求，不要再用 SSH 部署。

## 回滚

Netlify 后台 → Deploys → 选择上一个成功部署 → Publish deploy。

## 常见问题

| 现象 | 原因 | 处理 |
|---|---|---|
| `deploy directory not found` | 相对路径被解析到 monorepo 根 | 用 `--dir=$(pwd)/dist` |
| build 失败，publish 路径重复 | 站点 UI 的 base 配置错误 | 清空 base，或用 `--no-build` |
| 证书 self-signed | DNS 还指向旧服务器 | 改 CNAME 到 Netlify |
| `workers.dev` 超时 | 国内网络限制 | 用 Netlify 或绑域名 |
| 部署成功但页面旧 | CDN 缓存 | 等 1 分钟或强制刷新 |
