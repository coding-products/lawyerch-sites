import type { ProcessStep } from '~/types';
import type { Lang } from '~/i18n/ui';

const processZh: ProcessStep[] = [
  {
    stage: 'Step 01',
    title: '描述情况',
    body: '用一段话说明：争议类型、目前阶段、手上有哪些材料。不需要先整理成法律语言。',
    timing: '初次沟通',
  },
  {
    stage: 'Step 02',
    title: '判断路径',
    body: '先判断问题的性质：协商、仲裁、诉讼，还是需要先补证据。能协商解决的不轻易进仲裁。',
    timing: '1–2 天',
  },
  {
    stage: 'Step 03',
    title: '准备材料',
    body: '梳理劳动合同、工资记录、考勤、聊天记录、解除通知等，确定举证方向和缺口。',
    timing: '按案件',
  },
  {
    stage: 'Step 04',
    title: '推进与复盘',
    body: '代理仲裁或诉讼，或在非诉阶段完成制度审查、方案设计与谈判。结案后给出风险复盘。',
    timing: '按程序',
  },
];

const processHeadingZh = {
  eyebrow: '怎么推进',
  title: '先判断问题，再决定路径。',
  intro:
    '劳动案件最怕一上来就动手。先把事实、证据和程序理清楚，后面每一步才有意义。',
};


const processEn: ProcessStep[] = [
  { stage: 'Step 01', title: 'Describe', body: 'A paragraph is enough: type of dispute, current stage, documents you have.', timing: 'First contact' },
  { stage: 'Step 02', title: 'Assess', body: 'Decide whether this is negotiation, arbitration, litigation, or an evidence gap to close first.', timing: '1–2 days' },
  { stage: 'Step 03', title: 'Prepare', body: 'Organise contracts, payroll, attendance, messages and notices into a usable evidence file.', timing: 'Per case' },
  { stage: 'Step 04', title: 'Proceed', body: 'Represent you through arbitration or litigation, or complete the advisory work and review the risk afterwards.', timing: 'Per procedure' },
];

const processHeadingEn = {
  eyebrow: 'How it works',
  title: 'Assess the problem, then choose the path.',
  intro: 'Labour cases go wrong when action starts before the facts, evidence and procedure are clear.',
};

export const processByLang: Record<Lang, { process: ProcessStep[]; processHeading: typeof processHeadingZh }> = {
  zh: { process: processZh, processHeading: processHeadingZh },
  en: { process: processEn, processHeading: processHeadingEn },
};
