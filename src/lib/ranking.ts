import { albums, songs, tierForScore } from '../data/rankings';
import type { Album, AlbumId, Song, Tier } from '../data/rankings';

/** User scores override the editorial score; omitted songs keep their original score. */
export type PersonalScores = Record<string, number>;
export type SortKey = 'rank' | 'score' | 'album' | 'track';
export type RankingFilters = {
  search: string;
  album: AlbumId | 'all';
  tier: Tier | 'all';
  minScore: number;
  sort: SortKey;
  favoritesOnly: boolean;
};

export const defaultFilters: RankingFilters = {
  search: '',
  album: 'all',
  tier: 'all',
  minScore: 0,
  sort: 'rank',
  favoritesOnly: false,
};

const validScore = (score: unknown): score is number =>
  typeof score === 'number' && Number.isInteger(score) && score >= 0 && score <= 100;

const normalize = (value: string) =>
  value
    .replace(/[’‘]/g, "'")
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();

/** Recompute every position before applying filters so ranks never depend on the visible subset. */
export function personalizeSongs(base: readonly Song[], scores: PersonalScores): Song[] {
  const result = base
    .map((song) => {
      const score = scores[song.id];
      const pontuacao = validScore(score) ? score : song.pontuacao;
      return { ...song, pontuacao, tier: tierForScore(pontuacao) };
    })
    .sort(
      (a, b) =>
        b.pontuacao - a.pontuacao || a.posicaoGeral - b.posicaoGeral || a.id.localeCompare(b.id),
    );

  const albumPositions = new Map<AlbumId, number>();
  return result.map((song, index) => {
    const position = (albumPositions.get(song.album) ?? 0) + 1;
    albumPositions.set(song.album, position);
    return { ...song, posicaoGeral: index + 1, posicaoNoAlbum: position };
  });
}

/** Intersect all filters, then sort a fresh array without mutating source data. */
export function filterSongs(
  base: readonly Song[],
  filters: RankingFilters,
  favorites: readonly string[],
  albumCatalog: readonly Pick<Album, 'id' | 'ordemReferencia'>[] = albums,
): Song[] {
  const order = new Map(albumCatalog.map(({ id, ordemReferencia }) => [id, ordemReferencia]));
  function compareAlbums(a: Song, b: Song): number {
    return (order.get(a.album) ?? Infinity) - (order.get(b.album) ?? Infinity);
  }
  const query = normalize(filters.search);
  const favoriteSet = new Set(favorites);
  const result = base.filter(
    (song) =>
      (filters.album === 'all' || song.album === filters.album) &&
      (filters.tier === 'all' || song.tier === filters.tier) &&
      song.pontuacao >= filters.minScore &&
      (!query || normalize(song.titulo).includes(query)) &&
      (!filters.favoritesOnly || favoriteSet.has(song.id)),
  );

  return result.sort((a, b) => {
    switch (filters.sort) {
      case 'score':
        return b.pontuacao - a.pontuacao || a.posicaoGeral - b.posicaoGeral;
      case 'album':
        return compareAlbums(a, b) || a.posicaoNoAlbum - b.posicaoNoAlbum;
      case 'track':
        return (
          compareAlbums(a, b) || a.numeroFaixa - b.numeroFaixa || a.posicaoGeral - b.posicaoGeral
        );
      default:
        return a.posicaoGeral - b.posicaoGeral;
    }
  });
}

/** Treat browser storage as untrusted input, including stale IDs from older datasets. */
export function parseScores(raw: string | null): PersonalScores {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const ids = new Set(songs.map((song) => song.id));
    return Object.fromEntries(
      Object.entries(parsed).filter(([id, score]) => ids.has(id) && validScore(score)),
    );
  } catch {
    return {};
  }
}

export function parseFavorites(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const ids = new Set(songs.map((song) => song.id));
    return [...new Set(parsed.filter((id): id is string => typeof id === 'string' && ids.has(id)))];
  } catch {
    return [];
  }
}
