import { useDeferredValue, useMemo, useState } from 'react';
import type { JSX } from 'react';
import { useRanking } from '../../app/RankingProvider';
import type { AlbumId, Song } from '../../data/rankings';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useI18n } from '../../i18n';
import { defaultFilters, filterSongs } from '../../lib/ranking';
import type { RankingFilters } from '../../lib/ranking';
import { PersonalBanner } from '../personal/PersonalBanner';
import { RankingToolbar, SongOrder } from './RankingToolbar';
import { SongDetails } from './SongDetails';
import { SongList } from './SongList';
import { useRankMotion } from './useRankMotion';
import './ranking.css';

export type RankingMode = 'album' | 'overall' | 'personal' | 'shared';

export interface RankingViewProps {
  mode: RankingMode;
  albumId?: AlbumId;
  entries: Song[];
  readOnly?: boolean;
}

const headings = {
  album: 'rankAlbum',
  overall: 'rankOverall',
  personal: 'rankPersonal',
  shared: 'rankShared',
} as const;

export default function RankingView({
  mode,
  albumId,
  entries,
  readOnly = mode === 'shared',
}: RankingViewProps): JSX.Element {
  const { t } = useI18n();
  const { favorites, toggleFavorite, setScore, notify } = useRanking();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<RankingFilters>(defaultFilters);
  const motion = useRankMotion();
  const albumView = mode === 'album';
  const canEdit = mode === 'personal' && !readOnly;
  const query = useDeferredValue(useDebouncedValue(filters.search, 150));
  const { tier, minScore, favoritesOnly, sort } = filters;
  const selectedAlbum = albumView && albumId ? albumId : filters.album;
  const tracks = useMemo(
    () =>
      filterSongs(
        entries,
        {
          album: selectedAlbum,
          tier,
          minScore,
          favoritesOnly,
          sort,
          search: query,
        },
        favorites,
      ),
    [entries, favorites, selectedAlbum, tier, minScore, favoritesOnly, sort, query],
  );
  const selected = entries.find((song) => song.id === selectedId);
  const filtered = Boolean(
    filters.search ||
    tier !== 'all' ||
    minScore ||
    favoritesOnly ||
    (!albumView && filters.album !== 'all'),
  );

  function set<K extends keyof RankingFilters>(key: K, value: RankingFilters[K]): void {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }

  function save(score: number): void {
    if (!selected || !canEdit) return;
    motion.apply(selected, () => {
      setScore(selected.id, score);
      setSelectedId(null);
      notify(t('rankSaved'));
    });
  }

  return (
    <section className="ranking" aria-label={t(headings[mode])}>
      {albumView && <h2>{t(headings[mode])}</h2>}
      {canEdit && <PersonalBanner />}
      <RankingToolbar filters={filters} set={set} showAlbum={!albumView} readOnly={readOnly} />
      <div className="ranking__meta">
        <span role="status" aria-live="polite">
          {tracks.length} {t(tracks.length === 1 ? 'rankOneTrack' : 'rankTracks')}
        </span>
        {filtered && (
          <button type="button" onClick={() => setFilters(defaultFilters)}>
            {t('rankClear')}
          </button>
        )}
        <SongOrder sort={sort} set={set} />
      </div>
      <SongList
        listRef={motion.container}
        tracks={tracks}
        favorites={favorites}
        albumView={albumView}
        readOnly={readOnly}
        movement={motion.movement}
        select={setSelectedId}
        toggle={toggleFavorite}
      />
      {selected && (
        <SongDetails
          key={selected.id}
          song={selected}
          favorite={favorites.includes(selected.id)}
          toggleFavorite={readOnly ? undefined : () => toggleFavorite(selected.id)}
          onSave={canEdit ? save : undefined}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}
