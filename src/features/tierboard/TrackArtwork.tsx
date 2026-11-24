import type { ReactElement } from 'react';
import type { Song } from '../../data/rankings';
import { AlbumCover } from '../collection/AlbumCover';

export function TrackArtwork({ song }: { song: Song }): ReactElement {
  return (
    <>
      <span className="tier-board__art" aria-hidden="true">
        <AlbumCover album={song.album} size="thumb" />
      </span>
      <span className="tier-board__title">{song.titulo}</span>
    </>
  );
}
