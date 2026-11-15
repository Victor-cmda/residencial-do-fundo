// Empacota src/ + three.js em um único index.html (abre direto no navegador, sem servidor nem internet).
// Uso: node build.mjs
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const r = await build({ entryPoints: [join(here, 'src/app.js')], bundle: true, format: 'iife', minify: true, write: false, target: 'es2020', legalComments: 'none' });
const js = r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const html = readFileSync(join(here, 'src/template.html'), 'utf8').replace('/*APP*/', () => js);
writeFileSync(join(here, 'index.html'), html);
console.log('index.html', (html.length / 1024).toFixed(0), 'KB');
