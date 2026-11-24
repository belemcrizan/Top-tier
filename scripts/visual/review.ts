import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import { editions, themes, viewports, writeGallery } from './gallery';
import { captureScreens } from './screens';

const before = process.argv[2];
if (!before) throw new Error('Pass the path to a built checkout of the PR base');
const report = resolve(process.env.VISUAL_REPORT_DIR || 'visual-report');
const base = process.env.VITE_BASE_PATH || '/';
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
});
const failures: string[] = [];
try {
  for (const edition of editions) {
    const revised = edition === 'depois';
    const root = revised ? process.cwd() : resolve(before);
    await readFile(join(root, 'dist/index.html'));
    const port = revised ? 4186 : 4185;
    const server = await preview({
      root,
      configFile: false,
      base,
      logLevel: 'error',
      preview: { host: '127.0.0.1', port, strictPort: true },
    });
    try {
      for (const viewport of viewports) {
        for (const colorScheme of themes) {
          const label = `${viewport.width}-${colorScheme}`;
          console.log(`Capturing ${edition}/${label}`);
          const directory = join(report, edition, label);
          await mkdir(directory, { recursive: true });
          const context = await browser.newContext({
            viewport,
            colorScheme,
            locale: 'pt-BR',
            deviceScaleFactor: 1,
            reducedMotion: 'reduce',
          });
          try {
            await captureScreens(
              await context.newPage(),
              `http://127.0.0.1:${port}${base}`,
              directory,
              revised,
            );
          } catch (cause) {
            const failure = `${edition}/${label}: ${String(cause)}`;
            failures.push(failure);
            console.error(failure);
          } finally {
            await context.close();
          }
        }
      }
    } finally {
      await server.close();
    }
  }
  await writeFile(
    join(report, 'results.json'),
    JSON.stringify(
      {
        before: process.env.BASE_SHA,
        after: process.env.HEAD_SHA,
        chromium: browser.version(),
        viewports,
        themes,
        failures,
      },
      null,
      2,
    ),
  );
  await writeGallery(report, browser);
  if (failures.length)
    throw new Error(`${failures.length} visual scenarios failed; see results.json`);
} finally {
  await browser.close();
}
