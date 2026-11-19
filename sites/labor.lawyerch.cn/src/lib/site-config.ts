import type { MenuItem } from '@astro-fleet/shared-ui/src/components/Header.astro';
import type {
  FooterColumn,
  ContactInfo,
  SocialLink,
} from '@astro-fleet/shared-ui/src/components/Footer.astro';

// ---------------------------------------------------------------------------
// 站点身份
// ---------------------------------------------------------------------------

export const SITE_NAME = '劳动法 · 陈恒律师';

export const TAGLINE = '广州执业律师，专注劳动争议与企业用工合规';

export const LOGO_SRC = '/favicon.svg';

// ---------------------------------------------------------------------------
// 导航
// ---------------------------------------------------------------------------

export const navigation: MenuItem[] = [
  { label: '首页', href: '/' },
  { label: '劳动法专栏', href: '/insights/' },
  { label: '服务', href: '/services/' },
  { label: '关于', href: '/about/' },
  { label: '联系', href: '/contact/' },
];

// ---------------------------------------------------------------------------
// 页脚
// ---------------------------------------------------------------------------

export const footerColumns: FooterColumn[] = [
  {
    title: '劳动法',
    links: [
      { label: '劳动合同', href: '/insights/' },
      { label: '解除与赔偿', href: '/insights/' },
      { label: '加班与工时', href: '/insights/' },
      { label: '竞业限制', href: '/insights/' },
    ],
  },
  {
    title: '服务',
    links: [
      { label: '劳动争议代理', href: '/services/' },
      { label: '企业用工合规', href: '/services/' },
      { label: '规章制度审查', href: '/services/' },
      { label: '裁员与人员优化', href: '/services/' },
    ],
  },
  {
    title: '更多',
    links: [
      { label: '关于我', href: '/about/' },
      { label: '联系', href: '/contact/' },
      { label: '主站 lawyerch.cn', href: 'https://lawyerch.cn' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 联系方式
// ---------------------------------------------------------------------------

export const contactInfo: ContactInfo = {
  email: 'lawyerch@foxmail.com',
  address: '广州',
};

// ---------------------------------------------------------------------------
// 社交链接
// ---------------------------------------------------------------------------

export const socialLinks: SocialLink[] = [];
