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


  // 浅色 / 暗色主题（未手动选择时，按本地时间自动适配）
  const themeBtn = document.getElementById('theme-toggle');
  const themeRoot = document.documentElement;
  function applyTheme(t) {
    themeRoot.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('qc-theme-change', { detail: t }));
  }
  function autoTheme() {
    const h = new Date().getHours();
    return (h >= 7 && h < 19) ? 'light' : 'dark';
  }
  function manualTheme() {
    try {
      const v = localStorage.getItem('qc-theme');
      return (v === 'light' || v === 'dark') ? v : null;
    } catch (e) { return null; }
  }
  function followTime() {
    if (manualTheme()) return;
    const t = autoTheme();
    if (themeRoot.getAttribute('data-theme') !== t) applyTheme(t);
  }
  if (themeBtn) {
    applyTheme(manualTheme() || autoTheme());
    themeBtn.addEventListener('click', function () {
      const next = themeRoot.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('qc-theme', next); } catch (e) {}
      applyTheme(next);
    });
    // 页面一直开着时也跟着时间走：回到页面、每 10 分钟各检查一次
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) followTime();
    });
    setInterval(followTime, 600000);
  }

  // 导航跟随阅读位置：黄线出现在当前区块对应的栏目下方
  const navLinks = Array.prototype.slice.call(document.querySelectorAll('.qc-nav__links > a'));
  const secProducts = document.getElementById('products');
  const secFde = document.getElementById('fde');
  if (navLinks.length && (secProducts || secFde)) {
    let spyQueued = false;
    function syncNav() {
      spyQueued = false;
      const line = Math.min(300, window.innerHeight * .32);
      let href = 'index.html';
      if (secFde && secFde.getBoundingClientRect().top <= line) href = '#fde';
      else if (secProducts && secProducts.getBoundingClientRect().top <= line) href = '#products';
      navLinks.forEach(function (a) {
        if (a.getAttribute('href') === href) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    }
    function queueSync() {
      if (spyQueued) return;
      spyQueued = true;
      requestAnimationFrame(syncNav);
    }
    window.addEventListener('scroll', queueSync, { passive: true });
    window.addEventListener('resize', queueSync);
    syncNav();
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
          if (window.qcGotoAnchor) window.qcGotoAnchor(target);
          else target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
})();
