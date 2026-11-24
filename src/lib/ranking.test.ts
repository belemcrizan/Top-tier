import assert from 'node:assert/strict';
import test from 'node:test';
import { songs, tierForScore } from '../data/rankings';
import type { AlbumId } from '../data/rankings';
import { defaultFilters, filterSongs, parseFavorites, parseScores, personalizeSongs } from './ranking';

const range = (length: number) => Array.from({ length }, (_, index) => index + 1);

test('the collection contains every deluxe track with unique IDs and continuous positions', () => {
  assert.equal(songs.length, 49);
  assert.equal(new Set(songs.map((song) => song.id)).size, 49);
  assert.deepEqual(songs.map((song) => song.posicaoGeral).sort((a, b) => a - b), range(49));
  const counts: Record<AlbumId, number> = { evermore: 17, folklore: 17, reputation: 15 };
  for (const [album, count] of Object.entries(counts)) {
    const subset = songs.filter((song) => song.album === album);
    assert.equal(subset.length, count);
    assert.deepEqual(subset.map((song) => song.numeroFaixa).sort((a, b) => a - b), range(count));
    assert.deepEqual(subset.map((song) => song.posicaoNoAlbum).sort((a, b) => a - b), range(count));
  }
  for (const song of songs) {
    assert.equal(song.tier, tierForScore(song.pontuacao));
    assert.ok(song.justificativa.length > 50);
    assert.ok(song.contexto.length > 20);
  }
});

test('personal scores recalculate global and album ranks, preserving source objects', () => {
  const before = JSON.stringify(songs);
  const target = songs.find((song) => song.posicaoGeral === 49)!;
  const originalTop = songs.find((song) => song.posicaoGeral === 1)!;
  const result = personalizeSongs(songs, { [target.id]: 100, [originalTop.id]: 0 });
  assert.equal(result[0].id, target.id);
  assert.equal(result[0].tier, 'S+');
  assert.equal(result[0].posicaoNoAlbum, 1);
  assert.equal(result.at(-1)?.id, originalTop.id);
  assert.equal(result.at(-1)?.tier, 'C');
  assert.deepEqual(result.map((song) => song.posicaoGeral), range(49));
  const album = result.filter((song) => song.album === target.album);
  assert.deepEqual(album.map((song) => song.posicaoNoAlbum), range(album.length));
  assert.equal(JSON.stringify(songs), before);
});

test('equal scores use the original global rank as their stable tie breaker', () => {
  const tied = Object.fromEntries(songs.map((song) => [song.id, 90]));
  const result = personalizeSongs([...songs].reverse(), tied);
  assert.deepEqual(result.map((song) => song.id), [...songs].sort((a, b) => a.posicaoGeral - b.posicaoGeral).map((song) => song.id));
  assert.ok(result.every((song) => song.tier === 'A'));
});

test('album, tier, score, query and favorites filters combine as an intersection', () => {
  const target = songs[0];
  const result = filterSongs(songs, {
    ...defaultFilters,
    album: target.album,
    tier: target.tier,
    minScore: target.pontuacao,
    search: `  ${target.titulo.toUpperCase()}  `,
    favoritesOnly: true,
  }, [target.id]);
  assert.deepEqual(result.map((song) => song.id), [target.id]);
  assert.equal(filterSongs(songs, { ...defaultFilters, favoritesOnly: true }, []).length, 0);
  assert.equal(filterSongs(songs, { ...defaultFilters, search: 'a song that is not here' }, []).length, 0);
});

test('search ignores accents and filters do not renumber positions or mutate the data', () => {
  const custom = { ...songs[0], titulo: 'Águas de Agosto' };
  assert.equal(filterSongs([custom], { ...defaultFilters, search: 'AGUAS' }, []).length, 1);
  const before = songs.map((song) => song.id);
  const subset = filterSongs(songs, { ...defaultFilters, album: 'reputation', sort: 'track' }, []);
  assert.deepEqual(subset.map((song) => song.numeroFaixa), range(15));
  assert.deepEqual(songs.map((song) => song.id), before);
  assert.ok(subset.every((song) => song.posicaoGeral === songs.find((item) => item.id === song.id)?.posicaoGeral));
});

test('all sorting modes have deterministic ordering', () => {
  const reversed = [...songs].reverse();
  const ranked = filterSongs(reversed, defaultFilters, []);
  assert.deepEqual(ranked.map((song) => song.posicaoGeral), range(49));
  const scored = filterSongs(reversed, { ...defaultFilters, sort: 'score' }, []);
  assert.ok(scored.every((song, i) => i === 0 || scored[i - 1].pontuacao >= song.pontuacao));
  const album = filterSongs(reversed, { ...defaultFilters, sort: 'album' }, []);
  assert.deepEqual([...new Set(album.map((song) => song.album))], ['evermore', 'folklore', 'reputation']);
  for (let i = 1; i < album.length; i += 1) {
    if (album[i].album === album[i - 1].album) assert.ok(album[i].posicaoNoAlbum > album[i - 1].posicaoNoAlbum);
  }
});

test('score and favorite parsing rejects corrupt, stale and out-of-range browser storage', () => {
  const first = songs[0].id;
  const second = songs[1].id;
  for (const raw of [null, '', '{bad', 'null', '[]', '42', '"text"']) assert.deepEqual(parseScores(raw), {});
  assert.deepEqual(parseScores(JSON.stringify({ [first]: 0, [second]: 100, stale: 80 })), { [first]: 0, [second]: 100 });
  for (const invalid of [-1, 101, 5.5, '90', null, false]) {
    assert.deepEqual(parseScores(JSON.stringify({ [first]: invalid })), {});
  }
  for (const raw of [null, '', '{bad', 'null', '{}', '42']) assert.deepEqual(parseFavorites(raw), []);
  assert.deepEqual(parseFavorites(JSON.stringify([first, first, 'stale', 9, second])), [first, second]);
});
