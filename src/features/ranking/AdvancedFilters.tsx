import type { JSX } from 'react';
import type { Tier } from '../../data/rankings';
import { TIER_SCALE } from '../../data/tiers';
import { useI18n } from '../../i18n';
import type { RankingFilters } from '../../lib/ranking';
import type { SetFilter } from './filters';

export function AdvancedFilters({
  filters,
  set,
}: {
  filters: RankingFilters;
  set: SetFilter;
}): JSX.Element {
  const { t } = useI18n();
  return (
    <div className="ranking-toolbar__advanced">
      <label>
        {t('rankTier')}
        <select
          value={filters.tier}
          onChange={(event) => set('tier', event.currentTarget.value as Tier | 'all')}
        >
          <option value="all">{t('rankAllTiers')}</option>
          {TIER_SCALE.map(({ tier, label }) => (
            <option key={tier} value={tier}>
              {tier} · {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>
          {t('rankMinimum')} · {filters.minScore}/100
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={filters.minScore}
          onChange={(event) => set('minScore', event.currentTarget.valueAsNumber)}
        />
      </label>
    </div>
  );
}
