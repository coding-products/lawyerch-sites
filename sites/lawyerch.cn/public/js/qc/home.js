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
  var cardScrollY = 0; // 从页面中部打开名片时记录的阅读位置

  // hero 左下伪代码：进入首屏后逐字打出，循环“打出 → 停留 → 退回”
  var heroType = document.getElementById('hero-type');
  var heroTyped = false;
  function startHeroType() {
    if (!heroType || heroTyped) return;
    heroTyped = true;
    var text = '/**\n * 我在做的事\n * 把法律问题放进「事实 × 规则」的图谱\n * 沿连接找出通往解法的路径\n * 让每一步都有据可查\n */';
    if (reduce) { heroType.textContent = text; return; }
    var i = 0, hold = 3600;
    function type() {
      heroType.textContent = text.slice(0, i);
      if (i < text.length) {
        i++;
        setTimeout(type, 22 + Math.random() * 22);
      } else {
        setTimeout(erase, hold);
      }
    }
    function erase() {
      if (i > 0) {
        i--;
        heroType.textContent = text.slice(0, i);
        setTimeout(erase, 8 + Math.random() * 8);
      } else {
        setTimeout(type, 500);
      }
    }
    type();
  }

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
    // 开门时导航栏还在屏幕上方（translateY -140%），终点要按它滑下来后的位置算：
    // 直接用当前 transform 的竖向位移反推，避免只补 offsetHeight 造成的偏上
    if (fromCard && header) {
      var ht = getComputedStyle(header).transform;
      if (ht && ht !== 'none' && window.DOMMatrixReadOnly) {
        var hm = new DOMMatrixReadOnly(ht);
        rn = { left: rn.left, top: rn.top - hm.f, width: rn.width, height: rn.height };
      }
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
    if (n === 0) {
      // 打开名片：记住当前阅读位置并锁住滚动，关门后回到原处
      cardScrollY = window.scrollY;
      root.classList.remove('st-free');
      freeExitAt = Date.now() + DUR;
    }
    if (n === 1 && prev === 0 && cardScrollY > 0) {
      // 从名片回到页面：恢复打开前的滚动位置，而不是回到首屏
      root.classList.add('st-free');
      window.scrollTo(0, cardScrollY);
    }
    if (n === 1) setTimeout(startHeroType, 900);

    setTimeout(function () {
      busy = false;
      // 首屏（hero）出现后立即解锁滚动，第一次滚轮就生效，不再吞掉一次手势
      if (stage >= 1) root.classList.add('st-free');
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
    if (stage === 0) return; // 名片打开时保留原阅读位置，不回顶
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
  if (cueBtn) cueBtn.addEventListener('click', function () {
    window.qcGotoAnchor(document.getElementById('products'));
  });
  var heroCta = document.getElementById('hero-cta');
  if (heroCta) heroCta.addEventListener('click', function (e) {
    e.preventDefault();
    window.qcGotoAnchor(document.getElementById('products'));
  });

  // 顶部导航锚点：首屏内点击时先解锁滚动，再滚到目标
  window.qcGotoAnchor = function (target) {
    if (!target) return;
    if (root.classList.contains('st-free')) {
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    go(2);
    setTimeout(function () { target.scrollIntoView({ behavior: 'smooth' }); }, 1400);
  };

  // 供页面按钮调用：从任意位置打开名片页（门扇合上、头像飞回名片）
  window.qcOpenCard = function () {
    if (stage === 0) return;
    go(0);
  };

  if (stage === 2) {
    setTimeout(function () {
      var t = location.hash && document.querySelector(location.hash);
      if (t) t.scrollIntoView();
    }, 50);
  }
})();
