/* ============================================================
   第二部 · 微积分 — 极限与变化（对应普林斯顿 MAT 103/104/201）
   ============================================================ */
window.COURSE_DIVISIONS = window.COURSE_DIVISIONS || [];

window.COURSE_DIVISIONS.push({
  id: 'calculus',
  roman: 'II',
  title: '微积分 · 极限与变化',
  shortName: '微积分',
  princeton: 'MAT 103 · 104 · 201',
  color: '#E77500',
  desc: '极限、导数与积分三大主线，加上计算的武器库——普林斯顿微积分序列的核心。',
  chapters: [

    /* ---------------- 第 1 章 ---------------- */
    {
      id: 'limits',
      title: '极限与连续',
      intro: '微积分的第一块基石。无穷逼近的过程首次被精确刻画——「要多近有多近」从一个口号变成一个可验证的数学命题。',
      princeton: 'MAT 103 · 第 2 章',
      sections: [
        { type: 'text', title: '为什么需要极限', body: String.raw`<p>圆的面积怎么求？古希腊人的答案是：往圆里塞越来越多边的正多边形，边数无限增多时，多边形面积就「无限接近」圆面积。这个「无限接近」在数学里沉睡了两千年，直到柯西与魏尔斯特拉斯把它锻造成<strong>极限</strong>的概念——微积分从此有了严格的地基。</p><p>普林斯顿 MAT 103 用整整一章打磨极限：不是因为定义有多难，而是因为<strong>后面的一切（导数、积分、级数）本质上都是极限</strong>。这一章学透，微积分就成功了一半。</p>` },
        { type: 'definition', title: '极限的严格定义（ε-δ）', pu: 'MAT 103 · Rudin 第 4 章语言的前奏', body: String.raw`<p>称 $\lim_{x \to a} f(x) = L$，若：<strong>任给</strong> $\epsilon > 0$（无论多小），<strong>存在</strong> $\delta > 0$，使</p>$$0 < |x - a| < \delta \Rightarrow |f(x) - L| < \epsilon$$<p>把它读成一场博弈：对手出 $\epsilon$（横带），你回 $\delta$（竖带）——只要竖带内的曲线全部落在横带里，你就赢了。赢下所有回合，极限就成立。注意 $0 < |x-a|$：我们不关心 $a$ 点本身的值，只关心「逼近」。</p>` },
        { type: 'viz', id: 'limitEpsDelta' },
        { type: 'theorem', title: '极限的四则运算与夹逼', pu: 'MAT 103', body: String.raw`<p>若 $\lim_{x \to a} f(x) = A$，$\lim_{x \to a} g(x) = B$，则</p>$$\lim (f \pm g) = A \pm B, \qquad \lim f \cdot g = AB, \qquad \lim \frac{f}{g} = \frac{A}{B} \ (B \neq 0)$$<p><strong>夹逼定理：</strong>若在 $a$ 附近 $g(x) \leq f(x) \leq h(x)$ 且 $g, h$ 同趋于 $L$，则 $f$ 也趋于 $L$。它是证明最重要极限的钥匙。</p>` },
        { type: 'text', title: '两个重要极限', body: String.raw`<p>$$\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1, \qquad \lim_{x \to \infty}\left(1 + \frac{1}{x}\right)^x = e$$</p><p>第一个来自单位圆的几何夹逼（弧长夹在两条弦之间），是所有三角极限的引擎；第二个定义了自然常数 $e \approx 2.71828$——「连续复利」的极限。它们的变式（如 $\frac{\sin 3x}{x} \to 3$、$(1+\frac{2}{x})^x \to e^2$）是练习的重点。</p>` },
        { type: 'definition', title: '连续与间断点', pu: 'MAT 103', body: String.raw`<p>$f$ 在 $a$ 处<strong>连续</strong>，指 $\lim_{x \to a} f(x) = f(a)$——极限值等于函数值，「图像一笔画出」。间断点分两类：</p><ul class="nice"><li><strong>第一类</strong>（左右极限都存在）：可去型（左右极限相等但不等于函数值，如 $\frac{\sin x}{x}$ 在 0 处）、跳跃型（左右极限不相等，如取整函数）；</li><li><strong>第二类</strong>（左右极限至少一个不存在）：无穷型（如 $\frac{1}{x}$ 在 0 处）、振荡型（如 $\sin\frac{1}{x}$ 在 0 处）。</li></ul>` },
        { type: 'example', title: '例题 · 三类极限计算', body: String.raw`<p><strong>(1)</strong> $\lim_{x \to 2}\dfrac{x^2-4}{x-2}$：$\frac{0}{0}$ 型，因式分解约去零因子：$\dfrac{(x-2)(x+2)}{x-2} \to x+2 \to 4$。</p><p><strong>(2)</strong> $\lim_{x \to 0}\dfrac{\sin 3x}{x}$：凑第一个重要极限：$\dfrac{\sin 3x}{3x} \cdot 3 \to 1 \cdot 3 = 3$。</p><p><strong>(3)</strong> $\lim_{x \to \infty}\dfrac{3x^2 + 1}{5x^2 - x}$：同除最高次幂：$\dfrac{3 + 1/x^2}{5 - 1/x} \to \dfrac{3}{5}$。<strong>口诀：</strong>$\frac{0}{0}$ 约零因子、凑重要极限；$\frac{\infty}{\infty}$ 同除最高次。</p>` },
        { type: 'exercises' }
      ],
      keyPoints: [
        'ε-δ 定义是一场「你出 ε 我出 δ」的博弈：竖带内的曲线必须全部落进横带',
        '四则运算法则 + 夹逼定理是极限计算的全部合法性来源',
        '两个重要极限：$\\sin\\theta/\\theta \\to 1$ 与 $(1+1/x)^x \\to e$',
        '连续 = 极限值等于函数值；间断分第一类（可去/跳跃）与第二类（无穷/振荡）',
        '严格的 ε-δ 证明技术将在第三部（Rudin 第 4 章）全面展开'
      ],
      exercises: [
        { id: 'l-ex1', type: 'choice', diff: 1,
          question: String.raw`$\lim_{x \to 2}\dfrac{x^2 - 4}{x - 2} = $ ?`,
          options: [String.raw`$4$`, String.raw`$0$`, String.raw`$2$`, String.raw`不存在$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>代入发现 $\frac{0}{0}$ 型——不能直接用商法则，需先化简。</p><p><span class="step-tag">Step 2</span>因式分解：$\dfrac{x^2-4}{x-2} = \dfrac{(x-2)(x+2)}{x-2} = x+2$（在 $x \neq 2$ 处恒等）。</p><p><span class="step-tag">Step 3</span>极限只看 $x$ 逼近 2 的过程而不看 $x=2$ 本身，故极限 $= 2 + 2 = 4$。</p><p><span class="step-tag">几何直觉</span>极限存在与否和该点函数值无关——这正是 ε-δ 定义中 $0 < |x-2|$ 的含义。</p>` },
        { id: 'l-ex2', type: 'choice', diff: 2,
          question: String.raw`$\lim_{x \to 0}\dfrac{\sin 3x}{x} = $ ?`,
          options: [String.raw`$3$`, String.raw`$1$`, String.raw`$\frac{1}{3}$`, String.raw`$0$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>凑第一个重要极限 $\lim_{\theta \to 0}\frac{\sin\theta}{\theta} = 1$：把分母变成 $3x$。</p><p><span class="step-tag">Step 2</span>$\dfrac{\sin 3x}{x} = \dfrac{\sin 3x}{3x} \cdot 3$。当 $x \to 0$ 时 $3x \to 0$，故 $\frac{\sin 3x}{3x} \to 1$。</p><p><span class="step-tag">Step 3</span>极限 $= 1 \cdot 3 = 3$。</p><p><span class="step-tag">一般规律</span>$\lim_{x \to 0}\frac{\sin kx}{x} = k$——「角的速度有多快，极限就是几」。</p>` },
        { id: 'l-ex3', type: 'choice', diff: 2,
          question: String.raw`$\lim_{x \to \infty}\left(1 + \dfrac{2}{x}\right)^x = $ ?`,
          options: [String.raw`$e^2$`, String.raw`$e$`, String.raw`$2e$`, String.raw`$1$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>改写成 $e$ 极限的标准形：$\left(1 + \frac{2}{x}\right)^x = \left[\left(1 + \frac{2}{x}\right)^{x/2}\right]^2$。</p><p><span class="step-tag">Step 2</span>令 $u = \frac{x}{2}$，则 $x \to \infty$ 时 $u \to \infty$，内层 $\left(1 + \frac{1}{u}\right)^u \to e$。</p><p><span class="step-tag">Step 3</span>故极限 $= e^2$。</p><p><span class="step-tag">一般规律</span>$\left(1 + \frac{k}{x}\right)^x \to e^k$——「连续复利」里本金 1、利率 k、复利次数无限。</p>` },
        { id: 'l-ex4', type: 'numeric', diff: 2, answer: 6, tolerance: 0.01,
          question: String.raw`函数 $f(x) = \dfrac{x^2 - 9}{x - 3}$（$x \neq 3$）在 $x = 3$ 处无定义。要把它延拓成处处连续的函数，应补充定义 $f(3) = $ <em>（填数值）</em>`,
          solution: String.raw`<p><span class="step-tag">Step 1</span>连续要求 $f(3) = \lim_{x \to 3} f(x)$，所以先求极限。</p><p><span class="step-tag">Step 2</span>约去零因子：$\dfrac{x^2-9}{x-3} = x + 3$（$x \neq 3$），故 $\lim_{x \to 3} f(x) = 6$。</p><p><span class="step-tag">Step 3</span>补充 $f(3) = 6$ 后，图像上的「洞」被填上，曲线一笔画出——这类间断称为<strong>可去间断点</strong>。</p>` }
      ]
    },

    /* ---------------- 第 2 章 ---------------- */
    {
      id: 'derivative',
      title: '导数：切线与变化率',
      intro: '把「某一瞬间的变化快慢」变成一个确切的数。导数是极限的第一个伟大应用——割线滑向切线的那一瞬间。',
      princeton: 'MAT 103 · 第 3 章',
      sections: [
        { type: 'text', title: '从割线到切线', body: String.raw`<p>问：抛出的石头在 $t = 2$ 秒那一瞬，速度是多少？平均速度 $\frac{\Delta s}{\Delta t}$ 需要一段时间间隔，而「那一瞬」没有间隔。牛顿的答案：取 $\Delta t \to 0$ 时平均速度的<strong>极限</strong>。几何上，这就是让割线滑动成切线——斜率从「一段的平均」变成「一点的瞬时」。</p>` },
        { type: 'viz', id: 'secantTangent' },
        { type: 'definition', title: '导数的定义', pu: 'MAT 103', body: String.raw`<p>$f$ 在 $x$ 处的<strong>导数</strong>：</p>$$f'(x) = \lim_{h \to 0}\frac{f(x+h) - f(x)}{h}$$<p>若极限存在，称 $f$ 在 $x$ 处<strong>可导</strong>。差商 $\frac{f(x+h)-f(x)}{h}$ 是区间 $[x, x+h]$ 上的平均变化率，导数是它在 $h \to 0$ 时的瞬时值。常用等价形式：$\lim_{t \to x}\frac{f(t)-f(x)}{t-x}$。</p><p><strong>可导必连续</strong>（反之不成立：$|x|$ 在 0 处连续但左右导数 $\pm 1$ 不等，不可导——图像上是个尖角）。</p>` },
        { type: 'text', title: '基本导数表', body: String.raw`<ul class="nice"><li>幂函数：$(x^n)' = nx^{n-1}$（$n$ 为任意实数）</li><li>指数与对数：$(e^x)' = e^x$，$(\ln x)' = \frac{1}{x}$，$(a^x)' = a^x \ln a$</li><li>三角函数：$(\sin x)' = \cos x$，$(\cos x)' = -\sin x$，$(\tan x)' = \frac{1}{\cos^2 x}$</li></ul><p>这张表不需要死记——在实验室里拖动 $h$，每一条都能「看见」：$e^x$ 的切线斜率就是它自己，$\sin$ 的切线斜率是 $\cos$。</p>` },
        { type: 'definition', title: '求导法则', pu: 'MAT 103', body: String.raw`<ul class="nice"><li><strong>线性：</strong>$(af + bg)' = af' + bg'$</li><li><strong>乘积：</strong>$(fg)' = f'g + fg'$</li><li><strong>商：</strong>$\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}$</li><li><strong>链式：</strong>$(f \circ g)'(x) = f'(g(x)) \cdot g'(x)$——「外层导数 × 内层导数」</li><li><strong>反函数：</strong>$f^{-1}$ 的导数是 $f'$ 在对应点的倒数（$\ln$ 与 $e^x$ 互证）</li></ul><p>链式法则是其中的皇冠：它让「函数的函数」这一无限组合的世界变得可计算。</p>` },
        { type: 'viz', id: 'derivativeLink' },
        { type: 'example', title: '例题 · 链式与乘积法则', body: String.raw`<p><strong>(1)</strong> $f(x) = \sin(x^2)$：外层 $\sin$、内层 $x^2$，$f'(x) = \cos(x^2) \cdot 2x$。</p><p><strong>(2)</strong> $f(x) = x\ln x$：乘积法则，$f'(x) = \ln x + x \cdot \frac{1}{x} = \ln x + 1$。特别地 $f'(1) = 1$。</p><p><strong>(3)</strong> 隐函数求导：$x^2 + y^2 = 25$，两边对 $x$ 求导（$y$ 视为 $y(x)$）：$2x + 2y\,y' = 0$，故 $y' = -\frac{x}{y}$。在点 $(3, 4)$ 处切线斜率 $= -\frac{3}{4}$。</p>` },
        { type: 'exercises' }
      ],
      keyPoints: [
        '导数 = 差商的极限：瞬时变化率 = 切线斜率',
        '可导必连续；|x| 是连续不可导的经典反例（尖角）',
        '四条法则：线性、乘积、商、链式——复杂函数拆成基本件',
        '$e^x$ 的导数是自身；$\\ln x$ 的导数是 $1/x$；$\\sin$ 与 $\\cos$ 互相轮转',
        '隐函数求导：把 y 当作 y(x)，等式两边同时对 x 求导'
      ],
      exercises: [
        { id: 'd-ex1', type: 'choice', diff: 1,
          question: String.raw`设 $f(x) = x\ln x$，则 $f'(1) = $ ?`,
          options: [String.raw`$1$`, String.raw`$0$`, String.raw`$e$`, String.raw`$\ln 2$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>乘积法则：$f'(x) = 1 \cdot \ln x + x \cdot \frac{1}{x} = \ln x + 1$。</p><p><span class="step-tag">Step 2</span>代入 $x = 1$：$f'(1) = \ln 1 + 1 = 0 + 1 = 1$。</p><p><span class="step-tag">几何直觉</span>$y = x\ln x$ 在 $x=1$ 处的切线恰好是 45° 上斜——$x\ln x$ 的最小值在 $x = e^{-1}$ 处（那里 $f' = 0$）。</p>` },
        { id: 'd-ex2', type: 'choice', diff: 2,
          question: String.raw`设 $f(x) = \sin(x^2)$，则 $f'(x) = $ ?`,
          options: [String.raw`$2x\cos(x^2)$`, String.raw`$\cos(2x)$`, String.raw`$2x\cos x$`, String.raw`$-2x\sin(x^2)$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>识别复合结构：外层 $f(u) = \sin u$，内层 $u = x^2$。</p><p><span class="step-tag">Step 2</span>链式法则：$f'(x) = \cos(x^2) \cdot (x^2)' = \cos(x^2) \cdot 2x$。</p><p><span class="step-tag">易错点</span>漏乘内层导数 $2x$（选 C 的同学把 $\cos$ 的宗量也改了——内层不动，只乘它的导数）；选 B 则混淆了 $\sin(x^2)$ 与 $\sin 2x$。</p>` },
        { id: 'd-ex3', type: 'choice', diff: 2,
          question: String.raw`用定义 $f'(a) = \lim_{h \to 0}\frac{f(a+h)-f(a)}{h}$ 计算 $f(x) = \sqrt{x}$ 在 $a = 4$ 处的导数，得 ?`,
          options: [String.raw`$\frac{1}{4}$`, String.raw`$\frac{1}{2}$`, String.raw`$\frac{1}{8}$`, String.raw`$2$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>写出差商并分子有理化：</p><p>$$\frac{\sqrt{4+h} - 2}{h} = \frac{(\sqrt{4+h}-2)(\sqrt{4+h}+2)}{h(\sqrt{4+h}+2)} = \frac{h}{h(\sqrt{4+h}+2)} = \frac{1}{\sqrt{4+h}+2}$$</p><p><span class="step-tag">Step 2</span>令 $h \to 0$：$\to \frac{1}{\sqrt{4}+2} = \frac{1}{4}$。</p><p><span class="step-tag">验证</span>一般公式 $(\sqrt{x})' = \frac{1}{2\sqrt{x}}$ 在 $x=4$ 处给 $\frac{1}{4}$ ✓。</p>` },
        { id: 'd-ex4', type: 'numeric', diff: 2, answer: -0.75, tolerance: 0.01,
          question: String.raw`圆 $x^2 + y^2 = 25$ 上一点 $(3, 4)$ 处切线的斜率是 <em>（填数值）</em>`,
          solution: String.raw`<p><span class="step-tag">Step 1</span>隐函数求导：把 $y$ 看作 $y(x)$，两边对 $x$ 求导：$2x + 2y\frac{dy}{dx} = 0$。</p><p><span class="step-tag">Step 2</span>解出 $\frac{dy}{dx} = -\frac{x}{y}$。</p><p><span class="step-tag">Step 3</span>代入 $(3, 4)$：斜率 $= -\frac{3}{4} = -0.75$。</p><p><span class="step-tag">几何直觉</span>半径方向 $(3,4)$ 的斜率是 $\frac{4}{3}$，切线与半径垂直，斜率取负倒数 $-\frac{3}{4}$ ✓。</p>` }
      ]
    },

    /* ---------------- 第 3 章 ---------------- */
    {
      id: 'applications',
      title: '导数的应用',
      intro: '一阶导数读出单调与极值，二阶导数读出凹凸与拐点，中值定理提供理论担保，洛必达法则清扫极限残敌。',
      princeton: 'MAT 103 · 第 4 章',
      sections: [
        { type: 'text', title: '导数是函数的「心电图」', body: String.raw`<p>$f'(x) > 0$ 的区间上 $f$ 上升，$f'(x) < 0$ 的区间上 $f$ 下降；$f'$ 变号的地方是极值候选。再看二阶：$f'' > 0$ 图像下凹（碗口向上），$f'' < 0$ 上凸；$f''$ 变号处是<strong>拐点</strong>。<strong>读图次序：</strong>先一阶定升降，再二阶定弯向，函数的全貌就立起来了。</p>` },
        { type: 'theorem', title: '中值定理（MVT）', pu: 'MAT 103 · Rudin 第 5 章', body: String.raw`<p>若 $f$ 在 $[a,b]$ 连续、在 $(a,b)$ 可导，则存在 $c \in (a,b)$ 使</p>$$f'(c) = \frac{f(b) - f(a)}{b - a}$$<p>几何意义：割线斜率必在某点被切线复现——行驶 120 km 用了 1 小时，途中必有一瞬速度表恰好指 120。它朴素得像废话，却是整个微积分理论的心脏：导数的局部信息与函数的全局变化在此接轨。特例 $f(a)=f(b)$（罗尔定理）保证 $f'(c)=0$——这就是「极值点处导数为零」的来源。</p>` },
        { type: 'viz', id: 'optimization' },
        { type: 'text', title: '洛必达法则', pu: 'MAT 103', body: String.raw`<p>面对 $\frac{0}{0}$ 或 $\frac{\infty}{\infty}$ 型未定式：</p>$$\lim\frac{f(x)}{g(x)} = \lim\frac{f'(x)}{g'(x)} \quad \text{（若右端极限存在）}$$<p>例如 $\lim_{x \to 0}\frac{e^x - 1}{x}$：分子分母同时趋 0，求导得 $\frac{e^x}{1} \to 1$。可连续使用（每步先验证仍是未定式）；$0 \cdot \infty$、$\infty - \infty$、$1^{\infty}$ 等型先变形为 $\frac{0}{0}$ 或 $\frac{\infty}{\infty}$。它的严格证明要到第三部（柯西中值定理）才补全。</p>` },
        { type: 'example', title: '例题 · 最优化建模全流程', body: String.raw`<p><strong>问题：</strong>用 12 m 栅栏靠一堵无限长的墙围矩形菜园（只需围三边），怎样围面积最大？</p><p><strong>建模：</strong>设垂直于墙的两边各长 $x$，平行墙的一边长 $y$，则 $2x + y = 12$，面积 $A(x) = x(12 - 2x)$。</p><p><strong>求导：</strong>$A'(x) = 12 - 4x$，令其为零得 $x = 3$，此时 $y = 6$。</p><p><strong>验证：</strong>$A'' = -4 < 0$，确为最大值；$A_{\max} = 18$ m²。</p><p><strong>检验端点：</strong>$x \to 0$ 或 $x \to 6$ 时面积归零——内部驻点就是冠军。最优解永远在「对称」处：两边各 3 m，正如定周长矩形中正方形最优。</p>` },
        { type: 'exercises' }
      ],
      keyPoints: [
        "一阶导数定单调：f' 变号处是极值；二阶导数定凹凸：f'' 变号处是拐点",
        '中值定理连接局部（导数）与全局（增量），是理论的心脏',
        '极值判定：驻点处 f\'\'<0 极大、f\'\'>0 极小（二阶判别法）',
        '洛必达法则只对 0/0 与 ∞/∞ 型使用，每步都要验证',
        '最优化三步：建模 → 求驻点 → 验证（二阶导或端点比较）'
      ],
      exercises: [
        { id: 'a-ex1', type: 'choice', diff: 1,
          question: String.raw`函数 $f(x) = x^3 - 3x$ 的单调递增区间是 ?`,
          options: [String.raw`$(-\infty, -1) \cup (1, +\infty)$`, String.raw`$(-1, 1)$`, String.raw`$\mathbb{R}$`, String.raw`$(-\infty, 0) \cup (0, +\infty)$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>$f'(x) = 3x^2 - 3 = 3(x+1)(x-1)$。</p><p><span class="step-tag">Step 2</span>$f' > 0 \Leftrightarrow (x+1)(x-1) > 0 \Leftrightarrow x < -1$ 或 $x > 1$。</p><p><span class="step-tag">Step 3</span>递增区间 $(-\infty, -1) \cup (1, +\infty)$；相应地 $(-1, 1)$ 上递减，$x=-1$ 是极大值点、$x=1$ 是极小值点。</p><p><span class="step-tag">图像记忆</span>三次「躺 S」：升—降—升，两个转折点恰在 $\pm 1$。</p>` },
        { id: 'a-ex2', type: 'choice', diff: 2,
          question: String.raw`$\lim_{x \to 0}\dfrac{e^x - 1 - x}{x^2} = $ ?`,
          options: [String.raw`$\frac{1}{2}$`, String.raw`$1$`, String.raw`$0$`, String.raw`$+\infty$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>代入得 $\frac{0}{0}$ 型，用洛必达：$\lim \frac{e^x - 1}{2x}$——仍是 $\frac{0}{0}$。</p><p><span class="step-tag">Step 2</span>再用一次：$\lim \frac{e^x}{2} = \frac{1}{2}$。</p><p><span class="step-tag">泰勒视角</span>$e^x = 1 + x + \frac{x^2}{2} + \cdots$，分子 $= \frac{x^2}{2} + O(x^3)$，除以 $x^2$ 立得 $\frac{1}{2}$——泰勒展开是洛必达的「批量版」。</p>` },
        { id: 'a-ex3', type: 'numeric', diff: 2, answer: 18, tolerance: 0.01,
          question: String.raw`用 12 m 栅栏靠墙围三边矩形（墙作为第四边），能围出的最大面积是 <em>（填数值，单位 m²）</em>`,
          solution: String.raw`<p><span class="step-tag">Step 1</span>建模：设垂直墙的边长 $x$、平行墙的边长 $y$，约束 $2x + y = 12$，面积 $A(x) = x(12-2x) = 12x - 2x^2$。</p><p><span class="step-tag">Step 2</span>求驻点：$A'(x) = 12 - 4x = 0 \Rightarrow x = 3$，相应 $y = 6$。</p><p><span class="step-tag">Step 3</span>二阶验证：$A'' = -4 < 0$，是最大值。$A_{\max} = 3 \times 6 = 18$。</p><p><span class="step-tag">思考</span>同样是 12 m，四面围（正方形 $3\times3$）只有 9 m²——「蹭」到墙这第四边，面积翻倍。</p>` },
        { id: 'a-ex4', type: 'choice', diff: 3,
          question: String.raw`函数 $f(x) = x^3 - 3x^2 + 1$ 在 $x = 0$ 处 ?`,
          options: [String.raw`取得极大值 $1$`, String.raw`取得极小值 $1$`, String.raw`不是极值点`, String.raw`无法判断`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>$f'(x) = 3x^2 - 6x = 3x(x-2)$，$f'(0) = 0$——$x=0$ 是驻点。</p><p><span class="step-tag">Step 2</span>二阶判别：$f''(x) = 6x - 6$，$f''(0) = -6 < 0$，故 $x = 0$ 是<strong>极大值点</strong>。</p><p><span class="step-tag">Step 3</span>极大值 $f(0) = 1$。（对照 $x = 2$：$f''(2) = 6 > 0$，是极小值点，$f(2) = -3$。）</p><p><span class="step-tag">易错点</span>「$f'(0)=0$」本身不保证极值——如 $x^3$ 在 0 处驻而不极；必须再看二阶或一阶变号。</p>` }
      ]
    },

    /* ---------------- 第 4 章 ---------------- */
    {
      id: 'integral',
      title: '积分：面积的逆运算',
      intro: '把无穷多个无穷窄的矩形加起来。黎曼和的极限定义了定积分，而微积分基本定理揭示了它与导数的惊人互逆。',
      princeton: 'MAT 103 · 第 5 章',
      sections: [
        { type: 'text', title: '曲边梯形的面积', body: String.raw`<p>直线围成的图形有公式，曲线围成的呢？阿基米德用「切片—求和—取极限」算出了抛物线弓形面积，这个思路的一般化就是<strong>定积分</strong>：把 $[a,b]$ 切成 $n$ 片，每片用矩形近似，片宽趋零时矩形面积之和的极限就是曲线下的（带符号）面积。</p>` },
        { type: 'viz', id: 'riemannSum' },
        { type: 'definition', title: '定积分的定义', pu: 'MAT 103 · Rudin 第 6 章的严格版', body: String.raw`<p>分割 $[a,b]$：$a = x_0 < x_1 < \cdots < x_n = b$，取样本点 $x_i^{\ast} \in [x_{i-1}, x_i]$，令 $\Delta x_i = x_i - x_{i-1}$，$\lambda = \max \Delta x_i$：</p>$$\int_a^b f(x)\,dx = \lim_{\lambda \to 0}\sum_{i=1}^{n} f(x_i^{\ast})\,\Delta x_i$$<p>若极限与分割方式、样本点选取无关，称 $f$ <strong>可积</strong>。连续函数必可积（第三部将证明）。$\int$ 是拉长的 S——Sum 的遗迹。样本点取左端、右端还是中点，极限都一样；但 Darboux 上和与下和提供了更漂亮的严格框架：上积分 = 下积分 ⟺ 可积。</p>` },
        { type: 'theorem', title: '微积分基本定理（FTC）', pu: 'MAT 103 · 全书高潮', body: String.raw`<p><strong>第一部分（变上限求导）：</strong>若 $f$ 连续，则</p>$$F(x) = \int_a^x f(t)\,dt \quad \Rightarrow \quad F'(x) = f(x)$$<p><strong>第二部分（牛顿-莱布尼茨公式）：</strong>若 $F' = f$，则</p>$$\int_a^b f(x)\,dx = F(b) - F(a)$$<p>这是微积分的<strong>最高峰</strong>：求面积（无限求和）与求切线（极限差商）互为逆运算。局部变化率累积成全局增量——「瞬间」与「全程」从此可以互相换算。第一部分说「累积函数的切线斜率就是当前高度」，第二部分说「变化率的全程账单 = 末值减初值」。</p>` },
        { type: 'viz', id: 'areaFunction' },
        { type: 'example', title: '例题 · 牛顿-莱布尼茨公式', body: String.raw`<p><strong>(1)</strong> $\int_0^{\pi}\sin x\,dx = [-\cos x]_0^{\pi} = (-\cos\pi) - (-\cos 0) = 1 + 1 = 2$——正弦拱形下的面积恰是 2。</p><p><strong>(2)</strong> $\int_1^e \frac{\ln x}{x}\,dx$：凑微分 $u = \ln x$，$du = \frac{dx}{x}$，原函数 $\frac{(\ln x)^2}{2}$，值得 $\frac{1}{2} - 0 = \frac{1}{2}$。</p><p><strong>(3)</strong> 变上限求导：$\frac{d}{dx}\int_0^x \sin(t^2)\,dt = \sin(x^2)$——不必算出积分，FTC 第一部分直接给答案。</p>` },
        { type: 'exercises' }
      ],
      keyPoints: [
        '定积分 = 黎曼和的极限：切细、近似、求和、取极限',
        'FTC 第一部分：变上限积分的导数就是被积函数',
        'FTC 第二部分（牛顿-莱布尼茨）：积分 = 任一原函数的末初差',
        '定积分的线性、区间可加性、与被积函数在有限个点改值无关',
        '「求面积」与「求切线」互逆——微积分之所以成为一个整体'
      ],
      exercises: [
        { id: 'i-ex1', type: 'choice', diff: 1,
          question: String.raw`$\int_0^{\pi}\sin x\,dx = $ ?`,
          options: [String.raw`$2$`, String.raw`$0$`, String.raw`$1$`, String.raw`$\pi$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>找原函数：$(-\cos x)' = \sin x$。</p><p><span class="step-tag">Step 2</span>牛顿-莱布尼茨：$[-\cos x]_0^{\pi} = (-\cos\pi) - (-\cos 0) = 1 + 1 = 2$。</p><p><span class="step-tag">几何直觉</span>正弦一拱的面积恰为 2——在实验室里用黎曼和验证，$n$ 越大和越贴近 2。</p><p><span class="step-tag">易错点</span>选 0 的同学把「$\sin$ 关于 $\pi$ 反对称」误当成面积抵消——那是 $\int_0^{2\pi}$ 的情形。</p>` },
        { id: 'i-ex2', type: 'choice', diff: 2,
          question: String.raw`$\dfrac{d}{dx}\displaystyle\int_0^x \sin(t^2)\,dt = $ ?（$\sin(t^2)$ 没有初等原函数）`,
          options: [String.raw`$\sin(x^2)$`, String.raw`$2x\cos(x^2)$`, String.raw`$\cos(x^2)$`, String.raw`无法计算$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>被积函数 $f(t) = \sin(t^2)$ 连续，FTC 第一部分适用。</p><p><span class="step-tag">Step 2</span>$F(x) = \int_0^x f(t)\,dt$ 的导数就是 $f(x) = \sin(x^2)$——<strong>不需要</strong>写出 $F$ 的显式表达式。</p><p><span class="step-tag">辨析</span>$2x\cos(x^2)$ 是 $\sin(x^2)$ 的导数，不是它的积分的导数；「先积分再求导」完好如初，正如「先求导再积分」差个常数。</p>` },
        { id: 'i-ex3', type: 'numeric', diff: 2, answer: 0.5, tolerance: 0.01,
          question: String.raw`$\int_1^{e}\dfrac{\ln x}{x}\,dx = $ <em>（填数值）</em>`,
          solution: String.raw`<p><span class="step-tag">Step 1</span>凑微分：$u = \ln x$，$du = \frac{dx}{x}$；$x: 1 \to e$ 对应 $u: 0 \to 1$。</p><p><span class="step-tag">Step 2</span>积分变为 $\int_0^1 u\,du = \frac{u^2}{2}\Big|_0^1 = \frac{1}{2}$。</p><p><span class="step-tag">技巧本质</span>看到 $\frac{1}{x}$ 与 $\ln x$ 同时出现，几乎必然是 $\ln$ 换元——$e$ 作为上限是强烈的提示。</p>` },
        { id: 'i-ex4', type: 'numeric', diff: 3, answer: 0.1667, tolerance: 0.005,
          question: String.raw`曲线 $y = x^2$ 与直线 $y = x$ 围成的封闭图形的面积是 <em>（填数值，提示：$\frac{1}{6} \approx 0.1667$）</em>`,
          solution: String.raw`<p><span class="step-tag">Step 1</span>求交点：$x^2 = x \Leftrightarrow x(x-1) = 0$，交于 $(0,0)$ 与 $(1,1)$。</p><p><span class="step-tag">Step 2</span>在 $(0,1)$ 内直线在上：上减下，$x - x^2 \geq 0$。</p><p><span class="step-tag">Step 3</span>$A = \int_0^1 (x - x^2)\,dx = \frac{x^2}{2} - \frac{x^3}{3}\Big|_0^1 = \frac{1}{2} - \frac{1}{3} = \frac{1}{6} \approx 0.1667$。</p><p><span class="step-tag">方法论</span>面积问题 = 找交点 + 判上下 + 逐段积分（上 − 下）。</p>` }
      ]
    },

    /* ---------------- 第 5 章 ---------------- */
    {
      id: 'techniques',
      title: '积分技巧',
      intro: '原函数没有通用算法，但有三件兵器：换元、分部、部分分式。掌握它们，常见函数的积分尽入囊中。',
      princeton: 'MAT 104 · 第 6 章',
      sections: [
        { type: 'text', title: '为什么积分比求导难', body: String.raw`<p>求导有算法：任何初等函数按法则逐步求，结果必是初等函数。积分却是<strong>逆向猜测</strong>：知道 $f$，找一个 $F$ 使 $F' = f$。更糟的是，$\sin(x^2)$、$\frac{e^x}{x}$ 这类函数的原函数根本写不成初等函数。好在三大技巧覆盖了绝大多数考试与物理中出现的积分。</p>` },
        { type: 'text', title: '换元法（u-替换）', pu: 'MAT 104', body: String.raw`<p>链式法则的逆用。若被积函数含 $g(x)$ 与 $g'(x)$ 的组合，令 $u = g(x)$：</p>$$\int f(g(x))\,g'(x)\,dx = \int f(u)\,du$$<p><strong>三角换元</strong>处理根号：$\sqrt{a^2 - x^2}$ 令 $x = a\sin\theta$；$\sqrt{a^2 + x^2}$ 令 $x = a\tan\theta$；$\sqrt{x^2 - a^2}$ 令 $x = a\sec\theta$。根号世界由此回到三角世界。</p>` },
        { type: 'example', title: '例题 · 换元法两例', body: String.raw`<p><strong>(1)</strong> $\int x e^{x^2}\,dx$：令 $u = x^2$，$du = 2x\,dx$，$\int \frac{1}{2}e^u\,du = \frac{1}{2}e^{x^2} + C$。</p><p><strong>(2)</strong> $\int_0^1 \frac{dx}{1+x^2}$：令 $x = \tan\theta$，$dx = \sec^2\theta\,d\theta$，分母 $= \sec^2\theta$，积分化为 $\int_0^{\pi/4} d\theta = \frac{\pi}{4}$——$\pi$ 就这样从换元中现身。</p>` },
        { type: 'text', title: '分部积分', pu: 'MAT 104', body: String.raw`<p>乘积求导法则的逆用：</p>$$\int u\,dv = uv - \int v\,du$$<p>口诀「反对幂三指」：按<strong>反三角、对数、幂、三角、指数</strong>的顺序选 $u$（排前者留作 $u$，排后者进 $dv$）。典型如 $\int x e^x dx$、$\int \ln x\,dx$、$\int x\sin x\,dx$。循环式（如 $\int e^x \sin x\,dx$）积分两次后解方程。</p>` },
        { type: 'example', title: '例题 · 分部积分两例', body: String.raw`<p><strong>(1)</strong> $\int_0^1 x e^x\,dx$：$u = x$，$dv = e^x dx$，则 $= [x e^x]_0^1 - \int_0^1 e^x dx = e - (e - 1) = 1$。</p><p><strong>(2)</strong> $\int \ln x\,dx$：$u = \ln x$，$dv = dx$，则 $= x\ln x - \int x\cdot\frac{1}{x}dx = x\ln x - x + C$——对数积分竟是「对数乘线性再减线性」。</p>` },
        { type: 'text', title: '有理函数的部分分式', pu: 'MAT 104', body: String.raw`<p>任何真分式 $\frac{P(x)}{Q(x)}$ 都能拆成简单分式之和：分母的一次因子贡献 $\frac{A}{x - r}$，二次因子贡献 $\frac{Bx + C}{x^2 + px + q}$。拆开后每一项都是可积的（对数或反正切）。例如</p>$$\frac{1}{x^2 - 1} = \frac{1}{2}\left(\frac{1}{x-1} - \frac{1}{x+1}\right) \quad \Rightarrow \quad \int\frac{dx}{x^2-1} = \frac{1}{2}\ln\left|\frac{x-1}{x+1}\right| + C$$<p>有理函数的原函数<strong>必定</strong>是初等函数（有理 + 对数 + 反正切的组合）——这是这个技巧最漂亮的定理性质。</p>` },
        { type: 'exercises' }
      ],
      keyPoints: [
        '积分是逆向猜测，三大兵器：换元、分部、部分分式',
        '换元 = 链式法则逆用；看到 f(g(x))·g\'(x) 的结构就令 u = g(x)',
        '三角换元拆根号：√(a²−x²)→x=a sinθ，√(a²+x²)→x=a tanθ',
        '分部积分 ∫u dv = uv − ∫v du；选 u 按「反对幂三指」',
        '有理函数部分分式化后必可积，原函数 = 有理 + ln + arctan'
      ],
      exercises: [
        { id: 'tc-ex1', type: 'choice', diff: 1,
          question: String.raw`$\int x\,e^{x^2}\,dx = $ ?`,
          options: [String.raw`$\frac{1}{2}e^{x^2} + C$`, String.raw`$e^{x^2} + C$`, String.raw`$2e^{x^2} + C$`, String.raw`$\frac{1}{3}e^{x^3} + C$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>识别结构：$e^{x^2}$ 的内层是 $x^2$，旁边恰好有 $x\,dx$（内层导数的 $\frac{1}{2}$ 倍）。</p><p><span class="step-tag">Step 2</span>令 $u = x^2$，$du = 2x\,dx$，即 $x\,dx = \frac{1}{2}du$。</p><p><span class="step-tag">Step 3</span>$\int x e^{x^2}dx = \frac{1}{2}\int e^u du = \frac{1}{2}e^{x^2} + C$。</p><p><span class="step-tag">验算</span>对结果求导：$\frac{1}{2} \cdot 2x e^{x^2} = x e^{x^2}$ ✓。养成「积分完必求导验算」的习惯。</p>` },
        { id: 'tc-ex2', type: 'choice', diff: 2,
          question: String.raw`$\int_0^1 x\,e^{x}\,dx = $ ?`,
          options: [String.raw`$1$`, String.raw`$e - 1$`, String.raw`$e$`, String.raw`$2 - e$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>分部积分：$u = x$（求导变简单），$dv = e^x dx$（积分不变形）。</p><p><span class="step-tag">Step 2</span>$\int_0^1 x e^x dx = [x e^x]_0^1 - \int_0^1 e^x dx = e - (e - 1) = 1$。</p><p><span class="step-tag">直觉</span>$x e^x$ 在 $[0,1]$ 上最大不超过 $e$、宽度 1，但 $x$ 把左半压小——答案 1 合理。若选 $u = e^x$ 会陷入循环（分部后回到原积分），「幂作 u」是正解。</p>` },
        { id: 'tc-ex3', type: 'choice', diff: 2,
          question: String.raw`$\int\dfrac{dx}{x^2 - 1} = $ ?`,
          options: [String.raw`$\frac{1}{2}\ln\left|\frac{x-1}{x+1}\right| + C$`, String.raw`$\frac{1}{2}\ln\left|\frac{x+1}{x-1}\right| + C$`, String.raw`$\ln|x^2 - 1| + C$`, String.raw`$\arctan x + C$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>部分分式：$\frac{1}{x^2-1} = \frac{1}{(x-1)(x+1)} = \frac{1}{2}\left(\frac{1}{x-1} - \frac{1}{x+1}\right)$（通分验证分子 $= \frac{1}{2}[(x+1)-(x-1)] = 1$ ✓）。</p><p><span class="step-tag">Step 2</span>逐项积分：$\frac{1}{2}(\ln|x-1| - \ln|x+1|) + C = \frac{1}{2}\ln\left|\frac{x-1}{x+1}\right| + C$。</p><p><span class="step-tag">易错点</span>选 B 是符号颠倒（分子分母弄反）；选 C 忘了链式因子——$\ln|x^2-1|$ 求导是 $\frac{2x}{x^2-1}$，多出一个 $2x$。</p>` },
        { id: 'tc-ex4', type: 'numeric', diff: 3, answer: 0.7854, tolerance: 0.001,
          question: String.raw`用三角换元 $x = \tan\theta$ 计算 $\int_0^1 \dfrac{dx}{1 + x^2} = $ <em>（填数值，保留 4 位小数；提示：与 $\pi$ 有关）</em>`,
          solution: String.raw`<p><span class="step-tag">Step 1</span>换元：$x = \tan\theta$，$dx = \sec^2\theta\,d\theta$；$x: 0 \to 1$ 对应 $\theta: 0 \to \frac{\pi}{4}$。</p><p><span class="step-tag">Step 2</span>分母 $1 + \tan^2\theta = \sec^2\theta$，与 $dx$ 中的 $\sec^2\theta$ 相消：积分 $= \int_0^{\pi/4} d\theta = \frac{\pi}{4}$。</p><p><span class="step-tag">Step 3</span>$\frac{\pi}{4} \approx 0.7854$。</p><p><span class="step-tag">深意</span>这个积分正是 $\arctan$ 的定义来源：$(\arctan x)' = \frac{1}{1+x^2}$，故 $\int_0^1 = \arctan 1 - \arctan 0 = \frac{\pi}{4}$——换元法与反函数求导在此握手。</p>` }
      ]
    },

    /* ---------------- 第 6 章 ---------------- */
    {
      id: 'series',
      title: '级数与泰勒展开',
      intro: '无穷多个数可以相加吗？答案取决于部分和是否收敛。泰勒展开则把函数翻译成多项式的无穷级数——计算的万能钥匙。',
      princeton: 'MAT 104 · 第 10–11 章',
      sections: [
        { type: 'text', title: '无穷项相加意味着什么', body: String.raw`<p>$\frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \cdots = 1$（芝诺的乌龟永远追不上），但 $1 + \frac{1}{2} + \frac{1}{3} + \cdots = \infty$（调和级数发散，每一项都在变小却不够快）。<strong>级数不是「加法」，而是部分和序列的极限</strong>：$S_N = a_1 + \cdots + a_N$，若 $S_N \to S$ 则称级数收敛于 $S$。必要条件：$a_n \to 0$（但调和级数证明这不充分）。</p>` },
        { type: 'viz', id: 'seriesSums' },
        { type: 'definition', title: '收敛的判别', pu: 'MAT 104', body: String.raw`<ul class="nice"><li><strong>几何级数：</strong>$\sum ar^n$ 收敛当且仅当 $|r| < 1$，和为 $\frac{a}{1-r}$。</li><li><strong>比较判别：</strong>$0 \leq a_n \leq b_n$ 且 $\sum b_n$ 收敛，则 $\sum a_n$ 收敛。</li><li><strong>比值判别：</strong>$\lim \left|\frac{a_{n+1}}{a_n}\right| = \rho$，$\rho < 1$ 收敛、$\rho > 1$ 发散。</li><li><strong>交错级数（莱布尼茨）：</strong>$a_n$ 单调趋零，则 $\sum (-1)^n a_n$ 收敛，且余项 $|R_N| \leq a_{N+1}$。</li><li><strong>绝对收敛：</strong>$\sum|a_n|$ 收敛 ⟹ $\sum a_n$ 收敛（反之未必）。</li></ul>` },
        { type: 'text', title: '幂级数与收敛半径', body: String.raw`<p>$\sum c_n x^n$ 的收敛域关于 0 对称，由<strong>收敛半径</strong>$R$ 划定：$|x| < R$ 内绝对收敛，$|x| > R$ 发散，端点单独检验。比值判别给出 $R = \lim\left|\frac{c_n}{c_{n+1}}\right|$。幂级数在收敛区间内部可以逐项求导、逐项积分（半径不变）——多项式的自由由此延续到级数世界，其严格依据是第三部的一致收敛理论。</p>` },
        { type: 'viz', id: 'taylorLab' },
        { type: 'definition', title: '泰勒级数', pu: 'MAT 104 · 麦克劳林展开', body: String.raw`<p>若 $f$ 在 0 处无穷次可微，其<strong>泰勒（麦克劳林）级数</strong>为</p>$$f(x) \sim \sum_{k=0}^{\infty}\frac{f^{(k)}(0)}{k!}\,x^k$$<p>五个必须烂熟的展开：</p>$$e^x = \sum_{k=0}^{\infty}\frac{x^k}{k!}, \quad \sin x = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k+1}}{(2k+1)!}, \quad \cos x = \sum_{k=0}^{\infty}\frac{(-1)^k x^{2k}}{(2k)!}$$ $$\frac{1}{1-x} = \sum_{k=0}^{\infty}x^k \ (|x|<1), \quad \ln(1+x) = \sum_{k=1}^{\infty}\frac{(-1)^{k+1}x^k}{k} \ (-1 < x \leq 1)$$<p>级数何时真的等于 $f$？余项 $R_N(x)$ 是否趋零——这是第三部的一致收敛要回答的问题。</p>` },
        { type: 'example', title: '例题 · 用展开算积分与极限', body: String.raw`<p><strong>(1)</strong> 求 $\int_0^{0.5} e^{-x^2}dx$（无初等原函数）：展开 $e^{-x^2} = 1 - x^2 + \frac{x^4}{2} - \cdots$，逐项积分得 $0.5 - \frac{0.125}{3} + \frac{0.03125}{10} - \cdots \approx 0.4613$——级数让「不可积」变得可算。</p><p><strong>(2)</strong> $\lim_{x \to 0}\frac{\sin x - x}{x^3}$：$\sin x = x - \frac{x^3}{6} + \cdots$，分子 $= -\frac{x^3}{6} + \cdots$，极限 $= -\frac{1}{6}$——泰勒是洛必达的批量加速版。</p>` },
        { type: 'exercises' }
      ],
      keyPoints: [
        '级数收敛 = 部分和序列有极限；aₙ→0 只是必要条件',
        '几何级数 |r|<1 收敛于 a/(1−r)；调和级数发散；交错调和收敛于 ln2',
        '判别工具箱：比较、比值、莱布尼茨交错、绝对收敛',
        '幂级数有收敛半径 R，内部可逐项求导积分',
        '五大展开：eˣ、sin、cos、1/(1−x)、ln(1+x)；余项趋零才等于函数本身'
      ],
      exercises: [
        { id: 'se-ex1', type: 'choice', diff: 1,
          question: String.raw`$\sum_{n=1}^{\infty}\dfrac{1}{3^n} = \dfrac{1}{3} + \dfrac{1}{9} + \dfrac{1}{27} + \cdots = $ ?`,
          options: [String.raw`$\frac{1}{2}$`, String.raw`$\frac{1}{3}$`, String.raw`$1$`, String.raw`$\frac{3}{2}$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>首项 $a = \frac{1}{3}$，公比 $r = \frac{1}{3}$，$|r| < 1$ 收敛。</p><p><span class="step-tag">Step 2</span>和 $= \frac{a}{1-r} = \frac{1/3}{2/3} = \frac{1}{2}$。</p><p><span class="step-tag">直觉</span>部分和 $S_N = \frac{1}{2}\left(1 - 3^{-N}\right)$，指数衰减使剩余量迅速归零——芝诺乌龟的算术版。</p>` },
        { id: 'se-ex2', type: 'choice', diff: 2,
          question: String.raw`$\sum_{n=1}^{\infty}\dfrac{n}{n!} = \dfrac{1}{1!} + \dfrac{2}{2!} + \dfrac{3}{3!} + \cdots = $ ?`,
          options: [String.raw`$e$`, String.raw`$1$`, String.raw`$e - 1$`, String.raw`$2e$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>改写通项：$\frac{n}{n!} = \frac{1}{(n-1)!}$（分子一个 $n$ 与分母约掉一个因子）。</p><p><span class="step-tag">Step 2</span>换指标 $k = n - 1$：$\sum_{k=0}^{\infty}\frac{1}{k!} = e$。</p><p><span class="step-tag">Step 3</span>故和为 $e \approx 2.718$。</p><p><span class="step-tag">技巧</span>阶乘级数常通过「约分 + 移位」凑回 $e^x$ 在 $x=1$ 的展开——熟练后一眼可辨。</p>` },
        { id: 'se-ex3', type: 'choice', diff: 2,
          question: String.raw`幂级数 $\sum_{n=1}^{\infty}\dfrac{x^n}{n} = x + \dfrac{x^2}{2} + \dfrac{x^3}{3} + \cdots$ 的收敛半径 $R = $ ?`,
          options: [String.raw`$1$`, String.raw`$e$`, String.raw`$+\infty$`, String.raw`$\frac{1}{2}$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>比值法：$\left|\frac{a_{n+1}}{a_n}\right| = \frac{|x|^{n+1}/(n+1)}{|x|^n/n} = |x|\cdot\frac{n}{n+1} \to |x|$。</p><p><span class="step-tag">Step 2</span>$|x| < 1$ 收敛、$|x| > 1$ 发散，故 $R = 1$。</p><p><span class="step-tag">Step 3</span>端点：$x = 1$ 时是调和级数（发散）；$x = -1$ 时是交错调和（收敛）。收敛域 $[-1, 1)$。</p><p><span class="step-tag">彩蛋</span>在 $(-1,1)$ 内它的和恰是 $-\ln(1-x)$——本章五大展开的亲戚。</p>` },
        { id: 'se-ex4', type: 'numeric', diff: 3, answer: 1.6458, tolerance: 0.001,
          question: String.raw`用 $e^x$ 的 3 阶泰勒多项式 $T_3(x) = 1 + x + \dfrac{x^2}{2} + \dfrac{x^3}{6}$ 近似计算 $e^{0.5}$，得 <em>（填数值，保留 4 位小数）</em>`,
          solution: String.raw`<p><span class="step-tag">Step 1</span>代入 $x = 0.5$：$1 + 0.5 + \frac{0.25}{2} + \frac{0.125}{6}$。</p><p><span class="step-tag">Step 2</span>逐项计算：$1 + 0.5 + 0.125 + 0.0208333 = 1.6458$。</p><p><span class="step-tag">Step 3</span>真值 $e^{0.5} \approx 1.6487$，误差约 $0.0029$——拉格朗日余项 $\frac{e^{\xi}}{4!}x^4 \leq \frac{e^{0.5}}{24}(0.5)^4 \approx 0.0034$，实际误差确实被余项控制住。</p><p><span class="step-tag">方法价值</span>没有计算器也能手算 $e$ 的任意次幂到任意精度——这正是泰勒展开诞生的初衷。</p>` }
      ]
    },

    /* ---------------- 第 7 章 ---------------- */
    {
      id: 'multivar',
      title: '多变量微积分',
      intro: '让微积分进入三维世界：曲面代替曲线，偏导数代替导数，梯度指出最陡的上坡方向，二重积分给曲顶柱体称重。',
      princeton: 'MAT 201',
      sections: [
        { type: 'text', title: '从曲线到曲面', body: String.raw`<p>温度随地点变化 $T(x, y)$、地形高度随经纬度变化 $h(x, y)$——两个自变量的函数图像是一张<strong>曲面</strong>。读懂曲面的两大工具：<strong>等高线</strong>（$f(x,y) = c$ 的水平曲线，地形图的等高线）与<strong>截面</strong>（固定一个变量得一条曲线）。在实验室里拖动光标，看梯度箭头如何处处垂直于等高线、指向最陡上升。</p>` },
        { type: 'viz', id: 'surfaceLab' },
        { type: 'definition', title: '偏导数', pu: 'MAT 201', body: String.raw`<p>固定其他变量、只对一个变量求导：</p>$$\frac{\partial f}{\partial x} = \lim_{h \to 0}\frac{f(x+h, y) - f(x, y)}{h}$$<p>几何意义：沿 $x$ 方向切曲面所得截线的斜率。求法就是「把 $y$ 当常数」。<strong>混合偏导相等定理（Clairaut）：</strong>若 $f_{xy}$ 与 $f_{yx}$ 连续，则 $f_{xy} = f_{yx}$——求导次序无关。切平面的全部信息由两个偏导 $\left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, -1\right)$ 给出。</p>` },
        { type: 'text', title: '梯度：最陡上升的罗盘', pu: 'MAT 201', body: String.raw`<p>把两个偏导打包成向量：</p>$$\nabla f = \left(\frac{\partial f}{\partial x},\ \frac{\partial f}{\partial y}\right)$$<p>它有双重身份：方向——$f$ 增长最快的方向（垂直于等高线）；模长——该方向的方向导数（最大变化率）。任意方向 $\mathbf{u}$ 的方向导数 $D_{\mathbf{u}}f = \nabla f \cdot \mathbf{u}$。物理学家叫它「力场」（势能的负梯度），机器学习叫它「下山方向」（梯度下降）。若 $\nabla f = \mathbf{0}$，则是<strong>驻点</strong>——极大、极小或鞍点，由二阶判别（Hessian 行列式）裁决。</p>` },
        { type: 'definition', title: '二重积分', pu: 'MAT 201', body: String.raw`<p>把曲顶柱体的底面 $D$ 切成小方格，每格上用 $f$ 值乘面积、再求和取极限：</p>$$\iint_D f(x, y)\,dA = \lim_{\lambda \to 0}\sum f(x_i, y_i)\,\Delta A_i$$<p>计算的核心是<strong>化二重为累次</strong>：矩形域上 $\int_a^b\!\!\int_c^d f\,dy\,dx$（先内后外）；一般区域先画图定限。交换积分次序常常是解题的钥匙——有些次序根本积不出来（如 $e^{x^2}$），换个方向就柳暗花明。</p>` },
        { type: 'example', title: '例题 · 梯度与二重积分', body: String.raw`<p><strong>(1)</strong> $f(x,y) = x^2 + y^2$ 在 $(3,4)$：$\nabla f = (6, 8)$，模长 10——该点沿东北偏北方向（$(3,4)$ 径向）上升最快，速率为 10。</p><p><strong>(2)</strong> $\int_0^1\!\!\int_0^x (x + y)\,dy\,dx$：内层 $= \left[xy + \frac{y^2}{2}\right]_0^x = \frac{3x^2}{2}$；外层 $= \frac{3}{2}\cdot\frac{1}{3} = \frac{1}{2}$。</p><p><strong>(3)</strong> 经典换序：$\int_0^1\!\!\int_y^1 e^{x^2}dx\,dy$ 中 $e^{x^2}$ 对 $x$ 不可积，交换次序（区域：$0 \leq y \leq x \leq 1$）得 $\int_0^1 x e^{x^2}dx = \frac{e-1}{2}$。</p>` },
        { type: 'exercises' }
      ],
      keyPoints: [
        '偏导数 = 固定其他变量求导；Clairaut：混合偏导在连续时与次序无关',
        '梯度 ∇f 指向最陡上升、垂直于等高线；任意方向导数 = ∇f·u',
        '驻点 ∇f=0 处用二阶判别（Hessian）区分极大/极小/鞍点',
        '二重积分 = 曲顶柱体体积；化累次积分先画区域定限',
        '换序是利器：∫∫ e^{x²} 型积分换个次序就能算出'
      ],
      exercises: [
        { id: 'm-ex1', type: 'choice', diff: 1,
          question: String.raw`设 $f(x, y) = x^2 y^3$，则 $\dfrac{\partial f}{\partial x} = $ ?`,
          options: [String.raw`$2xy^3$`, String.raw`$3x^2y^2$`, String.raw`$2xy^3 + 3x^2y^2$`, String.raw`$6xy^2$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>把 $y$ 当常数：$y^3$ 整体是系数。</p><p><span class="step-tag">Step 2</span>对 $x^2$ 求导：$\frac{\partial f}{\partial x} = 2x \cdot y^3 = 2xy^3$。</p><p><span class="step-tag">Step 3</span>对照：$\frac{\partial f}{\partial y} = x^2 \cdot 3y^2 = 3x^2y^2$（选项 B 是它，别混）。</p><p><span class="step-tag">验证</span>在实验室输入这个函数思想：沿 $x$ 方向的截面是三次曲线 $y^3 x^2$，其斜率 $2xy^3$ 随 $y$ 放大。</p>` },
        { id: 'm-ex2', type: 'choice', diff: 2,
          question: String.raw`函数 $f(x, y) = x^2 + y^2$ 在点 $(3, 4)$ 处，方向导数的最大值是 ?`,
          options: [String.raw`$10$`, String.raw`$5$`, String.raw`$7$`, String.raw`$25$`],
          answer: 0,
          solution: String.raw`<p><span class="step-tag">Step 1</span>求梯度：$\nabla f = (2x, 2y)$，在 $(3,4)$ 处 $= (6, 8)$。</p><p><span class="step-tag">Step 2</span>方向导数最大值 $= |\nabla f| = \sqrt{36 + 64} = \sqrt{100} = 10$，方向即 $(6,8)$ 单位化（径向朝外）。</p><p><span class="step-tag">几何直觉</span>碗状曲面 $x^2+y^2$ 上每一点的最陡上升方向都是「径向远离碗底」——梯度场从原点向外辐射，处处垂直于圆形等高线。</p>` },
        { id: 'm-ex3', type: 'numeric', diff: 2, answer: 3.61, tolerance: 0.02,
          question: String.raw`函数 $f(x, y) = xy$ 在点 $(2, 3)$ 处沿梯度方向的方向导数是 <em>（填数值，保留 2 位小数；提示：与 $\sqrt{13}$ 有关）</em>`,
          solution: String.raw`<p><span class="step-tag">Step 1</span>$\nabla f = (y, x)$，在 $(2, 3)$ 处 $= (3, 2)$。</p><p><span class="step-tag">Step 2</span>沿梯度方向的方向导数就是梯度的模：$\sqrt{3^2 + 2^2} = \sqrt{13} \approx 3.6056 \approx 3.61$。</p><p><span class="step-tag">Step 3</span>沿其它任何方向 $\mathbf{u}$，方向导数 $= \nabla f \cdot \mathbf{u} \leq |\nabla f|$——夹角余弦至多为 1。</p><p><span class="step-tag">辨析</span>「方向导数的最大值」恒等于 $|\nabla f|$，不必再乘什么；最小值是 $-|\nabla f|$（反向，最陡下降）。</p>` },
        { id: 'm-ex4', type: 'numeric', diff: 3, answer: 0.8591, tolerance: 0.001,
          question: String.raw`积分 $\int_0^1\!\!\int_y^1 e^{x^2}\,dx\,dy$ 中 $e^{x^2}$ 没有初等原函数。画出区域并<strong>交换积分次序</strong>后求得其值为 <em>（填数值，保留 4 位小数；提示：$\frac{e-1}{2}$）</em>`,
          solution: String.raw`<p><span class="step-tag">Step 1</span>画区域：内层 $x$ 从 $y$ 到 $1$、外层 $y$ 从 $0$ 到 $1$——即三角形 $0 \leq y \leq x \leq 1$（对角线下方）。</p><p><span class="step-tag">Step 2</span>换序：先 $y$ 后 $x$，则 $y$ 从 $0$ 到 $x$：$\int_0^1\!\!\int_0^x e^{x^2}\,dy\,dx$。</p><p><span class="step-tag">Step 3</span>内层 $e^{x^2}$ 对 $y$ 是常数：$= \int_0^1 x\,e^{x^2}\,dx$。</p><p><span class="step-tag">Step 4</span>令 $u = x^2$：$= \frac{1}{2}\int_0^1 e^u du = \frac{e-1}{2} \approx 0.8591$。</p><p><span class="step-tag">方法价值</span>「积不出来」常常只是「这个次序积不出来」——换序是多变量微积分的第一生存技能。</p>` }
      ]
    }
  ]
});
