import { useEffect, useReducer, useState, useSyncExternalStore } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { safeRead } from '../lib/storage';

function applyUpdate<T>(prev: T, action: SetStateAction<T>): T {
  if (typeof action === 'function') return (action as (value: T) => T)(prev);
  return action;
}

// React uses the server snapshot during hydration, then restores browser preferences.
const subscribeToHydration = (): (() => void) => () => {};
const client = (): boolean => true;
const server = (): boolean => false;

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeToHydration, client, server);
}

export function usePersistentState<T>(
  key: string,
  parse: (raw: string | null) => T,
  serialize: (value: T) => string,
  serverValue?: T,
): readonly [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useReducer(applyUpdate<T>, key, (storedKey) =>
    parse(safeRead(storedKey)),
  );
  const useLocalValue = useHydrated();
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    try {
      window.localStorage.setItem(key, serialize(value));
      setAvailable(true);
    } catch {
      setAvailable(false);
    }
  }, [key, serialize, value]);
  return [useLocalValue ? value : (serverValue ?? parse(null)), setValue, available];
}
