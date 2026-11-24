import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { albums, songs } from '../../data/rankings';
import { I18nProvider } from '../../i18n';
import { AlbumSummary } from './AlbumSummary';
import { CollectionHero } from './CollectionHero';

describe('collection', () => {
  it('updates both written counts when the catalog size changes (B3)', () => {
    const fixture = (albumCount: number, trackCount: number) => (
      <I18nProvider>
        <CollectionHero albumCount={albumCount} trackCount={trackCount} browse={vi.fn()} />
      </I18nProvider>
    );
    const result = render(fixture(3, 9));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/três eras/i);
    expect(screen.getByText(/nove faixas/)).toBeInTheDocument();
    result.rerender(fixture(4, 10));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/quatro eras/i);
    expect(screen.getByText(/dez faixas/)).toBeInTheDocument();
  });

  it('exposes both tier counts and the changed score in expanded insights', async () => {
    const base = songs.filter(({ album }) => album === 'evermore');
    const personal = base.map((song, index) => (index === 0 ? { ...song, pontuacao: 0 } : song));
    const { container } = render(
      <I18nProvider>
        <AlbumSummary album={albums[0]} editorial={base} personal={personal} />
      </I18nProvider>,
    );
    fireEvent.click(screen.getByText('Insights da era'));
    expect(screen.getByRole('table', { name: /quantidade de faixas/i })).toBeInTheDocument();
    expect(screen.getByText(`${base[0].titulo} · -${base[0].pontuacao} pontos`)).toBeVisible();
    const audit = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(audit.violations).toEqual([]);
  });

  it('renders an empty album without invalid numerical metrics (B8)', () => {
    render(
      <I18nProvider>
        <AlbumSummary album={albums[0]} editorial={[]} personal={[]} />
      </I18nProvider>,
    );
    expect(screen.getByText(/ainda não tem faixas/)).toBeInTheDocument();
    expect(screen.queryByText(/NaN|Infinity/)).not.toBeInTheDocument();
  });
});
