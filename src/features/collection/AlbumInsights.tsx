import { ChevronDown, ChartNoAxesColumnIncreasing } from 'lucide-react';
import type { JSX } from 'react';
import type { Song } from '../../data/rankings';
import { useI18n } from '../../i18n';
import { average, distribution, mostDivisive } from './insights';
import type { TierRow } from './insights';

type Group = 'editorial' | 'personal';
type InsightProps = { editorial: Song[]; personal: Song[] };

function TierBar({ rows, group }: { rows: TierRow[]; group: Group }): JSX.Element {
  const total = rows.reduce((sum, row) => sum + row[group], 0);
  const sizes = rows.map((row) => (total ? (row[group] / total) * 100 : 0));
  return (
    <svg
      className="insights__bar"
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {rows.map((row, i) => (
        <rect
          key={row.tier}
          x={sizes.slice(0, i).reduce((sum, size) => sum + size, 0)}
          width={sizes[i]}
          height="8"
          data-tier={row.tier}
          className="insights__segment"
        />
      ))}
    </svg>
  );
}

export function AlbumInsights({ editorial, personal }: InsightProps): JSX.Element {
  const { t, lang } = useI18n();
  const rows = distribution(editorial, personal);
  const difference = mostDivisive(editorial, personal);
  const number = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });
  const means = [average(editorial), average(personal)];
  return (
    <details className="insights">
      <summary>
        <ChartNoAxesColumnIncreasing size={18} /> {t('collectionInsight')}
        <ChevronDown size={17} className="insights__chevron" />
      </summary>
      <div className="insights__body">
        <div>
          <h4>{t('collectionDistribution')}</h4>
          {(['editorial', 'personal'] as const).map((group, i) => (
            <div className="insights__plot" key={group}>
              <span>{t(i ? 'collectionPersonal' : 'collectionEditorial')}</span>
              <TierBar rows={rows} group={group} />
            </div>
          ))}
          <table className="insights__table">
            <caption className="sr-only">{t('collectionChartTable')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('collectionTier')}</th>
                {rows.map((row) => (
                  <th key={row.tier} scope="col">
                    {row.tier}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(['editorial', 'personal'] as const).map((group, i) => (
                <tr key={group}>
                  <th scope="row">{t(i ? 'collectionPersonal' : 'collectionEditorial')}</th>
                  {rows.map((row) => (
                    <td key={row.tier}>{row[group]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h4>{t('collectionYourMean')}</h4>
          <p className="insights__mean" aria-label={t('collectionScale')}>
            {means[1] === null ? '—' : number.format(means[1])}
            <small> / 100</small>
          </p>
          <p className="insights__secondary">
            {t('collectionScore')} · {means[0] === null ? '—' : number.format(means[0])}
          </p>
          <h4>{t('collectionDivisive')}</h4>
          <p>
            {difference
              ? `${difference.title} · ${difference.delta > 0 ? '+' : ''}` +
                `${difference.delta} ${t('collectionPoints')}`
              : t('collectionSame')}
          </p>
        </div>
      </div>
    </details>
  );
}
