import type { JSX } from 'react';
import type { Tier } from '../../data/rankings';
import { TIER_SCALE } from '../../data/tiers';

const shapes: Record<Tier, string> = { 'S+': '✦', S: '◆', A: '▴', B: '▰', C: '●' };

export function TierMark({ tier }: { tier: Tier }): JSX.Element {
  const label = TIER_SCALE.find((entry) => entry.tier === tier)?.label;
  const modifier = tier === 'S+' ? 'splus' : tier.toLowerCase();
  return (
    <span className={`tier-mark tier-mark--${modifier}`} title={label}>
      <span aria-hidden="true">{shapes[tier]}</span>
      {tier}
    </span>
  );
}
