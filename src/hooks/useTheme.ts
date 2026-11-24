import { useSyncExternalStore } from 'react';
import { usePersistentState } from './usePersistentState';

type Theme = 'light' | 'dark';
const query = '(prefers-color-scheme: dark)';

function subscribe(callback: () => void): () => void {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function parseTheme(raw: string | null): Theme | 'system' {
  return raw === 'light' || raw === 'dark' ? raw : 'system';
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const systemDark = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
  const [choice, setChoice] = usePersistentState('top-tier:theme:v1', parseTheme, String);
  const theme = choice === 'system' ? (systemDark ? 'dark' : 'light') : choice;
  return { theme, toggle: () => setChoice(theme === 'dark' ? 'light' : 'dark') };
}
