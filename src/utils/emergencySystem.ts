import { SectorId, StationVitals } from '../types/game';

export interface StationEmergency {
  id: string;
  sectorId: SectorId;
  title: string;
  description: string;
  severity: 'CRÍTICA' | 'EXTREMA';
  timeLimitSeconds: number;
  effect: (vitals: StationVitals) => StationVitals;
}

export const STATION_EMERGENCIES: StationEmergency[] = [
  {
    id: 'emg-reactor-temp',
    sectorId: 'reactor',
    title: '¡FUGA TÉRMICA EN TOKAMAK!',
    description: 'La temperatura del núcleo supera los 15,600°C. Estabiliza el campo magnético o habrá colapso.',
    severity: 'CRÍTICA',
    timeLimitSeconds: 60,
    effect: (vitals) => ({
      ...vitals,
      coreTemp: 16200,
      magneticField: 68,
      activeThreatLevel: 'CRÍTICO',
    }),
  },
  {
    id: 'emg-shields-storm',
    sectorId: 'shields',
    title: '¡TORMENTA ELECTROMAGNÉTICA!',
    description: 'Ráfaga solar colapsando la frecuencia de modulación de los escudos a menos del 35%.',
    severity: 'CRÍTICA',
    timeLimitSeconds: 55,
    effect: (vitals) => ({
      ...vitals,
      shields: 32,
      activeThreatLevel: 'CRÍTICO',
    }),
  },
  {
    id: 'emg-bridge-drift',
    sectorId: 'bridge',
    title: '¡DECAIMIENTO ORBITAL INMINENTE!',
    description: 'Los propulsores de actitud RCS han perdido sincronización. Riesgo de reentrada descontrolada.',
    severity: 'EXTREMA',
    timeLimitSeconds: 50,
    effect: (vitals) => ({
      ...vitals,
      hullIntegrity: Math.max(30, vitals.hullIntegrity - 15),
      activeThreatLevel: 'BRECHA_INMINENTE',
    }),
  },
  {
    id: 'emg-lab-malware',
    sectorId: 'lab',
    title: '¡INTRUSIÓN EN BUFFER LÓGICO!',
    description: 'Inyección de paquetes maliciosos saturando el procesador central al 96% de carga.',
    severity: 'CRÍTICA',
    timeLimitSeconds: 65,
    effect: (vitals) => ({
      ...vitals,
      cpuLoad: 96,
      energy: Math.max(20, vitals.energy - 15),
      activeThreatLevel: 'CRÍTICO',
    }),
  },
  {
    id: 'emg-drone-vent',
    sectorId: 'drones',
    title: '¡ROTURA EN CONDUCTO DE SOPORTE VITAL!',
    description: 'El circuito principal de oxígeno se despresuriza en la cubierta de mantenimiento.',
    severity: 'EXTREMA',
    timeLimitSeconds: 45,
    effect: (vitals) => ({
      ...vitals,
      oxygen: Math.max(25, vitals.oxygen - 20),
      activeThreatLevel: 'CRÍTICO',
    }),
  },
];
