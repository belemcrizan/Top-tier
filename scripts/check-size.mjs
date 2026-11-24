import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const directory = new URL('../dist/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('.vite/manifest.json', directory), 'utf8'));
const seen = new Set();

function visit(key) {
  if (seen.has(key)) return;
  seen.add(key);
  for (const dependency of manifest[key].imports ?? []) visit(dependency);
}

for (const [key, entry] of Object.entries(manifest)) {
  if (entry.isEntry) visit(key);
}

const files = [...seen].map((key) => manifest[key].file).filter((file) => file.endsWith('.js'));
// Include the small registration script injected by the PWA plugin in the entry HTML.
const html = await readFile(new URL('index.html', directory), 'utf8');
if (html.includes('registerSW.js')) files.push('registerSW.js');
const sizes = await Promise.all(
  files.map(async (file) => {
    const bytes = await readFile(new URL(file, directory));
    return gzipSync(bytes).length;
  }),
);
const sum = sizes.reduce((total, size) => total + size, 0);
console.log(`Initial JavaScript: ${(sum / 1000).toFixed(1)} kB gzip (${files.length} files)`);
if (!files.length || sum >= 120_000) process.exitCode = 1;
