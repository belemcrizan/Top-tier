import type { RankingFilters } from '../../lib/ranking';

export type SetFilter = <K extends keyof RankingFilters>(key: K, value: RankingFilters[K]) => void;
