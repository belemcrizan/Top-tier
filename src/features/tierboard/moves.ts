import type { UniqueIdentifier } from '@dnd-kit/core';
import type { Tier } from '../../data/rankings';
import { TIER_SCALE } from '../../data/tiers';

export function destinationTier(id: unknown): Tier | undefined {
  return TIER_SCALE.find((entry) => entry.tier === id)?.tier;
}

export function midpoint(tier: Tier): number {
  const band = TIER_SCALE.find((entry) => entry.tier === tier);
  if (!band) throw new RangeError('Invalid tier');
  return Math.round((band.min + band.max) / 2);
}

// Move between entire lanes rather than depending on the pixel height of their contents.
interface Point {
  x: number;
  y: number;
}
interface Box {
  width: number;
  height: number;
  left: number;
  top: number;
}
interface LaneGeometry {
  currentCoordinates: Point;
  context: {
    over: { id: UniqueIdentifier } | null;
    active: { data: { current: { tier?: unknown } | undefined } } | null;
    collisionRect: Box | null;
    droppableRects: ReadonlyMap<UniqueIdentifier, Box>;
  };
}

export function tierCoordinates(
  event: KeyboardEvent,
  { context, currentCoordinates }: LaneGeometry,
): Point | undefined {
  const deltas: Partial<Record<string, number>> = {
    ArrowDown: 1,
    ArrowRight: 1,
    ArrowUp: -1,
    ArrowLeft: -1,
  };
  const delta = deltas[event.code];
  if (!delta || !context.collisionRect) return undefined;
  event.preventDefault();
  const from = destinationTier(context.over?.id ?? context.active?.data.current?.tier);
  const index = TIER_SCALE.findIndex((entry) => entry.tier === from);
  const destination = TIER_SCALE[index + delta];
  const target = destination && context.droppableRects.get(destination.tier);
  if (!target || index < 0) return currentCoordinates;
  const source = context.collisionRect;
  return {
    x: currentCoordinates.x + target.left - source.left + (target.width - source.width) / 2,
    y: currentCoordinates.y + target.top - source.top + (target.height - source.height) / 2,
  };
}
