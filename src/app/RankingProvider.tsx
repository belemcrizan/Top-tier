import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode, JSX } from 'react';
import { songs } from '../data/rankings';
import type { Song } from '../data/rankings';
import type { DuelRecord } from '../features/duel/elo';
import { usePersistentState } from '../hooks/usePersistentState';
import { personalizeSongs } from '../lib/ranking';
import type { PersonalScores } from '../lib/ranking';
import { rankingReducer } from '../lib/rankingState';
import type { RankingAction } from '../lib/rankingState';
import { RANKING_KEY, restoreRanking, serializeRanking } from '../lib/storage';
import type { RankingState } from '../lib/storage';
import { Toast } from '../components/Toast';
import { useI18n } from '../i18n';

interface RankingContextValue extends RankingState {
  personalSongs: Song[];
  setScore: (id: string, value: number) => void;
  setScores: (scores: PersonalScores) => void;
  resetScores: () => void;
  toggleFavorite: (id: string) => void;
  recordDuel: (record: DuelRecord) => void;
  notify: (message: string) => void;
}

const RankingContext = createContext<RankingContextValue | null>(null);

export function useRanking(): RankingContextValue {
  const context = useContext(RankingContext);
  if (!context) throw new Error('RankingProvider is required');
  return context;
}

export function RankingProvider({ children }: { children: ReactNode }): JSX.Element {
  const { t } = useI18n();
  const [state, setState, available] = usePersistentState(
    RANKING_KEY,
    restoreRanking,
    serializeRanking,
  );
  const [notice, setNotice] = useState<{ text: string; sequence: number } | null>(null);
  const dispatch = useCallback(
    (action: RankingAction) => setState((previous) => rankingReducer(previous, action)),
    [setState],
  );
  const notify = useCallback((text: string) => {
    setNotice((previous) => ({ text, sequence: (previous?.sequence ?? 0) + 1 }));
  }, []);
  const dismiss = useCallback(() => setNotice(null), []);
  const personalSongs = useMemo(() => personalizeSongs(songs, state.scores), [state.scores]);
  const value = useMemo<RankingContextValue>(
    () => ({
      ...state,
      personalSongs,
      setScore: (id, score) => dispatch({ type: 'score', id, value: score }),
      setScores: (values) => dispatch({ type: 'scores', values }),
      resetScores: () => dispatch({ type: 'scores', values: {} }),
      toggleFavorite: (id) => dispatch({ type: 'favorite', id }),
      recordDuel: (record) => dispatch({ type: 'duel', record }),
      notify,
    }),
    [dispatch, notify, personalSongs, state],
  );
  return (
    <RankingContext.Provider value={value}>
      {!available && <p role="status">{t('storageUnavailable')}</p>}
      {children}
      {notice && (
        <Toast key={notice.sequence} message={notice.text} dismiss={dismiss} close={t('close')} />
      )}
    </RankingContext.Provider>
  );
}
