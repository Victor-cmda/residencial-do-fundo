// Texturas procedurais (cor + relevo) e materiais. Tudo gerado em canvas, sem arquivos externos.
import * as THREE from 'three';

export function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// ruído de valor periódico (tileable)
function noiseGrid(p, seed) { const r = rng(seed), g = new Float32Array(p * p); for (let i = 0; i < g.length; i++) g[i] = r(); return g; }
function vnoise(g, p, x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const i0 = ((xi % p) + p) % p, i1 = (i0 + 1) % p, j0 = ((yi % p) + p) % p, j1 = (j0 + 1) % p;
  const a = g[j0 * p + i0], b = g[j0 * p + i1], c = g[j1 * p + i0], d = g[j1 * p + i1];
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
function fbm(seed, oct = [4, 8, 16, 32]) {
  const gs = oct.map((p, i) => [noiseGrid(p, seed + i * 17), p]);
  return (u, v) => { let s = 0, w = 0, a = 1; for (const [g, p] of gs) { s += a * vnoise(g, p, u * p, v * p); w += a; a *= .5; } return s / w; };
}

const N = 512;
// fn(u,v,x,y) -> [r,g,b,h]  (u,v em 0..1; h = altura 0..1)
function gen(fn, strength = 2, n = N) {
  const c = document.createElement('canvas'), nm = document.createElement('canvas'); c.width = c.height = nm.width = nm.height = n;
  const cx = c.getContext('2d'), nx = nm.getContext('2d'), id = cx.createImageData(n, n), nd = nx.createImageData(n, n), H = new Float32Array(n * n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const o = fn(x / n, y / n, x, y), i = (y * n + x) * 4;
    id.data[i] = o[0]; id.data[i + 1] = o[1]; id.data[i + 2] = o[2]; id.data[i + 3] = 255; H[y * n + x] = o[3];
  }
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const l = H[y * n + (x + n - 1) % n], r = H[y * n + (x + 1) % n], u = H[((y + n - 1) % n) * n + x], d = H[((y + 1) % n) * n + x];
    let dx = (l - r) * strength * n / 128, dy = (u - d) * strength * n / 128; const k = 1 / Math.hypot(dx, dy, 1), i = (y * n + x) * 4;
    nd.data[i] = (dx * k * .5 + .5) * 255; nd.data[i + 1] = (-dy * k * .5 + .5) * 255; nd.data[i + 2] = (k * .5 + .5) * 255; nd.data[i + 3] = 255;
  }
  cx.putImageData(id, 0, 0); nx.putImageData(nd, 0, 0);
  const t = new THREE.CanvasTexture(c), tn = new THREE.CanvasTexture(nm);
  t.colorSpace = THREE.SRGBColorSpace; for (const k of [t, tn]) { k.wrapS = k.wrapT = THREE.RepeatWrapping; k.anisotropy = 8; }
  return [t, tn];
}
const mix = (a, b, t) => a + (b - a) * t;
const col = (c, k) => [c[0] * k, c[1] * k, c[2] * k];

// padrão de tijolos/blocos: cols x rows por tile, amarração de meio bloco; devolve [id, borda]
function brick(u, v, cols, rows, joint) {
  const ry = v * rows, row = Math.floor(ry), fy = ry - row; const rx = u * cols + (row % 2) * .5, cx = Math.floor(rx), fx = rx - cx;
  const e = Math.min(fx, 1 - fx) * (1 / cols) , f = Math.min(fy, 1 - fy) * (1 / rows);
  const edge = Math.min(e, f) < joint ? 0 : Math.min(1, (Math.min(e, f) - joint) / joint);
  return [((cx % cols) + cols) % cols + row * 31, edge];
}
function hash(i) { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

export const M = {};
function std(name, tex, tile, rough = .9, extra = {}) {
  const m = new THREE.MeshStandardMaterial({ map: tex ? tex[0] : null, normalMap: tex ? tex[1] : null, roughness: rough, metalness: 0, ...extra });
  m.userData.tile = tile; m.name = name; M[name] = m; return m;
}

export function makeMaterials() {
  const f1 = fbm(1), f2 = fbm(2, [8, 16, 32, 64]), f3 = fbm(3, [2, 4, 8, 16]), f4 = fbm(4, [32, 64, 128]);
  const grain = (u, v) => f4(u, v);
  // reboco claro
  std('reboco', gen((u, v) => { const n = f2(u, v), g = grain(u, v), k = .93 + n * .07 + (g - .5) * .05; return [...col([240, 236, 228], k), g * .6 + n * .4]; }, .55), 2.2, .93);
  std('rebocoCinza', gen((u, v) => { const n = f2(u, v), g = grain(u, v), k = .92 + n * .08 + (g - .5) * .05; return [...col([186, 184, 180], k), g * .6 + n * .4]; }, 1.2), 2.2, .93);
  std('grafite', gen((u, v) => { const n = f2(u, v), g = grain(u, v), k = .9 + n * .1 + (g - .5) * .08; return [...col([70, 73, 78], k), g * .5 + n * .5]; }, 1), 2, .8);
  // bloco de concreto (0,40 x 0,20)
  const bloco = (base, dirt) => gen((u, v) => {
    const [id, e] = brick(u, v, 2, 4, .006); const k = (.86 + hash(id) * .16) * (.94 + grain(u, v) * .1) - f3(u, v) * dirt;
    return e < 1 ? [...col(base, .72 + e * .2), e * .5] : [...col(base, k), .7 + grain(u, v) * .3];
  }, 2.5);
  std('bloco', bloco([176, 174, 168], .08), .8, .95);
  std('blocoVelho', bloco([150, 146, 138], .28), .8, .97);
  // paver
  const paver = (base) => gen((u, v) => {
    const [id, e] = brick(u, v, 4, 8, .0035); const h = hash(id), k = (.82 + h * .22) * (.93 + grain(u, v) * .12) * (.95 + f3(u, v) * .08);
    const c = [base[0] + (h - .5) * 14, base[1] + (h - .5) * 8, base[2]];
    return e < 1 ? [...col(c, .6 + e * .25), e * .6] : [...col(c, k), .75 + grain(u, v) * .25];
  }, 2.2);
  std('paver', paver([172, 160, 146]), .8, .92);
  std('paverEscuro', paver([98, 98, 100]), .8, .9);
  // concreto de calçada (placas 1,2 m)
  std('concreto', gen((u, v) => {
    const j = Math.min(Math.abs(((u * 2) % 1) - .0), Math.abs(((v * 2) % 1) - .0), 1 - (u * 2) % 1, 1 - (v * 2) % 1) < .006 ? 0 : 1;
    const k = .9 + f2(u, v) * .1 + (grain(u, v) - .5) * .09; return j ? [...col([205, 203, 197], k), .7 + grain(u, v) * .3] : [150, 148, 143, .2];
  }, 1.6), 2.4, .95);
  std('lajeTopo', gen((u, v) => { const k = .85 + f2(u, v) * .15 + (grain(u, v) - .5) * .12; return [...col([168, 168, 166], k), grain(u, v)]; }, 1.5), 2, .95);
  // grama
  std('grama', gen((u, v) => {
    const a = f1(u, v), b = f2(u, v), g = grain(u, v); const k = .7 + a * .35 + (g - .5) * .35;
    return [(58 + b * 40) * k, (104 + b * 38) * k, (34 + a * 22) * k, g * .7 + b * .3];
  }, 3), 3, 1);
  // terra roxa
  std('terra', gen((u, v) => { const a = f1(u, v), g = grain(u, v), k = .74 + a * .3 + (g - .5) * .2; return [116 * k, 66 * k, 50 * k, g * .5 + a * .5]; }, 2.5), 5, 1);
  // soja em linhas
  std('soja', gen((u, v) => {
    const row = Math.abs(((u * 12) % 1) - .5) * 2, a = f2(u, v), b = f3(u, v), g = grain(u, v); const leaf = row < .8 + a * .2 ? 1 : 0, k = (.5 + g * .45) * (.75 + b * .4);
    return leaf ? [(58 + a * 22) * k, (98 + a * 26) * k, (42 + b * 10) * k, .5 + g * .5 * (1 - row * .5)] : [78, 46, 34, .1];
  }, 3), 6, 1);
  // madeira (tábuas verticais nas paredes) e deck
  const wood = (base, planks, vertical) => gen((u, v) => {
    const a = vertical ? u : v, b = vertical ? v : u; const p = a * planks, id = Math.floor(p), fp = p - id, h = hash(id + 3);
    const gr = Math.sin((b * 9 + f1(a * 2 + id * .37, b * .5) * 16) * (1 + h * .5)) * .5 + .5, k = (.84 + h * .2) * (.95 + gr * .06) * (.95 + grain(u, v) * .08);
    const e = Math.min(fp, 1 - fp) < .03; return e ? [...col(base, .5), .3] : [...col(base, k), .88 + gr * .12];
  }, 1.2);
  std('madeira', wood([158, 106, 62], 8, true), 1.0, .78);
  std('madeiraClara', wood([196, 152, 104], 8, true), 1.0, .8);
  std('deck', wood([150, 108, 70], 10, false), 1.4, .82);
  std('pisoMadeira', wood([172, 128, 86], 8, false), 1.6, .6);
  // pedra (filetes)
  std('pedra', gen((u, v) => {
    const rows = 10, ry = v * rows, row = Math.floor(ry), fy = ry - row, off = hash(row) * 3, w = 2 + Math.floor(hash(row + 9) * 3);
    const rx = u * w + off, id = Math.floor(rx) + row * 17, fx = rx - Math.floor(rx), h = hash(id);
    const e = Math.min(fx * (1 / w), (1 - fx) * (1 / w), fy / rows, (1 - fy) / rows) < .004;
    const k = (.72 + h * .34) * (.9 + grain(u, v) * .16); const c = [168 + (h - .5) * 30, 158 + (h - .5) * 22, 142 + (h - .5) * 16];
    return e ? [70, 66, 60, 0] : [...col(c, k), .5 + h * .5];
  }, 4), 1.2, .95);
  // telha shingle grafite
  std('shingle', gen((u, v) => {
    const [id, e] = brick(u, v, 5, 6, .003); const fy = (v * 6) % 1, k = (.75 + hash(id) * .3) * (.9 + grain(u, v) * .2) * (.8 + fy * .25);
    return e < 1 ? [38, 38, 40, .1] : [...col([82, 82, 86], k), fy];
  }, 3), 1.2, .9);
  // brita
  std('brita', gen((u, v) => { const g = grain(u, v), a = f2(u * 2, v * 2), k = .72 + g * .4; return [(206 + (a - .5) * 30) * k, (200 + (a - .5) * 26) * k, 188 * k, g]; }, 4), 1.2, 1);
  // porcelanato 80x80
  std('porcelanato', gen((u, v) => {
    const fx = (u * 2) % 1, fy = (v * 2) % 1, e = Math.min(fx, 1 - fx, fy, 1 - fy) < .004; const k = .96 + f1(u, v) * .05;
    return e ? [170, 166, 160, 0] : [...col([226, 220, 210], k), 1];
  }, .6), 1.6, .35);
  std('azulejo', gen((u, v) => { const fx = (u * 8) % 1, fy = (v * 8) % 1, e = Math.min(fx, 1 - fx, fy, 1 - fy) < .03; return e ? [160, 190, 200, 0] : [...col([92, 170, 196], .92 + f2(u, v) * .1), 1]; }, 1), 1.6, .3);
  // folhagem
  const f5 = fbm(9, [16, 32, 64]); const leaf = (base) => gen((u, v) => { const a = f2(u, v), g = f5(u, v), s = g > .52 ? 1 : .55, k = (.6 + g * .6) * s; return [(base[0] + a * 34) * k, (base[1] + a * 30) * k, (base[2] + a * 14) * k, g * s]; }, 7, 256);
  std('folha', leaf([150, 170, 120]), 1.2, 1); std('folhaEscura', leaf([30, 62, 34]), 1.2, 1); std('cercaViva', leaf([52, 92, 44]), .8, 1);
  std('tronco', gen((u, v) => { const g = Math.sin(u * 80 + f1(u, v) * 20) * .5 + .5, k = .7 + g * .3 + grain(u, v) * .15; return [104 * k, 82 * k, 62 * k, g]; }, 3, 256), 1, 1);
  // lisos
  std('branco', null, 1, .9, { color: 0xf4f2ee });
  std('preto', null, 1, .45, { color: 0x1b1c1e, metalness: .6 });
  std('metal', null, 1, .35, { color: 0x9a9da1, metalness: .9 });
  std('rufo', null, 1, .4, { color: 0x3a3c40, metalness: .8 });
  std('inox', null, 1, .25, { color: 0xc8ccd0, metalness: 1 });
  std('louca', null, 1, .15, { color: 0xfafafa });
  std('tecido', null, 1, 1, { color: 0x8d9aa5 });
  std('tecidoClaro', null, 1, 1, { color: 0xe6e1d8 });
  std('colchao', null, 1, 1, { color: 0xf3f1ec });
  std('bancada', null, 1, .25, { color: 0x2b2c2e });
  std('pneu', null, 1, .9, { color: 0x151515 });
  std('lixoAzul', null, 1, .5, { color: 0x2f6fb0 }); std('lixoVerde', null, 1, .5, { color: 0x3c8f4a });
  std('vidro', null, 1, .03, { color: 0x6f8790, metalness: .9, transparent: true, opacity: .38, emissive: 0xffc98a, emissiveIntensity: 0, depthWrite: false, side: THREE.DoubleSide });
  std('vidroEscuro', null, 1, .05, { color: 0x10161a, metalness: .6 });
  const wn = gen((u, v) => { const a = f2(u, v), b = f1(u, v); return [0, 0, 0, a * .6 + b * .4]; }, 1.2, 256)[1];
  std('agua', [null, wn], 1.6, .06, { color: 0x3fa7c4, metalness: .2, transparent: true, opacity: .86 }); M.agua.map = null;
  std('led', null, 1, .5, { color: 0xfff1d6, emissive: 0xffe2b0, emissiveIntensity: 0 });
  std('lampada', null, 1, .5, { color: 0xffffff, emissive: 0xfff0d0, emissiveIntensity: 0 });
  std('farol', null, 1, .2, { color: 0xf5f5f0, emissive: 0xffffff, emissiveIntensity: .1 });
  std('lanterna', null, 1, .3, { color: 0x9a1616, emissive: 0xff2020, emissiveIntensity: .15 });
  for (const [n, c] of [['carro1', 0xe9e9ea], ['carro2', 0x2b3a4a], ['carro3', 0x7d1f22], ['carro4', 0x8f9498], ['carro5', 0x1d1e20]]) std(n, null, 1, .28, { color: c, metalness: .55 });
  for (const m of [M.vidro, M.agua, M.led, M.lampada]) m.userData.noShadow = true;
  M.vidro.userData.noAO = true;
  // textura de lâminas (grama/capim) e de folha de palmeira, com alfa
  M.tufo = alphaMat(bladeTex(0x6f9a45, 0x3f6a2a, 46), .5);
  M.capim = alphaMat(bladeTex(0xc9b46a, 0x7d8a40, 34), .5);
  M.palma = alphaMat(frondTex(), .4);
  M.copa = foliageMat(leafTex(), .42);
  return M;
}
function alphaMat(tex, alphaTest) {
  const m = new THREE.MeshStandardMaterial({ map: tex, alphaTest, side: THREE.DoubleSide, roughness: 1 }); m.userData.noShadow = false; return m;
}
function leafTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), r = rng(31);
  for (let i = 0; i < 150; i++) {
    const a = r() * 6.28, d = Math.sqrt(r()) * 112, x = 128 + Math.cos(a) * d, y = 128 + Math.sin(a) * d, l = 13 + r() * 13, w = l * (.34 + r() * .2), k = .55 + r() * .6;
    g.save(); g.translate(x, y); g.rotate(r() * 6.28); g.fillStyle = `rgb(${Math.round(150 * k)},${Math.round(178 * k)},${Math.round(118 * k)})`;
    g.beginPath(); g.ellipse(0, 0, l, w, 0, 0, 6.29); g.fill(); g.strokeStyle = `rgba(60,80,40,.55)`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-l, 0); g.lineTo(l, 0); g.stroke(); g.restore();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
// folhagem em cartões: normais "esféricas" (a partir do centro da copa) para a luz ficar macia, sem inverter no verso
function foliageMat(tex, alphaTest) {
  const m = new THREE.MeshStandardMaterial({ map: tex, alphaTest, side: THREE.DoubleSide, roughness: .95 });
  m.onBeforeCompile = sh => {
    sh.vertexShader = 'attribute vec3 aC;\n' + sh.vertexShader.replace('#include <defaultnormal_vertex>', 'vec3 transformedNormal = normalMatrix * normalize(instanceMatrix[3].xyz - aC + vec3(0.,.3,0.));');
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', THREE.ShaderChunk.normal_fragment_begin.replace('normal *= faceDirection;', ''));
  };
  return m;
}
function bladeTex(c1, c2, n) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), r = rng(n);
  for (let i = 0; i < n; i++) {
    const x = 20 + r() * 216, h = 90 + r() * 160, lean = (r() - .5) * 90, w = 3 + r() * 5;
    const gr = g.createLinearGradient(0, 256, 0, 256 - h); gr.addColorStop(0, '#' + c2.toString(16).padStart(6, '0')); gr.addColorStop(1, '#' + c1.toString(16).padStart(6, '0'));
    g.fillStyle = gr; g.beginPath(); g.moveTo(x - w, 256); g.quadraticCurveTo(x + lean * .3, 256 - h * .6, x + lean, 256 - h); g.quadraticCurveTo(x + lean * .4, 256 - h * .5, x + w, 256); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function frondTex() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 512; const g = c.getContext('2d');
  g.strokeStyle = '#4a6a2a'; g.lineWidth = 5; g.beginPath(); g.moveTo(64, 512); g.lineTo(64, 6); g.stroke();
  for (let i = 0; i < 46; i++) {
    const y = 500 - i * 10.6, l = 58 * Math.sin(Math.PI * (i + 3) / 52) + 6; g.fillStyle = i % 2 ? '#3f7a2c' : '#4d8a32';
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(64, y); g.lineTo(64 + s * l, y - 26); g.lineTo(64 + s * l * .9, y - 16); g.lineTo(64, y + 7); g.fill(); }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
