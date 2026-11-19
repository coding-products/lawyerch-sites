import type { NavItem } from '~/types';

/** 主导航。主站只有三页：首页、关于、联系。 */
export const primaryNav: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '关于', href: '/about/' },
  { label: '联系', href: '/contact/' },
];

/** 移动端额外入口。 */
export const mobileExtraNav: NavItem[] = [
  { label: '劳动法站', href: 'https://labor.lawyerch.cn' },
  { label: 'GitHub', href: 'https://github.com/lawyerch-dev' },
];

export const footerNav = {
  explore: [
    { label: '关于', href: '/about/' },
    { label: '联系', href: '/contact/' },
    { label: '劳动法站', href: 'https://labor.lawyerch.cn' },
  ] satisfies NavItem[],
  legal: [
    { label: '隐私', href: '/privacy/' },
    { label: '条款', href: '/terms/' },
  ] satisfies NavItem[],
};
