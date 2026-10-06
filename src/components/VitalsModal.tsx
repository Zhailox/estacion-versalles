import React from 'react';
import { X, Activity, Zap, Thermometer, Shield, Wind, Radio, Anchor, Cpu } from 'lucide-react';
import { GameState } from '../types/game';
import { soundFx } from '../audio/synth';
import { useLanguage } from '../i18n/LanguageContext';

interface VitalsModalProps {
  state: GameState;
  onClose: () => void;
}

export const VitalsModal: React.FC<VitalsModalProps> = ({ state, onClose }) => {
  const { language, t } = useLanguage();
  const { vitals, reactorState } = state;

  return (
    <div className="fixed inset-0 z-50 bg-[#020b18]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#020e1d] border border-[#00f5ff]/40 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#03172a] border-b border-[#00f5ff]/20 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00f5ff]" />
            <h2 className="font-orbitron font-bold text-sm md:text-base text-[#00f5ff] tracking-wider">
              {t.vitals.title}
            </h2>
          </div>
          <button
            onClick={() => {
              soundFx.playBeep(400, 0.03);
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Energy */}
            <div className="p-3.5 rounded-lg bg-[#010a17] border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-tech text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Zap className="w-4 h-4" />
                  {t.vitals.energyNet}
                </span>
                <span className="font-bold text-white">{vitals.energy}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{ width: `${vitals.energy}%` }}
                />
              </div>
              <span className="text-[10px] font-tech text-slate-500 uppercase">
                {vitals.energy >= 70 ? t.vitals.nominalState : (language === 'fr' ? 'ALIMENTATION RÉDUITE' : 'SUMINISTRO REDUCIDO')}
              </span>
            </div>

            {/* Core Temp */}
            <div className="p-3.5 rounded-lg bg-[#010a17] border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-tech text-slate-400">
                <span className="flex items-center gap-1.5 text-red-400">
                  <Thermometer className="w-4 h-4" />
                  {t.vitals.coreTemp}
                </span>
                <span className="font-bold text-white">{vitals.coreTemp}°C</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    vitals.coreTemp > 14500 ? 'bg-red-500' : 'bg-[#00f5ff]'
                  }`}
                  style={{ width: `${Math.min(100, (vitals.coreTemp / 16000) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-tech text-slate-500 uppercase">
                {vitals.coreTemp > 14500 ? (language === 'fr' ? 'ALERTE SURCHAUFFE' : 'ALERTA SOBRECALENTAMIENTO') : (language === 'fr' ? 'TEMPÉRATURE STABLE' : 'TEMPERATURA ESTABLE')}
              </span>
            </div>

            {/* Magnetic Field */}
            <div className="p-3.5 rounded-lg bg-[#010a17] border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-tech text-slate-400">
                <span className="flex items-center gap-1.5 text-[#00f5ff]">
                  <Anchor className="w-4 h-4" />
                  {t.vitals.magneticField}
                </span>
                <span className="font-bold text-white">{reactorState.magneticField}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    reactorState.magneticField >= 88 ? 'bg-emerald-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${reactorState.magneticField}%` }}
                />
              </div>
              <span className="text-[10px] font-tech text-slate-500 uppercase">
                {reactorState.magneticField >= 88 ? (language === 'fr' ? 'CONFINEMENT OPTIMAL' : 'CONFINAMIENTO ÓPTIMO') : (language === 'fr' ? 'INSUFFISANT (<88%)' : 'INSUFICIENTE (<88%)')}
              </span>
            </div>

            {/* Shields */}
            <div className="p-3.5 rounded-lg bg-[#010a17] border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-tech text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Shield className="w-4 h-4" />
                  {t.vitals.deflectorShields}
                </span>
                <span className="font-bold text-white">{vitals.shields}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                <div
                  className="bg-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${vitals.shields}%` }}
                />
              </div>
              <span className="text-[10px] font-tech text-slate-500 uppercase">
                {vitals.shields >= 80 ? (language === 'fr' ? 'DÉFENSE ACTIVE' : 'DEFENSA ACTIVA') : (language === 'fr' ? 'ATTÉNUATION SÉVÈRE' : 'ATENUACIÓN SEVERA')}
              </span>
            </div>

            {/* Oxygen */}
            <div className="p-3.5 rounded-lg bg-[#010a17] border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-tech text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Wind className="w-4 h-4" />
                  {t.vitals.oxygenCabins}
                </span>
                <span className="font-bold text-white">{vitals.oxygen}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${vitals.oxygen}%` }}
                />
              </div>
              <span className="text-[10px] font-tech text-slate-500 uppercase">
                {vitals.oxygen >= 90 ? (language === 'fr' ? 'ATMOSPHÈRE NOMINALE' : 'ATMÓSFERA NOMINAL') : (language === 'fr' ? 'DÉPRESSURISATION' : 'DESPRESURIZACIÓN')}
              </span>
            </div>

            {/* Comms */}
            <div className="p-3.5 rounded-lg bg-[#010a17] border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-tech text-slate-400">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <Radio className="w-4 h-4" />
                  {t.vitals.commsBand}
                </span>
                <span className="font-bold text-white">{vitals.comms}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                <div
                  className="bg-purple-400 h-full transition-all duration-500"
                  style={{ width: `${vitals.comms}%` }}
                />
              </div>
              <span className="text-[10px] font-tech text-slate-500 uppercase">
                {language === 'fr' ? 'LIAISON TERRE : ACTIVE' : 'ENLACE TIERRA: ACTIVO'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
