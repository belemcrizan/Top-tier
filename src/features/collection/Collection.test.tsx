import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { albums } from '../../data/rankings';
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
