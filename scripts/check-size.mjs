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
const html = await readFile(new URL('index.html', directory), 'utf8');
const sizes = await Promise.all(
  files.map(async (file) => {
    const bytes = await readFile(new URL(file, directory));
    return gzipSync(bytes).length;
  }),
);
// The small theme/route bootstrap ships inline with the HTML and counts toward the JS budget.
const inlineScripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1].trim())
  .filter(Boolean);
const inlineSize = inlineScripts.reduce((bytes, code) => bytes + gzipSync(code).length, 0);
const sum = sizes.reduce((total, size) => total + size, inlineSize);
const sizeLabel = `${(sum / 1000).toFixed(1)} kB gzip`;
const sources = `${files.length} external, ${inlineScripts.length} inline`;
console.log(`Initial JavaScript: ${sizeLabel} (${sources})`);
if (!files.length || sum >= 120_000) process.exitCode = 1;
