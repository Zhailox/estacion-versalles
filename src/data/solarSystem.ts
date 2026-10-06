import { SectorId } from '../types/game';

export type DestinationId = 'versalles' | 'hyperion' | 'titan' | 'helios';

export interface SolarDestination {
  id: DestinationId;
  name: string;
  type: 'ESTACIÓN ORBITAL' | 'NAVE ACORAZADA' | 'COMPLEJO MINERO' | 'OBSERVATORIO SOLAR';
  celestialParent: string;
  coordinates: { x: number; y: number }; // percentage on system map
  orbitRadius: number; // For orbital rendering
  threatLevel: 'NOMINAL' | 'PRECAUCIÓN' | 'CRÍTICO' | 'ZONA DE COMBATE';
  description: string;
  tacticalIntel: string;
  defaultSectorId: SectorId;
  availableSectors: SectorId[];
  distanceAU: number; // Astronomical Units from Earth
  travelEnergyCost: number;
}

export const SOLAR_DESTINATIONS: SolarDestination[] = [
  {
    id: 'versalles',
    name: 'Estación Versalles',
    type: 'ESTACIÓN ORBITAL',
    celestialParent: 'Tierra · Órbita L2',
    coordinates: { x: 38, y: 52 },
    orbitRadius: 180,
    threatLevel: 'CRÍTICO',
    description: 'Estación nodriza de investigación termonuclear y contención de plasma.',
    tacticalIntel: 'El reactor Tokamak y la matriz de ciber-defensa requieren estabilización continua del operador.',
    defaultSectorId: 'reactor',
    availableSectors: ['reactor', 'lab', 'bridge', 'shields', 'drones'],
    distanceAU: 0.0,
    travelEnergyCost: 0,
  },
  {
    id: 'hyperion',
    name: 'Acorazado Hyperion-9',
    type: 'NAVE ACORAZADA',
    celestialParent: 'Cinturón de Asteroides',
    coordinates: { x: 62, y: 35 },
    orbitRadius: 280,
    threatLevel: 'ZONA DE COMBATE',
    description: 'Fragata de patrulla pesada a la deriva tras una tormenta de micrometeoritos.',
    tacticalIntel: 'Los propulsores de maniobra y los cortafuegos militares están desbalanceados.',
    defaultSectorId: 'bridge',
    availableSectors: ['bridge', 'shields', 'drones'],
    distanceAU: 2.1,
    travelEnergyCost: 20,
  },
  {
    id: 'titan',
    name: 'Base Titán-IV',
    type: 'COMPLEJO MINERO',
    celestialParent: 'Saturno · Titán',
    coordinates: { x: 80, y: 68 },
    orbitRadius: 380,
    threatLevel: 'PRECAUCIÓN',
    description: 'Refinería criogénica de metano líquido y extracción subterránea.',
    tacticalIntel: 'Fuga en ductos criogénicos. Se requiere enrutamiento de válvulas de soporte vital.',
    defaultSectorId: 'drones',
    availableSectors: ['drones', 'reactor', 'lab'],
    distanceAU: 8.5,
    travelEnergyCost: 35,
  },
  {
    id: 'helios',
    name: 'Sonda Helios-Sol',
    type: 'OBSERVATORIO SOLAR',
    celestialParent: 'Corona Solar',
    coordinates: { x: 18, y: 48 },
    orbitRadius: 90,
    threatLevel: 'CRÍTICO',
    description: 'Estación de investigación cuántica operando bajo radiación extrema.',
    tacticalIntel: 'La matriz de escudos térmicos y compuertas lógicas operan al límite térmico.',
    defaultSectorId: 'shields',
    availableSectors: ['shields', 'lab', 'reactor'],
    distanceAU: 0.85,
    travelEnergyCost: 25,
  },
];
