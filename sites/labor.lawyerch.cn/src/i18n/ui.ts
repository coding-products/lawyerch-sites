export type Lang = 'zh' | 'en';

export const languages: { code: Lang; label: string; href: string }[] = [
  { code: 'zh', label: '中文', href: '/' },
  { code: 'en', label: 'English', href: '/en/' },
];

export const ui = {
  zh: {
    nav: { home: '首页', about: '关于', services: '服务', journal: '专栏', contact: '联系' },
    cta: '预约咨询',
    mobileCta: '描述你的情况',
    footer: {
      explore: '浏览',
      services: '服务',
      contact: '联系',
      rights: '保留所有权利',
    },
    hero: {
      greeting: '你好，我是',
      name: ['陈恒', '律师'],
      intro:
        '广州执业律师，专注劳动争议与企业用工合规。从一份劳动合同的条款，到一次解除的补偿测算，再到一套员工手册的落地。',
      cta: '预约咨询',
      asideRole: ['劳动争议 · 用工合规', '广州执业'],
      asideTitle: ['劳动', '合规'],
      kpiLabel: '个劳动法服务方向',
      note: '诉讼 · 非诉 · 常年顾问',
      available: '可预约咨询',
    },
    common: {
      readMore: '阅读全文',
      allServices: '全部服务',
      allArticles: '全部文章',
      backHome: '回到首页',
      switchTo: 'English',
    },
  },
  en: {
    nav: { home: 'Home', about: 'About', services: 'Services', journal: 'Journal', contact: 'Contact' },
    cta: 'Book a consultation',
    mobileCta: 'Tell me what happened',
    footer: {
      explore: 'Explore',
      services: 'Services',
      contact: 'Contact',
      rights: 'All rights reserved',
    },
    hero: {
      greeting: 'Hello, I am',
      name: ['Chen Heng', 'Lawyer'],
      intro:
        'Guangzhou-based lawyer focused on labour disputes and employment compliance — from contract terms and severance calculations to employee handbooks that hold up in arbitration.',
      cta: 'Book a consultation',
      asideRole: ['Labour disputes · Employment compliance', 'Guangzhou'],
      asideTitle: ['Labour', 'Compliance'],
      kpiLabel: 'service areas',
      note: 'Litigation · Advisory · Retainer',
      available: 'Available for consultation',
    },
    common: {
      readMore: 'Read article',
      allServices: 'All services',
      allArticles: 'All articles',
      backHome: 'Back home',
      switchTo: '中文',
    },
  },
} as const;

export function getLangFromUrl(url: URL): Lang {
  return url.pathname.startsWith('/en') ? 'en' : 'zh';
}

export function useTranslations(lang: Lang) {
  return ui[lang];
}
