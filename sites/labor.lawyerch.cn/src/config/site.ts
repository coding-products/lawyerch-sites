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
  name: '劳动法 · 陈恒律师',

  logo: {
    header: { src: '/images/header-logo.webp', width: 164, height: 58 },
    footer: { src: '/images/footer-logo.webp', width: 164, height: 58 },
  },

  author: '陈恒律师',
  role: '劳动争议 · 企业用工合规',
  title: '劳动法 · 陈恒律师 — 劳动争议与用工合规',
  description:
    '广州执业律师，专注劳动争议代理与企业用工合规。劳动合同、解除赔偿、加班费、工伤、竞业限制，以及员工手册与规章制度的合规审查。',
  url: import.meta.env.SITE ?? 'https://labor.lawyerch.cn',
  ogImage: '/og-default.png',
  locale: 'zh-CN',
  themeColor: '#c9a227',

  contact: {
    email: 'lawyerch@foxmail.com',
    phone: '',
    phoneHref: '',
    location: '广州',
    availability: '可预约咨询',
    formEndpoint: '',
  },

  social: [],

  about:
    '长期处理劳动争议案件，代理劳动者与用人单位两侧，熟悉仲裁与诉讼的裁判尺度；同时为企业提供用工合规、规章制度审查与裁员方案设计。',

  copyrightHolder: '陈恒律师',
};

export default siteConfig;
