import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useRanking } from '../../app/RankingProvider';
import { useI18n } from '../../i18n';
import { EraEmblem } from '../collection/EraEmblem';
import type { Outcome } from './elo';
import { useDuel } from './useDuel';
import './duel.css';

const shortcuts: Readonly<Record<string, Outcome | undefined>> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowDown: 'tie',
  s: 'skip',
  S: 'skip',
};

export default function DuelArena(): ReactElement {
  const { t } = useI18n();
  const { notify } = useRanking();
  const { left, right, choose, confidence, comparisons, apply } = useDuel();
  const [keys, setKeys] = useState(true);
  useEffect(() => {
    if (!keys) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        event.repeat ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        (target instanceof Element &&
          target.closest('input, select, textarea, [contenteditable]')) ||
        document.querySelector('dialog[open]')
      ) {
        return;
      }
      const decision = shortcuts[event.key];
      if (decision) {
        event.preventDefault();
        choose(decision);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, keys]);

  return (
    <section className="duel">
      <header className="duel__header">
        <h1>{t('duelTitle')}</h1>
        <p>{t('duelIntro')}</p>
      </header>
      {left && right ? (
        <>
          <div className="duel__pair" aria-live="polite" aria-atomic="true">
            {[left, right].map((song, i) => (
              <button
                type="button"
                key={i === 0 ? 'left' : 'right'}
                className="duel__choice"
                aria-label={t('duelChoose') + ' ' + song.titulo}
                onClick={() => choose(i === 0 ? 'left' : 'right')}
              >
                <span className="duel__art" aria-hidden="true">
                  <EraEmblem album={song.album} />
                </span>
                <span className="duel__label">
                  <small>{song.album}</small>
                  <strong>{song.titulo}</strong>
                </span>
                {keys && <kbd aria-hidden="true">{i === 0 ? '←' : '→'}</kbd>}
              </button>
            ))}
            <span className="duel__or" aria-hidden="true">
              {t('duelVersus')}
            </span>
          </div>
          <div className="duel__actions">
            <button type="button" onClick={() => choose('tie')}>
              {t('duelTie')} {keys && <kbd aria-hidden="true">↓</kbd>}
            </button>
            <button type="button" onClick={() => choose('skip')}>
              {t('duelSkip')} {keys && <kbd aria-hidden="true">S</kbd>}
            </button>
            <label>
              <input type="checkbox" checked={keys} onChange={(e) => setKeys(e.target.checked)} />
              {t('duelShortcuts')}
            </label>
          </div>
          <div className="duel__progress">
            <label htmlFor="duel-progress">
              {t('duelConfidence')} <strong>{confidence}%</strong>
            </label>
            <progress id="duel-progress" value={confidence} max={100} />
            <p>{t('duelCoverage')}</p>
            <p>
              {t('duelComparisons')} <strong>{comparisons}</strong>
            </p>
          </div>
          <div className="duel__actions">
            <button
              type="button"
              className="duel__apply"
              disabled={!comparisons}
              onClick={() => {
                apply();
                notify(t('duelApplied'));
              }}
            >
              {t('duelApply')}
            </button>
            <a href="#meu-ranking">{t('duelPersonal')}</a>
          </div>
        </>
      ) : (
        <p>{t('duelMissing')}</p>
      )}
    </section>
  );
}
