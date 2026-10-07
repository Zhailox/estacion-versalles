import React, { useState, useEffect } from 'react';
import { SectorId, GameState } from '../types/game';
import { soundFx } from '../audio/synth';
import { getCustomBackground, subscribeToCustomAssets } from '../utils/customAssets';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface InteractiveBlueprintMapProps {
  currentSectorId: SectorId;
  state: GameState;
  onSelectSector: (id: SectorId) => void;
  onClose: () => void;
}

const MAP_IMAGE_SOURCES = [
  '/assets/Mapa General Estación Versalles.webp',
  '/Mapa General Estación Versalles.webp',
  '/assets/map.webp',
];

export const InteractiveBlueprintMap: React.FC<InteractiveBlueprintMapProps> = ({
  currentSectorId,
  state,
  onSelectSector,
  onClose,
}) => {
  const { language } = useLanguage();
  const [bgSrc, setBgSrc] = useState<string | null>(null);
  const [srcIndex, setSrcIndex] = useState(0);

  useEffect(() => {
    const updateBg = () => {
      if (state.currentDestinationId && state.currentDestinationId !== 'versalles') {
        const destBg = getCustomBackground(state.currentDestinationId);
        if (destBg) {
          setBgSrc(destBg);
          return;
        }
      }
      const saved = getCustomBackground('map');
      if (saved) {
        setBgSrc(saved);
      } else {
        setBgSrc(MAP_IMAGE_SOURCES[0]);
      }
    };
    updateBg();
    const unsubscribe = subscribeToCustomAssets(updateBg);
    return () => unsubscribe();
  }, [state.currentDestinationId]);

  const handleImageError = () => {
    if (srcIndex + 1 < MAP_IMAGE_SOURCES.length) {
      setSrcIndex(srcIndex + 1);
      setBgSrc(MAP_IMAGE_SOURCES[srcIndex + 1]);
    } else {
      setBgSrc(null); // Fallback to vector schematic
    }
  };

  const handleSectorClick = (id: SectorId) => {
    soundFx.playWarp();
    onSelectSector(id);
    onClose();
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[400px] bg-[#020d18] rounded-lg overflow-hidden border border-[#00f5ff]/40 shadow-2xl flex flex-col">
      {/* Top Bar Controls */}
      <div className="px-4 py-2.5 bg-[#031526] border-b border-[#00f5ff]/20 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-orbitron text-xs text-[#00f5ff] font-bold tracking-wider">
            {state.currentDestinationId.toUpperCase()} — {language === 'fr' ? 'PLAN DE DISTRIBUTION INTÉRIEURE' : 'PLANO DE DISTRIBUCIÓN INTERIOR'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-tech text-slate-400">
          <span className="text-[#00f5ff]">{language === 'fr' ? 'SYSTÈME :' : 'SISTEMA:'}</span>{' '}
          {language === 'fr' ? 'TÉLÉMÉTRIE ACTIVE' : 'TELEMETRÍA ACTIVA'}
        </div>
      </div>

      {/* Main Map Canvas / Blueprint Display */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#03111f]">
        {/* If image available, render it directly as background */}
        {bgSrc && (
          <img
            src={bgSrc}
            alt="Mapa General Estación Versalles"
            onError={handleImageError}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          />
        )}

        {/* If no image loaded or as backdrop, render faithful full-scale vector recreation */}
        {!bgSrc && (
          <svg className="w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#00f5ff" strokeWidth="0.5" strokeOpacity="0.15" />
              </pattern>
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#020d18" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="reactorCoreMini" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#c084fc" />
                <stop offset="70%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b0764" />
              </radialGradient>
            </defs>

            {/* Base Blueprint Background */}
            <rect width="100%" height="100%" fill="#03111f" />
            <rect width="100%" height="100%" fill="url(#mapGrid)" />

            {/* Outer Cyber Frame */}
            <rect x="25" y="25" width="1550" height="850" rx="16" fill="none" stroke="#00f5ff" strokeWidth="3" strokeOpacity="0.7" />
            <path d="M 25 60 L 60 25 M 1575 60 L 1540 25 M 25 840 L 60 875 M 1575 840 L 1540 875" stroke="#00f5ff" strokeWidth="4" />

            {/* Header Title Text */}
            <text x="50" y="70" fill="#00f5ff" fontFamily="'Orbitron', sans-serif" fontSize="24" fontWeight="bold" letterSpacing="2">
              ESTACIÓN VERSALLES - DISTRIBUCIÓN INTERIOR
            </text>

            {/* Top Left Legend Box */}
            <g transform="translate(50, 95)">
              <rect width="210" height="150" rx="8" fill="#021528" stroke="#00f5ff" strokeWidth="1.5" strokeOpacity="0.5" />
              <text x="16" y="28" fill="#00f5ff" fontFamily="'Orbitron', sans-serif" fontSize="13" fontWeight="bold">
                LEYENDA
              </text>
              <path d="M 18 50 L 32 50 L 26 44 M 32 50 L 26 56" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
              <text x="44" y="54" fill="#cbd5e1" fontFamily="'Share Tech Mono', monospace" fontSize="12">
                Consola de Control
              </text>
              <g transform="translate(18, 76)">
                <path d="M 4 2 L 8 6 L 14 0 L 16 2 L 10 8 L 14 12 L 12 14 L 8 10 L 2 16 L 0 14 Z" fill="#eab308" />
              </g>
              <text x="44" y="90" fill="#cbd5e1" fontFamily="'Share Tech Mono', monospace" fontSize="12">
                Llave Inglesa
              </text>
              <rect x="18" y="112" width="18" height="14" rx="2" fill="none" stroke="#eab308" strokeWidth="1.5" />
              <text x="22" y="123" fill="#eab308" fontFamily="monospace" fontSize="10">&gt;_</text>
              <text x="44" y="125" fill="#cbd5e1" fontFamily="'Share Tech Mono', monospace" fontSize="12">
                Terminal
              </text>
            </g>

            {/* Corridors connecting to the Central Hub */}
            {/* Top Corridor */}
            <path d="M 760 300 L 760 210 L 840 210 L 840 300" fill="#041e33" stroke="#00f5ff" strokeWidth="3" />
            <line x1="800" y1="210" x2="800" y2="300" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="8,6" />

            {/* Bottom Corridor to Cargo */}
            <path d="M 760 500 L 760 600 L 840 600 L 840 500" fill="#041e33" stroke="#00f5ff" strokeWidth="3" />
            <line x1="800" y1="500" x2="800" y2="600" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="8,6" />

            {/* Diagonal Corridors */}
            {/* Top-Left to Bridge */}
            <path d="M 680 340 L 520 250 L 560 200 L 720 300" fill="#041e33" stroke="#00f5ff" strokeWidth="3" />
            <line x1="600" y1="270" x2="680" y2="315" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="8,6" />

            {/* Bottom-Left to Reactor */}
            <path d="M 680 460 L 520 540 L 550 590 L 720 500" fill="#041e33" stroke="#00f5ff" strokeWidth="3" />
            {/* Red Dashed Player Transit Path to Reactor */}
            <path d="M 790 410 L 700 410 L 630 480 L 550 520 L 460 520" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="6,5" />
            <polygon points="460,515 445,520 460,525" fill="#ef4444" />

            {/* Top-Right to Lab */}
            <path d="M 880 340 L 1020 240 L 1060 280 L 920 380" fill="#041e33" stroke="#00f5ff" strokeWidth="3" />
            <line x1="900" y1="360" x2="1020" y2="270" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="8,6" />

            {/* Bottom-Right to Crew */}
            <path d="M 880 460 L 1020 550 L 1050 500 L 920 420" fill="#041e33" stroke="#00f5ff" strokeWidth="3" />
            <line x1="900" y1="440" x2="1020" y2="520" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="8,6" />

            {/* ===================== ROOMS ===================== */}

            {/* 1. TOP ROOM: ALMACÉN Y MANTENIMIENTO */}
            <g className="cursor-pointer group" onClick={() => handleSectorClick('drones')}>
              <rect x="670" y="60" width="260" height="150" rx="14" fill="#031628" stroke="#00f5ff" strokeWidth="3" className="group-hover:stroke-emerald-400 group-hover:fill-[#04243d] transition-all" />
              <rect x="680" y="70" width="240" height="130" fill="none" stroke="#00f5ff" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="10, 10" />
              <text x="800" y="105" textAnchor="middle" fill="#cbd5e1" fontFamily="'Orbitron', sans-serif" fontSize="12" fontWeight="bold">
                MANTENIMIENTO & DRONES
              </text>
              {/* Tool icons */}
              <g transform="translate(730, 80) scale(1.2)">
                <path d="M 4 2 L 8 6 L 14 0 L 16 2 L 10 8 L 14 12 L 12 14 L 8 10 L 2 16 L 0 14 Z" fill="#eab308" />
              </g>
            </g>

            {/* 2. TOP-LEFT ROOM: PUENTE DE NAVEGACIÓN Y CUBIERTA DE VUELO */}
            <g className="cursor-pointer group" onClick={() => handleSectorClick('bridge')}>
              <rect x="280" y="190" width="280" height="230" rx="20" fill="#031628" stroke="#00f5ff" strokeWidth="3" className="group-hover:stroke-[#00f5ff] group-hover:fill-[#04243d] transition-all" />
              <text x="420" y="145" textAnchor="middle" fill="#f8fafc" fontFamily="'Orbitron', sans-serif" fontSize="13" fontWeight="bold">
                PUENTE DE NAVEGACIÓN
              </text>
              <text x="420" y="165" textAnchor="middle" fill="#94a3b8" fontFamily="'Orbitron', sans-serif" fontSize="11">
                Y CUBIERTA DE VUELO
              </text>
              {/* Timón Helm Icon */}
              <circle cx="420" cy="270" r="18" fill="none" stroke="#00f5ff" strokeWidth="3.5" />
              <circle cx="420" cy="270" r="5" fill="#00f5ff" />
              <line x1="420" y1="244" x2="420" y2="296" stroke="#00f5ff" strokeWidth="3" />
              <line x1="394" y1="270" x2="446" y2="270" stroke="#00f5ff" strokeWidth="3" />
              <text x="420" y="315" textAnchor="middle" fill="#00f5ff" fontFamily="'Orbitron', sans-serif" fontSize="14" fontWeight="bold">
                TIMÓN
              </text>
              {/* Consoles and captain chair */}
              <rect x="300" y="260" width="30" height="70" rx="4" fill="#042038" stroke="#00f5ff" strokeWidth="1.5" />
              <rect x="350" y="370" width="45" height="25" rx="3" fill="#042038" stroke="#00f5ff" strokeWidth="1.5" />
              <rect x="445" y="370" width="45" height="25" rx="3" fill="#042038" stroke="#00f5ff" strokeWidth="1.5" />
            </g>

            {/* 3. CENTER OCTAGON: NEXO CENTRAL */}
            <g className="cursor-pointer group" onClick={() => handleSectorClick('reactor')}>
              <circle cx="800" cy="400" r="140" fill="url(#hubGlow)" />
              {/* Octagonal Hull Wall */}
              <polygon
                points="740,290 860,290 940,340 940,460 860,510 740,510 660,460 660,340"
                fill="#03172c"
                stroke="#00f5ff"
                strokeWidth="4"
                className="group-hover:stroke-cyan-300 transition-colors"
              />
              <text x="800" y="380" textAnchor="middle" fill="#00f5ff" fontFamily="'Orbitron', sans-serif" fontSize="16" fontWeight="bold" letterSpacing="1">
                NEXO CENTRAL
              </text>

              {/* Player Astronaut Avatar */}
              <g transform="translate(790, 420)">
                <circle cx="10" cy="0" r="10" fill="#e2e8f0" stroke="#00f5ff" strokeWidth="2" />
                <rect x="3" y="10" width="14" height="20" rx="4" fill="#94a3b8" />
                {/* Heading indicator green arrow */}
                <polygon points="25,-8 35,-14 28,-3" fill="#22c55e" />
              </g>
              <text x="800" y="465" textAnchor="middle" fill="#22c55e" fontFamily="'Orbitron', sans-serif" fontSize="13" fontWeight="bold">
                JUGADOR
              </text>
            </g>

            {/* 4. TOP-RIGHT ROOM: LABORATORIOS DE DATOS Y PROCESADO LÓGICO */}
            <g className="cursor-pointer group" onClick={() => handleSectorClick('lab')}>
              <rect x="1000" y="140" width="380" height="280" rx="20" fill="#031628" stroke="#00f5ff" strokeWidth="3" className="group-hover:stroke-purple-400 group-hover:fill-[#04243d] transition-all" />
              <text x="1190" y="115" textAnchor="middle" fill="#f8fafc" fontFamily="'Orbitron', sans-serif" fontSize="13" fontWeight="bold">
                LABORATORIOS DE DATOS Y
              </text>
              <text x="1190" y="132" textAnchor="middle" fill="#94a3b8" fontFamily="'Orbitron', sans-serif" fontSize="11">
                PROCESADO LÓGICO
              </text>

              {/* Mission Objective Tag */}
              <g transform="translate(1220, 160)">
                <text x="0" y="16" fill="#eab308" fontFamily="'Orbitron', sans-serif" fontSize="11" fontWeight="bold">
                  OBJETIVO DE LA MISIÓN:
                </text>
                <text x="10" y="32" fill="#f8fafc" fontFamily="'Share Tech Mono', monospace" fontSize="11">
                  Reparar Puerta Lógica
                </text>
                <g transform="translate(60, -2) scale(0.9)">
                  <path d="M 4 2 L 8 6 L 14 0 L 16 2 L 10 8 L 14 12 L 12 14 L 8 10 L 2 16 L 0 14 Z" fill="#eab308" />
                </g>
              </g>

              {/* Algorithm Core in Center */}
              <rect x="1140" y="240" width="80" height="60" rx="8" fill="#042730" stroke="#00f5ff" strokeWidth="2" />
              <rect x="1155" y="250" width="50" height="40" rx="4" fill="#22c55e" opacity="0.8" />
              <text x="1180" y="320" textAnchor="middle" fill="#00f5ff" fontFamily="'Orbitron', sans-serif" fontSize="13" fontWeight="bold">
                NÚCLEO DE
              </text>
              <text x="1180" y="336" textAnchor="middle" fill="#00f5ff" fontFamily="'Orbitron', sans-serif" fontSize="13" fontWeight="bold">
                ALGORITMOS
              </text>

              {/* Server Racks */}
              <rect x="1030" y="160" width="50" height="60" rx="3" fill="#042038" stroke="#00f5ff" strokeWidth="1.2" />
              <rect x="1280" y="240" width="60" height="80" rx="3" fill="#042038" stroke="#00f5ff" strokeWidth="1.2" />
              <rect x="1180" y="365" width="80" height="35" rx="3" fill="#042038" stroke="#00f5ff" strokeWidth="1.2" />
            </g>

            {/* 5. BOTTOM-LEFT ROOM: INGENIERÍA Y NÚCLEO DEL REACTOR */}
            <g className="cursor-pointer group" onClick={() => handleSectorClick('reactor')}>
              <rect x="270" y="500" width="280" height="230" rx="20" fill="#031628" stroke="#00f5ff" strokeWidth="3.5" className="group-hover:stroke-amber-400 group-hover:fill-[#04243d] transition-all" />
              <text x="410" y="755" textAnchor="middle" fill="#f8fafc" fontFamily="'Orbitron', sans-serif" fontSize="13" fontWeight="bold">
                INGENIERÍA Y
              </text>
              <text x="410" y="775" textAnchor="middle" fill="#00f5ff" fontFamily="'Orbitron', sans-serif" fontSize="13" fontWeight="bold">
                NÚCLEO DEL REACTOR
              </text>

              {/* Cooling Pipes and Tokamak */}
              <text x="430" y="540" fill="#00f5ff" fontFamily="'Orbitron', sans-serif" fontSize="11" fontWeight="bold">
                TUBERÍAS DE
              </text>
              <text x="420" y="555" fill="#00f5ff" fontFamily="'Orbitron', sans-serif" fontSize="11" fontWeight="bold">
                REFRIGERACIÓN
              </text>
              <path d="M 370 540 L 460 540 L 460 610" fill="none" stroke="#00f5ff" strokeWidth="5" opacity="0.6" />

              {/* Pulsing Tokamak Mini */}
              <rect x="400" y="590" width="60" height="60" rx="8" fill="#1e1035" stroke="#c084fc" strokeWidth="2.5" />
              <circle cx="430" cy="620" r="20" fill="url(#reactorCoreMini)" />

              {/* Mission Objective Tag */}
              <text x="410" y="675" textAnchor="middle" fill="#eab308" fontFamily="'Orbitron', sans-serif" fontSize="10" fontWeight="bold">
                OBJETIVO DE LA MISIÓN:
              </text>
              <text x="410" y="692" textAnchor="middle" fill="#f8fafc" fontFamily="'Share Tech Mono', monospace" fontSize="10">
                Optimizar Código de Propulsores
              </text>
            </g>

            {/* 6. BOTTOM ROOM: BAHÍA DE CARGA Y BRAZOS DE ACOPLAMIENTO */}
            <g className="cursor-pointer group" onClick={() => handleSectorClick('shields')}>
              <rect x="650" y="650" width="310" height="180" rx="14" fill="#031628" stroke="#00f5ff" strokeWidth="3" className="group-hover:stroke-cyan-300 group-hover:fill-[#04243d] transition-all" />
              <text x="805" y="715" textAnchor="middle" fill="#f8fafc" fontFamily="'Orbitron', sans-serif" fontSize="13" fontWeight="bold">
                BAHÍA DE CARGA Y
              </text>
              <text x="805" y="735" textAnchor="middle" fill="#94a3b8" fontFamily="'Orbitron', sans-serif" fontSize="12">
                BRAZOS DE ACOPLAMIENTO
              </text>
              {/* Crates */}
              <rect x="670" y="670" width="35" height="35" fill="none" stroke="#00f5ff" strokeWidth="1.5" />
              <line x1="670" y1="670" x2="705" y2="705" stroke="#00f5ff" strokeWidth="1" />
              <line x1="705" y1="670" x2="670" y2="705" stroke="#00f5ff" strokeWidth="1" />
              <rect x="710" y="670" width="35" height="35" fill="none" stroke="#00f5ff" strokeWidth="1.5" />
              <line x1="710" y1="670" x2="745" y2="705" stroke="#00f5ff" strokeWidth="1" />
            </g>

            {/* 7. BOTTOM-RIGHT ROOM: COMEDOR Y HABITACIONES DE LA TRIPULACIÓN */}
            <g className="cursor-pointer group" onClick={() => handleSectorClick('lab')}>
              <rect x="1000" y="470" width="380" height="230" rx="16" fill="#031628" stroke="#00f5ff" strokeWidth="3" className="group-hover:stroke-emerald-400 group-hover:fill-[#04243d] transition-all" />
              <text x="1190" y="600" textAnchor="middle" fill="#00f5ff" fontFamily="'Orbitron', sans-serif" fontSize="14" fontWeight="bold">
                COMEDOR
              </text>
              <text x="1190" y="750" textAnchor="middle" fill="#f8fafc" fontFamily="'Orbitron', sans-serif" fontSize="13" fontWeight="bold">
                HABITACIONES DE LA TRIPULACIÓN
              </text>
              {/* Crew Bunk cubicles */}
              {Array.from({ length: 6 }).map((_, i) => (
                <g key={i}>
                  <rect x={1020 + (i % 3) * 60} y={490 + Math.floor(i / 3) * 110} width="45" height="50" rx="3" fill="#042038" stroke="#00f5ff" strokeWidth="1.2" />
                  <rect x={1025 + (i % 3) * 60} y={495 + Math.floor(i / 3) * 110} width="35" height="20" rx="2" fill="#0284c7" opacity="0.6" />
                </g>
              ))}
            </g>

            {/* Bottom Left Status Widget */}
            <g transform="translate(50, 780)">
              <rect width="260" height="70" rx="6" fill="#021528" stroke="#00f5ff" strokeWidth="1.5" />
              <text x="16" y="24" fill="#00f5ff" fontFamily="'Orbitron', sans-serif" fontSize="11" fontWeight="bold">
                {language === 'fr' ? 'MISSION ACTUELLE :' : 'MISIÓN ACTUAL:'}
              </text>
              <text x="16" y="46" fill="#f8fafc" fontFamily="'Share Tech Mono', monospace" fontSize="12" fontWeight="bold">
                {language === 'fr' ? 'Initialiser Matrice de Navigation' : 'Inicializar Matriz de Navegación'}
              </text>
            </g>

            {/* Bottom Right Terminal Prompt Box */}
            <g transform="translate(1320, 740)">
              <rect width="210" height="110" rx="6" fill="#01101e" stroke="#00f5ff" strokeWidth="1.5" />
              <rect width="210" height="22" rx="6" fill="#032038" />
              <text x="10" y="16" fill="#00f5ff" fontFamily="'Share Tech Mono', monospace" fontSize="10">
                {language === 'fr' ? 'LIGNE DE COMMANDES — □ X' : 'LÍNEA DE COMANDOS — □ X'}
              </text>
              <text x="12" y="44" fill="#22c55e" fontFamily="'Share Tech Mono', monospace" fontSize="11">
                MOVER()
              </text>
              <text x="12" y="62" fill="#22c55e" fontFamily="'Share Tech Mono', monospace" fontSize="11">
                ACTIVAR()
              </text>
              <text x="12" y="80" fill="#22c55e" fontFamily="'Share Tech Mono', monospace" fontSize="11">
                REPARAR()
              </text>
              <text x="12" y="98" fill="#64748b" fontFamily="'Share Tech Mono', monospace" fontSize="10">
                ...
              </text>
            </g>
          </svg>
        )}

        {/* Floating Sector Quick-Jump Overlay Nodes */}
        <div className="absolute inset-0 pointer-events-none">
          <button
            onClick={() => handleSectorClick('reactor')}
            className="absolute left-[24%] top-[65%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-orbitron text-xs flex items-center gap-1.5 shadow-lg backdrop-blur hover:scale-110 hover:bg-amber-500/40 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'fr' ? 'ALLER AU RÉACTEUR' : 'IR A REACTOR'}</span>
          </button>

          <button
            onClick={() => handleSectorClick('lab')}
            className="absolute left-[75%] top-[32%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400 text-purple-300 font-orbitron text-xs flex items-center gap-1.5 shadow-lg backdrop-blur hover:scale-110 hover:bg-purple-500/40 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{language === 'fr' ? 'ALLER AU LAB DONNÉES' : 'IR A LAB DE DATOS'}</span>
          </button>

          <button
            onClick={() => handleSectorClick('bridge')}
            className="absolute left-[26%] top-[34%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto px-3 py-1.5 rounded-full bg-cyan-500/20 border border-[#00f5ff] text-[#00f5ff] font-orbitron text-xs flex items-center gap-1.5 shadow-lg backdrop-blur hover:scale-110 hover:bg-cyan-500/40 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00f5ff]" />
            <span>{language === 'fr' ? 'ALLER À LA PASSERELLE' : 'IR A PUENTE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
