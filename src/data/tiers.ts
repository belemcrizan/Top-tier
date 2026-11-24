import type { Tier } from './types';

type TierDefinition = Readonly<{ tier: Tier; label: string; min: number; max: number }>;

export const TIER_SCALE: readonly TierDefinition[] = [
  { tier: 'S+', label: 'God-Tier', min: 97, max: 100 },
  { tier: 'S', label: 'Top-Tier', min: 92, max: 96 },
  { tier: 'A', label: 'High-Tier', min: 85, max: 91 },
  { tier: 'B', label: 'Solid', min: 78, max: 84 },
  { tier: 'C', label: 'Situational', min: 0, max: 77 },
];

export function tierForScore(score: number): Tier {
  return TIER_SCALE.find(({ min }) => score >= min)?.tier ?? 'C';
}

export const tierLabels = Object.fromEntries(
  TIER_SCALE.map(({ tier, label }) => [tier, label]),
) as Record<Tier, string>;
