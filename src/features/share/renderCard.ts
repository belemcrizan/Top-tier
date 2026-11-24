import type { AlbumId, Song } from '../../data/rankings';

const WIDTH = 1080;
const HEIGHT = 1350;
const INK = '#2a2622';
const MUTED = '#6b6358';
const EDGE = 76;
const palette: Record<AlbumId, string> = {
  evermore: '#a4623a',
  folklore: '#6f8471',
  reputation: '#4a4d57',
};

function loadEmblem(id: AlbumId): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Emblem unavailable'));
    img.src = `${import.meta.env.BASE_URL}images/${id}.svg`;
  });
}

function titleLines(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > width) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  lines.push(line);
  return lines;
}

function drawSong(
  ctx: CanvasRenderingContext2D,
  song: Song,
  index: number,
  emblem: HTMLImageElement,
): void {
  const y = 348 + index * 170;
  ctx.fillStyle = '#e4ddd1';
  ctx.fillRect(EDGE, y, WIDTH - EDGE * 2, 2);
  ctx.fillStyle = MUTED;
  ctx.font = '30px "DM Sans Variable", sans-serif';
  ctx.fillText(String(index + 1).padStart(2, '0'), EDGE, y + 91);
  ctx.drawImage(emblem, EDGE + 66, y + 39, 138, 78);
  const left = EDGE + 228;
  ctx.font = '42px "Fraunces Variable", Georgia, serif';
  let lines = titleLines(ctx, song.titulo, 570);
  if (lines.length > 2) {
    ctx.font = '35px "Fraunces Variable", Georgia, serif';
    lines = titleLines(ctx, song.titulo, 570);
  }
  ctx.fillStyle = INK;
  const start = y + (lines.length > 1 ? 53 : 74);
  lines.forEach((line, i) => ctx.fillText(line, left, start + i * 45, 570));
  ctx.fillStyle = MUTED;
  ctx.font = '26px "DM Sans Variable", sans-serif';
  ctx.fillText(song.album, left, y + 139);
  ctx.textAlign = 'right';
  ctx.fillText(`${song.pontuacao}/100`, WIDTH - EDGE, y + 92);
  ctx.textAlign = 'left';
}

export async function renderCard(tracks: Song[], title: string, subtitle: string): Promise<Blob> {
  const top = tracks.slice(0, 5);
  const emblems = await Promise.all(
    [...new Set(top.map((s) => s.album))].map(async (id) => [id, await loadEmblem(id)] as const),
  );
  const images = new Map(emblems);
  await document.fonts?.ready;
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.fillStyle = '#faf7f2';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  for (const [index, color] of Object.values(palette).entries()) {
    ctx.fillStyle = color;
    ctx.fillRect((WIDTH / 3) * index, 0, WIDTH / 3, 18);
  }
  ctx.fillStyle = INK;
  ctx.font = '42px "Fraunces Variable", Georgia, serif';
  ctx.fillText('Top Tier', EDGE, 119);
  ctx.font = '100px "Fraunces Variable", Georgia, serif';
  ctx.fillText(title, EDGE, 264);
  top.forEach((song, index) => {
    const emblem = images.get(song.album);
    if (emblem) drawSong(ctx, song, index, emblem);
  });
  ctx.fillStyle = MUTED;
  ctx.font = '30px "DM Sans Variable", sans-serif';
  ctx.fillText(subtitle, EDGE, HEIGHT - EDGE);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('PNG unavailable'));
    }, 'image/png'),
  );
}
