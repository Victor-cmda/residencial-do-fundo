// Implantação (x = 0..34 oeste→leste ; y = d − 100 = 0..80 norte→sul), kitnets e entorno
import * as THREE from 'three';
import { M, rng } from './tex.js';
import { walls, win, slide, door, parapet, slats } from './geo.js';
import * as P from './props.js';

export const RET = { x: 19.5, y: 8, r: 7, ri: 1.5 };

export function kitnet(B, n, ci) {
  // módulo 9 × 6: u = 0 (fundo) → 9 (rua) ; v = 0..6.  Casa em L: ala 8,00 × 3,25 + bloco 4,00 × 2,75 = 37,00 m²
  const F = .1, W = M.reboco;
  B.box(M.grama, 8, 0, -.04, 9, .6, .06); B.box(M.grama, 8, 2.6, -.04, 9, 3.25, .06); B.grassRect(8.05, 2.65, 8.95, 3.2, 3); B.grassRect(8.05, .05, 8.7, .55, 3);
  B.box(M.concreto, 8, .6, -.04, 9, 2.6, .05); B.box(M.paverEscuro, 4, 3.25, -.04, 9, 6, .04); B.floor(8, 0, 9, 3.25, .05); B.floor(4, 3.25, 9, 6, .05);
  B.box(M.porcelanato, 0, 0, -.04, 8, 3.25, F); B.box(M.porcelanato, 0, 3.25, -.04, 4, 6, F); B.floor(0, 0, 8, 3.25, F); B.floor(0, 3.25, 4, 6, F);
  B.box(M.branco, 0, 0, 2.8, 8, 3.25, 2.92); B.box(M.branco, 0, 3.25, 2.8, 4, 6, 2.92); B.box(M.lajeTopo, .15, .15, 2.92, 7.85, 3.1, 2.94); B.box(M.lajeTopo, .15, 3.1, 2.92, 3.85, 5.85, 2.94);
  parapet(B, W, 0, 0, 8, 3.25, 2.92, 3.5, .15, 'nwe'); parapet(B, W, 0, 3.25, 4, 6, 2.92, 3.5, .15, 'swe'); B.box(W, 4, 3.1, 2.92, 7.85, 3.25, 3.5); B.box(M.rufo, 3.98, 3.08, 3.5, 7.87, 3.27, 3.525);
  walls(B, W, [[0, 0, .15, 6], [.15, 0, 8, .15], [.15, 5.85, 4, 6], [3.85, 3.25, 4, 5.85], [.15, 3.1, 8, 3.25], [7.85, .15, 8, 3.1], [2.45, .15, 2.6, 1.5], [.15, 1.5, 2.6, 1.65], [1.6, 1.65, 1.75, 3.1]], F, 2.8, [
    slide([7.85, .6, 8, 2.6], F, 2.2), win([5.0, 3.1, 6.4, 3.25], F, 1.0, 2.1), door([6.9, 3.1, 7.7, 3.25], 'r', 'n', F, 2.1, { mat: M.madeira }), win([3.85, 4.2, 4, 5.4], F, 1.0, 2.1),
    win([0, .5, .15, 1.1], F, 1.8, 2.4), win([0, 2.0, .15, 2.8], F, 1.6, 2.2), win([0, 4.0, .15, 5.2], F, 1.5, 2.2),
    door([1.8, 1.5, 2.5, 1.65], 'l', 'n', F), door([1.6, 2.1, 1.75, 2.8], 't', 'w', F), door([2.7, 3.1, 3.5, 3.25], 'l', 's', F)]);
  // fachada: moldura grafite, marquise, painel ripado
  for (const r of [[.48, .6], [2.6, 2.72]]) B.box(M.grafite, 8, r[0], F, 8.12, r[1], 2.42);
  B.box(M.grafite, 8, .48, 2.3, 8.12, 2.72, 2.42); B.box(M.grafite, 8, .4, 2.42, 8.7, 2.8, 2.5); B.box(M.led, 8.14, .7, 2.4, 8.18, 2.5, 2.42);
  B.box(M.madeira, 8, 2.74, F, 8.02, 3.25, 2.95); slats(B, M.madeira, 'v', 2.76, 3.24, 8.02, 8.07, F, 2.95, .045, .04);
  // vaga coberta 2,75 × 5,00: laje em balanço + pilar metálico + fita de LED
  B.box(M.grafite, 4, 3.25, 2.5, 8.6, 6, 2.62); B.box(M.rufo, 4, 3.23, 2.62, 8.62, 6, 2.64); B.box(M.preto, 8.45, 5.8, 0, 8.6, 5.95, 2.5); B.col(8.45, 5.8, 8.6, 5.95, 0, 2.5);
  B.box(M.led, 4.3, 3.27, 2.47, 8.3, 3.32, 2.5); B.lamp(6.3, 4.6, 2.4, 3.2, .5); B.lamp(8.4, 1.6, 2.3, 2.2, .4);
  B.box(M.grafite, 8.75, .05, 0, 8.95, .55, 1.1); B.box(M.branco, 8.95, .15, .62, 8.965, .45, .86); B.col(8.75, .05, 8.95, .55, 0, 1.1);
  B.plant('shrub', 8.5, 2.95, .45); B.plant('capim', 8.35, .3, .7);
  if (ci >= 0) P.car(B, 6.5, 4.62, 180, ci);
  // interior: sala/cozinha, banho, área de serviço, quarto
  P.fridge(B, 2.65, .2, 3.3, .85, F); P.counter(B, 3.35, .17, 5.6, .77, F); P.sinkTop(B, 3.9, .47, F + .9); P.cooktop(B, 4.95, .47, F + .9); P.upper(B, 3.35, .17, 5.6, .5, F);
  P.dining(B, 3.7, 2.25, 4.6, 2.95, F, false); P.sofa(B, 4.95, 2.25, 6.75, 3.08, 's', F); P.rug(B, 5.0, 1.0, 6.9, 2.2, F); P.tv(B, 6.0, .17, 7.4, .45, F);
  P.showerGlass(B, 1.05, .15, 1.07, 1.5, F); P.wc(B, 1.5, .28, 0, 1, F); P.vanity(B, 2.0, .2, 2.42, .65, F);
  P.tank(B, .2, 1.7, .75, 2.3, F); P.washer(B, .2, 2.4, .8, 3.0, F);
  P.bed(B, .2, 4.2, 2.1, 5.6, 'w', F); P.wardrobe(B, .2, 3.27, 2.4, 3.82, F);
  for (const [u, v] of [[5.6, 1.7], [3.2, 1.5], [2.0, 4.6], [1.5, .8], [.9, 2.4]]) P.ceilLamp(B, u, v, 2.8);
  P.caixa(B, 1.6, 4.6, 2.94);
  B.label('Kitnet ' + n + ' · 37 m²', 6, 3, 3.9, 'k');
}

export function site(B) {
  B.frame(0, 0);
  const PAV = 0, G = .03, SW = .1;
  B.box(M.terra, -.15, 0, -2.2, 34.15, 80.15, -1.6); B.box(M.terra, -.15, 0, -1.6, 34.15, 62, -.04);
  for (const r of [[6, 0, 15, 20], [24, 0, 33, 14], [15, 0, 24, 10]]) { B.box(M.grama, r[0], r[1], -.04, r[2], r[3], G); B.grassRect(r[0] + .2, r[1] + .2, r[2] - .2, r[3] - .2, 1); }
  B.box(M.paver, 0, 0, -.04, 6, 56, PAV); B.box(M.paver, 0, 56, -.04, 33, 62, PAV); B.box(M.paver, 15, 10, -.04, 24, 56, PAV);
  B.ring(M.paver, RET.x, RET.y, 0, RET.r, -.04, G + .005, null, 64);
  const inMouth = (x, y) => !(x > 15 && x < 24 && y > 10);
  B.ring(M.rebocoCinza, RET.x, RET.y, RET.r, RET.r + .14, -.04, .12, inMouth, 96);
  B.ring(M.rebocoCinza, RET.x, RET.y, RET.ri, RET.ri + .12, -.04, .16, null, 40); B.ring(M.grama, RET.x, RET.y, 0, RET.ri, 0, .13, null, 32);
  B.col(RET.x - 1.1, RET.y - 1.1, RET.x + 1.1, RET.y + 1.1, 0, 1); B.plant('palm', RET.x, RET.y, 1.15, .13);
  for (let i = 0; i < 6; i++) B.plant('capim', RET.x + Math.cos(i * 1.05) * .95, RET.y + Math.sin(i * 1.05) * .95, .8, .13);
  // calçadas + meio-fio
  for (const r of [[15, 15.5, 16.5, 56], [22.5, 15.5, 24, 56], [0, 60.8, 33, 62]]) { B.box(M.concreto, r[0], r[1], -.04, r[2], r[3], SW); B.floor(r[0], r[1], r[2], r[3], SW); }
  for (const r of [[16.5, 15.5, 16.64, 56], [22.36, 15.5, 22.5, 56], [0, 60.66, 33, 60.8], [6, 2.8, 6.14, 13.5], [6, 18.5, 6.14, 20], [6, 50, 6.14, 56], [6.14, 55.86, 15, 56],
    [14.86, 13.4, 15, 20], [24, 13.4, 24.14, 14], [15, 15.36, 16.5, 15.5], [22.5, 15.36, 24, 15.5]]) B.box(M.rebocoCinza, r[0], r[1], -.04, r[2], r[3], SW + .015);
  B.box(M.grama, 33, 0, -.04, 34, 80, G); B.box(M.cercaViva, 33.25, .2, 0, 33.8, 79.9, 1.6); B.hedges.push([33.2, .2, 33.85, 79.9, 1.7]); B.col(33, 0, 34, 80, 0, 2);
  // vagas de visitantes
  B.box(M.paverEscuro, 6.14, 13.5, -.04, 11, 18.5, G + .008); B.box(M.branco, 6.14, 15.97, G, 11, 16.03, G + .012); P.car(B, 8.6, 14.75, 0, 3);
  // kitnets
  for (let i = 0; i < 5; i++) { B.frame(6, 20 + i * 6); kitnet(B, i + 1, [0, 2, -1, 4, 1][i]); }
  for (let i = 0; i < 7; i++) { B.frame(24, 14 + i * 6, 9); kitnet(B, i + 6, [1, -1, 3, 0, 2, -1, 4][i]); }
  B.frame(0, 0);
  // praça
  B.box(M.concreto, 6.14, 50, -.04, 15, 55.86, SW); B.floor(6, 50, 15, 56, SW);
  P.pergola(B, 9.4, 51, 13.6, 54.6, 2.5, 'v', .55); P.bench(B, 9.8, 51.3, 11.6, 51.75, SW); P.bench(B, 11.4, 53.85, 13.2, 54.3, SW);
  for (const [x, y] of [[14.25, 51.1], [14.25, 54.9]]) { B.box(M.grama, x - .55, y - .55, SW, x + .55, y + .55, SW + .05); B.plant('tree', x, y, .62, SW); B.col(x - .15, y - .15, x + .15, y + .15, 0, 2); }
  B.plant('shrub', 8.9, 55.2, .7, SW); B.plant('shrub', 9.0, 53.2, .5, SW); B.lamp(11.5, 52.8, 2.4, 4, .7); B.box(M.led, 9.5, 52.78, 2.46, 13.5, 52.82, 2.5);
  walls(B, M.grafite, [[6.3, 50.4, 8.5, 50.55], [6.3, 50.55, 6.45, 52.4], [8.35, 50.55, 8.5, 52.4]], SW, 1.9); B.box(M.grafite, 6.2, 50.3, 1.9, 8.6, 52.5, 2.0); B.box(M.rufo, 6.18, 50.28, 2.0, 8.62, 52.52, 2.02);
  B.box(M.lixoAzul, 6.6, 50.7, SW, 7.25, 51.4, 1.15); B.box(M.lixoVerde, 7.5, 50.7, SW, 8.15, 51.4, 1.15); B.col(6.6, 50.7, 8.15, 51.4, 0, 1.2);
  for (const x of [6.7, 7.2, 7.7, 8.2]) { B.box(M.inox, x, 53.6, SW, x + .04, 53.64, .9); B.box(M.inox, x, 55.3, SW, x + .04, 55.34, .9); B.box(M.inox, x, 53.6, .86, x + .04, 55.34, .9); }
  // portaria + pórtico
  walls(B, M.reboco, [[6.3, .4, 8.5, .55], [6.3, 2.45, 8.5, 2.6], [6.3, .55, 6.45, 2.45], [8.35, .55, 8.5, 2.45]], .1, 2.6,
    [win([6.3, .9, 6.45, 2.1], .1, .9, 2.1), win([6.9, .4, 7.9, .55], .1, .9, 2.1), door([7.3, 2.45, 8.1, 2.6], 'l', 's', .1)]);
  B.box(M.porcelanato, 6.3, .4, -.04, 8.5, 2.6, .1); B.floor(6.45, .55, 8.35, 2.45, .1); B.box(M.grafite, 5.95, .1, 2.6, 8.8, 2.95, 2.75); B.box(M.rufo, 5.93, .08, 2.75, 8.82, 2.97, 2.77);
  P.counter(B, 6.5, .6, 7.0, 2.0, .1, .75, M.madeiraClara); P.ceilLamp(B, 7.4, 1.5, 2.6);
  B.box(M.grafite, 0, .3, 0, .3, .7, 3.5); B.box(M.grafite, 5.65, .3, 0, 5.95, .7, 3.5); B.box(M.grafite, 0, .3, 3.2, 6.3, .7, 3.5); B.col(0, .3, .3, .7, 0, 3.5); B.col(5.65, .3, 5.95, .7, 0, 3.5);
  B.box(M.led, .3, .48, 3.17, 5.65, .52, 3.2); B.lamp(3, .5, 3.1, 5, .8);
  for (const x of [.32, 5.6]) { slats(B, M.preto, 'v', .75, 3.4, x, x + .03, .08, 1.9, .03, .09); B.box(M.preto, x, .72, 1.9, x + .04, 3.42, 1.95); B.box(M.preto, x, .72, .05, x + .04, 3.42, .1); }
  // muros
  walls(B, M.bloco, [[-.15, 0, 0, 80.15], [0, 80, 34.15, 80.15]], 0, 2.2);
  B.box(M.rebocoCinza, -.18, 0, 2.2, .03, 80.15, 2.25); B.box(M.rebocoCinza, 0, 79.97, 2.2, 34.15, 80.18, 2.25);
  for (let y = 1; y < 80; y += 3) B.box(M.rebocoCinza, -.2, y - .1, 0, .05, y + .1, 2.25);
  for (let x = 2; x < 34; x += 3) B.box(M.rebocoCinza, x - .1, 79.95, 0, x + .1, 80.2, 2.25);
  walls(B, M.blocoVelho, [[34, -100, 34.15, 80.15]], 0, 2.8);
  for (let y = -99; y < 80; y += 3) B.box(M.concreto, 34.02, y, 2.8, 34.12, y + .1, 3.5);
  for (let i = 0; i < 5; i++) B.box(M.metal, 34.065, -100, 2.92 + i * .13, 34.075, 80, 2.93 + i * .13);
  walls(B, M.reboco, [[6, -.15, 34, 0]], 0, 2.1); B.box(M.rufo, 6, -.17, 2.1, 34, .02, 2.13);
  // postes
  for (const y of [6, 20, 34, 48]) P.post(B, .5, y, 1, 0);
  for (const y of [20, 34, 48]) P.post(B, 23.6, y, -1, 0);
  for (const y of [27, 41]) P.post(B, 15.4, y, 1, 0);
  for (const x of [4, 12.4, 20.6, 29]) P.post(B, x, 61.6, 0, -1);
  P.post(B, 13.0, 4.2, 1, 0);
  // árvores das áreas verdes
  for (const [x, y, s] of [[7.6, 5.5, 1.1], [10.6, 3.6, .9], [8.2, 9.8, 1.0], [11.3, 8.6, .7], [13.4, 17.4, .85], [12.4, 14.4, .6],
  [28.2, 3.2, 1.15], [31.2, 6.6, 1.0], [29.0, 10.6, 1.1], [31.6, 2.4, .7], [26.6, 1.6, .7], [31.8, 12.2, .7]]) { B.plant('tree', x, y, s, G); B.col(x - .2, y - .2, x + .2, y + .2, 0, 2); }
  const r = rng(77);
  for (let i = 0; i < 26; i++) { const a = r() < .5; const x = a ? 6.6 + r() * 7.8 : 24.6 + r() * 8, y = a ? .8 + r() * 12 : .8 + r() * 12.4; if (Math.hypot(x - RET.x, y - RET.y) > RET.r + .5 && !(x > 6 && x < 9 && y < 3)) B.plant(r() < .5 ? 'shrub' : 'capim', x, y, .5 + r() * .5, G); }
  // rótulos
  B.label('Servidão de paver (6 m)', 3, 30, .6); B.label('Rua central (9 m)', 19.5, 38, .6); B.label('Rua dos lotes (6 m)', 16.5, 58.6, .6); B.label('Retorno Ø 14 m', 19.5, 8, 4.5);
  B.label('Praça', 11.5, 52.8, 3.3); B.label('Portaria', 7.4, 1.5, 3.4); B.label('Abrigo de lixo', 7.4, 51.4, 2.5); B.label('Bicicletário', 7.4, 54.5, 1.4);
  B.label('Muro novo · divisa com a soja', 0, 40, 2.9); B.label('Muro do vizinho (existente)', 34, 30, 3.9); B.label('Vagas de visitantes', 8.5, 16, 1.2);
  entorno(B);
}

function entorno(B) {
  B.frame(0, 0); const r = rng(5);
  B.box(M.terra, -600, -600, -.5, 600, 600, -.07);
  B.box(M.soja, -500, 0, -.07, -.2, 500, .5); B.box(M.soja, -.2, 80.2, -.07, 500, 500, .5); B.box(M.soja, 78, -100, -.07, 500, 80.2, .5);
  B.col(-600, -600, -.2, 600); B.col(-.2, 80.15, 600, 600);
  // área do proprietário (0–100 m): permanece — volumes simples, paver e muitas árvores
  B.box(M.grama, 0, -100, -.07, 34, -.15, -.01); B.box(M.paver, 0, -100, -.07, 5, 0, .0);
  const bld = [[10, -90, 22, -79, 3.2], [12, -64, 24, -52, 3.0], [9, -44, 15, -20, 2.8], [20, -36, 26, -30, 2.6]];
  for (const b of bld) { B.box(M.reboco, b[0], b[1], 0, b[2], b[3], b[4]); B.box(M.shingle, b[0] - .5, b[1] - .5, b[4], b[2] + .5, b[3] + .5, b[4] + .25); B.col(b[0], b[1], b[2], b[3], 0, 4); }
  for (let i = 0; i < 4; i++) B.box(M.vidroEscuro, 11 + i * 2.6, -89, 3.46, 13.2 + i * 2.6, -84, 3.5);
  for (let i = 0; i < 70; i++) {
    const x = 6 + r() * 27, y = -98 + r() * 95; if (bld.some(b => x > b[0] - 1.5 && x < b[2] + 1.5 && y > b[1] - 1.5 && y < b[3] + 1.5)) continue;
    B.plant(r() < .22 ? 'banana' : (r() < .2 ? 'palm' : 'tree'), x, y, .8 + r() * .7);
  }
  for (let i = 0; i < 12; i++) B.plant('banana', 7 + r() * 26, -14 + r() * 12, .8 + r() * .5);
  // avenida e outro lado
  B.box(M.terra, -600, -112, -.07, 600, -100, -.03);
  for (let i = 0; i < 40; i++) B.plant('tree', -150 + r() * 320, -118 - r() * 60, 1 + r() * .8);
  // vizinho da esquerda (casa e gramado) e lote vizinho da direita (terra + barracão comprido)
  B.box(M.grama, -90, -100, -.07, -.15, 0, -.02); walls(B, M.rebocoCinza, [[-.15, -100, 0, 0]], 0, 2.0);
  for (const b of [[-60, -85, -46, -72, 3.2], [-30, -70, -18, -50, 3.0], [-75, -60, -66, -40, 2.8]]) { B.box(M.reboco, b[0], b[1], 0, b[2], b[3], b[4]); B.box(M.shingle, b[0] - .5, b[1] - .5, b[4], b[2] + .5, b[3] + .5, b[4] + .3); }
  for (let i = 0; i < 16; i++) B.plant('tree', -88 + r() * 84, -98 + r() * 94, .9 + r() * .7);
  B.box(M.terra, 34.15, -100, -.07, 78, 80.2, -.0);
  B.box(M.rebocoCinza, 58, -70, 0, 66, 46, 3.2); B.box(M.metal, 57.6, -70.4, 3.2, 66.4, 46.4, 3.5);
  for (let i = 0; i < 9; i++) { const x = 38 + r() * 14, y = -60 + r() * 120; B.cyl(M.terra, x, y, 1.6 + r(), .3, 0, .5 + r() * .5, 9); }
  // torres de transmissão ao longe
  const tw = [[-190, 250], [-20, 300], [150, 350], [320, 400]];
  for (const [x, y] of tw) {
    for (const [a, b] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) B.add(M.metal, new THREE.CylinderGeometry(.12, .2, 38, 5), new THREE.Matrix4().makeTranslation(x + a * .55, 19, y + b * .55).multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(b * .025, 0, -a * .025))));
    for (const z of [8, 16, 24, 30]) { const w = 3.2 - z * .07; B.box(M.metal, x - w, y - w, z, x + w, y - w + .1, z + .1); B.box(M.metal, x - w, y + w - .1, z, x + w, y + w, z + .1); B.box(M.metal, x - w, y - w, z, x - w + .1, y + w, z + .1); B.box(M.metal, x + w - .1, y - w, z, x + w, y + w, z + .1); }
    for (const z of [30, 34, 38]) B.box(M.metal, x - 7, y - .15, z, x + 7, y + .15, z + .15);
  }
  for (let i = 0; i < tw.length - 1; i++) for (const z of [30, 34, 38]) for (const s of [-6.5, 6.5]) {
    const a = new THREE.Vector3(tw[i][0] + s, z - .3, tw[i][1]), b = new THREE.Vector3(tw[i + 1][0] + s, z - .3, tw[i + 1][1]), L = a.distanceTo(b);
    const m = new THREE.Matrix4().lookAt(a, b, new THREE.Vector3(0, 1, 0)).setPosition(a.clone().add(b).multiplyScalar(.5)); B.add(M.preto, new THREE.BoxGeometry(.06, .06, L), m);
  }
}
