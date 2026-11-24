import type { JSX } from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import { Dialog } from '../../components/Dialog';
import { albums } from '../../data/rankings';
import type { Song } from '../../data/rankings';
import { albumText, songText } from '../../data/translations';
import { useI18n } from '../../i18n';
import { AlbumCover } from '../collection/AlbumCover';
import { ScoreSlider } from '../personal/ScoreSlider';
import { TierMark } from './TierMark';
import { youTubeMusicLink } from './songLink';

interface Props {
  song: Song;
  favorite: boolean;
  toggleFavorite?: () => void;
  onClose: () => void;
  onSave?: (score: number) => void;
  shared: boolean;
}

export function SongDetails({
  song,
  favorite,
  toggleFavorite,
  onSave,
  onClose,
  shared,
}: Props): JSX.Element {
  const { t, lang } = useI18n();
  const { justificativa, contexto } = songText(song, lang);
  const album = albums.find(({ id }) => id === song.album);
  const scoreLabel = shared ? 'rankSharedScore' : onSave ? 'rankRate' : 'rankEditorialScore';
  return (
    <Dialog labelledBy="song-details-title" onClose={onClose}>
      <header className="song-detail__identity" data-era={song.album}>
        <AlbumCover album={song.album} size="detail" className="song-detail__cover" />
        <div>
          <p className="song-detail__album">
            {song.album} · {album?.ano}
          </p>
          <h2 id="song-details-title">{song.titulo}</h2>
          <div className="song-detail__track">
            <TierMark tier={song.tier} />
            <span>
              {t('rankTrack')} {String(song.numeroFaixa).padStart(2, '0')}
            </span>
            {album && <span>· {albumText(album, lang).edicao}</span>}
          </div>
        </div>
      </header>
      <dl className="song-detail__stats">
        <div>
          <dt>{t('rankGlobalPosition')}</dt>
          <dd>#{song.posicaoGeral}</dd>
        </div>
        <div>
          <dt>{t('rankAlbumPosition')}</dt>
          <dd>#{song.posicaoNoAlbum}</dd>
        </div>
        <div>
          <dt>{t(scoreLabel)}</dt>
          <dd>
            {song.pontuacao}
            <small>/100</small>
          </dd>
        </div>
      </dl>
      <h3>{t('rankRationale')}</h3>
      <p>{justificativa}</p>
      <h3>{t('rankContext')}</h3>
      <p>{contexto}</p>
      {onSave && <ScoreSlider score={song.pontuacao} save={onSave} />}
      <div className="song-detail__actions">
        <a
          className="ranking__primary"
          href={youTubeMusicLink(song)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('rankListen')} <ExternalLink size={16} aria-hidden="true" />
        </a>
        {toggleFavorite && (
          <button
            className="ranking__secondary"
            type="button"
            aria-pressed={favorite}
            onClick={toggleFavorite}
          >
            <Heart size={16} fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" />
            {t(favorite ? 'rankFavoriteRemove' : 'rankFavoriteAdd')}
          </button>
        )}
      </div>
    </Dialog>
  );
}
