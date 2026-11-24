import axe from 'axe-core';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { JSX } from 'react';
import { expect, it, vi } from 'vitest';
import { RankingProvider, useRanking } from '../../app/RankingProvider';
import { songs } from '../../data/rankings';
import { I18nProvider } from '../../i18n';
import RankingView from './RankingView';
import type { RankingMode } from './RankingView';
import { youTubeMusicLink } from './songLink';

function View({ mode }: { mode: RankingMode }): JSX.Element {
  const { personalSongs } = useRanking();
  return <RankingView mode={mode} entries={mode === 'personal' ? personalSongs : songs} />;
}

function mount(mode: RankingMode): void {
  render(
    <I18nProvider>
      <RankingProvider>
        <main>
          <View mode={mode} />
        </main>
      </RankingProvider>
    </I18nProvider>,
  );
}

it('keeps results stable while typing and applies the last input after 150 ms', () => {
  vi.useFakeTimers();
  mount('overall');
  const search = screen.getByRole('searchbox');
  fireEvent.change(search, { target: { value: 'champagne' } });
  act(() => vi.advanceTimersByTime(100));
  fireEvent.change(search, { target: { value: 'a song that does not exist' } });
  act(() => vi.advanceTimersByTime(149));
  expect(screen.getAllByRole('listitem')).toHaveLength(songs.length);
  act(() => vi.advanceTimersByTime(1));
  expect(screen.getByText('Nenhuma faixa com esse filtro.')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
  act(() => vi.advanceTimersByTime(150));
  expect(screen.getAllByRole('listitem')).toHaveLength(songs.length);
});

it('moves the rated track, announces its live tier and restores the editorial order', () => {
  vi.useFakeTimers();
  mount('personal');
  const first = songs[0];
  const trigger = screen.getByRole('button', { name: `Detalhes de ${first.titulo}` });
  trigger.focus();
  fireEvent.click(trigger);
  const modal = screen.getByRole('dialog');
  const slider = within(modal).getByRole('slider', { name: 'Sua nota' });
  fireEvent.change(slider, { target: { value: '0' } });
  expect(slider).toHaveAttribute('aria-valuetext', '0, tier C, Situational');
  fireEvent.click(within(modal).getByRole('button', { name: 'Salvar nota' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getAllByRole('listitem').at(-1)).toContainElement(trigger);
  const change = screen.getByText(`↓ ${songs.length - 1}`);
  expect(change).toBeVisible();
  act(() => vi.advanceTimersByTime(1500));
  expect(change).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: 'Restaurar notas originais' }));
  expect(screen.getAllByRole('listitem')[0]).toContainElement(trigger);
});

it('combines filters and supports adding and removing a favorite', () => {
  mount('overall');
  fireEvent.click(screen.getByRole('button', { name: 'Adicionar aos favoritos · Getaway Car' }));
  fireEvent.click(screen.getByRole('button', { name: 'Só favoritas' }));
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Filtros' }));
  fireEvent.change(screen.getByLabelText('Tier'), { target: { value: 'C' } });
  expect(screen.getByRole('heading', { name: 'Nenhuma faixa com esse filtro.' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
  fireEvent.click(screen.getByRole('button', { name: 'Remover dos favoritos · Getaway Car' }));
  expect(
    screen.getByRole('button', { name: 'Adicionar aos favoritos · Getaway Car' }),
  ).toBeVisible();
});

it('opens an encoded YouTube Music search, including punctuation and album', async () => {
  mount('shared');
  const song = songs.find(({ titulo }) => titulo.includes('Bon Iver'));
  if (!song) throw new Error('Missing fixture');
  fireEvent.click(screen.getByRole('button', { name: `Detalhes de ${song.titulo}` }));
  const dialog = screen.getByRole('dialog');
  const link = within(dialog).getByRole('link', { name: 'Abrir no YouTube Music' });
  const url = new URL(youTubeMusicLink(song));
  expect(link).toHaveAttribute('href', url.href);
  expect(url.origin).toBe('https://music.youtube.com');
  expect(url.pathname).toBe('/search');
  expect(url.searchParams.get('q')).toBe(`Taylor Swift ${song.titulo} ${song.album}`);
  expect(within(dialog).queryByRole('slider')).not.toBeInTheDocument();
  expect(within(dialog).queryByRole('button', { name: /favoritos/i })).not.toBeInTheDocument();
  const result = await axe.run(dialog, { rules: { 'color-contrast': { enabled: false } } });
  expect(result.violations).toEqual([]);
});
