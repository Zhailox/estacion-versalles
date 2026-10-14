import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Zap,
  CheckCircle2,
  User,
  Radio,
  Terminal as TerminalIcon,
  Wrench,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { GameState } from '../types/game';
import { CREW_MEMBERS } from '../data/crew';
import { useLanguage } from '../i18n/LanguageContext';
import {
  IMMERSIVE_TUTORIAL_STEPS,
  playTutorialAdvanceSound,
} from '../utils/gameTutorial';
import { soundFx } from '../audio/synth';

export type TutorialAutoAction =
  | 'enter_reactor'
  | 'open_mission_00'
  | 'open_terminal'
  | 'run_cat_boot_log'
  | 'switch_to_script_tab'
  | 'run_boot_script'
  | 'open_diagnostic';

interface ImmersiveTutorialOverlayProps {
  isActive: boolean;
  stepIndex: number;
  state: GameState;
  isMissionModalOpen: boolean;
  isTerminalOpen: boolean;
  terminalActiveTab: 'cli' | 'script' | 'blocks';
  onStepChange: (nextStep: number) => void;
  onAutoAction: (action: TutorialAutoAction) => void;
  onCompleteTutorial: () => void;
  onSkipTutorial: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const ImmersiveTutorialOverlay: React.FC<ImmersiveTutorialOverlayProps> = ({
  isActive,
  stepIndex,
  state,
  isMissionModalOpen,
  isTerminalOpen,
  terminalActiveTab,
  onStepChange,
  onAutoAction,
  onCompleteTutorial,
  onSkipTutorial,
}) => {
  const { language, getLocalizedCrew } = useLanguage();
  const localizedCrew = getLocalizedCrew(CREW_MEMBERS);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const currentStep = IMMERSIVE_TUTORIAL_STEPS[stepIndex] || IMMERSIVE_TUTORIAL_STEPS[0];
  const totalSteps = IMMERSIVE_TUTORIAL_STEPS.length;
  const crewMember = localizedCrew[currentStep.speaker] || localizedCrew.pina;
  const isFr = language === 'fr';

  // Track target DOM element bounding box dynamically
  useEffect(() => {
    if (!isActive) return;

    const updateRect = () => {
      if (!currentStep.targetSelector) {
        setTargetRect(null);
        return;
      }
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });
          return;
        }
      }
      setTargetRect(null);
    };

    updateRect();
    const interval = setInterval(updateRect, 180);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isActive, stepIndex, currentStep.targetSelector, state.currentScreen, isMissionModalOpen, isTerminalOpen, terminalActiveTab]);

  // Reactive step auto-progression when the player performs the required in-game action
  useEffect(() => {
    if (!isActive) return;

    const stepId = currentStep.id;

    if (stepId === 'step-4-enter-reactor') {
      if (state.currentScreen === 'sector' && state.currentSectorId === 'reactor') {
        playTutorialAdvanceSound();
        onStepChange(stepIndex + 1);
      }
    } else if (stepId === 'step-5-open-mission') {
      if (isMissionModalOpen || isTerminalOpen) {
        playTutorialAdvanceSound();
        onStepChange(isTerminalOpen ? stepIndex + 2 : stepIndex + 1);
      }
    } else if (stepId === 'step-6-mission-briefing') {
      if (isTerminalOpen) {
        playTutorialAdvanceSound();
        onStepChange(stepIndex + 1);
      }
    } else if (stepId === 'step-7-cli-cat') {
      if (state.tutorialState?.logInspected) {
        soundFx.playSuccess();
        onStepChange(stepIndex + 1);
      }
    } else if (stepId === 'step-8-switch-script') {
      if (terminalActiveTab === 'script' || terminalActiveTab === 'blocks') {
        playTutorialAdvanceSound();
        onStepChange(stepIndex + 1);
      }
    } else if (stepId === 'step-9-run-script') {
      if (state.tutorialState?.relaySynced || state.completedMissionIds.includes('m-tutorial-boot')) {
        soundFx.playSuccess();
        onStepChange(stepIndex + 1);
      }
    }
  }, [
    isActive,
    currentStep.id,
    stepIndex,
    state.currentScreen,
    state.currentSectorId,
    state.tutorialState?.logInspected,
    state.tutorialState?.relaySynced,
    state.completedMissionIds,
    isMissionModalOpen,
    isTerminalOpen,
    terminalActiveTab,
    onStepChange,
  ]);

  if (!isActive) return null;

  const handleAutoPerform = () => {
    soundFx.playCommandExecute();
    switch (currentStep.id) {
      case 'step-4-enter-reactor':
        onAutoAction('enter_reactor');
        break;
      case 'step-5-open-mission':
        onAutoAction('open_mission_00');
        break;
      case 'step-6-mission-briefing':
        onAutoAction('open_terminal');
        break;
      case 'step-7-cli-cat':
        onAutoAction('run_cat_boot_log');
        break;
      case 'step-8-switch-script':
        onAutoAction('switch_to_script_tab');
        break;
      case 'step-9-run-script':
        onAutoAction('run_boot_script');
        break;
      default:
        break;
    }
  };

  // Determine card dock positioning classes
  const getDockPositionClasses = () => {
    if (currentStep.dockPosition === 'center') {
      return 'inset-0 flex items-center justify-center bg-[#020b18]/75 backdrop-blur-sm pointer-events-auto p-4';
    }
    if (currentStep.dockPosition === 'top-right') {
      return 'top-20 right-4 md:right-8 pointer-events-auto';
    }
    if (currentStep.dockPosition === 'top-left') {
      return 'top-20 left-4 md:left-8 pointer-events-auto';
    }
    if (currentStep.dockPosition === 'bottom-left') {
      return 'bottom-14 left-4 md:left-8 pointer-events-auto';
    }
    return 'bottom-14 right-4 md:right-8 pointer-events-auto';
  };

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none overflow-hidden select-none">
      {/* Spotlight Target Highlight Ring (Click-through enabled) */}
      {targetRect && (
        <div
          style={{
            top: Math.max(4, targetRect.top - 6),
            left: Math.max(4, targetRect.left - 6),
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
          className="fixed z-[91] pointer-events-none rounded-xl border-2 border-[#00f5ff] shadow-[0_0_0_9999px_rgba(2,11,24,0.55),0_0_30px_rgba(0,245,255,0.85),inset_0_0_20px_rgba(0,245,255,0.35)] transition-all duration-300 ease-out"
        >
          {/* Corner Brackets */}
          <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400" />

          {/* Pulsing Target Tag */}
          <div className="absolute -top-7 left-2 px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-orbitron font-black text-[10px] tracking-wider uppercase shadow-[0_0_15px_rgba(251,191,36,0.8)] flex items-center gap-1 animate-bounce">
            <Zap className="w-3 h-3 fill-current" />
            <span>
              {currentStep.isReactive
                ? isFr
                  ? 'INTERAGIR ICI'
                  : 'INTERACTÚA AQUÍ'
                : isFr
                ? 'OBJECTIF HUD'
                : 'ELEMENTO DESTACADO'}
            </span>
          </div>
        </div>
      )}

      {/* Holographic Crew Tutorial Card */}
      <div className={`fixed z-[95] ${getDockPositionClasses()}`}>
        <div
          className={`bg-[#021020]/96 border-2 border-[#00f5ff]/75 rounded-2xl shadow-[0_0_45px_rgba(0,245,255,0.35),0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-all duration-300 ${
            currentStep.dockPosition === 'center'
              ? 'max-w-xl w-full p-6'
              : isMinimized
              ? 'w-72 p-3'
              : 'w-[92vw] sm:w-[430px] p-4 md:p-5'
          }`}
        >
          {/* Top Phase & Controls Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-[#00f5ff]/25 pb-2.5 mb-3">
            <div className="flex items-center gap-2 truncate">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="font-orbitron font-bold text-[10px] text-[#00f5ff] tracking-widest uppercase truncate">
                {currentStep.phaseTitle[language]}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-[#00f5ff]/15 border border-[#00f5ff]/40 font-tech text-[10px] text-[#00f5ff] font-bold">
                {stepIndex + 1} / {totalSteps}
              </span>

              {currentStep.dockPosition !== 'center' && (
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Expandir guía' : 'Minimizar guía'}
                  className="p-1 rounded text-slate-400 hover:text-[#00f5ff] hover:bg-white/5 cursor-pointer transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
              )}

              <button
                onClick={() => {
                  soundFx.playBeep(450, 0.04);
                  onSkipTutorial();
                }}
                title={isFr ? 'Quitter le tutoriel' : 'Saltar entrenamiento'}
                className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-3 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-[#00f5ff] via-emerald-400 to-amber-400 transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* Crew Speaker Header */}
          <div className="flex items-center gap-3 mb-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 shadow-inner"
              style={{
                color: crewMember.avatarColor,
                borderColor: `${crewMember.avatarColor}60`,
                backgroundColor: `${crewMember.avatarColor}18`,
              }}
            >
              <User className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-orbitron font-bold uppercase tracking-wider"
                  style={{ color: crewMember.avatarColor }}
                >
                  {crewMember.rank}
                </span>
                <span className="text-[10px] font-tech text-slate-400">
                  [{currentStep.callsign}]
                </span>
              </div>
              <div className="font-orbitron font-bold text-xs md:text-sm text-white truncate flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#00f5ff] animate-pulse shrink-0" />
                <span>{crewMember.name}</span>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Step Title */}
              <h3 className="font-orbitron font-extrabold text-xs md:text-sm text-[#00f5ff] tracking-wide uppercase mb-1.5">
                {currentStep.title[language]}
              </h3>

              {/* Narrative Dialogue */}
              <p className="font-tech text-xs text-slate-200 leading-relaxed mb-3 bg-[#010914]/90 border border-slate-800/90 rounded-lg p-3">
                "{currentStep.dialogue[language]}"
              </p>

              {/* Action Objective Box */}
              <div
                className={`p-3 rounded-lg border mb-3 font-tech text-xs leading-snug ${
                  currentStep.isReactive
                    ? 'bg-amber-950/35 border-amber-400/60 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                    : 'bg-[#03192e]/70 border-[#00f5ff]/35 text-cyan-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Sparkles
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      currentStep.isReactive ? 'text-amber-400 animate-spin' : 'text-[#00f5ff]'
                    }`}
                    style={{ animationDuration: '6s' }}
                  />
                  <div className="flex-1">
                    <span className="font-semibold block">{currentStep.actionPrompt[language]}</span>
                    {currentStep.codeHint && (
                      <code className="mt-1.5 block bg-black/70 border border-emerald-500/40 rounded px-2.5 py-1.5 text-emerald-400 font-mono text-[11px] whitespace-pre-wrap select-all">
                        {currentStep.codeHint}
                      </code>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {/* Left: Previous / Skip */}
                <div className="flex items-center gap-1.5">
                  {stepIndex > 0 && (
                    <button
                      onClick={() => {
                        soundFx.playBeep(550, 0.04);
                        onStepChange(stepIndex - 1);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-orbitron font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>{isFr ? 'Préc.' : 'Ant.'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      soundFx.playBeep(450, 0.04);
                      onSkipTutorial();
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-tech text-[11px] cursor-pointer transition-colors"
                  >
                    {isFr ? 'Passer le tutoriel' : 'Saltar tutorial'}
                  </button>
                </div>

                {/* Right: Auto-Perform / Next / Finish */}
                <div className="flex items-center gap-2">
                  {currentStep.id === 'step-10-hardware-diagnostic' && (
                    <button
                      onClick={() => {
                        soundFx.playBeep(850, 0.05);
                        onAutoAction('open_diagnostic');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-300 font-orbitron font-bold text-[10px] flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>{isFr ? 'Tester Console' : 'Probar Consola'}</span>
                    </button>
                  )}

                  {currentStep.isReactive && (
                    <button
                      onClick={handleAutoPerform}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-orbitron font-black text-[10px] tracking-wider uppercase shadow-[0_0_15px_rgba(251,191,36,0.5)] flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                      title={
                        isFr
                          ? 'Exécuter automatiquement cette étape'
                          : 'Realizar esta acción automáticamente por mí'
                      }
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      <span>{isFr ? 'Le faire pour moi ⚡' : 'Hacerlo por mí ⚡'}</span>
                    </button>
                  )}

                  {stepIndex < totalSteps - 1 ? (
                    <button
                      onClick={() => {
                        playTutorialAdvanceSound();
                        onStepChange(stepIndex + 1);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg font-orbitron font-bold text-[11px] tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                        currentStep.isReactive
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'
                          : 'bg-[#00f5ff] hover:bg-[#3effff] text-slate-950 shadow-[0_0_15px_rgba(0,245,255,0.5)]'
                      }`}
                    >
                      <span>{isFr ? 'Suivant' : 'Siguiente'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundFx.playSuccess();
                        onCompleteTutorial();
                      }}
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-[#00f5ff] hover:from-emerald-300 hover:to-[#3effff] text-slate-950 font-orbitron font-black text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(52,211,153,0.6)] flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isFr ? 'COMMENCER L\'AVENTURE !' : '¡COMENZAR AVENTURA!'}</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
