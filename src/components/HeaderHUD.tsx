import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Monitor, 
  Map, 
  BookOpen, 
  AlertTriangle, 
  Disc, 
  Globe, 
  LayoutGrid, 
  Activity, 
  Radio, 
  Clock,
  Sparkles,
  Music,
  HelpCircle
} from 'lucide-react';
import { GameState } from '../types/game';
import { soundFx } from '../audio/synth';
import { SOLAR_DESTINATIONS } from '../data/solarSystem';
import { useLanguage } from '../i18n/LanguageContext';
import { Languages } from 'lucide-react';

interface HeaderHUDProps {
  state: GameState;
  onNavigate: (screen: GameState['currentScreen']) => void;
  onOpenMap: () => void;
  onOpenSolarMap: () => void;
  onOpenHandbook: () => void;
  onOpenVitals: () => void;
  onToggleSound: () => void;
  onToggleCRT: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onToggleSurvivalMode: () => void;
  onOpenArchive?: (tab?: 'gallery' | 'jukebox') => void;
  onStartTutorial?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  state,
  onNavigate,
  onOpenMap,
  onOpenSolarMap,
  onOpenHandbook,
  onOpenVitals,
  onToggleSound,
  onToggleCRT,
  isMusicPlaying,
  onToggleMusic,
  onToggleSurvivalMode,
  onOpenArchive,
  onStartTutorial,
}) => {
  const { language, toggleLanguage, t, getLocalizedDestination, getLocalizedRank } = useLanguage();

  const formatTime = (secs: number) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const rawDestination = SOLAR_DESTINATIONS.find(d => d.id === state.currentDestinationId) || SOLAR_DESTINATIONS[0];
  const currentDestination = getLocalizedDestination(rawDestination);
  const isNominal = state.vitals.activeThreatLevel === 'NOMINAL';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#020b18]/90 border-b border-[#00f5ff]/20 backdrop-blur-xl z-40 px-4 md:px-8 flex items-center justify-between transition-colors">
      {/* LEFT: Identity & Status */}
      <div id="hud-identity" className="flex items-center gap-3">
        <button
          onClick={() => {
            soundFx.playWarp();
            onNavigate('hub');
          }}
          className="text-left group cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
            <span className="font-orbitron font-bold text-sm md:text-base tracking-wider text-white group-hover:text-[#00f5ff] transition-colors">
              {currentDestination.name.toUpperCase()}
            </span>
          </div>
          
          <div className="text-[11px] text-slate-400 font-tech flex items-center gap-2 mt-0.5">
            <span className={`inline-flex items-center gap-1 font-semibold ${isNominal ? 'text-emerald-400' : 'text-red-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isNominal ? 'bg-emerald-400' : 'bg-red-400 animate-ping'}`} />
              {state.vitals.activeThreatLevel}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">{getLocalizedRank(state.cadetRank)}</span>
          </div>
        </button>
      </div>

      {/* CENTER: Navigation Pill Bar */}
      <nav id="hud-nav" className="hidden lg:flex items-center bg-[#031526]/85 border border-[#00f5ff]/20 rounded-full px-2 py-1 shadow-lg backdrop-blur-md">
        {/* Hub Screen */}
        <button
          onClick={() => {
            soundFx.playBeep(600, 0.04);
            onNavigate('hub');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-orbitron tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            state.currentScreen === 'hub'
              ? 'bg-[#00f5ff]/20 text-[#00f5ff] font-bold shadow-[0_0_12px_rgba(0,245,255,0.3)]'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{t.header.hubTitle}</span>
        </button>

        {/* Sector Screen */}
        <button
          onClick={() => {
            soundFx.playBeep(600, 0.04);
            onNavigate('sector');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-orbitron tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            state.currentScreen === 'sector'
              ? 'bg-[#00f5ff]/20 text-[#00f5ff] font-bold shadow-[0_0_12px_rgba(0,245,255,0.3)]'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{t.header.sectorTitle}</span>
        </button>

        <span className="h-4 w-px bg-slate-700/60 mx-1" />

        {/* Interior Map Modal */}
        <button
          onClick={() => {
            soundFx.playBeep(700, 0.04);
            onOpenMap();
          }}
          className="px-2.5 py-1.5 rounded-full text-xs font-tech text-slate-300 hover:text-[#00f5ff] hover:bg-white/5 flex items-center gap-1.5 transition-colors cursor-pointer"
          title={t.header.mapTooltip}
        >
          <Map className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.common.map}</span>
        </button>

        {/* Solar System Map Modal */}
        <button
          onClick={() => {
            soundFx.playBeep(850, 0.04);
            onOpenSolarMap();
          }}
          className="px-2.5 py-1.5 rounded-full text-xs font-tech text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 flex items-center gap-1.5 transition-colors cursor-pointer font-semibold"
          title={t.header.solarTooltip}
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.common.solarSystem}</span>
        </button>

        {/* Code Handbook Modal */}
        <button
          onClick={() => {
            soundFx.playBeep(700, 0.04);
            onOpenHandbook();
          }}
          className="px-2.5 py-1.5 rounded-full text-xs font-tech text-slate-300 hover:text-[#00f5ff] hover:bg-white/5 flex items-center gap-1.5 transition-colors cursor-pointer"
          title={t.header.handbookTooltip}
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>{t.common.manual}</span>
        </button>

        {/* Telemetry Vitals Modal */}
        <button
          onClick={() => {
            soundFx.playBeep(700, 0.04);
            onOpenVitals();
          }}
          className="px-2.5 py-1.5 rounded-full text-xs font-tech text-slate-300 hover:text-[#00f5ff] hover:bg-white/5 flex items-center gap-1.5 transition-colors cursor-pointer"
          title={t.header.vitalsTooltip}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.common.telemetry}</span>
        </button>

        {/* Multimedia Archive Modal */}
        {onOpenArchive && (
          <button
            onClick={() => {
              soundFx.playBeep(700, 0.04);
              onOpenArchive('gallery');
            }}
            className="px-2.5 py-1.5 rounded-full text-xs font-tech text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            title={t.header.archiveTooltip}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.common.archive}</span>
          </button>
        )}

        <span className="h-4 w-px bg-slate-700/60 mx-1" />

        {/* Interactive Step-by-Step Tutorial / Guide */}
        {onStartTutorial && (
          <button
            onClick={() => {
              soundFx.playBeep(850, 0.04);
              onStartTutorial();
            }}
            className="px-2.5 py-1.5 rounded-full text-xs font-tech text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
            title={t.header.tutorialTooltip}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{t.header.tutorialBtn}</span>
          </button>
        )}
      </nav>

      {/* RIGHT: Actions, Timer & Controls */}
      <div className="flex items-center gap-3">
        {/* Pressure Crisis Countdown (Only shown when active) */}
        {state.pressureTimer !== null && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-950/70 border border-red-500/60 rounded-full text-red-300 font-tech text-xs shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold font-mono">CRISIS: {state.pressureTimer}s</span>
          </div>
        )}

        {/* Mission Elapsed Time */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/50 rounded-lg border border-slate-800 text-slate-300 font-tech text-xs">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-cyan-200">{formatTime(state.missionTime)}</span>
        </div>

        {/* Compact Utility Control Group */}
        <div id="hud-utilities" className="flex items-center gap-1 bg-[#031526]/80 border border-[#00f5ff]/20 rounded-full p-1 shadow-inner">
          {/* Language Switcher Button */}
          <button
            onClick={() => {
              soundFx.playBeep(700, 0.05);
              toggleLanguage();
            }}
            title={t.header.languageToggleTooltip}
            className="px-2 py-1 rounded-full text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-white/5 hover:bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/30 shadow-[0_0_8px_rgba(0,245,255,0.2)]"
          >
            <Languages className="w-3.5 h-3.5 text-[#00f5ff]" />
            <span className="text-[10px] tracking-wider uppercase">
              {language === 'es' ? '🇻🇪 ES' : '🇫🇷 FR'}
            </span>
          </button>

          {/* Official Soundtrack Toggle & Jukebox Access */}
          <div className="flex items-center">
            <button
              onClick={onToggleMusic}
              title={isMusicPlaying ? t.header.musicTooltipPause : t.header.musicTooltipPlay}
              className={`p-1.5 rounded-l-full transition-all cursor-pointer ${
                isMusicPlaying
                  ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-purple-300 hover:bg-white/5'
              }`}
            >
              <Disc className={`w-4 h-4 ${isMusicPlaying ? 'animate-spin text-purple-400' : ''}`} style={{ animationDuration: '4s' }} />
            </button>
            {onOpenArchive && (
              <button
                onClick={() => {
                  soundFx.playBeep(750, 0.04);
                  onOpenArchive('jukebox');
                }}
                title={t.header.jukeboxTooltip}
                className="p-1.5 rounded-r-full text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-all cursor-pointer border-l border-slate-700/50"
              >
                <Music className="w-3.5 h-3.5 text-purple-300" />
              </button>
            )}
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            title={state.soundEnabled ? t.header.soundTooltipOn : t.header.soundTooltipOff}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              state.soundEnabled
                ? 'text-emerald-400 hover:bg-white/5'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            {state.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* CRT Retro Filter Toggle */}
          <button
            onClick={onToggleCRT}
            title={state.crtEffect ? t.header.crtTooltipOn : t.header.crtTooltipOff}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              state.crtEffect
                ? 'bg-[#00f5ff]/20 text-[#00f5ff]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>

          {/* Survival Mode Toggle */}
          <button
            onClick={onToggleSurvivalMode}
            title={state.survivalMode ? t.header.survivalTooltipOn : t.header.survivalTooltipOff}
            className={`px-2 py-1 rounded-full text-[10px] font-orbitron transition-all cursor-pointer flex items-center gap-1 ${
              state.survivalMode
                ? 'bg-red-950/80 text-red-300 border border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse'
                : 'text-slate-400 hover:text-red-400 hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-bold">{state.survivalMode ? `${t.header.survivalBadge}: ON` : t.header.survivalBadge}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
