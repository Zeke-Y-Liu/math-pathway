/* ============================================================
   App — 路由 / 侧栏 / 首页 / 章节渲染 / 练习引擎 / 进度
   ============================================================ */
(function () {
  'use strict';

  const DIVS = window.COURSE_DIVISIONS || [];
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));

  /* ---------- 全章列表（扁平，用于上一章/下一章） ---------- */
  const FLAT = [];
  DIVS.forEach((d, di) => d.chapters.forEach((c, ci) => {
    FLAT.push({ div: d, divIdx: di, ch: c, chIdx: ci, no: (di + 1) + '.' + (ci + 1) });
  }));
  const CH_MAP = {};
  FLAT.forEach(f => { CH_MAP[f.div.id + '/' + f.ch.id] = f; });

  /* ---------- 练习题索引（exId → {ex, f}），供错题本使用 ---------- */
  const EX_MAP = {};
  FLAT.forEach(f => (f.ch.exercises || []).forEach(ex => { EX_MAP[ex.id] = { ex: ex, f: f }; }));

  /* ---------- 进度存储 ---------- */
  const Store = {
    key: 'mp-progress-v1',
    data: null,
    load() {
      if (this.data) return this.data;
      try { this.data = JSON.parse(localStorage.getItem(this.key)) || {}; }
      catch (e) { this.data = {}; }
      this.data.answers = this.data.answers || {};
      this.data.visited = this.data.visited || {};
      return this.data;
    },
    persist() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) {} },
    // merge 保存：答错置 wrongOnce 标记并永久保留（答对也不清除），供错题本回溯
    saveAnswer(exId, payload) {
      const d = this.load();
      d.answers[exId] = Object.assign(d.answers[exId] || {}, payload);
      if (payload.correct === false) d.answers[exId].wrongOnce = true;
      this.persist();
    },
    getAnswer(exId) { return this.load().answers[exId] || null; },
    correctCount() { return Object.values(this.load().answers).filter(a => a && a.correct).length; },
    markVisited(chKey) { this.load().visited[chKey] = true; this.persist(); },
    setLast(route) { this.load().last = route; this.persist(); },
    getLast() { return this.load().last; }
  };

  function chapterKey(f) { return f.div.id + '/' + f.ch.id; }

  function exStats(ch) {
    let total = (ch.exercises || []).length, correct = 0, answered = 0;
    for (const ex of (ch.exercises || [])) {
      const a = Store.getAnswer(ex.id);
      if (a) { answered++; if (a.correct) correct++; }
    }
    return { total, answered, correct };
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ---------- 侧边栏 ---------- */
  function buildSidebar() {
    const sb = $('#sidebar');
    sb.innerHTML = '';
    const brand = document.createElement('div');
    brand.className = 'side-brand';
    brand.innerHTML = '<a class="brand-mark" href="#/"><span class="sig">∫</span><span>从函数到分析</span></a>' +
      '<div class="brand-sub">HIGHSCHOOL → CALCULUS → ANALYSIS</div>';
    sb.appendChild(brand);

    const nav = document.createElement('nav');
    nav.className = 'side-nav';
    DIVS.forEach((d, di) => {
      const wrap = document.createElement('div');
      wrap.className = 'division';
      wrap.style.setProperty('--div-c', d.color);
      let visited = 0;
      d.chapters.forEach(c => { if (Store.load().visited[d.id + '/' + c.id]) visited++; });
      const head = document.createElement('div');
      head.className = 'div-head';
      head.innerHTML = '<span class="div-num">' + d.roman + '</span><span class="div-title">' + d.shortName +
        '</span><span class="div-prog">' + visited + '/' + d.chapters.length + '</span>';
      head.addEventListener('click', () => {
        const first = FLAT.find(f => f.div.id === d.id);
        if (first) location.hash = '#/ch/' + chapterKey(first);
      });
      wrap.appendChild(head);
      const ul = document.createElement('div');
      ul.className = 'chapters';
      d.chapters.forEach((c, ci) => {
        const st = exStats(c);
        const a = document.createElement('a');
        a.className = 'ch-link';
        a.href = '#/ch/' + d.id + '/' + c.id;
        const dot = st.total > 0 && st.correct === st.total ? ' done' : (st.answered > 0 ? ' partial' : '');
        a.innerHTML = '<span class="ch-no">' + (di + 1) + '.' + (ci + 1) + '</span>' +
          '<span>' + c.title + '</span><span class="ch-dot' + dot + '"></span>';
        a.dataset.route = d.id + '/' + c.id;
        ul.appendChild(a);
      });
      wrap.appendChild(ul);
      nav.appendChild(wrap);
    });
    sb.appendChild(nav);

    // 工具区：错题本入口（含待攻克数徽标）
    const wbN = wbEntries().filter(e => e.pending).length;
    const tools = document.createElement('div');
    tools.className = 'side-tools';
    tools.innerHTML = '<a href="#/wrongbook" class="wb-tool-link' + (location.hash === '#/wrongbook' ? ' active' : '') + '">' +
      '<span class="wb-tool-ico">✎</span><span>错题本 · 复习</span>' +
      '<span class="wb-tool-badge' + (wbN ? '' : ' zero') + '">' + wbN + '</span></a>';
    sb.appendChild(tools);

    const foot = document.createElement('div');
    foot.className = 'side-foot';
    foot.innerHTML = '课程体系参考 <a href="https://www.math.princeton.edu/undergraduate/placement/lower-division" target="_blank" rel="noopener">普林斯顿数学系</a> 本科课程序列<br>分析部分基于 <a href="https://blogs.princeton.edu/mathclub/guide/courses/analysis/" target="_blank" rel="noopener">Stein &amp; Shakarchi</a>《普林斯顿分析讲义》';
    sb.appendChild(foot);
  }

  function updateSidebarActive() {
    const route = location.hash.replace('#/ch/', '');
    $$('.side-nav .ch-link').forEach(a => {
      a.classList.toggle('active', a.dataset.route === route);
    });
  }

  /* ---------- 首页 ---------- */
  function renderHome() {
    const main = $('#main');
    document.documentElement.style.setProperty('--div-c', 'var(--accent)');
    document.title = '从函数到分析 · 数学进阶之路';

    let totalCh = FLAT.length, totalEx = 0, totalViz = 0;
    FLAT.forEach(f => {
      totalEx += (f.ch.exercises || []).length;
      (f.ch.sections || []).forEach(s => { if (s.type === 'viz') totalViz++; });
    });
    const done = Store.correctCount();

    const cont = document.createElement('div');
    cont.className = 'content-col';
    cont.innerHTML =
      '<div class="hero">' +
      '<div class="hero-eyebrow">Princeton-Inspired Math Pathway</div>' +
      '<h1>从<span class="hl">函数</span>出发，<br>抵达<span class="hl">分析</span>的彼岸。</h1>' +
      '<p class="hero-sub">一条从高中数学通往微积分、再通往严格数学分析的完整进阶之路。课程结构参考普林斯顿大学数学系本科培养体系（MAT 100 → 103 → 104 → 201 → 215 → Stein 分析四部曲），全程以交互式图像为舟，以练习与讲解为桨。</p>' +
      '<div class="hero-actions">' +
      '<a class="btn btn-primary" href="#/ch/' + chapterKey(FLAT[Store.getLast() ? (CH_MAP[Store.getLast()] ? FLAT.indexOf(CH_MAP[Store.getLast()]) : 0) : 0]) + '">' + (Store.getLast() && CH_MAP[Store.getLast()] ? '继续学习' : '开始学习') + ' →</a>' +
      '<a class="btn btn-ghost" href="#roadmap">查看学习路线</a>' +
      '<a class="btn btn-ghost" href="#/wrongbook">✎ 错题本' + (wbEntries().filter(e => e.pending).length ? ' <span class="wb-hero-n">' + wbEntries().filter(e => e.pending).length + '</span>' : '') + '</a>' +
      '</div>' +
      '<div class="hero-stats">' +
      '<div class="stat"><div class="stat-n">' + totalCh + '</div><div class="stat-l">进阶章节</div></div>' +
      '<div class="stat"><div class="stat-n">' + totalViz + '</div><div class="stat-l">交互实验室</div></div>' +
      '<div class="stat"><div class="stat-n">' + totalEx + '</div><div class="stat-l">配套练习</div></div>' +
      '<div class="stat"><div class="stat-n"><em>' + done + '</em>/' + totalEx + '</div><div class="stat-l">已完成</div></div>' +
      '</div></div>' +

      '<div class="roadmap-sec" id="roadmap"><div class="sec-eyebrow">Roadmap</div>' +
      '<h2 class="sec-title">四部 · 廿章 · 一条主线</h2>' +
      '<p class="sec-desc">每一部对应普林斯顿课程序列的一个阶段。图形化实验室贯穿始终：先建立直觉，再落到计算，最后升华为严格证明。</p>' +
      '<div class="roadmap"></div></div>' +

      '<div class="roadmap-sec"><div class="sec-eyebrow">Curriculum Map</div>' +
      '<h2 class="sec-title">与普林斯顿课程的对位</h2>' +
      '<p class="sec-desc">普林斯顿数学系的本科路径：标准计算序列 103–104–201–202 强调具体计算；证明序列 215 起用 Rudin《数学分析原理》；高年级核心即著名的「Stein 四部曲」。</p>' +
      '<div class="pu-map"></div></div>' +

      '<div class="home-note"><b>如何使用本站：</b>每章先读「概念」建立直觉 → 进入「实验室」动手拖动滑块 → 做「练习」并展开「讲解」逐行核对 → 记住章末要点。进度自动保存在本地浏览器中。</div>' +

      '<div class="home-footer"><b>参考资料：</b><br>' +
      '· Princeton Mathematics — <a href="https://www.princeton.edu/academics/area-of-study/mathematics" target="_blank" rel="noopener">Undergraduate Curriculum (MAT 103/104/201…)</a><br>' +
      '· Princeton Math Department — <a href="https://www.math.princeton.edu/undergraduate/placement/lower-division" target="_blank" rel="noopener">Overview of Lower Division Courses</a> / <a href="https://www.math.princeton.edu/undergraduate/placement/sequences" target="_blank" rel="noopener">Standard Math Sequences</a><br>' +
      '· Princeton Math Club — <a href="https://blogs.princeton.edu/mathclub/guide/courses/analysis/" target="_blank" rel="noopener">Analysis Guide: the Stein Sequence</a><br>' +
      '· Elias M. Stein &amp; Rami Shakarchi, <i>Princeton Lectures in Analysis I–IV</i>, Princeton University Press<br>' +
      '· Walter Rudin, <i>Principles of Mathematical Analysis</i>（普林斯顿 MAT 215 教材）<br>' +
      '本站为教学演示项目，内容为基于上述体系的原创编写。</div>';

    main.innerHTML = '';
    main.appendChild(cont);

    // 路线图卡片
    const rm = $('.roadmap', cont);
    DIVS.forEach((d, i) => {
      const exN = d.chapters.reduce((s, c) => s + (c.exercises || []).length, 0);
      const card = document.createElement('a');
      card.className = 'stage-card';
      card.style.setProperty('--div-c', d.color);
      card.href = '#/ch/' + d.id + '/' + d.chapters[0].id;
      card.innerHTML = '<div class="stage-roman">第 ' + d.roman + ' 部</div>' +
        '<div class="stage-name">' + d.title.replace(' · ', '<br>') + '</div>' +
        '<div class="stage-pu">' + d.princeton + '</div>' +
        '<div class="stage-desc">' + d.desc + '</div>' +
        '<div class="stage-chips">' + d.chapters.map(c => '<span class="chip">' + c.title + '</span>').join('') + '</div>' +
        '<div class="stage-meta"><span>' + d.chapters.length + ' 章</span><span>' + exN + ' 练习</span></div>';
      rm.appendChild(card);
    });

    // 普林斯顿对位表
    const puRows = [
      ['MAT 100', '预备微积分', '函数与图像、指数对数三角、数列与不等式', 'foundation'],
      ['MAT 103', '微积分 I', '极限与连续、导数及其应用、微积分基本定理', 'calculus'],
      ['MAT 104', '微积分 II', '积分技巧、级数与泰勒展开、旋转体与弧长', 'calculus'],
      ['MAT 201', '多变量微积分', '偏导数、梯度、二重积分', 'calculus'],
      ['MAT 215', '荣誉分析（Rudin 前 8 章）', '实数系、拓扑、序列、连续、一致收敛、黎曼积分', 'analysis'],
      ['MAT 325/335', 'Stein I/II：傅里叶 · 复分析', '傅里叶级数、全纯函数、柯西定理、留数', 'stein'],
      ['MAT 425/520', 'Stein III/IV：实分析 · 泛函', '测度论、勒贝格积分、Hilbert 空间、算子', 'stein']
    ];
    const puMap = $('.pu-map', cont);
    puRows.forEach(r => {
      const div = DIVS.find(d => d.id === r[3]);
      const row = document.createElement('div');
      row.className = 'pu-map-row';
      if (div) row.style.setProperty('--div-c', div.color);
      row.innerHTML = '<div class="pu-code">' + r[0] + '</div><div class="pu-name">' + r[1] + '</div><div class="pu-topics">' + r[2] + '</div>';
      puMap.appendChild(row);
    });

    MiniTeX.typeset(cont);
  }

  /* ---------- 练习引擎 ---------- */
  function renderExercise(ex, f, onChange) {
    const card = document.createElement('div');
    card.className = 'ex-card';
    card.dataset.exid = ex.id;
    const stars = '★'.repeat(ex.diff || 1) + '<span style="color:var(--line-strong)">' + '★'.repeat(3 - (ex.diff || 1)) + '</span>';
    let html = '<div class="ex-q-head"><span class="ex-no">练习 ' + ex.id.toUpperCase() + '</span><span class="ex-diff">' + stars + '</span></div>' +
      '<div class="ex-q">' + ex.question + '</div>';

    if (ex.type === 'choice') {
      html += '<div class="ex-options">';
      ex.options.forEach((o, i) => {
        html += '<button class="ex-opt" data-i="' + i + '"><span class="opt-letter">' + 'ABCD'[i] + '</span><span>' + o + '</span></button>';
      });
      html += '</div>';
    } else {
      html += '<div class="ex-numeric-row"><input type="text" inputmode="decimal" placeholder="输入数值…" aria-label="答案"><span class="muted" style="font-size:13px">' + (ex.unit || '') + '</span></div>';
    }
    html += '<div class="ex-actions">' +
      '<button class="ex-btn ex-btn-check">检查答案</button>' +
      '<button class="ex-btn ex-btn-solu">显示讲解</button></div>' +
      '<div class="ex-feedback"></div>' +
      '<div class="ex-solution"><div class="solu-title">习题讲解</div><div class="solu-body">' + ex.solution + '</div></div>';
    card.innerHTML = html;

    // 状态恢复
    const saved = Store.getAnswer(ex.id);
    const fb = $('.ex-feedback', card);
    const soluBtn = $('.ex-btn-solu', card);
    const solu = $('.ex-solution', card);
    soluBtn.addEventListener('click', () => {
      solu.classList.toggle('show');
      soluBtn.textContent = solu.classList.contains('show') ? '收起讲解' : '显示讲解';
    });

    function applyFeedback(ok, msg) {
      card.classList.remove('correct', 'wrong', 'revealed');
      card.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) card.classList.add('revealed');
      fb.className = 'ex-feedback show ' + (ok ? 'ok' : 'bad');
      fb.innerHTML = msg;
    }

    if (ex.type === 'choice') {
      const opts = $$('.ex-opt', card);
      let picked = saved ? saved.picked : -1;
      opts.forEach(btn => {
        btn.addEventListener('click', () => {
          if (card.classList.contains('correct')) return;
          picked = +btn.dataset.i;
          opts.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        });
      });
      if (saved && saved.picked >= 0) {
        opts[saved.picked].classList.add('selected');
        applyFeedback(saved.correct, saved.correct ? '回答正确！' : '再想想——可展开讲解对照思路。');
      }
      $('.ex-btn-check', card).addEventListener('click', () => {
        if (picked < 0) { toast('请先选择一个选项'); return; }
        const ok = picked === ex.answer;
        Store.saveAnswer(ex.id, { picked, correct: ok });
        if (onChange) onChange(ok);
        applyFeedback(ok, ok ? '回答正确！' : '不正确——正确答案是 <b>' + 'ABCD'[ex.answer] + '</b>。展开讲解看看差在哪一步。');
        if (ok) { buildSidebar(); updateSidebarActive(); toast('✓ 已答对 ' + Store.correctCount() + ' 题'); }
      });
    } else {
      const input = $('input', card);
      if (saved && saved.value != null) {
        input.value = saved.value;
        applyFeedback(saved.correct, saved.correct ? '回答正确！' : '再想想——可展开讲解对照思路。');
      }
      input.addEventListener('keydown', e => { if (e.key === 'Enter') $('.ex-btn-check', card).click(); });
      $('.ex-btn-check', card).addEventListener('click', () => {
        const raw = input.value.trim();
        if (/[\/÷]/.test(raw)) { toast('请输入小数形式（例如 0.5），不支持分数'); return; }
        const v = parseFloat(raw.replace(/，/g, ',').replace(/[^\d.eE+-]/g, ''));
        if (isNaN(v)) { toast('请输入数值'); return; }
        const tol = ex.tolerance != null ? ex.tolerance : 0.001;
        const ok = Math.abs(v - ex.answer) <= tol;
        Store.saveAnswer(ex.id, { value: v, correct: ok });
        if (onChange) onChange(ok);
        applyFeedback(ok, ok ? '回答正确！' : '数值不对——正确值约为 <b>' + ex.answer + '</b>。展开讲解看看差在哪一步。');
        if (ok) { buildSidebar(); updateSidebarActive(); toast('✓ 已答对 ' + Store.correctCount() + ' 题'); }
      });
    }
    return card;
  }

  /* ---------- 错题本 ---------- */
  let wbFilter = 'all'; // all | pending | conquered

  function wbEntries() {
    const ans = Store.load().answers, list = [];
    Object.keys(ans).forEach(id => {
      const a = ans[id], hit = EX_MAP[id];
      if (!hit || !a) return;
      const wrongOnce = a.wrongOnce === true;
      const pending = a.correct !== true; // 当前仍未答对（含旧数据无标记的直接错答）
      if (!wrongOnce && !pending) return;
      list.push({ ex: hit.ex, f: hit.f, pending: pending });
    });
    list.sort((x, y) => (x.f.divIdx - y.f.divIdx) || (x.f.chIdx - y.f.chIdx) || x.ex.id.localeCompare(y.ex.id));
    return list;
  }

  function renderWrongbook() {
    const main = $('#main');
    document.documentElement.style.setProperty('--div-c', 'var(--accent)');
    document.title = '错题本 · 从函数到分析';
    const list = wbEntries();
    const pendingN = list.filter(e => e.pending).length;
    const conqueredN = list.length - pendingN;

    const cont = document.createElement('div');
    cont.className = 'content-col wb-page';
    cont.innerHTML =
      '<div class="chapter-hero"><div class="crumbs"><a href="#/">首页</a><span class="sep">/</span><span>错题本</span></div>' +
      '<div class="pu-badge">◈ Review · 复习</div>' +
      '<h1><span class="ch-index">✎</span>错题本</h1>' +
      '<p class="ch-intro">所有曾经答错的练习都收录在此。在这里重做，直到每道题都能独立做对——「待攻克」变成「已攻克」，就是复习的全部意义。</p>' +
      '<div class="ch-watermark">✎</div></div>' +

      '<div class="wb-stats">' +
      '<div class="wb-stat bad"><div class="wb-stat-n" id="wb-pending-n">' + pendingN + '</div><div class="wb-stat-l">待攻克</div></div>' +
      '<div class="wb-stat ok"><div class="wb-stat-n" id="wb-conquered-n">' + conqueredN + '</div><div class="wb-stat-l">已攻克</div></div>' +
      '<div class="wb-tabs">' +
      '<button class="wb-tab' + (wbFilter === 'all' ? ' on' : '') + '" data-f="all">全部 ' + list.length + '</button>' +
      '<button class="wb-tab' + (wbFilter === 'pending' ? ' on' : '') + '" data-f="pending">待攻克 ' + pendingN + '</button>' +
      '<button class="wb-tab' + (wbFilter === 'conquered' ? ' on' : '') + '" data-f="conquered">已攻克 ' + conqueredN + '</button>' +
      '</div></div>';

    const body = document.createElement('div');
    body.className = 'wb-list';
    if (!list.length) {
      body.innerHTML = '<div class="wb-empty"><div class="wb-empty-icon">✓</div>' +
        '<div class="wb-empty-title">还没有错题记录</div>' +
        '<div class="wb-empty-sub">做错的练习会自动收进错题本。现在就去「<a href="#/">学习路线</a>」里开始练习吧。</div></div>';
    } else {
      const shown = list.filter(e => wbFilter === 'all' || (wbFilter === 'pending') === e.pending);
      if (!shown.length) {
        body.innerHTML = '<div class="wb-empty"><div class="wb-empty-icon">✓</div><div class="wb-empty-title">该分类下暂无题目</div></div>';
      }
      let lastDiv = null, wrap = null;
      shown.forEach(e => {
        if (e.f.div.id !== lastDiv) {
          lastDiv = e.f.div.id;
          const gh = document.createElement('div');
          gh.className = 'wb-group-head';
          gh.style.setProperty('--div-c', e.f.div.color);
          gh.innerHTML = '<span class="wb-group-roman">' + e.f.div.roman + '</span>' + e.f.div.title;
          body.appendChild(gh);
          wrap = document.createElement('div');
          wrap.className = 'wb-group';
          body.appendChild(wrap);
        }
        const item = document.createElement('div');
        item.className = 'wb-item';
        item.dataset.exid = e.ex.id;
        item.innerHTML = '<div class="wb-meta">' +
          '<a class="wb-src" href="#/ch/' + chapterKey(e.f) + '">' + e.f.no + ' ' + e.f.ch.title + ' ↗</a>' +
          '<span class="wb-badge' + (e.pending ? ' pending' : ' ok') + '">' + (e.pending ? '✗ 待攻克' : '✓ 已攻克') + '</span>' +
          '</div>';
        const onAns = function (ok) {
          if (!ok) return;
          const b = item.querySelector('.wb-badge');
          if (b) { b.className = 'wb-badge ok'; b.textContent = '✓ 已攻克'; }
          const left = wbEntries().filter(x => x.pending).length;
          const tot = wbEntries().length;
          const pn = document.getElementById('wb-pending-n'), cn = document.getElementById('wb-conquered-n');
          if (pn) pn.textContent = left;
          if (cn) cn.textContent = tot - left;
        };
        item.appendChild(renderExercise(e.ex, e.f, onAns));
        wrap.appendChild(item);
      });
    }
    cont.appendChild(body);

    main.innerHTML = '';
    main.appendChild(cont);
    MiniTeX.typeset(cont);

    $$('.wb-tab', cont).forEach(btn => btn.addEventListener('click', () => {
      wbFilter = btn.dataset.f;
      renderWrongbook();
    }));
    window.scrollTo({ top: 0 });
  }

  /* ---------- 章节页 ---------- */
  const BLOCK_LABEL = { text: '导读', definition: '定义', theorem: '定理', example: '例题', note: '注记', proof: '证明' };

  function renderChapter(f) {
    const main = $('#main');
    document.documentElement.style.setProperty('--div-c', f.div.color);
    document.title = f.ch.title + ' · 从函数到分析';
    Store.markVisited(chapterKey(f));
    Store.setLast(chapterKey(f));

    const cont = document.createElement('div');
    cont.className = 'content-col';

    const hero = document.createElement('div');
    hero.className = 'chapter-hero';
    hero.innerHTML =
      '<div class="crumbs"><a href="#/">首页</a><span class="sep">/</span><span>' + f.div.title + '</span><span class="sep">/</span><span>' + f.ch.title + '</span></div>' +
      '<div class="pu-badge">◈ ' + (f.ch.princeton || f.div.princeton) + '</div>' +
      '<h1><span class="ch-index">' + f.no + '</span>' + f.ch.title + '</h1>' +
      '<p class="ch-intro">' + f.ch.intro + '</p>' +
      '<div class="ch-watermark">' + f.div.roman + '</div>';
    cont.appendChild(hero);

    let exMount = null;
    (f.ch.sections || []).forEach(sec => {
      if (sec.type === 'viz') {
        const holder = document.createElement('div');
        holder.dataset.viz = sec.id;
        cont.appendChild(holder);
      } else if (sec.type === 'exercises') {
        const head = document.createElement('div');
        head.className = 'ex-sec-head';
        const st = exStats(f.ch);
        head.innerHTML = '<h2>练习 · 学以致用</h2><span class="ex-progress-text">' + st.correct + ' / ' + st.total + ' 已答对</span>';
        cont.appendChild(head);
        const wrap = document.createElement('div');
        wrap.dataset.exercises = '1';
        cont.appendChild(wrap);
        exMount = wrap;
      } else {
        const block = document.createElement('div');
        block.className = 'block ' + sec.type;
        block.innerHTML = (sec.pu ? '<span class="tag-pu">' + sec.pu + '</span>' : '') +
          '<span class="block-label">' + (BLOCK_LABEL[sec.type] || '内容') + '</span>' +
          '<h3>' + sec.title + '</h3>' +
          '<div class="block-body">' + sec.body + '</div>';
        cont.appendChild(block);
      }
    });

    // 章末要点
    if (f.ch.keyPoints && f.ch.keyPoints.length) {
      const kp = document.createElement('div');
      kp.className = 'keypoints';
      kp.innerHTML = '<h3>◈ 本章要点</h3><ul>' + f.ch.keyPoints.map(k => '<li>' + k + '</li>').join('') + '</ul>';
      cont.appendChild(kp);
    }

    // 上一章 / 下一章
    const idx = FLAT.indexOf(f);
    const nav = document.createElement('div');
    nav.className = 'ch-nav';
    if (idx > 0) {
      const p = FLAT[idx - 1];
      nav.innerHTML += '<a href="#/ch/' + chapterKey(p) + '"><span class="nav-dir">← 上一章</span><span class="nav-title">' + p.no + ' ' + p.ch.title + '</span></a>';
    }
    if (idx < FLAT.length - 1) {
      const n = FLAT[idx + 1];
      nav.innerHTML += '<a class="next" href="#/ch/' + chapterKey(n) + '"><span class="nav-dir">下一章 →</span><span class="nav-title">' + n.no + ' ' + n.ch.title + '</span></a>';
    }
    cont.appendChild(nav);

    main.innerHTML = '';
    main.appendChild(cont);
    MiniTeX.typeset(cont);

    // 挂载可视化（在 typeset 之后，避免重复扫描）
    $$('[data-viz]', cont).forEach(h => VIZ.mount(h, h.dataset.viz));

    // 挂载练习
    if (exMount) {
      (f.ch.exercises || []).forEach(ex => exMount.appendChild(renderExercise(ex, f)));
      MiniTeX.typeset(exMount);
    }

    window.scrollTo({ top: 0 });
  }

  /* ---------- 路由 ---------- */
  function route() {
    VIZ.teardown();
    const hash = location.hash || '#/';
    const m = hash.match(/^#\/ch\/([\w-]+)\/([\w-]+)$/);
    if (m && CH_MAP[m[1] + '/' + m[2]]) {
      renderChapter(CH_MAP[m[1] + '/' + m[2]]);
    } else if (hash === '#/wrongbook') {
      renderWrongbook();
    } else {
      renderHome();
    }
    buildSidebar();
    updateSidebarActive();
    setSidebar(false);
  }

  window.addEventListener('hashchange', route);

  /* ---------- 侧栏抽屉开关（移动端） ---------- */
  const sideEl = $('#sidebar');
  const sideToggle = $('#sidebar-toggle');
  const sideBackdrop = $('#sidebar-backdrop');
  function setSidebar(open) {
    sideEl.classList.toggle('open', open);
    sideBackdrop.classList.toggle('show', open);
    document.body.classList.toggle('drawer-open', open);
    sideToggle.textContent = open ? '✕' : '☰';
    sideToggle.setAttribute('aria-label', open ? '关闭目录' : '打开目录');
  }
  sideToggle.addEventListener('click', () => setSidebar(!sideEl.classList.contains('open')));
  sideBackdrop.addEventListener('click', () => setSidebar(false));

  // 初始化
  buildSidebar();
  route();
})();
