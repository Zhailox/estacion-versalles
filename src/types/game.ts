export type SectorId = 'reactor' | 'lab' | 'bridge' | 'shields' | 'drones';

export type ScreenId = 'intro' | 'hub' | 'sector' | 'victory';

export type MissionDifficulty = 'BÁSICO' | 'INTERMEDIO' | 'AVANZADO' | 'CRÍTICO';

export type MissionCategory = 
  | 'VARIABLES_Y_CALIBRACION'
  | 'LOGICA_BOOLEANA'
  | 'BUCLES_Y_ARRAYS'
  | 'CIBER_DEFENSA'
  | 'AUTOMATIZACION_DRONES'
  | 'CRISIS_MULTISISTEMA';

export interface TestCase {
  description: string;
  check: (state: GameState, codeOutput?: any) => boolean;
  hint?: string;
}

export interface Mission {
  id: string;
  locationId?: 'versalles' | 'hyperion' | 'titan' | 'helios';
  sectorId: SectorId;
  imageKey?: string;
  title: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  conceptTaught: string;
  summary: string;
  briefing: string;
  objectives: string[];
  initialCode?: string;
  timeLimitSeconds?: number; // Optional countdown under pressure!
  solutionHint: string;
  availableCommands: string[];
  testCases: TestCase[];
  rewardXP: number;
}

export interface StationVitals {
  energy: number;       // 0 - 100%
  coreTemp: number;     // Celsius (nominal 12,000 - 14,000, dangerous >15,000)
  magneticField: number;// 0 - 100% (nominal >=88%)
  shields: number;      // 0 - 100%
  oxygen: number;       // 0 - 100%
  comms: number;        // 0 - 100%
  hullIntegrity: number;// 0 - 100%
  cpuLoad: number;      // 0 - 100%
  activeThreatLevel: 'NOMINAL' | 'PRECAUCIÓN' | 'CRÍTICO' | 'BRECHA_INMINENTE';
}

export interface Hotspot {
  id: string;
  title: string;
  subtitle: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  icon: 'monitor' | 'wrench' | 'zap' | 'shield' | 'terminal' | 'cpu' | 'alert' | 'radar';
  action: 'open_mission' | 'info' | 'open_terminal' | 'interactive';
  infoText?: string;
}

export interface Sector {
  id: SectorId;
  name: string;
  tag: string;
  themeColor: string;
  accentColor: string;
  description: string;
  status: 'NOMINAL' | 'ADVERTENCIA' | 'CRÍTICO';
  activeMissionId?: string;
  hotspots: Hotspot[];
}

export interface CrewMember {
  name: string;
  rank: string;
  role: string;
  avatarColor: string;
  bio: string;
}

export interface TerminalLine {
  id: string;
  text: string;
  type: 'system' | 'prompt' | 'ok' | 'warn' | 'error' | 'success' | 'command' | 'code';
  timestamp: string;
}

import { VFSDirectory } from '../utils/vfs';

export interface GameState {
  currentScreen: ScreenId;
  currentDestinationId: 'versalles' | 'hyperion' | 'titan' | 'helios';
  currentSectorId: SectorId;
  activeMissionId: string | null;
  completedMissionIds: string[];
  vitals: StationVitals;
  xp: number;
  cadetRank: string;
  missionTime: number; // seconds
  pressureTimer: number | null; // active countdown in seconds
  pressureTimerMax: number | null;
  isTimerRunning: boolean;
  soundEnabled: boolean;
  crtEffect: boolean;
  radioMessage: {
    sender: string;
    text: string;
    callsign: string;
  } | null;
  repairedSectors: Record<SectorId, boolean>;
  survivalMode: boolean;
  activeEmergencyId: string | null;
  // UNIX Virtual File System & Editor integration
  currentDirectory: string;
  vfs: VFSDirectory;
  editorFile: string | null;
  editorLanguage: 'python' | 'java' | 'javascript' | 'blocks';
  // Dynamic simulated sector states
  solarPanelsState: {
    alignedCount: number;
    targetAngle: number;
    angles: number[];
  };
  carbonFiltersState: {
    co2Level: number;
    purgedFilters: string[];
    recirculationActive: boolean;
  };
  reactorState: {
    magneticField: number;
    stabilizerActive: boolean;
    coolantPumps: number;
    plasmaOscillation: number;
  };
  labState: {
    andGateRepaired: boolean;
    secondaryNavOnline: boolean;
    logicTruthTableOk: boolean;
    quarantineIsolated: boolean;
  };
  bridgeState: {
    thrustersCalibrated: number[];
    orbitalDecayRate: number;
    trajectorySafe: boolean;
  };
  shieldState: {
    firewallRulesActive: boolean;
    malwarePacketsBlocked: number;
    intrusionSuppressed: boolean;
  };
  droneState: {
    dronesSorted: boolean;
    oxygenPumpsRouted: boolean;
  };
  hyperionState: {
    ionCannonCharged: boolean;
    militaryFirewallActive: boolean;
    fightersLaunched: boolean;
  };
  titanState: {
    methanePumpsActive: boolean;
    cryoDrillDepth: number;
    thermalHeatingOnline: boolean;
  };
  heliosState: {
    solarShieldDeflection: number;
    coronaCollectorOnline: boolean;
    quantumNeutrinoAligned: boolean;
  };
}

