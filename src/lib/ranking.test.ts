import { expect, it } from 'vitest';
import { albums, songs, TIER_SCALE, tierForScore, tierLabels } from '../data/rankings';
import type { Song } from '../data/rankings';
import { albumText, songText } from '../data/translations';
import {
  defaultFilters,
  filterSongs,
  parseFavorites,
  parseScores,
  personalizeSongs,
} from './ranking';

const range = (length: number): number[] => Array.from({ length }, (_, index) => index + 1);
const ids = (rows: Song[]): string[] => rows.map((song) => song.id);

it('preserves the catalog, stable IDs, editorial scores and continuous positions', () => {
  expect(songs).toHaveLength(49);
  expect(new Set(ids(songs)).size).toBe(49);
  expect(songs.map((song) => song.posicaoGeral)).toEqual(range(49));
  const counts = { evermore: 17, folklore: 17, reputation: 15 };
  for (const { id } of albums) {
    const album = songs.filter((song) => song.album === id);
    expect(album).toHaveLength(counts[id]);
    expect(album.map((song) => song.numeroFaixa).sort((a, b) => a - b)).toEqual(range(counts[id]));
    expect(album.map((song) => song.posicaoNoAlbum)).toEqual(range(counts[id]));
    for (const song of album) {
      expect(song.id).toBe(`${id}-${String(song.numeroFaixa).padStart(2, '0')}`);
      expect(song.tier).toBe(tierForScore(song.pontuacao));
      expect(song.justificativa.length).toBeGreaterThan(50);
      expect(song.contexto.length).toBeGreaterThan(20);
    }
  }
});

it('provides both sets of editorial notes for every track and album', () => {
  for (const song of songs) {
    expect(songText(song, 'en').contexto).not.toBe(songText(song, 'pt-BR').contexto);
    expect(songText(song, 'en').justificativa).not.toBe(songText(song, 'pt-BR').justificativa);
  }
  for (const album of albums) {
    expect(albumText(album, 'en').descricao).not.toBe(albumText(album, 'pt-BR').descricao);
  }
});

it('B4: the same ranges classify and label every score without overlaps or gaps', () => {
  for (let score = 0; score <= 100; score += 1) {
    const matches = TIER_SCALE.filter(({ min, max }) => min <= score && score <= max);
    expect(matches).toHaveLength(1);
    expect(tierForScore(score)).toBe(matches[0].tier);
    expect(tierLabels[tierForScore(score)]).toBe(matches[0].label);
  }
});

it('personal scores recalculate global and album ranks without modifying editorial scores', () => {
  const before = JSON.stringify(songs);
  const originalTop = songs[0];
  const target = songs[songs.length - 1];
  const result = personalizeSongs(songs, { [target.id]: 100, [originalTop.id]: 0 });
  expect(result[0]).toMatchObject({ id: target.id, tier: 'S+', posicaoNoAlbum: 1 });
  expect(result.at(-1)).toMatchObject({ id: originalTop.id, tier: 'C' });
  expect(result.map((song) => song.posicaoGeral)).toEqual(range(49));
  const album = result.filter((song) => song.album === target.album);
  expect(album.map((song) => song.posicaoNoAlbum)).toEqual(range(album.length));
  expect(JSON.stringify(songs)).toBe(before);
});

it('breaks score ties by the original global rank even for a reversed input', () => {
  const tied = Object.fromEntries(songs.map((song) => [song.id, 90]));
  const result = personalizeSongs([...songs].reverse(), tied);
  expect(ids(result)).toEqual(ids(songs));
  expect(result.every((song) => song.tier === 'A')).toBe(true);
});

it('intersects album, tier, minimum score, title and favorite constraints', () => {
  const target = songs[0];
  const filters = {
    ...defaultFilters,
    album: target.album,
    tier: target.tier,
    minScore: target.pontuacao,
    search: `  ${target.titulo.toUpperCase()}  `,
    favoritesOnly: true,
  };
  expect(ids(filterSongs(songs, filters, [target.id]))).toEqual([target.id]);
  expect(filterSongs(songs, filters, [])).toHaveLength(0);
  expect(filterSongs(songs, { ...defaultFilters, search: 'a song that is not here' }, [])).toEqual(
    [],
  );
});

it('normalizes accents and apostrophes and preserves original positions in a filtered view', () => {
  const custom = { ...songs[0], titulo: 'Águas de Agosto' };
  expect(filterSongs([custom], { ...defaultFilters, search: 'AGUAS' }, [])).toHaveLength(1);
  expect(filterSongs(songs, { ...defaultFilters, search: "'tis the damn" }, [])).toHaveLength(1);
  const before = ids(songs);
  const subset = filterSongs(songs, { ...defaultFilters, album: 'reputation', sort: 'track' }, []);
  expect(subset.map((song) => song.numeroFaixa)).toEqual(range(15));
  expect(ids(songs)).toEqual(before);
  for (const song of subset) expect(songs[song.posicaoGeral - 1].id).toBe(song.id);
});

it('orders positions and scores deterministically', () => {
  const reversed = [...songs].reverse();
  expect(ids(filterSongs(reversed, defaultFilters, []))).toEqual(ids(songs));
  expect(ids(filterSongs(reversed, { ...defaultFilters, sort: 'score' }, []))).toEqual(ids(songs));
});

it('B1: sorts albums by editable collection order, followed by rank in the album', () => {
  const catalog = albums.map((album) => ({ ...album, ordemReferencia: -album.ordemReferencia }));
  const album = filterSongs(songs, { ...defaultFilters, sort: 'album' }, [], catalog);
  expect([...new Set(album.map((song) => song.album))]).toEqual([
    'reputation',
    'folklore',
    'evermore',
  ]);
  for (const { id } of catalog) {
    const items = album.filter((song) => song.album === id);
    expect(items.map((song) => song.posicaoNoAlbum)).toEqual(range(items.length));
  }
});

it('B2: finishes every track of an album before proceeding to the next album', () => {
  const order = filterSongs([...songs].reverse(), { ...defaultFilters, sort: 'track' }, []);
  const expected = [...albums]
    .sort((a, b) => a.ordemReferencia - b.ordemReferencia)
    .flatMap(({ id }) =>
      songs.filter((song) => song.album === id).sort((a, b) => a.numeroFaixa - b.numeroFaixa),
    );
  expect(ids(order)).toEqual(ids(expected));
});

it('rejects corrupt, stale and out-of-range browser storage', () => {
  const [first, second] = ids(songs);
  for (const raw of [null, '', '{bad', 'null', '[]', '42', '"text"'])
    expect(parseScores(raw)).toEqual({});
  expect(parseScores(JSON.stringify({ [first]: 0, [second]: 100, stale: 80 }))).toEqual({
    [first]: 0,
    [second]: 100,
  });
  for (const invalid of [-1, 101, 5.5, '90', null, false]) {
    expect(parseScores(JSON.stringify({ [first]: invalid }))).toEqual({});
  }
  for (const raw of [null, '', '{bad', 'null', '{}', '42']) expect(parseFavorites(raw)).toEqual([]);
  expect(parseFavorites(JSON.stringify([first, first, 'stale', 9, second]))).toEqual([
    first,
    second,
  ]);
});
