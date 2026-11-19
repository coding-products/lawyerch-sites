import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import responsiveImages from '@astro-fleet/shared-ui/utils/responsive-images.mjs';

export default defineConfig({
  site: 'https://labor.lawyerch.cn',
  integrations: [sitemap(), responsiveImages()],
  vite: { plugins: [tailwindcss()] },
  output: 'static',
});
