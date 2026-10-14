import { soundFx } from '../audio/synth';

export const TUTORIAL_STORAGE_KEY = 'versalles_tutorial_completed_v2';

export interface TutorialStepDefinition {
  id: string;
  phase: 1 | 2 | 3 | 4;
  phaseTitle: { es: string; fr: string };
  speaker: 'pina' | 'ortega' | 'ramirez';
  callsign: string;
  title: { es: string; fr: string };
  dialogue: { es: string; fr: string };
  actionPrompt: { es: string; fr: string };
  codeHint?: string;
  targetSelector?: string;
  isReactive: boolean;
  dockPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
}

export const IMMERSIVE_TUTORIAL_STEPS: TutorialStepDefinition[] = [
  {
    id: 'step-1-welcome',
    phase: 1,
    phaseTitle: {
      es: 'FASE 1 // NEXO Y HUD',
      fr: 'PHASE 1 // HUB & HUD',
    },
    speaker: 'pina',
    callsign: 'COMMAND-01',
    title: {
      es: '1. ESTADO DE LA ESTACIÓN',
      fr: '1. ÉTAT DE LA STATION',
    },
    dialogue: {
      es: 'Bienvenido a bordo, Cadete. Soy el Capitán Juan Piña. La estación sufre una caída de energía crítica. He pausado el temporizador para guiarte en tu primera intervención.',
      fr: 'Bienvenue à bord, Cadet. Je suis le Capitaine Juan Piña. La station subit une chute d\'énergie critique. J\'ai mis en pause le minuteur pour vous guider.',
    },
    actionPrompt: {
      es: 'Aquí arriba ves tu rango y el nivel de amenaza. Pulsa "Siguiente →".',
      fr: 'Ici s\'affichent votre rang et le niveau de menace. Cliquez sur "Suivant →".',
    },
    targetSelector: '#hud-identity',
    isReactive: false,
    dockPosition: 'bottom-right',
  },
  {
    id: 'step-2-hud-nav',
    phase: 1,
    phaseTitle: {
      es: 'FASE 1 // NEXO Y HUD',
      fr: 'PHASE 1 // HUB & HUD',
    },
    speaker: 'ramirez',
    callsign: 'NAV-CYBER',
    title: {
      es: '2. NAVEGACIÓN Y MANUALES',
      fr: '2. NAVIGATION ET MANUELS',
    },
    dialogue: {
      es: 'En la barra superior tienes el Plano Interior, el Sistema Solar (para viajar a otros destinos), el Manual de Código (con ejemplos listos para usar) y el Archivo Multimedia.',
      fr: 'Dans la barre supérieure se trouvent le Plan Intérieur, le Système Solaire, le Manuel de Code et les Archives Multimédias.',
    },
    actionPrompt: {
      es: 'Revisa los accesos superiores y pulsa "Siguiente →".',
      fr: 'Examinez les accès supérieurs et cliquez sur "Suivant →".',
    },
    targetSelector: '#hud-nav',
    isReactive: false,
    dockPosition: 'bottom-right',
  },
  {
    id: 'step-3-vitals',
    phase: 1,
    phaseTitle: {
      es: 'FASE 1 // NEXO Y HUD',
      fr: 'PHASE 1 // HUB & HUD',
    },
    speaker: 'ortega',
    callsign: 'ING-CORE',
    title: {
      es: '3. TELEMETRÍA EN TIEMPO REAL',
      fr: '3. TÉLÉMÉTRIE EN TEMPS RÉEL',
    },
    dialogue: {
      es: 'Soy Orlando Ortega, Ingeniero Jefe. En la barra inferior monitoreas la Energía (24%), Temperatura del Núcleo, Escudos y Oxígeno. Al resolver misiones, estos valores se recuperan.',
      fr: 'Je suis Orlando Ortega, Ingénieur en Chef. En bas, vous surveillez l\'Énergie (24%), la Température du Noyau, les Boucliers et l\'Oxygène.',
    },
    actionPrompt: {
      es: 'Pulsa "Siguiente →" para ir al Reactor.',
      fr: 'Cliquez sur "Suivant →" pour aller au Réacteur.',
    },
    targetSelector: '#hub-vitals-strip',
    isReactive: false,
    dockPosition: 'top-right',
  },
  {
    id: 'step-4-enter-reactor',
    phase: 2,
    phaseTitle: {
      es: 'FASE 2 // SECTOR Y MISIÓN 00',
      fr: 'PHASE 2 // SECTEUR & MISSION 00',
    },
    speaker: 'pina',
    callsign: 'COMMAND-01',
    title: {
      es: '4. ENTRAR AL NÚCLEO DEL REACTOR',
      fr: '4. ENTRER DANS LE NOYAU DU RÉACTEUR',
    },
    dialogue: {
      es: 'Cada tarjeta del Nexo corresponde a un sector de la nave. Tienes asignada la "Misión 00: Enlace Auxiliar" en el Núcleo del Reactor.',
      fr: 'Chaque carte du Hub correspond à un secteur du vaisseau. Vous avez la "Mission 00 : Relais Auxiliaire" dans le Noyau du Réacteur.',
    },
    actionPrompt: {
      es: 'Haz clic en la tarjeta "Núcleo del Reactor y Energía" para entrar al sector.',
      fr: 'Cliquez sur la carte "Noyau du Réacteur & Énergie" pour entrer dans le secteur.',
    },
    targetSelector: '#hub-sector-card-reactor',
    isReactive: true,
    dockPosition: 'bottom-right',
  },
  {
    id: 'step-5-open-mission',
    phase: 2,
    phaseTitle: {
      es: 'FASE 2 // SECTOR Y MISIÓN 00',
      fr: 'PHASE 2 // SECTEUR & MISSION 00',
    },
    speaker: 'ortega',
    callsign: 'ING-CORE',
    title: {
      es: '5. ABRIR INFORME DE MISIÓN',
      fr: '5. OUVRIR LE BRIEFING DE MISSION',
    },
    dialogue: {
      es: 'Dentro de cada sector puedes inspeccionar los nodos sobre los equipos o abrir la misión activa desde la barra inferior.',
      fr: 'Dans chaque secteur, vous pouvez inspecter les nœuds ou ouvrir la mission active depuis la barre inférieure.',
    },
    actionPrompt: {
      es: 'Haz clic en el botón amarillo "RESOLVER MISIÓN" (abajo a la derecha) o en la Consola Central.',
      fr: 'Cliquez sur le bouton jaune "RÉSOUDRE MISSION" (en bas à droite) ou sur la Console Centrale.',
    },
    targetSelector: '#sector-mission-btn',
    isReactive: true,
    dockPosition: 'top-right',
  },
  {
    id: 'step-6-mission-briefing',
    phase: 2,
    phaseTitle: {
      es: 'FASE 2 // SECTOR Y MISIÓN 00',
      fr: 'PHASE 2 // SECTEUR & MISSION 00',
    },
    speaker: 'pina',
    callsign: 'COMMAND-01',
    title: {
      es: '6. OBJETIVOS Y TERMINAL',
      fr: '6. OBJECTIFS ET TERMINAL',
    },
    dialogue: {
      es: 'Aquí ves el problema técnico, la pista y los Objetivos Operacionales, que se marcan en verde cuando tu código los cumple.',
      fr: 'Ici s\'affichent le problème technique, l\'indice et les Objectifs Opérationnels.',
    },
    actionPrompt: {
      es: 'Pulsa el botón "ABRIR TERMINAL Y PROGRAMAR" abajo a la derecha.',
      fr: 'Cliquez sur le bouton "OUVRIR TERMINAL ET PROGRAMMER" en bas à droite.',
    },
    targetSelector: '#mission-open-terminal-btn',
    isReactive: true,
    dockPosition: 'bottom-left',
  },
  {
    id: 'step-7-cli-cat',
    phase: 3,
    phaseTitle: {
      es: 'FASE 3 // TERMINAL Y CÓDIGO',
      fr: 'PHASE 3 // TERMINAL & CODE',
    },
    speaker: 'ortega',
    callsign: 'ING-CORE',
    title: {
      es: '7. DIAGNÓSTICO CON COMANDOS UNIX',
      fr: '7. DIAGNOSTIC AVEC COMMANDES UNIX',
    },
    dialogue: {
      es: 'Toda misión empieza revisando los registros (logs) con el comando UNIX "cat". Veamos qué código pide el archivo "boot_check.log".',
      fr: 'Chaque mission commence par la lecture des journaux avec la commande UNIX "cat". Voyons quel code demande "boot_check.log".',
    },
    actionPrompt: {
      es: 'Haz clic en el acceso rápido "cat boot_check.log" o escríbelo en la consola y presiona Enter.',
      fr: 'Cliquez sur l\'accès rapide "cat boot_check.log" ou tapez-le dans la console et appuyez sur Entrée.',
    },
    codeHint: 'cat boot_check.log',
    targetSelector: '#terminal-quick-chips',
    isReactive: true,
    dockPosition: 'top-right',
  },
  {
    id: 'step-8-switch-script',
    phase: 3,
    phaseTitle: {
      es: 'FASE 3 // TERMINAL Y CÓDIGO',
      fr: 'PHASE 3 // TERMINAL & CODE',
    },
    speaker: 'ortega',
    callsign: 'ING-CORE',
    title: {
      es: '8. EDITOR DE SCRIPT',
      fr: '8. ÉDITEUR DE SCRIPT',
    },
    dialogue: {
      es: 'El archivo indicó que el CÓDIGO DE ENLACE AUXILIAR es 7740 y ya cumpliste el primer objetivo. Ahora abramos el editor para ejecutar el script.',
      fr: 'Le journal a indiqué que le CODE DE LIAISON AUXILIAIRE est 7740. Ouvrons maintenant l\'éditeur pour exécuter le script.',
    },
    actionPrompt: {
      es: 'Haz clic en la pestaña "EDITOR SCRIPT" arriba en la terminal (o en "BLOQUES VISUALES").',
      fr: 'Cliquez sur l\'onglet "ÉDITEUR SCRIPT" en haut du terminal (ou sur "BLOCS VISUELS").',
    },
    targetSelector: '#terminal-tab-script',
    isReactive: true,
    dockPosition: 'top-right',
  },
  {
    id: 'step-9-run-script',
    phase: 3,
    phaseTitle: {
      es: 'FASE 3 // TERMINAL Y CÓDIGO',
      fr: 'PHASE 3 // TERMINAL & CODE',
    },
    speaker: 'ortega',
    callsign: 'ING-CORE',
    title: {
      es: '9. EJECUTAR EL SCRIPT',
      fr: '9. EXÉCUTER LE SCRIPT',
    },
    dialogue: {
      es: 'Tienes cargado "boot_sequence.py" con CODIGO_ENLACE = 7740 llamando a iniciar_enlace_auxiliar(CODIGO_ENLACE). Puedes programar en Python, Java o JS.',
      fr: 'Le fichier "boot_sequence.py" est prêt avec CODIGO_ENLACE = 7740 et iniciar_enlace_auxiliar(CODIGO_ENLACE).',
    },
    actionPrompt: {
      es: 'Pulsa el botón verde "EJECUTAR PYTHON" arriba a la derecha para completar la Misión 00.',
      fr: 'Cliquez sur le bouton vert "EXÉCUTER PYTHON" en haut à droite pour terminer la Mission 00.',
    },
    codeHint: 'CODIGO_ENLACE = 7740\niniciar_enlace_auxiliar(CODIGO_ENLACE)',
    targetSelector: '#terminal-run-script-btn',
    isReactive: true,
    dockPosition: 'bottom-left',
  },
  {
    id: 'step-10-hardware-diagnostic',
    phase: 4,
    phaseTitle: {
      es: 'FASE 4 // CONSOLA FÍSICA',
      fr: 'PHASE 4 // CONSOLE PHYSIQUE',
    },
    speaker: 'ramirez',
    callsign: 'NAV-CYBER',
    title: {
      es: '10. CONSOLA DE DIAGNÓSTICO',
      fr: '10. CONSOLE DE DIAGNOSTIC',
    },
    dialogue: {
      es: '¡Misión 00 completada (+100 XP)! Arriba a la derecha de cada sector también tienes la "CONSOLA DE DIAGNÓSTICO" con minijuegos de calibración física (bobinas, compuertas lógicas, propulsores RCS).',
      fr: 'Mission 00 terminée (+100 XP) ! En haut à droite de chaque secteur se trouve aussi la "CONSOLE DE DIAGNOSTIC" avec des mini-jeux matériels.',
    },
    actionPrompt: {
      es: 'Puedes probar la Consola de Diagnóstico o pulsar "Siguiente →".',
      fr: 'Vous pouvez tester la Console de Diagnostic ou cliquer sur "Suivant →".',
    },
    targetSelector: '#sector-diagnostic-btn',
    isReactive: false,
    dockPosition: 'bottom-right',
  },
  {
    id: 'step-11-graduation',
    phase: 4,
    phaseTitle: {
      es: 'FASE 4 // LISTO PARA OPERAR',
      fr: 'PHASE 4 // PRÊT À OPÉRER',
    },
    speaker: 'pina',
    callsign: 'COMMAND-01',
    title: {
      es: '¡SISTEMAS LISTOS, OPERADOR!',
      fr: 'SYSTÈMES PRÊTS, OPÉRATEUR !',
    },
    dialogue: {
      es: 'Ya conoces todo el flujo: entrar a los sectores, abrir las misiones, revisar logs con "cat" en la Terminal y ejecutar tus scripts. Tu primera misión principal ("Crisis de Colectores Solares Exteriores") está activa.',
      fr: 'Vous connaissez tout le flux : explorer les secteurs, lire les missions, vérifier les logs avec "cat" et exécuter vos scripts. Votre première mission principale est active.',
    },
    actionPrompt: {
      es: 'Pulsa "COMENZAR" para continuar.',
      fr: 'Cliquez sur "COMMENCER" pour continuer.',
    },
    isReactive: false,
    dockPosition: 'center',
  },
];

export function playTutorialAdvanceSound() {
  soundFx.playBeep(880, 0.07);
}
