// Sobrado OPÇÃO B (revisão 3) — mesmas cotas da prancha 07_sobrado_opcao_B.
// u = 0..8,25 (oeste→leste) ; v = 0..18 (rua→fundo) ; z = altura.
import * as THREE from 'three';
import { M } from '../../contexto-3d/maquete/src/tex.js';
import { walls, win, slide, door, vao, parapet, slats } from '../../contexto-3d/maquete/src/geo.js';
import * as P from '../../contexto-3d/maquete/src/props.js';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

const LW = 8.25, F = .15, U = 3.0;
function mat(name, color, rough = .8, metal = 0, extra = {}) {
  if (!M[name]) { const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra }); m.userData.tile = 1; m.name = name; M[name] = m; }
  return M[name];
}

// ------------------------------------------------------------------ decoração
const pot = (B, u, v, z, s = 1, kind = 'shrub') => { if (B.assets) { B.assets.push({ kind: 'pot', u, v, z, s, plant: kind }); return; } B.cyl(M.vaso, u, v, .12 * s, .17 * s, z, z + .36 * s, 14); B.plant(kind, u, v, (kind === 'banana' ? .3 : .5) * s, z + .3 * s); };
const picU = (B, u0, u1, v, side, z0, z1, m) => { B.box(M.preto, u0, v, z0, u1, v + side * .03, z1); B.box(m, u0 + .04, v + side * .03, z0 + .04, u1 - .04, v + side * .036, z1 - .04); };
const picV = (B, v0, v1, u, side, z0, z1, m) => { B.box(M.preto, u, v0, z0, u + side * .03, v1, z1); B.box(m, u + side * .03, v0 + .04, z0 + .04, u + side * .036, v1 - .04, z1 - .04); };
const pendant = (B, u, v, ztop, drop = .9) => { B.cyl(M.preto, u, v, .006, .006, ztop - drop, ztop, 5); B.cyl(M.cobre, u, v, .13, .05, ztop - drop - .17, ztop - drop, 16); B.cyl(M.lampada, u, v, .05, .05, ztop - drop - .19, ztop - drop - .15, 10); };
const bedside = (B, u0, v0, z) => { B.box(M.madeiraClara, u0, v0, z, u0 + .42, v0 + .42, z + .45); B.cyl(M.preto, u0 + .21, v0 + .21, .05, .02, z + .45, z + .62, 8); B.cyl(M.abajur, u0 + .21, v0 + .21, .11, .08, z + .62, z + .8, 14); };
const floorLamp = (B, u, v, z) => { B.cyl(M.preto, u, v, .13, .13, z, z + .02, 14); B.cyl(M.preto, u, v, .012, .012, z, z + 1.45, 6); B.cyl(M.abajur, u, v, .18, .13, z + 1.4, z + 1.68, 16); };
function bookshelf(B, u0, v0, u1, v1, z, h) {
  const alongV = (v1 - v0) > (u1 - u0); B.box(M.madeiraClara, u0, v0, z, u1, v1, z + .04); B.box(M.madeiraClara, u0, v0, z + h - .04, u1, v1, z + h);
  if (alongV) { B.box(M.madeiraClara, u0, v0, z, u1, v0 + .03, z + h); B.box(M.madeiraClara, u0, v1 - .03, z, u1, v1, z + h); B.box(M.madeiraClara, u0, v0, z, u0 + .02, v1, z + h); }
  else { B.box(M.madeiraClara, u0, v0, z, u0 + .03, v1, z + h); B.box(M.madeiraClara, u1 - .03, v0, z, u1, v1, z + h); }
  const cols = [M.livro1, M.livro2, M.livro3, M.livro4, M.branco];
  for (let k = 1; k * .4 < h - .1; k++) {
    const zz = z + k * .4; if (alongV) B.box(M.madeiraClara, u0, v0, zz, u1, v1, zz + .025); else B.box(M.madeiraClara, u0, v0, zz, u1, v1, zz + .025);
    let a = (alongV ? v0 : u0) + .06, i = k * 3; const end = (alongV ? v1 : u1) - .08;
    while (a < end) { const w = .035 + ((i * 7) % 5) * .012, hh = .2 + ((i * 5) % 4) * .035; if ((i % 9) !== 7) { if (alongV) B.box(cols[i % 5], u0 + .05, a, zz + .025, u1 - .04, a + w, zz + .025 + hh); else B.box(cols[i % 5], a, v0 + .05, zz + .025, a + w, v1 - .04, zz + .025 + hh); } a += w + .004; i++; }
  }
  B.col(u0, v0, u1, v1, z, z + h);
}

// ------------------------------------------------------------------ carros (medidas de catálogo, aproximadas)
const CORSA = { nome: 'Chevrolet Corsa Hatch 2008', L: 3.82, W: 1.646, H: 1.432, wb: 2.491, fo: .78, R: .29, paint: 'corsaPrata',
  body: x => [[x + .22, .32], [x + .03, .36], [x, .52], [x + .05, .66], [x + .4, .76], [x + .95, .86], [.3, .9], [-x - .5, .92], [-x - .1, .9], [-x - .01, .72], [-x - .03, .42], [-x - .22, .32]],
  green: [[-.98, .84], [-.42, 1.36], [-.2, 1.41], [.9, 1.40], [1.25, 1.32], [1.62, .95], [1.55, .88]], roof: [[-.44, 1.37], [-.2, 1.425], [.9, 1.415], [1.27, 1.335]],
  pillars: [[-.98, .86, -.42, 1.37, .07], [.1, .9, .1, 1.4, .08], [1.62, .95, 1.25, 1.33, .13]], hl: [.66, .16, .36], tl: [.9, .34, .15], seams: [-.9, .1, 1.05], handles: [-.1, .85], cowl: -.96, belt: .9 };
const CERATO = { nome: 'Kia Cerato 2017', L: 4.56, W: 1.78, H: 1.445, wb: 2.70, fo: .88, R: .32, paint: 'ceratoBranco',
  body: x => [[x + .25, .32], [x + .03, .36], [x, .54], [x + .06, .68], [x + .55, .78], [x + 1.3, .9], [.4, .96], [-x - .9, .99], [-x - .15, .97], [-x - .01, .78], [-x - .03, .42], [-x - .25, .32]],
  green: [[-1.0, .88], [-.3, 1.38], [0, 1.425], [.75, 1.41], [1.05, 1.33], [1.5, .98], [1.4, .93]], roof: [[-.32, 1.39], [0, 1.44], [.75, 1.425], [1.07, 1.345]],
  pillars: [[-1.0, .9, -.3, 1.39, .07], [.25, .95, .25, 1.42, .09], [1.5, .98, 1.05, 1.34, .15]], hl: [.7, .12, .5], tl: [.87, .13, .62], seams: [-.95, .25, 1.2], handles: [.05, 1.0], cowl: -.98, belt: .95 };

function car2(B, s, u, v, rot) {
  if (B.assets && B.carFiles && B.carFiles[s.paint]) { B.assets.push({ kind: 'car', file: B.carFiles[s.paint], u, v, z: 0, L: s.L }); return; }
  const m = new THREE.Matrix4().makeTranslation(u, 0, v).multiply(new THREE.Matrix4().makeRotationY(rot * Math.PI / 180));
  const T = (x, y, z) => m.clone().multiply(new THREE.Matrix4().makeTranslation(x, y, z));
  const x0 = -s.L / 2, x1 = s.L / 2, xf = x0 + s.fo, xr = xf + s.wb, R = s.R, W = s.W, Wg = W - .26, paint = M[s.paint];
  const ext = (pts, w, bev) => { const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(p => new THREE.Vector2(p[0], p[1]))), { depth: w - 2 * bev, bevelEnabled: bev > 0, bevelThickness: bev, bevelSize: bev * .8, bevelSegments: 3 }); g.translate(0, 0, -(w - 2 * bev) / 2); g.deleteAttribute('uv'); return toCreasedNormals(g, .9); };
  const top = new THREE.SplineCurve(s.body(x0).map(p => new THREE.Vector2(p[0], p[1]))).getPoints(56).map(p => [p.x, p.y]);
  const arch = cx => { const a = []; for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12; a.push([cx + Math.cos(t) * (R + .055), .31 + Math.sin(t) * (R + .075)]); } return a; };
  B.add(paint, ext([...top, ...arch(xr), ...arch(xf)], W, .075), m);
  B.add(M.vidroEscuro, ext(s.green, Wg, .05), m);
  B.add(paint, ext([...s.roof, ...s.roof.slice().reverse().map(p => [p[0], p[1] - .05])], Wg + .035, .035), m);
  for (const [xa, ya, xb, yb, th] of s.pillars) for (const z of [-Wg / 2 + .012, Wg / 2 - .012])
    B.add(paint, new THREE.BoxGeometry(Math.hypot(xb - xa, yb - ya), th, .075), T((xa + xb) / 2, (ya + yb) / 2, z).multiply(new THREE.Matrix4().makeRotationZ(Math.atan2(yb - ya, xb - xa))));
  B.add(M.preto, new THREE.BoxGeometry(s.L - .55, .2, W - .32), T(0, .3, 0));
  for (const cx of [xf, xr]) for (const z of [-(W / 2 - .1), W / 2 - .1]) {
    const w = T(cx, R, z).multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    B.add(M.pneu, new THREE.CylinderGeometry(R, R, .2, 28), w); B.add(M.roda, new THREE.CylinderGeometry(R * .66, R * .66, .215, 20), w); B.add(M.preto, new THREE.CylinderGeometry(R * .2, R * .2, .225, 10), w);
    for (let k = 0; k < 5; k++) B.add(M.pneu, new THREE.BoxGeometry(R * .2, .222, R * .42), w.clone().multiply(new THREE.Matrix4().makeRotationY(k * Math.PI * .4 + .3)).multiply(new THREE.Matrix4().makeTranslation(0, 0, R * .42)));
  }
  for (const z of [-1, 1]) {
    B.add(M.farol, new THREE.BoxGeometry(.09, s.hl[1], s.hl[2]), T(x0 + .07, s.hl[0], z * (W / 2 - s.hl[2] / 2 - .07)));
    B.add(M.lanterna, new THREE.BoxGeometry(.08, s.tl[1], s.tl[2]), T(x1 - .05, s.tl[0], z * (W / 2 - s.tl[2] / 2 - .04)));
    B.add(paint, new THREE.BoxGeometry(.09, .1, .17), T(s.cowl + .12, s.belt + .08, z * (W / 2 + .06)));
    for (const x of s.seams) B.add(M.preto, new THREE.BoxGeometry(.012, s.belt - .44, .008), T(x, (s.belt + .4) / 2, z * (W / 2 + .001)));
    for (const x of s.handles) B.add(M.inox, new THREE.BoxGeometry(.11, .025, .02), T(x, s.belt - .1, z * (W / 2 + .004)));
  }
  B.add(M.preto, new THREE.BoxGeometry(.06, .09, W * .5), T(x0 + .025, .6, 0)); B.add(M.preto, new THREE.BoxGeometry(.06, .13, W * .62), T(x0 + .035, .43, 0));
  B.add(M.branco, new THREE.BoxGeometry(.02, .11, .4), T(x0 - .003, .5, 0)); B.add(M.branco, new THREE.BoxGeometry(.02, .11, .4), T(x1 + .003, .6, 0));
  const q = Math.abs(rot % 180) === 90, hx = (q ? W : s.L) / 2, hz = (q ? s.L : W) / 2; B.col(u - hx, v - hz, u + hx, v + hz, 0, 1.4);
}

// ------------------------------------------------------------------ casa
export function houseB(B) {
  B.frame(0, 0); B.caps = []; if (B.assets) B.carFiles = globalThis.CAR_FILES || {};
  const people = [[-1.6, -.6], [9.6, -3.2]]; void people;
  mat('vaso', 0xe9e4da, .7); mat('cobre', 0xb87333, .35, .9); mat('abajur', 0xf4ead6, .9, 0, { emissive: 0xffd9a0, emissiveIntensity: .15 }); mat('cortina', 0xe9e3d6, 1);
  mat('livro1', 0x7a2e2e, .9); mat('livro2', 0x2e4a6b, .9); mat('livro3', 0x3f6b4a, .9); mat('livro4', 0xc9a24a, .9);
  mat('quadro1', 0x9db3a6, .9); mat('quadro2', 0xd9a066, .9); mat('quadro3', 0x35506b, .9); mat('almofada1', 0xc8704a, 1); mat('almofada2', 0x4f6b5a, 1); mat('tecidoCinza', 0x6d7278, 1);
  mat('corsaPrata', 0xb4b9bf, .3, .75).envMapIntensity = 3.5; mat('ceratoBranco', 0xf1f2f4, .2, .35).envMapIntensity = 3.5; mat('roda', 0xc5c8cc, .3, .95).envMapIntensity = 3;
  const W = M.reboco, G = M.grafite;

  // ---------- entorno ----------
  B.box(M.grama, -40, -40, -.6, 48, 60, -.05); B.box(M.paver, -40, -7.2, -.05, 48, -1.2, 0); B.box(M.concreto, -40, -1.2, -.05, 48, 0, .1); B.floor(-40, -1.2, 48, 0, .1);
  B.box(M.rebocoCinza, -40, -1.34, -.05, 48, -1.2, .115); B.box(M.concreto, -40, -8.4, -.05, 48, -7.2, .1); B.box(M.cercaViva, -40, -9.3, 0, 48, -8.7, 1.5); B.hedges.push([-40, -9.35, 48, -8.65, 1.6]);
  B.box(M.soja, -40, 18.15, -.05, 48, 60, .5); B.box(M.soja, -40, 0, -.05, -.15, 18.15, .5);
  walls(B, M.bloco, [[-.15, 0, 0, 18.15], [0, 18, 8.4, 18.15]], 0, 2.2); B.box(M.rebocoCinza, -.18, 0, 2.2, .03, 18.15, 2.25); B.box(M.rebocoCinza, 0, 17.97, 2.2, 8.4, 18.18, 2.25);
  walls(B, W, [[8.25, 3, 8.4, 18]], 0, 2.0); B.box(M.rufo, 8.23, 3, 2.0, 8.42, 18, 2.03);
  for (const [x, y, s] of [[11, 1.5, .8], [14.5, 16, 1], [-6, -11, 1.1], [4, -11.5, 1], [13, -11, 1.2], [20, -10.5, .9], [-14, -10.8, 1]]) B.plant('tree', x, y, s);
  P.post(B, 9.2, -.6, 0, -1);

  // ---------- lote: frente, quintal ----------
  B.box(M.grama, 0, 0, -.3, LW, 18, .03); B.grassRect(.05, .1, .55, 2.9, 3); B.grassRect(1.95, .1, 2.35, 2.9, 3); B.grassRect(.1, 17.35, 6.2, 17.95, 3); B.grassRect(.1, 15.55, .75, 17.3, 3); B.grassRect(5.95, 15.55, 6.25, 17.3, 3);
  B.box(M.paver, 2.4, 0, 0, 8.1, 3, .04); B.box(M.concreto, .6, 0, 0, 1.9, 3, .05); B.box(M.porcelanato, 0, 3, 0, 2.4, 4.0, .12); B.floor(0, 3, 2.4, 4.0, .12);
  B.plant('tree', .3, 1.3, .4); B.plant('capim', 2.15, .6, .9); B.plant('capim', 2.15, 1.7, .8); B.plant('shrub', .3, 2.6, .5); pot(B, .35, 3.6, .12, 1.3, 'banana');
  B.box(M.deck, .8, 15.5, 0, 5.9, 17.3, .12); B.floor(.8, 15.5, 5.9, 17.3, .12);
  P.table(B, 2.4, 16.1, 3.9, 16.9, .12, .74, M.madeira); for (const u of [2.75, 3.55]) { P.chair(B, u, 15.92, 'n', .12, M.grafite); P.chair(B, u, 17.08, 's', .12, M.grafite); }
  P.sofa(B, 4.5, 15.9, 5.8, 16.7, 's', .12, M.tecidoCinza); pot(B, 1.15, 15.85, .12, 1.4, 'banana'); pot(B, 1.15, 16.95, .12, 1.1);
  B.plant('shrub', .4, 17.6, .7); B.plant('capim', 2, 17.65, 1); B.plant('capim', 3.4, 17.7, .9); B.plant('shrub', 5, 17.65, .6); B.plant('tree', .45, 16.2, .35); B.lamp(3.2, 16.4, 2.2, 4, .7);
  // lavanderia externa coberta
  B.box(M.concreto, 6.3, 15.5, 0, LW, 17.3, .1); B.floor(6.3, 15.5, LW, 17.3, .1); walls(B, W, [[6.3, 17.15, LW, 17.3]], 0, 2.5); B.box(W, 6.2, 15.5, 2.5, LW, 17.4, 2.62); B.box(M.rufo, 6.18, 15.5, 2.62, LW, 17.42, 2.64);
  B.box(M.preto, 6.3, 15.52, 0, 6.4, 15.62, 2.5); P.tank(B, 7.5, 15.65, 8.05, 16.25, .1); P.washer(B, 7.45, 16.4, 8.05, 17.0, .1);

  // ---------- térreo: pisos ----------
  B.box(M.concreto, 2.4, 3, 0, 8.1, 8.6, .05); B.floor(2.4, 3.15, 8.1, 8.6, .05);
  B.box(M.porcelanato, 0, 4.0, 0, 2.4, 8.75, F); B.box(M.porcelanato, 0, 8.6, 0, LW, 15.5, F); B.floor(.15, 4.15, 2.25, 8.75, F); B.floor(.15, 8.6, 8.1, 15.35, F);
  B.box(M.pisoMadeira, .15, 8.75, F, 4.85, 15.35, F + .012); B.box(M.pisoMadeira, 2.4, 8.75, F, 6.45, 10.25, F + .012);
  // ---------- térreo: paredes ----------
  walls(B, G, [[2.4, 3, 8.1, 3.15]], 0, 2.85, [{ r: [2.8, 3, 7.8, 3.15], z0: 0, z1: 2.5, t: 'gar', mat: M.madeira }]);
  walls(B, W, [[8.1, 3, LW, 15.5], [2.25, 3, 2.4, 8.75], [2.4, 8.6, 8.1, 8.75]], 0, 2.85, [door([2.25, 7.4, 2.4, 8.2], 't', 'w', F, 2.1, { mat: M.madeiraClara })]);
  walls(B, W, [[0, 4.0, .15, 15.5], [.15, 15.35, 8.1, 15.5], [.15, 4.0, 2.25, 4.15], [6.45, 8.75, 6.6, 10.25], [4.85, 10.25, 8.1, 10.4], [4.85, 10.4, 5.0, 15.35]], F, 2.85, [
    door([.9, 4.0, 2.0, 4.15], 'r', 's', F, 2.45, { mat: M.madeira }), door([6.45, 9.2, 6.6, 9.9], 't', 'e', F), door([4.85, 11.0, 5.0, 11.9], 't', 'e', F),
    slide([.8, 15.35, 4.6, 15.5], F, 2.4), win([5.3, 15.35, 6.9, 15.5], F, 1.1, 2.2), door([7.2, 15.35, 8.0, 15.5], 'l', 's', F, 2.1, { mat: M.madeiraClara })]);
  // lâmina de pedra, painel ripado e fachada da garagem
  B.box(M.pedra, 2.1, 2.6, 0, 2.55, 3.15, 7.1); B.box(M.pedra, 2.1, 3.15, 0, 2.4, 4.0, 2.85); B.box(M.rufo, 2.08, 2.58, 7.1, 2.57, 3.17, 7.13); B.col(2.1, 2.6, 2.55, 4.0, 0, 7);
  B.box(M.led, .3, 3.9, 2.82, 2.0, 3.94, 2.85); B.lamp(1.2, 3.5, 2.6, 3, .6); B.box(M.led, 2.9, 2.94, 2.6, 7.7, 2.98, 2.63); B.lamp(5.3, 2.4, 2.5, 4.5, .7);
  // ---------- escada reta (16 espelhos de 17,8 cm, 15 pisos de 28 cm) ----------
  const rz = (U - F) / 16;
  for (let i = 0; i < 15; i++) { const v0 = 5.0 + i * .28, z = F + (i + 1) * rz; B.box(M.branco, .15, v0, F, 1.15, v0 + .28, z - .04); B.box(M.madeiraClara, .15, v0 - .02, z - .04, 1.17, v0 + .28, z); }
  B.floor(.15, 5.0, 1.15, 9.2, 0, { ax: 'v', a0: 5.0, a1: 9.2, h0: F, h1: U }); B.col(1.15, 5.05, 1.2, 9.2, 0, 2.9);
  for (let k = 0; k < 5; k++) { const v0 = 5.0 + k * .84, zb = F + k * 3 * rz; B.box(M.vidro, 1.15, v0, zb + .1, 1.165, v0 + .84, zb + 3 * rz + 1.0); }
  // ---------- laje do pavimento superior, cobertura da faixa leste (com domus) ----------
  for (const r of [[0, 3, 6.75, 5.0], [1.15, 5.0, 6.75, 9.2], [0, 9.2, 6.75, 15.5], [0, 5.0, .15, 9.2]]) { B.box(M.branco, r[0], r[1], 2.85, r[2], r[3], U); B.floor(r[0], r[1], r[2], r[3], U); }
  for (const r of [[6.75, 3, LW, 10.8], [6.75, 11.8, LW, 15.5], [6.75, 10.8, 7.0, 11.8], [7.7, 10.8, LW, 11.8]]) { B.box(M.branco, r[0], r[1], 2.85, r[2], r[3], U); B.box(M.lajeTopo, r[0], r[1], U, r[2], r[3], U + .02); }
  B.box(M.rebocoCinza, 6.95, 10.75, U, 7.75, 10.8, 3.2); B.box(M.rebocoCinza, 6.95, 11.8, U, 7.75, 11.85, 3.2); B.box(M.rebocoCinza, 6.95, 10.8, U, 7.0, 11.8, 3.2); B.box(M.rebocoCinza, 7.7, 10.8, U, 7.75, 11.8, 3.2); B.box(M.vidro, 6.95, 10.75, 3.2, 7.75, 11.85, 3.22);
  parapet(B, G, 6.75, 3, LW, 8.75, U, 3.45, .15, 'ne'); parapet(B, W, 6.75, 8.75, LW, 15.5, U, 3.45, .15, 'se');
  // ---------- pavimento superior: paredes ----------
  for (const r of [[.15, 3.15, 6.6, 4.85], [1.4, 4.85, 6.6, 6.75], [1.4, 6.9, 6.6, 9.0], [.15, 9.2, 4.15, 10.4], [1.4, 9.15, 4.15, 9.2], [.15, 10.55, 6.6, 15.35], [3.35, 10.4, 4.15, 10.55]]) B.box(M.pisoMadeira, r[0], r[1], U, r[2], r[3], U + .012);
  B.box(M.porcelanato, 4.15, 6.9, U, 6.6, 9.0, U + .014); B.box(M.porcelanato, 4.3, 9.15, U, 6.6, 11.0, U + .014);
  walls(B, W, [[0, 3, .15, 15.5], [6.6, 3, 6.75, 15.5], [.15, 3, 6.6, 3.15], [.15, 15.35, 6.6, 15.5], [.15, 4.85, 1.4, 5.0], [1.25, 5.0, 1.4, 6.75], [1.25, 6.75, 6.6, 6.9], [2.4, 6.9, 2.55, 9.0], [4.0, 6.9, 4.15, 9.0],
    [2.4, 9.0, 6.6, 9.15], [4.15, 9.15, 4.3, 11.0], [4.15, 11.0, 6.6, 11.15], [.15, 10.4, 4.15, 10.55], [3.2, 10.55, 3.35, 15.35]], U, 5.7, [
    door([1.5, 6.75, 2.3, 6.9], 'l', 'n', U), vao([2.9, 6.75, 3.7, 6.9], U, 2.1), door([4.5, 6.75, 5.2, 6.9], 'l', 's', U), door([4.15, 9.5, 4.3, 10.2], 't', 'e', U),
    door([1.2, 10.4, 2.0, 10.55], 'l', 's', U), door([3.45, 10.4, 4.15, 10.55], 'l', 's', U),
    win([2.9, 3, 6.2, 3.15], U, .9, 2.4), win([.4, 3, 1.1, 3.15], U, .9, 2.4), win([6.6, 4.2, 6.75, 5.6], U, 1.0, 2.2), win([6.6, 7.5, 6.75, 8.3], U, 1.5, 2.1),
    win([6.6, 9.7, 6.75, 10.5], U, 1.5, 2.1), win([6.6, 12.5, 6.75, 13.9], U, 1.0, 2.2), win([.8, 15.35, 2.6, 15.5], U, 1.0, 2.2), win([4.0, 15.35, 5.8, 15.5], U, 1.0, 2.2)]);
  B.box(M.vidro, 1.25, 6.9, U, 1.27, 9.2, U + 1.05); B.box(M.inox, 1.24, 6.9, U + 1.05, 1.28, 9.2, U + 1.08); B.col(1.18, 6.9, 1.3, 9.2, U - .1, U + 1.1);
  B.box(M.madeira, 1.35, 2.97, 3.1, 2.1, 3.0, 6.3); slats(B, M.madeira, 'u', 1.36, 2.1, 2.93, 2.97, 3.1, 6.3, .045, .04);
  // cobertura
  B.box(M.branco, 0, 3, 5.7, 6.75, 15.5, 5.85); B.box(M.lajeTopo, .15, 3.15, 5.85, 6.6, 15.35, 5.87); parapet(B, W, 0, 3, 6.75, 15.5, 5.85, 6.6); P.caixa(B, 1.4, 13.5, 5.87);

  // ---------- garagem ----------
  car2(B, CORSA, 3.95, 5.85, 90); car2(B, CERATO, 6.6, 5.9, 90);
  B.box(M.lampada, 3.4, 5.8, 2.82, 4.6, 5.9, 2.85); B.box(M.lampada, 6.0, 5.8, 2.82, 7.2, 5.9, 2.85); B.lamp(3.95, 5.85, 2.6, 4.5, .7, true); B.lamp(6.6, 5.85, 2.6, 4.5, .7, true);
  B.box(M.grafite, 4.6, 8.3, 1.2, 7.9, 8.6, 1.24); B.box(M.grafite, 4.6, 8.3, 1.7, 7.9, 8.6, 1.74); B.box(M.lixoAzul, 4.8, 8.33, 1.24, 5.3, 8.58, 1.5); B.box(M.livro4, 5.6, 8.33, 1.24, 6.0, 8.58, 1.45); B.box(M.vaso, 6.4, 8.33, 1.74, 7.2, 8.58, 2.0);
  // ---------- hall ----------
  B.box(M.madeiraClara, 1.97, 4.6, F + .78, 2.24, 5.8, F + .82); B.box(M.preto, 2.0, 4.65, F, 2.04, 4.69, F + .78); B.box(M.preto, 2.0, 5.71, F, 2.04, 5.75, F + .78);
  B.box(M.inox, 2.225, 4.7, F + 1.0, 2.245, 5.7, F + 2.0); pot(B, 2.1, 4.85, F + .82, .55); B.box(M.livro2, 2.02, 5.3, F + .82, 2.2, 5.6, F + .86); pendant(B, 1.7, 6.6, 2.85, .5); P.ceilLamp(B, 1.7, 8.2, 2.85);
  P.rug(B, 1.3, 4.3, 2.1, 5.0, F, M.tecidoCinza);
  // ---------- jantar ----------
  P.counter(B, 2.6, 8.77, 4.6, 9.2, F, .85, M.madeiraClara, M.madeira); picU(B, 2.9, 4.3, 8.75, 1, F + 1.2, F + 2.1, M.quadro1); pot(B, 2.85, 9.0, F + .85, .6); B.cyl(M.cobre, 4.2, 9.0, .07, .1, F + .85, F + 1.1, 12);
  P.dining(B, 2.7, 10.2, 4.5, 11.1, F, true); for (const u of [3.05, 3.6, 4.15]) pendant(B, u, 10.65, 2.85, .95); B.lamp(3.6, 10.65, 1.9, 4, .7, true);
  B.cyl(M.vaso, 3.6, 10.65, .09, .12, F + .75, F + .93, 12); pot(B, 5.6, 9.3, F, 1.2, 'banana'); picV(B, 9.0, 10.0, 6.45, -1, F + 1.1, F + 2.0, M.quadro2);
  // ---------- estar ----------
  P.sofa(B, .2, 12.6, 1.1, 15.0, 'w', F, M.tecidoCinza); if (!B.assets) for (const [v, m] of [[12.95, M.almofada1], [13.8, M.almofada2], [14.65, M.almofada1]]) B.box(m, .42, v - .2, F + .46, .56, v + .2, F + .8);
  P.sofa(B, 1.4, 11.45, 2.3, 12.3, 'n', F, M.tecidoClaro); P.table(B, 2.2, 13.4, 3.0, 14.2, F, .36, M.madeira); if (!B.assets) { B.box(M.livro3, 2.35, 13.55, F + .36, 2.65, 13.8, F + .4); B.cyl(M.vaso, 2.82, 14.0, .06, .09, F + .36, F + .52, 10); }
  P.rug(B, 1.2, 12.7, 4.1, 14.9, F, M.tecidoClaro); B.box(M.madeira, 4.8, 12.6, F, 4.85, 15.0, 2.5); P.tvV(B, 4.45, 13.0, 4.8, 14.6, F); floorLamp(B, .45, 12.25, F); pot(B, .45, 15.05, F, 1.3, 'banana');
  B.box(M.cortina, .3, 15.27, F, .8, 15.31, 2.75); B.box(M.cortina, 4.55, 15.27, F, 4.8, 15.31, 2.75); picV(B, 13.2, 14.4, .15, 1, F + 1.25, F + 2.05, M.quadro3);
  P.ceilLamp(B, 2.6, 13.6, 2.85); P.ceilLamp(B, 5.6, 9.5, 2.85);
  // ---------- cozinha ----------
  P.fridge(B, 7.4, 10.45, 8.08, 11.15, F); P.counter(B, 7.5, 11.2, 8.08, 14.7, F); P.cooktop(B, 7.78, 12.45, F + .9); P.upper(B, 7.75, 11.2, 8.08, 14.7, F); B.box(M.inox, 7.55, 12.1, F + 1.55, 8.08, 12.8, F + 1.7);
  P.counter(B, 5.05, 14.75, 7.45, 15.33, F); P.sinkTop(B, 6.1, 15.02, F + .9); pot(B, 5.3, 15.05, F + .9, .5); B.box(M.inox, 6.9, 14.9, F + .9, 7.3, 15.2, F + 1.12);
  P.counter(B, 5.9, 12.2, 6.6, 13.8, F, .95, M.madeiraClara); P.stool(B, 5.6, 12.6, F); P.stool(B, 5.6, 13.4, F); pendant(B, 6.25, 12.6, 2.85, .8); pendant(B, 6.25, 13.4, 2.85, .8); B.lamp(6.25, 13, 2.0, 4, .7, true);
  B.cyl(M.almofada1, 6.3, 13.0, .12, .14, F + .95, F + 1.03, 14); P.ceilLamp(B, 6.5, 11.3, 2.85);
  // ---------- lavabo ----------
  P.wc(B, 7.35, 8.9, 0, 1, F); P.vanity(B, 6.7, 9.7, 7.15, 10.2, F); B.box(M.inox, 6.62, 9.6, F + 1.1, 6.63, 10.2, F + 1.9); P.ceilLamp(B, 7.35, 9.5, 2.85); pot(B, 7.9, 10.05, F, .7);

  // ---------- suíte master ----------
  P.bed(B, 4.55, 3.9, 6.55, 5.8, 'e', U); bedside(B, 6.12, 3.38, U); bedside(B, 6.12, 5.9, U); P.rug(B, 3.3, 3.7, 4.5, 6.0, U, M.tecidoClaro);
  for (const v of [4.3, 5.4]) B.box(M.almofada2, 5.8, v - .22, U + .62, 5.95, v + .22, U + .95);
  P.table(B, .2, 3.3, .75, 4.7, U, .76, M.madeiraClara); B.box(M.inox, .16, 3.6, U + .9, .17, 4.4, U + 1.8); P.stool(B, 1.0, 4.0, U);
  P.tvV(B, 1.42, 5.3, 1.72, 6.5, U); B.box(M.cortina, 2.6, 3.17, U, 2.9, 3.21, 5.65); B.box(M.cortina, 6.2, 3.17, U, 6.5, 3.21, 5.65); pot(B, 1.95, 3.95, U, 1.2, 'banana'); picU(B, 2.6, 3.6, 6.75, -1, U + 1.2, U + 1.9, M.quadro2);
  P.ceilLamp(B, 3.8, 4.9, 5.7); P.wardrobe(B, 3.4, 7.0, 3.95, 8.95, U); P.ceilLamp(B, 3.1, 8.0, 5.7);
  P.showerGlass(B, 5.6, 8.0, 5.62, 9.0, U); P.wc(B, 6.45, 7.3, -1, 0, U); P.vanity(B, 4.2, 8.3, 4.7, 8.95, U); B.box(M.inox, 4.16, 8.3, U + 1.1, 4.17, 8.95, U + 1.9); P.ceilLamp(B, 5.2, 7.8, 5.7);
  // ---------- circulação e banho social ----------
  pot(B, .45, 9.8, U, 1.2, 'banana'); picU(B, 2.7, 3.9, 9.15, 1, U + 1.2, U + 1.95, M.quadro1); P.ceilLamp(B, 2.4, 9.8, 5.7); P.ceilLamp(B, 1.9, 7.9, 5.7);
  P.showerGlass(B, 5.7, 9.15, 5.72, 11.0, U); P.wc(B, 5.25, 10.85, 0, -1, U); P.vanity(B, 5.05, 9.2, 5.6, 9.65, U); B.box(M.inox, 5.05, 9.16, U + 1.1, 5.6, 9.17, U + 1.9); P.ceilLamp(B, 4.9, 10.1, 5.7);
  // ---------- escritório ----------
  P.table(B, .6, 14.7, 2.8, 15.3, U, .75, M.madeiraClara); P.chair(B, 1.7, 14.4, 'n', U, M.grafite); B.box(M.vidroEscuro, 1.35, 15.1, U + .85, 2.05, 15.13, U + 1.25); B.box(M.preto, 1.66, 15.05, U + .75, 1.74, 15.15, U + .87);
  B.cyl(M.preto, 2.5, 15.0, .07, .02, U + .75, U + 1.1, 8); B.cyl(M.abajur, 2.5, 15.0, .1, .07, U + 1.1, U + 1.25, 12); bookshelf(B, .17, 10.65, .55, 13.6, U, 2.1);
  P.sofa(B, 2.3, 11.5, 3.15, 13.5, 'e', U, M.tecidoCinza); if (!B.assets) B.box(M.almofada1, 2.72, 11.7, U + .46, 2.86, 12.1, U + .8); P.rug(B, .8, 12.0, 2.2, 14.2, U, M.tecidoClaro); pot(B, .5, 14.2, U, 1.0);
  picV(B, 13.8, 14.9, 3.2, -1, U + 1.2, U + 1.9, M.quadro3); P.ceilLamp(B, 1.6, 12.8, 5.7); B.box(M.cortina, .5, 15.27, U, .8, 15.31, 5.65); B.box(M.cortina, 2.6, 15.27, U, 2.9, 15.31, 5.65);
  // ---------- quarto 2 ----------
  P.bed(B, 4.65, 12.4, 6.55, 13.8, 'e', U); bedside(B, 6.12, 11.9, U); bedside(B, 6.12, 13.9, U); P.wardrobe(B, 4.4, 11.2, 5.9, 11.75, U); P.rug(B, 3.6, 12.2, 4.6, 14.0, U, M.tecidoClaro);
  B.box(M.almofada1, 5.8, 12.9, U + .62, 5.95, 13.3, U + .95); P.table(B, 3.5, 14.75, 4.7, 15.3, U, .75, M.madeiraClara); P.chair(B, 4.1, 14.5, 'n', U, M.grafite); pot(B, 6.3, 15.05, U, 1.0);
  B.box(M.cortina, 3.75, 15.27, U, 4.0, 15.31, 5.65); B.box(M.cortina, 5.8, 15.27, U, 6.05, 15.31, 5.65); picU(B, 3.5, 4.1, 10.55, 1, U + 1.3, U + 1.9, M.quadro2); P.ceilLamp(B, 4.9, 13.2, 5.7);

  // ---------- rótulos ----------
  for (const [t, u, v, z] of [['Garagem fechada · 5,70 × 5,45', 5.25, 4.2, 1.3], ['Hall', 1.75, 6.6, 1.2], ['Jantar', 3.6, 9.6, 1.2], ['Estar · 4,70 × 6,00', 2.6, 12.2, 1.2], ['Cozinha · 3,10 × 4,95', 6.3, 11.2, 1.2],
    ['Lavabo', 7.4, 9.3, 1.2], ['Lavanderia', 7.1, 16.4, 1.2], ['Deck', 3.2, 16.4, .6], ['Varanda de entrada', 1.2, 3.5, 1.0],
    ['Suíte master · 5,20 × 3,60', 3.6, 4.6, 4.1], ['Closet', 3.0, 8.0, 4.1], ['Banho suíte', 5.2, 7.6, 4.1], ['Banho', 5.0, 10.1, 4.1], ['Hall superior', 2.2, 9.8, 4.1],
    ['Escritório · 3,05 × 4,80', 1.6, 13.0, 4.1], ['Quarto 2 · 3,25 × 4,20', 5.0, 14.4, 4.1]]) B.label(t, u, v, z, 'r');
  B.label(CORSA.nome, 3.95, 5.85, 1.6, 'r'); B.label(CERATO.nome, 6.6, 5.9, 1.65, 'r');
  B.label('Sobrado · Opção B · lote 8,25 × 18 m', 4, 3, 7.6, 'l');
}
export const CARS = [CORSA, CERATO];
