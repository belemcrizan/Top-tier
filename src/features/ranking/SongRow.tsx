import type { JSX, CSSProperties } from 'react';
import { Heart } from 'lucide-react';
import type { Song } from '../../data/rankings';
import { songText } from '../../data/translations';
import { useI18n } from '../../i18n';
import { EraEmblem } from '../collection/EraEmblem';
import { TierMark } from './TierMark';

export interface RowActions {
  albumView: boolean;
  favorite: boolean;
  readOnly: boolean;
  open: (id: string) => void;
  toggle: (id: string) => void;
}

export function SongRow({
  song,
  albumView,
  favorite,
  readOnly,
  open,
  toggle,
  delta,
}: RowActions & {
  song: Song;
  delta: number;
}): JSX.Element {
  const { t, lang } = useI18n();
  const position = albumView ? song.posicaoNoAlbum : song.posicaoGeral;
  const description = albumView
    ? songText(song, lang).justificativa
    : `${song.album} · ${t('rankTrack')} ${song.numeroFaixa}`;
  const animation: CSSProperties = { viewTransitionName: `rank-${song.id}` };
  return (
    <li className="song-row" data-song-id={song.id} style={animation}>
      <span className="song-row__position">{String(position).padStart(2, '0')}</span>
      <button
        type="button"
        className="song-row__open"
        onClick={() => open(song.id)}
        aria-label={`${t('rankDetails')} ${song.titulo}`}
      >
        {!albumView && <EraEmblem album={song.album} />}
        <span className="song-row__copy">
          <strong>{song.titulo}</strong>
          <span>{description}</span>
        </span>
      </button>
      <TierMark tier={song.tier} />
      <span className="song-row__score">
        {song.pontuacao}
        {delta !== 0 && (
          <small>
            {delta > 0 ? '↑' : '↓'} {Math.abs(delta)}
          </small>
        )}
      </span>
      {!readOnly && (
        <button
          type="button"
          className="song-row__favorite"
          aria-pressed={favorite}
          aria-label={`${t(favorite ? 'rankFavoriteRemove' : 'rankFavoriteAdd')} · ${song.titulo}`}
          onClick={() => toggle(song.id)}
        >
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      )}
    </li>
  );
}
