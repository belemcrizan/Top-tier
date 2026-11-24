import { expect, test } from '@playwright/test';

test('the collection paints and preserves an album choice while the app downloads', async ({
  page,
}) => {
  let release: () => void = () => {};
  const ready = new Promise<void>((resolve) => {
    release = resolve;
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.route(/\/assets\/index-[^/]+\.js$/, async (route) => {
    await ready;
    await route.continue();
  });
  try {
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Três eras');
    const album = page.getByRole('button', { name: /explorar folklore/i });
    await album.click();
    release();
    await expect(album).toHaveAttribute('aria-pressed', 'true');
    expect(errors).toEqual([]);
  } finally {
    release();
  }
});
