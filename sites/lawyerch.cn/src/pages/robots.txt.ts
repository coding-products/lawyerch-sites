import type { APIContext } from 'astro';

/**
 * Generated rather than static so the sitemap URL always matches the
 * `site` value configured in `astro.config.mjs`.
 */
export function GET(context: APIContext) {
  // 百度明确表示索引型 sitemap（sitemap-index.xml）不予处理，并会阻断新文件提交，
  // 所以直接指向真正的 urlset 文件。站点规模远小于单个 sitemap 上限，无需再拆分。
  const sitemap = new URL('sitemap-0.xml', context.site ?? 'http://localhost:4321').href;

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
}
