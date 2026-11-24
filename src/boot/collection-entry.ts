// This small inline loader runs after the static collection has been parsed.
(() => {
  const entry = document.currentScript?.getAttribute('data-app-entry') ?? '';
  if (!entry) throw new Error('Missing collection entry URL');
  const intent = new AbortController();
  const earlyActions = new AbortController();
  let painting: PerformanceObserver | undefined;
  let module: Promise<void> | undefined;

  function start(): Promise<void> {
    if (!module) {
      painting?.disconnect();
      intent.abort();
      module = import(entry).then(() => earlyActions.abort());
    }
    return module;
  }

  if (document.documentElement.hasAttribute('data-client-entry') || document.hidden) {
    start();
    return;
  }

  // Hash links work natively. Preserve an early button click or form edit while React arrives.
  function replayAfterHydration(event: Event): void {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = event.type === 'click' ? target.closest('button') : null;
    const field =
      target instanceof HTMLSelectElement || target instanceof HTMLInputElement ? target : null;
    if (!button && !(field && event.type !== 'click')) return;
    event.stopImmediatePropagation();
    if (button) event.preventDefault();
    const value = field?.value ?? '';
    start().then(() => {
      if (!target.isConnected) return;
      if (button) {
        button.click();
      } else if (field) {
        // Let React observe the edit even if the native input changed before its listeners existed.
        if (field instanceof HTMLInputElement) {
          field.value = field.defaultValue;
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
          setter?.call(field, value);
        } else field.value = value;
        field.dispatchEvent(new Event(event.type, { bubbles: true }));
      }
    });
  }
  for (const type of ['click', 'input', 'change']) {
    window.addEventListener(type, replayAfterHydration, {
      capture: true,
      signal: earlyActions.signal,
    });
  }
  for (const type of ['pointerdown', 'keydown', 'focusin', 'hashchange', 'visibilitychange']) {
    window.addEventListener(type, start, { capture: true, once: true, signal: intent.signal });
  }
  if (performance.getEntriesByName('first-contentful-paint').length) start();
  else if (window.PerformanceObserver?.supportedEntryTypes.includes('paint')) {
    painting = new PerformanceObserver((entries) => {
      if (entries.getEntriesByName('first-contentful-paint').length) start();
    });
    painting.observe({ type: 'paint', buffered: true });
  } else {
    requestAnimationFrame(() => requestAnimationFrame(start));
  }
})();
