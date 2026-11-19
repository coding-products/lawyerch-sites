import type { SiteConfig } from '~/types';

/**
 * ============================================================
 *  THE ONE FILE TO EDIT FIRST
 * ============================================================
 *
 * Everything here is demo content. Replace it with your own and the
 * header, footer, hero, contact page, metadata, structured data, RSS
 * feed and sitemap all follow.
 *
 * The canonical URL lives in `astro.config.mjs` (`site`) and is read
 * back here through `import.meta.env.SITE`.
 */
export const siteConfig: SiteConfig = {
  name: '陈恒律师',

  logo: {
    header: { src: '/images/header-logo.webp', width: 164, height: 58 },
    footer: { src: '/images/footer-logo.webp', width: 164, height: 58 },
  },

  author: '陈恒律师',
  role: '执业律师 · AI 独立开发者',
  title: '陈恒律师 — 执业律师 · AI 独立开发者',
  description:
    '广州执业律师，用代码做法律工具。法律科技与 AI 开发两条线：知识资产、法律工具、开源项目。',
  url: import.meta.env.SITE ?? 'https://lawyerch.cn',
  ogImage: '/og-default.png',
  locale: 'zh-CN',
  themeColor: '#c9a227',

  contact: {
    email: 'lawyerch@foxmail.com',
    phone: '',
    phoneHref: '',
    location: '广州',
    availability: '开放交流与合作',
    formEndpoint: '',
  },

  social: [],

  about:
    '执业律师，写代码是长期爱好。把法律工作里重复的部分交给工具，把判断留给人。',
  aboutEn:
    'Lawyer by profession, developer by habit. I turn repetitive legal work into tools, and keep the judgement human.',

  copyrightHolder: '陈恒律师',
};

export default siteConfig;
