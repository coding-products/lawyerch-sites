import type { Lang } from '~/i18n/ui';

export const headings = {
  zh: {
    about: {
      eyebrow: '关于',
      title: '律师写代码，不是转行，是把日常的重复劳动变成工具。',
      body: '执业律师，做诉讼与非诉，同时长期写工具。法律工作提出问题，代码给出解法。',
      points: ['法律判断留给律师，重复劳动交给工具。', '公开的代码和文章，尽量能跑、能复现。', '不把客户信息带进任何公开仓库。'],
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
      title: 'Lawyers writing code is not a career change. It is turning repetition into tools.',
      body: 'I practise law and write tools. Legal work raises the questions; code answers them.',
      points: ['Judgement stays with the lawyer, repetition goes to the tool.', 'Public code and writing should run and be reproducible.', 'No client information in any public repository.'],
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
