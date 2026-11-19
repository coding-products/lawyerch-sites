import type { Lang } from '~/i18n/ui';

export const headings = {
  zh: {
    about: {
      eyebrow: '关于',
      title: '劳动案件的结果，往往在合同和制度落地时就决定了一半。',
      body: '长期处理劳动争议，代理劳动者与用人单位两侧，熟悉仲裁与诉讼的裁判尺度。比起事后补救，更关注合同、制度和证据这些前置环节。',
      points: ['先看材料，再谈方案。', '从第一次沟通到结案，由同一位律师跟进。', '如果案件不适合我，会在收费前说明。'],
      image: {
        src: '/images/about-studio.webp',
        alt: '办公桌上的合同与笔记',
        width: 900,
        height: 954,
      },
      badge: { value: '6', label: '个劳动法服务方向，覆盖诉讼、非诉与常年顾问。' },
      ctaLabel: '查看服务',
      ctaHref: '/services/',
    },
    servicesHeading: {
      eyebrow: '服务',
      title: '六个服务方向。',
      ctaLabel: '查看全部服务',
      ctaHref: '/services/',
    },
    journalHeading: {
      eyebrow: '专栏',
      title: '劳动法实务笔记。',
      ctaLabel: '全部文章',
      ctaHref: '/journal/',
    },
    cta: {
      title: '遇到劳动法问题？',
      body: '用一段话描述你的情况：争议类型、目前阶段、已有材料。我会先判断问题性质，再告诉你下一步怎么走。',
      primaryLabel: '联系我',
    },
  },
  en: {
    about: {
      eyebrow: 'About',
      title: 'Labour outcomes are often decided before a dispute begins.',
      body: 'I handle labour disputes for both employees and employers, focusing on contracts, policies and evidence long before litigation. Fewer surprises, clearer records, better outcomes.',
      points: [
        'Read the file before proposing a plan.',
        'One lawyer from the first call to resolution.',
        'If the case is not a fit, I say so before charging.',
      ],
      image: {
        src: '/images/about-studio.webp',
        alt: 'Contracts and notes on a desk',
        width: 900,
        height: 954,
      },
      badge: { value: '6', label: 'service areas across litigation, advisory and retainer work.' },
      ctaLabel: 'View services',
      ctaHref: '/en/services/',
    },
    servicesHeading: {
      eyebrow: 'Services',
      title: 'Six ways I can help.',
      ctaLabel: 'All services',
      ctaHref: '/en/services/',
    },
    journalHeading: {
      eyebrow: 'Journal',
      title: 'Notes from labour law practice.',
      ctaLabel: 'All articles',
      ctaHref: '/en/journal/',
    },
    cta: {
      title: 'Facing a labour issue?',
      body: 'Describe the situation in a paragraph: type of dispute, current stage, documents you have. I will tell you what to do next.',
      primaryLabel: 'Contact me',
    },
  },
} satisfies Record<Lang, unknown>;
