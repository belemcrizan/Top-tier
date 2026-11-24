import type { JSX } from 'react';
import type { AlbumId } from '../../data/rankings';

type EmblemProps = { album: AlbumId; className?: string };

export function EraEmblem({ album, className }: EmblemProps): JSX.Element {
  return (
    <img
      src={`${import.meta.env.BASE_URL}images/${album}.svg`}
      className={className}
      alt=""
      width={360}
      height={200}
      loading="lazy"
      decoding="async"
    />
  );
}
