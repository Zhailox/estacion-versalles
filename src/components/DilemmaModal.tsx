import React from 'react';
import { RadioDilemma, DilemmaChoice } from '../data/dilemmas';
import { AlertTriangle, Radio, ShieldAlert, Zap, Heart } from 'lucide-react';
import { soundFx } from '../audio/synth';
import { useLanguage } from '../i18n/LanguageContext';

interface DilemmaModalProps {
  dilemma: RadioDilemma;
  onResolve: (choice: DilemmaChoice) => void;
  onDismiss: () => void;
}

export const DilemmaModal: React.FC<DilemmaModalProps> = ({
  dilemma: rawDilemma,
  onResolve,
  onDismiss,
}) => {
  const { language, t, getLocalizedDilemma } = useLanguage();
  const dilemma = getLocalizedDilemma(rawDilemma);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#031424] border-2 border-red-500 rounded-xl shadow-[0_0_50px_rgba(239,68,68,0.35)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header Emergency Banner */}
        <div className="px-6 py-4 bg-red-950/90 border-b border-red-500/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-red-600/30 border border-red-500 text-red-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-tech text-red-400 uppercase tracking-widest font-bold">
                  {t.dilemma.banner}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-orbitron font-bold">
                  {t.dilemma.urgencyLabel}: {dilemma.urgency}
                </span>
              </div>
              <h2 className="text-base md:text-lg font-orbitron font-bold text-white tracking-wider">
                {dilemma.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Sender Info & Situation */}
        <div className="flex-1 min-h-0 p-6 space-y-5 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-tech text-xs">
            <div className="text-slate-300">
              <span className="text-[#00f5ff] font-bold">{t.dilemma.officerLabel}: </span>
              {dilemma.sender}
            </div>
            <div className="text-slate-400">
              {t.dilemma.channelLabel}: <span className="text-amber-400 font-mono">[{dilemma.callsign}]</span>
            </div>
          </div>

          <div className="bg-[#020c17] p-4 rounded-lg border border-red-500/30 text-slate-200 font-tech text-sm leading-relaxed">
            "{dilemma.situation}"
          </div>

          <div className="text-xs font-orbitron text-amber-400 uppercase tracking-wider font-bold">
            {t.dilemma.instructionPrompt}
          </div>

          {/* Choices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dilemma.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFx.playCommandExecute();
                  onResolve(choice);
                }}
                className="group relative p-4 rounded-lg bg-[#02101e] border-2 border-slate-700 hover:border-amber-400 hover:bg-[#03182b] transition-all text-left flex flex-col justify-between gap-3 shadow-md hover:shadow-[0_0_20px_rgba(251,191,36,0.25)] cursor-pointer"
              >
                <div>
                  <div className="font-orbitron font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                    {choice.text}
                  </div>
                  <p className="font-tech text-xs text-slate-400 mt-2 leading-normal">
                    {choice.description}
                  </p>
                </div>

                {/* Consequences preview chips */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800 text-[10px] font-tech">
                  {choice.consequences.energyDelta && (
                    <span className={`px-2 py-0.5 rounded ${choice.consequences.energyDelta > 0 ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
                      {t.vitals.energyNet}: {choice.consequences.energyDelta > 0 ? `+${choice.consequences.energyDelta}%` : `${choice.consequences.energyDelta}%`}
                    </span>
                  )}
                  {choice.consequences.shieldsDelta && (
                    <span className={`px-2 py-0.5 rounded ${choice.consequences.shieldsDelta > 0 ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
                      {t.vitals.deflectorShields}: {choice.consequences.shieldsDelta > 0 ? `+${choice.consequences.shieldsDelta}%` : `${choice.consequences.shieldsDelta}%`}
                    </span>
                  )}
                  {choice.consequences.oxygenDelta && (
                    <span className={`px-2 py-0.5 rounded ${choice.consequences.oxygenDelta > 0 ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
                      {t.vitals.oxygenCabins}: {choice.consequences.oxygenDelta > 0 ? `+${choice.consequences.oxygenDelta}%` : `${choice.consequences.oxygenDelta}%`}
                    </span>
                  )}
                  {choice.consequences.hullDelta && (
                    <span className={`px-2 py-0.5 rounded ${choice.consequences.hullDelta > 0 ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'}`}>
                      {t.vitals.hullIntegrity}: {choice.consequences.hullDelta > 0 ? `+${choice.consequences.hullDelta}%` : `${choice.consequences.hullDelta}%`}
                    </span>
                  )}
                  {choice.consequences.xpDelta && (
                    <span className="px-2 py-0.5 rounded bg-[#00f5ff]/20 text-[#00f5ff]">
                      +{choice.consequences.xpDelta} {t.common.xp}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#020d18] border-t border-slate-800 flex justify-end">
          <button
            onClick={onDismiss}
            className="text-xs font-tech text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            {language === 'fr' ? 'Reporter la décision (30s)' : 'Posponer decisión (30s)'}
          </button>
        </div>

      </div>
    </div>
  );
};
