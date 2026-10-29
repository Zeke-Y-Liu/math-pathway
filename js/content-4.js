/* ============================================================
   第四部 · 分析四部曲 — Stein 序列（普林斯顿高年级核心分析课程）
   ============================================================ */
window.COURSE_DIVISIONS = window.COURSE_DIVISIONS || [];

window.COURSE_DIVISIONS.push({
  id: 'stein',
  roman: 'IV',
  title: '分析四部曲 · Stein 序列',
  shortName: '分析四部曲',
  princeton: 'MAT 325 · 335 · 425 · 520',
  color: '#8E3B6B',
  desc: '傅里叶、复分析、测度论、泛函分析——Stein 与 Shakarchi 四卷本《普林斯顿分析讲义》的思想地图。',
  chapters: [

  /* ---------------- 第 1 章 ---------------- */
  {
    id: 'fourier',
    title: '傅里叶分析：分解振动的艺术',
    intro: '任何声音都是纯音的叠加，任何信号都是频率的织锦——傅里叶分析教我们把复杂的波拆解成简单的正弦。',
    princeton: 'MAT 325 · Stein & Shakarchi 卷 I',
    sections: [
      { type: 'text', title: '从一根振动的弦说起', body: String.raw`<p>1807 年，傅里叶向巴黎科学院宣称：<strong>任意函数都可以表示为正弦与余弦的无穷叠加</strong>。这一断言在当时引起 Lagrange 等人的激烈反对——「任意」二字太狂妄了。此后一个半世纪的严格化工作，恰恰催生了现代分析学的半壁江山：狄利克雷给出了收敛的第一个充分条件，黎曼为研究三角级数发明了黎曼积分，康托尔为研究唯一性问题发明了集合论，勒贝格为完成这门理论发明了勒贝格积分。</p><p>这就是普林斯顿把《傅里叶分析》作为分析四部曲<strong>第一卷</strong>的深意：它不是分析学的一个分支，而是分析学的<strong>发动机</strong>。弦振动方程 $\frac{\partial^2 u}{\partial t^2}=\frac{\partial^2 u}{\partial x^2}$ 的解法——叠加驻波——正是傅里叶级数的出生证明。</p>` },
      { type: 'definition', title: '傅里叶级数', pu: 'Stein & Shakarchi 卷 I §1.2', body: String.raw`<p>对 $[-\pi, \pi]$ 上的「足够好」的函数 $f$，其傅里叶系数与傅里叶级数定义为：</p>$$a_k = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\cos kx\,dx, \qquad b_k = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin kx\,dx$$ $$f(x) \sim \frac{a_0}{2} + \sum_{k=1}^{\infty}\left(a_k\cos kx + b_k\sin kx\right)$$<p>系数公式本身就是一次「投影」：把 $f$ 向正交基 $\{\cos kx, \sin kx\}$ 投影，取内积——这与三维空间中向坐标轴投影毫无区别，只是内积换成了 $\langle f, g\rangle = \int f\,g\,dx$。这是卷 III 中 Hilbert 空间理论的第一预告。</p>` },
      { type: 'viz', id: 'fourierSquare' },
      { type: 'theorem', title: '两个里程碑定理', pu: 'Stein & Shakarchi 卷 I 第 2–3 章', body: String.raw`<p><strong>（1）收敛定理（简化版）：</strong>若 $f$ 分段光滑，则其傅里叶级数在每点收敛于 $\frac{f(x^+)+f(x^-)}{2}$——左右极限的平均。在跳变点处，级数「折中」地收敛，既不到左边也不到右边。</p><p><strong>（2）Parseval 等式：</strong>若 $f$ 平方可积，则</p>$$\frac{1}{\pi}\int_{-\pi}^{\pi}|f(x)|^2\,dx = \frac{a_0^2}{2} + \sum_{k=1}^{\infty}\left(a_k^2 + b_k^2\right)$$<p>「时域的能量 = 频域的能量」。对 $f(x)=\text{sign}(\sin x)$（方波）应用它，把 $b_k = \frac{4}{\pi k}$（$k$ 奇）代入，立刻得到巴塞尔问题的亲戚：</p>$$\sum_{k \text{ 奇}}^{\infty}\frac{1}{(2k-1)^2} = \frac{\pi^2}{8}$$` },
      { type: 'text', title: '吉布斯现象：诚实的过冲', body: String.raw`<p>在实验室里把方波的谐波数拉到很大，你会发现在每个跳变点附近，部分和<strong>始终</strong>高出目标约 $9\%$（精确值 $\frac{2}{\pi}\int_0^{\pi}\frac{\sin t}{t}\,dt - 1 \approx 8.9\%$）。过冲的高度不随 $N$ 减小，只是宽度越来越窄——这就是<strong>吉布斯现象</strong>。它不是计算的失败，而是逐点收敛的内在特性：收敛是「点对点」的诚实，却不必是「一刀切」的顺从。消除它的办法（Fejér 求和：算术平均部分和）反而收敛得更好——这是卷 I 的精彩一章。</p>` },
      { type: 'note', title: '通往何处', body: String.raw`<p>把周期去掉，级数就变成<strong>傅里叶变换</strong> $\hat{f}(\xi)=\int_{-\infty}^{\infty}f(x)e^{-2\pi i x\xi}\,dx$——信号处理、量子力学、偏微分方程的通用语言。卷 I 的后半部分用它求解热方程与波动方程，证明等周不等式，甚至给出「处处连续处处不可微函数存在性」的傅里叶证明，以及海森堡不确定性原理的一个严格版本。</p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      '傅里叶系数 = 向正交基 $\\{\\cos kx, \\sin kx\\}$ 的投影：$a_k=\\frac{1}{\\pi}\\int f\\cos kx\\,dx$',
      '分段光滑 ⟹ 级数收敛于左右极限的平均；跳变点处有 ≈8.9% 的吉布斯过冲',
      'Parseval：时域能量 = 频域能量；由方波可导出 $\\sum 1/(2k-1)^2=\\pi^2/8$',
      '傅里叶分析是现代分析的发动机：它逼出了黎曼积分、集合论与勒贝格积分'
    ],
    exercises: [
      { id: 'fo-ex1', type: 'choice', diff: 1,
        question: String.raw`奇函数 $f$（如方波 $\text{sign}(\sin x)$）的傅里叶级数只包含哪些项？`,
        options: ['正弦项（$\\sin kx$）', '余弦项（$\\cos kx$）', '常数项', '正弦与余弦项都包含'],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>奇函数满足 $f(-x)=-f(x)$，而 $\cos kx$ 是偶函数、$\sin kx$ 是奇函数。</p><p><span class="step-tag">Step 2</span>$a_k=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cos kx\,dx$ 中被积函数为「奇×偶 = 奇」，对称区间积分为零。</p><p><span class="step-tag">Step 3</span>$b_k$ 中被积函数为「奇×奇 = 偶」，一般不为零。故奇函数只含正弦项（偶函数只含余弦项与常数项）——对称性直接砍掉一半计算量。</p>` },
      { id: 'fo-ex2', type: 'numeric', diff: 3, answer: 1.234, tolerance: 0.01,
        question: String.raw`由 Parseval 等式，$\sum_{k=1}^{\infty}\frac{1}{(2k-1)^2} = \frac{\pi^2}{8} \approx$ <em>（填数值，保留三位小数）</em>`,
        solution: String.raw`<p><span class="step-tag">Step 1</span>对 $f(x)=\text{sign}(\sin x)$（±1 方波），$\frac{1}{\pi}\int_{-\pi}^{\pi}f^2 = \frac{1}{\pi}\cdot 2\pi = 2$。</p><p><span class="step-tag">Step 2</span>其系数 $b_k=\frac{4}{\pi k}$（仅奇 $k$），代入 Parseval：$2 = \sum_{k\text{ 奇}}\frac{16}{\pi^2 k^2}$。</p><p><span class="step-tag">Step 3</span>解出 $\sum_{k\text{ 奇}}\frac{1}{k^2} = \frac{\pi^2}{8} \approx 1.2337$。再由 $\sum\frac{1}{n^2}=\frac{\pi^2}{6}$ 减去偶数部分 $\frac{1}{4}\cdot\frac{\pi^2}{6}$，交叉验证同为 $\frac{\pi^2}{8}$ ✓——能量等式是求级数值的利器。</p>` },
      { id: 'fo-ex3', type: 'choice', diff: 2,
        question: String.raw`关于吉布斯现象，正确的说法是？`,
        options: [
          '跳变点附近部分和的过冲高度不随项数 $N$ 增大而消失，但宽度变窄',
          '过冲高度随 $N$ 增大而趋于零',
          '它是数值计算的舍入误差造成的',
          '只有方波才出现，锯齿波不会出现'
        ],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>吉布斯现象的本质是<strong>逐点收敛不一致</strong>：每个固定的 $x$ 处 $S_N(x)$ 确实收敛到目标值，但「最坏处的偏差」$\sup|S_N - f|$ 不趋于零。</p><p><span class="step-tag">Step 2</span>过冲极限高度约为 $8.9\%$（$\frac{2}{\pi}\int_0^{\pi}\frac{\sin t}{t}dt - 1$），与 $N$ 无关；过冲区域宽度按 $\frac{1}{N}$ 量级收缩，能量趋于零。</p><p><span class="step-tag">Step 3</span>任何有跳变的分段光滑函数（锯齿波、三角波在折点处连续故无此现象，但带跳变的波形都有）都会出现——它是收敛定理在跳变点「取左右极限平均」的几何代价。在实验室中拖大 $N$ 即可亲眼看到。</p>` },
      { id: 'fo-ex4', type: 'choice', diff: 3,
        question: String.raw`Riemann–Lebesgue 引理断言：对可积函数 $f$，$\int_{-\pi}^{\pi}f(x)\sin nx\,dx \to$ ？（$n\to\infty$）`,
        options: ['$0$', '$\\pi$', '$\\int f$', '极限一般不存在'],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>直觉：$n$ 越大，$\sin nx$ 振荡越快，正负半周几乎抵消；$f$ 的「权重」来不及变化，贡献成对相消。</p><p><span class="step-tag">Step 2</span>严格证明的阶梯：对特征函数（区间示性）直接算 $\int_a^b \sin nx\,dx = \frac{\cos na - \cos nb}{n}\to 0$；阶梯函数有限叠加仍成立；再用阶梯函数逼近可积函数。</p><p><span class="step-tag">Step 3</span>推论：一切可积函数的傅里叶系数 $a_k, b_k \to 0$——频率越高，投影越小。这是「高频成分必然微弱」的普适定律，也是卷 I 一切收敛定理的基石。</p>` }
    ]
  },

  /* ---------------- 第 2 章 ---------------- */
  {
    id: 'complex',
    title: '复分析：全纯的奇迹',
    intro: '在复数域上要求函数可导，是一个强得惊人的条件——由此迸发出分析学中最完美的一族定理。',
    princeton: 'MAT 335 · Stein & Shakarchi 卷 II',
    sections: [
      { type: 'text', title: '一个平方根引发的新大陆', body: String.raw`<p>解 $x^2=-1$ 需要 $i$；而一旦接受 $i$，代数基本定理立刻给出圆满：$n$ 次多项式恰有 $n$ 个复根。复数域 $\mathbb{C}$ 是<strong>代数封闭</strong>的。但真正的奇迹发生在分析层面：在 $\mathbb{C}$ 上定义「可导」，得到的函数（全纯函数）刚性极强——知道一个圆盘边界上的值，内部的一切就被完全决定。</p><p>复平面不是二维图纸的简单重复：$\mathbb{R}^2$ 上的可微只要求各方向导数存在，而复可导要求<strong>极限 $\lim_{h\to 0}\frac{f(z+h)-f(z)}{h}$ 沿所有方向一致存在</strong>——这个「所有方向一致」正是第三部一致收敛思想的又一次回响。</p>` },
      { type: 'viz', id: 'complexMap' },
      { type: 'definition', title: '全纯函数与 C–R 方程', pu: 'Stein & Shakarchi 卷 II §1.2', body: String.raw`<p>设 $f(z) = u(x,y) + iv(x,y)$。$f$ 在 $z$ 处<strong>全纯</strong>（holomorphic）指上述差商极限存在。它强迫实部与虚部满足 <strong>Cauchy–Riemann 方程</strong>：</p>$$\frac{\partial u}{\partial x} = \frac{\partial v}{\partial y}, \qquad \frac{\partial u}{\partial y} = -\frac{\partial v}{\partial x}$$<p>几何意义：$f$ 的 Jacobi 矩阵对角元皆为 $a$、反对角元为 $-b$ 与 $b$——正是「旋转 × 伸缩」复合所对应的结构（保角映射）。在实验室里拖动网格，你会看到：经全纯映射后，水平线与竖直线依然<strong>垂直相交</strong>。</p>` },
      { type: 'theorem', title: '柯西积分定理与积分公式', pu: 'Stein & Shakarchi 卷 II 第 2–3 章', body: String.raw`<p><strong>柯西积分定理：</strong>若 $f$ 在单连通区域 $\Omega$ 内全纯，则沿 $\Omega$ 内任意闭曲线 $\gamma$：</p>$$\int_{\gamma} f(z)\,dz = 0$$<p><strong>柯西积分公式：</strong>而边界值完全决定内部值：</p>$$f(z_0) = \frac{1}{2\pi i}\int_{\partial D}\frac{f(z)}{z - z_0}\,dz$$<p>这是「三大奇迹」的开端：由积分公式反复求导可知全纯函数<strong>无穷次可导</strong>，且局部可展开为幂级数（解析）。$\mathbb{R}$ 上「一阶可导推不出二阶」的松散世界，在 $\mathbb{C}$ 上被彻底改写：<strong>一阶可导即无穷阶可导</strong>。</p>` },
      { type: 'theorem', title: '留数定理', pu: 'Stein & Shakarchi 卷 II 第 3 章', body: String.raw`<p>若 $f$ 在闭曲线 $\gamma$ 内除孤立奇点 $z_1,\ldots,z_n$ 外全纯，则</p>$$\int_{\gamma}f(z)\,dz = 2\pi i\sum_{k=1}^{n}\text{Res}_{z_k}f$$<p>其中留数 $\text{Res}_{z_0}f$ 是洛朗展开中 $\frac{1}{z-z_0}$ 项的系数。围道积分被化为「数一数极点的账」。用它计算实积分常常出奇制胜：</p>$$\int_{-\infty}^{\infty}\frac{dx}{1+x^2} = \pi$$<p>——上半平面的一个极点 $z=i$（留数 $\frac{1}{2i}$）就把答案交了出来。卷 II 的后半程更用留数与 $\zeta$ 函数证明了<strong>素数定理</strong>：$\pi(x)\sim\frac{x}{\ln x}$——复分析反过来照亮了数论。</p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      '复可导 = 差商极限沿所有方向一致存在 ⟹ C–R 方程 ⟹ 保角（正交网格保持正交）',
      '柯西积分定理：单连通域内全纯 ⟹ 闭路积分为零',
      '柯西积分公式：边界决定内部；一阶可导即无穷阶可导、局部解析',
      '留数定理：围道积分 = $2\\pi i\\times$（内部留数之和），是计算实积分的神器'
    ],
    exercises: [
      { id: 'cx-ex1', type: 'choice', diff: 1,
        question: String.raw`$f(z)=z^2$ 在 $z=1+i$ 处的导数为？`,
        options: ['$2+2i$', '$2i$', '$2$', '$4i$'],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>多项式在 $\mathbb{C}$ 上处处全纯，求导法则与实数完全相同：$f'(z)=2z$。</p><p><span class="step-tag">Step 2</span>代入 $z=1+i$：$f'(1+i)=2(1+i)=2+2i$。</p><p><span class="step-tag">几何</span>导数 $2+2i=2\sqrt{2}\,e^{i\pi/4}$：该点处映射把微小向量放缩 $2\sqrt2$ 倍并旋转 $45°$——这正是「局部旋转+伸缩」的保角含义。</p>` },
      { id: 'cx-ex2', type: 'choice', diff: 2,
        question: String.raw`柯西积分定理的成立条件是？`,
        options: [
          '$f$ 在单连通区域内全纯，$\\gamma$ 为该区域内的闭曲线',
          '$f$ 在闭曲线上连续即可',
          '$f$ 在整个复平面全纯',
          '$\\gamma$ 必须是单位圆'
        ],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>两个条件缺一不可：<strong>全纯</strong>保证局部原函数存在；<strong>单连通</strong>保证闭曲线能连续收缩为一点，局部结果拼成整体。</p><p><span class="step-tag">Step 2</span>经典反例：$f(z)=\frac{1}{z}$ 在 $\mathbb{C}\setminus\{0\}$ 全纯，但沿单位圆积分 $\int\frac{dz}{z}=2\pi i\neq 0$——因为区域挖掉了原点，不再单连通。</p><p><span class="step-tag">Step 3</span>这个「反例」不是灾难而是钥匙：$\frac{1}{z}$ 的 $2\pi i$ 正是留数定理的原始形态，一切围道积分理论由此生长。</p>` },
      { id: 'cx-ex3', type: 'numeric', diff: 2, answer: 2.83, tolerance: 0.02,
        question: String.raw`映射 $w=z^2$ 在点 $z=1+i$ 处的局部放缩倍数（导数的模）为？<em>（填数值，保留两位小数）</em>`,
        solution: String.raw`<p><span class="step-tag">Step 1</span>$f'(z)=2z$，故 $f'(1+i)=2+2i$。</p><p><span class="step-tag">Step 2</span>放缩倍数 $=|f'(1+i)|=|2+2i|=\sqrt{2^2+2^2}=2\sqrt2\approx 2.83$；旋转角 $=\arg(2+2i)=\frac{\pi}{4}$。</p><p><span class="step-tag">验证</span>在实验室中把探针点拖到 $1+i$ 附近：$z$ 平面中小方格被拉伸约 $2.83$ 倍并旋转 $45°$ 后成为 $w$ 平面中的平行四边形。</p>` },
      { id: 'cx-ex4', type: 'choice', diff: 3,
        question: String.raw`「三大奇迹」中，与柯西积分公式直接相关的是？`,
        options: [
          '全纯函数自动无穷次可导且局部解析',
          '全纯函数的模在内部无极大值',
          '解析延拓的唯一性',
          '刘维尔定理'
        ],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>柯西积分公式 $f(z_0)=\frac{1}{2\pi i}\int_{\partial D}\frac{f(z)}{z-z_0}\,dz$ 中，被积函数关于 $z_0$「友好」，可在积分号下对 $z_0$ 无穷次求导。</p><p><span class="step-tag">Step 2</span>逐次求导给出 $f^{(n)}(z_0)=\frac{n!}{2\pi i}\int\frac{f(z)}{(z-z_0)^{n+1}}\,dz$——一切阶导数都存在，且 Taylor 展开成立。</p><p><span class="step-tag">注</span>其余三个选项也都是全纯函数的「奇迹」（最大模原理、解析延拓、Liouville：有界整函数为常数），但它们都是积分公式的<strong>推论</strong>——一个公式生出整座定理花园，这正是 Stein 称之为「miracle」的原因。</p>` }
    ]
  },

  /* ---------------- 第 3 章 ---------------- */
  {
    id: 'measure',
    title: '测度与勒贝格积分：重新学会积分',
    intro: '把「竖着切」换成「横着切」，积分的力量发生了质变——这就是勒贝格的革命。',
    princeton: 'MAT 425 · Stein & Shakarchi 卷 III',
    sections: [
      { type: 'text', title: '黎曼积分的失败清单', body: String.raw`<p>第三部末尾我们看到 Dirichlet 函数黎曼不可积：任何子区间上振幅都是 1。更深的病根在于黎曼的<strong>竖切</strong>哲学——它要求每个竖条内部函数「几乎平坦」，对剧烈振荡的函数无能为力。此外极限与积分的交换在黎曼理论中条件苛刻，而傅里叶分析恰恰处处需要交换次序。</p><p>勒贝格的天才在于调转方向：<strong>按函数值水平集分桶</strong>。他自己的比喻——「我必须缴纳一笔按收入递增的税款：黎曼按每笔收入逐项计算（竖切），我按收入档位统计每档人数再求和（横切）」。当收入明细混乱时，档位统计依然井井有条。</p>` },
      { type: 'viz', id: 'riemannLebesgue' },
      { type: 'definition', title: '勒贝格测度与可测函数', pu: 'Stein & Shakarchi 卷 III 第 1 章', body: String.raw`<p><strong>外测度：</strong>用可数个区间覆盖 $E$，令总长度的下确界为 $m_*(E)=\inf\sum|I_k|$。若 $E$ 能把任何集合 $A$ 干净地切开（$m_*(A)=m_*(A\cap E)+m_*(A\cap E^c)$），则称 $E$ <strong>可测</strong>，其外测度即<strong>勒贝格测度</strong> $m(E)$。</p><p>三条本质性质：<strong>可数可加性</strong>（互不相交可测集之并的测度 = 测度之和——这是超出有限可加的巨大跨越）、平移不变性、$m(\text{点})=0$。由此立刻得到一组震撼的算术：</p>$$m(\mathbb{Q}\cap[0,1])=0, \qquad m(\text{康托集})=0$$<p>可测函数 $f$ 则是「水平集都可测」的函数——它构成一个对极限运算封闭的函数类，这是勒贝格理论吞吐极限的底气。</p>` },
      { type: 'viz', id: 'cantorSet' },
      { type: 'theorem', title: '三大收敛定理', pu: 'Stein & Shakarchi 卷 III 第 2 章', body: String.raw`<p>勒贝格积分的统治力集中在三条交换极限与积分的定理上：</p><ol class="nice"><li><strong>单调收敛定理：</strong>$0\leq f_1\leq f_2\leq\cdots$，$f_n\to f$ 逐点，则 $\lim\int f_n = \int f$。</li><li><strong>法图引理：</strong>$\int\liminf f_n \leq \liminf\int f_n$（非负情形）。</li><li><strong>控制收敛定理（DCT）：</strong>若 $|f_n|\leq g$ 且 $g$ 可积，$f_n\to f$ 逐点，则 $\lim\int f_n=\int f$。</li></ol><p>对比第三部：逐点收敛下连续性与积分交换统统失败（$x^n$ 的教训）；而在勒贝格世界，一个可积的「控制函数」$g$ 就足够锁住所有麻烦。Dirichlet 函数的积分也终于有了答案：$f=𝟙_{\mathbb{Q}}$ 几乎处处为 0，故 $\int f\,dm = 0$。</p>` },
      { type: 'text', title: '$L^2$：函数的几何学', body: String.raw`<p>定义内积 $\langle f,g\rangle=\int f\overline{g}\,dm$ 与范数 $\|f\|_2=\left(\int|f|^2\right)^{1/2}$，得到函数空间 $L^2$。它完备（Cauchy 列必收敛）、可分，且任意函数可向标准正交基展开——傅里叶级数正是 $L^2[-\pi,\pi]$ 中向 $\{e^{ikx}\}$ 的正交展开，Parseval 等式就是勾股定理的无穷版。分析学在此完成一个大闭环：<strong>函数变成了向量，分析变成了几何</strong>。这为第四部泛函分析搭好了舞台。</p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      '勒贝格横切值域：按水平集分桶加权求和，对振荡函数稳健',
      '测度的核心是可数可加性；$\\mathbb{Q}$ 与康托集测度均为 0 但前者可数后者不可数',
      'DCT：$|f_n|\\leq g$ 可积 ⟹ 极限与积分可交换——傅里叶分析的通行证',
      'Dirichlet 函数勒贝格可积且积分为 0（几乎处处为零）',
      '$L^2$ 完备内积空间：函数几何学，傅里叶级数 = 正交展开'
    ],
    exercises: [
      { id: 'ms-ex1', type: 'choice', diff: 1,
        question: String.raw`康托集的正确描述是？`,
        options: ['不可数、完备、勒贝格测度为 $0$', '可数、测度为 $0$', '不可数、测度为 $1$', '有限集'],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>构造：从 $[0,1]$ 逐次挖去中间三分之一，第 $k$ 步后剩 $2^k$ 段、总长 $\left(\frac{2}{3}\right)^k\to 0$，故测度为 $0$。</p><p><span class="step-tag">Step 2</span>不可数：用三进制写法，康托集恰是「只用数字 0 和 2」的数——与 $\{0,1\}^{\mathbb{N}}$（二进制小数全体）一一对应，基数与 $[0,1]$ 相同。</p><p><span class="step-tag">Step 3</span>它是闭集（挖的都是开区间）且无孤立点，故完备。结论：测度为零丝毫不妨碍集合巨大——「零测」只说明它填不满任何区间。</p>` },
      { id: 'ms-ex2', type: 'numeric', diff: 2, answer: 0.13, tolerance: 0.01,
        question: String.raw`康托集构造第 $5$ 步后，剩余部分的总长度为 $\left(\frac{2}{3}\right)^5 \approx$ <em>（填数值，保留两位小数）</em>`,
        solution: String.raw`<p><span class="step-tag">Step 1</span>第 $k$ 步后剩 $2^k$ 段，每段长 $3^{-k}$，总长 $(2/3)^k$。</p><p><span class="step-tag">Step 2</span>$k=5$：$\left(\frac{2}{3}\right)^5=\frac{32}{243}\approx 0.132$。在实验室里把阶数滑到 5，即可看到剩余的 $32$ 个小段。</p><p><span class="step-tag">注</span>总长指数衰减到 0，但集合始终非空且不可数——「长度」测不出康托集的大小，这正是需要更精细的「测度论+基数」双重视角的理由。</p>` },
      { id: 'ms-ex3', type: 'choice', diff: 2,
        question: String.raw`Dirichlet 函数（$\mathbb{Q}$ 上取 $1$，其余取 $0$）的勒贝格积分为？`,
        options: ['$0$（因为 $m(\mathbb{Q})=0$，它几乎处处为零）', '$1$', '不存在（勒贝格意义下仍不可积）', '$\frac{1}{2}$'],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>勒贝格积分对简单函数 $𝟙_E$ 定义为 $m(E)$：Dirichlet 函数 $=𝟙_{\mathbb{Q}\cap[0,1]}$。</p><p><span class="step-tag">Step 2</span>可数集测度为零：$m(\mathbb{Q}\cap[0,1])=0$（有理数可被总长任意小的区间列覆盖）。</p><p><span class="step-tag">Step 3</span>故积分为 $0$。对比：黎曼积分下它因处处间断而崩溃。「几乎处处」（a.e.）一词从此成为分析学的日常用语——在零测集上发生什么，勒贝格理论一概不计较。</p>` },
      { id: 'ms-ex4', type: 'choice', diff: 3,
        question: String.raw`控制收敛定理（DCT）的核心条件是？`,
        options: [
          '存在可积函数 $g$ 使 $|f_n(x)|\\leq g(x)$ 对所有 $n$ 与几乎所有 $x$ 成立',
          '$f_n$ 单调递增',
          '$f_n$ 一致收敛',
          '$f_n$ 连续'
        ],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>$g$ 是「缰绳」：只要所有 $f_n$ 被同一个可积函数压住，逐点收敛 $f_n\to f$ 就足以交换极限与积分：$\lim\int f_n=\int f$。</p><p class="muted"><span class="step-tag">Step 2</span>没有缰绳会怎样？经典反例：$f_n=n\,𝟙_{(0,1/n)}$，逐点趋于 0，但 $\int f_n=1 ↛ 0$——质量逃向了一个不断变窄的尖峰，DCT 的控制条件正是为了堵住这种逃逸（此例中被 $g=\frac{1}{x}$？不行，它不可积——恰说明无控制时结论失效）。</p><p><span class="step-tag">Step 3</span>DCT 是卷 III 的实用核心：傅里叶级数的 $L^2$ 理论、乘积测度与 Fubini 定理的证明，处处靠它放行极限交换。单调收敛与 Fatou 引理则是它的姊妹定理，三者共同构成勒贝格积分的「交换三定律」。</p>` }
    ]
  },

  /* ---------------- 第 4 章 ---------------- */
  {
    id: 'functional',
    title: '泛函分析：空间的理论',
    intro: '当「点」变成函数、「向量」变成算子，线性代数与微积分在无穷维空间中合流——分析学的最高观景台。',
    princeton: 'MAT 520 · Stein & Shakarchi 卷 IV',
    sections: [
      { type: 'text', title: '从解方程到看空间', body: String.raw`<p>十九世纪末，数学家们发现自己反复在做同一件事：积分方程、微分方程、变分法……本质上都是在<strong>无穷维空间</strong>中解「线性方程 $Ax=b$」。Volterra、Fredholm、Hilbert、Banach 的伟大综合是：不再逐题硬解，而是研究「所有函数组成的空间」本身的几何——完备性、范数、内积、对偶。</p><p>第三部与第四部已经备好了两块地基：$\mathbb{R}^n$ 的公理化推广是<strong>赋范空间</strong>；$L^2$ 的公理化推广是<strong>Hilbert 空间</strong>。泛函分析 = 无穷维的线性代数 + 拓扑 + 分析。</p>` },
      { type: 'definition', title: 'Banach 空间与 Hilbert 空间', pu: 'Stein & Shakarchi 卷 IV §1–2', body: String.raw`<p><strong>赋范空间</strong>：线性空间配备范数 $\|x\|$（正齐次、三角不等式、非退化）。若它对范数完备（Cauchy 列必收敛），称为 <strong>Banach 空间</strong>。典型例子：</p>$$L^p = \left\{f:\ \int|f|^p\,dm < \infty\right\}, \qquad \|f\|_p = \left(\int|f|^p\,dm\right)^{1/p}$$<p><strong>Hilbert 空间</strong>：配备内积 $\langle x,y\rangle$ 的完备空间（$p=2$ 的 $L^2$ 是原型）。内积带来角度与正交——无穷维中依然可以做「垂直投影」，Fourier 级数、小波展开、量子力学的态空间，全部是 Hilbert 几何。</p>` },
      { type: 'theorem', title: '三大支柱定理', pu: 'Stein & Shakarchi 卷 IV 第 4–5 章', body: String.raw`<ol class="nice"><li><strong>Hahn–Banach 定理：</strong>子空间上的有界线性泛函可保范延拓到全空间——保证对偶空间足够肥沃，能分离点与凸集。</li><li><strong>一致有界原理（Banach–Steinhaus）：</strong>逐点有界的算子族自动一致有界。它把「逐点」升级为「整体」的完备性魔术，反例制造机（处处连续处处不可微函数的现存构造大多源于此）。</li><li><strong>开映射定理：</strong>Banach 空间之间的满射有界算子是开映射；其孪生兄弟<strong>闭图像定理</strong>与<strong>逆算子定理</strong>说明：有界性、可逆性、闭图像在完备世界中互相担保。</li></ol><p>三者的共同结构：在完备空间里，「逐点/局部」的信息常能兑换成「整体/一致」的结论——这与第三部紧致性、第四部 DCT 的精神一脉相承。</p>` },
      { type: 'text', title: '算子与谱：让矩阵重新伟大', body: String.raw`<p>线性算子 $T$ 是无穷维的「矩阵」。紧算子（把单位球映为相对紧集）是「最像有限维矩阵」的一类：其谱几乎全是特征值，至多累积于 0，且谱定理成立——<strong>对称紧算子可对角化</strong>，存在正交特征函数系。积分算子 $(Tf)(x)=\int k(x,y)f(y)\,dy$（核 $k$ 足够好）是典型代表，它的特征展开正是 Sturm–Liouville 理论与众多物理本征值问题的抽象。</p><p>谱理论把「解方程 $Tx=\lambda x$」从代数操作升华为几何图景：谱集 $\sigma(T)$ 是算子的指纹。量子力学中可观测量 = 自伴算子、测量值 = 谱点——泛函分析由此成为物理的语法书。</p>` },
      { type: 'note', title: '旅程的终点，也是地图', body: String.raw`<p>回望整条进阶之路：高中函数 → 极限与连续 → 导数与积分 → 严格实数与拓扑 → 一致收敛与黎曼理论 → 测度与勒贝格 → 傅里叶与复分析 → 空间与算子。每一层都在回答同一组问题：<strong>变化如何度量？无穷如何驾驭？交换何时合法？</strong>Stein 四部曲把它们编织成一张网：傅里叶需要测度（卷 III），复分析服务数论（卷 II），一切栖息于 Hilbert 空间（卷 III–IV）。你现在已经站在普林斯顿高年级课程同款的观景台上——往前，是偏微分方程、调和分析、遍历理论、算子代数的辽阔旷野。</p>` },
      { type: 'exercises' }
    ],
    keyPoints: [
      'Banach 空间 = 完备赋范空间；$L^p$ 是原型族，$p=2$ 时内积存在 → Hilbert 空间',
      'Hahn–Banach / 一致有界 / 开映射：完备性把逐点信息升级为整体结论的三大支柱',
      '紧算子最像有限维矩阵：谱几乎全是特征值，对称紧算子可正交对角化',
      'Cauchy–Schwarz $|\\langle f,g\\rangle|\\leq\\|f\\|\\|g\\|$ 在 $L^2$ 中即 $\\left(\\int |fg|\\right)^2\\leq\\int f^2\\int g^2$',
      '整条学习线的主线问题：变化、无穷、交换——每一部都是对前一部的严格化与升华'
    ],
    exercises: [
      { id: 'fn-ex1', type: 'choice', diff: 1,
        question: String.raw`$L^2[0,1]$ 是？`,
        options: ['完备的内积空间（Hilbert 空间）', '不完备的内积空间', 'Banach 空间但没有范数', '有限维空间'],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>$L^2$ 配备 $\langle f,g\rangle=\int_0^1 f\overline{g}\,dm$，内积诱导范数 $\|f\|_2=\sqrt{\langle f,f\rangle}$。</p><p><span class="step-tag">Step 2</span>完备性（Riesz–Fischer 定理）：$L^2$ 中 Cauchy 列必收敛——这正是勒贝格积分相对黎曼积分的决定性优势，阶梯函数在黎曼可积函数类中的完备化恰好补出 $L^2$。</p><p><span class="step-tag">Step 3</span>故 $L^2$ 是 Hilbert 空间的原型。傅里叶级数收敛的 $L^2$ 理论（对任意平方可积函数成立）就生活在这里。</p>` },
      { id: 'fn-ex2', type: 'choice', diff: 2,
        question: String.raw`Cauchy–Schwarz 不等式在 $L^2$ 中的形式是？`,
        options: [
          '$\\left(\\int |fg|\\,dm\\right)^2 \\leq \\left(\\int f^2\\,dm\\right)\\left(\\int g^2\\,dm\\right)$',
          '$\\int|f+g| \\leq \\int|f| + \\int|g|$',
          '$\\|f+g\\| \\geq \\big|\\|f\\|-\\|g\\|\\big|$',
          '$\\int f^2 \\leq \\left(\\int f\\right)^2$'
        ],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>抽象形式：$|\langle f,g\rangle| \leq \|f\|\,\|g\|$。把内积定义 $\langle f,g\rangle=\int f\overline g$ 代入即得选项 A。</p><p><span class="step-tag">Step 2</span>证明一行的代数魔术：对一切 $t$，$0\leq\|f+tg\|^2=\|f\|^2+2t\,\text{Re}\langle f,g\rangle+t^2\|g\|^2$，判别式非正。</p><p><span class="step-tag">注</span>它是 $L^p$ 三大不等式（Hölder、Minkowski、C–S）之首，也是「内积有定义 ⟺ 满足 C–S」的桥梁——欧氏几何进入函数世界的第一块砖。</p>` },
      { id: 'fn-ex3', type: 'numeric', diff: 2, answer: 0.58, tolerance: 0.01,
        question: String.raw`$f(x)=x$ 作为 $L^2[0,1]$ 中的元素，其范数 $\|f\|_2=\left(\int_0^1 x^2\,dx\right)^{1/2} \approx$ <em>（填数值，保留两位小数）</em>`,
        solution: String.raw`<p><span class="step-tag">Step 1</span>$\int_0^1 x^2\,dx=\frac{1}{3}$。</p><p><span class="step-tag">Step 2</span>$\|f\|_2=\sqrt{\frac{1}{3}}=\frac{1}{\sqrt3}\approx 0.577$。几何意义：把函数看作无穷维向量，其「长度」约为 0.577——与原点（零函数）的 Hilbert 距离。</p><p><span class="step-tag">延伸</span>顺便一提 $\|f\|_1=\int_0^1 x\,dx=\frac12<\|f\|_2$？不——一般 $L^p$ 范数在有限测度空间上随 $p$ 递增：$\|f\|_1\leq\|f\|_2$（此处 $0.5<0.577$ ✓），C–S 不等式取 $g\equiv1$ 即得。</p>` },
      { id: 'fn-ex4', type: 'choice', diff: 3,
        question: String.raw`关于「开映射定理」，正确的表述是？`,
        options: [
          'Banach 空间之间的有界满射线性算子把开集映为开集',
          '任何线性算子都把开集映为开集',
          '连续映射把开集映为开集',
          '全纯函数把开集映为开集（这是复分析的最大模推论）'
        ],
        answer: 0,
        solution: String.raw`<p><span class="step-tag">Step 1</span>开映射定理需要三个关键词同时在场：<strong>Banach（定义域与值域都完备）</strong>、<strong>线性</strong>、<strong>有界满射</strong>。结论：开集的像是开集。</p><p><span class="step-tag">Step 2</span>直接推论是<strong>逆算子定理</strong>：双射有界算子的逆自动有界——「连续可逆」免费获得，这是解方程 $Tx=b$ 时「解连续依赖数据」的理论保险。</p><p><span class="step-tag">Step 3</span>选项 D 是对的数学命题（非常数全纯函数为开映射，卷 II 的三大奇迹之一），但它属于复分析——注意区分两个「开映射」语境。本定理的威力恰恰在于：没有任何全纯性、没有任何光滑性，纯凭「线性+完备」就赢得拓扑结论。</p>` }
    ]
  }
  ]
});
