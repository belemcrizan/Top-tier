import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { songs } from '../../data/rankings';
import { useRankMotion } from './useRankMotion';

describe('rank movement', () => {
  it('commits immediately when reduced motion is enabled', () => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    vi.spyOn(window, 'matchMedia').mockReturnValue({ ...media, matches: true });
    const { result } = renderHook(useRankMotion);
    const commit = vi.fn();
    act(() => result.current.apply(songs[0], commit));
    expect(commit).toHaveBeenCalledOnce();
    expect(result.current.movement?.id).toBe(songs[0].id);
  });

  it('uses the native transition callback when supported', () => {
    const previous = Object.getOwnPropertyDescriptor(document, 'startViewTransition');
    const transition = vi.fn((apply: () => void) => apply());
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: transition,
    });
    try {
      const { result } = renderHook(useRankMotion);
      const commit = vi.fn();
      act(() => result.current.apply(songs[0], commit));
      expect(transition).toHaveBeenCalledOnce();
      expect(commit).toHaveBeenCalledOnce();
    } finally {
      if (previous) Object.defineProperty(document, 'startViewTransition', previous);
      else Reflect.deleteProperty(document, 'startViewTransition');
    }
  });

  it('animates displaced rows using their before-and-after geometry as a fallback', () => {
    const { result } = renderHook(useRankMotion);
    const list = document.createElement('ol');
    const item = list.appendChild(document.createElement('li'));
    const animate = vi.fn();
    item.animate = animate;
    let top = 270;
    vi.spyOn(item, 'getBoundingClientRect').mockImplementation(() => DOMRect.fromRect({ y: top }));
    document.body.appendChild(list);
    result.current.container.current = list;
    try {
      act(() =>
        result.current.apply(songs[0], () => {
          top = 72;
        }),
      );
      expect(animate).toHaveBeenCalledWith(
        [{ transform: 'translateY(198px)' }, { transform: 'none' }],
        expect.objectContaining({ duration: 240 }),
      );
    } finally {
      list.remove();
    }
  });
});
