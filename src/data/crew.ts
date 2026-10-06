import { CrewMember } from '../types/game';

export const CREW_MEMBERS: Record<string, CrewMember> = {
  pina: {
    name: 'Juan Piña',
    rank: 'CAPITÁN',
    role: 'Comandante en Jefe de la Estación Versalles',
    avatarColor: '#ffd700',
    bio: 'Veterano de la Flota Orbital. Supervisa la integridad estructural, misiones prioritarias y autorizaciones de nivel Omega.',
  },
  ortega: {
    name: 'Orlando Ortega',
    rank: 'INGENIERO JEFE',
    role: 'Especialista en Núcleos y Redes Cuánticas',
    avatarColor: '#00f5ff',
    bio: 'Diseñador de las bobinas de confinamiento de plasma. Capaz de reprogramar subredes en milisegundos con los ojos cerrados.',
  },
  ramirez: {
    name: 'Andrus Ramírez',
    rank: 'PILOTO & CIBER-OPS',
    role: 'Navegación Vectorial y Guerra Electrónica',
    avatarColor: '#a855f7',
    bio: 'Experto en maniobras balísticas bajo gravedad cero y mitigación de intrusiones hostiles en la matriz defensiva.',
  },
};
