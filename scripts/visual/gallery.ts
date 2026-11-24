import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Browser } from '@playwright/test';
import { screens } from './screens';

export const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];
export const themes = ['light', 'dark'] as const;
export const editions = ['antes', 'depois'] as const;

export async function writeGallery(directory: string, browser: Browser): Promise<void> {
  let links = '';
  let sections = '';
  for (const { width, height } of viewports) {
    for (const theme of themes) {
      const id = `${width}-${theme}`;
      const description = `${width} × ${height} · ${theme === 'light' ? 'claro' : 'escuro'}`;
      links += `<a href="#${id}">${description}</a> `;
      const figures = Object.entries(screens)
        .map(([key, name]) => {
          const pair = editions
            .map((edition) => {
              const file = `${edition}/${id}/${key}.png`;
              return `<figure><figcaption>${edition === 'antes' ? 'Antes' : 'Depois'}</figcaption>
            <a href="${file}"><img loading="lazy" src="${file}"
              alt="${name}, ${edition}, ${description}"></a></figure>`;
            })
            .join('');
          return `<article><h3>${name}</h3><div>${pair}</div></article>`;
        })
        .join('');
      sections += `<section id="${id}"><h2>${description}</h2>${figures}</section>`;
    }
  }
  const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Top Tier · Revisão visual</title>
<style>*{box-sizing:border-box}body{margin:0;background:#f8f6f1;color:#253a2f;font:16px system-ui}
main{max-width:1200px;margin:auto;padding:24px}h1,h2,h3{font-family:Georgia,serif}nav{line-height:2}
a{color:#355541;margin-right:10px}section{padding:18px}article{margin:20px 0;padding-bottom:12px;
border-bottom:1px solid #9d978a}article>div{display:grid;grid-template-columns:1fr 1fr;gap:14px}
figure{margin:0;text-align:center}figcaption{margin-bottom:8px}img{display:block;max-width:100%;
max-height:420px;object-fit:contain;margin:auto}section.contact article{margin:8px 0;padding:0}
section.contact article>div img{max-height:220px}section.contact{background:#f8f6f1}
section.contact h2,section.contact h3{margin:8px 0}</style>
<main><h1>Top Tier · Revisão visual</h1>
<p>Antes e depois da PR no Chromium ${browser.version()}.
Abra uma captura para vê-la no tamanho original.</p>
<nav>${links}</nav>${sections}</main></html>`;
  const index = join(directory, 'index.html');
  await writeFile(index, html);
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  try {
    await page.goto(pathToFileURL(index).href);
    for (const width of [390, 1440]) {
      for (const theme of themes) {
        const group = page.locator(`[id="${width}-${theme}"]`);
        await group.evaluate(async (node) => {
          node.classList.add('contact');
          await Promise.allSettled(
            [...node.querySelectorAll('img')].map((image) => {
              image.loading = 'eager';
              return image.decode();
            }),
          );
        });
        await group.screenshot({
          path: join(directory, `resumo-${width}-${theme}.jpg`),
          type: 'jpeg',
          quality: 89,
          animations: 'disabled',
        });
      }
    }
  } finally {
    await page.close();
  }
}
