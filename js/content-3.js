/* ============================================================
   第三部 · 数学分析 — 严格性革命（对应普林斯顿 MAT 215 荣誉分析，教材 Rudin）
   主线：微积分时期每一条「默认成立」的直觉，在这里被逐一补证。
   ============================================================ */
window.COURSE_DIVISIONS = window.COURSE_DIVISIONS || [];

window.COURSE_DIVISIONS.push({
  id: 'analysis',
  roman: 'III',
  title: '数学分析 · 严格性革命',
  shortName: '数学分析',
  princeton: 'MAT 215 · 荣誉分析（Rudin）',
  color: '#1F5E9E',
  desc: '实数构造、拓扑语言、ε-N 与 ε-δ、一致收敛、严格积分——把微积分的每一条直觉变成定理。',
  chapters: [

  /* ---------------- 第 1 章 ---------------- */
  {
    id: 'reals',
    title: '实数与上确界',
    intro: '微积分默认数轴是「无缝」的——但没有任何证明。这一章我们从有理数的裂缝出发，建立整套分析的基石：完备性公理。',
    princeton: 'MAT 215 · Rudin 第 1 章',
    sections: [
      { type: 'text', title: '革命宣言：微积分默认了什么', body: String.raw`<p>牛顿与莱布尼茨的微积分辉煌了两百年，却建立在一条<strong>从未被验证的假设</strong>上：数轴是连续的。「切线斜率趋近某个值」「面积收敛到某个值」——这些「某个值」凭什么存在？</p><p>更致命的是：<strong>有理数 $\mathbb{Q}$ 是有洞的</strong>。单位正方形的对角线长度 $\sqrt{2}$ 不在任何两个分数的位置上。如果宇宙只由分数构成，那么单调递增、有上界的数列 $1, 1.4, 1.41, 1.414, \ldots$（$\sqrt{2}$ 的不足近似值）将<strong>没有极限</strong>——它在 $\mathbb{Q}$ 里「无处安放」。普林斯顿 MAT 215 的第一课，就是把这条裂缝焊死。</p>` },
      { type: 'theorem', title: '有理数的裂缝：$\sqrt{2} \notin \mathbb{Q}$', pu: 'Rudin 定理 1.1（亚里士多德时代的证明）', body: String.raw`<p><strong>证明（反证法）：</strong>假设 $\sqrt{2} = \frac{p}{q}$ 为既约分数（$p, q$ 无公因子）。两边平方：$p^2 = 2q^2$，故 $p^2$ 是偶数，从而 $p$ 是偶数（奇数平方必为奇数），记 $p = 2r$。代入得 $4r^2 = 2q^2$，即 $q^2 = 2r^2$，故 $q$ 也是偶数。于是 $p, q$ 有公因子 2——与既约矛盾。$∎$</p><p>这个两千四百年前的证明是整个分析学的序曲：<strong>直觉上「应该存在」的量（边长 1 的正方形对角线），在 $\mathbb{Q}$ 中不存在</strong>。集合 $S = \{x \in \mathbb{Q} : x^2 < 2\}$ 在 $\mathbb{Q}$ 中有上界（如 2），却没有<strong>最小上界</strong>——上确界 $\sqrt{2}$ 恰好掉进了分数世界的裂缝里。</p>` },
      { type: 'definition', title: '上确界与完备性公理', pu: 'Rudin 定义 1.10 与有序域公理', body: String.raw`<p>设 $S \subset \mathbb{R}$ 非空。<strong>上界</strong> $b$ 满足：对一切 $s \in S$ 有 $s \leq b$。<strong>上确界</strong> $\sup S$ 是<strong>最小的上界</strong>：</p><ul class="nice"><li>（是上界）对一切 $s \in S$：$s \leq \sup S$；</li><li>（是最小的）对任何 $\varepsilon > 0$，存在 $s \in S$ 使 $s &gt; \sup S - \varepsilon$——任何比 $\sup S$ 小的数都不是上界。</li></ul><p><strong>完备性公理（最小上界性）：</strong>$\mathbb{R}$ 的每个非空有上界的子集都有上确界。同理定义下确界 $\inf S$（最大下界）。</p><p>这条公理是 $\mathbb{R}$ 与 $\mathbb{Q}$ 的<strong>本质区别</strong>：它断言数轴没有缝。整套分析——极限、连续、微分、积分——全部由此生长。</p>` },
      { type: 'viz', id: 'supViz' },
      { type: 'text', title: 'ε-检验：怎样「摸到」上确界', body: String.raw`<p>上确界的第二条性质给出了一个可操作的<strong>检验程序</strong>：想验证 $b = \sup S$，就挑战者出题——任取 $\varepsilon &gt; 0$，你必须找到 $s \in S$ 使 $s &gt; b - \varepsilon$。对 $S = \{1 - \frac{1}{n}\}$：由 $1 - \frac{1}{n} &gt; 1 - \varepsilon \Leftrightarrow n &gt; \frac{1}{\varepsilon}$，任何 $\varepsilon$ 都能找到见证点。在上方实验室拖动 ε 滑块，看绿色的见证点如何应战。</p><p>配套的两条基本性质：</p><p><strong>Archimedes 性质：</strong>对任何 $x \in \mathbb{R}$ 存在 $n \in \mathbb{N}$ 使 $n &gt; x$（「没有无穷大元素」）。<strong>稠密性：</strong>任何两个实数之间都夹着有理数（$\mathbb{Q}$ 在 $\mathbb{R}$ 中稠密）。它们都可以从完备性公理推出——$\mathbb{Q}$ 虽有洞，却洞洞相连地铺满了数轴。</p>` },
      { type: 'theorem', title: '第一个战利品：单调有界数列收敛', body: String.raw`<p><strong>定理：</strong>单调递增且有上界的数列必收敛。</p><p><strong>证明：</strong>设 $a_n$ 递增有上界。由完备性公理，$L = \sup\{a_n\}$ 存在。对任何 $\varepsilon &gt 0$，由 ε-检验存在 $N$ 使 $a_N &gt; L - \varepsilon$；又由单调性，$n &gt; N$ 时 $a_n \geq a_N &gt; L - \varepsilon$，同时 $a_n \leq L &lt; L + \varepsilon$。故 $|a_n - L| &lt; \varepsilon$，即 $a_n \to L$。$∎$</p><p>注意：在 $\mathbb{Q}$ 中这条定理<strong>失效</strong>（数列 $1, 1.4, 1.41, \ldots$ 就是反例）。微积分里「单调有界必有极限」的每一次使用，背后都是完备性公理在买单。</p>` },
      { type: 'example', title: '例题 · 求上确界并完成 ε-检验', body: String.raw`<p><strong>问题：</strong>设 $S = \left\{\dfrac{n}{n+1} : n \in \mathbb{N}\right\}$。求 $\sup S$，并对 $\varepsilon = 0.1$ 找出最小的见证下标 $n$。</p><p><strong>解：</strong>（1）每个 $\frac{n}{n+1} &lt; 1$，故 1 是上界。（2）$\frac{n}{n+1} = 1 - \frac{1}{n+1} &gt; 1 - \varepsilon \Leftrightarrow \frac{1}{n+1} &lt; \varepsilon \Leftrightarrow n + 1 &gt; \frac{1}{\varepsilon}$。取 $\varepsilon = 0.1$：$n + 1 &gt; 10$，即 $n \geq 10$，最小见证 $n = 10$（$s_{10} = \frac{10}{11} \approx 0.909 &gt; 0.9$ ✓）。故 $\sup S = 1$，且 $1 \notin S$——上确界可以不属于集合本身。</p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      '$\\sqrt{2}\\notin\\mathbb{Q}$：有理数有洞；$\\{x\\in\\mathbb{Q}:x^2<2\\}$ 在 $\\mathbb{Q}$ 中无上确界',
      '完备性公理：非空有上界的实数集必有 sup——实数与有理数的本质区别',
      'ε-检验：任何 $\\varepsilon>0$ 都能找到 $s\\in S$ 使 $s>\\sup S-\\varepsilon$',
      '单调有界数列收敛定理是完备性公理的第一个直接推论',
      'Archimedes 性质与 $\\mathbb{Q}$ 的稠密性均可由完备性导出'
    ],
    exercises: [
      { id: 'r-ex1', type: 'choice', diff: 1,
        question: String.raw`集合 $S = \{x \in \mathbb{Q} : x^2 < 2\}$ 在有理数集 $\mathbb{Q}$ 内部的上确界情况是？`,
        options: [String.raw`不存在——上确界应是 $\sqrt{2}$，而 $\sqrt{2} \notin \mathbb{Q}$`, String.raw`等于 $1$，因为 $1 \in S$ 且 $1$ 是最大的平方小于 2 的分数`, String.raw`等于 $\frac{3}{2}$`, String.raw`等于 $2$，因为 $2^2 > 2$`],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>$S$ 在 $\mathbb{Q}$ 内当然有上界（例如 2、1.5 都行——分数上界有无数个）。</p><p><span class="step-tag">Step 2</span>问题出在「最小」：对任何上界 $b \in \mathbb{Q}$，若 $b^2 > 2$，总能在 $b$ 与 $\sqrt{2}$ 之间找到更小的有理上界；若 $b^2 < 2$ 则 $b$ 根本不是上界（右边还有 $S$ 的点）。最小上界「应该」是 $\sqrt{2}$——但它不在 $\mathbb{Q}$ 里。</p><p><span class="step-tag">意义</span>这正是 $\mathbb{Q}$ <strong>不满足完备性公理</strong>的体现：非空有上界的集，可以在 $\mathbb{Q}$ 中没有上确界。数轴的这道裂缝，就是第三部「严格性革命」的起点。</p>` },
      { id: 'r-ex2', type: 'choice', diff: 2,
        question: String.raw`设 $S = \left\{1 - \dfrac{1}{n} : n \in \mathbb{N}\right\}$。下列说法正确的是？`,
        options: [String.raw`$1 \in S$ 且 $1 = \max S$`, String.raw`$\sup S = 1$ 但 $1 \notin S$，故 $S$ 没有最大元素`, String.raw`$\sup S = \frac{1}{2}$（$n=2$ 时的值）`, String.raw`$S$ 无上界`],
        answer: 1,
        solution: String.raw`<p><span class="step-tag">Step 1</span>1 是上界：$1 - \frac{1}{n} < 1$ 对一切 $n$ 成立（且 $n = 1$ 时 $s_1 = 0$，$n \to \infty$ 时无限逼近 1）。</p><p><span class="step-tag">Step 2</span>ε-检验：任取 $\varepsilon > 0$，只要 $n > \frac{1}{\varepsilon}$ 就有 $1 - \frac{1}{n} > 1 - \varepsilon$——任何比 1 小的数都不是上界。故 $\sup S = 1$。</p><p><span class="step-tag">Step 3</span>但 $1 - \frac{1}{n} = 1$ 将要求 $\frac{1}{n} = 0$，不可能。故 $1 \notin S$，$S$ 无最大元素。<strong>上确界可以不属于集合</strong>——它只需「贴着」集合，不必「踩在」集合上。</p>` },
      { id: 'r-ex3', type: 'choice', diff: 2,
        question: String.raw`设 $S = (0, 1) \cup (1, 2]$。关于 $\inf S$ 与 $\sup S$ 的判断正确的是？`,
        options: [String.raw`$\inf S = 0 \in S$，$\sup S = 2 \in S$`, String.raw`$\inf S = 1 \in S$，$\sup S = 2 \in S$`, String.raw`$\inf S = 0 \notin S$，$\sup S = 2 \in S$`, String.raw`$\inf S = 0 \notin S$，$\sup S = 2 \notin S$`],
        answer: 2,
        solution: String.raw`<p><span class="step-tag">Step 1</span>下界与下确界：一切 $s > 0$，故 0 是下界；对任何 $\varepsilon > 0$，$\frac{\varepsilon}{2} \in (0,1) \subset S$ 且 $\frac{\varepsilon}{2} < 0 + \varepsilon$，故任何比 0 大的数都不是下界，$\inf S = 0$。但 $0 \notin S$（左端点开）。</p><p><span class="step-tag">Step 2</span>上界与上确界：一切 $s \leq 2$，且 $2 \in (1, 2]$，故 $\sup S = \max S = 2$，属于 $S$。</p><p><span class="step-tag">注意</span>挖去的点 1 既不影响 inf 也不影响 sup——确界只看「贴得最紧的边界」，中间的洞无关紧要。这也说明 <strong>sup/max 是两个概念</strong>：$\sup S \in S$ 时才叫 $\max S$。</p>` },
      { id: 'r-ex4', type: 'numeric', diff: 3, answer: 10, tolerance: 0.5,
        question: String.raw`设 $S = \left\{\dfrac{n}{n+1} : n \in \mathbb{N}\right\}$，$\sup S = 1$。取 $\varepsilon = 0.1$ 做 ε-检验：使 $s_n = \dfrac{n}{n+1} > 1 - \varepsilon$ 的<strong>最小</strong>下标 $n$ 是多少？<em>（填数值）</em>`,
        solution: String.raw`<p><span class="step-tag">Step 1</span>把不等式改写：$\frac{n}{n+1} > 1 - \varepsilon \Leftrightarrow 1 - \frac{1}{n+1} > 1 - \varepsilon \Leftrightarrow \frac{1}{n+1} < \varepsilon \Leftrightarrow n + 1 > \frac{1}{\varepsilon}$。</p><p><span class="step-tag">Step 2</span>代入 $\varepsilon = 0.1$：$n + 1 > 10$，即 $n > 9$，最小整数 $n = 10$。</p><p><span class="step-tag">验证</span>$s_{10} = \frac{10}{11} \approx 0.9091 > 0.9$ ✓；而 $s_9 = \frac{9}{10} = 0.9$，不大于 $0.9$，差一个「严格」就不算通过。</p><p><span class="step-tag">直觉</span>ε-检验像一场攻防：挑战者给出 $\varepsilon$（越给越小越刁钻），你必须亮出落进 $(1-\varepsilon,\ 1]$ 的集合元素应战。<strong>无论 ε 多小都能应战</strong>，才配称 $\sup S = 1$。这正是实验室里绿色见证点的行为。</p>` }
    ]
  },

  /* ---------------- 第 2 章 ---------------- */
  {
    id: 'topology',
    title: '拓扑：开集、闭集与紧致',
    intro: '极限的「靠近」需要精确化。这一章我们把几何直觉铸成开集与闭集的语言，并遇到分析学中最有威力的概念——紧致性。',
    princeton: 'MAT 215 · Rudin 第 2 章',
    sections: [
      { type: 'text', title: '从「靠近」到邻域', body: String.raw`<p>「$a_n$ 越来越靠近 $L$」「$f(x)$ 在 $x_0$ 附近变化很小」——微积分里这些说法全都依赖一个未定义的词：<strong>附近</strong>。分析的第一个工程，就是把「附近」铸成精确的集合语言：</p>$$N_r(x) = \{y : |y - x| < r\} \qquad \text{（} x \text{ 的 } r \text{-邻域，即开区间 } (x-r,\ x+r)\text{）}$$<p>有了邻域，「极限」「连续」「聚点」全部可以重写为「对某个邻域……」的陈述。这套语言叫<strong>拓扑</strong>。它看起来抽象，实则是把数轴上的几何直觉<strong>公理化</strong>——从此每个证明都有章可循。</p>` },
      { type: 'definition', title: '开集、闭集、聚点', pu: 'Rudin 定义 2.18 系列', body: String.raw`<p><strong>开集</strong> $E$：每一点的某个邻域都整个落在 $E$ 内（「每个点都有余量」）。<strong>闭集</strong> $E$：补集是开集；等价地，$E$ 包含自己的全部<strong>聚点</strong>。</p><p><strong>聚点</strong> $p$：任何去心邻域 $N_r(p) \setminus \{p\}$ 中都有 $E$ 的点——$E$ 的点「无穷多次地涌向 $p$」。$E$ 加上全部聚点得到<strong>闭包</strong> $\overline{E}$，是最小的包含 $E$ 的闭集。</p><ul class="nice"><li>$(0,1)$ 开不闭；$[0,1]$ 闭不开；$\emptyset$ 与 $\mathbb{R}$ <strong>既开又闭</strong>；$\mathbb{Q}$ 既不开也不闭（每个有理点的任何邻域里都有无理点，反之亦然——Q 的聚点是整条数轴）。</li><li>运算律：<strong>任意并</strong>的开集是开集，<strong>有限交</strong>的开集是开集（对偶地：任意交的闭集是闭集，有限并的闭集是闭集）。「有限」不可去掉：$(-1, 1) \cap \left(−\frac{1}{2}, \frac{1}{2}\right) \cap \left(−\frac{1}{3}, \frac{1}{3}\right) \cap \cdots = \{0\}$ 是闭集——无限个开集的交可以不再是开。</li></ul>` },
      { type: 'text', title: '有界闭集：数轴上的「保险箱」', body: String.raw`<p>闭集的聚点全部自锁在集合内，有界集被关在有限区间里——两者合起来（<strong>有界闭集</strong>，如 $[0,1]$、$\{0\} \cup \{1/n\}$）表现出一种惊人的「稳态」：里面的序列想逃逸？有界性逼它有收敛子列，闭性又把极限摁回集合里。这就是 <strong>Bolzano–Weierstrass 紧致性</strong>的雏形。</p><p>反观 $(0,1)$：序列 $\frac{1}{2}, \frac{1}{3}, \frac{1}{4}, \ldots$ 想收敛到 0，但 $0 \notin (0,1)$——极限「漏」出去了。开区间是有漏洞的保险箱：<strong>靠近边界处，集合对极限没有任何承诺</strong>。</p>` },
      { type: 'viz', id: 'openCover' },
      { type: 'theorem', title: 'Heine–Borel 定理', pu: 'Rudin 定理 2.42', body: String.raw`<p><strong>定理：</strong>$\mathbb{R}$ 中的集合<strong>紧致</strong>（任何开覆盖都有有限子覆盖）$\Leftrightarrow$ 该集有界且闭。</p><p>「开覆盖」是一族开区间，合起来罩住目标集；「有限子覆盖」是只保留其中有限多个仍能罩住。<strong>紧致性 = 覆盖意义上的「有限可控」</strong>。</p><p><strong>为什么 $(0,1)$ 不紧：</strong>开覆盖 $\mathcal{U} = \{(1/n,\ 1) : n \in \mathbb{N}\}$ 中，任何有限个子族的最大下标设为 $K$，则 $(0, \frac{1}{K})$ 这段无人覆盖——越靠近 0，需要的区间下标越大，「有限个」永远不够。而 $[0,1]$ 从任何开覆盖中都能贪心地抽出有限子覆盖（实验室里可以亲手操作）。<strong>紧致性把「无穷的边界压力」转化成了「有限的内部结构」</strong>——下一章你会看到，闭区间上连续函数的三大定理（有界、最值、一致连续）全部由此驱动。</p>` },
      { type: 'example', title: '例题 · 判定开闭与聚点', body: String.raw`<p><strong>问题：</strong>设 $S = \{0\} \cup \left\{\dfrac{1}{n} : n \in \mathbb{N}\right\}$。$S$ 是否为闭集？求 $S$ 的全部聚点。</p><p><strong>解：</strong>（1）聚点分析：对任意 $r > 0$，去心邻域 $(0 - r, 0 + r) \setminus \{0\}$ 中总有某个 $\frac{1}{n} &lt; r$，故 $0$ 是聚点。而对固定的 $\frac{1}{k}$，取 $r = \frac{1}{2}\left(\frac{1}{k-1} - \frac{1}{k}\right)$（相邻两点间距的一半），去心邻域内没有其他 $S$ 的点——每个 $\frac{1}{k}$ 都是<strong>孤立点</strong>，不是聚点。</p><p>（2）聚点集 $= \{0\}$，而 $0 \in S$，故 $S$ 包含全部聚点，$S$ 是<strong>闭集</strong>。又 $S \subset [0, 1]$ 有界，由 Heine–Borel，$S$ <strong>紧致</strong>。聚点可以只有孤零零一个，孤立点可以有无穷多个——闭性的判据只关心「聚点是否回收」，不管集合多么稀疏。</p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      '邻域 $N_r(x)=(x-r,x+r)$ 是「附近」的精确化，极限/连续/聚点的统一语言',
      '开集：点点有余量；闭集：包含全部聚点；$\\emptyset$ 与 $\\mathbb{R}$ 既开又闭',
      '任意并（开）与有限交（开）——「有限」不可去掉',
      'Heine–Borel：紧 $\\Leftrightarrow$ 有界闭（$\\mathbb{R}$ 中）；紧 = 任何开覆盖可抽有限子覆盖',
      '紧致性是闭区间上连续函数三大定理（有界/最值/一致连续）的发动机'
    ],
    exercises: [
      { id: 'tp-ex1', type: 'choice', diff: 1,
        question: String.raw`设 $S = (0, 1)$。既是 $S$ 的聚点、又不属于 $S$ 的点是？`,
        options: [String.raw`不存在这样的点`, String.raw`$0$ 与 $1$（两个端点）`, String.raw`只有 $0$`, String.raw`$S$ 的每个点`],
        answer: 1,
        solution: String.raw`<p><span class="step-tag">Step 1</span>聚点集是 $[0,1]$：$S$ 内部每点显然是聚点；端点 $0$ 与 $1$ 的任何去心邻域 $(0, r)$、$(1-r, 1)$ 中都挤满 $S$ 的点，故也是聚点。</p><p><span class="step-tag">Step 2</span>哪些聚点漏在 $S$ 外？$(0,1)$ 内部的点都属于 $S$；而 $0 \notin S$、$1 \notin S$（开区间不含端点）。答案：$0$ 与 $1$。</p><p><span class="step-tag">几何直觉</span>开区间是「没关门的房间」：里面的点（住户）连同门口徘徊的点（访客 0 和 1）都是聚点，但访客进不了门。把门关上（取 $[0,1]$），访客变成住户，集合就闭了——<strong>闭包 = 原集合 + 全部聚点</strong>。</p>` },
      { id: 'tp-ex2', type: 'choice', diff: 2,
        question: String.raw`下列四个 $\mathbb{R}$ 的子集中，<strong>既不开也不闭</strong>的是？`,
        options: [String.raw`$[0, 1)$`, String.raw`$\emptyset$`, String.raw`$[0, 1]$`, String.raw`$\mathbb{R}$`],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>逐一检查：$[0, 1)$——点 $0$ 的任何邻域都会伸到负半轴（不在集合内），故不开；聚点 $1$ 不属于集合，故不闭。<strong>既不开也不闭</strong>。</p><p><span class="step-tag">Step 2</span>排除项：$\emptyset$ 与 $\mathbb{R}$ 是「既开又闭」的两个极端（空真值与全集永远成立）；$[0,1]$ 是标准闭集。</p><p><span class="step-tag">易错点</span>直觉上容易以为集合「总得是开或闭之一」。错——开闭性是两个独立的检验（余量检验、聚点回收检验），两个都不合格完全合法。半开半闭区间正是最常见的例子。</p>` },
      { id: 'tp-ex3', type: 'choice', diff: 2,
        question: String.raw`下列集合中，是 $\mathbb{R}$ 中<strong>紧致</strong>集（由 Heine–Borel：有界且闭）的是？`,
        options: [String.raw`$(0, 1)$`, String.raw`$[0, +\infty)$`, String.raw`$(-\infty, 1]$`, String.raw`$[0, 1]$`],
        answer: 3,
        solution: String.raw`<p><span class="step-tag">Step 1</span>Heine–Borel 判据 = 有界 + 闭，两项都要过。</p><p><span class="step-tag">Step 2</span>逐项检验：$(0,1)$——有界 ✓，闭 ✗（聚点 0、1 漏在外面）→ 不紧；$[0, +\infty)$——闭 ✓，有界 ✗（无上界）→ 不紧；$(-\infty, 1]$——闭 ✓，有界 ✗ → 不紧；$[0,1]$——有界 ✓ 且闭 ✓ → <strong>紧致</strong>。</p><p><span class="step-tag">直觉</span>紧致集必须「两头都锁死」：既不能漏极限（闭性），也不能无限延伸（有界性）。$[0,1]$ 是数轴上「完全封闭的保险箱」——下一章将看到，正因如此，连续函数在它身上才被逼出有界性、最值与一致连续。</p>` },
      { id: 'tp-ex4', type: 'choice', diff: 3,
        question: String.raw`设 $S = \left\{\dfrac{1}{n} : n \in \mathbb{N}\right\}$。下列说法正确的是？`,
        options: [String.raw`$0$ 是 $S$ 的聚点，且每个 $\dfrac{1}{n}$ 都是孤立点；$S$ 本身不闭`, String.raw`$0$ 不是 $S$ 的聚点，因为 $0 \notin S$`, String.raw`$S$ 的聚点有无穷多个`, String.raw`每个 $\dfrac{1}{n}$ 都是 $S$ 的聚点`],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>$0$ 是聚点：任何 $r > 0$，取 $n > \frac{1}{r}$，则 $\frac{1}{n} \in (0, r) \setminus \{0\}$——去心邻域内总有 $S$ 的点。<strong>聚点不必属于集合</strong>（B 选项的错误正在于此）。</p><p><span class="step-tag">Step 2</span>每个 $\frac{1}{k}$ 是孤立点：相邻点间距 $\frac{1}{k} - \frac{1}{k+1} = \frac{1}{k(k+1)}$ 是正数，取半径更小的邻域即可把其他点排除在门外。孤立点不是聚点（D 错）。</p><p><span class="step-tag">Step 3</span>聚点只有 $0$ 一个（C 错），但 $0 \notin S$，故 $S$ 不包含全部聚点，$S$ <strong>不闭</strong>。补上 $0$ 得 $\{0\} \cup S$，才是闭集（从而有界闭，紧致）。</p><p><span class="step-tag">图景</span>想象一串珠子 $1, \frac{1}{2}, \frac{1}{3}, \ldots$ 向 $0$ 堆积：每颗珠子孤零零（孤立点），但它们「挤」出的那个极限位置 0 才是唯一的聚点——<strong>无限个孤立点可以只共享一个聚点</strong>。</p>` }
    ]
  },

  /* ---------------- 第 3 章 ---------------- */
  {
    id: 'sequences',
    title: '序列：ε-N 与 Cauchy 判别法',
    intro: '「数列看起来收敛」不是证明。这一章把收敛锻造成 ε-N 语言，并揭示它与完备性、紧致性的深层血缘。',
    princeton: 'MAT 215 · Rudin 第 3 章',
    sections: [
      { type: 'text', title: '收敛的精确定义', body: String.raw`<p>数列 $a_n$ <strong>收敛</strong>于 $L$，记 $a_n \to L$，是指：</p>$$\text{对任何 } \varepsilon > 0,\ \text{存在 } N \in \mathbb{N},\ \text{使 } n > N \Rightarrow |a_n - L| < \varepsilon$$<p>这是一场<strong>攻防博弈</strong>：挑战者先出 $\varepsilon$（任意小），你必须亮出 $N$（可以很大），使 $N$ 之后的所有项都落进区间 $(L - \varepsilon, L + \varepsilon)$。<strong>注意顺序</strong>：$N$ 可以依赖 $\varepsilon$，但必须在 $\varepsilon$ 给定后一次性选定——「之后再变小的项」没有资格参赛。</p><p>定义的威力在于它<strong>只谈距离，不谈趋势</strong>。「越来越大」「越来越接近」这些模糊说法被彻底逐出证明。发散 $= $ 不收敛：例如 $(-1)^n$，挑战者只需出 $\varepsilon = \frac{1}{2}$，无论 $N$ 多大，$N$ 之后总有 $+1$ 与 $-1$ 两项，它们到任何候选极限 $L$ 的距离之和为 2，必有其一 $\geq 1 > \varepsilon$。</p>` },
      { type: 'viz', id: 'epsN' },
      { type: 'definition', title: 'Cauchy 列：不看靶子看弹孔', pu: 'Rudin 定义 3.8', body: String.raw`<p>数列 $\{a_n\}$ 是 <strong>Cauchy 列</strong>，如果</p>$$\text{对任何 } \varepsilon > 0,\ \text{存在 } N,\ \text{使 } m, n > N \Rightarrow |a_m - a_n| < \varepsilon$$<p>妙处：<strong>不提极限 $L$</strong>。收敛定义问「弹着点离靶心多近」，Cauchy 定义只问「弹孔之间彼此多近」——靶心（极限）甚至可以尚未存在。</p><p>收敛列必是 Cauchy 列（由三角不等式立即得到）。而<strong>逆命题在 $\mathbb{R}$ 中成立</strong>：</p>$$\{a_n\} \text{ 收敛} \Leftrightarrow \{a_n\} \text{ 是 Cauchy 列}$$<p>这个等价绝非显然——它又一次是完备性公理在买单：Cauchy 列「本该收敛到一个靶心」，若靶心缺失（$\mathbb{Q}$ 的裂缝），弹孔再密集也无处安放（$\mathbb{Q}$ 中的 Cauchy 列可以在 $\mathbb{Q}$ 中不收敛，如 $\sqrt{2}$ 的近似列）。<strong>「完备」的又一个名字，就是「Cauchy 列皆收敛」</strong>。</p>` },
      { type: 'theorem', title: '三大定理的关系网', pu: 'Rudin 定理 3.11、3.14、3.17', body: String.raw`<ol class="nice"><li><strong>单调有界定理</strong>（Rudin 3.14）：单调有界列必收敛——完备性公理的直接推论（第 1 章已证）。</li><li><strong>Bolzano–Weierstrass 定理</strong>（Rudin 3.6 + 2.42 路线）：$\mathbb{R}$ 中任何<strong>有界</strong>数列都有收敛<strong>子列</strong>。证明骨架：有界 → 关进紧集 $[-M, M]$ → 逐次二分，每次保留含无穷多项的一半 → 套出单调收敛的子列。</li><li><strong>Cauchy 判别法</strong>（Rudin 3.11）：Cauchy $\Leftrightarrow$ 收敛。证明骨架：Cauchy 列有界（取 $\varepsilon = 1$ 知 $N$ 后的项挤在一起，前面只有有限项）→ Bolzano–Weierstrass 抽出收敛子列 $a_{n_k} \to L$ → Cauchy 性把整列拖向 $L$。</li></ol><p><strong>依赖链</strong>：完备性公理 → 单调有界 / B–W → Cauchy 判别法。三个定理是同一块基石（数轴无裂缝）的三张面孔。判断具体数列收敛时：<strong>递推式</strong>优先单调有界；<strong>只知道项间距离</strong>（如部分和序列）优先 Cauchy；<strong>有界但行为混乱</strong>的序列只能指望子列（B–W）。</p>` },
      { type: 'example', title: '例题 · 递推数列求极限（牛顿迭代）', body: String.raw`<p><strong>问题：</strong>设 $a_1 = 2$，$a_{n+1} = \dfrac{1}{2}\left(a_n + \dfrac{2}{a_n}\right)$（求 $\sqrt{2}$ 的牛顿迭代）。证明 $\{a_n\}$ 收敛并求极限。</p><p><strong>解：</strong>（1）<strong>有下界</strong>：由 AM–GM，$a_{n+1} = \frac{1}{2}\left(a_n + \frac{2}{a_n}\right) \geq \sqrt{a_n \cdot \frac{2}{a_n}} = \sqrt{2}$（$n \geq 2$ 起）。</p><p>（2）<strong>单调递减</strong>（$n \geq 2$）：$a_{n+1} - a_n = \frac{1}{2}\left(\frac{2}{a_n} - a_n\right) = \frac{2 - a_n^2}{2a_n} \leq 0$，因为 $a_n \geq \sqrt{2} \Rightarrow a_n^2 \geq 2$。</p><p>（3）由<strong>单调有界定理</strong>，$a_n \to L$ 存在。对递推式两边取极限（极限的代数性质）：$L = \frac{1}{2}\left(L + \frac{2}{L}\right) \Rightarrow 2L^2 = L^2 + 2 \Rightarrow L^2 = 2 \Rightarrow L = \sqrt{2}$（舍去 $-\sqrt{2}$，因 $a_n \geq \sqrt{2} &gt; 0$）。</p><p><span class="muted">流程示范了标准三步：证有界 → 证单调 → 极限代入递推式解方程。第（3）步「两边取极限」的合法性由收敛列的代数运算定理保证（Rudin 3.3）。</span></p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      'ε-N 定义是攻防博弈：挑战者出 $\\varepsilon$，你出 $N$，$N$ 之后全部项入带',
      'Cauchy 列只看项间距离不看极限；在 $\\mathbb{R}$ 中 Cauchy $\\Leftrightarrow$ 收敛（完备性又一面孔）',
      'Bolzano–Weierstrass：有界数列必有收敛子列（二分法）',
      '递推数列求极限三步：有界 → 单调 → 极限代入递推式',
      '$(-1)^n$ 发散：$\\varepsilon=\\frac{1}{2}$ 即可击溃一切 $N$'
    ],
    exercises: [
      { id: 'sq-ex1', type: 'choice', diff: 1,
        question: String.raw`用 Cauchy 判别法证明 $a_n = (-1)^n$ 发散时，论证「对任何 $N$，总存在 $m, n > N$ 使 $|a_m - a_n| \geq \varepsilon$」应选取的 $\varepsilon$ 及理由是？`,
        options: [String.raw`$\varepsilon = 3$，因为相邻两项之差为 2`, String.raw`$\varepsilon = 0.1$，只需检查前 10 项`, String.raw`$\varepsilon = 1$：取相邻的偶奇下标 $m = 2k, n = 2k+1$，则 $|a_m - a_n| = 2 \geq 1$ 对无穷多对成立`, String.raw`任何 $\varepsilon$ 都无法说明发散`],
        answer: 2,
        solution: String.raw`<p><span class="step-tag">Step 1</span>策略：Cauchy 列要求「$N$ 之后任意两项靠得很近」；要击溃它，只需展示 $N$ 之后<strong>始终存在</strong>靠得不近的一对。</p><p><span class="step-tag">Step 2</span>取 $\varepsilon = 1$（任何 $< 2$ 的正数都行）。对任何 $N$，选 $m = 2k, n = 2k + 1$（$2k > N$）：$|a_m - a_n| = |1 - (-1)| = 2 \geq \varepsilon$。故非 Cauchy，从而发散。</p><p><span class="step-tag">易错点</span>A 选项的 $\varepsilon = 3$ 无效——$|a_m - a_n| = 2 < 3$，根本达不到 $\varepsilon$；B 选项错在 Cauchy 条件关乎「$N$ 之后的一切项对」，与前 10 项无关。取 $\varepsilon$ 必须<strong>小于等于</strong>那个恒可达到的距离 2。</p>` },
      { id: 'sq-ex2', type: 'choice', diff: 2,
        question: String.raw`设 $a_1 = 2$，$a_{n+1} = \dfrac{1}{2}\left(a_n + \dfrac{2}{a_n}\right)$。若已证 $a_n$ 收敛于 $L$，则 $L = $ ？`,
        options: [String.raw`$\sqrt{2}$`, String.raw`$1$`, String.raw`$2$`, String.raw`不存在（数列振荡）`],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>递推式两边取极限（收敛列的代数性质，且 $L \neq 0$ 因 $a_n \geq \sqrt{2} > 0$）：</p><p>$$L = \frac{1}{2}\left(L + \frac{2}{L}\right)$$</p><p><span class="step-tag">Step 2</span>解方程：两边乘 $2L$：$2L^2 = L^2 + 2$，故 $L^2 = 2$，$L = \pm\sqrt{2}$。</p><p><span class="step-tag">Step 3</span>舍负根：由 AM–GM，$a_{n+1} \geq \sqrt{2}$（$n \geq 2$），故 $L \geq \sqrt{2}$，取 $L = \sqrt{2}$。</p><p><span class="step-tag">注意</span>「两边取极限」的前提是<strong>先证收敛</strong>——不能对发散数列的递推式取极限（否则会「解出」荒谬结果）。这正是例题三步流程（有界 → 单调 → 代入）的顺序不可颠倒的原因。</p>` },
      { id: 'sq-ex3', type: 'choice', diff: 2,
        question: String.raw`下列条件中，<strong>足以保证</strong>实数列 $\{a_n\}$ 收敛的是？`,
        options: [String.raw`$\{a_n\}$ 有界但不单调`, String.raw`$\{a_n\}$ 单调递增且有上界`, String.raw`$\{a_n\}$ 单调递增（无上界限制）`, String.raw`$|a_n| < 1$ 对一切 $n$ 成立`],
        answer: 1,
        solution: String.raw`<p><span class="step-tag">Step 1</span>定理召唤：单调有界定理——单调递增 + 有上界 $\Rightarrow$ 收敛。B 选项正是定理本身 ✓。</p><p><span class="step-tag">Step 2</span>排除项：A「有界不单调」不够——$a_n = (-1)^n$ 有界却发散（Bolzano–Weierstrass 只保证有<strong>收敛子列</strong>，不保证整列收敛）；C 缺上界——$a_n = n$ 单调递增却趋于 $+\infty$；D 即有界性 $|a_n| < 1$，同 A 的反例。</p><p><span class="step-tag">结构</span>单调 + 有界，两个条件缺一不可：单调性保证「不再回头」（极限至多一个方向逼近），有界性保证「有处可停」（候选极限集合非空有界，sup 存在——完备性公理入场）。这正是第 1 章证明的用武之地。</p>` },
      { id: 'sq-ex4', type: 'numeric', diff: 3, answer: 598, tolerance: 1,
        question: String.raw`设 $a_n = \dfrac{3n}{n+2} \to 3$。若取 $\varepsilon = 0.01$，则定义中所需的最小 $N$（使 $n > N$ 时 $|a_n - 3| < \varepsilon$）是？<em>（填数值）</em>`,
        solution: String.raw`<p><span class="step-tag">Step 1</span>化简误差：$\left|\frac{3n}{n+2} - 3\right| = \left|\frac{3n - 3(n+2)}{n+2}\right| = \frac{6}{n+2}$。</p><p><span class="step-tag">Step 2</span>解不等式：$\frac{6}{n+2} < 0.01 \Leftrightarrow n + 2 > 600 \Leftrightarrow n > 598$。</p><p><span class="step-tag">Step 3</span>故取 $N = 598$：当 $n > 598$（即 $n \geq 599$）时误差小于 0.01。验证：$a_{599} = \frac{1797}{601} \approx 2.99002$，误差 $\approx 0.00998 < 0.01$ ✓。</p><p><span class="step-tag">体会</span>把 $\varepsilon$ 减半到 0.005，$N$ 就翻倍到 1198——$N(\varepsilon)$ 的增长速度刻画了收敛的「快慢」。分式型数列 $N \sim \frac{C}{\varepsilon}$（线性），收敛速度温和；几何型数列 $N \sim \log\frac{1}{\varepsilon}$，收敛飞快。</p>` }
    ]
  },

  /* ---------------- 第 4 章 ---------------- */
  {
    id: 'continuity',
    title: '连续性的严格理论',
    intro: '「不断裂」只是绘画语言。ε-δ 定义加上紧致性，将闭区间上的连续函数锻造成分析学中最坚固的一类对象。',
    princeton: 'MAT 215 · Rudin 第 4 章',
    sections: [
      { type: 'definition', title: 'ε-δ 连续', pu: 'Rudin 定义 4.5', body: String.raw`<p>$f$ 在 $x_0$ 处<strong>连续</strong>：</p>$$\text{对任何 } \varepsilon > 0,\ \text{存在 } \delta > 0,\ \text{使 } |x - x_0| < \delta \Rightarrow |f(x) - f(x_0)| < \varepsilon$$<p>与极限定义的唯一区别：极限 $L$ 换成了 $f(x_0)$ 本身——连续 = <strong>极限值等于函数值</strong>。序列语言版本：$x_n \to x_0 \Rightarrow f(x_n) \to f(x_0)$（任何趋于 $x_0$ 的序列，其像都趋于 $f(x_0)$）。</p><p>定义中 $\delta$ 依赖两点：$\varepsilon$ <strong>和点 $x_0$</strong>。若同一个 $\varepsilon$ 在区间上可以找到<strong>全区间通用</strong>的 $\delta$，就叫<strong>一致连续</strong>（稍后）。$\delta$ 对点的依赖，正是「每点各自为政」与「全区队形统一」的分野——它将决定两条最重要的定理边界。</p>` },
      { type: 'text', title: '间断点的分类', body: String.raw`<p>连续性失败的姿势分三型，全都可在极限语言下精确刻画：</p><ul class="nice"><li><strong>第一型（可去）</strong>：$\lim_{x \to x_0} f(x)$ 存在但 $\neq f(x_0)$（或 $f(x_0)$ 无定义）。典型：$\frac{\sin x}{x}$ 在 $x = 0$。修补：重新定义 $f(x_0) = \lim$ 即连续。</li><li><strong>第二型（跳跃）</strong>：左右极限都存在但不相等。典型：符号函数 $\text{sgn}$ 在 $x = 0$（左极限 $-1$，右极限 $+1$）。</li><li><strong>第三型（本性）</strong>：左右极限至少一个不存在。典型：$\sin\frac{1}{x}$ 在 $x = 0$（无限振荡）；Dirichlet 函数处处第三型。</li></ul><p>可去间断最「温和」——重定义一个点即可修复；跳跃间断无法修复但左右仍可控；本性间断则彻底失控。这个分类在傅里叶级数理论（第四部）中决定级数在间断点的收敛值（取左右极限的平均）。</p>` },
      { type: 'viz', id: 'ivtBisect' },
      { type: 'theorem', title: '闭区间上连续函数的三大定理', pu: 'Rudin 定理 4.23（IVT）、4.16 系列', body: String.raw`<ol class="nice"><li><strong>介值定理（IVT）</strong>：$f \in C[a,b]$，$f(a) &lt; c &lt; f(b)$，则存在 $x \in (a,b)$ 使 $f(x) = c$。证明骨架：二分法——每次保留端点函数值跨越 $c$ 的一半区间，区间长度 $\to 0$，套出嵌套闭区间，公共点即解。图像上：连续曲线从 $f(a)$ 走到 $f(b)$ 必须路过中间每一层。</li><li><strong>最值定理（EVT）</strong>：$f \in C[a,b]$，则 $f$ 在 $[a,b]$ 上<strong>有界</strong>且<strong>取到最大值与最小值</strong>。证明骨架：反设有界不成立 → 存在 $x_n$ 使 $|f(x_n)| \to \infty$ → Bolzano–Weierstrass 抽收敛子列 $x_{n_k} \to x^* \in [a,b]$（紧致性入场！）→ 连续性逼 $f(x_{n_k}) \to f(x^*)$ 有限——矛盾。</li><li><strong>Cantor 定理（一致连续）</strong>：$f \in C[a,b] \Rightarrow f$ 一致连续。证明骨架：反设不一致连续 → 存在 $\varepsilon_0$ 与点对 $x_n, y_n$，$|x_n - y_n| \to 0$ 但 $|f(x_n) - f(y_n)| \geq \varepsilon_0$ → B–W 抽 $x_{n_k} \to x^*$，则 $y_{n_k} \to x^*$ → 连续性给出两个矛盾极限。</li></ol><p><strong>三条证明共用同一台发动机：紧致性</strong>（Bolzano–Weierstrass / 嵌套区间）。把 $[a,b]$ 换成 $(a,b)$ 或 $[a, +\infty)$，三条定理全部失效（反例见练习）——闭性与有界性不是技术假设，而是灵魂。</p>` },
      { type: 'example', title: '例题 · 一致连续 vs 逐点连续', body: String.raw`<p><strong>问题：</strong>证明 $f(x) = \dfrac{1}{x}$ 在 $(0, 1)$ 上连续，但<strong>不</strong>一致连续。</p><p><strong>解：</strong>（1）<strong>逐点连续</strong>：固定 $x_0 \in (0,1)$，$f$ 在 $x_0$ 附近有定义且是初等函数（商、倒数），由连续函数的代数性质，$x_0 \neq 0$ 处连续。</p><p>（2）<strong>不一致连续</strong>：取 $\varepsilon_0 = \frac{1}{2}$。构造点对逼近 0：令 $x_n = \frac{1}{n}, y_n = \frac{1}{n + 1}$，则 $|x_n - y_n| = \frac{1}{n(n+1)} \to 0$，但</p><p>$$|f(x_n) - f(y_n)| = |n - (n+1)| = 1 \geq \varepsilon_0 \qquad \text{对一切 } n$$</p><p>两点的 $x$ 距离任意近、函数值距离却恒为 1——「全区通用 $\delta$」不可能存在。病根：$f$ 在靠近 $0$ 处越来越陡（斜率 $\frac{1}{x^2} \to \infty$），逐点连续允许每个点各配各的 $\delta$，一致连续则要求全区一个 $\delta$。<strong>开区间的边界失守，正是不一致连续的温床</strong>（对照 Cantor 定理：闭区间上不可能发生）。</p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      '连续 = 极限值等于函数值；序列刻画：$x_n\\to x_0 \\Rightarrow f(x_n)\\to f(x_0)$',
      '间断三型：可去（补点即愈）/ 跳跃（左右极限不等）/ 本性（极限不存在）',
      'IVT（二分法）、EVT、Cantor（一致连续）共用发动机：紧致性（B–W）',
      '一致连续：$\\delta$ 只依赖 $\\varepsilon$ 不依赖点；$1/x$ 在 $(0,1)$ 是标准反例',
      '闭区间的「闭 + 有界」是三大定理的灵魂，缺一即失效'
    ],
    exercises: [
      { id: 'c-ex1', type: 'choice', diff: 2,
        question: String.raw`为使 $f(x) = \dfrac{\sin x}{x}$ 在 $x = 0$ 处连续，应补充定义 $f(0) = $ ？`,
        options: [String.raw`$1$`, String.raw`$0$`, String.raw`无法补充——$f$ 在 $0$ 处是本性间断`, String.raw`$\pi$`],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>这是<strong>可去间断</strong>的教科书案例：$\lim_{x \to 0}\frac{\sin x}{x}$ 存在（两个经典极限之一），只是 $x = 0$ 处原式无定义。</p><p><span class="step-tag">Step 2</span>极限值：由几何不等式 $\cos x < \frac{\sin x}{x} < 1$（$0 < |x| < \frac{\pi}{2}$，弧度制）与夹逼定理，$\lim_{x \to 0}\frac{\sin x}{x} = 1$。</p><p><span class="step-tag">Step 3</span>补充定义 $f(0) = 1 = \lim_{x \to 0} f(x)$，连续性定义「极限值 = 函数值」即告满足。可去间断的名字正源于此：<strong>补一个点就痊愈</strong>。</p><p><span class="step-tag">几何图像</span>补全后的曲线在原点处的高度是 1——曲线从两侧压向 $(0, 1)$ 这个「空位」，把它填上就是一条光滑曲线。</p>` },
      { id: 'c-ex2', type: 'choice', diff: 2,
        question: String.raw`设 $f \in C[0, 1]$（闭区间上连续），$f(0) = -1$，$f(1) = 3$。由介值定理<strong>可以断言</strong>存在 $c \in (0,1)$ 使 $f(c)$ 等于下列哪个值？`,
        options: [String.raw`$4$`, String.raw`$-2$`, String.raw`$\sqrt{2}$（任何介于 $-1$ 与 $3$ 之间的值）`, String.raw`只能断言 $f(c) = 0$`],
        answer: 2,
        solution: String.raw`<p><span class="step-tag">Step 1</span>IVT 的完整力量：连续函数在 $[0,1]$ 上扫过 $f(0) = -1$ 到 $f(1) = 3$ 的<strong>整条值域走廊</strong>——任何满足 $-1 &lt; c &lt; 3$ 的目标值都被路过。$\sqrt{2} \approx 1.414$ 落在走廊内 ✓。</p><p><span class="step-tag">Step 2</span>排除项：$4 > 3$ 与 $-2 < -1$ 都在走廊之外——IVT 对走廊外的值没有任何承诺（如 $f(x) = 4x - 1$ 就恰好取不到 4）。D 选项把 IVT 弱化成零点定理（目标值 0）——只断言 0 虽然没错，但远未用尽定理的威力。</p><p><span class="step-tag">图像直觉</span>闭区间上的连续曲线是一支「不离场的笔」：从高度 $-1$ 画到高度 $3$，中间每一层水平线都至少被划过一次。<strong>闭区间</strong>保证了笔不离场（端点在编），<strong>连续</strong>保证了笔不离纸（无跳跃）。</p>` },
      { id: 'c-ex3', type: 'choice', diff: 3,
        question: String.raw`设 $f(x) = x$ 在 $(0, 1)$ 上。下列断言中<strong>错误</strong>的是？`,
        options: [String.raw`$f$ 在 $(0, 1)$ 上连续`, String.raw`$f$ 在 $(0, 1)$ 上有界`, String.raw`$f$ 在 $(0, 1)$ 上取到最大值`, String.raw`$f$ 在 $[0.1, 0.9]$ 上取到最大值`],
        answer: 2,
        solution: String.raw`<p><span class="step-tag">Step 1</span>找错误断言：$\sup_{(0,1)} f = 1$，但 $x &lt; 1$ 对一切 $x \in (0,1)$ 成立——上确界取不到，<strong>无最大值</strong>。C 断言有最大值，错误 ✓（这就是本题答案）。</p><p><span class="step-tag">Step 2</span>验证其余：A——恒等函数处处连续 ✓；B——$0 &lt; f(x) &lt; 1$，有界 ✓（注意「有界」与「取到界」是两回事）；D——$[0.1, 0.9]$ 是闭区间，EVT 保证 $f$ 取到最大值 $0.9$ ✓。</p><p><span class="step-tag">教训</span>把 EVT 的闭区间偷偷换成开区间，定理立即失效。同样地，$f(x) = x$ 在 $(0,1)$ 也取不到最小值（$\inf = 0 \notin$ 值域）。<strong>开区间只承诺有界性可能成立，从不承诺最值存在</strong>——这是「聚点漏在外面」的直接代价（$0, 1$ 都是 $(0,1)$ 的聚点却不属于它）。</p>` },
      { id: 'c-ex4', type: 'choice', diff: 3,
        question: String.raw`下列函数在给定集上<strong>一致连续</strong>的是？`,
        options: [String.raw`$f(x) = x^2$，$x \in \mathbb{R}$`, String.raw`$f(x) = \dfrac{1}{x}$，$x \in (0, 1)$`, String.raw`$f(x) = \sin\dfrac{1}{x}$，$x \in (0, 1)$`, String.raw`$f(x) = \sqrt{x}$，$x \in [0, +\infty)$`],
        answer: 3,
        solution: String.raw`<p><span class="step-tag">Step 1</span>逐项检查：A——$x^2$ 在 $\mathbb{R}$ 上不一致连续：取 $x_n = n, y_n = n + \frac{1}{n}$，$|x_n - y_n| \to 0$ 但 $|x_n^2 - y_n^2| = 2 + \frac{1}{n^2} \to 2$。斜率 $2x$ 无界，越远越陡。</p><p><span class="step-tag">Step 2</span>B——例题已证（$x_n = \frac{1}{n}, y_n = \frac{1}{n+1}$，函数值差恒 1）；C——$\sin\frac{1}{x}$ 靠近 0 处无限振荡，取 $x_n = \frac{1}{2n\pi + \pi/2}, y_n = \frac{1}{2n\pi}$，$x$ 距离 $\to 0$ 而函数值差恒为 1。B、C 都败在<strong>开区间边界失守</strong>。</p><p><span class="step-tag">Step 3</span>D——$\sqrt{x}$ 在 $[0, +\infty)$ 一致连续 ✓：由 $|\sqrt{x} - \sqrt{y}| \leq \sqrt{|x - y|}$（因 $|\sqrt{x} - \sqrt{y}|^2 \leq |x - y|$——两者同号，平方差不小于差的绝对值），任取 $\delta = \varepsilon^2$ 即可。虽然导数 $\frac{1}{2\sqrt{x}}$ 在 0 处无界（Cantor 定理不能直接用——区间不闭），函数本身却足够「平坦地陡」：0 附近的陡峭是 $\sqrt{\cdot}$ 型的温和陡峭，Hölder $\frac{1}{2}$ 连续性足以拯救一致连续。</p><p><span class="step-tag">结论</span>一致连续的杀手不是「导数无界」本身，而是「越来越陡的点对」（$|x - y| \to 0$ 而函数值差有下界）。$\sqrt{x}$ 在 0 处陡，但对固定的小 $\delta$，最陡处函数值差 $\sqrt{\delta} \to 0$——可控。</p>` }
    ]
  },

  /* ---------------- 第 5 章 ---------------- */
  {
    id: 'uniform',
    title: '一致收敛：函数序列的秩序',
    intro: '逐点收敛的极限函数可以丢失连续性、可以抗拒积分。一致收敛是施加给函数序列的纪律——它保全一切。',
    princeton: 'MAT 215 · Rudin 第 7 章',
    sections: [
      { type: 'text', title: '逐点收敛的陷阱', body: String.raw`<p>函数序列 $f_n$ <strong>逐点收敛</strong>于 $f$：对每个固定的 $x$，$f_n(x) \to f(x)$。看起来无害，但极限函数可以变得<strong>面目全非</strong>：</p><p>经典反例：$f_n(x) = x^n$ 在 $[0, 1]$ 上。每个 $f_n$ 都是光滑多项式，然而</p>$$f(x) = \lim_{n \to \infty} x^n = 0 \quad (0 \leq x &lt; 1), \qquad f(1) = 1$$<p>一整列连续函数，极限却在 $x = 1$ 处<strong>断裂</strong>。「连续性」在逐点极限下不能保全——微积分默认的「先取极限再求积分 / 先积分再取极限，两个顺序答案一样」从此全面失守。</p>` },
      { type: 'definition', title: '一致收敛与 sup 判别法', pu: 'Rudin 定义 7.7 与 7.9', body: String.raw`<p>$f_n$ <strong>一致收敛</strong>于 $f$（记 $f_n ⇉ f$）：</p>$$\sup_{x \in E}\ |f_n(x) - f(x)| \to 0 \qquad (n \to \infty)$$<p>逐点收敛是「每个点各自过关」；一致收敛是「全区同步过关」——收敛速度不再因点而异。ε-N 语言：对任何 $\varepsilon &gt; 0$，存在<strong>全区间通用</strong>的 $N$，使 $n &gt; N$ 时<strong>一切</strong> $x$ 同时满足 $|f_n(x) - f(x)| &lt; \varepsilon$。</p><p>与第 4 章的呼应：逐点/一致之别，正是连续/一致连续之别的<strong>序列版翻版</strong>——都是「各点各自为政」与「全区队形统一」的对立。检验口诀：<strong>找 sup</strong>。$\sup |f_n - f|$ 趋于 0 则一致；sup 不趋于 0（哪怕每点都收敛）则不一致。$x^n$ 的 sup 判别：$\sup_{[0,1]} |x^n - f(x)| = \sup_{[0,1)} x^n = 1$，恒为 1——收敛速度在 $x$ 靠近 1 处无限恶化，不一致。</p>` },
      { type: 'viz', id: 'uniformConv' },
      { type: 'theorem', title: '一致收敛保全的三件财产', pu: 'Rudin 定理 7.9、7.16、7.17', body: String.raw`<ol class="nice"><li><strong>保全连续性</strong>（Rudin 7.9）：每个 $f_n \in C[a,b]$ 且 $f_n ⇉ f$，则 $f \in C[a,b]$。证明只用了两次「交换极限」：$f(x_0) = \lim_n \lim_x f_n(x) = \lim_x \lim_n f_n(x)$——一致性保证第二个交换合法。逆否命题是快速的判别工具：<strong>极限函数不连续 ⇒ 收敛必不一致</strong>（$x^n$ 一眼看穿）。</li><li><strong>保全积分</strong>（Rudin 7.16）：$f_n ⇉ f$ 于 $[a,b]$，各 $f_n$ 可积，则 $f$ 可积且 $\lim_n \int_a^b f_n\,dx = \int_a^b f\,dx$——<strong>极限与积分号交换</strong>。证明骨架：$\left|\int f_n - \int f\right| \leq \int |f_n - f| \leq (b-a) \cdot \sup|f_n - f| \to 0$。sup 小，全区都小，乘区间长仍然小。</li><li><strong>保全导数（有条件）</strong>（Rudin 7.17）：若 $f_n' ⇉ g$ 且<strong>仅在一点</strong> $f_n(x_0) \to f(x_0)$，则 $f_n ⇉$ 某个 $f$ 且 $f' = g$。注意条件施加在 <strong>$f_n'$</strong> 上而非 $f_n$——导数序列的一致性才是关键。</li></ol><p><strong>Weierstrass M-判别法</strong>（级数版快速通道）：若 $|f_n(x)| \leq M_n$ 对一切 $x$，且 $\sum M_n &lt; \infty$，则 $\sum f_n$ 一致（且绝对）收敛。例：$\sum \frac{\sin nx}{n^2}$，取 $M_n = \frac{1}{n^2}$，$\sum \frac{1}{n^2}$ 收敛 ⇒ 一致收敛。</p>` },
      { type: 'text', title: '反例博物馆：尖峰函数', body: String.raw`<p>逐点收敛 + 积分交换失败的最经典构造是<strong>尖峰函数</strong>：$f_n(x) = n x e^{-n x^2}$ 于 $[0, 1]$。</p><p>（1）<strong>逐点收敛于 0</strong>：固定 $x &gt; 0$，指数压倒多项式（$e^{nx^2}$ 的增长远快于 $n$），$f_n(x) \to 0$；$x = 0$ 处恒为 0。故极限函数 $f \equiv 0$，$\int_0^1 f = 0$。</p><p>（2）<strong>但积分不收敛于 0</strong>：换元 $u = n x^2$，</p>$$\int_0^1 n x e^{-n x^2}\,dx = \frac{1}{2}\int_0^n e^{-u}\,du = \frac{1 - e^{-n}}{2} \to \frac{1}{2}$$<p>极限与积分交换失败：$\lim_n \int f_n = \frac{1}{2} \neq 0 = \int \lim_n f_n$。病根可视化：$f_n$ 是一座<strong>越来越高、越来越窄</strong>的尖峰（峰值 $\approx \sqrt{n/2e}$ 在 $x = \frac{1}{\sqrt{2n}}$ 处），逐点收敛「逐个点杀死」峰身，但峰的高度增长快于宽度的坍缩——面积（积分）逃过了逐点收敛的绞杀。sup 判别印证：$\sup |f_n - 0| = \sup f_n \approx \sqrt{\frac{n}{2e}} \to \infty$，远非趋于 0，不一致收敛。</p><p><strong>一句话总结本 章</strong>：逐点收敛只保证「每个点最终到达」，不保证「队形」；一切交换（极限×极限、极限×积分、极限×导数）的合法性，都要用<strong>一致</strong>性来赎买。</p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      '逐点收敛 = 每点各自过关；$x^n$ 在 $[0,1]$ 的极限在 $x=1$ 断裂',
      '一致收敛 $\\Leftrightarrow \\sup_E|f_n-f|\\to 0$；判别口诀：先求 sup',
      '一致收敛保全：连续性、可积性、（$f_n\'$ 一致时）可导性',
      'M-判别法：$|f_n|\\leq M_n$ 且 $\\sum M_n<\\infty$ $\\Rightarrow$ $\\sum f_n$ 一致收敛',
      '尖峰函数 $nxe^{-nx^2}$：逐点 $\\to 0$ 但 $\\int\\to\\frac{1}{2}$——交换需一致性赎买'
    ],
    exercises: [
      { id: 'u-ex1', type: 'choice', diff: 2,
        question: String.raw`设 $f_n(x) = x^n$ 于 $[0, 1]$。关于其逐点极限 $f$ 与收敛方式，正确的是？`,
        options: [String.raw`$f(1) = 1$，$f$ 在 $x = 1$ 处间断，故收敛不可能一致`, String.raw`$f(1) = 0$，$f$ 在 $[0,1]$ 上连续，收敛一致`, String.raw`$f(1) = 1$，$f$ 在 $[0,1]$ 上连续`, String.raw`逐点极限不存在`],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>逐点求极限：$0 \leq x &lt; 1$ 时 $x^n \to 0$（公比 $&lt; 1$ 的几何列）；$x = 1$ 时恒为 $1$。故 $f(1) = 1$，其余处为 0。</p><p><span class="step-tag">Step 2</span>$f$ 在 $x = 1$ 处间断：左极限 $\lim_{x \to 1^-} f(x) = 0 \neq 1 = f(1)$，跳跃间断（第二型）。</p><p><span class="step-tag">Step 3</span>由保全定理的逆否：每个 $f_n$ 连续，若收敛一致则极限必连续；今极限不连续，故<strong>收敛必不一致</strong>。sup 判别复核：$\sup_{[0,1)} x^n = 1 \to 1 \neq 0$ ✓。</p><p><span class="step-tag">图景</span>函数图像像一门「逐渐立起的风帆」：$[0, 1)$ 上压向 0，唯独 $x=1$ 附近永远翘到 1——收敛速度在边界处无限恶化，全区的 $N$ 永远配不出来。</p>` },
      { id: 'u-ex2', type: 'choice', diff: 2,
        question: String.raw`设 $f_n(x) = \dfrac{x}{n}$。关于 $f_n$ 在 $[0, 1]$ 上的收敛方式，正确的是？`,
        options: [String.raw`逐点收敛到 0，但 $\sup_{[0,1]}|f_n| = 1$，不一致`, String.raw`不逐点收敛`, String.raw`一致收敛到 0，因为 $\sup_{[0,1]}\left|\dfrac{x}{n}\right| = \dfrac{1}{n} \to 0$`, String.raw`只在 $x = 0$ 处收敛`],
        answer: 2,
        solution: String.raw`<p><span class="step-tag">Step 1</span>求 sup（$[0,1]$ 上 $\frac{x}{n}$ 的最大值在 $x = 1$ 处）：</p><p>$$\sup_{x \in [0,1]}\left|\frac{x}{n}\right| = \frac{1}{n} \to 0$$</p><p><span class="step-tag">Step 2</span>sup $\to 0$，故一致收敛于 0 ✓。A 选项的 sup 计算错误（$\frac{1}{n} \to 0$，不是 1）。</p><p><span class="step-tag">Step 3</span><strong>对比警示</strong>：同一列函数放在 $\mathbb{R}$ 上则惨败——$\sup_{x \in \mathbb{R}}\left|\frac{x}{n}\right| = \infty$，不一致收敛。<strong>一致性依赖于定义域</strong>：区间越「长」，同样的收敛越难一致。这与第 4 章 $x^2$ 在 $[0,1]$ 一致连续、在 $\mathbb{R}$ 上不一致连续是同一种「区域大小惩罚」。</p>` },
      { id: 'u-ex3', type: 'choice', diff: 3,
        question: String.raw`用 Weierstrass M-判别法判断 $\sum_{n=1}^{\infty} \dfrac{\sin nx}{n^2}$ 在 $\mathbb{R}$ 上的收敛性，正确结论与理由是？`,
        options: [String.raw`不一致收敛，因为 $\sin nx$ 剧烈振荡`, String.raw`无法判断，M-判别法只适用于非负函数`, String.raw`一致（且绝对）收敛：$\left|\dfrac{\sin nx}{n^2}\right| \leq \dfrac{1}{n^2}$ 对一切 $x$，而 $\sum \dfrac{1}{n^2} &lt; \infty$`, String.raw`只在 $x = 0$ 处收敛`],
        answer: 2,
        solution: String.raw`<p><span class="step-tag">Step 1</span>套 M-判别法的两个槽位：控制序列 $M_n$ 与收敛的数值级数 $\sum M_n$。</p><p><span class="step-tag">Step 2</span>对一切 $x \in \mathbb{R}$：$\left|\frac{\sin nx}{n^2}\right| \leq \frac{1}{n^2}$（正弦有界），取 $M_n = \frac{1}{n^2}$；而 $\sum \frac{1}{n^2} = \frac{\pi^2}{6} &lt; \infty$（Basel 问题）。</p><p><span class="step-tag">Step 3</span>两条件齐备，M-判别法宣判：级数在 $\mathbb{R}$ 上<strong>一致且绝对收敛</strong> ✓。由保全定理，和函数在 $\mathbb{R}$ 上连续。振荡（A）恰恰是 M-判别法「无视」的因素——只需绝对值的上界可控；M-判别法对带符号、带振荡的项一视同仁（B 错）。</p><p><span class="step-tag">延伸</span>这是第四部傅里叶级数的序章：$\sum \frac{\sin nx}{n^2}$ 正是锯齿波的傅里叶级数，一致收敛保证了它表示的函数连续。而方波级数 $\sum \frac{\sin nx}{n}$ 只在较弱意义下收敛（$\sum \frac{1}{n}$ 发散，M-判别法失效），吉布斯现象由此滋生。</p>` },
      { id: 'u-ex4', type: 'choice', diff: 3,
        question: String.raw`设 $f_n(x) = n x e^{-n x^2}$ 于 $[0, 1]$。已知 $f_n$ 逐点收敛于 $0$，则 $\lim_{n \to \infty}\int_0^1 f_n(x)\,dx = $ ？这个结果说明什么？`,
        options: [String.raw`$0$——极限与积分可以随意交换`, String.raw`$\infty$——积分发散`, String.raw`$\dfrac{1}{2}$——极限与积分交换失败，印证收敛不一致`, String.raw`结果依赖于 $x$ 的选取`],
        answer: 2,
        solution: String.raw`<p><span class="step-tag">Step 1</span>直接计算积分（换元 $u = nx^2$，$du = 2nx\,dx$）：</p><p>$$\int_0^1 nxe^{-nx^2}\,dx = \frac{1}{2}\int_0^{n} e^{-u}\,du = \frac{1 - e^{-n}}{2} \to \frac{1}{2}$$</p><p><span class="step-tag">Step 2</span>对照极限函数的积分：$f \equiv 0$，故 $\int_0^1 f\,dx = 0$。两个顺序给出 $\frac{1}{2}$ 与 $0$——<strong>极限与积分交换失败</strong>。</p><p><span class="step-tag">Step 3</span>由保全定理的逆否：若收敛一致，积分必可交换；今交换失败，故收敛<strong>不一致</strong>。sup 复核：尖峰在 $x = \frac{1}{\sqrt{2n}}$ 处高达 $\approx \sqrt{\frac{n}{2e}} \to \infty$，$\sup|f_n| \to \infty$，确实远非趋于 0。</p><p><span class="step-tag">图景</span>尖峰「高 $\times$ 宽」的面积恒定在 $\frac{1}{2}$ 附近：逐点收敛逐点消灭峰身，但「质量」早已在高度增长中转移——<strong>逐点视角看不见质量守恒，一致视角（sup）才看得见</strong>。这正是 Lebesgue 控制收敛定理要着手修复的现场（第四部）。</p>` }
    ]
  },

  /* ---------------- 第 6 章 ---------------- */
  {
    id: 'riemann-strict',
    title: '严格积分理论',
    intro: '微积分说「曲边梯形的面积天然存在」。分析学的回答：先定义面积，再证明它何时存在——Dirichlet 函数将见证边界。',
    princeton: 'MAT 215 · Rudin 第 6 章',
    sections: [
      { type: 'text', title: '从直观到划分', body: String.raw`<p>第二部用「无穷多个细矩形」直觉地引入了积分，但两个根本问题从未回答：<strong>面积凭什么存在？哪些函数有面积？</strong>严格化的策略是彻底放弃「无穷细」的想象，只用<strong>有限划分</strong>：</p><p>划分 $P: a = x_0 &lt; x_1 &lt; \cdots &lt; x_n = b$，在每个子区间 $[x_{k-1}, x_k]$ 上取 $f$ 的<strong>最大值 $M_k$</strong> 与<strong>最小值 $m_k$</strong>（先暂设它们存在——连续函数满足），定义 Darboux <strong>上和</strong>与<strong>下和</strong>：</p>$$U(P, f) = \sum_{k=1}^{n} M_k\,\Delta x_k, \qquad L(P, f) = \sum_{k=1}^{n} m_k\,\Delta x_k$$<p>几何：上和 = 包住曲线的最小阶梯，下和 = 被曲线包住的最大阶梯。<strong>一切子区间上都有 $L \leq U$</strong>，且「曲线下方的面积」如果存在，必须被夹在所有上和的最小值与所有下和的最大值之间。加细划分（插入新分点），上和只降不升、下和只升不降——两条阶梯从两侧相向逼近。</p>` },
      { type: 'definition', title: '可积的 Darboux 准则', pu: 'Rudin 定义 6.1 与定理 6.6', body: String.raw`<p><strong>上积分</strong> $\overline{\int_a^b} f = \inf_P U(P,f)$（所有上和的下确界），<strong>下积分</strong> $\underline{\int_a^b} f = \sup_P L(P,f)$。恒有 $\underline{\int} \leq \overline{\int}$。</p><p>$f$ <strong>Riemann 可积</strong>（$f \in ℛ$），如果两者相等，公共值记作 $\int_a^b f\,dx$。等价的 ε-判据：</p>$$f \in ℛ \Leftrightarrow \text{对任何 } \varepsilon > 0,\ \text{存在划分 } P \text{ 使 } U(P,f) - L(P,f) < \varepsilon$$<p><strong>核心量是「振荡」</strong>：$U - L = \sum_{k=1}^{n}\left(M_k - m_k\right)\Delta x_k$——各子区间上函数的起伏幅度 $\omega_k = M_k - m_k$ 乘以区间长再求和。<strong>可积 = 振荡可以被划分关进任意小的总面积里</strong>。这份准则把「面积存在」化为一个可以用不等式攻击的组合问题。</p>` },
      { type: 'viz', id: 'riemannSum' },
      { type: 'theorem', title: '谁可积：两条充分条件', pu: 'Rudin 定理 6.8 与 6.9', body: String.raw`<ol class="nice"><li><strong>连续 $\Rightarrow$ 可积</strong>（Rudin 6.8）。证明骨架：$f \in C[a,b] \Rightarrow$（Cantor 定理）$f$ 一致连续 $\Rightarrow$ 对给定 $\varepsilon$，存在 $\delta$ 使 $|x - y| &lt; \delta \Rightarrow |f(x) - f(y)| &lt; \frac{\varepsilon}{b-a} \Rightarrow$ 取网格 mesh $&lt; \delta$ 的划分，则每个 $\omega_k &lt; \frac{\varepsilon}{b-a}$，故 $U - L &lt; \frac{\varepsilon}{b-a}\sum\Delta x_k = \varepsilon$。∎ <strong>第 4 章的一致连续在这里精准派上用场</strong>——各区间的振荡被统一的 $\delta$ 压平。</li><li><strong>单调 $\Rightarrow$ 可积</strong>（Rudin 6.9）。证明骨架：设 $f$ 递增，均匀划分下 $\omega_k = f(x_k) - f(x_{k-1})$，故 $U - L = \frac{b-a}{n}\left[f(b) - f(a)\right] \to 0$—— telescoping 求和让总振荡 telescopes 到端点差。单调函数可以有<strong>无穷多个跳跃</strong>，只要跳跃总幅度有限，照样可积。</li></ol><p>（更强的刻画留到第四部：Lebesgue 判据——$f$ 可积 $\Leftrightarrow$ $f$ 有界且<strong>间断点集测度为零</strong>。连续函数间断点集为空集、单调函数间断点至多可数——可数集测度零，两条定理统一为一个判据的特例。）</p>` },
      { type: 'text', title: 'Dirichlet 函数：不可积的见证', body: String.raw`<p>现在让<strong>Dirichlet 函数</strong>登场：$D(x) = 1$（$x$ 为有理数），$D(x) = 0$（$x$ 为无理数）。它有界（$0 \leq D \leq 1$），却<strong>处处间断</strong>（任何邻域内既有有理点又有无理点，值在 0 与 1 之间疯狂切换——第 2 章关于 $\mathbb{Q}$ 稠密的讨论在此刻亮剑）。</p><p><strong>不可积的证明只需一行</strong>：对<strong>任何</strong>划分的<strong>任何</strong>子区间，有理数与无理数都稠密存在，故 $M_k = 1$，$m_k = 0$，从而</p>$$U(P, D) - L(P, D) = \sum_{k=1}^{n}(1 - 0)\,\Delta x_k = b - a \qquad \text{（恒等于区间长！）}$$<p>加细划分毫无用处——每个子区间无论多短，振荡都是 1。<strong>「切得再细也压不平」</strong>：振荡总面积恒为 $b - a$，永远无法小于 $\varepsilon &lt; b - a$。$D \notin ℛ$。</p><p><strong>这个反例划出了 Riemann 理论的疆界</strong>：有界 + 间断点「少量」才可积；间断点铺满整个区间时崩溃。出路有两条：接受 $D$ 不可积（Riemann 的选择），或改造积分本身让「按测度看值」取代「按位置看值」（Lebesgue 的选择——在 Lebesgue 积分下 $D$ 的积分是 $1 \cdot m(\mathbb{Q} \cap [a,b]) + 0 = 0$，因为有理数测度为零）。第四部将展开这场革命。</p>` },
      { type: 'theorem', title: '微积分基本定理的严格版', pu: 'Rudin 定理 6.20 与 6.21', body: String.raw`<p><strong>FTC-1（Rudin 6.20）：</strong>设 $f \in ℛ$ 于 $[a,b]$，令 $F(x) = \int_a^x f(t)\,dt$。若 $f$ 在 $x_0$ 处连续，则 $F'$ 在 $x_0$ 处存在且 $F'(x_0) = f(x_0)$。</p><p><strong>证明骨架（ε-δ 直攻差商）</strong>：考察 $\frac{F(x_0+h) - F(x_0)}{h} - f(x_0) = \frac{1}{h}\int_{x_0}^{x_0+h}\left[f(t) - f(x_0)\right]dt$。由 $f$ 在 $x_0$ 连续：给定 $\varepsilon$，存在 $\delta$ 使 $|t - x_0| &lt; \delta \Rightarrow |f(t) - f(x_0)| &lt; \varepsilon$。于是 $|h| &lt; \delta$ 时，被积函数在长度 $|h|$ 的区间上处处小于 $\varepsilon$，积分的绝对值 $&lt; \varepsilon \cdot |h|$，差商偏差 $&lt; \varepsilon$。∎ ——注意这里只需要<strong>单点连续</strong>（不是一致连续）：因为 $h \to 0$ 时积分区间收缩到 $x_0$ 一点，控制只需局部成立。</p><p><strong>FTC-2（Rudin 6.21）：</strong>若 $f \in ℛ$ 且存在可微的 $F$ 使 $F' = f$ 在 $[a,b]$ 上处处成立，则 $\int_a^b f\,dx = F(b) - F(a)$。证明用 $f$ 在每个子区间的值被 $F$（由 MVT，Rudin 5.19）在中间点取得——Riemann 和 telescopes 成 $F(b) - F(a)$。</p><p><strong>两版对比微积分时期</strong>：那时「$F(x) = $ 面积函数、$F' = f$」靠图像直觉一笔画过；现在我们看到—— FTC-1 的本质是<strong>连续点的局部控制</strong>（振荡在长度趋零的区间上积分趋零），FTC-2 的本质是<strong> telescoping（裂项相消）</strong>。微分与积分互逆的每一步，都被焊接在 ε-δ 的钢架上。</p>` },
      { type: 'example', title: '例题 · 用 Darboux 准则直接证可积', body: String.raw`<p><strong>问题：</strong>用 Darboux 准则证明 $f(x) = x$ 在 $[0, 1]$ 上可积，并求使 $U(P_n) - L(P_n) &lt; 0.05$ 的最小均匀划分份数 $n$。</p><p><strong>解：</strong>（1）均匀划分 $P_n$：分点 $x_k = \frac{k}{n}$。$f(x) = x$ 递增，故 $M_k = \frac{k}{n}$，$m_k = \frac{k-1}{n}$，每段振荡 $\omega_k = \frac{1}{n}$。</p><p>（2）总振荡：$U(P_n) - L(P_n) = \sum_{k=1}^n \frac{1}{n} \cdot \frac{1}{n} = n \cdot \frac{1}{n^2} = \frac{1}{n} \to 0$。由 ε-判据，$f \in ℛ$。∎</p><p>（3）解 $\frac{1}{n} &lt; 0.05$：$n &gt; 20$，最小份数 $n = 21$。</p><p><strong>顺手把积分也求出来</strong>：$L(P_n) = \sum_{k=1}^{n}\frac{k-1}{n} \cdot \frac{1}{n} = \frac{(n-1)n/2}{n^2} = \frac{n-1}{2n}$，$U(P_n) = \frac{n+1}{2n}$（读者可用求和公式 $\sum_{k=1}^n k = \frac{n(n+1)}{2}$ 验证）。两者从下方 $\frac{1}{2} - \frac{1}{2n}$ 与上方 $\frac{1}{2} + \frac{1}{2n}$ 逼向共同极限 $\int_0^1 x\,dx = \frac{1}{2}$——与 FTC-2（$\frac{x^2}{2}\Big|_0^1 = \frac{1}{2}$）完美会师。</p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      'Darboux：$U(P,f)=\\sum M_k\\Delta x_k$（外包阶梯），$L(P,f)=\\sum m_k\\Delta x_k$（内接阶梯）',
      '可积 $\\Leftrightarrow$ 对任何 $\\varepsilon>0$ 存在划分使 $U-L<\\varepsilon$（振荡关进小面积）',
      '连续 $\\Rightarrow$ 可积（用一致连续压振荡）；单调 $\\Rightarrow$ 可积（telescoping）',
      'Dirichlet 函数：任何划分下 $U-L=b-a$ 恒定，切再细也压不平——不可积',
      'FTC-1 只需 $f$ 在单点连续（局部控制）；FTC-2 是 Riemann 和的 telescoping'
    ],
    exercises: [
      { id: 'b-ex1', type: 'choice', diff: 2,
        question: String.raw`Dirichlet 函数 $D(x)$（有理点取 1、无理点取 0）在 $[0, 1]$ 上，对<strong>任何</strong>划分 $P$，Darboux 上和与下和之差 $U(P, D) - L(P, D) = $ ？`,
        options: [String.raw`$1$——每个子区间内既有有理点又有无理点，$M_k = 1$、$m_k = 0$，$\sum(1-0)\Delta x_k = 1$`, String.raw`$0$——因此 $D$ 可积`, String.raw`$\dfrac{1}{2}$——上下和折中`, String.raw`当划分无限细时趋于 0`],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>关键事实（第 2 章的 $\mathbb{Q}$ 稠密性）：任何子区间 $[x_{k-1}, x_k]$ 无论多短，内部都同时含有有理数与无理数。故 $M_k = \sup D = 1$，$m_k = \inf D = 0$。</p><p><span class="step-tag">Step 2</span>求和：$U - L = \sum_{k=1}^n (M_k - m_k)\Delta x_k = \sum_{k=1}^n 1 \cdot \Delta x_k = \sum \Delta x_k = 1 - 0 = 1$（区间长度）。</p><p><span class="step-tag">Step 3</span>结论：振荡总面积<strong>恒为 1</strong>，与划分粗细无关（D 错——不是「趋于 0」而是「恒等于 1」）。取 $\varepsilon = \frac{1}{2}$，任何划分都无法使 $U - L &lt; \varepsilon$，故 $D$ 不可积。</p><p><span class="step-tag">意义</span>这是「切细压振荡」策略的<strong>失效现场</strong>：Riemann 可积性奖励「间断点稀少」的函数，而 $D$ 处处间断、振荡铺满每寸区间——任何划分都在徒劳地切开水，水还是水。Lebesgue 将换一个问法（按值域而非定义域切），让 $D$ 的积分直接归零（有理点测度为零）。</p>` },
      { id: 'b-ex2', type: 'choice', diff: 2,
        question: String.raw`证明「闭区间上连续函数必可积」（$U - L$ 可以任意小）时，把每个子区间的振荡 $\omega_k$ 统一压小的关键工具是？`,
        options: [String.raw`介值定理——保证 $M_k$、$m_k$ 都被 $f$ 取到`, String.raw`Cantor 定理：闭区间上连续 $\Rightarrow$ 一致连续——统一的 $\delta$ 使 $|x-y|<\delta \Rightarrow |f(x)-f(y)|<\frac{\varepsilon}{b-a}$`, String.raw`微分中值定理`, String.raw`数学归纳法`],
        answer: 1,
        solution: String.raw`<p><span class="step-tag">Step 1</span>目标拆解：$U - L = \sum \omega_k \Delta x_k &lt; \varepsilon$。若每个 $\omega_k &lt; \frac{\varepsilon}{b-a}$，则 $U - L &lt; \frac{\varepsilon}{b-a}\sum\Delta x_k = \varepsilon$。剩下的问题：<strong>怎样保证每个子区间的振荡都小？</strong></p><p><span class="step-tag">Step 2</span>子区间振荡小 $\Leftrightarrow$ 区间内任意两点函数值差小 $\Leftrightarrow$ 需要一个<strong>全区通用的 $\delta$</strong>（划分 mesh $&lt; \delta$ 即可）。这正是<strong>一致连续</strong>的定义！由 Cantor 定理（第 4 章），闭区间上连续 $\Rightarrow$ 一致连续，$\delta$ 存在。</p><p><span class="step-tag">Step 3</span>为什么逐点连续不够：各点各配各的 $\delta_{x_0}$，无穷多个 $\delta$ 可能没有正的下确界——无法选出全区统一的划分粗细。闭区间（紧致性）把「无穷多个局部承诺」压缩成「一个全局承诺」，这是 Cantor 定理的实质。</p><p><span class="step-tag">全景</span>依赖链壮丽而清晰：紧致性 → Cantor 一致连续 → 连续函数可积。微积分时期「连续函数必有面积」的图像直觉，在分析学中沿着这条链被逐步兑现。</p>` },
      { id: 'b-ex3', type: 'numeric', diff: 2, answer: 21, tolerance: 0.5,
        question: String.raw`设 $f(x) = x$ 于 $[0, 1]$，取均匀划分 $P_n$（$n$ 等分）。使 Darboux 振荡 $U(P_n) - L(P_n) &lt; 0.05$ 的<strong>最小</strong>份数 $n$ 是？<em>（填数值）</em>`,
        solution: String.raw`<p><span class="step-tag">Step 1</span>均匀划分下每段长 $\Delta x = \frac{1}{n}$；$f(x) = x$ 递增，故每段振荡 $\omega_k = M_k - m_k = \frac{k}{n} - \frac{k-1}{n} = \frac{1}{n}$。</p><p><span class="step-tag">Step 2</span>总振荡：$U - L = \sum_{k=1}^n \frac{1}{n} \cdot \frac{1}{n} = \frac{1}{n}$。</p><p><span class="step-tag">Step 3</span>解 $\frac{1}{n} &lt; 0.05$：$n &gt; 20$，最小整数 $n = 21$。验证：$n = 21$ 时 $U - L \approx 0.0476 &lt; 0.05$ ✓；$n = 20$ 时恰好 $= 0.05$，不满足「严格小于」。</p><p><span class="step-tag">体会</span>振荡 $\frac{1}{n}$ 与精度 $\varepsilon$ 的关系是线性的：精度提高 10 倍，份数增加 10 倍。对比 Dirichlet 函数的振荡恒为 1（份数再大也无用），可见「可积性 = 振荡对划分的响应速度」——这条线正是 Darboux 准则的操作性所在。实验室里切到 Darboux 上下和模式，拖大 $n$，看外包阶梯与内接阶梯如何把 $\frac{1}{2}$ 夹在中间。</p>` },
      { id: 'b-ex4', type: 'choice', diff: 3,
        question: String.raw`在 FTC-1 的严格证明中（$F(x) = \int_a^x f$，$f$ 连续，证 $F'(x_0) = f(x_0)$），把差商 $\dfrac{F(x_0+h)-F(x_0)}{h}$ 压向 $f(x_0)$ 用到的核心思路是？`,
        options: [String.raw`在 $[x_0, x_0+h]$ 上用微分中值定理找到中间点`, String.raw`Heine–Borel 定理提取有限覆盖`, String.raw`考察 $\dfrac{1}{h}\int_{x_0}^{x_0+h}[f(t)-f(x_0)]dt$：由 $f$ 在 $x_0$ 连续，$|t - x_0| < \delta$ 时被积函数 $< \varepsilon$，故 $|h| < \delta$ 时差商偏差 $< \varepsilon$`, String.raw`对 $h$ 用数学归纳法`],
        answer: 2,
        solution: String.raw`<p><span class="step-tag">Step 1</span>改写差商（把 $f(x_0)$ 塞进积分号内——这是全证明最漂亮的一步）：</p><p>$$\frac{F(x_0+h) - F(x_0)}{h} - f(x_0) = \frac{1}{h}\int_{x_0}^{x_0+h}\left[f(t) - f(x_0)\right]dt$$</p><p><span class="step-tag">Step 2</span>局部控制：给定 $\varepsilon &gt; 0$，由 $f$ 在<strong>这一点</strong> $x_0$ 连续，存在 $\delta$ 使 $|t - x_0| &lt; \delta \Rightarrow |f(t) - f(x_0)| &lt; \varepsilon$。</p><p><span class="step-tag">Step 3</span>收官：$|h| &lt; \delta$ 时积分区间 $[x_0, x_0+h]$ 整个泡在 $\delta$-邻域内，被积函数处处 $&lt; \varepsilon$，故积分绝对值 $&lt; \varepsilon|h|$，除以 $h$ 后偏差 $&lt; \varepsilon$。这正是 $\varepsilon$-$\delta$ 要证的 $F'(x_0) = f(x_0)$。∎</p><p><span class="step-tag">精妙之处</span>只需<strong>单点连续</strong>（而非一致连续）：因为积分区间随 $h \to 0$ 收缩到 $x_0$ 一点，「局部」就够了。对比可积性证明（第 2 题答案）需要全区一致连续——因为那里的划分铺满整个 $[a,b]$。<strong>定理的强弱，精确地对应所需的连续强度</strong>：这是分析学「按需分配假设」的典范。</p>` }
    ]
  }
  ]
});
