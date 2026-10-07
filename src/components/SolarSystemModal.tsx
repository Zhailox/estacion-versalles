import React, { useState, useEffect } from 'react';
import { 
  X, 
  Globe, 
  Rocket, 
  ShieldAlert, 
  Radio, 
  Zap, 
  Compass, 
  ChevronRight,
  Sparkles,
  Navigation
} from 'lucide-react';
import { SOLAR_DESTINATIONS, SolarDestination, DestinationId } from '../data/solarSystem';
import { MISSIONS } from '../data/missions';
import { GameState, SectorId } from '../types/game';
import { soundFx } from '../audio/synth';
import { getCustomBackground, subscribeToCustomAssets } from '../utils/customAssets';
import { useLanguage } from '../i18n/LanguageContext';

interface SolarSystemModalProps {
  currentDestinationId: DestinationId;
  gameState: GameState;
  onWarpToDestination: (destination: SolarDestination) => void;
  onClose: () => void;
}

export const SolarSystemModal: React.FC<SolarSystemModalProps> = ({
  currentDestinationId,
  gameState,
  onWarpToDestination,
  onClose,
}) => {
  const { language, t, getLocalizedDestination, getLocalizedMission } = useLanguage();
  const [selectedDestId, setSelectedDestId] = useState<DestinationId>(currentDestinationId);
  const [customBg, setCustomBg] = useState<string | null>(getCustomBackground('solar_system'));
  const [isWarping, setIsWarping] = useState(false);

  useEffect(() => {
    return subscribeToCustomAssets(() => {
      setCustomBg(getCustomBackground('solar_system'));
    });
  }, []);

  const rawSelectedDest = SOLAR_DESTINATIONS.find(d => d.id === selectedDestId) || SOLAR_DESTINATIONS[0];
  const selectedDest = getLocalizedDestination(rawSelectedDest);
  const isCurrentLocation = selectedDest.id === currentDestinationId;
  const hasEnoughEnergy = gameState.vitals.energy >= selectedDest.travelEnergyCost;

  const handleInitiateWarp = () => {
    if (isCurrentLocation || !hasEnoughEnergy || isWarping) return;
    
    setIsWarping(true);
    soundFx.playBeep(300, 0.4);
    setTimeout(() => {
      soundFx.playSuccess();
      onWarpToDestination(selectedDest);
    }, 1400);
  };

  const getThreatColor = (level: SolarDestination['threatLevel']) => {
    switch (level) {
      case 'NOMINAL': return 'text-emerald-400 border-emerald-500 bg-emerald-950/60';
      case 'PRECAUCIÓN': return 'text-amber-400 border-amber-500 bg-amber-950/60';
      case 'CRÍTICO': return 'text-red-400 border-red-500 bg-red-950/60';
      case 'ZONA DE COMBATE': return 'text-purple-400 border-purple-500 bg-purple-950/60';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
      
      {/* Hyperspace Warp Jump Effect Overlay */}
      {isWarping && (
        <div className="absolute inset-0 z-50 bg-[#00f5ff]/20 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-300">
          <div className="relative flex flex-col items-center gap-4">
            <span className="w-16 h-16 rounded-full border-4 border-t-[#00f5ff] border-r-purple-500 border-b-transparent border-l-transparent animate-spin" />
            <h1 className="font-orbitron text-2xl md:text-3xl text-white font-extrabold tracking-widest animate-pulse">
              {t.solar.traveling}
            </h1>
            <p className="font-tech text-cyan-300 text-sm tracking-wider uppercase">
              {selectedDest.name.toUpperCase()}
            </p>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-6xl h-[90vh] bg-[#020d18] border-2 border-[#00f5ff]/60 rounded-xl shadow-[0_0_50px_rgba(0,245,255,0.3)] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#00f5ff]/30 bg-[#031526]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/40">
              <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '24s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-tech text-[#00f5ff] uppercase tracking-widest font-bold">
                  {t.solar.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-400 font-tech">
                  SECTOR: SOL-3
                </span>
              </div>
              <h2 className="text-base md:text-lg font-orbitron font-bold text-white tracking-wider">
                {t.common.solarSystem}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Energy Reserve Display */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-[#020b18] border border-amber-500/40 text-xs font-tech">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">COMBUSTIBLE WARP:</span>
              <span className="text-amber-300 font-bold">{gameState.vitals.energy}%</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-[#00f5ff] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Left Interactive Map + Right Tactical Dossier */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          
          {/* LEFT: Solar System Holographic Canvas */}
          <div className="relative flex-1 bg-[#010814] overflow-hidden flex items-center justify-center select-none border-b lg:border-b-0 lg:border-r border-[#00f5ff]/20">
            
            {/* Custom Background if user dropped one */}
            {customBg ? (
              <img
                src={customBg}
                alt="Mapa del Sistema Solar"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
              />
            ) : null}

            {/* Grid & Star Dust Layer */}
            <div className="absolute inset-0 bg-[radial-gradient(#00f5ff_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

            {/* Tactical Interactive SVG Solar System Map */}
            <svg 
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 650"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Center Sun with glowing Corona flare */}
              <defs>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff7ed" />
                  <stop offset="30%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#d97706" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heliosGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#be123c" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Sun Flare */}
              <circle cx="120" cy="325" r="75" fill="url(#sunGlow)" />
              <circle cx="120" cy="325" r="32" fill="#fbbf24" stroke="#fef08a" strokeWidth="2" />
              <text x="120" y="380" fill="#fef08a" fontSize="11" fontFamily="Orbitron, sans-serif" textAnchor="middle" fontWeight="bold">
                SOL
              </text>

              {/* Planetary Orbital Ellipses */}
              {/* Mercury / Venus orbit */}
              <ellipse cx="120" cy="325" rx="110" ry="85" fill="none" stroke="#00f5ff" strokeWidth="1" strokeDasharray="3 4" strokeOpacity="0.25" />
              <ellipse cx="120" cy="325" rx="170" ry="130" fill="none" stroke="#00f5ff" strokeWidth="1" strokeDasharray="3 4" strokeOpacity="0.25" />

              {/* Earth Orbit (with Versalles Station) */}
              <ellipse cx="120" cy="325" rx="260" ry="200" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.45" />

              {/* Mars Orbit */}
              <ellipse cx="120" cy="325" rx="350" ry="260" fill="none" stroke="#00f5ff" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.25" />

              {/* Asteroid Belt Arc (Hyperion-9 location) */}
              <ellipse cx="120" cy="325" rx="480" ry="340" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="2 12" strokeOpacity="0.4" />
              <text x="560" y="80" fill="#ca8a04" fontSize="10" fontFamily="Orbitron, sans-serif" opacity="0.8">
                CINTURÓN DE ASTEROIDES DE KUIPER INTERIOR
              </text>

              {/* Jupiter & Saturn Outpost Orbits */}
              <ellipse cx="120" cy="325" rx="630" ry="420" fill="none" stroke="#00f5ff" strokeWidth="1" strokeDasharray="4 6" strokeOpacity="0.3" />
              <ellipse cx="120" cy="325" rx="760" ry="490" fill="none" stroke="#00f5ff" strokeWidth="1.2" strokeDasharray="6 6" strokeOpacity="0.35" />

              {/* Celestial Graphic: Earth & Luna */}
              <g transform="translate(380, 325)">
                <circle cx="0" cy="0" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="24" cy="-12" r="4" fill="#94a3b8" />
                <text x="0" y="28" fill="#38bdf8" fontSize="11" fontFamily="Orbitron, sans-serif" textAnchor="middle">
                  TIERRA
                </text>
              </g>

              {/* Celestial Graphic: Mars */}
              <g transform="translate(470, 220)">
                <circle cx="0" cy="0" r="10" fill="#dc2626" stroke="#f87171" strokeWidth="1.5" />
                <text x="0" y="20" fill="#f87171" fontSize="10" fontFamily="Orbitron, sans-serif" textAnchor="middle">
                  MARTE
                </text>
              </g>

              {/* Celestial Graphic: Saturn with Rings */}
              <g transform="translate(790, 440)">
                <ellipse cx="0" cy="0" rx="36" ry="10" fill="none" stroke="#d97706" strokeWidth="3" transform="rotate(-25)" opacity="0.8" />
                <circle cx="0" cy="0" r="18" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="0" y="32" fill="#fbbf24" fontSize="11" fontFamily="Orbitron, sans-serif" textAnchor="middle">
                  SATURNO
                </text>
              </g>
            </svg>

            {/* INTERACTIVE DESTINATION MARKERS (Clickable) */}
            <div className="absolute inset-0 pointer-events-auto">
              {SOLAR_DESTINATIONS.map((dest) => {
                const isSelected = dest.id === selectedDestId;
                const isCurrent = dest.id === currentDestinationId;

                return (
                  <button
                    key={dest.id}
                    onClick={() => {
                      setSelectedDestId(dest.id);
                      soundFx.playBeep(750, 0.04);
                    }}
                    style={{ left: `${dest.coordinates.x}%`, top: `${dest.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-300 cursor-pointer ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    {/* Pulsing Target Beacon */}
                    <div className="relative flex flex-col items-center">
                      {/* Radar reticle rings */}
                      <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-[#00f5ff] bg-[#00f5ff]/20 shadow-[0_0_20px_#00f5ff]' 
                          : 'border-slate-600 bg-slate-900/80 group-hover:border-slate-400'
                      }`}>
                        {isCurrent ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        ) : (
                          <Rocket className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00f5ff]' : 'text-slate-400'}`} />
                        )}
                      </span>

                      {/* Station Label Chip */}
                      <div className={`mt-1 px-2.5 py-1 rounded border text-[11px] font-orbitron font-bold tracking-wider backdrop-blur-md transition-all whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#031726]/95 border-[#00f5ff] text-[#00f5ff] shadow-[0_0_15px_rgba(0,245,255,0.4)]'
                          : 'bg-[#020b18]/85 border-slate-700 text-slate-300 group-hover:border-slate-500'
                      }`}>
                        {dest.name}
                        {isCurrent && (
                          <span className="ml-1.5 text-[9px] text-emerald-400 font-tech font-bold">(ACTUAL)</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Map Helper overlay */}
            <div className="absolute bottom-4 left-4 z-10 bg-[#020d18]/90 border border-[#00f5ff]/30 px-3 py-1.5 rounded text-[11px] font-tech text-slate-400 backdrop-blur-md">
              <span>SELECCIONA UN CUERPO CELESTE O ESTACIÓN PARA VER TELEMETRÍA</span>
            </div>

          </div>

          {/* RIGHT: Tactical Destination Dossier */}
          <div className="w-full lg:w-[380px] bg-[#020d18]/95 p-6 flex flex-col justify-between overflow-y-auto space-y-6 min-h-0">
            
            <div className="space-y-4">
              
              {/* Dossier Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-tech text-slate-400 uppercase tracking-widest">
                    EXPEDIENTE TÁCTICO · {selectedDest.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-orbitron font-bold border ${getThreatColor(selectedDest.threatLevel)}`}>
                    {selectedDest.threatLevel}
                  </span>
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mt-1">
                  {selectedDest.name}
                </h3>
                <div className="text-xs font-tech text-cyan-400 mt-0.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Órbita: {selectedDest.celestialParent}</span>
                </div>
              </div>

              {/* Destination Image Preview Banner */}
              <div className="w-full h-36 rounded-lg overflow-hidden border border-[#00f5ff]/30 relative my-2">
                <img 
                  src={getCustomBackground(selectedDest.id) || '/assets/hyperion.jpg'} 
                  alt={selectedDest.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020d18] via-transparent to-transparent opacity-85" />
                <div className="absolute bottom-2 left-3 font-tech text-[10px] text-[#00f5ff] uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded border border-[#00f5ff]/30">
                  INSTALACIÓN: {selectedDest.name}
                </div>
              </div>

              {/* Status / Distance Card */}
              <div className="grid grid-cols-2 gap-2 text-xs font-tech bg-[#010814] p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">DISTANCIA APROX</span>
                  <span className="text-slate-200 font-bold font-mono">
                    {selectedDest.distanceAU === 0 ? '0.00 UA (Órbita Actual)' : `${selectedDest.distanceAU} UA`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">COSTE ENERGÍA WARP</span>
                  <span className={`font-bold font-mono ${hasEnoughEnergy ? 'text-amber-400' : 'text-red-400'}`}>
                    {selectedDest.travelEnergyCost}% ENERGÍA
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="text-[11px] font-orbitron text-slate-300 font-bold uppercase tracking-wider">
                  DESCRIPCIÓN DE LA INSTALACIÓN:
                </span>
                <p className="text-xs font-tech text-slate-300 leading-relaxed bg-[#010814]/60 p-3 rounded border border-slate-800/80">
                  {selectedDest.description}
                </p>
              </div>

              {/* Tactical Intel */}
              <div className="space-y-2">
                <span className="text-[11px] font-orbitron text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{t.solar.tacticalReport}:</span>
                </span>
                <p className="text-xs font-tech text-amber-200/90 leading-relaxed bg-amber-950/20 p-3 rounded border border-amber-500/30">
                  {selectedDest.tacticalIntel}
                </p>
              </div>

              {/* Available Subsystems */}
              <div>
                <span className="text-[11px] font-orbitron text-slate-300 font-bold uppercase tracking-wider">
                  {t.solar.availableSectors}:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedDest.availableSectors.map(sec => (
                    <span 
                      key={sec}
                      className="px-2 py-0.5 rounded text-[10px] font-tech bg-slate-900 border border-[#00f5ff]/30 text-cyan-300 uppercase"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Destination Assigned Missions */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-orbitron text-[#00f5ff] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.common.missions}:</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-tech">
                    {MISSIONS.filter(m => (m.locationId || 'versalles') === selectedDest.id).length} {t.common.missions}
                  </span>
                </div>
                <div className="space-y-1.5 mt-2">
                  {MISSIONS.filter(m => (m.locationId || 'versalles') === selectedDest.id).map(rawM => {
                    const m = getLocalizedMission(rawM);
                    const isDone = gameState.completedMissionIds.includes(m.id);
                    return (
                      <div 
                        key={m.id}
                        className={`p-2 rounded text-xs font-tech border flex items-center justify-between ${
                          isDone 
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                            : 'bg-slate-900/80 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <span className="text-[10px] text-amber-400 uppercase font-bold block">{m.difficulty} · {m.sectorId.toUpperCase()}</span>
                          <span className="font-semibold truncate block">{m.title}</span>
                        </div>
                        <span className={`text-[10px] uppercase font-tech shrink-0 font-bold px-1.5 py-0.5 rounded ${isDone ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                          {isDone ? `${t.hub.completedBadge} ✓` : (language === 'fr' ? 'DISPONIBLE' : 'DISPONIBLE')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Travel / Warp Action Button */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              {isCurrentLocation ? (
                <div className="w-full py-3 bg-emerald-950/60 border border-emerald-500 text-emerald-400 text-center font-orbitron text-xs font-bold rounded">
                  ✓ {t.solar.currentLocation}
                </div>
              ) : (
                <button
                  disabled={!hasEnoughEnergy || isWarping}
                  onClick={handleInitiateWarp}
                  className={`w-full py-3 rounded-lg font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                    hasEnoughEnergy
                      ? 'bg-gradient-to-r from-[#00f5ff] to-cyan-500 hover:from-cyan-400 hover:to-[#00f5ff] text-slate-950 shadow-[0_0_20px_rgba(0,245,255,0.5)]'
                      : 'bg-red-950/80 border border-red-500 text-red-300 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>
                    {hasEnoughEnergy 
                      ? `${t.solar.warpBtn}: ${selectedDest.name.toUpperCase()}`
                      : t.solar.notEnoughEnergy}
                  </span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
