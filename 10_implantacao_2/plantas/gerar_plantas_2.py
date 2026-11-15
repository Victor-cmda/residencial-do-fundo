# -*- coding: utf-8 -*-
"""Residencial do Fundo — IMPLANTAÇÃO 2 (croqui do proprietário de 15/11/2026).
Duas pranchas A1: implantação + quadro de áreas, e a kitnet-tipo de 10,50 × 7,00 m.
Uso:  python3 gerar_plantas_2.py   -> grava os .svg e o index.html nesta pasta.
Reaproveita a biblioteca de desenho e os lotes 1–4 de ../../06_plantas/gerar_plantas.py (que não é alterado).
Coordenadas: x = 0 na divisa da soja → 33 (+1 m de cerca viva até o muro do vizinho); y = d − 100 = 0 (avenida) → 80 (fundo)."""
import importlib.util, os

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("G", os.path.join(HERE, "..", "..", "06_plantas", "gerar_plantas.py"))
G = importlib.util.module_from_spec(spec); spec.loader.exec_module(G)
G.NSHEETS = 2; G.DATA = "15/11/2026"
V, Sheet, fm, br = G.V, G.Sheet, G.fm, G.br

KD, KW, K0, NK = 10.5, 7.0, 12.0, 6          # kitnet: profundidade, frente, início (y), unidades por fileira
A, U, R, S = 1.5, 9.3, 5.2, 3.6              # quintal | fachada | frente do quarto | divisa ala/vaga (coord. locais u, v)
AREA_FECH = (U - A) * S + (R - A) * (KW - S)  # 7,80 × 3,60 + 3,70 × 3,40
SALA = 7.5 * 3.3 - 2.3 * 1.7; BANHO = 2.15 * 1.55; QUARTO = 3.4 * 3.25
VAGA = (KD - .1 - R) * (KW - S); LAV = A * 1.88


# =====================================================================================
#  KITNET 10,50 × 7,00  (local: u 0..10,5 = muro -> calçada ; v 0..7)
# =====================================================================================
def kit_plan(v, detail=True):
    v.rect(0, 0, KD, KW, "lot")
    v.rect(0, 0, A, 3.2, "conc"); v.rect(0, 3.2, A, KW, "grass"); v.rect(0, .12, A, 2.0, "dash")
    v.rect(U, 0, KD, .7, "grass"); v.rect(U, .7, KD, 2.9, "conc"); v.rect(U, 2.9, KD, S, "grass"); v.rect(R, S, KD, KW, "paver")
    v.car(R + .4, S + .45, KD - .3, KW - .45)
    v.rect(R, S, KD - .1, KW, "dash"); v.rect(KD - .25, KW - .2, KD - .1, KW - .05, "graf"); v.rect(U, .5, U + .7, 3.1, "dash")
    v.rect(KD - .25, .05, KD - .05, .55, "graf"); v.tree(10.0, 3.25, .25)
    v.rect(A + .15, .15, U - .15, S - .15, "open"); v.rect(A + .15, S, R - .15, KW - .15, "open")
    v.walls([(A, 0, A + .15, KW), (A + .15, 0, U, .15), (A + .15, KW - .15, R, KW), (R - .15, S, R, KW - .15), (A + .15, S - .15, U, S), (U - .15, .15, U, S - .15),
             (3.8, .15, 3.95, 1.85), (A + .15, 1.7, 3.8, 1.85), (0, 0, A, .12)])
    v.winV(.7, 2.9, U - .15, U, "p"); v.winH(6.0, 7.4, S - .15, S); v.doorH(8.2, 9.0, S - .15, S, "r", "n"); v.winV(4.4, 5.8, R - .15, R)
    v.winV(.5, 1.2, A, A + .15); v.doorV(2.25, 3.05, A, A + .15, "t", "e"); v.winV(4.4, 6.0, A, A + .15)
    v.doorH(2.6, 3.3, 1.7, 1.85, "l", "n"); v.doorH(3.0, 3.8, S - .15, S, "l", "s")
    # mobília
    v.box(4.0, .2, 4.65, .85); v.box(4.65, .17, 6.9, .77); v.sink(4.9, .25, 5.5, .7)
    for cx in (6.15, 6.45):
        v.circ(cx, .35, .09, "furn"); v.circ(cx, .6, .09, "furn")
    v.box(4.2, 2.5, 5.1, 3.2); v.box(3.84, 2.67, 4.16, 3.03); v.box(5.14, 2.67, 5.46, 3.03)
    v.box(6.6, 2.6, 8.4, 3.43); v.box(6.6, 3.2, 8.4, 3.43); v.box(7.1, .17, 8.5, .45); v.rect(6.5, 1.1, 8.7, 2.45, "dash")
    v.shower(1.65, .15, 2.55, 1.15); v.wc(2.9, .28, 0, 1); v.sink(3.3, .2, 3.75, .65)
    v.box(.2, .35, .75, .9); v.circ(.47, .62, .18, "furn"); v.box(.2, 1.05, .8, 1.65); v.circ(.5, 1.35, .2, "furn")
    v.bed(1.7, 4.2, 3.7, 5.9, "w"); v.box(1.7, 6.3, 3.9, 6.83)
    if detail:
        v.room(6.3, 1.5, "SALA / COZINHA", area=SALA, size=2.6)
        v.room(3.35, 4.4, "QUARTO", 3.40, 3.25, size=2.4)
        v.room(2.75, 1.15, f"BANHO  {fm(BANHO)} m²", size=1.5)
        v.room(.75, 2.6, "LAV.", size=1.6); v.text(.75, 2.6, "coberta", 1.3, dy=2.4)
        v.room(.75, 5.0, "QUINTAL", size=1.6); v.text(.75, 5.0, "de serviço", 1.3, dy=2.4)
        v.room(7.85, 4.5, "VAGA COBERTA", KD - .1 - R, KW - S, size=2.2); v.text(7.6, 6.75, "laje em balanço · pilar metálico", 1.5)
        v.text(10.05, 1.8, "ACESSO", 1.8, rot=-90, dy=.6); v.text(5.8, 1.05, "geladeira · pia · cooktop", 1.5)
        v.text(KD, 3.5, "CALÇADA 1,00 · RUA CENTRAL →", 2.2, rot=-90, dx=8, bold=True)
        v.text(0, 3.5, "MURO DE DIVISA", 2.0, rot=-90, dx=-4, bold=True)


def kit_site(v, y0, right, n):
    X = (lambda a: 33 - a) if right else (lambda a: a)
    r = lambda a, b, c, d, cls: v.rect(X(a), y0 + b, X(c), y0 + d, cls)
    r(0, 0, KD, KW, "grass"); r(0, 0, A, 3.2, "conc"); r(U, .7, KD, 2.9, "conc"); r(R, S, KD, KW, "pav2")
    r(A, 0, U, S, "roof"); r(A, S, R, KW, "roof"); r(R, S, KD - .1, KW, "dash")
    v.car(X(R + .5), y0 + S + .45, X(KD - .4), y0 + KW - .45); r(0, 0, KD, KW, "med")
    v.circ(X(10.0), y0 + 3.25, .28, "tree")
    v.text(X(5.4), y0 + 1.5, f"K{n}", 3.2, bold=True); v.text(X(5.4), y0 + 1.5, f"{fm(AREA_FECH)} m²", 1.8, dy=3.6)


def kit_elev(v, o):
    """Fachada para a rua: eixo horizontal = v (0..7), visto da calçada."""
    v.rect(o + R - 5.2 + 3.6, 0, o + KW, 3.5, "white")                  # bloco do quarto ao fundo da vaga
    v.rect(o + 4.4, 1.1, o + 5.8, 2.2, "graf"); v.rect(o + 4.47, 1.17, o + 5.08, 2.13, "glass"); v.rect(o + 5.12, 1.17, o + 5.73, 2.13, "glass")
    v.rect(o, 0, o + S, 3.5, "white"); v.line(o, 2.95, o + S, 2.95)
    v.rect(o + S, 2.5, o + KW, 2.66, "graf"); v.rect(o + KW - .2, 0, o + KW - .05, 2.5, "graf")
    v.rect(o + .58, .1, o + 3.02, 2.42, "graf"); v.rect(o + .7, .18, o + 1.78, 2.3, "glass"); v.rect(o + 1.82, .18, o + 2.9, 2.3, "glass")
    v.rect(o + .5, 2.42, o + 3.1, 2.5, "graf"); v.rect(o + 3.04, .1, o + S, 2.95, "ripado")
    v.rect(o + .05, 0, o + .55, 1.1, "graf"); v.rect(o + .15, .6, o + .45, .85, "white")


def sheet_kitnet():
    sh = Sheet("02_kitnet_tipo", "02", "KITNETS — MÓDULO-TIPO 10,50 × 7,00 m",
               f"Planta-tipo (1 quarto, {fm(AREA_FECH)} m²), conjunto espelhado e fachada")
    v = V(sh, 52, 66, 25, ts=1.45); kit_plan(v)
    v.dimH([0, A, R, U, KD], 0, -6); v.dimH([0, A, R, KD - .1, KD], KW, 7); v.dimV([0, KW], 0, -8)
    v.dimV([0, 1.85, S, KW], 0, -16, ["1,85", "1,75", "3,40"]); v.dimV([0, .7, 2.9, S, KW], KD, 16)
    G.vtitle(sh, 52, 382, "PLANTA-TIPO — K1 a K6 (fileira oeste, frente para leste)", "1:25", "K7 a K12: mesma planta espelhada")
    # conjunto 1:125 — duas unidades de cada lado da rua central
    k = 1000 / 125; ox, oy = 512, 70
    for i in range(2):
        kit_plan(V(sh, ox, oy + i * KW * k, 125), False); kit_plan(V(sh, ox, oy + i * KW * k, 125, mirW=33), False)
    vs = V(sh, ox, oy, 125)
    vs.rect(KD, 0, 33 - KD, 2 * KW, "paver"); vs.rect(KD, 0, KD + 1, 2 * KW, "conc"); vs.rect(32 - KD, 0, 33 - KD, 2 * KW, "conc")
    vs.text(16.5, KW, "RUA CENTRAL — pista 10,00 em paver", 2.0, rot=-90, bold=True)
    for i, (a, b) in enumerate((("K1", "K7"), ("K2", "K8"))):
        vs.text(3.3, 5.6 + i * KW, a, 2.6, bold=True); vs.text(29.7, 5.6 + i * KW, b, 2.6, bold=True)
    vs.dimH([0, KD, KD + 1, 32 - KD, 33 - KD, 33], 0, -5); vs.dimV([0, KW, 2 * KW], 33, 6)
    G.vtitle(sh, ox, 205, "CONJUNTO — fileiras espelhadas na rua central (trecho)", "1:125", "14,40 m entre fachadas")
    # fachada 1:50
    vf = V(sh, 52, 488, 50, yup=True)
    vf.ground(-.6, 14.6); kit_elev(vf, 0); kit_elev(vf, KW)
    vf.level(-.3, 0, "0,00"); vf.level(-.3, 3.5); vf.level(14.4, 2.66)
    vf.text(1.8, 3.15, "platibanda reta — pintura branca", 1.9); vf.text(8.8, 3.15, "ripado · moldura grafite", 1.9); vf.text(5.3, 2.8, "vaga coberta", 1.7)
    vf.dimH([0, S, KW, KW + S, 2 * KW], 0, 12)
    G.vtitle(sh, 52, 512, "FACHADA FRONTAL (duas unidades)", "1:50", "esquadrias pretas · porta de correr com moldura grafite")
    # quadro + notas
    yy = G.table(sh, 512, 226, [230, 70], [("#", "QUADRO DE ÁREAS — KITNET (cada)"), ("Módulo (10,50 × 7,00)", "73,50 m²"),
                 ("Área construída fechada (7,80 × 3,60 + 3,70 × 3,40)", f"{fm(AREA_FECH)} m²"), ("Sala / cozinha", f"{fm(SALA)} m²"),
                 ("Quarto (3,40 × 3,25)", f"{fm(QUARTO)} m²"), ("Banho", f"{fm(BANHO)} m²"), ("Área útil interna", f"{fm(SALA + BANHO + QUARTO)} m²"),
                 ("Vaga coberta (laje em balanço 5,20 × 3,40)", f"{fm(VAGA)} m²"), ("Lavanderia externa coberta (1,50 × 1,88)", f"{fm(LAV)} m²"),
                 ("Quintal de serviço + jardim frontal (descobertos)", f"{fm(A * KW - LAV + (KD - U) * S)} m²"),
                 ("*", "12 unidades — área fechada total", f"{br(12 * AREA_FECH)} m²")], 5.6, 2.7)
    G.notes(sh, 512, yy + 9, "NOTAS", [
        "1. Módulo maior que o da implantação 1 (9 × 6 = 54 m²; casa de 37 m²). Com 7 m de frente cabem",
        "    sala/cozinha, quarto de casal, banho, vaga coberta de 5,20 m e um quintal de serviço no fundo.",
        "2. O quintal de 1,50 m junto ao muro ventila e ilumina o banho, a sala e o quarto pelo fundo, já que",
        "    as paredes laterais são de geminação. A lavanderia fica nele, sob cobertura leve.",
        "3. Alvenaria de bloco 14 cm (15 cm acabada); laje com platibanda e rufo; caixa d'água de 1.000 L",
        "    sobre o quarto.",
        "4. A segunda janela do quarto abre para a vaga coberta: conferir no código de obras se ela conta",
        "    como iluminação/ventilação. A janela do fundo já atende sozinha.",
        "5. Recuo frontal de 1,20 m (jardim + acesso) até a calçada de 1,00 m da rua central.",
        "6. Medidores individuais de água e energia na mureta frontal."], 2.5, 4.0)
    sh.frame(); return sh


# =====================================================================================
#  IMPLANTAÇÃO
# =====================================================================================
def areas():
    a = dict(lotes=4 * 8.25 * 18, kit=12 * KD * KW, acesso=6 * 12 + 15.5 * 6, central=10 * 42, transv=33 * 6, vagas=3 * 2.5 * 5,
             calc=2 * 42 + 6 + 33 * 2, praca=10.5 * 12, port=2.2 * 2.2, lixo=3.8 * 2.6 + 1.0 * 2.96)
    a["verde"] = 15.5 * 6 + 1 * 6 - a["vagas"] - a["port"] - a["lixo"]
    a["tot"] = sum(a.values()); assert abs(a["tot"] - 2640) < .01, a["tot"]
    return a


def sheet_site():
    sh = Sheet("01_implantacao", "01", "IMPLANTAÇÃO 2 E SITUAÇÃO", "Croqui de 15/11/2026: kitnets de 10,50 × 7,00 nos muros, rua central de 10 m e entrada em L")
    v = V(sh, 78, 62, 200)
    v.rect(0, 0, 33, 80, "grass"); v.rect(33, 0, 34, 80, "hedge")
    for a in ((0, 0, 6, 12), (6, 6, 21.5, 12), (11.5, 12, 21.5, 54), (0, 54, 33, 60)):
        v.rect(*a, "paver ns")
    v.rect(10.5, 12, 11.5, 54, "conc"); v.rect(21.5, 6, 22.5, 54, "conc"); v.rect(0, 60, 33, 62, "conc")
    for a in ((11.5, 12, 11.5, 54), (21.5, 6, 21.5, 54), (0, 60, 33, 60), (6, 0, 6, 6), (6, 6, 13.5, 6), (0, 12, 10.5, 12), (22.5, 6, 33, 6), (0, 62, 33, 62)):
        v.line(*a, "med")
    for i in range(NK):
        kit_site(v, K0 + i * KW, False, i + 1); kit_site(v, K0 + i * KW, True, i + 7)
    G.lots_site(v)
    # entrada: vagas, portaria, lixo, bicicletário, praça
    for i in range(3):
        v.rect(13.5 + i * 2.5, 1, 16 + i * 2.5, 6, "pav2"); v.text(14.75 + i * 2.5, 3.8, f"V{i + 1}", 1.8)
    v.text(17.25, .3, "vagas de visitantes", 1.5, dy=1.2)
    v.rect(6.3, .4, 8.5, 2.6, "roof"); v.text(7.4, 1.7, "PORT.", 1.6, bold=True)
    v.rect(9.0, .3, 12.8, 2.9, "conc"); v.rect(9.6, 2.9, 10.6, 6, "conc"); v.rect(9.2, .5, 11.4, 2.5, "roof"); v.text(10.3, 1.7, "LIXO", 1.6, bold=True)
    for x in (11.7, 12.05, 12.4):
        v.line(x, .6, x, 2.34, "med")
    v.text(12.1, 3.6, "bicicl.", 1.3)
    v.line(0, .5, 6, .5, "thk"); v.poly([(0, .5), (3, 2.1)], "thin", False); v.poly([(6, .5), (3, 2.1)], "thin", False); v.text(3, 3.4, "portão", 1.6)
    v.rect(24.6, 1.4, 31.6, 5.2, "conc"); v.rect(22.5, 2.8, 24.6, 3.8, "conc")
    for x in [26.2 + i * .55 for i in range(8)]:
        v.rect(x, 1.6, x + .12, 5.0, "wood")
    v.text(28.3, 7.9, "PRAÇA", 2.4, bold=True); v.text(28.3, 7.9, f"{fm(10.5 * 12)} m² com jardim", 1.5, dy=2.8)
    for x, y, r in ((7.4, 4.4, .9), (22.9, .9, .9), (32.2, .8, 1.0), (32.2, 5.2, .9), (24.0, 5.3, .7), (25.5, 9.5, 1.1), (31.0, 9.8, 1.1)):
        v.tree(x, y, r)
    v.rect(13.2, 6.6, 14.0, 7.4, "white"); v.text(13.6, 7.25, "E", 1.6, bold=True); v.rect(14.3, 6.6, 15.1, 7.4, "white"); v.text(14.7, 7.25, "H", 1.6, bold=True)
    v.rect(22.6, 52.9, 23.4, 53.7, "white"); v.text(23.0, 53.55, "S", 1.6, bold=True)
    # muros e postes
    v.line(0, 0, 0, 80, "muro"); v.line(0, 80, 34, 80, "muro"); v.line(34, 0, 34, 80, "muroex"); v.line(6, 0, 34, 0, "med")
    for i in range(27):
        v.rect(-.12, i * 3 - .12 + 1, .12, i * 3 + .12 + 1, "graf")
    for i in range(12):
        v.rect(i * 3 - .12 + .5, 79.88, i * 3 + .12 + .5, 80.12, "graf")
    for x, y in ((.55, 6), (12.9, 5.4), (11.0, 19.5), (11.0, 33.5), (11.0, 47.5), (22.0, 26.5), (22.0, 40.5), (4, 61.4), (12.4, 61.4), (20.6, 61.4), (29, 61.4)):
        G.post(v, x, y)
    # rótulos
    v.text(16.5, 33, "RUA CENTRAL — pista 10,00 em paver + calçadas de 1,00", 2.3, rot=-90, bold=True)
    v.text(16.5, 57.6, "RUA TRANSVERSAL — pista 6,00 — calçada dos lotes 2,00", 2.3, bold=True)
    v.text(3, 7.6, "SERVIDÃO", 2.0, bold=True); v.text(3, 7.6, "6,00", 1.6, dy=2.6)
    v.text(15.5, 9.6, "ACESSO EM L — 6,00", 2.1, bold=True)
    v.text(33.5, 40, "faixa 1,00 — cerca viva (se a largura real for 34 m)", 1.6, rot=-90, dy=.6)
    v.text(34, 40, "MURO EXISTENTE DO VIZINHO — bloco h ≈ 2,80 m, com cerca elétrica", 2.0, rot=-90, dx=4)
    v.text(0, 40, "MURO NOVO — bloco de concreto h 2,20 m, pilaretes a cada 3,00 m (80 m) — divisa com a soja", 2.0, rot=-90, dx=-21, fill="#1f6b45")
    v.text(17, 80, "MURO NOVO (fundo, 33–34 m) — divisa com a soja", 2.0, dy=4, fill="#1f6b45")
    v.text(17, 0, "↑ área do proprietário (0–100 m) e acesso em paver existente até a Av. Fiorino Brol", 2.0, dy=-9.5)
    # cotas
    v.dimV([0, 6, 12] + [K0 + i * KW for i in range(1, NK + 1)] + [60, 62, 80], 0, -8)
    v.dimV([0, 80], 0, -15); v.dimV([0, 12, 54, 60, 62, 80], 34, 11)
    v.dimH([0, KD, KD + 1, 21.5, 22.5, 33, 34], 0, -4); v.dimH([0, 8.25, 16.5, 24.75, 33, 34], 80, 9)
    v.dimH([0, 34], 80, 15, ["34,00 (33,00 no croqui — confirmar na matrícula)"])
    G.vtitle(sh, 60, 500, "IMPLANTAÇÃO 2 — FUNDO DO TERRENO", "1:200", "x = 0 na divisa com a soja · d = 100 a 180 m da avenida")
    G.north(sh, 268, 76, 9); G.scalebar(sh, 60, 512, 5, 4, 5)

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
    for a in ((0, 100, 6, 112), (6, 106, 21.5, 112), (11.5, 112, 21.5, 154), (0, 154, 33, 160)):
        s.rect(*a, "paver ns")
    s.rect(0, 112, KD, 154, "roof"); s.rect(33 - KD, 112, 33, 154, "roof")
    for i in range(4):
        s.rect(i * 8.25, 162, i * 8.25 + 8.25, 180, "white")
    s.rect(0, 100, 34, 180, "thk"); s.text(17, 172, "LOTES 1–4", 1.7, bold=True); s.text(5.25, 133, "K1–K6", 1.6, rot=-90, dy=.5); s.text(27.75, 133, "K7–K12", 1.6, rot=-90, dy=.5)
    s.poly([(0, 100), (7, 100), (7, 109), (33, 109), (33, 116), (0, 116)], "dashr")
    s.text(20, 104.5, "galpão em L a demolir (aprox.)", 1.5, fill="#b03020")
    s.dimV([0, 100, 180], 0, -17); s.dimH([0, 34], 180, 20)
    G.vtitle(sh, 304, 345, "SITUAÇÃO", "1:750", "terreno 34 × 180 m = 6.120 m²")

    # legenda
    lx, ly = 304, 368
    sh.text(lx, ly, "LEGENDA", 3, bold=True); sh.line(lx, ly + 1.4, lx + 90, ly + 1.4, "med")
    items = [("paver", "Piso intertravado (paver) — vias e servidão"), ("conc", "Calçada / piso cimentício"), ("grass", "Área verde / jardim"),
             ("roof", "Edificação (projeção de cobertura)"), ("pav2", "Vaga / garagem"), ("hedge", "Cerca viva")]
    for i, (c, t) in enumerate(items):
        sh.rect(lx, ly + 5 + i * 6, 9, 4, c); sh.text(lx + 12, ly + 8.2 + i * 6, t, 2.2)
    y2 = ly + 5 + len(items) * 6
    sh.line(lx, y2 + 2, lx + 9, y2 + 2, "muro"); sh.text(lx + 12, y2 + 3, "Muro novo (bloco de concreto)", 2.2)
    sh.line(lx, y2 + 8, lx + 9, y2 + 8, "muroex"); sh.text(lx + 12, y2 + 9, "Muro existente (vizinho)", 2.2)
    sh.a(f'<circle cx="{lx + 4.5}" cy="{y2 + 14}" r="1.6" class="post"/>'); sh.text(lx + 12, y2 + 15, "Poste de iluminação (LED, h 6 m)", 2.2)
    sh.text(lx, y2 + 21.5, "E  entrada de energia / medição · H  hidrômetro geral ·", 2.1); sh.text(lx, y2 + 25, "S  ponto para tratamento de esgoto (se não houver rede)", 2.1)

    # quadro de áreas
    a = areas(); pct = lambda x: f"{br(x)}  —  {fm(x / 26.4, 1)} %"
    con = dict(kit=12 * AREA_FECH, l1=145.11, l2=77.46, l3=83.70, l4=81.70, port=a["port"], lixo=2.2 * 2.0)
    rows = [("#", "A — TERRENO"), ("Terreno total (34,00 × 180,00)", "6.120,00"), ("Área do projeto — fundo (33,00 × 80,00)", "2.640,00"),
            ("Faixa de 1,00 m junto ao muro do vizinho (se a largura for 34 m)", "80,00"),
            ("#", "B — PARCELAMENTO DO FUNDO (m²)"),
            ("Lotes 1 a 4 — 4 × (8,25 × 18,00 = 148,50)", br(a["lotes"])),
            ("Kitnets K1 a K12 — 12 módulos de 10,50 × 7,00 (73,50 cada)", br(a["kit"])),
            ("Servidão / acesso em L (6,00 × 12,00 + 15,50 × 6,00)", br(a["acesso"])), ("Rua central — pista (10,00 × 42,00)", br(a["central"])),
            ("Rua transversal — pista (33,00 × 6,00)", br(a["transv"])), ("Calçadas (2 × 1,00 × 42,00 + 1,00 × 6,00 + 33,00 × 2,00)", br(a["calc"])),
            ("Vagas de visitantes (3 × 2,50 × 5,00)", br(a["vagas"])), ("Praça e jardim da entrada (10,50 × 12,00)", br(a["praca"])),
            ("Portaria (2,20 × 2,20)", br(a["port"])), ("Abrigo de lixo + bicicletário (piso)", br(a["lixo"])),
            ("Demais áreas verdes da entrada", br(a["verde"])), ("*", "TOTAL", br(a["tot"])),
            ("#", "C — ÁREAS CONSTRUÍDAS (m²)"),
            (f"Kitnets — 12 × {fm(AREA_FECH)} (fechada) · + 12 × {fm(VAGA)} de vaga coberta", br(con["kit"])),
            ("Lote 1 — sobrado (térreo 57,36 + superior 87,75)", "145,11"), ("Lote 2 — chalé (térreo 51,00 + mezanino 26,46)", "77,46"),
            ("Lote 3 — casa térrea (67,50 + varanda/A.S. 16,20)", "83,70"), ("Lote 4 — casa térrea", "81,70"),
            ("Portaria + abrigo de lixo", br(con["port"] + con["lixo"])), ("*", "TOTAL CONSTRUÍDO (estimado)", br(sum(con.values()))),
            ("#", "D — RESUMO"),
            ("Áreas privativas (lotes + kitnets)", pct(a["lotes"] + a["kit"])),
            ("Sistema viário (acesso, ruas, calçadas, vagas)", pct(a["acesso"] + a["central"] + a["transv"] + a["calc"] + a["vagas"])),
            ("Áreas comuns e verdes", pct(a["praca"] + a["port"] + a["lixo"] + a["verde"]))]
    sh.text(452, 62, "QUADRO GERAL DE ÁREAS", 3.6, bold=True)
    yy = G.table(sh, 452, 66, [205, 70], rows, 6.1, 2.8)
    n = ["1. LEITURA DO CROQUI: lotes 18 + calçada 2 + rua 6 no fundo; 6 kitnets de 7,00 de frente de cada lado (42 m), com 10,50 de",
         "    profundidade; rua central de 10,00 com calçadas de 1,00 (10,50 + 1 + 10 + 1 + 10,50 = 33,00). Faixa de 12 m na entrada.",
         "2. LARGURA: desenho em 33,00 m com faixa de 1,00 m de cerca viva junto ao muro do vizinho. Confirmar 33 ou 34 m na matrícula.",
         "3. CIRCULAÇÃO: a rua central liga a entrada à rua transversal, sem retorno. Caminhão de lixo entra e sai pela entrada em L;",
         "    verificar raio de giro na curva (canto x 6 / y 6) e manobra de bombeiros na rua transversal (sem saída nas pontas).",
         "4. As kitnets encostam no muro da soja (oeste) e na faixa de cerca viva (leste): o quintal de serviço de 1,50 no fundo",
         "    de cada unidade garante luz e ventilação. Muro oeste precisa de acabamento nos dois lados até a altura da laje.",
         "5. LEGISLAÇÃO: conferir em Foz do Iguaçu lote mínimo, largura de via interna, vagas, recuos, taxa de ocupação e permeabilidade.",
         "6. INFRAESTRUTURA: energia (E) e hidrômetro geral (H) junto à entrada; esgoto (S) com tratamento se não houver rede.",
         "7. Os lotes 1–4 e as casas não mudam em relação à implantação 1 (pranchas 03 a 06 de 06_plantas)."]
    G.notes(sh, 452, yy + 10, "PONTOS A VERIFICAR E NOTAS", n, 2.65, 4.3)
    sh.frame(); return sh


def main():
    sheets = [sheet_site(), sheet_kitnet()]
    for s in sheets:
        with open(os.path.join(HERE, s.fname + ".svg"), "w", encoding="utf-8") as f:
            f.write(s.svg())
    page = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'><title>Implantação 2 — Pranchas</title>"
            "<style>@page{size:841mm 594mm;margin:0}html,body{margin:0;background:#777}"
            ".p{width:841mm;height:594mm;margin:6mm auto;background:#fff;page-break-after:always;break-after:page}"
            ".p svg{display:block;width:841mm;height:594mm}@media print{html,body{background:#fff}.p{margin:0}}</style></head><body>"
            + "".join(f"<div class='p'>{s.svg()}</div>" for s in sheets) + "</body></html>")
    with open(os.path.join(HERE, "index.html"), "w", encoding="utf-8") as f:
        f.write(page)
    print("ok:", ", ".join(s.fname for s in sheets), "| áreas:", {k: round(v, 2) for k, v in areas().items()})


if __name__ == "__main__":
    main()
