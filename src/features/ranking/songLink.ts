import type { Song } from '../../data/rankings';

export function youTubeMusicLink(song: Pick<Song, 'titulo' | 'album'>): string {
  const url = new URL('https://music.youtube.com/search');
  url.searchParams.set('q', `Taylor Swift ${song.titulo} ${song.album}`);
  return url.href;
}
