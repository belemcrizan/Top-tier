import type { Tier } from '../data/rankings';
import { tierLabels } from '../data/rankings';
export function TierBadge({ tier, full = false }: {tier: Tier; full?: boolean}) {
 return <span className={`tier tier-${tier.replace('+','plus')}`} title={tierLabels[tier]}>{tier}{full && <span>{tierLabels[tier]}</span>}</span>;
}
