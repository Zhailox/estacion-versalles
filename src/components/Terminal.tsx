import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Code, 
  Play, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  X, 
  HelpCircle,
  FolderOpen,
  Save,
  Boxes,
  SquareSlash,
  AlertTriangle,
  RotateCcw,
  FileCode,
  Zap,
  MapPin
} from 'lucide-react';
import { TerminalLine, GameState } from '../types/game';
import { soundFx } from '../audio/synth';
import { getFile } from '../utils/vfs';
import { SupportedLanguage } from '../utils/multiLanguageEngine';
import { useLanguage } from '../i18n/LanguageContext';

export interface LocationContextInfo {
  locationKey: string;
  terminalTitle: string;
  locationBadge: string;
  userPrompt: string;
  defaultDirectory: string;
  defaultFile: string;
  quickChips: Array<{ label: string; cmd: string }>;
}

export function getLocationContext(state: GameState): LocationContextInfo {
  const destId = state.currentDestinationId || 'versalles';
  const sectorId = state.currentSectorId || 'reactor';

  if (destId === 'hyperion') {
    return {
      locationKey: 'hyperion',
      terminalTitle: 'ACORAZADO HYPERION-9',
      locationBadge: 'HYPERION-9',
      userPrompt: 'oficial@hyperion9',
      defaultDirectory: '/sys/hyperion',
      defaultFile: '/sys/hyperion/ion_cannon.py',
      quickChips: [
        { label: 'ls -la', cmd: 'ls -la /sys/hyperion' },
        { label: 'pwd', cmd: 'pwd' },
        { label: 'cat cannon.telemetry', cmd: 'cat /sys/hyperion/cannon.telemetry' },
        { label: 'python ion_cannon.py', cmd: 'python /sys/hyperion/ion_cannon.py' },
        { label: 'python cortex_firewall.py', cmd: 'python /sys/hyperion/cortex_firewall.py' },
        { label: 'python fighter_launch.py', cmd: 'python /sys/hyperion/fighter_launch.py' },
      ],
    };
  }

  if (destId === 'titan') {
    return {
      locationKey: 'titan',
      terminalTitle: 'BASE TITÁN-IV',
      locationBadge: 'TITÁN-IV',
      userPrompt: 'tecnico@titan-base',
      defaultDirectory: '/sys/titan',
      defaultFile: '/sys/titan/thermal_drill.py',
      quickChips: [
        { label: 'ls -la', cmd: 'ls -la /sys/titan' },
        { label: 'pwd', cmd: 'pwd' },
        { label: 'cat cryo_drill.log', cmd: 'cat /sys/titan/cryo_drill.log' },
        { label: 'python thermal_drill.py', cmd: 'python /sys/titan/thermal_drill.py' },
        { label: 'cat alarms.log', cmd: 'cat /var/log/alarms.log' },
      ],
    };
  }

  if (destId === 'helios') {
    return {
      locationKey: 'helios',
      terminalTitle: 'SONDA HELIOS-SOL',
      locationBadge: 'HELIOS-SOL',
      userPrompt: 'operador@helios-sol',
      defaultDirectory: '/sys/helios',
      defaultFile: '/sys/helios/solar_shield.py',
      quickChips: [
        { label: 'ls -la', cmd: 'ls -la /sys/helios' },
        { label: 'pwd', cmd: 'pwd' },
        { label: 'cat solar_shield.log', cmd: 'cat /sys/helios/solar_shield.log' },
        { label: 'python solar_shield.py', cmd: 'python /sys/helios/solar_shield.py' },
        { label: 'cat alarms.log', cmd: 'cat /var/log/alarms.log' },
      ],
    };
  }

  // Versalles sectors
  let defaultDir = '/sys/power';
  let defaultFile = '/sys/power/calibrate_solar.py';
  let chips = [
    { label: 'ls -la', cmd: 'ls -la /sys/power' },
    { label: 'pwd', cmd: 'pwd' },
    { label: 'cat solar_status.log', cmd: 'cat /sys/power/solar_status.log' },
    { label: 'python calibrate_solar.py', cmd: 'python /sys/power/calibrate_solar.py' },
    { label: 'cat alarms.log', cmd: 'cat /var/log/alarms.log' },
  ];

  if (sectorId === 'drones') {
    defaultDir = '/sys/life_support';
    defaultFile = '/sys/life_support/carbon_filters.py';
    chips = [
      { label: 'ls -la', cmd: 'ls -la /sys/life_support' },
      { label: 'pwd', cmd: 'pwd' },
      { label: 'cat filter_status.log', cmd: 'cat /sys/life_support/filter_status.log' },
      { label: 'python carbon_filters.py', cmd: 'python /sys/life_support/carbon_filters.py' },
      { label: 'cat alarms.log', cmd: 'cat /var/log/alarms.log' },
    ];
  } else if (sectorId === 'bridge') {
    defaultDir = '/sys/propulsion';
    defaultFile = '/sys/propulsion/thrusters.py';
    chips = [
      { label: 'ls -la', cmd: 'ls -la /sys/propulsion' },
      { label: 'pwd', cmd: 'pwd' },
      { label: 'cat rcs.log', cmd: 'cat /sys/propulsion/rcs.log' },
      { label: 'python thrusters.py', cmd: 'python /sys/propulsion/thrusters.py' },
      { label: 'cat alarms.log', cmd: 'cat /var/log/alarms.log' },
    ];
  } else if (sectorId === 'shields') {
    defaultDir = '/sys/defense';
    defaultFile = '/sys/defense/firewall_rules.py';
    chips = [
      { label: 'ls -la', cmd: 'ls -la /sys/defense' },
      { label: 'pwd', cmd: 'pwd' },
      { label: 'cat network_traffic.log', cmd: 'cat /sys/defense/network_traffic.log' },
      { label: 'python firewall_rules.py', cmd: 'python /sys/defense/firewall_rules.py' },
      { label: 'cat alarms.log', cmd: 'cat /var/log/alarms.log' },
    ];
  } else if (sectorId === 'lab') {
    defaultDir = '/sys/lab';
    defaultFile = '/sys/lab/drone_dispatch.py';
    chips = [
      { label: 'ls -la', cmd: 'ls -la /sys/lab' },
      { label: 'pwd', cmd: 'pwd' },
      { label: 'cat queue.log', cmd: 'cat /sys/lab/queue.log' },
      { label: 'python drone_dispatch.py', cmd: 'python /sys/lab/drone_dispatch.py' },
      { label: 'cat alarms.log', cmd: 'cat /var/log/alarms.log' },
    ];
  }

  return {
    locationKey: `versalles-${sectorId}`,
    terminalTitle: 'ESTACIÓN VERSALLES',
    locationBadge: 'VERSALLES',
    userPrompt: 'cadete@versalles',
    defaultDirectory: defaultDir,
    defaultFile: defaultFile,
    quickChips: chips,
  };
}

interface TerminalProps {
  lines: TerminalLine[];
  state: GameState;
  onExecuteCommand: (command: string, isScript?: boolean, language?: SupportedLanguage) => void;
  onClear: () => void;
  onClose?: () => void;
  onSaveFile?: (path: string, content: string) => void;
  onOpenHandbook?: () => void;
  initialSnippet?: string | null;
}

export const Terminal: React.FC<TerminalProps> = ({
  lines,
  state,
  onExecuteCommand,
  onClear,
  onClose,
  onSaveFile,
  onOpenHandbook,
  initialSnippet,
}) => {
  const { t } = useLanguage();
  const locContext = getLocationContext(state);
  const [activeTab, setActiveTab] = useState<'cli' | 'script' | 'blocks'>('cli');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python');
  const [currentFilePath, setCurrentFilePath] = useState<string>(locContext.defaultFile);
  const [cliInput, setCliInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [scriptCode, setScriptCode] = useState<string>(() => {
    if (state.vfs) {
      const f = getFile(state.vfs, locContext.defaultFile);
      if (f) return f.content;
    }
    return `# SCRIPT DE AVIONICA\n`;
  });

  // Block configuration state for pedagogical modeling
  const [blockFilter, setBlockFilter] = useState<'current' | 'all' | 'versalles' | 'hyperion' | 'titan' | 'helios'>('current');
  const [solarAngle, setSolarAngle] = useState<number>(0.0);
  const [solarCount, setSolarCount] = useState<number>(1);
  const [carbonSelected, setCarbonSelected] = useState<string[]>([]);
  const [carbonRecirculate, setCarbonRecirculate] = useState<boolean>(false);
  const [rcsThrustPct, setRcsThrustPct] = useState<number>(0);
  const [rcsCount, setRcsCount] = useState<number>(1);
  const [rcsLockOrbit, setRcsLockOrbit] = useState<boolean>(false);
  const [reactorField, setReactorField] = useState<number>(50);
  const [reactorStabilizer, setReactorStabilizer] = useState<boolean>(false);
  const [reactorCryo, setReactorCryo] = useState<number>(0);
  const [firewallRule, setFirewallRule] = useState<string>('BLOQUEAR_MALWARE');
  const [firewallPort, setFirewallPort] = useState<number>(0);
  const [firewallPurge, setFirewallPurge] = useState<boolean>(false);
  const [hyperionPower, setHyperionPower] = useState<number>(20);
  const [hyperionSquadron, setHyperionSquadron] = useState<string>('ALPHA');
  const [hyperionFirewall, setHyperionFirewall] = useState<boolean>(false);
  const [titanThermal, setTitanThermal] = useState<boolean>(false);
  const [titanPumps, setTitanPumps] = useState<boolean>(false);
  const [titanDepth, setTitanDepth] = useState<number>(0);
  const [heliosDeflection, setHeliosDeflection] = useState<number>(40);
  const [heliosCollector, setHeliosCollector] = useState<boolean>(false);
  const [heliosNeutrino, setHeliosNeutrino] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync if state.editorFile changed externally (e.g. through nano command)
  useEffect(() => {
    if (state.editorFile && state.vfs) {
      const file = getFile(state.vfs, state.editorFile);
      if (file) {
        setCurrentFilePath(state.editorFile);
        setScriptCode(file.content);
        if (state.editorFile.endsWith('.py')) setSelectedLanguage('python');
        else if (state.editorFile.endsWith('.java')) setSelectedLanguage('java');
        else setSelectedLanguage('javascript');
        setActiveTab('script');
      }
    }
  }, [state.editorFile, state.vfs]);

  // Sync when location or sector changes if no explicit file was opened
  useEffect(() => {
    if (!state.editorFile && state.vfs) {
      const file = getFile(state.vfs, locContext.defaultFile);
      if (file) {
        setCurrentFilePath(locContext.defaultFile);
        setScriptCode(file.content);
        if (locContext.defaultFile.endsWith('.py')) setSelectedLanguage('python');
        else if (locContext.defaultFile.endsWith('.java')) setSelectedLanguage('java');
        else setSelectedLanguage('javascript');
      }
    }
  }, [locContext.locationKey, state.vfs, state.editorFile]);

  // Sync if initialSnippet changed externally (e.g. from Handbook modal)
  useEffect(() => {
    if (initialSnippet) {
      setScriptCode(initialSnippet);
      if (initialSnippet.includes('public class') || initialSnippet.includes('System.out')) {
        setSelectedLanguage('java');
      } else {
        setSelectedLanguage('python');
      }
      setActiveTab('script');
    }
  }, [initialSnippet]);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (scrollRef.current && activeTab === 'cli') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, activeTab]);

  // Focus input on mount or tab change
  useEffect(() => {
    if (activeTab === 'cli') {
      inputRef.current?.focus();
    }
  }, [activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!cliInput.trim()) return;

      const cmd = cliInput.trim();
      setHistory(prev => [...prev, cmd]);
      setHistoryIdx(-1);
      setCliInput('');
      onExecuteCommand(cmd, false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setCliInput(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setCliInput('');
      } else {
        setHistoryIdx(nextIdx);
        setCliInput(history[nextIdx]);
      }
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      handleInterrupt();
    } else {
      soundFx.playKeyClick();
    }
  };

  const handleRunScript = () => {
    soundFx.playCommandExecute();
    onExecuteCommand(scriptCode, true, selectedLanguage);
    setActiveTab('cli');
  };

  const handleInterrupt = () => {
    soundFx.playBeep(400, 0.1);
    onExecuteCommand('__SIGINT_INTERRUPT__', false);
  };

  const insertSnippet = (snippet: string) => {
    soundFx.playBeep(800, 0.03);
    setScriptCode(prev => prev + '\n' + snippet);
  };

  const handleLoadVFSFile = (path: string) => {
    if (state.vfs) {
      const file = getFile(state.vfs, path);
      if (file) {
        setCurrentFilePath(path);
        setScriptCode(file.content);
        if (path.endsWith('.py')) setSelectedLanguage('python');
        else if (path.endsWith('.java')) setSelectedLanguage('java');
        else setSelectedLanguage('javascript');
        soundFx.playBeep(700, 0.04);
      }
    }
  };

  const handleSaveToVFS = () => {
    if (onSaveFile && currentFilePath) {
      onSaveFile(currentFilePath, scriptCode);
      soundFx.playBeep(1100, 0.05);
    }
  };

  const currentDir = state.currentDirectory || '/sys/power';

  return (
    <div
      className={`fixed z-50 bg-[#010a14]/98 border border-[#00f5ff]/40 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden backdrop-blur-xl transition-all duration-300 ${
        isMaximized
          ? 'inset-3 md:inset-6'
          : 'bottom-4 left-4 right-4 md:left-12 md:right-12 h-[72vh] md:h-[68vh]'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="bg-[#031526] border-b border-[#00f5ff]/20 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <span className="font-orbitron text-xs md:text-sm font-bold text-[#00f5ff] tracking-wider flex items-center gap-1.5">
            <TerminalIcon className="w-4 h-4 text-[#00f5ff]" />
            {locContext.terminalTitle}
          </span>

          {/* Mode switch tabs */}
          <div className="flex items-center bg-[#010d1a] border border-[#00f5ff]/20 rounded p-0.5 ml-2 md:ml-4">
            <button
              onClick={() => {
                soundFx.playBeep(600, 0.03);
                setActiveTab('cli');
              }}
              className={`px-2.5 py-1 text-xs font-orbitron rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cli'
                  ? 'bg-[#00f5ff] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              {t.terminal.tabTerminal}
            </button>
            <button
              onClick={() => {
                soundFx.playBeep(600, 0.03);
                setActiveTab('script');
              }}
              className={`px-2.5 py-1 text-xs font-orbitron rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'script'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              {t.terminal.tabEditor}
            </button>
            <button
              onClick={() => {
                soundFx.playBeep(600, 0.03);
                setActiveTab('blocks');
              }}
              className={`px-2.5 py-1 text-xs font-orbitron rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'blocks'
                  ? 'bg-purple-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              {t.terminal.tabBlocks}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* SIGINT Interrupt button */}
          <button
            onClick={handleInterrupt}
            title="Interrumpir proceso (Ctrl+C / Abortar bucle)"
            className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/30 rounded border border-red-500/40 text-xs flex items-center gap-1 font-tech cursor-pointer transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline font-mono">SIGINT</span>
          </button>

          <button
            onClick={() => {
              soundFx.playBeep(600, 0.03);
              if (onOpenHandbook) onOpenHandbook();
              else onExecuteCommand('man', false);
            }}
            title={t.header.handbookTooltip}
            className="p-1.5 text-slate-300 hover:text-[#00f5ff] hover:bg-[#00f5ff]/10 rounded border border-slate-700 hover:border-[#00f5ff]/50 text-xs flex items-center gap-1 font-tech cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-bold">{t.common.manual}</span>
          </button>

          <button
            onClick={onClear}
            title={t.terminal.clearOutput}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded border border-slate-700 hover:border-red-500/50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? 'Restaurar' : 'Maximizar'}
            className="p-1.5 text-slate-400 hover:text-[#00f5ff] rounded border border-slate-700 cursor-pointer"
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              title={t.common.close}
              className="p-1.5 text-slate-400 hover:text-white rounded border border-slate-700 hover:bg-red-500/20 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Chips Bar */}
      <div className="bg-[#020e1c] border-b border-[#00f5ff]/15 px-4 py-1.5 flex items-center gap-2 overflow-x-auto text-xs font-tech text-slate-300">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest shrink-0">
          {t.terminal.quickCommands}:
        </span>
        {locContext.quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onExecuteCommand(chip.cmd, false)}
            className="px-2 py-0.5 rounded bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] hover:bg-[#00f5ff]/20 whitespace-nowrap cursor-pointer font-mono"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Main Terminal Body */}
      {activeTab === 'cli' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Scrollable output */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-1.5 font-mono text-xs md:text-sm leading-relaxed"
          >
            {lines.map(line => {
              let colorCls = 'text-slate-300';
              if (line.type === 'system') colorCls = 'text-[#00f5ff] font-semibold';
              if (line.type === 'command') colorCls = 'text-amber-300 font-bold';
              if (line.type === 'ok') colorCls = 'text-emerald-400';
              if (line.type === 'warn') colorCls = 'text-amber-400';
              if (line.type === 'error') colorCls = 'text-red-400 font-bold bg-red-950/20 p-1 rounded';
              if (line.type === 'success') colorCls = 'text-[#39ff14] font-semibold glow-cyan';

              return (
                <div key={line.id} className={`${colorCls} break-words whitespace-pre-wrap`}>
                  {line.text}
                </div>
              );
            })}
          </div>

          {/* Command Input Prompt with Real UNIX Directory Display */}
          <div className="border-t border-[#00f5ff]/20 bg-[#020b18] px-4 py-2.5 flex items-center gap-2">
            <span className="font-mono text-xs md:text-sm text-emerald-400 select-none whitespace-nowrap">
              {locContext.userPrompt}:[<span className="text-[#00f5ff]">{currentDir}</span>]$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={cliInput}
              onChange={e => setCliInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ls, cd /sys/power, cat solar_status.log, python calibrate_solar.py..."
              className="flex-1 bg-transparent border-none outline-none font-mono text-xs md:text-sm text-white placeholder:text-slate-600 caret-[#00f5ff]"
              autoFocus
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* Multi-line Script Mode with Language Selector */}
      {activeTab === 'script' && (
        <div className="flex-1 flex flex-col min-h-0 bg-[#010915]">
          {/* File & Language Selector Toolbar */}
          <div className="bg-[#021324] border-b border-[#00f5ff]/15 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-tech">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 flex items-center gap-1 font-mono text-xs">
                <FolderOpen className="w-3.5 h-3.5 text-[#00f5ff]" />
                {currentFilePath}
              </span>

              {/* Language Selector */}
              <div className="flex items-center bg-[#010a14] border border-slate-700 rounded p-0.5 ml-2">
                <button
                  onClick={() => setSelectedLanguage('python')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors flex items-center gap-1.5 ${
                    selectedLanguage === 'python' ? 'bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Python 3.12</span>
                </button>
                <button
                  onClick={() => setSelectedLanguage('java')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors flex items-center gap-1.5 ${
                    selectedLanguage === 'java' ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>Java 21</span>
                </button>
                <button
                  onClick={() => setSelectedLanguage('javascript')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors flex items-center gap-1.5 ${
                    selectedLanguage === 'javascript' ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>JavaScript</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToVFS}
                title={t.terminal.saveScript}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 cursor-pointer font-tech text-xs"
              >
                <Save className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.terminal.saveScript}</span>
              </button>

              <button
                onClick={handleRunScript}
                className="px-4 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-orbitron font-bold text-xs rounded transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(57,255,20,0.4)] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.terminal.runScript} {selectedLanguage.toUpperCase()}</span>
              </button>
            </div>
          </div>

          {/* Snippets helper bar */}
          <div className="bg-[#010e1c] border-b border-slate-800/80 px-4 py-1.5 flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-slate-300">
            <span className="text-amber-400 uppercase tracking-wider text-[10px] shrink-0 font-tech">
              PLANTILLAS:
            </span>
            {locContext.locationKey === 'hyperion' ? (
              <>
                <button
                  onClick={() => handleLoadVFSFile('/sys/hyperion/ion_cannon.py')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                >
                  Abrir ion_cannon.py
                </button>
                <button
                  onClick={() => handleLoadVFSFile('/sys/hyperion/cortex_firewall.py')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                >
                  Abrir cortex_firewall.py
                </button>
                <button
                  onClick={() => handleLoadVFSFile('/sys/hyperion/fighter_launch.py')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                >
                  Abrir fighter_launch.py
                </button>
                <button
                  onClick={() => insertSnippet('cargar_canon_iones(100)\ndiagnostico()')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700 cursor-pointer"
                >
                  + cargar_canon_iones(100)
                </button>
              </>
            ) : locContext.locationKey === 'titan' ? (
              <>
                <button
                  onClick={() => handleLoadVFSFile('/sys/titan/thermal_drill.py')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                >
                  Abrir thermal_drill.py
                </button>
                <button
                  onClick={() => insertSnippet('activar_red_termica()\nactivar_bombas_metano()')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700 cursor-pointer"
                >
                  + red_termica & bombas
                </button>
                <button
                  onClick={() => insertSnippet('iniciar_taladro(160)')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700 cursor-pointer"
                >
                  + iniciar_taladro(160)
                </button>
              </>
            ) : locContext.locationKey === 'helios' ? (
              <>
                <button
                  onClick={() => handleLoadVFSFile('/sys/helios/solar_shield.py')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                >
                  Abrir solar_shield.py
                </button>
                <button
                  onClick={() => insertSnippet('ajustar_escudo_solar(90)')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700 cursor-pointer"
                >
                  + ajustar_escudo_solar(90)
                </button>
                <button
                  onClick={() => insertSnippet('activar_colector_corona()\nalinear_neutrinos()')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700 cursor-pointer"
                >
                  + colector & neutrinos
                </button>
              </>
            ) : selectedLanguage === 'python' ? (
              <>
                <button
                  onClick={() => handleLoadVFSFile('/sys/power/calibrate_solar.py')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                >
                  Abrir Colectores Solares (.py)
                </button>
                <button
                  onClick={() => handleLoadVFSFile('/sys/life_support/carbon_filters.py')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                >
                  Abrir Filtros de Carbono (.py)
                </button>
                <button
                  onClick={() => handleLoadVFSFile('/sys/propulsion/thrusters.py')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                >
                  Abrir Propulsores RCS (.py)
                </button>
                <button
                  onClick={() => insertSnippet('for i in range(8):\n    ajustar_panel_solar(i, 47.5)')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700 cursor-pointer"
                >
                  + bucle for range(8)
                </button>
              </>
            ) : selectedLanguage === 'java' ? (
              <>
                <button
                  onClick={() => handleLoadVFSFile('/sys/power/calibrate_solar.java')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer"
                >
                  Cargar Clase CalibradorSolar.java
                </button>
                <button
                  onClick={() => insertSnippet('for (int i = 0; i < 4; i++) {\n    calibrar_propulsor_rcs(i, 95);\n}')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer"
                >
                  + bucle for (int i=0)
                </button>
              </>
            ) : (
              <button
                onClick={() => insertSnippet('DIAGNOSTICO();')}
                className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              >
                + DIAGNOSTICO()
              </button>
            )}
          </div>

          {/* Code Textarea with Real Monospace Font */}
          <div className="flex-1 p-3 flex flex-col">
            <textarea
              value={scriptCode}
              onChange={e => setScriptCode(e.target.value)}
              placeholder="# Escribe tu código en Python o Java aquí..."
              className="w-full flex-1 bg-[#010712] border border-[#00f5ff]/20 rounded-lg p-3 font-mono text-xs md:text-sm text-emerald-400 placeholder:text-slate-600 outline-none resize-none focus:border-[#00f5ff]/60 leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* Visual Logic Blocks Mode */}
      {activeTab === 'blocks' && (
        <div className="flex-1 flex flex-col min-h-0 bg-[#010915] p-5 overflow-y-auto">
          <div className="max-w-4xl w-full mx-auto space-y-4">
            <div className="bg-[#021324] border border-purple-500/40 rounded-xl p-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="font-orbitron text-sm font-bold text-purple-300 flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-purple-400" />
                  PROGRAMACIÓN POR BLOQUES
                </h3>
              </div>
              <p className="text-xs font-tech text-slate-400 mb-3">
                Configura los parámetros del sistema antes de ensamblar. Cada bloque compila directamente a instrucciones deterministas.
              </p>

              {/* Location Filter Selector */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-purple-500/20 text-xs font-mono">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest mr-1 font-tech">SECTOR:</span>
                <button
                  onClick={() => setBlockFilter('current')}
                  className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    blockFilter === 'current'
                      ? 'bg-purple-600 text-white font-bold shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>ACTUAL</span>
                </button>
                <button
                  onClick={() => setBlockFilter('all')}
                  className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    blockFilter === 'all'
                      ? 'bg-purple-600 text-white font-bold shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  TODOS
                </button>
                <button
                  onClick={() => setBlockFilter('versalles')}
                  className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    blockFilter === 'versalles'
                      ? 'bg-cyan-600 text-white font-bold shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  VERSALLES
                </button>
                <button
                  onClick={() => setBlockFilter('hyperion')}
                  className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    blockFilter === 'hyperion'
                      ? 'bg-blue-600 text-white font-bold shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  HYPERION-9
                </button>
                <button
                  onClick={() => setBlockFilter('titan')}
                  className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    blockFilter === 'titan'
                      ? 'bg-emerald-600 text-white font-bold shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  TITÁN-IV
                </button>
                <button
                  onClick={() => setBlockFilter('helios')}
                  className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    blockFilter === 'helios'
                      ? 'bg-amber-600 text-white font-bold shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  HELIOS-SOL
                </button>
              </div>
            </div>

            {/* Grid of Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Block 1: Versalles Solar Panels */}
              {(blockFilter === 'all' || blockFilter === 'versalles' || (blockFilter === 'current' && locContext.locationKey.startsWith('versalles'))) && (
                <div className="bg-[#020e1d] border border-cyan-500/30 rounded-lg p-4 space-y-3 hover:border-cyan-500/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-bold text-cyan-300">REORIENTACIÓN SOLAR</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono">Bucle range()</span>
                  </div>
                  <p className="text-xs font-tech text-slate-400">
                    Alinea los servomotores exteriores de los paneles fotovoltaicos al ángulo solar detectado.
                  </p>

                  {/* Interactive parameters */}
                  <div className="bg-[#010712] p-2.5 rounded border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Ángulo servomotor:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          value={solarAngle}
                          onChange={e => setSolarAngle(parseFloat(e.target.value) || 0)}
                          className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-cyan-300 text-right text-xs"
                        />
                        <span className="text-slate-500">°</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Cantidad de paneles:</span>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={solarCount}
                        onChange={e => setSolarCount(parseInt(e.target.value, 10) || 1)}
                        className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-cyan-300 text-right text-xs"
                      />
                    </div>
                    <div className="text-[11px] text-emerald-400 pt-1 border-t border-slate-800/80">
                      REPETIR ({solarCount} veces) &gt; AJUSTAR_PANEL(i, {solarAngle}°)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => {
                        const blockJson = JSON.stringify([{ type: 'align_solar', count: solarCount, angle: solarAngle }]);
                        onExecuteCommand(blockJson, true, 'blocks');
                        setActiveTab('cli');
                      }}
                      className="py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-orbitron font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Play className="w-3 h-3 fill-current" /> ENSAMBLAR Y EJECUTAR</span>
                    </button>
                    <button
                      onClick={() => {
                        setScriptCode(`ANGULO_OPTIMO = ${solarAngle}\nTOTAL_PANELES = ${solarCount}\n\nfor i in range(TOTAL_PANELES):\n    ajustar_panel_solar(i, ANGULO_OPTIMO)\n\nprint(">> Calibración de colectores ejecutada.")\n`);
                        setSelectedLanguage('python');
                        setActiveTab('script');
                      }}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-orbitron text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Code className="w-3 h-3" /> EN PYTHON</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Block 2: Versalles Carbon Filters */}
              {(blockFilter === 'all' || blockFilter === 'versalles' || (blockFilter === 'current' && locContext.locationKey.startsWith('versalles'))) && (
                <div className="bg-[#020e1d] border border-emerald-500/30 rounded-lg p-4 space-y-3 hover:border-emerald-500/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-bold text-emerald-300">PURGA DE CO2</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">List Loop</span>
                  </div>
                  <p className="text-xs font-tech text-slate-400">
                    Selecciona los cartuchos saturados identificados en filter_status.log y reactiva la circulación.
                  </p>

                  <div className="bg-[#010712] p-2.5 rounded border border-slate-800 space-y-2 text-xs font-mono">
                    <span className="text-slate-400 block text-[11px]">Cartuchos a purgar:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['F_ALPHA', 'F_BETA', 'F_GAMMA', 'F_DELTA'].map(filterName => {
                        const checked = carbonSelected.includes(filterName);
                        return (
                          <label key={filterName} className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setCarbonSelected(prev =>
                                  checked ? prev.filter(f => f !== filterName) : [...prev, filterName]
                                );
                              }}
                              className="accent-emerald-500"
                            />
                            <span>{filterName}</span>
                          </label>
                        );
                      })}
                    </div>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer pt-1 border-t border-slate-800/80">
                      <input
                        type="checkbox"
                        checked={carbonRecirculate}
                        onChange={e => setCarbonRecirculate(e.target.checked)}
                        className="accent-emerald-500"
                      />
                      <span className="text-emerald-400">Reactivar recirculación de O2</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => {
                        const blockJson = JSON.stringify([{ type: 'purge_filters', filters: carbonSelected, recirculation: carbonRecirculate }]);
                        onExecuteCommand(blockJson, true, 'blocks');
                        setActiveTab('cli');
                      }}
                      className="py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-orbitron font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Play className="w-3 h-3 fill-current" /> ENSAMBLAR Y EJECUTAR</span>
                    </button>
                    <button
                      onClick={() => {
                        setScriptCode(`filtros = ${JSON.stringify(carbonSelected)}\nfor f in filtros:\n    purgar_filtro_carbono(f)\n${carbonRecirculate ? 'activar_recirculacion_o2()\n' : ''}print(">> Purga de filtros ejecutada.")\n`);
                        setSelectedLanguage('python');
                        setActiveTab('script');
                      }}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-orbitron text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Code className="w-3 h-3" /> EN PYTHON</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Block 3: Versalles RCS Thrusters */}
              {(blockFilter === 'all' || blockFilter === 'versalles' || (blockFilter === 'current' && locContext.locationKey.startsWith('versalles'))) && (
                <div className="bg-[#020e1d] border border-amber-500/30 rounded-lg p-4 space-y-3 hover:border-amber-500/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-bold text-amber-300">PROPULSORES RCS</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">range(4)</span>
                  </div>
                  <p className="text-xs font-tech text-slate-400">
                    Ajusta el empuje de maniobra a las toberas y fija el vector orbital estabilizado.
                  </p>

                  <div className="bg-[#010712] p-2.5 rounded border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Empuje por tobera:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={rcsThrustPct}
                          onChange={e => setRcsThrustPct(parseInt(e.target.value, 10) || 0)}
                          className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-300 text-right text-xs"
                        />
                        <span className="text-slate-500">%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Toberas a calibrar:</span>
                      <input
                        type="number"
                        min="1"
                        max="4"
                        value={rcsCount}
                        onChange={e => setRcsCount(parseInt(e.target.value, 10) || 1)}
                        className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-300 text-right text-xs"
                      />
                    </div>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer pt-1 border-t border-slate-800/80">
                      <input
                        type="checkbox"
                        checked={rcsLockOrbit}
                        onChange={e => setRcsLockOrbit(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span className="text-amber-400">Fijar órbita estable permanente</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => {
                        const blockJson = JSON.stringify([{ type: 'calibrate_rcs', count: rcsCount, thrustPct: rcsThrustPct, lockOrbit: rcsLockOrbit }]);
                        onExecuteCommand(blockJson, true, 'blocks');
                        setActiveTab('cli');
                      }}
                      className="py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-orbitron font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Play className="w-3 h-3 fill-current" /> ENSAMBLAR Y EJECUTAR</span>
                    </button>
                    <button
                      onClick={() => {
                        setScriptCode(`for id in range(${rcsCount}):\n    calibrar_propulsor_rcs(id, ${rcsThrustPct})\n${rcsLockOrbit ? 'fijar_orbita_estable()\n' : ''}print(">> Vector RCS calibrado.")\n`);
                        setSelectedLanguage('python');
                        setActiveTab('script');
                      }}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-orbitron text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Code className="w-3 h-3" /> EN PYTHON</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Block 4: Versalles Reactor Confinement */}
              {(blockFilter === 'all' || blockFilter === 'versalles' || (blockFilter === 'current' && locContext.locationKey.startsWith('versalles'))) && (
                <div className="bg-[#020e1d] border border-purple-500/30 rounded-lg p-4 space-y-3 hover:border-purple-500/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-bold text-purple-300">REACTOR NUCLEAR</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono">Thermodynamics</span>
                  </div>
                  <p className="text-xs font-tech text-slate-400">
                    Ajusta el campo magnético del toroide, enciende estabilizador e inyecta refrigerante.
                  </p>

                  <div className="bg-[#010712] p-2.5 rounded border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Campo Magnético:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={reactorField}
                          onChange={e => setReactorField(parseInt(e.target.value, 10) || 0)}
                          className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-purple-300 text-right text-xs"
                        />
                        <span className="text-slate-500">%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Inyección Criogénica:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={reactorCryo}
                          onChange={e => setReactorCryo(parseInt(e.target.value, 10) || 0)}
                          className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-purple-300 text-right text-xs"
                        />
                        <span className="text-slate-500">L</span>
                      </div>
                    </div>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer pt-1 border-t border-slate-800/80">
                      <input
                        type="checkbox"
                        checked={reactorStabilizer}
                        onChange={e => setReactorStabilizer(e.target.checked)}
                        className="accent-purple-500"
                      />
                      <span className="text-purple-400">Activar estabilizador de plasma</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => {
                        const blockJson = JSON.stringify([{ type: 'reactor_confinement', magneticField: reactorField, cryoLitres: reactorCryo, stabilizer: reactorStabilizer }]);
                        onExecuteCommand(blockJson, true, 'blocks');
                        setActiveTab('cli');
                      }}
                      className="py-1.5 bg-purple-500 hover:bg-purple-400 text-white font-orbitron font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Play className="w-3 h-3 fill-current" /> ENSAMBLAR Y EJECUTAR</span>
                    </button>
                    <button
                      onClick={() => {
                        setScriptCode(`ajustar("CAMPO_MAGNETICO", ${reactorField})\n${reactorStabilizer ? 'activar("SISTEMA_ESTABILIZADOR")\n' : ''}${reactorCryo > 0 ? `inyectar_crio(${reactorCryo})\n` : ''}print(">> Reactor toroidal estabilizado.")\n`);
                        setSelectedLanguage('python');
                        setActiveTab('script');
                      }}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 font-orbitron text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Code className="w-3 h-3" /> EN PYTHON</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Block 5: Versalles Cyber Defense */}
              {(blockFilter === 'all' || blockFilter === 'versalles' || (blockFilter === 'current' && locContext.locationKey.startsWith('versalles'))) && (
                <div className="bg-[#020e1d] border border-red-500/30 rounded-lg p-4 space-y-3 hover:border-red-500/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-bold text-red-300">CIBER-DEFENSA</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono">Security</span>
                  </div>
                  <p className="text-xs font-tech text-slate-400">
                    Aplica la regla de filtrado deducida, aísla el puerto vulnerable y purga la subred.
                  </p>

                  <div className="bg-[#010712] p-2.5 rounded border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Regla de Firewall:</span>
                      <select
                        value={firewallRule}
                        onChange={e => setFirewallRule(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-red-300"
                      >
                        <option value="BLOQUEAR_MALWARE">BLOQUEAR_MALWARE</option>
                        <option value="DROP_EXTERNAL_ATTACK">DROP_EXTERNAL_ATTACK</option>
                        <option value="PERMIT_ALL">PERMIT_ALL (Inseguro)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Aislar puerto vulnerable:</span>
                      <input
                        type="number"
                        value={firewallPort}
                        onChange={e => setFirewallPort(parseInt(e.target.value, 10) || 0)}
                        placeholder="Ej: 8088"
                        className="w-20 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-red-300 text-right text-xs"
                      />
                    </div>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer pt-1 border-t border-slate-800/80">
                      <input
                        type="checkbox"
                        checked={firewallPurge}
                        onChange={e => setFirewallPurge(e.target.checked)}
                        className="accent-red-500"
                      />
                      <span className="text-red-400">Purgar subred troncal infectada</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => {
                        const blockJson = JSON.stringify([{ type: 'defense_firewall', rule: firewallRule, port: firewallPort, purgeSubnet: firewallPurge }]);
                        onExecuteCommand(blockJson, true, 'blocks');
                        setActiveTab('cli');
                      }}
                      className="py-1.5 bg-red-500 hover:bg-red-400 text-white font-orbitron font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Play className="w-3 h-3 fill-current" /> ENSAMBLAR Y EJECUTAR</span>
                    </button>
                    <button
                      onClick={() => {
                        setScriptCode(`aplicar_firewall("${firewallRule}")\n${firewallPort ? `aislar_puerto(${firewallPort})\n` : ''}${firewallPurge ? 'purgar_subred()\n' : ''}print(">> Matriz de ciber-defensa activa.")\n`);
                        setSelectedLanguage('python');
                        setActiveTab('script');
                      }}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-red-300 border border-red-500/30 font-orbitron text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Code className="w-3 h-3" /> EN PYTHON</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Block 6: Hyperion-9 Ion Cannon & Fleet */}
              {(blockFilter === 'all' || blockFilter === 'hyperion' || (blockFilter === 'current' && locContext.locationKey === 'hyperion')) && (
                <div className="bg-[#020e1d] border border-blue-500/30 rounded-lg p-4 space-y-3 hover:border-blue-500/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-bold text-blue-300">ACORAZADO HYPERION-9</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">Táctico Militar</span>
                  </div>
                  <p className="text-xs font-tech text-slate-400">
                    Carga los condensadores del cañón de iones, activa el cortafuegos militar y despliega cazas.
                  </p>

                  <div className="bg-[#010712] p-2.5 rounded border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Potencia de cañón:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={hyperionPower}
                          onChange={e => setHyperionPower(parseInt(e.target.value, 10) || 0)}
                          className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-blue-300 text-right text-xs"
                        />
                        <span className="text-slate-500">%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Escuadrón de cazas:</span>
                      <select
                        value={hyperionSquadron}
                        onChange={e => setHyperionSquadron(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-blue-300"
                      >
                        <option value="ALPHA">Escuadrón ALPHA</option>
                        <option value="VANGUARD-ALPHA">VANGUARD-ALPHA</option>
                        <option value="BRAVO">Escuadrón BRAVO</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer pt-1 border-t border-slate-800/80">
                      <input
                        type="checkbox"
                        checked={hyperionFirewall}
                        onChange={e => setHyperionFirewall(e.target.checked)}
                        className="accent-blue-500"
                      />
                      <span className="text-blue-400">Activar cortafuegos militar CORTEX-9</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => {
                        const blockJson = JSON.stringify([{ type: 'hyperion_cannon', power: hyperionPower, squadron: hyperionSquadron, militaryFirewall: hyperionFirewall }]);
                        onExecuteCommand(blockJson, true, 'blocks');
                        setActiveTab('cli');
                      }}
                      className="py-1.5 bg-blue-500 hover:bg-blue-400 text-white font-orbitron font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Play className="w-3 h-3 fill-current" /> ENSAMBLAR Y EJECUTAR</span>
                    </button>
                    <button
                      onClick={() => {
                        setScriptCode(`cargar_canon_iones(${hyperionPower})\n${hyperionFirewall ? 'activar_firewall_militar()\n' : ''}lanzar_cazas("${hyperionSquadron}")\ndiagnostico()\n`);
                        setSelectedLanguage('python');
                        setActiveTab('script');
                      }}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 font-orbitron text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Code className="w-3 h-3" /> EN PYTHON</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Block 7: Titan-IV Thermal Drill */}
              {(blockFilter === 'all' || blockFilter === 'titan' || (blockFilter === 'current' && locContext.locationKey === 'titan')) && (
                <div className="bg-[#020e1d] border border-emerald-500/30 rounded-lg p-4 space-y-3 hover:border-emerald-500/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-bold text-emerald-300">BASE TITÁN-IV</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">Minería Criogénica</span>
                  </div>
                  <p className="text-xs font-tech text-slate-400">
                    Enciende la red térmica radiante, activa bombas de metano y perfora el estrato de hielo.
                  </p>

                  <div className="bg-[#010712] p-2.5 rounded border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Profundidad del taladro:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="300"
                          value={titanDepth}
                          onChange={e => setTitanDepth(parseInt(e.target.value, 10) || 0)}
                          className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-emerald-300 text-right text-xs"
                        />
                        <span className="text-slate-500">m</span>
                      </div>
                    </div>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={titanThermal}
                        onChange={e => setTitanThermal(e.target.checked)}
                        className="accent-emerald-500"
                      />
                      <span className="text-emerald-400">Activar red radiante térmica</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer pt-1 border-t border-slate-800/80">
                      <input
                        type="checkbox"
                        checked={titanPumps}
                        onChange={e => setTitanPumps(e.target.checked)}
                        className="accent-emerald-500"
                      />
                      <span className="text-emerald-400">Activar bombas de metano Kraken Mare</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => {
                        const blockJson = JSON.stringify([{ type: 'titan_drill', depth: titanDepth, thermalHeating: titanThermal, methanePumps: titanPumps }]);
                        onExecuteCommand(blockJson, true, 'blocks');
                        setActiveTab('cli');
                      }}
                      className="py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-orbitron font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Play className="w-3 h-3 fill-current" /> ENSAMBLAR Y EJECUTAR</span>
                    </button>
                    <button
                      onClick={() => {
                        setScriptCode(`${titanThermal ? 'activar_red_termica()\n' : ''}${titanPumps ? 'activar_bombas_metano()\n' : ''}iniciar_taladro(${titanDepth})\nprint(">> Ciclo de perforación Titán ejecutado.")\n`);
                        setSelectedLanguage('python');
                        setActiveTab('script');
                      }}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-orbitron text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Code className="w-3 h-3" /> EN PYTHON</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Block 8: Helios Solar Shield */}
              {(blockFilter === 'all' || blockFilter === 'helios' || (blockFilter === 'current' && locContext.locationKey === 'helios')) && (
                <div className="bg-[#020e1d] border border-amber-500/30 rounded-lg p-4 space-y-3 hover:border-amber-500/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-xs font-bold text-amber-300">SONDA HELIOS-SOL</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">Deflexión Coronal</span>
                  </div>
                  <p className="text-xs font-tech text-slate-400">
                    Modula la deflexión electromagnética, activa el colector coronal y alinea neutrinos cuánticos.
                  </p>

                  <div className="bg-[#010712] p-2.5 rounded border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Deflexión de escudo:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={heliosDeflection}
                          onChange={e => setHeliosDeflection(parseInt(e.target.value, 10) || 0)}
                          className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-300 text-right text-xs"
                        />
                        <span className="text-slate-500">%</span>
                      </div>
                    </div>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={heliosCollector}
                        onChange={e => setHeliosCollector(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span className="text-amber-400">Activar colector de plasma coronal</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer pt-1 border-t border-slate-800/80">
                      <input
                        type="checkbox"
                        checked={heliosNeutrino}
                        onChange={e => setHeliosNeutrino(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span className="text-amber-400">Alinear matriz cuántica de neutrinos</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => {
                        const blockJson = JSON.stringify([{ type: 'helios_shield', deflection: heliosDeflection, coronaCollector: heliosCollector, quantumNeutrino: heliosNeutrino }]);
                        onExecuteCommand(blockJson, true, 'blocks');
                        setActiveTab('cli');
                      }}
                      className="py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-orbitron font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Play className="w-3 h-3 fill-current" /> ENSAMBLAR Y EJECUTAR</span>
                    </button>
                    <button
                      onClick={() => {
                        setScriptCode(`ajustar_escudo_solar(${heliosDeflection})\n${heliosCollector ? 'activar_colector_corona()\n' : ''}${heliosNeutrino ? 'alinear_neutrinos()\n' : ''}print(">> Escudo coronal Helios optimizado.")\n`);
                        setSelectedLanguage('python');
                        setActiveTab('script');
                      }}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-orbitron text-xs rounded transition-colors cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-1.5"><Code className="w-3 h-3" /> EN PYTHON</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
