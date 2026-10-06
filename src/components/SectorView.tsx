import React from 'react';
import { 
  Play, 
  Terminal as TerminalIcon, 
  Cpu, 
  Shield, 
  Zap, 
  AlertTriangle, 
  Wrench, 
  Radar, 
  Info,
  Maximize2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Sector, Hotspot, GameState, SectorId } from '../types/game';
import { MISSIONS } from '../data/missions';
import { soundFx } from '../audio/synth';
import { SectorBackdrop } from './SectorBackdrop';
import { useLanguage } from '../i18n/LanguageContext';

interface SectorViewProps {
  sector: Sector;
  state: GameState;
  onOpenMission: (missionId: string) => void;
  onOpenTerminal: () => void;
  onShowInfo: (title: string, text: string) => void;
  onOpenDiagnostic: (sectorId: SectorId) => void;
}

export const SectorView: React.FC<SectorViewProps> = ({
  sector: rawSector,
  state,
  onOpenMission,
  onOpenTerminal,
  onShowInfo,
  onOpenDiagnostic,
}) => {
  const { t, getLocalizedSector, getLocalizedMission } = useLanguage();
  const sector = getLocalizedSector(rawSector);
  const activeMissionId = sector.activeMissionId;
  const rawMission = activeMissionId ? MISSIONS.find(m => m.id === activeMissionId) : null;
  const activeMission = rawMission ? getLocalizedMission(rawMission) : null;
  const isRepaired = state.repairedSectors[sector.id];
  const isMissionCompleted = activeMissionId ? state.completedMissionIds.includes(activeMissionId) : false;

  const renderHotspotIcon = (icon: Hotspot['icon']) => {
    switch (icon) {
      case 'monitor':
        return <Maximize2 className="w-4 h-4 text-amber-400" />;
      case 'terminal':
        return <TerminalIcon className="w-4 h-4 text-emerald-400" />;
      case 'cpu':
        return <Cpu className="w-4 h-4 text-[#00f5ff]" />;
      case 'zap':
        return <Zap className="w-4 h-4 text-amber-300" />;
      case 'shield':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'radar':
        return <Radar className="w-4 h-4 text-cyan-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-300" />;
    }
  };

  const handleHotspotClick = (hs: Hotspot) => {
    soundFx.playBeep(650, 0.05);
    if (hs.action === 'open_mission' && activeMissionId) {
      onOpenMission(activeMissionId);
    } else if (hs.action === 'open_terminal') {
      onOpenTerminal();
    } else {
      onShowInfo(hs.title, hs.infoText || hs.subtitle);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] mt-16 overflow-hidden bg-[#020b18] select-none">
      {/* Background artwork */}
      <SectorBackdrop sectorId={sector.id} state={state} />

      {/* Ambient Red Alert Emergency Strobes on the server racks if critical */}
      {(sector.status === 'CRÍTICO' || state.vitals.activeThreatLevel !== 'NOMINAL') && (
        <div className="absolute top-14 left-10 md:left-24 flex items-center gap-2 pointer-events-none z-10">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_15px_#ff0000]" />
        </div>
      )}

      {/* TOP CONTROL BAR (Sector Tag + Hardware Diagnostic + Terminal) */}
      <div className="absolute top-4 left-4 right-4 md:left-8 md:right-8 z-30 flex items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Sector Badge */}
        <div className="bg-[#031526]/90 border border-[#00f5ff]/30 px-4 py-2 rounded-lg text-xs md:text-sm font-orbitron tracking-wider text-white flex items-center gap-2.5 shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
          <span className="font-bold text-[#00f5ff]">{sector.name.toUpperCase()}</span>
          <span className="text-slate-400 font-tech text-xs hidden sm:inline">· {sector.tag}</span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Hardware Diagnostic Console button */}
          <button
            onClick={() => {
              soundFx.playBeep(850, 0.05);
              onOpenDiagnostic(sector.id);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-orbitron font-semibold tracking-wider flex items-center gap-2 shadow-lg backdrop-blur-md transition-all cursor-pointer hover:scale-105 ${
              isRepaired
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-pulse'
            }`}
            title={t.sector.diagnosticConsole}
          >
            <Wrench className={`w-3.5 h-3.5 ${isRepaired ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>{isRepaired ? `${t.sector.diagnosticConsole}: ${t.common.nominal}` : t.sector.diagnosticConsole}</span>
          </button>

          {/* Direct Terminal button */}
          <button
            onClick={() => {
              soundFx.playCommandExecute();
              onOpenTerminal();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#00f5ff]/20 hover:bg-[#00f5ff]/30 border border-[#00f5ff]/40 text-[#00f5ff] text-xs font-orbitron font-bold tracking-wider flex items-center gap-2 shadow-lg backdrop-blur-md transition-all cursor-pointer hover:scale-105"
            title={t.sector.terminalBtn}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.sector.terminalBtn}</span>
          </button>
        </div>
      </div>

      {/* Interactive Hotspot Nodes across the Sector */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {sector.hotspots.map((hs) => {
          const isMissionConsole = hs.action === 'open_mission';
          return (
            <button
              key={hs.id}
              onClick={() => handleHotspotClick(hs)}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 flex flex-col items-center cursor-pointer ${
                isMissionConsole ? 'scale-105 z-30' : 'hover:scale-110'
              }`}
            >
              {/* Visual Button Frame */}
              <div
                className={`relative px-3.5 py-2.5 rounded-lg border flex flex-col items-center gap-0.5 backdrop-blur-md transition-all ${
                  isMissionConsole
                    ? 'bg-[#031726]/90 border-amber-400 shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.7)] hover:border-amber-300'
                    : 'bg-[#020d1a]/85 border-[#00f5ff]/30 shadow-[0_0_12px_rgba(0,245,255,0.2)] hover:border-[#00f5ff] hover:bg-[#00f5ff]/15'
                }`}
              >
                {/* Ping Beacon for Mission Console */}
                {isMissionConsole && !isMissionCompleted && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                  </span>
                )}

                <div className="p-0.5 rounded">{renderHotspotIcon(hs.icon)}</div>

                <span
                  className={`font-orbitron text-[10px] font-bold tracking-wider ${
                    isMissionConsole ? 'text-amber-300' : 'text-[#00f5ff]'
                  }`}
                >
                  {hs.title}
                </span>

                <span className="text-[9px] font-tech text-slate-300 uppercase">
                  {hs.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* UNIFIED DOCKED BOTTOM HUD (Zero Collisions) */}
      <div className="absolute bottom-4 left-4 right-4 md:left-8 md:right-8 z-30 pointer-events-auto">
        <div className="bg-[#031324]/90 border border-[#00f5ff]/30 rounded-xl px-5 py-3 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          {/* Left: Mission details */}
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>

            <div>
              <div className="text-[10px] font-tech text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span>{t.hub.activeMissionBadge}:</span>
                <span className="text-cyan-400 font-bold">{sector.name.toUpperCase()}</span>
                {isMissionCompleted && (
                  <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {t.hub.completedBadge}
                  </span>
                )}
              </div>
              <div className="text-xs md:text-sm font-orbitron font-semibold text-white tracking-wide mt-0.5">
                {activeMission ? activeMission.title : t.sector.completedStatus}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            {activeMission && (
              <button
                onClick={() => {
                  soundFx.playCommandExecute();
                  onOpenMission(activeMission.id);
                }}
                className={`px-4 py-2 text-slate-950 font-orbitron font-bold text-xs rounded-lg transition-all shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                  isMissionCompleted
                    ? 'bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                }`}
              >
                <span>{isMissionCompleted ? t.common.confirm : t.sector.stabilizeBtn}</span>
                <Play className="w-3 h-3 fill-current" />
              </button>
            )}

            <button
              onClick={() => {
                soundFx.playCommandExecute();
                onOpenTerminal();
              }}
              className="px-4 py-2 bg-[#00f5ff] hover:bg-[#3effff] text-slate-950 font-orbitron font-bold text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(0,245,255,0.4)] flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>{t.common.openTerminal}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
