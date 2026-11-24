import { describe, expect, it } from 'vitest';
import { restoreRanking, serializeRanking, validateScores, validDuel } from './storage';

describe('versioned browser storage', () => {
  it('migrates both legacy keys once and preserves an intentional zero score', () => {
    const old = new Map([
      ['top-tier:scores:v1', '{"evermore-02":0,"folklore-01":83}'],
      ['top-tier:favorites:v1', '["evermore-02","evermore-02","reputation-04"]'],
    ]);
    const state = restoreRanking(null, (key) => old.get(key) ?? null);
    expect(state.scores).toEqual({ 'evermore-02': 0, 'folklore-01': 83 });
    expect(state.favorites).toEqual(['evermore-02', 'reputation-04']);
    expect(restoreRanking(serializeRanking(state), () => null)).toEqual(state);
  });
  it('recovers broken JSON from legacy keys and rejects damaged history', () => {
    expect(restoreRanking('{', () => null)).toEqual({ scores: {}, favorites: [], duelHistory: [] });
    const duel = { left: 'evermore-01', right: 'folklore-02', outcome: 'tie' };
    const saved = JSON.stringify({
      version: 2,
      scores: { 'evermore-01': 0, unknown: 99 },
      favorites: ['folklore-02', 'none'],
      duelHistory: [duel, null, { ...duel, right: duel.left }],
    });
    expect(restoreRanking(saved).duelHistory).toEqual([duel]);
    expect(restoreRanking(saved).scores).toEqual({ 'evermore-01': 0 });
    expect(restoreRanking(saved).favorites).toEqual(['folklore-02']);
    expect(validDuel({ ...duel, outcome: 'unknown' })).toBe(false);
  });
  it('rejects the entire import if a score or an ID is invalid', () => {
    for (const invalid of [[], null, { bad: 42 }, { 'evermore-01': 2.5 }, { 'evermore-01': 101 }]) {
      expect(validateScores(invalid)).toBeNull();
    }
    expect(validateScores({ 'evermore-01': 100 })).toEqual({ 'evermore-01': 100 });
  });
});
