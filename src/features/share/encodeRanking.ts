import lz from 'lz-string';
import type { PersonalScores } from '../../lib/ranking';
import { validateScores } from '../../lib/storage';

// Each compressed block has its own tiny dictionary; a malformed link never feeds the decoder
// one large, attacker-controlled dictionary. Valid blocks decode to at most 80 characters.
const BLOCK = 80;
const MAX_PART = 180;
export const MAX_JSON_BYTES = 16_384;
const MAX_BLOCKS = Math.ceil(MAX_JSON_BYTES / BLOCK);
const MAX_LINK_SIZE = 2 + MAX_BLOCKS * (MAX_PART + 1);

export function serializeRanking(scores: PersonalScores): string {
  return JSON.stringify({ version: 2, scores });
}

export function parseRankingFile(input: string): PersonalScores | null {
  if (input.length > MAX_JSON_BYTES) return null;
  try {
    const value: unknown = JSON.parse(input);
    if (!value || typeof value !== 'object' || !('version' in value)) return null;
    if (value.version !== 2 || !('scores' in value)) return null;
    return validateScores(value.scores);
  } catch {
    return null;
  }
}

export function encodeRanking(scores: PersonalScores): string {
  const raw = serializeRanking(scores);
  const chunks: string[] = ['2'];
  for (let i = 0; i < raw.length; i += BLOCK) {
    chunks.push(lz.compressToEncodedURIComponent(raw.slice(i, i + BLOCK)));
  }
  return chunks.join('.');
}

export function decodeRanking(payload: string): PersonalScores | null {
  if (!payload.startsWith('2.') || payload.length > MAX_LINK_SIZE) return null;
  const blocks = payload.slice(2).split('.');
  if (blocks.length > MAX_BLOCKS) return null;
  let json = '';
  for (const part of blocks) {
    if (!part || part.length > MAX_PART || !/^[A-Za-z0-9+$-]+$/.test(part)) return null;
    const decoded = lz.decompressFromEncodedURIComponent(part);
    if (!decoded || decoded.length > BLOCK) return null;
    if (lz.compressToEncodedURIComponent(decoded) !== part) return null;
    json += decoded;
  }
  return parseRankingFile(json);
}

export function rankingLink(current: string, scores: PersonalScores): string {
  const url = new URL(current);
  url.search = '';
  url.hash = `r=${encodeRanking(scores)}`;
  return url.href;
}
