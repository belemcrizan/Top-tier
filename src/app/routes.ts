export const routeHashes = {
  collection: 'colecao',
  overall: 'ranking',
  personal: 'meu-ranking',
  duel: 'duelo',
  board: 'tiers',
  share: 'compartilhar',
  compare: 'comparar',
} as const;

export type Page = keyof typeof routeHashes;
export interface Route {
  page: Page | 'shared';
  payload?: string;
}

export function readRoute(hash: string): Route {
  const value = hash.replace(/^#/, '');
  if (value.startsWith('r=')) return { page: 'shared', payload: value.slice(2) };
  const page = (Object.keys(routeHashes) as Page[]).find((key) => routeHashes[key] === value);
  return { page: page ?? 'collection' };
}
