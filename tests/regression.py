#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
「从函数到分析」· 回归测试框架
================================
- 引擎：Playwright + 本机 Google Chrome（channel='chrome'，无需下载浏览器）
- 视口：桌面 1280x800；移动 375x667（is_mobile + has_touch + dsf=3）
- 服务：默认本地自建静态服务器；--url 可直接回归线上部署地址
- 触发：pre-commit hook 跑 --smoke 冒烟门禁；GitHub Actions 每次 push 跑全量

用法：
    python3 tests/regression.py                          # 全量回归（所有章节 × 双视口）
    python3 tests/regression.py --smoke                 # 冒烟子集（提交前快速门禁）
    python3 tests/regression.py --only drawer            # 只跑名字含 drawer 的测试
    python3 tests/regression.py --url https://<pages>    # 对线上站点全量回归
"""
from __future__ import annotations

import argparse
import http.server
import re
import shutil
import sys
import threading
import time
import traceback
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "tests" / "artifacts"

CHROME_ARGS = ["--no-sandbox", "--disable-dev-shm-usage"]
DESKTOP = {"viewport": {"width": 1280, "height": 800}}
MOBILE = {
    "viewport": {"width": 375, "height": 667},
    "is_mobile": True,
    "has_touch": True,
    "device_scale_factor": 3,
}

# --------------------------------------------------------------- JS 片段

JS_CHAPTERS = """
() => {
  const out = [];
  (window.COURSE_DIVISIONS || []).forEach(d => d.chapters.forEach(c => out.push({
    route: d.id + '/' + c.id,
    title: c.title,
    viz: (c.sections || []).filter(s => s.type === 'viz').length,
    ex: (c.exercises || []).length,
  })));
  return out;
}
"""

JS_EX_TYPES = """
() => {
  const out = { choice: null, numeric: null };
  for (const d of window.COURSE_DIVISIONS) for (const c of d.chapters) for (const ex of (c.exercises || [])) {
    if (ex.type === 'choice' && !out.choice) out.choice = { route: d.id + '/' + c.id, id: ex.id, answer: ex.answer };
    if (ex.type !== 'choice' && !out.numeric) out.numeric = { route: d.id + '/' + c.id, id: ex.id, answer: ex.answer };
  }
  return out;
}
"""

JS_FIRST_EX = """
() => {
  for (const d of window.COURSE_DIVISIONS) for (const c of d.chapters) {
    const exs = c.exercises || [];
    if (exs.length) { const ex = exs[0]; return { route: d.id + '/' + c.id, id: ex.id, type: ex.type, answer: ex.answer }; }
  }
  return null;
}
"""

JS_EX_ANSWER = """
(id) => {
  for (const d of window.COURSE_DIVISIONS) for (const c of d.chapters) for (const ex of (c.exercises || [])) {
    if (ex.id === id) return { type: ex.type, answer: ex.answer };
  }
  return null;
}
"""

JS_OVERFLOW = "() => document.documentElement.scrollWidth - document.documentElement.clientWidth"

JS_CANVAS_BOXES = """
() => Array.from(document.querySelectorAll('.viz-canvas-wrap canvas')).map(cv => {
  const r = cv.getBoundingClientRect(); return { w: r.width, h: r.height };
})
"""

JS_CTL_ROWS = """
() => Array.from(document.querySelectorAll('.viz-controls')).map(g => {
  const tops = Array.from(g.querySelectorAll('.ctl')).map(el => Math.round(el.getBoundingClientRect().top));
  return { n: tops.length, unique: tops.length === new Set(tops).size };
})
"""

# 合成触摸拖拽：touchstart 派发到画布（drag() 在 canvas 上监听），move/end 派发到 window
JS_TOUCH_DRAG = """
([sel, x0, y0, x1, y1]) => {
  const cv = document.querySelector(sel);
  const mk = (type, x, y) => {
    const t = new Touch({ identifier: 1, target: cv, clientX: x, clientY: y });
    const ev = new TouchEvent(type, {
      bubbles: true, cancelable: true,
      touches: type === 'touchend' ? [] : [t],
      targetTouches: type === 'touchend' ? [] : [t],
      changedTouches: [t],
    });
    (type === 'touchstart' ? cv : window).dispatchEvent(ev);
  };
  mk('touchstart', x0, y0);
  mk('touchmove', x1, y1);
  mk('touchend', x1, y1);
  return true;
}
"""

JS_H1_READY = """
(t) => { const el = document.querySelector('.chapter-hero h1'); return !!el && el.textContent.includes(t); }
"""
JS_HOME_READY = "() => !!document.querySelector('.hero h1')"
JS_WB_READY = "() => !!document.querySelector('.wb-stats')"


# --------------------------------------------------------------- 基础设施

class SilentHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):  # noqa: ANN002
        pass


def start_server(root: Path):
    import functools

    handler = functools.partial(SilentHandler, directory=str(root))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


class Watcher:
    """收集每个页面的 pageerror 与 console.error，测试结束后统一门禁。"""

    def __init__(self, page):
        self.page_errors = []
        self.console_errors = []
        page.on("pageerror", lambda e: self.page_errors.append(str(e)))
        page.on("console", self._on_console)

    def _on_console(self, msg):
        if msg.type == "error":
            self.console_errors.append(msg.text)

    def problems(self):
        msgs = []
        if self.page_errors:
            msgs.append("JS 异常: " + " | ".join(self.page_errors[:5]))
        if self.console_errors:
            msgs.append("console.error: " + " | ".join(self.console_errors[:5]))
        return "\n".join(msgs)


class Harness:
    """浏览器/上下文管理：每条测试用的页面都会被追踪，统一做 JS 错误门禁与清理。"""

    def __init__(self, pw, base):
        self.pw = pw
        self.base = base.rstrip("/")
        self.browser = None
        self.pages = []  # [(page, Watcher)]

    def launch(self):
        self.browser = self.pw.chromium.launch(channel="chrome", headless=True, args=CHROME_ARGS)

    def page(self, profile="desktop", init_script=None):
        ctx = self.browser.new_context(**(MOBILE if profile == "mobile" else DESKTOP))
        if init_script:
            ctx.add_init_script(init_script)
        pg = ctx.new_page()
        pg.set_default_timeout(15000)
        w = Watcher(pg)
        self.pages.append((pg, w))
        return pg, w

    def discard(self, pg):
        self.pages = [(p, w) for (p, w) in self.pages if p is not pg]
        try:
            pg.context.close()
        except Exception:
            pass

    # ---- 导航 ----
    def open_home(self, page):
        page.goto(self.base + "/#", wait_until="domcontentloaded")
        page.wait_for_function(JS_HOME_READY)

    def open_chapter(self, page, route, title=None):
        page.goto(f"{self.base}/#/ch/{route}", wait_until="domcontentloaded")
        if title:
            page.wait_for_function(JS_H1_READY, arg=title)
        else:
            page.wait_for_selector(".chapter-hero h1")

    def open_wrongbook(self, page):
        page.goto(self.base + "/#/wrongbook", wait_until="domcontentloaded")
        page.wait_for_function(JS_WB_READY)


class Reporter:
    def __init__(self):
        self.rows = []

    def add(self, name, ok, ms, detail=""):
        self.rows.append((name, ok, ms, detail))
        mark = "PASS" if ok else "FAIL"
        line = f"[{mark}] {name}  ({ms:.1f}s)"
        if not ok and detail:
            line += "\n        " + str(detail).replace("\n", "\n        ")
        print(line, flush=True)

    def finish(self):
        total = len(self.rows)
        failed = [r for r in self.rows if not r[1]]
        print("-" * 66, flush=True)
        print(f"回归结果：{total - len(failed)}/{total} 项通过")
        if failed:
            print("未通过：" + ", ".join(f[0] for f in failed))
        return 1 if failed else 0


def run_test(name, fn, h, rep):
    h.pages = []
    t0 = time.time()
    try:
        fn(h)
        problems = [w.problems() for _, w in h.pages if w.problems()]
        if problems:
            raise AssertionError("JS 错误泄漏:\n" + "\n".join(problems))
        rep.add(name, True, time.time() - t0)
    except Exception as e:  # noqa: BLE001
        detail = str(e) or e.__class__.__name__
        if not isinstance(e, AssertionError):
            detail += "\n" + "".join(traceback.format_exception(e)[-3:])
        stem = name.replace("/", "_")
        for i, (p, _) in enumerate(h.pages):
            try:
                ART_DIR.mkdir(parents=True, exist_ok=True)
                p.screenshot(path=str(ART_DIR / f"{stem}_{i}.png"), full_page=True)
            except Exception:
                pass
        rep.add(name, False, time.time() - t0, detail)
    finally:
        for p, _ in h.pages:
            try:
                p.context.close()
            except Exception:
                pass


# --------------------------------------------------------------- 通用断言

def check_mobile_layout(page, overflow=True):
    page.wait_for_timeout(150)  # 等待 ResizeObserver/布局稳定
    if overflow:
        ov = page.evaluate(JS_OVERFLOW)
        assert ov <= 1, f"页面存在 {ov}px 横向溢出"
    boxes = page.evaluate(JS_CANVAS_BOXES)
    for b in boxes:
        assert b["h"] >= 220, f"移动端画布过矮: {b}"
        assert b["h"] <= b["w"] * 1.08 + 2, f"移动端画布过高（未按宽度钳制）: {b}"
    for g in page.evaluate(JS_CTL_ROWS):
        if g["n"] >= 2:
            assert g["unique"], f"移动端可视化控件挤在同一行: {g}"


def check_chapter_core(page, meta, mobile=False):
    h1 = page.locator(".chapter-hero h1").inner_text()
    assert meta["title"] in h1, f"章节标题未渲染: {h1!r}"
    cards = page.locator(".viz-card").count()
    assert cards == meta["viz"], f"viz 卡片数 {cards} ≠ 预期 {meta['viz']}"
    if meta["viz"] > 0:
        assert page.locator(".viz-card canvas").count() >= 1, "可视化卡片缺少画布"
    body = page.locator("#main").inner_text()
    assert "组件缺失" not in body and "渲染出错" not in body, "存在组件加载/渲染错误"
    assert page.locator(".ch-nav a").count() >= 1, "缺少上一章/下一章导航"
    if mobile:
        check_mobile_layout(page)


# --------------------------------------------------------------- 测试用例

REGISTRY = []  # (name, smoke, fn)


def test(name, smoke=False):
    def deco(fn):
        REGISTRY.append((name, smoke, fn))
        return fn

    return deco


# ---- 桌面 ----

@test("desktop/home", smoke=True)
def t_home_desktop(h):
    page, _ = h.page("desktop")
    h.open_home(page)
    h1 = page.locator(".hero h1").inner_text()
    assert "函数" in h1 and "分析" in h1, f"首页主标题异常: {h1!r}"
    assert page.locator(".hero-stats .stat").count() == 4, "首页统计卡数量异常"
    assert page.locator("#roadmap").count() == 1, "缺少学习路线锚点"
    metas = page.evaluate(JS_CHAPTERS)
    assert len(metas) >= 15, f"章节数量异常: {len(metas)}"
    assert page.locator(".side-nav .ch-link").count() == len(metas), "侧栏章节链接数量与章节总数不一致"
    assert page.locator(".stage-card").count() == 4, "路线图卡片应为 4 部"


@test("desktop/chapter-functions", smoke=True)
def t_chapter_functions_desktop(h):
    page, _ = h.page("desktop")
    h.open_home(page)
    metas = page.evaluate(JS_CHAPTERS)
    meta = next(m for m in metas if m["route"] == "foundation/functions")
    h.open_chapter(page, meta["route"], meta["title"])
    check_chapter_core(page, meta, mobile=False)


@test("desktop/exercise-flow", smoke=True)
def t_exercise_flow_desktop(h):
    page, _ = h.page("desktop")
    h.open_home(page)
    info = page.evaluate(JS_EX_TYPES)
    assert info["choice"], "未找到选择题"

    ch = info["choice"]
    h.open_chapter(page, ch["route"])
    card = page.locator(f'.ex-card[data-exid="{ch["id"]}"]')
    opts = card.locator(".ex-opt")
    n = opts.count()
    assert n >= 2, "选择题选项数量异常"

    # 先答错
    opts.nth((ch["answer"] + 1) % n).click()
    card.locator(".ex-btn-check").click()
    cls = card.locator(".ex-feedback").get_attribute("class") or ""
    assert "show" in cls and "bad" in cls, f"答错后反馈异常: {cls!r}"

    # 再答对
    opts.nth(ch["answer"]).click()
    card.locator(".ex-btn-check").click()
    assert "correct" in (card.get_attribute("class") or ""), "答对后卡片状态异常"
    cls = card.locator(".ex-feedback").get_attribute("class") or ""
    assert "show" in cls and "ok" in cls, f"答对后反馈异常: {cls!r}"
    assert "已答对" in page.locator("#toast").inner_text(), "答对后未弹出进度提示"

    # 讲解开关
    solu_btn = card.locator(".ex-btn-solu")
    solu_btn.click()
    assert "show" in (card.locator(".ex-solution").get_attribute("class") or ""), "讲解未展开"
    assert solu_btn.inner_text().strip().startswith("收起"), "讲解按钮文案未切换"

    # 数值题（如存在）
    nu = info["numeric"]
    if nu:
        h.discard(page)
        page, _ = h.page("desktop")
        h.open_chapter(page, nu["route"])
        ncard = page.locator(f'.ex-card[data-exid="{nu["id"]}"]')
        ncard.locator("input").fill(str(nu["answer"]))
        ncard.locator(".ex-btn-check").click()
        assert "correct" in (ncard.get_attribute("class") or ""), "数值题答对后卡片状态异常"
        cls = ncard.locator(".ex-feedback").get_attribute("class") or ""
        assert "ok" in cls, f"数值题答对后反馈异常: {cls!r}"


@test("desktop/wrongbook")
def t_wrongbook_desktop(h):
    # 1) 摸清第一道练习
    page, _ = h.page("desktop")
    h.open_home(page)
    first = page.evaluate(JS_FIRST_EX)
    assert first, "课程没有任何练习"
    h.discard(page)

    # 2) 预埋一条错答记录，验证错题本收录与攻克流程
    seed = (
        "localStorage.setItem('mp-progress-v1', "
        f"JSON.stringify({{answers: {{'{first['id']}': {{picked: 0, correct: false, wrongOnce: true}}}}, visited: {{}}}}));"
    )
    page, _ = h.page("desktop", init_script=seed)
    h.open_wrongbook(page)
    assert page.locator("#wb-pending-n").inner_text().strip() == "1", "待攻克计数应为 1"
    assert page.locator(".wb-item").count() == 1, "错题本应显示 1 条错题"
    assert "待攻克" in page.locator(".wb-item .wb-badge").inner_text(), "错题徽标状态异常"

    # 在错题本内重做并攻克
    info = page.evaluate(JS_EX_ANSWER, first["id"])
    card = page.locator(f'.ex-card[data-exid="{first["id"]}"]')
    if info["type"] == "choice":
        card.locator(f'.ex-opt[data-i="{info["answer"]}"]').click()
    else:
        card.locator("input").fill(str(info["answer"]))
    card.locator(".ex-btn-check").click()
    page.wait_for_function("() => document.getElementById('wb-pending-n').textContent === '0'")
    assert page.locator("#wb-conquered-n").inner_text().strip() == "1", "已攻克计数应为 1"
    assert "已攻克" in page.locator(".wb-item .wb-badge").inner_text(), "攻克后徽标未更新"

    # 分类筛选：待攻克为空 → 空态；切回全部 → 恢复
    page.locator('.wb-tab[data-f="pending"]').click()
    page.wait_for_function("(t) => { const el = document.querySelector('.wb-empty-title'); return !!el && el.textContent.includes(t); }", arg="暂无")
    page.locator('.wb-tab[data-f="all"]').click()
    page.wait_for_function("() => document.querySelectorAll('.wb-item').length === 1")


@test("desktop/sweep-all-chapters")
def t_sweep_desktop(h):
    page, _ = h.page("desktop")
    h.open_home(page)
    metas = page.evaluate(JS_CHAPTERS)
    h.discard(page)
    for meta in metas:
        page, _ = h.page("desktop")
        try:
            h.open_chapter(page, meta["route"], meta["title"])
            check_chapter_core(page, meta, mobile=False)
        except Exception as e:
            raise AssertionError(f"[{meta['route']}] {e}") from None
        h.discard(page)


# ---- 移动 ----

@test("mobile/home", smoke=True)
def t_home_mobile(h):
    page, _ = h.page("mobile")
    h.open_home(page)
    h1 = page.locator(".hero h1").inner_text()
    assert "函数" in h1 and "分析" in h1, f"移动端首页主标题异常: {h1!r}"
    assert page.locator(".hero-stats .stat").count() == 4, "移动端统计卡数量异常"
    check_mobile_layout(page)


@test("mobile/drawer", smoke=True)
def t_drawer_mobile(h):
    page, _ = h.page("mobile")
    h.open_home(page)
    toggle = page.locator("#sidebar-toggle")
    assert toggle.is_visible(), "移动端缺少目录开关"

    # 打开
    toggle.click()
    assert page.evaluate("document.getElementById('sidebar').classList.contains('open')"), "抽屉未打开"
    assert page.evaluate("document.getElementById('sidebar-backdrop').classList.contains('show')"), "遮罩未显示"
    assert page.evaluate("document.body.classList.contains('drawer-open')"), "body 未加 drawer-open"
    assert page.evaluate("getComputedStyle(document.body).overflow") == "hidden", "抽屉打开后页面仍可滚动"
    assert toggle.inner_text().strip() == "✕", "开关图标未切换为 ✕"

    # 遮罩关闭（点视口右侧，避开覆盖左侧的抽屉面板）
    page.locator("#sidebar-backdrop").click(position={"x": 350, "y": 200})
    assert not page.evaluate("document.getElementById('sidebar').classList.contains('open')"), "遮罩点击后抽屉未关闭"
    assert toggle.inner_text().strip() == "☰", "关闭后图标未恢复"

    # 再打开并通过抽屉导航进章节
    toggle.click()
    page.locator("#sidebar .ch-link").first.click()
    page.wait_for_selector(".chapter-hero h1")
    assert "#/ch/" in page.url, "抽屉导航未跳转章节"
    assert not page.evaluate("document.getElementById('sidebar').classList.contains('open')"), "导航后抽屉应自动关闭"


@test("mobile/chapter-functions", smoke=True)
def t_chapter_functions_mobile(h):
    page, _ = h.page("mobile")
    h.open_home(page)
    metas = page.evaluate(JS_CHAPTERS)
    meta = next(m for m in metas if m["route"] == "foundation/functions")
    h.open_chapter(page, meta["route"], meta["title"])
    check_chapter_core(page, meta, mobile=True)


@test("mobile/unit-circle-drag")
def t_unit_circle_drag(h):
    page, _ = h.page("mobile")
    meta_route = "foundation/exp-log-trig"
    h.open_home(page)
    metas = page.evaluate(JS_CHAPTERS)
    meta = next(m for m in metas if m["route"] == meta_route)
    h.open_chapter(page, meta["route"], meta["title"])

    sel = '[data-viz="unitCircle"]'
    page.wait_for_selector(f"{sel} .viz-readout")
    readout = page.locator(f"{sel} .viz-readout")
    before = readout.inner_text()
    m = re.search(r"θ\s*=\s*([\d.]+)", before)
    assert m, f"单位圆读数未渲染 θ 值: {before!r}"
    deg0 = float(m.group(1))
    assert abs(deg0 - 45.0) < 0.1, f"初始角应为 45°, 实际 {deg0}"

    cv = page.locator(f"{sel} canvas").first
    cv.scroll_into_view_if_needed()
    box = cv.bounding_box()
    assert box, "单位圆画布不可见"
    x0, y0 = box["x"] + box["width"] * 0.30, box["y"] + box["height"] * 0.35
    x1, y1 = box["x"] + box["width"] * 0.82, box["y"] + box["height"] * 0.47
    page.evaluate(JS_TOUCH_DRAG, [f"{sel} canvas", x0, y0, x1, y1])

    after = readout.inner_text()
    m2 = re.search(r"θ\s*=\s*([\d.]+)", after)
    assert m2, f"拖拽后读数异常: {after!r}"
    deg1 = float(m2.group(1))
    assert deg1 != deg0, f"拖拽未生效: θ 仍为 {deg0}"
    assert deg1 < 25 or deg1 > 335, f"拖拽落点角度异常: {deg1}°"
    check_mobile_layout(page, overflow=False)


@test("mobile/exercise-flow")
def t_exercise_flow_mobile(h):
    page, _ = h.page("mobile")
    h.open_home(page)
    info = page.evaluate(JS_EX_TYPES)
    assert info["choice"], "未找到选择题"
    h.open_chapter(page, info["choice"]["route"])
    ch = info["choice"]
    card = page.locator(f'.ex-card[data-exid="{ch["id"]}"]')
    card.locator(f'.ex-opt[data-i="{ch["answer"]}"]').tap()
    card.locator(".ex-btn-check").tap()
    assert "correct" in (card.get_attribute("class") or ""), "移动端点选后卡片状态异常"
    cls = card.locator(".ex-feedback").get_attribute("class") or ""
    assert "show" in cls and "ok" in cls, f"移动端答题反馈异常: {cls!r}"
    check_mobile_layout(page, overflow=False)


@test("mobile/sweep-all-chapters")
def t_sweep_mobile(h):
    page, _ = h.page("mobile")
    h.open_home(page)
    metas = page.evaluate(JS_CHAPTERS)
    h.discard(page)
    for meta in metas:
        page, _ = h.page("mobile")
        try:
            h.open_chapter(page, meta["route"], meta["title"])
            check_chapter_core(page, meta, mobile=True)
        except Exception as e:
            raise AssertionError(f"[{meta['route']}] {e}") from None
        h.discard(page)


# --------------------------------------------------------------- 入口

def main():
    ap = argparse.ArgumentParser(description="「从函数到分析」回归测试")
    ap.add_argument("--smoke", action="store_true", help="只运行冒烟子集（pre-commit 门禁）")
    ap.add_argument("--url", default=None, help="直接回归线上地址（默认本地自建服务器）")
    ap.add_argument("--only", default=None, help="只运行名字包含该关键字的测试")
    args = ap.parse_args()

    shutil.rmtree(ART_DIR, ignore_errors=True)

    srv = None
    if args.url:
        base = args.url
    else:
        srv = start_server(ROOT)
        base = f"http://127.0.0.1:{srv.server_address[1]}"
    mode = "smoke" if args.smoke else "full"
    print(f"目标站点：{base}")
    print(f"回归模式：{mode}\n")

    rep = Reporter()
    try:
        with sync_playwright() as pw:
            h = Harness(pw, base)
            try:
                h.launch()
            except Exception as e:
                print("启动 Google Chrome 失败（需要本机已安装 Chrome）:", e)
                return 2
            for name, smoke, fn in REGISTRY:
                if args.smoke and not smoke:
                    continue
                if args.only and args.only not in name:
                    continue
                run_test(name, fn, h, rep)
    finally:
        if srv:
            srv.shutdown()
    return rep.finish()


if __name__ == "__main__":
    sys.exit(main())
