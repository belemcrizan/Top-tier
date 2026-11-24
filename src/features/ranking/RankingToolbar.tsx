import { useId, useState } from 'react';
import type { JSX } from 'react';
import { Heart, Search, SlidersHorizontal } from 'lucide-react';
import { albums } from '../../data/rankings';
import type { AlbumId } from '../../data/rankings';
import { useI18n } from '../../i18n';
import type { RankingFilters, SortKey } from '../../lib/ranking';
import { AdvancedFilters } from './AdvancedFilters';
import type { SetFilter } from './filters';

interface Props {
  filters: RankingFilters;
  set: SetFilter;
  showAlbum: boolean;
  readOnly: boolean;
}

export function RankingToolbar({ filters, set, showAlbum, readOnly }: Props): JSX.Element {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const advancedId = useId();
  return (
    <div className="ranking-toolbar">
      <div className="ranking-toolbar__main">
        <label className="ranking-toolbar__search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            aria-label={t('rankSearch')}
            placeholder={t('rankSearch')}
            value={filters.search}
            onChange={(event) => set('search', event.currentTarget.value)}
          />
        </label>
        {showAlbum && (
          <select
            className="ranking-toolbar__select"
            aria-label={t('rankAlbumFilter')}
            value={filters.album}
            onChange={(event) => set('album', event.currentTarget.value as AlbumId | 'all')}
          >
            <option value="all">{t('rankAllAlbums')}</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.titulo}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          className="ranking__secondary"
          aria-controls={advancedId}
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          <SlidersHorizontal size={16} aria-hidden="true" /> {t('rankFilters')}
        </button>
        {!readOnly && (
          <button
            type="button"
            className="ranking__secondary"
            aria-pressed={filters.favoritesOnly}
            aria-label={t('rankFavorites')}
            title={t('rankFavorites')}
            onClick={() => set('favoritesOnly', !filters.favoritesOnly)}
          >
            <Heart size={16} fill={filters.favoritesOnly ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <div id={advancedId} hidden={!expanded}>
        <AdvancedFilters filters={filters} set={set} />
      </div>
    </div>
  );
}

export function SongOrder({ sort, set }: { sort: SortKey; set: SetFilter }): JSX.Element {
  const { t } = useI18n();
  return (
    <label className="ranking-toolbar__sort">
      {t('rankSort')}
      <select value={sort} onChange={(event) => set('sort', event.currentTarget.value as SortKey)}>
        <option value="rank">{t('rankPosition')}</option>
        <option value="score">{t('rankScore')}</option>
        <option value="album">{t('rankAlbumFilter')}</option>
        <option value="track">{t('rankTrackOrder')}</option>
      </select>
    </label>
  );
}
