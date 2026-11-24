import { useState } from 'react';
import type { JSX } from 'react';
import { tierForScore, tierLabels } from '../../data/rankings';
import { useI18n } from '../../i18n';
import { TierMark } from '../ranking/TierMark';

interface Props {
  score: number;
  save: (score: number) => void;
}

export function ScoreSlider({ score, save }: Props): JSX.Element {
  const { t } = useI18n();
  const [draft, setDraft] = useState(score);
  const tier = tierForScore(draft);
  return (
    <form
      className="score-editor"
      onSubmit={(event) => {
        event.preventDefault();
        save(draft);
      }}
    >
      <div className="score-editor__heading">
        <label htmlFor="song-score">{t('rankRate')}</label>
        <strong>{draft}/100</strong>
        <TierMark tier={tier} />
      </div>
      <input
        id="song-score"
        type="range"
        min={0}
        max={100}
        step={1}
        value={draft}
        aria-valuetext={`${draft}, tier ${tier}, ${tierLabels[tier]}`}
        onChange={(event) => setDraft(event.currentTarget.valueAsNumber)}
      />
      <button type="submit" className="ranking__primary">
        {t('rankSave')}
      </button>
    </form>
  );
}
