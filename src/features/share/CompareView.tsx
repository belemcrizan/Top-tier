import { useId } from 'react';
import type { ReactElement } from 'react';
import { useRanking } from '../../app/RankingProvider';
import { songs } from '../../data/rankings';
import type { Song } from '../../data/rankings';
import { useI18n } from '../../i18n';
import { personalizeSongs } from '../../lib/ranking';
import type { PersonalScores } from '../../lib/ranking';
import { kendallTau } from '../../lib/stats';
import './share.css';

type Props = { sharedScores?: PersonalScores };

function PositionList({ entries, other }: { entries: Song[]; other?: Song[] }): ReactElement {
  const { t } = useI18n();
  const positions = new Map(other?.map((song, index) => [song.id, index]));
  return (
    <ol className="compare__list">
      {entries.map((song, index) => {
        const shift = (positions.get(song.id) ?? index) - index;
        const change = shift > 0 ? 'compareUp' : 'compareDown';
        const label = shift ? `${t(change)} ${Math.abs(shift)}` : t('compareSame');
        return (
          <li key={song.id}>
            <span className="compare__number" aria-hidden="true">
              {index + 1}
            </span>
            <span className="compare__name">{song.titulo}</span>
            {other && (
              <span className="compare__shift">
                <span aria-hidden="true">
                  {shift ? `${shift > 0 ? '↑' : '↓'}${Math.abs(shift)}` : '—'}
                </span>
                <span className="share__sr">{label}</span>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Connections({ left, right }: { left: Song[]; right: Song[] }): ReactElement {
  const positions = new Map(right.map((song, index) => [song.id, index]));
  return (
    <svg
      viewBox={`0 0 100 ${left.length}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="compare__lines"
    >
      {left.map((song, index) => {
        const end = (positions.get(song.id) ?? index) + 0.5;
        const start = index + 0.5;
        return (
          <path
            key={song.id}
            d={`M0 ${start} C45 ${start} 55 ${end} 100 ${end}`}
            className={start === end ? 'compare__steady' : 'compare__moved'}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

export default function CompareView({ sharedScores }: Props): ReactElement {
  const { personalSongs } = useRanking();
  const { t, lang } = useI18n();
  const heading = useId();
  const left = sharedScores ? personalSongs : songs;
  const right = sharedScores ? personalizeSongs(songs, sharedScores) : personalSongs;
  const tau = kendallTau(
    left.map((song) => song.id),
    right.map((song) => song.id),
  );
  const value = tau?.toLocaleString(lang, { maximumFractionDigits: 2, signDisplay: 'exceptZero' });

  return (
    <section className="share compare" aria-labelledby={heading}>
      <header className="share__header">
        <h1 id={heading}>{t('compareTitle')}</h1>
        <p>{t('compareHelp')}</p>
      </header>
      <div className="compare__metric">
        <div>
          <strong>{value ?? '—'}</strong>
          <span>{t('compareIndex')}</span>
        </div>
        <p>{t(value === undefined ? 'compareUnavailable' : 'compareLegend')}</p>
      </div>
      <div className="compare__columns">
        <h2>{t(sharedScores ? 'comparePersonal' : 'compareEditorial')}</h2>
        <h2>{t(sharedScores ? 'compareReceived' : 'comparePersonal')}</h2>
      </div>
      <section aria-label={t('compareChart')}>
        <div className="compare__plot">
          <PositionList entries={left} />
          <Connections left={left} right={right} />
          <PositionList entries={right} other={left} />
        </div>
      </section>
    </section>
  );
}
