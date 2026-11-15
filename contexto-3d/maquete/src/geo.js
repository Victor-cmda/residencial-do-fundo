// Construtor de geometria: tudo é acumulado por material e fundido em poucas malhas.
// Convenção de planta: (u, v, z) = (leste, sul, cima). No three: X = u, Y = z, Z = v.
import * as THREE from 'three';
import { M } from './tex.js';

export class Builder {
  constructor() {
    this.buckets = new Map(); this.colliders = []; this.floors = []; this.labels = []; this.lamps = []; this.grass = []; this.veg = []; this.hedges = [];
    this.ox = 0; this.oy = 0; this.mir = null;
  }
  frame(ox = 0, oy = 0, mir = null) { this.ox = ox; this.oy = oy; this.mir = mir; return this; }
  X(u) { return this.ox + (this.mir !== null ? this.mir - u : u); }
  Y(v) { return this.oy + v; }
  matrix() { const m = new THREE.Matrix4().makeTranslation(this.ox + (this.mir !== null ? this.mir : 0), 0, this.oy); if (this.mir !== null) m.multiply(new THREE.Matrix4().makeScale(-1, 1, 1)); return m; }
  bucket(mat) { let b = this.buckets.get(mat); if (!b) { b = { pos: [], nor: [] }; this.buckets.set(mat, b); } return b; }

  // caixa alinhada aos eixos, em coordenadas de planta
  box(mat, u0, v0, z0, u1, v1, z1) {
    let x0 = this.X(u0), x1 = this.X(u1); if (x0 > x1) [x0, x1] = [x1, x0]; let y0 = this.Y(v0), y1 = this.Y(v1); if (y0 > y1) [y0, y1] = [y1, y0]; if (z0 > z1) [z0, z1] = [z1, z0];
    const b = this.bucket(mat), P = b.pos, Nn = b.nor;
    const q = (a, bb, c, d, n) => { for (const p of [a, bb, c, a, c, d]) { P.push(p[0], p[1], p[2]); Nn.push(n[0], n[1], n[2]); } };
    const A = [x0, z0, y0], B = [x1, z0, y0], C = [x1, z0, y1], D = [x0, z0, y1], E = [x0, z1, y0], F = [x1, z1, y0], G = [x1, z1, y1], H = [x0, z1, y1];
    q(E, H, G, F, [0, 1, 0]); q(A, B, C, D, [0, -1, 0]); q(A, E, F, B, [0, 0, -1]); q(D, C, G, H, [0, 0, 1]); q(A, D, H, E, [-1, 0, 0]); q(B, F, G, C, [1, 0, 0]);
  }
  // geometria arbitrária em coordenadas locais do three (X=u, Y=z, Z=v); m = matriz local opcional
  add(mat, geo, m) {
    const g = geo.index ? geo.toNonIndexed() : geo; const M4 = this.matrix(); if (m) M4.multiply(m);
    const flip = M4.determinant() < 0, nm = new THREE.Matrix3().getNormalMatrix(M4), b = this.bucket(mat), p = g.attributes.position, n = g.attributes.normal, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i += 3) for (const k of (flip ? [0, 2, 1] : [0, 1, 2])) {
      v.fromBufferAttribute(p, i + k).applyMatrix4(M4); b.pos.push(v.x, v.y, v.z); v.fromBufferAttribute(n, i + k).applyMatrix3(nm).normalize(); b.nor.push(v.x, v.y, v.z);
    }
  }
  // prisma: polígono no plano (u,z) extrudado em v ; holes = lista de polígonos
  prism(mat, pts, v0, v1, holes = []) {
    const s = new THREE.Shape(pts.map(p => new THREE.Vector2(p[0], p[1]))); for (const h of holes) s.holes.push(new THREE.Path(h.map(p => new THREE.Vector2(p[0], p[1]))));
    this.add(mat, new THREE.ExtrudeGeometry(s, { depth: v1 - v0, bevelEnabled: false }), new THREE.Matrix4().makeTranslation(0, 0, v0));
  }
  // cilindro vertical
  cyl(mat, u, v, r0, r1, z0, z1, seg = 16) {
    this.add(mat, new THREE.CylinderGeometry(r1, r0, z1 - z0, seg), new THREE.Matrix4().makeTranslation(u, (z0 + z1) / 2, v));
  }
  // disco / anel horizontal (arco opcional)
  ring(mat, u, v, ri, ro, z0, z1, keep = null, seg = 72) {
    for (let i = 0; i < seg; i++) {
      const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2, am = (a0 + a1) / 2; if (keep && !keep(u + Math.cos(am) * ro, v + Math.sin(am) * ro)) continue;
      const sh = new THREE.Shape((ri > 0 ? [[ri, a0], [ro, a0], [ro, a1], [ri, a1]] : [[0, a0], [ro, a0], [ro, a1]]).map(([r, a]) => new THREE.Vector2(u + Math.cos(a) * r, -(v + Math.sin(a) * r))));
      this.add(mat, new THREE.ExtrudeGeometry(sh, { depth: z1 - z0, bevelEnabled: false }), new THREE.Matrix4().makeRotationX(-Math.PI / 2).setPosition(0, z0, 0));
    }
  }
  col(u0, v0, u1, v1, z0 = 0, z1 = 3) { const xa = this.X(u0), xb = this.X(u1), ya = this.Y(v0), yb = this.Y(v1); this.colliders.push([Math.min(xa, xb), Math.min(ya, yb), Math.max(xa, xb), Math.max(ya, yb), z0, z1]); }
  // piso caminhável: nível fixo h, ou rampa {ax:'u'|'v', a0, a1, h0, h1}
  floor(u0, v0, u1, v1, h, ramp = null) {
    const xa = this.X(u0), xb = this.X(u1), ya = this.Y(v0), yb = this.Y(v1); const f = { x0: Math.min(xa, xb), y0: Math.min(ya, yb), x1: Math.max(xa, xb), y1: Math.max(ya, yb), h };
    if (ramp) { f.ramp = ramp.ax === 'u' ? { ax: 'x', a0: this.X(ramp.a0), a1: this.X(ramp.a1), h0: ramp.h0, h1: ramp.h1 } : { ax: 'y', a0: this.Y(ramp.a0), a1: this.Y(ramp.a1), h0: ramp.h0, h1: ramp.h1 }; }
    this.floors.push(f);
  }
  label(text, u, v, z, kind = 'a') { this.labels.push({ text, p: new THREE.Vector3(this.X(u), z, this.Y(v)), kind }); }
  lamp(u, v, z, r = 7, power = 1, inside = false) { this.lamps.push({ p: new THREE.Vector3(this.X(u), z, this.Y(v)), r, power, inside }); }
  grassRect(u0, v0, u1, v1, dens = 1) { const xa = this.X(u0), xb = this.X(u1), ya = this.Y(v0), yb = this.Y(v1); this.grass.push([Math.min(xa, xb), Math.min(ya, yb), Math.max(xa, xb), Math.max(ya, yb), dens]); }
  plant(kind, u, v, s = 1, z = 0) { this.veg.push({ kind, x: this.X(u), y: this.Y(v), s, z }); }

  build(scene) {
    const out = [];
    for (const [mat, b] of this.buckets) {
      const n = b.pos.length / 3, uv = new Float32Array(n * 2), t = 1 / (mat.userData.tile || 1), P = b.pos, Nn = b.nor;
      for (let i = 0; i < n; i++) {
        const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2], ax = Math.abs(Nn[i * 3]), ay = Math.abs(Nn[i * 3 + 1]), az = Math.abs(Nn[i * 3 + 2]);
        if (ay >= ax && ay >= az) { uv[i * 2] = x * t; uv[i * 2 + 1] = z * t; } else if (ax >= az) { uv[i * 2] = z * t; uv[i * 2 + 1] = y * t; } else { uv[i * 2] = x * t; uv[i * 2 + 1] = y * t; }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(b.pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(b.nor, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      const mesh = new THREE.Mesh(g, mat); mesh.castShadow = !mat.userData.noShadow; mesh.receiveShadow = true; mesh.matrixAutoUpdate = false;
      if (mat.transparent) mesh.renderOrder = 2;
      scene.add(mesh); out.push(mesh);
    }
    this.buckets.clear(); return out;
  }
}

// ---------------------------------------------------------------------------------------------
//  Paredes com aberturas.  rects: [u0,v0,u1,v1]; ops: {r:[u0,v0,u1,v1], z0, z1, t, hinge, side, mat}
// ---------------------------------------------------------------------------------------------
export function walls(B, mat, rects, z0, z1, ops = [], collide = true) {
  for (const r of rects) {
    const hz = (r[2] - r[0]) >= (r[3] - r[1]), A = hz ? 0 : 1, lo = r[A], hi = r[A + 2];
    const mine = ops.filter(o => o.r[0] < r[2] - 1e-6 && o.r[2] > r[0] + 1e-6 && o.r[1] < r[3] - 1e-6 && o.r[3] > r[1] + 1e-6 && o.z1 > z0 && o.z0 < z1);
    const cuts = [...new Set([lo, hi, ...mine.flatMap(o => [Math.max(lo, o.r[A]), Math.min(hi, o.r[A + 2])])])].sort((a, b) => a - b);
    const solid = (a, b, za, zb) => {
      if (b - a < 1e-4 || zb - za < 1e-4) return;
      if (B.caps) B.caps.push(hz ? [B.X(a), B.Y(r[1]), B.X(b), B.Y(r[3]), za, zb] : [B.X(r[0]), B.Y(a), B.X(r[2]), B.Y(b), za, zb]);   // usado nos cortes de planta
      if (hz) { B.box(mat, a, r[1], za, b, r[3], zb); if (collide) B.col(a, r[1], b, r[3], za, zb); } else { B.box(mat, r[0], a, za, r[2], b, zb); if (collide) B.col(r[0], a, r[2], b, za, zb); }
    };
    for (let i = 0; i < cuts.length - 1; i++) {
      const a = cuts[i], b = cuts[i + 1], mid = (a + b) / 2; const here = mine.filter(o => o.r[A] <= mid && o.r[A + 2] >= mid).sort((p, q) => p.z0 - q.z0);
      let z = z0; for (const o of here) { solid(a, b, z, Math.min(o.z0, z1)); z = Math.max(z, o.z1); } solid(a, b, z, z1);
    }
  }
  for (const o of ops) if (!o.done) { o.done = true; fill(B, o); }
}

// atalhos de aberturas (F = nível do piso)
export const win = (r, F = 0, sill = 1.0, head = 2.2, extra = {}) => ({ r, z0: F + sill, z1: F + head, t: 'win', ...extra });
export const fix = (r, F = 0, head = 2.4, extra = {}) => ({ r, z0: F, z1: F + head, t: 'fix', ...extra });
export const slide = (r, F = 0, head = 2.3, extra = {}) => ({ r, z0: F, z1: F + head, t: 'slide', ...extra });
export const door = (r, hinge, side, F = 0, head = 2.1, extra = {}) => ({ r, z0: F, z1: F + head, t: 'door', hinge, side, ...extra });
export const vao = (r, F = 0, head = 2.2) => ({ r, z0: F, z1: F + head, t: 'vao' });

export function fill(B, o) {
  if (o.t === 'vao') return;
  const r = o.r, hz = (r[2] - r[0]) > (r[3] - r[1]); const a = hz ? r[0] : r[1], b = hz ? r[2] : r[3], c0 = hz ? r[1] : r[0], c1 = hz ? r[3] : r[2], c = (c0 + c1) / 2, z0 = o.z0, z1 = o.z1, t = .05;
  const ab = (mat, a0, a1, k0, k1, za, zb) => hz ? B.box(mat, a0, k0, za, a1, k1, zb) : B.box(mat, k0, a0, za, k1, a1, zb);
  const cab = (a0, a1, k0, k1, za, zb) => hz ? B.col(a0, k0, a1, k1, za, zb) : B.col(k0, a0, k1, a1, za, zb);
  const fr = o.frame || M.preto, d = .05;
  // marco
  ab(fr, a, a + t, c - d, c + d, z0, z1); ab(fr, b - t, b, c - d, c + d, z0, z1); ab(fr, a, b, c - d, c + d, z1 - t, z1);
  if (o.t === 'win' || o.t === 'fix') {
    ab(fr, a, b, c - d, c + d, z0, z0 + t);
    const n = Math.max(1, Math.round((b - a) / 1.1));
    for (let i = 1; i < n; i++) { const x = a + (b - a) * i / n; ab(fr, x - .02, x + .02, c - .03, c + .03, z0, z1); }
    ab(M.vidro, a + t, b - t, c - .008, c + .008, z0 + t, z1 - t);
    if (o.t === 'fix') cab(a, b, c0, c1, z0, z1);
    if (o.t === 'win' && o.z0 - (o.F || 0) > .3) ab(M.rebocoCinza, a - .03, b + .03, c0 - .03, c1 + .03, z0 - .04, z0);   // peitoril
  } else if (o.t === 'slide') {
    const m = (a + b) / 2, leaf = (a0, a1, k) => {
      ab(fr, a0, a0 + .04, k - .02, k + .02, z0, z1 - t); ab(fr, a1 - .04, a1, k - .02, k + .02, z0, z1 - t); ab(fr, a0, a1, k - .02, k + .02, z0, z0 + .05); ab(fr, a0, a1, k - .02, k + .02, z1 - t - .05, z1 - t);
      ab(M.vidro, a0 + .04, a1 - .04, k - .006, k + .006, z0 + .05, z1 - t - .05);
    };
    if (o.open === 'a') { leaf(m, b - t, c - .025); leaf(m + .06, b - t, c + .025); cab(m, b, c0, c1, z0, z1); }
    else { leaf(a + t, m, c - .025); leaf(a + t, m - .06, c + .025); cab(a, m, c0, c1, z0, z1); }
  } else if (o.t === 'door') {
    const w = b - a, h = (o.hinge === 'l' || o.hinge === 't') ? a + t : b - t - .04, s = (o.side === 's' || o.side === 'e') ? 1 : -1, f = s > 0 ? c1 : c0;
    ab(o.mat || M.branco, h, h + .04, Math.min(f, f + s * (w - .1)), Math.max(f, f + s * (w - .1)), z0 + .01, z1 - t);
    const hx = h + (o.hinge === 'l' || o.hinge === 't' ? .04 : -.03); ab(M.inox, hx, hx + .03, f + s * (w - .25) - .06, f + s * (w - .25) + .06, z0 + 1.0, z0 + 1.03);
  } else if (o.t === 'gar') {
    ab(o.mat || M.madeira, a + t, b - t, c - .03, c + .03, z0, z1 - t); cab(a, b, c0, c1, z0, z1);
  }
}

// platibanda com rufo sobre o perímetro de um retângulo
export function parapet(B, mat, u0, v0, u1, v1, z0, z1, th = .15, sides = 'nsew') {
  const R = []; if (sides.includes('n')) R.push([u0, v0, u1, v0 + th]); if (sides.includes('s')) R.push([u0, v1 - th, u1, v1]); if (sides.includes('w')) R.push([u0, v0, u0 + th, v1]); if (sides.includes('e')) R.push([u1 - th, v0, u1, v1]);
  for (const r of R) { B.box(mat, r[0], r[1], z0, r[2], r[3], z1); B.box(M.rufo, r[0] - .02, r[1] - .02, z1, r[2] + .02, r[3] + .02, z1 + .025); }
}
// ripado: réguas verticais ao longo de u (dir='u') ou v
export function slats(B, mat, dir, a0, a1, k0, k1, z0, z1, w = .04, gap = .05) {
  for (let a = a0; a + w <= a1 + 1e-6; a += w + gap) dir === 'u' ? B.box(mat, a, k0, z0, a + w, k1, z1) : B.box(mat, k0, a, z0, k1, a + w, z1);
}
