/**
 * ============================================================
 *  首页配置（全真对齐 miaoqichuan.com 结构与字段）
 * ============================================================
 *
 * 后续修改文案、电话、链接、身份、条目只需改动此文件。
 */

export type CardVariant = 'editorial' | 'goldline' | 'floating' | 'minimal';

export const mqcConfig = {
  // 名片视觉方案，改这一处即可切换：
  //   editorial 编辑档案 / goldline 金线名片 / floating 实体悬浮卡 / minimal 极简信息卡
  // 预览：在地址后加 ?card=editorial|goldline|floating|minimal
  cardVariant: 'floating' as CardVariant,

  // 基础信息
  person: {
    nameZh: '陈恒',
    nameEn: 'Chen Heng',
    titleZh: '律师 · 法律AI工程师 · 法律AI内容创作者',
    titleEn: 'Lawyer · Legal AI Engineer · Legal AI Content Creator',
    family: '陈',
    given: '恒',
    avatar: '/images/qc/avatar-chenheng.webp', // 名片头像（640×640，真人照片）
    cutout: '/images/qc/home-cutout.webp',     // 后续换成您自己的立绘照片
    personalLogo: '/images/qc/qc-personal-logo.png',
    wordmarkLogo: '/images/qc/qc-wordmark-logo.png',
    qr: '/images/qc/wechat-qr.png',
    tel: '+86 180 0000 0000',                 // 您的电话
    telFormatted: '+86 180 0000 0000',
    mail: 'lawyerch@foxmail.com',
    github: 'LawyerCH',
    githubUrl: 'https://github.com/LawyerCH',
    web: 'https://lawyerch.cn/',
  },

  // 红色名片中的身份标签
  roles: [
    { zh: '律师', en: 'Lawyer' },
    { zh: '法律AI工程师', en: 'Legal AI Engineer' },
    { zh: '法律AI内容创作者', en: 'Legal AI Content Creator' },
  ],

  // 导航栏
  nav: [
    { zh: '首页', en: 'Home', href: 'index.html', current: true },
    { zh: '法律产品', en: 'Legal Products', href: '#products' },
    { zh: '服务流程', en: 'How I Work', href: '#fde' },
    { zh: '关于', en: 'About', href: '/about/' },
    { zh: '联系', en: 'Contact', href: '/contact/' },
  ],

  // 第1屏标语
  slogan: {
    kicker: 'CHEN HENG · LAW × AI',
    line1: { zh: '把法律经验，', en: 'Pass on legal experience' },
    line1Sub: { zh: '写进代码；', en: 'into code;' },
    line2: { zh: '把判断，', en: 'keep judgement' },
    line2Sub: { zh: '留给人。', en: 'human.' },
    desc: {
      zh: '陈恒律师专注劳动争议与企业用工合规，致力于让代码与人工智能真正服务法律实务。他把执业中打磨的方法做成可复用的工具与开源技能；也深耕企业法务合规，把重复部分交给程序，把审慎判断留给人。发起多项法律实务开源项目。',
      en: 'Chen Heng is a lawyer based in Guangzhou focused on labor disputes and corporate employment compliance, working to turn legal methods into code and AI skills. He ships open-source legal toolchains, document anonymization systems, and domain knowledge bases.',
    },
  },

  // 底部社交与联系
  socials: [
    {
      name: 'GitHub',
      handle: '@LawyerCH',
      href: 'https://github.com/LawyerCH',
      iconImg: '/images/qc/social/gh-w.png',
    },
    {
      name: '劳动法站',
      handle: 'labor.lawyerch.cn',
      href: 'https://labor.lawyerch.cn/',
      iconImg: '/images/qc/social/skillhub-w.png',
    },
    {
      name: '邮箱',
      handle: 'lawyerch@foxmail.com',
      href: 'mailto:lawyerch@foxmail.com',
      isSvgMail: true,
    },
    {
      name: '预约咨询',
      handle: '微信或表单联系',
      href: '/contact/',
      isSvgCalendar: true,
    },
  ],

  // ICP 与版权
  icp: {
    copyright: '© 2026 陈恒',
    beian: '粤ICP备2024267441号-1',
    beianUrl: 'https://beian.miit.gov.cn/',
  },
};
