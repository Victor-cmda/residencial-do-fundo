// Vegetação instanciada: árvores, arbustos, capins, palmeiras, bananeiras, araucária e tufos de grama
import * as THREE from 'three';
import { M, rng } from './tex.js';

function blobGeo() {
  const g = new THREE.IcosahedronGeometry(1, 3), p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const n = Math.sin(v.x * 3.1 + 1) * Math.sin(v.y * 2.7 + 2) * Math.sin(v.z * 3.3) + .5 * Math.sin(v.x * 7 + v.y * 5) * Math.sin(v.z * 6 + v.y * 4);
    v.multiplyScalar(1 + .2 * n + .09 * Math.sin(v.x * 13 + v.z * 9) * Math.sin(v.y * 11 + v.x * 7)); p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals(); return g;
}
function frondGeo(w, L) {
  const g = new THREE.PlaneGeometry(w, L, 2, 8), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), t = (p.getY(i) + L / 2) / L; p.setXYZ(i, x * (1 - .25 * t), L * (.55 * t - .8 * t * t) - Math.abs(x) * .35, L * t * .95); }
  g.computeVertexNormals(); return g;
}
function tuftGeo() {
  const a = new THREE.PlaneGeometry(1, 1); a.translate(0, .5, 0); const b = a.clone().rotateY(Math.PI / 2), c = a.clone().rotateY(Math.PI / 4);
  const g = new THREE.BufferGeometry(), P = [], U = [], N = [];
  for (const q of [a, b, c]) { const n = q.toNonIndexed(); P.push(...n.attributes.position.array); U.push(...n.attributes.uv.array); for (let i = 0; i < n.attributes.position.count; i++) N.push(0, 1, 0); }
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); return g;
}

export function buildVeg(scene, B, quality) {
  const grp = new THREE.Group(), r = rng(11), T = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(), Pp = new THREE.Vector3(), C = new THREE.Color();
  const L = { blob: [], dark: [], trunk: [], frond: [], capim: [], tuft: [], card: [] }, cc = [];
  const card = (x, y, z, k, cx, cy, cz, col) => { push(L.card, x, y, z, k, k, k, r() * 6.28, r() * 3.14, r() * 6.28, col); cc.push(cx, cy, cz); };
  const push = (list, x, y, z, sx, sy, sz, ry = 0, rx = 0, rz = 0, col = null) => { E.set(rx, ry, rz, 'YXZ'); Q.setFromEuler(E); list.push([new THREE.Matrix4().compose(Pp.set(x, y, z), Q, S.set(sx, sy, sz)), col]); };
  const green = () => C.setHSL(.23 + r() * .08, .38 + r() * .2, .2 + r() * .13).clone();
  for (const p of B.veg) {
    const { x, y, s } = p, z0 = p.z || 0;
    if (p.kind === 'tree') {
      const h = (3.4 + r() * 1.8) * s, rad = .13 * s + .04; push(L.trunk, x, z0, y, rad, h * .62, rad, r() * 6);
      const R = (1.35 + r() * .35) * s, cy = z0 + h * .82, base = green(), n = quality === 'alta' ? 54 : 30;
      for (let i = 0; i < 4; i++) { const a = r() * 6.28, k = (.62 + r() * .2) * s; push(L.dark, x + Math.cos(a) * R * .3, cy + (r() - .5) * R * .5, y + Math.sin(a) * R * .3, k, k * .85, k, r() * 6); }
      for (let i = 0; i < n; i++) {
        const a = r() * 6.28, e = Math.acos(1 - r() * 1.55), d = R * (.62 + r() * .42), k = (1.1 + r() * .7) * s;
        card(x + Math.sin(e) * Math.cos(a) * d, cy + Math.cos(e) * d * .78, y + Math.sin(e) * Math.sin(a) * d, k, x, cy - R * .25, y, base.clone().offsetHSL((r() - .5) * .04, 0, (r() - .3) * .12));
      }
    } else if (p.kind === 'shrub') {
      const base = green(), R = .42 * s; push(L.dark, x, z0 + R * .7, y, R * .8, R * .7, R * .8, r() * 6);
      for (let i = 0; i < 12; i++) { const a = r() * 6.28, e = Math.acos(1 - r() * 1.3), d = R * (.7 + r() * .4); card(x + Math.sin(e) * Math.cos(a) * d, z0 + R * .55 + Math.cos(e) * d * .8, y + Math.sin(e) * Math.sin(a) * d, (.5 + r() * .3) * s, x, z0, y, base.clone().offsetHSL(0, 0, (r() - .3) * .1)); }
    } else if (p.kind === 'capim') {
      for (let i = 0; i < 3; i++) push(L.capim, x + (r() - .5) * .25 * s, z0, y + (r() - .5) * .25 * s, .9 * s, (.75 + r() * .4) * s, .9 * s, r() * 3.14);
    } else if (p.kind === 'palm' || p.kind === 'banana') {
      const ban = p.kind === 'banana', h = (ban ? 1.5 + r() : 5.2 + r() * 1.5) * s, rad = (ban ? .13 : .16) * s; push(L.trunk, x, z0, y, rad, h, rad, r() * 6, (r() - .5) * .06);
      const n = ban ? 7 : 12; for (let i = 0; i < n; i++) { const a = i / n * 6.28 + r() * .4, k = s * (ban ? .8 : 1) * (.85 + r() * .3); push(L.frond, x, z0 + h - .1, y, k * (ban ? 1.7 : 1), k, k, a, -(ban ? .75 : .25) - r() * .5); }
      if (!ban) push(L.blob, x, z0 + h, y, .3 * s, .35 * s, .3 * s, 0, 0, 0, C.setHSL(.25, .4, .3).clone());
    } else if (p.kind === 'araucaria') {
      const h = 9.5 * s; push(L.trunk, x, z0, y, .2 * s, h, .2 * s);
      for (let t = 0; t < 5; t++) {
        const zt = h * (.62 + t * .085), R = (2.4 - t * .32) * s, nb = 9;
        for (let i = 0; i < nb; i++) { const a = i / nb * 6.28 + t * .35; push(L.dark, x + Math.cos(a) * R * .5, z0 + zt + .12, y + Math.sin(a) * R * .5, R * .52, .13 * s, .26 * s, -a, 0, .22); push(L.dark, x + Math.cos(a) * R, z0 + zt + .42, y + Math.sin(a) * R, .34 * s, .3 * s, .34 * s, r() * 6); }
      }
      push(L.dark, x, z0 + h, y, .8 * s, .4 * s, .8 * s);
    }
  }
  // cerca viva: cartões de folhas sobre o volume
  for (const hd of B.hedges) {
    const n = Math.floor((hd[3] - hd[1]) * (quality === 'alta' ? 26 : 12)), xm = (hd[0] + hd[2]) / 2;
    for (let i = 0; i < n; i++) { const y = hd[1] + r() * (hd[3] - hd[1]), t = r(), top = t > .62, x = top ? hd[0] + r() * (hd[2] - hd[0]) : (r() < .7 ? hd[0] : hd[2]), z = top ? hd[4] : .15 + r() * (hd[4] - .15); card(x, z, y, .55 + r() * .3, xm, hd[4] * .45, y, C.setHSL(.26 + r() * .04, .42, .2 + r() * .1).clone()); }
  }
  // tufos de grama
  const K = quality === 'alta' ? 16 : 4, cap = quality === 'alta' ? 22000 : 4500; let total = 0; for (const g of B.grass) total += (g[2] - g[0]) * (g[3] - g[1]) * g[4] * K; const f = Math.min(1, cap / total);
  for (const g of B.grass) { const n = Math.floor((g[2] - g[0]) * (g[3] - g[1]) * g[4] * K * f); for (let i = 0; i < n; i++) { const w = .22 + r() * .2; const tx = g[0] + r() * (g[2] - g[0]), tz = g[1] + r() * (g[3] - g[1]); if (Math.hypot(tx - 19.5, tz - 8) > 7.25 || Math.hypot(tx - 19.5, tz - 8) < 1.4) push(L.tuft, tx, .03, tz, w, .1 + r() * .14, w, r() * 3.14); } }
  const inst = (geo, mat, list, shadow = true) => {
    if (!list.length) return; const m = new THREE.InstancedMesh(geo, mat, list.length);
    list.forEach((e, i) => { m.setMatrixAt(i, e[0]); if (e[1]) m.setColorAt(i, e[1]); });
    m.castShadow = shadow; m.receiveShadow = true; m.frustumCulled = false; m.instanceMatrix.needsUpdate = true; grp.add(m);
  };
  const tr = new THREE.CylinderGeometry(.62, 1, 1, 8); tr.translate(0, .5, 0);
  const folha = M.folha;
  inst(blobGeo(), folha, L.blob); inst(blobGeo(), M.folhaEscura, L.dark); inst(tr, M.tronco, L.trunk); inst(frondGeo(.9, 2.7), M.palma, L.frond);
  inst(tuftGeo(), M.capim, L.capim); inst(tuftGeo(), M.tufo, L.tuft, false);
  const cg = new THREE.PlaneGeometry(1, 1); cg.setAttribute('aC', new THREE.InstancedBufferAttribute(new Float32Array(cc), 3)); inst(cg, M.copa, L.card);
  scene.add(grp); return grp;
}
