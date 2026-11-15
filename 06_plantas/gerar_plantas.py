# -*- coding: utf-8 -*-
"""Residencial do Fundo - gerador das pranchas (SVG em escala, formato A1 paisagem).
Uso:  python gerar_plantas.py     -> grava os .svg e o index.html nesta pasta.
Unidades do modelo: metros. Unidades da prancha: milimetros."""
import math, os, html

OUT = os.path.dirname(os.path.abspath(__file__))
DATA = "14/11/2026"
NSHEETS = 6
TS = 1.3   # fator global de texto nas vistas


def fm(v, nd=2):
    return f"{v:.{nd}f}".replace(".", ",")


def br(v):
    return f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


CSS = """
text{font-family:'Segoe UI',Arial,Helvetica,sans-serif;fill:#151515}
.wall,.cut{fill:#383838;stroke:#111;stroke-width:.12}
.open{fill:#fff;stroke:none}
.thin{fill:none;stroke:#222;stroke-width:.13}
.med{fill:none;stroke:#111;stroke-width:.28}
.thk{fill:none;stroke:#000;stroke-width:.55}
.dash{fill:none;stroke:#444;stroke-width:.16;stroke-dasharray:1.4 .9}
.dashr{fill:none;stroke:#b03020;stroke-width:.28;stroke-dasharray:2.2 1.2}
.sec{fill:none;stroke:#b03020;stroke-width:.3;stroke-dasharray:6 1.2 1 1.2}
.dim{fill:none;stroke:#8a2a1c;stroke-width:.13}
.furn{fill:#fff;stroke:#777;stroke-width:.1}
.white{fill:#fff;stroke:#222;stroke-width:.13}
.lot{fill:#fbfaf6;stroke:#222;stroke-width:.2}
.lotb{fill:none;stroke:#222;stroke-width:.3;stroke-dasharray:5 1 1 1}
.paver{fill:url(#paver);stroke:#666;stroke-width:.12}
.pav2{fill:url(#pav2);stroke:#666;stroke-width:.12}
.grass{fill:url(#grass);stroke:#6d8a55;stroke-width:.1}
.conc{fill:url(#conc);stroke:#777;stroke-width:.1}
.wood{fill:url(#wood);stroke:#6b4a26;stroke-width:.12}
.ripado{fill:url(#ripado);stroke:#5a3c1c;stroke-width:.12}
.stone{fill:url(#stone);stroke:#555;stroke-width:.13}
.water{fill:url(#water);stroke:#3f7da0;stroke-width:.15}
.hatch{fill:url(#hatch);stroke:#555;stroke-width:.13}
.roof{fill:url(#roof);stroke:#222;stroke-width:.25}
.telha{fill:url(#telha);stroke:#222;stroke-width:.25}
.terra{fill:url(#terra);stroke:none}
.brita{fill:url(#brita);stroke:#888;stroke-width:.1}
.glass{fill:#d3e5ee;stroke:#33414a;stroke-width:.13}
.graf{fill:#4b4e53;stroke:#111;stroke-width:.13}
.hedge{fill:#9dbb83;stroke:#55733f;stroke-width:.1}
.tree{fill:#b7d39c;fill-opacity:.7;stroke:#4c6b37;stroke-width:.15}
.muro{fill:none;stroke:#1f6b45;stroke-width:.9}
.muroex{fill:none;stroke:#555;stroke-width:1.1}
.post{fill:#f3c63b;stroke:#222;stroke-width:.12}
.ns{stroke:none}
.box{fill:#fff;stroke:#111;stroke-width:.3}
.boxh{fill:#e9e6df;stroke:#111;stroke-width:.3}
"""

DEFS = """
<pattern id="paver" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#e4dfd5"/><path d="M0 0H2M0 1H2M1 0V1M0 1V2" stroke="#b5ac9d" stroke-width=".08" fill="none"/></pattern>
<pattern id="pav2" width="1.6" height="1.6" patternUnits="userSpaceOnUse"><rect width="1.6" height="1.6" fill="#d9d6d0"/><path d="M0 0H1.6M0 0V1.6" stroke="#aaa59c" stroke-width=".08" fill="none"/></pattern>
<pattern id="grass" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#dfead2"/><path d="M.6 .9l.2 -.5M2.1 2.3l.2 -.5M2.3 .7l-.2 -.4M.9 2.4l-.2 -.4" stroke="#8fae73" stroke-width=".1" fill="none"/></pattern>
<pattern id="conc" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><rect width="2.4" height="2.4" fill="#f1f0ec"/><circle cx=".5" cy=".7" r=".07" fill="#aaa"/><circle cx="1.7" cy="1.6" r=".07" fill="#aaa"/><circle cx="1.2" cy=".3" r=".05" fill="#bbb"/></pattern>
<pattern id="wood" width="4" height="1" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#dbbd92"/><path d="M0 0H4" stroke="#a37c4c" stroke-width=".09"/></pattern>
<pattern id="ripado" width=".8" height="4" patternUnits="userSpaceOnUse"><rect width=".8" height="4" fill="#c99c66"/><path d="M0 0V4" stroke="#6b4a26" stroke-width=".14"/></pattern>
<pattern id="stone" width="3" height="1.6" patternUnits="userSpaceOnUse"><rect width="3" height="1.6" fill="#cfc8bc"/><path d="M0 0H3M0 .8H3M1 0V.8M2.4 .8V1.6M.5 .8V1.6" stroke="#8d8578" stroke-width=".09" fill="none"/></pattern>
<pattern id="water" width="4" height="2" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#cbe4f1"/><path d="M0 1q1 -.6 2 0t2 0" stroke="#79b3d1" stroke-width=".1" fill="none"/></pattern>
<pattern id="hatch" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#eef1e0"/><path d="M0 2L2 0" stroke="#8a9a6a" stroke-width=".12"/></pattern>
<pattern id="roof" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#ededea"/><path d="M0 3L3 0" stroke="#c9c9c4" stroke-width=".1"/></pattern>
<pattern id="telha" width="1" height="1" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#6a645e"/><path d="M0 0H1" stroke="#3c3835" stroke-width=".12"/></pattern>
<pattern id="terra" width="2" height="2" patternUnits="userSpaceOnUse"><path d="M0 2L2 0M0 1L1 0" stroke="#7a5a44" stroke-width=".12"/></pattern>
<pattern id="brita" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#e7e3da"/><circle cx=".5" cy=".5" r=".12" fill="#b6b0a4"/><circle cx="1.5" cy="1.3" r=".12" fill="#c4bfb4"/><circle cx="1.3" cy=".4" r=".08" fill="#a9a398"/><circle cx=".5" cy="1.5" r=".08" fill="#a9a398"/></pattern>
"""


class Sheet:
    W, H = 841, 594

    def __init__(s, fname, num, title, sub):
        s.fname, s.num, s.title, s.sub, s.e = fname, num, title, sub, []

    def a(s, x):
        s.e.append(x)

    def text(s, x, y, t, size=2.5, anchor="start", rot=0, bold=False, fill=None):
        st = f"font-size:{size}px;" + ("font-weight:700;" if bold else "") + (f"fill:{fill};" if fill else "")
        tr = f' transform="rotate({rot} {x:.2f} {y:.2f})"' if rot else ""
        s.a(f'<text x="{x:.2f}" y="{y:.2f}" text-anchor="{anchor}" style="{st}"{tr}>{html.escape(str(t))}</text>')

    def rect(s, x, y, w, h, cls):
        s.a(f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" class="{cls}"/>')

    def line(s, x0, y0, x1, y1, cls="thin"):
        s.a(f'<line x1="{x0:.2f}" y1="{y0:.2f}" x2="{x1:.2f}" y2="{y1:.2f}" class="{cls}"/>')

    def frame(s):
        s.rect(25, 10, s.W - 35, s.H - 20, "thk")
        x, y, w, h = s.W - 10 - 190, s.H - 10 - 62, 190, 62
        s.rect(x, y, w, h, "box")
        s.line(x, y + 16, x + w, y + 16, "med"); s.line(x, y + 34, x + w, y + 34, "med"); s.line(x, y + 48, x + w, y + 48, "med")
        s.line(x + 150, y + 34, x + 150, y + h, "med"); s.line(x + 95, y + 48, x + 95, y + h, "med")
        s.text(x + 4, y + 8, "RESIDENCIAL DO FUNDO", 5.2, bold=True)
        s.text(x + 4, y + 13.3, "Condomínio de lotes e kitnets — Av. Fiorino Brol, Foz do Iguaçu / PR", 2.5)
        s.text(x + 4, y + 23.5, s.title, 4.2, bold=True)
        s.text(x + 4, y + 30, s.sub, 2.7)
        s.text(x + 4, y + 39, "FASE", 1.8, fill="#666"); s.text(x + 4, y + 45, "ESTUDO PRELIMINAR", 3.4, bold=True, fill="#8a2a1c")
        s.text(x + 154, y + 39, "PRANCHA", 1.8, fill="#666"); s.text(x + 170, y + 58, f"{s.num}/{NSHEETS:02d}", 9, anchor="middle", bold=True)
        s.text(x + 4, y + 52.5, "ESCALAS", 1.8, fill="#666"); s.text(x + 4, y + 58, "Indicadas (impressão em A1)", 2.6)
        s.text(x + 99, y + 52.5, "DATA", 1.8, fill="#666"); s.text(x + 99, y + 58, DATA, 2.6)
        s.text(x + 75, y + 39, "Cotas e níveis em metros", 2.1, fill="#444")
        s.text(x + 75, y + 43, "Não válido para aprovação/obra:", 2.1, fill="#444")
        s.text(x + 75, y + 46.6, "requer projeto legal com RRT/ART", 2.1, fill="#444")

    def svg(s):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{s.W}mm" height="{s.H}mm" viewBox="0 0 {s.W} {s.H}">'
                f'<style>{CSS}</style><defs>{DEFS}</defs><rect width="{s.W}" height="{s.H}" fill="#fff"/>' + "".join(s.e) + "</svg>")


class V:
    """Vista: transforma metros do modelo em mm da prancha. mirW espelha em x; yup para fachadas/cortes."""

    def __init__(s, sh, ox, oy, scale, mirW=None, yup=False, ts=1.0):
        s.sh, s.ox, s.oy, s.k, s.mirW, s.yup, s.f = sh, ox, oy, 1000.0 / scale, mirW, yup, TS * ts

    def X(s, x):
        return s.ox + ((s.mirW - x) if s.mirW is not None else x) * s.k

    def Y(s, y):
        return s.oy - y * s.k if s.yup else s.oy + y * s.k

    def rect(s, x0, y0, x1, y1, cls="thin", rx=0):
        X0, X1 = sorted((s.X(x0), s.X(x1))); Y0, Y1 = sorted((s.Y(y0), s.Y(y1)))
        r = f' rx="{rx * s.k:.2f}"' if rx else ""
        s.sh.a(f'<rect x="{X0:.2f}" y="{Y0:.2f}" width="{X1 - X0:.2f}" height="{Y1 - Y0:.2f}" class="{cls}"{r}/>')

    def line(s, x0, y0, x1, y1, cls="thin"):
        s.sh.line(s.X(x0), s.Y(y0), s.X(x1), s.Y(y1), cls)

    def poly(s, pts, cls="thin", close=True):
        p = " ".join(f"{s.X(x):.2f},{s.Y(y):.2f}" for x, y in pts)
        s.sh.a(f'<{"polygon" if close else "polyline"} points="{p}" class="{cls}"/>')

    def circ(s, x, y, r, cls="thin"):
        s.sh.a(f'<circle cx="{s.X(x):.2f}" cy="{s.Y(y):.2f}" r="{r * s.k:.2f}" class="{cls}"/>')

    def ell(s, x, y, rx, ry, cls="thin"):
        s.sh.a(f'<ellipse cx="{s.X(x):.2f}" cy="{s.Y(y):.2f}" rx="{rx * s.k:.2f}" ry="{ry * s.k:.2f}" class="{cls}"/>')

    def text(s, x, y, t, size=2.2, anchor="middle", rot=0, bold=False, dx=0, dy=0, fill=None):
        s.sh.text(s.X(x) + dx, s.Y(y) + dy, t, size * s.f, anchor, rot, bold, fill)

    # ---------- planta ----------
    def walls(s, ws, cls="wall"):
        for w in ws:
            s.rect(*w, cls)

    def doorH(s, x0, x1, y0, y1, hinge="l", side="s"):
        s.rect(x0, y0, x1, y1, "open"); s.line(x0, y0, x0, y1); s.line(x1, y0, x1, y1)
        w = x1 - x0; hx, ex = (x0, x1) if hinge == "l" else (x1, x0)
        yf, sg = (y1, 1) if side == "s" else (y0, -1)
        s.line(hx, yf, hx, yf + sg * w, "med")
        s.poly([(hx + (ex - hx) * math.sin(t * math.pi / 24), yf + sg * w * math.cos(t * math.pi / 24)) for t in range(13)], "thin", False)

    def doorV(s, y0, y1, x0, x1, hinge="t", side="e"):
        s.rect(x0, y0, x1, y1, "open"); s.line(x0, y0, x1, y0); s.line(x0, y1, x1, y1)
        w = y1 - y0; hy, ey = (y0, y1) if hinge == "t" else (y1, y0)
        xf, sg = (x1, 1) if side == "e" else (x0, -1)
        s.line(xf, hy, xf + sg * w, hy, "med")
        s.poly([(xf + sg * w * math.cos(t * math.pi / 24), hy + (ey - hy) * math.sin(t * math.pi / 24)) for t in range(13)], "thin", False)

    def winH(s, x0, x1, y0, y1, kind="j"):
        s.rect(x0, y0, x1, y1, "white"); ym = (y0 + y1) / 2
        if kind == "j":
            s.line(x0, ym, x1, ym)
        else:
            xm, d = (x0 + x1) / 2, (y1 - y0) / 4
            s.line(x0, ym - d, xm + .06, ym - d, "med"); s.line(xm - .06, ym + d, x1, ym + d, "med")

    def winV(s, y0, y1, x0, x1, kind="j"):
        s.rect(x0, y0, x1, y1, "white"); xm = (x0 + x1) / 2
        if kind == "j":
            s.line(xm, y0, xm, y1)
        else:
            ym, d = (y0 + y1) / 2, (x1 - x0) / 4
            s.line(xm - d, y0, xm - d, ym + .06, "med"); s.line(xm + d, ym - .06, xm + d, y1, "med")

    def vao(s, x0, y0, x1, y1):
        s.rect(x0, y0, x1, y1, "open"); s.rect(x0, y0, x1, y1, "dash")

    def box(s, x0, y0, x1, y1, cls="furn"):
        s.rect(x0, y0, x1, y1, cls)

    def bed(s, x0, y0, x1, y1, head="n"):
        s.rect(x0, y0, x1, y1, "furn")
        p = {"n": (x0 + .1, y0 + .08, x1 - .1, y0 + .45), "s": (x0 + .1, y1 - .45, x1 - .1, y1 - .08),
             "w": (x0 + .08, y0 + .1, x0 + .45, y1 - .1), "e": (x1 - .45, y0 + .1, x1 - .08, y1 - .1)}[head]
        s.rect(*p, "furn", rx=.05)

    def wc(s, x, y, dx, dy):
        if dx:
            s.rect(x - .1, y - .22, x + .1, y + .22, "furn")
        else:
            s.rect(x - .22, y - .1, x + .22, y + .1, "furn")
        s.ell(x + dx * .36, y + dy * .36, .19 + abs(dx) * .06, .19 + abs(dy) * .06, "furn")

    def sink(s, x0, y0, x1, y1):
        s.rect(x0, y0, x1, y1, "furn"); s.ell((x0 + x1) / 2, (y0 + y1) / 2, abs(x1 - x0) * .3, abs(y1 - y0) * .3, "furn")

    def shower(s, x0, y0, x1, y1):
        s.rect(x0, y0, x1, y1, "dash"); s.line(x0, y0, x1, y1, "dash"); s.line(x0, y1, x1, y0, "dash")

    def car(s, x0, y0, x1, y1):
        s.rect(x0, y0, x1, y1, "furn", rx=.3)
        if abs(x1 - x0) > abs(y1 - y0):
            s.rect(x0 + .9, y0 + .15, x1 - 1.0, y1 - .15, "furn", rx=.15)
        else:
            s.rect(x0 + .15, y0 + .9, x1 - .15, y1 - 1.0, "furn", rx=.15)

    def tree(s, x, y, r):
        s.circ(x, y, r, "tree"); s.circ(x, y, r * .08, "thin")
        for i in range(8):
            a = i * math.pi / 4 + .3
            s.line(x + r * .25 * math.cos(a), y + r * .25 * math.sin(a), x + r * .8 * math.cos(a), y + r * .8 * math.sin(a), "thin")

    def room(s, x, y, name, w=None, h=None, area=None, size=2.3):
        s.text(x, y, name, size, bold=True)
        if w:
            s.text(x, y, f"{fm(w)} × {fm(h)}", size * .8, dy=size * 1.2 * s.f); s.text(x, y, f"{fm(w * h)} m²", size * .8, dy=size * 2.25 * s.f)
        elif area:
            s.text(x, y, f"{fm(area)} m²", size * .8, dy=size * 1.2 * s.f)

    def stair(s, x0, x1, ya, yb, n, label=None):
        """lance entre ya (inicio) e yb (fim), n pisos, largura x0..x1"""
        for i in range(n + 1):
            y = ya + (yb - ya) * i / n
            s.line(x0, y, x1, y)
        xm = (x0 + x1) / 2
        s.line(xm, ya, xm, yb, "med"); d = .18 if yb > ya else -.18
        s.poly([(xm - .12, yb - d), (xm, yb), (xm + .12, yb - d)], "med", False)
        if label:
            s.text(xm, ya, label, 1.6, dy=(-1 if yb > ya else 2.4))

    # ---------- cotas ----------
    def dimH(s, xs, y, off=0, txts=None):
        Y = s.Y(y) + off; Xs = [s.X(x) for x in xs]
        s.sh.line(min(Xs) - 1, Y, max(Xs) + 1, Y, "dim")
        for X in Xs:
            s.sh.line(X - .8, Y + .8, X + .8, Y - .8, "dim"); s.sh.line(X, Y - 1.4, X, Y + 1.4, "dim")
        for i in range(len(xs) - 1):
            t = txts[i] if txts else fm(abs(xs[i + 1] - xs[i]))
            s.sh.text((Xs[i] + Xs[i + 1]) / 2, Y - .9, t, 2.0 * TS, "middle", fill="#8a2a1c")

    def dimV(s, ys, x, off=0, txts=None):
        X = s.X(x) + off; Ys = [s.Y(y) for y in ys]
        s.sh.line(X, min(Ys) - 1, X, max(Ys) + 1, "dim")
        for Y in Ys:
            s.sh.line(X - .8, Y + .8, X + .8, Y - .8, "dim"); s.sh.line(X - 1.4, Y, X + 1.4, Y, "dim")
        for i in range(len(ys) - 1):
            t = txts[i] if txts else fm(abs(ys[i + 1] - ys[i]))
            s.sh.text(X - .9, (Ys[i] + Ys[i + 1]) / 2, t, 2.0 * TS, "middle", rot=-90, fill="#8a2a1c")

    # ---------- cortes / fachadas ----------
    def ground(s, a0, a1):
        s.rect(a0, -.45, a1, 0, "terra"); s.line(a0, 0, a1, 0, "thk")

    def level(s, x, z, t=None):
        X, Y = s.X(x), s.Y(z)
        s.sh.a(f'<path d="M{X - 1.3:.2f} {Y - 2:.2f}H{X + 1.3:.2f}L{X:.2f} {Y:.2f}Z" class="med"/>')
        s.sh.line(X - 4, Y, X + 4, Y, "thin")
        s.sh.text(X + 2, Y - 2.3, t or (("+" if z >= 0 else "−") + fm(abs(z))), 1.9 * TS)

    def treeE(s, x, h, r):
        s.rect(x - .12, 0, x + .12, h - r, "furn"); s.ell(x, h - r, r, r, "tree")

    def secmark(s, x, y0, y1, letter="A"):
        s.line(x, y0, x, y1, "sec")
        for y, dy in ((y0, -1.5), (y1, 4.5)):
            s.text(x, y, letter, 3.2, bold=True, dy=dy, fill="#b03020")


def vtitle(sh, x, y, name, scale, note=None):
    sh.text(x, y, name, 3.6, bold=True)
    sh.line(x, y + 1.6, x + 120, y + 1.6, "med")
    sh.text(x, y + 5.6, f"ESC. {scale}" + (f"  —  {note}" if note else ""), 2.4, fill="#444")


def north(sh, x, y, r=8):
    sh.a(f'<circle cx="{x}" cy="{y}" r="{r}" class="thin"/><path d="M{x} {y - r}L{x + r * .35} {y + r * .5}L{x} {y + r * .2}Z" fill="#111"/>'
         f'<path d="M{x} {y - r}L{x - r * .35} {y + r * .5}L{x} {y + r * .2}Z" class="thin"/>')
    sh.text(x, y - r - 1.5, "N", 4, "middle", bold=True)
    sh.text(x, y + r + 3.5, "aprox. — confirmar", 1.8, "middle", fill="#555")


def scalebar(sh, x, y, k, n=5, step=1):
    for i in range(n):
        sh.rect(x + i * step * k, y, step * k, 1.2, "graf" if i % 2 == 0 else "white")
        sh.text(x + i * step * k, y + 4, str(i * step), 1.8, "middle")
    sh.text(x + n * step * k, y + 4, f"{n * step} m", 1.8, "middle")


def table(sh, x, y, colw, rows, rh=5.2, size=2.3):
    """rows: lista de tuplas; ('#', titulo) = faixa de cabecalho; ('*', ...) = linha em negrito"""
    W = sum(colw); yy = y
    for r in rows:
        if r[0] == "#":
            sh.rect(x, yy, W, rh, "boxh"); sh.text(x + 2, yy + rh - 1.6, r[1], size, bold=True)
        else:
            bold = r[0] == "*"; cells = r[1:] if bold else r
            sh.rect(x, yy, W, rh, "box"); cx = x
            for i, c in enumerate(cells):
                if i:
                    sh.line(cx, yy, cx, yy + rh, "thin")
                    sh.text(cx + colw[i] - 2, yy + rh - 1.6, c, size, "end", bold=bold)
                else:
                    sh.text(cx + 2, yy + rh - 1.6, c, size, bold=bold)
                cx += colw[i]
        yy += rh
    return yy


def notes(sh, x, y, title, lines, size=2.3, lh=3.7):
    sh.text(x, y, title, 3, bold=True); sh.line(x, y + 1.4, x + 90, y + 1.4, "med")
    yy = y + 6
    for ln in lines:
        sh.text(x, yy, ln, size); yy += lh
    return yy


# =====================================================================================
#  KITNET  (local: lx 0..9 = fundo->rua ; ly 0..6)
# =====================================================================================
def kit_plan(v, detail=True):
    """Kitnet em L: ala 8,00 x 3,25 + bloco 4,00 x 2,75 = 37,00 m2 ; vaga coberta 2,75 x 5,00"""
    v.rect(0, 0, 9, 6, "lot")
    v.rect(8, 0, 9, .6, "grass"); v.rect(8, .6, 9, 2.6, "conc"); v.rect(8, 2.6, 9, 3.25, "grass"); v.rect(4, 3.25, 9, 6, "paver")
    v.car(4.4, 3.7, 8.6, 5.5)
    v.rect(4, 3.25, 8.6, 6, "dash"); v.rect(8.45, 5.8, 8.6, 5.95, "graf"); v.rect(8, .4, 8.7, 2.8, "dash")
    v.rect(8.75, .05, 8.95, .55, "graf"); v.tree(8.5, 2.95, .25)
    v.rect(.15, .15, 7.85, 3.1, "open"); v.rect(.15, 3.25, 3.85, 5.85, "open")
    v.walls([(0, 0, .15, 6), (.15, 0, 8, .15), (.15, 5.85, 4, 6), (3.85, 3.25, 4, 5.85), (.15, 3.1, 8, 3.25), (7.85, .15, 8, 3.1),
             (2.45, .15, 2.6, 1.5), (.15, 1.5, 2.6, 1.65), (1.6, 1.65, 1.75, 3.1)])
    v.winV(.6, 2.6, 7.85, 8, "p"); v.winH(5.0, 6.4, 3.1, 3.25); v.doorH(6.9, 7.7, 3.1, 3.25, "r", "n"); v.winV(4.2, 5.4, 3.85, 4)
    v.winV(.5, 1.1, 0, .15); v.winV(2.0, 2.8, 0, .15); v.winV(4.0, 5.2, 0, .15)
    v.doorH(1.8, 2.5, 1.5, 1.65, "l", "n"); v.doorV(2.1, 2.8, 1.6, 1.75, "t", "w"); v.doorH(2.7, 3.5, 3.1, 3.25, "l", "s")
    v.box(2.65, .2, 3.3, .85); v.box(3.35, .17, 5.6, .77); v.sink(3.6, .25, 4.2, .7)
    for cx in (4.8, 5.1):
        v.circ(cx, .35, .09, "furn"); v.circ(cx, .6, .09, "furn")
    v.box(3.7, 2.25, 4.6, 2.95); v.box(3.34, 2.42, 3.66, 2.78); v.box(4.64, 2.42, 4.9, 2.78)
    v.box(4.95, 2.25, 6.75, 3.08); v.box(4.95, 2.85, 6.75, 3.08); v.box(6.0, .17, 7.4, .45)
    v.shower(.15, .15, 1.05, 1.5); v.wc(1.5, .28, 0, 1); v.sink(2.0, .2, 2.42, .65)
    v.sink(.2, 1.7, .75, 2.3); v.box(.2, 2.4, .8, 3.0); v.circ(.5, 2.7, .2, "furn")
    v.bed(.2, 4.2, 2.1, 5.6, "w"); v.box(.2, 3.27, 2.4, 3.82)
    if detail:
        v.room(5.6, 1.35, "SALA / COZINHA", area=16.72, size=2.6)
        v.room(2.9, 4.65, "QUARTO", 3.70, 2.60, size=2.5)
        v.room(1.75, 1.15, "BANHO  3,11 m²", size=1.5); v.room(1.1, 2.0, "A.S.", size=1.6); v.text(1.1, 2.0, "2,10 m²", 1.4, dy=2.6)
        v.room(2.3, 2.5, "HALL", size=1.6)
        v.room(6.6, 4.45, "VAGA COBERTA", 2.75, 5.00, size=2.3); v.text(6.3, 5.8, "projeção da laje em balanço (pilar metálico)", 1.6)
        v.text(8.5, 1.6, "ACESSO", 1.8, rot=-90, dy=.6); v.text(4.5, 1.05, "geladeira · pia · cooktop", 1.5)
        v.text(8.85, .3, "mureta nº / medidores", 1.4, rot=-90, dx=3.2, dy=8)
        v.text(9, 3, "RUA CENTRAL →", 2.4, rot=-90, dx=9, bold=True)


def kit_elev(v, o):
    v.rect(o, 0, o + 6, 3.5, "white"); v.line(o, 2.95, o + 6, 2.95); v.line(o + 3.25, 0, o + 3.25, 3.5, "med")
    v.rect(o + 4.2, 1.1, o + 5.4, 2.2, "graf"); v.rect(o + 4.27, 1.17, o + 4.78, 2.13, "glass"); v.rect(o + 4.82, 1.17, o + 5.33, 2.13, "glass")
    v.rect(o + 3.25, 2.5, o + 6.0, 2.66, "graf"); v.rect(o + 5.8, 0, o + 5.95, 2.5, "graf")
    v.rect(o + .48, .1, o + 2.72, 2.42, "graf"); v.rect(o + .6, .18, o + 1.58, 2.3, "glass"); v.rect(o + 1.62, .18, o + 2.6, 2.3, "glass")
    v.rect(o + .4, 2.42, o + 2.8, 2.5, "graf"); v.rect(o + 2.74, .1, o + 3.25, 2.95, "ripado")
    v.rect(o + .05, 0, o + .55, 1.1, "graf"); v.rect(o + .15, .6, o + .45, .85, "white")


def sheet_kitnet():
    sh = Sheet("02_kitnet_tipo", "02", "KITNETS — MÓDULO-TIPO 9 × 6 m", "Planta-tipo (1 quarto, 37 m²), conjunto espelhado, fachada e corte")
    v = V(sh, 50, 62, 25, ts=1.45); kit_plan(v)
    v.dimH([0, 4, 8, 9], 0, -6); v.dimH([0, .15, 3.85, 4, 8.6, 9], 6, 7); v.dimV([0, 6], 0, -7)
    v.dimV([0, 1.5, 3.1, 3.25, 5.85, 6], 0, -14, ["1,50", "1,60", "", "2,60", ""]); v.dimV([0, 3.25, 6], 9, 16)
    sh.line(v.X(-.6), v.Y(2.2), v.X(10.2), v.Y(2.2), "sec"); sh.text(v.X(-.9), v.Y(2.2) + 1, "A", 3.2, "end", bold=True, fill="#b03020"); sh.text(v.X(10.4), v.Y(2.2) + 1, "A", 3.2, bold=True, fill="#b03020")
    vtitle(sh, 50, 324, "PLANTA-TIPO — K1 a K5 (fileira esquerda, frente para leste)", "1:25", "K6 a K12: mesma planta espelhada")
    k = 1000 / 75; ox, oy = 462, 62
    for i in range(2):
        kit_plan(V(sh, ox, oy + i * 6 * k, 75), False); kit_plan(V(sh, ox + 18 * k, oy + i * 6 * k, 75, mirW=9), False)
    vs = V(sh, ox, oy, 75)
    vs.rect(9, 0, 18, 12, "paver"); vs.rect(9, 0, 10.5, 12, "conc"); vs.rect(16.5, 0, 18, 12, "conc")
    vs.text(13.5, 6, "RUA CENTRAL — pista 6,00 em paver", 2.3, rot=-90, bold=True)
    vs.text(9.75, 6, "calçada 1,50", 1.8, rot=-90); vs.text(17.25, 6, "calçada 1,50", 1.8, rot=-90)
    for i, (a, b) in enumerate((("K1", "K6"), ("K2", "K7"))):
        vs.text(2.4, 4.9 + i * 6, a, 3.0, bold=True); vs.text(24.6, 4.9 + i * 6, b, 3.0, bold=True)
    vs.dimH([0, 8, 9, 18, 19, 27], 0, -5); vs.dimH([9, 10.5, 16.5, 18], 12, 6); vs.dimV([0, 6, 12], 27, 6)
    vtitle(sh, ox, 240, "CONJUNTO — fileiras espelhadas na rua central (trecho)", "1:75", "11,00 m entre fachadas")
    vf = V(sh, 462, 345, 50, mirW=12, yup=True)
    vf.ground(-.6, 12.6); kit_elev(vf, 0); kit_elev(vf, 6)
    vf.level(-.3, 0, "0,00"); vf.level(-.3, 3.5); vf.level(12.4, 2.66)
    vf.text(1.6, 3.15, "platibanda reta — pintura branca", 1.9); vf.text(8.2, 3.15, "ripado · moldura grafite", 1.9); vf.text(4.6, 2.75, "vaga coberta", 1.7)
    vf.dimH([0, 3.25, 6, 9.25, 12], 0, 12)
    vtitle(sh, 462, 372, "FACHADA FRONTAL (duas unidades)", "1:50", "esquadrias pretas · porta de vidro com moldura grafite")
    vc = V(sh, 50, 506, 25, yup=True, ts=1.3)
    vc.ground(-1, 9.9); vc.rect(8, -.1, 9.9, 0, "conc")
    vc.rect(.15, .1, 7.85, 2.8, "white")
    vc.rect(2.7, .1, 3.5, 2.2, "thin"); vc.rect(5.0, 1.1, 6.4, 2.2, "glass"); vc.rect(6.9, .1, 7.7, 2.2, "thin")
    vc.rect(4.95, .1, 6.75, .92, "furn"); vc.rect(3.7, .1, 4.6, .85, "furn")
    vc.walls([(0, 0, 8, .1), (0, 2.8, 8, 2.92), (0, .1, .15, 1.7), (0, 2.3, .15, 3.5), (7.85, 2.3, 8, 3.5), (1.6, 2.2, 1.75, 2.8)], "cut")
    vc.rect(.05, 1.7, .1, 2.3, "glass"); vc.rect(7.9, .1, 7.95, 2.3, "glass"); vc.line(.15, 3.5, 7.85, 3.5)
    vc.rect(8, 2.42, 8.7, 2.5, "graf"); vc.rect(8.75, 0, 8.95, 1.1, "graf")
    vc.text(.85, 1.2, "A.S.", 2.0); vc.text(2.25, 2.45, "HALL", 1.8); vc.text(5.3, 2.5, "SALA / COZINHA — pé-direito 2,70", 2.2); vc.text(9.4, .35, "RUA", 1.6)
    vc.text(3.1, 1.2, "quarto", 1.5); vc.text(7.3, 1.2, "vaga", 1.5); vc.text(4, 3.15, "laje impermeabilizada + platibanda", 1.9)
    vc.level(-.6, .1); vc.level(-.6, 2.92); vc.level(-.6, 3.5); vc.level(8.9, 2.5)
    vc.dimH([0, 1.6, 8, 9], -.45, 6)
    vtitle(sh, 50, 532, "CORTE AA", "1:25")
    yy = table(sh, 462, 392, [150, 44], [("#", "QUADRO DE ÁREAS — KITNET (cada)"), ("Módulo (9,00 × 6,00)", "54,00 m²"),
               ("Área construída fechada (8,00 × 3,25 + 4,00 × 2,75)", "37,00 m²"), ("Sala / cozinha", "16,72 m²"), ("Quarto (3,70 × 2,60)", "9,62 m²"),
               ("Banho 3,11 + área de serviço 2,10", "5,21 m²"), ("Área útil interna", "31,55 m²"),
               ("Garagem coberta (laje em balanço 4,60 × 2,75)", "12,65 m²"), ("Jardim + acesso descobertos", "4,35 m²"),
               ("*", "12 unidades — área fechada total", "444,00 m²")], 5.6, 2.7)
    notes(sh, 462, yy + 9, "NOTAS", [
        "1. Planta em L: ocupa 92 % do módulo (antes 26,40 m²; agora 37,00 m², com quarto separado).",
        "2. Alvenaria de bloco 14 cm (15 cm acabada); laje com platibanda e rufo; caixa d'água 1.000 L sobre a laje.",
        "3. Paredes laterais são de geminação, sem aberturas. Banho, área de serviço e quarto têm janela alta",
        "    de fundo (K1–K5 para a servidão; K6–K12 para a faixa de 1 m junto ao muro).",
        "4. A janela principal do quarto abre para a vaga coberta: conferir no código de obras se é aceita",
        "    como iluminação/ventilação; se não for, usar domus ou recuar a cobertura da vaga.",
        "5. Vaga de 2,75 × 5,00 m. Recuo frontal de 1,00 m até a calçada (via interna de condomínio).",
        "6. Medidores individuais de água e energia na mureta frontal."], 2.5, 4.0)
    sh.frame(); return sh


# =====================================================================================
#  CASAS — base do lote (u 0..8,25 oeste->leste ; v 0..18 rua->fundo)
# =====================================================================================
LW, LD = 8.25, 18.0


def lot_base(v, grass=True):
    v.rect(0, -3.0, LW, -1.2, "paver"); v.rect(0, -1.2, LW, 0, "conc")
    v.text(LW / 2, -2.0, "RUA TRANSVERSAL (via interna)", 2.1, bold=True); v.text(LW / 2, -.45, "calçada 1,20", 1.8)
    v.rect(0, 0, LW, LD, "grass" if grass else "lot"); v.rect(0, 0, LW, LD, "lotb")
    v.line(0, LD, LW, LD, "muro")
    v.text(LW / 2, LD, "muro de divisa (fundo)", 1.8, dy=3.2)


def lot_dims(v, fr, bk, us):
    v.dimV([0, fr, bk, LD], 0, -6); v.dimV([0, LD], 0, -12); v.dimH([0] + us + [LW], -3.0, -3); v.dimH([0, LW], LD, 9)


def plan_frame(sh, v, name, scale="1:50", note=None):
    vtitle(sh, v.ox, v.Y(LD) + 20, name, scale, note)


PX1, PX2, PY = 52, 245, 90      # origem das plantas
EX1, EX2, EY = 452, 650, 232    # fachadas (linha de terra)
CX, CY = 458, 440               # corte longitudinal


# ---------------- LOTE 1 — SOBRADO ----------------
def sobrado_terreo(v):
    lot_base(v)
    v.rect(0, 0, 6.75, 3, "paver"); v.rect(0, 3, 5.0, 8, "pav2"); v.rect(5.5, 0, 6.75, 8, "conc")
    v.rect(6.75, 0, LW, 16, "brita"); v.rect(2.4, 16, LW, 18, "wood"); v.rect(2.6, 16.1, 8.1, 17.9, "dash")
    v.box(3.2, 16.75, 5.0, 17.45); v.box(5.9, 17.35, 8.05, 17.9); v.rect(5.95, 17.4, 6.75, 17.85, "graf")
    for cx in (3.5, 4.1, 4.7):
        v.box(cx - .18, 16.43, cx + .18, 16.71); v.box(cx - .18, 17.49, cx + .18, 17.77)
    v.text(6.6, 16.75, "DECK GOURMET", 1.9, bold=True); v.text(6.6, 16.75, "pergolado · churrasqueira", 1.5, dy=2.6)
    v.rect(0, 16, 2.4, 17.4, "conc"); v.walls([(0, 17.25, 2.4, 17.4), (0, 16, .15, 17.4)])
    v.sink(.25, 16.6, .85, 17.2); v.box(.95, 16.6, 1.55, 17.2); v.circ(1.25, 16.9, .2, "furn"); v.text(1.95, 16.5, "A.S.", 1.8, bold=True)
    v.car(.35, 3.3, 2.35, 7.6); v.car(2.75, 3.3, 4.75, 7.6)
    v.rect(0, 3, 6.75, 16, "dash"); v.text(2.5, 7.9, "projeção do pav. superior", 1.7, dy=-28)
    v.rect(.15, 8.15, 6.6, 15.85, "open")
    v.walls([(0, 8, 6.75, 8.15), (0, 15.85, 6.75, 16), (0, 8, .15, 16), (6.6, 8, 6.75, 16),
             (2.25, 8.15, 2.4, 11.15), (.15, 11.15, 1.2, 11.3), (3.6, 8.15, 3.75, 9.9), (2.4, 9.75, 3.75, 9.9),
             (0, 3, .25, 3.25), (4.75, 3, 5.0, 3.25)])
    v.rect(5.0, 2.6, 5.5, 8.0, "stone")
    v.doorH(5.5, 6.55, 8, 8.15, "r", "s"); v.winH(2.7, 3.3, 8, 8.15); v.doorH(2.7, 3.4, 9.75, 9.9, "l", "n")
    v.winH(3.0, 6.2, 15.85, 16, "p"); v.doorH(.9, 1.7, 15.85, 16, "l", "s"); v.winV(11.0, 13.0, 6.6, 6.75)
    v.stair(1.25, 2.25, 11.15, 9.19, 7, "SOBE"); v.stair(.15, 1.15, 9.19, 11.15, 7); v.rect(.15, 8.15, 2.25, 9.19, "thin")
    v.wc(3.0, 8.3, 0, 1); v.sink(2.45, 9.2, 2.85, 9.7)
    v.box(.2, 11.4, .8, 14.6); v.sink(.25, 12.45, .75, 13.15); v.box(.2, 14.7, .82, 15.4)
    for cy in (11.75, 12.05):
        v.circ(.38, cy, .09, "furn"); v.circ(.62, cy, .09, "furn")
    v.box(2.0, 12.1, 2.7, 14.3)
    for cy in (12.6, 13.2, 13.8):
        v.circ(3.0, cy, .16, "furn")
    v.box(3.4, 10.6, 5.2, 11.5)
    for cx in (3.7, 4.3, 4.9):
        v.box(cx - .2, 10.25, cx + .2, 10.55); v.box(cx - .2, 11.55, cx + .2, 11.85)
    v.box(3.9, 13.0, 4.75, 15.3); v.box(3.9, 13.0, 4.15, 15.3); v.box(5.0, 13.8, 5.7, 14.6); v.box(6.25, 13.4, 6.55, 15.2)
    v.room(2.5, 5.3, "GARAGEM COBERTA", 5.0, 5.0); v.text(2.5, 5.3, "2 vagas — sob o balanço", 1.8, dy=8.2)
    v.room(6.12, 5.5, "ACESSO", size=1.9); v.text(5.25, 5.3, "LÂMINA DE PEDRA", 1.7, rot=-90, dy=.6)
    v.room(5.2, 9.0, "HALL", size=1.9); v.room(3.0, 8.95, "LAV.", size=1.8)
    v.room(4.6, 12.35, "ESTAR / JANTAR / COZINHA", area=40.22, size=2.0); v.text(4.6, 12.35, "conceito aberto · 6,45 × 7,70", 1.6, dy=5.4)
    v.text(1.45, 13.3, "ilha", 1.5, dy=-1); v.text(1.2, 8.75, "ESCADA", 1.8, bold=True); v.text(7.5, 9, "recuo lateral 1,50 — jardim seco", 1.8, rot=-90)
    v.text(3.4, 1.6, "acesso de veículos — paver", 1.9)
    v.tree(7.5, 1.5, .65); v.tree(1.2, 17.7, .28)
    v.secmark(3.0, -1.0, 18.6)


def sobrado_sup(v):
    v.rect(0, 0, LW, LD, "lot"); v.rect(0, 0, LW, LD, "lotb")
    v.rect(.15, 3.0, 6.6, 15.85, "open"); v.rect(.15, 3.0, 6.6, 4.2, "wood")
    v.walls([(0, 3, .15, 16), (6.6, 3, 6.75, 16), (0, 15.85, 6.75, 16), (0, 4.2, 6.75, 4.35), (4.2, 4.35, 4.35, 7.85),
             (4.35, 5.85, 6.6, 6.0), (0, 7.85, 6.75, 8.0), (3.6, 8.0, 3.75, 10.0), (3.75, 10.0, 6.6, 10.15),
             (.15, 12.25, 6.6, 12.4), (3.15, 12.4, 3.3, 15.85)])
    v.rect(5.0, 2.6, 5.5, 4.35, "stone"); v.rect(.15, 3.0, 5.0, 3.06, "glass"); v.rect(5.5, 3.0, 6.6, 3.12, "ripado")
    v.winH(.6, 3.9, 4.2, 4.35, "p"); v.winH(5.55, 6.4, 4.2, 4.35)
    v.doorV(4.6, 5.4, 4.2, 4.35, "t", "e"); v.doorV(6.4, 7.1, 4.2, 4.35, "b", "e"); v.doorH(2.6, 3.4, 7.85, 8.0, "l", "n")
    v.doorV(8.6, 9.3, 3.6, 3.75, "t", "e"); v.doorH(1.6, 2.4, 12.25, 12.4, "l", "s"); v.doorH(4.0, 4.8, 12.25, 12.4, "l", "s")
    v.winV(6.5, 7.3, 6.6, 6.75); v.winV(8.8, 9.6, 6.6, 6.75); v.winV(10.5, 11.9, 6.6, 6.75); v.winV(13.2, 14.6, 6.6, 6.75)
    v.winH(.8, 2.6, 15.85, 16); v.winH(3.9, 5.9, 15.85, 16)
    v.stair(.15, 1.15, 11.15, 9.19, 7, "DESCE"); v.stair(1.25, 2.25, 9.19, 11.15, 7); v.rect(.15, 8.15, 2.25, 9.19, "thin"); v.rect(.15, 8.15, 2.3, 11.15, "med")
    v.bed(.2, 5.2, 2.2, 7.0, "w"); v.box(3.95, 5.5, 4.18, 6.3); v.box(6.05, 4.4, 6.55, 5.8)
    v.shower(5.6, 6.9, 6.6, 7.85); v.wc(6.45, 6.35, -1, 0); v.sink(4.4, 7.3, 5.0, 7.8)
    v.shower(5.7, 8.0, 6.6, 10.0); v.wc(4.9, 8.15, 0, 1); v.sink(3.8, 9.45, 4.4, 9.95)
    v.box(5.9, 10.4, 6.5, 11.9); v.box(5.4, 10.95, 5.8, 11.35)
    v.bed(.2, 13.6, 2.1, 15.0, "w"); v.box(.2, 12.45, 1.5, 13.0); v.bed(4.6, 13.6, 6.5, 15.0, "e"); v.box(5.0, 12.45, 6.5, 13.0)
    v.room(3.3, 3.75, "VARANDA — guarda-corpo de vidro", area=7.74, size=1.9)
    v.room(3.05, 4.75, "SUÍTE  4,05 × 3,50  14,18 m²", size=1.7); v.room(5.5, 5.1, "CLOSET", size=1.8); v.room(5.0, 6.55, "B. SUÍTE", size=1.7)
    v.room(4.9, 9.05, "BANHO", area=5.27, size=1.7); v.room(4.7, 11.0, "ESCRITÓRIO", size=1.7); v.text(4.7, 11.0, "2,85 × 2,10", 1.4, dy=2.6)
    v.room(2.95, 9.5, "HALL", size=1.7); v.text(1.2, 8.75, "VAZIO / ESCADA", 1.7, bold=True)
    v.text(1.65, 15.45, "QUARTO 2 · 3,00 × 3,45 · 10,35 m²", 1.45, bold=True); v.text(4.95, 15.45, "QUARTO 3 · 3,30 × 3,45 · 11,39 m²", 1.45, bold=True)
    v.text(6.05, 3.0, "brises", 1.6, dy=-1); v.text(3.4, 17, "(deck gourmet — ver térreo)", 2.0, fill="#666")
    v.text(3.4, 1.5, "(projeção sobre a garagem)", 2.0, fill="#666")
    v.secmark(3.0, -1.0, 18.6)


def sheet_sobrado():
    sh = Sheet("03_lote1_sobrado", "03", "LOTE 1 — SOBRADO CONTEMPORÂNEO", "Revisão 2: sem piscina, térreo em conceito aberto, quartos ampliados")
    v = V(sh, PX1, PY, 50); sobrado_terreo(v); lot_dims(v, 3, 16, [6.75]); v.dimV([3, 8, 16, 18], LW, 5)
    plan_frame(sh, v, "PLANTA TÉRREO", note="nível +0,15")
    v2 = V(sh, PX2, PY, 50); sobrado_sup(v2); v2.dimV([0, 3, 4.35, 8, 12.4, 16, 18], 0, -6); v2.dimH([0, 6.75, LW], 0, -5)
    plan_frame(sh, v2, "PLANTA PAVIMENTO SUPERIOR", note="nível +3,00")
    north(sh, 428, 70)
    f = V(sh, EX1, EY, 50, mirW=LW, yup=True)
    f.ground(-.6, LW + .6); f.rect(0, 0, LW, 2.2, "white"); f.rect(0, 0, 5.0, 2.85, "roof"); f.rect(5.5, 0, 6.75, 2.85, "white")
    f.rect(2.7, 1.9, 3.3, 2.3, "glass"); f.rect(5.55, .15, 6.55, 2.6, "ripado"); f.rect(6.75, 0, LW, 1.9, "graf")
    f.rect(0, 2.75, 6.75, 6.6, "white"); f.rect(.3, 3.0, 4.9, 5.55, "open"); f.rect(.3, 3.0, 4.9, 5.55, "thin")
    for a, b in ((.6, 1.7), (1.7, 2.8), (2.8, 3.9)):
        f.rect(a, 3.0, b, 5.3, "glass")
    f.rect(3.95, 3.0, 4.9, 5.55, "ripado"); f.rect(5.5, 3.0, 6.6, 5.55, "ripado")
    f.rect(.3, 3.0, 4.9, 4.1, "glass"); f.line(.3, 4.1, 4.9, 4.1, "med")
    f.rect(5.0, 0, 5.5, 7.1, "stone"); f.rect(0, 0, .25, 2.75, "graf")
    f.level(-.4, 0, "0,00"); f.level(-.4, 3.0); f.level(-.4, 6.6); f.level(LW + .4, 7.1)
    f.text(2.6, 6.1, "volume superior em balanço — pintura branca", 1.9); f.text(2.6, 1.3, "GARAGEM ABERTA", 2.0)
    f.text(6.05, 1.3, "porta pivotante", 1.6, rot=-90); f.text(7.5, .9, "portão", 1.7, fill="#fff")
    f.dimH([0, 1.5, LW], 0, 9, ["1,50", "6,75"])
    vtitle(sh, EX1, EY + 16, "FACHADA NORTE (frente — rua transversal)", "1:50")
    c = V(sh, CX, CY, 50, yup=True)
    c.ground(-1.4, 18.5); c.rect(2.6, 0, 8.0, 7.1, "stone")
    c.rect(8.0, .15, 16, 2.85, "white"); c.rect(3.0, 3.0, 16, 5.7, "white")
    c.rect(16, 0, 17.4, 2.5, "white"); c.line(16, 2.5, 17.4, 2.5, "med")
    c.walls([(3.0, 2.85, 16, 3.0), (8.0, 0, 16, .15), (3.0, 5.7, 16, 5.85), (3.0, 5.85, 3.15, 6.6), (15.85, 5.85, 16, 6.6),
             (8.0, .15, 8.15, 2.85), (9.75, .15, 9.9, 2.85), (15.85, .15, 16, 2.85), (4.2, 3.0, 4.35, 5.7), (7.85, 3.0, 8.0, 5.7),
             (12.25, 3.0, 12.4, 5.7), (15.85, 3.0, 16, 5.7), (17.85, 0, 18, 2.2), (3.0, 2.6, 3.15, 2.85)], "cut")
    c.line(3.15, 6.6, 15.85, 6.6); c.rect(3.0, 0, 3.25, 2.6, "thin"); c.rect(3.0, 0, 8.0, .05, "conc")
    for a, z0, z1 in ((9.75, .15, 2.25), (15.85, .15, 2.45), (4.2, 3.0, 5.3), (7.85, 3.0, 5.1)):
        c.rect(a, z0, a + .15, z1, "open"); c.rect(a + .05, z0, a + .1, z1, "glass")
    c.rect(8.0, 1.9, 8.15, 2.3, "open"); c.rect(3.0, 3.0, 3.05, 4.1, "glass")
    c.rect(16, 0, 18, .1, "wood"); c.rect(16.1, 2.45, 17.9, 2.65, "wood"); c.rect(17.75, 0, 17.85, 2.45, "graf")
    c.rect(12.1, .15, 14.3, 1.1, "furn"); c.rect(10.6, .15, 11.5, .9, "furn")
    for t, a, z in (("GARAGEM", 5.5, 1.4), ("LAV.", 8.95, 1.4), ("ESTAR / JANTAR / COZINHA", 12.9, 1.9), ("SUÍTE", 6.1, 4.3), ("HALL", 10.1, 4.3),
                    ("QUARTO 2", 14.1, 4.3), ("VAR.", 3.65, 4.6), ("DECK", 17.0, 1.2), ("RUA", -.75, .6)):
        c.text(a, z, t, 2.0)
    c.text(9.5, 6.1, "laje impermeabilizada + platibanda", 1.9)
    c.level(-.6, 0, "0,00"); c.level(1.4, .15); c.level(1.4, 3.0); c.level(1.4, 5.85); c.level(1.4, 6.6); c.level(17.2, 7.1)
    c.dimH([0, 3, 8, 16, 18], -.45, 7); c.dimV([.15, 2.85], 18.3, 3, ["2,70"]); c.dimV([3.0, 5.7], 18.3, 3, ["2,70"])
    vtitle(sh, CX, CY + 20, "CORTE AA (longitudinal)", "1:50")
    yy = table(sh, CX, 476, [138, 42], [("#", "QUADRO DE ÁREAS — LOTE 1 (148,50 m²)"), ("Térreo fechado (6,75 × 8,00)", "54,00 m²"),
               ("Área de serviço coberta", "3,36 m²"), ("Pavimento superior (6,75 × 13,00, c/ varanda)", "87,75 m²"),
               ("*", "Área construída total", "145,11 m²"), ("Garagem coberta sob o balanço (não soma)", "25,00 m²"),
               ("Projeção / taxa de ocupação", "91,11 m² — 61,4 %"), ("Coef. de aproveitamento", "0,98")], 5.6, 2.7)
    sh.text(CX, yy + 5.5, "3 quartos (1 suíte com closet) · escritório · lavabo · 2 vagas · deck gourmet · recuos: frente 3,00 / lateral leste 1,50 / fundo 2,00", 2.4)
    sh.text(CX, yy + 10, "Sem piscina: a casa cresceu 1,50 m para o fundo. Conferir taxa de ocupação e recuo de fundo na prefeitura. Balanço de 5,00 m: projeto estrutural.", 2.4)
    sh.frame(); return sh


# ---------------- LOTE 2 — CHALÉ ----------------
CH0, CH1, CF, CB = .75, 6.75, 5.5, 14.0   # limites do chale
KN, RG, MZ, PL = 1.95, 7.15, 3.15, .45   # topo mureta, cumeeira, piso mezanino, piso terreo


def chale_terreo(v):
    lot_base(v)
    v.rect(5.5, 0, 8.0, 5.3, "pav2"); v.car(5.8, .5, 7.7, 4.8); v.rect(2.6, 0, 4.0, 3.4, "conc")
    v.rect(.75, 3.7, 5.2, 5.5, "wood"); v.rect(2.6, 3.4, 4.0, 3.7, "wood")
    v.rect(.45, 5.2, 7.05, 14.3, "dash")
    v.rect(.9, 5.65, 6.6, 13.85, "open")
    v.walls([(.75, 5.5, 6.75, 5.65), (.75, 13.85, 6.75, 14), (.75, 5.5, .9, 14), (6.6, 5.5, 6.75, 14),
             (2.65, 11.2, 2.8, 13.85), (4.7, 10.6, 4.85, 13.85), (4.7, 10.6, 6.6, 10.75), (4.85, 12.3, 6.6, 12.45)])
    v.winH(2.25, 5.25, 5.5, 5.65, "p"); v.winH(1.0, 2.25, 5.5, 5.65); v.winH(5.25, 6.5, 5.5, 5.65)
    v.doorH(1.2, 2.0, 13.85, 14, "l", "s"); v.doorH(5.3, 6.1, 13.85, 14, "r", "s"); v.winH(3.3, 4.2, 13.85, 14)
    v.doorH(5.3, 6.0, 10.6, 10.75, "l", "s")
    v.rect(.9, 7.2, 1.5, 8.1, "stone"); v.text(1.2, 7.65, "LAREIRA", 1.5, rot=-90, dy=.5)
    v.stair(3.8, 4.7, 11.2, 12.95, 7, "SOBE"); v.stair(2.8, 3.7, 12.95, 11.2, 7); v.rect(2.8, 12.95, 4.7, 13.85, "thin")
    v.line(.9, 8.6, 6.6, 8.6, "dash"); v.text(3.75, 8.6, "projeção do mezanino", 1.7, dy=-1)
    v.box(2.3, 6.1, 4.6, 6.95); v.box(2.3, 6.1, 4.6, 6.35); v.box(5.6, 6.6, 6.5, 8.0); v.box(2.9, 7.4, 4.0, 8.0)
    v.box(3.1, 9.2, 4.6, 10.1)
    for cx in (3.4, 3.85, 4.3):
        v.box(cx - .18, 8.88, cx + .18, 9.16); v.box(cx - .18, 10.14, cx + .18, 10.42)
    v.box(.95, 9.0, 1.55, 13.0); v.sink(1.0, 10.6, 1.5, 11.3); v.box(.95, 9.0, 1.55, 9.65)
    for cy in (12.1, 12.4):
        v.circ(1.12, cy, .09, "furn"); v.circ(1.38, cy, .09, "furn")
    v.shower(5.7, 10.75, 6.6, 11.65); v.wc(6.45, 12.0, -1, 0); v.sink(4.9, 11.7, 5.35, 12.25)
    v.sink(4.9, 13.2, 5.5, 13.8); v.box(5.95, 12.5, 6.55, 13.1); v.circ(6.25, 12.8, .2, "furn")
    v.room(3.75, 7.0, "ESTAR — pé-direito duplo", 5.70, 2.95, size=2.1)
    v.room(4.2, 9.75, "JANTAR", size=1.9); v.room(1.9, 10.2, "COZ.", area=7.35, size=1.9)
    v.room(5.1, 11.0, "BANHO", size=1.7); v.room(5.4, 12.75, "A.S.", size=1.7)
    v.room(2.9, 4.6, "VARANDA — DECK", 4.45, 1.80, size=2.0); v.room(6.75, 2.6, "VAGA", 2.5, 5.0, size=2.0)
    v.text(.37, 9.7, "beiral", 1.5, rot=-90); v.text(7.6, 9.7, "recuo lateral 1,50", 1.8, rot=-90)
    v.tree(6.2, 16.3, 1.5); v.text(6.2, 16.3, "ARAUCÁRIA", 1.8, bold=True, dy=.6)
    v.circ(2.6, 16.2, .55, "stone"); v.text(2.6, 16.2, "fogo de chão", 1.6, dy=5.5); v.tree(1.3, 1.6, .7); v.tree(.9, 17.1, .5)
    v.secmark(3.75, -1.0, 18.6, "A")
    sh = v.sh; sh.line(v.X(-.5), v.Y(7.0), v.X(LW + .5), v.Y(7.0), "sec")
    sh.text(v.X(-.7), v.Y(7.0) + 1, "B", 3.2, "end", bold=True, fill="#b03020"); sh.text(v.X(LW + .7), v.Y(7.0) + 1, "B", 3.2, bold=True, fill="#b03020")


def chale_mez(v):
    v.rect(0, 0, LW, LD, "lot"); v.rect(0, 0, LW, LD, "lotb")
    v.rect(.45, 5.2, 7.05, 14.3, "telha"); v.line(.45, 5.2, 7.05, 5.2, "med")
    v.rect(.9, 5.65, 6.6, 13.85, "open"); v.rect(.9, 5.65, 6.6, 13.85, "thin")
    v.walls([(.75, 5.5, 6.75, 5.65), (.75, 13.85, 6.75, 14)])
    v.winH(1.6, 5.9, 5.5, 5.65); v.winH(2.9, 4.6, 13.85, 14)
    v.rect(.9, 5.65, 6.6, 8.6, "hatch"); v.rect(.9, 7.2, 1.5, 8.1, "stone")
    v.line(.9, 8.6, 6.6, 8.6, "med"); v.text(3.75, 8.6, "guarda-corpo", 1.6, dy=-1)
    v.stair(2.8, 3.7, 11.2, 12.95, 7, "DESCE"); v.stair(3.8, 4.7, 12.95, 11.2, 7); v.rect(2.8, 12.95, 4.7, 13.85, "thin"); v.rect(2.8, 11.2, 4.7, 13.85, "med")
    for x in (2.31, 5.19):
        v.line(x, 8.6, x, 13.85, "dash")
    v.bed(2.95, 8.85, 4.55, 10.85, "s"); v.box(.95, 9.0, 1.6, 13.6); v.box(5.9, 9.0, 6.55, 13.6)
    v.room(3.75, 7.0, "VAZIO SOBRE O ESTAR", size=2.0); v.room(3.75, 9.6, "QUARTO (LOFT)", size=2.0)
    v.text(1.9, 12.3, "pé-direito < 1,50", 1.5, rot=-90); v.text(5.6, 12.3, "pé-direito < 1,50", 1.5, rot=-90)
    v.text(1.28, 11.3, "armário baixo", 1.5, rot=-90); v.text(6.22, 11.3, "armário baixo", 1.5, rot=-90)
    v.text(3.75, 4.6, "telhado duas águas 60° — telha shingle/metálica grafite", 1.8)
    v.line(3.75, 5.2, 3.75, 5.5, "med"); v.line(3.75, 14, 3.75, 14.3, "med"); v.text(3.75, 14.9, "cumeeira +7,15", 1.7)
    v.secmark(3.75, -1.0, 18.6, "A")


def chale_shape(v, glass=True):
    """perfil A-frame no plano u-z (usado na fachada e no corte BB)"""
    e = .35
    v.poly([(CH0 - e, KN - e * 1.732), (3.75, RG + .28), (CH1 + e, KN - e * 1.732), (CH1 + e - .3, KN - e * 1.732), (3.75, RG - .24), (CH0 - e + .3, KN - e * 1.732)], "telha")


def sheet_chale():
    sh = Sheet("04_lote2_chale", "04", "LOTE 2 — CHALÉ A-FRAME", "Plantas térreo e mezanino, fachada norte, cortes AA e BB")
    v = V(sh, PX1, PY, 50); chale_terreo(v); lot_dims(v, 5.5, 14, [.75, 6.75]); v.dimV([3.7, 5.5, 8.6, 14, 18], LW, 5)
    plan_frame(sh, v, "PLANTA TÉRREO", note="nível +0,45")
    v2 = V(sh, PX2, PY, 50); chale_mez(v2); v2.dimV([0, 5.5, 8.6, 14, 18], 0, -6); v2.dimH([0, .75, 2.31, 5.19, 6.75, LW], 0, -5)
    plan_frame(sh, v2, "PLANTA MEZANINO / COBERTURA", note="nível +3,15")
    north(sh, 428, 70)
    f = V(sh, EX1, EY, 50, mirW=LW, yup=True)
    f.ground(-.6, LW + .6); f.treeE(6.2, 8.6, 1.6); f.rect(.9, 0, 1.6, 6.3, "stone"); f.rect(.8, 6.3, 1.7, 6.5, "graf")
    f.poly([(CH0, PL), (CH0, KN), (3.75, RG), (CH1, KN), (CH1, PL)], "white")
    f.poly([(CH0 + .95, MZ + .1), (3.75, RG - .55), (CH1 - .95, MZ + .1)], "glass")
    f.line(3.75, MZ + .1, 3.75, RG - .45, "med"); f.line(2.3, MZ + .1, 2.3, 4.9, "med"); f.line(5.2, MZ + .1, 5.2, 4.9, "med"); f.line(2.05, 4.5, 5.45, 4.5, "med")
    f.poly([(CH0, PL), (CH0, KN), (CH0 + .69, MZ), (CH1 - .69, MZ), (CH1, KN), (CH1, PL)], "ripado"); f.rect(2.25, PL, 5.25, 2.75, "graf")
    for a, b in ((2.32, 3.24), (3.28, 4.22), (4.26, 5.18)):
        f.rect(a, PL + .05, b, 2.68, "glass")
    f.rect(1.25, 1.1, 2.1, 2.5, "glass"); f.rect(5.4, 1.1, 6.25, 2.5, "glass")
    chale_shape(f)
    f.rect(CH0, 0, CH1, PL, "stone"); f.rect(.75, PL - .05, 5.2, PL + .05, "wood")
    for x in [.8 + i * .22 for i in range(9)] + [4.05 + i * .22 for i in range(6)]:
        f.line(x, PL, x, PL + .95)
    f.line(.75, PL + .95, 2.6, PL + .95, "med"); f.line(4.0, PL + .95, 5.2, PL + .95, "med"); f.rect(2.6, 0, 4.0, .3, "wood")
    f.level(-.4, 0, "0,00"); f.level(-.4, PL); f.level(LW + .3, RG); f.level(LW + .3, MZ)
    f.text(1.25, 6.9, "chaminé de pedra", 1.8); f.text(6.4, 9.0, "araucária", 1.8)
    f.dimH([0, .75, 6.75, LW], 0, 9)
    vtitle(sh, EX1, EY + 16, "FACHADA NORTE (oitão de vidro)", "1:50")
    # corte BB transversal (olhando para o fundo)
    b = V(sh, EX2, EY, 50, mirW=LW, yup=True)
    b.ground(-.3, LW + .3)
    b.poly([(CH0 + .15, PL), (CH0 + .15, KN), (3.75, RG - .26), (CH1 - .15, KN), (CH1 - .15, PL)], "white")
    chale_shape(b)
    b.walls([(CH0, 0, CH0 + .15, KN), (CH1 - .15, 0, CH1, KN), (CH0, PL - .12, CH1, PL)], "cut"); b.rect(CH0, 0, CH1, PL - .12, "stone")
    zf = MZ; xi = (zf - KN) / 1.732
    b.line(CH0 + xi, zf, CH1 - xi, zf, "dash"); b.line(CH0 + xi, zf - .2, CH1 - xi, zf - .2, "dash")
    b.line(CH0 + xi + .3, zf, CH0 + xi + .3, zf + 1.0); b.line(CH1 - xi - .3, zf, CH1 - xi - .3, zf + 1.0); b.line(CH0 + xi + .3, zf + 1.0, CH1 - xi - .3, zf + 1.0, "med")
    b.rect(.9, PL, 1.5, 3.0, "stone"); b.rect(.9, PL + .25, 1.5, PL + .95, "graf"); b.rect(.9, 3.0, 1.5, 6.3, "stone")
    chale_shape(b)
    b.rect(2.3, PL, 4.6, PL + .8, "furn"); b.line(0, 0, 0, 2.2, "muro"); b.line(LW, 0, LW, 2.2, "muro")
    b.text(3.75, 1.9, "ESTAR — pé-direito duplo", 2.0); b.text(3.75, 3.7, "mezanino ao fundo (+3,15)", 1.7); b.text(3.75, 5.6, "60°", 2.0)
    b.level(-.1, PL); b.level(-.1, KN); b.level(-.1, RG)
    b.dimH([0, .75, 6.75, LW], 0, 9)
    vtitle(sh, EX2, EY + 16, "CORTE BB (transversal)", "1:50")
    # corte AA longitudinal
    c = V(sh, CX, CY, 50, yup=True)
    c.ground(-1.4, 18.5); c.treeE(16.3, 8.6, 1.6)
    c.rect(CF, PL, CB, RG, "white")
    for i in range(1, 17):
        z = KN + (RG - KN) * i / 17
        c.line(CF + .15, z, CB - .15, z, "thin")
    c.rect(CF - .3, RG - .05, CB + .3, RG + .28, "telha")
    c.rect(7.2, PL, 8.1, 3.0, "stone"); c.rect(7.3, PL + .25, 8.0, PL + .95, "graf"); c.rect(7.25, 3.0, 8.05, 6.3, "stone")
    c.rect(8.6, PL, CB - .15, MZ - .2, "white")
    c.walls([(CF, 0, CB, PL), (8.6, MZ - .2, CB, MZ), (CF, 2.75, CF + .15, RG), (CB - .15, PL, CB, RG)], "cut")
    c.rect(CF, PL, CF + .15, 2.75, "open"); c.rect(CF + .05, PL, CF + .1, 2.75, "glass"); c.rect(CF + .05, 2.9, CF + .1, RG - .5, "glass")
    c.rect(CB - .15, 1.3, CB, 2.4, "open"); c.rect(CB - .1, 1.3, CB - .05, 2.4, "glass"); c.rect(CB - .15, MZ + .9, CB, MZ + 2.2, "open"); c.rect(CB - .1, MZ + .9, CB - .05, MZ + 2.2, "glass")
    c.line(8.6, MZ, 8.6, MZ + 1.0, "med"); c.line(8.6, MZ + 1.0, 8.75, MZ + 1.0, "med")
    for i in range(8):
        c.line(11.2 + i * .25, PL + i * .17, 11.45 + i * .25, PL + i * .17, "dash"); c.line(11.45 + i * .25, PL + i * .17, 11.45 + i * .25, PL + (i + 1) * .17, "dash")
    c.rect(12.95, PL + 1.3, 13.85, PL + 1.42, "dash")
    c.rect(3.7, PL - .12, CF, PL, "wood"); c.rect(3.7, 0, CF, PL - .12, "thin"); c.rect(3.4, 0, 3.7, .3, "wood")
    c.line(3.75, PL, 3.75, PL + .95); c.line(3.75, PL + .95, 5.2, PL + .95, "med"); c.walls([(17.85, 0, 18, 2.2)], "cut")
    c.rect(8.9, MZ, 10.9, MZ + .5, "furn")
    for t, a, z in (("ESTAR — pé-direito duplo", 6.9, 1.6) if False else ("ESTAR", 6.3, 1.6), ("JANTAR / ESCADA", 11.3, 1.9), ("QUARTO (LOFT)", 11.2, 4.4),
                    ("DECK", 4.6, 1.1), ("QUINTAL", 16.0, .8), ("RUA", -.75, .6), ("lareira", 7.65, 2.2)):
        c.text(a, z, t, 2.0)
    c.text(9.8, RG + .6, "cumeeira — telhado em vista (água leste)", 1.9)
    c.level(-.6, 0, "0,00"); c.level(1.6, PL); c.level(1.6, MZ); c.level(1.6, RG)
    c.dimH([0, 3.7, 5.5, 8.6, 14, 18], -.45, 7); c.dimV([PL, MZ - .2], 18.3, 4, ["2,50"])
    vtitle(sh, CX, CY + 20, "CORTE AA (longitudinal, pela cumeeira)", "1:50")
    yy = table(sh, CX, 476, [138, 42], [("#", "QUADRO DE ÁREAS — LOTE 2 (148,50 m²)"), ("Térreo (6,00 × 8,50)", "51,00 m²"),
               ("Mezanino (piso, descontado o vão da escada)", "26,46 m²"), ("*", "Área construída total", "77,46 m²"),
               ("Mezanino com pé-direito ≥ 1,50 m (útil)", "≈ 10,10 m²"), ("Varanda em deck (descoberta)", "8,01 m²"),
               ("Projeção / taxa de ocupação", "51,00 m² — 34,3 %"), ("Coef. de aproveitamento", "0,52")], 5.6, 2.7)
    sh.text(CX, yy + 5.5, "1 quarto em loft · estar com pé-direito duplo e lareira · embasamento de pedra · revestimento de madeira · 1 vaga descoberta", 2.4)
    sh.text(CX, yy + 10, "Recuos: frente 5,50 · laterais 0,75 (oeste, sem aberturas) e 1,50 (leste) · fundo 4,00. Araucária: plantar a ≥ 3 m das fundações.", 2.4)
    sh.frame(); return sh


# ---------------- LOTE 3 — TÉRREA (laje plana + beiral) ----------------
def l3_plan(v):
    lot_base(v)
    v.rect(.3, 0, 3.3, 5.0, "pav2"); v.car(.85, .5, 2.75, 4.7); v.rect(3.5, 0, 8.1, 5.0, "brita")
    for i in range(5):
        v.rect(7.2, .2 + i * .95, 8.0, .9 + i * .95, "conc")
    v.tree(4.6, 1.6, .55); v.tree(5.9, 3.4, .45); v.tree(4.3, 3.9, .35); v.tree(6.3, 1.2, .3)
    for x in [.3 + i * .5 for i in range(7)]:
        v.rect(x, .3, x + .12, 5.0, "wood")
    v.rect(.3, .3, 3.3, 5.0, "dash")
    v.rect(1.5, 15, 6.3, 17.4, "wood"); v.rect(6.45, 15, 8.1, 17.4, "conc"); v.rect(.5, 3.8, LW, 17.4, "dash")
    v.rect(1.65, 5.15, 8.1, 14.85, "open")
    v.walls([(1.5, 5, LW, 5.15), (1.5, 14.85, LW, 15), (1.5, 5, 1.65, 15), (8.1, 5, LW, 17.4), (6.95, 5.15, 7.1, 9.95),
             (4.75, 5.15, 4.9, 11.2), (4.9, 6.95, 6.95, 7.1), (1.65, 8.15, 6.95, 8.3), (4.9, 9.8, 6.95, 9.95), (1.65, 11.2, 6.95, 11.35),
             (6.3, 15, 6.45, 17.4), (6.45, 17.25, LW, 17.4)])
    v.doorH(7.15, 8.05, 5, 5.15, "r", "s"); v.winH(2.3, 4.3, 5, 5.15); v.winH(5.5, 6.3, 5, 5.15)
    v.doorV(7.2, 8.0, 6.95, 7.1, "t", "w"); v.vao(4.75, 7.2, 4.9, 8.0); v.doorH(5.2, 5.9, 6.95, 7.1, "l", "n")
    v.doorV(10.2, 10.95, 4.75, 4.9, "b", "w"); v.doorH(5.5, 6.2, 9.8, 9.95, "l", "n"); v.winV(9.0, 10.5, 1.5, 1.65)
    v.winH(2.2, 6.2, 14.85, 15, "p"); v.winV(12.2, 13.6, 1.5, 1.65); v.doorH(7.2, 7.95, 14.85, 15, "r", "s")
    v.bed(2.2, 5.9, 4.1, 7.5, "w") if False else v.bed(2.4, 6.2, 4.3, 7.8, "e")
    v.box(1.7, 5.2, 2.25, 7.0); v.box(4.95, 7.15, 6.9, 7.6)
    v.shower(4.9, 5.15, 5.8, 6.1) if False else v.shower(6.0, 5.95, 6.95, 6.95); v.wc(6.5, 5.3, 0, 1); v.sink(4.95, 5.2, 5.45, 5.8)
    v.bed(1.7, 8.4, 3.6, 9.4, "w"); v.box(2.6, 10.6, 4.7, 11.15)
    v.shower(4.9, 8.3, 5.75, 9.8); v.wc(6.35, 8.45, 0, 1); v.sink(6.4, 9.25, 6.9, 9.75); v.rect(5.6, 8.7, 6.2, 9.3, "dash")
    v.box(7.5, 11.5, 8.05, 14.6); v.sink(7.55, 12.6, 8.0, 13.3); v.box(7.5, 13.9, 8.05, 14.6); v.box(6.2, 12.2, 6.8, 13.9)
    for cy in (11.8, 12.1):
        v.circ(7.66, cy, .08, "furn"); v.circ(7.9, cy, .08, "furn")
    v.box(1.75, 11.5, 2.55, 13.9); v.box(1.75, 11.5, 2.0, 13.9); v.box(3.6, 12.3, 5.2, 13.2)
    for cx in (3.9, 4.4, 4.9):
        v.box(cx - .18, 11.98, cx + .18, 12.26); v.box(cx - .18, 13.24, cx + .18, 13.52)
    v.box(1.7, 16.8, 4.3, 17.35); v.rect(1.75, 16.85, 2.5, 17.3, "graf"); v.box(3.0, 15.5, 5.2, 16.3)
    v.sink(6.55, 16.6, 7.2, 17.2); v.box(7.3, 16.6, 7.95, 17.2); v.circ(7.62, 16.9, .2, "furn")
    v.room(3.2, 7.0, "SUÍTE", 3.10, 3.00, size=2.0) if False else v.room(3.25, 5.75, "SUÍTE  3,10 × 3,00  9,30 m²", size=1.6)
    v.room(5.9, 6.4, "B. SUÍTE", size=1.6); v.room(5.9, 7.85, "CLOSET", size=1.6)
    v.room(3.2, 9.9, "QUARTO 2", 3.10, 2.90, size=1.9); v.room(5.4, 9.2, "BANHO", size=1.6); v.text(5.9, 9.05, "domus", 1.4)
    v.room(5.9, 10.7, "HALL", size=1.6); v.text(7.6, 8.2, "CIRCULAÇÃO  1,00", 1.7, rot=-90, bold=True)
    v.room(4.9, 14.3, "ESTAR / JANTAR / COZINHA   6,45 × 3,50   22,58 m²", size=1.7)
    v.room(3.9, 16.6, "VARANDA GOURMET", 4.80, 2.40, size=1.9); v.room(7.25, 15.7, "A. SERV.", size=1.7)
    v.text(2.1, 17.05, "churr.", 1.4, fill="#fff"); v.room(1.8, 2.4, "GARAGEM", size=1.9); v.text(1.8, 2.4, "pergolado de madeira", 1.6, dy=3)
    v.text(5.4, 2.5, "JARDIM SECO — brita e capins", 1.9, bold=True); v.text(.75, 10, "recuo lateral 1,50 — jardim", 1.8, rot=-90)
    v.text(4.5, 4.2, "projeção do beiral (1,20)", 1.6); v.tree(.75, 6.5, .5); v.tree(.75, 13, .5); v.tree(.9, 16.6, .55)
    v.secmark(3.2, -1.0, 18.6)


def sheet_l3():
    sh = Sheet("05_lote3_terrea", "05", "LOTE 3 — CASA TÉRREA (LAJE PLANA E BEIRAL)", "Planta, cobertura, fachada norte e corte AA")
    v = V(sh, PX1, PY, 50); l3_plan(v); lot_dims(v, 5, 15, [1.5]); v.dimV([0, 5, 8.3, 11.35, 15, 17.4, 18], LW, 5)
    plan_frame(sh, v, "PLANTA TÉRREO", note="nível +0,15")
    v2 = V(sh, PX2, PY, 50)
    v2.rect(0, 0, LW, LD, "grass"); v2.rect(0, 0, LW, LD, "lotb"); v2.rect(3.5, 0, 8.1, 3.8, "brita")
    for x in [.3 + i * .5 for i in range(7)]:
        v2.rect(x, .3, x + .12, 5.0, "wood")
    v2.rect(.3, .3, 3.3, .45, "graf"); v2.rect(.3, 4.85, 3.3, 5.0, "graf")
    v2.rect(.5, 3.8, LW, 17.4, "roof"); v2.rect(1.5, 5, LW, 15, "thin"); v2.rect(5.6, 8.7, 6.2, 9.3, "glass")
    v2.text(4.4, 10.4, "LAJE IMPERMEABILIZADA", 2.2, bold=True); v2.text(4.4, 10.4, "i = 2 % → ralos e buzinotes", 1.8, dy=3.5)
    v2.text(4.4, 4.5, "beiral em balanço 1,20", 1.8); v2.text(4.4, 16.3, "cobertura da varanda gourmet", 1.8); v2.text(5.9, 8.5, "domus", 1.5)
    v2.text(1.0, 10.4, "beiral 1,00", 1.6, rot=-90); v2.text(1.8, 2.6, "pergolado", 1.8)
    v2.dimH([0, .5, LW], 0, -5); v2.dimV([0, 3.8, 17.4, 18], 0, -6)
    plan_frame(sh, v2, "PLANTA DE COBERTURA")
    north(sh, 428, 70)
    f = V(sh, EX1, EY, 50, mirW=LW, yup=True)
    f.ground(-.6, LW + .6); f.rect(0, 0, LW, 2.2, "furn"); f.rect(1.5, 0, LW, 3.0, "white"); f.rect(1.5, 3.0, LW, 3.5, "white")
    f.rect(4.9, .15, 7.0, 3.0, "ripado"); f.rect(5.5, 2.0, 6.3, 2.5, "glass"); f.rect(7.15, .15, 8.05, 2.5, "wood")
    f.rect(2.3, .9, 4.3, 2.4, "graf"); f.rect(2.37, .97, 3.28, 2.33, "glass"); f.rect(3.32, .97, 4.23, 2.33, "glass")
    f.rect(.5, 2.85, LW, 3.12, "graf")
    f.rect(.3, 2.45, 3.3, 2.65, "wood"); f.rect(.3, 0, .42, 2.45, "graf"); f.rect(3.18, 0, 3.3, 2.45, "graf")
    for x in [.3 + i * .5 for i in range(7)]:
        f.rect(x, 2.65, x + .12, 2.8, "wood")
    for x, h in ((4.6, .9), (5.9, .7), (6.3, .5)):
        f.ell(x, h * .5, .35, h * .5, "tree")
    f.level(-.4, 0, "0,00"); f.level(-.4, 3.12); f.level(LW + .4, 3.5)
    f.text(4.9, 3.25, "platibanda recuada", 1.7); f.text(5.95, 1.2, "ripado", 1.7); f.text(1.8, 1.3, "GARAGEM", 1.9)
    f.dimH([0, 1.5, LW], 0, 9)
    vtitle(sh, EX1, EY + 16, "FACHADA NORTE (frente — rua transversal)", "1:50")
    c = V(sh, CX, CY, 50, yup=True)
    c.ground(-1.4, 18.5); c.rect(5.15, .15, 14.85, 2.85, "white")
    c.walls([(5, 0, 15, .15), (3.8, 2.85, 17.4, 3.0), (5, 3.0, 5.15, 3.5), (14.85, 3.0, 15, 3.5), (5, .15, 5.15, 2.85), (8.15, .15, 8.3, 2.85),
             (11.2, .15, 11.35, 2.85), (14.85, .15, 15, 2.85), (17.85, 0, 18, 2.2)], "cut")
    c.line(5.15, 3.5, 14.85, 3.5); c.rect(5, .9, 5.15, 2.4, "open"); c.rect(5.05, .9, 5.1, 2.4, "glass")
    c.rect(14.85, .15, 15, 2.4, "open"); c.rect(14.9, .15, 14.95, 2.4, "glass"); c.rect(15, 0, 17.4, .1, "wood")
    c.rect(17.25, 0, 17.4, 2.85, "thin"); c.rect(.3, 2.45, 5.0, 2.65, "wood"); c.rect(.3, 0, .42, 2.45, "graf"); c.rect(.3, 0, 5, .05, "conc")
    c.rect(2.4, .15, 4.3, .6, "furn"); c.rect(1.7 + 7.0, .15, 10.4, .6, "furn"); c.rect(12.3, .15, 13.2, .9, "furn"); c.rect(15.5, .1, 16.3, .85, "furn")
    for t, a, z in (("SUÍTE", 6.6, 1.5), ("QUARTO 2", 9.75, 1.5), ("ESTAR / JANTAR", 13.1, 1.5), ("VARANDA GOURMET", 16.2, 1.5),
                    ("GARAGEM — pergolado", 2.6, 1.4), ("RUA", -.75, .6)):
        c.text(a, z, t, 2.0)
    c.text(10, 3.2, "laje impermeabilizada + platibanda", 1.8, dy=-.3); c.text(4.3, 3.3, "beiral 1,20", 1.8)
    c.level(-.6, 0, "0,00"); c.level(1.5, .15, "+0,15"); c.level(18.9, 3.0); c.level(18.9, 3.5)
    c.dimH([0, 5, 15, 17.4, 18], -.45, 7); c.dimV([.15, 2.85], 18.3, 4, ["2,70"])
    vtitle(sh, CX, CY + 20, "CORTE AA (longitudinal)", "1:50")
    yy = table(sh, CX, 476, [138, 42], [("#", "QUADRO DE ÁREAS — LOTE 3 (148,50 m²)"), ("Casa (6,75 × 10,00)", "67,50 m²"),
               ("Varanda gourmet + área de serviço cobertas", "16,20 m²"), ("*", "Área construída total", "83,70 m²"),
               ("Pergolado da garagem (não soma)", "14,10 m²"), ("Projeção / taxa de ocupação", "83,70 m² — 56,4 %"), ("Coef. de aproveitamento", "0,56")], 5.6, 2.7)
    sh.text(CX, yy + 5.5, "2 quartos (1 suíte com closet) · estar/jantar/cozinha integrados abrindo para a varanda gourmet · 1 vaga sob pergolado", 2.4)
    sh.text(CX, yy + 10, "Recuos: frente 5,00 · lateral oeste 1,50 · parede leste na divisa (sem aberturas) · banho social com iluminação zenital (domus).", 2.4)
    sh.frame(); return sh


# ---------------- LOTE 4 — TÉRREA (volume de madeira + garagem grafite) ----------------
def l4_plan(v):
    lot_base(v)
    v.rect(5.4, 0, 8.1, 3.0, "paver"); v.rect(1.9, 0, 2.9, 4.0, "conc"); v.rect(0, 0, 1.5, 15.35, "brita")
    for i in range(9):
        v.rect(.35, 4.2 + i * 1.2, 1.15, 5.0 + i * 1.2, "conc")
    v.tree(4.1, 1.7, .7); v.tree(3.6, 3.2, .35); v.tree(.75, 1.6, .6)
    v.rect(1.5, 15.35, 6.75, 17.85, "wood"); v.rect(6.9, 15.35, 8.1, 17.0, "conc")
    for y in [15.5 + i * .45 for i in range(6)]:
        v.rect(1.5, y, 6.75, y + .1, "wood")
    v.rect(1.5, 15.35, 6.75, 17.85, "dash")
    v.rect(1.65, 4.15, 8.1, 15.2, "open"); v.rect(5.4, 3.15, 8.1, 8.3, "pav2")
    v.walls([(1.5, 4, 5.25, 4.15), (5.25, 3, 5.4, 8.3), (5.25, 3, LW, 3.15), (8.1, 3, LW, 17.0), (1.5, 4, 1.65, 15.35), (5.4, 8.15, 8.1, 8.3),
             (1.65, 10.6, 8.1, 10.75), (3.7, 10.75, 3.85, 12.2), (5.9, 10.75, 6.05, 12.2), (1.65, 12.2, 8.1, 12.35),
             (4.8, 12.35, 4.95, 15.2), (1.5, 15.2, LW, 15.35), (6.75, 16.85, LW, 17.0)])
    v.rect(5.5, 3, 8.0, 3.15, "open"); v.rect(5.5, 3.04, 8.0, 3.11, "wood")
    v.doorH(1.9, 2.8, 4, 4.15, "l", "s"); v.winH(3.1, 5.0, 4, 4.15); v.doorH(5.6, 6.4, 8.15, 8.3, "l", "s")
    v.vao(4.2, 10.6, 5.3, 10.75); v.doorH(3.95, 4.7, 12.2, 12.35, "r", "s"); v.doorH(2.3, 3.0, 12.2, 12.35, "l", "n")
    v.doorH(5.05, 5.8, 12.2, 12.35, "l", "s"); v.doorV(11.0, 11.7, 5.9, 6.05, "t", "e")
    v.winV(11.1, 11.8, 1.5, 1.65); v.winH(2.2, 4.2, 15.2, 15.35, "p"); v.winH(5.6, 7.4, 15.2, 15.35); v.winV(13.2, 14.4, 1.5, 1.65)
    v.winV(5.2, 7.6, 1.5, 1.65); v.doorV(9.3, 10.2, 1.5, 1.65, "t", "w")
    v.car(5.8, 3.4, 7.7, 7.7)
    v.box(1.7, 5.3, 2.5, 7.6); v.box(1.7, 5.3, 1.95, 7.6); v.box(4.75, 5.6, 5.2, 7.2); v.box(2.9, 5.9, 3.9, 6.9)
    v.box(2.6, 8.7, 4.2, 9.6)
    for cx in (2.9, 3.4, 3.9):
        v.box(cx - .18, 8.38, cx + .18, 8.66); v.box(cx - .18, 9.64, cx + .18, 9.92)
    v.box(5.1, 8.5, 5.55, 10.4); v.box(7.5, 8.35, 8.05, 10.55); v.sink(7.55, 9.0, 8.0, 9.7); v.box(7.5, 8.35, 8.05, 8.95)
    for cy in (10.05, 10.33):
        v.circ(7.66, cy, .08, "furn"); v.circ(7.9, cy, .08, "furn")
    v.rect(6.2, 9.1, 6.9, 9.8, "dash"); v.text(6.55, 9.5, "domus", 1.3)
    v.shower(1.65, 10.75, 2.2, 12.2); v.wc(3.55, 11.2, -1, 0); v.sink(3.15, 11.65, 3.65, 12.15)
    v.shower(7.2, 10.75, 8.1, 12.2); v.wc(6.6, 10.9, 0, 1); v.sink(6.1, 11.65, 6.6, 12.15); v.rect(6.45, 11.3, 7.0, 11.85, "dash")
    v.bed(2.3, 13.3, 4.2, 14.9, "e") if False else v.bed(2.5, 12.9, 4.1, 14.8, "n")
    v.box(4.25, 12.9, 4.75, 15.1) if False else v.box(1.7, 14.5, 2.2, 15.15)
    v.bed(6.2, 12.9, 8.05, 13.9, "e"); v.box(5.0, 13.9, 5.5, 15.15)
    v.box(2.0, 17.25, 5.0, 17.8); v.rect(2.05, 17.3, 2.8, 17.75, "graf"); v.box(3.0, 15.9, 5.2, 16.7)
    v.sink(7.0, 15.45, 7.6, 16.0); v.box(7.4, 16.15, 8.0, 16.75); v.circ(7.7, 16.45, .2, "furn")
    v.room(3.45, 7.75, "ESTAR / JANTAR", 3.60, 6.45, size=2.0); v.text(3.45, 4.9, "pé-direito duplo 5,00", 1.7)
    v.room(6.75, 5.0, "GARAGEM", 2.70, 5.00, size=1.9) if False else v.text(6.75, 8.0, "GARAGEM FECHADA 2,70 × 5,00", 1.5, bold=True)
    v.room(6.5, 9.0, "COZINHA", size=1.7); v.text(6.5, 9.0, "2,70 × 2,30", 1.4, dy=-3.6)
    v.room(2.9, 11.3, "B. SUÍTE", size=1.5); v.room(4.87, 11.5, "HALL", size=1.6); v.room(6.6, 12.05, "BANHO", size=1.4)
    v.text(3.25, 14.95, "SUÍTE 3,15 × 2,85 — 8,98 m²", 1.5, bold=True); v.text(6.6, 14.6, "QUARTO 2", 1.8, bold=True); v.text(6.6, 14.6, "3,15 × 2,85 — 8,98 m²", 1.4, dy=2.4)
    v.room(4.1, 17.0, "ÁREA GOURMET — pergolado 5,25 × 2,50", size=1.7); v.text(2.42, 17.6, "churr.", 1.3, fill="#fff"); v.room(7.5, 15.25, "A.S.", size=1.5)
    v.text(.75, 2.9, "passeio lateral 1,50", 1.5, dy=9)
    v.text(6.75, 1.5, "acesso veículos", 1.8); v.text(LW, 13.5, "muro existente do vizinho (h ≈ 2,80)", 1.7, rot=-90, dx=15)
    v.secmark(3.4, -1.0, 18.6)


def sheet_l4():
    sh = Sheet("06_lote4_terrea", "06", "LOTE 4 — CASA TÉRREA (VOLUME DE MADEIRA E GARAGEM)", "Planta, cobertura, fachada norte e corte AA")
    v = V(sh, PX1, PY, 50); l4_plan(v); lot_dims(v, 3, 15.35, [1.5, 5.25]); v.dimV([0, 3, 8.3, 10.75, 12.35, 15.35, 17.85, 18], LW, 9)
    plan_frame(sh, v, "PLANTA TÉRREO", note="nível +0,15")
    v2 = V(sh, PX2, PY, 50)
    v2.rect(0, 0, LW, LD, "grass"); v2.rect(0, 0, LW, LD, "lotb"); v2.rect(0, 0, 1.5, 15.35, "brita")
    v2.rect(1.5, 10.75, LW, 15.35, "roof"); v2.rect(5.4, 3, LW, 10.75, "roof"); v2.rect(1.5, 4, 5.4, 10.75, "roof"); v2.rect(1.5, 4, 5.4, 10.75, "med")
    v2.rect(6.2, 9.1, 6.9, 9.8, "glass"); v2.rect(6.45, 11.3, 7.0, 11.85, "glass")
    for y in [15.5 + i * .45 for i in range(6)]:
        v2.rect(1.5, y, 6.75, y + .1, "wood")
    v2.rect(6.9, 15.35, LW, 17.0, "roof")
    v2.text(3.45, 7.2, "VOLUME ALTO", 2.0, bold=True); v2.text(3.45, 7.2, "laje +5,30 / platib. +5,70", 1.6, dy=3.3)
    v2.text(6.8, 6.3, "GARAGEM", 1.8, bold=True); v2.text(6.8, 6.3, "laje +3,00", 1.6, dy=3.2)
    v2.text(4.9, 13.1, "LAJE +3,00 — platibanda +3,45", 1.9, bold=True); v2.text(4.9, 13.1, "i = 2 % → ralos e buzinotes", 1.7, dy=3.3)
    v2.text(4.1, 16.9, "pergolado de madeira", 1.8); v2.text(6.55, 10.3, "domus", 1.4)
    v2.dimH([0, 1.5, 5.4, LW], 0, -5); v2.dimV([0, 3, 4, 10.75, 15.35, 18], 0, -6)
    plan_frame(sh, v2, "PLANTA DE COBERTURA")
    north(sh, 428, 70)
    f = V(sh, EX1, EY, 50, mirW=LW, yup=True)
    f.ground(-.6, LW + .6); f.rect(0, 0, LW, 2.2, "furn"); f.rect(1.5, 0, LW, 3.45, "white")
    f.rect(1.5, 0, 5.4, 5.7, "ripado"); f.rect(1.9, .15, 2.8, 2.45, "graf"); f.rect(1.98, .2, 2.72, 2.38, "glass")
    f.rect(3.1, .15, 5.0, 2.45, "graf"); f.rect(3.17, .22, 4.03, 2.38, "glass"); f.rect(4.07, .22, 4.93, 2.38, "glass")
    f.rect(1.9, 3.3, 5.0, 4.9, "graf"); f.rect(1.97, 3.37, 3.43, 4.83, "glass"); f.rect(3.47, 3.37, 4.93, 4.83, "glass")
    f.rect(5.4, 0, LW, 3.3, "graf"); f.rect(5.5, 0, 8.0, 2.45, "wood"); f.line(5.4, 2.75, LW, 2.75, "thin")
    f.ell(4.1, .6, .5, .6, "tree"); f.ell(3.55, .3, .3, .3, "tree")
    f.level(-.4, 0, "0,00"); f.level(-.4, 5.7); f.level(LW + .4, 3.3)
    f.text(3.45, 5.25, "revestimento de madeira (ripado vertical)", 1.7); f.text(6.8, 2.95, "volume grafite", 1.7, fill="#fff"); f.text(6.75, 1.2, "portão basculante — madeira", 1.6)
    f.dimH([0, 1.5, 5.4, LW], 0, 9)
    vtitle(sh, EX1, EY + 16, "FACHADA NORTE (frente — rua transversal)", "1:50")
    c = V(sh, CX, CY, 50, yup=True)
    c.ground(-1.4, 18.5); c.rect(3.0, 0, 8.3, 3.3, "graf")
    c.rect(4.15, .15, 10.6, 5.15, "white"); c.rect(10.75, .15, 15.2, 2.85, "white")
    c.walls([(4, 0, 15.35, .15), (4, 5.15, 10.75, 5.3), (4, 5.3, 4.15, 5.7), (10.6, 5.3, 10.75, 5.7), (4, .15, 4.15, 5.15), (10.6, .15, 10.75, 5.15),
             (10.75, 2.85, 15.35, 3.0), (15.2, 3.0, 15.35, 3.45), (12.2, .15, 12.35, 2.85), (15.2, .15, 15.35, 2.85), (17.85, 0, 18, 2.2)], "cut")
    c.line(4.15, 5.7, 10.6, 5.7); c.line(10.75, 3.45, 15.2, 3.45)
    for a, z0, z1 in ((4, .15, 2.45), (4, 3.3, 4.9), (10.6, .15, 2.25), (12.2, .15, 2.25), (15.2, .15, 2.4)):
        c.rect(a, z0, a + .15, z1, "open"); c.rect(a + .05, z0, a + .1, z1, "glass")
    c.rect(15.35, 2.45, 17.85, 2.65, "wood"); c.rect(17.6, 0, 17.72, 2.45, "graf"); c.rect(15.35, 0, 17.85, .08, "wood")
    for y in [15.5 + i * .45 for i in range(6)]:
        c.rect(y, 2.65, y + .1, 2.8, "wood")
    c.rect(4.75, .15, 5.2, 1.0, "furn"); c.rect(8.38, .15, 9.92, .9, "furn"); c.rect(12.9, .15, 14.8, .6, "furn"); c.rect(15.9, .08, 16.7, .85, "furn")
    for t, a, z in (("ESTAR / JANTAR", 7.4, 1.6), ("pé-direito duplo 5,00", 7.4, 3.6), ("HALL", 11.5, 1.6), ("SUÍTE", 13.8, 1.6),
                    ("GOURMET", 16.6, 1.5), ("RUA", -.75, .6), ("garagem (em vista)", 3.5, 2.9)):
        c.text(a, z, t, 2.0, fill="#fff" if "garagem" in t else None, anchor="middle")
    c.level(-.6, 0, "0,00"); c.level(1.5, .15, "+0,15"); c.level(18.9, 3.0); c.level(1.5, 5.3); c.level(1.5, 5.7)
    c.dimH([0, 4, 10.75, 15.35, 18], -.45, 7); c.dimV([.15, 5.15], 18.3, 4, ["5,00"])
    vtitle(sh, CX, CY + 20, "CORTE AA (longitudinal)", "1:50")
    yy = table(sh, CX, 476, [138, 42], [("#", "QUADRO DE ÁREAS — LOTE 4 (148,50 m²)"), ("Volume do estar/jantar (3,90 × 6,75)", "26,33 m²"),
               ("Garagem fechada + cozinha (2,85 × 7,75)", "22,09 m²"), ("Ala íntima (6,75 × 4,60)", "31,05 m²"), ("Área de serviço coberta", "2,23 m²"),
               ("*", "Área construída total", "81,70 m²"), ("Pergolado gourmet (não soma)", "13,13 m²"), ("Taxa de ocupação / CA", "55,0 % / 0,55")], 5.6, 2.7)
    sh.text(CX, yy + 5.5, "2 quartos (1 suíte) · estar/jantar com pé-direito duplo · garagem fechada · área gourmet com pergolado nos fundos", 2.4)
    sh.text(CX, yy + 10, "Recuos: frente 3,00 (garagem) / 4,00 (estar) · lateral oeste 1,50 · leste na divisa. Cozinha e banho social com domus.", 2.4)
    sh.frame(); return sh


# =====================================================================================
#  IMPLANTAÇÃO
# =====================================================================================
RC, RR, RI = (19.5, 8.0), 7.0, 1.5   # retorno proposto: centro, raio, ilha


def retorno_extra():
    n = 0; st = .02
    y = RC[1] - RR
    while y < RC[1] + RR:
        x = RC[0] - RR
        while x < RC[0] + RR:
            if (x - RC[0]) ** 2 + (y - RC[1]) ** 2 <= RR * RR and not (15 <= x <= 24 and y >= 10):
                n += 1
            x += st
        y += st
    return n * st * st


def kit_site(v, y0, right, n):
    X = (lambda a: 33 - a) if right else (lambda a: 6 + a)
    r = lambda a, b, c, d, cls: v.rect(X(a), y0 + b, X(c), y0 + d, cls)
    r(0, 0, 9, 6, "grass"); r(8, .6, 9, 2.6, "conc"); r(4, 3.25, 9, 6, "pav2"); r(0, 0, 8, 3.25, "roof"); r(0, 3.25, 4, 6, "roof")
    r(4, 3.25, 8.6, 6, "dash"); v.car(X(4.5), y0 + 3.7, X(8.6), y0 + 5.5); r(0, 0, 9, 6, "med")
    v.circ(X(8.5), y0 + 2.95, .28, "tree")
    v.text(X(2.6), y0 + 1.5, f"K{n}", 3.2, bold=True); v.text(X(2.6), y0 + 1.5, "37,00 m²", 1.8, dy=3.6)


def lots_site(v):
    Y = 62
    names = ["SOBRADO", "CHALÉ", "CASA TÉRREA", "CASA TÉRREA"]
    for i in range(4):
        o = i * 8.25
        v.rect(o, Y, o + 8.25, Y + 18, "grass")
        R = lambda a, b, c, d, cls: v.rect(o + a, Y + b, o + c, Y + d, cls)
        if i == 0:
            R(0, 0, 6.75, 3, "paver"); R(2.4, 16, 8.25, 18, "wood")
            R(0, 3, 6.75, 16, "roof"); R(0, 16, 2.4, 17.4, "roof"); R(5.0, 2.6, 5.5, 8, "stone")
        elif i == 1:
            R(5.5, 0, 8.0, 5.3, "pav2"); R(.75, 3.7, 5.2, 5.5, "wood"); R(.45, 5.2, 7.05, 14.3, "telha")
            v.line(o + 3.75, Y + 5.2, o + 3.75, Y + 14.3, "med"); v.tree(o + 6.2, Y + 16.3, 1.5)
        elif i == 2:
            R(.3, 0, 3.3, 5, "pav2"); R(3.5, 0, 8.1, 3.8, "brita"); R(.5, 3.8, 8.25, 17.4, "roof")
            for k in range(7):
                R(.3 + k * .5, .3, .42 + k * .5, 5, "wood")
        else:
            R(5.4, 0, 8.1, 3, "paver"); R(0, 0, 1.5, 15.35, "brita"); R(1.5, 15.35, 6.75, 17.85, "wood")
            R(1.5, 10.75, 8.25, 15.35, "roof"); R(5.4, 3, 8.25, 10.75, "roof"); R(1.5, 4, 5.4, 10.75, "roof"); R(1.5, 4, 5.4, 10.75, "med"); R(6.9, 15.35, 8.25, 17, "roof")
        v.rect(o, Y, o + 8.25, Y + 18, "med")
        fill = "#fff" if i == 1 else None
        v.text(o + (3.6 if i != 3 else 4.9), Y + (9.3 if i != 3 else 12.4), f"LOTE {i + 1}", 3.2, bold=True, fill=fill)
        v.text(o + (3.6 if i != 3 else 4.9), Y + (9.3 if i != 3 else 12.4), names[i], 2.0, dy=3.8, fill=fill)
        v.text(o + (3.6 if i != 3 else 4.9), Y + (9.3 if i != 3 else 12.4), "148,50 m²", 1.9, dy=7.2, fill=fill)


def post(v, x, y):
    v.circ(x, y, .32, "post"); v.line(x - .32, y, x + .32, y); v.line(x, y - .32, x, y + .32)


def sheet_site():
    sh = Sheet("01_implantacao", "01", "IMPLANTAÇÃO E SITUAÇÃO", "Implantação do fundo (33 × 80 m), situação e quadro geral de áreas")
    v = V(sh, 78, 62, 200)
    v.rect(0, 0, 33, 80, "grass"); v.rect(33, 0, 34, 80, "hedge")
    for a in ((0, 0, 6, 56), (0, 56, 33, 62), (15, 10, 24, 56)):
        v.rect(*a, "paver ns")
    v.circ(*RC, RR, "paver"); v.rect(15.06, 8, 23.94, 15.3, "paver ns")
    dy = math.sqrt(RR ** 2 - 4.5 ** 2)
    v.line(15, RC[1] + dy, 15, 56, "med"); v.line(24, RC[1] + dy, 24, 56, "med"); v.line(6, 0, 6, 56, "med")
    v.line(6, 56, 15, 56, "med"); v.line(24, 56, 33, 56, "med"); v.line(0, 62, 33, 62, "med")
    v.rect(15, 15.5, 16.5, 56, "conc"); v.rect(22.5, 15.5, 24, 56, "conc"); v.rect(0, 60.8, 33, 62, "conc")
    v.circ(19.5, 7.5, 5, "dashr"); v.circ(*RC, RI, "grass"); v.tree(*RC, 1.2)
    # praça
    v.rect(6, 50, 15, 56, "hatch"); v.rect(9.4, 51, 13.6, 54.6, "conc")
    for x in [9.4 + i * .6 for i in range(8)]:
        v.rect(x, 51, x + .15, 54.6, "wood")
    v.rect(9.8, 51.3, 11.6, 51.8, "furn"); v.rect(11.4, 53.8, 13.2, 54.3, "furn")
    v.rect(6.3, 50.4, 8.5, 52.4, "roof"); v.text(7.4, 51.6, "LIXO", 1.7, bold=True)
    for x in (6.6, 7.1, 7.6, 8.1):
        v.line(x, 53.6, x, 55.4, "med")
    v.text(7.4, 53.2, "bicicletário", 1.5); v.tree(14.2, 51.2, .7); v.tree(14.2, 54.8, .7); v.tree(8.8, 55.0, .5)
    v.text(11.5, 53, "PRAÇA", 2.4, bold=True); v.text(11.5, 53, "54,00 m²", 1.5, dy=2.8)
    for i in range(5):
        kit_site(v, 20 + i * 6, False, i + 1)
    for i in range(7):
        kit_site(v, 14 + i * 6, True, i + 6)
    lots_site(v)
    # visitantes, portaria, ligações
    v.rect(6, 13.5, 11, 16, "pav2"); v.rect(6, 16, 11, 18.5, "pav2"); v.text(8.5, 15, "V1", 1.8); v.text(8.5, 17.5, "V2", 1.8)
    v.text(8.5, 12.9, "vagas de visitantes", 1.5)
    v.rect(6.3, .4, 8.5, 2.6, "roof"); v.text(7.4, 1.7, "PORT.", 1.6, bold=True)
    v.line(0, .6, 6, .6, "thk"); v.poly([(0, .6), (3, 2.2)], "thin", False); v.poly([(6, .6), (3, 2.2)], "thin", False)
    v.text(3, 3.6, "portão", 1.6)
    v.rect(8.9, .5, 9.7, 1.3, "white"); v.text(9.3, 1.15, "E", 1.6, bold=True); v.rect(8.9, 1.6, 9.7, 2.4, "white"); v.text(9.3, 2.25, "H", 1.6, bold=True)
    v.rect(14.0, 18.6, 14.8, 19.4, "white"); v.text(14.4, 19.25, "S", 1.6, bold=True)
    # árvores
    for x, y, r in ((7.6, 5.5, 1.3), (10.6, 3.6, 1.1), (8.2, 9.8, 1.2), (11.5, 8.3, .8), (13.4, 17.2, 1.0), (12.6, 14.2, .7),
                    (28.2, 3.2, 1.4), (31.2, 6.6, 1.2), (29.0, 10.6, 1.3), (31.6, 2.4, .8), (26.3, 1.6, .8), (31.8, 12.2, .8)):
        v.tree(x, y, r)
    # muros
    v.line(0, 0, 0, 80, "muro"); v.line(0, 80, 34, 80, "muro"); v.line(34, 0, 34, 80, "muroex"); v.line(6, 0, 34, 0, "med")
    for i in range(27):
        v.rect(-.12, i * 3 - .12 + 1, .12, i * 3 + .12 + 1, "graf")
    for i in range(12):
        v.rect(i * 3 - .12 + .5, 79.88, i * 3 + .12 + .5, 80.12, "graf")
    for x, y in ((.55, 6), (.55, 20), (.55, 34), (.55, 48), (23.55, 20), (23.55, 34), (23.55, 48), (15.45, 27), (15.45, 41),
                 (4, 61.4), (12.4, 61.4), (20.6, 61.4), (29, 61.4), (13.2, 5)):
        post(v, x, y)
    # rótulos
    v.text(3, 30, "SERVIDÃO DE PASSAGEM — paver — 6,00 × 56,00 = 336,00 m²", 2.3, rot=-90, bold=True)
    v.text(19.5, 36, "RUA CENTRAL — caixa 9,00 (pista 6,00 + 2 calçadas 1,50)", 2.3, rot=-90, bold=True)
    v.text(16.5, 59, "RUA TRANSVERSAL — caixa 6,00 (pista 4,80 + calçada 1,20) — 198,00 m²", 2.3, bold=True)
    v.text(19.5, 4.6, "RETORNO Ø 14,00", 2.1, bold=True); v.text(19.5, 11.3, "(croqui: Ø 10,00)", 1.6, fill="#b03020")
    v.text(10.5, 1.3, "ÁREA VERDE", 1.9, bold=True, dx=6); v.text(29.2, 7.3, "ÁREA VERDE", 1.9, bold=True)
    v.text(33.5, 40, "faixa 1,00 — cerca viva (se a largura real for 34 m)", 1.6, rot=-90, dy=.6)
    v.text(34, 40, "MURO EXISTENTE DO VIZINHO — bloco h ≈ 2,80 m, com cerca elétrica", 2.0, rot=-90, dx=4)
    v.text(0, 40, "MURO NOVO — bloco de concreto h 2,20 m, pilaretes a cada 3,00 m (80 m) — divisa com a soja", 2.0, rot=-90, dx=-21, fill="#1f6b45")
    v.text(17, 80, "MURO NOVO (fundo, 33–34 m) — divisa com a soja", 2.0, dy=4, fill="#1f6b45")
    v.text(17, 0, "↑ área do proprietário (0–100 m) e acesso em paver existente até a Av. Fiorino Brol", 2.0, dy=-9.5)
    # cotas
    v.dimV([0, 20, 50, 56, 62, 80], 0, -8); v.dimV([0, 80], 0, -15); v.dimV([0, 14, 56, 62, 80], 34, 11)
    v.dimH([0, 6, 15, 24, 33, 34], 0, -4); v.dimH([0, 8.25, 16.5, 24.75, 33, 34], 80, 9); v.dimH([0, 34], 80, 15, ["34,00 (33,00 no croqui — confirmar na matrícula)"])
    vtitle(sh, 60, 500, "IMPLANTAÇÃO — FUNDO DO TERRENO", "1:200", "x = 0 na divisa com a soja · d = 100 a 180 m da avenida")
    north(sh, 268, 76, 9); scalebar(sh, 60, 512, 5, 4, 5)

    # situação 1:750
    s = V(sh, 322, 78, 750)
    s.rect(-13, -9, 47, 0, "conc"); s.text(17, -4, "AV. FIORINO BROL", 2.2, bold=True)
    s.rect(-13, 100, 0, 192, "hatch"); s.rect(-13, 180, 47, 192, "hatch"); s.rect(34, 0, 47, 180, "brita")
    s.text(-6.5, 140, "SOJA", 2.2, rot=-90); s.text(17, 187, "SOJA", 2.2); s.text(40.5, 90, "LOTE VIZINHO", 2.2, rot=-90)
    s.rect(0, 0, 34, 100, "grass"); s.rect(0, 0, 5, 100, "paver")
    for a in ((10, 12, 22, 22), (12, 38, 24, 50), (9, 58, 15, 82), (20, 66, 26, 72)):
        s.rect(*a, "roof")
    s.text(19.5, 30, "ÁREA DO PROPRIETÁRIO", 1.9, bold=True); s.text(19.5, 30, "34 × 100 m — permanece", 1.6, dy=2.6)
    s.text(2.5, 50, "acesso em paver existente ≈ 5 m", 1.6, rot=-90, dy=.5)
    s.rect(0, 100, 34, 180, "lot")
    for a in ((0, 100, 6, 156), (0, 156, 33, 162), (15, 110, 24, 156)):
        s.rect(*a, "paver ns")
    s.circ(19.5, 108, 7, "paver ns")
    s.rect(6, 120, 15, 150, "roof"); s.rect(24, 114, 33, 156, "roof"); s.rect(6, 150, 15, 156, "hatch")
    for i in range(4):
        s.rect(i * 8.25, 162, i * 8.25 + 8.25, 180, "white")
    s.rect(0, 100, 34, 180, "thk"); s.text(17, 172, "LOTES 1–4", 1.7, bold=True); s.text(10.5, 136, "K1–K5", 1.6, rot=-90, dy=.5); s.text(28.5, 136, "K6–K12", 1.6, rot=-90, dy=.5)
    s.poly([(0, 100), (7, 100), (7, 109), (33, 109), (33, 116), (0, 116)], "dashr")
    s.text(20, 113.6, "galpão em L a demolir (posição aprox.)", 1.5, fill="#b03020")
    s.dimV([0, 100, 180], 0, -17); s.dimH([0, 34], 180, 20)
    vtitle(sh, 304, 345, "SITUAÇÃO", "1:750", "terreno 34 × 180 m = 6.120 m²")

    # legenda
    lx, ly = 304, 368
    sh.text(lx, ly, "LEGENDA", 3, bold=True); sh.line(lx, ly + 1.4, lx + 90, ly + 1.4, "med")
    items = [("paver", "Piso intertravado (paver) — vias e servidão"), ("conc", "Calçada / piso cimentício"), ("grass", "Área verde / jardim"),
             ("roof", "Edificação (projeção de cobertura)"), ("pav2", "Vaga / garagem"), ("hatch", "Área comum (praça)"), ("hedge", "Cerca viva")]
    for i, (c, t) in enumerate(items):
        sh.rect(lx, ly + 5 + i * 6, 9, 4, c); sh.text(lx + 12, ly + 8.2 + i * 6, t, 2.2)
    y2 = ly + 5 + len(items) * 6
    sh.line(lx, y2 + 2, lx + 9, y2 + 2, "muro"); sh.text(lx + 12, y2 + 3, "Muro novo (bloco de concreto)", 2.2)
    sh.line(lx, y2 + 8, lx + 9, y2 + 8, "muroex"); sh.text(lx + 12, y2 + 9, "Muro existente (vizinho)", 2.2)
    sh.a(f'<circle cx="{lx + 4.5}" cy="{y2 + 14}" r="1.6" class="post"/>'); sh.text(lx + 12, y2 + 15, "Poste de iluminação (LED, h 6 m)", 2.2)
    sh.a(f'<circle cx="{lx + 4.5}" cy="{y2 + 20}" r="2.2" class="dashr"/>'); sh.text(lx + 12, y2 + 21, "Retorno do croqui (Ø 10 m) — substituído", 2.2)
    sh.text(lx, y2 + 27.5, "E  entrada de energia / medição · H  hidrômetro geral ·", 2.1); sh.text(lx, y2 + 31, "S  ponto para tratamento de esgoto (se não houver rede)", 2.1)

    # quadro de áreas
    ext = retorno_extra(); isl = math.pi * RI ** 2
    ret = ext - isl; vis = 25.0; port = 2.2 * 2.2
    verde = 180 + 126 + 90 - ext + isl - vis - port
    tot = 594 + 648 + 336 + 198 + 414 + ret + 54 + vis + port + verde
    con = [444.00, 145.11, 77.46, 83.70, 81.70, port, 4.40]
    rows = [("#", "A — TERRENO"), ("Terreno total (34,00 × 180,00)", "6.120,00"), ("Área do projeto — fundo (33,00 × 80,00)", "2.640,00"),
            ("Faixa de 1,00 m junto ao muro do vizinho (se a largura for 34 m)", "80,00"),
            ("#", "B — PARCELAMENTO DO FUNDO (m²)"),
            ("Lote 1 — sobrado (8,25 × 18,00)", "148,50"), ("Lote 2 — chalé (8,25 × 18,00)", "148,50"),
            ("Lote 3 — casa térrea (8,25 × 18,00)", "148,50"), ("Lote 4 — casa térrea (8,25 × 18,00)", "148,50"),
            ("Kitnets K1 a K12 — 12 módulos de 9,00 × 6,00 (54,00 cada)", "648,00"),
            ("Servidão de passagem (6,00 × 56,00)", "336,00"), ("Rua transversal (33,00 × 6,00)", "198,00"), ("Rua central (9,00 × 46,00)", "414,00"),
            ("Retorno Ø 14 — acréscimo fora da caixa da rua, sem a ilha", br(ret)), ("Praça / área comum (9,00 × 6,00)", "54,00"),
            ("Vagas de visitantes (2 × 2,50 × 5,00)", br(vis)), ("Portaria (2,20 × 2,20)", br(port)),
            ("Áreas verdes / paisagismo (inclui ilha do retorno)", br(verde)), ("*", "TOTAL", br(tot)),
            ("#", "C — ÁREAS CONSTRUÍDAS (m²)"),
            ("Kitnets — 12 × 37,00 (fechada) · + 12 × 12,65 de garagem coberta", "444,00"),
            ("Lote 1 — sobrado (térreo 57,36 + superior 87,75)", "145,11"), ("Lote 2 — chalé (térreo 51,00 + mezanino 26,46)", "77,46"),
            ("Lote 3 — casa térrea (67,50 + varanda/A.S. 16,20)", "83,70"), ("Lote 4 — casa térrea", "81,70"),
            ("Portaria + abrigo de lixo", br(port + 4.40)), ("*", "TOTAL CONSTRUÍDO (estimado)", br(sum(con))),
            ("#", "D — RESUMO"),
            ("Áreas privativas (lotes + kitnets)", f"{br(1242)}  —  {fm(1242 / 26.4, 1)} %"),
            ("Sistema viário (servidão, ruas, retorno, vagas)", f"{br(336 + 198 + 414 + ret + vis)}  —  {fm((948 + ret + vis) / 26.4, 1)} %"),
            ("Áreas comuns e verdes", f"{br(54 + port + verde)}  —  {fm((54 + port + verde) / 26.4, 1)} %")]
    sh.text(452, 62, "QUADRO GERAL DE ÁREAS", 3.6, bold=True)
    yy = table(sh, 452, 66, [205, 70], rows, 6.1, 2.8)
    n = ["1. LARGURA: desenho em 33,00 m (croqui) com faixa de 1,00 m de folga/cerca viva junto ao muro do vizinho. Confirmar 33 ou 34 m na matrícula",
         "    e por levantamento topográfico antes de locar a obra. Norte aproximado (avenida ao norte) — conferir.",
         "2. RETORNO: o Ø 10 m do croqui é pequeno para manobra (carro de passeio pede ≈ 11–12 m entre guias). Proposto Ø 14 m com ilha Ø 3 m,",
         "    sem afetar as kitnets. Caminhão de lixo/bombeiros não manobra: coleta no abrigo e hidrante/alcance a verificar com o Corpo de Bombeiros.",
         "3. LEGISLAÇÃO: conferir na Prefeitura de Foz do Iguaçu (zoneamento, código de obras, lei de condomínio de lotes) o lote mínimo, a largura",
         "    mínima de via interna, raio de retorno, vagas, recuos, taxa de ocupação e permeabilidade. Os lotes de 148,50 m² e a servidão de 6 m",
         "    são os pontos mais sensíveis para aprovação como condomínio de lotes (Lei 13.465/2017) ou desmembramento com servidão.",
         "4. INFRAESTRUTURA: prever entrada de energia e medição agrupada (E) e hidrômetro geral (H) na portaria, com redes enterradas sob as calçadas.",
         "    Sem rede pública de esgoto: fossa/filtro/sumidouro por unidade ou estação compacta (S). Drenagem com caimento para a rua transversal.",
         "5. MUROS: novos na divisa oeste (80 m) e fundo (33–34 m), bloco de concreto h 2,20 m, pilaretes a cada 3,00 m. Lado leste: muro existente.",
         "6. Linhas de transmissão ao longe: confirmar que a faixa de servidão da LT não alcança o terreno.",
         "7. Demolir o galpão em L de lona e madeira antes da terraplenagem (ver situação)."]
    notes(sh, 452, yy + 10, "PONTOS A VERIFICAR E NOTAS", n, 2.65, 4.3)
    sh.frame(); return sh


def main():
    sheets = [sheet_site(), sheet_kitnet(), sheet_sobrado(), sheet_chale(), sheet_l3(), sheet_l4()]
    for s in sheets:
        with open(os.path.join(OUT, s.fname + ".svg"), "w", encoding="utf-8") as f:
            f.write(s.svg())
    page = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'><title>Residencial do Fundo — Pranchas</title>"
            "<style>@page{size:841mm 594mm;margin:0}html,body{margin:0;background:#777}"
            ".p{width:841mm;height:594mm;margin:6mm auto;background:#fff;page-break-after:always;break-after:page}"
            ".p svg{display:block;width:841mm;height:594mm}@media print{html,body{background:#fff}.p{margin:0}}</style></head><body>"
            + "".join(f"<div class='p'>{s.svg()}</div>" for s in sheets) + "</body></html>")
    with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
        f.write(page)
    print("ok:", ", ".join(s.fname for s in sheets))


if __name__ == "__main__":
    main()
