import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { songs } from '../src/data/rankings';

test('downloaded top five card contains the five original album covers', async ({ page }) => {
  // Force the download path even on platforms offering a native share sheet.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => false });
  });
  await page.goto('./#compartilhar');
  const save = page.getByRole('button', { name: 'Salvar ou compartilhar cartão' });
  await expect(save).toBeEnabled();
  const result = page.waitForEvent('download');
  await save.click();
  const download = await result;
  expect(download.suggestedFilename()).toBe('top-tier.png');
  const path = await download.path();
  if (!path) throw new Error('Download did not produce a local file');
  const file = await readFile(path);
  await test.info().attach('top-tier.png', { body: file, contentType: 'image/png' });
  const png = file.toString('base64');
  const albums = songs.slice(0, 5).map((song) => song.album);
  const proof = await page.evaluate(
    async ({ png, albums }) => {
      const card = new Image();
      card.src = `data:image/png;base64,${png}`;
      await card.decode();
      const size = 136;
      const square = document.createElement('canvas');
      square.width = size;
      square.height = size;
      const context = square.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Canvas unavailable');
      const matches: boolean[] = [];
      for (const [index, album] of albums.entries()) {
        const cover = new Image();
        cover.src = new URL(`images/${album}-384.webp`, document.baseURI).href;
        await cover.decode();
        context.drawImage(cover, 0, 0, size, size);
        const source = context.getImageData(0, 0, size, size).data;
        context.drawImage(card, 146, 325 + index * 182, size, size, 0, 0, size, size);
        const output = context.getImageData(0, 0, size, size).data;
        matches.push(source.every((channel, i) => Math.abs(channel - output[i]) <= 1));
      }
      return { dimensions: [card.naturalWidth, card.naturalHeight], matches };
    },
    { png, albums },
  );
  expect(proof.dimensions).toEqual([1080, 1350]);
  expect(proof.matches).toEqual([true, true, true, true, true]);
});
