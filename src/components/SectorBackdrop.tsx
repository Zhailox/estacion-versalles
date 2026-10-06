import React, { useEffect, useRef, useState } from 'react';
import { SectorId, GameState } from '../types/game';
import { getCustomBackground, getSectorIllustration, subscribeToCustomAssets } from '../utils/customAssets';

interface SectorBackdropProps {
  sectorId: SectorId;
  state: GameState;
}

const SECTOR_IMAGE_PATHS: Record<SectorId, string[]> = {
  reactor: [
    '/assets/Vista Nucleo Reactor.webp',
    '/Vista Nucleo Reactor.webp',
  ],
  lab: [
    '/assets/Vista Laboratorio de Datos.webp',
    '/Vista Laboratorio de Datos.webp',
  ],
  bridge: [
    '/assets/Puente de Navegacion.webp',
    '/Puente de Navegacion.webp',
  ],
  shields: [
    '/assets/Matriz de Escudos.webp',
    '/Matriz de Escudos.webp',
  ],
  drones: [
    '/assets/Estacion de Drones.webp',
    '/Estacion de Drones.webp',
  ],
};

export const SectorBackdrop: React.FC<SectorBackdropProps> = ({ sectorId, state }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [candidateIdx, setCandidateIdx] = useState<number>(0);

  useEffect(() => {
    const updateBg = () => {
      // 1. Resolve distinct destination and sector specific illustration
      const illustration = getSectorIllustration(state.currentDestinationId, sectorId);
      if (illustration) {
        setImgSrc(illustration);
        return;
      }

      // 2. Check sector custom background or defaults
      const custom = getCustomBackground(sectorId);
      if (custom) {
        setImgSrc(custom);
      } else {
        setCandidateIdx(0);
        setImgSrc(SECTOR_IMAGE_PATHS[sectorId]?.[0] || null);
      }
    };
    updateBg();
    const unsubscribe = subscribeToCustomAssets(updateBg);
    return () => unsubscribe();
  }, [sectorId, state.currentDestinationId]);

  const handleImgError = () => {
    const list = SECTOR_IMAGE_PATHS[sectorId] || [];
    if (candidateIdx + 1 < list.length) {
      const nextIdx = candidateIdx + 1;
      setCandidateIdx(nextIdx);
      setImgSrc(list[nextIdx]);
    } else if (state.currentDestinationId && state.currentDestinationId !== 'versalles') {
      const destBg = getCustomBackground(state.currentDestinationId);
      if (destBg && imgSrc !== destBg) {
        setImgSrc(destBg);
      } else {
        setImgSrc(null);
      }
    } else {
      setImgSrc(null); // Fallback to vector scenery
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={sectorId}
          onError={handleImgError}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <>
          {sectorId === 'reactor' && <ReactorScenery state={state} />}
          {sectorId === 'lab' && <LabScenery state={state} />}
          {sectorId === 'bridge' && <BridgeScenery state={state} />}
          {sectorId === 'shields' && <ShieldsScenery state={state} />}
          {sectorId === 'drones' && <DronesScenery state={state} />}
        </>
      )}

      {/* Atmospheric Spatial Cyber Particles & Volumetric Fog Layer */}
      <AtmosphericParticles sectorId={sectorId} />
    </div>
  );
};

const AtmosphericParticles: React.FC<{ sectorId: SectorId }> = ({ sectorId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colorMap: Record<SectorId, { r: number; g: number; b: number }> = {
      reactor: { r: 0, g: 245, b: 255 },
      lab: { r: 168, g: 85, b: 247 },
      bridge: { r: 59, g: 130, b: 246 },
      shields: { r: 255, g: 59, b: 59 },
      drones: { r: 57, g: 255, b: 20 },
    };

    const rgb = colorMap[sectorId] || colorMap.reactor;

    // Create 45 ambient floating dust / energy motes
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [sectorId]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />;
};

/* =========================================================================
   1. NÚCLEO DEL REACTOR (Faithful high-detail scenic illustration of image.png)
   ========================================================================= */
const ReactorScenery: React.FC<{ state: GameState }> = ({ state }) => {
  const isStabilized = state.reactorState.stabilizerActive && state.reactorState.magneticField >= 88;

  return (
    <svg className="w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gradients */}
        <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#041822" />
          <stop offset="60%" stopColor="#020e17" />
          <stop offset="100%" stopColor="#01070e" />
        </linearGradient>

        <linearGradient id="plasmaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#7df9ff" />
          <stop offset="50%" stopColor="#00d4ff" />
          <stop offset="80%" stopColor="#3d5afe" />
          <stop offset="100%" stopColor="#1a0033" />
        </linearGradient>

        <radialGradient id="beaconRed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="60%" stopColor="#ff0000" />
          <stop offset="100%" stopColor="#800000" />
        </radialGradient>

        <linearGradient id="consoleMetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a3845" />
          <stop offset="50%" stopColor="#0e232e" />
          <stop offset="100%" stopColor="#07151c" />
        </linearGradient>

        <pattern id="cyanRoomGrid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.14" />
        </pattern>
      </defs>

      {/* Room Base Background */}
      <rect width="1600" height="900" fill="url(#wallGradient)" />
      <rect width="1600" height="900" fill="url(#cyanRoomGrid)" />

      {/* Perspective Wall Angled Lines */}
      <line x1="0" y1="0" x2="360" y2="240" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.4" />
      <line x1="1600" y1="0" x2="1240" y2="240" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.4" />
      <line x1="0" y1="900" x2="360" y2="660" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.4" />
      <line x1="1600" y1="900" x2="1240" y2="660" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.4" />

      {/* Back Wall Bounding Box */}
      <rect x="360" y="240" width="880" height="420" fill="#01101a" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.3" />

      {/* Floor Grid Perspective Lines */}
      <g stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.2">
        <line x1="200" y1="900" x2="420" y2="660" />
        <line x1="450" y1="900" x2="560" y2="660" />
        <line x1="700" y1="900" x2="720" y2="660" />
        <line x1="900" y1="900" x2="880" y2="660" />
        <line x1="1150" y1="900" x2="1040" y2="660" />
        <line x1="1400" y1="900" x2="1180" y2="660" />
        <line x1="0" y1="780" x2="1600" y2="780" />
        <line x1="0" y1="710" x2="1600" y2="710" />
      </g>

      {/* Left Wall Blueprint Schematic Screen */}
      <g transform="translate(140, 110)">
        <rect width="210" height="150" rx="4" fill="#031e2b" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.7" />
        {/* Schematic Circuit Diagrams */}
        <line x1="20" y1="35" x2="80" y2="35" stroke="#00f5ff" strokeWidth="1.5" />
        <rect x="80" y="20" width="30" height="30" fill="none" stroke="#00f5ff" strokeWidth="1.5" />
        <line x1="110" y1="35" x2="180" y2="35" stroke="#00f5ff" strokeWidth="1.5" />
        <path d="M 140 35 L 140 70 L 60 70 L 60 100 L 160 100" fill="none" stroke="#00f5ff" strokeWidth="1.5" />
        <circle cx="160" cy="100" r="4" fill="#00f5ff" />
        <path d="M 25 125 Q 40 105, 55 125 T 85 125 T 115 125" fill="none" stroke="#39ff14" strokeWidth="1.5" />
        <text x="25" y="142" fill="#00f5ff" fontSize="9" fontFamily="Share Tech Mono">BUS VOLT: 2.4kV · FLUX: NOMINAL</text>
      </g>

      {/* Right Wall Blueprint Schematic Screen */}
      <g transform="translate(1220, 90)">
        <rect width="230" height="170" rx="4" fill="#031e2b" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.7" />
        <path d="M 20 40 Q 40 15, 60 40 T 100 40" fill="none" stroke="#00f5ff" strokeWidth="1.5" />
        <path d="M 20 70 Q 40 90, 60 70 T 100 70" fill="none" stroke="#ff3b3b" strokeWidth="1.5" />
        <rect x="120" y="25" width="85" height="120" fill="#02141c" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="130" y1="40" x2="190" y2="40" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="130" y1="55" x2="185" y2="55" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="130" y1="70" x2="175" y2="70" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="130" y1="85" x2="195" y2="85" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="130" y1="100" x2="165" y2="100" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.5" />
        <text x="20" y="125" fill="#00f5ff" fontSize="9" fontFamily="Share Tech Mono">MODULACIÓN DE FRECUENCIA</text>
      </g>

      {/* Left Wall Telemetry Rack Monitor */}
      <g transform="translate(40, 360)">
        <rect width="170" height="190" rx="6" fill="#0a2530" stroke="#00f5ff" strokeWidth="2" />
        <rect x="15" y="15" width="140" height="90" fill="#02131a" stroke="#00f5ff" strokeWidth="1" />
        <line x1="85" y1="15" x2="85" y2="105" stroke="#00f5ff" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="15" y1="60" x2="155" y2="60" stroke="#00f5ff" strokeWidth="0.8" strokeOpacity="0.4" />
        <text x="25" y="40" fill="#00f5ff" fontSize="10" fontFamily="Share Tech Mono">200°F</text>
        <text x="25" y="52" fill="#00f5ff" fontSize="10" fontFamily="Share Tech Mono">75°C</text>
        <text x="95" y="40" fill="#00f5ff" fontSize="10" fontFamily="Share Tech Mono">700°F</text>
        <text x="95" y="52" fill="#00f5ff" fontSize="10" fontFamily="Share Tech Mono">200°C</text>
        {/* Rack Buttons & Sliders */}
        <rect x="15" y="120" width="140" height="50" fill="#071922" rx="4" />
        <circle cx="35" cy="145" r="8" fill="#00f5ff" fillOpacity="0.4" stroke="#00f5ff" strokeWidth="1.5" />
        <circle cx="65" cy="145" r="8" fill="#39ff14" fillOpacity="0.4" stroke="#39ff14" strokeWidth="1.5" />
        <rect x="90" y="135" width="55" height="6" rx="3" fill="#020d14" />
        <rect x="110" y="131" width="8" height="14" rx="2" fill="#00f5ff" />
      </g>

      {/* Left Mainframe Server Racks with Red Emergency Sirens */}
      <g transform="translate(250, 240)">
        {/* Server Column 1 */}
        <rect width="110" height="280" fill="#0b242e" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.8" />
        {/* Flashing Red Beacon Light on Top */}
        <g transform="translate(43, -24)">
          <path d="M 0 24 L 24 24 L 20 0 L 4 0 Z" fill="url(#beaconRed)" stroke="#ff0000" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="14" fill="#ff0000" fillOpacity="0.25" className="animate-ping" />
        </g>
        {/* Server Blades with Status LEDs */}
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <g key={i} transform={`translate(8, ${15 + i * 36})`}>
            <rect width="94" height="28" fill="#04151c" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.4" rx="2" />
            <circle cx="12" cy="14" r="3" fill={i % 2 === 0 ? '#39ff14' : '#00f5ff'} />
            <circle cx="22" cy="14" r="3" fill={i === 3 ? '#ff3b3b' : '#39ff14'} />
            <line x1="34" y1="14" x2="84" y2="14" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3, 3" />
          </g>
        ))}
      </g>

      {/* Right Mainframe Server Racks */}
      <g transform="translate(1080, 240)">
        <rect width="110" height="280" fill="#0b242e" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.8" />
        <g transform="translate(43, -24)">
          <path d="M 0 24 L 24 24 L 20 0 L 4 0 Z" fill="url(#beaconRed)" stroke="#ff0000" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="14" fill="#ff0000" fillOpacity="0.25" className="animate-ping" />
        </g>
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <g key={i} transform={`translate(8, ${15 + i * 36})`}>
            <rect width="94" height="28" fill="#04151c" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.4" rx="2" />
            <circle cx="12" cy="14" r="3" fill="#39ff14" />
            <circle cx="22" cy="14" r="3" fill={i === 1 ? '#ff3b3b' : '#00f5ff'} />
            <line x1="34" y1="14" x2="84" y2="14" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3, 3" />
          </g>
        ))}
      </g>

      {/* Central Fusion Reactor Tokamak Chamber */}
      <g transform="translate(800, 320)">
        {/* Header Tag */}
        <rect x="-140" y="-170" width="280" height="28" fill="#031622" stroke="#00f5ff" strokeWidth="1.5" rx="3" />
        <text x="0" y="-152" fill="#00f5ff" fontSize="12" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle" letterSpacing="2">
          [NÚCLEO DEL REACTOR DE FUSIÓN]
        </text>

        {/* Heavy Structural Containment Shell */}
        <polygon points="0,-130 115,-90 145,30 80,130 -80,130 -145,30 -115,-90" fill="#07202b" stroke="#00f5ff" strokeWidth="4" />
        <polygon points="0,-115 100,-80 125,25 70,115 -70,115 -125,25 -100,-80" fill="#020c13" stroke="#00f5ff" strokeWidth="2" strokeDasharray="8, 4" />

        {/* Core Viewport Window */}
        <circle cx="0" cy="10" r="82" fill="#01070e" stroke="#00f5ff" strokeWidth="3" />

        {/* Glowing Fusion Plasma Energy Ball */}
        <circle cx="0" cy="10" r={isStabilized ? 58 : 68} fill="url(#plasmaGlow)" className="animate-pulse" style={{ animationDuration: isStabilized ? '3s' : '1.2s' }} />

        {/* Electric arcs inside plasma */}
        <path d="M -35 -15 Q -10 5, 5 -25 T 35 15" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.9" />
        <path d="M -25 25 Q 10 30, 20 5 T 30 35" fill="none" stroke="#7df9ff" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M -40 10 Q 0 -30, 40 5" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.8" />

        {/* Overhead Conduits & High-Voltage Pipes */}
        <path d="M -145 30 L -250 80 L -250 200" fill="none" stroke="#123b49" strokeWidth="18" strokeLinecap="round" />
        <path d="M -145 30 L -250 80 L -250 200" fill="none" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.6" />
        <path d="M 145 30 L 250 80 L 250 200" fill="none" stroke="#123b49" strokeWidth="18" strokeLinecap="round" />
        <path d="M 145 30 L 250 80 L 250 200" fill="none" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.6" />
      </g>

      {/* Main Center Console Deck (From image.png) */}
      <g transform="translate(800, 640)">
        {/* Main Console Frame Table */}
        <path d="M -240 60 L 240 60 L 200 240 L -200 240 Z" fill="url(#consoleMetal)" stroke="#00f5ff" strokeWidth="3" />
        <rect x="-180" y="75" width="360" height="90" fill="#091f28" stroke="#00f5ff" strokeWidth="1.5" rx="4" />

        {/* Center CRT Monitor */}
        <g transform="translate(0, -90)">
          {/* Monitor Stand */}
          <rect x="-25" y="90" width="50" height="60" fill="#091f28" stroke="#00f5ff" strokeWidth="2" />
          {/* Bezel */}
          <rect x="-170" y="-80" width="340" height="170" rx="8" fill="#04151e" stroke="#00f5ff" strokeWidth="3" />
          <rect x="-155" y="-68" width="310" height="146" rx="4" fill="#020e14" stroke="#00f5ff" strokeWidth="1.5" />
          {/* CRT Screen Scanline effect inside monitor */}
          <rect x="-155" y="-68" width="310" height="146" fill="#00f5ff" fillOpacity="0.04" />
          {/* Mission Objective Text */}
          <text x="0" y="-20" fill="#00f5ff" fontSize="16" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">
            [OBJETIVO DE LA MISIÓN:
          </text>
          <text x="0" y="14" fill="#39ff14" fontSize="16" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle">
            Estabilizar Flujo de Plasma]
          </text>
        </g>

        {/* Buttons and switches on Console Table */}
        <g transform="translate(-160, 90)">
          {/* Mini Wave Display */}
          <rect width="70" height="40" fill="#020e14" stroke="#00f5ff" strokeWidth="1" rx="2" />
          <path d="M 5 20 Q 20 5, 35 20 T 65 20" fill="none" stroke="#39ff14" strokeWidth="1.5" />
          {/* Gear icon button */}
          <circle cx="20" cy="55" r="9" fill="#07222c" stroke="#00f5ff" strokeWidth="1" />
          <circle cx="50" cy="55" r="9" fill="#07222c" stroke="#ffd700" strokeWidth="1" />
        </g>

        {/* Keyboard keypad grid */}
        <g transform="translate(40, 85)">
          <rect width="110" height="65" fill="#031118" stroke="#00f5ff" strokeWidth="1" rx="2" />
          {[0, 1, 2].map(r => (
            <g key={r}>
              {[0, 1, 2, 3].map(c => (
                <rect key={c} x={8 + c * 24} y={8 + r * 18} width="18" height="12" rx="2" fill="#0a2b38" stroke="#00f5ff" strokeWidth="0.8" />
              ))}
            </g>
          ))}
        </g>

        {/* Sliders on console */}
        <g transform="translate(170, 85)">
          <rect x="0" y="5" width="6" height="55" rx="3" fill="#020c12" />
          <rect x="-4" y="20" width="14" height="8" rx="2" fill="#00f5ff" />
        </g>
      </g>

      {/* Right Foreground Console with ERROR spark screen (From image.png) */}
      <g transform="translate(1080, 480)">
        {/* Slanted Cabinet Box */}
        <polygon points="0,50 320,50 280,360 40,360" fill="url(#consoleMetal)" stroke="#00f5ff" strokeWidth="3" />
        {/* Monitor Screen Frame */}
        <polygon points="40,80 280,80 260,250 60,250" fill="#1b392b" stroke="#39ff14" strokeWidth="2.5" />
        <polygon points="50,90 270,90 252,240 68,240" fill="#0d281a" />
        {/* ERROR Badge */}
        <rect x="120" y="105" width="80" height="22" rx="3" fill="#ff0000" stroke="#ff4d4d" strokeWidth="1" />
        <text x="160" y="120" fill="#ffffff" fontSize="11" fontFamily="Share Tech Mono" fontWeight="bold" textAnchor="middle">
          ! ERROR
        </text>
        {/* Severed red circuit line with sparks */}
        <path d="M 75 185 L 140 185 L 165 215 L 210 170 L 255 170" fill="none" stroke="#ff3b3b" strokeWidth="5" strokeLinecap="round" />
        {/* Sparks */}
        <line x1="205" y1="165" x2="200" y2="150" stroke="#ffd700" strokeWidth="2" />
        <line x1="215" y1="165" x2="225" y2="155" stroke="#ffd700" strokeWidth="2" />
        <line x1="210" y1="175" x2="215" y2="190" stroke="#ff8c00" strokeWidth="2" />
        {/* Yellow Repair Wrench Tool Icon */}
        <g transform="translate(205, 175) rotate(35)">
          <path d="M 0 0 L 0 35 L 8 35 L 8 0 Z" fill="#ffd700" stroke="#000" strokeWidth="1" />
          <circle cx="4" cy="0" r="10" fill="#ffd700" stroke="#000" strokeWidth="1" />
          <circle cx="4" cy="0" r="5" fill="#0d281a" />
        </g>
      </g>
    </svg>
  );
};

/* =========================================================================
   2. LABORATORIOS DE DATOS Y PROCESADO LÓGICO (Exact match to user artwork)
   ========================================================================= */
const LabScenery: React.FC<{ state: GameState }> = ({ state }) => {
  const isRepaired = state.labState.andGateRepaired;

  return (
    <svg className="w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="labWallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#041b24" />
          <stop offset="50%" stopColor="#021219" />
          <stop offset="100%" stopColor="#01080d" />
        </linearGradient>

        <linearGradient id="cylinderGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#00f5ff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.35" />
        </linearGradient>

        <linearGradient id="chipTierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>

        <pattern id="labCyanGrid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#00f5ff" strokeWidth="1" strokeOpacity="0.12" />
        </pattern>
      </defs>

      {/* Base Room & Perspective Cyber Grid */}
      <rect width="1600" height="900" fill="url(#labWallGrad)" />
      <rect width="1600" height="900" fill="url(#labCyanGrid)" />

      {/* Perspective Hall Lines */}
      <line x1="0" y1="0" x2="360" y2="240" stroke="#00f5ff" strokeWidth="1.5" strokeOpacity="0.3" />
      <line x1="1600" y1="0" x2="1240" y2="240" stroke="#00f5ff" strokeWidth="1.5" strokeOpacity="0.3" />
      <line x1="0" y1="900" x2="360" y2="660" stroke="#00f5ff" strokeWidth="1.5" strokeOpacity="0.3" />
      <line x1="1600" y1="900" x2="1240" y2="660" stroke="#00f5ff" strokeWidth="1.5" strokeOpacity="0.3" />

      {/* Top Banner Tag: [LABORATORIOS DE DATOS Y PROCESADO LÓGICO] */}
      <g transform="translate(60, 45)">
        <text x="0" y="0" fill="#00f5ff" fontSize="22" fontFamily="Orbitron" fontWeight="bold" letterSpacing="2">
          [LABORATORIOS DE DATOS Y PROCESADO LÓGICO]
        </text>
      </g>

      {/* Left Wall Blueprint Schematic: Boolean Logic Gate Matrix */}
      <g transform="translate(60, 140)">
        <rect width="180" height="120" rx="4" fill="#02131d" stroke="#00f5ff" strokeWidth="1.5" />
        <rect x="8" y="8" width="164" height="104" fill="#010c14" stroke="#00f5ff" strokeWidth="0.8" />
        {/* Logic Gate Schematics */}
        <path d="M 25 35 L 55 35 A 15 15 0 0 1 55 65 L 25 65 Z" fill="none" stroke="#00f5ff" strokeWidth="1.5" />
        <line x1="15" y1="42" x2="25" y2="42" stroke="#00f5ff" strokeWidth="1.2" />
        <line x1="15" y1="58" x2="25" y2="58" stroke="#00f5ff" strokeWidth="1.2" />
        <line x1="70" y1="50" x2="85" y2="50" stroke="#00f5ff" strokeWidth="1.2" />
        {/* Second Gate */}
        <path d="M 95 35 L 125 35 A 15 15 0 0 1 125 65 L 95 65 Z" fill="none" stroke="#00f5ff" strokeWidth="1.5" />
        <line x1="140" y1="50" x2="155" y2="50" stroke="#00f5ff" strokeWidth="1.2" />
      </g>

      {/* Left Server Racks */}
      <g transform="translate(180, 290)">
        <rect width="110" height="300" rx="4" fill="#031822" stroke="#00f5ff" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <g key={i} transform={`translate(10, ${15 + i * 34})`}>
            <rect width="90" height="24" rx="2" fill="#020f17" stroke="#00f5ff" strokeWidth="0.8" />
            <circle cx="12" cy="12" r="3" fill="#22c55e" />
            <circle cx="24" cy="12" r="3" fill="#00f5ff" />
            <circle cx="36" cy="12" r="3" fill="#38bdf8" />
            <line x1="48" y1="12" x2="82" y2="12" stroke="#00f5ff" strokeWidth="1" strokeDasharray="3, 3" />
          </g>
        ))}
      </g>

      {/* Back Wall Logic Diagram Screen */}
      <g transform="translate(680, 140)">
        <rect width="240" height="130" rx="4" fill="#031822" stroke="#00f5ff" strokeWidth="1.5" />
        <rect x="10" y="10" width="220" height="110" fill="#010e17" stroke="#00f5ff" strokeWidth="0.8" />
        {/* Logic circuit */}
        <path d="M 40 45 L 80 45 A 25 25 0 0 1 80 95 L 40 95 Z" fill="none" stroke="#00f5ff" strokeWidth="2" />
        <line x1="20" y1="55" x2="40" y2="55" stroke="#00f5ff" strokeWidth="1.5" />
        <line x1="20" y1="85" x2="40" y2="85" stroke="#00f5ff" strokeWidth="1.5" />
        <line x1="105" y1="70" x2="140" y2="70" stroke="#00f5ff" strokeWidth="1.5" />
        <text x="170" y="74" fill="#22c55e" fontSize="11" fontFamily="Share Tech Mono">TRUTH_TABLE</text>
      </g>

      {/* Center-Left: [NÚCLEO DE ALGORITMOS] (Vertical Glass Containment Cylinder) */}
      <g transform="translate(480, 360)">
        {/* Top Header Tag */}
        <rect x="-110" y="-190" width="220" height="26" rx="3" fill="#02141e" stroke="#00f5ff" strokeWidth="1.5" />
        <text x="0" y="-172" fill="#00f5ff" fontSize="11" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle" letterSpacing="1">
          [NÚCLEO DE ALGORITMOS]
        </text>

        {/* Heavy Base & Top Cap */}
        <ellipse cx="0" cy="150" rx="100" ry="25" fill="#061e2b" stroke="#00f5ff" strokeWidth="3" />
        <ellipse cx="0" cy="-140" rx="90" ry="20" fill="#061e2b" stroke="#00f5ff" strokeWidth="3" />

        {/* Cylinder Glass Tube */}
        <rect x="-80" y="-140" width="160" height="280" fill="url(#cylinderGlass)" stroke="#00f5ff" strokeWidth="2" />

        {/* Internal Stack of Quantum Algorithm Chips */}
        {/* Layer 1 (Green) */}
        <g transform="translate(0, -60)">
          <polygon points="-55,-12 0,-30 55,-12 0,6" fill="url(#chipTierGrad)" stroke="#34d399" strokeWidth="1.5" />
          <polygon points="-55,-12 -55,0 0,18 55,0 55,-12 0,6" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
          {/* Pins */}
          {[-40, -20, 0, 20, 40].map((px, idx) => (
            <line key={idx} x1={px} y1="12" x2={px} y2="24" stroke="#ffd700" strokeWidth="2" />
          ))}
        </g>

        {/* Layer 2 (Cyan/Blue) */}
        <g transform="translate(0, 0)">
          <polygon points="-55,-12 0,-30 55,-12 0,6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <polygon points="-55,-12 -55,0 0,18 55,0 55,-12 0,6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
          {[-40, -20, 0, 20, 40].map((px, idx) => (
            <line key={idx} x1={px} y1="12" x2={px} y2="24" stroke="#ffd700" strokeWidth="2" />
          ))}
        </g>

        {/* Layer 3 (Gold/Purple) */}
        <g transform="translate(0, 60)">
          <polygon points="-55,-12 0,-30 55,-12 0,6" fill="#7c3aed" stroke="#a78bfa" strokeWidth="1.5" />
          <polygon points="-55,-12 -55,0 0,18 55,0 55,-12 0,6" fill="#5b21b6" stroke="#a78bfa" strokeWidth="1.5" />
        </g>

        {/* Base Cooling Pipes to Ground */}
        <path d="M -60 150 C -60 210, -120 220, -160 230" fill="none" stroke="#00f5ff" strokeWidth="8" opacity="0.6" />
        <path d="M 60 150 C 60 210, 120 220, 160 230" fill="none" stroke="#00f5ff" strokeWidth="8" opacity="0.6" />
      </g>

      {/* Operator in Space Flight Suit Working at Holographic Telemetry (from Vista Laboratorio de Datos 1.png) */}
      <g transform="translate(320, 240)">
        {/* Floating Holographic Telemetry Screen */}
        <rect x="-90" y="30" width="100" height="90" rx="4" fill="#00f5ff" fillOpacity="0.08" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="4, 2" />
        {/* Bar charts on hologram */}
        <rect x="-80" y="80" width="8" height="30" fill="#22c55e" />
        <rect x="-68" y="65" width="8" height="45" fill="#00f5ff" />
        <rect x="-56" y="55" width="8" height="55" fill="#38bdf8" />
        <rect x="-44" y="70" width="8" height="40" fill="#22c55e" />
        <rect x="-32" y="50" width="8" height="60" fill="#a855f7" />
        <text x="-80" y="45" fill="#00f5ff" fontSize="9" fontFamily="Share Tech Mono">HE-LÍQUIDO</text>

        {/* Astronaut Profile Figure */}
        <g transform="translate(40, 20)">
          {/* Head & Visor */}
          <circle cx="10" cy="10" r="16" fill="#cbd5e1" stroke="#00f5ff" strokeWidth="1.5" />
          <path d="M 12 4 A 10 10 0 0 1 24 18 L 12 18 Z" fill="#00f5ff" opacity="0.8" />
          {/* Body */}
          <path d="M -6 28 L 22 28 L 18 110 L -2 110 Z" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
          {/* Extended arm touching hologram */}
          <path d="M 0 35 L -35 55 L -65 50" fill="none" stroke="#475569" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="-65" cy="50" r="5" fill="#94a3b8" />
          {/* Telemetry suit light stripe */}
          <path d="M 2 30 L 14 30 L 12 80 L 4 80 Z" fill="#00f5ff" opacity="0.7" />
        </g>
      </g>

      {/* Right Server Stacks */}
      <g transform="translate(1100, 240)">
        <rect width="180" height="240" rx="4" fill="#031822" stroke="#00f5ff" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <g key={i} transform={`translate(10, ${12 + i * 36})`}>
            <rect width="160" height="26" rx="2" fill="#020f17" stroke="#00f5ff" strokeWidth="0.8" />
            <circle cx="15" cy="13" r="3" fill="#22c55e" />
            <circle cx="28" cy="13" r="3" fill="#00f5ff" />
            <line x1="42" y1="13" x2="145" y2="13" stroke="#00f5ff" strokeWidth="1" strokeDasharray="4, 4" />
          </g>
        ))}
      </g>

      {/* Far Right Monitor Displaying Logic Gate */}
      <g transform="translate(1330, 350)">
        <rect width="160" height="110" rx="4" fill="#031822" stroke="#00f5ff" strokeWidth="1.5" />
        <rect x="8" y="8" width="144" height="94" fill="#010c14" stroke="#00f5ff" strokeWidth="0.8" />
        {/* Logic gate diagram */}
        <path d="M 25 35 L 55 35 A 15 15 0 0 1 55 65 L 25 65 Z" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <line x1="15" y1="42" x2="25" y2="42" stroke="#00f5ff" strokeWidth="1.2" />
        <line x1="15" y1="58" x2="25" y2="58" stroke="#00f5ff" strokeWidth="1.2" />
        <line x1="70" y1="50" x2="95" y2="50" stroke="#22c55e" strokeWidth="1.2" />
      </g>

      {/* =========================================================================
          MAIN CENTER CONSOLE TABLE DECK (Exact to Vista Laboratorio de Datos.png)
          ========================================================================= */}
      <g transform="translate(800, 640)">
        {/* Main Console Frame Table */}
        <path d="M -240 60 L 240 60 L 200 240 L -200 240 Z" fill="#0a2530" stroke="#00f5ff" strokeWidth="3" />
        <rect x="-180" y="75" width="360" height="90" fill="#041822" stroke="#00f5ff" strokeWidth="1.5" rx="4" />

        {/* Center CRT Monitor Stand & Screen */}
        <g transform="translate(0, -90)">
          {/* Stand */}
          <rect x="-25" y="90" width="50" height="60" fill="#041822" stroke="#00f5ff" strokeWidth="2" />
          {/* Bezel */}
          <rect x="-170" y="-80" width="340" height="170" rx="8" fill="#031520" stroke="#00f5ff" strokeWidth="3" />
          <rect x="-155" y="-68" width="310" height="146" rx="4" fill="#010c14" stroke="#00f5ff" strokeWidth="1.5" />
          <rect x="-155" y="-68" width="310" height="146" fill="#00f5ff" fillOpacity="0.04" />

          {/* Mission Objective Text on Main Screen */}
          <text x="0" y="-20" fill="#00f5ff" fontSize="16" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">
            [OBJETIVO DE LA MISIÓN:
          </text>
          <text x="0" y="16" fill={isRepaired ? '#34d399' : '#00f5ff'} fontSize="17" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle">
            Reparar Puerta Lógica]
          </text>
        </g>

        {/* Controls on Console Table */}
        <g transform="translate(-160, 90)">
          <rect width="70" height="40" fill="#020e14" stroke="#00f5ff" strokeWidth="1" rx="2" />
          <path d="M 5 20 Q 20 5, 35 20 T 65 20" fill="none" stroke="#22c55e" strokeWidth="1.5" />
          {/* Gear icon button */}
          <circle cx="20" cy="55" r="9" fill="#07222c" stroke="#00f5ff" strokeWidth="1" />
          <circle cx="50" cy="55" r="9" fill="#07222c" stroke="#ffd700" strokeWidth="1" />
        </g>

        {/* Keypad Grid */}
        <g transform="translate(40, 85)">
          <rect width="110" height="65" fill="#031118" stroke="#00f5ff" strokeWidth="1" rx="2" />
          {[0, 1, 2].map(r => (
            <g key={r}>
              {[0, 1, 2, 3].map(c => (
                <rect key={c} x={8 + c * 24} y={8 + r * 18} width="18" height="12" rx="2" fill="#0a2b38" stroke="#00f5ff" strokeWidth="0.8" />
              ))}
            </g>
          ))}
        </g>

        {/* Sliders on Console Table */}
        <g transform="translate(170, 85)">
          <rect x="0" y="5" width="6" height="55" rx="3" fill="#020c12" />
          <rect x="-4" y="20" width="14" height="8" rx="2" fill="#00f5ff" />
        </g>
      </g>

      {/* =========================================================================
          RIGHT FOREGROUND DIAGNOSTIC CONSOLE: ! ERROR AND GATE (Exact to user art)
          ========================================================================= */}
      <g transform="translate(1080, 480)">
        {/* Slanted Cabinet Box */}
        <polygon points="0,50 320,50 280,360 40,360" fill="#0a2530" stroke="#00f5ff" strokeWidth="3" />
        {/* Monitor Screen Frame */}
        <polygon points="40,80 280,80 260,250 60,250" fill="#0d281a" stroke="#22c55e" strokeWidth="2.5" />
        <polygon points="50,90 270,90 252,240 68,240" fill="#051c11" />

        {/* ERROR Badge */}
        <rect x="120" y="102" width="80" height="22" rx="3" fill="#ff0000" stroke="#ff4d4d" strokeWidth="1" />
        <text x="160" y="117" fill="#ffffff" fontSize="11" fontFamily="Share Tech Mono" fontWeight="bold" textAnchor="middle">
          ! ERROR
        </text>

        {/* Logic Gate Circuit on Monitor */}
        <g transform="translate(80, 140)">
          {/* Input lines */}
          <line x1="0" y1="20" x2="30" y2="20" stroke="#22c55e" strokeWidth="2.5" />
          <line x1="0" y1="45" x2="30" y2="45" stroke="#22c55e" strokeWidth="2.5" />

          {/* AND Gate Body */}
          <path d="M 30 10 L 60 10 A 20 20 0 0 1 60 55 L 30 55 Z" fill="#06331e" stroke="#22c55e" strokeWidth="2.5" />
          <text x="45" y="38" fill="#ffffff" fontSize="12" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle">
            AND
          </text>

          {/* Output Line leading to Burned Microchip */}
          <line x1="80" y1="32" x2="110" y2="32" stroke={isRepaired ? '#22c55e' : '#ef4444'} strokeWidth="2.5" />

          {/* Broken Microchip with Smoke/Sparks */}
          <rect x="110" y="20" width="30" height="25" rx="2" fill={isRepaired ? '#047857' : '#1c1917'} stroke={isRepaired ? '#22c55e' : '#ef4444'} strokeWidth="1.5" />
          
          {/* Fried smoke & spark indicator */}
          {!isRepaired && (
            <g transform="translate(125, 32)">
              <polygon points="-6,-6 0,-14 6,-6 14,0 6,6 0,14 -6,6 -14,0" fill="#f59e0b" opacity="0.8" />
              <line x1="0" y1="0" x2="12" y2="-12" stroke="#fef08a" strokeWidth="2" />
              <line x1="0" y1="0" x2="-10" y2="-10" stroke="#f97316" strokeWidth="2" />
            </g>
          )}

          {/* Yellow Repair Wrench Tool Icon pointing at damaged chip */}
          <g transform="translate(138, 40) rotate(40)">
            <path d="M 0 0 L 0 32 L 8 32 L 8 0 Z" fill="#eab308" stroke="#000" strokeWidth="1" />
            <circle cx="4" cy="0" r="9" fill="#eab308" stroke="#000" strokeWidth="1" />
            <circle cx="4" cy="0" r="4" fill="#051c11" />
          </g>
        </g>
      </g>
    </svg>
  );
};

/* =========================================================================
   3. PUENTE DE MANDO & NAVEGACIÓN (Cockpit, Space Viewport & Holotable)
   ========================================================================= */
const BridgeScenery: React.FC<{ state: GameState }> = ({ state }) => {
  return (
    <svg className="w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="spaceDeep" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1a0033" />
          <stop offset="40%" stopColor="#080e2b" />
          <stop offset="100%" stopColor="#010410" />
        </radialGradient>

        <radialGradient id="nebulaColor" cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Deep Space Viewport Background */}
      <rect width="1600" height="900" fill="url(#spaceDeep)" />
      <circle cx="560" cy="240" r="320" fill="url(#nebulaColor)" />

      {/* Stars in Space Window */}
      <g fill="#ffffff">
        <circle cx="200" cy="120" r="1.5" />
        <circle cx="340" cy="90" r="2" />
        <circle cx="480" cy="180" r="1" />
        <circle cx="680" cy="110" r="2.5" />
        <circle cx="820" cy="220" r="1.5" />
        <circle cx="950" cy="140" r="2" />
        <circle cx="1120" cy="80" r="1" />
        <circle cx="1350" cy="190" r="2" />
        <circle cx="1440" cy="100" r="1.5" />
        <circle cx="750" cy="60" r="1.8" />
      </g>

      {/* Reinforced Cockpit Panoramic Viewport Struts */}
      <path d="M 0 0 L 1600 0 L 1400 480 L 200 480 Z" fill="none" stroke="#00f5ff" strokeWidth="6" strokeOpacity="0.4" />
      <line x1="500" y1="0" x2="450" y2="480" stroke="#0e2838" strokeWidth="18" />
      <line x1="500" y1="0" x2="450" y2="480" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.7" />
      <line x1="1100" y1="0" x2="1150" y2="480" stroke="#0e2838" strokeWidth="18" />
      <line x1="1100" y1="0" x2="1150" y2="480" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.7" />
      <line x1="800" y1="0" x2="800" y2="480" stroke="#0e2838" strokeWidth="14" />
      <line x1="800" y1="0" x2="800" y2="480" stroke="#00f5ff" strokeWidth="1.5" strokeOpacity="0.5" />

      {/* Artificial Horizon HUD Overlay in Space Viewport */}
      <g transform="translate(800, 220)">
        <circle cx="0" cy="0" r="85" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="6, 6" strokeOpacity="0.6" />
        <line x1="-120" y1="0" x2="-40" y2="0" stroke="#00f5ff" strokeWidth="2" />
        <line x1="40" y1="0" x2="120" y2="0" stroke="#00f5ff" strokeWidth="2" />
        <line x1="0" y1="-30" x2="0" y2="30" stroke="#00f5ff" strokeWidth="1.5" strokeOpacity="0.5" />
        <text x="0" y="-95" fill="#00f5ff" fontSize="11" fontFamily="Orbitron" textAnchor="middle">
          VECTOR ORBITAL: {state.bridgeState.trajectorySafe ? 'ESTABLE 0.0 m/s²' : 'DECAIMIENTO -1.4 m/s²'}
        </text>
      </g>

      {/* Central Tactical Holotable */}
      <g transform="translate(800, 520)">
        <ellipse cx="0" cy="40" rx="220" ry="70" fill="#031622" stroke="#00f5ff" strokeWidth="3" />
        <ellipse cx="0" cy="40" rx="180" ry="55" fill="#010b12" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="8, 4" />
        {/* Hologram Rings Floating Above */}
        <ellipse cx="0" cy="-20" rx="140" ry="45" fill="none" stroke="#00f5ff" strokeWidth="2" strokeOpacity="0.8" />
        <ellipse cx="0" cy="-60" rx="90" ry="30" fill="none" stroke="#39ff14" strokeWidth="1.5" strokeOpacity="0.7" />
        {/* Space Station 3D Wireframe Node */}
        <circle cx="0" cy="-20" r="8" fill="#ffd700" />
        <line x1="0" y1="-20" x2="60" y2="-60" stroke="#ff3b3b" strokeWidth="2" strokeDasharray="3, 3" />
        <circle cx="60" cy="-60" r="6" fill="#ff3b3b" />
        <text x="75" y="-55" fill="#ff3b3b" fontSize="10" fontFamily="Share Tech Mono">TRAJECTORIA DE DESECHO</text>
      </g>

      {/* Left/Right Flight Telemetry Banks: Thrusters T0, T1, T2, T3 */}
      <g transform="translate(240, 560)">
        <rect width="260" height="220" rx="8" fill="#091b26" stroke="#00f5ff" strokeWidth="2" />
        <text x="20" y="30" fill="#00f5ff" fontSize="12" fontFamily="Orbitron" fontWeight="bold">TELEMETRÍA RCS</text>
        {[0, 1, 2, 3].map(i => {
          const val = state.bridgeState.thrustersCalibrated[i] || 0;
          return (
            <g key={i} transform={`translate(20, ${50 + i * 40})`}>
              <text x="0" y="15" fill="#ffffff" fontSize="11" fontFamily="Share Tech Mono">PROPULSOR #{i}:</text>
              <rect x="110" y="5" width="100" height="12" rx="2" fill="#020d14" />
              <rect x="110" y="5" width={val} height="12" rx="2" fill={val >= 90 ? '#39ff14' : '#ff8c00'} />
              <text x="220" y="16" fill="#00f5ff" fontSize="11" fontFamily="Share Tech Mono">{val}%</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/* =========================================================================
   4. MATRIZ DE ESCUDOS & CIBER-GUERRA (Electronic Warfare & Forcefield)
   ========================================================================= */
const ShieldsScenery: React.FC<{ state: GameState }> = ({ state }) => {
  return (
    <svg className="w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f0303" />
          <stop offset="60%" stopColor="#120101" />
          <stop offset="100%" stopColor="#050000" />
        </linearGradient>

        <pattern id="shieldHex" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon points="30 0, 60 17, 60 35, 30 52, 0 35, 0 17" fill="none" stroke="#ff3b3b" strokeWidth="1" strokeOpacity="0.18" />
        </pattern>
      </defs>

      <rect width="1600" height="900" fill="url(#shieldBg)" />
      <rect width="1600" height="900" fill="url(#shieldHex)" />

      {/* Central Massive Electromagnetic Deflector Emitter */}
      <g transform="translate(800, 360)">
        {/* Huge Radiating Forcefield Hex Rings */}
        <polygon points="0,-220 190,-110 190,110 0,220 -190,110 -190,-110" fill="none" stroke="#ff3b3b" strokeWidth="3" strokeOpacity="0.4" className="animate-pulse" />
        <polygon points="0,-160 140,-80 140,80 0,160 -140,80 -140,-80" fill="#ff0000" fillOpacity="0.05" stroke="#ff8c00" strokeWidth="2.5" />

        {/* Core Generator Emitter Hub */}
        <circle cx="0" cy="0" r="80" fill="#1f0a0a" stroke="#ff3b3b" strokeWidth="4" />
        <circle cx="0" cy="0" r="50" fill="#ff3b3b" fillOpacity="0.3" stroke="#ffd700" strokeWidth="2" className="animate-ping" style={{ animationDuration: '4s' }} />
        <text x="0" y="8" fill="#ffffff" fontSize="16" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle">DEFLECTOR</text>
      </g>

      {/* Cyber Warfare Packet Stream Monitor on Left */}
      <g transform="translate(140, 200)">
        <rect width="280" height="340" rx="8" fill="#140606" stroke="#ff3b3b" strokeWidth="2" />
        <text x="20" y="30" fill="#ff3b3b" fontSize="12" fontFamily="Orbitron" fontWeight="bold">STREAM DE PAQUETES (ETH0)</text>
        <line x1="20" y1="42" x2="260" y2="42" stroke="#ff3b3b" strokeWidth="1" strokeOpacity="0.4" />
        <text x="20" y="70" fill="#39ff14" fontSize="11" fontFamily="Share Tech Mono">[RECV] SYS_HEARTBEAT_ACK · 64B</text>
        <text x="20" y="95" fill="#39ff14" fontSize="11" fontFamily="Share Tech Mono">[RECV] COM_TELEMETRY_OK · 128B</text>
        <text x="20" y="120" fill={state.shieldState.intrusionSuppressed ? '#39ff14' : '#ff3b3b'} fontSize="11" fontFamily="Share Tech Mono">
          {state.shieldState.intrusionSuppressed ? '[BLOCKED] MALW_NEMESIS: DROP' : '[INJECT] MALW_NEMESIS_OVERFLOW!'}
        </text>
        <text x="20" y="145" fill={state.shieldState.firewallRulesActive ? '#39ff14' : '#ff8c00'} fontSize="11" fontFamily="Share Tech Mono">
          FIREWALL: {state.shieldState.firewallRulesActive ? 'FILTER_ACTIVE (DROP ALL)' : 'PASSIVE (VULNERABLE)'}
        </text>
      </g>

      {/* Port Security Array on Right */}
      <g transform="translate(1180, 200)">
        <rect width="280" height="340" rx="8" fill="#140606" stroke="#ff3b3b" strokeWidth="2" />
        <text x="20" y="30" fill="#ff8c00" fontSize="12" fontFamily="Orbitron" fontWeight="bold">AUDITORÍA DE PUERTOS</text>
        <line x1="20" y1="42" x2="260" y2="42" stroke="#ff8c00" strokeWidth="1" strokeOpacity="0.4" />
        <text x="20" y="75" fill="#39ff14" fontSize="12" fontFamily="Share Tech Mono">PUERTO 22 (SSH): AISLADO [SEGURO]</text>
        <text x="20" y="110" fill="#39ff14" fontSize="12" fontFamily="Share Tech Mono">PUERTO 443 (SSL): NOMINAL</text>
        <text x="20" y="145" fill={state.shieldState.intrusionSuppressed ? '#39ff14' : '#ff3b3b'} fontSize="12" fontFamily="Share Tech Mono">
          PUERTO 8088: {state.shieldState.intrusionSuppressed ? 'CERRADO / PURGADO ✓' : 'INTRUSIÓN EN PROGRESO ✗'}
        </text>
      </g>
    </svg>
  );
};

/* =========================================================================
   5. BAHÍA DE DRONES & SOPORTE VITAL (Autonomous Drones & Oxygen Tanks)
   ========================================================================= */
const DronesScenery: React.FC<{ state: GameState }> = ({ state }) => {
  return (
    <svg className="w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="droneBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#041c10" />
          <stop offset="60%" stopColor="#020f08" />
          <stop offset="100%" stopColor="#000603" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#droneBg)" />

      {/* Overhead Crane Gantry Rail */}
      <rect x="0" y="60" width="1600" height="30" fill="#1b2e1a" stroke="#ffd700" strokeWidth="2" strokeDasharray="20, 10" />
      <rect x="740" y="90" width="120" height="40" fill="#2d4229" stroke="#39ff14" strokeWidth="2" rx="4" />
      <line x1="800" y1="130" x2="800" y2="220" stroke="#39ff14" strokeWidth="3" />

      {/* Maintenance Drone Suspended */}
      <g transform="translate(800, 260)">
        <polygon points="0,-40 60,0 40,40 -40,40 -60,0" fill="#0d2417" stroke="#39ff14" strokeWidth="3" />
        {/* Drone Optics Eye */}
        <circle cx="0" cy="0" r="14" fill="#00f5ff" className="animate-pulse" />
        <line x1="-30" y1="40" x2="-35" y2="70" stroke="#ffd700" strokeWidth="3" />
        <line x1="30" y1="40" x2="35" y2="70" stroke="#ffd700" strokeWidth="3" />
        <text x="0" y="-55" fill="#39ff14" fontSize="12" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle">
          DRONE-O2-ALFA [AUTÓNOMO]
        </text>
      </g>

      {/* Left Wall Oxygen Scrubber High Pressure Tanks */}
      <g transform="translate(180, 200)">
        <rect width="80" height="260" rx="35" fill="#0c2e1b" stroke="#39ff14" strokeWidth="3" />
        <rect width="80" height="260" rx="35" fill="#0c2e1b" stroke="#39ff14" strokeWidth="3" transform="translate(100, 0)" />
        <text x="40" y="140" fill="#39ff14" fontSize="14" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle">O₂ #1</text>
        <text x="140" y="140" fill="#39ff14" fontSize="14" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle">O₂ #2</text>
      </g>

      {/* Right Wall Logistics Queue Status */}
      <g transform="translate(1160, 220)">
        <rect width="280" height="280" rx="8" fill="#092113" stroke="#39ff14" strokeWidth="2" />
        <text x="20" y="30" fill="#39ff14" fontSize="12" fontFamily="Orbitron" fontWeight="bold">COLA DE MANTENIMIENTO FIFO</text>
        <line x1="20" y1="42" x2="260" y2="42" stroke="#39ff14" strokeWidth="1" strokeOpacity="0.4" />
        <text x="20" y="75" fill="#ffffff" fontSize="11" fontFamily="Share Tech Mono">01. {state.droneState.dronesSorted ? 'DESPACHO_OXIGENO_SEC4 [PRIORITARIO]' : 'LIMPIEZA_PANELES [ESTÉTICO]'}</text>
        <text x="20" y="105" fill="#ffffff" fontSize="11" fontFamily="Share Tech Mono">02. {state.droneState.dronesSorted ? 'SELLADO_VALVULAS [URGENTE]' : 'RECARGA_LUBRICANTE'}</text>
        <text x="20" y="145" fill={state.droneState.oxygenPumpsRouted ? '#39ff14' : '#ff3b3b'} fontSize="12" fontFamily="Share Tech Mono">
          ESTADO: {state.droneState.oxygenPumpsRouted ? 'VÁLVULAS SELLADAS ✓' : 'FUGA ACTIVA EN DUCTO 4 ✗'}
        </text>
      </g>
    </svg>
  );
};
