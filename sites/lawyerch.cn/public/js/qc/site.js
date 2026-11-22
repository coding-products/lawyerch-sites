/* 奇川风站点基础脚本：移动端菜单 + reduced-motion */
(function () {
  'use strict';

  // 移动端菜单切换
  const toggle = document.querySelector('.qc-nav__toggle');
  const links = document.querySelector('.qc-nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    function closeMenu() { links.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    // 点击面板以外或按 Esc 收起
    document.addEventListener('click', function (e) {
      if (links.classList.contains('is-open') && !links.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1120) closeMenu(); });

    // 点击链接后自动收起菜单
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // 锚点平滑滚动（仅在用户未要求减少动画时）
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
})();
