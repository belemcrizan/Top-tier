import { describe, expect, it } from 'vitest';
import { kendallTau } from './stats';

describe('Kendall tau for resolved positions', () => {
  const ids = ['a', 'b', 'c', 'd'];
  it('matches the ends of the scale', () => {
    expect(kendallTau(ids, ids)).toBe(1);
    expect(kendallTau(ids, [...ids].reverse())).toBe(-1);
  });
  it('counts one inverted pair and the neutral midpoint', () => {
    expect(kendallTau(ids, ['b', 'a', 'c', 'd'])).toBeCloseTo(2 / 3);
    expect(kendallTau(ids, ['d', 'a', 'b', 'c'])).toBe(0);
  });
  it('rejects incomplete orders, duplicate identifiers and mismatched sets', () => {
    for (const [left, right] of [
      [[], []],
      [['a'], ['a']],
      [ids, ['a']],
      [ids, ['a', 'b', 'c', 'x']],
      [ids, ['a', 'b', 'c', 'a']],
      [
        ['a', 'a'],
        ['a', 'b'],
      ],
    ]) {
      expect(kendallTau(left, right)).toBeNull();
    }
  });
});
