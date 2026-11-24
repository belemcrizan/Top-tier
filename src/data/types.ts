export type AlbumId = 'evermore' | 'folklore' | 'reputation';
export type Tier = 'S+' | 'S' | 'A' | 'B' | 'C';

export interface Song {
  id: string;
  titulo: string;
  album: AlbumId;
  numeroFaixa: number;
  tier: Tier;
  posicaoNoAlbum: number;
  posicaoGeral: number;
  pontuacao: number;
  justificativa: string;
  contexto: string;
}

export interface Album {
  id: AlbumId;
  titulo: string;
  ano: number;
  edicao: string;
  estetica: string;
  descricao: string;
  destaque: string;
  color: string;
  accent: string;
  ordemReferencia: number;
}
