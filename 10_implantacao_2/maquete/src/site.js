// Implantação 2 — croqui de 15/11/2026.
// x = 0..33 (divisa da soja → muro do vizinho em 34) ; y = d − 100 = 0..80 (avenida → fundo)
//   y  0–12  faixa de entrada: servidão em L, portaria, lixo, vagas de visitantes e praça
//   y 12–54  kitnets: 6 de cada lado (10,5 × 7 m), rua central de 10 m com calçadas de 1 m
//   y 54–60  rua transversal (6 m) · y 60–62 calçada dos lotes (2 m) · y 62–80 lotes 1–4 (houses.js, sem mudanças)
import { M, rng } from '../../../contexto-3d/maquete/src/tex.js';
import { walls, win, slide, door, parapet, slats } from '../../../contexto-3d/maquete/src/geo.js';
import * as P from '../../../contexto-3d/maquete/src/props.js';
import { entorno } from './entorno.js';

export const KD = 10.5, KW = 7, K0 = 12, NK = 6;   // kitnet: profundidade, frente, início, unidades por fileira

export function kitnet(B, n, ci) {
  // módulo 10,5 × 7: u = 0 (muro) → 10,5 (calçada) ; v = 0..7
  // quintal de serviço 1,50 · casa em L: ala 7,80 × 3,60 + quarto 3,70 × 3,40 = 40,66 m² · vaga coberta 5,30 × 3,40 · jardim 1,20
  const F = .1, W = M.reboco, A = 1.5, U = 9.3, R = 5.2, S = 3.6, Q = .06;
  // quintal de serviço (lavanderia externa coberta)
  B.box(M.concreto, 0, 0, -.04, A, 3.2, Q); B.box(M.grama, 0, 3.2, -.04, A, KW, Q - .02); B.grassRect(.05, 3.25, A - .05, KW - .05, 2); B.floor(0, 0, A, KW, Q);
  walls(B, W, [[0, 0, A, .12]], 0, 2.0); B.box(M.rufo, -.02, -.02, 2.0, A, .14, 2.03);
  B.box(M.grafite, 0, .12, 2.3, A, 2.0, 2.38); P.tank(B, .2, .35, .75, .9, Q); P.washer(B, .2, 1.05, .8, 1.65, Q); B.lamp(.75, 1.1, 2.2, 2.2, .35);
  B.plant('shrub', .7, 5.6, .5, Q); B.plant('capim', .55, 4.1, .6, Q);
  // pisos: casa, jardim/acesso, garagem
  B.box(M.porcelanato, A, 0, -.04, U, S, F); B.box(M.porcelanato, A, S, -.04, R, KW, F); B.floor(A, 0, U, S, F); B.floor(A, S, R, KW, F);
  B.box(M.grama, U, 0, -.04, KD, .7, .06); B.box(M.grama, U, 2.9, -.04, KD, S, .06); B.grassRect(U + .05, 2.95, KD - .05, S - .05, 3); B.grassRect(U + .05, .05, KD - .3, .65, 3);
  B.box(M.concreto, U, .7, -.04, KD, 2.9, .05); B.floor(U, 0, KD, S, .05);
  B.box(M.paverEscuro, R, S, -.04, KD, KW, .04); B.floor(R, S, KD, KW, .05);
  // laje + platibanda
  B.box(M.branco, A, 0, 2.8, U, S, 2.92); B.box(M.branco, A, S, 2.8, R, KW, 2.92);
  B.box(M.lajeTopo, A + .15, .15, 2.92, U - .15, S - .15, 2.94); B.box(M.lajeTopo, A + .15, S - .15, 2.92, R - .15, KW - .15, 2.94);
  parapet(B, W, A, 0, U, S, 2.92, 3.5, .15, 'nwe'); parapet(B, W, A, S, R, KW, 2.92, 3.5, .15, 'swe');
  B.box(W, R, S - .15, 2.92, U - .15, S, 3.5); B.box(M.rufo, R - .02, S - .17, 3.5, U - .13, S + .02, 3.525);
  // paredes e aberturas
  walls(B, W, [[A, 0, A + .15, KW], [A + .15, 0, U, .15], [A + .15, KW - .15, R, KW], [R - .15, S, R, KW - .15], [A + .15, S - .15, U, S], [U - .15, .15, U, S - .15],
    [3.8, .15, 3.95, 1.85], [A + .15, 1.7, 3.8, 1.85]], F, 2.8, [
    slide([U - .15, .7, U, 2.9], F, 2.2), win([6.0, S - .15, 7.4, S], F, 1.0, 2.1), door([8.2, S - .15, 9.0, S], 'r', 'n', F, 2.1, { mat: M.madeira }),
    win([R - .15, 4.4, R, 5.8], F, 1.0, 2.1), win([A, .5, A + .15, 1.2], F, 1.8, 2.4), door([A, 2.25, A + .15, 3.05], 't', 'e', F), win([A, 4.4, A + .15, 6.0], F, 1.4, 2.2),
    door([2.6, 1.7, 3.3, 1.85], 'l', 'n', F), door([3.0, S - .15, 3.8, S], 'l', 's', F)]);
  // fachada: moldura grafite, marquise, painel ripado
  for (const r of [[.58, .7], [2.9, 3.02]]) B.box(M.grafite, U, r[0], F, U + .12, r[1], 2.42);
  B.box(M.grafite, U, .58, 2.3, U + .12, 3.02, 2.42); B.box(M.grafite, U, .5, 2.42, U + .7, 3.1, 2.5); B.box(M.led, U + .14, .8, 2.4, U + .18, 2.8, 2.42);
  B.box(M.madeira, U, 3.04, F, U + .02, S, 2.95); slats(B, M.madeira, 'v', 3.06, S - .02, U + .02, U + .07, F, 2.95, .045, .04);
  // vaga coberta 5,30 × 3,40: laje em balanço + pilar metálico + fita de LED
  B.box(M.grafite, R, S, 2.5, KD - .1, KW, 2.62); B.box(M.rufo, R, S - .02, 2.62, KD - .08, KW, 2.64); B.box(M.preto, KD - .25, KW - .2, 0, KD - .1, KW - .05, 2.5); B.col(KD - .25, KW - .2, KD - .1, KW - .05, 0, 2.5);
  B.box(M.led, R + .3, S + .02, 2.47, KD - .4, S + .07, 2.5); B.lamp(7.8, 5.3, 2.4, 3.2, .5); B.lamp(KD - .3, 1.8, 2.3, 2.2, .4);
  B.box(M.grafite, KD - .25, .05, 0, KD - .05, .55, 1.1); B.box(M.branco, KD - .05, .15, .62, KD - .035, .45, .86); B.col(KD - .25, .05, KD - .05, .55, 0, 1.1);
  B.plant('shrub', 10.0, 3.25, .45); B.plant('capim', 9.75, .35, .7);
  if (ci >= 0) P.car(B, 7.85, 5.3, 180, ci);
  // interior: sala/cozinha, banho, quarto
  P.fridge(B, 4.0, .2, 4.65, .85, F); P.counter(B, 4.65, .17, 6.9, .77, F); P.sinkTop(B, 5.2, .47, F + .9); P.cooktop(B, 6.3, .47, F + .9); P.upper(B, 4.65, .17, 6.9, .5, F);
  P.dining(B, 4.2, 2.5, 5.1, 3.2, F, false); P.sofa(B, 6.6, 2.6, 8.4, 3.43, 's', F); P.rug(B, 6.5, 1.1, 8.7, 2.45, F); P.tv(B, 7.1, .17, 8.5, .45, F);
  P.showerGlass(B, 2.55, .15, 2.57, 1.15, F); P.wc(B, 2.9, .28, 0, 1, F); P.vanity(B, 3.3, .2, 3.75, .65, F);
  P.bed(B, 1.7, 4.2, 3.7, 5.9, 'w', F); P.wardrobe(B, 1.7, 6.3, 3.9, 6.83, F);
  for (const [u, v] of [[7.5, 1.8], [5.2, 1.4], [3.3, 5.2], [2.7, .9], [2.6, 2.65]]) P.ceilLamp(B, u, v, 2.8);
  P.caixa(B, 3.3, 5.2, 2.94);
  B.label('Kitnet ' + n + ' · 41 m²', 6, 3.5, 3.9, 'k');
}

export function site(B) {
  B.frame(0, 0);
  const G = .03, SW = .1, CB = M.rebocoCinza;
  B.box(M.terra, -.15, 0, -2.2, 34.15, 80.15, -1.6); B.box(M.terra, -.15, 0, -1.6, 34.15, 62, -.04);
  // vias em paver: servidão em L (entrada), rua central, rua transversal
  B.box(M.paver, 0, 0, -.04, 6, 12, 0); B.box(M.paver, 6, 6, -.04, 21.5, 12, 0); B.box(M.paver, 11.5, 12, -.04, 21.5, 54, 0); B.box(M.paver, 0, 54, -.04, 33, 60, 0);
  // calçadas + meio-fio
  for (const r of [[10.5, 12, 11.5, 54], [21.5, 6, 22.5, 54], [0, 60, 33, 62]]) { B.box(M.concreto, r[0], r[1], -.04, r[2], r[3], SW); B.floor(r[0], r[1], r[2], r[3], SW); }
  for (const r of [[11.36, 12, 11.5, 54], [21.5, 6, 21.64, 54], [0, 60, 33, 60.14], [6, 2.8, 6.14, 6], [6.14, 5.86, 12.8, 6], [0, 12, 10.5, 12.14], [22.5, 5.86, 33, 6]]) B.box(CB, r[0], r[1], -.04, r[2], r[3], SW + .015);
  B.box(M.grama, 33, 0, -.04, 34, 80, G); B.box(M.cercaViva, 33.25, .2, 0, 33.8, 79.9, 1.6); B.hedges.push([33.2, .2, 33.85, 79.9, 1.7]); B.col(33, 0, 34, 80, 0, 2);
  // kitnets: K1–K6 à esquerda (frente para leste), K7–K12 à direita (espelhadas, frente para oeste)
  const cars = [[0, 2, -1, 4, 1, 3], [1, -1, 3, 0, 2, 4]];
  for (let i = 0; i < NK; i++) { B.frame(0, K0 + i * KW); kitnet(B, i + 1, cars[0][i]); }
  for (let i = 0; i < NK; i++) { B.frame(33 - KD, K0 + i * KW, KD); kitnet(B, i + 7, cars[1][i]); }
  B.frame(0, 0);
  // fecho das últimas unidades junto à rua transversal: muro do quintal + mureta da vaga
  const yt = K0 + NK * KW;
  for (const [a, b] of [[0, 1.5], [31.5, 33]]) { walls(B, M.reboco, [[a, yt - .12, b, yt]], 0, 2.0); B.box(M.rufo, a, yt - .14, 2.0, b, yt + .02, 2.03); }
  for (const [a, b] of [[5.2, 10.3], [22.7, 27.8]]) { walls(B, M.grafite, [[a, yt - .12, b, yt]], 0, 1.0); }
  // faixa de entrada: vagas de visitantes, portaria, abrigo de lixo e bicicletário
  B.box(M.grama, 6, 0, -.04, 22.5, 6, G); B.box(M.grama, 22.5, 0, -.04, 33, 12, G); B.grassRect(22.8, 6.2, 32.8, 11.8, 1);
  B.box(M.paverEscuro, 13.5, 1, -.04, 21, 6, G + .008); for (const x of [16, 18.5]) B.box(M.branco, x - .03, 1.2, G, x + .03, 6, G + .012);
  B.box(CB, 13.5, .86, -.04, 21, 1, SW); P.car(B, 14.75, 3.5, 90, 3); P.car(B, 19.75, 3.4, 90, 1);
  B.grassRect(6.4, 3.0, 13.2, 5.6, 1); B.grassRect(22.8, .3, 32.8, 5.6, 1);
  // portaria + pórtico + portão
  walls(B, M.reboco, [[6.3, .4, 8.5, .55], [6.3, 2.45, 8.5, 2.6], [6.3, .55, 6.45, 2.45], [8.35, .55, 8.5, 2.45]], .1, 2.6,
    [win([6.3, .9, 6.45, 2.1], .1, .9, 2.1), win([6.9, .4, 7.9, .55], .1, .9, 2.1), door([7.3, 2.45, 8.1, 2.6], 'l', 's', .1)]);
  B.box(M.porcelanato, 6.3, .4, -.04, 8.5, 2.6, .1); B.floor(6.45, .55, 8.35, 2.45, .1); B.box(M.grafite, 5.95, .1, 2.6, 8.8, 2.95, 2.75); B.box(M.rufo, 5.93, .08, 2.75, 8.82, 2.97, 2.77);
  P.counter(B, 6.5, .6, 7.0, 2.0, .1, .75, M.madeiraClara); P.ceilLamp(B, 7.4, 1.5, 2.6);
  B.box(M.grafite, 0, .3, 0, .3, .7, 3.5); B.box(M.grafite, 5.65, .3, 0, 5.95, .7, 3.5); B.box(M.grafite, 0, .3, 3.2, 6.3, .7, 3.5); B.col(0, .3, .3, .7, 0, 3.5); B.col(5.65, .3, 5.95, .7, 0, 3.5);
  B.box(M.led, .3, .48, 3.17, 5.65, .52, 3.2); B.lamp(3, .5, 3.1, 5, .8);
  for (const x of [.32, 5.6]) { slats(B, M.preto, 'v', .75, 3.4, x, x + .03, .08, 1.9, .03, .09); B.box(M.preto, x, .72, 1.9, x + .04, 3.42, 1.95); B.box(M.preto, x, .72, .05, x + .04, 3.42, .1); }
  B.box(M.concreto, 9.0, .3, -.04, 12.8, 2.9, SW); B.floor(9.0, .3, 12.8, 2.9, SW); B.box(M.concreto, 9.6, 2.9, -.04, 10.6, 5.86, SW); B.floor(9.6, 2.9, 10.6, 5.86, SW);
  walls(B, M.grafite, [[9.2, .5, 11.4, .65], [9.2, .65, 9.35, 2.5], [11.25, .65, 11.4, 2.5]], SW, 1.9); B.box(M.grafite, 9.1, .4, 1.9, 11.5, 2.6, 2.0); B.box(M.rufo, 9.08, .38, 2.0, 11.52, 2.62, 2.02);
  B.box(M.lixoAzul, 9.5, .8, SW, 10.15, 1.5, 1.15); B.box(M.lixoVerde, 10.4, .8, SW, 11.05, 1.5, 1.15); B.col(9.5, .8, 11.05, 1.5, 0, 1.2);
  for (const x of [11.7, 12.05, 12.4]) { B.box(M.inox, x, .6, SW, x + .04, .64, .9); B.box(M.inox, x, 2.3, SW, x + .04, 2.34, .9); B.box(M.inox, x, .6, .86, x + .04, 2.34, .9); }
  // praça (à direita da entrada, em frente a K7)
  B.box(M.concreto, 24.6, 1.4, -.04, 31.6, 5.2, SW); B.floor(24.6, 1.4, 31.6, 5.2, SW); B.box(M.concreto, 22.5, 2.8, -.04, 24.6, 3.8, SW); B.floor(22.5, 2.8, 24.6, 3.8, SW);
  P.pergola(B, 26.2, 1.6, 30.4, 5.0, 2.5, 'u', .55); P.bench(B, 26.6, 1.75, 28.4, 2.2, SW); P.bench(B, 28.2, 4.4, 30.0, 4.85, SW);
  B.lamp(28.3, 3.3, 2.4, 4, .7); B.box(M.led, 26.3, 3.28, 2.46, 30.3, 3.32, 2.5);
  for (const [x, y] of [[25.1, 1.9], [25.1, 4.7], [31.1, 1.9], [31.1, 4.7]]) { B.box(M.grama, x - .45, y - .45, SW, x + .45, y + .45, SW + .05); B.plant('shrub', x, y, .55, SW); }
  // muros
  walls(B, M.bloco, [[-.15, 0, 0, 80.15], [0, 80, 34.15, 80.15]], 0, 2.2);
  B.box(CB, -.18, 0, 2.2, .03, 80.15, 2.25); B.box(CB, 0, 79.97, 2.2, 34.15, 80.18, 2.25);
  for (let y = 1; y < 80; y += 3) B.box(CB, -.2, y - .1, 0, .05, y + .1, 2.25);
  for (let x = 2; x < 34; x += 3) B.box(CB, x - .1, 79.95, 0, x + .1, 80.2, 2.25);
  walls(B, M.blocoVelho, [[34, -100, 34.15, 80.15]], 0, 2.8);
  for (let y = -99; y < 80; y += 3) B.box(M.concreto, 34.02, y, 2.8, 34.12, y + .1, 3.5);
  for (let i = 0; i < 5; i++) B.box(M.metal, 34.065, -100, 2.92 + i * .13, 34.075, 80, 2.93 + i * .13);
  walls(B, M.reboco, [[6, -.15, 34, 0]], 0, 2.1); B.box(M.rufo, 6, -.17, 2.1, 34, .02, 2.13);
  // postes
  P.post(B, .5, 6, 1, 0); P.post(B, 12.9, 5.4, 0, 1);
  for (const y of [19.5, 33.5, 47.5]) P.post(B, 11.0, y, 1, 0);
  for (const y of [26.5, 40.5]) P.post(B, 22.0, y, -1, 0);
  for (const x of [4, 12.4, 20.6, 29]) P.post(B, x, 61.6, 0, -1);
  // árvores e arbustos da faixa de entrada
  for (const [x, y, s] of [[7.4, 4.4, .75], [22.9, .9, .8], [32.2, .8, .9], [32.2, 5.2, .75], [24.0, 5.3, .6]]) { B.plant('tree', x, y, s, G); B.col(x - .2, y - .2, x + .2, y + .2, 0, 2); }
  const r = rng(77);
  for (let i = 0; i < 10; i++) { const x = 6.6 + r() * 2.6, y = 3.0 + r() * 2.5; if (Math.hypot(x - 7.4, y - 4.4) > .9) B.plant(r() < .5 ? 'shrub' : 'capim', x, y, .5 + r() * .4, G); }
  // rótulos
  B.label('Servidão / acesso (6 m)', 3, 8, .6); B.label('Rua central (10 m + calçadas de 1 m)', 16.5, 33, .6); B.label('Rua dos lotes (6 m)', 16.5, 57, .6);
  B.label('Praça', 28.3, 3.3, 3.3); B.label('Portaria', 7.4, 1.5, 3.4); B.label('Abrigo de lixo', 10.3, 1.5, 2.5); B.label('Bicicletário', 12.1, 1.5, 1.4);
  B.label('Vagas de visitantes', 17.25, 3.5, 1.4); B.label('Muro novo · divisa com a soja', 0, 40, 2.9); B.label('Muro do vizinho (existente)', 34, 30, 3.9);
  entorno(B);
}
