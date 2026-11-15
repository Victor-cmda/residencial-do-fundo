// Gera o index.html da maquete do Sobrado Opção B (arquivo único, abre sem servidor).
// Reaproveita o motor (texturas, geometria, vegetação, navegação) e o three.js de ../contexto-3d/maquete.
// Uso: node build.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url)), base = join(here, '..', 'contexto-3d', 'maquete');
const { build } = createRequire(import.meta.url)(join(base, 'node_modules', 'esbuild'));

// app.js e template.html são derivados do projeto principal, com as trocas abaixo
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('trecho não encontrado: ' + a.slice(0, 60)); return s.replace(a, b); };
const cut = (s, a, b, n) => { const i = s.indexOf(a), j = s.indexOf(b, i); if (i < 0 || j < 0) throw new Error('bloco não encontrado: ' + a.slice(0, 40)); return s.slice(0, i) + n + s.slice(j); };
let app = readFileSync(join(base, 'src', 'app.js'), 'utf8');
const S = '../../contexto-3d/maquete/src/';
app = rep(app, "from './tex.js'", `from '${S}tex.js'`); app = rep(app, "from './geo.js'", `from '${S}geo.js'`); app = rep(app, "from './veg.js'", `from '${S}veg.js'`);
app = rep(app, "import { site } from './site.js';", "import { houseB, CARS } from './houseB.js';"); app = rep(app, "import { lots } from './houses.js';", '');
app = cut(app, 'const VIEWS = [', '// ---------- renderer, cena, câmera ----------', `const VIEWS = [
  ['Do alto', [
    ['geral', 'Visão geral', 'o', [-9, 9, -11], [4, 2.5, 8]],
    ['fundo', 'Fundos e quintal', 'o', [14, 9, 27], [4, 2, 12]],
    ['plt', 'Planta do térreo (decorada)', 'o', [4.1, 20, 9.7], [4.1, 0, 9.3], 1],
    ['pls', 'Planta do superior (decorada)', 'o', [3.4, 17, 9.7], [3.4, 3, 9.3], 2],
    ['iso1', 'Térreo em perspectiva (sem laje)', 'o', [-5, 13, 23], [4.1, 0, 9], 1],
    ['iso2', 'Superior em perspectiva (sem cobertura)', 'o', [-5, 15, 23], [3.6, 3, 9], 2]]],
  ['Caminhando', [
    ['frente', 'Fachada', 'w', [4.4, -5.6], [4.1, 3.1, 3]],
    ['garagem', 'Garagem · Corsa e Cerato', 'w', [2.72, 8.25, .05], [6.6, .7, 4.6]],
    ['hall', 'Hall de entrada', 'w', [1.45, 5.3, .15], [1.5, 1.4, 10]],
    ['jantar', 'Sala de jantar', 'w', [1.75, 9.1, .15], [4.6, 1.0, 11.4]],
    ['estar', 'Sala de estar', 'w', [4.3, 11.7, .15], [.9, .9, 14.6]],
    ['coz', 'Cozinha', 'w', [5.45, 14.3, .15], [7.7, 1.0, 10.8]],
    ['deck', 'Deck e quintal', 'w', [.55, 17.5], [5, 1.3, 15.4]],
    ['suite', 'Suíte master', 'w', [1.9, 6.35, 3.0], [6.1, 3.8, 4.3]],
    ['escr', 'Escritório', 'w', [2.9, 10.95, 3.0], [1.2, 3.7, 15.2]],
    ['q2', 'Quarto 2', 'w', [3.7, 12.3, 3.0], [6.3, 3.6, 14.3]]]]];

`);
app = rep(app, 'site(B); lots(B);', 'houseB(B);');
app = rep(app, 'sun.target.position.set(17, 0, 40)', 'sun.target.position.set(4.1, 0, 9)');
app = rep(app, 'left: -50, right: 50, top: 52, bottom: -52', 'left: -19, right: 19, top: 19, bottom: -19');
app = cut(app, 'for (const [x, z, y] of [[15.8, 30, .1]', ' { const m = new THREE.Mesh(geo, mat);', 'for (const [x, z, y] of [[-1.6, -.6, .1], [9.6, -3.2, 0], [1.6, 16.6, .12]])');
app = rep(app, 'walk.x = THREE.MathUtils.clamp(t.x, .6, 33); walk.z = THREE.MathUtils.clamp(t.z, -20, 79);', 'walk.x = THREE.MathUtils.clamp(t.x, -8, 16); walk.z = THREE.MathUtils.clamp(t.z, -7, 17.7);');
app = cut(app, "    if (qs.has('sim')) {", '  } catch (err)', `    if (qs.has('sim')) {
      const sim = (name, x, z, feet, legs) => { const p = { x, z }; for (const [yaw, dist] of legs) { const sy = Math.sin(yaw * D), cy = Math.cos(yaw * D); for (let i = 0; i < dist / .04; i++) { p.x += sy * .04; p.z -= cy * .04; collide(p, feet); feet = groundAt(p.x, p.z, feet); } } console.log('SIM', name, p.x.toFixed(2), p.z.toFixed(2), 'feet', feet.toFixed(2)); };
      sim('entrada-ate-a-sala', 1.6, -.6, .1, [[180, 11.5]]); sim('escada', .65, 4.6, .15, [[180, 5.6]]); sim('hall-para-garagem', 1.75, 7.8, .15, [[90, 2.5]]); sim('portao-fechado', 5, -.6, .1, [[180, 6]]); sim('cozinha', 4.4, 11.45, .15, [[90, 2]]);
      const op = statics.filter(m => !m.material.transparent), span = (name, exp, x, y, z, ax) => { let t = 0; for (const sg of [1, -1]) { const d = new THREE.Vector3(); d[ax] = sg; ray.set(new THREE.Vector3(x, y, z), d); t += ray.intersectObjects(op, false)[0].distance; } console.log('MED', name, 'modelo', t.toFixed(2), 'planta', exp); };
      span('garagem largura', '5.70', 5.25, 2.2, 6, 'x'); span('garagem comprimento', '5.45', 5.25, 2.65, 6, 'z'); span('estar largura', '4.70', 2.5, 2.7, 12.4, 'x'); span('estar+jantar comprimento', '6.60', 3.4, 2.7, 12, 'z');
      span('cozinha largura', '3.10', 6.5, 2.7, 13, 'x'); span('cozinha comprimento', '4.95', 6.9, 2.7, 13, 'z'); span('pe-direito terreo', '2.69', 3.5, 1.5, 12.2, 'y');
      span('suite largura', '5.20', 3.5, 5.4, 5.5, 'x'); span('suite comprimento', '3.60', 3.5, 5.55, 5.5, 'z'); span('escritorio largura', '3.05', 1.6, 5.5, 13, 'x'); span('escritorio comprimento', '4.80', 1.6, 5.5, 13, 'z'); span('quarto 2 largura', '3.25', 5, 5.5, 14.6, 'x');
      for (const c of CARS) console.log('CAR', c.nome, c.L, c.W, c.H, 'entre-eixos', c.wb);
    }
`);
// corte horizontal para ver a planta decorada
app = rep(app, '// ---------- navegação ----------', `let cutH = 0, capMesh = null;
function setCut(c) {
  cutH = [0, 1.75, 4.6][c]; if (capMesh) { scene.remove(capMesh); capMesh.geometry.dispose(); capMesh = null; }
  if (c) {   // paredes cortadas preenchidas (poché), como em planta baixa
    const pos = [], y = cutH - .004; for (const k of B.caps) if (k[4] < cutH && k[5] > cutH) { const a = Math.min(k[0], k[2]), b = Math.max(k[0], k[2]), d = Math.min(k[1], k[3]), e = Math.max(k[1], k[3]); pos.push(a, y, d, a, y, e, b, y, e, a, y, d, b, y, e, b, y, d); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); capMesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x2b2d30 })); scene.add(capMesh);
  } renderer.clippingPlanes = c ? [new THREE.Plane(new THREE.Vector3(0, -1, 0), cutH)] : []; sun.castShadow = !c; renderer.shadowMap.needsUpdate = true;
  document.querySelectorAll('#cut button').forEach(b => b.classList.toggle('on', +b.dataset.c === c)); touch();
}
// ---------- navegação ----------`);
app = rep(app, "const tgt = new THREE.Vector3(...v[4]);", "const tgt = new THREE.Vector3(...v[4]); setCut(v[5] || 0);");
app = rep(app, "if (!labelsOn && l.kind !== 'm') { l.el.style.display = 'none'; continue; }",
  "if ((!labelsOn && l.kind !== 'm') || (cutH && l.p.y > cutH) || (l.kind === 'r' && !cutH && !(mode === 'walk' && camera.position.distanceTo(l.p) < 5.5))) { l.el.style.display = 'none'; continue; }");
app = rep(app, "  const lb = $('#lbtn');", "  document.querySelectorAll('#cut button').forEach(b => b.onclick = () => setCut(+b.dataset.c));\n  const lb = $('#lbtn');");
writeFileSync(join(here, 'src', 'app.js'), '// GERADO por build.mjs a partir de ../contexto-3d/maquete/src/app.js — não editar à mão\n' + app);

let html = readFileSync(join(base, 'src', 'template.html'), 'utf8');
html = rep(html, '<title>Residencial do Fundo — Maquete 3D</title>', '<title>Sobrado Opção B — Maquete 3D</title>');
html = rep(html, '<h1>Residencial do Fundo</h1>', '<h1>Sobrado · Opção B</h1>');
html = rep(html, '<button id="lbtn">Rótulos</button>', '<div class="grp"><span>Corte</span><div class="seg" id="cut"><button data-c="0" class="on">Casa inteira</button><button data-c="1">Planta térreo</button><button data-c="2">Planta superior</button></div></div>\n  <button id="lbtn">Rótulos</button>');

const r = await build({ entryPoints: [join(here, 'src', 'app.js')], bundle: true, format: 'iife', minify: true, write: false, target: 'es2020', legalComments: 'none', nodePaths: [join(base, 'node_modules')] });
const js = r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
writeFileSync(join(here, 'index.html'), html.replace('/*APP*/', () => js));
console.log('index.html', (js.length / 1024).toFixed(0), 'KB');
