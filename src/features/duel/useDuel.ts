import { useMemo } from 'react';
import { useRanking } from '../../app/RankingProvider';
import { songs } from '../../data/rankings';
import type { Song } from '../../data/rankings';
import { duelConfidence, duelScores, replayDuels } from './elo';
import type { Outcome } from './elo';
import { nextPair } from './pairing';

interface DuelSession {
  left: Song | undefined;
  right: Song | undefined;
  comparisons: number;
  confidence: number;
  choose: (outcome: Outcome) => void;
  apply: () => void;
}

const byId = new Map(songs.map((song) => [song.id, song]));

export function useDuel(): DuelSession {
  const { duelHistory, recordDuel, scores, setScores } = useRanking();
  const ratings = useMemo(() => replayDuels(songs, duelHistory), [duelHistory]);
  const pair = useMemo(() => nextPair(ratings, duelHistory), [ratings, duelHistory]);
  return {
    left: pair ? byId.get(pair[0]) : undefined,
    right: pair ? byId.get(pair[1]) : undefined,
    comparisons: duelHistory.filter((duel) => duel.outcome !== 'skip').length,
    confidence: duelConfidence(ratings),
    choose(outcome) {
      if (pair) recordDuel({ left: pair[0], right: pair[1], outcome });
    },
    apply() {
      // Unseen tracks keep manual ratings; only tracks with evidence receive a new score.
      setScores({ ...scores, ...duelScores(ratings) });
    },
  };
}
