import { describe, expect, it } from 'vitest';
import { duelConfidence, duelScores, replayDuels } from './elo';
import type { DuelRecord } from './elo';
import { nextPair } from './pairing';

const two = [
  { id: 'a', pontuacao: 80 },
  { id: 'b', pontuacao: 80 },
];
const left: DuelRecord = { left: 'a', right: 'b', outcome: 'left' };
const right: DuelRecord = { ...left, outcome: 'right' };
const tie: DuelRecord = { ...left, outcome: 'tie' };

describe('adaptive Elo', () => {
  it('gives the winner sixteen points in an evenly matched first round', () => {
    const ratings = replayDuels(two, [left]);
    expect(ratings.get('a')).toEqual({ points: 656, comparisons: 1 });
    expect(duelScores(ratings)).toEqual({ a: 82, b: 78 });
    expect(duelScores(replayDuels(two, [right]))).toEqual({ a: 78, b: 82 });
  });
  it('halves K independently after the tenth comparison of a track', () => {
    const catalog = [...two, { id: 'new', pontuacao: 80 }];
    const history = Array.from({ length: 10 }, () => tie);
    history.push({ left: 'a', right: 'new', outcome: 'left' });
    expect(duelScores(replayDuels(catalog, history))).toEqual({ a: 81, b: 80, new: 78 });
  });
  it('ignores skips, unknown tracks and self-comparisons', () => {
    const history: DuelRecord[] = [
      { ...left, outcome: 'skip' },
      { ...left, right: 'missing' },
      { ...left, right: 'a' },
    ];
    expect(duelScores(replayDuels(two, history))).toEqual({});
  });
  it('clamps scores, counts ties as evidence and caps per-track confidence', () => {
    const catalog = [
      { id: 'a', pontuacao: 100 },
      { id: 'b', pontuacao: 0 },
    ];
    const history = Array.from({ length: 12 }, () => left);
    expect(duelScores(replayDuels(catalog, history))).toEqual({ a: 100, b: 0 });
    expect(duelConfidence(replayDuels(two, [tie]))).toBe(10);
    expect(duelConfidence(replayDuels(two, history))).toBe(100);
    expect(duelConfidence(replayDuels([], []))).toBe(0);
  });
});

describe('pair selection', () => {
  const catalog = [...two, { id: 'c', pontuacao: 90 }, { id: 'd', pontuacao: 91 }];
  it('prefers close, under-sampled opponents and avoids recently skipped pairs', () => {
    expect(nextPair(replayDuels(catalog, []), [])).toEqual(['a', 'b']);
    expect(nextPair(replayDuels(catalog, [left]), [left])).toEqual(['d', 'c']);
    const skip: DuelRecord = { ...left, outcome: 'skip' };
    expect(nextPair(replayDuels(catalog, [skip]), [skip])).toEqual(['d', 'c']);
  });
  it('avoids the newest recent pair when the catalog is small', () => {
    const small = catalog.slice(0, 3);
    const history: DuelRecord[] = [left, { ...left, right: 'c' }, { ...left, left: 'c' }];
    expect(nextPair(replayDuels(small, history), history)).toEqual(['b', 'a']);
    expect(nextPair(replayDuels([], []), [])).toBeNull();
    expect(nextPair(replayDuels(two.slice(0, 1), []), [])).toBeNull();
  });
});
