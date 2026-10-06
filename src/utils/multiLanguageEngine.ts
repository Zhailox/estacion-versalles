import { GameState } from '../types/game';

export type SupportedLanguage = 'python' | 'java' | 'javascript' | 'blocks';

export interface ScriptExecutionOutput {
  logs: string[];
  error?: {
    type: 'SyntaxError' | 'IndentationError' | 'NameError' | 'RuntimeError' | 'JavaCompilationError' | 'InfiniteLoopError';
    message: string;
    line?: number;
    suggestion?: string;
  };
  stateChanges: Partial<GameState>;
  stepsCount: number;
  cpuOverloaded?: boolean;
}

export interface EngineContext {
  state: GameState;
  logs: string[];
  stateChanges: any;
  steps: number;
  maxSteps: number;
}

/**
 * Deterministic multi-language runner with loop protection, syntax verification,
 * and simulated avionics hardware integration.
 */
export function executeCodeWithLanguage(
  code: string,
  language: SupportedLanguage,
  currentState: GameState
): ScriptExecutionOutput {
  const trimmed = code.trim();
  if (!trimmed) {
    return { logs: ['>> Archivo o script vacío.'], stateChanges: {}, stepsCount: 0 };
  }

  switch (language) {
    case 'python':
      return runPythonScript(code, currentState);
    case 'java':
      return runJavaScript(code, currentState);
    case 'blocks':
      return runBlockScript(code, currentState);
    case 'javascript':
    default:
      return runJavaScriptDirect(code, currentState);
  }
}

/**
 * Deterministic Python runner with step counting to catch infinite loops
 * and authentic Python error diagnostics.
 */
function runPythonScript(code: string, state: GameState): ScriptExecutionOutput {
  const logs: string[] = [];
  const stateChanges: any = {
    vitals: { ...state.vitals },
    solarPanelsState: state.solarPanelsState
      ? { ...state.solarPanelsState, angles: [...state.solarPanelsState.angles] }
      : { alignedCount: 0, targetAngle: 47.5, angles: [0, 0, 0, 0, 0, 0, 0, 0] },
    carbonFiltersState: state.carbonFiltersState
      ? { ...state.carbonFiltersState, purgedFilters: [...state.carbonFiltersState.purgedFilters] }
      : { co2Level: 94.2, purgedFilters: [], recirculationActive: false },
    reactorState: { ...state.reactorState },
    labState: { ...state.labState },
    bridgeState: { ...state.bridgeState, thrustersCalibrated: [...state.bridgeState.thrustersCalibrated] },
    shieldState: { ...state.shieldState },
    droneState: { ...state.droneState },
    hyperionState: state.hyperionState ? { ...state.hyperionState } : { ionCannonCharged: false, militaryFirewallActive: false, fightersLaunched: false },
    titanState: state.titanState ? { ...state.titanState } : { methanePumpsActive: false, cryoDrillDepth: 0, thermalHeatingOnline: false },
    heliosState: state.heliosState ? { ...state.heliosState } : { solarShieldDeflection: 40, coronaCollectorOnline: false, quantumNeutrinoAligned: false },
  };

  const lines = code.split('\n');

  // 1. Python Syntax & Indentation Pre-check
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const lineNum = i + 1;
    const stripped = rawLine.trim();

    if (!stripped || stripped.startsWith('#')) continue;

    // Check for colons in control statements
    if (/^(for|while|if|elif|else|def|class)\b/.test(stripped)) {
      if (!stripped.endsWith(':')) {
        return {
          logs,
          error: {
            type: 'SyntaxError',
            message: `SyntaxError: expected ':' at end of statement`,
            line: lineNum,
            suggestion: `En Python, las instrucciones como for/while/if deben finalizar con dos puntos ':'. Revisa la línea ${lineNum}.`,
          },
          stateChanges: {},
          stepsCount: 0,
        };
      }
    }

    // Check for inconsistent tab/spaces in indentation
    const indentMatch = rawLine.match(/^(\s+)/);
    if (indentMatch) {
      const indent = indentMatch[1];
      if (indent.includes('\t') && indent.includes(' ')) {
        return {
          logs,
          error: {
            type: 'IndentationError',
            message: `TabError: inconsistent use of tabs and spaces in indentation`,
            line: lineNum,
            suggestion: 'Utiliza siempre 4 espacios por nivel de indentación en lugar de mezclar tabuladores y espacios.',
          },
          stateChanges: {},
          stepsCount: 0,
        };
      }
    }
  }

  // 2. Safe execution environment with step counting
  let steps = 0;
  const MAX_STEPS = 10000;

  // Track solar panels state in local simulation
  let solarPanelsAlignedCount = 0;
  const solarAngles: Record<number, number> = {};

  const avionicsEnv = {
    print: (...args: any[]) => {
      logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    range: (startOrStop: number, stop?: number, step: number = 1) => {
      const result: number[] = [];
      let s = 0;
      let e = startOrStop;
      if (stop !== undefined) {
        s = startOrStop;
        e = stop;
      }
      for (let i = s; i < e; i += step) {
        result.push(i);
      }
      return result;
    },
    // Avionics primitives
    ajustar_panel_solar: (panelId: number, angulo: number) => {
      steps++;
      solarAngles[panelId] = angulo;
      if (panelId >= 0 && panelId < 8) {
        stateChanges.solarPanelsState.angles[panelId] = angulo;
      }
      if (Math.abs(angulo - 47.5) <= 1.0) {
        solarPanelsAlignedCount++;
      }
      logs.push(`[AVIONICS] Panel #${panelId} orientado a ${angulo}° ${Math.abs(angulo - 47.5) <= 1 ? '✓ [NOMINAL]' : '⚠ [DESALINEADO]'}`);
    },
    purgar_filtro_carbono: (filtroId: string) => {
      steps++;
      logs.push(`[SOPORTE VITAL] Purgando partículas tóxicas en cartucho ${filtroId}... ✓`);
      stateChanges.vitals.oxygen = Math.min(100, stateChanges.vitals.oxygen + 5);
      stateChanges.droneState.oxygenPumpsRouted = true;
      if (!stateChanges.carbonFiltersState.purgedFilters.includes(filtroId)) {
        stateChanges.carbonFiltersState.purgedFilters.push(filtroId);
      }
      stateChanges.carbonFiltersState.co2Level = Math.max(10, stateChanges.carbonFiltersState.co2Level - 20);
    },
    activar_recirculacion_o2: () => {
      steps++;
      stateChanges.vitals.oxygen = 95;
      stateChanges.carbonFiltersState.recirculationActive = true;
      stateChanges.carbonFiltersState.co2Level = 12.0;
      logs.push(`[SOPORTE VITAL] Recirculación de O2 activada. Presión barométrica nominal ✓`);
    },
    calibrar_propulsor_rcs: (id: number, val: number) => {
      steps++;
      if (id >= 0 && id < 4) {
        stateChanges.bridgeState.thrustersCalibrated[id] = val;
      }
      logs.push(`[PROPULSIÓN] Impulsor RCS #${id} ajustado a ${val}% de empuje`);
    },
    fijar_orbita_estable: () => {
      steps++;
      stateChanges.bridgeState.orbitalDecayRate = 0;
      stateChanges.bridgeState.trajectorySafe = true;
      logs.push(`[NAVEGACIÓN] Vector orbital estabilizado con éxito ✓`);
    },
    aplicar_firewall: (regla: string) => {
      steps++;
      stateChanges.shieldState.firewallRulesActive = true;
      logs.push(`[FIREWALL] Regla '${regla}' propagada a la matriz defensiva ✓`);
    },
    aislar_puerto: (puerto: number) => {
      steps++;
      logs.push(`[FIREWALL] Puerto de comunicaciones ${puerto} aislado físicamente`);
    },
    purgar_subred: () => {
      steps++;
      stateChanges.shieldState.intrusionSuppressed = true;
      stateChanges.vitals.shields = 92;
      stateChanges.vitals.activeThreatLevel = 'NOMINAL';
      logs.push(`[FIREWALL] Infección purgada de la memoria troncal ✓`);
    },
    inyectar_crio: (litros: number) => {
      steps++;
      const reduction = litros * 45;
      stateChanges.vitals.coreTemp = Math.max(11000, stateChanges.vitals.coreTemp - reduction);
      logs.push(`[REACTOR] Inyectados ${litros}L de criorefrigerante. Temp: ${stateChanges.vitals.coreTemp}°C`);
    },
    ajustar: (param: string, valor: number) => {
      steps++;
      const p = String(param).toUpperCase();
      if (p.includes('CAMPO') || p.includes('MAGNETICO')) {
        stateChanges.reactorState.magneticField = valor;
        if (valor >= 88) {
          stateChanges.vitals.coreTemp = Math.max(12000, stateChanges.vitals.coreTemp - 1500);
          logs.push(`[REACTOR] Campo magnético asegurado en ${valor}% ✓`);
        }
      }
    },
    activar: (sistema: string) => {
      steps++;
      const s = String(sistema).toUpperCase();
      if (s.includes('ESTABILIZADOR')) {
        stateChanges.reactorState.stabilizerActive = true;
        stateChanges.reactorState.plasmaOscillation = 1.8;
        logs.push(`[REACTOR] Estabilizador de plasma ONLINE ✓`);
      } else if (s.includes('NAVEGACION') || s.includes('SECUNDARIA')) {
        stateChanges.labState.secondaryNavOnline = true;
        logs.push(`[LAB] Navegación secundaria conectada ✓`);
      }
    },
    reparar: (comp: string, tipo: string, sec: number) => {
      steps++;
      if (String(comp).toUpperCase().includes('PUERTA')) {
        stateChanges.labState.andGateRepaired = true;
        logs.push(`[LAB] Puerta ${tipo} en sector ${sec} reemplazada ✓`);
      }
    },
    probar: (comp: string) => {
      steps++;
      stateChanges.labState.logicTruthTableOk = true;
      logs.push(`[LAB] Pruebas unitarias de ${comp} superadas con éxito ✓`);
    },
    // Hyperion-9 Primitives
    cargar_canon_iones: (potencia: number) => {
      steps++;
      if (!stateChanges.hyperionState) stateChanges.hyperionState = { ...state.hyperionState };
      stateChanges.hyperionState.ionCannonCharged = potencia >= 90;
      stateChanges.vitals.energy = Math.min(100, stateChanges.vitals.energy + 20);
      logs.push(`[HYPERION-9] Condensadores de cañón cargados al ${potencia}% ${potencia >= 90 ? '✓ [LISTO PARA FUEGO]' : '⚠ [SUB-CARGADO]'}`);
    },
    activar_firewall_militar: () => {
      steps++;
      if (!stateChanges.hyperionState) stateChanges.hyperionState = { ...state.hyperionState };
      stateChanges.hyperionState.militaryFirewallActive = true;
      stateChanges.vitals.shields = Math.min(100, stateChanges.vitals.shields + 35);
      logs.push(`[HYPERION-9] Cortafuegos militar CORTEX-9 activado. Llaves criptográficas de flota en línea ✓`);
    },
    lanzar_cazas: (escuadron: string) => {
      steps++;
      if (!stateChanges.hyperionState) stateChanges.hyperionState = { ...state.hyperionState };
      stateChanges.hyperionState.fightersLaunched = true;
      logs.push(`[HYPERION-9] Catapultas presurizadas. Escuadrón [${escuadron}] desplegado en patrulla perimetral ✓`);
    },
    // Titan-IV Primitives
    activar_bombas_metano: () => {
      steps++;
      if (!stateChanges.titanState) stateChanges.titanState = { ...state.titanState };
      stateChanges.titanState.methanePumpsActive = true;
      stateChanges.vitals.energy = Math.min(100, stateChanges.vitals.energy + 25);
      logs.push(`[TITÁN-IV] Bombas criogénicas de metano encendidas en Kraken Mare. Caudal: 1,200 L/min ✓`);
    },
    iniciar_taladro: (metros: number) => {
      steps++;
      if (!stateChanges.titanState) stateChanges.titanState = { ...state.titanState };
      stateChanges.titanState.cryoDrillDepth = metros;
      logs.push(`[TITÁN-IV] Cabezal térmico de diamante a ${metros}m bajo el hielo. ${metros >= 150 ? 'Bolsa geotérmica acoplada ✓' : '⚠ Se requieren ≥150m'}`);
    },
    activar_red_termica: () => {
      steps++;
      if (!stateChanges.titanState) stateChanges.titanState = { ...state.titanState };
      stateChanges.titanState.thermalHeatingOnline = true;
      logs.push(`[TITÁN-IV] Red radiante sub-cero encendida. Temperatura ambiente estabilizada a +21°C ✓`);
    },
    // Helios-Prime Primitives
    ajustar_escudo_solar: (deflexion: number) => {
      steps++;
      if (!stateChanges.heliosState) stateChanges.heliosState = { ...state.heliosState };
      stateChanges.heliosState.solarShieldDeflection = deflexion;
      stateChanges.vitals.shields = Math.min(100, deflexion);
      logs.push(`[HELIOS-SOL] Escudo de grafeno cuántico ajustado a ${deflexion}% de deflexión ${deflexion >= 85 ? '✓ [TORMENTA ABSORBIDA]' : '⚠ [RIESGO DE FUSIÓN]'}`);
    },
    activar_colector_corona: () => {
      steps++;
      if (!stateChanges.heliosState) stateChanges.heliosState = { ...state.heliosState };
      stateChanges.heliosState.coronaCollectorOnline = true;
      stateChanges.vitals.energy = 100;
      logs.push(`[HELIOS-SOL] Toberas magnéticas de absorción coronal activadas. Acumuladores de flota al 100% ✓`);
    },
    alinear_neutrinos: () => {
      steps++;
      if (!stateChanges.heliosState) stateChanges.heliosState = { ...state.heliosState };
      stateChanges.heliosState.quantumNeutrinoAligned = true;
      stateChanges.vitals.comms = 100;
      logs.push(`[HELIOS-SOL] Matriz cuántica de neutrinos alineada. Paquete de telemetría transmitido a la Tierra ✓`);
    },
    // Utility and fleet commands
    despachar_drones: (modo: string) => {
      steps++;
      stateChanges.droneState.dronesSorted = true;
      logs.push(`[DRONES] Cola de despacho reconfigurada a modo '${modo}' ✓`);
    },
    enrutar_valvulas: (valvulas: number[]) => {
      steps++;
      stateChanges.droneState.oxygenPumpsRouted = true;
      stateChanges.vitals.oxygen = 95;
      logs.push(`[SOPORTE VITAL] Válvulas [${valvulas.join(', ')}] presurizadas y selladas ✓`);
    },
    desviar_energia: (destino: string, cantidad: number) => {
      steps++;
      stateChanges.vitals.shields = Math.min(100, stateChanges.vitals.shields + cantidad);
      logs.push(`[ENERGÍA] ${cantidad}% de potencia redirigida a matriz de ${destino} ✓`);
    },
    configurar_cuantico: (params: any) => {
      steps++;
      stateChanges.labState.logicTruthTableOk = true;
      logs.push(`[LAB] Llave cuántica sincronizada (${JSON.stringify(params)}) ✓`);
    },
    sincronizar_enlace: () => {
      steps++;
      stateChanges.vitals.comms = 100;
      logs.push(`[COMMS] Transpondedor de comunicaciones alineado con Tierra ✓`);
    },
    diagnostico: () => {
      steps++;
      logs.push(`[DIAGNÓSTICO] Telemetría de sector nominal. Parámetros auditados sin errores críticos.`);
    },
    diagnostico_global: () => {
      steps++;
      stateChanges.vitals.activeThreatLevel = 'NOMINAL';
      logs.push(`[DIAGNÓSTICO GLOBAL] Todos los indicadores de crisis extinguidos con éxito ✓`);
    },
    // Constants
    CAMPO_MAGNETICO: 'CAMPO_MAGNETICO',
    SISTEMA_ESTABILIZADOR: 'SISTEMA_ESTABILIZADOR',
    PUERTA_LOGICA: 'PUERTA_LOGICA',
    NAVEGACION_SECUNDARIA: 'NAVEGACION_SECUNDARIA',
    ESCUDOS: 'ESCUDOS',
    True: true,
    False: false,
    None: null,
  };

  // Convert Python-like script to safe transpiled JS block with step tracking
  try {
    const transpiledJs = transpilePythonToExecutableJs(code);
    const keys = Object.keys(avionicsEnv);
    const values = Object.values(avionicsEnv);

    // Injected step watcher
    const wrappedCode = `
      "use strict";
      let __stepCount = 0;
      function __tick() {
        __stepCount++;
        if (__stepCount > ${MAX_STEPS}) {
          throw new Error("__INFINITE_LOOP_DETECTED__");
        }
      }
      ${transpiledJs}
    `;

    const runner = new Function(...keys, wrappedCode);
    runner(...values);

    // Check solar panel crisis success
    if (solarPanelsAlignedCount >= 8) {
      stateChanges.vitals.energy = 98;
      stateChanges.vitals.activeThreatLevel = 'NOMINAL';
      stateChanges.solarPanelsState.alignedCount = 8;
      stateChanges.solarPanelsState.targetAngle = 47.5;
      logs.push('>> ALERTA DE COLECTORES SOLARES: Los 8 paneles han alcanzado el 100% de irradiación. Energía restaurada.');
    }

    return {
      logs,
      stateChanges,
      stepsCount: steps,
    };
  } catch (err: any) {
    if (err.message && err.message.includes('__INFINITE_LOOP_DETECTED__')) {
      // Consequences simulation: drain energy drastically due to runaway CPU
      stateChanges.vitals.energy = Math.max(5, stateChanges.vitals.energy - 35);
      stateChanges.vitals.cpuLoad = 100;
      stateChanges.vitals.coreTemp = Math.min(18000, stateChanges.vitals.coreTemp + 2000);
      stateChanges.vitals.activeThreatLevel = 'CRÍTICO';

      return {
        logs,
        error: {
          type: 'InfiniteLoopError',
          message: 'CRITICAL ERROR: Bucle infinito detectado (>10,000 ciclos sin condición de salida).',
          suggestion: 'El procesador de la estación entró en sobrecalentamiento térmico y agotó las reservas de energía. Verifica que tu bucle while/for tenga una condición de parada adecuada.',
        },
        stateChanges,
        stepsCount: MAX_STEPS,
        cpuOverloaded: true,
      };
    }

    return {
      logs,
      error: {
        type: 'RuntimeError',
        message: `RuntimeError: ${err.message}`,
        suggestion: 'Comprueba los nombres de funciones y variables llamadas en tu script.',
      },
      stateChanges: {},
      stepsCount: steps,
    };
  }
}

/**
 * Lightweight, deterministic transpiler from subset of Python to JS
 */
function transpilePythonToExecutableJs(pyCode: string): string {
  const lines = pyCode.split('\n');
  const jsLines: string[] = [];
  const indentStack: number[] = [0];

  for (let idx = 0; idx < lines.length; idx++) {
    const raw = lines[idx];
    const trimmed = raw.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Measure indent
    const indent = raw.search(/\S/);
    while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push('}');
    }

    let line = trimmed;

    // Replace python keywords
    line = line.replace(/\band\b/g, '&&');
    line = line.replace(/\bor\b/g, '||');
    line = line.replace(/\bnot\b/g, '!');
    line = line.replace(/\bTrue\b/g, 'true');
    line = line.replace(/\bFalse\b/g, 'false');
    line = line.replace(/\bNone\b/g, 'null');

    // for item in collection:
    const forInMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.+):$/);
    if (forInMatch) {
      const varName = forInMatch[1];
      const collection = forInMatch[2];
      indentStack.push(indent + 4);
      jsLines.push(`for (const ${varName} of ${collection}) { __tick();`);
      continue;
    }

    // while condition:
    const whileMatch = line.match(/^while\s+(.+):$/);
    if (whileMatch) {
      const condition = whileMatch[1];
      indentStack.push(indent + 4);
      jsLines.push(`while (${condition}) { __tick();`);
      continue;
    }

    // if condition:
    const ifMatch = line.match(/^if\s+(.+):$/);
    if (ifMatch) {
      indentStack.push(indent + 4);
      jsLines.push(`if (${ifMatch[1]}) {`);
      continue;
    }

    // elif condition:
    const elifMatch = line.match(/^elif\s+(.+):$/);
    if (elifMatch) {
      jsLines.push(`} else if (${elifMatch[1]}) {`);
      continue;
    }

    // else:
    if (line === 'else:') {
      jsLines.push(`} else {`);
      continue;
    }

    // def func(args):
    const defMatch = line.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\):$/);
    if (defMatch) {
      indentStack.push(indent + 4);
      jsLines.push(`function ${defMatch[1]}(${defMatch[2]}) {`);
      continue;
    }

    // Variable assignment: x = ...
    // If it doesn't start with keyword and contains '=', ensure declaration
    if (/^[a-zA-Z0-9_]+\s*=\s*.+/.test(line)) {
      line = `let ${line}`;
    }

    jsLines.push(`__tick(); ${line};`);
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push('}');
  }

  return jsLines.join('\n');
}

/**
 * Deterministic Java compiler/runner
 */
function runJavaScript(code: string, state: GameState): ScriptExecutionOutput {
  const logs: string[] = [];
  const lines = code.split('\n');

  // Java Syntax pre-checks
  if (!code.includes('class ')) {
    return {
      logs,
      error: {
        type: 'JavaCompilationError',
        message: 'javac error: class, interface, or enum expected',
        line: 1,
        suggestion: 'Todo programa en Java debe comenzar declarando una clase, por ejemplo: public class Solucion { ... }',
      },
      stateChanges: {},
      stepsCount: 0,
    };
  }

  if (!code.includes('main(')) {
    return {
      logs,
      error: {
        type: 'JavaCompilationError',
        message: 'javac error: Main method not found in class',
        suggestion: 'Declara el método de entrada: public static void main(String[] args) { ... }',
      },
      stateChanges: {},
      stepsCount: 0,
    };
  }

  // Check semicolons on statements
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw || raw.startsWith('//') || raw.startsWith('/*') || raw.endsWith('{') || raw.endsWith('}') || raw.startsWith('public') || raw.startsWith('class') || raw.startsWith('for') || raw.startsWith('while') || raw.startsWith('if') || raw.startsWith('else')) {
      continue;
    }
    if (!raw.endsWith(';')) {
      return {
        logs,
        error: {
          type: 'JavaCompilationError',
          message: `javac error: ';' expected at line ${i + 1}`,
          line: i + 1,
          suggestion: `En Java, todas las sentencias de asignación y llamadas a métodos deben terminar con punto y coma ';'.`,
        },
        stateChanges: {},
        stepsCount: 0,
      };
    }
  }

  // Extract body of main method
  const mainMatch = code.match(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{([\s\S]*)\}/);
  const mainBody = mainMatch ? mainMatch[1] : '';

  // Transpile Java body to JS for execution
  let converted = mainBody
    .replace(/System\.out\.println\s*\(/g, 'print(')
    .replace(/System\.out\.print\s*\(/g, 'print(')
    .replace(/\bint\s+/g, 'let ')
    .replace(/\bdouble\s+/g, 'let ')
    .replace(/\bfloat\s+/g, 'let ')
    .replace(/\bboolean\s+/g, 'let ')
    .replace(/\bString\s+/g, 'let ')
    .replace(/\bString\[\]\s+/g, 'let ');

  logs.push('[JAVAC] Compilando clase Java...');
  logs.push('[JAVAC] Build exitoso: 0 errores, 0 advertencias.');
  logs.push('[JVM] Ejecutando bytecode...');

  return runPythonScript(converted, state);
}

/**
 * Runner for Block-based visual scripts
 */
function runBlockScript(blockConfigJson: string, state: GameState): ScriptExecutionOutput {
  const logs: string[] = ['[MOTOR BLOQUES] Analizando grafo de bloques lógicos...'];
  try {
    const parsed = JSON.parse(blockConfigJson);
    let generatedPython = '';
    if (Array.isArray(parsed)) {
      for (const block of parsed) {
        if (block.type === 'align_solar') {
          const count = typeof block.count === 'number' ? block.count : 8;
          const angle = typeof block.angle === 'number' ? block.angle : 47.5;
          generatedPython += `for i in range(${count}):\n    ajustar_panel_solar(i, ${angle})\n`;
        } else if (block.type === 'purge_filters') {
          const filterList = Array.isArray(block.filters) ? block.filters : ["F_ALPHA", "F_BETA", "F_GAMMA", "F_DELTA"];
          generatedPython += `filtros = ${JSON.stringify(filterList)}\nfor f in filtros:\n    purgar_filtro_carbono(f)\n`;
          if (block.recirculation !== false) {
            generatedPython += `activar_recirculacion_o2()\n`;
          }
        } else if (block.type === 'calibrate_rcs') {
          const count = typeof block.count === 'number' ? block.count : 4;
          const pct = typeof block.thrustPct === 'number' ? block.thrustPct : 95;
          generatedPython += `for id in range(${count}):\n    calibrar_propulsor_rcs(id, ${pct})\n`;
          if (block.lockOrbit !== false) {
            generatedPython += `fijar_orbita_estable()\n`;
          }
        } else if (block.type === 'reactor_confinement') {
          const field = typeof block.magneticField === 'number' ? block.magneticField : 92;
          const cryo = typeof block.cryoLitres === 'number' ? block.cryoLitres : 55;
          generatedPython += `ajustar("CAMPO_MAGNETICO", ${field})\n`;
          if (block.stabilizer !== false) {
            generatedPython += `activar("SISTEMA_ESTABILIZADOR")\n`;
          }
          if (cryo > 0) {
            generatedPython += `inyectar_crio(${cryo})\n`;
          }
        } else if (block.type === 'defense_firewall') {
          const rule = block.rule || "BLOQUEAR_MALWARE";
          generatedPython += `aplicar_firewall("${rule}")\n`;
          if (block.port) {
            generatedPython += `aislar_puerto(${block.port})\n`;
          }
          if (block.purgeSubnet !== false) {
            generatedPython += `purgar_subred()\n`;
          }
        } else if (block.type === 'hyperion_cannon') {
          const power = typeof block.power === 'number' ? block.power : 95;
          generatedPython += `cargar_canon_iones(${power})\n`;
          if (block.militaryFirewall !== false) {
            generatedPython += `activar_firewall_militar()\n`;
          }
          if (block.squadron) {
            generatedPython += `lanzar_cazas("${block.squadron}")\n`;
          }
          generatedPython += `diagnostico()\n`;
        } else if (block.type === 'titan_drill') {
          if (block.thermalHeating !== false) {
            generatedPython += `activar_red_termica()\n`;
          }
          if (block.methanePumps !== false) {
            generatedPython += `activar_bombas_metano()\n`;
          }
          const depth = typeof block.depth === 'number' ? block.depth : 180;
          generatedPython += `iniciar_taladro(${depth})\n`;
        } else if (block.type === 'helios_shield') {
          const deflection = typeof block.deflection === 'number' ? block.deflection : 90;
          generatedPython += `ajustar_escudo_solar(${deflection})\n`;
          if (block.coronaCollector !== false) {
            generatedPython += `activar_colector_corona()\n`;
          }
          if (block.quantumNeutrino !== false) {
            generatedPython += `alinear_neutrinos()\n`;
          }
        }
      }
    }
    logs.push('[MOTOR BLOQUES] Bloques convertidos a código de aviónica con éxito.');
    const result = runPythonScript(generatedPython, state);
    return {
      ...result,
      logs: [...logs, ...result.logs],
    };
  } catch {
    return {
      logs,
      error: {
        type: 'RuntimeError',
        message: 'Error al interpretar los bloques lógicos.',
      },
      stateChanges: {},
      stepsCount: 0,
    };
  }
}

/**
 * Direct JavaScript executor for retro-compatibility
 */
function runJavaScriptDirect(code: string, state: GameState): ScriptExecutionOutput {
  return runPythonScript(code, state);
}
