import { useDraggable, useDroppable } from '@dnd-kit/core';
import type { ReactElement } from 'react';
import type { Song, Tier } from '../../data/rankings';
import { useI18n } from '../../i18n';

function TrackChip({ song }: { song: Song }): ReactElement {
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: song.id,
    data: { tier: song.tier },
  });
  return (
    <button
      id={'drag-' + song.id}
      type="button"
      ref={setNodeRef}
      className="tier-board__chip"
      data-dragging={isDragging || undefined}
      {...attributes}
      {...listeners}
      aria-label={[t('boardGrab'), song.titulo, song.tier].join(' · ')}
    >
      <span aria-hidden="true" className="tier-board__grip">
        ⠿
      </span>
      <span>{song.titulo}</span>
    </button>
  );
}

interface LaneProps {
  tier: Tier;
  label: string;
  tracks: Song[];
}

export function TierLane({ tier, label, tracks }: LaneProps): ReactElement {
  const { t } = useI18n();
  const { setNodeRef, isOver } = useDroppable({ id: tier });
  const headingId = 'lane-' + tier;
  return (
    <section
      ref={setNodeRef}
      data-over={isOver || undefined}
      className={'tier-board__lane tier-board__lane--' + tier.toLowerCase().replace('+', 'plus')}
      aria-labelledby={headingId}
    >
      <h2 className="tier-board__tier" id={headingId}>
        <strong>{tier}</strong> <span>{label}</span>
      </h2>
      <div className="tier-board__tracks">
        {tracks.length ? (
          tracks.map((song) => <TrackChip key={song.id} song={song} />)
        ) : (
          <p>{t('boardEmpty')}</p>
        )}
      </div>
    </section>
  );
}
