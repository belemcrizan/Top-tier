import type { JSX } from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import { Dialog } from '../../components/Dialog';
import type { Song } from '../../data/rankings';
import { songText } from '../../data/translations';
import { useI18n } from '../../i18n';
import { EraEmblem } from '../collection/EraEmblem';
import { ScoreSlider } from '../personal/ScoreSlider';
import { TierMark } from './TierMark';
import { youTubeMusicLink } from './songLink';

interface Props {
  song: Song;
  favorite: boolean;
  toggleFavorite?: () => void;
  onClose: () => void;
  onSave?: (score: number) => void;
}

export function SongDetails({
  song,
  favorite,
  toggleFavorite,
  onSave,
  onClose,
}: Props): JSX.Element {
  const { t, lang } = useI18n();
  const { justificativa, contexto } = songText(song, lang);
  return (
    <Dialog labelledBy="song-details-title" onClose={onClose}>
      <div className="song-detail__identity">
        <EraEmblem album={song.album} />
        <div>
          <p>
            {song.album} · {t('rankTrack')} {song.numeroFaixa}
          </p>
          <h2 id="song-details-title">{song.titulo}</h2>
          <TierMark tier={song.tier} />
        </div>
      </div>
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
          <dt>{t('rankScore')}</dt>
          <dd>{song.pontuacao}/100</dd>
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
