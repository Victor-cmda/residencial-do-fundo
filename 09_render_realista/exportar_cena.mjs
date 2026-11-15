// Exporta a geometria do Sobrado Opção B (a mesma da maquete 3D) para o Blender: cena/cena.json + cena/cena.bin
// Uso: node exportar_cena.mjs
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url)), base = join(here, '..', 'contexto-3d', 'maquete'), out = join(here, 'cena');
const { build } = createRequire(import.meta.url)(join(base, 'node_modules', 'esbuild'));
mkdirSync(out, { recursive: true });
const entry = `
import * as THREE from 'three';
import { M } from '${join(base, 'src', 'tex.js').split(String.fromCharCode(92)).join('/')}';
import { Builder } from '${join(base, 'src', 'geo.js').split(String.fromCharCode(92)).join('/')}';
import { houseB } from '${join(here, '..', '08_sobrado_opcao_B_3d', 'src', 'houseB.js').split(String.fromCharCode(92)).join('/')}';
Object.setPrototypeOf(M, new Proxy({}, { get(t, name, recv) { if (typeof name !== 'string') return undefined; const m = new THREE.MeshStandardMaterial({ color: 0xcccccc }); m.name = name; m.userData.tile = 1; Object.defineProperty(recv, name, { value: m, writable: true, enumerable: true, configurable: true }); return m; } }));
export function run() {
  const B = new Builder(); B.assets = []; houseB(B);
  const meshes = [], chunks = []; let off = 0;
  for (const [mat, b] of B.buckets) {
    const n = b.pos.length / 3, f = new Float32Array(n * 6);
    for (let i = 0; i < n; i++) { f[i * 6] = b.pos[i * 3]; f[i * 6 + 1] = -b.pos[i * 3 + 2]; f[i * 6 + 2] = b.pos[i * 3 + 1]; f[i * 6 + 3] = b.nor[i * 3]; f[i * 6 + 4] = -b.nor[i * 3 + 2]; f[i * 6 + 5] = b.nor[i * 3 + 1]; }
    meshes.push({ mat: mat.name, offset: off, count: n, color: mat.color.getHexString(), rough: mat.roughness, metal: mat.metalness }); chunks.push(Buffer.from(f.buffer)); off += f.byteLength;
  }
  return { bin: Buffer.concat(chunks), json: { meshes, assets: B.assets, veg: B.veg, grass: B.grass, hedges: B.hedges, caps: B.caps, lamps: B.lamps.map(l => ({ x: l.p.x, y: -l.p.z, z: l.p.y, r: l.r, power: l.power, inside: l.inside })) } };
}`;
// carros reais: se existir assets/cars/corsa.(glb|gltf|fbx|obj) ou cerato.(...), o render usa o arquivo no lugar do carro simplificado
globalThis.CAR_FILES = {};
for (const [k, n] of [['corsaPrata', 'corsa'], ['ceratoBranco', 'cerato']]) for (const e of ['glb', 'gltf', 'fbx', 'obj']) { const f = join(here, 'assets', 'cars', n + '.' + e); if (existsSync(f) && !globalThis.CAR_FILES[k]) globalThis.CAR_FILES[k] = f; }
console.log('carros reais:', Object.keys(globalThis.CAR_FILES).length ? globalThis.CAR_FILES : 'nenhum arquivo em assets/cars (usando os simplificados)');
const tmp = join(out, '_export.mjs');
await build({ stdin: { contents: entry, resolveDir: here, loader: 'js' }, bundle: true, format: 'esm', platform: 'node', outfile: tmp, nodePaths: [join(base, 'node_modules')], logLevel: 'error' });
const { run } = await import(pathToFileURL(tmp).href); const r = run();
writeFileSync(join(out, 'cena.bin'), r.bin); writeFileSync(join(out, 'cena.json'), JSON.stringify(r.json));
console.log('materiais', r.json.meshes.length, '| triângulos', r.json.meshes.reduce((a, m) => a + m.count / 3, 0), '| móveis/plantas', r.json.assets.length, '| vegetação', r.json.veg.length);
console.log(r.json.meshes.map(m => m.mat).join(' '));
