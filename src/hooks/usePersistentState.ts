import { useEffect, useReducer, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { safeRead } from '../lib/storage';

function applyUpdate<T>(prev: T, action: SetStateAction<T>): T {
  if (typeof action === 'function') return (action as (value: T) => T)(prev);
  return action;
}

export function usePersistentState<T>(
  key: string,
  parse: (raw: string | null) => T,
  serialize: (value: T) => string,
): readonly [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useReducer(applyUpdate<T>, key, (storedKey) =>
    parse(safeRead(storedKey)),
  );
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    try {
      window.localStorage.setItem(key, serialize(value));
      setAvailable(true);
    } catch {
      setAvailable(false);
    }
  }, [key, serialize, value]);
  return [value, setValue, available];
}
