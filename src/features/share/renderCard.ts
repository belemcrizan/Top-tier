import type { Song } from '../../data/rankings';
import { drawCardCover, loadCardCover } from './cardArt';

const WIDTH = 1080;
const HEIGHT = 1350;
const EDGE = 64;
const ROW_HEIGHT = 182;
const PAPER = '#f9f8f5';
const FOREST = '#26392f';
const INK = '#28392e';
const MUTED = '#566156';
const SAND = '#d8c8ad';

type Fonts = { display: string; body: string };

function titleLines(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  lines.push(line);
  return lines;
}

function drawSong(
  ctx: CanvasRenderingContext2D,
  song: Song,
  index: number,
  cover: HTMLImageElement | null,
  fonts: Fonts,
): void {
  const top = 302 + index * ROW_HEIGHT;
  const left = 318;
  const textWidth = 562;
  const coverSize = 136;
  ctx.fillStyle = '#d8d9ce';
  ctx.fillRect(EDGE, top, WIDTH - 2 * EDGE, 2);
  ctx.fillStyle = MUTED;
  ctx.font = `italic 37px ${fonts.display}`;
  ctx.fillText(String(index + 1).padStart(2, '0'), EDGE, top + 103);
  drawCardCover(ctx, cover, song.album, 146, top + 23, coverSize);

  ctx.fillStyle = INK;
  ctx.font = `500 44px ${fonts.display}`;
  let lines = titleLines(ctx, song.titulo, textWidth);
  if (lines.length > 2) {
    ctx.font = `500 36px ${fonts.display}`;
    lines = titleLines(ctx, song.titulo, textWidth);
  }
  const baseline = top + (lines.length > 1 ? 64 : 87);
  lines.forEach((line, i) => ctx.fillText(line, left, baseline + i * 46, textWidth));
  ctx.fillStyle = MUTED;
  ctx.font = `27px ${fonts.body}`;
  ctx.fillText(song.album, left, baseline + (lines.length - 1) * 46 + 39);
  ctx.textAlign = 'right';
  ctx.fillStyle = INK;
  ctx.font = `500 44px ${fonts.display}`;
  ctx.fillText(String(song.pontuacao), WIDTH - EDGE, top + 88);
  ctx.fillStyle = MUTED;
  ctx.font = `23px ${fonts.body}`;
  ctx.fillText('/100', WIDTH - EDGE, top + 122);
  ctx.textAlign = 'left';
}

export async function renderCard(tracks: Song[], title: string, subtitle: string): Promise<Blob> {
  const top = tracks.slice(0, 5);
  const ids = new Set(top.map((song) => song.album));
  const css = getComputedStyle(document.documentElement);
  const fonts = {
    display: css.getPropertyValue('--font-display').trim() || 'Georgia, serif',
    body: css.getPropertyValue('--font-body').trim() || 'sans-serif',
  };
  const covers = await Promise.all(
    [...ids].map(async (id) => [id, await loadCardCover(id)] as const),
  );
  await document.fonts?.ready;
  const images = new Map(covers);
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = FOREST;
  ctx.fillRect(0, 0, WIDTH, 260);
  ctx.fillStyle = SAND;
  ctx.fillRect(EDGE, 67, 60, 3);
  ctx.font = `500 27px ${fonts.body}`;
  ctx.fillText(subtitle, EDGE + 80, 79);
  ctx.fillStyle = PAPER;
  ctx.font = `italic 108px ${fonts.display}`;
  ctx.fillText(title, EDGE, 207);
  top.forEach((song, index) => drawSong(ctx, song, index, images.get(song.album) ?? null, fonts));
  ctx.fillStyle = SAND;
  ctx.fillRect(EDGE, 1236, WIDTH - 2 * EDGE, 2);
  ctx.fillStyle = FOREST;
  ctx.font = `500 44px ${fonts.display}`;
  ctx.fillText('top tier.', EDGE, 1303);
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'right';
  ctx.font = `24px ${fonts.body}`;
  ctx.fillText('Taylor Swift', WIDTH - EDGE, 1299);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('PNG unavailable'));
    }, 'image/png'),
  );
}
