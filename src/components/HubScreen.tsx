import React from 'react';
import { Sector, SectorId, Mission, GameState } from '../types/game';
import { SOLAR_DESTINATIONS } from '../data/solarSystem';
import { 
  Zap, 
  Cpu, 
  Radar, 
  Shield, 
  Rocket, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Terminal, 
  Globe,
  Compass,
  ImageIcon,
  Sparkles,
  Thermometer,
  Wind,
  Music,
  HelpCircle
} from 'lucide-react';
import { soundFx } from '../audio/synth';
import { getCustomBackground, subscribeToCustomAssets } from '../utils/customAssets';
import { useLanguage } from '../i18n/LanguageContext';

interface HubScreenProps {
  sectors: Sector[];
  missions: Mission[];
  state: GameState;
  onEnterSector: (id: SectorId) => void;
  onSelectMission: (missionId: string) => void;
  onOpenSolarMap?: () => void;
  onOpenArchive?: (tab?: 'gallery' | 'jukebox') => void;
  onStartTutorial?: () => void;
}

export const HubScreen: React.FC<HubScreenProps> = ({
  sectors,
  missions,
  state,
  onEnterSector,
  onSelectMission,
  onOpenSolarMap,
  onOpenArchive,
  onStartTutorial,
}) => {
  const { t, getLocalizedSector, getLocalizedMission, getLocalizedDestination } = useLanguage();
  const rawDestination = SOLAR_DESTINATIONS.find(d => d.id === state.currentDestinationId) || SOLAR_DESTINATIONS[0];
  const currentDestination = getLocalizedDestination(rawDestination);
  const localizedSectors = sectors.map(getLocalizedSector);
  const localizedMissions = missions.map(getLocalizedMission);
  const locationMissions = localizedMissions.filter(m => (m.locationId || 'versalles') === state.currentDestinationId);

  const [, setAssetTick] = React.useState(0);
  React.useEffect(() => {
    return subscribeToCustomAssets(() => setAssetTick(t => t + 1));
  }, []);

  const getSectorIcon = (id: SectorId) => {
    switch (id) {
      case 'reactor':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'lab':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'bridge':
        return <Radar className="w-5 h-5 text-[#00f5ff]" />;
      case 'shields':
        return <Shield className="w-5 h-5 text-red-400" />;
      case 'drones':
        return <Rocket className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen w-full pt-18 pb-28 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Title & Hub Header */}
      <div className="text-center my-4">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f5ff]/10 border border-[#00f5ff]/40 text-[#00f5ff] text-xs font-tech">
            <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '24s' }} />
            <span>{t.hub.locationBadge}: {currentDestination.name.toUpperCase()} · {currentDestination.celestialParent}</span>
          </div>

          {onStartTutorial && (
            <button
              onClick={() => {
                soundFx.playBeep(850, 0.04);
                onStartTutorial();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#00f5ff]/15 border border-[#00f5ff]/50 hover:bg-[#00f5ff]/25 text-[#00f5ff] text-xs font-tech font-bold cursor-pointer transition-colors shadow-[0_0_15px_rgba(0,245,255,0.25)]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#00f5ff] animate-pulse" />
              <span>{t.hub.howToPlayBtn}</span>
            </button>
          )}
        </div>

        <h1 className="font-orbitron font-bold text-xl md:text-2xl tracking-widest text-white drop-shadow-[0_0_15px_rgba(0,245,255,0.4)]">
          {currentDestination.name.toUpperCase()}
        </h1>
        <p className="font-tech text-xs md:text-sm text-slate-400 mt-1 uppercase tracking-wider">
          {currentDestination.tacticalIntel}
        </p>
      </div>

      {/* Grid of Compartments for this location */}
      <div id="hub-sectors-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
        {localizedSectors.map((sec) => {
          const mission = localizedMissions.find(m => m.id === sec.activeMissionId);
          const isCompleted = mission && state.completedMissionIds.includes(mission.id);
          const missionImg = mission ? ((mission.imageKey ? getCustomBackground(mission.imageKey) : null) || getCustomBackground(mission.id)) : null;

          return (
            <div
              key={sec.id}
              onClick={() => {
                soundFx.playWarp();
                onEnterSector(sec.id);
              }}
              className="group bg-[#020e1d]/90 border border-[#00f5ff]/25 hover:border-[#00f5ff] rounded-xl p-5 shadow-lg hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
            >
              {/* Corner alert blinker if critical */}
              {sec.status === 'CRÍTICO' && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/60 text-red-400 font-tech text-[10px] animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <span>{t.common.critical}</span>
                </div>
              )}

              {sec.status === 'ADVERTENCIA' && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/60 text-amber-400 font-tech text-[10px]">
                  <span>{t.common.warning}</span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 group-hover:border-[#00f5ff]/50 transition-colors">
                    {getSectorIcon(sec.id)}
                  </div>
                  <div>
                    <span className="text-[10px] font-tech text-[#00f5ff] uppercase tracking-widest block">
                      {sec.tag}
                    </span>
                    <h2 className="font-orbitron font-bold text-sm md:text-base text-white tracking-wide group-hover:text-[#00f5ff] transition-colors">
                      {sec.name}
                    </h2>
                  </div>
                </div>

                <p className="font-tech text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {sec.description}
                </p>

                {/* Mission banner with direct trigger */}
                {mission && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playBeep(650, 0.04);
                      onSelectMission(mission.id);
                    }}
                    className={`mt-4 p-2.5 rounded border flex items-center justify-between text-xs font-tech transition-colors cursor-pointer ${
                      isCompleted 
                        ? 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-400' 
                        : 'bg-[#010915] border-slate-800 hover:border-[#00f5ff]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate mr-2">
                      {missionImg ? (
                        <img 
                          src={missionImg} 
                          alt={mission.title} 
                          className="w-9 h-9 rounded object-cover border border-[#00f5ff]/40 shrink-0" 
                        />
                      ) : isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="text-[10px] text-slate-500 block uppercase">
                          {isCompleted ? t.hub.completedBadge : t.hub.activeMissionBadge}
                        </span>
                        <span className="text-white font-semibold truncate block">
                          {mission.title}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#00f5ff] font-orbitron font-bold shrink-0 ml-2">
                      {isCompleted ? t.common.confirm : 'INICIAR →'}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-tech text-slate-500 uppercase">
                  {sec.hotspots.length} {t.common.operational}
                </span>
                <span className="font-orbitron text-xs text-[#00f5ff] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{t.hub.enterSectorBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Mission Ledger Bar */}
      <div id="hub-mission-ledger" className="mt-6 bg-[#010b17]/95 border border-[#00f5ff]/20 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <span className="font-orbitron text-xs font-bold text-[#00f5ff] tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00f5ff]" />
            {t.common.missions} // {currentDestination.name.toUpperCase()}
          </span>
          <span className="font-tech text-xs text-slate-400">
            {t.hub.completedBadge}: {locationMissions.filter(m => state.completedMissionIds.includes(m.id)).length} / {locationMissions.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {locationMissions.map(m => {
            const isDone = state.completedMissionIds.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => {
                  soundFx.playBeep(650, 0.03);
                  onSelectMission(m.id);
                }}
                className={`p-2.5 rounded border text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#010712] border-slate-800 hover:border-[#00f5ff]/40 text-slate-200'
                }`}
              >
                <div className="truncate pr-2">
                  <div className="text-[10px] font-tech text-slate-400 uppercase">
                    {m.sectorId.toUpperCase()} · {m.difficulty}
                  </div>
                  <div className="font-orbitron text-xs font-semibold truncate">
                    {m.title}
                  </div>
                </div>
                <span className="text-[10px] font-tech font-bold uppercase shrink-0">
                  {isDone ? 'RESUELTO ✓' : 'VER MISIÓN →'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Vitals Strip */}
      <div id="hub-vitals-strip" className="fixed bottom-0 left-0 right-0 h-10 bg-[#010814]/95 border-t border-[#00f5ff]/20 backdrop-blur-md px-6 flex items-center justify-between text-xs font-tech text-slate-300 z-30">
        <div className="flex items-center gap-4 md:gap-8 overflow-x-auto">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400">ENERGÍA:</span>
            <span className="font-bold text-white">{state.vitals.energy}%</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Thermometer className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-400">TEMP NÚCLEO:</span>
            <span className="font-bold text-white">{state.vitals.coreTemp}°C</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-400">ESCUDOS:</span>
            <span className="font-bold text-white">{state.vitals.shields}%</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">O₂:</span>
            <span className="font-bold text-white">{state.vitals.oxygen}%</span>
          </div>
        </div>

        <div className="hidden sm:block text-slate-500 text-[11px] truncate">
          &gt; SISTEMA: Conexión cifrada a bordo. Listo para instrucciones.
        </div>
      </div>
    </div>
  );
};
