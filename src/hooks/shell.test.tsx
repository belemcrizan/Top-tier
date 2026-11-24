import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Toast } from '../components/Toast';
import { RANKING_KEY, restoreRanking, serializeRanking } from '../lib/storage';
import { rankingReducer } from '../lib/rankingState';
import { useHashRoute } from './useHashRoute';
import { usePersistentState } from './usePersistentState';

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  window.history.replaceState(null, '', '/');
});

describe('browser integration regressions', () => {
  it('B5 applies and persists rapid edits to different songs in the same React batch', () => {
    const { result } = renderHook(() =>
      usePersistentState(RANKING_KEY, restoreRanking, serializeRanking),
    );
    act(() => {
      const [, set] = result.current;
      set((prev) => rankingReducer(prev, { type: 'score', id: 'evermore-02', value: 41 }));
      set((prev) => rankingReducer(prev, { type: 'score', id: 'folklore-01', value: 100 }));
    });
    expect(restoreRanking(localStorage.getItem(RANKING_KEY)).scores).toEqual({
      'evermore-02': 41,
      'folklore-01': 100,
    });
  });
  it('B6 pushes a history entry and follows hashchange and popstate', () => {
    const push = vi.spyOn(history, 'pushState');
    const { result } = renderHook(useHashRoute);
    act(() => result.current.navigate('duel'));
    expect(push).toHaveBeenCalledWith(null, '', '#duelo');
    expect(result.current.route.page).toBe('duel');
    for (const [hash, type, page] of [
      ['#compartilhar', 'hashchange', 'share'],
      ['#ranking', 'popstate', 'overall'],
    ]) {
      act(() => {
        history.replaceState(null, '', hash);
        window.dispatchEvent(new Event(type));
      });
      expect(result.current.route.page).toBe(page);
    }
    push.mockRestore();
  });
  it('B10 dismisses after five active seconds and pauses for pointer and keyboard', () => {
    vi.useFakeTimers();
    const dismiss = vi.fn();
    render(<Toast message="Saved" close="Close" dismiss={dismiss} />);
    const toast = screen.getByRole('status').parentElement;
    if (!toast) throw new Error('Missing toast');
    act(() => vi.advanceTimersByTime(2000));
    fireEvent.pointerEnter(toast);
    act(() => vi.advanceTimersByTime(6000));
    fireEvent.focus(screen.getByRole('button'));
    fireEvent.pointerLeave(toast);
    act(() => vi.advanceTimersByTime(6000));
    expect(dismiss).not.toHaveBeenCalled();
    fireEvent.blur(screen.getByRole('button'));
    act(() => vi.advanceTimersByTime(2999));
    expect(dismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(dismiss).toHaveBeenCalledOnce();
  });
});
