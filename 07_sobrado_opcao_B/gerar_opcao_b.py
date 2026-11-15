# -*- coding: utf-8 -*-
"""Sobrado OPÇÃO B — estudo separado para comparar com a opção A (prancha 03 do Residencial do Fundo).
Lote 8,25 x 18 m. Garagem fechada para 2 carros com acesso direto para dentro da casa.
Uso: python gerar_opcao_b.py  -> grava sobrado_opcao_B.svg e index.html nesta pasta.
Reaproveita só a biblioteca de desenho de ../06_plantas/gerar_plantas.py (não altera aquele projeto)."""
import importlib.util, os

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("G", os.path.join(HERE, "..", "06_plantas", "gerar_plantas.py"))
G = importlib.util.module_from_spec(spec); spec.loader.exec_module(G)
G.NSHEETS = 1
LW, LD = 8.25, 18.0
V, Sheet = G.V, G.Sheet


def terreo(v):
    G.lot_base(v)
    v.rect(2.4, 0, 8.1, 3, "paver"); v.rect(.6, 0, 1.9, 3, "conc"); v.rect(0, 3, 2.4, 4.0, "conc")
    v.rect(.8, 15.5, 5.9, 17.3, "wood"); v.rect(.8, 15.5, 5.9, 17.3, "dash")
    # lavanderia externa coberta
    v.rect(6.3, 15.5, LW, 17.3, "conc"); v.rect(6.3, 15.5, LW, 17.3, "dash")
    v.rect(.15, 4.15, 2.25, 8.75, "open"); v.rect(.15, 8.6, 8.1, 15.35, "open"); v.rect(2.4, 3.15, 8.1, 8.6, "pav2")
    v.walls([(0, 4.0, .15, 15.5), (8.1, 3, 8.25, 17.3), (0, 15.35, 8.25, 15.5), (0, 4.0, 2.4, 4.15), (2.25, 3, 8.25, 3.15),
             (2.25, 3.15, 2.4, 8.75), (2.4, 8.6, 8.1, 8.75), (1.15, 5.0, 1.25, 9.35), (.15, 9.2, 1.25, 9.35),
             (6.45, 8.75, 6.6, 10.25), (4.85, 10.25, 8.1, 10.4), (4.85, 10.4, 5.0, 15.35), (6.3, 17.15, 8.25, 17.3)])
    v.rect(2.1, 2.6, 2.55, 4.0, "stone")
    v.rect(2.8, 3, 7.8, 3.15, "open"); v.rect(2.8, 3.04, 7.8, 3.11, "wood")
    v.doorH(.9, 2.0, 4.0, 4.15, "r", "s"); v.doorV(7.4, 8.2, 2.25, 2.4, "t", "e")
    v.doorV(9.2, 9.9, 6.45, 6.6, "t", "e"); v.doorV(11.0, 11.9, 4.85, 5.0, "t", "e"); v.doorH(7.2, 8.0, 15.35, 15.5, "l", "s")
    v.winH(.8, 4.6, 15.35, 15.5, "p"); v.winH(5.3, 6.9, 15.35, 15.5); v.doorH(.3, 1.0, 9.2, 9.35, "l", "s")
    v.stair(.15, 1.15, 5.0, 9.2, 15, "SOBE")
    v.car(2.9, 3.6, 4.9, 8.0); v.car(5.5, 3.6, 7.5, 8.0)
    # cozinha fechada (3,10 x 4,95)
    v.box(7.5, 10.45, 8.08, 14.7); v.box(7.5, 10.45, 8.08, 11.15)
    for cy in (12.3, 12.6):
        v.circ(7.68, cy, .09, "furn"); v.circ(7.92, cy, .09, "furn")
    v.box(5.05, 14.75, 7.45, 15.33); v.sink(5.8, 14.8, 6.4, 15.28); v.box(5.9, 12.2, 6.6, 13.8)
    for cy in (12.6, 13.4):
        v.circ(5.6, cy, .16, "furn")
    v.rect(6.9, 10.7, 7.4, 11.9, "dash"); v.text(7.15, 11.35, "domus", 1.3, rot=-90, dy=.5)
    # jantar e estar
    v.box(2.6, 8.77, 4.6, 9.2); v.box(2.7, 10.2, 4.5, 11.1)
    for cx in (3.0, 3.6, 4.2):
        v.box(cx - .2, 9.85, cx + .2, 10.15); v.box(cx - .2, 11.15, cx + .2, 11.45)
    v.box(.2, 12.6, 1.05, 15.0); v.box(.2, 12.6, .42, 15.0); v.box(2.2, 13.4, 2.9, 14.2); v.box(4.55, 13.0, 4.83, 14.6); v.box(1.3, 11.7, 2.1, 12.4)
    v.wc(7.35, 8.9, 0, 1); v.sink(6.7, 9.7, 7.1, 10.15)
    v.sink(7.5, 15.65, 8.05, 16.25); v.box(7.45, 16.4, 8.05, 17.0); v.circ(7.75, 16.7, .2, "furn")
    v.room(5.25, 6.3, "GARAGEM FECHADA", 5.70, 5.45, size=2.2); v.text(5.25, 6.3, "2 vagas · portão 5,00 m", 1.7, dy=-3.4)
    v.room(1.75, 6.4, "HALL", size=1.8); v.text(1.75, 6.4, "2,10 × 4,45", 1.4, dy=2.5)
    v.text(2.9, 7.8, "porta garagem → casa", 1.4, dy=-5.2, anchor="start")
    v.text(1.2, 3.55, "VARANDA DE ENTRADA", 1.5, bold=True); v.text(2.33, 3.3, "LÂMINA DE PEDRA", 1.3, rot=-90, dy=.5)
    v.room(3.6, 9.55, "JANTAR", size=1.8); v.room(3.0, 12.6, "ESTAR", size=2.1); v.text(3.0, 12.6, "estar + jantar: 32,07 m²", 1.5, dy=3); v.text(3.0, 12.6, "4,70 × 6,00", 1.5, dy=5.6)
    v.room(6.55, 11.5, "COZINHA", size=1.9); v.text(6.55, 11.5, "3,10 × 4,95", 1.4, dy=2.6); v.text(6.55, 11.5, "15,35 m²", 1.4, dy=5)
    v.room(7.5, 9.6, "LAV.", size=1.5); v.text(7.0, 15.95, "LAVAND.", 1.4, bold=True); v.text(7.0, 15.95, "coberta", 1.3, dy=2.4)
    v.text(.65, 9.0, "dep.", 1.3); v.text(3.3, 16.4, "DECK", 1.9, bold=True); v.text(3.3, 16.4, "quintal 2,50 × 8,25", 1.5, dy=2.6)
    v.text(5.3, 1.5, "acesso de veículos — paver", 1.8); v.text(1.25, 1.5, "acesso social", 1.5, rot=-90, dy=.5)
    v.tree(.4, 1.2, .3); v.tree(.45, 17.5, .3)
    v.secmark(4.5, -1.0, 18.6)


def superior(v):
    v.rect(0, 0, LW, LD, "lot"); v.rect(0, 0, LW, LD, "lotb")
    v.rect(6.75, 3, LW, 15.5, "roof"); v.rect(6.9, 10.7, 7.9, 11.9, "glass"); v.text(7.5, 6.5, "laje do térreo (garagem) — platibanda", 1.5, rot=-90, dy=.5)
    v.rect(.15, 3.15, 6.6, 15.35, "open")
    v.walls([(0, 3, .15, 15.5), (6.6, 3, 6.75, 15.5), (0, 3, 6.75, 3.15), (0, 15.35, 6.75, 15.5), (.15, 4.85, 1.4, 5.0), (1.25, 5.0, 1.4, 6.9),
             (1.25, 6.75, 6.6, 6.9), (2.4, 6.9, 2.55, 9.15), (4.0, 6.9, 4.15, 9.0), (2.4, 9.0, 6.6, 9.15), (4.15, 9.15, 4.3, 11.15),
             (4.3, 11.0, 6.6, 11.15), (.15, 10.4, 4.15, 10.55), (3.2, 10.55, 3.35, 15.35)])
    v.rect(2.1, 2.6, 2.55, 3.15, "stone")
    v.doorH(1.5, 2.3, 6.75, 6.9, "l", "n"); v.vao(2.9, 6.75, 3.7, 6.9); v.doorH(4.5, 5.2, 6.75, 6.9, "l", "s")
    v.doorV(9.5, 10.2, 4.15, 4.3, "t", "e"); v.doorH(1.2, 2.0, 10.4, 10.55, "l", "s"); v.doorH(3.45, 4.15, 10.4, 10.55, "l", "s")
    v.winH(2.9, 6.2, 3, 3.15, "p"); v.winH(.4, 1.1, 3, 3.15); v.winV(4.2, 5.6, 6.6, 6.75); v.winV(7.5, 8.3, 6.6, 6.75)
    v.winV(9.7, 10.5, 6.6, 6.75); v.winV(12.5, 13.9, 6.6, 6.75); v.winH(.8, 2.6, 15.35, 15.5); v.winH(4.0, 5.8, 15.35, 15.5)
    v.stair(.15, 1.15, 9.2, 5.0, 15, "DESCE"); v.rect(.15, 5.0, 1.15, 9.2, "med"); v.line(1.3, 6.9, 1.3, 9.2, "med")
    v.bed(4.6, 3.9, 6.55, 5.8, "e"); v.box(.2, 3.3, .75, 4.7); v.box(1.5, 3.2, 2.7, 3.6)
    v.box(3.4, 7.0, 3.95, 8.95); v.shower(5.6, 8.0, 6.6, 9.0); v.wc(6.45, 7.3, -1, 0); v.sink(4.2, 8.3, 4.7, 8.95)
    v.shower(5.7, 9.15, 6.6, 11.0); v.wc(5.25, 10.85, 0, -1); v.sink(5.05, 9.2, 5.6, 9.65)
    v.box(.6, 14.7, 2.8, 15.3); v.box(1.5, 14.15, 1.95, 14.6); v.box(.2, 10.65, .6, 13.6); v.box(2.3, 11.5, 3.15, 13.5); v.box(2.9, 11.5, 3.15, 13.5)
    v.bed(4.65, 12.4, 6.55, 13.8, "e"); v.box(4.4, 11.2, 6.55, 11.75)
    v.room(3.4, 4.6, "SUÍTE MASTER", 5.20, 3.60, size=2.0); v.text(.7, 4.0, "penteadeira", 1.3, rot=-90, dy=3.2)
    v.room(3.0, 8.0, "CLOSET", size=1.5); v.room(5.1, 7.6, "B. SUÍTE", area=5.15, size=1.5)
    v.room(4.95, 9.9, "BANHO", size=1.5); v.text(1.9, 8.1, "circ.", 1.4, rot=-90, dy=.5); v.room(2.4, 9.85, "HALL", size=1.7)
    v.text(.65, 7.1, "VAZIO DA ESCADA", 1.3, rot=-90, dy=.5)
    v.room(1.45, 12.3, "ESCRITÓRIO", size=1.9); v.text(1.45, 12.3, "3,05 × 4,80", 1.4, dy=2.6); v.text(1.45, 12.3, "14,64 m²", 1.4, dy=5); v.text(2.72, 12.5, "sofá-cama", 1.2, rot=-90, dy=.4); v.text(.4, 12.1, "estante", 1.2, rot=-90, dy=.4); v.text(1.7, 15.0, "bancada de trabalho", 1.2, dy=.4)
    v.room(4.95, 14.5, "QUARTO 2", size=1.9); v.text(4.95, 14.5, "3,25 × 4,20 — 13,65 m²", 1.4, dy=2.6)
    v.text(3.4, 16.8, "(quintal — ver térreo)", 2.0, fill="#666"); v.text(3.4, 1.5, "(recuo frontal 3,00)", 2.0, fill="#666")
    v.secmark(4.5, -1.0, 18.6)


def sheet():
    sh = Sheet("sobrado_opcao_B", "01", "SOBRADO — OPÇÃO B (GARAGEM FECHADA)", "Revisão 3: cozinha separada · suíte + 1 quarto + escritório · lote 8,25 × 18,00 m")
    v = V(sh, G.PX1, G.PY, 50); terreo(v); G.lot_dims(v, 3, 15.5, [2.4]); v.dimV([3, 8.75, 15.5, 18], LW, 5)
    G.plan_frame(sh, v, "PLANTA TÉRREO", note="nível +0,15 (garagem +0,05)")
    v2 = V(sh, G.PX2, G.PY, 50); superior(v2); v2.dimV([0, 3, 6.9, 9.15, 10.55, 15.5, 18], 0, -6); v2.dimH([0, 6.75, LW], 0, -5)
    G.plan_frame(sh, v2, "PLANTA PAVIMENTO SUPERIOR", note="nível +3,00")
    G.north(sh, 428, 70)
    # ---------------- fachada norte ----------------
    f = V(sh, G.EX1, G.EY, 50, mirW=LW, yup=True)
    f.ground(-.6, LW + .6)
    f.rect(2.4, 0, LW, 3.45, "graf"); f.rect(2.8, 0, 7.8, 2.5, "wood"); f.rect(0, 0, 2.4, 2.85, "roof"); f.rect(.9, .15, 2.0, 2.5, "ripado")
    f.rect(0, 2.85, 6.75, 6.6, "white"); f.rect(2.9, 3.9, 6.2, 5.4, "graf")
    for a, b in ((2.97, 4.03), (4.07, 5.03), (5.07, 6.13)):
        f.rect(a, 3.97, b, 5.33, "glass")
    f.rect(.4, 3.9, 1.1, 5.4, "glass"); f.rect(1.35, 3.1, 2.1, 6.3, "ripado"); f.rect(2.1, 0, 2.55, 7.1, "stone")
    f.level(-.4, 0, "0,00"); f.level(-.4, 3.0); f.level(-.4, 6.6); f.level(LW + .4, 3.45)
    f.text(4.5, 6.1, "volume superior — pintura branca", 1.9); f.text(5.3, 2.95, "garagem — volume grafite", 1.7, fill="#fff")
    f.text(5.3, 1.2, "portão seccionado 5,00 × 2,50 — madeira", 1.6); f.text(1.45, 1.3, "porta pivotante", 1.5, rot=-90)
    f.dimH([0, 2.4, 6.75, LW], 0, 9)
    G.vtitle(sh, G.EX1, G.EY + 16, "FACHADA NORTE (frente — rua transversal)", "1:50")
    # ---------------- corte AA ----------------
    c = V(sh, G.CX, G.CY, 50, yup=True)
    c.ground(-1.4, 18.5)
    c.rect(3.15, .05, 8.6, 2.85, "white"); c.rect(8.75, .15, 15.35, 2.85, "white"); c.rect(3.15, 3.0, 15.35, 5.7, "white")
    c.rect(3.6, .3, 8.0, 1.0, "furn", rx=.2); c.rect(4.5, 1.0, 7.0, 1.45, "furn", rx=.2)
    c.rect(8.77, .15, 9.2, .95, "furn"); c.rect(10.2, .15, 11.1, .9, "furn"); c.rect(13.0, .5, 14.6, 1.5, "furn")
    c.rect(3.6, 3.0, 5.6, 3.55, "furn"); c.rect(12.4, 3.0, 13.8, 3.55, "furn")
    c.walls([(3, 2.85, 15.5, 3.0), (3, 5.7, 15.5, 5.85), (8.6, 0, 15.5, .15), (3, 2.5, 3.15, 2.85), (8.6, .15, 8.75, 2.85), (15.35, 2.45, 15.5, 2.85),
             (3, 3.0, 3.15, 3.9), (3, 5.4, 3.15, 5.7), (6.75, 5.1, 6.9, 5.7), (9.0, 3.0, 9.15, 5.7), (11.0, 3.0, 11.15, 5.7),
             (15.35, 3.0, 15.5, 4.0), (15.35, 5.2, 15.5, 5.7), (3, 5.85, 3.15, 6.6), (15.35, 5.85, 15.5, 6.6), (17.85, 0, 18, 2.2)], "cut")
    c.rect(3, 0, 8.6, .05, "conc"); c.rect(3.04, .05, 3.1, 2.5, "wood"); c.line(3.15, 6.6, 15.35, 6.6)
    for a, z0, z1 in ((3.05, 3.9, 5.4), (15.4, .15, 2.45), (15.4, 4.0, 5.2)):
        c.rect(a, z0, a + .05, z1, "glass")
    c.rect(15.5, 0, 17.3, .1, "wood")
    for t, a, z in (("GARAGEM FECHADA", 5.9, 2.0), ("JANTAR", 9.9, 1.9), ("ESTAR", 13.0, 2.1), ("SUÍTE MASTER", 5.0, 4.6), ("B. SUÍTE", 7.95, 4.3),
                    ("BANHO", 10.07, 4.3), ("QUARTO 2", 13.3, 4.6), ("DECK", 16.4, .9), ("RUA", -.75, .6)):
        c.text(a, z, t, 2.0)
    c.text(9.3, 6.1, "laje impermeabilizada + platibanda", 1.9)
    c.level(-.6, 0, "0,00"); c.level(1.4, .15); c.level(1.4, 3.0); c.level(1.4, 5.85); c.level(1.4, 6.6)
    c.dimH([0, 3, 8.75, 15.5, 18], -.45, 7); c.dimV([.15, 2.85], 18.3, 3, ["2,70"]); c.dimV([3.0, 5.7], 18.3, 3, ["2,70"])
    G.vtitle(sh, G.CX, G.CY + 20, "CORTE AA (longitudinal)", "1:50")
    # ---------------- quadros ----------------
    yy = G.table(sh, G.CX, 476, [138, 42], [("#", "QUADRO DE ÁREAS — OPÇÃO B"),
        ("Térreo: casa (hall, estar/jantar/cozinha, lavabo, lavanderia)", "67,09 m²"), ("Térreo: garagem fechada (5,85 × 5,75)", "33,64 m²"),
        ("Lavanderia externa coberta (1,95 × 1,80)", "3,51 m²"),
        ("Pavimento superior (6,75 × 12,50)", "84,38 m²"), ("*", "Área construída total", "188,62 m²"),
        ("Varanda de entrada coberta (não soma)", "2,40 m²"), ("Projeção / taxa de ocupação", "106,64 m² — 71,8 %"), ("Coef. de aproveitamento", "1,27"),
        ("Área permeável possível (quintal + jardim frontal)", "≈ 18 m² — 12 %")], 4.7, 2.4)
    G.table(sh, 650, 476, [86, 46, 46], [("#", "COMPARAÇÃO"), ("*", "", "Opção A", "Opção B"), ("Garagem", "aberta, sob balanço", "fechada, porta p/ o hall"), ("Largura interna do térreo", "6,45 m", "7,95 m"),
        ("Estar + jantar / cozinha", "40,2 m² integrados", "32,1 + 15,4 m²"), ("Suíte (quarto)", "14,2 m²", "18,7 m²"),
        ("Outros quartos", "2 (10,4 e 11,4 m²)", "1 (13,7 m²)"), ("Escritório", "6,0 m², aberto ao hall", "14,6 m², fechado"), ("Cozinha", "aberta, com ilha", "fechada, com janela"), ("Área construída", "145,1 m²", "188,6 m²")], 4.6, 2.2)
    sh.text(G.CX, yy + 5, "Térreo ocupa a largura toda do lote (paredes cegas nas duas divisas); o superior recua 1,50 m no lado leste para ter janelas.", 2.3)
    sh.text(G.CX, yy + 9.2, "Pontos de atenção: taxa de ocupação de 72 % e pouca área permeável (conferir limites); cozinha fechada com janela e porta para o", 2.3)
    sh.text(G.CX, yy + 13.4, "quintal, mais domus; jantar recebe luz pelo estar; parede leste do superior apoia em viga sobre a garagem (projeto estrutural).", 2.3)
    sh.frame(); return sh


if __name__ == "__main__":
    s = sheet()
    open(os.path.join(HERE, s.fname + ".svg"), "w", encoding="utf-8").write(s.svg())
    page = ("<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'><title>Sobrado — Opção B</title><style>@page{size:841mm 594mm;margin:0}"
            "html,body{margin:0;background:#777}.p{width:841mm;height:594mm;margin:6mm auto;background:#fff}.p svg{display:block;width:841mm;height:594mm}"
            "@media print{html,body{background:#fff}.p{margin:0}}</style></head><body><div class='p'>" + s.svg() + "</div></body></html>")
    open(os.path.join(HERE, "index.html"), "w", encoding="utf-8").write(page)
    print("ok")
