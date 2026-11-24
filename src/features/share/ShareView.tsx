import { useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { useRanking } from '../../app/RankingProvider';
import { songs } from '../../data/rankings';
import { useI18n } from '../../i18n';
import { personalizeSongs } from '../../lib/ranking';
import RankingView from '../ranking/RankingView';
import CompareView from './CompareView';
import { decodeRanking, rankingLink } from './encodeRanking';
import { ShareFiles } from './ShareFiles';
import { ShareCard } from './ShareCard';
import './share.css';

function ReceivedRanking({ payload }: { payload: string }): ReactElement {
  const { t } = useI18n();
  const [compare, setCompare] = useState(false);
  const scores = useMemo(() => decodeRanking(payload), [payload]);
  const tracks = useMemo(() => scores && personalizeSongs(songs, scores), [scores]);
  if (scores === null || tracks === null)
    return (
      <section className="share">
        <h1>{t('shareInvalid')}</h1>
        <p>{t('shareInvalidHelp')}</p>
        <a href="#meu-ranking" className="share__button">
          {t('shareOpenMine')}
        </a>
      </section>
    );
  if (compare)
    return (
      <>
        <button type="button" className="share__button" onClick={() => setCompare(false)}>
          {t('shareBack')}
        </button>
        <CompareView sharedScores={scores} />
      </>
    );
  return (
    <>
      <header className="share share__header">
        <h1>{t('shareReceived')}</h1>
        <p>{t('shareReadOnly')}</p>
        <button type="button" className="share__button" onClick={() => setCompare(true)}>
          {t('shareCompareMine')}
        </button>
      </header>
      <RankingView mode="shared" entries={tracks} readOnly />
    </>
  );
}

function MyShare(): ReactElement {
  const { t } = useI18n();
  const { personalSongs, notify } = useRanking();
  const input = useRef<HTMLInputElement>(null);
  // Freeze every published score, even for songs the sender has never manually edited.
  const link = useMemo(
    () =>
      rankingLink(
        window.location.href,
        Object.fromEntries(personalSongs.map((song) => [song.id, song.pontuacao])),
      ),
    [personalSongs],
  );

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(link);
      notify(t('shareCopied'));
    } catch {
      input.current?.focus();
      input.current?.select();
      notify(t('shareCopyFallback'));
    }
  }

  return (
    <section className="share">
      <header className="share__header">
        <h1>{t('shareTitle')}</h1>
        <p>{t('shareIntro')}</p>
      </header>
      <div className="share__workbench">
        <div className="share__controls">
          <section className="share__panel">
            <h2>{t('shareLinkHeading')}</h2>
            <p>{t('shareSnapshot')}</p>
            <label className="share__label" htmlFor="share-link">
              {t('shareLinkLabel')}
            </label>
            <div className="share__link-row">
              <input id="share-link" type="text" ref={input} value={link} readOnly />
              <button
                type="button"
                className="share__primary"
                onClick={() => {
                  void copy();
                }}
              >
                {t('shareCopy')}
              </button>
            </div>
          </section>
          <ShareFiles />
        </div>
        <ShareCard tracks={personalSongs} />
      </div>
    </section>
  );
}

export default function ShareView({ sharedHash }: { sharedHash?: string }): ReactElement {
  return sharedHash === undefined ? (
    <MyShare />
  ) : (
    <ReceivedRanking key={sharedHash} payload={sharedHash} />
  );
}
