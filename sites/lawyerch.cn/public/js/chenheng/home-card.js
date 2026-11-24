/* 首页电子名片：扭索纹底纹（canvas，很淡、缓慢流动）+ 年份水印 */
(function () {
  'use strict';

  /* ---------- 年份水印：跟随系统年份自动更新 ---------- */
  var year = String(new Date().getFullYear());
  var years = document.querySelectorAll('.gate-year');
  for (var i = 0; i < years.length; i++) years[i].textContent = year;

  /* ---------- 扭索纹：几束正弦线彼此错相，交织成绳纹；右侧一枚玫瑰线 ---------- */
  var cv = document.getElementById('card-gl');
  if (!cv) return;
  var ctx = cv.getContext('2d'), W = 0, H = 0, DPR = 1, root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    /* 量容器而不是画布自身：画布在 data-card="floating" 下是 width:auto，
       按自身尺寸反推会形成自反馈，窗口一改尺寸就被拉到画布上限，整张名片变白。 */
    var host = cv.offsetParent || cv.parentElement;
    var box = host.getBoundingClientRect();
    var cs = getComputedStyle(cv);
    var padX = (parseFloat(cs.left) || 0) + (parseFloat(cs.right) || 0);
    var padY = (parseFloat(cs.top) || 0) + (parseFloat(cs.bottom) || 0);
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = Math.min(4096, Math.max(1, box.width - padX));
    H = Math.min(4096, Math.max(1, box.height - padY));
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  }
  function band(y0, amp, k, n, ph, alpha, x0, x1) {
    ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
    for (var i = 0; i < n; i++) {
      var o = i / n * Math.PI * 2;
      ctx.beginPath();
      for (var x = x0; x <= x1; x += 6) {
        var u = (x - x0) / (x1 - x0);
        var env = 0.55 + 0.45 * Math.sin(u * Math.PI * 1.4 + ph * 0.6);          // 振幅沿长度慢慢起伏
        var y = y0 + amp * env * Math.sin(x * k + o + ph) + amp * 0.18 * Math.sin(x * k * 2.7 - o * 2 - ph * 1.3);
        if (x === x0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  function rose(cx, cy, R, ph, alpha) {
    /* 外摆线族：R、r 取互质比，画一圈花瓣纹 */
    ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
    ctx.beginPath();
    var a = R * 0.78, b = R * 0.22, d = R * 0.3, N = 1400;
    for (var i = 0; i <= N; i++) {
      var t = i / N * Math.PI * 2 * 11;
      var x = cx + (a + b) * Math.cos(t + ph * 0.2) - d * Math.cos((a + b) / b * t + ph);
      var y = cy + (a + b) * Math.sin(t + ph * 0.2) - d * Math.sin((a + b) / b * t + ph);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  function draw(t) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 0.7;
    var ph = t * 0.00016;
    var s = Math.min(W, H);
    rose(W * 0.86, H * 0.38, s * 0.52, ph * 3, 0.045);
  }
  var raf = 0, vis = true;
  function loop(t) { draw(t); raf = (vis && !reduce && !root.classList.contains('st-2') && !root.classList.contains('st-free')) ? requestAnimationFrame(loop) : 0; }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  size(); draw(0); if (!reduce) kick();
  window.addEventListener('resize', function () { size(); draw(performance.now()); });
  new MutationObserver(kick).observe(root, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', function () { vis = !document.hidden; if (vis) kick(); });
})();
