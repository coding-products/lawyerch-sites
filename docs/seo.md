# SEO 收录操作

## 当前状态

- 站点：https://labor-lawyerch-cn.netlify.app
- sitemap：https://labor-lawyerch-cn.netlify.app/sitemap-index.xml
- 主动提交：IndexNow 已提交 28 个 URL（202 Accepted）
- 百度 / 谷歌：需要账号验证后提交

> 注意：当前 canonical 与 sitemap 使用 Netlify 地址。绑定 `labor.lawyerch.cn` 后，用
> `SITE_URL=https://labor.lawyerch.cn pnpm build` 重新构建并重新提交。

## IndexNow（Bing / Yandex / Naver）

已配置完成。

- key 文件：`public/d7ce9acc8abb214e731115ff910ecd19.txt`
- 提交脚本：`scripts/seo-push.mjs`

每次发布后执行：

```bash
SITE_URL=https://labor-lawyerch-cn.netlify.app node scripts/seo-push.mjs
```

## 百度搜索资源平台

### 1. 验证站点

1. 打开 https://ziyuan.baidu.com/
2. 添加站点 `https://labor-lawyerch-cn.netlify.app`（绑域名后用新域名）
3. 选择「HTML 标签验证」或「文件验证」
4. 标签验证：把 meta 标签加到 `src/layouts/BaseLayout.astro` 的 `<head>`
5. 文件验证：把百度给的文件放到 `public/`

### 2. 提交 sitemap

资源提交 → sitemap → 填写：

```
https://labor-lawyerch-cn.netlify.app/sitemap-index.xml
```

### 3. 主动推送（普通收录）

获取 token 后执行：

```bash
BAIDU_TOKEN=你的token SITE_URL=https://labor-lawyerch-cn.netlify.app node scripts/seo-push.mjs
```

每天可推送一次，优先推新文章和服务页。

## Google Search Console

### 1. 验证站点

1. 打开 https://search.google.com/search-console
2. 添加「网址前缀」资源
3. 选择 HTML 标签验证，把 meta 标签加到 `BaseLayout.astro`
4. 或使用 DNS 验证（绑域名后更方便）

### 2. 提交 sitemap

索引 → 站点地图 → 提交：

```
sitemap-index.xml
```

### 3. 检查收录

使用「网址检查」逐个提交重要页面：

- 首页
- 6 个服务页
- 2 篇文章

### 4. 可选：Indexing API

Google Indexing API 主要面向招聘和直播内容，普通文章用 Search Console 即可。如果仍要接入，需要：

1. Google Cloud 创建服务账号
2. 下载 JSON 密钥，不要提交到仓库
3. 在 Search Console 把服务账号加为所有者
4. 用脚本换取 OAuth token 后调用 `https://indexing.googleapis.com/v3/urlNotifications:publish`

## 绑域名后的切换

1. 阿里云 DNS 加 CNAME：`labor` → `labor-lawyerch-cn.netlify.app`
2. Netlify 添加 Custom domain，开启 HTTPS
3. 重新构建：

```bash
SITE_URL=https://labor.lawyerch.cn pnpm build
netlify deploy --dir=dist --prod --site=labor-lawyerch-cn --no-build
```

4. 在百度和 Google 重新提交新域名的 sitemap
5. 旧 Netlify 地址会 301 到新域名（Netlify 自动处理）

## 收录检查清单

- [ ] 百度验证通过
- [ ] 百度 sitemap 已提交
- [ ] Google 验证通过
- [ ] Google sitemap 已提交
- [ ] IndexNow 已提交
- [ ] 百度搜「site:labor-lawyerch-cn.netlify.app」有结果
- [ ] Google 搜「site:labor-lawyerch-cn.netlify.app」有结果
- [ ] 绑域名后重复以上步骤
