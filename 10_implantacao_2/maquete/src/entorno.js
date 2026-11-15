// GERADO por build.mjs a partir de contexto-3d/maquete/src — não editar à mão
import * as THREE from 'three';
import { M, rng } from '../../../contexto-3d/maquete/src/tex.js';
import { walls } from '../../../contexto-3d/maquete/src/geo.js';

export function entorno(B) {
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
