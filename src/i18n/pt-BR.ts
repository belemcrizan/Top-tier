import { shellPt } from './shell';
import { collectionPt } from './collection';
import { rankingPt } from './ranking';
import { duelPt } from './duel';
import { sharePt } from './share';

export const ptBR = { ...shellPt, ...collectionPt, ...rankingPt, ...duelPt, ...sharePt };
export type TranslationKey = keyof typeof ptBR;
