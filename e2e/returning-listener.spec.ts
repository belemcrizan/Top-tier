import { expect, test } from '@playwright/test';

test('restores a returning listener’s theme, language and ranking route on reload', async ({
  page,
}) => {
  const errors: string[] = [];
  const hydration = /hydrat|server.rendered|Minified React error #(?:418|423|425)\b/i;
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type()) && hydration.test(message.text())) {
      errors.push(message.text());
    }
  });

  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('./');
  await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
  await page.getByRole('combobox', { name: 'Idioma' }).selectOption('en');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await nav.getByRole('link', { name: 'My ranking' }).click();
  await expect(page).toHaveURL(/#meu-ranking$/);
  await page.reload();

  const html = page.locator('html');
  await expect(html).toHaveAttribute('lang', 'en');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('en');
  await expect(page.getByRole('heading', { level: 1, name: 'My ranking' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'My ranking' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.getByRole('button', { name: 'Details for champagne problems' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(errors).toEqual([]);
});
