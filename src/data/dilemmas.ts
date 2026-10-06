export interface DilemmaChoice {
  text: string;
  description: string;
  consequences: {
    energyDelta?: number;
    shieldsDelta?: number;
    oxygenDelta?: number;
    hullDelta?: number;
    xpDelta?: number;
    threatDelta?: 'NOMINAL' | 'PRECAUCIÓN' | 'CRÍTICO';
    radioResponse: {
      sender: string;
      text: string;
      callsign: string;
    };
  };
}

export interface RadioDilemma {
  id: string;
  title: string;
  sender: string;
  callsign: string;
  urgency: 'ALTA' | 'CRÍTICA' | 'EXTREMA';
  situation: string;
  choices: [DilemmaChoice, DilemmaChoice];
}

export const STATION_DILEMMAS: RadioDilemma[] = [
  {
    id: 'dilemma-energy-divert',
    title: 'COLAPSO DE SUMINISTRO EN BOBINAS',
    sender: 'Orlando Ortega',
    callsign: 'ING-CORE',
    urgency: 'CRÍTICA',
    situation:
      '¡Operador! El confinamiento magnético del reactor está sufriendo una sobretensión masiva. Si no inyectamos energía de inmediato, el plasma fundirá el núcleo. Podemos desviar el 30% del sistema de soporte vital de los módulos deshabitados o desviar energía de la matriz de escudos.',
    choices: [
      {
        text: 'Desviar energía de Soporte Vital',
        description: 'Mantiene los escudos intactos, pero reduce temporalmente los niveles de oxígeno de la estación.',
        consequences: {
          oxygenDelta: -18,
          energyDelta: +15,
          xpDelta: 40,
          radioResponse: {
            sender: 'Orlando Ortega',
            text: 'Confinamiento estabilizado. El oxígeno en las cubiertas B y C ha bajado, pero el reactor sigue en una sola pieza.',
            callsign: 'ING-CORE',
          },
        },
      },
      {
        text: 'Desviar energía de los Escudos',
        description: 'Mantiene el aire respirable al 100%, pero debilita la barrera deflectora contra la radiación exterior.',
        consequences: {
          shieldsDelta: -22,
          energyDelta: +15,
          xpDelta: 40,
          radioResponse: {
            sender: 'Andrus Ramírez',
            text: 'Escudos bajando al 40% para alimentar el reactor. Espero que no nos crucemos con ningún micrometeorito ahora...',
            callsign: 'CYBER-OPS',
          },
        },
      },
    ],
  },
  {
    id: 'dilemma-alien-signal',
    title: 'PAQUETE DE TELEMETRÍA DESCONOCIDO',
    sender: 'Andrus Ramírez',
    callsign: 'CYBER-OPS',
    urgency: 'ALTA',
    situation:
      'La antena del sector de datos acaba de captar un paquete binario encriptado de alta densidad proveniente de un satélite a la deriva. Podría contener algoritmos de optimización cuántica o una rutina de malware espía. ¿Qué hacemos?',
    choices: [
      {
        text: 'Decodificar y Asimilar Datos',
        description: 'Arriesga la seguridad de los cortafuegos pero podría otorgar valiosos puntos de experiencia tecnológica.',
        consequences: {
          xpDelta: 95,
          shieldsDelta: -15,
          radioResponse: {
            sender: 'Andrus Ramírez',
            text: '¡Increíble! Era una matriz matemática de navegación hiperbólica. +95 XP obtenidos, aunque tuvimos que aislar dos puertos infectados.',
            callsign: 'CYBER-OPS',
          },
        },
      },
      {
        text: 'Purgar y Aislar Frecuencia',
        description: 'Prioridad de seguridad absoluta. Destruye el paquete para blindar la estación contra cualquier brecha.',
        consequences: {
          shieldsDelta: +10,
          xpDelta: 25,
          radioResponse: {
            sender: 'Cap. Juan Piña',
            text: 'Buena prudencia, operador. La seguridad de la tripulación de la Versalles es la primera directiva.',
            callsign: 'COMMAND-01',
          },
        },
      },
    ],
  },
  {
    id: 'dilemma-debris-field',
    title: 'CAMPO DE ESCOMBROS EN CURSO DE COLISIÓN',
    sender: 'Cap. Juan Piña',
    callsign: 'COMMAND-01',
    urgency: 'EXTREMA',
    situation:
      '¡Atención puente! Los sensores de largo alcance detectan restos de un viejo carguero a 400 km. Pasarán a través de nuestra órbita en 4 minutos. ¿Quemamos combustible para una maniobra evasiva o reforzamos el escudo frontal al 100% y aguantamos el impacto?',
    choices: [
      {
        text: 'Encendido de Propulsores RCS (Evasión)',
        description: 'Consume 20% de reserva energética para alterar la trayectoria y evitar el impacto directo.',
        consequences: {
          energyDelta: -20,
          hullDelta: 0,
          xpDelta: 50,
          radioResponse: {
            sender: 'Cap. Juan Piña',
            text: '¡Viraje completado con éxito! Los escombros nos pasaron rozando a 80 metros. Estación intacta.',
            callsign: 'COMMAND-01',
          },
        },
      },
      {
        text: 'Sobrecargar Escudo Frontal',
        description: 'Ahorra energía del motor pero algunos fragmentos menores perforarán la armadura del casco.',
        consequences: {
          hullDelta: -15,
          shieldsDelta: -12,
          xpDelta: 35,
          radioResponse: {
            sender: 'Orlando Ortega',
            text: '¡Impacto absorbido! La barrera resistió casi todo, aunque tenemos microfisuras en el blindaje exterior.',
            callsign: 'ING-CORE',
          },
        },
      },
    ],
  },
];
