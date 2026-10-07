import React, { useState } from 'react';
import { X, MapPin, Zap, Cpu, Shield, Radar, Rocket, ArrowRight, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { Sector, SectorId, GameState } from '../types/game';
import { SOLAR_DESTINATIONS } from '../data/solarSystem';
import { soundFx } from '../audio/synth';
import { InteractiveBlueprintMap } from './InteractiveBlueprintMap';
import { useLanguage } from '../i18n/LanguageContext';

interface MapModalProps {
  sectors: Sector[];
  currentSectorId: SectorId;
  gameState: GameState;
  onSelectSector: (id: SectorId) => void;
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({
  sectors: rawSectors,
  currentSectorId,
  gameState,
  onSelectSector,
  onClose,
}) => {
  const { language, t, getLocalizedDestination, getLocalizedSector } = useLanguage();
  const [activeTab, setActiveTab] = useState<'blueprint' | 'list'>('blueprint');
  const rawDest = SOLAR_DESTINATIONS.find(d => d.id === gameState.currentDestinationId) || SOLAR_DESTINATIONS[0];
  const currentDest = getLocalizedDestination(rawDest);
  const sectors = rawSectors.map(getLocalizedSector);

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
    <div className="fixed inset-0 z-50 bg-[#020b18]/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="bg-[#020e1d] border border-[#00f5ff]/40 rounded-xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.95)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#03172a] border-b border-[#00f5ff]/20 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#00f5ff]" />
            <h2 className="font-orbitron font-bold text-sm md:text-base text-[#00f5ff] tracking-wider">
              {language === 'fr' ? 'DISTRIBUTION INTÉRIEURE' : 'DISTRIBUCIÓN INTERIOR'} — {currentDest.name.toUpperCase()}
            </h2>

            {/* View Mode Tabs */}
            <div className="hidden sm:flex items-center gap-1 bg-[#010912] p-1 rounded border border-[#00f5ff]/20 ml-4">
              <button
                onClick={() => {
                  soundFx.playBeep(600, 0.03);
                  setActiveTab('blueprint');
                }}
                className={`px-3 py-1 rounded text-xs font-tech flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'blueprint'
                    ? 'bg-[#00f5ff] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'PLAN SCHÉMATIQUE' : 'PLANO ESQUEMÁTICO'}</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playBeep(600, 0.03);
                  setActiveTab('list');
                }}
                className={`px-3 py-1 rounded text-xs font-tech flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'list'
                    ? 'bg-[#00f5ff] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'LISTE DES SECTEURS' : 'LISTA DE SECTORES'}</span>
              </button>
            </div>
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

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5">
          {activeTab === 'blueprint' ? (
            <InteractiveBlueprintMap
              currentSectorId={currentSectorId}
              state={gameState}
              onSelectSector={onSelectSector}
              onClose={onClose}
            />
          ) : (
            <div className="space-y-4">
              <p className="font-tech text-xs text-slate-300">
                {language === 'fr'
                  ? 'Sélectionnez un compartiment pour transférer votre console de terminal immédiatement.'
                  : 'Selecciona un compartimento para transferir tu consola operativa de terminal inmediatamente.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sectors.map((sec) => {
                  const isCurrent = sec.id === currentSectorId;
                  const localizedStatus = sec.status === 'CRÍTICO' 
                    ? t.common.critical 
                    : sec.status === 'ADVERTENCIA' 
                    ? t.common.warning 
                    : t.common.nominal;

                  return (
                    <div
                      key={sec.id}
                      className={`p-4 rounded-lg border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-[#031d33] border-[#00f5ff] shadow-[0_0_20px_rgba(0,245,255,0.25)]'
                          : 'bg-[#010a17] border-slate-800 hover:border-[#00f5ff]/50 hover:bg-[#021326]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getSectorIcon(sec.id)}
                            <span className="font-orbitron text-xs md:text-sm font-bold text-white tracking-wide">
                              {sec.name}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded border ${
                              sec.status === 'CRÍTICO'
                                ? 'bg-red-950/60 border-red-500/60 text-red-400'
                                : sec.status === 'ADVERTENCIA'
                                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
                                : 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400'
                            }`}
                          >
                            {localizedStatus}
                          </span>
                        </div>

                        <p className="font-tech text-xs text-slate-400 leading-relaxed mb-4">
                          {sec.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <span className="text-[10px] font-tech text-slate-500 uppercase">
                          {isCurrent
                            ? (language === 'fr' ? 'LOCALISATION ACTUELLE' : 'UBICACIÓN ACTUAL')
                            : `TAG: ${sec.tag}`}
                        </span>

                        <button
                          onClick={() => {
                            soundFx.playWarp();
                            onSelectSector(sec.id);
                            onClose();
                          }}
                          className={`px-3 py-1 text-xs font-orbitron font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-[#00f5ff] text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-200 hover:bg-[#00f5ff] hover:text-slate-950'
                          }`}
                        >
                          <span>
                            {isCurrent
                              ? (language === 'fr' ? 'OPÉRER ICI' : 'OPERAR AQUÍ')
                              : (language === 'fr' ? 'VOYAGER' : 'VIAJAR')}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
