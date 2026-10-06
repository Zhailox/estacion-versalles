import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wrench, 
  CheckCircle, 
  Sliders, 
  Zap, 
  Shield, 
  Compass, 
  Bot, 
  RotateCcw, 
  Activity, 
  AlertTriangle,
  Play,
  Target
} from 'lucide-react';
import { SectorId, GameState } from '../types/game';
import { soundFx } from '../audio/synth';
import { useLanguage } from '../i18n/LanguageContext';

interface DiagnosticConsoleModalProps {
  sectorId: SectorId;
  state: GameState;
  onClose: () => void;
  onSuccess: (sectorId: SectorId, xpReward: number) => void;
}

export const DiagnosticConsoleModal: React.FC<DiagnosticConsoleModalProps> = ({
  sectorId,
  state,
  onClose,
  onSuccess,
}) => {
  const { language, t } = useLanguage();
  // Puzzle states
  // 1. Reactor puzzle
  const [magField, setMagField] = useState(65);
  const [coolant, setCoolant] = useState(40);
  const [coilFreq, setCoilFreq] = useState(30);

  // 2. Lab puzzle
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(1);
  const [inputC, setInputC] = useState(0);
  const [gate1, setGate1] = useState<'AND' | 'OR' | 'XOR'>('OR');
  const [gate2, setGate2] = useState<'AND' | 'OR' | 'NOT'>('AND');

  // 3. Bridge puzzle (RCS Thrusters)
  const [thruster0, setThruster0] = useState(10);
  const [thruster1, setThruster1] = useState(45);
  const [thruster2, setThruster2] = useState(15);
  const [thruster3, setThruster3] = useState(30);

  // 4. Shields puzzle
  const [waveFreq, setWaveFreq] = useState(320);
  const [phaseShift, setPhaseShift] = useState(90);
  const [harmonicDamping, setHarmonicDamping] = useState(50);

  // 5. Drone puzzle
  const [droneCommands, setDroneCommands] = useState<string[]>([]);
  const [droneStep, setDroneStep] = useState(0);
  const [isSimulatingDrone, setIsSimulatingDrone] = useState(false);
  const [droneGridState, setDroneGridState] = useState<{ x: number; y: number; dir: number }>({ x: 0, y: 4, dir: 0 }); // 0: up, 1: right, 2: down, 3: left

  const [isSolved, setIsSolved] = useState(false);

  // Check solve conditions
  useEffect(() => {
    if (isSolved) return;

    if (sectorId === 'reactor') {
      // Mag field between 88 and 96, coolant between 68 and 80, freq between 48 and 54
      if (magField >= 88 && magField <= 96 && coolant >= 68 && coolant <= 80 && coilFreq >= 48 && coilFreq <= 54) {
        handleTriggerSolved(65);
      }
    } else if (sectorId === 'lab') {
      // Compute output:
      // Gate 1: (A [gate1] B)
      let g1Out = 0;
      if (gate1 === 'AND') g1Out = inputA && inputB ? 1 : 0;
      if (gate1 === 'OR') g1Out = inputA || inputB ? 1 : 0;
      if (gate1 === 'XOR') g1Out = inputA !== inputB ? 1 : 0;

      // Gate 2: (g1Out [gate2] C)
      let finalOut = 0;
      if (gate2 === 'AND') finalOut = g1Out && inputC ? 1 : 0;
      if (gate2 === 'OR') finalOut = g1Out || inputC ? 1 : 0;
      if (gate2 === 'NOT') finalOut = g1Out ? 0 : 1;

      // Target condition: inputA must be 1, inputB must be 1, finalOut must be 1 with gate2 === 'AND'
      if (inputA === 1 && inputB === 1 && inputC === 1 && gate1 === 'AND' && gate2 === 'AND' && finalOut === 1) {
        handleTriggerSolved(60);
      }
    } else if (sectorId === 'bridge') {
      // Balanced RCS thrusters: all 4 should be 25% +- 2
      if (
        Math.abs(thruster0 - 25) <= 2 &&
        Math.abs(thruster1 - 25) <= 2 &&
        Math.abs(thruster2 - 25) <= 2 &&
        Math.abs(thruster3 - 25) <= 2
      ) {
        handleTriggerSolved(70);
      }
    } else if (sectorId === 'shields') {
      // Freq 432 +- 10, Phase 180 +- 8, Damping 75 +- 5
      if (
        Math.abs(waveFreq - 432) <= 10 &&
        Math.abs(phaseShift - 180) <= 8 &&
        Math.abs(harmonicDamping - 75) <= 5
      ) {
        handleTriggerSolved(65);
      }
    }
  }, [magField, coolant, coilFreq, inputA, inputB, inputC, gate1, gate2, thruster0, thruster1, thruster2, thruster3, waveFreq, phaseShift, harmonicDamping, sectorId, isSolved]);

  const handleTriggerSolved = (xp: number) => {
    setIsSolved(true);
    soundFx.playSuccess();
    setTimeout(() => {
      onSuccess(sectorId, xp);
    }, 1800);
  };

  // Drone simulation step runner
  const runDroneSimulation = () => {
    if (droneCommands.length === 0 || isSimulatingDrone) return;
    setIsSimulatingDrone(true);
    let curX = 0;
    let curY = 4;
    let curDir = 0; // 0: up, 1: right, 2: down, 3: left
    let index = 0;

    const interval = setInterval(() => {
      if (index >= droneCommands.length) {
        clearInterval(interval);
        setIsSimulatingDrone(false);
        // Check if reached target at (3, 1) and docked
        if (curX === 3 && curY === 1) {
          handleTriggerSolved(75);
        } else {
          soundFx.playError();
        }
        return;
      }

      const cmd = droneCommands[index];
      if (cmd === 'AVANZAR') {
        if (curDir === 0 && curY > 0) curY--;
        else if (curDir === 1 && curX < 4) curX++;
        else if (curDir === 2 && curY < 4) curY++;
        else if (curDir === 3 && curX > 0) curX--;
      } else if (cmd === 'GIRAR_IZQ') {
        curDir = (curDir + 3) % 4;
      } else if (cmd === 'GIRAR_DER') {
        curDir = (curDir + 1) % 4;
      }

      setDroneGridState({ x: curX, y: curY, dir: curDir });
      setDroneStep(index + 1);
      soundFx.playBeep(900, 0.04);
      index++;
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#031526] border-2 border-[#00f5ff]/60 rounded-xl shadow-[0_0_40px_rgba(0,245,255,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#00f5ff]/30 bg-[#020d18]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Wrench className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-tech text-amber-400 uppercase tracking-widest">{t.diagnostic.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/80 border border-red-500 text-red-400 font-tech font-bold animate-pulse">
                  {isSolved ? `✓ ${t.hub.completedBadge}` : `! ${t.common.critical}`}
                </span>
              </div>
              <h2 className="text-lg font-orbitron font-bold text-white tracking-wider">
                {sectorId === 'reactor' && (language === 'fr' ? 'Synchroniseur de Plasma et Confinement Magnétique' : 'Sincronizador de Plasma y Confinamiento Magnético')}
                {sectorId === 'lab' && (language === 'fr' ? 'Matrice de Portes Logiques et Purge de Malware' : 'Matriz de Compuertas Lógicas y Purga de Malware')}
                {sectorId === 'bridge' && (language === 'fr' ? 'Calibreur de Vecteurs et Propulseurs RCS' : 'Calibrador de Vectores y Propulsores RCS')}
                {sectorId === 'shields' && (language === 'fr' ? 'Modulateur de Résonance et Phase Hexagonale' : 'Modulador de Resonancia y Fase Hexagonal')}
                {sectorId === 'drones' && (language === 'fr' ? 'Routeur de Navigation de Drones Autonomes' : 'Enrutador de Navegación de Drones Autónomos')}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-[#00f5ff] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Active Minigame */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Header Instruction Banner */}
          <div className="bg-[#021120] border border-[#00f5ff]/30 p-4 rounded-lg flex items-center justify-between text-xs font-tech">
            <div className="text-slate-300">
              <span className="text-[#00f5ff] font-bold">OBJETIVO TÁCTICO: </span>
              {sectorId === 'reactor' && 'Calibra el campo magnético (88-96%), flujo criogénico (68-80%) y frecuencia toroidal (~50Hz) para contener la fuga de plasma.'}
              {sectorId === 'lab' && 'Configura los interruptores de bit y las compuertas lógicas (AND, OR, XOR) para enviar una señal limpia 1 a la compuerta final.'}
              {sectorId === 'bridge' && 'Equilibra los cuatro propulsores RCS a 25% de potencia cada uno para anular el desvío de cabeceo y guiñada.'}
              {sectorId === 'shields' && 'Sintoniza la frecuencia a 432 Hz y la fase a 180° con 75% de amortiguación para alinear la barrera hexagonal.'}
              {sectorId === 'drones' && 'Programa la secuencia de ruta para que el dron llegue al respiradero dañado (coordenada roja) y vuelva a la estación.'}
            </div>
          </div>

          {/* 1. REACTOR TOKAMAK MINIGAME */}
          {sectorId === 'reactor' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4 bg-[#020e1a] p-4 rounded-lg border border-[#00f5ff]/20">
                <div className="flex justify-between items-center text-xs font-tech">
                  <span className="text-amber-400">CAMPO MAGNÉTICO</span>
                  <span className={`font-bold ${magField >= 88 && magField <= 96 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {magField}% {magField >= 88 && magField <= 96 ? '✓ NOMINAL' : '(OBJETIVO: 90%)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={magField}
                  onChange={(e) => {
                    setMagField(Number(e.target.value));
                    soundFx.playBeep(400 + Number(e.target.value) * 6, 0.02);
                  }}
                  className="w-full accent-[#00f5ff] cursor-pointer"
                />
                <div className="text-[10px] text-slate-400 font-tech">
                  Las bobinas superconductoras requieren contención por encima del 88% para evitar microfisuras térmicas.
                </div>
              </div>

              <div className="space-y-4 bg-[#020e1a] p-4 rounded-lg border border-[#00f5ff]/20">
                <div className="flex justify-between items-center text-xs font-tech">
                  <span className="text-[#00f5ff]">BOMBAS CRIOGÉNICAS</span>
                  <span className={`font-bold ${coolant >= 68 && coolant <= 80 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {coolant}% {coolant >= 68 && coolant <= 80 ? '✓ NOMINAL' : '(OBJETIVO: 74%)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={coolant}
                  onChange={(e) => {
                    setCoolant(Number(e.target.value));
                    soundFx.playBeep(600 + Number(e.target.value) * 5, 0.02);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400 font-tech">
                  Regula el helio líquido hacia las camisas de enfriamiento del Tokamak.
                </div>
              </div>

              <div className="space-y-4 bg-[#020e1a] p-4 rounded-lg border border-[#00f5ff]/20">
                <div className="flex justify-between items-center text-xs font-tech">
                  <span className="text-purple-400">FRECUENCIA TOROIDAL</span>
                  <span className={`font-bold ${coilFreq >= 48 && coilFreq <= 54 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {coilFreq} Hz {coilFreq >= 48 && coilFreq <= 54 ? '✓ RESONANCIA' : '(OBJETIVO: 50Hz)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={coilFreq}
                  onChange={(e) => {
                    setCoilFreq(Number(e.target.value));
                    soundFx.playBeep(300 + Number(e.target.value) * 8, 0.02);
                  }}
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400 font-tech">
                  Frecuencia de pulso del plasma en el anillo de contención.
                </div>
              </div>
            </div>
          )}

          {/* 2. LAB LOGIC GATES MINIGAME */}
          {sectorId === 'lab' && (
            <div className="bg-[#020e1a] p-6 rounded-lg border border-[#00f5ff]/30 space-y-6">
              <div className="flex items-center justify-between text-xs font-tech border-b border-slate-800 pb-3">
                <span className="text-slate-400">PUZLE: REPARAR PUERTA LÓGICA PRINCIPAL</span>
                <span className="text-amber-400">SALIDA OBJETIVO: 1 (ACTIVO / HIGH)</span>
              </div>

              {/* Interactive Circuit Canvas Visual */}
              <div className="flex flex-wrap items-center justify-center gap-6 py-4">
                {/* Inputs A & B */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      setInputA(inputA === 1 ? 0 : 1);
                      soundFx.playBeep(700, 0.04);
                    }}
                    className={`px-4 py-2 rounded font-orbitron text-xs font-bold border transition-all cursor-pointer ${
                      inputA === 1 ? 'bg-emerald-950 border-emerald-400 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    ENTRADA A: [{inputA}]
                  </button>

                  <button
                    onClick={() => {
                      setInputB(inputB === 1 ? 0 : 1);
                      soundFx.playBeep(700, 0.04);
                    }}
                    className={`px-4 py-2 rounded font-orbitron text-xs font-bold border transition-all cursor-pointer ${
                      inputB === 1 ? 'bg-emerald-950 border-emerald-400 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    ENTRADA B: [{inputB}]
                  </button>
                </div>

                <div className="text-slate-500 text-xl font-mono">➔</div>

                {/* Gate 1 Selector */}
                <div className="flex flex-col items-center gap-2 bg-[#031526] p-3 rounded-lg border border-[#00f5ff]/40">
                  <span className="text-[10px] font-tech text-slate-400">COMPUERTA 1</span>
                  <div className="flex gap-1.5">
                    {(['AND', 'OR', 'XOR'] as const).map(g => (
                      <button
                        key={g}
                        onClick={() => {
                          setGate1(g);
                          soundFx.playBeep(850, 0.04);
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-orbitron font-bold border cursor-pointer ${
                          gate1 === g ? 'bg-[#00f5ff]/20 border-[#00f5ff] text-[#00f5ff]' : 'border-slate-800 text-slate-400'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-slate-500 text-xl font-mono">➔</div>

                {/* Input C & Gate 2 */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      setInputC(inputC === 1 ? 0 : 1);
                      soundFx.playBeep(700, 0.04);
                    }}
                    className={`px-4 py-2 rounded font-orbitron text-xs font-bold border transition-all cursor-pointer ${
                      inputC === 1 ? 'bg-emerald-950 border-emerald-400 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    ENTRADA C: [{inputC}]
                  </button>
                </div>

                <div className="text-slate-500 text-xl font-mono">➔</div>

                {/* Gate 2 Selector */}
                <div className="flex flex-col items-center gap-2 bg-[#031526] p-3 rounded-lg border border-[#00f5ff]/40">
                  <span className="text-[10px] font-tech text-slate-400">COMPUERTA FINAL</span>
                  <div className="flex gap-1.5">
                    {(['AND', 'OR', 'NOT'] as const).map(g => (
                      <button
                        key={g}
                        onClick={() => {
                          setGate2(g);
                          soundFx.playBeep(950, 0.04);
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-orbitron font-bold border cursor-pointer ${
                          gate2 === g ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'border-slate-800 text-slate-400'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. BRIDGE RCS THRUSTER MINIGAME */}
          {sectorId === 'bridge' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Radar Reticle */}
              <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-[#020b18] border-2 border-[#00f5ff]/40 rounded-full flex items-center justify-center overflow-hidden shadow-[inset_0_0_30px_rgba(0,245,255,0.15)]">
                {/* Concentric rings */}
                <div className="absolute inset-4 rounded-full border border-[#00f5ff]/20" />
                <div className="absolute inset-12 rounded-full border border-[#00f5ff]/20" />
                <div className="absolute inset-20 rounded-full border border-[#00f5ff]/20" />
                <div className="absolute w-full h-[1px] bg-[#00f5ff]/30" />
                <div className="absolute h-full w-[1px] bg-[#00f5ff]/30" />

                {/* Drifting crosshair based on thruster imbalance */}
                <div 
                  className="absolute w-6 h-6 border-2 border-red-500 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    transform: `translate(${(thruster1 - thruster3) * 2}px, ${(thruster0 - thruster2) * 2}px)`
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                </div>

                <div className="absolute bottom-3 text-[10px] font-tech text-[#00f5ff]">
                  DESVÍO ORBITAL: {Math.abs(thruster1 - thruster3) + Math.abs(thruster0 - thruster2)}°
                </div>
              </div>

              {/* 4 Thrusters sliders */}
              <div className="space-y-3 bg-[#020e1a] p-4 rounded-lg border border-[#00f5ff]/20 text-xs font-tech">
                <div>
                  <div className="flex justify-between text-slate-300">
                    <span>PROPULSOR RCS 0 (PROA)</span>
                    <span className={thruster0 === 25 ? 'text-emerald-400 font-bold' : ''}>{thruster0}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={thruster0}
                    onChange={(e) => setThruster0(Number(e.target.value))}
                    className="w-full accent-[#00f5ff] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300">
                    <span>PROPULSOR RCS 1 (ESTRIBOR)</span>
                    <span className={thruster1 === 25 ? 'text-emerald-400 font-bold' : ''}>{thruster1}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={thruster1}
                    onChange={(e) => setThruster1(Number(e.target.value))}
                    className="w-full accent-[#00f5ff] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300">
                    <span>PROPULSOR RCS 2 (POPA)</span>
                    <span className={thruster2 === 25 ? 'text-emerald-400 font-bold' : ''}>{thruster2}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={thruster2}
                    onChange={(e) => setThruster2(Number(e.target.value))}
                    className="w-full accent-[#00f5ff] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300">
                    <span>PROPULSOR RCS 3 (BABOR)</span>
                    <span className={thruster3 === 25 ? 'text-emerald-400 font-bold' : ''}>{thruster3}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={thruster3}
                    onChange={(e) => setThruster3(Number(e.target.value))}
                    className="w-full accent-[#00f5ff] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. SHIELDS RESONANCE MINIGAME */}
          {sectorId === 'shields' && (
            <div className="space-y-6">
              {/* Wave Display */}
              <div className="bg-[#020b18] p-4 rounded-lg border border-[#00f5ff]/30 h-32 flex items-center justify-center relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 100">
                  {/* Target wave (Cyan) */}
                  <path
                    d={`M 0 50 Q 50 15, 100 50 T 200 50 T 300 50 T 400 50`}
                    fill="none"
                    stroke="#00f5ff"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    strokeDasharray="4 4"
                  />
                  {/* User modulated wave (Amber or Green if matched) */}
                  <path
                    d={`M 0 50 Q ${50 + (waveFreq - 432) / 4} ${50 - (harmonicDamping / 2) * Math.sin(phaseShift * Math.PI / 180)}, 100 50 T 200 50 T 300 50 T 400 50`}
                    fill="none"
                    stroke={Math.abs(waveFreq - 432) <= 15 ? '#34d399' : '#f59e0b'}
                    strokeWidth="3"
                  />
                </svg>
                <div className="absolute top-2 right-3 text-[10px] font-tech text-slate-400">
                  RESONANCIA BARRERA: {Math.max(10, 100 - Math.abs(waveFreq - 432) - Math.abs(phaseShift - 180))}%
                </div>
              </div>

              {/* Modulators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-tech">
                <div className="bg-[#020e1a] p-3 rounded border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">FRECUENCIA PORTADORA</span>
                    <span className="text-[#00f5ff]">{waveFreq} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="550"
                    value={waveFreq}
                    onChange={(e) => setWaveFreq(Number(e.target.value))}
                    className="w-full accent-[#00f5ff] cursor-pointer"
                  />
                </div>

                <div className="bg-[#020e1a] p-3 rounded border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">DESFASE (GRADOS)</span>
                    <span className="text-amber-400">{phaseShift}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={phaseShift}
                    onChange={(e) => setPhaseShift(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="bg-[#020e1a] p-3 rounded border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">AMORTIGUACIÓN</span>
                    <span className="text-purple-400">{harmonicDamping}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={harmonicDamping}
                    onChange={(e) => setHarmonicDamping(Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. DRONES ROUTE SEQUENCER MINIGAME */}
          {sectorId === 'drones' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* 5x5 Grid representation */}
              <div className="bg-[#020b18] p-3 rounded-lg border border-[#00f5ff]/30 grid grid-cols-5 gap-1.5 aspect-square max-w-[280px] mx-auto">
                {Array.from({ length: 25 }).map((_, i) => {
                  const x = i % 5;
                  const y = Math.floor(i / 5);
                  const isDroneHere = droneGridState.x === x && droneGridState.y === y;
                  const isTarget = x === 3 && y === 1;
                  const isObstacle = (x === 1 && y === 2) || (x === 2 && y === 2);

                  return (
                    <div
                      key={i}
                      className={`relative rounded border flex items-center justify-center text-[10px] font-mono ${
                        isDroneHere
                          ? 'bg-[#00f5ff]/30 border-[#00f5ff] text-[#00f5ff] font-bold shadow-[0_0_12px_#00f5ff]'
                          : isTarget
                          ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
                          : isObstacle
                          ? 'bg-amber-950/50 border-amber-600 text-amber-500'
                          : 'bg-[#010914] border-slate-800 text-slate-600'
                      }`}
                    >
                      {isDroneHere ? (
                        <Bot className="w-5 h-5 text-[#00f5ff]" />
                      ) : isTarget ? (
                        <Target className="w-5 h-5 text-red-400" />
                      ) : isObstacle ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Route Command Sequencer */}
              <div className="space-y-4 bg-[#020e1a] p-4 rounded-lg border border-[#00f5ff]/20">
                <div className="flex justify-between items-center text-xs font-tech">
                  <span className="text-slate-300">SECUENCIA DE PASOS:</span>
                  <button
                    onClick={() => {
                      setDroneCommands([]);
                      setDroneGridState({ x: 0, y: 4, dir: 0 });
                    }}
                    className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>REINICIAR</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-[#010812] rounded border border-slate-800">
                  {droneCommands.length === 0 && (
                    <span className="text-slate-600 text-[11px] font-tech italic">Añade comandos abajo...</span>
                  )}
                  {droneCommands.map((cmd, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded text-[10px] font-orbitron border ${
                        idx + 1 === droneStep ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      {cmd}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={droneCommands.length >= 8 || isSimulatingDrone}
                    onClick={() => {
                      setDroneCommands([...droneCommands, 'AVANZAR']);
                      soundFx.playBeep(800, 0.03);
                    }}
                    className="px-3 py-1.5 rounded bg-slate-900 border border-[#00f5ff]/50 hover:bg-[#00f5ff]/20 text-xs font-orbitron text-[#00f5ff] cursor-pointer"
                  >
                    + AVANZAR
                  </button>

                  <button
                    disabled={droneCommands.length >= 8 || isSimulatingDrone}
                    onClick={() => {
                      setDroneCommands([...droneCommands, 'GIRAR_IZQ']);
                      soundFx.playBeep(700, 0.03);
                    }}
                    className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-orbitron text-slate-300 cursor-pointer"
                  >
                    ↺ GIRAR IZQ
                  </button>

                  <button
                    disabled={droneCommands.length >= 8 || isSimulatingDrone}
                    onClick={() => {
                      setDroneCommands([...droneCommands, 'GIRAR_DER']);
                      soundFx.playBeep(700, 0.03);
                    }}
                    className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-orbitron text-slate-300 cursor-pointer"
                  >
                    ↻ GIRAR DER
                  </button>
                </div>

                <button
                  disabled={droneCommands.length === 0 || isSimulatingDrone}
                  onClick={runDroneSimulation}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-orbitron font-bold text-xs rounded transition-all shadow-[0_0_15px_rgba(52,211,153,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isSimulatingDrone ? 'EJECUTANDO TELEMETRÍA...' : 'INICIAR RUTA AUTÓNOMA'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Solved Banner */}
          {isSolved && (
            <div className="bg-emerald-950/90 border-2 border-emerald-400 p-4 rounded-lg flex items-center gap-3 animate-in zoom-in-95 duration-300 shadow-[0_0_25px_rgba(52,211,153,0.5)]">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="font-orbitron font-bold text-emerald-300 text-sm">
                  {t.diagnostic.calibratedMsg}
                </div>
                <div className="font-tech text-xs text-emerald-200">
                  {t.diagnostic.successReward}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#00f5ff]/20 bg-[#020d18]/90 flex items-center justify-between text-xs font-tech text-slate-400">
          <span>HARDWARE BUS: CONECTADO [DIAGNÓSTICO INTERACTIVO]</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer font-orbitron"
          >
            {t.common.close}
          </button>
        </div>

      </div>
    </div>
  );
};
