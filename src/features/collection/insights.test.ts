import { describe, expect, it } from 'vitest';
import { songs } from '../../data/rankings';
import type { Song } from '../../data/rankings';
import { average, distribution, mostDivisive } from './insights';

const one: Song = { ...songs[0], id: 'a', titulo: 'First', pontuacao: 87, tier: 'A' };
const two: Song = { ...songs[1], id: 'b', titulo: 'Second', pontuacao: 79, tier: 'B' };

describe('era insights', () => {
  it('returns an explicit empty state rather than dividing by zero (B8)', () => {
    expect(average([])).toBeNull();
    expect(average([one, two])).toBe(83);
  });

  it('keeps empty tiers, reports both distributions, and accepts empty albums', () => {
    const rows = distribution([one, two], [{ ...two, tier: 'A' }, one]);
    expect(rows).toHaveLength(5);
    expect(rows.find((row) => row.tier === 'A')).toEqual({ tier: 'A', editorial: 1, personal: 2 });
    expect(distribution([], []).every((r) => !r.editorial && !r.personal)).toBe(true);
  });

  it('compares by stable ID and breaks equal differences in editorial order', () => {
    const changed = [
      { ...two, pontuacao: 85 },
      { ...one, pontuacao: 81 },
    ];
    expect(mostDivisive([one, two], changed)).toEqual({ title: 'First', delta: -6 });
    expect(mostDivisive([one, two], [two])).toBeNull();
    expect(mostDivisive([], [])).toBeNull();
  });
});
