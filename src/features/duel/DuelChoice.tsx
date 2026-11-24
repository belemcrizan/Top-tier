import { useId } from 'react';
import type { ReactElement } from 'react';
import type { Song } from '../../data/rankings';
import { useI18n } from '../../i18n';
import { AlbumCover } from '../collection/AlbumCover';

interface ChoiceProps {
  song: Song;
  shortcut?: string;
  onChoose: () => void;
}

export function DuelChoice({ song, shortcut, onChoose }: ChoiceProps): ReactElement {
  const { t } = useI18n();
  const albumLabel = useId();
  return (
    <button
      type="button"
      className="duel__choice"
      aria-label={t('duelChoose') + ' ' + song.titulo}
      aria-describedby={albumLabel}
      onClick={onChoose}
    >
      <span className="duel__art">
        <AlbumCover album={song.album} size="duel" />
      </span>
      <span className="duel__label">
        <span className="duel__album" id={albumLabel}>
          {song.album}
        </span>
        <strong>{song.titulo}</strong>
        {shortcut && <kbd aria-hidden="true">{shortcut}</kbd>}
      </span>
    </button>
  );
}
