/* 首页第 0/1 屏背景：法律问题求解图谱
   三簇节点（劳动争议 / 合同审查 / 知识库）用细线连成一张图谱，
   白色电流从叶节点出发，沿连接汇聚到画面中心的焦点，对应「看我怎么解」。 */
(function () {
  'use strict';
  var cv = document.getElementById('bg-cv');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = Math.min(window.innerWidth, window.innerHeight) < 700;
  function lightTheme() { return root.getAttribute('data-theme') === 'light'; }

  // 标题里的 ×：把图谱当作“穿过它的一条线”，在 × 周围留出干净的节点位
  var hubEl = document.querySelector('.st__title em');
  var hub = { x: -1, y: -1, r: 32 };
  function measureHub() {
    if (!hubEl) return;
    var er = hubEl.getBoundingClientRect(), cr = cv.getBoundingClientRect();
    if (!er.width) return;
    hub.x = er.left - cr.left + er.width / 2;
    hub.y = er.top - cr.top + er.height / 2;
    // 去掉入场位移（st-0 时标题带 translateY），只取稳定后的版面位置
    var tf = getComputedStyle(hubEl).transform;
    if (tf && tf !== 'none' && window.DOMMatrixReadOnly) {
      var tm = new DOMMatrixReadOnly(tf);
      hub.x -= tm.e; hub.y -= tm.f;
    }
    hub.r = Math.max(20, er.height * .36);
  }

  var seed = 23;
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function ri(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }
  function ease(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }

  // ---------- 背景 ----------
  var bg = document.createElement('canvas'), bgc = bg.getContext('2d');
  var W = 0, H = 0, DPR = 1, SC = 1;
  var PADT = 88, PADB = 0, PADL = 42, PADR = 0;
  function makeBg() {
    var w = Math.max(64, Math.round(W / 6)), h = Math.max(36, Math.round(H / 6));
    bg.width = w; bg.height = h;
    var img = bgc.createImageData(w, h), D = img.data, L = lightTheme();
    for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) {
      var X = (i + .5) / w, Y = (j + .5) / h;
      var u = Math.min(1, Math.max(0, X * 0.55 + (1 - Y) * 0.45));
      var g = L ? (0.855 + 0.105 * Math.pow(u, 1.1)) : (0.042 + 0.036 * Math.pow(u, 1.1));
      var dx = X - .5, dy = Y - .55;
      g += (L ? 0.02 : 0.024) * Math.exp(-(dx * dx + dy * dy) / 0.05);
      var o = (j * w + i) * 4;
      if (L) {
        D[o] = Math.round(255 * g); D[o + 1] = Math.round(255 * g * .995); D[o + 2] = Math.round(255 * g * .985);
      } else {
        D[o] = Math.round(255 * g * 1.04); D[o + 1] = Math.round(255 * g * .99); D[o + 2] = Math.round(255 * g * .94);
      }
      D[o + 3] = 255;
    }
    bgc.putImageData(img, 0, 0);
  }
  function resize() {
    var r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    DPR = Math.min(mobile ? 1.5 : 2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    SC = Math.min(1.25, Math.max(.72, W / 1440));
    PADT = Math.max(84, H * .1);
    PADB = H - Math.max(48, H * .055);
    PADL = Math.max(34, W * .035);
    PADR = W - Math.max(34, W * .035);
    makeBg();
    measureHub();
  }

  // ---------- 光斑贴图 ----------
  function sprite(r, g, b) {
    var c = document.createElement('canvas'); c.width = c.height = 64; var x = c.getContext('2d');
    var gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',1)'); gr.addColorStop(0.25, 'rgba(' + r + ',' + g + ',' + b + ',.45)');
    gr.addColorStop(0.6, 'rgba(' + r + ',' + g + ',' + b + ',.1)'); gr.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return c;
  }
  var SPW = sprite(240, 248, 255), SPR = sprite(240, 40, 30), SPI = sprite(150, 200, 255);
  function glow(sp, x, y, r, a) { if (a <= .01) return; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(sp, x - r, y - r, r * 2, r * 2); }

  // ---------- 图谱配置 ----------
  // 新增一簇：在 CLUSTERS 里加一项即可，hub / 连线 / 电流路线都会自动生成。
  // x、y 是 0–1 的舞台坐标；side 决定标签在节点的哪一侧（l 左 / r 右 / t 上 / b 下）。
  // 跨簇连线在 CROSS 里按标签名配对，配对不存在的节点会自动跳过。
  var CLUSTERS = [
    { t: '劳动争议', x: .135, y: .452, side: 'l', leaves: [
      ['劳动仲裁', .055, .305, 'r'],
      ['经济补偿', .095, .500, 'l'],
      ['违法解除', .060, .540, 'r'],
      ['加班费',   .160, .580, 'l'],
      ['工伤认定', .170, .300, 'l'],
      ['竞业限制', .045, .380, 'r']
    ]},
    { t: '合同审查', x: .915, y: .445, side: 'l', leaves: [
      ['条款比对', .860, .300, 'l'],
      ['风险提示', .940, .340, 'l'],
      ['履约审查', .955, .545, 'l'],
      ['违约责任', .870, .605, 'l'],
      ['争议解决', .790, .530, 'l']
    ]},
    { t: '知识库', x: .500, y: .115, side: 't', leaves: [
      ['类案检索', .355, .155, 't'],
      ['法规检索', .430, .088, 't'],
      ['证据链',   .585, .090, 't'],
      ['裁判观点', .655, .150, 't'],
      ['合规清单', .545, .145, 't']
    ]},
    { t: '知识产权', x: .820, y: .160, side: 'l', leaves: [
      ['商标注册', .715, .100, 't'],
      ['专利布局', .888, .098, 't'],
      ['著作权',   .952, .195, 'l'],
      ['商业秘密', .800, .238, 'b']
    ]},
    { t: '婚姻家事', x: .800, y: .715, side: 'b', leaves: [
      ['离婚纠纷', .700, .655, 'l'],
      ['财产分割', .880, .640, 'l'],
      ['子女抚养', .905, .775, 'l'],
      ['遗产继承', .735, .790, 'l']
    ]}
  ];
  var CROSS = [
    ['证据链', '劳动仲裁'], ['类案检索', '条款比对'], ['风险提示', '合规清单'],
    ['竞业限制', '商业秘密'], ['条款比对', '著作权'], ['裁判观点', '争议解决'],
    ['违法解除', '劳动仲裁'], ['经济补偿', '工伤认定']
  ];

  var NODES = [], EDGES = [], LEAVES = [], BY = {};
  function node(o) { o.z = o.z || 1; NODES.push(o); if (o.t) BY[o.t] = o; return o; }
  var focus = node({ id: 'focus', x: .5, y: .545, focus: 1 });
  function edge(a, b, kind) { if (!a || !b) return; EDGES.push({ a: a, b: b, kind: kind || 0 }); }

  CLUSTERS.forEach(function (c) {
    var hub = node({ t: c.t, x: c.x, y: c.y, hub: 1, side: c.side });
    edge(hub, focus, 1);
    c.leaves.forEach(function (l) {
      var n = node({ t: l[0], x: l[1], y: l[2], side: l[3], h: hub });
      LEAVES.push(n);
      edge(n, hub, 0);
    });
  });
  CROSS.forEach(function (p) { edge(BY[p[0]], BY[p[1]], 2); });

  // 方法链：事实 → 规则 → 推理 → 方案 → 校验（原右上星图，搬进图谱底部）
  var STEPS = ['事实', '规则', '推理', '方案', '校验'];
  var stepNodes = STEPS.map(function (t, i) {
    return node({ t: t, x: .385 + i * .0575, y: .705, step: 1, side: 't' });
  });
  for (var si = 0; si < stepNodes.length - 1; si++) edge(stepNodes[si], stepNodes[si + 1], 3);

  // ---------- 电流：叶节点 → 所属簇 → 中心焦点 ----------
  var pulses = [], ripples = [], nextSpawn = 0;
  function spawn(at) {
    var l = at || LEAVES[ri(0, LEAVES.length - 1)];
    pulses.push({ route: [l, l.h, focus], seg: 0, u: 0, sp: .55 + rnd() * .45 });
  }
  function step(dt) {
    for (var i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i];
      p.u += dt * p.sp;
      while (p.u >= 1 && p.seg < p.route.length - 1) { p.u -= 1; p.seg++; }
      if (p.seg >= p.route.length - 1) {
        ripples.push({ t: T });
        pulses.splice(i, 1);
      }
    }
  }

  // ---------- 屏上坐标 ----------
  var swayX = 0, swayY = 0, tX = 0, tY = 0;
  function sx(n) { return PADL + n.x * (PADR - PADL) + swayX * n.z; }
  function sy(n) { return PADT + n.y * (PADB - PADT) + swayY * n.z; }

  // ---------- 绘制 ----------
  function draw(T) {
    var L = lightTheme();
    var labelsOn = W >= 820 && H >= 700;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.drawImage(bg, 0, 0, W, H);

    var ink = L ? '30,30,29' : '244,231,206';
    var edgeA = L ? .22 : .18;
    var crossA = L ? .17 : .13;
    var gw = W < 820 ? .68 : 1;   // 窄屏线更细，避免抢标题

    // 连接线
    for (var i = 0; i < EDGES.length; i++) {
      var e = EDGES[i];
      var ax = sx(e.a), ay = sy(e.a), bx = sx(e.b), by = sy(e.b);
      if (e.kind === 2) {
        ctx.setLineDash([2, 5]); ctx.lineWidth = 1 * gw;
        ctx.strokeStyle = L ? 'rgba(160,110,30,' + (crossA * .9) + ')' : 'rgba(217,179,106,' + (crossA * .9) + ')';
      } else if (e.kind === 3) {
        ctx.setLineDash([3, 4]); ctx.lineWidth = 1 * gw;
        ctx.strokeStyle = L ? 'rgba(160,110,30,.42)' : 'rgba(217,179,106,.4)';
      } else {
        ctx.setLineDash([]);
        ctx.lineWidth = 1 * gw;
        ctx.strokeStyle = 'rgba(' + ink + ',' + (e.kind === 1 ? edgeA * 1.25 : edgeA) + ')';
      }
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      if (e.kind === 3) {
        // 方法链箭头
        var ang = Math.atan2(by - ay, bx - ax), mx = ax + (bx - ax) * .62, my = ay + (by - ay) * .62, ah = 4.2 * SC;
        ctx.setLineDash([]); ctx.fillStyle = L ? 'rgba(160,110,30,.65)' : 'rgba(217,179,106,.62)';
        ctx.beginPath(); ctx.moveTo(mx, my);
        ctx.lineTo(mx - ah * Math.cos(ang - .5), my - ah * Math.sin(ang - .5));
        ctx.lineTo(mx - ah * Math.cos(ang + .5), my - ah * Math.sin(ang + .5));
        ctx.closePath(); ctx.fill();
      } else if (e.kind === 0) {
        // 叶到簇的连接末端加一个小点，强调“接上了”
        ctx.setLineDash([]); ctx.fillStyle = 'rgba(' + ink + ',.22)';
        ctx.beginPath(); ctx.arc(ax + (bx - ax) * .5, ay + (by - ay) * .5, 1.1, 0, 6.2832); ctx.fill();
      }
    }
    ctx.setLineDash([]);

    // 电流
    for (i = 0; i < pulses.length; i++) {
      var p = pulses[i], a = p.route[p.seg], b = p.route[p.seg + 1];
      if (!b) continue;
      var pax = sx(a), pay = sy(a), pbx = sx(b), pby = sy(b);
      var hx = pax + (pbx - pax) * p.u, hy = pay + (pby - pay) * p.u;
      var tu = Math.max(0, p.u - .3);
      var tx = pax + (pbx - pax) * tu, ty = pay + (pby - pay) * tu;
      ctx.lineCap = 'round';
      ctx.strokeStyle = L ? 'rgba(80,120,185,.14)' : 'rgba(120,180,255,.13)';
      ctx.lineWidth = 6 * gw; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.strokeStyle = L ? 'rgba(60,100,170,.42)' : 'rgba(150,200,255,.4)';
      ctx.lineWidth = 2 * gw; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.strokeStyle = L ? 'rgba(35,74,140,.95)' : 'rgba(240,250,255,.95)';
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy); ctx.stroke();
      if (L) {
        ctx.globalCompositeOperation = 'multiply';
        glow(SPI, hx, hy, 11, .5);
        ctx.globalCompositeOperation = 'source-over';
      } else {
        glow(SPI, hx, hy, 12, .55); glow(SPW, hx, hy, 4, .9);
      }
    }

    // 焦点：红点 + 呼吸环 + 汇聚涟漪
    var fx = sx(focus), fy = sy(focus);
    var breathe = .5 + .5 * Math.sin(T * 1.9);
    ctx.strokeStyle = L ? 'rgba(160,110,30,.28)' : 'rgba(217,179,106,.24)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(fx, fy, (16 + 2.5 * breathe) * SC, 0, 6.2832); ctx.stroke();
    ctx.strokeStyle = L ? 'rgba(155,28,28,.25)' : 'rgba(220,60,48,.35)';
    ctx.beginPath(); ctx.arc(fx, fy, (8 + 1.6 * breathe) * SC, 0, 6.2832); ctx.stroke();
    if (L) {
      ctx.fillStyle = 'rgba(155,28,28,.9)';
      ctx.beginPath(); ctx.arc(fx, fy, 3.2 * SC, 0, 6.2832); ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'screen';
      glow(SPR, fx, fy, 26 * SC, .5);
      glow(SPW, fx, fy, 3.4 * SC, .9);
      ctx.globalCompositeOperation = 'source-over';
    }
    for (i = ripples.length - 1; i >= 0; i--) {
      var pr = (T - ripples[i].t) / 1.1;
      if (pr >= 1) { ripples.splice(i, 1); continue; }
      ctx.globalAlpha = .5 * (1 - pr);
      ctx.strokeStyle = L ? 'rgba(160,110,30,.8)' : 'rgba(217,179,106,.85)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(fx, fy, (6 + 46 * ease(pr)) * SC, 0, 6.2832); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // 节点
    for (i = 0; i < NODES.length; i++) {
      var n = NODES[i]; if (n.focus) continue;
      var px2 = sx(n), py2 = sy(n);
      if (n.hub) {
        ctx.fillStyle = L ? 'rgba(160,110,30,.9)' : 'rgba(217,179,106,.92)';
        ctx.beginPath(); ctx.arc(px2, py2, 2.6 * SC, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = L ? 'rgba(160,110,30,.32)' : 'rgba(217,179,106,.32)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(px2, py2, 6 * SC, 0, 6.2832); ctx.stroke();
      } else if (n.step) {
        ctx.fillStyle = L ? 'rgba(160,110,30,.95)' : 'rgba(226,196,138,.95)';
        ctx.beginPath(); ctx.arc(px2, py2, 2 * SC, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = L ? 'rgba(160,110,30,.28)' : 'rgba(217,179,106,.28)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(px2, py2, 4.5 * SC, 0, 6.2832); ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(' + ink + ',.55)';
        ctx.beginPath(); ctx.arc(px2, py2, 1.7 * SC, 0, 6.2832); ctx.fill();
      }
    }

    // 标签：方法链五步常显，其余节点标签按登场节奏淡入后隐去
    if (labelsOn) {
      ctx.lineJoin = 'round'; ctx.lineWidth = 3;
      ctx.strokeStyle = L ? 'rgba(242,240,235,.94)' : 'rgba(7,7,9,.9)';
      ctx.textBaseline = 'middle';
      for (i = 0; i < NODES.length; i++) {
        var d = NODES[i]; if (d.focus || !d.t) continue;
        var labA = d.step ? 1 : G.label;
        if (labA <= .01) continue;
        ctx.globalAlpha = labA;
        var lx = sx(d), ly = sy(d);
        ctx.font = d.hub
          ? '600 ' + Math.max(11.5, Math.round(12.5 * SC)) + 'px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
          : '600 ' + Math.max(10, Math.round((d.step ? 10.5 : 11) * SC)) + 'px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.fillStyle = d.hub
          ? (L ? 'rgba(122,85,24,.95)' : 'rgba(232,201,138,.95)')
          : d.step
            ? (L ? 'rgba(90,66,22,.9)' : 'rgba(226,196,138,.85)')
            : (L ? 'rgba(36,32,26,.85)' : 'rgba(244,231,206,.76)');
        var ox2 = 9 * SC, oy2 = 14 * SC;
        if (d.side === 'l') { ctx.textAlign = 'right'; ctx.strokeText(d.t, lx - ox2, ly); ctx.fillText(d.t, lx - ox2, ly); }
        else if (d.side === 'r') { ctx.textAlign = 'left'; ctx.strokeText(d.t, lx + ox2, ly); ctx.fillText(d.t, lx + ox2, ly); }
        else if (d.side === 't') { ctx.textAlign = 'center'; ctx.strokeText(d.t, lx, ly - oy2); ctx.fillText(d.t, lx, ly - oy2); }
        else { ctx.textAlign = 'center'; ctx.strokeText(d.t, lx, ly + oy2); ctx.fillText(d.t, lx, ly + oy2); }
      }
    }
    // × 作为图谱节点：在它周围擦出一块干净的圆形，
    // 连线与电流到边缘淡出、从另一侧再接上，看起来是“穿过 ×”而不是撞在字上
    if (hub.x > 0) {
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      var hg = ctx.createRadialGradient(hub.x, hub.y, hub.r * .4, hub.x, hub.y, hub.r);
      hg.addColorStop(0, 'rgba(0,0,0,1)');
      hg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, hub.r, 0, 6.2832); ctx.fill();
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.globalAlpha = 1;
  }

  // ---------- 循环 ----------
  var T = 0, last = 0, running = false, inView = true;
  var coverEl = document.getElementById('products');
  function covered() { return coverEl ? coverEl.getBoundingClientRect().top <= 2 : false; }
  // 只按“是否还在屏幕里”暂停：翻页过程中 hero 仍可见时继续流动
  function paused() { return document.hidden || !inView || covered(); }

  // ---------- 登场节奏：先字后图 ----------
  // 进入首屏时画布很淡，标题先立住；随后图谱淡入，节点标签短暂出现后隐去，
  // 只留连接线与流动的电流，避免文字与标题抢焦点。
  var G = { start: -1, master: reduce ? 1 : .16, label: reduce ? 1 : 0 };
  cv.style.opacity = G.master.toFixed(3);

  function seqTick() {
    if (G.start < 0) return;
    var e = T - G.start, m = .16, lb = 0;
    if (e > .5) m += .84 * ease((e - .5) / 1.1);
    if (e > 1.8) lb = ease((e - 1.8) / .5);
    if (e > 4.4) lb = 1 - ease((e - 4.4) / 1);
    G.master = m;
    G.label = lb > 0 ? lb : 0;
    cv.style.opacity = m.toFixed(3);
  }

  var seqStarted = false;
  function enterHero() {
    if (seqStarted) return;
    seqStarted = true;
    if (location.hash && location.hash !== '#top') return; // 直接落在内容锚点：不播登场
    if (reduce) return;
    G.start = T + .5; // 留半秒让标题先落定
  }
  if (root.classList.contains('st-1') || root.classList.contains('st-2')) enterHero();
  else new MutationObserver(function () {
    if (root.classList.contains('st-1') || root.classList.contains('st-2')) enterHero();
  }).observe(root, { attributes: true, attributeFilter: ['class'] });

  function frame(now) {
    if (!running) return;
    var dt = Math.max(0, Math.min(.05, (now - last) / 1000 || .016)); last = now;
    T += dt;
    seqTick();
    var bx = Math.sin(T * .19) * 7 + tX, by = Math.cos(T * .15) * 5 + tY;
    swayX += (bx - swayX) * .05; swayY += (by - swayY) * .05;
    if (T > nextSpawn) { nextSpawn = T + .12 + rnd() * .26; spawn(); }
    step(dt);
    draw(T);
    if (paused()) { running = false; return; }
    requestAnimationFrame(frame);
  }
  function start() { if (running || reduce || paused()) return; running = true; last = performance.now(); requestAnimationFrame(frame); }

  window.addEventListener('mousemove', function (e) {
    tX = (e.clientX / window.innerWidth - .5) * 18;
    tY = (e.clientY / window.innerHeight - .5) * 10;
  }, { passive: true });
  window.addEventListener('resize', function () { resize(); if (!running) draw(T); });
  window.addEventListener('qc-theme-change', function () { resize(); if (!running) draw(T); });
  document.addEventListener('visibilitychange', start);
  window.addEventListener('scroll', function () { if (!paused()) start(); }, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      inView = es[0].isIntersecting;
      if (inView) start();
    }, { threshold: 0 }).observe(cv);
  }

  function init() {
    resize();
    if (reduce) {
      T = 3;
      for (var i = 0; i < 7; i++) { spawn(); pulses[pulses.length - 1].u = .35 + rnd() * .5; }
      draw(T);
      return;
    }
    start();
  }
  init();
  // 标题字号/断点/语言切换后 × 的位置会变，定时重新量一次
  if (!reduce) setInterval(measureHub, 1000);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureHub);
})();
