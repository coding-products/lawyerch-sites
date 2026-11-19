import type { FaqItem } from '~/types';
import type { Lang } from '~/i18n/ui';

export const faqByLang: Record<Lang, { faq: FaqItem[]; faqHeading: { eyebrow: string; title: string; asideTitle: string; asideBody: string } }> = {
  zh: {
    faq: [
      {
        question: '你主要做什么？',
        answer:
          '执业律师，做诉讼与非诉。同时长期写代码，把法律工作里重复的部分做成工具和开源项目。',
      },
      {
        question: '法律问题可以直接问你吗？',
        answer:
          '可以，但需要走正式委托。本站文章是一般信息，不构成针对具体案件的法律意见。',
      },
      {
        question: '工具和开源项目能商用吗？',
        answer:
          '公开仓库多数是 MIT 或 Apache-2.0，可以商用，保留署名即可。具体看各仓库的 LICENSE。',
      },
      {
        question: '为什么要把法律工作做成工具？',
        answer:
          '因为大量时间花在重复劳动上：格式转换、文书套模板、检索、核对。这些适合交给代码，判断留给人。',
      },
      {
        question: '会分享客户案例吗？',
        answer:
          '不会。客户信息、案件细节、金额都不进公开内容。文章里的例子都做过脱敏或来自公开裁判文书。',
      },
      {
        question: '怎么联系？',
        answer:
          '邮件最快。法律事务请说明争议类型、目前阶段和已有材料，工具和合作直接说需求即可。',
      },
    ],
    faqHeading: {
      eyebrow: '常见问题',
      title: '关于我，以及这个站。',
      asideTitle: '还有别的？',
      asideBody: '直接发邮件。法律事务请走正式委托，工具和合作随时聊。',
    },
  },
  en: {
    faq: [
      {
        question: 'What do you do?',
        answer:
          'I practise law — litigation and advisory — and write code. Most of my tooling comes from turning repetitive legal work into something a machine can do.',
      },
      {
        question: 'Can I ask you a legal question directly?',
        answer:
          'You can, but it needs a formal engagement. Articles here are general information, not legal advice for a specific case.',
      },
      {
        question: 'Can I use your tools commercially?',
        answer:
          'Most public repositories are MIT or Apache-2.0, so yes, with attribution. Check each repository LICENSE.',
      },
      {
        question: 'Why build tools for legal work?',
        answer:
          'Because a lot of time goes into repetition: format conversion, document templates, research, cross-checking. That belongs to code. Judgement stays with the lawyer.',
      },
      {
        question: 'Do you share client cases?',
        answer:
          'No. Client names, case details and amounts never appear in public content. Examples are anonymised or drawn from published judgments.',
      },
      {
        question: 'How do I get in touch?',
        answer:
          'Email is fastest. For legal matters, include the type of dispute, current stage and documents you have. For tools and collaboration, just describe what you need.',
      },
    ],
    faqHeading: {
      eyebrow: 'FAQ',
      title: 'About me, and this site.',
      asideTitle: 'Something else?',
      asideBody: 'Email me. Legal matters need a formal engagement; tools and collaboration are always open.',
    },
  },
};
