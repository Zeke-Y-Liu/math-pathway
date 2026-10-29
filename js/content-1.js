/* ============================================================
   第一部 · 筑基 — 高中数学核心（对应普林斯顿 MAT 100 预备微积分）
   ============================================================ */
window.COURSE_DIVISIONS = window.COURSE_DIVISIONS || [];

window.COURSE_DIVISIONS.push({
  id: 'foundation',
  roman: 'I',
  title: '筑基 · 高中数学核心',
  shortName: '筑基',
  princeton: 'MAT 100 · 预备微积分',
  color: '#2E7D6B',
  desc: '函数、指数对数三角、数列与不等式——进入微积分世界前的全部必备装备。',
  chapters: [

  /* ---------------- 第 1 章 ---------------- */
  {
    id: 'functions',
    title: '函数与图像',
    intro: '函数是整个高等数学的主角。微积分研究的就是函数的变化与累积——先把「依赖关系」这一概念刻进直觉。',
    princeton: 'MAT 100',
    sections: [
      { type: 'text', title: '为什么从函数开始', body: String.raw`<p>物理学家关心<span class="muted">路程如何随时间变化</span>，经济学家关心<span class="muted">成本如何随产量变化</span>，生物学家关心<span class="muted">种群数量如何随环境变化</span>。这些问题的共同结构是：<strong>一个量的变化引起另一个量的变化</strong>。数学家用「函数」来精确刻画这种依赖关系。</p><p>普林斯顿 MAT 100 的第一件事，就是确保你能像读文章一样流畅地「读」函数图像——因为从 MAT 103 开始，极限、导数、积分的所有思想，都首先以图像的方式呈现在几何直觉中。</p>` },
      { type: 'definition', title: '函数的定义', pu: 'Rudin《数学分析原理》定义 2.1 的雏形', body: String.raw`<p>设 $A$、$B$ 是两个非空集合。若对 $A$ 中<strong>每个</strong>元素 $x$，按照某个对应法则 $f$，都有 $B$ 中<strong>唯一</strong>的元素 $y$ 与之对应，则称 $f$ 是从 $A$ 到 $B$ 的<strong>函数</strong>，记作 $f: A \to B$。</p><ul class="nice"><li><strong>定义域</strong> $D_f$：允许输入的 $x$ 的全体；</li><li><strong>值域</strong> $R_f$：实际输出的 $y$ 的全体；</li><li>「唯一对应」是关键：一个 $x$ 只能对应一个 $y$——这就是图像与竖直线检验的联系。</li></ul>` },
      { type: 'text', title: '一次与二次：最基本的模型', body: String.raw`<p><strong>一次函数</strong> $y = kx + b$ 的图像是直线，斜率 $k$ 表示 $x$ 每增加 1，$y$ 增加 $k$——这是「变化率」的第一次亮相，将来导数的概念正由此生长。</p><p><strong>二次函数</strong> $y = ax^2 + bx + c$ 的图像是抛物线。配方可得顶点式：</p>$$y = a\left(x + \frac{b}{2a}\right)^2 + \left(c - \frac{b^2}{4a}\right)$$<p>顶点横坐标 $x = -\frac{b}{2a}$ 恰好是使导数为零的位置——在微积分里，这将统一为「极值点」的一般理论。</p>` },
      { type: 'viz', id: 'transformLab' },
      { type: 'text', title: '图像变换的统一语言', body: String.raw`<p>已知 $y = f(x)$ 的图像，则</p>$$y = a\,f\big(b(x - c)\big) + d$$<p>的图像可由四步得到：<strong>右移 $c$</strong>（平移）、<strong>横向伸缩 $1/b$</strong>、<strong>纵向伸缩 $a$</strong>、<strong>上移 $d$</strong>。注意「先平移后伸缩」与「先伸缩后平移」结果不同——上面的公式约定 <strong>$b$ 与 $c$ 先结合</strong>。在实验室里拖动滑块，把这些变换一一「摸」出直觉。</p>` },
      { type: 'example', title: '例题 · 读图与反推', body: String.raw`<p><strong>问题：</strong>某函数图像由 $y = \sqrt{x}$ 的图像先向右平移 2，再纵向拉伸 3 倍，最后下移 1 得到。求其表达式与定义域。</p><p><strong>解：</strong>逐层代入变换语言：</p>$$y = 3\sqrt{x - 2} - 1$$<p>定义域要求 $x - 2 \geq 0$，即 $[2, +\infty)$。值域为 $[-1, +\infty)$——因为 $\sqrt{x-2} \geq 0$。这个「由变换反推表达式」的技能在 MAT 103 求复合函数极限时反复出现。</p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      '函数 = 定义域 + 对应法则，一个 x 只对应一个 y（竖直线检验）',
      '掌握 $y = a\,f(b(x-c))+d$ 的四类图像变换及先后顺序',
      '一次函数的斜率是「变化率」的雏形；二次函数顶点是「极值」的雏形',
      '求定义域的三类常见限制：分母不为零、偶次根号内非负、对数真数为正'
    ],
    exercises: [
      { id: 'f-ex1', type: 'choice', diff: 1,
        question: String.raw`函数 $f(x) = \dfrac{\sqrt{x+2}}{x-1}$ 的定义域是？`,
        options: [String.raw`$[-2, 1) \cup (1, +\infty)$`, String.raw`$(-2, 1) \cup (1, +\infty)$`, String.raw`$[-2, +\infty)$`, String.raw`$(-2, +\infty)$`],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>根号内非负：$x + 2 \geq 0 \Rightarrow x \geq -2$。</p><p><span class="step-tag">Step 2</span>分母不为零：$x \neq 1$。</p><p><span class="step-tag">Step 3</span>取交集：$[-2, 1) \cup (1, +\infty)$。注意 $-2$ 可以取（根号为零合法），$1$ 必须挖去。</p>` },
      { id: 'f-ex2', type: 'choice', diff: 1,
        question: String.raw`已知 $f(x) = x^2 + 1$，则 $f(x+1) - f(x)$ 等于？`,
        options: [String.raw`$2x + 2$`, String.raw`$2x + 1$`, String.raw`$1$`, String.raw`$x^2 + 2$`],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>先代入再作差（切忌把 $f(x+1)$ 误当作 $f(x)+1$）：</p><p>$f(x+1) = (x+1)^2 + 1 = x^2 + 2x + 2$，而 $f(x) = x^2 + 1$。</p><p><span class="step-tag">Step 2</span>$f(x+1) - f(x) = 2x + 2$。</p><p><span class="step-tag">注</span>差商 $\frac{f(x+1)-f(x)}{1} = 2x+2$ 恰是 $f$ 在 $x$ 处切线斜率的近似——这正是导数定义 $f'(x) = \lim_{h \to 0}\frac{f(x+h)-f(x)}{h}$ 的雏形。</p>` },
      { id: 'f-ex3', type: 'choice', diff: 2,
        question: String.raw`将 $y = \sin x$ 的图像上所有点的横坐标伸长为原来的 2 倍（纵坐标不变），再向左平移 $\frac{\pi}{3}$，所得图像的解析式是？`,
        options: [String.raw`$y = \sin\left(2x + \frac{\pi}{3}\right)$`, String.raw`$y = \sin\left(\frac{x}{2} + \frac{\pi}{3}\right)$`, String.raw`$y = \sin\frac{1}{2}\left(x + \frac{\pi}{3}\right)$`, String.raw`$y = \sin\left(\frac{x}{2} + \frac{\pi}{6}\right)$`],
        answer: 2,
        solution: String.raw`<p><span class="step-tag">Step 1</span>横坐标伸长为 2 倍：用 $x$ 换为 $\frac{x}{2}$，得 $y = \sin\frac{x}{2}$。</p><p><span class="step-tag">Step 2</span>向左平移 $\frac{\pi}{3}$：用 $x$ 换为 $x + \frac{\pi}{3}$，得</p><p>$$y = \sin\frac{1}{2}\left(x + \frac{\pi}{3}\right)$$</p><p><span class="step-tag">易错点</span>平移是在<strong>最后得到的自变量</strong> $x$ 上加 $\frac{\pi}{3}$，而不是在 $\frac{x}{2}$ 上加——若先平移再伸缩才会得到 $\sin\left(\frac{x}{2}+\frac{\pi}{6}\right)$。顺序不同、结果不同。</p>` },
      { id: 'f-ex4', type: 'numeric', diff: 2, answer: -3, tolerance: 0.01,
        question: String.raw`已知奇函数 $f(x)$ 在 $x \geq 0$ 时满足 $f(x) = x^2 - 2x$，则 $f(-3) = $ <em>（填数值）</em>`,
        solution: String.raw`<p><span class="step-tag">Step 1</span>奇函数满足 $f(-x) = -f(x)$，所以 $f(-3) = -f(3)$。</p><p><span class="step-tag">Step 2</span>计算 $f(3) = 9 - 6 = 3$，故 $f(-3) = -3$。</p><p><span class="step-tag">几何直觉</span>奇函数图像关于原点中心对称：右侧抛物线在 $x=3$ 处高为 3，对称到左侧 $x=-3$ 处便是 $-3$。</p>` }
    ]
  },

  /* ---------------- 第 2 章 ---------------- */
  {
    id: 'exp-log-trig',
    title: '指数、对数与三角函数',
    intro: '三类最重要的基本函数：一个刻画爆炸增长，一个把乘法世界拉回加法世界，一个刻画周期现象——它们是微积分舞台上的常驻演员。',
    princeton: 'MAT 100',
    sections: [
      { type: 'text', title: '指数函数：增长之王', body: String.raw`<p>人口、复利、放射性衰变、链式反应……它们的数学原型都是 $y = a^x$（$a > 0$ 且 $a \neq 1$）。当底数取那个特殊的数 $e \approx 2.71828$ 时，函数 $y = e^x$ 获得了微积分中最尊贵的地位：<strong>它是自己的导数</strong>：</p>$$\frac{d}{dx}e^x = e^x$$<p>在 MAT 103 你将看到，$e$ 的定义本身就是一次极限操作：$e = \lim_{n \to \infty}\left(1 + \frac{1}{n}\right)^n$。指数函数的图像永远在 $x$ 轴上方、过 $(0,1)$、单调（$a>1$ 递增）——这些「形状记忆」在分析定理的证明里会反复被调用。</p>` },
      { type: 'text', title: '对数：把乘法变成加法', body: String.raw`<p>对数函数 $y = \log_a x$ 是指数函数的反函数。它的全部威力来自三条运算律：</p>$$\log_a(xy) = \log_a x + \log_a y, \qquad \log_a\frac{x}{y} = \log_a x - \log_a y, \qquad \log_a x^p = p\log_a x$$<p>天文学家拉普拉斯说：「对数的发明，把天文学家的寿命延长了一倍」——因为它把冗长的乘除压缩成简单的加减。以 $e$ 为底的自然对数 $\ln x$ 将伴随整个微积分：$\ln x$ 的导数是 $\frac{1}{x}$，这是「多项式的世界」通往「有理函数的世界」的第一扇门。</p>` },
      { type: 'viz', id: 'unitCircle' },
      { type: 'text', title: '三角函数：周期的语言', body: String.raw`<p>在单位圆上，让点沿圆周逆时针转过角 $\theta$（弧度制），则点的坐标就是 $(\cos\theta, \sin\theta)$。弧度制的本质是<strong>用弧长度量角</strong>：半径为 1 时，弧长 = 角的弧度数。这解释了微积分中最优美的极限：</p>$$\lim_{\theta \to 0}\frac{\sin\theta}{\theta} = 1$$<p>它成立的前提正是弧度制——若用角度制，极限将变成 $\frac{\pi}{180}$。单位圆还让和角公式变得自然：</p>$$\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta$$` },
      { type: 'definition', title: '必须烂熟的核心恒等式', body: String.raw`<ul class="nice"><li>勾股恒等式：$\sin^2\theta + \cos^2\theta = 1$（对一切实数 $\theta$ 成立）</li><li>二倍角：$\sin 2\theta = 2\sin\theta\cos\theta$，$\cos 2\theta = 1 - 2\sin^2\theta$</li><li>同角关系：$\tan\theta = \dfrac{\sin\theta}{\cos\theta}$（$\cos\theta \neq 0$ 处）</li><li>换底公式：$\log_a b = \dfrac{\ln b}{\ln a}$（$a, b > 0$, $a \neq 1$）</li><li>指数法则：$a^{x+y} = a^x \cdot a^y$，$(a^x)^y = a^{xy}$</li></ul>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      '$e^x$ 与 $\ln x$ 互为反函数，图像关于 $y = x$ 对称',
      '对数三运算律把乘除幂转化为加减乘',
      '弧度制 = 单位圆上的弧长，是 $\\lim_{\\theta\\to 0}\\sin\\theta/\\theta = 1$ 成立的前提',
      '单位圆给出三角函数的一切：符号、周期、恒等式'
    ],
    exercises: [
      { id: 't-ex1', type: 'choice', diff: 1,
        question: String.raw`化简 $\log_2 8 + \log_2 4$ 的值为？`,
        options: ['$5$', '$6$', '$\\log_2 12$', '$2$'],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>直接求值：$\log_2 8 = 3$（因为 $2^3 = 8$），$\log_2 4 = 2$（因为 $2^2 = 4$）。</p><p><span class="step-tag">Step 2</span>相加：$3 + 2 = 5$。</p><p><span class="step-tag">另路</span>用运算律 $\log_a x + \log_a y = \log_a(xy)$：$\log_2(8 \times 4) = \log_2 32 = \log_2 2^5 = 5$ ✓。两条路答案一致。<strong>常见错误</strong>：把两个对数值相乘得 $3 \times 2 = 6$。</p>` },
      { id: 't-ex2', type: 'choice', diff: 2,
        question: String.raw`设 $\theta \in \left(\frac{\pi}{2}, \pi\right)$ 且 $\sin\theta = \frac{3}{5}$，则 $\tan\theta = $ ？`,
        options: ['$-\\frac{3}{4}$', '$\\frac{3}{4}$', '$-\\frac{4}{3}$', '$\\frac{4}{3}$'],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>由勾股恒等式：$\cos^2\theta = 1 - \frac{9}{25} = \frac{16}{25}$，故 $|\cos\theta| = \frac{4}{5}$。</p><p><span class="step-tag">Step 2</span>判定符号：$\theta$ 在第二象限，$x$ 坐标为负，故 $\cos\theta = -\frac{4}{5}$。</p><p><span class="step-tag">Step 3</span>$\tan\theta = \frac{\sin\theta}{\cos\theta} = \frac{3/5}{-4/5} = -\frac{3}{4}$。</p><p><span class="step-tag">几何图像</span>在单位圆上，第二象限的点纵坐标 $\frac{3}{5}$、横坐标 $-\frac{4}{5}$，从原点指向该点的射线向左上倾斜——斜率为负。</p>` },
      { id: 't-ex3', type: 'numeric', diff: 2, answer: 3.32, tolerance: 0.02,
        question: String.raw`方程 $2^x = 10$ 的解为 $x = $ <em>（填数值，保留两位小数；可用 $\log_2 10 = \frac{\ln 10}{\ln 2}$）</em>`,
        solution: String.raw`<p><span class="step-tag">Step 1</span>两边取自然对数：$x\ln 2 = \ln 10$。</p><p><span class="step-tag">Step 2</span>$x = \frac{\ln 10}{\ln 2} = \frac{2.3026}{0.6931} \approx 3.32$。</p><p><span class="step-tag">检验</span>$2^{3.32} \approx 10.0$ ✓。这类「指数方程取对数」的手法在 MAT 104 处理指数增长微分方程 $y' = ky$ 时是标准操作。</p>` },
      { id: 't-ex4', type: 'choice', diff: 3,
        question: String.raw`利用和角公式，$\sin 75^{\circ} = $ ？<br><span class="muted">（提示：$75^{\circ} = 45^{\circ} + 30^{\circ}$）</span>`,
        options: ['$\\frac{\\sqrt{6}+\\sqrt{2}}{4}$', '$\\frac{\\sqrt{6}-\\sqrt{2}}{4}$', '$\\frac{\\sqrt{3}+1}{2}$', '$\\frac{\\sqrt{2}}{2}$'],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>拆角：$\sin 75^{\circ} = \sin(45^{\circ} + 30^{\circ})$。</p><p><span class="step-tag">Step 2</span>套用 $\sin(\alpha+\beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta$：</p><p>$$\sin 75^{\circ} = \frac{\sqrt{2}}{2}\cdot\frac{\sqrt{3}}{2} + \frac{\sqrt{2}}{2}\cdot\frac{1}{2} = \frac{\sqrt{6} + \sqrt{2}}{4} \approx 0.966$$</p><p><span class="step-tag">合理性</span>$75^{\circ}$ 接近 $90^{\circ}$，正弦应接近 1 ✓。</p>` }
    ]
  },

  /* ---------------- 第 3 章 ---------------- */
  {
    id: 'seq-ineq',
    title: '数列与不等式',
    intro: '数列是定义在自然数上的函数——离散世界的极限。高中数列的直觉，将直接演化为分析学中 ε-N 语言的对象。',
    princeton: 'MAT 100',
    sections: [
      { type: 'text', title: '数列：离散的函数', body: String.raw`<p>数列 $a_1, a_2, a_3, \ldots$ 本质上是一个函数 $a: \mathbb{N} \to \mathbb{R}$，只是把自变量写成了下标。等差数列与等比数列是两列最重要的「模板」：</p>$$a_n = a_1 + (n-1)d, \qquad a_n = a_1 q^{n-1}$$<p>它们的求和公式本身就蕴含极限思想：</p>$$1 + \frac{1}{2} + \frac{1}{4} + \cdots + \frac{1}{2^{n-1}} = 2 - \frac{1}{2^{n-1}}, \qquad \text{当 } n \to \infty \text{ 时和} \to 2$$<p>「项数无穷多，总和却收敛于有限值」——这个在实验室里可以看到的现象，就是第三部「级数理论」的起点。古希腊的芝诺悖论（阿基里斯追不上乌龟）正是因为没有极限概念才成为「悖论」。</p>` },
      { type: 'viz', id: 'seqLab' },
      { type: 'theorem', title: '均值不等式（AM–GM）', body: String.raw`<p>对任意正实数 $a, b$：</p>$$\frac{a+b}{2} \geq \sqrt{ab}, \qquad \text{等号成立当且仅当 } a = b$$<p><strong>证明（配方法）：</strong>$\frac{a+b}{2} - \sqrt{ab} = \frac{a - 2\sqrt{ab} + b}{2} = \frac{(\sqrt{a} - \sqrt{b})^2}{2} \geq 0$，等号当且仅当 $\sqrt{a} = \sqrt{b}$ 即 $a = b$。</p><p>这是「最值问题」的代数武器：若两个正数<strong>和固定</strong>，则它们<strong>乘积最大</strong>在相等时取到——「和定积最大，积定和最小」。它的 $n$ 元推广是分析学中 Young 不等式、Hölder 不等式的祖先。</p>` },
      { type: 'text', title: '数学归纳法：无穷级台阶', body: String.raw`<p>要证明命题 $P(n)$ 对一切自然数 $n$ 成立，只需两步：</p><ol class="nice"><li><strong>奠基</strong>：验证 $P(1)$ 成立；</li><li><strong>归纳</strong>：假设 $P(k)$ 成立（归纳假设），推出 $P(k+1)$ 成立。</li></ol><p>形象地说：第一级台阶能踏上，且每级台阶都能踏上下一级——于是所有台阶都能踏上。归纳法是数学分析中处理自然数命题的标准工具（例如证明 $\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}$）。它与其他证明方法的区别在于：<strong>它天生属于无穷</strong>。</p>` },
      { type: 'example', title: '例题 · 等比求和的推导', body: String.raw`<p><strong>问题：</strong>推导等比数列前 $n$ 项和公式：$S_n = a_1 + a_1q + \cdots + a_1q^{n-1}$（$q \neq 1$）。</p><p><strong>解：</strong>用「错位相减」——将和式乘以 $q$ 再与原式相减：</p>$$S_n = a_1 + a_1q + a_1q^2 + \cdots + a_1q^{n-1}$$ $$qS_n = \quad\; a_1q + a_1q^2 + \cdots + a_1q^{n-1} + a_1q^{n}$$<p>两式相减，中间项全部抵消：$(1-q)S_n = a_1(1 - q^n)$，故</p>$$S_n = \frac{a_1(1 - q^n)}{1 - q}$$<p>当 $|q| < 1$ 时令 $n \to \infty$，$q^n \to 0$，得无穷递缩等比数列的和 $S = \frac{a_1}{1-q}$——这是人类最早掌握的「无穷求和」。</p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      '数列是 $\\mathbb{N}\\to\\mathbb{R}$ 的函数；等差等比是两大模板',
      '错位相减导出 $S_n = \\frac{a_1(1-q^n)}{1-q}$；$|q|<1$ 时无穷和收敛',
      'AM–GM：$\\frac{a+b}{2}\\geq\\sqrt{ab}$，等号 iff $a=b$（和定积最大）',
      '数学归纳法 = 奠基 + 归纳步，处理自然数命题的标准武器'
    ],
    exercises: [
      { id: 's-ex1', type: 'choice', diff: 1,
        question: String.raw`等比数列 $\{a_n\}$ 中 $a_1 = 2$，公比 $q = \frac{1}{2}$，则前 5 项和 $S_5 = $ ？`,
        options: ['$\\frac{31}{8}$', '$\\frac{31}{16}$', '$\\frac{15}{8}$', '$4$'],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>代入求和公式：</p><p>$$S_5 = \frac{a_1(1 - q^5)}{1 - q} = \frac{2\left(1 - \frac{1}{32}\right)}{\frac{1}{2}} = 4 \times \frac{31}{32} = \frac{31}{8}$$</p><p><span class="step-tag">验证</span>逐项相加：$2 + 1 + \frac{1}{2} + \frac{1}{4} + \frac{1}{8} = \frac{16+8+4+2+1}{8} = \frac{31}{8}$ ✓。当 $n \to \infty$ 时和趋于 $\frac{2}{1 - 1/2} = 4$。</p>` },
      { id: 's-ex2', type: 'choice', diff: 2,
        question: String.raw`已知 $x > 0$，则 $x + \frac{4}{x}$ 的最小值为？`,
        options: ['$2$', '$4$', '$2\\sqrt{2}$', '$\\frac{5}{2}$'],
        answer: 1,
        solution: String.raw`<p><span class="step-tag">Step 1</span>由 AM–GM（$x > 0$，$\frac{4}{x} > 0$）：</p><p>$$x + \frac{4}{x} \geq 2\sqrt{x \cdot \frac{4}{x}} = 2\sqrt{4} = 4$$</p><p><span class="step-tag">Step 2</span>等号成立条件：$x = \frac{4}{x}$，即 $x = 2$（舍去负根）。故最小值为 $4$。</p><p><span class="step-tag">微积分视角</span>令 $f(x) = x + \frac{4}{x}$，则 $f'(x) = 1 - \frac{4}{x^2}$，令 $f'(x) = 0$ 得 $x = 2$，与 AM–GM 结论一致——代数不等式与导数殊途同归（第三部会严格证明这一点）。</p>` },
      { id: 's-ex3', type: 'choice', diff: 2,
        question: String.raw`用数学归纳法证明 $1 + 2 + \cdots + n = \frac{n(n+1)}{2}$ 时，归纳步骤应证明的是？`,
        options: [
          '假设 $n = k$ 成立，证明 $n = k + 1$ 时等式成立',
          '假设 $n = k - 1$ 成立，证明 $n = k$ 时等式成立',
          '验证 $n = 1$ 和 $n = 2$ 都成立',
          '对任意大的 $n$ 直接代入验证'
        ],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>归纳法两要素：奠基（$n=1$：$1 = \frac{1\times 2}{2}$ ✓）与归纳步。</p><p><span class="step-tag">Step 2</span>归纳步的固定格式：<strong>假设 $n = k$ 时命题成立</strong>（归纳假设 $1 + 2 + \cdots + k = \frac{k(k+1)}{2}$），在此之上证明 $n = k+1$：</p><p>$$1 + 2 + \cdots + k + (k+1) = \frac{k(k+1)}{2} + (k+1) = \frac{(k+1)(k+2)}{2}$$</p><p><span class="step-tag">注意</span>选项 B 的表述本身也能完成证明（强归纳的变体），但标准答案约定「从 $k$ 推 $k+1$」。核心错误是 D：有限次验证永远无法覆盖无穷多个自然数——那正是归纳法存在的意义。</p>` },
      { id: 's-ex4', type: 'numeric', diff: 3, answer: 6, tolerance: 0.01,
        question: String.raw`数列 $\{a_n\}$ 满足 $a_1 = 1$，$a_{n+1} = \frac{a_n}{2} + 3$。当 $n \to \infty$ 时 $a_n \to L$，则 $L = $ <em>（填数值）</em>`,
        solution: String.raw`<p><span class="step-tag">Step 1</span>若极限 $L$ 存在，对递推式两边取极限：$L = \frac{L}{2} + 3$。</p><p><span class="step-tag">Step 2</span>解方程：$\frac{L}{2} = 3$，得 $L = 6$。</p><p><span class="step-tag">Step 3</span>验证收敛性：改写递推为 $a_{n+1} - 6 = \frac{1}{2}(a_n - 6)$，说明 $\{a_n - 6\}$ 是公比为 $\frac{1}{2}$ 的等比数列，故 $a_n = 6 - 5 \cdot 2^{1-n} \to 6$，极限确实存在。</p><p><span class="step-tag">复核</span>实际计算 $a_2 = 3.5$，$a_3 = 4.75$，$a_4 = 5.375$，确实一步步逼近 6。这个「不动点法」是分析学中迭代序列 $x_{n+1} = g(x_n)$ 收敛性的雏形，第三部将严格化。</p>` }
    ]
  }
  ]
});
