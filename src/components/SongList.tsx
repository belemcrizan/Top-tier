import type { Song } from '../data/rankings';
import { albums } from '../data/rankings';
import { Heart, Music2 } from './Icons';
import { TierBadge } from './TierBadge';
export function SongList({ tracks, overall, favorites, onFavorite, onSelect, personal }: {
 tracks:Song[]; overall:boolean; favorites:string[]; onFavorite:(id:string)=>void; onSelect:(song:Song)=>void; personal:boolean;
}) {
 return <div className="song-list"><div className="list-head"><span>#</span><span>FAIXA / {overall ? 'ÁLBUM' : 'POR QUE FICOU AQUI'}</span><span>TIER</span><span>NOTA</span><span className="sr-only">Favoritos</span></div>
 {tracks.map(song=>{const album=albums.find(a=>a.id===song.album)!; const favorite=favorites.includes(song.id); return <article className="song-row" key={song.id}>
  <button className="song-open" onClick={()=>onSelect(song)} aria-label={`Ver detalhes de ${song.titulo}`}>
   <span className={`song-rank ${song.posicaoGeral<=3?'rank-highlight':''}`}>{String(overall?song.posicaoGeral:song.posicaoNoAlbum).padStart(2,'0')}</span>
   <span className="song-identity">{overall && <img className="song-cover" src={album.cover} alt="" loading="lazy"/>}<span className="song-copy"><strong>{song.titulo}</strong><span>{overall ? <>{album.titulo} <span className="middle-dot">·</span> faixa {String(song.numeroFaixa).padStart(2,'0')}</> : song.justificativa}</span></span></span>
   <TierBadge tier={song.tier}/><span className="song-score">{song.pontuacao}<small>/100</small></span>
  </button>
  <button className={`favorite-button icon-button ${favorite?'is-favorite':''}`} onClick={()=>onFavorite(song.id)} aria-label={`${favorite?'Remover':'Adicionar'} ${song.titulo} ${favorite?'dos':'aos'} favoritos`} aria-pressed={favorite}><Heart size={18} fill={favorite?'currentColor':'none'}/></button>
 </article>})}
 {!tracks.length && <div className="empty-state"><Music2 size={32}/><h3>Nenhuma faixa por aqui.</h3><p>Tente outro nome ou ajuste os filtros para encontrar sua próxima favorita.</p></div>}
 {personal && tracks.length>0 && <p className="list-hint">Clique em uma faixa para dar a sua nota. Seu ranking se reorganiza automaticamente.</p>}
 </div>;
}
