// As 4 casas, com as mesmas cotas das pranchas 03 a 06 (u 0..8,25 oeste→leste ; v 0..18 rua→fundo)
import { M } from './tex.js';
import { walls, win, fix, slide, door, vao, fill, parapet, slats } from './geo.js';
import * as P from './props.js';

const LW = 8.25, LD = 18;

// ------------------------------------------------------------------ LOTE 1 — SOBRADO
function sobrado(B) {
  // revisão 2: sem piscina; casa de v 3 (balanço) / 8 (térreo) até v 16; térreo em conceito aberto
  const F = .15, U = 3.0, W = M.reboco;
  B.box(M.grama, 0, 0, -1.6, LW, LD, .03); B.grassRect(.1, 17.5, 2.3, 17.9, 2);
  B.box(M.paver, 0, 0, 0, 6.75, 3, .04); B.box(M.paverEscuro, 0, 3, 0, 5.0, 8, .05); B.box(M.concreto, 5.5, 0, 0, 6.75, 8, .05); B.box(M.brita, 6.75, 0, 0, LW, 16, .05);
  // quintal: deck gourmet com pergolado e churrasqueira
  B.box(M.deck, 2.4, 16, 0, LW, 18, .12); B.floor(2.4, 16, LW, 18, .12); P.pergola(B, 2.6, 16.1, 8.1, 17.9, 2.45, 'u', .45);
  P.dining(B, 3.2, 16.75, 5.0, 17.45, .12, true); P.grill(B, 5.9, 17.35, 8.05, 17.9, .12); B.lamp(4.6, 17, 2.4, 4, .8);
  // área de serviço coberta
  B.box(M.concreto, 0, 16, 0, 2.4, 17.4, .1); B.floor(0, 16, 2.4, 17.4, .1); walls(B, W, [[0, 17.25, 2.4, 17.4], [0, 16, .15, 17.25]], 0, 2.5); B.box(W, 0, 16, 2.5, 2.45, 17.45, 2.62);
  P.tank(B, .22, 16.6, .85, 17.2, .1); P.washer(B, .95, 16.6, 1.55, 17.2, .1);
  // pilares frontais e lâmina de pedra
  for (const u of [0, 4.75]) { B.box(M.rebocoCinza, u, 3, 0, u + .25, 3.25, 2.85); B.col(u, 3, u + .25, 3.25, 0, 2.85); }
  B.box(M.pedra, 5.0, 2.6, 0, 5.5, 4.35, 7.1); B.box(M.pedra, 5.0, 4.35, 0, 5.5, 8.0, 2.85); B.box(M.rufo, 4.98, 2.58, 7.1, 5.52, 4.37, 7.13); B.col(5.0, 2.6, 5.5, 8, 0, 7);
  // térreo
  B.box(M.porcelanato, 0, 8, 0, 6.75, 16, F); B.floor(.15, 8.15, 6.6, 15.85, F); B.floor(5.5, 3, 6.75, 8.15, .08);
  walls(B, W, [[0, 8, 6.75, 8.15], [0, 15.85, 6.75, 16], [0, 8.15, .15, 15.85], [6.6, 8.15, 6.75, 15.85], [2.25, 8.15, 2.4, 11.15], [.15, 11.15, 1.2, 11.3], [3.6, 8.15, 3.75, 9.9], [2.4, 9.75, 3.6, 9.9]], F, 2.85, [
    door([5.5, 8, 6.55, 8.15], 'r', 's', F, 2.45, { mat: M.madeira }), win([2.7, 8, 3.3, 8.15], F, 1.75, 2.15), door([2.7, 9.75, 3.4, 9.9], 'l', 'n', F),
    slide([3.0, 15.85, 6.2, 16], F, 2.3), door([.9, 15.85, 1.7, 16], 'l', 's', F, 2.1, { mat: M.madeiraClara }), win([6.6, 11.0, 6.75, 13.0], F, 1.0, 2.2)]);
  // escada em U (16 espelhos de 17,8 cm)
  const rz = (U - F) / 16, L = F + 8 * rz;
  for (let i = 0; i < 7; i++) { B.box(M.madeiraClara, 1.25, 11.15 - (i + 1) * .28, F, 2.25, 11.15 - i * .28, F + (i + 1) * rz); B.box(M.madeiraClara, .15, 9.19 + i * .28, L + (i + 1) * rz - .2, 1.15, 9.19 + (i + 1) * .28, L + (i + 1) * rz); }
  B.box(M.madeiraClara, .15, 8.15, L - .18, 2.25, 9.19, L); B.box(M.branco, 1.15, 9.19, F, 1.25, 11.15, U + .95); B.col(1.15, 9.19, 1.25, 11.15, 0, 4);
  B.floor(1.25, 9.19, 2.25, 11.15, 0, { ax: 'v', a0: 11.15, a1: 9.19, h0: F, h1: L }); B.floor(.15, 8.15, 2.25, 9.19, L); B.floor(.15, 9.19, 1.15, 11.15, 0, { ax: 'v', a0: 9.19, a1: 11.15, h0: L, h1: U });
  // laje do superior (com vazio da escada) e piso
  for (const r of [[0, 3, 6.75, 8.15], [2.25, 8.15, 6.75, 11.15], [0, 11.15, 6.75, 16], [0, 8.15, .15, 11.15]]) { B.box(M.branco, r[0], r[1], 2.85, r[2], r[3], U); B.floor(r[0], r[1], r[2], r[3], U); }
  for (const r of [[.15, 4.35, 6.6, 8.15], [2.4, 8.15, 6.6, 11.15], [.15, 11.15, 6.6, 15.85]]) B.box(M.pisoMadeira, r[0], r[1], U, r[2], r[3], U + .012);
  walls(B, W, [[0, 3, .15, 15.85], [6.6, 3, 6.75, 15.85], [0, 15.85, 6.75, 16], [.15, 4.2, 6.6, 4.35], [4.2, 4.35, 4.35, 7.85], [4.35, 5.85, 6.6, 6.0], [.15, 7.85, 6.6, 8.0], [3.6, 8.0, 3.75, 10.0], [3.75, 10.0, 6.6, 10.15],
    [.15, 12.25, 6.6, 12.4], [3.15, 12.4, 3.3, 15.85]], U, 5.7, [
    slide([.6, 4.2, 3.9, 4.35], U, 2.3), win([5.55, 4.2, 6.4, 4.35], U, 1.0, 2.2), door([4.2, 4.6, 4.35, 5.4], 't', 'e', U), door([4.2, 6.4, 4.35, 7.1], 'b', 'e', U),
    door([2.6, 7.85, 3.4, 8.0], 'l', 'n', U), door([3.6, 8.6, 3.75, 9.3], 't', 'e', U), door([1.6, 12.25, 2.4, 12.4], 'l', 's', U), door([4.0, 12.25, 4.8, 12.4], 'l', 's', U),
    win([6.6, 6.5, 6.75, 7.3], U, 1.5, 2.1), win([6.6, 8.8, 6.75, 9.6], U, 1.5, 2.1), win([6.6, 10.5, 6.75, 11.9], U, 1.0, 2.2), win([6.6, 13.2, 6.75, 14.6], U, 1.0, 2.2),
    win([.8, 15.85, 2.6, 16], U, 1.0, 2.2), win([3.9, 15.85, 5.9, 16], U, 1.0, 2.2)]);
  B.box(M.vidro, 2.3, 8.15, U, 2.32, 11.15, U + 1.0); B.col(2.25, 8.15, 2.4, 11.15, U, U + 1.1); B.box(M.vidro, 1.25, 11.15, U, 2.3, 11.17, U + 1.0); B.col(1.25, 11.1, 2.3, 11.2, U, U + 1.1);
  // cobertura
  B.box(M.branco, 0, 3, 5.7, 6.75, 16, 5.85); B.box(M.lajeTopo, .15, 3.15, 5.85, 6.6, 15.85, 5.87); parapet(B, W, 0, 3, 6.75, 16, 5.85, 6.6); B.box(W, .15, 3, 5.5, 6.6, 3.15, 5.7);
  // varanda: deck, guarda-corpo de vidro, brises e painel de madeira
  B.box(M.deck, .15, 3.0, U, 6.6, 4.2, U + .015); B.box(M.vidro, .15, 3.02, U, 5.0, 3.04, U + 1.1); B.box(M.inox, .15, 3.0, U + 1.1, 5.0, 3.06, U + 1.13); B.col(.15, 2.98, 6.6, 3.08, U, U + 1.1);
  slats(B, M.madeira, 'u', 5.52, 6.6, 3.02, 3.1, U, 5.5, .05, .07); B.box(M.madeira, 3.95, 4.17, U, 5.0, 4.2, 5.7);
  B.box(M.led, .3, 7.9, 2.82, 4.7, 7.94, 2.85); B.lamp(2.5, 5.5, 2.7, 4.5, .8); B.lamp(6.1, 7.2, 2.7, 2.5, .5);
  P.car(B, 1.35, 5.5, 90, 1); P.car(B, 3.7, 5.5, 90, 0);
  // mobília térreo: cozinha com ilha, jantar de 6 lugares, estar
  P.counter(B, .2, 11.4, .8, 14.6, F); P.sinkTop(B, .5, 12.8, F + .9); P.cooktop(B, .5, 11.9, F + .9); P.upper(B, .2, 11.4, .5, 14.6, F); P.fridge(B, .2, 14.7, .82, 15.4, F);
  P.counter(B, 2.0, 12.1, 2.7, 14.3, F, .95, M.madeiraClara); for (const v of [12.6, 13.2, 13.8]) P.stool(B, 3.0, v, F);
  P.dining(B, 3.4, 10.6, 5.2, 11.5, F, true);
  P.sofa(B, 3.9, 13.0, 4.75, 15.3, 'w', F); P.table(B, 5.0, 13.8, 5.7, 14.6, F, .38); P.rug(B, 4.8, 13.1, 6.1, 15.3, F); P.tvV(B, 6.25, 13.4, 6.55, 15.2, F);
  P.wc(B, 3.0, 8.28, 0, 1, F); P.vanity(B, 2.45, 9.28, 2.85, 9.7, F);
  for (const [u, v] of [[4.9, 14.2], [1.4, 13], [4.3, 11], [5.2, 8.9]]) P.ceilLamp(B, u, v, 2.85);
  // mobília superior
  P.bed(B, .2, 5.2, 2.2, 7.0, 'w', U); P.tvV(B, 3.95, 5.5, 4.18, 6.3, U); P.rug(B, 2.3, 5.2, 3.6, 7.0, U); P.wardrobe(B, 6.05, 4.4, 6.55, 5.8, U);
  P.showerGlass(B, 5.6, 6.9, 5.62, 7.85, U); P.wc(B, 6.45, 6.35, -1, 0, U); P.vanity(B, 4.4, 7.3, 5.0, 7.8, U);
  P.showerGlass(B, 5.7, 8.0, 5.72, 10.0, U); P.wc(B, 4.9, 8.13, 0, 1, U); P.vanity(B, 3.8, 9.45, 4.4, 9.95, U);
  P.table(B, 5.9, 10.4, 6.5, 11.9, U); P.chair(B, 5.6, 11.15, 'w', U);
  P.bed(B, .2, 13.6, 2.1, 15.0, 'w', U); P.wardrobe(B, .2, 12.45, 1.5, 13.0, U); P.bed(B, 4.6, 13.6, 6.5, 15.0, 'e', U); P.wardrobe(B, 5.0, 12.45, 6.5, 13.0, U);
  for (const [u, v] of [[2.2, 6.0], [3.0, 10], [5.0, 9.0], [5.0, 11.2], [1.6, 14.2], [4.9, 14.2]]) P.ceilLamp(B, u, v, 5.7);
  B.plant('tree', 7.5, 1.4, .45); B.plant('capim', 7.4, 5, .9); B.plant('capim', 7.6, 9, .8); B.plant('shrub', 7.5, 12.5, .6); B.plant('shrub', 7.5, 15, .6); B.plant('shrub', 1.2, 17.7, .6); B.plant('capim', .5, 17.7, .8);
  P.caixa(B, 1.3, 14.5, 5.87); B.label('Lote 1 · Sobrado · 8,25 × 18 m', 3.4, 5, 7.6, 'l');
}

// ------------------------------------------------------------------ LOTE 2 — CHALÉ A-FRAME
function rail(B, u0, v0, u1, v1, z) {
  const hz = (u1 - u0) > (v1 - v0);
  if (hz) { B.box(M.madeira, u0, v0, z + .9, u1, v0 + .06, z + .96); for (let a = u0; a < u1; a += .14) B.box(M.madeira, a, v0 + .015, z, a + .03, v0 + .045, z + .9); B.col(u0, v0, u1, v0 + .06, z, z + 1); }
  else { B.box(M.madeira, u0, v0, z + .9, u0 + .06, v1, z + .96); for (let a = v0; a < v1; a += .14) B.box(M.madeira, u0 + .015, a, z, u0 + .045, a + .03, z + .9); B.col(u0, v0, u0 + .06, v1, z, z + 1); }
}
function chale(B) {
  const PL = .45, KN = 1.95, RG = 7.15, MZ = 3.15, C0 = .75, C1 = 6.75, S = Math.sqrt(3), Wd = M.madeira, e = .35, ez = KN - e * S;
  B.box(M.grama, 0, 0, -1.6, LW, LD, .03);
  for (const r of [[.2, .2, 2.5, 3.6], [4.1, .2, 5.4, 3.6], [.1, 5.6, .6, 17.8], [.7, 14.3, 8.1, 17.8], [6.9, 5.5, 8.1, 14.2]]) B.grassRect(...r, 1.2);
  B.box(M.paverEscuro, 5.5, 0, 0, 8.0, 5.3, .05); P.car(B, 6.75, 2.75, 90, 2); B.box(M.concreto, 2.6, 0, 0, 4.0, 3.4, .06);
  // embasamento de pedra, piso e deck
  B.box(M.pedra, C0, 5.5, 0, C1, 14, .33); B.box(M.pisoMadeira, C0, 5.5, .33, C1, 14, PL); B.floor(.9, 5.5, 6.6, 14, PL);
  B.box(M.pedra, .8, 3.75, 0, 5.15, 5.5, .3); B.box(M.deck, .75, 3.7, .3, 5.2, 5.5, PL); B.floor(.75, 3.7, 5.2, 5.5, PL); B.box(M.deck, 2.6, 3.4, 0, 4.0, 3.7, .23); B.floor(2.6, 3.4, 4.0, 3.7, .23);
  rail(B, .75, 3.7, 2.6, 3.76, PL); rail(B, 4.0, 3.7, 5.2, 3.76, PL); rail(B, .75, 3.7, .81, 5.5, PL); rail(B, 5.14, 3.7, 5.2, 5.5, PL);
  walls(B, Wd, [[C0, 5.65, .9, 13.85], [6.6, 5.65, C1, 13.85]], PL, KN);
  // telhado de duas águas a 60° + forro de madeira
  B.prism(M.shingle, [[C0 - e, ez], [3.75, RG + .28], [C1 + e, ez], [C1 + e - .3, ez], [3.75, RG - .24], [C0 - e + .3, ez]], 5.2, 14.3);
  B.prism(M.madeiraClara, [[C0 - e + .3, ez], [3.75, RG - .24], [C1 + e - .3, ez], [C1 + e - .37, ez], [3.75, RG - .36], [C0 - e + .37, ez]], 5.66, 13.84);
  B.box(M.rufo, 3.6, 5.18, RG + .2, 3.9, 14.32, RG + .32);
  // oitão frontal de vidro
  const tri = [[C0 + .95, MZ + .1], [3.75, RG - .85], [C1 - .95, MZ + .1]];
  B.prism(Wd, [[C0, PL], [C0, KN], [3.75, RG - .3], [C1, KN], [C1, PL], [5.25, PL], [5.25, 2.75], [2.25, 2.75], [2.25, PL]], 5.5, 5.65,
    [[[1.25, 1.1], [2.1, 1.1], [2.1, 2.5], [1.25, 2.5]], [[5.4, 1.1], [6.25, 1.1], [6.25, 2.5], [5.4, 2.5]], tri]);
  fill(B, slide([2.25, 5.5, 5.25, 5.65], PL, 2.3)); fill(B, { r: [1.25, 5.5, 2.1, 5.65], z0: 1.1, z1: 2.5, t: 'fix' }); fill(B, { r: [5.4, 5.5, 6.25, 5.65], z0: 1.1, z1: 2.5, t: 'fix' });
  B.prism(M.vidro, tri, 5.565, 5.585); B.box(M.preto, 3.72, 5.55, MZ + .1, 3.78, 5.6, RG - .9); B.box(M.preto, 2.54, 5.55, 4.47, 4.96, 5.6, 4.53); B.box(M.preto, 1.7, 5.55, MZ + .1, 5.8, 5.6, MZ + .16);
  B.col(C0, 5.5, 2.25, 5.65, 0, 7); B.col(5.25, 5.5, C1, 5.65, 0, 7);
  // oitão dos fundos
  B.prism(Wd, [[C0, PL], [C0, KN], [3.75, RG - .3], [C1, KN], [C1, PL], [6.1, PL], [6.1, PL + 2.1], [5.3, PL + 2.1], [5.3, PL], [2.0, PL], [2.0, PL + 2.1], [1.2, PL + 2.1], [1.2, PL]], 13.85, 14,
    [[[3.3, 2.7], [4.2, 2.7], [4.2, 3.9], [3.3, 3.9]], [[2.9, 4.05], [4.6, 4.05], [4.6, 5.35], [2.9, 5.35]]]);
  fill(B, door([1.2, 13.85, 2.0, 14], 'l', 's', PL, 2.1, { mat: Wd })); fill(B, door([5.3, 13.85, 6.1, 14], 'r', 's', PL, 2.1, { mat: Wd }));
  fill(B, { r: [3.3, 13.85, 4.2, 14], z0: 2.7, z1: 3.9, t: 'fix' }); fill(B, { r: [2.9, 13.85, 4.6, 14], z0: 4.05, z1: 5.35, t: 'fix' });
  B.col(C0, 13.85, 1.2, 14, 0, 7); B.col(2.0, 13.85, 5.3, 14, 0, 7); B.col(6.1, 13.85, C1, 14, 0, 7);
  // paredes internas sob o mezanino (as transversais acompanham a inclinação do telhado)
  walls(B, M.madeiraClara, [[2.65, 11.2, 2.8, 13.85], [4.7, 10.6, 4.85, 13.85]], PL, 2.95);
  B.prism(M.madeiraClara, [[4.85, PL], [4.85, 2.95], [5.86, 2.95], [6.6, 1.68], [6.6, PL], [6.0, PL], [6.0, 2.55], [5.3, 2.55], [5.3, PL]], 10.6, 10.75); fill(B, door([5.3, 10.6, 6.0, 10.75], 'l', 's', PL));
  B.prism(M.madeiraClara, [[4.85, PL], [4.85, 2.95], [5.86, 2.95], [6.6, 1.68], [6.6, PL]], 12.3, 12.45);
  B.col(4.85, 10.6, 5.3, 10.75, 0, 3); B.col(6.0, 10.6, 6.6, 10.75, 0, 3); B.col(4.85, 12.3, 6.6, 12.45, 0, 3);
  // mezanino (laje recortada pelo telhado) + guarda-corpos
  B.prism(M.pisoMadeira, [[1.63, 2.95], [5.87, 2.95], [5.757, MZ], [1.743, MZ]], 8.6, 11.2); B.prism(M.pisoMadeira, [[1.63, 2.95], [2.8, 2.95], [2.8, MZ], [1.743, MZ]], 11.2, 13.85); B.prism(M.pisoMadeira, [[4.7, 2.95], [5.87, 2.95], [5.757, MZ], [4.7, MZ]], 11.2, 13.85);
  B.floor(1.75, 8.6, 5.75, 11.2, MZ); B.floor(1.75, 11.2, 2.8, 13.85, MZ); B.floor(4.7, 11.2, 5.75, 13.85, MZ);
  B.box(M.vidro, 1.8, 8.6, MZ, 5.7, 8.62, MZ + 1.0); B.box(M.inox, 1.8, 8.58, MZ + 1.0, 5.7, 8.64, MZ + 1.03); B.col(1.7, 8.55, 5.8, 8.65, MZ - .1, MZ + 1.1);
  B.box(M.vidro, 2.8, 11.2, MZ, 2.82, 13.0, MZ + 1); B.col(2.78, 11.2, 2.84, 13.0, MZ, MZ + 1.1); B.box(M.vidro, 4.68, 11.2, MZ, 4.7, 13.85, MZ + 1); B.col(4.66, 11.2, 4.72, 13.85, MZ, MZ + 1.1);
  B.box(M.vidro, 3.75, 11.2, MZ, 4.7, 11.22, MZ + 1); B.col(3.75, 11.18, 4.7, 11.24, MZ, MZ + 1.1);
  B.col(1.2, 8.6, 1.75, 13.85, MZ - .1, MZ + 2); B.col(5.75, 8.6, 6.3, 13.85, MZ - .1, MZ + 2);
  // escada em U (16 espelhos)
  const rz = (MZ - PL) / 16, L = PL + 8 * rz;
  for (let i = 0; i < 7; i++) { B.box(M.madeiraClara, 3.8, 11.2 + i * .25, PL, 4.7, 11.2 + (i + 1) * .25, PL + (i + 1) * rz); B.box(M.madeiraClara, 2.8, 12.95 - (i + 1) * .25, L + (i + 1) * rz - .07, 3.7, 12.95 - i * .25, L + (i + 1) * rz); }
  B.box(M.madeiraClara, 2.8, 12.95, L - .1, 4.7, 13.85, L); B.box(M.madeiraClara, 3.7, 11.2, PL, 3.8, 12.95, MZ + 1.0); B.col(3.7, 11.2, 3.8, 12.95, 0, 5);
  B.floor(3.8, 11.2, 4.7, 12.95, 0, { ax: 'v', a0: 11.2, a1: 12.95, h0: PL, h1: L }); B.floor(2.8, 12.95, 4.7, 13.85, L); B.floor(2.8, 11.2, 3.7, 12.95, 0, { ax: 'v', a0: 12.95, a1: 11.2, h0: L, h1: MZ });
  // lareira e chaminé de pedra
  B.box(M.pedra, .9, 7.2, PL, 1.6, 8.1, 6.3); B.box(M.rufo, .82, 7.12, 6.3, 1.68, 8.18, 6.42); B.box(M.vidroEscuro, 1.6, 7.35, PL + .2, 1.62, 7.95, PL + .9); B.box(M.lampada, 1.6, 7.45, PL + .22, 1.625, 7.85, PL + .4);
  B.col(.9, 7.2, 1.6, 8.1, 0, 7); B.lamp(2.0, 7.65, PL + .5, 2.5, .6);
  // mobília
  P.sofa(B, 2.3, 6.1, 4.6, 6.95, 'n', PL); P.sofa(B, 5.55, 6.7, 6.4, 8.0, 'e', PL, M.tecidoClaro); P.table(B, 2.9, 7.4, 4.0, 8.0, PL, .38); P.rug(B, 2.1, 7.0, 5.3, 8.4, PL);
  P.dining(B, 3.1, 9.3, 4.6, 10.1, PL, true);
  P.counter(B, .95, 9.0, 1.55, 13.0, PL, .9, M.madeiraClara); P.sinkTop(B, 1.25, 10.9, PL + .9); P.cooktop(B, 1.25, 12.2, PL + .9); P.fridge(B, 2.0, 13.2, 2.62, 13.82, PL);
  P.showerGlass(B, 5.68, 10.75, 5.7, 11.65, PL); P.wc(B, 6.4, 12.0, -1, 0, PL); P.vanity(B, 4.9, 11.7, 5.35, 12.25, PL); P.tank(B, 4.9, 12.5, 5.25, 13.1, PL); P.washer(B, 5.95, 12.5, 6.5, 13.1, PL);
  P.bed(B, 2.95, 8.85, 4.55, 10.85, 's', MZ); B.box(M.madeiraClara, 1.8, 9.0, MZ, 2.2, 11.1, MZ + .55); B.box(M.madeiraClara, 5.3, 9.0, MZ, 5.7, 13.6, MZ + .55);
  P.ceilLamp(B, 3.8, 9.9, 2.95); P.ceilLamp(B, 1.9, 11.6, 2.95); P.ceilLamp(B, 5.6, 11.5, 2.4);
  B.lamp(3.75, 4.6, 2.2, 3.5, .6);
  // quintal
  B.plant('araucaria', 6.2, 16.3, 1); B.col(6.0, 16.1, 6.4, 16.5, 0, 3); B.cyl(M.pedra, 2.6, 16.2, .55, .55, 0, .3, 16); B.cyl(M.grafite, 2.6, 16.2, .42, .42, .3, .31, 16); B.col(2.1, 15.7, 3.1, 16.7, 0, .5);
  B.plant('tree', 1.3, 1.6, .55); B.plant('shrub', .9, 17.1, .7); B.plant('shrub', 4.6, 2.6, .5); B.plant('capim', 4.9, 1.2, .9); B.plant('shrub', .35, 4.6, .5); B.plant('shrub', 7.5, 7, .6); B.plant('shrub', 7.5, 11, .6);
  B.label('Lote 2 · Chalé · 8,25 × 18 m', 3.75, 5.2, 8.0, 'l');
}

// ------------------------------------------------------------------ LOTE 3 — TÉRREA (laje plana + beiral)
function casa3(B) {
  const F = .15, W = M.reboco;
  B.box(M.grama, 0, 0, -1.6, LW, LD, .03); B.grassRect(.1, 5.2, 1.4, 17.8, 1.5); B.grassRect(1.5, 17.5, 8.1, 17.9, 1.5);
  B.box(M.paverEscuro, .3, 0, 0, 3.3, 5.0, .05); P.car(B, 1.8, 2.6, 90, 4); B.box(M.brita, 3.4, 0, 0, 8.25, 5.0, .06);
  for (let i = 0; i < 5; i++) B.box(M.concreto, 7.2, .2 + i * .95, .06, 8.0, .9 + i * .95, .09);
  for (const [u, v, k, s] of [[4.6, 1.6, 'capim', 1.2], [5.9, 3.4, 'capim', 1], [4.3, 3.9, 'capim', .8], [6.3, 1.2, 'capim', .9], [5.2, 2.6, 'shrub', .6], [3.9, .8, 'capim', .9], [6.6, 4.3, 'shrub', .5], [5.3, .7, 'capim', .7]]) B.plant(k, u, v, s, .06);
  for (const [u, v, r] of [[5.0, 3.6, .28], [6.1, 2.2, .2], [4.2, 2.4, .18]]) B.cyl(M.pedra, u, v, r, r * .6, .05, .05 + r, 7);
  P.pergola(B, .3, .3, 3.3, 5.0, 2.45, 'v', .5);
  // casa
  B.box(M.porcelanato, 1.5, 5, 0, LW, 15, F); B.floor(1.65, 5.15, 8.1, 14.85, F);
  walls(B, W, [[1.5, 5, LW, 5.15], [1.5, 14.85, 8.1, 15], [1.5, 5.15, 1.65, 14.85], [8.1, 5.15, LW, 17.4], [6.95, 5.15, 7.1, 9.95], [4.75, 5.15, 4.9, 11.2], [4.9, 6.95, 6.95, 7.1], [1.65, 8.15, 6.95, 8.3],
  [4.9, 9.8, 6.95, 9.95], [1.65, 11.2, 6.95, 11.35]], F, 2.85, [
    door([7.15, 5, 8.05, 5.15], 'r', 's', F, 2.35, { mat: M.madeira }), win([2.3, 5, 4.3, 5.15], F, .75, 2.25), win([5.5, 5, 6.3, 5.15], F, 1.85, 2.35),
    door([6.95, 7.2, 7.1, 8.0], 't', 'w', F), vao([4.75, 7.2, 4.9, 8.0], F, 2.1), door([5.2, 6.95, 5.9, 7.1], 'l', 'n', F), door([4.75, 10.2, 4.9, 10.95], 'b', 'w', F), door([5.5, 9.8, 6.2, 9.95], 'l', 'n', F),
    win([1.5, 9.0, 1.65, 10.5], F, 1.0, 2.2), slide([2.2, 14.85, 6.2, 15], F, 2.25), win([1.5, 12.2, 1.65, 13.6], F, 1.0, 2.2), door([7.2, 14.85, 7.95, 15], 'r', 's', F, 2.1, { mat: M.madeiraClara })]);
  B.box(M.madeira, 4.9, 4.97, F, 7.0, 5.0, 2.85); slats(B, M.madeira, 'u', 4.92, 7.0, 4.93, 4.97, F, 2.85, .045, .04);
  // laje com beiral, platibanda recuada
  B.box(M.branco, .5, 3.8, 2.85, LW, 17.4, 3.0); B.box(M.lajeTopo, .56, 3.86, 3.0, LW, 17.34, 3.02); parapet(B, W, 1.5, 5, LW, 15, 3.0, 3.5);
  for (const r of [[.5, 3.8, LW, 3.86], [.5, 3.8, .56, 17.4], [.5, 17.34, LW, 17.4]]) B.box(M.grafite, r[0] - .01, r[1] - .01, 2.8, r[2] + .01, r[3] + .01, 3.12);
  B.box(M.led, 1.7, 4.9, 2.82, 8.0, 4.94, 2.85); B.lamp(5, 4.6, 2.7, 4, .7); B.lamp(4, 16.2, 2.7, 4, .8); B.box(M.led, 1.7, 15.06, 2.82, 6.2, 15.1, 2.85);
  // varanda gourmet + área de serviço
  B.box(M.deck, 1.5, 15, 0, 6.3, 17.4, .1); B.floor(1.5, 15, 6.3, 17.4, .1); B.box(M.concreto, 6.3, 15, 0, 8.1, 17.4, .1); B.floor(6.3, 15, 8.1, 17.4, .1);
  B.box(W, 1.5, 17.25, 0, 1.65, 17.4, 2.85); B.col(1.5, 17.25, 1.65, 17.4, 0, 3); slats(B, M.madeira, 'v', 15.8, 17.4, 6.3, 6.38, .1, 2.85, .05, .06); B.col(6.3, 15.8, 6.4, 17.4, 0, 3);
  walls(B, W, [[6.4, 17.25, 8.1, 17.4]], 0, 2.85);
  P.grill(B, 1.7, 16.8, 4.3, 17.35, .1); P.dining(B, 3.0, 15.5, 5.2, 16.25, .1, true); P.tank(B, 6.6, 16.6, 7.2, 17.2, .1); P.washer(B, 7.35, 16.6, 7.95, 17.2, .1);
  // mobília
  P.bed(B, 2.4, 6.2, 4.3, 7.8, 'e', F); P.wardrobe(B, 1.7, 5.25, 2.25, 7.0, F); P.wardrobe(B, 4.95, 7.15, 6.9, 7.6, F, 2.2);
  P.showerGlass(B, 6.0, 5.95, 6.95, 5.97, F); P.wc(B, 6.5, 5.3, 0, 1, F); P.vanity(B, 4.95, 5.2, 5.45, 5.8, F);
  P.bed(B, 1.7, 8.4, 3.6, 9.4, 'w', F); P.wardrobe(B, 2.6, 10.6, 4.7, 11.15, F);
  P.showerGlass(B, 5.75, 8.3, 5.77, 9.2, F); P.wc(B, 6.35, 8.45, 0, 1, F); P.vanity(B, 6.4, 9.3, 6.9, 9.75, F);
  P.counter(B, 7.5, 11.5, 8.05, 13.85, F); P.sinkTop(B, 7.78, 12.9, F + .9); P.cooktop(B, 7.78, 11.95, F + .9); P.upper(B, 7.75, 11.5, 8.05, 13.85, F); P.fridge(B, 7.45, 13.95, 8.07, 14.6, F);
  P.counter(B, 6.2, 12.2, 6.8, 13.9, F, .95, M.madeiraClara); P.stool(B, 5.95, 12.6, F); P.stool(B, 5.95, 13.4, F);
  P.sofa(B, 1.75, 11.5, 2.6, 13.9, 'w', F); P.rug(B, 2.6, 11.7, 4.3, 13.8, F); P.tvV(B, 4.4, 11.45, 4.7, 12.9, F); P.dining(B, 3.4, 13.5, 5.0, 14.2, F, true);
  for (const [u, v] of [[3.2, 6.6], [5.9, 6.0], [3.2, 9.8], [5.9, 9.0], [7.6, 8], [4.5, 13], [7, 13]]) P.ceilLamp(B, u, v, 2.85);
  B.plant('tree', .75, 6.6, .5); B.plant('shrub', .75, 10, .7); B.plant('tree', .75, 13.2, .5); B.plant('shrub', .9, 16.6, .8); B.plant('capim', 3, 17.7, .8); B.plant('capim', 5, 17.7, .8);
  P.caixa(B, 7.2, 6.3, 3.02); B.label('Lote 3 · Casa moderna · 8,25 × 18 m', 4.6, 4.2, 4.6, 'l');
}

// ------------------------------------------------------------------ LOTE 4 — TÉRREA (volume de madeira + garagem grafite)
function casa4(B) {
  const F = .15, W = M.reboco, Wd = M.madeira, Gf = M.grafite;
  B.box(M.grama, 0, 0, -1.6, LW, LD, .03); B.grassRect(1.6, .2, 1.85, 3.9, 1.5); B.grassRect(3.0, .2, 5.3, 3.9, 1.5); B.grassRect(.1, 15.5, 1.4, 17.8, 1.5); B.grassRect(6.9, 17.1, 8.1, 17.9, 1.5);
  B.box(M.paver, 5.4, 0, 0, 8.1, 3.0, .04); B.box(M.concreto, 1.9, 0, 0, 2.9, 4.0, .06); B.box(M.brita, 0, 0, 0, 1.5, 15.35, .05);
  for (let i = 0; i < 9; i++) B.box(M.concreto, .35, 4.2 + i * 1.2, .05, 1.15, 5.0 + i * 1.2, .08);
  B.plant('tree', 4.1, 1.7, .55); B.plant('shrub', 3.6, 3.2, .6); B.plant('capim', .75, 1.6, 1.1); B.plant('capim', .7, 3, .8); B.plant('shrub', 4.9, 3.3, .5);
  // pisos
  B.box(M.porcelanato, 1.5, 4, 0, 5.4, 10.75, F); B.box(M.porcelanato, 5.4, 8.3, 0, LW, 10.75, F); B.box(M.porcelanato, 1.5, 10.75, 0, LW, 15.35, F); B.box(M.concreto, 5.4, 3, 0, LW, 8.3, .1);
  B.floor(1.65, 4.15, 8.1, 15.2, F); B.floor(5.4, 3.0, 8.1, 8.3, .1);
  // volume alto de madeira (estar/jantar, pé-direito 5,00)
  walls(B, Wd, [[1.5, 4, 5.25, 4.15], [1.5, 4.15, 1.65, 10.75]], F, 5.3, [
    door([1.9, 4, 2.8, 4.15], 'l', 's', F, 2.3, { mat: M.madeiraClara }), fix([3.1, 4, 5.0, 4.15], F, 2.3), { r: [1.9, 4, 5.0, 4.15], z0: 3.3, z1: 4.9, t: 'fix' },
    win([1.5, 5.2, 1.65, 7.6], F, 1.0, 2.3), door([1.5, 9.3, 1.65, 10.2], 't', 'w', F, 2.1, { mat: M.madeiraClara })]);
  walls(B, Wd, [[5.25, 4, 5.4, 8.3]], F, 5.3); walls(B, Wd, [[5.25, 8.3, 5.4, 10.75], [1.65, 10.6, 5.25, 10.75]], 2.85, 5.3, [], false);
  B.box(M.branco, 1.65, 4.15, 5.15, 5.25, 10.6, 5.3); B.box(M.lajeTopo, 1.65, 4.15, 5.3, 5.25, 10.6, 5.32); parapet(B, Wd, 1.5, 4, 5.4, 10.75, 5.3, 5.7);
  // garagem em volume grafite
  walls(B, Gf, [[5.25, 3, LW, 3.15], [5.25, 3.15, 5.4, 4], [8.1, 3.15, LW, 8.3]], 0, 3.0, [{ r: [5.5, 3, 8.0, 3.15], z0: 0, z1: 2.45, t: 'gar', mat: M.madeira }]);
  walls(B, W, [[5.4, 8.15, 8.1, 8.3]], .1, 2.85, [door([5.6, 8.15, 6.4, 8.3], 'l', 's', .1)]);
  B.box(M.branco, 5.4, 3.15, 2.85, 8.1, 8.3, 3.0); B.box(M.branco, 5.4, 8.3, 2.85, LW, 10.75, 3.0); B.box(M.lajeTopo, 5.4, 3.15, 3.0, 8.1, 10.75, 3.02); parapet(B, Gf, 5.25, 3, LW, 8.3, 3.0, 3.3, .15, 'ne'); parapet(B, W, 5.4, 8.3, LW, 10.75, 3.0, 3.45, .15, 'e');
  P.car(B, 6.75, 5.65, 90, 3); P.ceilLamp(B, 6.75, 5.6, 2.85);
  // ala íntima + cozinha
  walls(B, W, [[8.1, 8.3, LW, 15.35], [1.65, 10.6, 8.1, 10.75], [1.5, 10.75, 1.65, 15.35], [3.7, 10.75, 3.85, 12.2], [5.9, 10.75, 6.05, 12.2], [1.65, 12.2, 8.1, 12.35], [4.8, 12.35, 4.95, 15.2], [1.65, 15.2, 8.1, 15.35]], F, 2.85, [
    vao([4.2, 10.6, 5.2, 10.75], F, 2.15), door([3.95, 12.2, 4.7, 12.35], 'r', 's', F), door([2.3, 12.2, 3.0, 12.35], 'l', 'n', F), door([5.05, 12.2, 5.8, 12.35], 'l', 's', F), door([5.9, 11.0, 6.05, 11.7], 't', 'e', F),
    win([1.5, 11.1, 1.65, 11.8], F, 1.5, 2.1), slide([2.2, 15.2, 4.2, 15.35], F, 2.25), win([5.6, 15.2, 7.4, 15.35], F, 1.0, 2.2), win([1.5, 13.2, 1.65, 14.4], F, 1.0, 2.2)]);
  B.box(M.branco, 1.5, 10.75, 2.85, LW, 15.35, 3.0); B.box(M.lajeTopo, 1.65, 10.75, 3.0, 8.1, 15.2, 3.02); parapet(B, W, 1.5, 10.75, LW, 15.35, 3.0, 3.45, .15, 'swe');
  B.box(M.led, 1.7, 3.94, 5.0, 5.2, 3.98, 5.03); B.lamp(3.4, 3.4, 2.6, 3.5, .7); B.lamp(6.75, 2.4, 2.6, 3.5, .6);
  // área gourmet com pergolado + área de serviço
  B.box(M.deck, 1.5, 15.35, 0, 6.75, 17.85, .1); B.floor(1.5, 15.35, 6.75, 17.85, .1); P.pergola(B, 1.5, 15.4, 6.75, 17.85, 2.45, 'u', .45);
  B.box(M.concreto, 6.75, 15.35, 0, LW, 17.0, .1); B.floor(6.75, 15.35, LW, 17, .1); walls(B, W, [[6.75, 16.85, LW, 17.0], [8.1, 15.35, LW, 16.85]], 0, 2.6); B.box(W, 6.75, 15.35, 2.6, LW, 17.0, 2.72);
  P.grill(B, 2.0, 17.25, 5.0, 17.8, .1); P.dining(B, 3.0, 15.9, 5.2, 16.65, .1, true); P.tank(B, 6.95, 15.45, 7.5, 16.0, .1); P.washer(B, 7.45, 16.15, 8.0, 16.75, .1); B.lamp(4.1, 16.6, 2.4, 4, .8);
  // mobília
  P.sofa(B, 1.72, 5.3, 2.55, 7.6, 'w', F); P.table(B, 2.9, 5.9, 3.9, 6.9, F, .38); P.rug(B, 2.5, 5.4, 4.5, 7.5, F); P.tvV(B, 4.85, 5.6, 5.2, 7.2, F);
  P.dining(B, 2.6, 8.7, 4.2, 9.6, F, true); P.counter(B, 5.05, 8.5, 5.6, 10.4, F, .95, M.madeiraClara);
  P.counter(B, 7.5, 9.0, 8.05, 10.55, F); P.sinkTop(B, 7.78, 9.4, F + .9); P.cooktop(B, 7.78, 10.15, F + .9); P.upper(B, 7.75, 9.0, 8.05, 10.55, F); P.fridge(B, 7.45, 8.35, 8.07, 8.97, F);
  P.showerGlass(B, 2.2, 10.75, 2.22, 12.2, F); P.wc(B, 3.55, 11.2, -1, 0, F); P.vanity(B, 3.15, 11.7, 3.65, 12.15, F);
  P.showerGlass(B, 7.2, 10.75, 7.22, 12.2, F); P.wc(B, 6.6, 10.9, 0, 1, F); P.vanity(B, 6.1, 11.7, 6.6, 12.15, F);
  P.bed(B, 2.5, 12.9, 4.1, 14.8, 'n', F); P.wardrobe(B, 1.7, 14.5, 2.2, 15.15, F); P.bed(B, 6.15, 12.9, 8.05, 13.9, 'e', F); P.wardrobe(B, 5.0, 13.9, 5.5, 15.15, F);
  for (const [u, v, z] of [[3.4, 6.5, 5.15], [3.4, 9.2, 5.15], [6.7, 9.5, 2.85], [4.8, 11.5, 2.85], [3.2, 13.8, 2.85], [6.6, 13.8, 2.85]]) P.ceilLamp(B, u, v, z);
  P.caixa(B, 6.9, 9.6, 3.02); B.label('Lote 4 · Casa moderna · 8,25 × 18 m', 4.2, 3.6, 6.4, 'l');
}

export function lots(B) {
  [sobrado, chale, casa3, casa4].forEach((f, i) => { B.frame(i * LW, 62); f(B); });
  B.frame(0, 62);
  for (const r of [[8.19, 3, 8.31, 18], [16.44, 3, 16.56, 18], [24.75, 3, 24.87, 18]]) { walls(B, M.reboco, [r], 0, 2.0); B.box(M.rufo, r[0] - .02, r[1], 2.0, r[2] + .02, r[3], 2.03); }
  B.frame(0, 0);
}
