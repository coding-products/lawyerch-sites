/* 全站中英切换：放在 <head> 里同步加载。
   中文是原文；英文时按页加载 js/i18n/<页>.js 的字典，逐个“文字单元”替换 innerHTML。
   文字单元 = 含中文、且内部只有行内元素的最大元素（或块元素里散落的中文文本节点）。 */
(function () {
  'use strict';
  var KEY = 'ch-lang', CJK = /[㐀-鿿！-～　-〿]/;
  var INLINE = { A:1, B:1, STRONG:1, I:1, EM:1, SPAN:1, BR:1, SMALL:1, SUP:1, SUB:1, CODE:1, MARK:1, U:1, S:1, ABBR:1, TIME:1, Q:1, CITE:1, LABEL:1, IMG:1, WBR:1 };
  var SKIP = { SCRIPT:1, STYLE:1, NOSCRIPT:1, CANVAS:1, TEMPLATE:1, IFRAME:1, VIDEO:1 };
  var ATTRS = ['title', 'alt', 'aria-label', 'placeholder'];
  var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/, '');
  if (page === 'index' || page === 'home' || page === '') page = 'home';
  var root = document.documentElement;
  var lang = 'zh';
  try { if (localStorage.getItem(KEY) === 'en') lang = 'en'; } catch (e) {}
  try { var q = /[?&]lang=(en|zh)\b/.exec(location.search); if (q) lang = q[1]; } catch (e) {}
  window.chLang = lang;
  root.lang = lang === 'en' ? 'en' : 'zh-CN';

  var D = window.CH_I18N = window.CH_I18N || { units: {}, attrs: {}, meta: {} };
  window.chI18nAdd = function (d) {
    var k;
    for (k in d.units || {}) D.units[k] = d.units[k];
    for (k in d.attrs || {}) D.attrs[k] = d.attrs[k];
    for (k in d.meta || {}) D.meta[k] = d.meta[k];
  };

  var loaded = false, loading = false, waiters = [];
  function load(cb) {
    if (loaded) return cb();
    waiters.push(cb);
    if (loading) return;
    loading = true;
    var files = ['common', page], left = files.length;
    files.forEach(function (f) {
      var s = document.createElement('script');
      s.src = 'js/i18n/' + f + '.js';
      s.async = false;
      s.onload = s.onerror = function () {
        if (--left) return;
        loaded = true;
        var w = waiters; waiters = []; w.forEach(function (fn) { fn(); });
      };
      document.head.appendChild(s);
    });
  }

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function inlineOnly(el) {
    var all = el.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) {
      if (!INLINE[all[i].tagName.toUpperCase()] && !(all[i].namespaceURI && all[i].namespaceURI.indexOf('svg') > 0 && /^(tspan|textPath)$/i.test(all[i].tagName))) return false;
      if (all[i].hasAttribute('data-en')) return false;
    }
    return true;
  }
  /* 收集文字单元，fn(kind, node, key) */
  function walk(el, fn) {
    if (el.nodeType !== 1 || SKIP[el.tagName.toUpperCase()] || el.hasAttribute('data-noi18n')) return;
    if (el.hasAttribute('data-en')) { fn('data', el); return; }
    for (var a = 0; a < ATTRS.length; a++) {
      var v = el.getAttribute(ATTRS[a]);
      if (v && CJK.test(v)) fn('attr', el, ATTRS[a]);
    }
    var tc = el.textContent;
    if (!tc || !CJK.test(tc)) return;
    if (!el.hasAttribute('data-i18n-split') && inlineOnly(el)) { fn('unit', el); return; }
    for (var c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3) { if (CJK.test(c.nodeValue)) fn('text', c); }
      else if (c.nodeType === 1) walk(c, fn);
    }
  }
  window.chI18nCollect = function (rootEl) {
    var units = {}, attrs = {};
    walk(rootEl || document.body, function (kind, n, at) {
      if (kind === 'unit') units[norm(n.innerHTML)] = '';
      else if (kind === 'text') units[norm(n.nodeValue)] = '';
      else if (kind === 'attr') attrs[norm(n.getAttribute(at))] = '';
      if (kind === 'unit' || kind === 'data') {
        /* 行内单元里的属性也要收 */
        var all = n.getElementsByTagName('*');
        for (var i = 0; i < all.length; i++) for (var a = 0; a < ATTRS.length; a++) {
          var v = all[i].getAttribute(ATTRS[a]); if (v && CJK.test(v)) attrs[norm(v)] = '';
        }
      }
    });
    return { units: units, attrs: attrs };
  };

  /* 原文保存在节点上，切回中文时还原 */
  var ZH = '__chZh';
  function toEn(rootEl) {
    walk(rootEl, function (kind, n, at) {
      var k, v;
      if (kind === 'data') {
        if (n.__chEn) return;                       // 已是英文，不再重复写（否则会和 MutationObserver 互相触发）
        if (n.getAttribute('data-zh') === null) n.setAttribute('data-zh', n.innerHTML);
        n.innerHTML = n.getAttribute('data-en'); n.__chEn = true;
      } else if (kind === 'unit') {
        k = norm(n.innerHTML); v = D.units[k];
        if (v) { n[ZH] = n.innerHTML; n.innerHTML = v; n.setAttribute('data-i18n', ''); }
        var all = n.getElementsByTagName('*');
        for (var i = 0; i < all.length; i++) for (var a = 0; a < ATTRS.length; a++) {
          var t = all[i].getAttribute(ATTRS[a]);
          if (t && CJK.test(t) && D.attrs[norm(t)]) all[i].setAttribute(ATTRS[a], D.attrs[norm(t)]);
        }
      } else if (kind === 'text') {
        k = norm(n.nodeValue); v = D.units[k];
        if (v) {
          var m = /^(\s*)[\s\S]*?(\s*)$/.exec(n.nodeValue);
          n[ZH] = n.nodeValue; n.nodeValue = m[1] + v + m[2];
          if (n.parentNode) n.parentNode.setAttribute('data-i18n', '');
        }
      } else if (kind === 'attr') {
        k = norm(n.getAttribute(at)); v = D.attrs[k];
        if (v) { n['__chZh_' + at] = n.getAttribute(at); n.setAttribute(at, v); }
      }
    });
  }
  var touched = [];
  function remember(rootEl) {
    /* 记下所有改过的节点，供还原 */
    if (!rootEl || !rootEl.nodeType) return;
    var it = document.createTreeWalker(rootEl, 5, null), n;
    if (rootEl[ZH] !== undefined) touched.push(rootEl);
    while ((n = it.nextNode())) if (n[ZH] !== undefined || n.__chZh_title || n.__chZh_alt || n['__chZh_aria-label'] || n.__chZh_placeholder || (n.nodeType === 1 && n.getAttribute('data-zh') !== null)) touched.push(n);
  }
  function toZh() {
    touched.forEach(function (n) {
      if (n.nodeType === 3) { if (n[ZH] !== undefined) { n.nodeValue = n[ZH]; delete n[ZH]; } return; }
      if (n.getAttribute('data-zh') !== null && n.hasAttribute('data-en')) { n.innerHTML = n.getAttribute('data-zh'); n.__chEn = false; }
      else if (n[ZH] !== undefined) { n.innerHTML = n[ZH]; delete n[ZH]; n.removeAttribute('data-i18n'); }
      ATTRS.forEach(function (a) { if (n['__chZh_' + a]) { n.setAttribute(a, n['__chZh_' + a]); delete n['__chZh_' + a]; } });
    });
    touched = [];
    /* 页内还有自己生成的英文？刷新一次最稳 */
  }

  var titleZh = null, descZh = null, mo = null;
  function setMeta(en) {
    var md = document.querySelector('meta[name="description"]');
    if (titleZh === null) { titleZh = document.title; descZh = md ? md.content : ''; }
    if (en) {
      if (D.meta.title) document.title = D.meta.title;
      if (md && D.meta.description) md.content = D.meta.description;
    } else { document.title = titleZh; if (md) md.content = descZh; }
  }
  function syncButtons() {
    var bs = document.querySelectorAll('.ch-lang, .lang');
    for (var i = 0; i < bs.length; i++) {
      bs[i].setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
      bs[i].setAttribute('data-cur', lang);
    }
  }
  function apply(l, first) {
    lang = l; window.chLang = l;
    root.lang = l === 'en' ? 'en' : 'zh-CN';
    try { localStorage.setItem(KEY, l); } catch (e) {}
    syncButtons();
    if (l === 'en') {
      load(function () {
        toEn(document.body); remember(document.body); setMeta(true);
        if (mo) mo.takeRecords();
        root.classList.remove('ch-i18n-wait');
        if (!mo && window.MutationObserver) {
          mo = new MutationObserver(function (ms) {
            if (lang !== 'en') return;
            ms.forEach(function (m) {
              for (var i = 0; i < m.addedNodes.length; i++) {
                var n = m.addedNodes[i];
                if (!n.parentNode || (n.parentNode.closest && n.parentNode.closest('[data-en]'))) continue;   // data-en 元素自己管
                if (n.nodeType === 1 && !n.hasAttribute('data-i18n')) { toEn(n); remember(n); }
                else if (n.nodeType === 3 && CJK.test(n.nodeValue)) { var pn = n.parentNode; toEn(pn); remember(pn); }
              }
            });
            mo.takeRecords();                       // 丢掉自己改 DOM 产生的记录，避免循环
          });
          mo.observe(document.body, { childList: true, subtree: true });
        }
        if (!first) document.dispatchEvent(new CustomEvent('ch:lang', { detail: l }));
      });
    } else {
      toZh(); setMeta(false);
      if (mo) mo.takeRecords();
      root.classList.remove('ch-i18n-wait');
      if (!first) document.dispatchEvent(new CustomEvent('ch:lang', { detail: l }));
    }
  }
  window.chSetLang = function (l) { apply(l, false); };

  if (lang === 'en') {
    root.classList.add('ch-i18n-wait');
    load(function () {});
    setTimeout(function () { root.classList.remove('ch-i18n-wait'); }, 1800);
  }
  function ready() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.ch-lang, .lang');
      if (!b) return;
      e.preventDefault();
      apply(lang === 'en' ? 'zh' : 'en', false);
    });
    syncButtons();
    if (lang === 'en') apply('en', true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
