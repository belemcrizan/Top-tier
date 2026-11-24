import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Announcements, CollisionDetection, DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { useRanking } from '../../app/RankingProvider';
import type { Tier } from '../../data/rankings';
import { TIER_SCALE } from '../../data/tiers';
import { useI18n } from '../../i18n';
import { destinationTier, midpoint, tierCoordinates } from './moves';
import { MoveForm } from './MoveForm';
import { TierLane } from './TierLane';
import './tierboard.css';

const findLane: CollisionDetection = (input) =>
  input.pointerCoordinates ? pointerWithin(input) : closestCenter(input);

export default function TierBoard(): ReactElement {
  const { personalSongs, setScore, notify } = useRanking();
  const { t } = useI18n();
  const [dragged, setDragged] = useState('');
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: tierCoordinates }),
  );
  const songName = (id: unknown) => personalSongs.find((song) => song.id === id)?.titulo ?? '';
  const announcements: Announcements = {
    onDragStart: ({ active }) => t('boardGrabbed') + ' · ' + songName(active.id),
    onDragOver: ({ over }) => (over ? t('boardOver') + ' · ' + String(over.id) : undefined),
    onDragEnd: ({ active, over }) =>
      over
        ? [t('boardDropped'), songName(active.id), String(over.id)].join(' · ')
        : t('boardCancelled'),
    onDragCancel: () => t('boardCancelled'),
  };
  function move(id: string, tier: Tier): void {
    const score = midpoint(tier);
    setScore(id, score);
    notify([t('boardMoved'), songName(id), tier, score + '/100'].join(' · '));
  }
  function drop({ active, over, activatorEvent }: DragEndEvent): void {
    setDragged('');
    const tier = destinationTier(over?.id);
    if (!tier || typeof active.id !== 'string') return;
    const id = active.id;
    move(id, tier);
    if (activatorEvent instanceof KeyboardEvent) {
      requestAnimationFrame(() => document.getElementById('drag-' + id)?.focus());
    }
  }
  return (
    <section className="tier-board">
      <header className="tier-board__header">
        <h1>{t('boardTitle')}</h1>
        <p>
          {t('boardIntro')} {t('boardMidpoint')}
        </p>
      </header>
      <MoveForm tracks={personalSongs} onMove={move} />
      <DndContext
        sensors={sensors}
        collisionDetection={findLane}
        accessibility={{
          announcements,
          screenReaderInstructions: { draggable: t('boardInstructions') },
        }}
        onDragStart={({ active }) => setDragged(songName(active.id))}
        onDragCancel={() => setDragged('')}
        onDragEnd={drop}
      >
        <div className="tier-board__lanes">
          {TIER_SCALE.map(({ tier, label }) => (
            <TierLane
              key={tier}
              tier={tier}
              label={label}
              tracks={personalSongs.filter((song) => song.tier === tier)}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {dragged && <span className="tier-board__chip tier-board__chip--overlay">{dragged}</span>}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
