import { useEffect, useRef, useState } from 'react';
import type { Song } from '../data/rankings';
import { albums } from '../data/rankings';
import { TierBadge } from './TierBadge';
import { X, Heart, ExternalLink, Check, Star } from './Icons';
export function SongDialog({song,personal,favorite,onClose,onFavorite,onScore}: {song:Song;personal:boolean;favorite:boolean;onClose:()=>void;onFavorite:()=>void;onScore:(value:number)=>void}) {
 const ref=useRef<HTMLDialogElement>(null); const close=useRef<HTMLButtonElement>(null); const [score,setScore]=useState(song.pontuacao); const [saved,setSaved]=useState(false);
 const album=albums.find(a=>a.id===song.album)!;
 useEffect(()=>{const dialog=ref.current;const previous=document.activeElement as HTMLElement|null; dialog?.showModal();close.current?.focus(); const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog?.close(); document.body.style.overflow=old;previous?.focus();}},[]);
 return <dialog ref={ref} className="song-dialog" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current) onClose();}} aria-labelledby="song-title">
 <div className="dialog-body"><button ref={close} className="icon-button dialog-close" onClick={onClose} aria-label="Fechar detalhes"><X size={22}/></button>
 <div className={`dialog-art art-${album.id}`}><img src={album.cover} alt={`Capa de ${album.titulo}`}/><div><span className="eyebrow">UMA HISTÓRIA DE {album.ano}</span><p className="serif">{album.titulo}</p><span>Faixa {String(song.numeroFaixa).padStart(2,'0')} · {album.edicao}</span></div></div>
 <div className="dialog-content"><div className="dialog-kicker"><TierBadge tier={song.tier} full/><span>{personal?'Sua curadoria':'Curadoria da coleção'}</span></div><h2 id="song-title">{song.titulo}</h2>
 <div className="dialog-stats"><div><strong>#{song.posicaoGeral}</strong><span>NO RANKING GERAL</span></div><div><strong>#{song.posicaoNoAlbum}</strong><span>EM {album.titulo.toUpperCase()}</span></div><div><strong>{song.pontuacao}<small>/100</small></strong><span>PONTUAÇÃO</span></div></div>
 <h3>{personal?'A leitura da curadoria original':'Por que ela está aqui'}</h3><p>{song.justificativa}</p><h3>Dentro dessa era</h3><p>{song.contexto}</p>
 {personal && <form className="score-editor" onSubmit={e=>{e.preventDefault();onScore(score);setSaved(true);}}><label htmlFor="personal-score"><Star size={17}/> A sua nota <strong>{score}<span>/100</span></strong></label><input id="personal-score" aria-label={`Sua nota para ${song.titulo}`} type="range" min="0" max="100" step="1" value={score} onChange={e=>{setScore(Number(e.target.value));setSaved(false);}}/><button type="submit" className="button primary small">{saved?<><Check size={16}/>Nota salva</>:'Salvar minha nota'}</button><p>Ao salvar, nota, tier e posições são recalculados no seu ranking.</p></form>}
 <div className="dialog-actions"><button className={`button secondary ${favorite?'is-favorite':''}`} onClick={onFavorite}><Heart size={17} fill={favorite?'currentColor':'none'}/>{favorite?'Nos seus favoritos':'Guardar nos favoritos'}</button><a className="text-link" href={`https://open.spotify.com/search/${encodeURIComponent(song.titulo+' Taylor Swift '+song.album)}`} target="_blank" rel="noreferrer">Ouvir no Spotify <ExternalLink size={15}/></a></div>
 </div></div></dialog>;
}
