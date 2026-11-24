import { afterEach, expect, it, vi } from 'vitest';
import { loadCollectionFonts } from './loadFonts';

afterEach(() => {
  delete document.documentElement.dataset.fonts;
  Reflect.deleteProperty(document, 'fonts');
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('requests no font before the fallback frame and switches once all faces resolve', async () => {
  const frames: FrameRequestCallback[] = [];
  let resolveLast!: (faces: FontFace[]) => void;
  const lastFace = new Promise<FontFace[]>((resolve) => {
    resolveLast = resolve;
  });
  const loadedFace = { status: 'loaded' } as FontFace;
  const load = vi.fn<(query: string) => Promise<FontFace[]>>().mockResolvedValue([loadedFace]);
  load.mockResolvedValueOnce([loadedFace]).mockReturnValueOnce(lastFace);
  Object.defineProperty(document, 'fonts', { configurable: true, value: { load } });
  vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
  vi.stubGlobal('PerformanceObserver', undefined);
  vi.stubGlobal('requestIdleCallback', undefined);
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb));

  loadCollectionFonts();
  frames.shift()?.(10);
  expect(load).not.toHaveBeenCalled();
  frames.shift()?.(20);
  frames.shift()?.(30);
  expect(load).toHaveBeenCalledTimes(3);
  expect(document.documentElement.dataset.fonts).toBeUndefined();
  resolveLast([loadedFace]);
  await vi.waitFor(() => expect(document.documentElement.dataset.fonts).toBe('ready'));
});
