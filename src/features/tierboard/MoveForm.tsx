import { useState } from 'react';
import type { ReactElement } from 'react';
import type { Song, Tier } from '../../data/rankings';
import { TIER_SCALE } from '../../data/tiers';
import { useI18n } from '../../i18n';
import { destinationTier } from './moves';

interface Props {
  tracks: Song[];
  onMove: (id: string, tier: Tier) => void;
}

export function MoveForm({ tracks, onMove }: Props): ReactElement {
  const { t } = useI18n();
  const [id, setId] = useState(tracks[0]?.id ?? '');
  const [tier, setTier] = useState<Tier>(tracks[0]?.tier ?? 'S+');
  return (
    <form
      className="tier-board__form"
      onSubmit={(event) => {
        event.preventDefault();
        if (id) onMove(id, tier);
      }}
    >
      <label>
        {t('boardTrack')}
        <select
          value={id}
          onChange={({ target }) => {
            setId(target.value);
            const song = tracks.find((entry) => entry.id === target.value);
            if (song) setTier(song.tier);
          }}
        >
          {tracks.map((song) => (
            <option key={song.id} value={song.id}>
              {song.titulo} · {song.album}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t('boardDestination')}
        <select
          value={tier}
          onChange={({ target }) => {
            const next = destinationTier(target.value);
            if (next) setTier(next);
          }}
        >
          {TIER_SCALE.map((band) => (
            <option key={band.tier} value={band.tier}>
              {band.tier} · {band.label}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={!id}>
        {t('boardMove')}
      </button>
    </form>
  );
}
