import { expect, test } from '@playwright/test';

test('ten duels produce a shareable ranking for a different listener', async ({
  page,
  browser,
}) => {
  await page.goto('./');
  const onboarding = page.getByRole('dialog');
  if (await onboarding.isVisible()) await onboarding.press('Escape');

  await page.getByRole('link', { name: /duelo/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Qual fica com você?' })).toBeVisible();
  for (let round = 0; round < 10; round++) {
    await page
      .getByRole('button', { name: /^Escolher / })
      .first()
      .click();
  }
  await page.getByRole('button', { name: 'Aplicar ao Meu ranking' }).click();
  await page.getByRole('link', { name: 'Abrir meu ranking' }).click();
  await expect(page).toHaveURL(/#meu-ranking$/);

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
    const dialog = guest.getByRole('dialog');
    if (await dialog.isVisible()) await dialog.press('Escape');
    await expect(guest.getByRole('heading', { name: 'Ranking recebido' })).toBeVisible();
    await guest.getByRole('button', { name: 'Comparar com o meu' }).click();
    await expect(guest.getByRole('heading', { name: 'Comparar rankings' })).toBeVisible();
  } finally {
    await guestContext.close();
  }
});
