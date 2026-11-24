import { describe, expect, it } from 'vitest';
import { destinationTier, midpoint, tierCoordinates } from './moves';

const rect = { top: 10, left: 25, height: 40, width: 100 };
const target = { top: 100, left: 10, height: 80, width: 140 };
const currentCoordinates = { x: 25, y: 10 };
const context = {
  over: null,
  active: { data: { current: { tier: 'S+' } } },
  collisionRect: rect,
  droppableRects: new Map([['S', target]]),
};

function press(code: string, geometry: Parameters<typeof tierCoordinates>[1]['context'] = context) {
  const key = new KeyboardEvent('keydown', { code, cancelable: true });
  return tierCoordinates(key, { currentCoordinates, context: geometry });
}

describe('tier keyboard navigation', () => {
  it('moves between measured centers and follows the active destination', () => {
    expect(press('ArrowDown')).toEqual({ x: 30, y: 120 });
    expect(press('ArrowRight')).toEqual({ x: 30, y: 120 });
    const middle = { ...context, over: { id: 'A' } };
    expect(press('ArrowUp', middle)).toEqual({ x: 30, y: 120 });
    expect(press('ArrowLeft', middle)).toEqual({ x: 30, y: 120 });
  });

  it('keeps the pointer at an edge or unknown lane and ignores unrelated keys', () => {
    expect(press('Enter')).toBeUndefined();
    expect(press('ArrowDown', { ...context, collisionRect: null })).toBeUndefined();
    expect(press('ArrowDown', { ...context, active: null })).toEqual(currentCoordinates);
    expect(press('ArrowUp')).toEqual(currentCoordinates);
    expect(press('ArrowDown', { ...context, over: { id: 'C' } })).toEqual(currentCoordinates);
    expect(press('ArrowDown', { ...context, droppableRects: new Map() })).toEqual(
      currentCoordinates,
    );
    expect(destinationTier(null)).toBeUndefined();
  });

  it('derives each integer midpoint from the advertised band', () => {
    expect((['S+', 'S', 'A', 'B', 'C'] as const).map(midpoint)).toEqual([99, 94, 88, 81, 39]);
  });
});
