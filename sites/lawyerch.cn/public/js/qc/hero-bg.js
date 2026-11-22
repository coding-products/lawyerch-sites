/* 首页第 0/1 屏背景：三维坐标晶格（实时绘制，替代原背景视频）
   与 video/intro/render3.py 同一套场景：银灰渐变虚空 → 深红原点 → 金色电流沿三轴射出 → 正交路径与套叠立方框生长 →
   小十字点阵消失在雾里；生长完后镜头缓慢左右摆动，电流在网格上不停游走，走过的线由白金 → 琥珀 → 深红 → 冷却回石墨灰。 */
(function () {
  'use strict';
  var cv = document.getElementById('bg-cv');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = Math.min(window.innerWidth, window.innerHeight) < 700;

  // ---------- 工具 ----------
  var seed = 7;
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function uni(a, b) { return a + (b - a) * rnd(); }
  function ri(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(rnd() * a.length)]; }
  function ease(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
  function eio(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  var TEND = 3.6, LP = 12;

  // ---------- 场景 ----------
  var NX = [], NY = [], NZ = [], nodeIx = {};
  function nid(x, y, z) {
    var k = Math.round(x * 1000) + ',' + Math.round(y * 1000) + ',' + Math.round(z * 1000);
    var i = nodeIx[k];
    if (i === undefined) { i = nodeIx[k] = NX.length; NX.push(x); NY.push(y); NZ.push(z); }
    return i;
  }
  // 边：a,b 节点；ts,te 生长时间；b 亮度；kind 0 轴 1 路径 2 立方框
  var EA = [], EB = [], ETS = [], ETE = [], EBR = [], EK = [];
  var PT = [], PD = [], PF = [], PB = [];   // 最近一次电流经过：起始时间、时长、方向、亮度
  function addEdge(a, b, ts, te, br, kind) {
    EA.push(a); EB.push(b); ETS.push(ts); ETE.push(te); EBR.push(br); EK.push(kind);
    PT.push(ts); PD.push(te - ts); PF.push(1); PB.push(br);
  }
  var AX = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  var DIRS = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  function axisTime(k) { return 0.42 + 0.085 * Math.pow(Math.abs(k), 0.86); }
  var used = {};
  function ek(a, b) { return a < b ? a + '_' + b : b + '_' + a; }
  var ticks = [];
  AX.forEach(function (a) {
    [1, -1].forEach(function (s) {
      for (var k = 0; k < 34; k++) {
        var i = nid(a[0]*s*k, a[1]*s*k, a[2]*s*k), j = nid(a[0]*s*(k+1), a[1]*s*(k+1), a[2]*s*(k+1));
        used[ek(i, j)] = 1;
        addEdge(i, j, axisTime(k), axisTime(k + 1), s > 0 ? 1 : 0.35, 0);
        if (s > 0 && k + 1 >= 1 && k + 1 <= 12) ticks.push([a, k + 1, axisTime(k + 1)]);
      }
    });
  });
  function walker(p, t, dv, n, br, depth) {
    var seg = ri(2, 4);
    for (var i = 0; i < n; i++) {
      var q = [p[0]+dv[0], p[1]+dv[1], p[2]+dv[2]];
      if (Math.max(Math.abs(q[0]), Math.abs(q[1]), Math.abs(q[2])) > 11) return;
      var a = nid(p[0], p[1], p[2]), b = nid(q[0], q[1], q[2]);
      if (used[ek(a, b)]) return;
      used[ek(a, b)] = 1;
      var dt = 0.085 * uni(0.9, 1.15);
      addEdge(a, b, t, t + dt, br, 1);
      p = q; t += dt;
      if (--seg === 0) {
        seg = ri(2, 4);
        var opts = DIRS.filter(function (d) { return !(d[0]===dv[0]&&d[1]===dv[1]&&d[2]===dv[2]) && !(d[0]===-dv[0]&&d[1]===-dv[1]&&d[2]===-dv[2]); });
        var nd = pick(opts);
        if (depth < 2 && rnd() < 0.45) walker(p, t, pick(opts.filter(function (d) { return d !== nd; })), ri(4, 9), br * 0.6, depth + 1);
        dv = nd;
      }
    }
  }
  for (var w = 0; w < 20; w++) {
    var a0 = pick(AX), s0 = pick([1, 1, -1]), k0 = ri(1, 5);
    var perp = DIRS.filter(function (d) { return d[0]*a0[0] + d[1]*a0[1] + d[2]*a0[2] === 0; });
    walker([a0[0]*s0*k0, a0[1]*s0*k0, a0[2]*s0*k0], axisTime(k0) + uni(0.02, 0.5), pick(perp), ri(6, 13), rnd() < 0.45 ? 1 : 0.45, 0);
  }
  for (w = 0; w < 26; w++) {
    var tt = uni(1.5, 3.05), rr = 3 + (tt - 1.5) / 1.55 * 6;
    walker([Math.round(uni(-1, 1) * rr), Math.round(uni(-1, 1) * rr), Math.round(uni(-1, 1) * rr)], tt, pick(DIRS), ri(5, 10), rnd() < 0.5 ? 1 : 0.5, 0);
  }
  // 套叠立方框 1/2/4/8/16
  [[1, 1.05], [2, 1.45], [4, 1.9], [8, 2.35], [16, 2.75]].forEach(function (c) {
    var h = c[0], t0 = c[1], V = [];
    [-1, 1].forEach(function (x) { [-1, 1].forEach(function (y) { [-1, 1].forEach(function (z) { V.push([x*h, y*h, z*h]); }); }); });
    for (var i = 0; i < 8; i++) for (var j = i + 1; j < 8; j++) {
      var d = 0; for (var q = 0; q < 3; q++) if (V[i][q] !== V[j][q]) d++;
      if (d !== 1) continue;
      var n = 8, dt = 0.55 / n;
      for (var m = 0; m < n; m++) {
        var p0 = [0,1,2].map(function (q) { return V[i][q] + (V[j][q] - V[i][q]) * m / n; });
        var p1 = [0,1,2].map(function (q) { return V[i][q] + (V[j][q] - V[i][q]) * (m + 1) / n; });
        addEdge(nid(p0[0], p0[1], p0[2]), nid(p1[0], p1[1], p1[2]), t0 + m * dt, t0 + (m + 1) * dt, 0.75, 2);
      }
    }
  });
  var NE = EA.length, NN = NX.length;
  // 电流可走的图：正向坐标轴 + 正交路径
  var adj = []; for (var i0 = 0; i0 < NN; i0++) adj.push([]);
  for (var e0 = 0; e0 < NE; e0++) { if (EK[e0] === 2 || (EK[e0] === 0 && EBR[e0] < 0.5)) continue; adj[EA[e0]].push(e0); adj[EB[e0]].push(e0); }
  var walkNodes = []; for (i0 = 0; i0 < NN; i0++) if (adj[i0].length) walkNodes.push(i0);
  var ORIGIN = nid(0, 0, 0);
  // 点阵小十字
  var field = [], fstep = mobile ? 4 : 2;
  for (var x = -12; x <= 12; x += fstep) for (var y = -12; y <= 12; y += fstep) for (var z = -12; z <= 12; z += fstep)
    field.push([x, y, z, 0.75 + 0.075 * Math.sqrt(x*x + y*y + z*z)]);
  // 火星
  var embers = [];
  function newEmber(t0) {
    var th = uni(0, 6.2832), ph = uni(-1, 1), r = uni(0.2, 2.6), sq = Math.sqrt(1 - ph * ph);
    return { x: r*Math.cos(th)*sq, y: r*ph*0.6 + 0.4, z: r*Math.sin(th)*sq, vx: uni(-.12, .12), vy: uni(.08, .28), vz: uni(-.12, .12), t0: t0, life: uni(0.9, 2.0), ph: rnd() };
  }
  for (i0 = 0; i0 < 46; i0++) embers.push(newEmber(uni(0.7, 2.9)));

  // ---------- 镜头 ----------
  var W = 0, H = 0, DPR = 1, S = 1, FOC = 1, CX = 0, CY = 0, OX = 0, OY = 0;
  var cam = { px: 0, py: 0, pz: 0, fx: 0, fy: 0, fz: 0, rx: 0, rz: 0, ux: 0, uy: 0, uz: 0, dist: 0 };
  var mAz = 0, mEl = 0, tAz = 0, tEl = 0;
  function camera(t) {
    var tc = Math.min(t, TEND), k = eio(tc / 4);
    var lt = Math.max(0, t - TEND);
    var sw = Math.sin(6.2832 * lt / LP), sw2 = Math.sin(12.5664 * lt / LP);
    var dist = 19 + 6 * k;
    var az = (46 - 5 * k + 9 * sw) * Math.PI / 180 + mAz, el = (29 - 3 * k + 1.6 * sw2) * Math.PI / 180 + mEl;
    var tx = 0, ty = 0.35, tz = 0, ce = Math.cos(el);
    cam.px = tx + dist * ce * Math.sin(az); cam.py = ty + dist * Math.sin(el); cam.pz = tz + dist * ce * Math.cos(az);
    var fx = tx - cam.px, fy = ty - cam.py, fz = tz - cam.pz, fl = Math.sqrt(fx*fx + fy*fy + fz*fz); fx /= fl; fy /= fl; fz /= fl;
    var rx = -fz, rz = fx, rl = Math.sqrt(rx*rx + rz*rz); rx /= rl; rz /= rl;
    cam.fx = fx; cam.fy = fy; cam.fz = fz; cam.rx = rx; cam.rz = rz;
    cam.ux = -rz * fy; cam.uy = rz * fx - rx * fz; cam.uz = rx * fy;
    cam.dist = dist;
  }
  var PX, PY, PZ;   // 投影缓存
  var px = 0, py = 0, pz = 0;
  function proj(x, y, z) {
    var vx = x - cam.px, vy = y - cam.py, vz = z - cam.pz;
    var d = vx * cam.fx + vy * cam.fy + vz * cam.fz;
    if (d < 0.5) return false;
    px = CX + FOC * (vx * cam.rx + vz * cam.rz) / d;
    py = CY - FOC * (vx * cam.ux + vy * cam.uy + vz * cam.uz) / d;
    pz = d; return true;
  }

  // ---------- 背景与光斑贴图 ----------
  var bg = document.createElement('canvas'), bgc = bg.getContext('2d');
  function makeBg() {
    var w = Math.max(64, Math.round(W / 6)), h = Math.max(36, Math.round(H / 6));
    bg.width = w; bg.height = h;
    var img = bgc.createImageData(w, h), D = img.data;
    for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) {
      // 按 16:9 画框坐标计算，与视频 object-fit: cover 一致
      var X = ((i + .5) / w * W - OX) / (W - 2 * OX), Y = ((j + .5) / h * H - OY) / (H - 2 * OY);
      var u = Math.min(1, Math.max(0, X * 0.62 + (1 - Y) * 0.38));
      var g = 0.50 + 0.37 * Math.pow(u, 1.1);
      var dx = X - 0.86, dy = Y - 0.08; g += 0.05 * Math.exp(-(dx*dx + dy*dy) / 0.18);
      g -= 0.035 * Math.min(1, Math.max(0, ((X - .5) * (X - .5) + (Y - .5) * (Y - .5)) * 2.2 - .2));
      var o = (j * w + i) * 4; D[o] = Math.round(255 * g); D[o+1] = Math.round(255 * g * .995); D[o+2] = Math.round(255 * g * .985); D[o+3] = 255;
    }
    bgc.putImageData(img, 0, 0);
  }
  function sprite(r, g, b) {
    var c = document.createElement('canvas'); c.width = c.height = 64; var x = c.getContext('2d');
    var gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',1)'); gr.addColorStop(0.25, 'rgba(' + r + ',' + g + ',' + b + ',.45)');
    gr.addColorStop(0.6, 'rgba(' + r + ',' + g + ',' + b + ',.1)'); gr.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return c;
  }
  var SPG = sprite(255, 214, 140), SPW = sprite(255, 236, 205), SPR = sprite(240, 40, 30), SPA = sprite(255, 140, 60);
  function glow(sp, x, y, r, a) { if (a <= 0.01) return; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(sp, x - r, y - r, r * 2, r * 2); }

  function resize() {
    var r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    DPR = Math.min(mobile ? 1.5 : 2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    S = Math.max(W / 1920, H / 1080);              // 16:9 画框铺满（cover）
    var W0 = 1920 * S, H0 = 1080 * S; OX = (W - W0) / 2; OY = (H - H0) / 2;
    FOC = 0.5 * H0 / Math.tan(19 * Math.PI / 180);
    CX = OX + W0 * 0.5; CY = OY + H0 * 0.56;
    makeBg();
  }

  // ---------- 热度色带（走过的线：白金 → 琥珀 → 深红 → 灰） ----------
  var HS = [[0, 255, 230, 168, 1], [0.07, 255, 168, 61, .74], [0.24, 230, 77, 26, .3], [0.62, 153, 20, 18, .06], [1.05, 153, 20, 18, 0]];   // 拖尾约为原来的四成
  var hc = [0, 0, 0, 0];
  function heat(age) {
    if (age < 0 || age > 1.05) return false;
    for (var i = 0; i < 4; i++) if (age <= HS[i + 1][0]) {
      var a = HS[i], b = HS[i + 1], k = (age - a[0]) / (b[0] - a[0]);
      hc[0] = a[1] + (b[1] - a[1]) * k; hc[1] = a[2] + (b[2] - a[2]) * k; hc[2] = a[3] + (b[3] - a[3]) * k; hc[3] = a[4] + (b[4] - a[4]) * k;
      return true;
    }
    return false;
  }

  // ---------- 电流（生长完成后不停游走） ----------
  var pulses = [], nextSpawn = TEND - 0.4;
  var NFL = new Float32Array(NN).fill(-9), NFB = new Float32Array(NN);
  function spawn(T, at, hops) {
    var n = at >= 0 ? at : rnd() < 0.3 ? ORIGIN : pick(walkNodes), list = adj[n]; if (!list.length) return;
    var e = pick(list);
    startEdge({ n: n, e: e, u: 0, sp: 1 / (0.085 * uni(0.9, 1.15)), hops: hops || ri(6, 13), b: at >= 0 ? 1 : rnd() < 0.6 ? 1 : 0.5, dv: null }, T);
    pulses.push(pulses._last);
  }
  function startEdge(p, T) {
    var fwd = EA[p.e] === p.n;
    PT[p.e] = T; PD[p.e] = 1 / p.sp; PF[p.e] = fwd ? 1 : 0; PB[p.e] = p.b;
    p.to = fwd ? EB[p.e] : EA[p.e];
    pulses._last = p;
  }
  function stepPulses(dt, T) {
    for (var i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i]; p.u += p.sp * dt;
      if (p.u < 1) continue;
      var n = p.to; NFL[n] = T; NFB[n] = p.b;
      if (--p.hops <= 0) { pulses.splice(i, 1); continue; }
      var dx = NX[n] - NX[p.n], dy = NY[n] - NY[p.n], dz = NZ[n] - NZ[p.n];
      var opts = adj[n].filter(function (e) { return e !== p.e; });
      if (!opts.length) { pulses.splice(i, 1); continue; }
      var st = opts.filter(function (e) { var o = EA[e] === n ? EB[e] : EA[e]; return NX[o] - NX[n] === dx && NY[o] - NY[n] === dy && NZ[o] - NZ[n] === dz; });
      p.e = st.length && rnd() < 0.6 ? st[0] : pick(opts); p.n = n; p.u -= 1;
      startEdge(p, T);
    }
  }

  // ---------- 绘制 ----------
  // 景深分档：近焦清晰，离焦越远越粗越淡（模拟虚化）
  var BINW = [1, 1.35, 1.9, 2.7], BINA = [1, .82, .66, .52], NB = 14;
  var paths = []; for (var bi = 0; bi < 4 * NB; bi++) paths.push([]);
  var dots = []; for (bi = 0; bi < NB; bi++) dots.push([]);
  function fog(z) { var d = z - (cam.dist - 1.5); return d > 0 ? Math.exp(-d / 7.5) : 1; }
  function dbin(z) { var d = Math.abs(z - cam.dist); return d < 3.2 ? 0 : d < 6.5 ? 1 : d < 10.5 ? 2 : 3; }
  function seg(x0, y0, x1, y1, a, z) {
    var b = dbin(z); a *= BINA[b]; if (a < 0.012) return;
    var q = Math.min(NB - 1, Math.floor(a * NB)); paths[b * NB + q].push(x0, y0, x1, y1);
  }
  var heatList = [];
  function draw(T) {
    camera(T);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.drawImage(bg, 0, 0, W, H);
    var t = Math.min(T, 30);        // 结构时间（生长完毕后即固定）
    if (!proj(0, 0, 0)) return;
    var ox = px, oy = py;
    // 极淡的同心圆
    var ra = ease((t - 0.05) / 0.85);
    if (ra > 0) {
      ctx.lineWidth = 1;
      [210, 360, 560, 820, 1120].forEach(function (r0, i) {
        var rr = r0 * S * (1 + 0.05 * Math.min(t, TEND)) * (0.86 + 0.14 * ease((t - 0.1 * i) / 1.2));
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.06 * ra * (0.75 - 0.1 * i)).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(ox, oy, rr, 0, 6.2832); ctx.stroke();
      });
    }
    // 投影全部节点
    for (var i = 0; i < NN; i++) { if (proj(NX[i], NY[i], NZ[i])) { PX[i] = px; PY[i] = py; PZ[i] = pz; } else PZ[i] = -1; }
    heatList.length = 0;
    // 线
    for (var e = 0; e < NE; e++) {
      if (t < ETS[e]) continue;
      var a = EA[e], b = EB[e]; if (PZ[a] < 0 || PZ[b] < 0) continue;
      var uu = Math.min(1, (t - ETS[e]) / (ETE[e] - ETS[e]));
      var x1 = PX[a] + (PX[b] - PX[a]) * uu, y1 = PY[a] + (PY[b] - PY[a]) * uu, zm = (PZ[a] + PZ[b]) / 2, f = fog(zm);
      var k = EK[e], br = EBR[e];
      var base = (k === 0 ? (br > .5 ? 0.95 : 0.42) : k === 2 ? 0.30 : br > .9 ? 0.58 : 0.42) * f;
      if (base < 0.012) continue;
      seg(PX[a], PY[a], x1, y1, base, zm);
      if (k === 1 && uu >= 1 && base > 0.05) { var q = Math.min(NB - 1, Math.floor(Math.min(1, base * 1.2) * NB)); dots[q].push(PX[b], PY[b]); }
      if (T - PT[e] < 1.9 + PD[e]) heatList.push(e, uu, f);
    }
    // 点阵小十字
    var L = 0.09;
    for (i = 0; i < field.length; i++) {
      var fp = field[i]; if (t < fp[3]) continue;
      if (!proj(fp[0], fp[1], fp[2])) continue;
      var cx = px, cy = py, cz = pz;
      if (cx < -20 || cx > W + 20 || cy < -20 || cy > H + 20 || cz < cam.dist - 6) continue;
      var ff = fog(cz) * ease((t - fp[3]) / 0.4) * (Math.abs(cz - cam.dist) > 6.5 ? 0.55 : 1);
      if (ff < 0.05) continue;
      for (var ax = 0; ax < 3; ax++) {
        var A = AX[ax];
        if (!proj(fp[0] - A[0]*L, fp[1] - A[1]*L, fp[2] - A[2]*L)) continue; var xa = px, ya = py;
        if (!proj(fp[0] + A[0]*L, fp[1] + A[1]*L, fp[2] + A[2]*L)) continue;
        seg(xa, ya, px, py, 0.38 * ff, cz);
      }
    }
    // 刻度
    for (i = 0; i < ticks.length; i++) {
      var tk = ticks[i]; if (t < tk[2]) continue;
      var dir = tk[0], kk = tk[1], o = dir[2] ? [1, 0, 0] : dir[1] ? [1, 0, 0] : [0, 0, 1], LL = 0.16 * ease((t - tk[2]) / 0.25);
      var bx = dir[0]*kk, by = dir[1]*kk, bz = dir[2]*kk;
      if (!proj(bx - o[0]*LL, by - o[1]*LL, bz - o[2]*LL)) continue; var tx0 = px, ty0 = py, tz0 = pz;
      if (!proj(bx + o[0]*LL, by + o[1]*LL, bz + o[2]*LL)) continue;
      seg(tx0, ty0, px, py, 0.8 * fog((tz0 + pz) / 2), tz0);
    }
    // 原点细圆（石墨）
    var ck = ease((t - 0.08) / 0.9);
    // 批量描线
    ctx.lineCap = 'round';
    for (var b2 = 0; b2 < 4; b2++) {
      ctx.lineWidth = BINW[b2];
      for (var q2 = 0; q2 < NB; q2++) {
        var P = paths[b2 * NB + q2]; if (!P.length) continue;
        ctx.strokeStyle = 'rgba(43,42,41,' + ((q2 + .5) / NB).toFixed(3) + ')';
        ctx.beginPath(); for (var j = 0; j < P.length; j += 4) { ctx.moveTo(P[j], P[j+1]); ctx.lineTo(P[j+2], P[j+3]); }
        ctx.stroke(); P.length = 0;
      }
    }
    for (q2 = 0; q2 < NB; q2++) {
      var Dd = dots[q2]; if (!Dd.length) continue;
      ctx.fillStyle = 'rgba(43,42,41,' + ((q2 + .5) / NB).toFixed(3) + ')';
      ctx.beginPath(); for (j = 0; j < Dd.length; j += 2) { ctx.moveTo(Dd[j] + 1.25, Dd[j+1]); ctx.arc(Dd[j], Dd[j+1], 1.25, 0, 6.2832); } ctx.fill(); Dd.length = 0;
    }
    if (ck > 0) { ctx.strokeStyle = 'rgba(43,42,41,.42)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(ox, oy, 34 * S, -Math.PI / 2, -Math.PI / 2 + 6.2832 * ck); ctx.stroke(); }

    // 深红余温（正常混合）
    var n4 = 4;
    for (i = 0; i < heatList.length; i += 3) {
      e = heatList[i]; var uE = heatList[i+1], fE = heatList[i+2];
      if (PB[e] < 0.9) continue;
      a = EA[e]; b = EB[e];
      for (var s = 0; s < n4; s++) {
        var s0 = s / n4, s1 = Math.min((s + 1) / n4, uE); if (s0 >= uE) break;
        var sm = (s0 + s1) / 2, along = PF[e] ? sm : 1 - sm, age = T - (PT[e] + along * PD[e]);
        if (age <= 0.18) continue;
        var rv = 0.34 * Math.exp(-(age - 0.18) / 0.55) * fE; if (rv < 0.02) continue;
        ctx.strokeStyle = 'rgba(143,23,26,' + rv.toFixed(3) + ')'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(PX[a] + (PX[b] - PX[a]) * s0, PY[a] + (PY[b] - PY[a]) * s0); ctx.lineTo(PX[a] + (PX[b] - PX[a]) * s1, PY[a] + (PY[b] - PY[a]) * s1); ctx.stroke();
      }
    }

    // ---- 发光层（滤色叠加） ----
    ctx.globalCompositeOperation = 'screen';
    for (i = 0; i < heatList.length; i += 3) {
      e = heatList[i]; uE = heatList[i+1]; fE = heatList[i+2];
      a = EA[e]; b = EB[e]; var bb = PB[e] * fE * (EK[e] === 0 && PB[e] > .5 ? 1.1 : 1);
      for (s = 0; s < n4; s++) {
        s0 = s / n4; s1 = Math.min((s + 1) / n4, uE); if (s0 >= uE) break;
        sm = (s0 + s1) / 2; along = PF[e] ? sm : 1 - sm; age = T - (PT[e] + along * PD[e]);
        if (!heat(age)) continue;
        var it = hc[3] * bb; if (it < 0.01) continue;
        var xa2 = PX[a] + (PX[b] - PX[a]) * s0, ya2 = PY[a] + (PY[b] - PY[a]) * s0, xb2 = PX[a] + (PX[b] - PX[a]) * s1, yb2 = PY[a] + (PY[b] - PY[a]) * s1;
        var col = 'rgb(' + (hc[0] | 0) + ',' + (hc[1] | 0) + ',' + (hc[2] | 0) + ')';
        ctx.strokeStyle = col;
        ctx.globalAlpha = Math.min(1, it * 0.3); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(xa2, ya2); ctx.lineTo(xb2, yb2); ctx.stroke();
        ctx.globalAlpha = Math.min(1, it * 0.5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xa2, ya2); ctx.lineTo(xb2, yb2); ctx.stroke();
        ctx.globalAlpha = Math.min(1, it * 1.1); ctx.lineWidth = PB[e] > .9 ? 1.6 : 1.1; ctx.beginPath(); ctx.moveTo(xa2, ya2); ctx.lineTo(xb2, yb2); ctx.stroke();
      }
      // 到达节点的闪光与细小电弧
      var ag = T - (PT[e] + PD[e]);
      if (ag >= 0 && ag < 0.45 && PB[e] > 0.5 && uE >= 1) {
        var en = PF[e] ? b : a, kf = Math.exp(-ag / 0.12) * fE;
        glow(SPA, PX[en], PY[en], 24 * Math.max(1, S), kf * 0.6);
        glow(SPW, PX[en], PY[en], 12 * Math.max(1, S), kf * 1.0);
        if (ag < 0.14 && EK[e] === 1) {
          ctx.globalAlpha = 0.7 * kf; ctx.strokeStyle = 'rgb(255,217,140)'; ctx.lineWidth = 1;
          for (var arc = 0; arc < 2; arc++) {
            var xx = PX[en], yy = PY[en], an = Math.random() * 6.2832; ctx.beginPath(); ctx.moveTo(xx, yy);
            for (var sg = 0; sg < 3; sg++) { an += (Math.random() - .5) * 2; var Lr = 3 + Math.random() * 4; xx += Lr * Math.cos(an); yy += Lr * Math.sin(an); ctx.lineTo(xx, yy); }
            ctx.stroke();
          }
        }
      }
    }
    // 电流头：生长期的边 + 游走的电流
    for (i = 0; i < heatList.length; i += 3) {
      e = heatList[i]; var hu = (T - PT[e]) / PD[e];
      if (hu < 0 || hu >= 1 || PB[e] <= 0.3) continue;
      a = EA[e]; b = EB[e]; var fr = PF[e] ? hu : 1 - hu;
      if (t < ETE[e]) fr = Math.min(fr, heatList[i+1]);
      var hx = PX[a] + (PX[b] - PX[a]) * fr, hy = PY[a] + (PY[b] - PY[a]) * fr, hi = (PB[e] > .5 ? 1.25 : 0.5) * heatList[i+2] * (0.75 + 0.25 * Math.random());
      glow(SPA, hx, hy, (PB[e] > .5 ? 22 : 12) * Math.max(1, S), hi * 0.55);
      glow(SPG, hx, hy, (PB[e] > .5 ? 12 : 7) * Math.max(1, S), hi * 0.95);
      glow(SPW, hx, hy, (PB[e] > .5 ? 3.5 : 2.2) * Math.max(1, S), hi * 0.9);
    }
    // 原点
    var ign = ease((t - 0.05) / 0.3);
    if (ign > 0) {
      var pulse = 1 + 0.25 * Math.exp(-Math.max(0, t - 0.3) / 0.25);
      glow(SPR, ox, oy, 26 * Math.max(1, S), 0.55 * ign * pulse);
      glow(SPR, ox, oy, 9 * Math.max(1, S), 0.9 * ign);
      glow(SPW, ox, oy, 3 * Math.max(1, S), 0.8 * ign);
    }
    ctx.globalCompositeOperation = 'source-over';
    var rings = T < TEND ? [[0.25, 1], [0.55, 0.7]] : [[((T - TEND) % 6) < 0.9 ? T - ((T - TEND) % 6) : -9, 0.8]];
    rings.forEach(function (r) {
      var pa = T - r[0]; if (pa <= 0 || pa >= 0.9) return;
      ctx.globalAlpha = 0.55 * r[1] * (1 - pa / 0.9); ctx.strokeStyle = 'rgb(143,23,26)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(ox, oy, (6 + 70 * ease(pa / 0.9)) * S, 0, 6.2832); ctx.stroke();
    });
    // 鼠标：锁定最近的节点（细红圈 + 微光），点击处的涟漪
    if (hov >= 0 && hovA > 0.01 && PZ[hov] > 0) {
      var hx2 = PX[hov], hy2 = PY[hov];
      ctx.globalAlpha = 0.55 * hovA; ctx.strokeStyle = 'rgb(153,27,27)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(hx2, hy2, (7 + 2 * Math.sin(T * 5)) * Math.max(1, S), 0, 6.2832); ctx.stroke();
      ctx.globalCompositeOperation = 'screen'; glow(SPA, hx2, hy2, 20 * Math.max(1, S), 0.35 * hovA); glow(SPW, hx2, hy2, 3 * Math.max(1, S), 0.7 * hovA);
      ctx.globalCompositeOperation = 'source-over';
    }
    for (i = ripples.length - 1; i >= 0; i--) {
      var rp = ripples[i], pr = (T - rp.t) / 1.1;
      if (pr >= 1) { ripples.splice(i, 1); continue; }
      if (PZ[rp.n] <= 0) continue;
      ctx.globalAlpha = 0.6 * (1 - pr); ctx.strokeStyle = 'rgb(153,27,27)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(PX[rp.n], PY[rp.n], (4 + 90 * ease(pr)) * Math.max(1, S), 0, 6.2832); ctx.stroke();
      ctx.globalAlpha = 0.35 * (1 - pr);
      ctx.beginPath(); ctx.arc(PX[rp.n], PY[rp.n], (4 + 46 * ease(pr)) * Math.max(1, S), 0, 6.2832); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // 火星
    ctx.globalCompositeOperation = 'screen';
    for (i = 0; i < embers.length; i++) {
      var m = embers[i], ae = T - m.t0;
      if (ae > m.life) { if (T > TEND) embers[i] = newEmber(T + uni(0, 2.5)); continue; }
      if (ae < 0) continue;
      if (!proj(m.x + m.vx * ae, m.y + m.vy * ae, m.z + m.vz * ae)) continue;
      var ke = Math.sin(Math.PI * ae / m.life) * (0.55 + 0.45 * Math.sin(T * 9 + m.ph * 20));
      var near = Math.abs(pz - cam.dist) < 3;
      glow(m.ph < 0.7 ? SPR : SPA, px, py, (near ? 4 : 7) * Math.max(1, S), 0.8 * ke);
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  // ---------- 循环 ----------
  var T = 0, last = 0, running = false;
  function paused() { return root.classList.contains('st-free') || document.hidden; }
  function frame(now) {
    if (!running) return;
    var dt = Math.max(0, Math.min(0.05, (now - last) / 1000 || 0.016)); last = now;
    T += dt;
    mAz += (tAz - mAz) * 0.04; mEl += (tEl - mEl) * 0.04;
    if (T > nextSpawn) { nextSpawn = T + uni(0.05, 0.13); spawn(T, -1); }
    interact(T, dt);
    stepPulses(dt, T);
    draw(T);
    if (paused()) { running = false; return; }
    requestAnimationFrame(frame);
  }
  function start() { if (running || reduce || paused()) return; running = true; last = performance.now(); requestAnimationFrame(frame); }
  /* ---------- 鼠标交互 ----------
     移动：镜头随鼠标轻微转动；离鼠标最近的节点被“锁定”（细红圈），电流从那里不断流出。
     点击 / 轻点：那个节点一下放出一簇电流，并荡开两圈涟漪。
     计算只在已投影的节点上找最近点，每 0.15 秒一次，不会卡。 */
  var mX = -1e4, mY = -1e4, mT = -9, hov = -1, hovA = 0, hovNext = 0, ripples = [], burstQ = 0;
  function nearest(maxD) {
    var best = -1, bd = maxD * maxD;
    for (var k = 0; k < walkNodes.length; k++) {
      var n = walkNodes[k]; if (PZ[n] <= 0) continue;
      var dx = PX[n] - mX, dy = PY[n] - mY, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = n; }
    }
    return best;
  }
  function interact(T, dt) {
    var live = performance.now() - mT < 1400 && T > TEND - 0.6;
    if (live && T > hovNext) {
      hovNext = T + 0.15;
      var n = nearest(110 * Math.max(1, S));
      if (n >= 0) { if (n !== hov) spawn(T, n, ri(4, 8)); hov = n; }
    }
    hovA += ((live && hov >= 0 ? 1 : 0) - hovA) * Math.min(1, dt * 6);
    if (burstQ && T > TEND - 0.6) {
      var nb = nearest(160 * Math.max(1, S));
      if (nb >= 0) { for (var k = 0; k < 6; k++) spawn(T, nb, ri(6, 12)); ripples.push({ n: nb, t: T }); hov = nb; }
      burstQ = 0;
    }
  }
  function local(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  window.addEventListener('mousemove', function (e) {
    tAz = ((e.clientX / window.innerWidth) - 0.5) * 0.1; tEl = ((e.clientY / window.innerHeight) - 0.5) * 0.05;
    if (e.target.closest && e.target.closest('.lid')) { mT = -9; return; }
    var p = local(e); mX = p[0]; mY = p[1]; mT = performance.now();
  }, { passive: true });
  function onStage(e) {
    if (root.classList.contains('st-free') || root.classList.contains('st-2')) return false;
    var t = e.target; return !(t.closest && t.closest('a, button, .lid'));
  }
  window.addEventListener('click', function (e) {
    if (!onStage(e)) return;
    var p = local(e); mX = p[0]; mY = p[1]; mT = performance.now(); burstQ = 1;
  });
  window.addEventListener('touchstart', function (e) {
    if (!onStage(e) || !e.touches[0]) return;
    var p = local(e.touches[0]); mX = p[0]; mY = p[1]; mT = performance.now(); burstQ = 1;
  }, { passive: true });
  function init() {
    resize();
    PX = new Float32Array(NN); PY = new Float32Array(NN); PZ = new Float32Array(NN);
    if (reduce) { T = TEND + 2; draw(T); return; }
    start();
  }
  window.addEventListener('resize', function () { resize(); if (!running) draw(T); });
  document.addEventListener('visibilitychange', start);
  new MutationObserver(start).observe(root, { attributes: true, attributeFilter: ['class'] });
  init();
})();
