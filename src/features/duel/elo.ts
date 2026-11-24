import type { Song } from '../../data/rankings';

export type Outcome = 'left' | 'right' | 'tie' | 'skip';

export interface DuelRecord {
  left: string;
  right: string;
  outcome: Outcome;
}

export interface Rating {
  points: number;
  comparisons: number;
}

export type Ratings = ReadonlyMap<string, Rating>;

const pointsPerScore = 8;
const stableAfter = 10;

function changeFactor(rating: Rating): number {
  return rating.comparisons < stableAfter ? 32 : 16;
}

/** Replay from the same prior so reloading or applying scores cannot count votes twice. */
export function replayDuels(
  catalog: readonly Pick<Song, 'id' | 'pontuacao'>[],
  history: readonly DuelRecord[],
): Ratings {
  const ratings = new Map<string, Rating>();
  for (const { id, pontuacao } of catalog) {
    ratings.set(id, { points: pontuacao * pointsPerScore, comparisons: 0 });
  }
  for (const { left, right, outcome } of history) {
    const a = ratings.get(left);
    const b = ratings.get(right);
    if (!a || !b || left === right || outcome === 'skip') continue;

    const expected = 1 / (1 + 10 ** ((b.points - a.points) / 400));
    const observed = outcome === 'tie' ? 0.5 : Number(outcome === 'left');
    const error = observed - expected;
    ratings.set(left, {
      points: a.points + changeFactor(a) * error,
      comparisons: a.comparisons + 1,
    });
    ratings.set(right, {
      points: b.points - changeFactor(b) * error,
      comparisons: b.comparisons + 1,
    });
  }
  return ratings;
}

export function duelScores(ratings: Ratings): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const [id, { points, comparisons }] of ratings) {
    if (comparisons) scores[id] = Math.max(0, Math.min(100, Math.round(points / pointsPerScore)));
  }
  return scores;
}

/** Coverage caps each song separately: one popular pair cannot fill the rest of the catalog. */
export function duelConfidence(ratings: Ratings): number {
  if (!ratings.size) return 0;
  let observed = 0;
  for (const { comparisons } of ratings.values()) {
    observed += Math.min(stableAfter, comparisons);
  }
  return Math.floor((observed * 100) / (stableAfter * ratings.size));
}
