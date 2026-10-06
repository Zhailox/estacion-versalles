import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { GameState, SectorId, TerminalLine, Mission } from './types/game';
import { SECTORS, getSectorsForLocation } from './data/sectors';
import { MISSIONS } from './data/missions';
import { HeaderHUD } from './components/HeaderHUD';
import { IntroScreen } from './components/IntroScreen';
import { HubScreen } from './components/HubScreen';
import { SectorView } from './components/SectorView';
import { Terminal } from './components/Terminal';
import { MissionModal } from './components/MissionModal';
import { MapModal } from './components/MapModal';
import { VitalsModal } from './components/VitalsModal';
import { HandbookModal } from './components/HandbookModal';
import { InfoModal } from './components/InfoModal';
import { RadioChatter } from './components/RadioChatter';
import { DiagnosticConsoleModal } from './components/DiagnosticConsoleModal';
import { DilemmaModal } from './components/DilemmaModal';
import { SolarSystemModal } from './components/SolarSystemModal';
import { SOLAR_DESTINATIONS, SolarDestination } from './data/solarSystem';
import { STATION_DILEMMAS, RadioDilemma, DilemmaChoice } from './data/dilemmas';
import { STATION_EMERGENCIES } from './utils/emergencySystem';
import { executeCommandOrScript } from './utils/interpreter';
import { createInitialVFS, writeFile } from './utils/vfs';
import { SupportedLanguage } from './utils/multiLanguageEngine';
import { soundFx } from './audio/synth';
import { musicEngine } from './audio/musicEngine';
import { MultimediaArchiveModal } from './components/MultimediaArchiveModal';
import { useLanguage } from './i18n/LanguageContext';

const INITIAL_STATE: GameState = {
  currentScreen: 'intro',
  currentDestinationId: 'versalles',
  currentSectorId: 'reactor',
  activeMissionId: 'm0-solar-collectors',
  completedMissionIds: [],
  vitals: {
    energy: 24, // Crisis solar activa: reservas al 24%
    coreTemp: 15432,
    magneticField: 83,
    shields: 55,
    oxygen: 88,
    comms: 85,
    hullIntegrity: 94,
    cpuLoad: 88,
    activeThreatLevel: 'CRÍTICO',
  },
  xp: 0,
  cadetRank: 'Cadete de Sistemas',
  missionTime: 0,
  pressureTimer: 180,
  pressureTimerMax: 180,
  isTimerRunning: true,
  soundEnabled: true,
  crtEffect: false,
  radioMessage: null,
  repairedSectors: {
    reactor: false,
    lab: false,
    bridge: false,
    shields: false,
    drones: false,
  },
  survivalMode: false,
  activeEmergencyId: null,
  currentDirectory: '/sys/power',
  vfs: createInitialVFS(),
  editorFile: '/sys/power/calibrate_solar.py',
  editorLanguage: 'python',
  solarPanelsState: {
    alignedCount: 0,
    targetAngle: 47.5,
    angles: [12.0, 15.3, 8.4, 22.1, 10.0, 18.7, 5.2, 14.9],
  },
  carbonFiltersState: {
    co2Level: 94.2,
    purgedFilters: [],
    recirculationActive: false,
  },
  reactorState: {
    magneticField: 83,
    stabilizerActive: false,
    coolantPumps: 2,
    plasmaOscillation: 12.0,
  },
  labState: {
    andGateRepaired: false,
    secondaryNavOnline: false,
    logicTruthTableOk: false,
    quarantineIsolated: false,
  },
  bridgeState: {
    thrustersCalibrated: [60, 45, 80, 50],
    orbitalDecayRate: 1.4,
    trajectorySafe: false,
  },
  shieldState: {
    firewallRulesActive: false,
    malwarePacketsBlocked: 0,
    intrusionSuppressed: false,
  },
  droneState: {
    dronesSorted: false,
    oxygenPumpsRouted: false,
  },
  hyperionState: {
    ionCannonCharged: false,
    militaryFirewallActive: false,
    fightersLaunched: false,
  },
  titanState: {
    methanePumpsActive: false,
    cryoDrillDepth: 0,
    thermalHeatingOnline: false,
  },
  heliosState: {
    solarShieldDeflection: 40,
    coronaCollectorOnline: false,
    quantumNeutrinoAligned: false,
  },
};

export default function App() {
  const { language, t, getLocalizedRank } = useLanguage();
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [, startTransition] = useTransition();

  // Modals state
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSolarMapOpen, setIsSolarMapOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isVitalsOpen, setIsVitalsOpen] = useState(false);
  const [activeMissionModal, setActiveMissionModal] = useState<Mission | null>(null);
  const [infoModal, setInfoModal] = useState<{ title: string; text: string } | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hudToast, setHudToast] = useState<{ message: string; sub?: string } | null>(null);
  const [diagnosticModalSector, setDiagnosticModalSector] = useState<SectorId | null>(null);
  const [activeDilemma, setActiveDilemma] = useState<RadioDilemma | null>(null);
  const [dilemmaIndex, setDilemmaIndex] = useState(0);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [archiveInitialTab, setArchiveInitialTab] = useState<'gallery' | 'jukebox'>('gallery');
  const [pendingSnippet, setPendingSnippet] = useState<string | null>(null);

  // Track change listener: notify user and sync playback state
  useEffect(() => {
    return musicEngine.onTrackChange((track, index) => {
      setIsMusicPlaying(musicEngine.getIsPlaying());
      setHudToast({
        message: language === 'fr' 
          ? `BANDE ORIGINALE : ${track.title.toUpperCase()}`
          : `BANDA SONORA: ${track.title.toUpperCase()}`,
        sub: language === 'fr'
          ? `PISTE [${index + 1}/${musicEngine.getPlaylist().length}] · ${track.subtitle.toUpperCase()}`
          : `PISTA [${index + 1}/${musicEngine.getPlaylist().length}] · ${track.subtitle.toUpperCase()}`,
      });
      const timer = setTimeout(() => setHudToast(null), 4000);
      return () => clearTimeout(timer);
    });
  }, [language]);

  const getBootLines = (lang: 'es' | 'fr'): TerminalLine[] => [
    {
      id: 'boot-1',
      text: lang === 'fr' ? '═══ STATION VERSAILLES ═══' : '═══ ESTACIÓN VERSALLES ═══',
      type: 'system',
      timestamp: '00:00:00',
    },
    {
      id: 'boot-2',
      text: lang === 'fr'
        ? 'Liaison télémétrique établie avec l’orbite basse. Authentification : OPÉRATEUR_ACTIF.'
        : 'Conexión de telemetría establecida con la órbita baja. Autenticación: OPERADOR_ACTIVO.',
      type: 'ok',
      timestamp: '00:00:01',
    },
    {
      id: 'boot-3',
      text: lang === 'fr'
        ? 'ALERTE : Anomalies de plasma détectées dans le réacteur et intrusion dans la matrice de boucliers.'
        : 'ALERTA: Se han detectado anomalías de plasma en el reactor e intrusión en la matriz de escudos.',
      type: 'warn',
      timestamp: '00:00:02',
    },
    {
      id: 'boot-4',
      text: lang === 'fr'
        ? 'Tapez AIDE() ou help pour consulter les commandes, ou cliquez sur SCRIPT pour programmer.'
        : 'Escribe AYUDA() para ver la lista de comandos o pulsa SCRIPT para programar.',
      type: 'system',
      timestamp: '00:00:03',
    },
  ];

  // Terminal Lines
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>(() => getBootLines(language));

  useEffect(() => {
    setTerminalLines(prev => {
      const isInitial = prev.length <= 4 && prev.every(l => l.id.startsWith('boot-'));
      if (isInitial) {
        return getBootLines(language);
      }
      return prev;
    });
  }, [language]);

  // Global Mission Timer & Pressure Countdown loop
  useEffect(() => {
    if (state.currentScreen === 'intro') return;

    const interval = setInterval(() => {
      setState(prev => {
        const nextTime = prev.missionTime + 1;
        let nextPressure = prev.pressureTimer;

        if (prev.isTimerRunning && nextPressure !== null && nextPressure > 0) {
          nextPressure -= 1;
          if (nextPressure <= 15 && nextPressure > 0 && nextPressure % 4 === 0) {
            soundFx.playAlarmPulse();
          }
          if (nextPressure === 0) {
            soundFx.playError();
          }
        }

        return {
          ...prev,
          missionTime: nextTime,
          pressureTimer: nextPressure,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.currentScreen]);

  // Rank calculation based on XP
  useEffect(() => {
    let rank = 'Cadete de Sistemas';
    if (state.xp >= 600) rank = 'Comandante de Estación';
    else if (state.xp >= 400) rank = 'Oficial de Ciber-Defensa';
    else if (state.xp >= 250) rank = 'Ingeniero de Sistemas';
    else if (state.xp >= 100) rank = 'Técnico de Subred';

    if (rank !== state.cadetRank) {
      setState(prev => ({ ...prev, cadetRank: rank }));
    }
  }, [state.xp, state.cadetRank]);

  // Transmit radio lore messages periodically or on events
  const broadcastRadio = useCallback((sender: string, text: string, callsign: string) => {
    soundFx.playBeep(920, 0.08);
    setState(prev => ({
      ...prev,
      radioMessage: { sender, text, callsign },
    }));
  }, []);

  // Survival mode periodic emergency generator
  useEffect(() => {
    if (!state.survivalMode || state.currentScreen === 'intro') return;

    const timer = setInterval(() => {
      const emg = STATION_EMERGENCIES[Math.floor(Math.random() * STATION_EMERGENCIES.length)];
      setState(prev => ({
        ...prev,
        vitals: emg.effect(prev.vitals),
        pressureTimer: emg.timeLimitSeconds,
        pressureTimerMax: emg.timeLimitSeconds,
        activeEmergencyId: emg.id,
      }));
      soundFx.playAlarm();
      broadcastRadio(
        'Cap. Juan Piña',
        language === 'fr'
          ? `ALERTE ROUGE GÉNÉRALE ! ${emg.title} : ${emg.description}`
          : `¡ALERTA ROJA GENERAL! ${emg.title}: ${emg.description}`,
        'COMMAND-01'
      );
      setHudToast({
        message: language === 'fr' ? `ALERTE ROUGE ! : ${emg.title}` : `¡ALERTA ROJA!: ${emg.title}`,
        sub: language === 'fr'
          ? 'ACCÉDEZ AU SECTEUR AFFECTÉ POUR CONTENIR LA CRISE'
          : 'ACCEDE AL SECTOR AFECTADO PARA CONTENER LA CRISIS',
      });
      setTimeout(() => setHudToast(null), 5000);
    }, 45000);

    return () => clearInterval(timer);
  }, [state.survivalMode, state.currentScreen, broadcastRadio, language]);

  // Narrative dilemma periodic events
  useEffect(() => {
    if (state.currentScreen === 'intro') return;
    const dilemmaTimer = setTimeout(() => {
      if (!activeDilemma && dilemmaIndex < STATION_DILEMMAS.length) {
        setActiveDilemma(STATION_DILEMMAS[dilemmaIndex]);
        setDilemmaIndex(prev => prev + 1);
        soundFx.playBeep(880, 0.1);
      }
    }, 55000);

    return () => clearTimeout(dilemmaTimer);
  }, [state.currentScreen, dilemmaIndex, activeDilemma]);

  // Handle hardware diagnostic solve
  const handleSolveDiagnostic = useCallback((sectorId: SectorId, xpReward: number) => {
    setState(prev => ({
      ...prev,
      xp: prev.xp + xpReward,
      repairedSectors: {
        ...prev.repairedSectors,
        [sectorId]: true,
      },
      vitals: {
        ...prev.vitals,
        energy: Math.min(100, prev.vitals.energy + 10),
        shields: Math.min(100, prev.vitals.shields + 10),
        activeThreatLevel: 'NOMINAL',
      },
      pressureTimer: null,
    }));
    setDiagnosticModalSector(null);
    broadcastRadio(
      'Orlando Ortega',
      language === 'fr'
        ? `Console physique du secteur ${sectorId.toUpperCase()} stabilisée avec succès. Paramètres à 100%.`
        : `Consola física del sector ${sectorId.toUpperCase()} estabilizada con éxito. Parámetros al 100%.`,
      'ING-CORE'
    );
    setHudToast({
      message: language === 'fr' ? `DIAGNOSTIC RÉUSSI (+${xpReward} XP)` : `DIAGNÓSTICO EXITOSO (+${xpReward} XP)`,
      sub: language === 'fr' ? `SOUS-SYSTÈME ${sectorId.toUpperCase()} 100% NOMINAL` : `SUBSISTEMA ${sectorId.toUpperCase()} 100% NOMINAL`,
    });
    setTimeout(() => setHudToast(null), 4000);
  }, [broadcastRadio, language]);

  // Handle tactical dilemma choice
  const handleResolveDilemma = useCallback((choice: DilemmaChoice) => {
    setState(prev => {
      const v = { ...prev.vitals };
      if (choice.consequences.energyDelta) v.energy = Math.max(5, Math.min(100, v.energy + choice.consequences.energyDelta));
      if (choice.consequences.shieldsDelta) v.shields = Math.max(5, Math.min(100, v.shields + choice.consequences.shieldsDelta));
      if (choice.consequences.oxygenDelta) v.oxygen = Math.max(5, Math.min(100, v.oxygen + choice.consequences.oxygenDelta));
      if (choice.consequences.hullDelta) v.hullIntegrity = Math.max(5, Math.min(100, v.hullIntegrity + choice.consequences.hullDelta));
      if (choice.consequences.threatDelta) v.activeThreatLevel = choice.consequences.threatDelta;

      return {
        ...prev,
        vitals: v,
        xp: prev.xp + (choice.consequences.xpDelta || 0),
      };
    });

    setActiveDilemma(null);
    const resp = choice.consequences.radioResponse;
    broadcastRadio(resp.sender, resp.text, resp.callsign);
    soundFx.playSuccess();
  }, [broadcastRadio]);

  // Check mission test cases after every state change
  const verifyCurrentMission = useCallback((currentState: GameState) => {
    if (!currentState.activeMissionId) return;
    const mission = MISSIONS.find(m => m.id === currentState.activeMissionId);
    if (!mission) return;

    if (currentState.completedMissionIds.includes(mission.id)) return;

    // Check all test cases
    const allPassed = mission.testCases.every(tc => tc.check(currentState));
    if (allPassed) {
      soundFx.playSuccess();
      const updatedCompleted = [...currentState.completedMissionIds, mission.id];
      const updatedXP = currentState.xp + mission.rewardXP;

      setState(prev => ({
        ...prev,
        completedMissionIds: updatedCompleted,
        xp: updatedXP,
        pressureTimer: null, // stop alarm
      }));

      // Append success fanfare to terminal
      const nowStr = new Date().toLocaleTimeString();
      setTerminalLines(prev => [
        ...prev,
        {
          id: `success-${Date.now()}`,
          text: language === 'fr'
            ? `MISSION ACCOMPLIE AVEC SUCCÈS ! [${mission.title.toUpperCase()}]`
            : `¡MISIÓN COMPLETADA CON ÉXITO! [${mission.title.toUpperCase()}]`,
          type: 'success',
          timestamp: nowStr,
        },
        {
          id: `xp-${Date.now()}`,
          text: language === 'fr'
            ? `+${mission.rewardXP} Points d'expérience obtenus. Paramètres stabilisés dans le secteur.`
            : `+${mission.rewardXP} Puntos de Experiencia obtenidos. Parámetros estabilizados en sector.`,
          type: 'ok',
          timestamp: nowStr,
        },
      ]);

      // Crew congratulates player
      broadcastRadio(
        'Cap. Juan Piña',
        language === 'fr'
          ? `Excellent travail, opérateur ! Vous avez stabilisé le sous-système ${mission.sectorId.toUpperCase()}. Les algorithmes ont répondu à la perfection.`
          : `¡Excelente trabajo, operador! Has estabilizado el subsistema ${mission.sectorId.toUpperCase()}. Los algoritmos respondieron a la perfección.`,
        'COMMAND-01'
      );
    }
  }, [broadcastRadio, language]);

  // Save file to virtual file system
  const handleSaveVFSFile = useCallback((path: string, content: string) => {
    setState(prev => {
      const res = writeFile(prev.vfs, path, content);
      if (res.error) {
        setHudToast({ message: `ERROR VFS: No se pudo guardar`, sub: res.error });
        return prev;
      }
      setHudToast({ message: `ARCHIVO GUARDADO EN VFS`, sub: path });
      return { ...prev, vfs: res.vfs };
    });
  }, []);

  // Execute terminal command or script block
  const handleExecuteCommand = useCallback((input: string, isScript = false, language: SupportedLanguage = 'python') => {
    const nowStr = new Date().toLocaleTimeString();

    // Handle operator SIGINT interrupt (Ctrl+C)
    if (input === '__SIGINT_INTERRUPT__') {
      setTerminalLines(prev => [
        ...prev,
        {
          id: `sigint-${Date.now()}`,
          text: '^C -- [SIGINT] Ejecución interrumpida por el operador. Telemetría de emergencia restaurada.',
          type: 'warn',
          timestamp: nowStr,
        },
      ]);
      setState(prev => ({
        ...prev,
        vitals: {
          ...prev.vitals,
          cpuLoad: 22,
          activeThreatLevel: prev.vitals.energy < 30 ? 'CRÍTICO' : 'NOMINAL',
        },
      }));
      setHudToast({ message: 'PROCESO INTERRUMPIDO (^C)', sub: 'Bucle abortado por el operador' });
      return;
    }

    // Log the user's typed command or script execution in CLI
    const dirPrompt = state.currentDirectory || '/sys/power';
    const userPrompt =
      state.currentDestinationId === 'hyperion'
        ? 'oficial@hyperion9'
        : state.currentDestinationId === 'titan'
        ? 'tecnico@titan-base'
        : state.currentDestinationId === 'helios'
        ? 'operador@helios-sol'
        : 'cadete@versalles';

    if (language === 'blocks') {
      setTerminalLines(prev => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          text: `${userPrompt}:[${dirPrompt}]$ [EJECUTANDO BLOQUES LÓGICOS DE AVIONICA]`,
          type: 'command',
          timestamp: nowStr,
        },
      ]);
    } else if (isScript) {
      setTerminalLines(prev => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          text: `${userPrompt}:[${dirPrompt}]$ [EJECUTANDO SCRIPT: ${language.toUpperCase()}]`,
          type: 'command',
          timestamp: nowStr,
        },
      ]);
    } else if (input.toUpperCase() !== 'LIMPIAR()' && input.toUpperCase() !== 'CLEAR') {
      setTerminalLines(prev => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          text: `${userPrompt}:[${dirPrompt}]$ ${input}`,
          type: 'command',
          timestamp: nowStr,
        },
      ]);
    }

    const { updatedState, outputLines } = executeCommandOrScript(input, state, isScript, language);

    // Handle clear screen command
    if (outputLines.length === 1 && outputLines[0].text === '__CLEAR__') {
      setTerminalLines([]);
      return;
    }

    // Append output lines
    const formattedLines: TerminalLine[] = outputLines.map((line, idx) => ({
      ...line,
      id: `out-${Date.now()}-${idx}`,
      timestamp: nowStr,
    }));

    setTerminalLines(prev => [...prev, ...formattedLines]);
    setState(updatedState);

    // Check if CPU was overloaded in the execution
    if (updatedState.vitals.cpuLoad >= 99 && updatedState.vitals.activeThreatLevel === 'CRÍTICO') {
      setHudToast({ message: '¡ALERTA! SOBRECALENTAMIENTO DE CPU', sub: 'Bucle infinito drenando reservas de energía' });
    }

    // Verify if this command fulfilled any mission objectives
    verifyCurrentMission(updatedState);
  }, [state, verifyCurrentMission]);


  // Navigate screens
  const handleNavigate = (screen: GameState['currentScreen']) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  };

  const handleEnterSector = (sectorId: SectorId) => {
    let dir = '/sys/power';
    if (sectorId === 'reactor') dir = '/sys/power';
    else if (sectorId === 'drones') dir = '/sys/life_support';
    else if (sectorId === 'shields') dir = '/sys/defense';
    else if (sectorId === 'bridge') dir = '/sys/propulsion';
    else if (sectorId === 'lab') dir = '/sys/lab';
    else if (state.currentDestinationId === 'hyperion') dir = '/sys/hyperion';
    else if (state.currentDestinationId === 'titan') dir = '/sys/titan';
    else if (state.currentDestinationId === 'helios') dir = '/sys/helios';

    setState(prev => ({
      ...prev,
      currentSectorId: sectorId,
      currentDirectory: dir,
      editorFile: null,
      currentScreen: 'sector',
    }));

    // Welcome message from sector specialist
    if (sectorId === 'reactor') {
      broadcastRadio(
        'Orlando Ortega',
        language === 'fr'
          ? 'Console du Réacteur connectée. Le confinement magnétique doit dépasser 88% sous peine de fuite de plasma.'
          : 'Consola del Reactor conectada. El confinamiento magnético debe estar sobre el 88% o el plasma se fugará.',
        'ING-CORE'
      );
    } else if (sectorId === 'shields') {
      broadcastRadio(
        'Andrus Ramírez',
        language === 'fr'
          ? 'Matrice de Boucliers sous intervention. Injection de paquets malveillants détectée sur le port 8088. Purgez le sous-réseau.'
          : 'Matriz de Escudos intervenida. Detecto inyección de paquetes maliciosos en el puerto 8088. Purga la subred.',
        'CYBER-OPS'
      );
    } else if (sectorId === 'bridge') {
      broadcastRadio(
        'Andrus Ramírez',
        language === 'fr'
          ? 'Passerelle de commandement active. Les 4 propulseurs RCS sont déséquilibrés. Calibrez-les avant la dégradation orbitale.'
          : 'Puente de mando activo. Los 4 propulsores RCS están desbalanceados. Calíbralos antes del decaimiento orbital.',
        'NAV-01'
      );
    }
  };

  const handleSelectMission = (missionId: string) => {
    const mission = MISSIONS.find(m => m.id === missionId);
    if (!mission) return;

    setState(prev => ({
      ...prev,
      activeMissionId: mission.id,
      currentSectorId: mission.sectorId,
      pressureTimer: mission.timeLimitSeconds || null,
      pressureTimerMax: mission.timeLimitSeconds || null,
    }));

    setActiveMissionModal(mission);
  };

  const handleWarpToDestination = useCallback((destination: SolarDestination) => {
    let dir = '/sys/power';
    if (destination.id === 'hyperion') dir = '/sys/hyperion';
    else if (destination.id === 'titan') dir = '/sys/titan';
    else if (destination.id === 'helios') dir = '/sys/helios';
    else if (destination.id === 'versalles') dir = '/sys/power';

    // Find first mission for this destination
    const destinationMissions = MISSIONS.filter(m => (m.locationId || 'versalles') === destination.id);
    const targetMission = destinationMissions[0] || null;

    setState(prev => ({
      ...prev,
      currentScreen: 'hub',
      currentDestinationId: destination.id,
      currentSectorId: destination.defaultSectorId,
      currentDirectory: dir,
      editorFile: null,
      activeMissionId: targetMission ? targetMission.id : prev.activeMissionId,
      vitals: {
        ...prev.vitals,
        energy: Math.max(10, prev.vitals.energy - destination.travelEnergyCost),
      },
    }));
    setIsSolarMapOpen(false);
    broadcastRadio(
      'Oficial de Navegación',
      language === 'fr'
        ? `Saut spatial terminé ! Arrimage réussi à ${destination.name.toUpperCase()}. Missions tactiques disponibles.`
        : `¡Salto completado! Anclados con éxito en ${destination.name.toUpperCase()}. Misiones tácticas disponibles.`,
      'NAV-01'
    );
    setHudToast({
      message: language === 'fr' ? `TRANSIT HYPERSPATIAL : ${destination.name.toUpperCase()}` : `SALTO HIPERESPACIAL: ${destination.name.toUpperCase()}`,
      sub: language === 'fr' ? `LOCALISATION : ${destination.celestialParent} · MISSIONS ACTIVES` : `UBICACIÓN: ${destination.celestialParent} · MISIONES ACTIVAS`,
    });
    setTimeout(() => setHudToast(null), 4000);
  }, [broadcastRadio, language]);

  const currentSectors = getSectorsForLocation(state.currentDestinationId);
  const currentSector = currentSectors.find(s => s.id === state.currentSectorId) || currentSectors[0];

  return (
    <div 
      className={`min-h-screen w-full bg-[#020b18] text-[#c8e8f0] relative overflow-hidden ${state.crtEffect ? 'crt-overlay' : ''}`}
    >

      {/* Floating HUD Success Toast */}
      {hudToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#031b2e]/95 border-2 border-emerald-400/80 px-5 py-3 rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300 pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <div className="font-orbitron text-sm font-bold text-emerald-400 tracking-wider">
              {hudToast.message}
            </div>
            {hudToast.sub && (
              <div className="font-tech text-xs text-slate-300">
                {hudToast.sub}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Bar HUD */}
      {state.currentScreen !== 'intro' && (
        <HeaderHUD
          state={state}
          onNavigate={handleNavigate}
          onOpenMap={() => setIsMapOpen(true)}
          onOpenSolarMap={() => setIsSolarMapOpen(true)}
          onOpenHandbook={() => setIsHandbookOpen(true)}
          onOpenVitals={() => setIsVitalsOpen(true)}
          onOpenArchive={(tab = 'gallery') => {
            setArchiveInitialTab(tab);
            setIsArchiveOpen(true);
          }}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={() => {
            const playing = musicEngine.toggle();
            setIsMusicPlaying(playing);
          }}
          onToggleSound={() => {
            const muted = soundFx.toggleMute();
            musicEngine.setMuted(muted);
            setState(prev => ({ ...prev, soundEnabled: !muted }));
          }}
          onToggleCRT={() => {
            soundFx.playBeep(1200, 0.04);
            setState(prev => ({ ...prev, crtEffect: !prev.crtEffect }));
          }}
          onToggleSurvivalMode={() => {
            soundFx.playBeep(950, 0.05);
            setState(prev => {
              const nextMode = !prev.survivalMode;
              if (nextMode) {
                soundFx.playAlarm();
                broadcastRadio(
                  'Cap. Juan Piña',
                  language === 'fr'
                    ? 'MODE SURVIE ACTIVÉ ! Les systèmes subiront des pannes continues en temps réel. Maintenez la station opérationnelle.'
                    : '¡MODO SUPERVIVENCIA ACTIVADO! Los sistemas sufrirán fallos continuos en tiempo real. Mantén la estación operativa.',
                  'COMMAND-01'
                );
              }
              return { ...prev, survivalMode: nextMode };
            });
          }}
        />
      )}

      {/* Screen Views */}
      <main className="relative w-full min-h-screen">
        {state.currentScreen === 'intro' && (
          <IntroScreen
            onStart={() => {
              musicEngine.start();
              setIsMusicPlaying(true);
              startTransition(() => {
                setState(prev => ({ ...prev, currentScreen: 'hub' }));
              });
              broadcastRadio(
                'Cap. Juan Piña',
                language === 'fr'
                  ? 'Bienvenue à bord de la Station Versailles, opérateur. Accédez aux secteurs et stabilisez le vaisseau.'
                  : 'Bienvenido a bordo de la Estación Versalles, operador. Accede a los sectores y estabiliza la nave.',
                'COMMAND-01'
              );
            }}
            activeMissionsCount={MISSIONS.length}
          />
        )}

        {state.currentScreen === 'hub' && (
          <HubScreen
            sectors={currentSectors}
            missions={MISSIONS}
            state={state}
            onEnterSector={handleEnterSector}
            onSelectMission={handleSelectMission}
            onOpenSolarMap={() => setIsSolarMapOpen(true)}
            onOpenArchive={(tab = 'gallery') => {
              setArchiveInitialTab(tab);
              setIsArchiveOpen(true);
            }}
          />
        )}

        {state.currentScreen === 'sector' && (
          <SectorView
            sector={currentSector}
            state={state}
            onOpenMission={handleSelectMission}
            onOpenTerminal={() => setIsTerminalOpen(true)}
            onShowInfo={(title, text) => setInfoModal({ title, text })}
            onOpenDiagnostic={(secId) => setDiagnosticModalSector(secId)}
          />
        )}
      </main>

      {/* Interactive Cyber Terminal Console */}
      {isTerminalOpen && (
        <Terminal
          lines={terminalLines}
          state={state}
          onExecuteCommand={handleExecuteCommand}
          onSaveFile={handleSaveVFSFile}
          onClear={() => setTerminalLines([])}
          onClose={() => {
            setIsTerminalOpen(false);
            setPendingSnippet(null);
          }}
          onOpenHandbook={() => setIsHandbookOpen(true)}
          initialSnippet={pendingSnippet}
        />
      )}

      {/* Radio Communication Box */}
      <RadioChatter
        message={state.radioMessage}
        onDismiss={() => setState(prev => ({ ...prev, radioMessage: null }))}
      />

      {/* Modals */}
      {activeMissionModal && (
        <MissionModal
          mission={activeMissionModal}
          state={state}
          onClose={() => setActiveMissionModal(null)}
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />
      )}

      {isMapOpen && (
        <MapModal
          sectors={currentSectors}
          currentSectorId={state.currentSectorId}
          gameState={state}
          onSelectSector={handleEnterSector}
          onClose={() => setIsMapOpen(false)}
        />
      )}

      {/* Solar System Interplanetary Map Modal */}
      {isSolarMapOpen && (
        <SolarSystemModal
          currentDestinationId={state.currentDestinationId}
          gameState={state}
          onWarpToDestination={handleWarpToDestination}
          onClose={() => setIsSolarMapOpen(false)}
        />
      )}

      {isVitalsOpen && (
        <VitalsModal
          state={state}
          onClose={() => setIsVitalsOpen(false)}
        />
      )}

      {isHandbookOpen && (
        <HandbookModal
          onClose={() => setIsHandbookOpen(false)}
          onInsertCodeSnippet={(snippet) => {
            setPendingSnippet(snippet);
            setIsTerminalOpen(true);
            soundFx.playCommandExecute();
            setHudToast({
              message: language === 'fr' ? 'CODE INSÉRÉ DANS L’ÉDITEUR' : 'CÓDIGO INSERTADO EN EDITOR',
              sub: language === 'fr'
                ? 'Onglet [ÉDITEUR SCRIPT] prêt à compiler et exécuter'
                : 'Pestaña [EDITOR SCRIPT] lista para compilar y ejecutar',
            });
            setTimeout(() => setHudToast(null), 3500);
          }}
        />
      )}

      {infoModal && (
        <InfoModal
          title={infoModal.title}
          text={infoModal.text}
          onClose={() => setInfoModal(null)}
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />
      )}

      {/* Hardware Diagnostic Console Minigame Modal */}
      {diagnosticModalSector && (
        <DiagnosticConsoleModal
          sectorId={diagnosticModalSector}
          state={state}
          onClose={() => setDiagnosticModalSector(null)}
          onSuccess={handleSolveDiagnostic}
        />
      )}

      {/* Narrative Dilemma Decision Modal */}
      {activeDilemma && (
        <DilemmaModal
          dilemma={activeDilemma}
          onResolve={handleResolveDilemma}
          onDismiss={() => setActiveDilemma(null)}
        />
      )}

      {/* Multimedia Artwork Archive & Jukebox Modal */}
      {isArchiveOpen && (
        <MultimediaArchiveModal
          initialTab={archiveInitialTab}
          onClose={() => setIsArchiveOpen(false)}
        />
      )}
    </div>
  );
}
