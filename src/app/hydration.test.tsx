import { act, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { Application } from './Application';
import { renderCollection } from '../prerender';
import { RANKING_KEY, restoreRanking } from '../lib/storage';

it('hydrates the static collection in place and keeps local preferences and legacy scores', async () => {
  const container = document.createElement('div');
  document.body.append(container);
  container.innerHTML = renderCollection();
  const heading = within(container).getByRole('heading', { level: 1 });
  expect(heading).toHaveTextContent('Três eras');
  expect(container.querySelector('img.room__art')).toHaveAttribute('fetchpriority', 'high');
  localStorage.setItem('top-tier:theme:v1', 'dark');
  localStorage.setItem('top-tier:guide:v2', 'true');
  localStorage.setItem('top-tier:scores:v1', JSON.stringify({ 'evermore-02': 48 }));
  const onRecoverableError = vi.fn();
  let root: Root | undefined;
  try {
    await act(async () => {
      root = hydrateRoot(container, <Application />, { onRecoverableError });
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(within(container).getByRole('heading', { level: 1 })).toBe(heading);
    expect(container.querySelector('.guide')).toBeNull();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(restoreRanking(localStorage.getItem(RANKING_KEY)).scores['evermore-02']).toBe(48);
  } finally {
    await act(async () => root?.unmount());
    container.remove();
  }
});
