import type { Stat } from '~/types';
import type { Lang } from '~/i18n/ui';

const statsZh: Stat[] = [
  { value: 6, label: '个服务方向' },
  { value: 2, label: '类委托主体（劳动者 / 企业）' },
  { value: 3, label: '种服务方式（诉讼 / 非诉 / 顾问）' },
];

/** Headline above the stats band, split so the tail can be dimmed. */
const statsHeadingZh = {
  lead: '劳动案件的结果，',
  tail: '往往在合同签订和制度落地时就已经决定了一半。',
};

/**
 * Poster frame for the studio reel. Set `embedUrl` to a YouTube/Vimeo
 * privacy-friendly embed to make the play button load a real video;
 * leave it empty and the button is hidden.
 */
export const reel = {
  image: '/images/reel-poster.webp',
  alt: 'Two people reviewing notes and sketches at a studio table',
  width: 1000,
  height: 625,
  embedUrl: '',
  label: 'Play the studio reel',
};


const statsEn: Stat[] = [
  { value: 6, label: 'service areas' },
  { value: 2, label: 'client types (employee / employer)' },
  { value: 3, label: 'engagement models' },
];

const statsHeadingEn = {
  lead: 'Labour outcomes are often decided',
  tail: 'before the dispute ever reaches arbitration.',
};

export const statsByLang: Record<Lang, { stats: Stat[]; statsHeading: typeof statsHeadingZh }> = {
  zh: { stats: statsZh, statsHeading: statsHeadingZh },
  en: { stats: statsEn, statsHeading: statsHeadingEn },
};
