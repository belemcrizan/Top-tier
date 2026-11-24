import axe from 'axe-core';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RankingProvider } from '../../app/RankingProvider';
import { I18nProvider } from '../../i18n';
import { songs } from '../../data/rankings';
import { RANKING_KEY, restoreRanking } from '../../lib/storage';
import TierBoard from './TierBoard';
import { destinationTier, midpoint } from './moves';

function renderBoard() {
  return render(
    <I18nProvider>
      <RankingProvider>
        <main>
          <TierBoard />
        </main>
      </RankingProvider>
    </I18nProvider>,
  );
}

describe('TierBoard', () => {
  it('respects tier midpoint rounding and rejects unknown destinations', () => {
    expect(midpoint('S+')).toBe(99);
    expect(midpoint('C')).toBe(39);
    expect(destinationTier('S')).toBe('S');
    expect(destinationTier('X')).toBeUndefined();
  });

  it('moves a song without requiring a drag gesture and persists its new score', () => {
    renderBoard();
    const song = songs[0];
    fireEvent.change(screen.getByRole('combobox', { name: 'Música' }), {
      target: { value: song.id },
    });
    fireEvent.change(screen.getByRole('combobox', { name: 'Tier de destino' }), {
      target: { value: 'B' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Mover faixa' }));
    const lane = screen.getByRole('region', { name: 'B Solid' });
    expect(
      within(lane).getByRole('button', { name: 'Mover · ' + song.titulo + ' · B' }),
    ).toBeInTheDocument();
    expect(restoreRanking(localStorage.getItem(RANKING_KEY)).scores[song.id]).toBe(81);
  });

  it('exposes labeled targets and alternative controls for every song', async () => {
    const { container } = renderBoard();
    expect(screen.getAllByRole('button', { name: /^Mover · / })).toHaveLength(songs.length);
    // jsdom has no canvas. The browser E2E and token audit check actual contrast.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const result = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(result.violations).toEqual([]);
  });
});
