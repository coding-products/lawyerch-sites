import type { NavItem } from '~/types';

export const primaryNav: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '关于', href: '/about/', anchor: '#about' },
  { label: '服务', href: '/services/', anchor: '#services' },
  { label: '专栏', href: '/journal/', anchor: '#journal' },
  { label: '联系', href: '/contact/' },
];

/** Extra links shown only in the mobile drawer. */
export const mobileExtraNav: NavItem[] = [
  { label: '推进流程', href: '/services/' },
  { label: '常见问题', href: '/contact/#faq' },
  { label: '主站 lawyerch.cn', href: 'https://lawyerch.cn' },
];

export const footerNav = {
  explore: [
    { label: '关于', href: '/about/' },
    { label: '服务', href: '/services/' },
    { label: '专栏', href: '/journal/' },
    { label: '联系', href: '/contact/' },
  ] satisfies NavItem[],
  legal: [
    { label: '隐私', href: '/privacy/' },
    { label: '条款', href: '/terms/' },
    { label: 'RSS', href: '/rss.xml' },
  ] satisfies NavItem[],
};
