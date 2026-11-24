import { expect, test } from '@playwright/test';

test('moves a track between tiers with a keyboard and keeps focus after the drop', async ({
  page,
}) => {
  await page.goto('./#tiers');
  const track = page.getByRole('button', { name: 'Mover · champagne problems · S+', exact: true });
  await track.focus();
  await track.press('Space');
  await expect(track).toHaveAttribute('aria-pressed', 'true');
  await track.press('ArrowDown');
  await expect(page.getByText('Destino · S', { exact: true })).toBeAttached();
  await track.press('Space');
  const moved = page.getByRole('button', { name: 'Mover · champagne problems · S', exact: true });
  await expect(moved).toBeFocused();
  await page.reload();
  await expect(moved).toBeVisible();
});
