import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * 主动推送 URL 到搜索引擎。
 *
 * 用法：
 *   SITE_URL=https://labor-lawyerch-cn.netlify.app node scripts/seo-push.mjs
 *
 * 环境变量：
 *   SITE_URL        站点地址（默认取 dist/sitemap-0.xml 中的域名）
 *   BAIDU_TOKEN     百度搜索资源平台「普通收录」token
 *   INDEXNOW_KEY    IndexNow key（默认读取 public/ 下的 *.txt）
 */

const root = process.cwd();
const dist = path.join(root, 'dist');
const sitemapPath = path.join(dist, 'sitemap-0.xml');

async function readUrls() {
  const xml = await fs.readFile(sitemapPath, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function indexNow(urls, siteUrl) {
  const host = new URL(siteUrl).host;
  const files = await fs.readdir(path.join(root, 'public'));
  const keyFile = files.find((f) => f.endsWith('.txt') && /^[a-f0-9]{32}\.txt$/.test(f));
  if (!keyFile) {
    console.log('IndexNow: 未找到 key 文件，跳过');
    return;
  }
  const key = keyFile.replace(/\.txt$/, '');
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `https://${host}/${keyFile}`,
      urlList: urls,
    }),
  });
  console.log(`IndexNow: ${res.status} ${res.statusText} (${urls.length} URLs)`);
}

async function baidu(urls, siteUrl) {
  const token = process.env.BAIDU_TOKEN;
  if (!token) {
    console.log('百度: 未设置 BAIDU_TOKEN，跳过');
    return;
  }
  const res = await fetch(
    `https://data.zz.baidu.com/urls?site=${encodeURIComponent(siteUrl)}&token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: urls.join('\n'),
    }
  );
  console.log(`百度: ${res.status} ${await res.text()}`);
}

async function main() {
  const urls = await readUrls();
  const siteUrl = process.env.SITE_URL ?? new URL(urls[0]).origin;
  console.log(`站点: ${siteUrl}`);
  console.log(`URL 数: ${urls.length}`);
  await indexNow(urls, siteUrl);
  await baidu(urls, siteUrl);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
