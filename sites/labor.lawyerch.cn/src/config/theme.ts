/**
 * 站点主题。
 *
 * 每个站点只改这个文件，就能换一套品牌色。
 * 变量名对应 `src/styles/tokens.css` 中的 `--swp-*`。
 */
export const theme = {
  lime: '#c9a227',
  'lime-deep': '#b08a1e',
  ink: '#0f1b2d',
  graphite: '#1c2e4a',
  slate: '#5b6472',
  mist: '#f5f2ea',
  line: '#e5e0d3',
  faint: '#8b8778',
} as const;

export type Theme = typeof theme;
