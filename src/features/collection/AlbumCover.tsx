import { useState, type JSX } from 'react';
import type { AlbumId } from '../../data/rankings';
import { covers, coverWidths } from '../../visual/media';

type CoverSize = 'thumb' | 'card' | 'detail' | 'duel';

interface CoverProps {
  album: AlbumId;
  size: CoverSize;
  className?: string;
  alt?: string;
}

const displaySizes = {
  card: '(max-width: 600px) 112px, (max-width: 900px) 28vw, 160px',
  detail: '(max-width: 600px) 40vw, 260px',
  duel: '(max-width: 600px) 39vw, (max-width: 1000px) 32vw, 300px',
};

export function AlbumCover({ album, size, className, alt = '' }: CoverProps): JSX.Element {
  const sources = covers[album];
  const [failed, setFailed] = useState<AlbumId | null>(null);
  const fallback = failed === album;
  const thumbnail = size === 'thumb';
  const source = thumbnail ? sources.thumb : sources.card;
  const candidates = [
    `${sources.thumb} ${coverWidths.thumb}w`,
    `${sources.card} ${coverWidths.card}w`,
    `${sources.large} ${coverWidths.large}w`,
  ];

  return (
    <img
      alt={alt}
      className={className}
      width={thumbnail ? coverWidths.thumb : coverWidths.card}
      height={thumbnail ? coverWidths.thumb : coverWidths.card}
      loading={size === 'detail' ? 'eager' : 'lazy'}
      decoding="async"
      sizes={fallback || thumbnail ? undefined : displaySizes[size]}
      srcSet={fallback || thumbnail ? undefined : candidates.join(', ')}
      src={fallback ? sources.fallback : source}
      onError={fallback ? undefined : () => setFailed(album)}
      style={{ aspectRatio: '1', objectFit: fallback ? 'cover' : 'contain' }}
    />
  );
}
