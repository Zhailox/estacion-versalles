import { GameState, TerminalLine } from '../types/game';
import { soundFx } from '../audio/synth';
import { 
  resolvePath, 
  listDirectory, 
  getFile, 
  getNode, 
  writeFile, 
  removeNode, 
  createInitialVFS 
} from './vfs';
import { executeCodeWithLanguage, SupportedLanguage } from './multiLanguageEngine';

export interface CommandExecutionResult {
  updatedState: GameState;
  outputLines: Omit<TerminalLine, 'id' | 'timestamp'>[];
  didPassMission?: boolean;
}

export function executeCommandOrScript(
  input: string,
  state: GameState,
  isMultiLineScript: boolean = false,
  language: SupportedLanguage = 'python'
): CommandExecutionResult {
  const lines: Omit<TerminalLine, 'id' | 'timestamp'>[] = [];
  let nextState: GameState = JSON.parse(JSON.stringify(state));

  // Ensure VFS and currentDirectory are initialized
  if (!nextState.vfs) {
    nextState.vfs = createInitialVFS();
  }
  if (!nextState.currentDirectory) {
    nextState.currentDirectory = '/sys/power';
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { updatedState: state, outputLines: [] };
  }

  // If it's a multi-line script or explicitly identified as script block
  if (isMultiLineScript || (trimmed.includes('\n') && (
    trimmed.includes('for ') || 
    trimmed.includes('def ') || 
    trimmed.includes('class ') || 
    trimmed.includes('import ') ||
    trimmed.includes('let ') || 
    trimmed.includes('const ') || 
    trimmed.includes('System.out')
  ))) {
    // Detect language if not specified
    let targetLang: SupportedLanguage = language;
    if (trimmed.includes('def ') || trimmed.includes('print(') || trimmed.includes('range(') || trimmed.includes('import ')) {
      targetLang = 'python';
    } else if (trimmed.includes('class ') && trimmed.includes('public static void main')) {
      targetLang = 'java';
    }

    const execResult = executeCodeWithLanguage(trimmed, targetLang, nextState);
    if (execResult.error) {
      soundFx.playError();
      lines.push({ text: `>> ERROR DE EJECUCIÓN [${targetLang.toUpperCase()}]:`, type: 'error' });
      lines.push({ text: `  ${execResult.error.message}`, type: 'error' });
      if (execResult.error.suggestion) {
        lines.push({ text: `>> Sugerencia: ${execResult.error.suggestion}`, type: 'warn' });
      }
    } else {
      soundFx.playCommandExecute();
      lines.push({ text: `>> EJECUCIÓN EXITOSA [${targetLang.toUpperCase()}] (Pasos de cálculo: ${execResult.stepsCount})`, type: 'ok' });
    }

    execResult.logs.forEach(log => {
      lines.push({ text: `  ${log}`, type: 'ok' });
    });

    if (execResult.stateChanges) {
      nextState = {
        ...nextState,
        ...execResult.stateChanges,
        vitals: { ...nextState.vitals, ...(execResult.stateChanges.vitals || {}) },
        solarPanelsState: { ...nextState.solarPanelsState, ...(execResult.stateChanges.solarPanelsState || {}) },
        carbonFiltersState: { ...nextState.carbonFiltersState, ...(execResult.stateChanges.carbonFiltersState || {}) },
        reactorState: { ...nextState.reactorState, ...(execResult.stateChanges.reactorState || {}) },
        labState: { ...nextState.labState, ...(execResult.stateChanges.labState || {}) },
        bridgeState: { ...nextState.bridgeState, ...(execResult.stateChanges.bridgeState || {}) },
        shieldState: { ...nextState.shieldState, ...(execResult.stateChanges.shieldState || {}) },
        droneState: { ...nextState.droneState, ...(execResult.stateChanges.droneState || {}) },
        hyperionState: { ...nextState.hyperionState, ...(execResult.stateChanges.hyperionState || {}) },
        titanState: { ...nextState.titanState, ...(execResult.stateChanges.titanState || {}) },
        heliosState: { ...nextState.heliosState, ...(execResult.stateChanges.heliosState || {}) },
      };
    }

    return { updatedState: nextState, outputLines: lines };
  }

  // Split tokens for UNIX-like parsing
  const tokens = trimmed.split(/\s+/);
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  // 1. UNIX COMMAND: clear / limpiar / effacer / nettoyer
  if (cmd === 'clear' || cmd === 'limpiar' || cmd === 'cls' || cmd === 'effacer' || cmd === 'nettoyer') {
    return {
      updatedState: nextState,
      outputLines: [{ text: '__CLEAR__', type: 'system' }]
    };
  }

  // 1.2 CLI COMMAND: lang / language / langue / idioma
  if (cmd === 'lang' || cmd === 'language' || cmd === 'langue' || cmd === 'idioma') {
    const target = args[0]?.toLowerCase();
    if (target === 'fr' || target === 'francais' || target === 'français' || target === 'french') {
      try {
        localStorage.setItem('versalles_language_pref', 'fr');
        window.dispatchEvent(new CustomEvent('versalles_set_language', { detail: 'fr' }));
      } catch {}
      soundFx.playCommandExecute();
      lines.push(
        { text: '>> LANGUE MODIFIÉE AVEC SUCCÈS : Français 🇫🇷', type: 'ok' },
        { text: 'Interface et sous-systèmes désormais configurés en français.', type: 'system' }
      );
      return { updatedState: nextState, outputLines: lines };
    } else if (target === 'es' || target === 'español' || target === 'spanish' || target === 'venezuela') {
      try {
        localStorage.setItem('versalles_language_pref', 'es');
        window.dispatchEvent(new CustomEvent('versalles_set_language', { detail: 'es' }));
      } catch {}
      soundFx.playCommandExecute();
      lines.push(
        { text: '>> IDIOMA CAMBIADO CON ÉXITO: Español (Venezuela) 🇻🇪', type: 'ok' },
        { text: 'Interfaz y subsistemas configurados en español.', type: 'system' }
      );
      return { updatedState: nextState, outputLines: lines };
    } else {
      lines.push(
        { text: '═══ CONFIGURACIÓN DE IDIOMA // CONFIGURATION DE LA LANGUE ═══', type: 'system' },
        { text: 'Uso / Utilisation: lang <es | fr>', type: 'ok' },
        { text: '  lang es  — Español (Venezuela) 🇻🇪', type: 'ok' },
        { text: '  lang fr  — Français 🇫🇷', type: 'ok' }
      );
      return { updatedState: nextState, outputLines: lines };
    }
  }

  // 1.5. UNIX COMMAND: man / manual / help / ayuda / aide
  if (cmd === 'man' || cmd === 'manual' || cmd === 'help' || cmd === 'ayuda' || cmd === 'aide') {
    soundFx.playCommandExecute();
    const isFr = (typeof localStorage !== 'undefined' && localStorage.getItem('versalles_language_pref') === 'fr') || cmd === 'aide';
    if (isFr) {
      lines.push(
        { text: '═══ STATION VERSAILLES — MANUEL OPÉRATIONNEL UNIX & AVIONIQUE v3.4 ═══', type: 'system' },
        { text: 'COMMANDES DE NAVIGATION ET SYSTÈME DE FICHIERS (UNIX) :', type: 'system' },
        { text: '  ls [chemin]                       — Lister les fichiers et répertoires (/sys, /var, /scripts)', type: 'ok' },
        { text: '  cd <répertoire>                   — Changer de répertoire (ex: cd /sys/power)', type: 'ok' },
        { text: '  pwd                               — Afficher le répertoire de travail actuel', type: 'ok' },
        { text: '  cat <fichier>                     — Afficher le contenu d’un fichier de log ou script', type: 'ok' },
        { text: '  grep <motif> <fichier>            — Rechercher des lignes dans les fichiers de télémétrie', type: 'ok' },
        { text: '  nano <fichier.py>                 — Ouvrir le fichier dans l’Éditeur Aérospatial', type: 'ok' },
        { text: '  python <fichier.py>               — Exécuter le script en Python', type: 'ok' },
        { text: '  javac <fichier.java> / java <Cls> — Compiler et exécuter des modules en Java', type: 'ok' },
        { text: '  clear / effacer                   — Nettoyer l’écran de la console', type: 'system' },
        { text: 'ROUTINES DE TÉLÉMÉTRIE DIRECTE :', type: 'system' },
        { text: '  DIAGNOSTICO()                     — Analyser la télémétrie du secteur actuel', type: 'ok' },
        { text: '  AUTO_ESTABILIZAR()                — Routine autonome de stabilisation globale', type: 'ok' },
        { text: '  MODO_CRISIS()                     — Basculer la simulation d’événements en temps réel', type: 'ok' },
        { text: '  VITALES()                         — Bilan d’énergie, intégrité et oxygène', type: 'ok' },
        { text: '  lang <es | fr>                    — Changer la langue de l’interface', type: 'ok' },
        { text: '>> Cliquez sur le bouton [MANUEL] dans la barre du terminal pour ouvrir le guide interactif.', type: 'warn' }
      );
    } else {
      lines.push(
        { text: '═══ ESTACIÓN VERSALLES — MANUAL OPERATIVO UNIX & AVIONICS v3.4 ═══', type: 'system' },
        { text: 'COMANDOS DE NAVEGACIÓN Y SISTEMA DE ARCHIVOS (UNIX):', type: 'system' },
        { text: '  ls [ruta]                        — Listar ficheros y directorios (/sys, /var, /scripts)', type: 'ok' },
        { text: '  cd <directorio>                  — Cambiar de directorio (ej: cd /sys/power)', type: 'ok' },
        { text: '  pwd                              — Imprimir ruta de trabajo actual', type: 'ok' },
        { text: '  cat <archivo>                    — Mostrar contenido de un fichero de log o código', type: 'ok' },
        { text: '  grep <patrón> <archivo>          — Buscar líneas en ficheros de telemetría', type: 'ok' },
        { text: '  nano <archivo.py>                — Abrir fichero en el Editor de Código Aeroespacial', type: 'ok' },
        { text: '  python <archivo.py>              — Ejecutar script determinista en Python', type: 'ok' },
        { text: '  javac <archivo.java> / java <Cls> — Compilar y ejecutar módulos en Java', type: 'ok' },
        { text: '  clear / limpiar                  — Limpiar pantalla de la consola', type: 'system' },
        { text: 'RUTINAS DE TELEMETRÍA DIRECTA:', type: 'system' },
        { text: '  DIAGNOSTICO()                    — Analizar telemetría del sector actual', type: 'ok' },
        { text: '  AUTO_ESTABILIZAR()               — Rutina autónoma de estabilización global', type: 'ok' },
        { text: '  MODO_CRISIS()                    — Alternar simulación de eventos en tiempo real', type: 'ok' },
        { text: '  VITALES()                        — Resumen de energía, cascos y oxígeno', type: 'ok' },
        { text: '  lang <es | fr>                   — Cambiar idioma de la estación', type: 'ok' },
        { text: '>> Pulsa el botón [MANUAL] en la barra de la terminal para abrir el manual visual interactivo.', type: 'warn' }
      );
    }
    return { updatedState: nextState, outputLines: lines };
  }

  // 2. UNIX COMMAND: pwd
  if (cmd === 'pwd') {
    lines.push({ text: nextState.currentDirectory, type: 'ok' });
    return { updatedState: nextState, outputLines: lines };
  }

  // 3. UNIX COMMAND: cd [dir]
  if (cmd === 'cd') {
    const target = args[0] || '/';
    const targetResolved = resolvePath(nextState.currentDirectory, target);
    const node = getNode(nextState.vfs, targetResolved);

    if (!node) {
      lines.push({ text: `cd: no such file or directory: ${target}`, type: 'error' });
    } else if (node.type !== 'dir') {
      lines.push({ text: `cd: not a directory: ${target}`, type: 'error' });
    } else {
      nextState.currentDirectory = targetResolved;
      lines.push({ text: `Directorio de trabajo: ${targetResolved}`, type: 'system' });
    }
    return { updatedState: nextState, outputLines: lines };
  }

  // 4. UNIX COMMAND: ls [-la] [path]
  if (cmd === 'ls') {
    const pathArg = args.find(a => !a.startsWith('-')) || '.';
    const targetResolved = resolvePath(nextState.currentDirectory, pathArg);
    const { entries, error } = listDirectory(nextState.vfs, targetResolved);

    if (error) {
      lines.push({ text: error, type: 'error' });
    } else {
      lines.push({ text: `Contenido de [${targetResolved}]:`, type: 'system' });
      entries.forEach(entry => {
        if (entry.endsWith('/')) {
          lines.push({ text: `  [DIR]  \x1b[36m${entry}\x1b[0m`, type: 'ok' });
        } else if (entry.endsWith('.py')) {
          lines.push({ text: `  [PY]   ${entry} (Python Script)`, type: 'ok' });
        } else if (entry.endsWith('.java')) {
          lines.push({ text: `  [JAVA] ${entry} (Java Source)`, type: 'ok' });
        } else if (entry.endsWith('.log')) {
          lines.push({ text: `  [LOG]  ${entry} (Log de Telemetría)`, type: 'warn' });
        } else {
          lines.push({ text: `  [FILE] ${entry}`, type: 'system' });
        }
      });
    }
    return { updatedState: nextState, outputLines: lines };
  }

  // 5. UNIX COMMAND: cat <file>
  if (cmd === 'cat') {
    if (!args[0]) {
      lines.push({ text: 'cat: falta el nombre del archivo. Uso: cat <archivo>', type: 'warn' });
      return { updatedState: nextState, outputLines: lines };
    }
    const targetResolved = resolvePath(nextState.currentDirectory, args[0]);
    let file = getFile(nextState.vfs, targetResolved);
    let displayPath = targetResolved;
    if (!file) {
      const fallbacks = [
        `/sys/power/${args[0]}`,
        `/sys/life_support/${args[0]}`,
        `/sys/reactor/${args[0]}`,
        `/sys/propulsion/${args[0]}`,
        `/sys/defense/${args[0]}`,
        `/var/log/${args[0]}`,
        `/scripts/${args[0]}`,
      ];
      for (const fb of fallbacks) {
        const found = getFile(nextState.vfs, fb);
        if (found) {
          file = found;
          displayPath = fb;
          break;
        }
      }
    }

    if (!file) {
      lines.push({ text: `cat: ${args[0]}: No existe el fichero o el directorio`, type: 'error' });
    } else {
      lines.push({ text: `─── ${displayPath} (${file.size} bytes) ───`, type: 'system' });
      file.content.split('\n').forEach(line => {
        lines.push({ text: line, type: 'ok' });
      });
    }
    return { updatedState: nextState, outputLines: lines };
  }

  // 6. UNIX COMMAND: grep <pattern> <file>
  if (cmd === 'grep') {
    if (args.length < 2) {
      lines.push({ text: 'grep: uso: grep <patrón> <archivo>', type: 'warn' });
      return { updatedState: nextState, outputLines: lines };
    }
    const pattern = args[0];
    const targetResolved = resolvePath(nextState.currentDirectory, args[1]);
    const file = getFile(nextState.vfs, targetResolved);

    if (!file) {
      lines.push({ text: `grep: ${args[1]}: No existe el fichero`, type: 'error' });
    } else {
      const fileLines = file.content.split('\n');
      const matches = fileLines.filter(l => l.toLowerCase().includes(pattern.toLowerCase()));
      if (matches.length === 0) {
        lines.push({ text: `grep: ninguna coincidencia para '${pattern}' en ${args[1]}`, type: 'system' });
      } else {
        lines.push({ text: `─── Coincidencias en ${args[1]} (${matches.length}) ───`, type: 'system' });
        matches.forEach(m => lines.push({ text: `  >> ${m}`, type: 'ok' }));
      }
    }
    return { updatedState: nextState, outputLines: lines };
  }

  // 7. UNIX COMMAND: nano / edit <file>
  if (cmd === 'nano' || cmd === 'edit') {
    const fileName = args[0] || 'script.py';
    const targetResolved = resolvePath(nextState.currentDirectory, fileName);
    let file = getFile(nextState.vfs, targetResolved);

    if (!file) {
      // Create empty file
      const writeRes = writeFile(nextState.vfs, targetResolved, `# Nuevo archivo: ${fileName}\n`);
      nextState.vfs = writeRes.vfs;
      file = getFile(nextState.vfs, targetResolved);
    }

    nextState.editorFile = targetResolved;
    if (fileName.endsWith('.py')) nextState.editorLanguage = 'python';
    else if (fileName.endsWith('.java')) nextState.editorLanguage = 'java';
    else nextState.editorLanguage = 'javascript';

    lines.push({ text: `[EDITOR] Abriendo '${targetResolved}' en el Editor de Código Aeroespacial...`, type: 'system' });
    lines.push({ text: `>> Cambia a la pestaña [SCRIPT] para programar y compilar.`, type: 'warn' });
    return { updatedState: nextState, outputLines: lines };
  }

  // 8. EXECUTION COMMAND: python <file.py>
  if (cmd === 'python' || cmd === 'python3') {
    if (!args[0]) {
      lines.push({ text: 'Python 3.12 (Avionics Embedded Runtime - Offline Deterministic)', type: 'system' });
      lines.push({ text: 'Uso: python <archivo.py> o escribe código en la pestaña [EDITOR SCRIPT]', type: 'warn' });
      return { updatedState: nextState, outputLines: lines };
    }

    const targetResolved = resolvePath(nextState.currentDirectory, args[0]);
    let file = getFile(nextState.vfs, targetResolved);
    let runPath = targetResolved;
    if (!file) {
      const fallbacks = [
        `/sys/power/${args[0]}`,
        `/sys/life_support/${args[0]}`,
        `/sys/reactor/${args[0]}`,
        `/sys/propulsion/${args[0]}`,
        `/scripts/${args[0]}`,
      ];
      for (const fb of fallbacks) {
        const found = getFile(nextState.vfs, fb);
        if (found) {
          file = found;
          runPath = fb;
          break;
        }
      }
    }

    if (!file) {
      lines.push({ text: `python: can't open file '${args[0]}': [Errno 2] No such file or directory`, type: 'error' });
      return { updatedState: nextState, outputLines: lines };
    }

    lines.push({ text: `>> python ${runPath}`, type: 'command' });
    const execResult = executeCodeWithLanguage(file.content, 'python', nextState);

    if (execResult.error) {
      soundFx.playError();
      lines.push({ text: `>> ERROR EN SCRIPT PYTHON:`, type: 'error' });
      lines.push({ text: `  ${execResult.error.message}`, type: 'error' });
      if (execResult.error.suggestion) {
        lines.push({ text: `>> Sugerencia: ${execResult.error.suggestion}`, type: 'warn' });
      }
    } else {
      soundFx.playCommandExecute();
      lines.push({ text: `>> [PYTHON OK] Proceso terminado con código 0 (${execResult.stepsCount} instrucciones)`, type: 'ok' });
    }

    execResult.logs.forEach(log => lines.push({ text: `  ${log}`, type: 'ok' }));

    if (execResult.stateChanges) {
      nextState = {
        ...nextState,
        ...execResult.stateChanges,
        vitals: { ...nextState.vitals, ...(execResult.stateChanges.vitals || {}) },
        solarPanelsState: { ...nextState.solarPanelsState, ...(execResult.stateChanges.solarPanelsState || {}) },
        carbonFiltersState: { ...nextState.carbonFiltersState, ...(execResult.stateChanges.carbonFiltersState || {}) },
        reactorState: { ...nextState.reactorState, ...(execResult.stateChanges.reactorState || {}) },
        labState: { ...nextState.labState, ...(execResult.stateChanges.labState || {}) },
        bridgeState: { ...nextState.bridgeState, ...(execResult.stateChanges.bridgeState || {}) },
        shieldState: { ...nextState.shieldState, ...(execResult.stateChanges.shieldState || {}) },
        droneState: { ...nextState.droneState, ...(execResult.stateChanges.droneState || {}) },
        hyperionState: { ...nextState.hyperionState, ...(execResult.stateChanges.hyperionState || {}) },
        titanState: { ...nextState.titanState, ...(execResult.stateChanges.titanState || {}) },
        heliosState: { ...nextState.heliosState, ...(execResult.stateChanges.heliosState || {}) },
      };
    }
    return { updatedState: nextState, outputLines: lines };
  }

  // 9. EXECUTION COMMAND: javac <file.java> / java <Class>
  if (cmd === 'javac') {
    if (!args[0]) {
      lines.push({ text: 'javac: error: no source files specified. Uso: javac <archivo.java>', type: 'error' });
      return { updatedState: nextState, outputLines: lines };
    }
    const targetResolved = resolvePath(nextState.currentDirectory, args[0]);
    const file = getFile(nextState.vfs, targetResolved);
    if (!file) {
      lines.push({ text: `javac: file not found: ${args[0]}`, type: 'error' });
      return { updatedState: nextState, outputLines: lines };
    }

    lines.push({ text: `>> javac ${args[0]}`, type: 'command' });
    const execResult = executeCodeWithLanguage(file.content, 'java', nextState);

    if (execResult.error) {
      soundFx.playError();
      lines.push({ text: `  ${execResult.error.message}`, type: 'error' });
      if (execResult.error.suggestion) lines.push({ text: `>> Sugerencia: ${execResult.error.suggestion}`, type: 'warn' });
    } else {
      soundFx.playCommandExecute();
      lines.push({ text: `[JAVAC OK] Compilación completada. Archivo .class generado.`, type: 'ok' });
    }
    return { updatedState: nextState, outputLines: lines };
  }

  if (cmd === 'java') {
    const className = args[0] || 'CalibradorSolar';
    const targetResolved = resolvePath(nextState.currentDirectory, `${className}.java`);
    const file = getFile(nextState.vfs, targetResolved) || getFile(nextState.vfs, resolvePath('/sys/power', 'calibrate_solar.java'));

    if (!file) {
      lines.push({ text: `Error: Could not find or load main class ${className}`, type: 'error' });
      return { updatedState: nextState, outputLines: lines };
    }

    lines.push({ text: `>> java ${className}`, type: 'command' });
    const execResult = executeCodeWithLanguage(file.content, 'java', nextState);

    execResult.logs.forEach(log => lines.push({ text: `  ${log}`, type: 'ok' }));
    if (execResult.stateChanges) {
      nextState = {
        ...nextState,
        ...execResult.stateChanges,
        vitals: { ...nextState.vitals, ...(execResult.stateChanges.vitals || {}) },
      };
    }
    return { updatedState: nextState, outputLines: lines };
  }

  // 10. UNIX COMMAND: touch <file>
  if (cmd === 'touch') {
    if (!args[0]) {
      lines.push({ text: 'touch: falta el operando de archivo', type: 'warn' });
      return { updatedState: nextState, outputLines: lines };
    }
    const targetResolved = resolvePath(nextState.currentDirectory, args[0]);
    const res = writeFile(nextState.vfs, targetResolved, '');
    if (res.error) {
      lines.push({ text: res.error, type: 'error' });
    } else {
      nextState.vfs = res.vfs;
      lines.push({ text: `Fichero '${targetResolved}' creado.`, type: 'ok' });
    }
    return { updatedState: nextState, outputLines: lines };
  }

  // 11. UNIX COMMAND: rm <file>
  if (cmd === 'rm') {
    if (!args[0]) {
      lines.push({ text: 'rm: falta el operando de archivo', type: 'warn' });
      return { updatedState: nextState, outputLines: lines };
    }
    const targetResolved = resolvePath(nextState.currentDirectory, args[0]);
    const res = removeNode(nextState.vfs, targetResolved);
    if (res.error) {
      lines.push({ text: res.error, type: 'error' });
    } else {
      nextState.vfs = res.vfs;
      lines.push({ text: `Fichero '${targetResolved}' eliminado.`, type: 'ok' });
    }
    return { updatedState: nextState, outputLines: lines };
  }

  // Normalize single line command for legacy avionics commands
  const upper = trimmed.toUpperCase().replace(/\s+/g, ' ');

  // Built-in utility commands
  if (upper === 'AYUDA' || upper === 'AYUDA()' || upper === 'HELP' || upper === 'MAN') {
    soundFx.playCommandExecute();
    lines.push(
      { text: '═══ ESTACIÓN VERSALLES — TERMINAL OPERATIVA UNIX & AVIONICS v3.4 ═══', type: 'system' },
      { text: 'COMANDOS DE NAVEGACIÓN Y SISTEMA DE ARCHIVOS (UNIX):', type: 'system' },
      { text: '  ls [ruta]                        — Listar ficheros y directorios (/sys, /var, /scripts)', type: 'ok' },
      { text: '  cd <directorio>                  — Cambiar de directorio (ej: cd /sys/power)', type: 'ok' },
      { text: '  pwd                              — Imprimir ruta de trabajo actual', type: 'ok' },
      { text: '  cat <archivo>                    — Mostrar contenido de un fichero de log o código', type: 'ok' },
      { text: '  grep <patrón> <archivo>          — Buscar líneas en ficheros de telemetría', type: 'ok' },
      { text: '  nano <archivo.py>                — Abrir fichero en el Editor de Código Aeroespacial', type: 'ok' },
      { text: '  python <archivo.py>              — Ejecutar script determinista en Python', type: 'ok' },
      { text: '  javac <archivo.java> / java <Cls> — Compilar y ejecutar módulos en Java', type: 'ok' },
      { text: '  clear / limpiar                  — Limpiar pantalla de la consola', type: 'system' },
      { text: 'RUTINAS DE TELEMETRÍA DIRECTA:', type: 'system' },
      { text: '  DIAGNOSTICO()                    — Analizar telemetría del sector actual', type: 'ok' },
      { text: '  AUTO_ESTABILIZAR()               — Rutina autónoma de estabilización global', type: 'ok' },
      { text: '  MODO_CRISIS()                    — Alternar simulación de eventos en tiempo real', type: 'ok' },
      { text: '  VITALES()                        — Resumen de energía, cascos y oxígeno', type: 'ok' },
      { text: '>> Puedes alternar a la pestaña [SCRIPT] para programar en Python o Java.', type: 'warn' }
    );
    return { updatedState: nextState, outputLines: lines };
  }


  // AUTO_ESTABILIZAR command
  if (upper === 'AUTO_ESTABILIZAR()' || upper === 'AUTO_ESTABILIZAR') {
    soundFx.playCommandExecute();
    nextState.vitals.coreTemp = 13200;
    nextState.vitals.magneticField = 92;
    nextState.vitals.shields = Math.min(100, nextState.vitals.shields + 15);
    nextState.vitals.oxygen = Math.min(100, nextState.vitals.oxygen + 10);
    nextState.vitals.activeThreatLevel = 'NOMINAL';
    nextState.reactorState.magneticField = 92;
    nextState.reactorState.stabilizerActive = true;
    lines.push(
      { text: '═══ EJECUTANDO PROTOCOLO AUTÓNOMO: AUTO_ESTABILIZAR() ═══', type: 'system' },
      { text: '[ ■■■■■■■■■■ ] Calibrando bobinas superconductoras... OK', type: 'ok' },
      { text: '[ ■■■■■■■■■■ ] Purgando interferencias en bus de datos... OK', type: 'ok' },
      { text: '[ ■■■■■■■■■■ ] Regulando presión barométrica en soporte vital... OK', type: 'ok' },
      { text: '✓ ESTACIÓN ESTABILIZADA: Signos vitales restaurados a parámetros nominales.', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // MODO_CRISIS command
  if (upper === 'MODO_CRISIS()' || upper === 'MODO_CRISIS' || upper === 'MODO_SUPERVIVENCIA()' || upper === 'MODO_SUPERVIVENCIA') {
    soundFx.playBeep(950, 0.05);
    nextState.survivalMode = !nextState.survivalMode;
    lines.push(
      { text: `SISTEMA > MODO DE CRISIS / SUPERVIVENCIA: ${nextState.survivalMode ? 'ACTIVADO [ALERTA CONTINUA]' : 'DESACTIVADO [MODO NORMAL]'}`, type: nextState.survivalMode ? 'warn' : 'ok' },
      { text: nextState.survivalMode ? '[ALERTA] La estación sufrirá anomalías y fallos aleatorios en tiempo real.' : 'Los sistemas vuelven a la velocidad de respuesta estándar.', type: 'system' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // INYECTAR_CRIO command
  const crioMatch = trimmed.match(/^INYECTAR_CRIO\s*\(\s*(\d+)\s*\)$/i);
  if (crioMatch) {
    soundFx.playCommandExecute();
    const qty = parseInt(crioMatch[1], 10);
    const reduction = qty * 45;
    nextState.vitals.coreTemp = Math.max(11000, nextState.vitals.coreTemp - reduction);
    lines.push(
      { text: `SISTEMA > Inyectando ${qty} litros de helio criogénico al núcleo...`, type: 'system' },
      { text: `[ ■■■■■■■■■■ ] Válvulas criogénicas purgadas.`, type: 'ok' },
      { text: `Temperatura reducida a ${nextState.vitals.coreTemp}°C (Reducción de -${reduction}°C) ✓`, type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // ══════════════════════════════════════════════════════════════
  // COMANDOS DEL ACORAZADO HYPERION-9
  // ══════════════════════════════════════════════════════════════
  const canonMatch = trimmed.match(/^CARGAR_CANON_IONES\s*\(\s*(\d+)\s*\)$/i);
  if (canonMatch) {
    const val = parseInt(canonMatch[1], 10);
    soundFx.playCommandExecute();
    nextState.hyperionState.ionCannonCharged = val >= 90;
    lines.push(
      { text: `HYPERION-9 > Alimentando bobinas del Cañón de Iones Pesado al ${val}%...`, type: 'system' },
      { text: val >= 90 ? '[ ■■■■■■■■■■ ] 100% — Condensadores cargados. Vector fijado en 044-T. ✓' : `[ALERTA] Carga insuficiente (${val}%). Requiere ≥ 90% para disparo.`, type: val >= 90 ? 'success' : 'warn' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  if (upper === 'ACTIVAR_FIREWALL_MILITAR()' || upper === 'ACTIVAR_FIREWALL_MILITAR') {
    soundFx.playCommandExecute();
    nextState.hyperionState.militaryFirewallActive = true;
    nextState.vitals.shields = Math.min(100, nextState.vitals.shields + 20);
    lines.push(
      { text: 'HYPERION-9 > Desplegando encriptación militar CORTEX-9...', type: 'system' },
      { text: '[ ■■■■■■■■■■ ] Algoritmo cuántico activo. Tráfico hostil EMP bloqueado. ✓', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  const cazasMatch = trimmed.match(/^LANZAR_CAZAS\s*\(\s*["']?([A-Za-z0-9_-]+)["']?\s*\)$/i);
  if (cazasMatch) {
    const escuadron = cazasMatch[1].toUpperCase();
    soundFx.playCommandExecute();
    nextState.hyperionState.fightersLaunched = true;
    lines.push(
      { text: `HYPERION-9 > Catapultas electromagnéticas presurizadas.`, type: 'system' },
      { text: `[ ■■■■■■■■■■ ] Escuadrón ${escuadron} desplegado en formación de defensa orbital. ✓`, type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // ══════════════════════════════════════════════════════════════
  // COMANDOS DEL PUESTO MINERO TITÁN-IV
  // ══════════════════════════════════════════════════════════════
  if (upper === 'ACTIVAR_BOMBAS_METANO()' || upper === 'ACTIVAR_BOMBAS_METANO') {
    soundFx.playCommandExecute();
    nextState.titanState.methanePumpsActive = true;
    nextState.vitals.energy = Math.min(100, nextState.vitals.energy + 20);
    lines.push(
      { text: 'TITÁN-IV > Presurizando bombas sumergibles en Kraken Mare...', type: 'system' },
      { text: '[ ■■■■■■■■■■ ] Caudal de hidrocarburos restablecido a 4,200 L/min. ✓', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  const taladroMatch = trimmed.match(/^INICIAR_TALADRO\s*\(\s*(\d+)\s*\)$/i);
  if (taladroMatch) {
    const depth = parseInt(taladroMatch[1], 10);
    soundFx.playCommandExecute();
    nextState.titanState.cryoDrillDepth = depth;
    lines.push(
      { text: `TITÁN-IV > Activando cabezal de diamante térmico...`, type: 'system' },
      { text: `[ ■■■■■■■■■■ ] Profundidad alcanzada: ${depth} metros bajo el hielo. ${depth >= 150 ? 'Bolsa de gas asegurada. ✓' : '[ALERTA] Se requieren al menos 150m.'}`, type: depth >= 150 ? 'success' : 'warn' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  if (upper === 'ACTIVAR_RED_TERMICA()' || upper === 'ACTIVAR_RED_TERMICA') {
    soundFx.playCommandExecute();
    nextState.titanState.thermalHeatingOnline = true;
    lines.push(
      { text: 'TITÁN-IV > Calefacción geotérmica activada en todos los módulos.', type: 'system' },
      { text: '[ ■■■■■■■■■■ ] Temperatura estabilizada a +21°C. Alerta de congelamiento disipada. ✓', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // ══════════════════════════════════════════════════════════════
  // COMANDOS DEL LABORATORIO SOLAR HELIOS-PRIME
  // ══════════════════════════════════════════════════════════════
  const solarShieldMatch = trimmed.match(/^AJUSTAR_ESCUDO_SOLAR\s*\(\s*(\d+)\s*\)$/i);
  if (solarShieldMatch) {
    const def = parseInt(solarShieldMatch[1], 10);
    soundFx.playCommandExecute();
    nextState.heliosState.solarShieldDeflection = def;
    lines.push(
      { text: `HELIOS-PRIME > Reorientando paneles de grafeno cuántico a ${def}% de deflexión...`, type: 'system' },
      { text: def >= 85 ? `[ ■■■■■■■■■■ ] Radiación coronal rechazada. Temperatura de cascos nominal. ✓` : `[ALERTA] Deflexión insuficiente (${def}%). Requiere ≥ 85% para resistir la fulguración.`, type: def >= 85 ? 'success' : 'warn' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  if (upper === 'ACTIVAR_COLECTOR_CORONA()' || upper === 'ACTIVAR_COLECTOR_CORONA') {
    soundFx.playCommandExecute();
    nextState.heliosState.coronaCollectorOnline = true;
    nextState.vitals.energy = 100;
    lines.push(
      { text: 'HELIOS-PRIME > Toberas magnéticas absorbiendo plasma coronal...', type: 'system' },
      { text: '[ ■■■■■■■■■■ ] Acumuladores solares cargados al 100% de capacidad. ✓', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  if (upper === 'ALINEAR_NEUTRINOS()' || upper === 'ALINEAR_NEUTRINOS') {
    soundFx.playCommandExecute();
    nextState.heliosState.quantumNeutrinoAligned = true;
    lines.push(
      { text: 'HELIOS-PRIME > Sincronizando telescopio cuántico de neutrinos...', type: 'system' },
      { text: '[ ■■■■■■■■■■ ] Enlace de telemetría de espacio profundo enlazado con la Tierra. ✓', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  if (upper === 'VITALES' || upper === 'VITALES()' || upper === 'STATUS') {
    soundFx.playCommandExecute();
    lines.push(
      { text: '═══ TELEMETRÍA GLOBAL DE LA ESTACIÓN VERSALLES ═══', type: 'system' },
      { text: `  ENERGÍA PRINCIPAL:    ${nextState.vitals.energy}%`, type: nextState.vitals.energy < 50 ? 'warn' : 'ok' },
      { text: `  TEMPERATURA NÚCLEO:   ${nextState.vitals.coreTemp}°C [Límite: 15,000°C]`, type: nextState.vitals.coreTemp > 14500 ? 'error' : 'ok' },
      { text: `  CAMPO MAGNÉTICO:      ${nextState.reactorState.magneticField}% [Mínimo: 88%]`, type: nextState.reactorState.magneticField < 88 ? 'error' : 'ok' },
      { text: `  ESCUDOS DEFLECTORES:  ${nextState.vitals.shields}%`, type: nextState.vitals.shields < 70 ? 'warn' : 'ok' },
      { text: `  SOPORTE VITAL (O₂):   ${nextState.vitals.oxygen}%`, type: nextState.vitals.oxygen < 80 ? 'warn' : 'ok' },
      { text: `  NIVEL DE AMENAZA:     ${nextState.vitals.activeThreatLevel}`, type: nextState.vitals.activeThreatLevel === 'NOMINAL' ? 'ok' : 'error' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  if (upper === 'LIMPIAR' || upper === 'LIMPIAR()' || upper === 'CLEAR') {
    return {
      updatedState: nextState,
      outputLines: [{ text: '__CLEAR__', type: 'system' }],
    };
  }

  // DIAGNOSTICO command
  if (upper === 'DIAGNOSTICO()' || upper === 'DIAGNOSTICO' || upper === 'DIAGNÓSTICO()') {
    soundFx.playCommandExecute();
    const sec = nextState.currentSectorId;
    if (sec === 'reactor') {
      const isNominal = nextState.reactorState.magneticField >= 88 && nextState.reactorState.stabilizerActive;
      lines.push(
        { text: '═══ DIAGNÓSTICO: NÚCLEO DEL REACTOR ═══', type: 'system' },
        { text: `  Campo Magnético:     ${nextState.reactorState.magneticField}% ${nextState.reactorState.magneticField >= 88 ? '✓ [NOMINAL]' : '✗ [CRÍTICO: Mínimo 88%]' }`, type: nextState.reactorState.magneticField >= 88 ? 'ok' : 'error' },
        { text: `  Sistema Estabilizador: ${nextState.reactorState.stabilizerActive ? 'ACTIVO ✓' : 'INACTIVO ✗'}`, type: nextState.reactorState.stabilizerActive ? 'ok' : 'warn' },
        { text: `  Oscilación de Plasma:  ±${nextState.reactorState.plasmaOscillation.toFixed(1)}%`, type: nextState.reactorState.plasmaOscillation <= 5 ? 'ok' : 'error' },
        { text: `  Temperatura Núcleo:    ${nextState.vitals.coreTemp}°C`, type: nextState.vitals.coreTemp > 14000 ? 'warn' : 'ok' },
        { text: isNominal ? 'ESTADO: Todos los parámetros del reactor están estabilizados.' : 'ACCIÓN REQUERIDA: Elevar campo a ≥88% y activar estabilizador.', type: isNominal ? 'success' : 'warn' }
      );
    } else if (sec === 'lab') {
      lines.push(
        { text: '═══ DIAGNÓSTICO: LABORATORIO DE DATOS ═══', type: 'system' },
        { text: `  Puerta AND [Sector 12]: ${nextState.labState.andGateRepaired ? 'OPERACIONAL ✓' : 'DESCONECTADA ✗'}`, type: nextState.labState.andGateRepaired ? 'ok' : 'error' },
        { text: `  Validación Booleana:     ${nextState.labState.logicTruthTableOk ? 'TABLA DE VERDAD VERIFICADA ✓' : 'PENDIENTE DE PRUEBA ✗'}`, type: nextState.labState.logicTruthTableOk ? 'ok' : 'warn' },
        { text: `  Navegación Secundaria:  ${nextState.labState.secondaryNavOnline ? 'ONLINE ✓' : 'OFFLINE ✗'}`, type: nextState.labState.secondaryNavOnline ? 'ok' : 'error' }
      );
    } else if (sec === 'bridge') {
      lines.push(
        { text: '═══ DIAGNÓSTICO: PUENTE DE MANDO ═══', type: 'system' },
        { text: `  Propulsores Calibrados: [${nextState.bridgeState.thrustersCalibrated.join('%, ')}%]`, type: nextState.bridgeState.thrustersCalibrated.length === 4 ? 'ok' : 'warn' },
        { text: `  Decaimiento Orbital:    ${nextState.bridgeState.orbitalDecayRate} m/s²`, type: nextState.bridgeState.orbitalDecayRate === 0 ? 'ok' : 'error' },
        { text: `  Vector de Trayectoria:  ${nextState.bridgeState.trajectorySafe ? 'SEGURO ✓' : 'PELIGRO DE COLISIÓN ✗'}`, type: nextState.bridgeState.trajectorySafe ? 'ok' : 'error' }
      );
    } else if (sec === 'shields') {
      lines.push(
        { text: '═══ DIAGNÓSTICO: MATRIZ DE ESCUDOS & CIBER-OPS ═══', type: 'system' },
        { text: `  Reglas de Firewall:      ${nextState.shieldState.firewallRulesActive ? 'ACTIVAS ✓' : 'INACTIVAS ✗'}`, type: nextState.shieldState.firewallRulesActive ? 'ok' : 'error' },
        { text: `  Intrusión Malware Némesis: ${nextState.shieldState.intrusionSuppressed ? 'SUPRIMIDA ✓' : 'EN PROGRESO ✗'}`, type: nextState.shieldState.intrusionSuppressed ? 'ok' : 'error' },
        { text: `  Integridad de Escudos:    ${nextState.vitals.shields}%`, type: nextState.vitals.shields >= 85 ? 'ok' : 'warn' }
      );
    } else {
      lines.push(
        { text: '═══ DIAGNÓSTICO: BAHÍA DE DRONES & SOPORTE VITAL ═══', type: 'system' },
        { text: `  Cola de Drones:         ${nextState.droneState.dronesSorted ? 'PRIORIZADA POR OXÍGENO ✓' : 'DESORDENADA ✗'}`, type: nextState.droneState.dronesSorted ? 'ok' : 'warn' },
        { text: `  Válvulas de O₂:         ${nextState.droneState.oxygenPumpsRouted ? 'SELLADAS & SELLADAS ✓' : 'FUGA ACTIVA EN SECTOR 4 ✗'}`, type: nextState.droneState.oxygenPumpsRouted ? 'ok' : 'error' },
        { text: `  Nivel de Oxígeno:       ${nextState.vitals.oxygen}%`, type: nextState.vitals.oxygen >= 90 ? 'ok' : 'error' }
      );
    }
    return { updatedState: nextState, outputLines: lines };
  }

  // AJUSTAR command (e.g. AJUSTAR(CAMPO_MAGNETICO, 92))
  const ajustarMatch = trimmed.match(/^AJUSTAR\s*\(\s*([A-Za-z_]+)\s*,\s*(\d+)\s*\)$/i);
  if (ajustarMatch) {
    const param = ajustarMatch[1].toUpperCase();
    const val = parseInt(ajustarMatch[2], 10);

    if (param.includes('CAMPO') || param.includes('MAGNETICO')) {
      nextState.reactorState.magneticField = val;
      if (val >= 88) {
        soundFx.playCommandExecute();
        nextState.vitals.coreTemp = Math.max(12500, nextState.vitals.coreTemp - 1500);
        nextState.vitals.energy = Math.min(100, nextState.vitals.energy + 10);
        lines.push(
          { text: `SISTEMA > Ajustando CAMPO_MAGNETICO a ${val}%...`, type: 'system' },
          { text: `[ ■■■■■■■■■■ ] 100% — Confinamiento Magnético: ${val}% ✓`, type: 'ok' },
          { text: `Flujo estabilizándose. Temperatura disminuyendo a ${nextState.vitals.coreTemp}°C.`, type: 'success' }
        );
      } else {
        soundFx.playError();
        lines.push(
          { text: `ADVERTENCIA: Campo establecido en ${val}%.`, type: 'warn' },
          { text: `ERROR: Umbral de seguridad insuficiente. El confinamiento requiere ≥ 88%.`, type: 'error' }
        );
      }
      return { updatedState: nextState, outputLines: lines };
    }
  }

  // ACTIVAR command
  const activarMatch = trimmed.match(/^ACTIVAR\s*\(\s*([A-Za-z_]+)\s*\)$/i);
  if (activarMatch) {
    const target = activarMatch[1].toUpperCase();
    if (target.includes('ESTABILIZADOR')) {
      soundFx.playCommandExecute();
      nextState.reactorState.stabilizerActive = true;
      nextState.reactorState.plasmaOscillation = 2.4;
      lines.push(
        { text: 'SISTEMA > Sincronizando SISTEMA_ESTABILIZADOR...', type: 'system' },
        { text: '[ ■■■■■■■■■■ ] Amplitud armónica compensada.', type: 'ok' },
        { text: 'Sistema Estabilizador: ONLINE ✓', type: 'success' },
        { text: 'Oscilación de plasma reducida de ±12% a ±2.4% [NOMINAL] ✓', type: 'success' }
      );
      return { updatedState: nextState, outputLines: lines };
    }
    if (target.includes('NAVEGACION') || target.includes('SECUNDARIA')) {
      if (!nextState.labState.andGateRepaired || !nextState.labState.logicTruthTableOk) {
        soundFx.playError();
        lines.push(
          { text: 'ERROR: No se puede activar la navegación secundaria.', type: 'error' },
          { text: 'Fallo lógico previo: Repara y prueba la compuerta AND primero.', type: 'warn' }
        );
        return { updatedState: nextState, outputLines: lines };
      }
      soundFx.playSuccess();
      nextState.labState.secondaryNavOnline = true;
      nextState.vitals.cpuLoad = 42;
      lines.push(
        { text: 'SISTEMA > Inicializando bus de navegación secundaria...', type: 'system' },
        { text: 'Conmutador lógico conectado. Enrutamiento óptico listo.', type: 'ok' },
        { text: 'NAVEGACIÓN SECUNDARIA: ONLINE ✓', type: 'success' }
      );
      return { updatedState: nextState, outputLines: lines };
    }
  }

  // REPARAR(PUERTA_LOGICA, "AND", 12)
  const repararMatch = trimmed.match(/^REPARAR\s*\(\s*([A-Za-z_]+)\s*,\s*["']?([A-Za-z_]+)["']?\s*,\s*(\d+)\s*\)$/i);
  if (repararMatch) {
    const comp = repararMatch[1].toUpperCase();
    const type = repararMatch[2].toUpperCase();
    const sec = parseInt(repararMatch[3], 10);

    if (comp.includes('PUERTA') && type === 'AND' && sec === 12) {
      soundFx.playCommandExecute();
      nextState.labState.andGateRepaired = true;
      lines.push(
        { text: `SISTEMA > Aislando Sector ${sec} e inyectando microrobos de soldadura...`, type: 'system' },
        { text: '[ ■■■■■■■■□□ ] Reemplazando compuerta lógica AND...', type: 'ok' },
        { text: '[ ■■■■■■■■■■ ] 100%', type: 'ok' },
        { text: `Compuerta AND [Sector ${sec}]: REPARADA ✓`, type: 'success' },
        { text: 'Sugerencia: Ejecuta PROBAR(PUERTA_LOGICA) para verificar la tabla de verdad.', type: 'system' }
      );
      return { updatedState: nextState, outputLines: lines };
    }
  }

  // PROBAR(PUERTA_LOGICA)
  if (upper.startsWith('PROBAR')) {
    if (!nextState.labState.andGateRepaired) {
      soundFx.playError();
      lines.push(
        { text: 'ERROR: Circuito abierto. La compuerta debe ser reparada antes de probarse.', type: 'error' }
      );
      return { updatedState: nextState, outputLines: lines };
    }
    soundFx.playCommandExecute();
    nextState.labState.logicTruthTableOk = true;
    lines.push(
      { text: '═══ VERIFICACIÓN DE TABLA DE VERDAD BOOLEANA: AND ═══', type: 'system' },
      { text: '  AND(0, 0) => 0   [CORRECTO ✓]', type: 'ok' },
      { text: '  AND(0, 1) => 0   [CORRECTO ✓]', type: 'ok' },
      { text: '  AND(1, 0) => 0   [CORRECTO ✓]', type: 'ok' },
      { text: '  AND(1, 1) => 1   [CORRECTO ✓]', type: 'ok' },
      { text: 'LÓGICA VERIFICADA: Todas las operaciones booleanas son válidas.', type: 'success' },
      { text: 'Ejecuta ACTIVAR(NAVEGACION_SECUNDARIA) para culminar la misión.', type: 'system' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // CALIBRAR_PROPULSORES or CALIBRAR_PROPULSOR
  if (upper.includes('PROPULSOR')) {
    soundFx.playCommandExecute();
    nextState.bridgeState.thrustersCalibrated = [95, 95, 95, 95];
    lines.push(
      { text: 'SISTEMA > Ajustando toberas RCS [T0, T1, T2, T3]...', type: 'system' },
      { text: '  Propulsor #0: 95% empuje ✓', type: 'ok' },
      { text: '  Propulsor #1: 95% empuje ✓', type: 'ok' },
      { text: '  Propulsor #2: 95% empuje ✓', type: 'ok' },
      { text: '  Propulsor #3: 95% empuje ✓', type: 'ok' },
      { text: 'Calibración simétrica completa. Ejecuta FIJAR_ORBITA() para asegurar altitud.', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // FIJAR_ORBITA()
  if (upper.includes('FIJAR_ORBITA')) {
    if (nextState.bridgeState.thrustersCalibrated.length < 4) {
      soundFx.playError();
      lines.push(
        { text: 'ERROR: Calibración asimétrica. No se puede estabilizar órbita con propulsores desfasados.', type: 'error' }
      );
      return { updatedState: nextState, outputLines: lines };
    }
    soundFx.playSuccess();
    nextState.bridgeState.orbitalDecayRate = 0;
    nextState.bridgeState.trajectorySafe = true;
    lines.push(
      { text: 'SISTEMA > Encendiendo quemado de corrección orbital (ΔV = +18 m/s)...', type: 'system' },
      { text: 'Tasa de decaimiento reducida a: 0.0 m/s²', type: 'ok' },
      { text: 'ÓRBITA ESTABLE ASEGURADA: Trayectoria geoestacionaria fijada ✓', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // APLICAR_FIREWALL
  if (upper.includes('FIREWALL')) {
    soundFx.playCommandExecute();
    nextState.shieldState.firewallRulesActive = true;
    lines.push(
      { text: 'CIBER-OPS > Instalando tabla de reglas iptables en matriz de escudos...', type: 'system' },
      { text: 'DROP * WHERE packet.header == "MALW_*"', type: 'ok' },
      { text: 'Filtro activo. Paquetes maliciosos rebotados ✓', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // AISLAR_PUERTO
  if (upper.includes('AISLAR_PUERTO')) {
    soundFx.playCommandExecute();
    lines.push(
      { text: 'CIBER-OPS > Bloqueando Socket TCP 8088...', type: 'system' },
      { text: 'Puerto 8088 desconectado de la subred troncal ✓', type: 'ok' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // PURGAR_SUBRED
  if (upper.includes('PURGAR_SUBRED')) {
    soundFx.playSuccess();
    nextState.shieldState.intrusionSuppressed = true;
    nextState.vitals.shields = 92;
    nextState.vitals.activeThreatLevel = 'NOMINAL';
    lines.push(
      { text: 'CIBER-OPS > Ejecutando escaneo y purga de memoria RAM...', type: 'system' },
      { text: '[ ■■■■■■■■■■ ] 4,210 firmas maliciosas eliminadas.', type: 'ok' },
      { text: 'SUBRED LIMPIA: Los escudos deflectores recuperan potencia al 92% ✓', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // DESPACHAR_DRONES
  if (upper.includes('DESPACHAR_DRONES')) {
    soundFx.playCommandExecute();
    nextState.droneState.dronesSorted = true;
    lines.push(
      { text: 'LOGÍSTICA > Reordenando cola de despacho de drones con algoritmo de prioridad...', type: 'system' },
      { text: 'Cola reordenada: [DRONE-O2-A, DRONE-O2-B, DRONE-GEN-C] ✓', type: 'ok' },
      { text: 'Escuadrón en ruta a sellar ductos de ventilación.', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // ENRUTAR_VALVULAS
  if (upper.includes('ENRUTAR_VALVULAS')) {
    soundFx.playSuccess();
    nextState.droneState.oxygenPumpsRouted = true;
    nextState.vitals.oxygen = 95;
    lines.push(
      { text: 'SOPORTE VITAL > Válvula del Sector 4 soldada y presurizada.', type: 'ok' },
      { text: 'Oxígeno restaurado a 95% en compartimentos residenciales ✓', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // DESVIAR_ENERGIA
  if (upper.includes('DESVIAR_ENERGIA')) {
    soundFx.playCommandExecute();
    nextState.vitals.shields = Math.min(100, nextState.vitals.shields + 35);
    lines.push(
      { text: 'SISTEMA > Redirigiendo 50% de capacitores auxiliares a la matriz defensiva...', type: 'system' },
      { text: `Escudos reforzados al ${nextState.vitals.shields}% ✓`, type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // DIAGNOSTICO_GLOBAL
  if (upper.includes('DIAGNOSTICO_GLOBAL')) {
    soundFx.playSuccess();
    nextState.vitals.activeThreatLevel = 'NOMINAL';
    nextState.vitals.hullIntegrity = 96;
    lines.push(
      { text: '═══ AUDITORÍA GLOBAL DE LA ESTACIÓN VERSALLES ═══', type: 'system' },
      { text: 'Reactor: ESTABLE | Escudos: ACTIVOS | Navegación: EN RUTA | O₂: NOMINAL', type: 'ok' },
      { text: '¡ESTACIÓN SALVADA DE LA CRISIS! Todos los subsistemas operando en verde.', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // CONFIGURAR_CUANTICO
  if (upper.includes('CONFIGURAR_CUANTICO')) {
    soundFx.playCommandExecute();
    nextState.labState.logicTruthTableOk = true;
    lines.push(
      { text: 'LAB > Conmutando registros cuánticos...', type: 'system' },
      { text: 'Condición XOR(true, false) => 1 satisfecha ✓', type: 'ok' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // SINCRONIZAR_ENLACE
  if (upper.includes('SINCRONIZAR_ENLACE')) {
    soundFx.playSuccess();
    nextState.vitals.comms = 100;
    lines.push(
      { text: 'COMUNICACIONES > Handshake de clave cuántica completado.', type: 'ok' },
      { text: 'Enlace con Centro de Control Terrestre al 100% ✓', type: 'success' }
    );
    return { updatedState: nextState, outputLines: lines };
  }

  // Fallback unknown command
  soundFx.playError();
  lines.push(
    { text: `ERROR: Comando desconocido: '${trimmed}'`, type: 'error' },
    { text: 'Escribe AYUDA() para ver los comandos válidos o cambia a [SCRIPT] para programar.', type: 'warn' }
  );

  return { updatedState: nextState, outputLines: lines };
}

/**
 * Sandboxed script execution for multi-line JavaScript/SpaceScript code.
 */
function executeScriptBlock(code: string, state: GameState): CommandExecutionResult {
  const lines: Omit<TerminalLine, 'id' | 'timestamp'>[] = [];
  let nextState: GameState = JSON.parse(JSON.stringify(state));

  lines.push({ text: `>> EJECUTANDO SCRIPT ESPACIAL (${new Date().toLocaleTimeString()})...`, type: 'system' });

  // Custom mock execution environment with functions
  const envLogs: string[] = [];

  const sandboxContext = {
    // Console log capture
    console: {
      log: (...args: any[]) => envLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
    },
    // Game primitives
    AJUSTAR: (param: any, val: number) => {
      const p = String(param).toUpperCase();
      if (p.includes('CAMPO') || p.includes('MAGNETICO')) {
        nextState.reactorState.magneticField = val;
        if (val >= 88) {
          nextState.vitals.coreTemp = Math.max(12000, nextState.vitals.coreTemp - 1500);
          envLogs.push(`AJUSTAR: Campo Magnético fijado en ${val}% ✓`);
        } else {
          envLogs.push(`AJUSTAR: Campo fijado en ${val}% [ADVERTENCIA: <88%]`);
        }
      }
    },
    ACTIVAR: (system: any) => {
      const s = String(system).toUpperCase();
      if (s.includes('ESTABILIZADOR')) {
        nextState.reactorState.stabilizerActive = true;
        nextState.reactorState.plasmaOscillation = 2.1;
        envLogs.push('ACTIVAR: Sistema Estabilizador ONLINE ✓');
      } else if (s.includes('NAVEGACION') || s.includes('SECUNDARIA')) {
        nextState.labState.secondaryNavOnline = true;
        envLogs.push('ACTIVAR: Navegación Secundaria ONLINE ✓');
      }
    },
    REPARAR: (comp: any, type: any, sec: number) => {
      if (String(comp).toUpperCase().includes('PUERTA')) {
        nextState.labState.andGateRepaired = true;
        envLogs.push(`REPARAR: Puerta ${type} en sector ${sec} reemplazada ✓`);
      }
    },
    PROBAR: (comp: any) => {
      nextState.labState.logicTruthTableOk = true;
      envLogs.push(`PROBAR: Pruebas unitarias de ${comp} superadas con éxito ✓`);
    },
    CALIBRAR_PROPULSOR: (id: number, val: number) => {
      if (!nextState.bridgeState.thrustersCalibrated.includes(id)) {
        nextState.bridgeState.thrustersCalibrated.push(val);
      }
      envLogs.push(`CALIBRAR_PROPULSOR: Propulsor #${id} calibrado a ${val}%`);
    },
    CALIBRAR_PROPULSORES: (arr: number[]) => {
      nextState.bridgeState.thrustersCalibrated = arr;
      envLogs.push(`CALIBRAR_PROPULSORES: Lote [${arr.join(', ')}] calibrado ✓`);
    },
    FIJAR_ORBITA: () => {
      nextState.bridgeState.orbitalDecayRate = 0;
      nextState.bridgeState.trajectorySafe = true;
      envLogs.push('FIJAR_ORBITA: Trayectoria orbital geoestacionaria asegurada ✓');
    },
    APLICAR_FIREWALL: (regla: any) => {
      nextState.shieldState.firewallRulesActive = true;
      envLogs.push(`APLICAR_FIREWALL: Regla '${regla}' activada en todos los nodos ✓`);
    },
    AISLAR_PUERTO: (puerto: number) => {
      envLogs.push(`AISLAR_PUERTO: Puerto ${puerto} cortado de la red.`);
    },
    PURGAR_SUBRED: () => {
      nextState.shieldState.intrusionSuppressed = true;
      nextState.vitals.shields = 92;
      nextState.vitals.activeThreatLevel = 'NOMINAL';
      envLogs.push('PURGAR_SUBRED: Infección eliminada de la memoria troncal ✓');
    },
    DESPACHAR_DRONES: (modo: any) => {
      nextState.droneState.dronesSorted = true;
      envLogs.push(`DESPACHAR_DRONES: Modo '${modo}' activado en hangar ✓`);
    },
    ENRUTAR_VALVULAS: (sectores: number[]) => {
      nextState.droneState.oxygenPumpsRouted = true;
      nextState.vitals.oxygen = 95;
      envLogs.push(`ENRUTAR_VALVULAS: Sectores [${sectores.join(', ')}] sellados ✓`);
    },
    DESVIAR_ENERGIA: (dest: any, cant: number) => {
      nextState.vitals.shields = Math.min(100, nextState.vitals.shields + cant);
      envLogs.push(`DESVIAR_ENERGIA: ${cant}% redirigido a ${dest}`);
    },
    DIAGNOSTICO: () => {
      envLogs.push('DIAGNOSTICO: Auditoría de parámetros completada.');
    },
    DIAGNOSTICO_GLOBAL: () => {
      nextState.vitals.activeThreatLevel = 'NOMINAL';
      envLogs.push('DIAGNOSTICO_GLOBAL: Todos los indicadores de peligro extinguidos.');
    },
    CONFIGURAR_CUANTICO: (conf: any) => {
      nextState.labState.logicTruthTableOk = true;
      envLogs.push(`CONFIGURAR_CUANTICO: Llave sincronizada (${JSON.stringify(conf)})`);
    },
    SINCRONIZAR_ENLACE: () => {
      nextState.vitals.comms = 100;
      envLogs.push('SINCRONIZAR_ENLACE: Transpondedor alineado con la Tierra ✓');
    },
    // Space station constants & variables
    CAMPO_MAGNETICO: 'CAMPO_MAGNETICO',
    SISTEMA_ESTABILIZADOR: 'SISTEMA_ESTABILIZADOR',
    PUERTA_LOGICA: 'PUERTA_LOGICA',
    NAVEGACION_SECUNDARIA: 'NAVEGACION_SECUNDARIA',
    ESCUDOS: 'ESCUDOS',
  };

  try {
    // Construct sandbox function
    const keys = Object.keys(sandboxContext);
    const values = Object.values(sandboxContext);
    const fn = new Function(...keys, `"use strict";\n${code}`);
    fn(...values);

    soundFx.playCommandExecute();
    lines.push({ text: '>> COMPILACIÓN & EJECUCIÓN EXITOSA (Código de salida: 0)', type: 'ok' });
    envLogs.forEach(log => {
      lines.push({ text: `  [SCRIPT OUT] ${log}`, type: 'ok' });
    });
  } catch (err: any) {
    soundFx.playError();
    lines.push(
      { text: `>> ERROR DE EJECUCIÓN EN EL SCRIPT:`, type: 'error' },
      { text: `  ${err.name}: ${err.message}`, type: 'error' },
      { text: 'Revisa la sintaxis de JavaScript (paréntesis, llaves o variables no definidas).', type: 'warn' }
    );
  }

  return { updatedState: nextState, outputLines: lines };
}
