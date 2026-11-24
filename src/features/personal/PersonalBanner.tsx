import type { JSX } from 'react';
import { RotateCcw } from 'lucide-react';
import { useRanking } from '../../app/RankingProvider';
import { useI18n } from '../../i18n';

export function PersonalBanner(): JSX.Element {
  const { t } = useI18n();
  const { scores, resetScores, notify } = useRanking();
  return (
    <aside className="ranking-personal">
      <p>{t('rankRateHint')}</p>
      <button
        type="button"
        className="ranking__secondary"
        disabled={Object.keys(scores).length === 0}
        onClick={() => {
          resetScores();
          notify(t('rankResetDone'));
        }}
      >
        <RotateCcw size={16} /> {t('rankReset')}
      </button>
    </aside>
  );
}
