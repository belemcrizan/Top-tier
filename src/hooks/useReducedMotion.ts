import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';

function subscribe(refresh: () => void): () => void {
  const media = window.matchMedia(query);
  media.addEventListener('change', refresh);
  return () => media.removeEventListener('change', refresh);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
