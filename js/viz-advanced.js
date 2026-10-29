/* ============================================================
   Viz-Advanced — 高阶分析可视化组件库（9 件）
   supViz          上确界实验室（最小上界）
   openCover       开覆盖与有限子覆盖（Heine–Borel）
   epsN            收敛定义的 N(ε)
   ivtBisect       介值定理与二分法求根
   uniformConv     一致收敛 vs 逐点收敛
   fourierSquare   傅里叶级数逼近方波（吉布斯现象）
   complexMap      复映射 w=z² / w=eᶻ（保角性）
   cantorSet       康托集构造（测度零而不可数）
   riemannLebesgue 黎曼竖切 vs 勒贝格横切
   依赖: viz-core.js（VIZ.register / VIZ.Plot）、math.js（MiniTeX）
   ============================================================ */
(function () {
  'use strict';

  const C = VIZ.COLORS;
  const AXIS = 'rgba(35,38,47,.72)';

  /* ---------- 公共小工具 ---------- */

  /* 数值显示：定点小数去尾零 */
  function num(v, d) {
    if (!isFinite(v)) return '∞';
    if (Math.abs(v) >= 1e5 || (v !== 0 && Math.abs(v) < 1e-4)) return v.toExponential(2);
    let s = v.toFixed(d == null ? 4 : d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  }

  /* 复数 a+bi 的显示 */
  function cpx(a, b) {
    return num(a, 3) + (b >= 0 ? ' + ' : ' − ') + num(Math.abs(b), 3) + 'i';
  }

  /* 画一条带右箭头的水平数轴（像素级刻度） */
  function axisLine(p, x1, x2, y, ticks, labDy) {
    const c = p.c;
    p.line(x1, y, x2 - (x2 - x1) * 0.028, y, { color: AXIS, width: 1.6 });
    p.arrow(x2 - (x2 - x1) * 0.075, y, x2, y, { color: AXIS, width: 1.6, head: 9 });
    (ticks || []).forEach(function (t) {
      const X = p.px(t.x), Y = p.py(y);
      c.strokeStyle = AXIS; c.lineWidth = 1.4;
      c.beginPath(); c.moveTo(X, Y - 4); c.lineTo(X, Y + 4); c.stroke();
      if (t.label != null) {
        c.fillStyle = 'rgba(35,38,47,.62)';
        c.font = '10.5px "SF Mono","Consolas",monospace';
        c.textAlign = 'center';
        c.fillText(t.label, X, Y + (labDy || 17));
      }
    });
  }

  /* 空心圆标记（开区间端点、sup、根等） */
  function hollow(p, x, y, r, color, w) {
    const c = p.c;
    c.strokeStyle = color; c.lineWidth = w || 2.2;
    c.beginPath(); c.arc(p.px(x), p.py(y), r || 6, 0, Math.PI * 2); c.stroke();
  }

  /* 两块画布并排（窄屏自动换行） */
  function sideBySide(c1, c2) {
    const w1 = c1.parentElement, w2 = c2.parentElement;
    const flex = document.createElement('div');
    flex.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap';
    w1.parentNode.insertBefore(flex, w1);
    [w1, w2].forEach(function (w) {
      flex.appendChild(w);
      w.style.flex = '1 1 300px';
      w.style.minWidth = '0';
    });
  }

  /* 折线经过映射后的绘制：越界自动断段 */
  function mappedPath(p, pts, opts) {
    const o = p.o, seg = [];
    const flush = function () { if (seg.length > 1) p.path(seg, opts); seg.length = 0; };
    for (let i = 0; i < pts.length; i++) {
      const q = pts[i];
      if (q[0] < o.xmin - 1.2 || q[0] > o.xmax + 1.2 || q[1] < o.ymin - 1.2 || q[1] > o.ymax + 1.2) flush();
      else seg.push(q);
    }
    flush();
  }

  /* ============================================================
     1. 上确界实验室
     S = { 1 − 1/n : n ∈ ℕ }：sup S = 1 不属于 S，inf S = 0 属于 S。
     ε-检验：存在 s ∈ S 使 s > 1−ε ⟺ n > 1/ε。
     ============================================================ */
  VIZ.register('supViz', {
    title: '上确界实验室',
    tag: 'MAT 215 · Stein I',
    desc: '拖动 K 增加点列 1−1/n，拖动 ε 检验 (1−ε,1] 内是否总有 S 的点——任何 b<1 都不是上界。',
    render(ctx) {
      const cv = ctx.canvas(340);
      const plot = new VIZ.Plot(cv, { xmin: -0.24, xmax: 1.42, ymin: -0.95, ymax: 0.95, grid: false, axes: false });
      const state = { K: 8, eps: 0.2, nStar: 6 };
      const ctl = ctx.controls();
      const sK = ctx.slider(ctl, '点数 K', 2, 40, 1, 8, function (v) { return v; });
      const sE = ctx.slider(ctl, 'ε（检验半径）', 0.02, 0.5, 0.01, 0.2, function (v) { return num(v, 2); });
      const ro = ctx.readout();

      function update() {
        state.K = +sK.input.value;
        state.eps = +sE.input.value;
        let nW = Math.floor(1 / state.eps) + 1; /* 最小的 n 使 1−1/n > 1−ε（浮点保护） */
        while (1 / nW >= state.eps - 1e-12) nW++;
        state.nStar = nW;
        plot.redraw();
        const e = state.eps, n = state.nStar, s = 1 - 1 / n;
        ctx.setReadout(ro,
          String.raw`$\sup S = 1$（不属于 S），$\inf S = 0 = \min S$（$s_1 = 0 \in S$）。` +
          String.raw`任取 $\varepsilon = ` + num(e, 2) + String.raw`$：由 $1-\frac{1}{n} &gt; 1-\varepsilon \Leftrightarrow n &gt; \frac{1}{\varepsilon} = ` + num(1 / e, 2) + String.raw`$，` +
          String.raw`最小的可行 $n = ` + n + String.raw`$ 已有 $s_n = 1-\frac{1}{` + n + String.raw`} = ` + num(s, 4) + String.raw` &gt; 1-\varepsilon = ` + num(1 - e, 3) + String.raw`$。` +
          String.raw`即 $b = 1-\varepsilon$ 不是上界——任何 $b &lt; 1$ 都不是上界；而 $1 \geq s_n$ 对一切 $n$ 成立，故 $1$ 是最小的上界。`);
      }

      plot.onDraw(function () {
        const K = state.K, eps = state.eps, nStar = state.nStar;
        axisLine(plot, -0.18, 1.36, 0, [
          { x: 0, label: '0' }, { x: 0.25 }, { x: 0.5, label: '0.5' }, { x: 0.75 }, { x: 1, label: '1' }
        ]);
        /* ε-检验带 (1−ε, 1] */
        plot.vband(1 - eps, 1, 'rgba(31,94,158,.14)');
        plot.text(1 - eps / 2, -0.45, '(1−ε, 1]', { size: 11.5, color: C.blue });
        plot.text(-0.14, -0.45, 'S = { 1 − 1/n : n∈ℕ }', { size: 11, color: 'rgba(35,38,47,.55)', align: 'left' });
        /* 候选上界 b = 1−ε：不是上界 */
        plot.line(1 - eps, -0.1, 1 - eps, 0.1, { color: C.gray, width: 1.6, dash: [4, 3] });
        plot.text(1 - eps, 0, 'b = 1−ε', { size: 10.5, color: C.gray, dy: -14, weight: '600' });
        /* 点列 s_n = 1 − 1/n */
        for (let n = 1; n <= K; n++) {
          const s = 1 - 1 / n;
          plot.point(s, 0, { r: 3.8, color: C.blue });
          if (n <= 5) plot.text(s, 0, num(s, 2), { size: 9.5, color: 'rgba(35,38,47,.55)', dy: -14, weight: '500' });
        }
        /* 见证点：s_{n*} > 1−ε */
        const sStar = 1 - 1 / nStar;
        plot.point(sStar, 0, { r: 5.5, color: C.green });
        plot.text(sStar, 0, 'n = ' + nStar, { size: 11, color: C.green, dy: -28, weight: '700' });
        plot.arrow(1 - eps, 0.08, sStar, 0.08, { color: C.green, width: 1.6, head: 6 });
        /* sup 与 inf 空心标记 */
        plot.vline(1, { dash: [5, 4], color: C.red, width: 1.3 });
        hollow(plot, 1, 0, 6.5, C.red);
        plot.text(1.41, 0.5, 'sup S = 1', { size: 12.5, color: C.red, align: 'right', weight: '700' });
        hollow(plot, 0, 0, 6.5, C.teal);
        plot.text(-0.22, 0.5, 'inf S = 0', { size: 12, color: C.teal, align: 'left', weight: '700' });
      });

      sK.input.addEventListener('input', update);
      sE.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     2. 开覆盖与有限子覆盖（Heine–Borel）
     紧：[0,1] 被无限族 (k/6−w, k/6+w) 覆盖 → 贪心抽出有限子覆盖。
     非紧：(0,1) 被有限族 (1/n,1) 覆盖，但任何有限子族盖不住 (0,1/K)。
     ============================================================ */
  VIZ.register('openCover', {
    title: '开覆盖与有限子覆盖（Heine–Borel）',
    tag: 'MAT 215 · Rudin 2',
    desc: '对比 [0,1] 与 (0,1)：紧集总能从开覆盖中抽出有限子覆盖，非紧集靠近端点处永远盖不到。',
    render(ctx) {
      const cv = ctx.canvas(430);
      const plot = new VIZ.Plot(cv, { xmin: -0.92, xmax: 2.0, ymin: -0.55, ymax: 2.15, grid: false, axes: false });
      const state = { mode: 'compact', w: 0.15, K: 8, extracted: false, t: 0 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '目标集', [['compact', '[0,1]（紧）'], ['open', '(0,1)（非紧）']], 'compact');
      const sW = ctx.slider(ctl, '覆盖密度（区间半宽 w）', 0.09, 0.24, 0.01, 0.15, function (v) { return num(v, 2); });
      const sK = ctx.slider(ctl, '区间个数 K', 3, 30, 1, 8, function (v) { return v; });
      const btn = ctx.button(ctl, '提取有限子覆盖', function () {
        if (state.mode === 'compact') { state.extracted = true; state.t = 0; update(); }
      });
      const ro = ctx.readout();

      /* 贪心：从左到右扫描 [0,1]，每步选覆盖当前 frontier 且右端最大的区间 */
      function greedy(w) {
        const keep = []; let cur = 0;
        while (cur < 1 - 1e-9) {
          let best = -1, bestR = cur;
          for (let k = -3; k <= 9; k++) {
            const r = k / 6 + w;
            if (k / 6 - w < cur + 1e-9 && r > bestR) { bestR = r; best = k; }
          }
          if (best < 0) break;
          keep.push(best); cur = bestR;
        }
        return keep;
      }

      function update() {
        state.w = +sW.input.value; state.K = +sK.input.value; state.mode = sel.value;
        const open = state.mode === 'open';
        plot.o.ymax = open ? 0.72 + 0.13 * state.K + 0.25 : 2.15;
        sW.input.parentElement.style.display = btn.style.display = open ? 'none' : '';
        sK.input.parentElement.style.display = open ? '' : 'none';
        plot.redraw();
        if (open) {
          ctx.setReadout(ro,
            String.raw`开覆盖 $\mathcal{U} = \{(1/n,\ 1) : n = 1..K\}$，$K = ` + state.K + String.raw`$：对每个 $x &gt; 0$ 取 $n &gt; 1/x$ 即有 $x \in (1/n, 1)$，故 $\mathcal{U}$ 盖住 $(0,1)$。` +
            String.raw`但任何有限子族的最大下标 $n^* \le K$，最左端点 $1/n^* \ge 1/K = ` + num(1 / state.K, 3) + String.raw` &gt; 0$，于是 $(0,\ 1/n^*)$ 无人覆盖（红色区域）。` +
            String.raw`$0$ 是聚点却不属于 $(0,1)$——无论 K 多大都够不到，故 $(0,1)$ 非紧。`);
        } else if (!state.extracted) {
          ctx.setReadout(ro,
            String.raw`无限开覆盖 $\mathcal{U} = \{(k/6-w,\ k/6+w) : k \in \mathbb{Z}\}$，$w = ` + num(state.w, 2) +
            String.raw`$（图中画出 $k = -3..9$）。相邻区间重叠 $2w - \frac{1}{6} = ` + num(2 * state.w - 1 / 6, 3) +
            String.raw` &gt; 0$，盖住整条数轴，当然盖住 $[0,1]$。点「提取有限子覆盖」看 Heine–Borel。`);
        } else {
          const keep = greedy(state.w);
          ctx.setReadout(ro,
            String.raw`✓ Heine–Borel：抽出了 $k = \{` + keep.join(', ') + String.raw`\}$ 共 ` + keep.length +
            String.raw` 个开区间（绿色加粗），仍然盖住 $[0,1]$。` +
            String.raw`$[0,1]$ 紧 ⇒ 任何开覆盖都有有限子覆盖——"有限"正是紧致性的实质。`);
        }
      }

      plot.onDraw(function () {
        const c = plot.c, open = state.mode === 'open';
        axisLine(plot, -0.55, 1.75, 0, [{ x: 0, label: '0' }, { x: 0.5, label: '0.5' }, { x: 1, label: '1' }]);
        /* 目标集 */
        if (!open) {
          plot.line(0, 0, 1, 0, { color: C.blue, width: 6 });
          plot.text(0.5, -0.38, '[0,1]', { size: 12.5, color: C.blue, weight: '700' });
          const keep = greedy(state.w);
          for (let k = -3; k <= 9; k++) {
            const l = k / 6 - state.w, r = k / 6 + state.w, y = 0.42 + 0.13 * (k + 3);
            const kept = state.extracted && keep.indexOf(k) >= 0, kc = kept ? C.green : C.orange;
            c.globalAlpha = state.extracted ? (kept ? 1 : Math.max(0.12, 1 - state.t)) : 1;
            plot.line(l, y, r, y, { color: kc, width: kept ? 4.5 : 3 });
            hollow(plot, l, y, 3, kc, 1.8); hollow(plot, r, y, 3, kc, 1.8);
          }
          c.globalAlpha = 1;
          plot.labelPx(plot.o.padL + 6, 15,
            state.extracted ? '有限子覆盖：' + keep.length + ' 个区间盖住 [0,1]' : '开覆盖 𝒰 = { (k/6 − w, k/6 + w) : k ∈ ℤ }，画出 k = −3…9',
            { size: 11, color: state.extracted ? C.green : 'rgba(35,38,47,.6)', weight: state.extracted ? '700' : '500' });
        } else {
          plot.line(0.02, 0, 0.98, 0, { color: C.blue, width: 6 });
          hollow(plot, 0, 0, 5.5, C.blue, 2); hollow(plot, 1, 0, 5.5, C.blue, 2);
          plot.text(0.5, -0.38, '(0,1)', { size: 12.5, color: C.blue, weight: '700' });
          plot.vband(0, 1 / state.K, 'rgba(192,57,43,.18)');
          plot.text(1 / state.K + 0.03, -0.38, '盖不到 (0, 1/' + state.K + ')', { size: 11, color: C.red, align: 'left' });
          for (let n = 1; n <= state.K; n++) {
            const y = 0.42 + 0.13 * n, l = 1 / n;
            if (l < 1) {
              plot.line(l, y, 1, y, { color: C.orange, width: 3 });
              hollow(plot, l, y, 3, C.orange, 1.8); hollow(plot, 1, y, 3, C.orange, 1.8);
            } else plot.text(0.02, y, 'n=' + n + '：(1,1) = ∅', { size: 9.5, color: 'rgba(35,38,47,.5)', align: 'left' });
          }
          plot.labelPx(plot.o.padL + 6, 15, '开覆盖 𝒰 = { (1/n, 1) : n = 1..' + state.K + ' }', { size: 11, color: 'rgba(35,38,47,.6)' });
        }
      });

      /* 淡出动画：t 从 0 → 1，非子覆盖区间渐隐 */
      ctx.animate(function (dt) {
        if (state.extracted && state.t < 1) { state.t = Math.min(1, state.t + dt * 1.4); plot.redraw(); }
      });

      sel.addEventListener('change', function () { state.extracted = false; state.t = 0; update(); });
      sW.input.addEventListener('input', function () { state.extracted = false; state.t = 0; update(); });
      sK.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     3. 收敛定义的 N(ε)
     1/n → 0：N = ⌊1/ε⌋+1；(n+1)/(2n+1) → 1/2：|aₙ−L| = 1/(4n+2)；
     (−1)ⁿn/(n+1)：奇偶子列极限不同，发散对照。
     ============================================================ */
  VIZ.register('epsN', {
    title: 'ε–N：收敛定义的定量化',
    tag: 'MAT 215',
    desc: '选择序列与 ε：从 N 起的所有项进入 L±ε 带并永不离开；第三个序列奇偶子列各奔东西，发散对照。',
    render(ctx) {
      const cv = ctx.canvas(380);
      const plot = new VIZ.Plot(cv, { xmin: 0, xmax: 62, ymin: -0.16, ymax: 1.14 });
      const SEQ = [
        { name: 'aₙ = 1/n', L: 0, f: function (n) { return 1 / n; }, yr: [-0.16, 1.14], N: function (e) { return Math.floor(1 / e) + 1; } },
        { name: 'aₙ = (n+1)/(2n+1)', L: 0.5, f: function (n) { return (n + 1) / (2 * n + 1); }, yr: [0.36, 0.8], N: function (e) { return Math.max(1, Math.floor((1 / e - 2) / 4) + 1); } },
        { name: 'aₙ = (−1)ⁿ·n/(n+1)', L: null, f: function (n) { return (n % 2 ? -1 : 1) * n / (n + 1); }, yr: [-1.35, 1.35] }
      ];
      const state = { si: 0, eps: 0.15 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '序列', SEQ.map(function (s, i) { return [String(i), s.name]; }), '0');
      const sE = ctx.slider(ctl, 'ε', 0.01, 0.5, 0.01, 0.15, function (v) { return num(v, 2); });
      const ro = ctx.readout();

      function update() {
        state.si = +sel.value;
        state.eps = +sE.input.value;
        const sq = SEQ[state.si], e = state.eps;
        plot.o.ymin = sq.yr[0]; plot.o.ymax = sq.yr[1];
        plot.redraw();
        if (sq.L != null) {
          const N = sq.N(e);
          let inner;
          if (state.si === 0) {
            inner = String.raw`$|a_n - L| = \frac{1}{n} &lt; \varepsilon \Leftrightarrow n &gt; \frac{1}{\varepsilon} = ` + num(1 / e, 2) +
              String.raw`$，故 $N = \lfloor 1/\varepsilon \rfloor + 1 = ` + N;
          } else {
            inner = String.raw`$a_n - \frac{1}{2} = \frac{1}{4n+2} &lt; \varepsilon \Leftrightarrow n &gt; \frac{1/\varepsilon - 2}{4} = ` + num((1 / e - 2) / 4, 2) +
              String.raw`$，故 $N = ` + N;
          }
          ctx.setReadout(ro, String.raw`$L = ` + num(sq.L, 2) + String.raw`，$\varepsilon = ` + num(e, 2) + String.raw`。` + inner +
            String.raw`$：所有 $n \geq N$ 的项（绿色）都满足 $|a_n - L| &lt; \varepsilon$，且一经入带永不离开。`);
        } else {
          ctx.setReadout(ro,
            String.raw`偶子列 $a_{2k} = \frac{2k}{2k+1} \to 1$，奇子列 $a_{2k+1} = -\frac{2k+1}{2k+2} \to -1$：两个子列极限不同 ⇒ 不收敛。` +
            String.raw`对任何候选 $L$，取 $\varepsilon = 0.5$，带 $[L-0.5,\ L+0.5]$ 至多盖住两个聚点之一，$n$ 再大也有一半的项在带外。` +
            String.raw`等价地 $|a_{2k} - a_{2k+1}| \to 2$：非 Cauchy 列。`);
        }
      }

      plot.onDraw(function () {
        const sq = SEQ[state.si], e = state.eps;
        const N = sq.L != null ? sq.N(e) : null;
        if (sq.L != null) {
          plot.hband(sq.L - e, sq.L + e, 'rgba(46,125,107,.13)');
          plot.hline(sq.L + e, { dash: [5, 4], color: C.green, width: 1.2 });
          plot.hline(sq.L - e, { dash: [5, 4], color: C.green, width: 1.2 });
          plot.hline(sq.L, { dash: [2, 3], color: 'rgba(35,38,47,.45)', width: 1.1 });
          plot.vline(N, { dash: [5, 4], color: C.red, width: 1.3 });
          plot.text(N, sq.yr[1], 'N = ' + N, { size: 11, color: C.red, align: 'left', dy: -8 });
        } else {
          plot.hline(1, { dash: [5, 4], color: C.orange, width: 1.3 });
          plot.hline(-1, { dash: [5, 4], color: C.purple, width: 1.3 });
          plot.text(60.5, 1, '偶子列 → 1', { size: 10.5, color: C.orange, align: 'right', dy: -10 });
          plot.text(60.5, -1, '奇子列 → −1', { size: 10.5, color: C.purple, align: 'right', dy: 16 });
        }
        for (let n = 1; n <= 60; n++) {
          const a = sq.f(n);
          let col;
          if (sq.L != null) {
            const inb = Math.abs(a - sq.L) < e;
            col = n >= N ? (inb ? C.green : C.red) : (inb ? C.gray : C.red);
          } else col = n % 2 ? C.purple : C.orange;
          plot.point(n, a, { r: 2.6, color: col });
        }
      });

      sel.addEventListener('change', update);
      sE.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     4. 介值定理与二分法求根
     f(a)f(b)<0 ⇒ 根存在；二分保留异号一半，b−a = 2⁻ᵏ，误差 ≤ (b−a)/2。
     ============================================================ */
  VIZ.register('ivtBisect', {
    title: '介值定理与二分法求根',
    tag: 'MAT 215 · Rudin IV',
    desc: 'f 连续且 f(a)f(b)<0 ⇒ 根存在。「二分一步」保留符号相反的一半，「自动二分」看区间每次折半。',
    render(ctx) {
      const FNS = [
        { name: 'f(x) = x³ − x − 2，[1,2]', f: function (x) { return x * x * x - x - 2; }, a: 1, b: 2, xw: [0.4, 2.35], yw: [-2.8, 4.8], root: 1.5213797068045676 },
        { name: 'f(x) = cos x − x，[0,1]', f: function (x) { return Math.cos(x) - x; }, a: 0, b: 1, xw: [-0.3, 1.35], yw: [-0.8, 1.25], root: 0.7390851332151607 },
        { name: 'f(x) = eˣ − 3，[1,2]', f: function (x) { return Math.exp(x) - 3; }, a: 1, b: 2, xw: [0.4, 2.3], yw: [-0.7, 4.8], root: Math.log(3) }
      ];
      const cv = ctx.canvas(400);
      const plot = new VIZ.Plot(cv, { xmin: 0.4, xmax: 2.35, ymin: -2.8, ymax: 4.8 });
      const state = { fi: 0, a: 1, b: 2, steps: 0, auto: false, acc: 0 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '函数', FNS.map(function (f, i) { return [String(i), f.name]; }), '0');
      ctx.button(ctl, '二分一步', function () { state.auto = false; bAuto.classList.remove('playing'); step(); update(); });
      const bAuto = ctx.button(ctl, '自动二分', function () {
        state.auto = !state.auto;
        bAuto.classList.toggle('playing', state.auto);
        if (state.auto) { state.acc = 0; update(); }
      });
      ctx.button(ctl, '重置', function () { reset(); });
      const ro = ctx.readout();

      function reset() {
        const F = FNS[state.fi];
        state.a = F.a; state.b = F.b; state.steps = 0;
        state.auto = false; bAuto.classList.remove('playing');
        plot.o.xmin = F.xw[0]; plot.o.xmax = F.xw[1];
        plot.o.ymin = F.yw[0]; plot.o.ymax = F.yw[1];
        update();
      }
      function step() {
        const F = FNS[state.fi], c = (state.a + state.b) / 2, fc = F.f(c);
        if (F.f(state.a) * fc <= 0) state.b = c; else state.a = c;
        state.steps++;
        if (state.b - state.a < 1e-4) { state.auto = false; bAuto.classList.remove('playing'); }
      }

      plot.onDraw(function () {
        const F = FNS[state.fi], f = F.f, a = state.a, b = state.b, c = (a + b) / 2;
        plot.vband(a, b, 'rgba(231,117,0,.13)');
        plot.hline(0, { color: 'rgba(35,38,47,.4)', width: 1.1 });
        plot.fn(f, { color: C.blue, width: 2.2 });
        plot.point(a, f(a), { r: 4.5, color: C.red, label: 'f(a)', dx: -28, dy: -12, labelColor: C.red });
        plot.point(b, f(b), { r: 4.5, color: C.blue, label: 'f(b)', dx: 10, dy: -12 });
        plot.vline(c, { dash: [4, 4], color: C.green, width: 1.2 });
        plot.point(c, f(c), { r: 4.5, color: C.green, label: 'f(c)', dx: 9, dy: 12, labelColor: C.green });
        /* 底部区间标尺：初始区间（灰虚线）与当前区间（橙） */
        const yb = plot.o.ymin + 0.055 * (plot.o.ymax - plot.o.ymin);
        plot.line(F.a, yb, F.b, yb, { color: 'rgba(35,38,47,.22)', width: 1.2, dash: [4, 3] });
        plot.line(a, yb, b, yb, { color: C.orange, width: 3.5 });
        hollow(plot, a, yb, 4, C.orange, 1.8);
        hollow(plot, b, yb, 4, C.orange, 1.8);
        plot.text((a + b) / 2, yb, 'b − a = ' + num(b - a, 6), { size: 10.5, color: C.orange, dy: 17 });
        hollow(plot, F.root, 0, 5.5, C.ink, 2.2);
        plot.text(F.root, 0, '根 ≈ ' + num(F.root, 4), { size: 11, color: C.ink, dy: 20 });
      });

      ctx.animate(function (dt) {
        if (!state.auto) return;
        state.acc += dt;
        if (state.acc >= 0.4) { state.acc = 0; step(); update(); }
      });

      function update() {
        plot.redraw();
        const F = FNS[state.fi], f = F.f;
        const a = state.a, b = state.b, c = (a + b) / 2, fc = f(c);
        const sign = fc === 0 ? '零' : (fc > 0 ? '正' : '负');
        ctx.setReadout(ro,
          String.raw`$[a,b] = [` + num(a, 6) + ', ' + num(b, 6) + String.raw`]，中点 $c = ` + num(c, 6) +
          String.raw`，$f(c) = ` + num(fc, 5) + String.raw`$（` + sign + String.raw`）→ 保留 $f$ 变号的一半。已二分 ` + state.steps +
          String.raw` 步：$b - a = ` + num(b - a, 6) + String.raw` = 2^{-` + state.steps + String.raw`}·(b_0 - a_0)$。` +
          String.raw`IVT 保证根存在，且根 ∈ $[c - \frac{b-a}{2},\ c + \frac{b-a}{2}]$：误差 $\le \frac{b-a}{2} = ` + num((b - a) / 2, 6) +
          String.raw`$（真实误差 $|c - x^*| = ` + num(Math.abs(c - F.root), 6) + '$）。');
      }

      sel.addEventListener('change', function () { state.fi = +sel.value; reset(); });
      reset();
    }
  });

  /* ============================================================
     5. 一致收敛 vs 逐点收敛
     xⁿ：逐点极限不连续，sup = 1 ↛ 0；xⁿ/n：sup = 1/n → 0；
     nxe^(−nx)：逐点 → 0 但 sup = 1/e 恒定（峰在搬家）。
     ============================================================ */
  VIZ.register('uniformConv', {
    title: '一致收敛 vs 逐点收敛',
    tag: 'MAT 215 · Rudin VII',
    desc: '调 n 观察阴影区 |fₙ−f|：一致收敛要求 sup 范数整体趋零，而不只是每个点各自趋零。',
    render(ctx) {
      const cv = ctx.canvas(400);
      const plot = new VIZ.Plot(cv, { xmin: 0, xmax: 1.06, ymin: -0.08, ymax: 1.3 });
      const FAMS = [
        { name: 'fₙ(x) = xⁿ（[0,1]）',
          f: function (x, n) { return Math.pow(x, n); }, lim: function (x) { return x < 1 ? 0 : 1; },
          xr: 1.06, yr: [-0.08, 1.3], shadeMax: 0.998, supN: function () { return 1; } },
        { name: 'fₙ(x) = xⁿ/n（[0,1]）',
          f: function (x, n) { return Math.pow(x, n) / n; }, lim: function () { return 0; },
          xr: 1.06, yr: [-0.06, 1.12], shadeMax: 1.05, supN: function (n) { return 1 / n; } },
        { name: 'fₙ(x) = n·x·e^(−n·x)（[0,2]）',
          f: function (x, n) { return n * x * Math.exp(-n * x); }, lim: function () { return 0; },
          xr: 2.05, yr: [-0.06, 0.55], shadeMax: 2.04, supN: function () { return 1 / Math.E; } }
      ];
      const state = { fi: 0, n: 5 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '函数族', FAMS.map(function (f, i) { return [String(i), f.name]; }), '0');
      const sN = ctx.slider(ctl, 'n', 1, 60, 1, 5, function (v) { return v; });
      const ro = ctx.readout();

      function update() {
        state.fi = +sel.value;
        state.n = +sN.input.value;
        const F = FAMS[state.fi];
        plot.o.xmax = F.xr; plot.o.ymin = F.yr[0]; plot.o.ymax = F.yr[1];
        plot.redraw();
        const n = state.n;
        let sNum = 0;
        for (let i = 1; i <= 400; i++) {
          const x = F.shadeMax * i / 400;
          sNum = Math.max(sNum, Math.abs(F.f(x, n) - F.lim(x)));
        }
        let note;
        if (state.fi === 0) {
          note = String.raw`逐点极限 $f(x) = 0\ (0 \le x &lt; 1)$、$f(1) = 1$，不连续。而 $\sup_{[0,1]} |f_n - f| = 1$ 对每个 $n$ 都成立（在 $x \to 1^-$ 处趋达），不随 $n$ 消失 ⇒ 非一致收敛——连续函数列的一致极限必连续，矛盾。`;
        } else if (state.fi === 1) {
          note = String.raw`$\sup_{[0,1]} |f_n - f| = \frac{1}{n} = ` + num(1 / n, 4) + String.raw` \to 0$ ⇒ 一致收敛于 0：整条曲线带状塌向极限。`;
        } else {
          note = String.raw`每个固定 $x &gt; 0$ 处 $f_n(x) \to 0$（逐点收敛），但 $\sup = \frac{1}{e} \approx 0.3679$ 在 $x = \frac{1}{n} = ` + num(1 / n, 3) + String.raw`$ 处取得，恒定不减 ⇒ 非一致收敛：峰只是向左搬运，从不消失。`;
        }
        ctx.setReadout(ro,
          String.raw`$n = ` + n + String.raw`，$f_n$（橙）与逐点极限 $f$（灰虚线）之间的橙色区即误差。数值采样 $\sup|f_n - f| \approx ` + num(sNum, 4) +
          String.raw`，解析 $\sup = ` + num(F.supN(n), 4) + String.raw`$。` + note);
      }

      plot.onDraw(function () {
        const F = FAMS[state.fi], n = state.n;
        /* 误差阴影区 */
        const pts = [];
        for (let i = 0; i <= 160; i++) {
          const x = F.shadeMax * i / 160;
          pts.push([x, F.f(x, n)]);
        }
        for (let i = 160; i >= 0; i--) {
          const x = F.shadeMax * i / 160;
          pts.push([x, F.lim(x)]);
        }
        plot.path(pts, { color: 'rgba(231,117,0,.55)', width: 1, fill: 'rgba(231,117,0,.16)', close: true });
        /* 极限函数 */
        if (state.fi === 0) {
          plot.line(0, 0, 0.995, 0, { color: 'rgba(35,38,47,.5)', width: 1.8, dash: [6, 5] });
          hollow(plot, 1, 1, 4.5, 'rgba(35,38,47,.55)', 2);
          plot.text(1, 1, 'f(1)=1', { size: 10.5, color: 'rgba(35,38,47,.6)', dy: -10, align: 'right' });
        } else {
          plot.hline(0, { color: 'rgba(35,38,47,.5)', width: 1.8, dash: [6, 5] });
        }
        /* f_n 与峰值 */
        plot.fn(function (x) { return F.f(x, n); }, { color: C.orange, width: 2.4 });
        let peak = 0, xp = 0;
        for (let i = 1; i <= 400; i++) {
          const x = F.shadeMax * i / 400, v = F.f(x, n);
          if (v > peak) { peak = v; xp = x; }
        }
        if (state.fi === 2) plot.point(xp, peak, { r: 3.5, color: C.red, label: '峰 x=1/n', dx: 8, dy: -8, labelColor: C.red });
        plot.labelPx(plot.o.padL + 6, 15, F.name + '，n = ' + n + '；虚线为逐点极限 f', { size: 11, color: 'rgba(35,38,47,.6)' });
      });

      sel.addEventListener('change', update);
      sN.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     6. 傅里叶级数逼近方波（吉布斯现象）
     S_N(x) = (4/π)Σ_{k 奇 ≤ N} sin(kx)/k，b_k = 4/(πk)。
     过冲比例 → (Si(π)/π) − 1/2 ≈ 8.95%（0/1 方波峰值 → 1.0895）。
     ============================================================ */
  VIZ.register('fourierSquare', {
    title: '傅里叶级数逼近方波（吉布斯现象）',
    tag: 'Stein & Shakarchi I',
    desc: '增加谐波数 N：部分和越来越贴近方波，但跳变点附近的过冲只变窄不变低，稳定在 Gibbs 常数。',
    render(ctx) {
      const cv = ctx.canvas(320);
      const plot = new VIZ.Plot(cv, { xmin: -3.55, xmax: 3.55, ymin: -1.62, ymax: 1.62 });
      const cb = ctx.canvas(150);
      const bars = new VIZ.Plot(cb, { xmin: -0.6, xmax: 21.6, ymin: 0, ymax: 1.62, grid: false, axes: false });
      const state = { N: 5 };
      const ctl = ctx.controls();
      const sN = ctx.slider(ctl, '谐波数 N', 1, 40, 1, 5, function (v) { return v + '（' + (Math.floor(v / 2) + 1) + ' 项）'; });
      const ro = ctx.readout();

      function S(x, N) {
        let s = 0;
        for (let k = 1; k <= N; k += 2) s += Math.sin(k * x) / k;
        return 4 / Math.PI * s;
      }

      plot.onDraw(function () {
        const N = state.N;
        /* 方波 sign(sin x) 一个周期 */
        plot.line(0.02, 1, Math.PI - 0.02, 1, { color: C.blue, width: 3 });
        plot.line(-Math.PI + 0.02, -1, -0.02, -1, { color: C.blue, width: 3 });
        hollow(plot, 0, 1, 4, C.blue, 2);
        hollow(plot, 0, -1, 4, C.blue, 2);
        hollow(plot, Math.PI, 1, 4, C.blue, 2);
        hollow(plot, -Math.PI, -1, 4, C.blue, 2);
        plot.vline(Math.PI, { dash: [3, 4], color: 'rgba(35,38,47,.3)', width: 1 });
        plot.vline(-Math.PI, { dash: [3, 4], color: 'rgba(35,38,47,.3)', width: 1 });
        /* 部分和 */
        plot.fn(function (x) { return S(x, N); }, { color: C.orange, width: 2.2 });
        /* 跳变点附近的峰值 */
        let peak = 0, xp = 0;
        const span = Math.min(Math.PI, 2.6 * Math.PI / (N + 1));
        for (let i = 1; i <= 500; i++) {
          const x = span * i / 500, v = S(x, N);
          if (v > peak) { peak = v; xp = x; }
        }
        plot.point(xp, peak, { r: 3.5, color: C.red, label: '峰值', dx: 8, dy: -8, labelColor: C.red });
        plot.labelPx(plot.o.padL + 6, 15, 'f(x) = sign(sin x)，周期 2π；N = ' + N, { size: 11, color: 'rgba(35,38,47,.6)' });
      });

      bars.onDraw(function () {
        const N = state.N;
        for (let k = 1; k <= 21; k += 2) {
          const h = 4 / (Math.PI * k);
          bars.rectArea(k - 0.34, k + 0.34, 0, h, k <= N ? 'rgba(0,131,143,.8)' : 'rgba(0,131,143,.13)');
          if (k <= 3) bars.text(k, h, num(h, 3), { size: 9.5, color: C.teal, dy: -5, weight: '700' });
          if (k % 4 === 1) bars.text(k, 0, String(k), { size: 9.5, color: 'rgba(35,38,47,.55)', dy: 13, weight: '500' });
        }
        bars.labelPx(bars.o.padL + 6, 15, '系数 |b_k| = 4/(πk)（k 奇），灰色为尚未计入的项', { size: 10.5, color: 'rgba(35,38,47,.6)' });
      });

      function update() {
        state.N = +sN.input.value;
        const N = state.N, terms = Math.floor(N / 2) + 1;
        let peak = 0, xp = 0;
        const span = Math.min(Math.PI, 2.6 * Math.PI / (N + 1));
        for (let i = 1; i <= 500; i++) {
          const x = span * i / 500, v = S(x, N);
          if (v > peak) { peak = v; xp = x; }
        }
        const over = (peak - 1) / 2 * 100;
        plot.redraw(); bars.redraw();
        ctx.setReadout(ro,
          String.raw`$S_N(x) = \frac{4}{\pi}\sum_{k\ \text{奇} \le N} \frac{\sin kx}{k}$，$N = ` + N + String.raw`$（` + terms + String.raw` 项）。` +
          String.raw`在跳变点 $x = 0$ 右侧采样得 $S_N$ 峰值 $\approx ` + num(peak, 4) + String.raw`$（位于 $x \approx ` + num(xp, 3) + String.raw`$），` +
          String.raw`过冲 $= \frac{S_{peak}-1}{\text{跳变 } 2} \approx ` + num(over, 2) + String.raw`%$。` +
          String.raw`$N \to \infty$ 时峰值不降 → 极限过冲 $\frac{1}{\pi}\mathrm{Si}(\pi) - \frac{1}{2} \approx 8.95%$（Gibbs 常数；` +
          String.raw`若把方波归一化为 0/1 取值、跳变为 1，峰值 → $1 + 0.0895 \approx 1.089$）。误差从不消失，只被挤进越来越窄的邻域。`);
      }

      sN.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     7. 复映射 w = z² 与 w = eᶻ
     左：z 平面整数网格 + 单位圆 + 可拖动点 z；右：像曲线（仍正交）。
     ============================================================ */
  VIZ.register('complexMap', {
    title: '复映射：w = z² 与 w = eᶻ',
    tag: 'MAT 216 · Brown',
    desc: '在左图拖动点 z，右图实时显示 w = f(z)；整数网格与单位圆的像曲线保持正交——保角性。',
    render(ctx) {
      const c1 = ctx.canvas(330), c2 = ctx.canvas(330);
      sideBySide(c1, c2);
      const pz = new VIZ.Plot(c1, { xmin: -2.05, xmax: 2.05, ymin: -2.05, ymax: 2.05 });
      const pw = new VIZ.Plot(c2, { xmin: -4.1, xmax: 4.1, ymin: -4.1, ymax: 4.1 });
      const MAPS = [
        { name: 'w = z²', F: function (x, y) { return [x * x - y * y, 2 * x * y]; }, win: [-4.1, 4.1, -4.1, 4.1] },
        { name: 'w = eᶻ', F: function (x, y) { return [Math.exp(x) * Math.cos(y), Math.exp(x) * Math.sin(y)]; }, win: [-1.2, 6.2, -4.1, 4.1] }
      ];
      const state = { mi: 0, zx: 1.2, zy: 0.8 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '映射', MAPS.map(function (m, i) { return [String(i), m.name]; }), '0');
      const ro = ctx.readout();
      const CV = 'rgba(31,94,158,.55)', CH = 'rgba(46,125,107,.6)';

      function update() {
        state.mi = +sel.value;
        const m = MAPS[state.mi];
        pw.o.xmin = m.win[0]; pw.o.xmax = m.win[1];
        pw.o.ymin = m.win[2]; pw.o.ymax = m.win[3];
        pz.redraw(); pw.redraw();
        const a = state.zx, b = state.zy, w = m.F(a, b);
        let extra;
        if (state.mi === 0) {
          extra = String.raw`$|w| = |z|^2 = ` + num(a * a + b * b, 3) + String.raw`$，$\arg w = 2\arg z$：辐角翻倍，单位圆映成单位圆（绕两圈）。`;
        } else {
          extra = String.raw`$|w| = e^{\mathrm{Re}\,z} = e^{` + num(a, 3) + String.raw`} = ` + num(Math.exp(a), 3) + String.raw`$，$\arg w = \mathrm{Im}\,z$：竖线 x=k 映成圆，横线 y=k 映成射线。`;
        }
        ctx.setReadout(ro,
          String.raw`$z = ` + cpx(a, b) + String.raw` \mapsto w = ` + cpx(w[0], w[1]) + String.raw`$。` + extra +
          String.raw`网格像曲线仍处处正交：全纯映射保角（仅在导数为 0 处例外，如 $z^2$ 在原点）。`);
      }

      pz.onDraw(function () {
        for (let k = -2; k <= 2; k++) {
          pz.vline(k, { color: CV, width: 1.1 });
          pz.hline(k, { color: CH, width: 1.1 });
        }
        const circ = [];
        for (let i = 0; i <= 80; i++) {
          const t = 2 * Math.PI * i / 80;
          circ.push([Math.cos(t), Math.sin(t)]);
        }
        pz.path(circ, { color: C.purple, width: 1.6, dash: [6, 4] });
        pz.arrow(0, 0, state.zx, state.zy, { color: 'rgba(231,117,0,.5)', width: 1.5, head: 6 });
        pz.point(state.zx, state.zy, { r: 5, color: C.orange, label: 'z', dx: 9, dy: -9 });
        pz.labelPx(pz.o.padL + 6, 15, 'z 平面（拖动橙点）', { size: 11, color: 'rgba(35,38,47,.6)' });
      });

      pw.onDraw(function () {
        const m = MAPS[state.mi], F = m.F;
        /* 竖网格线 x = k 的像 */
        for (let k = -2; k <= 2; k++) {
          const pts = [];
          for (let i = 0; i <= 48; i++) {
            const t = -2 + 4 * i / 48;
            pts.push(F(k, t));
          }
          mappedPath(pw, pts, { color: CV, width: 1.1 });
        }
        /* 横网格线 y = k 的像 */
        for (let k = -2; k <= 2; k++) {
          const pts = [];
          for (let i = 0; i <= 48; i++) {
            const t = -2 + 4 * i / 48;
            pts.push(F(t, k));
          }
          mappedPath(pw, pts, { color: CH, width: 1.1 });
        }
        /* 单位圆的像 */
        const circ = [];
        for (let i = 0; i <= 120; i++) {
          const t = 2 * Math.PI * i / 120;
          circ.push(F(Math.cos(t), Math.sin(t)));
        }
        mappedPath(pw, circ, { color: C.purple, width: 1.6, dash: [6, 4] });
        /* 像 w = f(z) */
        const w = F(state.zx, state.zy);
        pw.point(0, 0, { r: 3, color: 'rgba(35,38,47,.5)' });
        pw.arrow(0, 0, w[0], w[1], { color: 'rgba(231,117,0,.5)', width: 1.5, head: 6 });
        pw.point(w[0], w[1], { r: 5, color: C.orange, label: 'w', dx: 9, dy: -9 });
        pw.labelPx(pw.o.padL + 6, 15, 'w 平面：' + m.name + ' 下的像', { size: 11, color: 'rgba(35,38,47,.6)' });
      });

      pz.drag(function (q) {
        state.zx = Math.max(-2, Math.min(2, q[0]));
        state.zy = Math.max(-2, Math.min(2, q[1]));
        update();
      });
      sel.addEventListener('change', update);
      update();
    }
  });

  /* ============================================================
     8. 康托集的构造
     第 k 步留 2ᵏ 段、每段长 3⁻ᵏ，总长 (2/3)ᵏ → 0；C 不可数。
     ============================================================ */
  VIZ.register('cantorSet', {
    title: '康托集的构造',
    tag: 'MAT 215 · Stein III',
    desc: '逐步挖去中三分之一：剩余总长 (2/3)ⁿ 迅速归零，但康托集与 [0,1] 等势——不可数却测度为零。',
    render(ctx) {
      const cv = ctx.canvas(340);
      const plot = new VIZ.Plot(cv, { xmin: -0.07, xmax: 1.07, ymin: -0.55, ymax: 6.15, grid: false, axes: false });
      const state = { n: 3, x: 0.25 };
      const ctl = ctx.controls();
      const sN = ctx.slider(ctl, '步数 n', 0, 6, 1, 3, function (v) { return v; });
      const sX = ctx.slider(ctl, '采样点 x', 0, 1, 0.01, 0.25, function (v) { return num(v, 2); });
      ctx.button(ctl, '下一步 →', function () {
        if (state.n < 6) { state.n++; sN.set(state.n); update(); }
      });
      const ro = ctx.readout();

      /* 三进制逐位取数：第 k 位出现 1 ⇒ x 在第 k 步被挖去 */
      function ternInfo(x) {
        let t = x, dig = '', bad = 0;
        for (let i = 1; i <= 8; i++) {
          let d = Math.floor(t * 3); if (d > 2) d = 2;
          dig += d; if (d === 1 && !bad) bad = i;
          t = t * 3 - d;
        }
        return { dig: dig, bad: bad };
      }

      function update() {
        state.n = +sN.input.value; state.x = +sX.input.value;
        plot.redraw();
        const n = state.n;
        const ti = ternInfo(state.x);
        ctx.setReadout(ro,
          String.raw`第 $n = ` + n + String.raw`$ 步：$E_n$ 含 $2^n = ` + Math.pow(2, n) + String.raw` 段，每段长 $3^{-n} = ` + num(Math.pow(3, -n), 6) +
          String.raw`，剩余总长 $(2/3)^n = ` + num(Math.pow(2 / 3, n), 6) + String.raw` \to 0$。` +
          String.raw`康托集 $C = E_0 \cap E_1 \cap \cdots$ 的勒贝格测度为 0（装进总长任意小的并集里），` +
          String.raw`却与 $[0,1]$ 等势（三进制展开只用数字 0 与 2 的数，$\{0,2\}^{\mathbb{N}}$ 不可数）——"面积无、点数多"。` +
          String.raw`采样点 x = ` + num(state.x, 2) + String.raw`：三进制展开 0.` + ti.dig + String.raw`…₃，` +
          (ti.bad
            ? String.raw`第 ` + ti.bad + String.raw` 位出现 1 ⇒ x 在第 ` + ti.bad + String.raw` 步被挖去（红点）。`
            : String.raw`前 8 位只含 0 与 2 ⇒ 绿点贯穿每一步——三进制只用 0/2 正是 x ∈ C 的判据。`));
      }

      plot.onDraw(function () {
        const n = state.n;
        const ti = ternInfo(state.x);
        axisLine(plot, -0.04, 1.04, 0, [
          { x: 0, label: '0' }, { x: 1 / 3, label: '1/3' }, { x: 2 / 3, label: '2/3' }, { x: 1, label: '1' }
        ]);
        plot.vline(state.x, { color: 'rgba(35,38,47,.22)', width: 1, dash: [3, 4] });
        for (let k = 0; k <= n; k++) {
          const y = 0.55 + 0.85 * k;
          plot.labelPx(10, plot.py(y) + 3.5, 'E' + k, { size: 11, color: 'rgba(35,38,47,.6)' });
          const segs = Math.pow(2, k);
          for (let i = 0; i < segs; i++) {
            const l = 2 * i / Math.pow(3, k), r = (2 * i + 1) / Math.pow(3, k);
            plot.line(l, y, r, y, { color: C.blue, width: 5.5 });
          }
          /* 第 k 步刚被挖去的中三分之一（浅红） */
          if (k >= 1) {
            const cuts = Math.pow(2, k - 1);
            for (let i = 0; i < cuts; i++) {
              const l = (6 * i + 1) / Math.pow(3, k), r = (6 * i + 2) / Math.pow(3, k);
              plot.line(l, y - 0.2, r, y - 0.2, { color: 'rgba(192,57,43,.55)', width: 2 });
            }
          }
          /* 采样点在第 k 步的存活性 */
          plot.point(state.x, y, { color: (!ti.bad || ti.bad > k) ? C.green : C.red, r: 4 });
        }
        plot.text(0.5, 5.85, '总长 (2/3)ⁿ = ' + num(Math.pow(2 / 3, n), 4), { size: 11.5, color: C.ink, weight: '700' });
      });

      sN.input.addEventListener('input', update);
      sX.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     9. 黎曼竖切 vs 勒贝格横切
     黎曼：Σ f(中点)Δx（按 x 数）；勒贝格：Σ meas{f ≥ y_j}·Δy（按 y 数，
     对单调 f 即 (1 − f⁻¹(y_j))·Δy）。二者收敛于同一定积分。
     ============================================================ */
  VIZ.register('riemannLebesgue', {
    title: '黎曼竖切 vs 勒贝格横切',
    tag: 'MAT 215 · Stein III',
    desc: '同一积分的两种数法：黎曼按 x 切竖条先定位置再量高度；勒贝格按 y 切横条先数面额再乘厚度。二者收敛到同一定积分。',
    render(ctx) {
      const FNS = [
        { name: 'f(x) = x²', f: function (x) { return x * x; }, yr: 1.35, top: 1, exact: 1 / 3,
          inv: function (y) { return Math.sqrt(y); }, meas: function (y) { return 1 - Math.sqrt(y); } },
        { name: 'f(x) = √x', f: function (x) { return Math.sqrt(x); }, yr: 1.35, top: 1, exact: 2 / 3,
          inv: function (y) { return y * y; }, meas: function (y) { return 1 - y * y; } },
        { name: 'f = 1, 2, 3 三段常值', f: function (x) { return x < 1 / 3 ? 1 : (x < 2 / 3 ? 2 : 3); }, yr: 3.45, top: 3, exact: 2,
          inv: function (y) { return y <= 1 ? 0 : (y <= 2 ? 1 / 3 : (y <= 3 ? 2 / 3 : 1)); },
          meas: function (y) { return y <= 1 ? 1 : (y <= 2 ? 2 / 3 : (y <= 3 ? 1 / 3 : 0)); } }
      ];
      const c1 = ctx.canvas(300), c2 = ctx.canvas(300);
      sideBySide(c1, c2);
      const pr = new VIZ.Plot(c1, { xmin: -0.06, xmax: 1.06, ymin: -0.3, ymax: 1.35 });
      const pl = new VIZ.Plot(c2, { xmin: -0.06, xmax: 1.06, ymin: -0.3, ymax: 1.35 });
      const state = { fi: 0, n: 8, m: 6 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '函数', FNS.map(function (f, i) { return [String(i), f.name]; }), '0');
      const sN = ctx.slider(ctl, '黎曼竖条数 n', 1, 60, 1, 8, function (v) { return v; });
      const sM = ctx.slider(ctl, '勒贝格层数 m', 1, 40, 1, 6, function (v) { return v; });
      const ro = ctx.readout();

      function update() {
        state.fi = +sel.value;
        state.n = +sN.input.value;
        state.m = +sM.input.value;
        const F = FNS[state.fi];
        pr.o.ymax = F.yr; pl.o.ymax = F.yr;
        /* 黎曼中点和 */
        let SR = 0;
        for (let i = 0; i < state.n; i++) SR += F.f((i + 0.5) / state.n) / state.n;
        /* 勒贝格水平层和（上和）：Σ meas{f ≥ y_j}·Δy */
        const dy = F.top / state.m;
        let SL = 0;
        for (let j = 0; j < state.m; j++) SL += F.meas(j * dy) * dy;
        pr.redraw(); pl.redraw();
        ctx.setReadout(ro,
          String.raw`黎曼（$n = ` + state.n + String.raw`，中点法）：$S_R = \sum_i f(c_i)\,\Delta x = ` + num(SR, 5) +
          String.raw`；勒贝格（$m = ` + state.m + String.raw`，水平层）：$S_L = \sum_j \text{meas}\{f \ge y_j\} \cdot \Delta y = ` + num(SL, 5) +
          String.raw`；精确值 $\int_0^1 f = ` + num(F.exact, 5) + String.raw`$。` +
          String.raw`两种数法都收敛到同一定积分：黎曼先选位置再量高度（数每一竖条贡献多少）；` +
          String.raw`勒贝格先按面额 $y_j$ 清点测度 $\text{meas}\{f \ge y_j\}$ 再乘厚度 $\Delta y$（先数面额、再数张数）。` +
          String.raw`对递增的 $f$，$\text{meas}\{f \ge y\} = 1 - f^{-1}(y)$，故勒贝格和是上估计，随 $m$ 增大向下收敛。`);
      }

      pr.onDraw(function () {
        const F = FNS[state.fi], n = state.n;
        for (let i = 0; i < n; i++) {
          const x0 = i / n, x1 = (i + 1) / n, h = F.f((x0 + x1) / 2);
          pr.rectArea(x0, x1, 0, h, 'rgba(231,117,0,.20)');
          pr.line(x0, 0, x0, h, { color: 'rgba(231,117,0,.5)', width: 1 });
          pr.line(x0, h, x1, h, { color: 'rgba(231,117,0,.75)', width: 1.3 });
        }
        pr.fn(F.f, { color: C.blue, width: 2.2 });
        pr.labelPx(pr.o.padL + 6, 15, '黎曼：竖切（中点法），n = ' + n, { size: 11, color: 'rgba(35,38,47,.6)' });
      });

      pl.onDraw(function () {
        const F = FNS[state.fi], m = state.m, dy = F.top / m;
        for (let j = 0; j < m; j++) {
          const y0 = j * dy, x0 = F.inv(y0);
          pl.rectArea(x0, 1, y0, y0 + dy * 0.94, 'rgba(0,131,143,.20)');
          pl.line(x0, y0, x0, y0 + dy * 0.94, { color: 'rgba(0,131,143,.55)', width: 1 });
          pl.line(x0, y0 + dy * 0.94, 1, y0 + dy * 0.94, { color: 'rgba(0,131,143,.6)', width: 1.3 });
        }
        pl.fn(F.f, { color: C.blue, width: 2.2 });
        pl.labelPx(pl.o.padL + 6, 15, '勒贝格：横切（水平层），m = ' + m, { size: 11, color: 'rgba(35,38,47,.6)' });
      });

      sel.addEventListener('change', update);
      sN.input.addEventListener('input', update);
      sM.input.addEventListener('input', update);
      update();
    }
  });
})();
