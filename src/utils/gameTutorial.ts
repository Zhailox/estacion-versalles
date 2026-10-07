import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { soundFx } from '../audio/synth';

export function startStationTutorial(
  language: 'es' | 'fr' = 'es',
  onNavigate?: (screen: 'hub' | 'sector') => void
) {
  soundFx.playBeep(880, 0.08);

  const isFr = language === 'fr';

  const steps: DriveStep[] = [
    {
      element: '#hud-identity',
      popover: {
        title: isFr ? '1. ÉTAT DE LA STATION & IDENTITÉ' : '1. IDENTIDAD Y ESTADO DE LA ESTACIÓN',
        description: isFr
          ? 'Bienvenue à bord ! Ici sont affichés votre rang de cadet, la destination courante (ex: Station Versailles) et le niveau d\'alerte global des systèmes.'
          : '¡Bienvenido a bordo! Aquí monitoreas tu rango de operador, la instalación actual (ej. Estación Versalles) y el nivel de amenaza activo de la nave.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#hud-nav',
      popover: {
        title: isFr ? '2. NAVIGATION PRINCIPALE & MODALITÉS' : '2. NAVEGACIÓN Y SISTEMAS DEL HUD',
        description: isFr
          ? 'Basculez entre le Hub et vos Secteurs. Vous pouvez également ouvrir à tout instant : la Carte Intérieure, la Carte du Système Solaire, le Manuel de Code, la Télémétrie vitale et les Archives multimédias.'
          : 'Alterna entre el Nexo y los Sectores. Puedes abrir en cualquier momento: el Plano Interior, la Navegación del Sistema Solar, el Manual de Código, los Signos Vitales y el Archivo Histórico.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#hud-utilities',
      popover: {
        title: isFr ? '3. UTILITAIRES & MODES DE CRISE' : '3. UTILIDADES, AUDIO Y MODO CRISIS',
        description: isFr
          ? 'Contrôlez la bande originale et le Jukebox, les effets sonores, l\'effet CRT rétro, la langue (ES / FR) et le Mode Survie avec pannes en temps réel.'
          : 'Controla la banda sonora synthwave y el Jukebox, el audio, el filtro retro CRT, el idioma (ES / FR) y el Modo Supervivencia con emergencias continuas.',
        side: 'bottom',
        align: 'end',
      },
    },
    {
      element: '#hub-sectors-grid',
      popover: {
        title: isFr ? '4. COMPARTIMENTS ET SECTEURS CRITIQUES' : '4. COMPARTIMENTOS Y SUBSISTEMAS',
        description: isFr
          ? 'Chaque secteur héberge un sous-système essentiel : Réacteur Tokamak (énergie), Laboratoire (logique quantique), Passerelle (propulsion RCS), Boucliers (cybersécurité) et Drones (support vital).'
          : 'Cada sector protege un subsistema vital: Reactor Tokamak (energía y plasma), Laboratorio (matrices lógicas), Puente (propulsión RCS), Escudos (ciberdefensa) y Drones (soporte de vida).',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#hub-mission-ledger',
      popover: {
        title: isFr ? '5. MISSIONS TACTIQUES ET OBJECTIFS' : '5. REGISTRO Y SELECCIÓN DE MISIONES',
        description: isFr
          ? 'Consultez ici les missions en attente. Cliquez sur une mission pour lire le briefing, analyser les conditions de réussite et lancer la programmation.'
          : 'Consulta las misiones asignadas. Al seleccionar una misión verás el informe técnico, los casos de prueba requeridos y la recompensa de experiencia (XP).',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '#hub-vitals-strip',
      popover: {
        title: isFr ? '6. BANDE DE TÉLÉMÉTRIE EN DIRECT' : '6. TELEMETRÍA CRÍTICA EN TIEMPO REAL',
        description: isFr
          ? 'Gardez un œil constant sur l\'énergie des réserves, la température du noyau fusion, l\'intégrité des boucliers déflecteurs et le niveau d\'oxygène respirable.'
          : 'Vigila constantemente las reservas de energía, la temperatura del núcleo de plasma, el porcentaje de escudos y el nivel de oxígeno de los habitáculos.',
        side: 'top',
        align: 'start',
      },
    },
    {
      popover: {
        title: isFr ? '7. CONSOLE CYBER-TERMINAL & SCRIPTS' : '7. CONSOLA TERMINAL Y PROGRAMACIÓN',
        description: isFr
          ? 'Dans chaque secteur, ouvrez le Terminal pour piloter la station. Vous pouvez saisir des commandes UNIX (ls, cat, cd), concevoir des scripts en Python, Java ou JavaScript, ou assembler des blocs visuels !'
          : 'En cada sector, pulsa "ABRIR TERMINAL" para operar los subsistemas. ¡Puedes ejecutar comandos UNIX (ls, cat, grep), programar scripts en Python 3.12, Java o JS, o conectar bloques lógicos de aviónica!',
      },
    },
    {
      popover: {
        title: isFr ? '8. DIAGNOSTIC MATÉRIEL PHYSIQUE' : '8. CONSOLAS DE DIAGNÓSTICO FÍSICO',
        description: isFr
          ? 'Besoin d\'une intervention rapide ? Utilisez la console de diagnostic matériel dans chaque secteur pour résoudre des mini-jeux (bobines magnétiques, portes logiques, tuyères RCS).'
          : '¿Necesitas actuar de inmediato? Usa la Consola de Diagnóstico de Hardware en cada sector para resolver minijuegos físicos interactivos (calibración magnética, compuertas AND/OR, empuje RCS balanceado).',
      },
    },
    {
      popover: {
        title: isFr ? '🚀 PRÊT À DÉCOLLER, OPÉRATEUR !' : '🚀 ¡SISTEMAS LISTOS, OPERADOR!',
        description: isFr
          ? 'Vous connaissez maintenant les bases. Explorez les secteurs et stabilisez la Station Versailles avant que le temps ne s\'écoule !'
          : 'Ya dominas las bases de operaciones. ¡Explora los sectores, estabiliza el reactor solar y lleva la Estación Versalles a salvo!',
      },
    },
  ];

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: 'rgba(2, 11, 24, 0.85)',
    nextBtnText: isFr ? 'Suivant →' : 'Siguiente →',
    prevBtnText: isFr ? '← Précédent' : '← Anterior',
    doneBtnText: isFr ? 'Compris !' : '¡Entendido!',
    progressText: isFr ? 'Étape {{current}} sur {{total}}' : 'Paso {{current}} de {{total}}',
    steps,
    onHighlightStarted: () => {
      soundFx.playBeep(650, 0.03);
    },
    onDestroyed: () => {
      soundFx.playSuccess();
    },
  });

  driverObj.drive();
}
