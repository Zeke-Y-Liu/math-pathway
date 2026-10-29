/* ============================================================
   MiniTeX — 自包含迷你 LaTeX 数学渲染引擎
   支持: $...$ 行内, $$...$$ 行间
   子集: \frac \sqrt ^ _ \text \left \right \sum \int \lim
         希腊字母 / 关系符 / 函数名 / \mathbb / 上下装饰
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 符号表 ---------- */
  const SYM = {
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε',
    zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ',
    lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', varpi: 'ϖ', rho: 'ρ',
    varrho: 'ϱ', sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ', phi: 'ϕ',
    varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
    Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
    Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
    infty: '∞', to: '→', rightarrow: '→', longrightarrow: '→', leftarrow: '←',
    leftrightarrow: '↔', Rightarrow: '⇒', Leftarrow: '⇒', Leftrightarrow: '⇔',
    mapsto: '↦', hookrightarrow: '↪', uparrow: '↑', downarrow: '↓',
    leq: '≤', le: '≤', geq: '≥', ge: '≥', neq: '≠', ne: '≠',
    sim: '∼', simeq: '≃', approx: '≈', equiv: '≡', cong: '≅', propto: '∝',
    pm: '±', mp: '∓', times: '×', cdot: '·', div: '÷', ast: '∗', star: '⋆',
    circ: '∘', bullet: '•', oplus: '⊕', otimes: '⊗', perp: '⊥', parallel: '∥',
    angle: '∠', triangle: '△', square: '□', forall: '∀', exists: '∃',
    nexists: '∄', in: '∈', notin: '∉', ni: '∋', subset: '⊂', subseteq: '⊆',
    supset: '⊃', supseteq: '⊇', cup: '∪', cap: '∩', emptyset: '∅',
    varnothing: '∅', setminus: '∖', vee: '∨', wedge: '∧', neg: '¬', lnot: '¬',
    therefore: '∴', because: '∵', cdots: '⋯', ldots: '…', dots: '…',
    vdots: '⋮', ddots: '⋱', prime: '′', hbar: 'ℏ', ell: 'ℓ', Re: 'ℜ', Im: 'ℑ',
    aleph: 'ℵ', partial: '∂', nabla: '∇', surd: '√', top: '⊤', bot: '⊥',
    models: '⊨', vdash: '⊢', dashv: '⊣', lfloor: '⌊', rfloor: '⌋',
    lceil: '⌈', rceil: '⌉', langle: '⟨', rangle: '⟩', vert: '|', Vert: '‖',
    up: '↑', down: '↓'
  };

  const FUNCS = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'arcsin', 'arccos',
    'arctan', 'sinh', 'cosh', 'tanh', 'coth', 'ln', 'log', 'lg', 'exp',
    'det', 'dim', 'deg', 'gcd', 'arg', 'Pr'];
  const LIMFUNCS = ['lim', 'max', 'min', 'sup', 'inf', 'limsup', 'liminf'];
  const BIGOPS = { sum: '∑', prod: '∏', coprod: '∐', int: '∫', iint: '∬', iiint: '∭', oint: '∮' };
  const BB = { A: '𝔸', B: 'ℬ', C: 'ℂ', E: '𝔼', F: 'ℱ', H: 'ℋ', L: 'ℒ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' };
  const REL = '=<>≤≥≠∼≃≈≡∝∈∉⊂⊆⊃⊇|‖⊥∥';
  const BIN = '+−±∓×÷·∗⋆∘⊕⊗∪∩∖∨∧';

  /* ---------- 工具 ---------- */
  function span(cls, children, text) {
    const s = document.createElement('span');
    if (cls) s.className = cls;
    if (text != null) s.textContent = text;
    if (children) for (const c of children) if (c) s.appendChild(c);
    return s;
  }

  /* ---------- 词法分析 ---------- */
  function tokenize(src) {
    const toks = [];
    let i = 0;
    while (i < src.length) {
      const c = src[i];
      if (c === '\\') {
        const m = /^[a-zA-Z]+/.exec(src.slice(i + 1));
        if (m) { toks.push({ t: 'cmd', v: m[0] }); i += 1 + m[0].length; }
        else { toks.push({ t: 'cmd', v: src[i + 1] }); i += 2; }
      } else if ('{}^_'.includes(c)) {
        toks.push({ t: c }); i++;
      } else if (/\s/.test(c)) {
        toks.push({ t: 'sp' }); i++;
      } else {
        toks.push({ t: 'ch', v: c }); i++;
      }
    }
    return toks;
  }

  /* ---------- 递归下降解析 ---------- */
  function Parser(toks, display) {
    this.toks = toks; this.i = 0; this.display = display;
  }
  Parser.prototype = {
    peek(k) { return this.toks[this.i + (k || 0)]; },
    next() { return this.toks[this.i++]; },
    expect(t) { const tk = this.next(); if (!tk || tk.t !== t) throw new Error('expect ' + t); },

    parseList(stop) {
      const out = [];
      while (this.i < this.toks.length) {
        const tk = this.peek();
        if (stop && tk.t === stop) break;
        const atom = this.parseAtom();
        if (atom) out.push(atom);
      }
      return out;
    },

    parseGroupRaw() { // 读取一层大括号内的原始文本(用于 \text)
      const tk = this.peek();
      if (!tk || tk.t !== '{') return null;
      let depth = 0, j = this.i;
      for (; j < this.toks.length; j++) {
        const t = this.toks[j];
        if (t.t === '{') depth++;
        else if (t.t === '}') { depth--; if (depth === 0) break; }
      }
      let raw = '';
      for (let k = this.i + 1; k < j; k++) {
        const t = this.toks[k];
        raw += t.t === 'cmd' ? '\\' + t.v : (t.t === 'sp' ? ' ' : (t.t === 'ch' ? t.v : t.t));
      }
      this.i = j + 1;
      return raw;
    },

    parseScriptsAfter(atomNode, meta) {
      let node = atomNode, m = meta || {};
      let tk;
      while ((tk = this.peek()) && (tk.t === '^' || tk.t === '_')) {
        this.next();
        const unit = this.parseScriptUnit();
        if (!unit) break;
        const wrap = span(null);
        wrap.appendChild(node);
        if (tk.t === '^') { wrap.appendChild(span('msup', [unit])); m.sup = true; }
        else { wrap.appendChild(span('msub', [unit])); m.sub = true; }
        node = wrap;
      }
      return { node, meta: m };
    },

    parseScriptUnit() {
      const tk = this.peek();
      if (!tk) return null;
      if (tk.t === '{') return this.parseBraceGroup();
      return this.parseAtom();
    },

    parseBraceGroup() {
      this.expect('{');
      const inner = this.parseList('}');
      this.expect('}');
      return span(null, inner);
    },

    parseAtom() {
      const tk = this.peek();
      if (!tk) return null;

      if (tk.t === '{') {
        const g = this.parseBraceGroup();
        const r = this.parseScriptsAfter(g);
        return r.node;
      }
      if (tk.t === '}' || tk.t === '^' || tk.t === '_') { this.next(); return span(null); }

      if (tk.t === 'cmd') {
        this.next();
        return this.parseCommand(tk.v);
      }

      // 普通字符
      this.next();
      const c = tk.v;
      if (/[a-zA-Z]/.test(c)) {
        const r = this.parseScriptsAfter(span('mvar', null, c));
        return r.node;
      }
      if (/[0-9.]/.test(c)) {
        let num = c;
        while (this.peek() && this.peek().t === 'ch' && /[0-9.]/.test(this.peek().v)) num += this.next().v;
        const r = this.parseScriptsAfter(span('mnum', null, num));
        return r.node;
      }
      let s, cls = 'mop-punc';
      if (c === '-') s = '−';
      else if (c === '*') s = '⋅';
      else if (c === "'") { s = '′'; }
      else if (REL.includes(c)) { s = c; cls = 'mop-rel'; }
      else if (BIN.includes(c)) { s = c; cls = 'mop-bin'; }
      else s = c;
      if (c === "'") return span('msup', null, '′');
      return span(cls, null, s);
    },

    parseCommand(cmd) {
      if (cmd === 'frac' || cmd === 'dfrac' || cmd === 'tfrac') {
        const a = this.parseBraceGroup();
        const b = this.parseBraceGroup();
        return span('mfrac', [span('mfrac-num', [a]), span('mfrac-den', [b])]);
      }
      if (cmd === 'sqrt') {
        let idx = null;
        if (this.peek() && this.peek().t === 'ch' && this.peek().v === '[') {
          this.next();
          const n = this.parseList();
          const close = this.peek();
          if (close && close.t === 'ch' && close.v === ']') this.next();
          idx = span('msup', [span(null, n)]);
        }
        const g = this.parseBraceGroup();
        const body = span('msqrt-body', [g]);
        return span('msqrt', [idx, span('mrad', null, '√'), body]);
      }
      if (cmd === 'text' || cmd === 'mathrm' || cmd === 'operatorname') {
        const raw = this.parseGroupRaw();
        return span('mtext', null, raw);
      }
      if (cmd === 'mathbf' || cmd === 'boldsymbol') {
        const g = this.parseBraceGroup();
        g.style.fontWeight = '700';
        return g;
      }
      if (cmd === 'mathit') return this.parseBraceGroup();
      if (cmd === 'mathbb') {
        const g = this.parseGroupRaw();
        let s = '';
        for (const ch of g) s += BB[ch] || ch;
        const r = this.parseScriptsAfter(span('mnum', null, s));
        return r.node;
      }
      if (cmd === 'mathcal') {
        const g = this.parseGroupRaw();
        return span('mvar', null, g);
      }
      if (cmd === 'hat' || cmd === 'bar' || cmd === 'vec' || cmd === 'overline' || cmd === 'overrightarrow') {
        const g = this.parseBraceGroup();
        const single = g.childNodes.length === 1 && g.firstChild.nodeType === 3 && g.textContent.length === 1;
        if (cmd === 'hat' && single) return span(null, null, g.textContent + '\u0302');
        if (cmd === 'bar' && single) return span(null, null, g.textContent + '\u0304');
        if (cmd === 'vec' && single) return span(null, null, g.textContent + '\u20D7');
        if (cmd === 'overrightarrow' && single) return span(null, null, g.textContent + '\u20D7');
        return span('mover', [g]);
      }
      if (cmd === 'underline') {
        const g = this.parseBraceGroup();
        const single = g.childNodes.length === 1 && g.firstChild.nodeType === 3 && g.textContent.length === 1;
        if (single) return span(null, null, g.textContent + '\u0332');
        return span('munder', [g]);
      }
      if (cmd === 'left' || cmd === 'right') {
        const tk = this.next();
        let d = ')';
        if (tk && tk.t === 'ch') d = tk.v;
        else if (tk && tk.t === 'cmd') d = tk.v === '|' ? '‖' : (tk.v === '{' ? '{' : (tk.v === '}' ? '}' : SYM[tk.v] || tk.v));
        if (d === '.') return span(null);
        if (d === '<') d = '⟨'; if (d === '>') d = '⟩';
        return span('mdelim', null, d);
      }
      if (cmd === 'big' || cmd === 'Big' || cmd === 'bigg') {
        const tk = this.next();
        return span('mdelim', null, tk && tk.t === 'ch' ? tk.v : '');
      }
      if (BIGOPS[cmd]) {
        const sym = BIGOPS[cmd];
        const r = this.parseScriptsAfter(span('mnum', null, sym), {});
        if (!this.display || cmd === 'int' || cmd === 'iint' || cmd === 'iiint' || cmd === 'oint') return r.node;
        // 行间模式: 上下标置于算子上下
        const col = span('mbigop');
        const kids = r.node.childNodes;
        let sym2 = kids[0], sub = null, sup = null;
        for (let k = 1; k < kids.length; k++) {
          if (kids[k].classList.contains('msup')) sup = kids[k].firstChild;
          if (kids[k].classList.contains('msub')) sub = kids[k].firstChild;
        }
        if (sup) col.appendChild(span('mbig-sup', [sup]));
        col.appendChild(span('mbig-sym', [sym2]));
        if (sub) col.appendChild(span('mbig-sub', [sub]));
        return col;
      }
      if (LIMFUNCS.includes(cmd)) {
        const name = span('mfn mnum', null, cmd);
        const r = this.parseScriptsAfter(name, {});
        if (!this.display) return r.node;
        const kids = r.node.childNodes;
        let sub = null;
        for (let k = 1; k < kids.length; k++) if (kids[k].classList.contains('msub')) sub = kids[k].firstChild;
        if (!sub) return r.node;
        const col = span('mbigop');
        col.appendChild(span('mbig-sym mbig-fn', [span('mnum', null, cmd)]));
        col.appendChild(span('mbig-sub', [sub]));
        return col;
      }
      if (FUNCS.includes(cmd)) return span('mfn mnum', null, cmd);
      if (cmd === 'quad') return span('mspace-thin', null, '\u2003');
      if (cmd === 'qquad') return span('mspace-thin', null, '\u2003\u2003');
      if (cmd === ',') return span('mspace-thin');
      if (cmd === ';') return span('mspace-thin');
      if (cmd === '!') { const s = span('mspace-thin'); s.style.paddingLeft = '-0.17em'; return s; }
      if (cmd === ' ' || cmd === 'newline' || cmd === '\\') return span('mspace-thin');
      if (cmd === 'displaystyle' || cmd === 'limits' || cmd === 'nolimits') return span(null);
      if (cmd === '{') return span('mnum', null, '{');
      if (cmd === '}') return span('mnum', null, '}');
      if (cmd === '|') return span('mop-rel', null, '‖');
      if (SYM[cmd]) {
        const cls = (cmd === 'in' || cmd === 'notin' || cmd === 'subset' || cmd === 'subseteq' || cmd === 'leq' || cmd === 'geq' || cmd === 'le' || cmd === 'ge' || cmd === 'neq' || cmd === 'ne' || cmd === 'equiv' || cmd === 'approx' || cmd === 'sim' || cmd === 'to') ? 'mop-rel' : 'mop-bin';
        const r = this.parseScriptsAfter(span(cls, null, SYM[cmd]));
        return r.node;
      }
      // 未知命令: 原样显示
      return span('mnum', null, cmd);
    }
  };

  /* ---------- 对外接口 ---------- */
  function render(src, display) {
    const p = new Parser(tokenize(src), display);
    const list = p.parseList();
    return span(display ? 'dmath' : 'imath', list);
  }

  function typeset(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (n.nodeValue && n.nodeValue.indexOf('$') !== -1) nodes.push(n);
    }
    const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
    for (const node of nodes) {
      const text = node.nodeValue;
      let frag = null, last = 0, m;
      re.lastIndex = 0;
      while ((m = re.exec(text))) {
        if (!frag) frag = document.createDocumentFragment();
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const isDisplay = m[1] !== undefined;
        const src = isDisplay ? m[1] : m[2];
        try {
          const elx = render(src, isDisplay);
          if (isDisplay) {
            const block = document.createElement('span');
            block.className = 'math-display';
            block.appendChild(elx);
            frag.appendChild(block);
          } else frag.appendChild(elx);
        } catch (e) {
          frag.appendChild(document.createTextNode(m[0]));
        }
        last = re.lastIndex;
      }
      if (frag) {
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      }
    }
  }

  window.MiniTeX = { render, typeset };
})();
