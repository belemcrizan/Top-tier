import type { DuelRecord, Ratings } from './elo';

export type DuelPair = readonly [string, string];

function pairKey(left: string, right: string): string {
  return left < right ? left + ':' + right : right + ':' + left;
}

function before(candidate: number[], best: number[]): boolean {
  const index = candidate.findIndex((value, i) => value !== best[i]);
  return index >= 0 && candidate[index] < best[index];
}

/** Recent skips count as seen: skipping always advances when another pair is available. */
export function nextPair(ratings: Ratings, history: readonly DuelRecord[]): DuelPair | null {
  const recent = new Map<string, number>();
  history
    .slice(-8)
    .forEach(({ left, right }, index) => recent.set(pairKey(left, right), index + 1));
  const tracks = Array.from(ratings.entries());
  let best: DuelPair | null = null;
  let priority: number[] = [];
  for (let i = 0; i < tracks.length; i += 1) {
    for (let j = i + 1; j < tracks.length; j += 1) {
      const [left, a] = tracks[i];
      const [right, b] = tracks[j];
      const candidate = [
        recent.get(pairKey(left, right)) ?? 0,
        Math.min(a.comparisons, b.comparisons),
        Math.max(a.comparisons, b.comparisons),
        Math.abs(a.points - b.points),
      ];
      if (!best || before(candidate, priority)) {
        best = history.length % 2 ? [right, left] : [left, right];
        priority = candidate;
      }
    }
  }
  return best;
}
