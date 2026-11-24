import type { AlbumId } from '../data/rankings';

export const heroWidths = { small: 640, medium: 1088, large: 1728 } as const;
export const coverWidths = { thumb: 112, card: 384, large: 720 } as const;

type CoverSources = Record<keyof typeof coverWidths | 'fallback', string>;

function imageUrl(file: string): string {
  return `${import.meta.env.BASE_URL}images/${file}`;
}

function coverSources(id: AlbumId): CoverSources {
  return {
    thumb: imageUrl(`${id}-${coverWidths.thumb}.webp`),
    card: imageUrl(`${id}-${coverWidths.card}.webp`),
    large: imageUrl(`${id}-${coverWidths.large}.webp`),
    fallback: imageUrl(`${id}.svg`),
  };
}

export const heroPhotos = {
  small: imageUrl(`hero-${heroWidths.small}.webp`),
  medium: imageUrl(`hero-${heroWidths.medium}.webp`),
  large: imageUrl(`hero-${heroWidths.large}.webp`),
};

export const heroSrcSet = [
  `${heroPhotos.small} ${heroWidths.small}w`,
  `${heroPhotos.medium} ${heroWidths.medium}w`,
  `${heroPhotos.large} ${heroWidths.large}w`,
].join(', ');

export const covers: Record<AlbumId, CoverSources> = {
  evermore: coverSources('evermore'),
  folklore: coverSources('folklore'),
  reputation: coverSources('reputation'),
};
