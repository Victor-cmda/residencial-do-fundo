// Residencial do Fundo — maquete 3D navegável
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makeMaterials, M } from './tex.js';
import { Builder } from './geo.js';
import { site } from './site.js';
import { lots } from './houses.js';
import { buildVeg } from './veg.js';

const $ = s => document.querySelector(s), qs = new URLSearchParams(location.search);
const mobile = matchMedia('(pointer: coarse)').matches;
let quality = qs.get('q') || (mobile ? 'leve' : 'alta'), hour = parseFloat(qs.get('h') || '10.5'), mode = 'orbit', labelsOn = qs.get('labels') !== '0';
const EYE = 1.65, D = Math.PI / 180;

// ---------- pontos de vista (x, altura, y da planta) ----------
const VIEWS = [
  ['Do alto', [
    ['geral', 'Visão geral', 'o', [-24, 40, 104], [17, 0, 42]],
    ['planta', 'Planta (de cima)', 'o', [17, 98, 40.4], [17, 0, 40]],
    ['lotes', 'Os 4 lotes', 'o', [16.5, 24, 40], [16.5, 2, 70]],
    ['quintais', 'Quintais, por trás do muro', 'o', [16.5, 17, 99], [16.5, 1, 76]],
    ['kitalto', 'Kitnets, do alto', 'o', [44, 26, 8], [19.5, 0, 36]]]],
  ['Caminhando', [
    ['portaria', 'Portaria e servidão', 'w', [3, -7], [3, 1.6, 20]],
    ['ruakit', 'Rua das kitnets', 'w', [19.5, 16.5], [19.5, 1.5, 50]],
    ['kitnet', 'Frente de uma kitnet', 'w', [19.2, 29.6], [10, 1.4, 28.6]],
    ['praca', 'Praça', 'w', [18.6, 55.2], [10.5, 1.2, 52.6]],
    ['rualotes', 'Rua dos lotes', 'w', [5.6, 58.3], [30, 1.9, 62.5]],
    ['lote1', 'Lote 1 · Sobrado', 'w', [2.4, 57.2], [3.6, 3.2, 66]],
    ['lote2', 'Lote 2 · Chalé', 'w', [10.5, 57.0], [12.2, 3.2, 68]],
    ['lote3', 'Lote 3 · Casa moderna', 'w', [19.0, 57.2], [21.0, 1.7, 68]],
    ['lote4', 'Lote 4 · Casa moderna', 'w', [27.2, 57.0], [29.2, 2.6, 67]]]],
  ['Interiores', [
    ['inkit', 'Kitnet (K3) · sala e cozinha', 'w', [13.5, 34.0], [8.6, 1.0, 33.0]],
    ['inkitq', 'Kitnet (K3) · quarto', 'w', [9.55, 37.45], [6.6, .7, 36.0]],
    ['insob', 'Sobrado · estar, jantar e cozinha', 'w', [6.0, 70.9], [2.2, 1.1, 76.5]],
    ['insup', 'Sobrado · suíte', 'w', [3.7, 69.4, 3.0], [1.0, 3.9, 66.6]],
    ['inq3', 'Sobrado · quarto 3', 'w', [3.75, 77.4, 3.0], [6.4, 3.7, 75.3]],
    ['incha', 'Chalé · estar', 'w', [13.6, 70.9, .45], [11.2, 2.6, 67.6]],
    ['inl3', 'Lote 3 · estar e varanda', 'w', [23.8, 73.6], [19.5, 1.2, 78.6]],
    ['inl4', 'Lote 4 · estar (pé-direito duplo)', 'w', [29.2, 72.2], [28.2, 2.6, 66.2]]]]];

// ---------- renderer, cena, câmera ----------
const box = $('#view');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: qs.has('shot') });
renderer.shadowMap.enabled = true; renderer.shadowMap.autoUpdate = false; renderer.shadowMap.type = THREE.PCFShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
box.appendChild(renderer.domElement);
const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(40, 1, .08, 4000);
scene.fog = new THREE.Fog(0xc8d6e4, 150, 1400);
let dirty = 4; const touch = () => { dirty = Math.max(dirty, 3); };

const sky = new Sky(); sky.scale.setScalar(3000); scene.add(sky);
const skyEnv = new Sky(); skyEnv.scale.setScalar(1000); const envScene = new THREE.Scene(); envScene.add(skyEnv);
const pmrem = new THREE.PMREMGenerator(renderer); let envRT = null;
for (const s of [sky, skyEnv]) { const u = s.material.uniforms; u.turbidity.value = 2.6; u.rayleigh.value = 1.4; u.mieCoefficient.value = .004; u.mieDirectionalG.value = .82; if (u.cloudCoverage) { u.cloudCoverage.value = .32; u.cloudDensity.value = .45; } }

const sun = new THREE.DirectionalLight(0xffffff, 4); sun.castShadow = true; sun.target.position.set(17, 0, 40); scene.add(sun, sun.target);
Object.assign(sun.shadow.camera, { left: -50, right: 50, top: 52, bottom: -52, near: 1, far: 420 }); sun.shadow.bias = -.0002; sun.shadow.normalBias = .035; sun.shadow.radius = 2.5; sun.shadow.camera.updateProjectionMatrix(); if (qs.has('ns')) sun.castShadow = false;
const hemi = new THREE.HemisphereLight(0xbfd6ff, 0x7a6a58, .9); scene.add(hemi);
// céu de crepúsculo/noite (o Sky físico fica preto com o sol abaixo do horizonte)
const dusk = (() => {
  const c = document.createElement('canvas'); c.width = 4; c.height = 256; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#060b1c'); gr.addColorStop(.42, '#0f1b3a'); gr.addColorStop(.5, '#2a3558'); gr.addColorStop(.56, '#0c1226'); gr.addColorStop(1, '#05070f'); g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.SphereGeometry(2400, 24, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, transparent: true, opacity: 0, fog: false, depthWrite: false, toneMapped: false })); m.renderOrder = -1; scene.add(m); return m;
})();
const pool = []; let lamps = [], decals = null, vegGroup = null, statics = [], B = null, composer = null, gtao = null;

// ---------- sol de Foz do Iguaçu (lat −25,5°) em meados de novembro ----------
function sunDir(h) {
  const lat = -25.5 * D, dec = -18.6 * D, H = ((h - .38) - 12) * 15 * D;
  const sa = Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H), alt = Math.asin(sa);
  let az = Math.acos(THREE.MathUtils.clamp((Math.sin(dec) - sa * Math.sin(lat)) / (Math.cos(alt) * Math.cos(lat)), -1, 1)); if (H > 0) az = 2 * Math.PI - az;
  return { v: new THREE.Vector3(Math.cos(alt) * Math.sin(az), sa, -Math.cos(alt) * Math.cos(az)), sa };
}
const ss = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
let night = 0, envTimer = 0;
function setHour(h) {
  renderer.shadowMap.needsUpdate = true; hour = h; const { v, sa } = sunDir(h), day = ss(-.03, .22, sa); night = 1 - ss(-.12, .06, sa);
  const dv = v.clone(); if (dv.y < .06) { dv.y = .06; dv.normalize(); }
  sun.position.copy(sun.target.position).addScaledVector(dv, 180);
  sun.color.setRGB(1, .62 + .34 * ss(0, .5, sa), .38 + .52 * ss(0, .55, sa)); sun.intensity = 4.2 * day + .12 * night; if (night > .6) sun.color.setRGB(.55, .68, 1);
  hemi.intensity = .07 + .3 * ss(-.1, .3, sa); hemi.color.setRGB(.62 + .12 * day, .74 + .08 * day, 1); hemi.groundColor.setRGB(.42, .36, .3).multiplyScalar(.4 + .6 * day);
  for (const s of [sky, skyEnv]) s.material.uniforms.sunPosition.value.copy(v);
  scene.fog.color.setRGB(.74, .82, .9).lerp(new THREE.Color(1, .72, .5), ss(.3, 0, sa) * (1 - night)).multiplyScalar(1 - night * .96);
  renderer.toneMappingExposure = .5 + .75 * ss(.45, 0, sa) * (1 - night) + .3 * night; dusk.material.opacity = night * .92; scene.environmentIntensity = .15 * (1 - night) + .05;
  M.vidro.emissiveIntensity = night * .85; M.led.emissiveIntensity = night * 4; M.lampada.emissiveIntensity = night * 3; M.farol.emissiveIntensity = .1; M.agua.emissive = new THREE.Color(0x2a9fc0); M.agua.emissiveIntensity = night * .5;
  if (qs.has('amb')) { const k = parseFloat(qs.get('amb')); hemi.intensity *= k; scene.environmentIntensity *= k; }
  if (decals) decals.material.opacity = night * .3;
  clearTimeout(envTimer); envTimer = setTimeout(() => { if (envRT) envRT.dispose(); envRT = pmrem.fromScene(envScene, 0, 1, 2000); scene.environment = envRT.texture; touch(); }, envRT ? 140 : 0);
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60); $('#hlabel').textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`; touch();
}

// ---------- construção ----------
function build() {
  makeMaterials(); B = new Builder(); site(B); lots(B); statics = B.build(scene); lamps = B.lamps;
  M.vidro.envMapIntensity = 7; M.agua.envMapIntensity = 5; M.vidroEscuro.envMapIntensity = 5; for (const k of ['carro1', 'carro2', 'carro3', 'carro4', 'carro5', 'inox', 'metal']) M[k].envMapIntensity = 4;
  // poças de luz (decalques aditivos) sob as luminárias externas
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 2, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,214,150,1)'); gr.addColorStop(.35, 'rgba(255,200,130,.45)'); gr.addColorStop(1, 'rgba(255,190,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const out = lamps.filter(l => !l.inside), cg = new THREE.CircleGeometry(1, 24); cg.rotateX(-Math.PI / 2);
  decals = new THREE.InstancedMesh(cg, new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0, fog: false }), out.length);
  out.forEach((l, i) => decals.setMatrixAt(i, new THREE.Matrix4().compose(new THREE.Vector3(l.p.x, .14, l.p.z), new THREE.Quaternion(), new THREE.Vector3(l.r, 1, l.r)))); decals.frustumCulled = false; decals.renderOrder = 3; scene.add(decals);
  for (let i = 0; i < 8; i++) { const p = new THREE.PointLight(0xffd6a0, 0, 16, 1.6); pool.push(p); scene.add(p); }
  buildPeople();
  // rótulos
  const L = $('#labels');
  for (const l of B.labels) { const e = document.createElement('div'); e.className = 'lb ' + l.kind; e.textContent = l.text; L.appendChild(e); l.el = e; }
}

function applyQuality() {
  const hi = quality === 'alta';
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, hi ? 2 : 1.25));
  sun.shadow.mapSize.set(hi ? 4096 : 2048, hi ? 4096 : 2048); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
  if (vegGroup) { scene.remove(vegGroup); vegGroup.traverse(o => { if (o.isInstancedMesh) o.dispose(); }); }
  vegGroup = buildVeg(scene, B, quality); renderer.shadowMap.needsUpdate = true;
  pool.forEach((p, i) => p.visible = hi || i < 3);
  document.querySelectorAll('#q button').forEach(b => b.classList.toggle('on', b.dataset.q === quality));
  resize();
}
function resize() {
  const w = box.clientWidth, h = box.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  if (composer) { composer.renderTarget1.dispose(); composer.renderTarget2.dispose(); composer = null; }
  if (quality === 'alta') {
    const pr = renderer.getPixelRatio(), rt = new THREE.WebGLRenderTarget(w * pr, h * pr, { type: THREE.HalfFloatType, samples: 4 });
    composer = new EffectComposer(renderer, rt); composer.addPass(new RenderPass(scene, camera));
    gtao = new GTAOPass(scene, camera, w * pr, h * pr); gtao.updateGtaoMaterial({ radius: .55, distanceExponent: 1.4, thickness: 1.2, scale: 1.15, samples: 16, distanceFallOff: 1, screenSpaceRadius: false });
    gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 }); gtao.blendIntensity = .9;
    composer.addPass(gtao); composer.addPass(new OutputPass());
  }
  touch();
}

// ---------- navegação ----------
const orbit = new OrbitControls(camera, renderer.domElement);
Object.assign(orbit, { enableDamping: true, dampingFactor: .09, maxPolarAngle: 1.53, minDistance: 1.5, maxDistance: 420, zoomSpeed: 1.1 });
orbit.addEventListener('change', touch);
const walk = { x: 3, z: -7, feet: 0, yaw: 0, pitch: 0, vx: 0, vz: 0, bob: 0 }, keys = {}, joy = { x: 0, y: 0 };
let tween = null;

function setMode(m) {
  if (m === mode) return; mode = m; orbit.enabled = m === 'orbit'; camera.fov = m === 'walk' ? 62 : 40; camera.updateProjectionMatrix(); walk.vx = walk.vz = 0; if (m !== 'walk' && document.pointerLockElement) document.exitPointerLock();
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.m === m));
  $('#joy').style.display = m === 'walk' && mobile ? 'block' : 'none';
  $('#hint').textContent = m === 'orbit' ? 'Arraste para girar · role para aproximar · clique duplo para ir até um ponto' : (mobile ? 'Joystick para andar · arraste para olhar' : 'Clique na cena para olhar com o mouse (Esc solta) · W A S D para andar · ← → para virar · Shift para correr');
  touch();
}
function lookFrom(px, py, pz, t) { const dx = t.x - px, dy = t.y - py, dz = t.z - pz; return { yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)) }; }
function goView(id, instant) {
  const v = VIEWS.flatMap(g => g[1]).find(e => e[0] === id); if (!v) return;
  const tgt = new THREE.Vector3(...v[4]);
  if (v[2] === 'o') { setMode('orbit'); fly(tgt.clone().add(new THREE.Vector3(...v[3]).sub(tgt).multiplyScalar(1.55)), tgt, instant, () => { orbit.target.copy(tgt); orbit.update(); }); }
  else {
    const feet = v[3][2] !== undefined ? v[3][2] : groundAt(v[3][0], v[3][1], 3.5 > 9 ? 0 : .3), pos = new THREE.Vector3(v[3][0], feet + EYE, v[3][1]);
    setMode('walk'); orbit.enabled = false;
    fly(pos, tgt, instant, () => { walk.x = pos.x; walk.z = pos.z; walk.feet = feet; Object.assign(walk, lookFrom(pos.x, pos.y, pos.z, tgt)); });
  }
  document.querySelectorAll('#go button').forEach(b => b.classList.toggle('cur', b.dataset.v === id)); $('#gosel').value = id;
}
function fly(pos, tgt, instant, done) {
  const p0 = camera.position.clone(), t0 = mode === 'orbit' ? orbit.target.clone() : p0.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(10));
  tween = { p0, t0, p1: pos, t1: tgt, t: instant ? 1 : 0, dur: 1.1, done };
}
function groundAt(x, z, feet) {
  let best = 0; for (const f of B.floors) if (x >= f.x0 && x <= f.x1 && z >= f.y0 && z <= f.y1) {
    let h = f.h; if (f.ramp) { const a = f.ramp.ax === 'x' ? x : z, t = THREE.MathUtils.clamp((a - f.ramp.a0) / (f.ramp.a1 - f.ramp.a0), 0, 1); h = f.ramp.h0 + (f.ramp.h1 - f.ramp.h0) * t; }
    if (h <= feet + .6 && h > best) best = h;
  } return best;
}
function collide(p, feet) {
  const R = .2, lo = feet + .5, hi = feet + 1.6;
  for (let k = 0; k < 2; k++) for (const c of B.colliders) {
    if (c[4] > hi || c[5] < lo || p.x < c[0] - R || p.x > c[2] + R || p.z < c[1] - R || p.z > c[3] + R) continue;
    const cx = THREE.MathUtils.clamp(p.x, c[0], c[2]), cz = THREE.MathUtils.clamp(p.z, c[1], c[3]); let dx = p.x - cx, dz = p.z - cz, d = Math.hypot(dx, dz);
    if (d >= R) continue;
    if (d > 1e-6) { p.x = cx + dx / d * R; p.z = cz + dz / d * R; }
    else { const e = [p.x - c[0], c[2] - p.x, p.z - c[1], c[3] - p.z], m = Math.min(...e); if (m === e[0]) p.x = c[0] - R; else if (m === e[1]) p.x = c[2] + R; else if (m === e[2]) p.z = c[1] - R; else p.z = c[3] + R; }
  }
}
function stepWalk(dt) {
  dt = Math.max(dt, .001);
  const f = (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0) + joy.y, sd = (keys.d ? 1 : 0) - (keys.a ? 1 : 0) + joy.x;
  const turn = (keys.arrowright ? 1 : 0) - (keys.arrowleft ? 1 : 0); if (turn) { walk.yaw += turn * 1.9 * dt; touch(); }
  const n = Math.hypot(f, sd), sp = n > 0 ? (keys.shift ? 5.5 : 2.3) * Math.min(1, n) / n : 0, sy = Math.sin(walk.yaw), cy = Math.cos(walk.yaw);
  const k = 1 - Math.exp(-dt * (n > 0 ? 9 : 14));   // aceleração e parada suaves
  walk.vx += ((sy * f + cy * sd) * sp - walk.vx) * k; walk.vz += ((-cy * f + sy * sd) * sp - walk.vz) * k;
  if (Math.hypot(walk.vx, walk.vz) > .02) {
    const p = { x: walk.x + walk.vx * dt, z: walk.z + walk.vz * dt }; collide(p, walk.feet); p.x = THREE.MathUtils.clamp(p.x, -250, 250); p.z = THREE.MathUtils.clamp(p.z, -250, 250);
    walk.vx = (p.x - walk.x) / dt; walk.vz = (p.z - walk.z) / dt; walk.x = p.x; walk.z = p.z; walk.bob += Math.hypot(walk.vx, walk.vz) * dt; touch();
  } else walk.vx = walk.vz = 0;
  const g = groundAt(walk.x, walk.z, walk.feet); if (Math.abs(g - walk.feet) > .002) { walk.feet += (g - walk.feet) * Math.min(1, dt * 12); touch(); }
  camera.position.set(walk.x, walk.feet + EYE + Math.sin(walk.bob * 4.4) * .014, walk.z); camera.rotation.set(walk.pitch, -walk.yaw, 0, 'YXZ');
}

// ponteiro: olhar (caminhar) e clique duplo
const cv = renderer.domElement; let drag = null;
cv.addEventListener('pointerdown', e => { if (mode === 'walk' && !document.pointerLockElement) { drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; cv.setPointerCapture(e.pointerId); } });
cv.addEventListener('pointermove', e => { if (drag && e.pointerId === drag.id) { walk.yaw -= (e.clientX - drag.x) * .0042; walk.pitch = THREE.MathUtils.clamp(walk.pitch + (e.clientY - drag.y) * .0042, -1.45, 1.45); drag.x = e.clientX; drag.y = e.clientY; touch(); } });
cv.addEventListener('pointerup', () => drag = null); cv.addEventListener('pointercancel', () => drag = null);
const ray = new THREE.Raycaster();
cv.addEventListener('dblclick', e => {
  const r = cv.getBoundingClientRect(), lk = document.pointerLockElement === cv; ray.setFromCamera(new THREE.Vector2(lk ? 0 : (e.clientX - r.left) / r.width * 2 - 1, lk ? 0 : -(e.clientY - r.top) / r.height * 2 + 1), camera);
  const hit = ray.intersectObjects(statics.filter(m => !m.material.transparent), false)[0]; if (!hit) return;
  if (mode === 'orbit') { const off = camera.position.clone().sub(orbit.target); off.setLength(Math.min(off.length(), 24)); const t = hit.point.clone(); fly(t.clone().add(off), t, false, () => { orbit.target.copy(t); orbit.update(); }); }
  else if (hit.face.normal.y > .7) { const f = hit.point.y, pos = new THREE.Vector3(hit.point.x, f + EYE, hit.point.z), t = pos.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(5)); fly(pos, t, false, () => { walk.x = pos.x; walk.z = pos.z; walk.feet = f; }); }
});
// olhar com o mouse preso (computador)
cv.addEventListener('click', () => { if (mode === 'walk' && !mobile && !measuring && !tween && !document.pointerLockElement && cv.requestPointerLock) cv.requestPointerLock(); });
document.addEventListener('mousemove', e => { if (document.pointerLockElement === cv && mode === 'walk') { walk.yaw += e.movementX * .0023; walk.pitch = THREE.MathUtils.clamp(walk.pitch - e.movementY * .0023, -1.45, 1.45); touch(); } });
document.addEventListener('pointerlockchange', () => { $('#cross').style.display = document.pointerLockElement === cv ? 'block' : 'none'; });
// trena: clique em dois pontos
let measuring = false, mlabel = null, dn = null; const mpts = [], mgrp = new THREE.Group(); scene.add(mgrp);
function mclear() { mgrp.clear(); mpts.length = 0; if (mlabel) { mlabel.el.remove(); B.labels.splice(B.labels.indexOf(mlabel), 1); mlabel = null; } touch(); }
function mpick(nx, ny) {
  ray.setFromCamera(new THREE.Vector2(nx, ny), camera); const hit = ray.intersectObjects(statics, false)[0]; if (!hit) return;
  if (mpts.length === 2) mclear();
  mpts.push(hit.point.clone()); const sp = new THREE.Mesh(new THREE.SphereGeometry(.05, 12, 8), new THREE.MeshBasicMaterial({ color: 0xe0452c, depthTest: false })); sp.position.copy(hit.point); sp.renderOrder = 9; mgrp.add(sp);
  if (mpts.length === 2) {
    const [a, b] = mpts, ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineBasicMaterial({ color: 0xe0452c, depthTest: false })); ln.renderOrder = 9; mgrp.add(ln);
    const fm = v => v.toFixed(2).replace('.', ','), el = document.createElement('div'); el.className = 'lb m';
    el.textContent = `${fm(a.distanceTo(b))} m  (horiz. ${fm(Math.hypot(a.x - b.x, a.z - b.z))} · vert. ${fm(Math.abs(a.y - b.y))})`; $('#labels').appendChild(el);
    mlabel = { text: '', p: a.clone().lerp(b, .5), kind: 'm', el }; B.labels.push(mlabel);
  }
  touch();
}
cv.addEventListener('pointerdown', e => { dn = [e.clientX, e.clientY]; });
cv.addEventListener('pointerup', e => { if (!measuring || !dn || Math.hypot(e.clientX - dn[0], e.clientY - dn[1]) > 5) return; const r = cv.getBoundingClientRect(), lk = document.pointerLockElement === cv; mpick(lk ? 0 : (e.clientX - r.left) / r.width * 2 - 1, lk ? 0 : -(e.clientY - r.top) / r.height * 2 + 1); });
// escala humana: silhuetas de 1,75 m que encaram a câmera
const people = new THREE.Group(); scene.add(people);
function buildPeople() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 374; const g = c.getContext('2d'); g.fillStyle = '#2f353b';
  g.beginPath(); g.arc(64, 24, 19, 0, 6.3); g.fill(); g.beginPath(); g.roundRect(30, 50, 68, 140, 14); g.fill(); g.beginPath(); g.roundRect(17, 54, 13, 122, 6); g.fill(); g.beginPath(); g.roundRect(98, 54, 13, 122, 6); g.fill();
  g.beginPath(); g.roundRect(37, 180, 25, 192, 6); g.fill(); g.beginPath(); g.roundRect(66, 180, 25, 192, 6); g.fill();
  const mat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), alphaTest: .5, side: THREE.DoubleSide }), geo = new THREE.PlaneGeometry(.6, 1.75); geo.translate(0, .875, 0);
  for (const [x, z, y] of [[15.8, 30, .1], [23.2, 44, .1], [12.2, 53.2, .1], [3, 5, 0], [10, 61.4, .1], [26, 61.4, .1], [6.1, 66.5, .08], [19.5, 22, 0], [12, 64.5, .06], [29.2, 64.8, .06]]) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; people.add(m); }
}
addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; if (mode === 'walk' && e.key.startsWith('Arrow')) e.preventDefault(); touch(); });
addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; }); addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
// joystick
const jz = $('#joy'), jk = $('#joy i'); let jid = null;
const jmove = e => { const r = jz.getBoundingClientRect(), dx = (e.clientX - r.left - r.width / 2) / (r.width / 2), dy = (e.clientY - r.top - r.height / 2) / (r.height / 2), n = Math.max(1, Math.hypot(dx, dy)); joy.x = dx / n; joy.y = -dy / n; jk.style.transform = `translate(${joy.x * 34}px,${-joy.y * 34}px)`; touch(); };
jz.addEventListener('pointerdown', e => { jid = e.pointerId; jz.setPointerCapture(jid); jmove(e); });
jz.addEventListener('pointermove', e => { if (e.pointerId === jid) jmove(e); });
for (const n of ['pointerup', 'pointercancel']) jz.addEventListener(n, () => { jid = null; joy.x = joy.y = 0; jk.style.transform = ''; });

// ---------- rótulos e luzes dinâmicas ----------
const v3 = new THREE.Vector3();
function updateLabels() {
  const w = box.clientWidth, h = box.clientHeight;
  for (const l of B.labels) {
    if (!labelsOn && l.kind !== 'm') { l.el.style.display = 'none'; continue; }
    v3.copy(l.p).project(camera); const d = camera.position.distanceTo(l.p), max = l.kind === 'm' ? 1e9 : l.kind === 'k' ? 70 : l.kind === 'l' ? 400 : 130;
    if (v3.z > 1 || v3.z < -1 || d > max || Math.abs(v3.x) > 1.05 || Math.abs(v3.y) > 1.05) { l.el.style.display = 'none'; continue; }
    l.el.style.display = 'block'; l.el.style.transform = `translate(-50%,-50%) translate(${(v3.x * .5 + .5) * w}px,${(-v3.y * .5 + .5) * h}px)`;
  }
}
function updatePool() {
  if (night < .02) { for (const p of pool) p.intensity = 0; return; }
  const near = lamps.map(l => [l, l.p.distanceToSquared(camera.position) * (l.inside ? .6 : 1)]).sort((a, b) => a[1] - b[1]);
  pool.forEach((p, i) => { const e = near[i]; if (!e || !p.visible) { p.intensity = 0; return; } p.position.copy(e[0].p); p.distance = e[0].r * 2.6; p.intensity = night * e[0].power * (e[0].inside ? 9 : 26); });
}

// ---------- laço ----------
let last = performance.now(), poolT = 0;
function frame(now) {
  requestAnimationFrame(frame); const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (tween) {
    tween.t = Math.min(1, tween.t + dt / tween.dur); const k = tween.t < 1 ? ss(0, 1, tween.t) : 1;
    camera.position.lerpVectors(tween.p0, tween.p1, k); camera.lookAt(v3.lerpVectors(tween.t0, tween.t1, k)); touch();
    if (tween.t >= 1) { const d = tween.done; tween = null; d && d(); }
  } else if (mode === 'orbit') orbit.update(); else stepWalk(dt);
  if (dirty <= 0) return; dirty--;
  if ((poolT -= 1) <= 0) { updatePool(); poolT = 6; }
  for (const q of people.children) q.rotation.y = Math.atan2(camera.position.x - q.position.x, camera.position.z - q.position.z);
  if (composer) composer.render(); else renderer.render(scene, camera);
  updateLabels();
}

// ---------- interface ----------
function ui() {
  const go = $('#go'), sel = $('#gosel');
  for (const [g, items] of VIEWS) {
    const h = document.createElement('h4'); h.textContent = g; go.appendChild(h); const og = document.createElement('optgroup'); og.label = g; sel.appendChild(og);
    for (const it of items) { const b = document.createElement('button'); b.textContent = it[1]; b.dataset.v = it[0]; b.onclick = () => goView(it[0]); go.appendChild(b); const o = document.createElement('option'); o.value = it[0]; o.textContent = it[1]; og.appendChild(o); }
  }
  sel.onchange = () => goView(sel.value);
  document.querySelectorAll('#nav button').forEach(b => b.onclick = () => {
    if (b.dataset.m === mode) return;
    if (b.dataset.m === 'walk') { const t = orbit.target; walk.x = THREE.MathUtils.clamp(t.x, .6, 33); walk.z = THREE.MathUtils.clamp(t.z, -20, 79); const p = { x: walk.x, z: walk.z }; collide(p, 0); walk.x = p.x; walk.z = p.z; walk.feet = groundAt(walk.x, walk.z, .3); const d = camera.getWorldDirection(new THREE.Vector3()); walk.yaw = Math.atan2(d.x, -d.z); walk.pitch = 0; setMode('walk'); }
    else { const d = camera.getWorldDirection(new THREE.Vector3()), t = camera.position.clone().addScaledVector(d, 8); t.y = 1; const p = camera.position.clone().addScaledVector(d, -14); p.y += 12; setMode('orbit'); fly(p, t, false, () => { orbit.target.copy(t); orbit.update(); }); }
  });
  document.querySelectorAll('#q button').forEach(b => b.onclick = () => { if (quality !== b.dataset.q) { quality = b.dataset.q; applyQuality(); } });
  const hs = $('#hour'); hs.value = hour; hs.oninput = () => setHour(parseFloat(hs.value));
  const mb = $('#mbtn'); mb.onclick = () => { measuring = !measuring; mb.classList.toggle('on', measuring); if (!measuring) mclear(); else if (document.pointerLockElement) document.exitPointerLock(); };
  const pb = $('#pbtn'); pb.onclick = () => { people.visible = !people.visible; pb.classList.toggle('on', people.visible); touch(); };
  const lb = $('#lbtn'); lb.classList.toggle('on', labelsOn); lb.onclick = () => { labelsOn = !labelsOn; lb.classList.toggle('on', labelsOn); touch(); };
  $('#gotoggle').onclick = () => $('#go').classList.toggle('open');
  addEventListener('resize', resize);
}

setTimeout(() => {
  try {
    build(); ui(); applyQuality(); setHour(hour); mode = ''; goView(qs.get('v') || 'geral', true);
    if (qs.get('ui') === '0') { document.body.classList.add('noui'); labelsOn = qs.get('labels') === '1'; resize(); }
    $('#load').remove(); requestAnimationFrame(frame); setInterval(touch, 1500);
    window.__ready = true;
    if (qs.has('sim')) {   // testes de caminhada: colisão, portas e escadas
      const sim = (name, x, z, feet, legs) => { const p = { x, z }; for (const [yaw, dist] of legs) { const sy = Math.sin(yaw * D), cy = Math.cos(yaw * D); for (let i = 0; i < dist / .04; i++) { p.x += sy * .04; p.z -= cy * .04; collide(p, feet); feet = groundAt(p.x, p.z, feet); } } console.log('SIM', name, p.x.toFixed(2), p.z.toFixed(2), 'feet', feet.toFixed(2)); };
      sim('kitnet-porta', 16, 34.1, 0, [[-90, 9]]); sim('kitnet-parede', 16, 34.95, 0, [[-90, 7]]); sim('kitnet-quarto', 9.1, 34.3, .1, [[180, 2.5]]); sim('sobrado-escada', 1.75, 74.0, .15, [[0, 4], [-90, 1.2], [180, 3.2]]);
      sim('sobrado-entrada', 6.1, 62.5, 0, [[180, 9]]); sim('chale-escada', 8.25 + 4.25, 62 + 10.6, .45, [[180, 3], [-90, 1.1], [0, 2.6]]); sim('muro', 3, 78, 0, [[180, 6]]); sim('lote4-porta', 24.75 + 2.35, 62 + 1, 0, [[180, 6]]);
      const op = statics.filter(m => !m.material.transparent), span = (name, exp, x, y, z, ax) => { let t = 0; for (const sg of [1, -1]) { const d = new THREE.Vector3(); d[ax] = sg; ray.set(new THREE.Vector3(x, y, z), d); t += ray.intersectObjects(op, false)[0].distance; } console.log('MED', name, 'modelo', t.toFixed(2), 'planta', exp); };
      span('sobrado estar largura', '6.45', 4.5, 2.6, 74.5, 'x'); span('sobrado pe-direito terreo', '2.70', 3.3, 1.5, 74.0, 'y'); span('sobrado pe-direito superior', '2.70', 3.0, 4.3, 68.0, 'y'); span('sobrado suite comprimento', '3.50', 3.0, 5.6, 68.0, 'z'); span('sobrado quarto 2 largura', '3.00', 1.5, 5.6, 62 + 15.4, 'x'); span('sobrado quarto 3 largura', '3.30', 5, 5.6, 62 + 15.4, 'x'); span('sobrado terreo comprimento', '7.70', 6.2, 2.6, 62 + 12, 'z');
      span('kitnet sala largura', '2.95', 12.83, .7, 33.4, 'z'); span('kitnet pe-direito', '2.70', 12.83, 1.2, 33.4, 'y'); span('kitnet quarto largura', '2.60', 8.55, 1.2, 36.6, 'z'); span('kitnet quarto comprimento', '3.70', 9.2, 2.4, 36.9, 'x');
      span('muro oeste a cerca viva', '33.25', 16, 1.0, 59.5, 'x'); span('lote 3 estar comprimento', '6.45', 16.5 + 4.9, 2.5, 62 + 13, 'x'); span('lote 4 pe-direito duplo', '5.00', 24.75 + 3.4, 2.5, 62 + 7.8, 'y'); span('rua central entre fachadas', '11.00', 19.5, 2.65, 34.2, 'x');
    } if (qs.has('dbg')) console.log('DBG', JSON.stringify({ i: sun.intensity, p: sun.position.toArray(), c: sun.color.toArray(), hemi: hemi.intensity, exp: renderer.toneMappingExposure, tris: renderer.info.render.triangles, calls: renderer.info.render.calls, n: night }));
  } catch (err) { $('#load').textContent = 'Erro ao montar a maquete: ' + err.message; console.error(err); }
}, 30);
