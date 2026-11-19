/**
 * Copy blocks for the homepage sections that are one-of-a-kind.
 * Longer, repeating content lives in its own data file or content
 * collection instead.
 */

export const hero = {
  greeting: '你好，我是',
  /** Rendered on two lines. */
  nameLines: ['陈恒', '律师'],
  intro:
    '广州执业律师，专注劳动争议与企业用工合规。从一份劳动合同的条款，到一次解除的补偿测算，再到一套员工手册的落地。',
  ctaLabel: '预约咨询',
  ctaHref: '/contact/',
  photo: {
    src: '/images/hero-portrait.webp',
    alt: '陈恒律师',
    width: 960,
    height: 1210,
  },
  aside: {
    roleLine: ['劳动争议 · 用工合规', '广州执业'],
    title: ['劳动', '合规'],
    stack: [],
    stackBadge: '6',
    kpi: '6',
    kpiLabel: '个劳动法服务方向',
    note: '诉讼 · 非诉 · 常年顾问',
  },
};

export const collaborate = {
  eyebrow: 'Working together',
  title: 'Most of my work arrives as a half-finished thing somebody is quietly worried about.',
  body: 'Send me yours and I will tell you what I would do with it — honestly, and before there is any question of an invoice. If it is not a fit, I will name someone who is.',
  badge: 'Independent since 2011',
  ctaLabel: 'Send me the brief',
  ctaHref: '/contact/',
  /**
   * The staggered pair beside the copy. Swap these for the bundled SVG
   * mockups (`BookletMock`, `TabletMock` in src/components/art/) if you would
   * rather show artwork than photography — see the README.
   */
  images: [
    {
      src: '/images/collab-team.webp',
      alt: 'Two colleagues standing in a bright office, reviewing work together on a tablet',
      width: 760,
      height: 760,
    },
    {
      src: '/images/collab-meeting.webp',
      alt: 'Two colleagues talking over an open laptop at a meeting table',
      width: 760,
      height: 760,
    },
  ],
};

export const about = {
  eyebrow: '关于',
  title: '劳动案件的结果，往往在合同和制度落地时就决定了一半。',
  body: '长期处理劳动争议，代理劳动者与用人单位两侧，熟悉仲裁与诉讼的裁判尺度。比起事后补救，更关注合同、制度和证据这些前置环节。',
  points: [
    '先看材料，再谈方案。',
    '从第一次沟通到结案，由同一位律师跟进。',
    '如果案件不适合我，会在收费前说明。',
  ],
  image: {
    src: '/images/about-studio.webp',
    alt: 'Designers arranging sticky notes and printed layouts across a studio table',
    width: 900,
    height: 954,
  },
  badge: {
    value: '6',
    label: '个劳动法服务方向，覆盖诉讼、非诉与常年顾问。',
  },
  ctaLabel: '查看服务',
  ctaHref: '/services/',
};

export const servicesHeading = {
  eyebrow: '服务',
  title: '六个服务方向。',
  ctaLabel: '查看全部服务',
  ctaHref: '/services/',
};

export const workHeading = {
  eyebrow: 'Selected work',
  title: 'Six projects, six different arguments.',
};

export const journalHeading = {
  eyebrow: '专栏',
  title: '劳动法实务笔记。',
  ctaLabel: '全部文章',
  ctaHref: '/journal/',
};

export const cta = {
  title: '遇到劳动法问题？',
  body: '用一段话描述你的情况：争议类型、目前阶段、已有材料。我会先判断问题性质，再告诉你下一步怎么走。',
  primaryLabel: '联系我',
};
