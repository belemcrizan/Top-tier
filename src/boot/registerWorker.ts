export function registerWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  const base = import.meta.env.BASE_URL;
  const register = (): void => {
    // Browsers that restrict offline storage can still use the complete online collection.
    void navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {});
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
