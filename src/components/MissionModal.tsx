import React, { useState, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  CheckCircle2, 
  Circle, 
  Award, 
  Lightbulb,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { Mission, GameState } from '../types/game';
import { soundFx } from '../audio/synth';
import { getCustomBackground, subscribeToCustomAssets } from '../utils/customAssets';
import { useLanguage } from '../i18n/LanguageContext';

interface MissionModalProps {
  mission: Mission;
  state: GameState;
  onClose: () => void;
  onOpenTerminal: () => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  mission: rawMission,
  state,
  onClose,
  onOpenTerminal,
}) => {
  const { t, getLocalizedMission } = useLanguage();
  const mission = getLocalizedMission(rawMission);
  const isCompleted = state.completedMissionIds.includes(mission.id);

  // Synchronous and reactive background image resolution
  const [missionBg, setMissionBg] = useState<string | null>(() => {
    return (mission.imageKey ? getCustomBackground(mission.imageKey) : null) || getCustomBackground(mission.id);
  });

  useEffect(() => {
    const update = () => {
      const bg = (mission.imageKey ? getCustomBackground(mission.imageKey) : null) || getCustomBackground(mission.id);
      setMissionBg(bg);
    };
    update();
    const unsubscribe = subscribeToCustomAssets(update);
    return () => unsubscribe();
  }, [mission.id, mission.imageKey]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020b18]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#020e1d] border border-[#00f5ff]/40 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#03172a] border-b border-[#00f5ff]/20 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-tech text-[11px] font-bold">
              {mission.difficulty}
            </span>
            <span className="text-slate-400 font-tech text-xs uppercase">
              {t.missionModal.sectorLabel}: {mission.sectorId.toUpperCase()}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-[#00f5ff] font-tech text-xs flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              +{mission.rewardXP} {t.common.xp}
            </span>
          </div>

          <button
            onClick={() => {
              soundFx.playBeep(400, 0.03);
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 min-h-0 p-5 md:p-6 overflow-y-auto space-y-4">
          {/* Tactical Mission Illustration Banner */}
          {missionBg && (
            <div className="w-full h-44 md:h-52 rounded-lg overflow-hidden border border-[#00f5ff]/30 relative shadow-lg bg-[#010914]">
              <img
                src={missionBg}
                alt={mission.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020e1d] via-transparent to-transparent opacity-85" />
              
              <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
                <div className="font-tech text-[10px] text-[#00f5ff] uppercase tracking-widest bg-black/75 px-2.5 py-1 rounded backdrop-blur-sm border border-[#00f5ff]/30 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{mission.title.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <h2 className="font-orbitron font-bold text-lg md:text-xl text-white tracking-wide">
              {mission.title}
            </h2>
            <div className="mt-1 text-xs font-tech text-[#00f5ff]">
              {t.missionModal.conceptTaught}: {mission.conceptTaught}
            </div>
          </div>

          {/* Emergency Alert Banner if in pressure mode */}
          {mission.timeLimitSeconds && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-300 font-tech text-xs">
              <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold text-red-400">{t.missionModal.countdownWarning}:</span> {mission.timeLimitSeconds}s.
              </div>
            </div>
          )}

          {/* Briefing */}
          <div className="p-3.5 bg-[#010914] border border-[#00f5ff]/20 rounded-lg">
            <div className="text-[11px] font-orbitron font-semibold text-slate-400 uppercase tracking-widest mb-1">
              {t.missionModal.instructions}
            </div>
            <p className="font-tech text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {mission.briefing}
            </p>
          </div>

          {/* Objectives & Live Status Checklist */}
          <div>
            <div className="text-xs font-orbitron font-bold text-[#00f5ff] uppercase tracking-wider mb-2">
              {t.missionModal.operationalObjectives}
            </div>
            <div className="space-y-2">
              {mission.testCases.map((tc, idx) => {
                const isPassed = tc.check(state);
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded border flex items-center justify-between font-tech text-xs transition-colors ${
                      isPassed
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                        : 'bg-[#010a17] border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span>{tc.description}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {isPassed ? `${t.hub.completedBadge} ✓` : t.common.critical}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hint */}
          <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg flex items-start gap-2.5 text-xs font-tech text-amber-200/90">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400">{t.missionModal.technicalHint}:</span> {mission.solutionHint}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#031526] border-t border-[#00f5ff]/20 px-5 py-3 flex items-center justify-between">
          <div className="text-[11px] font-tech text-slate-400">
            {isCompleted ? (
              <span className="text-emerald-400 font-bold">{t.missionModal.completedMessage} ✓</span>
            ) : (
              <span>{t.common.status}: {t.common.operational}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-700 hover:border-slate-500 text-slate-300 font-orbitron text-xs cursor-pointer transition-colors"
            >
              {t.common.close}
            </button>
            <button
              onClick={() => {
                soundFx.playCommandExecute();
                onOpenTerminal();
                onClose();
              }}
              className="px-4 py-1.5 bg-[#00f5ff] hover:bg-[#39ff14] text-slate-950 font-orbitron font-bold text-xs rounded transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,245,255,0.4)] cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{t.missionModal.openTerminalBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
