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
    { zh: '法律产品', en: 'Legal Products', href: '#modules' },
    { zh: '技术产品', en: 'Tech Products', href: '#modules' },
    { zh: '劳动法站', en: 'Labor Law', href: 'https://labor.lawyerch.cn/' },
    { zh: '关于', en: 'About', href: '/about/' },
    { zh: '联系', en: 'Contact', href: '/contact/' },
  ],

  // 第1屏标语
  slogan: {
    kicker: 'CHEN HENG · LAWYER',
    line1: { zh: '把法律经验，', en: 'Pass on legal experience' },
    line1Sub: { zh: '写进代码；', en: 'into code;' },
    line2: { zh: '把判断，', en: 'keep judgement' },
    line2Sub: { zh: '留给人。', en: 'human.' },
    desc: {
      zh: '陈恒律师专注劳动争议与企业用工合规，致力于让代码与人工智能真正服务法律实务。他把执业中打磨的方法做成可复用的工具与开源技能；也深耕企业法务合规，把重复部分交给程序，把审慎判断留给人。发起多项法律实务开源项目。',
      en: 'Chen Heng is a lawyer based in Guangzhou focused on labor disputes and corporate employment compliance, working to turn legal methods into code and AI skills. He ships open-source legal toolchains, document anonymization systems, and domain knowledge bases.',
    },
  },

  // 第2屏交互资历折叠 (手风琴)
  credentials: [
    {
      titleZh: '律师',
      titleEn: 'Lawyer',
      items: [
        { u1: '广州执业律师', u2: '专注劳动争议与用工合规' },
        { u1: '劳动仲裁与诉讼', u2: '规章制度合规审查' },
        { u1: '经济补偿测算', u2: '裁员与员工安置方案' },
      ],
      isParagraph: false,
    },
    {
      titleZh: '法律AI工程师',
      titleEn: 'Legal AI Engineer',
      items: [
        { u1: 'skills-for-legal', u2: '中国法实务 AI 技能集' },
        { u1: 'doc-anonymizer', u2: '本地化文档隐私脱敏工具' },
        { u1: 'dev-resources', u2: '动效音效图标组件索引库' },
        { u1: 'cc-ai-tools', u2: '法律人生产力工作流插件' },
      ],
      isParagraph: false,
    },
    {
      titleZh: '法律AI内容创作者',
      titleEn: 'Legal AI Content Creator',
      paragraph: {
        zh: '长期持续在技术与法律跨界领域输出实务经验。围绕劳动法、用工合规审查、AI 工具流等主题撰写多篇深度专业文章；开源多项法律科技工具代码；致力于让一线法律人轻松用上现代代码与 AI 生产力。',
        en: 'Writing and sharing practical guides across legal compliance and AI developer toolchains. Creating accessible open-source projects for legal professionals.',
      },
      isParagraph: true,
    },
  ],

  // 模块列表 (大字互动条目，带浮动预览图)
  modules: [
    {
      titleZh: '法律产品',
      titleEn: 'Legal Products',
      descZh: '中国法实务 AI 技能集、本地文档脱敏、法律视频工具链。',
      descEn: 'Practical AI skills for Chinese law, local document anonymization, legal toolchains.',
      href: '#modules',
      pvIndex: 0,
    },
    {
      titleZh: '技术产品',
      titleEn: 'Tech Products',
      descZh: 'Markdown 编辑器、动效图标资源索引、AI 启动工具。',
      descEn: 'Markdown editor, curated developer resources, AI productivity launchers.',
      href: '#modules',
      pvIndex: 1,
    },
    {
      titleZh: '劳动法站',
      titleEn: 'Labor Law Site',
      descZh: '劳动争议、辞退补偿、竞业限制等法律专题知识库。',
      descEn: 'Comprehensive knowledge base on labor disputes, severance, and employment compliance.',
      href: 'https://labor.lawyerch.cn/',
      pvIndex: 2,
    },
    {
      titleZh: '开源项目',
      titleEn: 'Open Source',
      descZh: 'skills-for-legal、doc-anonymizer 等全部开源在 GitHub。',
      descEn: 'All legal-tech and developer tools open on GitHub.',
      href: 'https://github.com/LawyerCH',
      pvIndex: 5,
    },
    {
      titleZh: '关于与联系',
      titleEn: 'About & Contact',
      descZh: '执业背景、写代码的故事，以及商业咨询与技术合作入口。',
      descEn: 'Professional background, coding journey, and advisory inquiry.',
      href: '/contact/',
      pvIndex: 6,
    },
  ],

  // 预览卡图片列表
  previewImages: [
    { src: '/images/qc/pv/practice.jpg' },
    { src: '/images/qc/pv/nlv.jpg' },
    { src: '/images/qc/pv/articles.jpg' },
    { src: '/images/qc/cover-3d.png' },
    { src: '/images/qc/pv/training.jpg' },
    { src: '/images/qc/pv/projects.jpg' },
    { src: '/images/qc/pv/deploy.png', isCustom: true },
  ],

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
