// Gera o index.html da maquete da Implantação 2 (croqui de 15/11/2026) — arquivo único, abre sem servidor.
// Reaproveita o motor, as casas dos lotes 1–4 e o three.js de ../../contexto-3d/maquete (que não é alterado).
// Uso: node build.mjs   (antes, uma vez: cd ../../contexto-3d/maquete && npm install)
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url)), base = join(here, '..', '..', 'contexto-3d', 'maquete');
const { build } = createRequire(import.meta.url)(join(base, 'node_modules', 'esbuild'));
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('trecho não encontrado: ' + a.slice(0, 60)); return s.replace(a, b); };
const cut = (s, a, b, n) => { const i = s.indexOf(a), j = s.indexOf(b, i); if (i < 0 || j < 0) throw new Error('bloco não encontrado: ' + a.slice(0, 40)); return s.slice(0, i) + n + s.slice(j); };
const S = '../../../contexto-3d/maquete/src/', HEAD = '// GERADO por build.mjs a partir de contexto-3d/maquete/src — não editar à mão\n';

// entorno (área do proprietário, soja, vizinhos, torres): igual ao da maquete principal
const site0 = readFileSync(join(base, 'src', 'site.js'), 'utf8'), ie = site0.indexOf('function entorno(B)');
if (ie < 0) throw new Error('entorno não encontrado');
writeFileSync(join(here, 'src', 'entorno.js'), HEAD + `import * as THREE from 'three';\nimport { M, rng } from '${S}tex.js';\nimport { walls } from '${S}geo.js';\n\nexport ` + site0.slice(ie));

let app = readFileSync(join(base, 'src', 'app.js'), 'utf8');
for (const m of ['tex', 'geo', 'veg', 'houses']) app = rep(app, `from './${m}.js'`, `from '${S}${m}.js'`);
app = cut(app, 'const VIEWS = [', '// ---------- renderer, cena, câmera ----------', `const VIEWS = [
  ['Do alto', [
    ['geral', 'Visão geral', 'o', [-24, 40, 100], [17, 0, 40]],
    ['planta', 'Planta (de cima)', 'o', [17, 98, 40.4], [17, 0, 40]],
    ['entrada', 'Entrada e praça, do alto', 'o', [2, 20, -16], [16, 0, 8]],
    ['lotes', 'Os 4 lotes', 'o', [16.5, 24, 40], [16.5, 2, 70]],
    ['quintais', 'Quintais, por trás do muro', 'o', [16.5, 17, 99], [16.5, 1, 76]],
    ['kitalto', 'Kitnets, do alto', 'o', [46, 24, 4], [16.5, 0, 33]]]],
  ['Caminhando', [
    ['portaria', 'Portaria e servidão', 'w', [3, -7], [3, 1.6, 12]],
    ['curva', 'Curva da entrada', 'w', [3, 9], [20, 1.5, 9]],
    ['ruakit', 'Rua das kitnets', 'w', [16.5, 13], [16.5, 1.5, 50]],
    ['kitnet', 'Frente de uma kitnet', 'w', [15.6, 29.8], [7, 1.4, 29.4]],
    ['praca', 'Praça e vagas de visitantes', 'w', [20, 9.5], [28.3, 1.2, 3.3]],
    ['rualotes', 'Rua dos lotes', 'w', [5.6, 57.2], [30, 1.9, 62.5]],
    ['lote1', 'Lote 1 · Sobrado', 'w', [2.4, 57.2], [3.6, 3.2, 66]],
    ['lote2', 'Lote 2 · Chalé', 'w', [10.5, 57.0], [12.2, 3.2, 68]],
    ['lote3', 'Lote 3 · Casa moderna', 'w', [19.0, 57.2], [21.0, 1.7, 68]],
    ['lote4', 'Lote 4 · Casa moderna', 'w', [27.2, 57.0], [29.2, 2.6, 67]]]],
  ['Interiores', [
    ['inkit', 'Kitnet (K3) · sala e cozinha', 'w', [8.7, 27.4], [3.6, 1.0, 26.6]],
    ['inkitq', 'Kitnet (K3) · quarto', 'w', [4.7, 32.4], [2.0, .7, 30.6]],
    ['insob', 'Sobrado · estar, jantar e cozinha', 'w', [6.0, 70.9], [2.2, 1.1, 76.5]],
    ['insup', 'Sobrado · suíte', 'w', [3.7, 69.4, 3.0], [1.0, 3.9, 66.6]],
    ['inq3', 'Sobrado · quarto 3', 'w', [3.75, 77.4, 3.0], [6.4, 3.7, 75.3]],
    ['incha', 'Chalé · estar', 'w', [13.6, 70.9, .45], [11.2, 2.6, 67.6]],
    ['inl3', 'Lote 3 · estar e varanda', 'w', [23.8, 73.6], [19.5, 1.2, 78.6]],
    ['inl4', 'Lote 4 · estar (pé-direito duplo)', 'w', [29.2, 72.2], [28.2, 2.6, 66.2]]]]];

`);
app = rep(app, '[[15.8, 30, .1], [23.2, 44, .1], [12.2, 53.2, .1], [3, 5, 0], [10, 61.4, .1], [26, 61.4, .1], [6.1, 66.5, .08], [19.5, 22, 0], [12, 64.5, .06], [29.2, 64.8, .06]]',
  '[[11.0, 30, .1], [22.0, 44, .1], [27.4, 3.0, .1], [3, 5, 0], [10, 61.4, .1], [26, 61.4, .1], [6.1, 66.5, .08], [16.5, 22, 0], [12, 64.5, .06], [29.2, 64.8, .06]]');
// testes de caminhada (?sim) com as coordenadas novas
app = cut(app, "    if (qs.has('sim')) {", ' if (qs.has(\'dbg\'))', `    if (qs.has('sim')) {
      const sim = (name, x, z, feet, legs) => { const p = { x, z }; for (const [yaw, dist] of legs) { const sy = Math.sin(yaw * D), cy = Math.cos(yaw * D); for (let i = 0; i < dist / .04; i++) { p.x += sy * .04; p.z -= cy * .04; collide(p, feet); feet = groundAt(p.x, p.z, feet); } } console.log('SIM', name, p.x.toFixed(2), p.z.toFixed(2), 'feet', feet.toFixed(2)); };
      // K3 (esquerda): módulo x 0..10,5 · y 26..33 ; K9 (direita): x 22,5..33 · y 26..33
      sim('k3-porta-de-correr', 13, 27.8, 0, [[-90, 6]]); sim('k3-parede-cega', 13, 26.6 + 1.1, 0, [[-90, 3]]); sim('k3-quarto', 3.4, 28.6, .1, [[180, 3]]);
      sim('k3-porta-quintal', 3.0, 28.65, .1, [[-90, 2.5]]); sim('k9-porta-de-correr', 20, 27.8, 0, [[90, 6]]); sim('muro-oeste', 3, 9, 0, [[-90, 6]]); sim('portao', 3, -3, 0, [[180, 8]]);
      const op = statics.filter(m => !m.material.transparent), span = (name, exp, x, y, z, ax) => { let t = 0; for (const sg of [1, -1]) { const d = new THREE.Vector3(); d[ax] = sg; ray.set(new THREE.Vector3(x, y, z), d); t += ray.intersectObjects(op, false)[0].distance; } console.log('MED', name, 'modelo', t.toFixed(2), 'planta', exp); };
      span('rua central entre fachadas', '14.40', 16.5, 1.6, 26.3, 'x'); span('kitnet sala largura (v)', '3.30', 6.2, 2.4, 27.5, 'z'); span('kitnet ala comprimento (u)', '7.50', 5.5, 2.4, 29.2, 'x');
      span('kitnet quarto largura', '3.25', 2.0, 2.6, 31.0, 'z'); span('kitnet quarto comprimento', '3.40', 3.3, 2.3, 31.0, 'x'); span('kitnet pe-direito', '2.70', 5.5, 1.2, 28.3, 'y');
      span('vaga coberta largura', '3.40', 7.0, 2.3, 31.0, 'z'); span('muro oeste a cerca viva', '33.25', 16.5, 1.0, 57, 'x');
    }`);
writeFileSync(join(here, 'src', 'app.js'), HEAD + app);

let html = readFileSync(join(base, 'src', 'template.html'), 'utf8');
html = rep(html, '<title>Residencial do Fundo — Maquete 3D</title>', '<title>Residencial do Fundo · Implantação 2</title>');
html = rep(html, '<h1>Residencial do Fundo</h1>', '<h1>Implantação 2</h1>');

const r = await build({ entryPoints: [join(here, 'src', 'app.js')], bundle: true, format: 'iife', minify: true, write: false, target: 'es2020', legalComments: 'none', nodePaths: [join(base, 'node_modules')] });
const js = r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
writeFileSync(join(here, 'index.html'), html.replace('/*APP*/', () => js));
console.log('index.html', (js.length / 1024).toFixed(0), 'KB');
