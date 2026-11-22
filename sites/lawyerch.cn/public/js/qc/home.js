/* 首页 v8：全屏名片对开大门（Door Gate Reveal）+ 三维坐标晶格交互 + 模块列表 */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var portal = document.getElementById('gate-portal');
  var header = document.getElementById('gate-header');
  var av = document.getElementById('av');
  var fly = document.getElementById('avfly');
  var navLogo = document.getElementById('nav-logo');
  var gateCue = document.getElementById('gate-cue');

  var stage = (location.hash && location.hash !== '#top') ? 2 : 0;
  var busy = false;
  var DUR = reduce ? 50 : 1200;
  var freeExitAt = 0; // 退出自由滚动后的惯性滚动静默期

  function setStageClass() {
    root.classList.remove('st-0', 'st-1', 'st-2');
    root.classList.add('st-' + stage);
  }

  // 飞行头像：从名片飞入导航栏 Logo
  var flyC = fly && fly.querySelector('.avfly__c');
  var flyL = fly && fly.querySelector('.avfly__l');
  function setLogo(on) {
    if (!navLogo) return;
    navLogo.style.transition = 'none';
    root.classList.toggle('st-logo', on);
    navLogo.getBoundingClientRect();
    navLogo.style.transition = '';
  }

  function flyLogo(from, to) {
    if (!av || !fly || !navLogo) return;
    var toCard = to === 0, fromCard = from === 0;
    if (toCard === fromCard) return;

    var ra = av.getBoundingClientRect();
    var rn = navLogo.getBoundingClientRect();
    // 开门时导航栏还在屏幕上方，终点要按它滑下来之后的实际位置算
    if (fromCard && header && !root.classList.contains('st-1') && !root.classList.contains('st-2')) {
      rn = { left: rn.left, top: rn.top + header.offsetHeight, width: rn.width, height: rn.height };
    }
    // 关门时名片那扇门还停在屏幕外，终点要把门的位移补回来
    if (toCard) {
      var door = document.querySelector('.gate-door--left');
      if (door) {
        var dt = getComputedStyle(door).transform;
        if (dt && dt !== 'none' && window.DOMMatrixReadOnly) {
          var dm = new DOMMatrixReadOnly(dt);
          ra = { left: ra.left - dm.e, top: ra.top - dm.f, width: ra.width, height: ra.height };
        }
      }
    }
    var S = fromCard ? { l: ra.left, t: ra.top, w: ra.width } : { l: rn.left, t: rn.top, w: rn.width };
    var E = fromCard ? { l: rn.left, t: rn.top, w: rn.width } : { l: ra.left, t: ra.top, w: ra.width };

    fly.style.transition = 'none';
    if (flyC) flyC.style.transition = 'none';
    if (flyL) flyL.style.transition = 'none';
    fly.style.display = 'block';
    fly.style.width = S.w + 'px';
    fly.style.height = S.w + 'px';
    fly.style.transform = 'translate(' + S.l + 'px,' + S.t + 'px)';
    if (flyC) flyC.style.opacity = fromCard ? '1' : '0';
    if (flyL) flyL.style.opacity = fromCard ? '0' : '1';

    av.classList.add('is-gone');
    setLogo(false);
    fly.getBoundingClientRect();

    var fade = Math.round(DUR * 0.4);
    fly.style.transition = 'transform ' + DUR + 'ms cubic-bezier(.76,0,.24,1)';
    if (flyC && flyL) {
      flyC.style.transition = flyL.style.transition = 'opacity ' + fade + 'ms ease ' + (fromCard ? DUR - fade - 60 : 60) + 'ms';
    }
    fly.style.transform = 'translate(' + E.l + 'px,' + E.t + 'px) scale(' + (E.w / S.w) + ')';
    if (flyC) flyC.style.opacity = toCard ? '1' : '0';
    if (flyL) flyL.style.opacity = toCard ? '0' : '1';

    var done = false;
    var seq = (flyLogo.seq = (flyLogo.seq || 0) + 1);
    function land() {
      if (done || seq !== flyLogo.seq) return;
      done = true;
      if (toCard) av.classList.remove('is-gone'); else setLogo(true);
      fly.style.display = 'none';
    }
    fly.addEventListener('transitionend', function te(e) {
      if (e.target !== fly || e.propertyName !== 'transform') return;
      fly.removeEventListener('transitionend', te);
      land();
    });
    clearTimeout(flyLogo.t);
    flyLogo.t = setTimeout(land, DUR + 200);
  }

  function go(n) {
    n = Math.max(0, Math.min(2, n));
    if (busy || n === stage) return;
    busy = true;
    var prev = stage;
    stage = n;

    if (prev === 2) {
      root.classList.remove('st-free');
      window.scrollTo(0, 0);
      freeExitAt = Date.now() + DUR;
    }

    flyLogo(prev, n);
    setStageClass();

    if (n === 2 && window.qcLattice) window.qcLattice.build();

    setTimeout(function () {
      busy = false;
      if (stage === 2) root.classList.add('st-free');
    }, DUR + 60);
  }

  // 初始化设置
  setStageClass();
  if (stage === 2) {
    root.classList.add('st-logo', 'st-free');
  }

  // 交互监听：鼠标滚轮
  window.addEventListener('wheel', function (e) {
    var free = root.classList.contains('st-free');
    if (!free) {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 6) return;
      go(stage + (e.deltaY > 0 ? 1 : -1));
    } else if (window.scrollY <= 0 && e.deltaY < -6) {
      e.preventDefault();
      go(1);
    }
  }, { passive: false });

  // 滚动条拖动保护
  window.addEventListener('scroll', function () {
    if (root.classList.contains('st-free') || window.scrollY <= 0) return;
    window.scrollTo(0, 0);
    // 刚退出自由滚动时，剩余惯性不应被当成“向前翻页”
    if (busy || Date.now() < freeExitAt) return;
    go(stage + 1);
  }, { passive: true });

  // 移动端触摸滑动
  var ty = null;
  window.addEventListener('touchstart', function (e) { ty = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (!root.classList.contains('st-free')) e.preventDefault();
  }, { passive: false });
  window.addEventListener('touchend', function (e) {
    if (ty === null) return;
    var dy = ty - e.changedTouches[0].clientY;
    ty = null;
    var free = root.classList.contains('st-free');
    if (!free) {
      if (Math.abs(dy) > 36) go(stage + (dy > 0 ? 1 : -1));
    } else if (window.scrollY <= 0 && dy < -50) {
      go(1);
    }
  }, { passive: true });

  // 键盘快捷键
  window.addEventListener('keydown', function (e) {
    var free = root.classList.contains('st-free');
    var k = e.key;
    if (!free && (k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter')) {
      e.preventDefault();
      go(stage + 1);
    } else if (!free && (k === 'ArrowUp' || k === 'PageUp')) {
      e.preventDefault();
      go(stage - 1);
    } else if (free && window.scrollY <= 0 && (k === 'ArrowUp' || k === 'PageUp')) {
      e.preventDefault();
      go(1);
    }
  });

  // 点击触发开门
  if (gateCue) gateCue.addEventListener('click', function () { go(1); });
  var gateLatch = document.getElementById('gate-latch');
  if (gateLatch) gateLatch.addEventListener('click', function () { go(1); });
  var cueBtn = document.getElementById('cue');
  if (cueBtn) cueBtn.addEventListener('click', function () { go(stage + 1); });

  if (stage === 2) {
    setTimeout(function () {
      var t = location.hash && document.querySelector(location.hash);
      if (t) t.scrollIntoView();
      if (window.qcLattice) window.qcLattice.build();
    }, 50);
  }

  /* ================= 模块列表入场与预览浮卡 ================= */
  var rows = document.querySelectorAll('.mr');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          var i = [].indexOf.call(rows, en.target);
          setTimeout(function () { en.target.classList.add('is-in'); }, i * 70);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.2 });
    rows.forEach(function (r) { io.observe(r); });
  } else {
    rows.forEach(function (r) { r.classList.add('is-in'); });
  }

  var pv = document.getElementById('pv');
  var imgs = pv ? pv.querySelectorAll('img') : [];
  var px = 0, py = 0, tx = 0, ty2 = 0, vx = 0, pvOn = false, raf = 0;

  function pvLoop() {
    var nx = px + (tx - px) * 0.16;
    var ny = py + (ty2 - py) * 0.16;
    vx = nx - px; px = nx; py = ny;
    pv.style.setProperty('--x', px.toFixed(1) + 'px');
    pv.style.setProperty('--y', py.toFixed(1) + 'px');
    pv.style.setProperty('--r', Math.max(-8, Math.min(8, vx * 0.5)).toFixed(2) + 'deg');
    raf = pvOn || Math.abs(tx - px) > 0.5 ? requestAnimationFrame(pvLoop) : 0;
  }

  rows.forEach(function (r) {
    r.addEventListener('mouseenter', function (e) {
      var k = +r.getAttribute('data-pv');
      imgs.forEach(function (im, i) { im.classList.toggle('is-on', i === k); });
      if (!pvOn) { px = tx = e.clientX + 170; py = ty2 = e.clientY; }
      pvOn = true;
      pv.classList.add('is-on');
      if (!raf) raf = requestAnimationFrame(pvLoop);
    });
    r.addEventListener('mousemove', function (e) {
      tx = e.clientX + 170;
      ty2 = e.clientY;
    });
    r.addEventListener('mouseleave', function () {
      pvOn = false;
      pv.classList.remove('is-on');
    });
  });
})();
