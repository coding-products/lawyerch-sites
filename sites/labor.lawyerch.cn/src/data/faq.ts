import type { FaqItem } from '~/types';
import type { Lang } from '~/i18n/ui';

export const faqByLang: Record<Lang, { faq: FaqItem[]; faqHeading: { eyebrow: string; title: string; asideTitle: string; asideBody: string } }> = {
  zh: {
    faq: [
      {
        question: '劳动仲裁要多久？',
        answer:
          '一般 45 日内结案，复杂案件可延长 15 日。实践中从立案到开庭通常 1–2 个月，具体看当地仲裁委排期和案件复杂度。',
      },
      {
        question: '没有签劳动合同，还能主张权利吗？',
        answer:
          '可以。未签书面劳动合同的，用工满一个月起可主张双倍工资，最长 11 个月。关键是用工资记录、考勤、工作群、社保记录等证明劳动关系存在。',
      },
      {
        question: '被违法解除，能拿多少赔偿？',
        answer:
          '违法解除的赔偿金是经济补偿标准的二倍。经济补偿按工作年限计算，每满一年一个月工资；六个月以上不满一年按一年算，不满六个月半个月。',
      },
      {
        question: '加班费怎么举证？',
        answer:
          '劳动者先证明存在加班事实；考勤记录由单位掌握却不提供的，单位承担不利后果。打卡记录、工作群消息、邮件时间、排班表都可以作为初步证据。',
      },
      {
        question: '竞业限制没有补偿还有效吗？',
        answer:
          '并不当然无效。单位三个月未支付经济补偿的，劳动者可以请求解除竞业限制；解除前已履行的期间，仍可主张补偿。',
      },
      {
        question: '企业怎么做用工合规？',
        answer:
          '从劳动合同、员工手册、考勤与加班制度、社保公积金四个基础项开始。制度不仅要内容合法，还要走完民主程序和公示，否则在仲裁中很难作为依据。',
      },
    ],
    faqHeading: {
      eyebrow: '常见问题',
      title: '劳动法里最常被问到的几个问题。',
      asideTitle: '还有别的？',
      asideBody:
        '用一段话描述你的情况：争议类型、目前阶段、已有材料。我会先判断问题性质，再告诉你下一步怎么走。',
    },
  },
  en: {
    faq: [
      {
        question: 'How long does labour arbitration take?',
        answer:
          'Generally 45 days, extendable by 15 for complex cases. In practice, filing to hearing usually takes one to two months depending on the local commission.',
      },
      {
        question: 'Can I claim without a written contract?',
        answer:
          'Yes. From one month of employment, double wages can be claimed for the missing written contract, up to 11 months. Payroll, attendance, work-group messages and social insurance records help prove the relationship.',
      },
      {
        question: 'How much compensation for unlawful dismissal?',
        answer:
          'Damages are twice the statutory severance. Severance is one month’s pay per full year of service; six months or more counts as a year, less than six months as half a month.',
      },
      {
        question: 'How do I prove overtime?',
        answer:
          'The employee proves overtime first. If the employer holds attendance records and refuses to produce them, it bears the adverse consequence. Clock-in records, messages, email timestamps and schedules can be initial evidence.',
      },
      {
        question: 'Is a non-compete valid without compensation?',
        answer:
          'Not automatically invalid. If the employer pays no compensation for three months, the employee may request termination; compensation for the period already performed can still be claimed.',
      },
      {
        question: 'How should a company approach employment compliance?',
        answer:
          'Start with contracts, handbooks, attendance and overtime policies, and social insurance. Policies must also follow the democratic procedure and publication requirements to be usable in arbitration.',
      },
    ],
    faqHeading: {
      eyebrow: 'FAQ',
      title: 'Questions I hear most often.',
      asideTitle: 'Something else?',
      asideBody:
        'Describe the situation in a paragraph: type of dispute, current stage, documents you have. I will tell you what to do next.',
    },
  },
};
