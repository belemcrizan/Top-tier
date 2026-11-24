import { Disc3, Swords } from 'lucide-react';
import type { JSX } from 'react';
import { useI18n } from '../../i18n';
import { numeroPorExtenso } from '../../lib/format';

interface HeroProps {
  albumCount: number;
  trackCount: number;
  browse: () => void;
}

export function CollectionHero({ albumCount, trackCount, browse }: HeroProps): JSX.Element {
  const { t, lang } = useI18n();
  const amount = numeroPorExtenso(albumCount, lang);
  const headline = amount.charAt(0).toLocaleUpperCase(lang) + amount.slice(1);
  return (
    <section className="room" aria-labelledby="room-title">
      <div className="room__mist" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="room__copy">
        <p className="room__artist">
          <Disc3 size={16} />
          {t('collectionSubtitle')}
        </p>
        <h1 id="room-title">
          {headline} {t(albumCount === 1 ? 'collectionEra' : 'collectionEras')},
          <em>{t('collectionTitle')}</em>
        </h1>
        <p className="room__intro">
          {t('collectionPitch').replace('{songs}', numeroPorExtenso(trackCount, lang))}
        </p>
        <div className="room__actions">
          <a href="#duelo" className="room__duel">
            <Swords size={18} />
            {t('collectionDuel')}
          </a>
          <button type="button" onClick={browse}>
            {t('collectionBrowse')}
          </button>
        </div>
      </div>
      <img
        className="room__art"
        width={590}
        height={365}
        alt=""
        fetchPriority="high"
        src={`${import.meta.env.BASE_URL}images/listening-room.svg`}
      />
    </section>
  );
}
