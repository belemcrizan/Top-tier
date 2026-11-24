import { useSyncExternalStore } from 'react';
import { readRoute, routeHashes } from '../app/routes';
import type { Page, Route } from '../app/routes';

function subscribe(refresh: () => void): () => void {
  window.addEventListener('hashchange', refresh);
  window.addEventListener('popstate', refresh);
  return () => {
    window.removeEventListener('hashchange', refresh);
    window.removeEventListener('popstate', refresh);
  };
}

function navigate(page: Page): void {
  const hash = '#' + routeHashes[page];
  if (window.location.hash !== hash) {
    window.history.pushState(null, '', hash);
    window.dispatchEvent(new Event('hashchange'));
  }
}

export function useHashRoute(): { route: Route; navigate: (page: Page) => void } {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return { route: readRoute(hash), navigate };
}
