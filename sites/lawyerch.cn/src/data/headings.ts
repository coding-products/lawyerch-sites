import type { Lang } from '~/i18n/ui';

export const headings = {
  zh: {
    about: {
      eyebrow: '关于',
      title: '把重复劳动交给工具，把判断留给人。',
      body: '执业律师，做诉讼与非诉，同时长期写工具。法律工作提出问题，代码给出解法。',
      points: ['法律判断留给律师，重复劳动交给工具。', '公开的代码和文章，尽量能跑、能复现。', '不把客户信息带进任何公开仓库。'],
      image: {
        src: '/images/about-studio.webp',
        alt: '办公桌上的合同与笔记',
        width: 900,
        height: 954,
      },
      badge: { value: '2', label: '条线：法律实务，与法律工具。' },
      ctaLabel: '看两条线',
      ctaHref: '/about/',
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
      title: '有法律问题，或想聊工具？',
      body: '法律事务请说明争议类型、目前阶段和已有材料；工具、开源、合作直接讲需求。',
      primaryLabel: '联系我',
    },
  },
  en: {
    about: {
      eyebrow: 'About',
      title: 'Repetition goes to the tool. Judgement stays with the lawyer.',
      body: 'I practise law and write tools. Legal work raises the questions; code answers them.',
      points: ['Judgement stays with the lawyer, repetition goes to the tool.', 'Public code and writing should run and be reproducible.', 'No client information in any public repository.'],
      image: {
        src: '/images/about-studio.webp',
        alt: 'Contracts and notes on a desk',
        width: 900,
        height: 954,
      },
      badge: { value: '2', label: 'tracks: legal practice, and legal tooling.' },
      ctaLabel: 'Two tracks',
      ctaHref: '/en/about/',
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
      title: 'A legal question, or a tool to discuss?',
      body: 'For legal matters, include the dispute type, stage and documents. For tools and collaboration, just describe what you need.',
      primaryLabel: 'Contact me',
    },
  },
} satisfies Record<Lang, unknown>;
