import { shellEn } from './shell';
import { collectionEn } from './collection';
import { rankingEn } from './ranking';
import { duelEn } from './duel';
import { shareEn } from './share';
import type { TranslationKey } from './pt-BR';

export const en: Record<TranslationKey, string> = {
  ...shellEn,
  ...collectionEn,
  ...rankingEn,
  ...duelEn,
  ...shareEn,
};
