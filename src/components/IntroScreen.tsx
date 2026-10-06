import React from 'react';
import { Play, User, Languages } from 'lucide-react';
import { CREW_MEMBERS } from '../data/crew';
import { soundFx } from '../audio/synth';
import { useLanguage } from '../i18n/LanguageContext';

interface IntroScreenProps {
  onStart: () => void;
  activeMissionsCount: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStart,
  activeMissionsCount,
}) => {
  const { language, setLanguage, t, getLocalizedCrew } = useLanguage();
  const localizedCrew = getLocalizedCrew(CREW_MEMBERS);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#020b18] overflow-hidden select-none p-4">
      {/* Background stars & nebula */}
      <div className="absolute inset-0 stars-layer opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#020b18]/60 to-[#020b18] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full p-6 md:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Company Logo */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-[#00f5ff]/40 shadow-[0_0_25px_rgba(0,245,255,0.3)] bg-[#010915] p-1.5 flex items-center justify-center">
            <img 
              src="/assets/logo.webp" 
              alt="Logo" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-orbitron font-black text-3xl md:text-5xl tracking-widest text-white uppercase drop-shadow-[0_0_25px_rgba(0,245,255,0.5)]">
            {t.common.stationName}
          </h1>
          <p className="font-tech text-xs md:text-sm text-cyan-300/80 tracking-widest uppercase mt-1">
            {t.intro.subtitle}
          </p>
        </div>

        {/* Language Selection Bar (Bilingual ES-VE / FR) */}
        <div className="flex flex-col items-center gap-1.5 bg-[#031526]/90 border border-[#00f5ff]/30 rounded-xl p-2.5 shadow-[0_0_20px_rgba(0,245,255,0.15)]">
          <span className="text-[10px] font-tech text-slate-400 tracking-wider flex items-center gap-1">
            <Languages className="w-3 h-3 text-[#00f5ff]" />
            {t.intro.langSelectTitle}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playBeep(650, 0.04);
                setLanguage('es');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                language === 'es'
                  ? 'bg-[#00f5ff] text-slate-950 shadow-[0_0_15px_rgba(0,245,255,0.7)] scale-105'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:text-white hover:border-[#00f5ff]/50'
              }`}
            >
              <span>🇻🇪</span>
              <span>Español (Venezuela)</span>
            </button>
            <button
              onClick={() => {
                soundFx.playBeep(750, 0.04);
                setLanguage('fr');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                language === 'fr'
                  ? 'bg-[#00f5ff] text-slate-950 shadow-[0_0_15px_rgba(0,245,255,0.7)] scale-105'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:text-white hover:border-[#00f5ff]/50'
              }`}
            >
              <span>🇫🇷</span>
              <span>Français</span>
            </button>
          </div>
        </div>

        <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent my-1" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 bg-[#031526]/80 border border-[#00f5ff]/20 rounded-lg p-3 md:px-6 md:py-3.5 backdrop-blur-md w-full max-w-lg">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-tech text-slate-400 tracking-wider uppercase">{t.common.status}</span>
            <span className="font-orbitron font-bold text-xs text-emerald-400 tracking-wider">{t.intro.operationalStatus}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-tech text-slate-400 tracking-wider uppercase">{t.common.crew}</span>
            <span className="font-orbitron font-bold text-xs text-[#00f5ff] tracking-wider">{t.intro.crewMembersCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-tech text-slate-400 tracking-wider uppercase">{t.common.missions}</span>
            <span className="font-orbitron font-bold text-xs text-amber-400 tracking-wider">{activeMissionsCount} {t.intro.activeMissionsCount}</span>
          </div>
        </div>

        {/* Main Start Button */}
        <div>
          <button
            onClick={() => {
              soundFx.playSuccess();
              onStart();
            }}
            className="px-8 py-3.5 bg-[#00f5ff] hover:bg-[#3effff] text-slate-950 font-orbitron font-black text-sm tracking-widest rounded-lg shadow-[0_0_30px_rgba(0,245,255,0.6)] hover:shadow-[0_0_50px_rgba(0,245,255,0.9)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 flex items-center gap-2.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t.intro.startMission}</span>
          </button>
        </div>

        {/* Blinking hint */}
        <div className="font-tech text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{t.intro.startHint}</span>
        </div>

        {/* Crew Roster */}
        <div className="w-full max-w-lg bg-[#010915]/80 border border-[#00f5ff]/20 rounded-lg p-3.5 backdrop-blur-md">
          <div className="text-[10px] font-orbitron font-bold text-[#00f5ff] tracking-widest uppercase mb-2">
            {t.intro.activeCrew}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
            {Object.values(localizedCrew).map((crew, idx) => (
              <div key={idx} className="flex items-center gap-2 p-1.5 rounded bg-slate-900/60 border border-slate-800">
                <div
                  className="w-7 h-7 rounded flex items-center justify-center font-bold text-xs"
                  style={{ color: crew.avatarColor, backgroundColor: `${crew.avatarColor}15` }}
                >
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-tech text-slate-400 uppercase leading-none truncate">
                    {crew.rank}
                  </div>
                  <div className="text-xs font-orbitron font-semibold text-white truncate">
                    {crew.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[10px] font-tech text-slate-600">
          {t.intro.copyright}
        </div>
      </div>
    </div>
  );
};
