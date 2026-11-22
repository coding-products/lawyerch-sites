/**
 * ============================================================
 *  首页内容 · 只改这一个文件
 * ============================================================
 *
 * 首屏所有文案、头像、数据都在这里。改完保存即可，页面自动重载。
 *
 * 留空规则（都按「不渲染」处理，不会出现占位文字）：
 *   - portrait.src 为空      → 不显示头像
 *   - metrics 为空数组       → 不显示数据条
 *   - actions 少于 2 项      → 只渲染有的
 *   - clause.items 为空      → 不显示左侧条款栏
 *
 * 标题里用 *星号* 包住的部分会渲染成品牌色强调。
 */

export interface HeroMetric {
  /** 数字或短语，如 '8'、'20+'、'∞' */
  value: string;
  /** 单位，可省略，如 '年'、'个' */
  unit?: string;
  /** 说明，如 '执业年限' */
  label: string;
}

export interface HeroAction {
  label: string;
  href: string;
  /** 主按钮只有一个，其余为次级按钮 */
  primary?: boolean;
}

import siteConfig from '~/config/site';

export const home = {
  hero: {
    kicker: 'CHEN HENG · LAWYER',

    /**
     * 头像。换真人照片时：
     *   1. 图片放进 public/images/，建议竖版 3:4
     *   2. 改 src / width / height 三个值
     * src 留空字符串则不显示头像框。
     */
    portrait: {
      src: '',
      width: 960,
      height: 1210,
      alt: '陈恒律师',
      /** src 为空时占位框里显示的姓氏 */
      fallback: '陈',
    },

    /** 首屏标题，*…* 内为强调色 */
    headline: '把法律经验*写进代码*，把判断留给人。',

    lede: '广州执业律师，专注劳动争议与企业用工合规。白天处理案件与合同，晚上把重复的部分做成工具——文档脱敏、AI 技能、领域站点，都开源放在 GitHub 上。',

    /**
     * 左栏「条款」：宋体、编号、金色细线，像一份文书的正文。
     * 每条会被自动编号为「第一条」「第二条」。
     */
    clause: {
      title: '执业事项',
      items: [
        '执业于广州，专注劳动争议与企业用工合规。',
        '从劳动合同的条款，到解除的补偿测算，再到员工手册的落地。',
        '把法律工作里重复的部分交给工具，把判断留给人。',
      ],
    },

    /**
     * 右栏「代码」：等宽字体、行号、语法着色。
     * 内容改成你想展示的任意片段——一段对象、一段命令、一段配置都行。
     */
    code: {
      title: 'practice.ts',
      lang: 'ts',
      lines: [
        'const practice = {',
        "  city: 'Guangzhou',",
        "  focus: ['labor', 'compliance'],",
        "  ships: ['skills-for-legal', 'doc-anonymizer'],",
        '}',
      ],
    },

    /**
     * 首屏数据条。value 留空则整条不渲染；数组为空则整块不渲染。
     * 示例：
     *   { value: '8', unit: '年', label: '执业年限' }
     *   { value: '20', unit: '件', label: '年度案件' }
     * 别填你站不住的数——这一栏一旦有数字，访客就会当真。
     */
    metrics: [] as HeroMetric[],

    /** 首屏行动入口，第一个带 primary 的渲染为主按钮 */
    actions: [
      { label: '看我在做什么', href: '#legal-products', primary: true },
      { label: '发邮件', href: `mailto:${siteConfig.contact.email}` },
    ] as HeroAction[],
  },

  /**
   * 首屏下方的「身份 × 说明」折叠区。
   * 想增减身份，直接改数组。
   */
  identities: [
    {
      title: '律师',
      lines: [
        '广州执业律师，专注劳动争议与企业用工合规。',
        '从一份劳动合同的条款，到一次解除的补偿测算，再到一套员工手册的落地。',
      ],
      items: ['劳动争议仲裁与诉讼', '企业用工合规审查', '规章制度与裁员方案'],
    },
    {
      title: 'AI 开发者',
      lines: [
        '写代码是长期爱好。把法律工作里重复的部分交给工具，把判断留给人。',
        '做文档处理、桌面应用、Agent 工具链，也维护一份开发资源索引。',
      ],
      items: [
        'skills-for-legal：中国法实务 AI 技能集',
        'doc-anonymizer：本地文档脱敏',
        'dev-resources：动效 / 图标 / 组件索引',
      ],
    },
  ],
};

export default home;
