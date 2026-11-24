import axe from 'axe-core';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RankingProvider, useRanking } from '../../app/RankingProvider';
import { I18nProvider } from '../../i18n';
import { songs } from '../../data/rankings';
import type { Song } from '../../data/rankings';
import DuelArena from './DuelArena';

function PersonalScore({ song }: { song: Song }): ReactElement {
  const { personalSongs } = useRanking();
  const updated = personalSongs.find(({ id }) => id === song.id);
  return <output aria-label="Result">{updated?.pontuacao}</output>;
}

function renderArena(song = songs[0]) {
  return render(
    <I18nProvider>
      <RankingProvider>
        <main>
          <DuelArena />
          <PersonalScore song={song} />
        </main>
      </RankingProvider>
    </I18nProvider>,
  );
}

describe('DuelArena', () => {
  it('records a choice, advances the pair and applies the scores', () => {
    const first = renderArena();
    const picks = screen.getAllByRole('button', { name: /^Escolher / });
    const winnerName = picks[0].getAttribute('aria-label')?.slice('Escolher '.length);
    const loserName = picks[1].getAttribute('aria-label')?.slice('Escolher '.length);
    const loser = songs.find(({ titulo }) => titulo === loserName);
    if (!loser) throw Error('Missing opponent');
    first.unmount();
    renderArena(loser);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('Você escolheu ' + winnerName + '.')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Escolher ' + loserName })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar ao Meu ranking' }));
    expect(Number(screen.getByRole('status', { name: 'Result' }).textContent)).toBeLessThan(
      loser.pontuacao,
    );
    expect(screen.getByText('Notas do duelo aplicadas ao seu ranking.')).toBeInTheDocument();
  });

  it('allows skips, ties and disabling shortcuts', () => {
    renderArena();
    const apply = screen.getByRole('button', { name: 'Aplicar ao Meu ranking' });
    fireEvent.click(screen.getByRole('button', { name: 'Pular' }));
    expect(apply).toBeDisabled();
    expect(screen.getByText('Duelo pulado.')).toBeVisible();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Atalhos de teclado' }));
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(apply).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Empate' }));
    expect(apply).toBeEnabled();
    expect(screen.getByText('Empate registrado.')).toBeVisible();
  });

  it('presents a named, accessible pair', async () => {
    const { container } = renderArena();
    expect(within(container).getByRole('progressbar', { name: /Confiança/ })).toBeVisible();
    // jsdom has no canvas. The browser E2E and token audit check actual contrast.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const result = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(result.violations).toEqual([]);
  });
});
