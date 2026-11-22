import siteConfig from '~/config/site';

/**
 * ============================================================
 *  首页 · 全部内容都在这里
 * ============================================================
 *
 * 分块：名片带 / 线框首屏 / 人像 + 折叠资历 / 大标题列表 / 联系区。
 *
 * 结构完整、内容可替换：
 *   - 想删掉某一块，把对应数组清空即可（组件会自动不渲染）
 *   - 姓名、头衔、机构、著作这类事实请填你自己的
 *   - 图片 src 留空会显示占位框，不留空洞
 */

export interface ContactRow {
  /** 左侧小标签，如 TEL / MAIL / GITHUB */
  label: string;
  /** 右侧显示值 */
  value: string;
  /** 链接地址，留空则不可点击 */
  href?: string;
}

export interface ActionItem {
  label: string;
  href?: string;
  /** 主按钮（白底红字）只有一个 */
  primary?: boolean;
  /**
   * 特殊动作：
   *   'vcard' — 点击生成并下载 .vcf 通讯录名片
   */
  kind?: 'vcard';
}

export interface CredentialGroup {
  title: string;
  /** 展开后的条目，每行一条 */
  items: string[];
}

export interface ModuleItem {
  title: string;
  note: string;
  href: string;
}

export interface SocialItem {
  label: string;
  handle: string;
  href: string;
  /** 图标名，对应 components/stage/SocialIcon.astro 里的键 */
  icon: 'github' | 'mail' | 'wechat' | 'xhs' | 'douyin' | 'video' | 'calendar' | 'link';
}

export const stage = {
  /* ---------- 品牌与导航 ---------- */
  brand: {
    nameZh: '陈恒律师',
    nameEn: 'CHEN HENG',
    /** 页头字标，留空则只显示 nameZh */
    logoText: '陈恒律师',
  },

  nav: [
    { label: '首页', href: '/' },
    { label: '法律产品', href: '/#legal-products' },
    { label: '技术产品', href: '/#tech-products' },
    { label: '劳动法', href: 'https://labor.lawyerch.cn/' },
    { label: '关于', href: '/about/' },
    { label: '联系', href: '/contact/' },
  ],

  navGithub: 'https://github.com/lawyerch-dev',

  /* ---------- 红色名片带 ---------- */
  lid: {
    avatar: {
      /** 建议方形，会裁成圆形。留空显示姓氏首字 */
      src: '',
      alt: '陈恒律师',
      fallback: '陈',
    },
    nameZh: '陈恒',
    nameEn: 'CHEN HENG',
    roles: ['律师', '法律AI工程师', '法律AI内容创作者'],
    contacts: [
      { label: 'TEL', value: '—', href: '' },
      { label: 'MAIL', value: 'lawyerch@foxmail.com', href: `mailto:${siteConfig.contact.email}` },
      { label: 'GITHUB', value: 'lawyerch-dev', href: 'https://github.com/lawyerch-dev' },
    ] as ContactRow[],
    actions: [
      { label: '存入通讯录', kind: 'vcard', primary: true },
      { label: '发邮件', href: `mailto:${siteConfig.contact.email}` },
    ] as ActionItem[],

    /** 「存入通讯录」下载的 .vcf 内容，留空字段自动省略 */
    vcard: {
      /** 文件名（不含 .vcf） */
      filename: 'chen-heng',
      /** 姓氏 / 名字，用于 N 字段排序 */
      familyName: '陈',
      givenName: '恒',
      /** 单位与职位，可留空 */
      org: '',
      title: '执业律师',
      email: siteConfig.contact.email,
      url: 'https://lawyerch.cn',
      /** 电话，留空则 vCard 里不写 */
      tel: '',
      /** 城市，写入 ADR 字段 */
      city: '广州',
    },
    qr: {
      src: '',
      alt: '微信二维码',
      /** 二维码下方说明，留空不显示 */
      note: '',
    },
    lang: { zh: '中', en: 'EN', current: 'zh' as const },
  },

  /* ---------- 首屏大标语 ---------- */
  hero: {
    kicker: 'CHEN HENG · LAWYER',
    /** 每项一行，会渲染成两个句子块 */
    lines: ['把法律经验，写进代码；', '把判断，留给人。'],
    lede:
      '广州执业律师，专注劳动争议与企业用工合规。白天处理案件与合同，晚上把重复的部分做成工具——文档脱敏、AI 技能、领域站点，都开源放在 GitHub 上。',
    cue: 'SCROLL',
  },

  /* ---------- 人像 + 资历 ---------- */
  about: {
    photo: {
      /** 竖版人像，建议 3:4 或 4:5，白底或透明底抠图 */
      src: '',
      alt: '陈恒律师',
      fallback: '陈',
    },
    nameZh: '陈恒',
    nameEn: 'CHEN HENG · LAWYER',
    /** 资历折叠项，第一条默认展开 */
    credentials: [
      {
        title: '律师',
        items: [
          '广州执业律师，专注劳动争议与企业用工合规。',
          '劳动争议仲裁与诉讼、企业用工合规审查、规章制度与裁员方案。',
        ],
      },
      {
        title: '法律AI工程师',
        items: [
          'skills-for-legal：中国法实务 AI 技能集，开源。',
          'doc-anonymizer：本地文档脱敏工具。',
          'dev-resources：动效 / 图标 / 组件索引。',
        ],
      },
      {
        title: '法律AI内容创作者',
        items: ['待补充：你的专栏、公众号或课程信息。'],
      },
    ] as CredentialGroup[],
  },

  /* ---------- 全部内容 ---------- */
  modules: {
    title: '全部内容',
    items: [
      {
        title: '法律产品',
        note: '把法律经验做成可复用的工具，面向法律人和做法律产品的开发者。',
        href: '#legal-products',
      },
      {
        title: '技术产品',
        note: '文档处理、桌面应用、Agent 工具链，以及一份开发资源索引。',
        href: '#tech-products',
      },
      {
        title: '劳动法站',
        note: '劳动争议与企业用工合规的独立站点，持续更新。',
        href: 'https://labor.lawyerch.cn/',
      },
      {
        title: '关于我',
        note: '执业经历、写代码这条线，以及为什么把两件事放在一起。',
        href: '/about/',
      },
    ] as ModuleItem[],
  },

  /* ---------- 联系与关注 ---------- */
  contact: {
    title: '联系与关注',
    note: 'CONTACT · SOCIAL',
    items: [
      { label: 'GitHub', handle: '@lawyerch-dev', href: 'https://github.com/lawyerch-dev', icon: 'github' },
      { label: '邮箱', handle: 'lawyerch@foxmail.com', href: `mailto:${siteConfig.contact.email}`, icon: 'mail' },
      { label: '劳动法站', handle: 'labor.lawyerch.cn', href: 'https://labor.lawyerch.cn/', icon: 'link' },
      { label: '预约咨询', handle: '走联系表单', href: '/contact/', icon: 'calendar' },
    ] as SocialItem[],
    legal: {
      copyright: '© 2026 陈恒',
      icp: '粤ICP备2024267441号-1',
      police: '',
    },
  },
};

export default stage;
