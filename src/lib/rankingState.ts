import type { DuelRecord } from '../features/duel/elo';
import type { PersonalScores } from './ranking';
import type { RankingState } from './storage';

export type RankingAction =
  | { type: 'score'; id: string; value: number }
  | { type: 'scores'; values: PersonalScores }
  | { type: 'favorite'; id: string }
  | { type: 'duel'; record: DuelRecord };

export function rankingReducer(state: RankingState, action: RankingAction): RankingState {
  switch (action.type) {
    case 'score':
      return { ...state, scores: { ...state.scores, [action.id]: action.value } };
    case 'scores':
      return { ...state, scores: action.values };
    case 'favorite':
      return {
        ...state,
        favorites: state.favorites.includes(action.id)
          ? state.favorites.filter((id) => id !== action.id)
          : [...state.favorites, action.id],
      };
    case 'duel':
      return { ...state, duelHistory: [...state.duelHistory, action.record] };
  }
}
