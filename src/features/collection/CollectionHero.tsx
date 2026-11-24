import { ArrowDown, Swords } from 'lucide-react';
import type { JSX } from 'react';
import { useI18n } from '../../i18n';
import { numeroPorExtenso } from '../../lib/format';
import { heroPhotos, heroSrcSet } from '../../visual/media';

interface HeroProps {
  albumCount: number;
  trackCount: number;
  browse: () => void;
}

export function CollectionHero({ albumCount, trackCount, browse }: HeroProps): JSX.Element {
  const { t, lang } = useI18n();
  const amount = numeroPorExtenso(albumCount, lang);
  const intro = t('collectionPitch')
    .replace('{albums}', amount.charAt(0).toLocaleUpperCase(lang) + amount.slice(1))
    .replace('{eras}', t(albumCount === 1 ? 'collectionEra' : 'collectionEras'))
    .replace('{songs}', numeroPorExtenso(trackCount, lang))
    .replace('{tracks}', t(trackCount === 1 ? 'collectionTrack' : 'collectionTracks'));

  return (
    <section className="room" aria-labelledby="room-title">
      <figure className="room__photo">
        <img
          className="room__art"
          width={1728}
          height={972}
          alt={t('collectionHeroAlt')}
          fetchPriority="high"
          src={heroPhotos.medium}
          srcSet={heroSrcSet}
          sizes="(max-width: 600px) 100vw, 62vw"
        />
        <figcaption className="room__credit">
          <i lang="en">folklore</i>
          <span aria-hidden="true"> / </span>
          Beth Garrabrant
        </figcaption>
      </figure>
      <div className="room__copy">
        <p className="room__artist">{t('collectionSubtitle')}</p>
        <h1 id="room-title">
          {t('collectionOpening')} <em>{t('collectionTitle')}</em>
        </h1>
        <p className="room__intro">{intro}</p>
        <div className="room__actions">
          <button type="button" className="room__browse" onClick={browse}>
            {t('collectionBrowse')} <ArrowDown size={16} aria-hidden="true" />
          </button>
          <a href="#duelo" className="room__duel">
            <Swords size={16} aria-hidden="true" />
            {t('collectionDuel')}
          </a>
        </div>
      </div>
    </section>
  );
}
