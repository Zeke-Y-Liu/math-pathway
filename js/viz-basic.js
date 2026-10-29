/* ============================================================
   Viz-Basic — 基础可视化组件库（13 件）
   transformLab    图像变换实验室
   unitCircle      单位圆与三角函数
   seqLab          数列收敛实验室
   limitEpsDelta   ε-δ 极限定义
   secantTangent   割线逼近切线
   derivativeLink  函数与导数联动
   optimization    最优化（定周长最大面积）
   riemannSum      黎曼和与 Darboux 上下和
   areaFunction    面积累积函数（FTC）
   solidsRevolution 旋转体体积（disk 法）
   taylorLab       泰勒多项式实验室
   seriesSums      级数部分和
   surfaceLab      等高线与梯度场
   依赖: viz-core.js（VIZ.register / VIZ.Plot）、math.js（MiniTeX）
   ============================================================ */
(function () {
  'use strict';

  const C = VIZ.COLORS;

  /* ---------- 公共小工具 ---------- */
  function num(v, d) {
    if (!isFinite(v)) return '∞';
    if (Math.abs(v) >= 1e5 || (v !== 0 && Math.abs(v) < 1e-4)) return v.toExponential(2);
    let s = v.toFixed(d == null ? 4 : d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  }
  function fact(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
  function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }
  function deg(v) { return v * 180 / Math.PI; }
  /* 两块画布并排（窄屏自动换行） */
  function sideBySide(c1, c2) {
    const w1 = c1.parentElement, w2 = c2.parentElement;
    const flex = document.createElement('div');
    flex.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap';
    w1.parentNode.insertBefore(flex, w1);
    [w1, w2].forEach(function (w) {
      flex.appendChild(w);
      w.style.flex = '1 1 320px';
      w.style.minWidth = '0';
    });
  }

  /* ============================================================
     1. transformLab — y = a·f(b(x−c)) + d
     ============================================================ */
  VIZ.register('transformLab', {
    title: '图像变换实验室',
    tag: 'MAT 100',
    desc: '选择基础函数，拖动 a、b、c、d 滑块：虚线是原型 y=f(x)，实线是变换后的图像。',
    render(ctx) {
      const cv = ctx.canvas(400);
      const plot = new VIZ.Plot(cv, { xmin: -6, xmax: 6, ymin: -4.2, ymax: 5.8 });
      const BASE = {
        x2: { tex: 'x^2', f: function (x) { return x * x; } },
        sqrt: { tex: '\\sqrt{x}', f: function (x) { return x < 0 ? NaN : Math.sqrt(x); } },
        abs: { tex: '|x|', f: Math.abs },
        sin: { tex: '\\sin x', f: Math.sin }
      };
      const state = { base: 'x2', a: 1, b: 1, c: 0, d: 0 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '基础函数', [['x2', 'x²'], ['sqrt', '√x'], ['abs', '|x|'], ['sin', 'sin x']], 'x2');
      const sa = ctx.slider(ctl, 'a（纵向伸缩）', -3, 3, 0.1, 1);
      const sb = ctx.slider(ctl, 'b（横向伸缩）', -3, 3, 0.1, 1);
      const sc = ctx.slider(ctl, 'c（右移）', -4, 4, 0.1, 0);
      const sd = ctx.slider(ctl, 'd（上移）', -3, 3, 0.1, 0);
      const ro = ctx.readout();

      function update() {
        state.base = sel.value;
        state.a = +sa.input.value; state.b = +sb.input.value;
        state.c = +sc.input.value; state.d = +sd.input.value;
        if (Math.abs(state.b) < 0.05) state.b = state.b < 0 ? -0.05 : 0.05;
        plot.redraw();
        const b = BASE[state.base];
        ctx.setReadout(ro,
          String.raw`当前：$y = a\,f\big(b(x-c)\big)+d = ` + num(state.a, 1) + String.raw`\,f\big(` +
          num(state.b, 1) + String.raw`(x - ` + num(state.c, 1) + String.raw`)\big) + ` + num(state.d, 1) +
          String.raw`$，其中 $f(x) = ` + b.tex + String.raw`$。注意 $b$ 与 $c$ 先结合：横移距离由 $\frac{c}{b}$（若 $b\neq 1$）决定。`);
      }

      plot.onDraw(function () {
        const b = BASE[state.base], s = state;
        plot.fn(b.f, { color: C.gray, width: 1.8, dash: [7, 5] });
        plot.fn(function (x) { return s.a * b.f(s.b * (x - s.c)) + s.d; }, { color: ctx.color, width: 2.8 });
        /* 原型上的参考点 (0, f(0)) → 变换后的 (c, a·f(0)+d) */
        const y0 = b.f(0);
        if (isFinite(y0)) {
          plot.point(0, y0, { r: 4, color: C.gray });
          plot.point(s.c, s.a * y0 + s.d, { r: 4.5, color: ctx.color });
        }
      });

      sel.addEventListener('change', update);
      [sa, sb, sc, sd].forEach(function (sl) { sl.input.addEventListener('input', update); });
      update();
    }
  });

  /* ============================================================
     2. unitCircle — 单位圆：sin / cos / tan 的故乡
     ============================================================ */
  VIZ.register('unitCircle', {
    title: '单位圆实验室',
    tag: 'MAT 100',
    desc: '在左圆上拖动点 P：竖直紫线段 = sinθ，水平蓝线段 = cosθ；右侧同步展示 sinθ 的波形。',
    render(ctx) {
      const c1 = ctx.canvas(330), c2 = ctx.canvas(330);
      sideBySide(c1, c2);
      const p1 = new VIZ.Plot(c1, { xmin: -1.75, xmax: 1.75, ymin: -1.42, ymax: 1.42 });
      const p2 = new VIZ.Plot(c2, { xmin: -0.45, xmax: 6.9, ymin: -1.45, ymax: 1.45 });
      const state = { th: Math.PI / 4 };
      const ro = ctx.readout();

      function update() {
        p1.redraw(); p2.redraw();
        const t = state.th, s = Math.sin(t), co = Math.cos(t);
        const tn = Math.abs(co) < 0.02 ? NaN : s / co;
        ctx.setReadout(ro,
          String.raw`$\theta = ` + num(deg(t), 1) + String.raw`^\circ = ` + num(t, 3) +
          String.raw`$ rad；$\cos\theta = ` + num(co, 3) + String.raw`$，$\sin\theta = ` + num(s, 3) + String.raw`$，$\tan\theta = ` +
          (isFinite(tn) ? num(tn, 3) : '不存在') +
          String.raw`$。勾股恒等式：$\sin^2\theta + \cos^2\theta = ` + num(s * s + co * co, 3) + String.raw` = 1$。`);
      }

      p1.onDraw(function () {
        const t = state.th, X = Math.cos(t), Y = Math.sin(t);
        /* 圆 */
        const pts = [];
        for (let k = 0; k <= 100; k++) pts.push([Math.cos(2 * Math.PI * k / 100), Math.sin(2 * Math.PI * k / 100)]);
        plotHelper(p1, pts, { color: 'rgba(35,38,47,.5)', width: 1.8 });
        /* 角弧 */
        const arc = [];
        for (let k = 0; k <= 30; k++) arc.push([0.28 * Math.cos(t * k / 30), 0.28 * Math.sin(t * k / 30)]);
        plotHelper(p1, arc, { color: ctx.color, width: 2 });
        /* cos 段（x 轴上）与 sin 段（竖直） */
        p1.line(0, 0, X, 0, { color: C.blue, width: 3.4 });
        p1.line(X, 0, X, Y, { color: C.purple, width: 3.4 });
        p1.line(0, 0, X, Y, { color: 'rgba(35,38,47,.65)', width: 1.6 });
        p1.point(X, Y, { r: 5.5, color: ctx.color });
        p1.text(1.62, 1.22, 'P = (cosθ, sinθ)', { size: 11, align: 'right', color: 'rgba(35,38,47,.7)' });
        /* tan 参考线 x=1 */
        if (isFinite(Math.tan(t)) && Math.abs(Math.tan(t)) < 1.36) {
          p1.line(1, -1.36, 1, 1.36, { color: 'rgba(192,57,43,.35)', width: 1.2, dash: [3, 3] });
          p1.line(1, 0, 1, Math.tan(t), { color: C.red, width: 3 });
          p1.line(X, Y, 1, Math.tan(t), { color: 'rgba(192,57,43,.5)', width: 1.4, dash: [4, 3] });
        }
      });
      p2.onDraw(function () {
        const t = state.th;
        p2.fn(Math.sin, { color: C.purple, width: 2.4 });
        p2.hline(0, { color: 'rgba(35,38,47,.4)', width: 1 });
        p2.vline(t, { color: ctx.color, width: 1.4, dash: [4, 4] });
        p2.point(t, Math.sin(t), { r: 5, color: ctx.color });
        p2.text(3.35, 1.28, 'y = sinθ', { size: 12, color: C.purple, weight: '700' });
        for (let k = 1; k <= 2; k++) p2.vline(k * Math.PI, { color: 'rgba(35,38,47,.16)', width: 1 });
        p2.text(Math.PI, -1.28, 'π', { size: 10.5, color: 'rgba(35,38,47,.55)' });
        p2.text(2 * Math.PI, -1.28, '2π', { size: 10.5, color: 'rgba(35,38,47,.55)' });
      });

      p1.drag(function (q) {
        let t = Math.atan2(q[1], q[0]);
        if (t < 0) t += 2 * Math.PI;
        state.th = t;
        update();
      });
      update();
    }
  });
  function plotHelper(p, pts, opts) { p.path(pts, opts); }

  /* ============================================================
     3. seqLab — 数列收敛：ε 带与 N
     ============================================================ */
  VIZ.register('seqLab', {
    title: '数列收敛实验室',
    tag: 'MAT 100 · MAT 103',
    desc: '选择数列，拖动 ε：绿点落在极限 L 的 ε 带内。发散数列无论 ε 多宽都总有逃逸的点。',
    render(ctx) {
      const cv = ctx.canvas(360);
      const plot = new VIZ.Plot(cv, { xmin: -1.5, xmax: 61, ymin: -1.42, ymax: 1.5 });
      const SEQ = {
        recip: { tex: 'a_n = 1/n', L: 0, f: function (n) { return 1 / n; } },
        alt: { tex: 'a_n = (-1)^n/n', L: 0, f: function (n) { return (n % 2 ? -1 : 1) / n; } },
        conv: { tex: 'a_n = 1-1/n', L: 1, f: function (n) { return 1 - 1 / n; } },
        osc: { tex: 'a_n = (-1)^n', L: null, f: function (n) { return n % 2 ? -1 : 1; } }
      };
      const state = { key: 'recip', eps: 0.2 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '数列', [['recip', '1/n'], ['alt', '(−1)ⁿ/n'], ['conv', '1 − 1/n'], ['osc', '(−1)ⁿ（发散）']], 'recip');
      const se = ctx.slider(ctl, 'ε（带宽）', 0.05, 1, 0.01, 0.2, function (v) { return num(+v, 2); });
      const ro = ctx.readout();

      function findN(sq, eps) {
        for (let n = 1; n <= 20000; n++) {
          let ok = true;
          for (let k = n; k < n + 50 && ok; k++) if (Math.abs(sq.f(k) - sq.L) >= eps) ok = false;
          if (ok) return n;
        }
        return 20000;
      }

      function update() {
        state.key = sel.value; state.eps = +se.input.value;
        plot.redraw();
        const sq = SEQ[state.key];
        if (sq.L == null) {
          ctx.setReadout(ro, String.raw`$` + sq.tex + String.raw`$ 在 $+1$ 与 $-1$ 之间永远振荡：对任何候选极限 $L$，取 $\epsilon = \frac{1}{2}$，无论 $N$ 多大，总有力气跳出 $(L-\epsilon, L+\epsilon)$ 的项——不收敛。`);
        } else {
          const N = findN(sq, state.eps);
          ctx.setReadout(ro,
            String.raw`$` + sq.tex + String.raw` \to L = ` + num(sq.L, 2) + String.raw`$。取 $\epsilon = ` + num(state.eps, 2) +
            String.raw`：当 $n > N = ` + N + String.raw` 时，$|a_n - L| < \epsilon$ 恒成立——带外（灰点）只剩有限个。这正是极限的直观内核。`);
        }
      }

      plot.onDraw(function () {
        const sq = SEQ[state.key], eps = state.eps;
        if (sq.L != null) {
          plot.hband(sq.L - eps, sq.L + eps, 'rgba(46,125,107,.14)');
          plot.hline(sq.L, { color: C.green, width: 1.6 });
          plot.text(59, sq.L, 'L', { size: 12, color: C.green, dy: -10, weight: '700', align: 'right' });
          const N = findN(sq, eps);
          plot.vline(N, { color: C.green, width: 1.3, dash: [5, 4] });
          plot.text(N, -1.32, 'N=' + N, { size: 10.5, color: C.green, dy: -6 });
        }
        for (let n = 1; n <= 60; n++) {
          const inBand = sq.L != null && Math.abs(sq.f(n) - sq.L) < eps;
          plot.point(n, sq.f(n), { r: 2.7, color: inBand ? C.green : C.gray });
        }
      });

      sel.addEventListener('change', update);
      se.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     4. limitEpsDelta — ε-δ：极限的博弈
     ============================================================ */
  VIZ.register('limitEpsDelta', {
    title: 'ε-δ 极限定义实验室',
    tag: 'MAT 103',
    desc: '你出 ε（蓝横带），我答 δ（橙竖带）：曲线必须在竖带内的部分全部落在横带里。红线是越界者。',
    render(ctx) {
      const cv = ctx.canvas(400);
      const CASES = {
        sq: { tex: 'x^2', a: 1, L: 1, view: [-1.1, 3.1, -0.8, 4.6], f: function (x) { return x * x; }, dom: function () { return true; } },
        sinc: { tex: '\\frac{\\sin x}{x}', a: 0, L: 1, view: [-6.4, 6.4, -0.65, 1.55], f: function (x) { return x === 0 ? 1 : Math.sin(x) / x; }, dom: function () { return true; } },
        sqrt: { tex: '\\sqrt{x}', a: 4, L: 2, view: [-0.5, 9, -0.45, 3.4], f: Math.sqrt, dom: function (x) { return x >= 0; } }
      };
      const state = { key: 'sq', eps: 0.4 };
      const plot = new VIZ.Plot(cv, { xmin: CASES.sq.view[0], xmax: CASES.sq.view[1], ymin: CASES.sq.view[2], ymax: CASES.sq.view[3] });
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '函数与极限点', [['sq', 'x² 在 a=1（L=1）'], ['sinc', 'sinx/x 在 a=0（L=1）'], ['sqrt', '√x 在 a=4（L=2）']], 'sq');
      const se = ctx.slider(ctl, 'ε（挑战者）', 0.05, 1.4, 0.05, 0.4, function (v) { return num(+v, 2); });
      const ro = ctx.readout();

      /* 数值搜索最大 δ：竖带内（定义域中）所有 |f−L|<ε */
      function maxDelta(cs, eps) {
        let lo = 1e-6, hi = 4;
        for (let it = 0; it < 60; it++) {
          const mid = (lo + hi) / 2;
          let ok = true;
          for (let k = 0; k <= 600; k++) {
            const x = cs.a - mid + 2 * mid * k / 600;
            if (Math.abs(x - cs.a) < 1e-12) continue;
            if (!cs.dom(x)) continue;
            if (Math.abs(cs.f(x) - cs.L) >= eps) { ok = false; break; }
          }
          if (ok) lo = mid; else hi = mid;
        }
        return lo;
      }

      function applyView() {
        const v = CASES[state.key].view;
        plot.o.xmin = v[0]; plot.o.xmax = v[1]; plot.o.ymin = v[2]; plot.o.ymax = v[3];
      }

      plot.onDraw(function () {
        const cs = CASES[state.key], eps = state.eps, d = maxDelta(cs, eps);
        plot.hband(cs.L - eps, cs.L + eps, 'rgba(31,94,158,.13)');
        plot.vband(cs.a - d, cs.a + d, 'rgba(231,117,0,.13)');
        plot.hline(cs.L, { color: C.blue, width: 1.3, dash: [5, 4] });
        plot.vline(cs.a, { color: ctx.color, width: 1.3, dash: [5, 4] });
        plot.fn(cs.f, { color: 'rgba(35,38,47,.8)', width: 2.4 });
        /* 越界曲线段（|f−L|≥ε）标红 */
        plot.fn(function (x) {
          if (!cs.dom(x)) return NaN;
          return Math.abs(cs.f(x) - cs.L) >= eps ? cs.f(x) : NaN;
        }, { color: C.red, width: 3.4 });
        plot.point(cs.a, cs.L, { r: 4.5, color: ctx.color });
        plot.text(cs.a, cs.L, '(' + num(cs.a, 0) + ', ' + num(cs.L, 0) + ')', { size: 11, dy: -12, color: 'rgba(35,38,47,.75)' });
        plot.text(cs.a + d / 2, plot.o.ymax - 0.07 * (plot.o.ymax - plot.o.ymin), 'δ≈' + num(d, 3), { size: 11, color: ctx.color, weight: '700' });
      });

      function update() {
        state.key = sel.value; state.eps = +se.input.value;
        const cs = CASES[state.key];
        applyView();
        const d = maxDelta(cs, state.eps);
        plot.redraw();
        ctx.setReadout(ro,
          String.raw`$\lim_{x \to ` + num(cs.a, 0) + String.raw`} ` + cs.tex + String.raw` = ` + num(cs.L, 0) +
          String.raw`$：任给 $\epsilon = ` + num(state.eps, 2) + String.raw`，存在 $\delta \approx ` + num(d, 3) +
          String.raw`，使 $0 < |x - ` + num(cs.a, 0) + String.raw`| < \delta \Rightarrow |f(x) - ` + num(cs.L, 0) +
          String.raw`| < \epsilon$。$\delta$ 可以更小（定义只要求存在），但不能更大——再大就有红段越界。`);
      }

      sel.addEventListener('change', update);
      se.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     5. secantTangent — 割线 → 切线
     ============================================================ */
  VIZ.register('secantTangent', {
    title: '割线逼近切线',
    tag: 'MAT 103',
    desc: '拖动曲线上 的位置（点击画布），再让 h→0：割线斜率一步步逼近导数 f′(a)。',
    render(ctx) {
      const cv = ctx.canvas(400);
      const plot = new VIZ.Plot(cv, { xmin: -2.6, xmax: 2.6, ymin: -3.2, ymax: 3.4 });
      const FUNCS = {
        x2: { tex: 'x^2', f: function (x) { return x * x; }, d: function (x) { return 2 * x; } },
        cub: { tex: 'x^3 - x', f: function (x) { return x * x * x - x; }, d: function (x) { return 3 * x * x - 1; } },
        sin: { tex: '\\sin x', f: Math.sin, d: Math.cos }
      };
      const state = { key: 'x2', a: 0.8, h: 1.2 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '函数', [['x2', 'x²'], ['cub', 'x³ − x'], ['sin', 'sin x']], 'x2');
      const sh = ctx.slider(ctl, 'h（步长）', -2, 2, 0.05, 1.2, function (v) { return num(+v, 2); });
      const ro = ctx.readout();

      function update() {
        state.key = sel.value; state.h = +sh.input.value;
        plot.redraw();
        const F = FUNCS[state.key], a = state.a;
        const h = state.h, hEff = h === 0 ? 0.0000001 : h;
        const ms = (F.f(a + hEff) - F.f(a)) / hEff;
        ctx.setReadout(ro,
          String.raw`割线斜率 $= \dfrac{f(a+h)-f(a)}{h} = \dfrac{` + num(F.f(a + hEff), 3) + String.raw` - ` + num(F.f(a), 3) +
          String.raw`}{` + num(hEff, 3) + String.raw`} = ` + num(ms, 4) + String.raw`$；` +
          String.raw`$h \to 0$ 时它趋于导数 $f'(` + num(a, 2) + String.raw`) = ` + num(F.d(a), 4) + String.raw`$` +
          (Math.abs(ms - F.d(a)) < 0.05 ? String.raw`——已经几乎重合，割线变成了切线。` : String.raw`。继续减小 $|h|$ 看看。`));
      }

      plot.onDraw(function () {
        const F = FUNCS[state.key], a = state.a, h = state.h;
        const hEff = h === 0 ? 0.0000001 : h;
        const ms = (F.f(a + hEff) - F.f(a)) / hEff;
        plot.fn(F.f, { color: 'rgba(35,38,47,.8)', width: 2.4 });
        /* 切线（虚淡） */
        plot.fn(function (x) { return F.f(a) + F.d(a) * (x - a); }, { color: 'rgba(46,125,107,.55)', width: 1.6, dash: [3, 4] });
        /* 割线 */
        plot.fn(function (x) { return F.f(a) + ms * (x - a); }, { color: ctx.color, width: 2.2, dash: [8, 5] });
        plot.point(a, F.f(a), { r: 5, color: ctx.color, label: 'a', dy: -12 });
        plot.point(a + hEff, F.f(a + hEff), { r: 5, color: C.purple, label: 'a+h', dy: -12 });
        /* 水平步长 h 的标示 */
        plot.line(a, -3.05, a + hEff, -3.05, { color: C.purple, width: 1.6 });
        plot.line(a, -3.2, a, -2.9, { color: C.purple, width: 1.2 });
        plot.line(a + hEff, -3.2, a + hEff, -2.9, { color: C.purple, width: 1.2 });
        plot.text(a + hEff / 2, -3.05, 'h', { size: 11, color: C.purple, dy: -6 });
      });

      plot.drag(function (q) { state.a = clamp(q[0], -2.2, 2.2); update(); });
      sel.addEventListener('change', update);
      sh.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     6. derivativeLink — f 与 f′ 的联动
     ============================================================ */
  VIZ.register('derivativeLink', {
    title: '函数 × 导数 联动屏',
    tag: 'MAT 103',
    desc: '在上图拖动 x₀：切线斜率就是下图中 f′ 曲线的高度。f 的峰谷正对 f′ 的过零点。',
    render(ctx) {
      const c1 = ctx.canvas(280), c2 = ctx.canvas(280);
      sideBySide(c1, c2);
      const FUNCS = {
        sin: { tex: '\\sin x', f: Math.sin, d: Math.cos, view: [-6.9, 6.9, -1.75, 1.75] },
        cub: { tex: 'x^3-3x', f: function (x) { return x * x * x - 3 * x; }, d: function (x) { return 3 * x * x - 3; }, view: [-2.5, 2.5, -4.1, 4.1] },
        exp: { tex: 'e^x', f: Math.exp, d: Math.exp, view: [-3.1, 2.1, -1.2, 8.4] }
      };
      const state = { key: 'sin', x0: 2 };
      const p1 = new VIZ.Plot(c1, { xmin: -6.9, xmax: 6.9, ymin: -1.75, ymax: 1.75 });
      const p2 = new VIZ.Plot(c2, { xmin: -6.9, xmax: 6.9, ymin: -1.75, ymax: 1.75 });
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '函数', [['sin', 'sin x（f′=cos x）'], ['cub', 'x³−3x（f′=3x²−3）'], ['exp', 'eˣ（f′=eˣ）']], 'sin');
      const ro = ctx.readout();

      function applyView() {
        const v = FUNCS[state.key].view;
        p1.o.xmin = v[0]; p1.o.xmax = v[1]; p1.o.ymin = v[2]; p1.o.ymax = v[3];
        p2.o.xmin = v[0]; p2.o.xmax = v[1];
        p2.o.ymin = state.key === 'cub' ? -4.2 : v[2];
        p2.o.ymax = state.key === 'cub' ? 14.5 : (state.key === 'exp' ? 8.4 : v[3]);
      }

      function update() {
        state.key = sel.value;
        state.x0 = clamp(state.x0, FUNCS[state.key].view[0] + 0.3, FUNCS[state.key].view[1] - 0.3);
        applyView();
        p1.redraw(); p2.redraw();
        const F = FUNCS[state.key], d0 = F.d(state.x0);
        ctx.setReadout(ro,
          String.raw`$f(x) = ` + F.tex + String.raw`$，$x_0 = ` + num(state.x0, 2) + String.raw`：$f'(x_0) = ` + num(d0, 3) +
          String.raw`$ —— ` + (d0 > 0.02 ? String.raw`切线右上倾，$f$ 在此处上升` : (d0 < -0.02 ? String.raw`切线右下倾，$f$ 在此处下降` : String.raw`切线水平：极值点的候选（峰或谷）`)) +
          String.raw`。对照下图：$f'$ 的过零点正是 $f$ 的峰谷。`);
      }

      p1.onDraw(function () {
        const F = FUNCS[state.key], x0 = state.x0;
        plotLabel(p1, 'y = f(x)');
        p1.fn(F.f, { color: 'rgba(35,38,47,.8)', width: 2.4 });
        p1.fn(function (x) { return F.f(x0) + F.d(x0) * (x - x0); }, { color: ctx.color, width: 2, dash: [7, 5] });
        p1.point(x0, F.f(x0), { r: 5, color: ctx.color });
        p1.vline(x0, { color: 'rgba(35,38,47,.22)', width: 1 });
      });
      p2.onDraw(function () {
        const F = FUNCS[state.key], x0 = state.x0;
        plotLabel(p2, "y = f′(x)");
        p2.fn(F.d, { color: C.blue, width: 2.4 });
        p2.hline(0, { color: 'rgba(35,38,47,.35)', width: 1 });
        p2.vline(x0, { color: 'rgba(35,38,47,.22)', width: 1 });
        p2.point(x0, F.d(x0), { r: 5, color: C.blue });
        p2.line(x0, 0, x0, F.d(x0), { color: C.blue, width: 2.6 });
      });
      function plotLabel(p, s) { p.text(p.o.xmax - (p.o.xmax - p.o.xmin) * 0.02, p.o.ymax - (p.o.ymax - p.o.ymin) * 0.05, s, { size: 12.5, align: 'right', weight: '700', color: 'rgba(35,38,47,.6)' }); }

      p1.drag(function (q) {
        const v = FUNCS[state.key].view;
        state.x0 = clamp(q[0], v[0] + 0.3, v[1] - 0.3);
        update();
      });
      sel.addEventListener('change', update);
      update();
    }
  });

  /* ============================================================
     7. optimization — 定周长，最大面积
     ============================================================ */
  VIZ.register('optimization', {
    title: '最优化实验室：定周长围最大面积',
    tag: 'MAT 103',
    desc: '周长 P 固定的矩形，一边取 x：拖动 x 看面积 A(x) 的变化——最大值永远在正方形处。',
    render(ctx) {
      const cv = ctx.canvas(400);
      const plot = new VIZ.Plot(cv, { xmin: 0, xmax: 8, ymin: 0, ymax: 10 });
      const state = { P: 12, x: 2 };
      const ctl = ctx.controls();
      const sp = ctx.slider(ctl, '周长 P', 4, 20, 0.5, 12, function (v) { return num(+v, 1); });
      const sx = ctx.slider(ctl, '一边长 x', 0.5, 9.5, 0.1, 2, function (v) { return num(+v, 1); });
      const ro = ctx.readout();
      const A = function (x, P) { return x * (P / 2 - x); };

      function update() {
        state.P = +sp.input.value;
        state.x = clamp(+sx.input.value, 0.3, state.P / 2 - 0.3);
        const P = state.P;
        plot.o.xmax = P / 2 + 1.2;
        plot.o.ymax = P * P / 16 + 2.2;
        sx.input.max = P / 2 - 0.3;
        plot.redraw();
        const x = state.x, other = P / 2 - x;
        ctx.setReadout(ro,
          String.raw`周长 $P = ` + num(P, 1) + String.raw`：$A(x) = x\big(\frac{P}{2}-x\big)$，$A' = \frac{P}{2} - 2x = 0 \Rightarrow x = \frac{P}{4} = ` +
          num(P / 4, 2) + String.raw`。当前 $x = ` + num(x, 1) + String.raw`，另一边 $= ` + num(other, 1) + String.raw`，$A = ` +
          num(A(x, P), 2) + String.raw`$；最大 $A_{\max} = \frac{P^2}{16} = ` + num(P * P / 16, 2) + String.raw`（正方形）。`);
      }

      plot.onDraw(function () {
        const P = state.P, x = state.x, xmax = P / 2;
        /* 面积曲线 */
        plot.fn(function (t) { return t <= xmax ? A(t, P) : NaN; }, { color: ctx.color, width: 2.6 });
        /* 最大点 */
        plot.point(P / 4, P * P / 16, { r: 5, color: C.green, label: 'x = P/4', dy: -12 });
        plot.vline(P / 4, { color: 'rgba(46,125,107,.5)', width: 1.2, dash: [4, 4] });
        /* 当前点 */
        plot.point(x, A(x, P), { r: 5.5, color: C.purple });
        plot.line(x, 0, x, A(x, P), { color: 'rgba(142,59,107,.5)', width: 1.4, dash: [4, 4] });
        plot.line(0, A(x, P), x, A(x, P), { color: 'rgba(142,59,107,.5)', width: 1.4, dash: [4, 4] });
        /* 角落矩形示意图（像素级） */
        const c = plot.c, W = plot.W, H = plot.H;
        const bw = Math.min(130, 26 + 70 * (x / (P / 2))), bh = Math.min(110, 26 + 70 * (1 - x / (P / 2)));
        const bx = W - bw - 14, by = 14;
        c.strokeStyle = 'rgba(35,38,47,.55)'; c.lineWidth = 1.5;
        c.strokeRect(bx, by, bw, bh);
        c.fillStyle = 'rgba(231,117,0,.10)';
        c.fillRect(bx, by, bw, bh);
        c.fillStyle = 'rgba(35,38,47,.6)';
        c.font = '600 10px "Noto Sans SC",sans-serif';
        c.textAlign = 'center';
        c.fillText('x = ' + num(x, 1), bx + bw / 2, by + bh + 11);
        c.save();
        c.translate(bx - 7, by + bh / 2); c.rotate(-Math.PI / 2);
        c.fillText(num(P / 2 - x, 1), 0, 0);
        c.restore();
        plot.text(xmax / 2, plot.o.ymax * 0.06, 'A(x) = x(P/2 − x)', { size: 12, color: 'rgba(35,38,47,.7)' });
      });

      plot.drag(function (q) {
        if (q[1] >= -1 && q[1] <= A(q[0], state.P) + 1.5) {
          state.x = clamp(q[0], 0.3, state.P / 2 - 0.3);
          sx.set(state.x);
          update();
        }
      });
      sp.input.addEventListener('input', update);
      sx.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     8. riemannSum — 黎曼和与 Darboux 上下和
     ============================================================ */
  VIZ.register('riemannSum', {
    title: '黎曼和实验室（含 Darboux 上下和）',
    tag: 'MAT 103 · MAT 215',
    desc: '把 [0,1] 切成 n 条：左/右/中点取样是黎曼和；上和/下和是 Darboux 的夹逼——真值被夹在中间。',
    render(ctx) {
      const cv = ctx.canvas(400);
      const plot = new VIZ.Plot(cv, { xmin: -0.06, xmax: 1.08, ymin: -0.12, ymax: 1.35 });
      const FUNCS = {
        x2: { tex: 'x^2', f: function (x) { return x * x; }, exact: 1 / 3, exactTex: '\\frac{1}{3}' },
        sqrt: { tex: '\\sqrt{x}', f: Math.sqrt, exact: 2 / 3, exactTex: '\\frac{2}{3}' },
        par: { tex: '4x(1-x)', f: function (x) { return 4 * x * (1 - x); }, exact: 2 / 3, exactTex: '\\frac{2}{3}' },
        sinp: { tex: '\\sin(\\pi x)', f: function (x) { return Math.sin(Math.PI * x); }, exact: 2 / Math.PI, exactTex: '\\frac{2}{\\pi}' }
      };
      const MODES = [['left', '黎曼·左端点'], ['right', '黎曼·右端点'], ['mid', '黎曼·中点'], ['upper', 'Darboux 上和'], ['lower', 'Darboux 下和']];
      const state = { key: 'x2', mode: 'left', n: 6 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '函数', [['x2', 'x²'], ['sqrt', '√x'], ['par', '4x(1−x)'], ['sinp', 'sin(πx)']], 'x2');
      const sm = ctx.select(ctl, '取样模式', MODES, 'left');
      const sn = ctx.slider(ctl, '分割数 n', 1, 80, 1, 6);
      const ro = ctx.readout();

      function sample(f, x0, x1, mode) {
        if (mode === 'left') return f(x0);
        if (mode === 'right') return f(x1);
        if (mode === 'mid') return f((x0 + x1) / 2);
        let best = mode === 'upper' ? -Infinity : Infinity;
        for (let k = 0; k <= 24; k++) {
          const v = f(x0 + (x1 - x0) * k / 24);
          if (mode === 'upper') best = Math.max(best, v); else best = Math.min(best, v);
        }
        return best;
      }

      function update() {
        state.key = sel.value; state.mode = sm.value; state.n = +sn.input.value;
        plot.redraw();
        const F = FUNCS[state.key];
        const dx = 1 / state.n;
        let S = 0;
        for (let i = 0; i < state.n; i++) S += sample(F.f, i * dx, (i + 1) * dx, state.mode) * dx;
        const modeTex = state.mode === 'upper' ? 'U' : (state.mode === 'lower' ? 'L' : 'S');
        const hint = state.mode === 'upper' ? String.raw`（上和从上方压向真值）` :
          (state.mode === 'lower' ? String.raw`（下和从下方托向真值）` : String.raw`（误差随 $n$ 增大而消失）`);
        ctx.setReadout(ro,
          String.raw`$` + modeTex + String.raw`_` + state.n + String.raw` = \sum_{i=1}^{` + state.n + String.raw`} f(x_i^{\ast})\,\Delta x = ` +
          num(S, 5) + String.raw`$，精确值 $\int_0^1 ` + F.tex + String.raw`\,dx = ` + F.exactTex + String.raw` \approx ` +
          num(F.exact, 5) + String.raw`，误差 $` + num(Math.abs(S - F.exact), 5) + String.raw`$` + hint + String.raw`。`);
      }

      plot.onDraw(function () {
        const F = FUNCS[state.key], n = state.n, dx = 1 / n;
        const fill = state.mode === 'upper' ? 'rgba(192,57,43,.16)' :
          (state.mode === 'lower' ? 'rgba(46,125,107,.16)' : 'rgba(231,117,0,.16)');
        const strokeC = state.mode === 'upper' ? 'rgba(192,57,43,.55)' :
          (state.mode === 'lower' ? 'rgba(46,125,107,.55)' : 'rgba(231,117,0,.6)');
        for (let i = 0; i < n; i++) {
          const x0 = i * dx, x1 = (i + 1) * dx;
          const h = sample(F.f, x0, x1, state.mode);
          plot.rectArea(x0, x1, 0, h, fill);
          const c = plot.c;
          c.strokeStyle = strokeC; c.lineWidth = 1;
          c.strokeRect(plot.px(x0), plot.py(h), plot.px(x1) - plot.px(x0), plot.py(0) - plot.py(h));
          if (n <= 40) plot.point((x0 + x1) / 2, h, { r: 2.2, color: strokeC });
        }
        plot.fn(F.f, { color: 'rgba(35,38,47,.85)', width: 2.6 });
        /* 精确值参考线 */
        plot.hline(F.exact, { color: C.blue, width: 1.2, dash: [6, 4] });
        plot.text(1.06, F.exact, '∫=' + num(F.exact, 3), { size: 10.5, color: C.blue, align: 'right', dy: -6 });
      });

      [sel, sm].forEach(function (s) { s.addEventListener('change', update); });
      sn.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     9. areaFunction — 变上限积分：FTC 上半场
     ============================================================ */
  VIZ.register('areaFunction', {
    title: '面积累积函数 F(x) = ∫ f',
    tag: 'MAT 103',
    desc: '拖动上限 x：上图着色的是「带符号面积」，下图描出累积曲线 F(x)——F 的切线斜率恰是 f(x)。',
    render(ctx) {
      const c1 = ctx.canvas(280), c2 = ctx.canvas(280);
      sideBySide(c1, c2);
      const FUNCS = {
        sin: { tex: '\\sin x', f: Math.sin, dom: [0, 2 * Math.PI], Ftex: '1-\\cos x' },
        x2: { tex: 'x^2', f: function (x) { return x * x; }, dom: [0, 2], Ftex: 'x^3/3' },
        c2: { tex: '2', f: function () { return 2; }, dom: [0, 3], Ftex: '2x' }
      };
      const state = { key: 'sin', x: 2.2 };
      const p1 = new VIZ.Plot(c1, { xmin: -0.4, xmax: 6.8, ymin: -1.35, ymax: 1.35 });
      const p2 = new VIZ.Plot(c2, { xmin: -0.4, xmax: 6.8, ymin: -0.4, ymax: 2.3 });
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '被积函数 f', [['sin', 'sin x on [0,2π]'], ['x2', 'x² on [0,2]'], ['c2', '常函数 2 on [0,3]']], 'sin');
      const ro = ctx.readout();

      /* 数值累积 F(x) = ∫_dom0^x f */
      function Fval(F, x) {
        const a = F.dom[0], N = 900, h = (x - a) / N;
        if (h === 0) return 0;
        let s = 0;
        for (let i = 0; i < N; i++) s += F.f(a + (i + 0.5) * h) * h;
        return s;
      }

      function applyView() {
        if (state.key === 'x2') {
          p1.o.xmax = 2.25; p1.o.ymin = -0.45; p1.o.ymax = 4.4;
          p2.o.xmax = 2.25; p2.o.ymin = -0.45; p2.o.ymax = 3.1;
        } else if (state.key === 'c2') {
          p1.o.xmax = 3.25; p1.o.ymin = -0.45; p1.o.ymax = 2.6;
          p2.o.xmax = 3.25; p2.o.ymin = -0.45; p2.o.ymax = 6.6;
        } else {
          p1.o.xmax = 6.8; p1.o.ymin = -1.35; p1.o.ymax = 1.35;
          p2.o.xmax = 6.8; p2.o.ymin = -0.4; p2.o.ymax = 2.3;
        }
        p1.o.xmin = -0.4 * (p1.o.xmax / 6.8);
      }

      function update() {
        state.key = sel.value;
        const F = FUNCS[state.key];
        state.x = clamp(state.x, F.dom[0] + 0.02, F.dom[1]);
        applyView();
        p1.redraw(); p2.redraw();
        const v = Fval(F, state.x);
        ctx.setReadout(ro,
          String.raw`$F(x) = \int_{` + num(F.dom[0], 0) + String.raw`}^{x} ` + F.tex + String.raw`\,dt$，当前 $x = ` + num(state.x, 2) +
          String.raw`：$F(x) = ` + num(v, 4) + String.raw`（解析式 $F = ` + F.Ftex + String.raw`）。微积分基本定理：$F'(x) = f(x) = ` +
          num(F.f(state.x), 3) + String.raw`——下图累积曲线的切线斜率。`);
      }

      p1.onDraw(function () {
        const F = FUNCS[state.key], a = F.dom[0], x = state.x;
        /* 带符号面积：细分列填色 */
        const N = 320;
        for (let i = 0; i < N; i++) {
          const t0 = a + (x - a) * i / N, t1 = a + (x - a) * (i + 1) / N;
          const h = F.f((t0 + t1) / 2);
          if (Math.abs(h) < 1e-9) continue;
          p1.rectArea(t0, t1, 0, h, h >= 0 ? 'rgba(46,125,107,.25)' : 'rgba(192,57,43,.25)');
        }
        p1.fn(F.f, { color: 'rgba(35,38,47,.85)', width: 2.5 });
        p1.vline(x, { color: ctx.color, width: 1.6 });
        p1.point(x, F.f(x), { r: 4.5, color: ctx.color });
        p1.text(x, p1.o.ymin + 0.12, 'x=' + num(x, 2), { size: 10.5, color: ctx.color, dy: 12 });
      });
      p2.onDraw(function () {
        const F = FUNCS[state.key], a = F.dom[0], x = state.x;
        p2.fn(function (t) { return t >= a && t <= F.dom[1] ? Fval(F, t) : NaN; }, { color: C.blue, width: 2.5 });
        const v = Fval(F, x), m = F.f(x);
        /* 切线：斜率 = f(x) */
        p2.fn(function (t) { return v + m * (t - x); }, { color: ctx.color, width: 1.8, dash: [7, 5] });
        p2.vline(x, { color: 'rgba(35,38,47,.25)', width: 1 });
        p2.point(x, v, { r: 5, color: C.blue });
        p2.text(0.1, p2.o.ymax - 0.1 * (p2.o.ymax - p2.o.ymin), 'F(x)（切线斜率 = f(x)）', { size: 11, align: 'left', color: C.blue });
      });

      p1.drag(function (q) {
        const F = FUNCS[state.key];
        state.x = clamp(q[0], F.dom[0] + 0.02, F.dom[1]);
        update();
      });
      sel.addEventListener('change', update);
      update();
    }
  });

  /* ============================================================
     10. solidsRevolution — 旋转体：disk 法
     ============================================================ */
  VIZ.register('solidsRevolution', {
    title: '旋转体体积实验室（disk 法）',
    tag: 'MAT 104',
    desc: '把 y=f(x) 绕 x 轴旋转：体积元是薄圆盘 πf(x)²Δx。增多圆盘数 n，逼近旋转体。',
    render(ctx) {
      const cv = ctx.canvas(400);
      const plot = new VIZ.Plot(cv, { xmin: -0.14, xmax: 1.22, ymin: -1.35, ymax: 1.35 });
      const FUNCS = {
        sqrt: { tex: '\\sqrt{x}', f: Math.sqrt, V: Math.PI / 2, Vtex: '\\frac{\\pi}{2}' },
        x2: { tex: 'x^2', f: function (x) { return x * x; }, V: Math.PI / 5, Vtex: '\\frac{\\pi}{5}' },
        x3: { tex: 'x^3', f: function (x) { return x * x * x; }, V: Math.PI / 7, Vtex: '\\frac{\\pi}{7}' }
      };
      const state = { key: 'sqrt', n: 8 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '母线 y=f(x)', [['sqrt', '√x'], ['x2', 'x²'], ['x3', 'x³']], 'sqrt');
      const sn = ctx.slider(ctl, '圆盘数 n', 3, 60, 1, 8);
      const ro = ctx.readout();

      function update() {
        state.key = sel.value; state.n = +sn.input.value;
        plot.redraw();
        const F = FUNCS[state.key];
        const dx = 1 / state.n;
        let s = 0;
        for (let i = 0; i < state.n; i++) {
          const r = F.f((i + 0.5) * dx);
          s += Math.PI * r * r * dx;
        }
        ctx.setReadout(ro,
          String.raw`$V_n = \pi \sum_{i=1}^{` + state.n + String.raw`} f(x_i^{\ast})^2\,\Delta x = \pi \cdot ` + num(s / Math.PI, 5) +
          String.raw` \approx ` + num(s, 5) + String.raw`$；精确 $V = \pi\int_0^1 ` + F.tex + String.raw`^2\,dx = ` +
          F.Vtex + String.raw` \approx ` + num(F.V, 5) + String.raw`，误差 $` + num(Math.abs(s - F.V), 5) + String.raw`$。`);
      }

      plot.onDraw(function () {
        const F = FUNCS[state.key], n = state.n, dx = 1 / n;
        /* 旋转体轮廓 */
        const top = [], bot = [];
        for (let k = 0; k <= 120; k++) {
          const x = k / 120, r = F.f(x);
          top.push([x, r]); bot.push([x, -r]);
        }
        plot.path(top.concat(bot.reverse()), { color: 'rgba(31,94,158,.55)', width: 1.8, fill: 'rgba(31,94,158,.08)', close: true });
        plot.line(-0.14, 0, 1.22, 0, { color: 'rgba(35,38,47,.5)', width: 1.4 });
        plot.text(1.19, 0, 'x', { size: 11, color: 'rgba(35,38,47,.6)', dy: -8, align: 'right' });
        /* 圆盘（伪 3D 椭圆） */
        const c = plot.c;
        for (let i = 0; i < n; i++) {
          const x = (i + 0.5) * dx, r = F.f(x);
          const cx = plot.px(x), ry = plot.py(0) - plot.py(r);
          const rx = Math.max(3, (plot.px(dx) - plot.px(0)) * 0.34);
          c.beginPath();
          c.ellipse(cx, plot.py(0), rx, Math.max(ry, 0.5), 0, 0, Math.PI * 2);
          c.fillStyle = 'rgba(231,117,0,' + (0.10 + 0.22 * (1 - i / n)) + ')';
          c.fill();
          c.strokeStyle = 'rgba(231,117,0,.65)';
          c.lineWidth = 1.1;
          c.stroke();
        }
        /* 半径标注 */
        const xa = 1, ra = F.f(1);
        plot.line(1, 0, 1, ra, { color: C.purple, width: 2 });
        plot.text(1, ra / 2, 'r=f(x)', { size: 10.5, color: C.purple, dx: 6, align: 'left' });
      });

      sel.addEventListener('change', update);
      sn.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     11. taylorLab — 泰勒多项式
     ============================================================ */
  VIZ.register('taylorLab', {
    title: '泰勒多项式实验室',
    tag: 'MAT 104',
    desc: '在 x=0 附近用 N 次多项式逼近 f：拖动评估点，看误差如何随 N 增大而收缩（先变宽后变窄）。',
    render(ctx) {
      const cv = ctx.canvas(400);
      const FUNCS = {
        sin: { tex: '\\sin x', view: [-7, 7, -2.7, 2.7], xr: [-6.5, 6.5],
          T: function (x, N) { let s = 0; for (let k = 0; 2 * k + 1 <= N; k++) s += Math.pow(-1, k) * Math.pow(x, 2 * k + 1) / fact(2 * k + 1); return s; } },
        cos: { tex: '\\cos x', view: [-7, 7, -2.7, 2.7], xr: [-6.5, 6.5],
          T: function (x, N) { let s = 0; for (let k = 0; 2 * k <= N; k++) s += Math.pow(-1, k) * Math.pow(x, 2 * k) / fact(2 * k); return s; } },
        exp: { tex: 'e^x', view: [-4, 3, -2.5, 10.5], xr: [-3.5, 2.5],
          T: function (x, N) { let s = 0; for (let k = 0; k <= N; k++) s += Math.pow(x, k) / fact(k); return s; } },
        ln: { tex: '\\ln(1+x)', view: [-0.95, 2.6, -3.6, 1.6], xr: [-0.9, 2.4],
          T: function (x, N) { let s = 0; for (let k = 1; k <= N; k++) s += Math.pow(-1, k + 1) * Math.pow(x, k) / k; return s; } }
      };
      const state = { key: 'sin', N: 3, x0: 2 };
      const plot = new VIZ.Plot(cv, { xmin: FUNCS.sin.view[0], xmax: FUNCS.sin.view[1], ymin: FUNCS.sin.view[2], ymax: FUNCS.sin.view[3] });
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '函数', [['sin', 'sin x'], ['cos', 'cos x'], ['exp', 'eˣ'], ['ln', 'ln(1+x)']], 'sin');
      const sn = ctx.slider(ctl, '泰勒阶数 N', 0, 14, 1, 3);
      const ro = ctx.readout();
      const RAW = { sin: Math.sin, cos: Math.cos, exp: Math.exp, ln: function (x) { return x > -1 ? Math.log(1 + x) : NaN; } };

      function applyView() {
        const v = FUNCS[state.key].view;
        plot.o.xmin = v[0]; plot.o.xmax = v[1]; plot.o.ymin = v[2]; plot.o.ymax = v[3];
      }

      plot.onDraw(function () {
        const F = FUNCS[state.key], N = state.N, x0 = state.x0;
        plot.fn(function (x) { return state.key === 'ln' && x <= -1 ? NaN : F.T(x, N); },
          { color: ctx.color, width: 2.2, dash: [8, 5] });
        plot.fn(RAW[state.key], { color: 'rgba(35,38,47,.82)', width: 2.6 });
        const fv = RAW[state.key](x0), tv = F.T(x0, N);
        plot.vline(x0, { color: 'rgba(35,38,47,.25)', width: 1 });
        plot.point(x0, fv, { r: 4.5, color: 'rgba(35,38,47,.85)' });
        plot.point(x0, tv, { r: 4.5, color: ctx.color });
        plot.line(x0, fv, x0, tv, { color: C.red, width: 2.2 });
      });
      plot.drag(function (q) {
        const F = FUNCS[state.key];
        state.x0 = clamp(q[0], F.xr[0], F.xr[1]);
        update();
      });

      function update() {
        state.key = sel.value; state.N = +sn.input.value;
        const F = FUNCS[state.key];
        state.x0 = clamp(state.x0, F.xr[0], F.xr[1]);
        applyView();
        plot.redraw();
        const fv = RAW[state.key](state.x0), tv = F.T(state.x0, state.N);
        ctx.setReadout(ro,
          String.raw`$T_{` + state.N + String.raw`}(x)$ 在 $x_0 = ` + num(state.x0, 2) + String.raw` 处：$T_{` + state.N + String.raw`}(` +
          num(state.x0, 2) + String.raw`) = ` + num(tv, 4) + String.raw`，真值 $f = ` + num(fv, 4) + String.raw`，误差 $|f - T| = ` +
          num(Math.abs(fv - tv), 4) + String.raw`$。增大 $N$：贴近中心的误差先归零，收敛半径外的误差顽固不化（$\ln(1+x)$ 在 $x>1$ 处发散）。`);
      }

      sel.addEventListener('change', update);
      sn.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     12. seriesSums — 部分和的旅程
     ============================================================ */
  VIZ.register('seriesSums', {
    title: '级数部分和实验室',
    tag: 'MAT 104',
    desc: '部分和 Sₙ 是级数的「里程表」：收敛级数趋向水平渐近线，调和级数却永远爬坡。',
    render(ctx) {
      const cv = ctx.canvas(380);
      const plot = new VIZ.Plot(cv, { xmin: 0, xmax: 205, ymin: -0.5, ymax: 3 });
      const SERIES = {
        geo: { tex: '\\sum_{n=0}^{\\infty} (1/2)^n', S: 2, Stex: '2', a: function (n) { return Math.pow(0.5, n); }, conv: true },
        alt: { tex: '\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n}', S: Math.LN2, Stex: '\\ln 2', a: function (n) { return (n % 2 ? 1 : -1) / n; }, conv: true },
        basel: { tex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2}', S: Math.PI * Math.PI / 6, Stex: '\\frac{\\pi^2}{6}', a: function (n) { return 1 / (n * n); }, conv: true },
        harm: { tex: '\\sum_{n=1}^{\\infty} \\frac{1}{n}', S: null, Stex: '\\infty', a: function (n) { return 1 / n; }, conv: false }
      };
      const state = { key: 'geo', N: 20 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '级数', [['geo', '几何 Σ(1/2)ⁿ（n从0）'], ['alt', '交错调和 Σ(−1)ⁿ⁺¹/n'], ['basel', 'Σ1/n²（巴塞尔）'], ['harm', '调和 Σ1/n（发散）']], 'geo');
      const sn = ctx.slider(ctl, '部分和项数 N', 1, 200, 1, 20);
      const ro = ctx.readout();

      function partial(sr, N) {
        let s = 0, pts = [];
        for (let n = sr === SERIES.geo ? 0 : 1; pts.length < N; n++) {
          s += sr.a(n);
          pts.push([pts.length + 1, s]);
        }
        return pts;
      }

      function update() {
        state.key = sel.value; state.N = +sn.input.value;
        const sr = SERIES[state.key];
        const pts = partial(sr, 200);
        const ymax = Math.max(pts[199][1], sr.S || 0) + 0.7;
        plot.o.ymax = Math.min(ymax, 7.5);
        if (!sr.conv) plot.o.ymax = 6.4;
        plot.redraw();
        const SN = pts[state.N - 1][1];
        ctx.setReadout(ro,
          String.raw`$` + sr.tex + String.raw`$：$S_{` + state.N + String.raw`} = ` + num(SN, 5) + String.raw`$。` +
          (sr.conv
            ? String.raw`收敛于 $S = ` + sr.Stex + String.raw` \approx ` + num(sr.S, 5) + String.raw`，当前误差 $|S_N - S| = ` + num(Math.abs(SN - sr.S), 5) + String.raw`$。`
            : String.raw`部分和 $S_N \approx \ln N + \gamma$ 无限增长——每一项都在变小，但总里程没有上限。`));
      }

      plot.onDraw(function () {
        const sr = SERIES[state.key], N = state.N;
        const pts = partial(sr, 200);
        /* 渐近线 */
        if (sr.conv) {
          plot.hline(sr.S, { color: C.green, width: 1.6, dash: [7, 5] });
          plot.text(202, sr.S, 'S=' + num(sr.S, 3), { size: 11, color: C.green, align: 'right', dy: -8, weight: '700' });
        }
        /* 部分和折线 + 点 */
        plot.path(pts.slice(0, N), { color: 'rgba(31,94,158,.4)', width: 1.4 });
        for (let i = 0; i < N; i++) plot.point(pts[i][0], pts[i][1], { r: 2.2, color: i === N - 1 ? ctx.color : C.blue });
        plot.vline(N, { color: 'rgba(35,38,47,.18)', width: 1 });
        /* 交错级数画出上下夹逼 */
        if (state.key === 'alt' && N >= 2) {
          plot.hband(Math.min(pts[N - 1][1], pts[N - 2][1]), Math.max(pts[N - 1][1], pts[N - 2][1]), 'rgba(184,134,13,.15)');
        }
      });

      sel.addEventListener('change', update);
      sn.input.addEventListener('input', update);
      update();
    }
  });

  /* ============================================================
     13. surfaceLab — 等高线与梯度场
     ============================================================ */
  VIZ.register('surfaceLab', {
    title: '二元函数：等高线与梯度场',
    tag: 'MAT 201',
    desc: '等高线是 z=f(x,y) 的「地形图」；箭头是梯度 ∇f——永远指向最陡上升方向、与等高线垂直。',
    render(ctx) {
      const cv = ctx.canvas(430);
      const plot = new VIZ.Plot(cv, { xmin: -2.15, xmax: 2.15, ymin: -2.15, ymax: 2.15 });
      const FUNCS = {
        bowl: { tex: 'x^2+y^2', f: function (x, y) { return x * x + y * y; }, g: function (x, y) { return [2 * x, 2 * y]; } },
        saddle: { tex: 'x^2-y^2', f: function (x, y) { return x * x - y * y; }, g: function (x, y) { return [2 * x, -2 * y]; } },
        wave: { tex: '\\sin x\\cos y', f: function (x, y) { return Math.sin(x) * Math.cos(y); }, g: function (x, y) { return [Math.cos(x) * Math.cos(y), -Math.sin(x) * Math.sin(y)]; } }
      };
      const state = { key: 'bowl', px: 0.8, py: 0.6 };
      const ctl = ctx.controls();
      const sel = ctx.select(ctl, '曲面 z=f(x,y)', [['bowl', 'x²+y²（碗）'], ['saddle', 'x²−y²（鞍）'], ['wave', 'sin x·cos y（波）']], 'bowl');
      const ro = ctx.readout();

      /* 行扫描等高线 */
      function contours(F, L) {
        const rows = 68, segsAll = [];
        for (let j = 0; j <= rows; j++) {
          const y = -2 + 4 * j / rows;
          const pts = [];
          let prev = F.f(-2, y) - L;
          for (let i = 1; i <= 160; i++) {
            const x = -2 + 4 * i / 160;
            const cur = F.f(x, y) - L;
            if (prev === 0) pts.push([x - 4 / 160, y]);
            else if (prev * cur < 0) pts.push([x - 4 / 160 * cur / (cur - prev), y]);
            prev = cur;
          }
          for (let k = 0; k + 1 < pts.length; k += 2) segsAll.push([pts[k], pts[k + 1]]);
          if (pts.length % 2 === 1 && pts.length >= 1) {
            /* 奇数个交点：闭合等高线（极值附近），单独成点 */
            const last = pts[pts.length - 1];
            segsAll.push([last, [last[0] + 0.01, last[1]]]);
          }
        }
        return segsAll;
      }

      function update() {
        state.key = sel.value;
        plot.redraw();
        const F = FUNCS[state.key];
        const g = F.g(state.px, state.py);
        const gm = Math.hypot(g[0], g[1]);
        ctx.setReadout(ro,
          String.raw`$f(x,y) = ` + F.tex + String.raw`，在 $(x_0,y_0) = (` + num(state.px, 2) + String.raw`, ` + num(state.py, 2) +
          String.raw`)$：$\nabla f = \left(` + num(g[0], 3) + String.raw`,\ ` + num(g[1], 3) + String.raw`\right)$，$|\nabla f| = ` +
          num(gm, 3) + String.raw`，$f(x_0,y_0) = ` + num(F.f(state.px, state.py), 3) +
          (gm < 0.02 ? String.raw`——梯度为零：驻点（碗底/鞍心/波峰波谷）。` : String.raw`。沿梯度方向上升最快；等高线的法向就是它。`));
      }

      plot.onDraw(function () {
        const F = FUNCS[state.key];
        /* 等高线（8 层） */
        let fmin = Infinity, fmax = -Infinity;
        for (let i = 0; i <= 30; i++) for (let j = 0; j <= 30; j++) {
          const v = F.f(-2 + 4 * i / 30, -2 + 4 * j / 30);
          fmin = Math.min(fmin, v); fmax = Math.max(fmax, v);
        }
        const NL = 8;
        for (let l = 1; l <= NL; l++) {
          const L = fmin + (fmax - fmin) * l / (NL + 1);
          const alpha = 0.16 + 0.5 * l / NL;
          contours(F, L).forEach(function (seg) {
            plot.line(seg[0][0], seg[0][1], seg[1][0], seg[1][1], { color: 'rgba(0,131,143,' + alpha + ')', width: 1.4 });
          });
        }
        /* 梯度箭头场 */
        for (let i = -2; i <= 2; i += 0.5) for (let j = -2; j <= 2; j += 0.5) {
          const g = F.g(i, j), m = Math.hypot(g[0], g[1]);
          if (m < 0.02) continue;
          const len = 0.34 * Math.min(1, m / 2.2);
          plot.arrow(i, j, i + g[0] / m * len, j + g[1] / m * len,
            { color: 'rgba(231,117,0,' + (0.35 + 0.55 * Math.min(1, m / 3)) + ')', width: 1.5, head: 6.5 });
        }
        /* 当前点 */
        const g = F.g(state.px, state.py), m = Math.hypot(g[0], g[1]);
        if (m > 0.02) plot.arrow(state.px, state.py, state.px + g[0] / m * 0.5, state.py + g[1] / m * 0.5, { color: C.red, width: 2.6, head: 9 });
        plot.point(state.px, state.py, { r: 5.5, color: C.red, label: '(x₀,y₀)', dx: 9, dy: 10 });
      });

      plot.drag(function (q) {
        state.px = clamp(q[0], -2, 2);
        state.py = clamp(q[1], -2, 2);
        update();
      });
      sel.addEventListener('change', update);
      update();
    }
  });
})();
