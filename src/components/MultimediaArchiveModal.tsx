import React, { useState, useEffect } from 'react';
import { 
  X, 
  Disc, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Image as ImageIcon, 
  Music, 
  Maximize2, 
  Compass, 
  Layers, 
  CheckCircle2, 
  Radio, 
  Eye
} from 'lucide-react';
import { STATION_ARTWORKS, ArtworkEntry } from '../data/multimediaArchive';
import { musicEngine, SoundtrackTrack, STATION_PLAYLIST } from '../audio/musicEngine';
import { soundFx } from '../audio/synth';
import { useLanguage } from '../i18n/LanguageContext';

interface MultimediaArchiveModalProps {
  onClose: () => void;
  initialTab?: 'gallery' | 'jukebox';
}

export const MultimediaArchiveModal: React.FC<MultimediaArchiveModalProps> = ({
  onClose,
  initialTab = 'gallery',
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'gallery' | 'jukebox'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxArtwork, setLightboxArtwork] = useState<ArtworkEntry | null>(null);

  // Audio player state synchronized with musicEngine
  const [currentTrack, setCurrentTrack] = useState<SoundtrackTrack>(musicEngine.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState<boolean>(musicEngine.getIsPlaying());
  const [volume, setVolume] = useState<number>(0.55);

  useEffect(() => {
    const unsubscribeSync = musicEngine.subscribe(() => {
      setIsPlaying(musicEngine.getIsPlaying());
      setCurrentTrack(musicEngine.getCurrentTrack());
    });

    const unsubscribeTrackChange = musicEngine.onTrackChange((track) => {
      setCurrentTrack(track);
      setIsPlaying(true);
    });

    return () => {
      unsubscribeSync();
      unsubscribeTrackChange();
    };
  }, []);

  const handleTogglePlay = () => {
    soundFx.playBeep(700, 0.03);
    const nextPlaying = musicEngine.toggle();
    setIsPlaying(nextPlaying);
  };

  const handlePlaySpecificTrack = (index: number) => {
    soundFx.playCommandExecute();
    musicEngine.playTrack(index, true);
    setIsPlaying(true);
  };

  const handleNext = () => {
    soundFx.playBeep(850, 0.03);
    musicEngine.nextTrack(true);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    soundFx.playBeep(650, 0.03);
    musicEngine.prevTrack(true);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    musicEngine.setVolume(val);
  };

  const filteredArtworks = selectedCategory === 'all'
    ? STATION_ARTWORKS
    : STATION_ARTWORKS.filter(art => art.category === selectedCategory);

  const categories = [
    { id: 'all', label: language === 'fr' ? 'TOUTES (18)' : 'TODAS (18)' },
    { id: 'versalles', label: language === 'fr' ? 'STATION VERSAILLES (6)' : 'ESTACIÓN VERSALLES (6)' },
    { id: 'hyperion', label: language === 'fr' ? 'CUIRASSÉ HYPERION (4)' : 'ACORAZADO HYPERION (4)' },
    { id: 'titan', label: language === 'fr' ? 'AVANT-POSTE TITAN-IV (4)' : 'PUESTO TITÁN-IV (4)' },
    { id: 'helios', label: language === 'fr' ? 'LABORATOIRE HÉLIOS (4)' : 'LABORATORIO HELIOS (4)' },
    { id: 'solar', label: language === 'fr' ? 'SYSTÈME SOLAIRE (1)' : 'SISTEMA SOLAR (1)' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#020b18]/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-[#020e1d] border border-[#00f5ff]/40 rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.95)]">
        
        {/* MODAL HEADER */}
        <div className="bg-[#03172a] border-b border-[#00f5ff]/20 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-base md:text-lg text-white tracking-wider flex items-center gap-2">
                <span>{language === 'fr' ? 'ARCHIVES MULTIMÉDIAS & JUKEBOX' : 'ARCHIVO MULTIMEDIA & JUKEBOX'}</span>
                <span className="text-[10px] font-tech text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  {language === 'fr' ? 'STATION VERSAILLES' : 'ESTACIÓN VERSALLES'}
                </span>
              </h2>
              <div className="text-xs font-tech text-slate-400">
                {language === 'fr'
                  ? 'Collection complète d’art tactique officiel et bande originale stellaire'
                  : 'Colección completa de arte táctico oficial y banda sonora estelar'}
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2">
            <div className="bg-[#010a17] p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => {
                  soundFx.playBeep(600, 0.03);
                  setActiveTab('gallery');
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-orbitron font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/40 shadow-[0_0_12px_rgba(0,245,255,0.25)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{t.archive.galleryTab.toUpperCase()} ({STATION_ARTWORKS.length})</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playBeep(600, 0.03);
                  setActiveTab('jukebox');
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-orbitron font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'jukebox'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>{t.archive.jukeboxTab.toUpperCase()} ({STATION_PLAYLIST.length})</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundFx.playBeep(400, 0.03);
                onClose();
              }}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-6">
          
          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB 1: GALERÍA DE ARTE TÁCTICO */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              
              {/* Filter Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-orbitron text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'fr' ? 'FILTRER PAR LOCALISATION :' : 'FILTRAR UBICACIÓN:'}</span>
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundFx.playBeep(750, 0.02);
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-tech cursor-pointer transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/50 font-bold shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                        : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Artwork Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredArtworks.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      soundFx.playBeep(800, 0.03);
                      setLightboxArtwork(art);
                    }}
                    className="group bg-[#020e1a] border border-cyan-500/20 hover:border-[#00f5ff] rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    {/* Image Preview Container */}
                    <div className="relative w-full h-48 overflow-hidden bg-black/60">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020e1a] via-transparent to-transparent opacity-80" />
                      
                      {/* Floating Category Tag */}
                      <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-sm border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-tech text-cyan-300 uppercase tracking-widest">
                        {art.locationName}
                      </div>

                      {/* Expand Button Overlay */}
                      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 p-1.5 rounded-lg border border-cyan-500/40 text-cyan-300">
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-2">
                      <div className="text-[10px] font-tech text-[#00f5ff] uppercase tracking-wider">
                        {art.sectorTag}
                      </div>
                      <h3 className="font-orbitron font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {art.title}
                      </h3>
                      <p className="text-xs font-tech text-slate-400 line-clamp-2 leading-relaxed">
                        {art.description}
                      </p>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-tech text-slate-500">
                        <span className="truncate mr-2">{art.specs}</span>
                        <span className="text-[#00f5ff] shrink-0 group-hover:underline">
                          {language === 'fr' ? 'AGRANDIR ↗' : 'AMPLIAR ↗'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* TAB 2: JUKEBOX & REPRODUCTOR DE BANDA SONORA */}
          {/* ═════════════════════════════════════════════════════════ */}
          {activeTab === 'jukebox' && (
            <div className="space-y-6">
              
              {/* NOW PLAYING HERO BANNER */}
              <div className="bg-gradient-to-r from-[#031526] via-[#041c33] to-[#031526] border border-purple-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  {/* Left: Disc & Track Meta */}
                  <div className="flex items-center gap-5">
                    {/* Spinning Vinyl Graphic */}
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-purple-900 via-slate-900 to-purple-800 border-2 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.35)] flex items-center justify-center ${
                        isPlaying ? 'animate-spin' : ''
                      }`} style={{ animationDuration: '6s' }}>
                        <div className="w-7 h-7 rounded-full bg-black border border-purple-400/40 flex items-center justify-center">
                          <Disc className="w-4 h-4 text-purple-400" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-tech uppercase font-bold tracking-widest inline-flex items-center gap-1.5">
                          {isPlaying ? <Play className="w-2.5 h-2.5 fill-current text-purple-400" /> : <Pause className="w-2.5 h-2.5 text-slate-400" />}
                          <span>
                            {isPlaying
                              ? (language === 'fr' ? 'EN LECTURE' : 'EN REPRODUCCIÓN')
                              : (language === 'fr' ? 'EN PAUSE' : 'EN PAUSA')}
                          </span>
                        </span>
                        <span className="text-xs font-tech text-slate-400">
                          {language === 'fr'
                            ? `PISTE ${musicEngine.getCurrentIndex() + 1} SUR ${STATION_PLAYLIST.length}`
                            : `PISTA ${musicEngine.getCurrentIndex() + 1} DE ${STATION_PLAYLIST.length}`}
                        </span>
                      </div>

                      <h3 className="font-orbitron font-black text-xl md:text-2xl text-white tracking-wide mt-1">
                        {currentTrack.title}
                      </h3>
                      
                      <div className="text-xs font-tech text-cyan-300 mt-0.5">
                        {currentTrack.subtitle} · <span className="text-slate-400">{currentTrack.theme}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Master Audio Controls */}
                  <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                    {/* Equalizer Visualizer Simulation */}
                    <div className="flex items-end gap-1 h-6">
                      {[40, 75, 55, 95, 30, 85, 60, 100, 45, 70, 90, 35].map((height, idx) => (
                        <span
                          key={idx}
                          style={{ 
                            height: isPlaying ? `${height}%` : '20%',
                            transition: 'height 0.25s ease'
                          }}
                          className={`w-1 rounded-full ${
                            isPlaying ? 'bg-gradient-to-t from-purple-500 to-cyan-400' : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Button Toolbar */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrev}
                        title={language === 'fr' ? 'Piste précédente' : 'Canción anterior'}
                        className="p-2.5 rounded-full bg-slate-900 border border-slate-700 hover:border-purple-400 text-slate-300 hover:text-white cursor-pointer transition-colors"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleTogglePlay}
                        title={isPlaying ? (language === 'fr' ? 'Pause' : 'Pausar') : (language === 'fr' ? 'Lecture' : 'Reproducir')}
                        className="p-3.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-400 hover:to-cyan-300 text-slate-950 font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] cursor-pointer transition-transform hover:scale-105 active:scale-95"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>

                      <button
                        onClick={handleNext}
                        title={language === 'fr' ? 'Piste suivante' : 'Siguiente canción'}
                        className="p-2.5 rounded-full bg-slate-900 border border-slate-700 hover:border-purple-400 text-slate-300 hover:text-white cursor-pointer transition-colors"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Volume Slider */}
                    <div className="flex items-center gap-2 w-48">
                      <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-between text-[11px] font-tech text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                    <span>
                      {language === 'fr'
                        ? 'MODE BOUCLE CONTINUE : À la fin d\'une piste, la suivante s\'enchaîne automatiquement.'
                        : 'MODO BUCLE CONTINUO: Al finalizar una canción, pasará automáticamente a la siguiente.'}
                    </span>
                  </span>
                  <span>
                    {language === 'fr' ? 'FORMAT : Audio Stéréo 320 kbps' : 'FORMATO: Audio Estéreo 320 kbps'}
                  </span>
                </div>
              </div>

              {/* TRACKLIST DIRECTORY */}
              <div>
                <h3 className="font-orbitron font-bold text-sm text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>
                    {language === 'fr'
                      ? `LISTE DE LECTURE // STATION VERSAILLES (${STATION_PLAYLIST.length} PISTES)`
                      : `LISTA DE REPRODUCCIÓN // ESTACIÓN VERSALLES (${STATION_PLAYLIST.length} PISTAS)`}
                  </span>
                </h3>

                <div className="space-y-2.5">
                  {STATION_PLAYLIST.map((track, idx) => {
                    const isCurrent = track.id === currentTrack.id;

                    return (
                      <div
                        key={track.id}
                        onClick={() => handlePlaySpecificTrack(idx)}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-purple-950/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white'
                            : 'bg-[#020e1a] border-slate-800 hover:border-purple-500/50 hover:bg-[#021426] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Index / Play indicator */}
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs ${
                            isCurrent
                              ? 'bg-purple-500 text-slate-950 shadow-[0_0_10px_#a855f7]'
                              : 'bg-slate-900 border border-slate-700 text-slate-400'
                          }`}>
                            {isCurrent && isPlaying ? (
                              <Disc className="w-4 h-4 animate-spin" />
                            ) : (
                              <span>0{idx + 1}</span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-orbitron font-bold text-sm text-white">
                                {track.title}
                              </span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-tech font-bold uppercase">
                                  {isPlaying
                                    ? (language === 'fr' ? 'EN LECTURE' : 'SONANDO')
                                    : (language === 'fr' ? 'EN PAUSE' : 'PAUSADO')}
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-tech text-slate-400 mt-0.5">
                              {track.subtitle} · <span className="text-cyan-400/80">{track.theme}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: duration & action */}
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                            {track.estimatedDuration}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isCurrent) {
                                handleTogglePlay();
                              } else {
                                handlePlaySpecificTrack(idx);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-purple-500 hover:bg-purple-400 text-slate-950'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            }`}
                          >
                            {isCurrent && isPlaying ? (
                              <>
                                <Pause className="w-3 h-3 fill-current" />
                                <span>{language === 'fr' ? 'PAUSE' : 'PAUSAR'}</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 fill-current ml-0.5" />
                                <span>{language === 'fr' ? 'LIRE' : 'REPRODUCIR'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* FOOTER INFO */}
        <div className="bg-[#031526] border-t border-[#00f5ff]/20 px-6 py-3 flex items-center justify-between text-xs font-tech text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {language === 'fr'
                ? 'ARCHIVES CENTRALES DE LA FLOTTE OPÉRATIONNELLES · TÉLÉMÉTRIE 100% NOMINALE'
                : 'ARCHIVO CENTRAL DE LA FLOTA OPERATIVO · TELEMETRÍA 100% NOMINAL'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 font-orbitron text-xs cursor-pointer transition-colors"
          >
            {language === 'fr' ? 'FERMER LES ARCHIVES' : 'CERRAR ARCHIVO'}
          </button>
        </div>

      </div>

      {/* LIGHTBOX MODAL FULLSCREEN PREVIEW */}
      {lightboxArtwork && (
        <div 
          onClick={() => setLightboxArtwork(null)}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8 animate-in zoom-in-95 duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full flex flex-col items-center space-y-4"
          >
            {/* Top Bar of Lightbox */}
            <div className="w-full flex items-center justify-between bg-slate-900/90 border border-cyan-500/40 px-5 py-3 rounded-xl">
              <div>
                <span className="text-[10px] font-tech text-cyan-400 uppercase tracking-widest block">
                  {lightboxArtwork.sectorTag}
                </span>
                <h3 className="font-orbitron font-bold text-base md:text-lg text-white">
                  {lightboxArtwork.title}
                </h3>
              </div>

              <button
                onClick={() => setLightboxArtwork(null)}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res Image Display */}
            <div className="w-full max-h-[72vh] rounded-xl overflow-hidden border border-[#00f5ff]/40 shadow-2xl flex items-center justify-center bg-black/80">
              <img
                src={lightboxArtwork.image}
                alt={lightboxArtwork.title}
                className="max-h-[72vh] w-auto object-contain mx-auto"
              />
            </div>

            {/* Bottom Caption and Specs */}
            <div className="w-full bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs font-tech">
              <p className="text-slate-300 max-w-2xl leading-relaxed">
                {lightboxArtwork.description}
              </p>
              <div className="bg-black/80 border border-cyan-500/30 px-3 py-1.5 rounded text-cyan-300 font-mono text-[11px]">
                {lightboxArtwork.specs}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
