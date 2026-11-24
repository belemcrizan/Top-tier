import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { RankingProvider } from '../../app/RankingProvider';
import { TIER_SCALE } from '../../data/tiers';
import { I18nProvider } from '../../i18n';
import TierBoard from './TierBoard';

function press(target: Element | Document, code: string): void {
  fireEvent.keyDown(target, { code, key: code === 'Space' ? ' ' : code, bubbles: true });
}

it('moves to the next measured lane and restores keyboard focus to the relocated track', async () => {
  // jsdom has no layout. dnd-kit needs distinct lane rectangles for real collision detection.
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const heading = this.closest('[aria-labelledby]')?.getAttribute('aria-labelledby');
    const index = TIER_SCALE.findIndex(({ tier }) => heading === 'lane-' + tier);
    const top = index < 0 ? 0 : index * 90;
    return this.classList.contains('tier-board__chip')
      ? new DOMRect(20, top + 10, 100, 44)
      : new DOMRect(0, top, 520, 80);
  });
  render(
    <I18nProvider>
      <RankingProvider>
        <main>
          <TierBoard />
        </main>
      </RankingProvider>
    </I18nProvider>,
  );
  const chip = screen.getByRole('button', { name: 'Mover · champagne problems · S+', exact: true });
  chip.focus();
  press(chip, 'Space');
  await waitFor(() => expect(chip).toHaveAttribute('aria-pressed', 'true'));
  press(document, 'ArrowDown');
  await screen.findByText('Destino · S', { exact: true });
  press(document, 'Escape');
  await screen.findByText('Movimento cancelado.', { exact: true });
  expect(chip).toBeInTheDocument();
  press(chip, 'Space');
  await waitFor(() => expect(chip).toHaveAttribute('aria-pressed', 'true'));
  press(document, 'ArrowDown');
  await screen.findByText('Destino · S', { exact: true });
  press(document, 'Space');
  const relocated = await screen.findByRole('button', {
    name: 'Mover · champagne problems · S',
    exact: true,
  });
  await waitFor(() => expect(relocated).toHaveFocus());
});
