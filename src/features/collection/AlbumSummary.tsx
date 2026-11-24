import type { JSX } from 'react';
import type { Album, Song } from '../../data/rankings';
import { albumText } from '../../data/translations';
import { useI18n } from '../../i18n';
import { AlbumInsights } from './AlbumInsights';
import { average } from './insights';

interface SummaryProps {
  album: Album;
  editorial: Song[];
  personal: Song[];
}

export function AlbumSummary({ album, editorial, personal }: SummaryProps): JSX.Element {
  const { lang, t } = useI18n();
  const copy = albumText(album, lang);
  const mean = average(editorial);
  const top = editorial.find((song) => song.posicaoNoAlbum === 1);
  return (
    <section className="era-summary" aria-label={album.titulo} data-era={album.id}>
      <div className="era-summary__content">
        <div>
          <div className="era-summary__heading">
            <h3 lang="en">{album.titulo}</h3>
            <span>
              {copy.edicao} · {album.ano}
            </span>
          </div>
          <p className="era-summary__aesthetic">{copy.estetica}</p>
        </div>
        <div className="era-summary__notes">
          <p>{copy.descricao}</p>
          <p className="era-summary__highlight">{copy.destaque}</p>
        </div>
        {mean === null ? (
          <p>{t('collectionEmpty')}</p>
        ) : (
          <dl className="era-summary__stats">
            <div>
              <dt>{t('collectionScore')}</dt>
              <dd>
                {mean.toLocaleString(lang, { maximumFractionDigits: 1 })}
                <small> / 100</small>
              </dd>
            </div>
            <div>
              <dt>{t('collectionTop')}</dt>
              <dd>{top?.titulo ?? '—'}</dd>
            </div>
          </dl>
        )}
      </div>
      {editorial.length > 0 && <AlbumInsights editorial={editorial} personal={personal} />}
    </section>
  );
}
