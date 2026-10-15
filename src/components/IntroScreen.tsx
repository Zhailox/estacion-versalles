import React, { useState } from 'react';
import {
  Play,
  User,
  Languages,
  Sparkles,
  Settings,
  Users,
  Volume2,
  VolumeX,
  Music,
  Monitor,
  ExternalLink,
  X,
  ChevronRight,
  ShieldCheck,
  Radio,
  Github,
} from 'lucide-react';
import { CREW_MEMBERS } from '../data/crew';
import { soundFx } from '../audio/synth';
import { useLanguage } from '../i18n/LanguageContext';

interface IntroScreenProps {
  onStart: () => void;
  onStartTutorial?: () => void;
  activeMissionsCount: number;
  soundEnabled?: boolean;
  crtEffect?: boolean;
  isMusicPlaying?: boolean;
  onToggleSound?: () => void;
  onToggleCRT?: () => void;
  onToggleMusic?: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStart,
  onStartTutorial,
  activeMissionsCount,
  soundEnabled = true,
  crtEffect = true,
  isMusicPlaying = false,
  onToggleSound,
  onToggleCRT,
  onToggleMusic,
}) => {
  const { language, setLanguage, t, getLocalizedCrew } = useLanguage();
  const localizedCrew = getLocalizedCrew(CREW_MEMBERS);
  const [activeModal, setActiveModal] = useState<'settings' | 'about' | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string>('play');

  const isFr = language === 'fr';

  const socialLinks = [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@omnivislabs',
      desc: isFr ? 'Actualités, reels et coulisses du studio' : 'Novedades, avances y contenido del estudio',
      url: 'https://www.instagram.com/omnivislabs?rpxt=MTkzbWoxMW95bHc5dA%3D%3D',
      accent: 'from-pink-500/20 via-purple-500/20 to-amber-500/20 border-pink-400/50 hover:border-pink-400 text-pink-300',
      badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@omnivislabs',
      desc: isFr ? 'Clips de gameplay, devlogs et communauté' : 'Clips de gameplay, devlogs y comunidad',
      url: 'https://tiktok.com/@omnivislabs',
      accent: 'from-[#00f5ff]/20 via-slate-900/40 to-rose-500/20 border-[#00f5ff]/50 hover:border-[#00f5ff] text-[#00f5ff]',
      badgeBg: 'bg-[#00f5ff]/15 text-[#00f5ff] border-[#00f5ff]/40',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },
    {
      id: 'github',
      name: 'GitHub',
      handle: 'Zhailox/estacion-versalles',
      desc: isFr ? 'Code source officiel et documentation du projet' : 'Código fuente oficial y repositorio del proyecto',
      url: 'https://github.com/Zhailox/estacion-versalles',
      accent: 'from-emerald-500/20 via-slate-900/40 to-cyan-500/20 border-emerald-400/50 hover:border-emerald-400 text-emerald-300',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40',
      icon: <Github className="w-5 h-5" />,
    },
  ];

  const menuOptions = [
    {
      id: 'play',
      code: '01',
      label: t.intro.menuPlay,
      sub: isFr ? 'Accéder au pont principal de la station' : 'Acceder al nexo operativo de la estación',
      icon: <Play className="w-5 h-5 fill-current" />,
      primary: true,
      onClick: () => {
        soundFx.playSuccess();
        onStart();
      },
    },
    ...(onStartTutorial
      ? [
          {
            id: 'tutorial',
            code: '02',
            label: t.intro.menuTutorial,
            sub: isFr ? 'Entraînement guidé et Mission 00' : 'Entrenamiento guiado paso a paso y Misión 00',
            icon: <Sparkles className="w-5 h-5" />,
            primary: false,
            onClick: () => {
              soundFx.playSuccess();
              onStartTutorial();
            },
          },
        ]
      : []),
    {
      id: 'settings',
      code: '03',
      label: t.intro.menuSettings,
      sub: isFr ? 'Langue, effets sonores, musique et affichage CRT' : 'Idioma, sonido, música ambiental y pantalla CRT',
      icon: <Settings className="w-5 h-5" />,
      primary: false,
      onClick: () => {
        soundFx.playBeep(820, 0.05);
        setActiveModal('settings');
      },
    },
    {
      id: 'about',
      code: '04',
      label: t.intro.menuAbout,
      sub: isFr ? 'Omnivis Labs, réseaux officiels et GitHub' : 'Omnivis Labs, redes sociales y repositorio GitHub',
      icon: <Users className="w-5 h-5" />,
      primary: false,
      onClick: () => {
        soundFx.playBeep(880, 0.05);
        setActiveModal('about');
      },
    },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#020b18] select-none flex flex-col justify-between p-5 sm:p-8 lg:p-12">
      {/* Fullscreen Hero Background Artwork */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/menu.webp"
          alt="Estación Versalles"
          className="w-full h-full object-cover object-center scale-105 animate-[pulse_18s_ease-in-out_infinite] opacity-90"
        />
        {/* Left & Bottom Cinematic Vignette Overlays for Menu Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020b18]/95 via-[#020b18]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020b18]/95 via-transparent to-[#020b18]/60" />
        <div className="absolute inset-0 stars-layer opacity-25" />
      </div>

      {/* ================= TOP ROW (TOP-LEFT & TOP-RIGHT CORNERS) ================= */}
      <div className="relative z-10 flex items-start justify-between gap-4 w-full">
        {/* TOP-LEFT: Game Logo & Title Block */}
        <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-6 duration-500">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#00f5ff]/60 shadow-[0_0_25px_rgba(0,245,255,0.35)] bg-[#010915]/90 p-1.5 flex items-center justify-center shrink-0">
            <img
              src="/assets/logo.webp"
              alt="Omnivis Labs Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#00f5ff]/15 border border-[#00f5ff]/40 font-tech text-[10px] text-[#00f5ff] tracking-widest uppercase">
                OMNIVIS LABS // VOID CODE
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-tech text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>

            <h1 className="font-orbitron font-black text-2xl sm:text-4xl lg:text-5xl tracking-widest text-white uppercase drop-shadow-[0_0_25px_rgba(0,245,255,0.45)] leading-none">
              {t.common.stationName}
            </h1>
            <p className="font-tech text-[11px] sm:text-xs text-cyan-300/80 tracking-[0.2em] uppercase mt-1.5">
              {t.intro.subtitle}
            </p>
          </div>
        </div>

        {/* TOP-RIGHT: Station Telemetry & Crew Corner HUD */}
        <div className="hidden md:flex flex-col items-end gap-2.5 animate-in fade-in slide-in-from-right-6 duration-500">
          {/* Telemetry Status Pill */}
          <div className="flex items-center gap-4 bg-[#021022]/85 border border-[#00f5ff]/30 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2 border-r border-slate-700/80 pr-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[9px] font-tech text-slate-400 uppercase leading-none">
                  {t.common.status}
                </div>
                <div className="font-orbitron font-bold text-xs text-emerald-400 tracking-wider mt-0.5">
                  {t.intro.operationalStatus}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-r border-slate-700/80 pr-4">
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              <div>
                <div className="text-[9px] font-tech text-slate-400 uppercase leading-none">
                  {t.common.missions}
                </div>
                <div className="font-orbitron font-bold text-xs text-amber-400 tracking-wider mt-0.5">
                  {activeMissionsCount} {t.intro.activeMissionsCount}
                </div>
              </div>
            </div>

            {/* Quick Language Switcher in Top-Right */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundFx.playBeep(650, 0.04);
                  setLanguage('es');
                }}
                className={`px-2 py-1 rounded text-[10px] font-orbitron font-bold transition-all cursor-pointer ${
                  language === 'es'
                    ? 'bg-[#00f5ff] text-slate-950 shadow-[0_0_10px_rgba(0,245,255,0.6)]'
                    : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                🇻🇪 ES
              </button>
              <button
                onClick={() => {
                  soundFx.playBeep(750, 0.04);
                  setLanguage('fr');
                }}
                className={`px-2 py-1 rounded text-[10px] font-orbitron font-bold transition-all cursor-pointer ${
                  language === 'fr'
                    ? 'bg-[#00f5ff] text-slate-950 shadow-[0_0_10px_rgba(0,245,255,0.6)]'
                    : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                🇫🇷 FR
              </button>
            </div>
          </div>

          {/* Compact Active Crew Strip */}
          <div className="flex items-center gap-2 bg-[#010915]/80 border border-slate-800/90 rounded-xl p-2 backdrop-blur-md">
            <span className="text-[9px] font-orbitron font-bold text-[#00f5ff] tracking-widest uppercase px-2">
              {t.intro.activeCrew}:
            </span>
            {Object.values(localizedCrew).map((crew, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800/80"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: crew.avatarColor }}
                />
                <span className="text-[10px] font-orbitron font-bold text-slate-200 truncate">
                  {crew.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ROW (BOTTOM-LEFT MENU & BOTTOM-RIGHT CORNER) ================= */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 w-full mt-auto">
        {/* BOTTOM-LEFT: Main Video Game Navigation Menu */}
        <nav
          aria-label="Main Menu"
          className="w-full sm:w-[390px] lg:w-[430px] flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-6 duration-500"
        >
          <div className="flex items-center gap-2 mb-1 pl-1">
            <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-ping" />
            <span className="font-tech text-[11px] text-cyan-300/90 tracking-widest uppercase">
              {t.intro.startHint}
            </span>
          </div>

          {menuOptions.map((item) => {
            const isHovered = hoveredItem === item.id;
            return (
              <button
                key={item.id}
                onMouseEnter={() => {
                  if (hoveredItem !== item.id) {
                    soundFx.playKeyClick();
                    setHoveredItem(item.id);
                  }
                }}
                onClick={item.onClick}
                className={`group relative w-full text-left rounded-xl p-3.5 sm:px-5 sm:py-4 transition-all duration-200 cursor-pointer overflow-hidden backdrop-blur-md border flex items-center justify-between ${
                  item.primary
                    ? isHovered
                      ? 'bg-[#00f5ff] text-slate-950 border-[#00f5ff] shadow-[0_0_35px_rgba(0,245,255,0.75)] translate-x-2'
                      : 'bg-[#00f5ff]/90 text-slate-950 border-[#00f5ff] shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                    : isHovered
                    ? 'bg-[#041d36]/95 text-white border-[#00f5ff] shadow-[0_0_25px_rgba(0,245,255,0.35)] translate-x-2'
                    : 'bg-[#021020]/85 text-slate-200 border-[#00f5ff]/25 hover:border-[#00f5ff]/70'
                }`}
              >
                {/* Left Cyber Accent Bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all ${
                    item.primary
                      ? 'bg-slate-950'
                      : isHovered
                      ? 'bg-[#00f5ff] shadow-[0_0_12px_#00f5ff]'
                      : 'bg-[#00f5ff]/30'
                  }`}
                />

                <div className="flex items-center gap-3.5 pl-2 min-w-0">
                  <span
                    className={`font-tech text-xs font-bold tracking-widest ${
                      item.primary
                        ? 'text-slate-900/80'
                        : isHovered
                        ? 'text-[#00f5ff]'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.code}
                  </span>

                  <div
                    className={`p-2 rounded-lg shrink-0 transition-colors ${
                      item.primary
                        ? 'bg-slate-950/15 text-slate-950'
                        : isHovered
                        ? 'bg-[#00f5ff]/20 text-[#00f5ff]'
                        : 'bg-slate-900/90 text-cyan-400'
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`font-orbitron font-black text-sm sm:text-base tracking-widest uppercase truncate ${
                        item.primary ? 'text-slate-950' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div
                      className={`font-tech text-[11px] truncate ${
                        item.primary
                          ? 'text-slate-900/80 font-semibold'
                          : 'text-slate-400 group-hover:text-cyan-200/90'
                      }`}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                    isHovered ? 'translate-x-1' : ''
                  } ${item.primary ? 'text-slate-950' : 'text-[#00f5ff]'}`}
                />
              </button>
            );
          })}
        </nav>

        {/* BOTTOM-RIGHT: System Build, Quick Toggles & Omnivis Labs Copyright */}
        <div className="flex flex-col items-start sm:items-end gap-2 self-end animate-in fade-in slide-in-from-right-6 duration-500">
          <div className="flex items-center gap-2 bg-[#021020]/85 border border-slate-800 rounded-xl px-3.5 py-2 backdrop-blur-md">
            {onToggleSound && (
              <button
                onClick={onToggleSound}
                title={t.intro.settingsAudioSfx}
                className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center gap-1 ${
                  soundEnabled
                    ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="font-tech text-[10px]">SFX</span>
              </button>
            )}

            {onToggleCRT && (
              <button
                onClick={onToggleCRT}
                title={t.intro.settingsCrt}
                className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center gap-1 ${
                  crtEffect
                    ? 'bg-[#00f5ff]/15 border-[#00f5ff]/40 text-[#00f5ff]'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="font-tech text-[10px]">CRT</span>
              </button>
            )}

            <span className="text-[10px] font-tech text-slate-400 pl-1">
              BUILD <strong className="text-[#00f5ff]">v2.4</strong>
            </span>
          </div>

          <div className="text-[11px] font-tech text-slate-400/90 tracking-wider uppercase drop-shadow">
            {t.intro.copyright}
          </div>
        </div>
      </div>

      {/* ================= MODAL 03: CONFIGURACIONES ================= */}
      {activeModal === 'settings' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#010812]/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#021224]/95 border-2 border-[#00f5ff]/60 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,245,255,0.3)] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#00f5ff]/25 pb-3.5">
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-[#00f5ff]" />
                <h2 className="font-orbitron font-black text-base sm:text-lg text-white tracking-wider uppercase">
                  {t.intro.settingsTitle}
                </h2>
              </div>
              <button
                onClick={() => {
                  soundFx.playBeep(450, 0.04);
                  setActiveModal(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="space-y-2">
              <label className="text-xs font-tech text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-[#00f5ff]" />
                {t.intro.langSelectTitle}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    soundFx.playBeep(650, 0.04);
                    setLanguage('es');
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                    language === 'es'
                      ? 'bg-[#00f5ff] text-slate-950 border-[#00f5ff] shadow-[0_0_20px_rgba(0,245,255,0.5)]'
                      : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-[#00f5ff]/50'
                  }`}
                >
                  <span className="text-base">🇻🇪</span>
                  <span>Español (VE)</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playBeep(750, 0.04);
                    setLanguage('fr');
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                    language === 'fr'
                      ? 'bg-[#00f5ff] text-slate-950 border-[#00f5ff] shadow-[0_0_20px_rgba(0,245,255,0.5)]'
                      : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-[#00f5ff]/50'
                  }`}
                >
                  <span className="text-base">🇫🇷</span>
                  <span>Français</span>
                </button>
              </div>
            </div>

            {/* Audio & Visual Toggles */}
            <div className="space-y-2.5 pt-1">
              {/* SFX Toggle */}
              {onToggleSound && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-3">
                    {soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-slate-500" />
                    )}
                    <span className="font-orbitron font-bold text-xs sm:text-sm text-white">
                      {t.intro.settingsAudioSfx}
                    </span>
                  </div>
                  <button
                    onClick={onToggleSound}
                    className={`px-4 py-1.5 rounded-lg font-orbitron font-bold text-xs cursor-pointer transition-all ${
                      soundEnabled
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {soundEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              )}

              {/* Music Toggle */}
              {onToggleMusic && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Music className={`w-5 h-5 ${isMusicPlaying ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="font-orbitron font-bold text-xs sm:text-sm text-white">
                      {t.intro.settingsMusic}
                    </span>
                  </div>
                  <button
                    onClick={onToggleMusic}
                    className={`px-4 py-1.5 rounded-lg font-orbitron font-bold text-xs cursor-pointer transition-all ${
                      isMusicPlaying
                        ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isMusicPlaying ? 'ON' : 'OFF'}
                  </button>
                </div>
              )}

              {/* CRT Toggle */}
              {onToggleCRT && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Monitor className={`w-5 h-5 ${crtEffect ? 'text-[#00f5ff]' : 'text-slate-500'}`} />
                    <span className="font-orbitron font-bold text-xs sm:text-sm text-white">
                      {t.intro.settingsCrt}
                    </span>
                  </div>
                  <button
                    onClick={onToggleCRT}
                    className={`px-4 py-1.5 rounded-lg font-orbitron font-bold text-xs cursor-pointer transition-all ${
                      crtEffect
                        ? 'bg-[#00f5ff] text-slate-950 shadow-[0_0_15px_rgba(0,245,255,0.5)]'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {crtEffect ? 'ON' : 'OFF'}
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  soundFx.playBeep(700, 0.04);
                  setActiveModal(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#00f5ff] hover:bg-[#3effff] text-slate-950 font-orbitron font-black text-xs tracking-wider uppercase cursor-pointer transition-all"
              >
                {t.common.accept}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 04: CONÓCENOS (OMNIVIS LABS & REDES) ================= */}
      {activeModal === 'about' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#010812]/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#021224]/95 border-2 border-[#00f5ff]/60 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,245,255,0.3)] space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#00f5ff]/25 pb-3.5">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/logo.webp"
                  alt="Omnivis Labs"
                  className="w-9 h-9 rounded-lg border border-[#00f5ff]/50 object-contain bg-[#010915] p-1"
                />
                <div>
                  <h2 className="font-orbitron font-black text-base sm:text-lg text-white tracking-wider uppercase">
                    {t.intro.aboutTitle}
                  </h2>
                  <p className="font-tech text-[11px] text-[#00f5ff]">
                    ESTACIÓN VERSALLES // VOID CODE
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  soundFx.playBeep(450, 0.04);
                  setActiveModal(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-tech text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.intro.aboutDesc}
            </p>

            {/* Social Links List */}
            <div className="space-y-3">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playCommandExecute()}
                  className={`group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${social.accent} border transition-all duration-200 hover:scale-[1.01] hover:shadow-lg`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl border ${social.badgeBg} shrink-0`}>
                      {social.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-orbitron font-black text-sm text-white">
                          {social.name}
                        </span>
                        <span className={`text-[10px] font-tech px-2 py-0.5 rounded border ${social.badgeBg}`}>
                          {social.handle}
                        </span>
                      </div>
                      <p className="font-tech text-xs text-slate-300 truncate mt-0.5">
                        {social.desc}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 shrink-0 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </a>
              ))}
            </div>

            {/* Active Crew Section inside About Modal */}
            <div className="bg-[#010915]/90 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[10px] font-orbitron font-bold text-[#00f5ff] tracking-widest uppercase mb-2.5">
                {t.intro.activeCrew}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(localizedCrew).map((crew, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/70 border border-slate-800"
                  >
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center shrink-0"
                      style={{ color: crew.avatarColor, backgroundColor: `${crew.avatarColor}18` }}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-tech text-slate-400 uppercase leading-none truncate">
                        {crew.rank}
                      </div>
                      <div className="text-xs font-orbitron font-bold text-white truncate mt-0.5">
                        {crew.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  soundFx.playBeep(700, 0.04);
                  setActiveModal(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#00f5ff] hover:bg-[#3effff] text-slate-950 font-orbitron font-black text-xs tracking-wider uppercase cursor-pointer transition-all"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
