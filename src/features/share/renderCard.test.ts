import { afterEach, describe, expect, it, vi } from 'vitest';
import { songs } from '../../data/rankings';
import { loadCardCover, drawCardCover } from './cardArt';
import { covers } from '../../visual/media';
import { downloadBlob } from './download';
import { renderCard } from './renderCard';

let imagePaths: string[] = [];

function stubImages(problem?: 'decode' | 'network'): void {
  class LocalImage {
    onload?: () => void;
    onerror?: () => void;
    naturalWidth = 384;
    naturalHeight = 384;
    isPhoto = false;
    decode(): Promise<void> {
      return problem === 'decode' && this.isPhoto ? Promise.reject(new Error()) : Promise.resolve();
    }
    set src(path: string) {
      this.isPhoto = path.endsWith('.webp');
      imagePaths.push(path);
      queueMicrotask(() => (problem === 'network' ? this.onerror?.() : this.onload?.()));
    }
  }
  vi.stubGlobal('Image', LocalImage);
}

afterEach(() => {
  delete document.documentElement.dataset.fonts;
  Reflect.deleteProperty(document, 'fonts');
  vi.unstubAllGlobals();
  vi.useRealTimers();
  imagePaths = [];
});

describe('ranking card', () => {
  it('draws each song, decodes each cover once and produces a correctly sized PNG', async () => {
    stubImages();
    const load = vi.fn().mockResolvedValue([{}]);
    Object.defineProperty(document, 'fonts', { configurable: true, value: { load } });
    const styles = vi.spyOn(globalThis, 'getComputedStyle');
    const canvas = document.createElement('canvas');
    const original = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((name) =>
      name === 'canvas' ? canvas : original(name),
    );
    const ctx = {
      fillRect: vi.fn(),
      drawImage: vi.fn(),
      fillText: vi.fn(),
      measureText: (line: string) => ({ width: line.length * 26 }),
    };
    vi.spyOn(canvas, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    const data = new Blob(['test'], { type: 'image/png' });
    vi.spyOn(canvas, 'toBlob').mockImplementation((done) => done(data));
    const top = songs.slice(0, 5);
    const tracks = [...top, { ...songs[0], titulo: 'Excluded from the top five' }];
    tracks[1] = {
      ...tracks[1],
      titulo: 'A very long sample title to exercise multiple line breaks',
    };
    expect(await renderCard(tracks, 'Top 5', 'Top Tier')).toBe(data);
    expect(load).toHaveBeenCalledWith(expect.stringContaining('Playfair Display Variable'));
    expect(document.documentElement.dataset.fonts).toBe('ready');
    expect(load.mock.invocationCallOrder[0]).toBeLessThan(styles.mock.invocationCallOrder[0]);
    expect([canvas.width, canvas.height]).toEqual([1080, 1350]);
    expect(ctx.drawImage).toHaveBeenCalledTimes(5);
    expect(imagePaths.length).toBe(new Set(top.map((s) => s.album)).size);
    expect(imagePaths.every((path) => path.endsWith('.webp'))).toBe(true);
    expect(ctx.fillText.mock.calls.flat()).not.toContain('Excluded from the top five');
  });

  it('keeps the card usable after decode and fallback failures', async () => {
    stubImages('decode');
    const fallback = await loadCardCover('evermore');
    expect(fallback).not.toBeNull();
    expect(imagePaths).toEqual([covers.evermore.card, covers.evermore.fallback]);
    stubImages('network');
    const missing = await loadCardCover('evermore');
    expect(missing).toBeNull();
    const ctx = { fillRect: vi.fn(), drawImage: vi.fn() };
    drawCardCover(ctx as unknown as CanvasRenderingContext2D, missing, 'evermore', 2, 4, 136);
    expect(ctx.fillRect).toHaveBeenCalledWith(2, 4, 136, 136);
    expect(ctx.drawImage).not.toHaveBeenCalled();
  });

  it('surfaces unavailable canvas and failed PNG encoding', async () => {
    stubImages();
    const get = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    await expect(renderCard([], '', '')).rejects.toThrow('Canvas unavailable');
    const empty = { fillRect: vi.fn(), fillText: vi.fn() } as unknown as CanvasRenderingContext2D;
    get.mockReturnValue(empty);
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((done) => done(null));
    await expect(renderCard([], '', '')).rejects.toThrow('PNG unavailable');
  });

  it('downloads with a filename and revokes the temporary URL after the click', () => {
    vi.useFakeTimers();
    const link = document.createElement('a');
    vi.spyOn(document, 'createElement').mockReturnValue(link);
    const click = vi.spyOn(link, 'click').mockImplementation(() => undefined);
    const release = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: () => 'blob:test', revokeObjectURL: release });
    downloadBlob(new Blob(['{}']), 'top-tier.json');
    expect(link.download).toBe('top-tier.json');
    expect(click).toHaveBeenCalledOnce();
    expect(release).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1_000);
    expect(release).toHaveBeenCalledWith('blob:test');
  });
});
