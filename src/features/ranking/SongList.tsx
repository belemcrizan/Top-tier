import type { JSX, RefObject } from 'react';
import { ListMusic } from 'lucide-react';
import type { Song } from '../../data/rankings';
import { useI18n } from '../../i18n';
import { SongRow } from './SongRow';

interface Props {
  listRef: RefObject<HTMLOListElement | null>;
  tracks: Song[];
  favorites: string[];
  albumView: boolean;
  readOnly: boolean;
  movement: { id: string; original: number } | null;
  select: (id: string) => void;
  toggle: (id: string) => void;
}

export function SongList(props: Props): JSX.Element {
  const { t } = useI18n();
  if (props.tracks.length === 0) {
    return (
      <div className="ranking__empty">
        <ListMusic size={44} strokeWidth={1.2} aria-hidden="true" />
        <h3>{t('rankEmpty')}</h3>
        <p>{t('rankEmptyHint')}</p>
      </div>
    );
  }
  return (
    <div className={`ranking-list${props.readOnly ? ' ranking-list--readonly' : ''}`}>
      <div className="ranking-list__labels" aria-hidden="true">
        <span>#</span>
        <span>{t('rankTrack')}</span>
        <span>{t('rankTier')}</span>
        <span>{t('rankScore')}</span>
      </div>
      <ol className="ranking-list__rows" ref={props.listRef}>
        {props.tracks.map((song) => (
          <SongRow
            key={song.id}
            song={song}
            albumView={props.albumView}
            favorite={props.favorites.includes(song.id)}
            readOnly={props.readOnly}
            open={props.select}
            toggle={props.toggle}
            delta={props.movement?.id === song.id ? props.movement.original - song.posicaoGeral : 0}
          />
        ))}
      </ol>
    </div>
  );
}
