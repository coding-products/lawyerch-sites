---
name: site-seo
description: 站点上线后做搜索引擎收录时使用。覆盖百度、谷歌、IndexNow 的验证、sitemap 提交和主动推送。
---

# SEO 收录

## 何时使用

- 新站点上线
- 绑定或切换域名后
- 发布新文章后主动推送
- 排查收录、配额、验证问题

## 顺序

1. 确认 `SITE_URL` 与正式域名一致
2. 构建并部署
3. 验证站点归属
4. 提交 sitemap
5. 主动推送 URL

## 1. 构建一致性

```bash
cd sites/<domain>
SITE_URL=https://<domain> pnpm build
grep -o '<loc>[^<]*</loc>' dist/sitemap-0.xml | head -3
```

sitemap 中的域名必须等于正式域名。绑定域名后必须重新构建，否则 canonical 指向错误。

## 2. Google Search Console

1. 打开 https://search.google.com/search-console
2. 添加「网址前缀」资源 `https://<domain>/`
3. 验证方式：
   - HTML 标签：标签加到 `src/layouts/BaseLayout.astro` 的 `<head>`
   - 域名资源可用 DNS 验证，覆盖所有子域
4. 验证后提交 `sitemap-index.xml`
5. 用「网址检查」逐个提交重要页面

验证标签示例（不要提交具体值到公开仓库）：

```html
<meta name="google-site-verification" content="..." />
```

## 3. 百度搜索资源平台

1. https://ziyuan.baidu.com/site/siteadd
2. 协议选 `https://`，填域名
3. 可能触发滑块验证，需要人工拖动
4. 站点领域选「政策法规」「生活服务」（法律站）
5. 验证方式选 HTML 标签，标签加到 `BaseLayout.astro`
6. 验证通过后填「主体备案号」，否则配额为 0

备案号在阿里云备案控制台可查，格式如 `粤ICP备2024267441号`。

### 主动推送

```bash
cd sites/<domain>
SITE_URL=https://<domain> BAIDU_TOKEN=... node scripts/seo-push.mjs
```

脚本行为：

- 读 `dist/sitemap-0.xml`
- IndexNow 提交全部 URL
- 百度只推前 10 条（配额通常 10 条/天）

百度返回：

| 返回 | 含义 |
|---|---|
| `{"success":N}` | 成功 N 条 |
| `{"not_same_site":[...]}` | URL 不属于该站点，域名不对 |
| `{"error":400,"message":"over quota"}` | 今日配额用完，明天再推 |
| `{"remain":N}` | 剩余配额 |

手动推送：

```bash
grep -o '<loc>[^<]*</loc>' dist/sitemap-0.xml | sed 's|</\?loc>||g' > /tmp/urls.txt
curl -H 'Content-Type: text/plain' --data-binary @/tmp/urls.txt \
  'http://data.zz.baidu.com/urls?site=https://<domain>&token=<token>'
```

## 4. IndexNow（Bing / Yandex / Naver）

每个站点需要一个 key：

1. 生成 32 位 hex：`openssl rand -hex 16`
2. 写入 `public/<key>.txt`，内容与文件名一致
3. 部署后确认可访问 `https://<domain>/<key>.txt`
4. 运行 `scripts/seo-push.mjs`

返回 `202 Accepted` 即成功。

## 5. 结构化数据

已内置：

- `Person`、`WebSite`、`BreadcrumbList`
- `LegalService`（首页）
- `BlogPosting`（文章）
- `FAQPage`（FAQ 区块）

新增页面类型时，在 `src/lib/jsonld.ts` 加 schema，并在页面通过 `jsonLd` prop 传入。

## 6. 验证清单

```bash
# canonical
curl -sS https://<domain>/ | grep -o '<link rel="canonical"[^>]*>'

# hreflang
curl -sS https://<domain>/en/ | grep -o 'hreflang="[^"]*"'

# sitemap
curl -sS -o /dev/null -w "%{http_code}\n" https://<domain>/sitemap-index.xml

# robots
curl -sS https://<domain>/robots.txt

# 结构化数据
curl -sS https://<domain>/ | grep -o '"@type":"[^"]*"' | sort -u
```

## 7. 配额与节奏

- 百度：普通收录约 10 条/天，sitemap 配额独立；新站先等备案审核
- Google：sitemap 提交后 1–7 天开始抓取
- IndexNow：即时提交，Bing 通常几小时内抓取

发布节奏建议：每周 1 篇新文章，发布后当天推送。
