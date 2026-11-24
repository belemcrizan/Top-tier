import { ArrowUpRight, Check } from 'lucide-react';
import type { JSX } from 'react';
import { albums, songs } from '../../data/rankings';
import type { AlbumId } from '../../data/rankings';
import { useI18n } from '../../i18n';
import { AlbumCover } from './AlbumCover';

type GridProps = { albumId: AlbumId; onSelect: (id: AlbumId) => void };

export function AlbumGrid({ albumId, onSelect }: GridProps): JSX.Element {
  const { t } = useI18n();
  return (
    <div className="era-grid" role="group" aria-labelledby="era-title">
      {albums.map((album) => {
        const selected = album.id === albumId;
        const count = songs.filter((song) => song.album === album.id).length;
        const Icon = selected ? Check : ArrowUpRight;
        return (
          <button
            key={album.id}
            className="era-card"
            type="button"
            aria-pressed={selected}
            aria-label={`${t('collectionSelect')} ${album.titulo}`}
            data-era={album.id}
            onClick={() => onSelect(album.id)}
          >
            <AlbumCover album={album.id} size="card" className="era-card__art" />
            <span className="era-card__body">
              <span className="era-card__metadata">
                {album.ano}
                <span aria-hidden="true"> · </span>
                {count} {t(count === 1 ? 'collectionTrack' : 'collectionTracks')}
              </span>
              <span className="era-card__title" lang="en">
                {album.titulo}
              </span>
              <span className="era-card__choice">
                <Icon size={14} aria-hidden="true" />
                {t(selected ? 'collectionSelected' : 'collectionSelect')}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
