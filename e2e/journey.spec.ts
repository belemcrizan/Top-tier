import { expect, test } from '@playwright/test';

test('ten duels produce a shareable ranking for a different listener', async ({
  page,
  browser,
}) => {
  await page.goto('./');

  await page.getByRole('link', { name: /duelo/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Qual fica com você?' })).toBeVisible();
  for (let round = 0; round < 10; round++) {
    await page
      .getByRole('button', { name: /^Escolher / })
      .first()
      .click();
  }
  await expect(page.getByText('Comparações feitas 10')).toBeVisible();
  await page.getByRole('button', { name: 'Aplicar ao Meu ranking' }).click();
  await page.getByRole('link', { name: 'Abrir meu ranking' }).click();
  await expect(page).toHaveURL(/#meu-ranking$/);
  const ranks = await page
    .locator('[data-song-id]')
    .evaluateAll((rows) => rows.map((row) => row.getAttribute('data-song-id')));
  expect(ranks.length).toBeGreaterThan(1);

  await page
    .getByRole('link', { name: /compartilhar/i })
    .first()
    .click();
  const sharedUrl = await page.getByRole('textbox', { name: 'Link de leitura' }).inputValue();
  expect(sharedUrl).toContain('#r=');

  // A separate context has no access to the creator's localStorage or UI state.
  const guestContext = await browser.newContext({ locale: 'pt-BR' });
  try {
    const guest = await guestContext.newPage();
    await guest.goto(sharedUrl);
    await expect(guest.getByRole('heading', { name: 'Ranking recebido' })).toBeVisible();
    const rows = guest.locator('[data-song-id]');
    await expect(rows).toHaveCount(ranks.length);
    expect(
      await rows.evaluateAll((items) => items.map((row) => row.getAttribute('data-song-id'))),
    ).toEqual(ranks);
    await guest
      .getByRole('button', { name: /^Detalhes de / })
      .first()
      .click();
    const dialog = guest.getByRole('dialog');
    await expect(dialog.getByRole('link', { name: 'Abrir no YouTube Music' })).toHaveAttribute(
      'href',
      /^https:\/\/music\.youtube\.com\/search\?q=Taylor\+Swift/,
    );
    await dialog.press('Escape');
    await guest.getByRole('button', { name: 'Comparar com o meu' }).click();
    await expect(guest.getByRole('heading', { name: 'Comparar rankings' })).toBeVisible();
  } finally {
    await guestContext.close();
  }
});
