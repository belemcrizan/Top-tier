import { expect, test } from '@playwright/test';

test('the installed collection reopens offline from its deployment subpath', async ({
  context,
  page,
  baseURL,
}) => {
  if (!baseURL) throw new Error('The E2E server must have a configured base URL');
  await page.goto('./');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {
          once: true,
        });
      });
    }
  });

  const manifestLink = await page.locator('link[rel=manifest]').getAttribute('href');
  if (!manifestLink) throw new Error('No web app manifest is linked');
  const url = new URL(manifestLink, baseURL);
  const manifest = await (await page.request.get(url.href)).json();
  expect(new URL(manifest.start_url, url).href).toBe(baseURL);
  for (const icon of manifest.icons) {
    const iconUrl = new URL(icon.src, url);
    expect(iconUrl.href.startsWith(baseURL)).toBe(true);
    expect((await page.request.get(iconUrl.href)).ok()).toBe(true);
  }

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
