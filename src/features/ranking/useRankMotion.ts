import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { flushSync } from 'react-dom';
import type { Song } from '../../data/rankings';

type Offsets = Map<Element, number>;
interface Movement {
  id: string;
  original: number;
}
interface Motion {
  container: RefObject<HTMLOListElement | null>;
  movement: Movement | null;
  apply: (song: Song, commit: () => void) => void;
}

function measure(container: HTMLOListElement | null): Offsets {
  return new Map(
    Array.from(container?.children ?? [], (row) => [row, row.getBoundingClientRect().y]),
  );
}

function flip(offsets: Offsets): void {
  for (const [row, oldY] of offsets) {
    const distance = oldY - row.getBoundingClientRect().y;
    if (row.isConnected && distance && typeof row.animate === 'function') {
      row.animate([{ transform: `translateY(${distance}px)` }, { transform: 'none' }], {
        duration: 240,
        easing: 'cubic-bezier(.2,.7,.2,1)',
      });
    }
  }
}

export function useRankMotion(): Motion {
  const container = useRef<HTMLOListElement>(null);
  const [movement, setMovement] = useState<Movement | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function apply(song: Song, commit: () => void): void {
    const updated = (): void => {
      flushSync(() => {
        commit();
        setMovement({ id: song.id, original: song.posicaoGeral });
      });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMovement(null), 1500);
    };
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      updated();
    } else if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(updated);
    } else {
      const before = measure(container.current);
      updated();
      flip(before);
    }
  }
  return { apply, container, movement };
}
