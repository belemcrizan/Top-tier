import { useCallback, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useRanking } from '../../app/RankingProvider';
import { useI18n } from '../../i18n';
import { DuelChoice } from './DuelChoice';
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
  const submitChoice = useCallback(
    (outcome: Outcome) => {
      if (!left || !right) return;
      choose(outcome);
      if (outcome === 'tie' || outcome === 'skip') {
        notify(t(outcome === 'tie' ? 'duelTied' : 'duelSkipped'));
      } else {
        const winner = outcome === 'left' ? left : right;
        notify(t('duelPicked') + ' ' + winner.titulo + '.');
      }
    },
    [choose, left, right, notify, t],
  );
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
        submitChoice(decision);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [submitChoice, keys]);

  return (
    <section className="duel">
      <header className="duel__header">
        <h1>{t('duelTitle')}</h1>
        <p>{t('duelIntro')}</p>
      </header>
      {left && right ? (
        <>
          <div className="duel__pair" aria-live="polite" aria-atomic="true">
            <DuelChoice
              song={left}
              shortcut={keys ? '←' : undefined}
              onChoose={() => submitChoice('left')}
            />
            <DuelChoice
              song={right}
              shortcut={keys ? '→' : undefined}
              onChoose={() => submitChoice('right')}
            />
            <span className="duel__or" aria-hidden="true">
              {t('duelVersus')}
            </span>
          </div>
          <div className="duel__actions">
            <button type="button" onClick={() => submitChoice('tie')}>
              {t('duelTie')} {keys && <kbd aria-hidden="true">↓</kbd>}
            </button>
            <button type="button" onClick={() => submitChoice('skip')}>
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
