import { describe, expect, it } from 'vitest';
import lz from 'lz-string';
import { songs } from '../../data/rankings';
import { decodeRanking, encodeRanking, parseRankingFile, rankingLink } from './encodeRanking';
import { MAX_JSON_BYTES, serializeRanking } from './encodeRanking';

const sample = { 'evermore-02': 0, 'folklore-08': 100, 'reputation-01': 55 };

describe('portable rankings', () => {
  it('round-trips a full catalog, zero scores and empty overrides', () => {
    const full = Object.fromEntries(songs.map((song) => [song.id, song.pontuacao]));
    for (const scores of [sample, full, {}]) {
      expect(decodeRanking(encodeRanking(scores))).toEqual(scores);
      expect(parseRankingFile(serializeRanking(scores))).toEqual(scores);
    }
  });

  it('keeps the deployment subpath and removes unrelated query and route state', () => {
    const url = new URL(rankingLink('https://example.org/Top-tier/?a=b#compartilhar', sample));
    expect(url.pathname).toBe('/Top-tier/');
    expect(url.search).toBe('');
    expect(decodeRanking(url.hash.slice(3))).toEqual(sample);
  });

  it('rejects malformed and excessive links before loading a ranking', () => {
    const fragment = (s: string): string => `2.${lz.compressToEncodedURIComponent(s)}`;
    const longBlock = fragment('a'.repeat(81));
    for (const value of [
      '',
      '1.test',
      '2.%2F',
      '2.',
      '2.a',
      longBlock,
      '2.' + 'x'.repeat(200),
      fragment('{}'),
      '2.' + 'A.'.repeat(900),
      '2.' + 'x'.repeat(40_000),
      encodeRanking(sample) + 'ZZ',
    ]) {
      expect(decodeRanking(value)).toBeNull();
    }
  });

  it('rejects corrupt files as a whole, including stale ids and out-of-range scores', () => {
    for (const value of [
      'null',
      'false',
      '[]',
      '{}',
      'not-json',
      'x'.repeat(MAX_JSON_BYTES + 1),
      '{"version":2}',
      '{"version":1,"scores":{}}',
      '{"version":2,"scores":{"new":90}}',
      '{"version":2,"scores":{"evermore-02":101}}',
    ]) {
      expect(parseRankingFile(value)).toBeNull();
    }
  });
});
