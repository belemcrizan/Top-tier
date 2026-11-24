import type { Song, Tier } from '../../data/rankings';
import { TIER_SCALE } from '../../data/tiers';

export function average(items: readonly Song[]): number | null {
  if (!items.length) return null;
  return items.reduce((sum, song) => sum + song.pontuacao, 0) / items.length;
}

export interface TierRow {
  tier: Tier;
  editorial: number;
  personal: number;
}

export function distribution(base: readonly Song[], personal: readonly Song[]): TierRow[] {
  return TIER_SCALE.map(({ tier }) => ({
    tier,
    editorial: base.filter((song) => song.tier === tier).length,
    personal: personal.filter((song) => song.tier === tier).length,
  }));
}

type Difference = { title: string; delta: number };
export function mostDivisive(base: readonly Song[], personal: readonly Song[]): Difference | null {
  const ratings = new Map(personal.map((song) => [song.id, song.pontuacao]));
  // Equal differences keep the earlier editorial rank, independently of the personal ordering.
  let result: Difference | null = null;
  for (const song of base) {
    const rating = ratings.get(song.id);
    if (rating === undefined) continue;
    const delta = rating - song.pontuacao;
    if (Math.abs(delta) > Math.abs(result?.delta ?? 0)) result = { title: song.titulo, delta };
  }
  return result;
}
