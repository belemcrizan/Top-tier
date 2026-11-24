import type { AlbumId } from '../../data/rankings';
import { covers } from '../../visual/media';

const plateColors: Record<AlbumId, string> = {
  evermore: '#e2c7ad',
  folklore: '#d4dbcf',
  reputation: '#d3d1cc',
};

async function decodedImage(url: string): Promise<HTMLImageElement> {
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Album artwork unavailable'));
    image.src = url;
  });
  // Some browsers complete the network transfer before the pixels are ready for canvas.
  if (image.decode) await image.decode();
  return image;
}

export async function loadCardCover(id: AlbumId): Promise<HTMLImageElement | null> {
  for (const url of [covers[id].card, covers[id].fallback]) {
    try {
      return await decodedImage(url);
    } catch {
      // A missing cover or a failed decode can still yield a usable, local-only card.
    }
  }
  return null;
}

export function drawCardCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  album: AlbumId,
  x: number,
  y: number,
  size: number,
): void {
  ctx.fillStyle = plateColors[album];
  ctx.fillRect(x, y, size, size);
  if (image) {
    const scale = size / Math.max(image.naturalWidth, image.naturalHeight);
    const width = scale * image.naturalWidth;
    const height = scale * image.naturalHeight;
    ctx.drawImage(image, x + (size - width) / 2, y + (size - height) / 2, width, height);
  }
}
