// The browser discovers the face declarations in CSS, but the first render uses local faces only.
// Waiting on the complete set makes applying the display and body families a single layout change.
const familyRequests = [
  '400 1em "DM Sans Variable"',
  '500 1em "Fraunces Variable"',
  'italic 450 1em "Fraunces Variable"',
];

function afterContentPaint(callback: () => void): void {
  if (
    typeof PerformanceObserver !== 'undefined' &&
    PerformanceObserver.supportedEntryTypes?.includes('paint')
  ) {
    if (performance.getEntriesByName('first-contentful-paint', 'paint').length) {
      callback();
      return;
    }
    const observer = new PerformanceObserver((entries) => {
      if (entries.getEntriesByName('first-contentful-paint', 'paint').length) {
        observer.disconnect();
        callback();
      }
    });
    observer.observe({ type: 'paint', buffered: true });
    return;
  }
  // Safari versions without Paint Timing still get an opportunity to draw the initial frame.
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

async function activateFonts(): Promise<void> {
  try {
    const loaded = await Promise.all(familyRequests.map((query) => document.fonts.load(query)));
    if (loaded.every((faces) => faces.length > 0)) document.documentElement.dataset.fonts = 'ready';
  } catch {
    // Offline misses or a rejected font leave the measured system fallback in place.
  }
}

export function loadCollectionFonts(): void {
  if (!document.fonts?.load || document.documentElement.dataset.fonts === 'ready') return;
  const schedule = (): void => {
    afterContentPaint(() => {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => void activateFonts(), { timeout: 1500 });
      } else {
        requestAnimationFrame(() => void activateFonts());
      }
    });
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
}
