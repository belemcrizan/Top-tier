import { useRef } from 'react';
import type { JSX } from 'react';
import { albums, songs } from '../../data/rankings';
import type { AlbumId, Song } from '../../data/rankings';
import { useI18n } from '../../i18n';
import { AlbumGrid } from './AlbumGrid';
import { AlbumSummary } from './AlbumSummary';
import { CollectionHero } from './CollectionHero';

interface CollectionProps {
  albumId: AlbumId;
  onSelect: (id: AlbumId) => void;
  personalSongs: Song[];
}

export default function Collection({
  albumId,
  onSelect,
  personalSongs,
}: CollectionProps): JSX.Element {
  const { t } = useI18n();
  const ref = useRef<HTMLHeadingElement>(null);
  const album = albums.find((item) => item.id === albumId);
  const editorial = songs.filter((song) => song.album === albumId);
  const personal = personalSongs.filter((song) => song.album === albumId);
  function browse(): void {
    ref.current?.scrollIntoView({ block: 'start' });
    ref.current?.focus({ preventScroll: true });
  }
  return (
    <div className="collection">
      <CollectionHero albumCount={albums.length} trackCount={songs.length} browse={browse} />
      <section className="collection__shelf" aria-labelledby="era-title">
        <h2 ref={ref} tabIndex={-1} id="era-title">
          {t('collectionHeading')}
        </h2>
        <AlbumGrid albumId={albumId} onSelect={onSelect} />
        {album && <AlbumSummary album={album} editorial={editorial} personal={personal} />}
      </section>
    </div>
  );
}
