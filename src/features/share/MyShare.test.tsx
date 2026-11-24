import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { I18nProvider } from '../../i18n';
import { RankingProvider } from '../../app/RankingProvider';
import { songs } from '../../data/rankings';
import { decodeRanking } from './encodeRanking';
import { downloadBlob } from './download';
import ShareView from './ShareView';

vi.mock('./download', () => ({ downloadBlob: vi.fn() }));
vi.mock('./ShareCard', () => ({ ShareCard: (): ReactElement => <div /> }));

afterEach(() => {
  Reflect.deleteProperty(navigator, 'clipboard');
});

function openShare(): HTMLInputElement {
  render(
    <I18nProvider>
      <RankingProvider>
        <ShareView />
      </RankingProvider>
    </I18nProvider>,
  );
  return screen.getByRole('textbox', { name: 'Link de leitura' });
}

describe('sharing from my collection', () => {
  it('copies a complete snapshot and offers a JSON file', async () => {
    const copy = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: copy },
    });
    const field = openShare();
    fireEvent.click(screen.getByRole('button', { name: 'Copiar link' }));
    expect(copy).toHaveBeenCalledWith(field.value);
    expect(decodeRanking(new URL(field.value).hash.slice(3))).toEqual(
      Object.fromEntries(songs.map((song) => [song.id, song.pontuacao])),
    );
    expect(await screen.findByText('Link copiado.')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Exportar JSON' }));
    expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), 'top-tier.json');
  });

  it('selects the link for manual copying when clipboard access is denied', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('Denied')) },
    });
    const field = openShare();
    fireEvent.click(screen.getByRole('button', { name: 'Copiar link' }));
    await waitFor(() => expect(field).toHaveFocus());
    expect(field.selectionStart).toBe(0);
    expect(field.selectionEnd).toBe(field.value.length);
  });
});
