/* ============================================================
   Viz-Core — 交互式可视化框架
   Plot: 坐标纸画布引擎 (DPR/网格/轴/函数/箭头/区域)
   控件构建器 + 动画循环 + 生命周期清理
   ============================================================ */
(function () {
  'use strict';

  const VIZ = {
    registry: {},
    cleanups: [],
    register(id, def) { this.registry[id] = def; },
    teardown() {
      for (const fn of this.cleanups) { try { fn(); } catch (e) {} }
      this.cleanups = [];
    },
    mount(root, id) {
      const def = this.registry[id];
      if (!def) {
        root.innerHTML = '<div class="viz-card"><div class="viz-body">⚠ 可视化组件缺失: ' + id + '</div></div>';
        return;
      }
      const card = document.createElement('div');
      card.className = 'viz-card';
      const head = document.createElement('div');
      head.className = 'viz-head';
      head.innerHTML = '<span class="viz-icon">ƒ</span><span class="viz-title"></span>' +
        (def.tag ? '<span class="viz-tag">' + def.tag + '</span>' : '');
      head.querySelector('.viz-title').textContent = def.title;
      const body = document.createElement('div');
      body.className = 'viz-body';
      if (def.desc) {
        const d = document.createElement('p');
        d.className = 'viz-desc';
        d.textContent = def.desc;
        body.appendChild(d);
      }
      card.appendChild(head); card.appendChild(body);
      root.appendChild(card);

      const divColor = getComputedStyle(document.documentElement).getPropertyValue('--div-c').trim() || '#E77500';
      const ctx = new Ctx(body, divColor);
      try { def.render(ctx); } catch (e) {
        body.innerHTML += '<div class="viz-readout">组件渲染出错: ' + e.message + '</div>';
        console.error(e);
      }
    }
  };

  /* ---------- 组件上下文 ---------- */
  const COLORS = {
    ink: '#23262F', blue: '#1F5E9E', orange: '#E77500', green: '#2E7D6B',
    red: '#C0392B', purple: '#8E3B6B', gray: '#8B8E9C', gold: '#B8860B',
    teal: '#00838F', rose: '#D81B60', navy: '#283593', olive: '#827717'
  };

  function Ctx(body, divColor) {
    this.body = body;
    this.color = divColor;
    this.COLORS = COLORS;
  }

  Ctx.prototype = {
    canvas(height, ratio) {
      const wrap = document.createElement('div');
      wrap.className = 'viz-canvas-wrap';
      const cv = document.createElement('canvas');
      if (!height) height = 380;
      if (ratio && ratio !== 1) height = Math.round(height);
      cv.style.height = height + 'px';
      wrap.appendChild(cv);
      this.body.appendChild(wrap);
      return cv;
    },
    controls() {
      const div = document.createElement('div');
      div.className = 'viz-controls';
      this.body.appendChild(div);
      return div;
    },
    slider(parent, label, min, max, step, value, fmt) {
      const ctl = document.createElement('div');
      ctl.className = 'ctl';
      const lab = document.createElement('label');
      lab.textContent = label;
      const input = document.createElement('input');
      input.type = 'range'; input.min = min; input.max = max; input.step = step; input.value = value;
      const val = document.createElement('span');
      val.className = 'ctl-val';
      const upd = () => { val.textContent = fmt ? fmt(+input.value) : input.value; };
      input.addEventListener('input', upd);
      upd();
      ctl.appendChild(lab); ctl.appendChild(input); ctl.appendChild(val);
      parent.appendChild(ctl);
      return { input, val, set(v) { input.value = v; upd(); } };
    },
    select(parent, label, options, value) {
      const ctl = document.createElement('div');
      ctl.className = 'ctl';
      const lab = document.createElement('label');
      lab.textContent = label;
      const sel = document.createElement('select');
      for (const o of options) {
        const opt = document.createElement('option');
        opt.value = o[0]; opt.textContent = o[1];
        if (o[0] === value) opt.selected = true;
        sel.appendChild(opt);
      }
      ctl.appendChild(lab); ctl.appendChild(sel);
      parent.appendChild(ctl);
      return sel;
    },
    button(parent, label, onClick) {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.addEventListener('click', onClick);
      parent.appendChild(btn);
      return btn;
    },
    readout() {
      const div = document.createElement('div');
      div.className = 'viz-readout';
      this.body.appendChild(div);
      return div;
    },
    setReadout(div, html) {
      div.innerHTML = html;
      MiniTeX.typeset(div);
    },
    animate(fn) {
      let raf = 0, alive = true, last = performance.now();
      const loop = (now) => {
        if (!alive) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        fn(dt);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      VIZ.cleanups.push(() => { alive = false; cancelAnimationFrame(raf); });
    },
    onDestroy(fn) { VIZ.cleanups.push(fn); },
    later(fn, ms) {
      const t = setTimeout(fn, ms);
      VIZ.cleanups.push(() => clearTimeout(t));
      return t;
    }
  };

  /* ---------- Plot 坐标纸引擎 ---------- */
  function Plot(canvas, o) {
    this.cv = canvas;
    this.c = canvas.getContext('2d');
    this.o = Object.assign({ xmin: -5, xmax: 5, ymin: -3, ymax: 3, padL: 44, padR: 16, padT: 16, padB: 34, grid: true, axes: true }, o);
    this.W = 0; this.H = 0;
    this._drawFns = [];
    const self = this;

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 10) return;
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width, h = rect.height || parseFloat(canvas.style.height) || 380;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      this.c.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.W = w; this.H = h;
      this.redraw();
    };
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    VIZ.cleanups.push(() => ro.disconnect());
    fit();
  }

  Plot.prototype = {
    onDraw(fn) { this._drawFns.push(fn); this.redraw(); },
    redraw() {
      if (!this.W) return;
      const c = this.c;
      c.clearRect(0, 0, this.W, this.H);
      if (this.o.grid) this.grid();
      if (this.o.axes) this.axes();
      for (const fn of this._drawFns) fn(this);
    },
    px(x) { const o = this.o; return o.padL + (x - o.xmin) / (o.xmax - o.xmin) * (this.W - o.padL - o.padR); },
    py(y) { const o = this.o; return this.H - o.padB - (y - o.ymin) / (o.ymax - o.ymin) * (this.H - o.padT - o.padB); },
    dx(px) { const o = this.o; return o.xmin + (px - o.padL) / (this.W - o.padL - o.padR) * (o.xmax - o.xmin); },
    dy(py) { const o = this.o; return o.ymin + (this.H - o.padB - py) / (this.H - o.padT - o.padB) * (o.ymax - o.ymin); },

    niceStep(range, target) {
      const raw = range / target;
      const p = Math.pow(10, Math.floor(Math.log10(raw)));
      for (const m of [1, 2, 5, 10]) if (raw <= m * p) return m * p;
      return 10 * p;
    },
    fmtNum(v) {
      if (Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-4 && v !== 0)) return v.toExponential(1);
      let s = Math.round(v * 1e6) / 1e6 + '';
      if (s.includes('.')) s = s.replace(/\.?0+$/, '');
      return s === '-0' ? '0' : s;
    },
    grid() {
      const c = this.c, o = this.o;
      const sx = this.niceStep(o.xmax - o.xmin, 10), sy = this.niceStep(o.ymax - o.ymin, 7);
      c.lineWidth = 1;
      c.strokeStyle = 'rgba(35,38,47,.08)';
      c.beginPath();
      for (let x = Math.ceil(o.xmin / sx) * sx; x <= o.xmax + 1e-9; x += sx) { const p = Math.round(this.px(x)) + .5; c.moveTo(p, 0); c.lineTo(p, this.H); }
      for (let y = Math.ceil(o.ymin / sy) * sy; y <= o.ymax + 1e-9; y += sy) { const p = Math.round(this.py(y)) + .5; c.moveTo(0, p); c.lineTo(this.W, p); }
      c.stroke();
      this._sx = sx; this._sy = sy;
    },
    axes() {
      const c = this.c, o = this.o;
      const x0 = Math.min(Math.max(this.px(0), o.padL - 20), this.W - o.padR);
      const y0 = Math.min(Math.max(this.py(0), o.padT), this.H - o.padB + 20);
      c.strokeStyle = 'rgba(35,38,47,.55)';
      c.lineWidth = 1.4;
      c.beginPath();
      c.moveTo(0, y0); c.lineTo(this.W, y0);
      c.moveTo(x0, 0); c.lineTo(x0, this.H);
      c.stroke();
      // 刻度数字
      c.fillStyle = 'rgba(35,38,47,.55)';
      c.font = '10.5px "SF Mono","Consolas",monospace';
      const sx = this._sx, sy = this._sy;
      c.textAlign = 'center';
      for (let x = Math.ceil(o.xmin / sx) * sx; x <= o.xmax + 1e-9; x += sx) {
        if (Math.abs(x) < sx / 2) continue;
        const p = this.px(x);
        if (p > o.padL - 14 && p < this.W - 4) c.fillText(this.fmtNum(x), p, y0 + 14);
      }
      c.textAlign = 'right';
      for (let y = Math.ceil(o.ymin / sy) * sy; y <= o.ymax + 1e-9; y += sy) {
        if (Math.abs(y) < sy / 2) continue;
        const p = this.py(y);
        if (p > 12 && p < this.H - o.padB + 6) c.fillText(this.fmtNum(y), x0 - 7, p + 3.5);
      }
    },
    fn(f, opts) {
      const o = opts || {};
      const c = this.c;
      c.strokeStyle = o.color || COLORS.blue;
      c.lineWidth = o.width || 2.2;
      c.setLineDash(o.dash || []);
      const n = Math.max(120, Math.round((this.W - this.o.padL - this.o.padR) * 1.6));
      const xmin = this.o.xmin, xmax = this.o.xmax;
      const ymax = this.o.ymax, ymin = this.o.ymin;
      const span = ymax - ymin;
      c.beginPath();
      let started = false, prevY = null;
      for (let i = 0; i <= n; i++) {
        const x = xmin + (xmax - xmin) * i / n;
        let y;
        try { y = f(x); } catch (e) { y = NaN; }
        if (!isFinite(y)) { started = false; prevY = null; continue; }
        if (prevY !== null && Math.abs(y - prevY) > span * 2.5) started = false;
        const Y = Math.min(Math.max(this.py(y), -2000), 2000);
        if (!started) { c.moveTo(this.px(x), Y); started = true; }
        else c.lineTo(this.px(x), Y);
        prevY = y;
      }
      c.stroke();
      c.setLineDash([]);
    },
    path(pts, opts) {
      const o = opts || {};
      const c = this.c;
      c.strokeStyle = o.color || COLORS.blue;
      c.lineWidth = o.width || 2;
      c.setLineDash(o.dash || []);
      c.beginPath();
      pts.forEach((p, i) => i ? c.lineTo(this.px(p[0]), this.py(p[1])) : c.moveTo(this.px(p[0]), this.py(p[1])));
      if (o.close) c.closePath();
      if (o.fill) { c.fillStyle = o.fill; c.fill(); }
      c.stroke();
      c.setLineDash([]);
    },
    line(x1, y1, x2, y2, opts) { this.path([[x1, y1], [x2, y2]], opts); },
    vline(x, opts) { this.line(x, this.o.ymin, x, this.o.ymax, opts); },
    hline(y, opts) { this.line(this.o.xmin, y, this.o.xmax, y, opts); },
    vband(x1, x2, color) {
      const c = this.c;
      c.fillStyle = color || 'rgba(231,117,0,.13)';
      const a = this.px(Math.min(x1, x2)), b = this.px(Math.max(x1, x2));
      c.fillRect(a, 0, b - a, this.H);
    },
    hband(y1, y2, color) {
      const c = this.c;
      c.fillStyle = color || 'rgba(31,94,158,.12)';
      const a = this.py(Math.max(y1, y2)), b = this.py(Math.min(y1, y2));
      c.fillRect(0, a, this.W, b - a);
    },
    rectArea(x1, x2, ybot, ytop, color) {
      const c = this.c;
      c.fillStyle = color;
      const a = this.px(x1), b = this.px(x2);
      const t = this.py(ytop), bo = this.py(ybot);
      c.fillRect(a, Math.min(t, bo), b - a, Math.abs(bo - t));
    },
    point(x, y, opts) {
      const o = opts || {};
      const c = this.c;
      c.fillStyle = o.color || COLORS.orange;
      c.strokeStyle = '#fff';
      c.lineWidth = o.r > 5 ? 2 : 1.5;
      c.beginPath();
      c.arc(this.px(x), this.py(y), o.r || 4.5, 0, Math.PI * 2);
      c.fill(); c.stroke();
      if (o.label) {
        c.fillStyle = o.labelColor || o.color || COLORS.orange;
        c.font = '600 11.5px "Noto Sans SC",sans-serif';
        c.textAlign = o.align || 'left';
        c.fillText(o.label, this.px(x) + (o.dx || 8), this.py(y) + (o.dy || -8));
      }
    },
    arrow(x1, y1, x2, y2, opts) {
      const o = opts || {};
      const c = this.c;
      c.strokeStyle = o.color || COLORS.orange;
      c.fillStyle = o.color || COLORS.orange;
      c.lineWidth = o.width || 2;
      const p1 = [this.px(x1), this.py(y1)], p2 = [this.px(x2), this.py(y2)];
      const ang = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
      const head = o.head || 8;
      c.beginPath();
      c.moveTo(p1[0], p1[1]);
      c.lineTo(p2[0] - Math.cos(ang) * head * .7, p2[1] - Math.sin(ang) * head * .7);
      c.stroke();
      c.beginPath();
      c.moveTo(p2[0], p2[1]);
      c.lineTo(p2[0] - head * Math.cos(ang - 0.42), p2[1] - head * Math.sin(ang - 0.42));
      c.lineTo(p2[0] - head * Math.cos(ang + 0.42), p2[1] - head * Math.sin(ang + 0.42));
      c.closePath();
      c.fill();
    },
    text(x, y, str, opts) {
      const o = opts || {};
      const c = this.c;
      c.fillStyle = o.color || 'rgba(35,38,47,.85)';
      c.font = (o.weight || '600') + ' ' + (o.size || 12) + 'px ' + (o.mono ? '"SF Mono","Consolas",monospace' : '"Noto Sans SC","Noto Serif SC",sans-serif');
      c.textAlign = o.align || 'center';
      c.fillText(str, this.px(x), this.py(y) + (o.dy || 0));
    },
    labelPx(px, py, str, opts) {
      const o = opts || {};
      const c = this.c;
      c.fillStyle = o.color || 'rgba(35,38,47,.8)';
      c.font = (o.weight || '600') + ' ' + (o.size || 11.5) + 'px "Noto Sans SC",sans-serif';
      c.textAlign = o.align || 'left';
      c.fillText(str, px, py);
    },
    drag(onMove) {
      const cv = this.cv;
      const get = (e) => {
        const r = cv.getBoundingClientRect();
        const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
        const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
        return [this.dx(cx), this.dy(cy)];
      };
      const mv = (e) => { e.preventDefault(); onMove(get(e), e); };
      const up = () => {
        window.removeEventListener('mousemove', mv);
        window.removeEventListener('mouseup', up);
        window.removeEventListener('touchmove', mv);
        window.removeEventListener('touchend', up);
      };
      const down = (e) => {
        onMove(get(e), e);
        window.addEventListener('mousemove', mv);
        window.addEventListener('mouseup', up);
        window.addEventListener('touchmove', mv, { passive: false });
        window.addEventListener('touchend', up);
      };
      cv.addEventListener('mousedown', down);
      cv.addEventListener('touchstart', down, { passive: false });
      VIZ.cleanups.push(() => {
        cv.removeEventListener('mousedown', down);
        cv.removeEventListener('touchstart', down);
        up();
      });
    }
  };

  VIZ.Plot = Plot;
  VIZ.Ctx = Ctx;
  VIZ.COLORS = COLORS;
  window.VIZ = VIZ;
})();
