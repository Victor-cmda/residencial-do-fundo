// Mobiliário, carros, postes e pergolados (coordenadas de planta; F = nível do piso)
import * as THREE from 'three';
import { M } from './tex.js';

export function bed(B, u0, v0, u1, v1, head, F) {
  B.box(M.madeira, u0, v0, F + .08, u1, v1, F + .3); B.box(M.colchao, u0 + .03, v0 + .03, F + .3, u1 - .03, v1 - .03, F + .52);
  const hb = { n: [u0, v0 - .0, u1, v0 + .06], s: [u0, v1 - .06, u1, v1], w: [u0, v0, u0 + .06, v1], e: [u1 - .06, v0, u1, v1] }[head]; B.box(M.madeira, hb[0], hb[1], F, hb[2], hb[3], F + 1.0);
  const p = { n: [u0 + .12, v0 + .1, u1 - .12, v0 + .5], s: [u0 + .12, v1 - .5, u1 - .12, v1 - .1], w: [u0 + .1, v0 + .12, u0 + .5, v1 - .12], e: [u1 - .5, v0 + .12, u1 - .1, v1 - .12] }[head];
  B.box(M.tecidoClaro, p[0], p[1], F + .52, p[2], p[3], F + .62);
  const c = { n: [u0, (v0 + v1) / 2, u1, v1], s: [u0, v0, u1, (v0 + v1) / 2], w: [(u0 + u1) / 2, v0, u1, v1], e: [u0, v0, (u0 + u1) / 2, v1] }[head];
  B.box(M.tecido, c[0] + .02, c[1] + .02, F + .52, c[2] - .02, c[3] - .02, F + .56); B.col(u0, v0, u1, v1, F, F + .6);
}
export function sofa(B, u0, v0, u1, v1, back, F, mat = M.tecido) {
  if (B.assets) { B.assets.push({ kind: 'sofa', u0: B.X(u0), v0: B.Y(v0), u1: B.X(u1), v1: B.Y(v1), z: F, back }); B.col(u0, v0, u1, v1, F, F + .8); return; }
  B.box(mat, u0, v0, F + .08, u1, v1, F + .42);
  const k = { n: [u0, v0, u1, v0 + .2], s: [u0, v1 - .2, u1, v1], w: [u0, v0, u0 + .2, v1], e: [u1 - .2, v0, u1, v1] }[back]; B.box(mat, k[0], k[1], F + .08, k[2], k[3], F + .82);
  if (back === 'n' || back === 's') { B.box(mat, u0, v0, F + .08, u0 + .14, v1, F + .6); B.box(mat, u1 - .14, v0, F + .08, u1, v1, F + .6); } else { B.box(mat, u0, v0, F + .08, u1, v0 + .14, F + .6); B.box(mat, u0, v1 - .14, F + .08, u1, v1, F + .6); }
  B.col(u0, v0, u1, v1, F, F + .8);
}
export function table(B, u0, v0, u1, v1, F, h = .75, top = M.madeiraClara) {
  if (B.assets && h < .5) { B.assets.push({ kind: 'coffee', u0: B.X(u0), v0: B.Y(v0), u1: B.X(u1), v1: B.Y(v1), z: F }); B.col(u0, v0, u1, v1, F, F + h); return; }
  B.box(top, u0, v0, F + h - .04, u1, v1, F + h);
  for (const [a, b] of [[u0 + .05, v0 + .05], [u1 - .1, v0 + .05], [u0 + .05, v1 - .1], [u1 - .1, v1 - .1]]) B.box(M.preto, a, b, F, a + .05, b + .05, F + h - .04);
  B.col(u0, v0, u1, v1, F, F + h);
}
export function chair(B, u, v, back, F, mat = M.preto) {
  if (B.assets) { B.assets.push({ kind: 'chair', u: B.X(u), v: B.Y(v), z: F, back }); return; }
  B.box(mat, u - .2, v - .2, F + .42, u + .2, v + .2, F + .46);
  for (const [a, b] of [[-.19, -.19], [.15, -.19], [-.19, .15], [.15, .15]]) B.box(mat, u + a, v + b, F, u + a + .04, v + b + .04, F + .42);
  const k = { n: [u - .2, v - .2, u + .2, v - .16], s: [u - .2, v + .16, u + .2, v + .2], w: [u - .2, v - .2, u - .16, v + .2], e: [u + .16, v - .2, u + .2, v + .2] }[back]; B.box(mat, k[0], k[1], F + .46, k[2], k[3], F + .88);
}
export function dining(B, u0, v0, u1, v1, F, alongU = true) {
  table(B, u0, v0, u1, v1, F);
  if (alongU) { const n = Math.max(1, Math.round((u1 - u0) / .6)); for (let i = 0; i < n; i++) { const u = u0 + (u1 - u0) * (i + .5) / n; chair(B, u, v0 - .18, 'n', F); chair(B, u, v1 + .18, 's', F); } }
  else { const n = Math.max(1, Math.round((v1 - v0) / .6)); for (let i = 0; i < n; i++) { const v = v0 + (v1 - v0) * (i + .5) / n; chair(B, u0 - .18, v, 'w', F); chair(B, u1 + .18, v, 'e', F); } }
}
export function counter(B, u0, v0, u1, v1, F, h = .9, body = M.branco, top = M.bancada) {
  B.box(body, u0 + .02, v0 + .02, F + .08, u1 - .02, v1 - .02, F + h - .04); B.box(M.preto, u0 + .05, v0 + .05, F, u1 - .05, v1 - .05, F + .08); B.box(top, u0, v0, F + h - .04, u1, v1, F + h); B.col(u0, v0, u1, v1, F, F + h);
}
export function stool(B, u, v, F) { if (B.assets) { B.assets.push({ kind: 'stool', u: B.X(u), v: B.Y(v), z: F }); return; } B.cyl(M.madeiraClara, u, v, .16, .16, F + .62, F + .66, 14); B.cyl(M.preto, u, v, .02, .02, F, F + .62, 6); B.cyl(M.preto, u, v, .16, .16, F, F + .02, 12); }
export function upper(B, u0, v0, u1, v1, F, mat = M.branco) { B.box(mat, u0, v0, F + 1.45, u1, v1, F + 2.15); }
export function fridge(B, u0, v0, u1, v1, F) { B.box(M.inox, u0, v0, F + .02, u1, v1, F + 1.8); B.col(u0, v0, u1, v1, F, F + 1.8); }
export function wardrobe(B, u0, v0, u1, v1, F, h = 2.3, mat = M.madeiraClara) { B.box(mat, u0, v0, F, u1, v1, F + h); B.col(u0, v0, u1, v1, F, F + h); }
export function wc(B, u, v, dx, dy, F) {
  if (dx) B.box(M.louca, u - .1, v - .2, F + .35, u + .1, v + .2, F + .8); else B.box(M.louca, u - .2, v - .1, F + .35, u + .2, v + .1, F + .8);
  B.cyl(M.louca, u + dx * .36, v + dy * .36, .16, .2, F, F + .4, 14); B.cyl(M.louca, u + dx * .36, v + dy * .36, .21, .21, F + .4, F + .43, 14); B.col(u - .3, v - .3, u + .3, v + .3, F, F + .8);
}
export function vanity(B, u0, v0, u1, v1, F) {
  B.box(M.madeiraClara, u0, v0, F + .45, u1, v1, F + .82); B.box(M.louca, u0 - .01, v0 - .01, F + .82, u1 + .01, v1 + .01, F + .88);
  const mu = (u0 + u1) / 2, mv = (v0 + v1) / 2; B.cyl(M.inox, mu, mv, .012, .012, F + .88, F + 1.05, 6); B.col(u0, v0, u1, v1, F, F + .9);
}
export function showerGlass(B, u0, v0, u1, v1, F) { B.box(M.vidro, u0, v0, F, u1, v1, F + 1.95); B.box(M.inox, u0, v0, F + 1.95, u1, v1, F + 1.97); B.col(u0, v0, u1, v1, F, F + 2); }
export function tank(B, u0, v0, u1, v1, F) { B.box(M.louca, u0, v0, F + .55, u1, v1, F + .85); B.box(M.branco, u0 + .05, v0 + .05, F, u1 - .05, v1 - .05, F + .55); B.col(u0, v0, u1, v1, F, F + .85); }
export function washer(B, u0, v0, u1, v1, F) { B.box(M.louca, u0, v0, F, u1, v1, F + .88); B.box(M.vidroEscuro, u0 + .1, v0 + .1, F + .88, u1 - .1, v1 - .1, F + .9); B.col(u0, v0, u1, v1, F, F + .9); }
export function cooktop(B, u, v, F) { B.box(M.vidroEscuro, u - .28, v - .24, F, u + .28, v + .24, F + .012); }
export function sinkTop(B, u, v, F) { B.box(M.inox, u - .3, v - .2, F - .0, u + .3, v + .2, F + .006); B.cyl(M.inox, u, v - .15, .012, .012, F, F + .28, 6); }
export function tv(B, u0, v0, u1, v1, F) { B.box(M.madeiraClara, u0, v0, F + .25, u1, v1, F + .5); B.box(M.vidroEscuro, u0 + .1, (v0 + v1) / 2 - .02, F + .7, u1 - .1, (v0 + v1) / 2 + .02, F + 1.4); B.col(u0, v0, u1, v1, F, F + .5); }
export function tvV(B, u0, v0, u1, v1, F) { B.box(M.madeiraClara, u0, v0, F, u1, v1, F + .45); B.box(M.vidroEscuro, (u0 + u1) / 2 - .02, v0 + .1, F + .7, (u0 + u1) / 2 + .02, v1 - .1, F + 1.4); B.col(u0, v0, u1, v1, F, F + .5); }
export function rug(B, u0, v0, u1, v1, F, mat = M.tecidoClaro) { B.box(mat, u0, v0, F, u1, v1, F + .012); }
export function ceilLamp(B, u, v, z) { B.box(M.lampada, u - .3, v - .3, z - .03, u + .3, v + .3, z - .005); B.lamp(u, v, z - .25, 4, .55, true); }
export function bench(B, u0, v0, u1, v1, F) {
  B.box(M.madeira, u0, v0, F + .4, u1, v1, F + .46); const hz = (u1 - u0) > (v1 - v0);
  if (hz) { B.box(M.concreto, u0 + .1, v0, F, u0 + .25, v1, F + .4); B.box(M.concreto, u1 - .25, v0, F, u1 - .1, v1, F + .4); } else { B.box(M.concreto, u0, v0 + .1, F, u1, v0 + .25, F + .4); B.box(M.concreto, u0, v1 - .25, F, u1, v1 - .1, F + .4); }
  B.col(u0, v0, u1, v1, F, F + .5);
}
// pergolado: pilares pretos, vigas e réguas de madeira. dir = direção das réguas ('u' ou 'v')
export function pergola(B, u0, v0, u1, v1, z, dir = 'v', step = .5, posts = true) {
  if (posts) for (const [a, b] of [[u0, v0], [u1 - .12, v0], [u0, v1 - .12], [u1 - .12, v1 - .12]]) { B.box(M.preto, a, b, 0, a + .12, b + .12, z); B.col(a, b, a + .12, b + .12, 0, z); }
  if (dir === 'v') { B.box(M.madeira, u0, v0, z, u1, v0 + .12, z + .2); B.box(M.madeira, u0, v1 - .12, z, u1, v1, z + .2); for (let a = u0; a <= u1 - .1; a += step) B.box(M.madeira, a, v0 - .15, z + .2, a + .07, v1 + .15, z + .36); }
  else { B.box(M.madeira, u0, v0, z, u0 + .12, v1, z + .2); B.box(M.madeira, u1 - .12, v0, z, u1, v1, z + .2); for (let a = v0; a <= v1 - .1; a += step) B.box(M.madeira, u0 - .15, a, z + .2, u1 + .15, a + .07, z + .36); }
}
export function grill(B, u0, v0, u1, v1, F) {   // bancada com churrasqueira
  counter(B, u0, v0, u1, v1, F, .9, M.rebocoCinza); B.box(M.grafite, u0 + .05, v0, F + .9, u0 + .85, v1, F + 2.4); B.box(M.vidroEscuro, u0 + .15, v0 - .005, F + 1.0, u0 + .75, v0 + .1, F + 1.5);
}
export function post(B, u, v, du = 0, dv = 0) {   // poste de iluminação com braço na direção (du,dv)
  B.cyl(M.preto, u, v, .07, .05, 0, 5.2, 10); B.cyl(M.concreto, u, v, .16, .16, 0, .12, 10); B.col(u - .1, v - .1, u + .1, v + .1, 0, 5);
  const a = [u + Math.min(0, du) * 1.0 - .03, v + Math.min(0, dv) * 1.0 - .03, u + Math.max(0, du) * 1.0 + .03, v + Math.max(0, dv) * 1.0 + .03];
  B.box(M.preto, a[0], a[1], 5.12, a[2], a[3], 5.2); B.box(M.preto, u + du * .7 - .14, v + dv * .7 - .14, 5.05, u + du * 1.0 + .14, v + dv * 1.0 + .14, 5.12);
  B.box(M.lampada, u + du * .85 - .12, v + dv * .85 - .12, 5.03, u + du * .85 + .12, v + dv * .85 + .12, 5.05); B.lamp(u + du * .85, v + dv * .85, 5.0, 9, 1);
}
export function caixa(B, u, v, z) { B.cyl(M.lixoAzul, u, v, .5, .68, z, z + .76, 20); B.cyl(M.lixoAzul, u, v, .7, .66, z + .76, z + .84, 20); }
export function bollard(B, u, v, h = .7) { B.cyl(M.preto, u, v, .05, .05, 0, h, 8); B.cyl(M.lampada, u, v, .052, .052, h - .12, h - .04, 8); B.lamp(u, v, h, 2.2, .35); }

const carMats = ['carro1', 'carro2', 'carro3', 'carro4', 'carro5'];
export function car(B, u, v, rot = 0, ci = 0) {
  const m = new THREE.Matrix4().makeTranslation(u, 0, v).multiply(new THREE.Matrix4().makeRotationY(-rot * Math.PI / 180));
  const ext = (pts, w, bev = 0, smooth = true) => {
    const P2 = pts.map(p => new THREE.Vector2(p[0], p[1])), sh = new THREE.Shape(smooth ? new THREE.SplineCurve([...P2, P2[0]]).getPoints(64) : P2);
    const g = new THREE.ExtrudeGeometry(sh, { depth: w - bev * 2, bevelEnabled: bev > 0, bevelThickness: bev, bevelSize: bev, bevelSegments: 3, curveSegments: 4 }); g.translate(0, 0, -(w - bev * 2) / 2); return g;
  };
  const paint = M[carMats[ci % 5]];
  B.add(paint, ext([[-2.0, .4], [-2.02, .62], [-1.88, .76], [-1.35, .86], [-.2, .9], [1.25, .92], [1.88, .86], [2.03, .68], [2.02, .44], [1.7, .34], [0, .32], [-1.7, .34]], 1.76, .1), m);
  B.add(M.vidroEscuro, ext([[-1.38, .86], [-.95, 1.2], [-.62, 1.36], [0, 1.41], [.5, 1.4], [.8, 1.32], [1.32, .9], [0, .84]], 1.56, .08), m);
  B.add(paint, ext([[-.72, 1.345], [-.4, 1.42], [.1, 1.445], [.52, 1.43], [.78, 1.35], [.4, 1.37], [-.3, 1.365]], 1.46, .06), m);
  for (const [x, rz, h] of [[-.05, 0, .5], [-1.03, -.84, .62], [1.06, .82, .62]]) B.add(paint, new THREE.BoxGeometry(.075, h, 1.61), m.clone().multiply(new THREE.Matrix4().makeTranslation(x, 1.1, 0)).multiply(new THREE.Matrix4().makeRotationZ(rz)));
  B.add(M.preto, new THREE.BoxGeometry(3.9, .14, 1.7), m.clone().multiply(new THREE.Matrix4().makeTranslation(0, .25, 0)));
  for (const x of [-1.32, 1.3]) for (const z of [-.8, .8]) {
    const w = m.clone().multiply(new THREE.Matrix4().makeTranslation(x, .33, z)).multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    B.add(M.pneu, new THREE.CylinderGeometry(.33, .33, .24, 20), w); B.add(M.metal, new THREE.CylinderGeometry(.2, .2, .26, 14), w);
  }
  for (const z of [-.62, .62]) {
    B.add(M.farol, new THREE.BoxGeometry(.06, .12, .36), m.clone().multiply(new THREE.Matrix4().makeTranslation(-2.1, .66, z)));
    B.add(M.lanterna, new THREE.BoxGeometry(.06, .12, .36), m.clone().multiply(new THREE.Matrix4().makeTranslation(2.1, .7, z)));
  }
  const L = (rot % 180 === 0) ? [2.1, .9] : [.9, 2.1]; B.col(u - L[0], v - L[1], u + L[0], v + L[1], 0, 1.4);
}
