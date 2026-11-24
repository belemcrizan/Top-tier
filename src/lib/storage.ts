import { songs } from '../data/rankings';
import type { DuelRecord } from '../features/duel/elo';
import { parseFavorites, parseScores } from './ranking';
import type { PersonalScores } from './ranking';

export interface RankingState {
  scores: PersonalScores;
  favorites: string[];
  duelHistory: DuelRecord[];
}

export const RANKING_KEY = 'top-tier:ranking:v2';
const catalog = new Set(songs.map(({ id }) => id));

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 100;
}

// Storage and interchange use the same domain rules. Reject partial imports atomically.
export function validateScores(value: unknown): PersonalScores | null {
  if (!isRecord(value)) return null;
  const scores: PersonalScores = {};
  for (const [id, score] of Object.entries(value)) {
    if (!catalog.has(id) || !validScore(score)) return null;
    scores[id] = score;
  }
  return scores;
}

export function validDuel(value: unknown): value is DuelRecord {
  return (
    isRecord(value) &&
    typeof value.left === 'string' &&
    typeof value.right === 'string' &&
    catalog.has(value.left) &&
    catalog.has(value.right) &&
    value.left !== value.right &&
    ['left', 'right', 'tie', 'skip'].some((outcome) => outcome === value.outcome)
  );
}

export function safeRead(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function restoreRanking(
  raw: string | null,
  read: (key: string) => string | null = safeRead,
): RankingState {
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isRecord(parsed) && parsed.version === 2) {
        return {
          scores: validateScores(parsed.scores) ?? parseScores(JSON.stringify(parsed.scores) ?? ''),
          favorites: parseFavorites(JSON.stringify(parsed.favorites) ?? ''),
          duelHistory: Array.isArray(parsed.duelHistory)
            ? parsed.duelHistory.filter(validDuel)
            : [],
        };
      }
    } catch {
      // The v1 keys remain available if a migration write was interrupted.
    }
  }
  return {
    scores: parseScores(read('top-tier:scores:v1')),
    favorites: parseFavorites(read('top-tier:favorites:v1')),
    duelHistory: [],
  };
}

export function serializeRanking(state: RankingState): string {
  return JSON.stringify({ version: 2, ...state });
}
