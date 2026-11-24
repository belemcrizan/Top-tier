import { ImageDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useI18n } from '../../i18n';
import type { Song } from '../../data/rankings';
import { downloadBlob } from './download';
import { renderCard } from './renderCard';

type CardState = { key: string; blob: Blob; url: string } | { key: string; error: true };

export function ShareCard({ tracks }: { tracks: Song[] }): ReactElement {
  const { t } = useI18n();
  const title = t('shareCardHeading');
  const footer = t('shareCardFooter');
  const key =
    tracks
      .slice(0, 5)
      .map((song) => `${song.id}:${song.pontuacao}`)
      .join('/') + title;
  const [result, setResult] = useState<CardState | null>(null);
  const current = result?.key === key ? result : null;
  const image = current && 'blob' in current ? current : null;

  useEffect(() => {
    let active = true;
    let url: string | undefined;
    // Prepare before the click so native file sharing keeps the user's transient activation.
    void renderCard(tracks, title, footer)
      .then((blob) => {
        if (!active) return;
        url = URL.createObjectURL(blob);
        setResult({ key, blob, url });
      })
      .catch(() => {
        if (active) setResult({ key, error: true });
      });
    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [key, tracks, title, footer]);

  async function save(): Promise<void> {
    if (!image) return;
    const name = 'top-tier.png';
    const file = new File([image.blob], name, { type: 'image/png' });
    const data = { title, files: [file] };
    try {
      if (navigator.canShare?.(data)) {
        await navigator.share(data);
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
    downloadBlob(image.blob, name);
  }

  return (
    <section className="share__panel share__card">
      <h2>{title}</h2>
      <p className="share__card-meta">{t('shareCardMeta')}</p>
      <figure className="share__preview">
        {image && <img src={image.url} width={1080} height={1350} alt={t('shareCardPreview')} />}
        <ol className={image ? 'share__sr' : 'share__top-five'}>
          {tracks.slice(0, 5).map((song) => (
            <li key={song.id}>
              {song.titulo} · {song.pontuacao}
            </li>
          ))}
        </ol>
      </figure>
      {current && 'error' in current && <p role="status">{t('shareCardError')}</p>}
      <button
        type="button"
        disabled={!image}
        onClick={() => {
          void save();
        }}
      >
        <ImageDown size={17} aria-hidden="true" />
        {t('shareCardSave')}
      </button>
    </section>
  );
}
