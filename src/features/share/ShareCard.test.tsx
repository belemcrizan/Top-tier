import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../../i18n';
import { songs } from '../../data/rankings';
import { ShareCard } from './ShareCard';
import { downloadBlob } from './download';
import { renderCard } from './renderCard';

vi.mock('./download', () => ({ downloadBlob: vi.fn() }));
vi.mock('./renderCard', () => ({ renderCard: vi.fn() }));
const blob = new Blob(['image'], { type: 'image/png' });

beforeEach(() => {
  vi.mocked(renderCard).mockResolvedValue(blob);
  vi.mocked(downloadBlob).mockClear();
  Object.defineProperties(URL, {
    createObjectURL: { configurable: true, value: vi.fn(() => 'blob:local-test') },
    revokeObjectURL: { configurable: true, value: vi.fn() },
  });
});

afterEach(() => {
  Reflect.deleteProperty(navigator, 'share');
  Reflect.deleteProperty(navigator, 'canShare');
});

function setup(): void {
  render(
    <I18nProvider>
      <ShareCard tracks={songs} />
    </I18nProvider>,
  );
}

async function clickOnCard(): Promise<void> {
  await screen.findByRole('img', { name: 'Prévia do cartão' });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar ou compartilhar cartão' }));
}

describe('sharing a PNG', () => {
  it('downloads a PNG when native file sharing is unavailable', async () => {
    setup();
    await clickOnCard();
    expect(downloadBlob).toHaveBeenCalledWith(blob, 'top-tier.png');
  });

  it('shares a real PNG file through an available native share sheet', async () => {
    const share = vi.fn<(data: ShareData) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperties(navigator, {
      canShare: { configurable: true, value: () => true },
      share: { configurable: true, value: share },
    });
    setup();
    await clickOnCard();
    const file = share.mock.calls[0][0].files?.[0];
    expect(file?.type).toBe('image/png');
    expect(file?.name).toBe('top-tier.png');
    expect(downloadBlob).not.toHaveBeenCalled();
  });

  it('handles canceled sheets and falls back on device errors', async () => {
    const share = vi
      .fn()
      .mockRejectedValueOnce(new DOMException('Canceled', 'AbortError'))
      .mockRejectedValueOnce(new Error('Unavailable'));
    Object.defineProperties(navigator, {
      canShare: { configurable: true, value: () => true },
      share: { configurable: true, value: share },
    });
    setup();
    await clickOnCard();
    expect(downloadBlob).not.toHaveBeenCalled();
    await clickOnCard();
    await waitFor(() => expect(downloadBlob).toHaveBeenCalledOnce());
  });

  it('keeps a readable fallback and disables the image action when rendering fails', async () => {
    vi.mocked(renderCard).mockRejectedValue(new Error('No canvas'));
    setup();
    expect(await screen.findByRole('status')).toHaveTextContent('Não foi possível gerar');
    expect(screen.getByRole('button', { name: 'Salvar ou compartilhar cartão' })).toBeDisabled();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });
});
