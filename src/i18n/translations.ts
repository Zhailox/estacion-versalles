import { TranslationDictionary } from './types';

export const UI_TRANSLATIONS: Record<'es' | 'fr', TranslationDictionary> = {
  es: {
    common: {
      stationName: 'ESTACIÓN VERSALLES',
      stationSub: 'SISTEMA DE CONTROL DE AVIONICA & TELEMETRÍA',
      close: 'Cerrar',
      cancel: 'Cancelar',
      accept: 'Aceptar',
      confirm: 'Confirmar',
      save: 'Guardar',
      run: 'Ejecutar',
      clear: 'Limpiar',
      loading: 'Cargando...',
      nominal: 'NOMINAL',
      warning: 'ADVERTENCIA',
      critical: 'CRÍTICO',
      breachInminent: 'BRECHA INMINENTE',
      combatZone: 'ZONA DE COMBATE',
      status: 'ESTADO',
      operational: 'OPERACIONAL',
      crew: 'TRIPULACIÓN',
      missions: 'MISIONES',
      sector: 'SECTOR',
      hub: 'NEXO',
      map: 'MAPA',
      solarSystem: 'SISTEMA SOLAR',
      manual: 'MANUAL',
      telemetry: 'TELEMETRÍA',
      archive: 'ARCHIVO',
      crisis: 'CRISIS',
      emergency: 'EMERGENCIA',
      time: 'TIEMPO',
      xp: 'XP',
      rank: 'RANGO',
      openTerminal: 'ABRIR TERMINAL',
      interveneTerminal: 'INTERVENIR EN TERMINAL',
    },
    intro: {
      subtitle: 'SIMULADOR DE AVIONICA Y PROGRAMACIÓN ORBITAL',
      operationalStatus: 'OPERACIONAL',
      crewMembersCount: '3 MIEMBROS',
      activeMissionsCount: 'ACTIVAS',
      startMission: 'INICIAR MISIÓN',
      startHint: 'Presiona INICIAR MISIÓN para acceder a la estación...',
      activeCrew: 'TRIPULACIÓN ACTIVA',
      copyright: 'Estación Versalles © 2026',
      langSelectTitle: 'SELECCIONA EL IDIOMA // CHOIX DE LA LANGUE',
    },
    header: {
      hubTitle: 'NEXO',
      sectorTitle: 'SECTOR',
      mapTooltip: 'Plano de distribución interior',
      solarTooltip: 'Carta de navegación interplanetaria',
      handbookTooltip: 'Manual de sintaxis y comandos de programación',
      vitalsTooltip: 'Telemetría de signos vitales',
      archiveTooltip: 'Archivo multimedia: galería de arte y jukebox',
      soundTooltipOn: 'Silenciar efectos de sonido',
      soundTooltipOff: 'Activar efectos de sonido',
      crtTooltipOn: 'Desactivar efecto CRT',
      crtTooltipOff: 'Activar efecto CRT',
      musicTooltipPlay: 'Reproducir banda sonora',
      musicTooltipPause: 'Pausar banda sonora',
      jukeboxTooltip: 'Abrir Jukebox (seleccionar y cambiar pistas)',
      survivalTooltipOn: 'Desactivar modo crisis',
      survivalTooltipOff: 'Activar modo supervivencia (fallos en tiempo real)',
      survivalBadge: 'CRISIS',
      crisisCountdown: 'CRISIS',
      languageToggleTooltip: 'Cambiar idioma / Changer de langue (ES / FR)',
      tutorialBtn: 'TUTORIAL',
      tutorialTooltip: 'Iniciar protocolo de inducción interactivo paso a paso',
    },
    hub: {
      locationBadge: 'UBICACIÓN',
      travelBtn: 'VIAJAR ↗',
      archiveBtn: 'ARCHIVO & JUKEBOX',
      howToPlayBtn: 'CÓMO JUGAR // TUTORIAL',
      operationalSectors: 'COMPARTIMENTOS OPERACIONALES',
      activeMissionBadge: 'MISIÓN ASIGNADA',
      completedBadge: 'ESTABILIZADO',
      repairedBadge: 'REPARADO',
      enterSectorBtn: 'INGRESAR AL SECTOR',
      diagnosticBtn: 'DIAGNÓSTICO',
    },
    sector: {
      backToHub: '← VOLVER AL NEXO',
      activeMissionBanner: 'MISIÓN OPERACIONAL EN CURSO',
      stabilizeBtn: 'RESOLVER MISIÓN',
      completedStatus: 'SISTEMA NOMINAL Y OPERATIVO',
      pendingStatus: 'ANOMALÍA DETECTADA — REQUIERE INTERVENCIÓN',
      diagnosticConsole: 'CONSOLA DE DIAGNÓSTICO',
      terminalBtn: 'TERMINAL DE COMANDOS',
      interactivePrompt: 'Haz clic en los puntos interactivos para inspeccionar subsistemas',
    },
    terminal: {
      title: 'TERMINAL DE COMANDO & PROGRAMACIÓN',
      tabTerminal: 'TERMINAL UNIX',
      tabEditor: 'EDITOR SCRIPT',
      tabBlocks: 'BLOQUES VISUALES',
      runScript: 'EJECUTAR',
      saveScript: 'GUARDAR VFS',
      clearOutput: 'LIMPIAR',
      resetScript: 'REINICIAR',
      helpBtn: 'AYUDA',
      statusReady: 'LISTO',
      statusExecuting: 'EJECUTANDO...',
      statusSuccess: 'EXITOSO',
      statusError: 'ERROR',
      syntaxSuggestion: 'Sugerencia de depuración',
      inputPlaceholder: 'Escribe un comando UNIX (ls, cd, cat, python, AYUDA())...',
      quickCommands: 'ACCESOS RÁPIDOS',
      editorLangSelect: 'LENGUAJE:',
    },
    missionModal: {
      title: 'BRIEFING DE MISIÓN',
      sectorLabel: 'SECTOR',
      rewardLabel: 'RECOMPENSA',
      categoryLabel: 'CATEGORÍA',
      conceptTaught: 'CONCEPTO TÉCNICO',
      summary: 'RESUMEN EJECUTIVO',
      operationalObjectives: 'OBJETIVOS OPERACIONALES',
      instructions: 'PROTOCOLO Y TELEMETRÍA',
      countdownWarning: 'TIEMPO LÍMITE DE PRESIÓN CRÍTICA',
      recommendedCommands: 'COMANDOS SUGERIDOS',
      technicalHint: 'PISTA DE INGENIERÍA',
      openTerminalBtn: 'ABRIR TERMINAL Y PROGRAMAR',
      completedMessage: 'MISIÓN COMPLETADA CON ÉXITO',
    },
    diagnostic: {
      title: 'CONSOLA DE DIAGNÓSTICO FÍSICO',
      stabilizeSubsystem: 'ESTABILIZAR PARÁMETROS DE HARDWARE',
      instructions: 'Ajusta los moduladores para situar los valores en el rango nominal requerido.',
      verifyBtn: 'VERIFICAR Y APLICAR CALIBRACIÓN',
      calibratedMsg: 'Subsistema calibrado y estabilizado al 100%.',
      unbalancedMsg: 'Valores fuera de tolerancia. Revisa los parámetros indicados.',
      successReward: '¡Diagnóstico completado con éxito!',
    },
    handbook: {
      title: 'MANUAL DE AVIONICA & SINTAXIS',
      subtitle: 'Guía de referencia rápida de comandos UNIX, algoritmos y estructuras',
      copyCode: 'COPIAR SNIPPET',
      copied: '¡COPIADO!',
      insertTerminal: 'INSERTAR EN EDITOR',
    },
    vitals: {
      title: 'TELEMETRÍA EN TIEMPO REAL',
      energyNet: 'ENERGÍA RED',
      coreTemp: 'TEMPERATURA NÚCLEO',
      magneticField: 'CAMPO MAGNÉTICO',
      deflectorShields: 'ESCUDOS DEFLECTORES',
      oxygenCabins: 'OXÍGENO HABITÁCULOS',
      commsBand: 'COMUNICACIONES',
      hullIntegrity: 'INTEGRIDAD DEL CASCO',
      cpuLoad: 'CARGA DEL PROCESADOR',
      nominalState: 'PARÁMETROS NOMINALES',
      warningState: 'ADVERTENCIA EN SUBSISTEMA',
      criticalState: 'ALARMA CRÍTICA',
    },
    solar: {
      title: 'CARTA DE NAVEGACIÓN INTERPLANETARIA',
      warpBtn: 'INICIAR SALTO VECTORIAL',
      currentLocation: 'UBICACIÓN ACTUAL',
      notEnoughEnergy: 'ENERGÍA INSUFICIENTE PARA EL SALTO',
      energyCost: 'CONSUMO DE ENERGÍA',
      distance: 'DISTANCIA',
      threat: 'NIVEL DE AMENAZA',
      tacticalReport: 'REPORTE TÁCTICO & SITUACIONAL',
      availableSectors: 'SECTORES ACCESIBLES',
      traveling: 'SALTANDO A HIPERESPACIO...',
    },
    dilemma: {
      banner: '[TRANSMISIÓN DE CRISIS CRÍTICA]',
      urgencyLabel: 'URGENCIA',
      officerLabel: 'OFICIAL EMISOR',
      channelLabel: 'CANAL DE RADIO',
      instructionPrompt: 'SELECCIONA LA DIRECTIVA DE ACTUACIÓN:',
    },
    archive: {
      title: 'ARCHIVO HISTÓRICO & MULTIMEDIA',
      galleryTab: 'GALERÍA DE ARTE',
      jukeboxTab: 'JUKEBOX OFICIAL',
      nowPlaying: 'EN REPRODUCCIÓN',
      trackList: 'LISTA DE PISTAS',
      playTrack: 'REPRODUCIR',
      pauseTrack: 'PAUSAR',
      viewHighRes: 'VER EN ALTA RESOLUCIÓN',
      specs: 'ESPECIFICACIONES TÉCNICAS',
      allFilter: 'TODOS',
    },
  },
  fr: {
    common: {
      stationName: 'STATION VERSAILLES',
      stationSub: 'SYSTÈME DE CONTRÔLE AVIONIQUE & TÉLÉMÉTRIE',
      close: 'Fermer',
      cancel: 'Annuler',
      accept: 'Accepter',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      run: 'Exécuter',
      clear: 'Effacer',
      loading: 'Chargement...',
      nominal: 'NOMINAL',
      warning: 'AVERTISSEMENT',
      critical: 'CRITIQUE',
      breachInminent: 'BRÈCHE IMMINENTE',
      combatZone: 'ZONE DE COMBAT',
      status: 'ÉTAT',
      operational: 'OPÉRATIONNEL',
      crew: 'ÉQUIPAGE',
      missions: 'MISSIONS',
      sector: 'SECTEUR',
      hub: 'HUB',
      map: 'CARTE',
      solarSystem: 'SYSTÈME SOLAIRE',
      manual: 'MANUEL',
      telemetry: 'TÉLÉMÉTRIE',
      archive: 'ARCHIVES',
      crisis: 'CRISE',
      emergency: 'URGENCE',
      time: 'TEMPS',
      xp: 'XP',
      rank: 'RANG',
      openTerminal: 'OUVRIR TERMINAL',
      interveneTerminal: 'INTERVENIR AU TERMINAL',
    },
    intro: {
      subtitle: 'SIMULATEUR AVIONIQUE & PROGRAMMATION ORBITALE',
      operationalStatus: 'OPÉRATIONNEL',
      crewMembersCount: '3 MEMBRES',
      activeMissionsCount: 'ACTIVES',
      startMission: 'DÉMARRER LA MISSION',
      startHint: 'Appuyez sur DÉMARRER LA MISSION pour accéder à la station...',
      activeCrew: 'ÉQUIPAGE ACTIF',
      copyright: 'Station Versailles © 2026',
      langSelectTitle: 'CHOIX DE LA LANGUE // SELECCIONA EL IDIOMA',
    },
    header: {
      hubTitle: 'HUB',
      sectorTitle: 'SECTEUR',
      mapTooltip: 'Plan de distribution intérieure',
      solarTooltip: 'Carte de navigation interplanétaire',
      handbookTooltip: 'Manuel de syntaxe et commandes de programmation',
      vitalsTooltip: 'Télémétrie des constantes vitales',
      archiveTooltip: 'Archives multimédias : galerie d\'art et jukebox',
      soundTooltipOn: 'Couper les effets sonores',
      soundTooltipOff: 'Activer les effets sonores',
      crtTooltipOn: 'Désactiver l\'effet cathodique CRT',
      crtTooltipOff: 'Activer l\'effet cathodique CRT',
      musicTooltipPlay: 'Lancer la bande originale',
      musicTooltipPause: 'Mettre la bande originale en pause',
      jukeboxTooltip: 'Ouvrir le Jukebox (sélectionner les pistes audio)',
      survivalTooltipOn: 'Désactiver le mode crise',
      survivalTooltipOff: 'Activer le mode survie (pannes en temps réel)',
      survivalBadge: 'CRISE',
      crisisCountdown: 'CRISE',
      languageToggleTooltip: 'Changer de langue / Cambiar idioma (FR / ES)',
      tutorialBtn: 'GUIDE',
      tutorialTooltip: 'Lancer le tutoriel interactif pas à pas',
    },
    hub: {
      locationBadge: 'LOCALISATION',
      travelBtn: 'VOYAGER ↗',
      archiveBtn: 'ARCHIVES & JUKEBOX',
      howToPlayBtn: 'COMMENT JOUER // GUIDE',
      operationalSectors: 'SECTEURS OPÉRATIONNELS',
      activeMissionBadge: 'MISSION ASSIGNÉE',
      completedBadge: 'STABILISÉ',
      repairedBadge: 'RÉPARÉ',
      enterSectorBtn: 'ENTRER DANS LE SECTEUR',
      diagnosticBtn: 'DIAGNOSTIC',
    },
    sector: {
      backToHub: '← RETOUR AU HUB',
      activeMissionBanner: 'MISSION OPÉRATIONNELLE EN COURS',
      stabilizeBtn: 'RÉSOUDRE LA MISSION',
      completedStatus: 'SYSTÈME NOMINAL ET OPÉRATIONNEL',
      pendingStatus: 'ANOMALIE DÉTECTÉE — INTERVENTION REQUISE',
      diagnosticConsole: 'CONSOLE DE DIAGNOSTIC',
      terminalBtn: 'TERMINAL DE COMMANDES',
      interactivePrompt: 'Cliquez sur les points interactifs pour inspecter les sous-systèmes',
    },
    terminal: {
      title: 'TERMINAL DE COMMANDE & PROGRAMMATION',
      tabTerminal: 'TERMINAL UNIX',
      tabEditor: 'ÉDITEUR DE SCRIPT',
      tabBlocks: 'BLOCS VISUELS',
      runScript: 'EXÉCUTER',
      saveScript: 'SAUVER VFS',
      clearOutput: 'EFFACER',
      resetScript: 'RÉINITIALISER',
      helpBtn: 'AIDE',
      statusReady: 'PRÊT',
      statusExecuting: 'EXÉCUTION...',
      statusSuccess: 'SUCCÈS',
      statusError: 'ERREUR',
      syntaxSuggestion: 'Indice de débogage',
      inputPlaceholder: 'Entrez une commande UNIX (ls, cd, cat, python, AIDE())...',
      quickCommands: 'RACCOURCIS RAPIDES',
      editorLangSelect: 'LANGAGE :',
    },
    missionModal: {
      title: 'BRIEFING DE MISSION',
      sectorLabel: 'SECTEUR',
      rewardLabel: 'RÉCOMPENSE',
      categoryLabel: 'CATÉGORIE',
      conceptTaught: 'CONCEPT TECHNIQUE',
      summary: 'RÉSUMÉ EXÉCUTIF',
      operationalObjectives: 'OBJECTIFS OPÉRATIONNELS',
      instructions: 'PROTOCOLE ET TÉLÉMÉTRIE',
      countdownWarning: 'COMPTE À REBOURS DE PRESSION CRITIQUE',
      recommendedCommands: 'COMMANDES RECOMMANDÉES',
      technicalHint: 'INDICE D\'INGÉNIERIE',
      openTerminalBtn: 'OUVRIR LE TERMINAL ET CODER',
      completedMessage: 'MISSION ACCOMPLIE AVEC SUCCÈS',
    },
    diagnostic: {
      title: 'CONSOLE DE DIAGNOSTIC PHYSIQUE',
      stabilizeSubsystem: 'STABILISER LES PARAMÈTRES MATÉRIELS',
      instructions: 'Ajustez les modulateurs pour aligner les valeurs sur la plage nominale requise.',
      verifyBtn: 'VÉRIFIER ET APPLIQUER LE CALIBRAGE',
      calibratedMsg: 'Sous-système calibré et stabilisé à 100%.',
      unbalancedMsg: 'Valeurs hors tolérance. Vérifiez les paramètres indiqués.',
      successReward: 'Diagnostic validé avec succès !',
    },
    handbook: {
      title: 'MANUEL AVIONIQUE & SYNTAXE',
      subtitle: 'Guide de référence rapide pour les commandes UNIX, algorithmes et structures',
      copyCode: 'COPIER LE CODE',
      copied: 'COPIÉ !',
      insertTerminal: 'INSÉRER DANS L\'ÉDITEUR',
    },
    vitals: {
      title: 'TÉLÉMÉTRIE EN TEMPS RÉEL',
      energyNet: 'ÉNERGIE RÉSEAU',
      coreTemp: 'TEMPÉRATURE COEUR',
      magneticField: 'CHAMP MAGNÉTIQUE',
      deflectorShields: 'BOUCLIERS DÉFLECTEURS',
      oxygenCabins: 'OXYGÈNE HABITACLES',
      commsBand: 'COMMUNICATIONS',
      hullIntegrity: 'INTÉGRITÉ DE LA COQUE',
      cpuLoad: 'CHARGE PROCESSEUR',
      nominalState: 'PARAMÈTRES NOMINAUX',
      warningState: 'ALERTE SUR LE SOUS-SYSTÈME',
      criticalState: 'ALARME CRITIQUE',
    },
    solar: {
      title: 'CARTE DE NAVIGATION INTERPLANÉTAIRE',
      warpBtn: 'ENGAGER LE SAUT VECTORIEL',
      currentLocation: 'LOCALISATION ACTUELLE',
      notEnoughEnergy: 'ÉNERGIE INSUFFISANTE POUR LE SAUT',
      energyCost: 'COÛT ÉNERGÉTIQUE',
      distance: 'DISTANCE',
      threat: 'NIVEAU DE MENACE',
      tacticalReport: 'RAPPORT TACTIQUE & SITUATIONNEL',
      availableSectors: 'SECTEURS ACCESSIBLES',
      traveling: 'TRANSIT HYPERSPATIAL EN COURS...',
    },
    dilemma: {
      banner: '[TRANSMISSION DE CRISE CRITIQUE]',
      urgencyLabel: 'URGENCE',
      officerLabel: 'OFFICIER ÉMETTEUR',
      channelLabel: 'CANAL RADIO',
      instructionPrompt: 'CHOISISSEZ LA DIRECTIVE D\'INTERVENTION :',
    },
    archive: {
      title: 'ARCHIVES HISTORIQUES & MULTIMÉDIA',
      galleryTab: 'GALERIE D\'ART',
      jukeboxTab: 'JUKEBOX OFFICIEL',
      nowPlaying: 'EN LECTURE',
      trackList: 'LISTE DES PISTES',
      playTrack: 'LIRE',
      pauseTrack: 'PAUSE',
      viewHighRes: 'AFFICHER EN HAUTE RÉSOLUTION',
      specs: 'SPÉCIFICATIONS TECHNIQUES',
      allFilter: 'TOUT',
    },
  },
};

export const CREW_TRANSLATIONS: Record<'es' | 'fr', Record<string, { rank: string; role: string; bio: string }>> = {
  es: {
    pina: {
      rank: 'CAPITÁN',
      role: 'Comandante en Jefe de la Estación Versalles',
      bio: 'Veterano de la Flota Orbital. Supervisa la integridad estructural, misiones prioritarias y autorizaciones de nivel Omega.',
    },
    ortega: {
      rank: 'INGENIERO JEFE',
      role: 'Especialista en Núcleos y Redes Cuánticas',
      bio: 'Diseñador de las bobinas de confinamiento de plasma. Capaz de reprogramar subredes en milisegundos con los ojos cerrados.',
    },
    ramirez: {
      rank: 'PILOTO & CIBER-OPS',
      role: 'Navegación Vectorial y Guerra Electrónica',
      bio: 'Experto en maniobras balísticas bajo gravedad cero y mitigación de intrusiones hostiles en la matriz defensiva.',
    },
  },
  fr: {
    pina: {
      rank: 'CAPITAINE',
      role: 'Commandant en Chef de la Station Versailles',
      bio: 'Vétéran de la Flotte Orbitale. Supervise l\'intégrité structurelle, les missions prioritaires et les autorisations de niveau Oméga.',
    },
    ortega: {
      rank: 'INGÉNIEUR EN CHEF',
      role: 'Spécialiste des Réacteurs et Réseaux Quantiques',
      bio: 'Concepteur des bobines de confinement de plasma. Capable de reprogrammer des sous-réseaux en quelques millisecondes les yeux fermés.',
    },
    ramirez: {
      rank: 'PILOTE & CYBER-OPS',
      role: 'Navigation Vectorielle et Guerre Électronique',
      bio: 'Expert en manœuvres balistiques en apesanteur et neutralisation d\'intrusions hostiles dans la matrice défensive.',
    },
  },
};

export const SECTOR_TRANSLATIONS: Record<'es' | 'fr', Record<string, { name: string; tag: string; description: string; hotspots?: Record<string, { title: string; subtitle: string; infoText?: string }> }>> = {
  es: {
    reactor: {
      name: 'Núcleo del Reactor & Energía',
      tag: 'INGENIERÍA PRIMARIA',
      description: 'Generador de fusión termonuclear y red troncal de plasma de la estación. Suministra energía a todos los módulos.',
      hotspots: {
        'hs-core': {
          title: 'Cámara de Fusión',
          subtitle: 'Núcleo de Plasma',
          infoText: 'CÁMARA DE FUSIÓN TOKAMAK: Temperatura interna 15,432°C. Contención por bobinas superconductoras. Oscilación de plasma: ±12%.',
        },
        'hs-console': {
          title: 'Consola Central',
          subtitle: 'Misión Activa',
          infoText: 'Terminal principal del reactor. Presiona para abrir los controles de calibración de misión.',
        },
        'hs-terminal': {
          title: 'Terminal de Diagnóstico',
          subtitle: 'CLI Reactor',
          infoText: 'Acceso directo a la línea de comandos de bajo nivel de las bombas de refrigeración.',
        },
        'hs-panel': {
          title: 'Bobinas Magnéticas',
          subtitle: 'Sector 4B',
          infoText: 'BANCO DE BOBINAS 4B: Estado errático. Corriente inducida: 2.4 kA. Umbral nominal requerido: ≥ 2.8 kA.',
        },
      },
    },
    lab: {
      name: 'Laboratorio de Datos & Lógica',
      tag: 'PROCESAMIENTO CUÁNTICO',
      description: 'Matrices de cómputo óptico y compuertas booleanas. Regula el autopiloto, telemetría y descifrado de transmisiones.',
      hotspots: {
        'hs-logic-core': {
          title: 'Procesador Cuántico',
          subtitle: 'Matriz Booleana',
          infoText: 'MATRIZ CUÁNTICA: 47/48 compuertas operacionales. Compuerta AND [Sector 12] con fallo por cortocircuito térmico.',
        },
        'hs-lab-console': {
          title: 'Consola de Algoritmos',
          subtitle: 'Misión Activa',
          infoText: 'Consola de depuración de código booleano y tablas de verdad.',
        },
        'hs-lab-terminal': {
          title: 'Terminal Lógica',
          subtitle: 'CLI Datos',
          infoText: 'Interfaz CLI del laboratorio. Permite compilar y evaluar pruebas unitarias de compuertas.',
        },
        'hs-lab-memory': {
          title: 'Racks de Memoria',
          subtitle: 'Búfer de Enlace',
          infoText: 'BANCOS DE REGISTROS: 128 TiB de memoria óptica holográfica. Tasa de errores de paridad: 0.003%.',
        },
      },
    },
    bridge: {
      name: 'Puente de Mando & Navegación',
      tag: 'CONTROL DE VUELO',
      description: 'Puesto de pilotaje orbital, cálculo de trayectorias gravitatorias y orientación de toberas de propulsión RCS.',
      hotspots: {
        'hs-helm': {
          title: 'Timón de Actitud',
          subtitle: 'Toberas RCS',
          infoText: 'CONTROL VECTORIAL RCS: 4 toberas de gas frío. Desalineación angular acumulada: +3.2° por minuto.',
        },
        'hs-bridge-console': {
          title: 'Consola Orbital',
          subtitle: 'Misión Activa',
          infoText: 'Computadora de tiro balístico y corrección orbital de la estación.',
        },
        'hs-bridge-terminal': {
          title: 'Terminal de Vuelo',
          subtitle: 'CLI Piloto',
          infoText: 'Acceso directo al bus de actuadores de propulsión para emitir pulsos micro-newton.',
        },
        'hs-nav-display': {
          title: 'Pantalla Táctica',
          subtitle: 'Horizonte Artificial',
          infoText: 'VECTORES GRAVITATORIOS: Perigeo 382 km, Apogeo 415 km. Decaimiento atmosférico residual: 1.4 m/s por ciclo.',
        },
      },
    },
    shields: {
      name: 'Matriz de Escudos & Ciber-Defensa',
      tag: 'SISTEMAS DEFENSIVOS',
      description: 'Generadores de blindaje electromagnético y cortafuegos dinámico contra interferencias de radiación y ciberataques.',
      hotspots: {
        'hs-shield-emitter': {
          title: 'Emisor Deflector',
          subtitle: 'Campo Gauss',
          infoText: 'EMISOR DE POLARIZACIÓN: Genera la burbuja deflectora contra polvo cósmico y partículas solares cargadas.',
        },
        'hs-shield-console': {
          title: 'Consola de Cortafuegos',
          subtitle: 'Misión Activa',
          infoText: 'Centro de monitoreo de paquetes TCP/IP y protocolos criptográficos de la estación.',
        },
        'hs-shield-terminal': {
          title: 'Terminal de Ciber-Defensa',
          subtitle: 'CLI Seguridad',
          infoText: 'Acceso a iptables espaciales y reglas de filtrado de intrusión para bloquear paquetes hostiles.',
        },
        'hs-shield-modulator': {
          title: 'Modulador de Frecuencia',
          subtitle: 'Filtro Armónico',
          infoText: 'MODULADOR 320 MHz: Sintonía de contrafase para repeler pulsos electromagnéticos de erupciones solares.',
        },
      },
    },
    drones: {
      name: 'Bahía de Drones & Mantenimiento',
      tag: 'ROBÓTICA Y SOPORTE VITAL',
      description: 'Hangar de micro-drones de soldadura exterior, sistemas de soporte de vida y depuradores de CO2 para habitáculos.',
      hotspots: {
        'hs-drone-bay': {
          title: 'Hangar de Ensamblaje',
          subtitle: 'Plataforma Alpha',
          infoText: 'BAHÍA DE ESTACIONAMIENTO: 6 drones de reparación clase Mantis en estado de recarga inductiva.',
        },
        'hs-drone-console': {
          title: 'Consola de Despacho',
          subtitle: 'Misión Activa',
          infoText: 'Planificador de rutas y algoritmos de asignación de tareas automáticas para la flota de drones.',
        },
        'hs-drone-terminal': {
          title: 'Terminal Robótica',
          subtitle: 'CLI Drones',
          infoText: 'Interfaz CLI para programar secuencias de vuelo automatizadas y prioridades FIFO/LIFO.',
        },
        'hs-drone-oxygen': {
          title: 'Depurador de Oxígeno',
          subtitle: 'Sector 4',
          infoText: 'FILTROS DE RECIRCULACIÓN: Válvula 4 con fuga por junta de dilatación. Requiere soldadura robótica urgente.',
        },
      },
    },
  },
  fr: {
    reactor: {
      name: 'Noyau du Réacteur & Énergie',
      tag: 'INGÉNIERIE PRIMAIRE',
      description: 'Générateur de fusion thermonucléaire et réseau principal de plasma de la station. Alimente tous les modules.',
      hotspots: {
        'hs-core': {
          title: 'Chambre de Fusion',
          subtitle: 'Noyau de Plasma',
          infoText: 'CHAMBRE DE FUSION TOKAMAK : Température interne 15 432°C. Confinement par bobines supraconductrices. Oscillation de plasma : ±12%.',
        },
        'hs-console': {
          title: 'Console Centrale',
          subtitle: 'Mission Active',
          infoText: 'Terminal principal du réacteur. Cliquez pour ouvrir les commandes de calibrage de mission.',
        },
        'hs-terminal': {
          title: 'Terminal de Diagnostic',
          subtitle: 'CLI Réacteur',
          infoText: 'Accès direct à la ligne de commande de bas niveau des pompes de refroidissement.',
        },
        'hs-panel': {
          title: 'Bobines Magnétiques',
          subtitle: 'Secteur 4B',
          infoText: 'BANC DE BOBINES 4B : État erratique. Courant induit : 2.4 kA. Seuil nominal requis : ≥ 2.8 kA.',
        },
      },
    },
    lab: {
      name: 'Laboratoire de Données & Logique',
      tag: 'TRAITEMENT QUANTIQUE',
      description: 'Matrices de calcul optique et portes booléennes. Régule le pilote automatique, la télémétrie et le décryptage.',
      hotspots: {
        'hs-logic-core': {
          title: 'Processeur Quantique',
          subtitle: 'Matrice Booléenne',
          infoText: 'MATRICE QUANTIQUE : 47/48 portes opérationnelles. Porte ET [Secteur 12] défaillante suite à un court-circuit thermique.',
        },
        'hs-lab-console': {
          title: 'Console d\'Algorithmes',
          subtitle: 'Mission Active',
          infoText: 'Console de débogage de code booléen et tables de vérité.',
        },
        'hs-lab-terminal': {
          title: 'Terminal Logique',
          subtitle: 'CLI Données',
          infoText: 'Interface CLI du laboratoire. Permet de compiler et d\'évaluer les tests unitaires des portes.',
        },
        'hs-lab-memory': {
          title: 'Baies de Mémoire',
          subtitle: 'Tampon de Liaison',
          infoText: 'BANCS DE REGISTRES : 128 Tio de mémoire optique holographique. Taux d\'erreurs de parité : 0,003%.',
        },
      },
    },
    bridge: {
      name: 'Passerelle de Commandement & Navigation',
      tag: 'CONTRÔLE DE VOL',
      description: 'Poste de pilotage orbital, calcul des trajectoires gravitationnelles et orientation des propulseurs RCS.',
      hotspots: {
        'hs-helm': {
          title: 'Gouvernail d\'Attitude',
          subtitle: 'Tuyères RCS',
          infoText: 'CONTRÔLE VECTORIEL RCS : 4 tuyères à gaz froid. Dérive angulaire cumulée : +3.2° par minute.',
        },
        'hs-bridge-console': {
          title: 'Console Orbitale',
          subtitle: 'Mission Active',
          infoText: 'Calculateur balistique et correction orbitale de la station.',
        },
        'hs-bridge-terminal': {
          title: 'Terminal de Vol',
          subtitle: 'CLI Pilote',
          infoText: 'Accès direct au bus des actionneurs de propulsion pour émettre des impulsions micro-newtons.',
        },
        'hs-nav-display': {
          title: 'Affichage Tactique',
          subtitle: 'Horizon Artificiel',
          infoText: 'VECTEURS GRAVITATIONNELS : Périgée 382 km, Apogée 415 km. Déclin atmosphérique résiduel : 1.4 m/s par cycle.',
        },
      },
    },
    shields: {
      name: 'Matrice de Boucliers & Cyberdéfense',
      tag: 'SYSTÈMES DÉFENSIFS',
      description: 'Générateurs de blindage électromagnétique et pare-feu dynamique contre les radiations et cyberattaques.',
      hotspots: {
        'hs-shield-emitter': {
          title: 'Émetteur Déflecteur',
          subtitle: 'Champ Gauss',
          infoText: 'ÉMETTEUR DE POLARISATION : Génère la bulle déflectrice contre les micrométéorites et particules solaires chargées.',
        },
        'hs-shield-console': {
          title: 'Console Pare-feu',
          subtitle: 'Mission Active',
          infoText: 'Centre de surveillance des flux de paquets et protocoles cryptographiques de la station.',
        },
        'hs-shield-terminal': {
          title: 'Terminal de Cyberdéfense',
          subtitle: 'CLI Sécurité',
          infoText: 'Accès aux iptables spatiales et règles de filtrage d\'intrusion pour bloquer les paquets hostiles.',
        },
        'hs-shield-modulator': {
          title: 'Modulateur de Fréquence',
          subtitle: 'Filtre Harmonique',
          infoText: 'MODULATEUR 320 MHz : Accord en opposition de phase pour repousser les sursauts électromagnétiques solaires.',
        },
      },
    },
    drones: {
      name: 'Baie des Drones & Maintenance',
      tag: 'ROBOTIQUE ET SUPPORT DE VIE',
      description: 'Hangar de micro-drones de soudure spatiale, systèmes de support de vie et épurateurs de CO2 pour habitacles.',
      hotspots: {
        'hs-drone-bay': {
          title: 'Hangar d\'Assemblage',
          subtitle: 'Plateforme Alpha',
          infoText: 'BAIE DE STATIONNEMENT : 6 drones de réparation classe Mantis en charge par induction.',
        },
        'hs-drone-console': {
          title: 'Console de Routage',
          subtitle: 'Mission Active',
          infoText: 'Planificateur de routes et algorithmes d\'allocation de tâches pour la flotte de drones.',
        },
        'hs-drone-terminal': {
          title: 'Terminal Robotique',
          subtitle: 'CLI Drones',
          infoText: 'Interface CLI pour programmer les séquences de vol automatisées et les priorités FIFO/LIFO.',
        },
        'hs-drone-oxygen': {
          title: 'Épurateur d\'Oxygène',
          subtitle: 'Secteur 4',
          infoText: 'FILTRES DE RECIRCULATION : Vanne 4 avec fuite sur joint de dilatation. Nécessite une soudure robotisée d\'urgence.',
        },
      },
    },
  },
};

export const SOLAR_TRANSLATIONS: Record<'es' | 'fr', Record<string, { name: string; type: string; description: string; tacticalIntel: string }>> = {
  es: {
    versalles: {
      name: 'Estación Versalles',
      type: 'ESTACIÓN ORBITAL',
      description: 'Estación nodriza de investigación termonuclear y contención de plasma.',
      tacticalIntel: 'El reactor Tokamak y la matriz de ciber-defensa requieren estabilización continua del operador.',
    },
    hyperion: {
      name: 'Acorazado Hyperion-9',
      type: 'NAVE ACORAZADA',
      description: 'Fragata de patrulla pesada a la deriva tras una tormenta de micrometeoritos.',
      tacticalIntel: 'Los propulsores de maniobra y los cortafuegos militares están desbalanceados.',
    },
    titan: {
      name: 'Base Titán-IV',
      type: 'COMPLEJO MINERO',
      description: 'Refinería criogénica de metano líquido y extracción subterránea.',
      tacticalIntel: 'Fuga en ductos criogénicos. Se requiere enrutamiento de válvulas de soporte vital.',
    },
    helios: {
      name: 'Sonda Helios-Sol',
      type: 'OBSERVATORIO SOLAR',
      description: 'Estación de investigación cuántica operando bajo radiación extrema.',
      tacticalIntel: 'La matriz de escudos térmicos y compuertas lógicas operan al límite térmico.',
    },
  },
  fr: {
    versalles: {
      name: 'Station Versailles',
      type: 'STATION ORBITALE',
      description: 'Station mère de recherche thermonucléaire et de confinement de plasma.',
      tacticalIntel: 'Le réacteur Tokamak et la matrice de cyberdéfense nécessitent une stabilisation continue par l\'opérateur.',
    },
    hyperion: {
      name: 'Cuirassé Hyperion-9',
      type: 'VAISSEAU CUIRASSÉ',
      description: 'Frégate lourde de patrouille à la dérive suite à une tempête de micrométéorites.',
      tacticalIntel: 'Les propulseurs de manœuvre et les pare-feu militaires sont déséquilibrés.',
    },
    titan: {
      name: 'Base Titan-IV',
      type: 'COMPLEXE MINIER',
      description: 'Raffinerie cryogénique de méthane liquide et extraction souterraine.',
      tacticalIntel: 'Fuite dans les conduites cryogéniques. Routage urgent des vannes de support de vie requis.',
    },
    helios: {
      name: 'Sonde Hélios-Soleil',
      type: 'OBSERVATOIRE SOLAIRE',
      description: 'Station de recherche quantique opérant sous des flux de radiations extrêmes.',
      tacticalIntel: 'Le bouclier thermique et les portes logiques fonctionnent à leur limite thermique critique.',
    },
  },
};

export const MISSION_TRANSLATIONS: Record<'es' | 'fr', Record<string, { title: string; conceptTaught: string; summary: string; briefing: string; objectives: string[]; solutionHint: string }>> = {
  es: {
    'm0-solar-collectors': {
      title: 'Crisis de Colectores Solares Exteriores',
      conceptTaught: 'Navegación UNIX, Inspección de Logs y Bucles for in range(N)',
      summary: 'Los colectores solares del sector exterior perdieron su orientación estelar. Navega a /sys/power, audita la telemetría y redacta un bucle para reorientar los 8 paneles.',
      briefing: `ALERTA DE AVIONICA CRÍTICA:
La estación está sufriendo un apagón progresivo. Las reservas de energía han caído al 24% debido a un desalineamiento angular en los colectores fotovoltaicos exteriores.

FASE 1 [DIAGNÓSTICO]:
Navega a la terminal e ingresa al directorio de energía:
  cd /sys/power
  cat solar_status.log
Usa grep para identificar el "ÁNGULO SOLAR ÓPTIMO" y verificar cuántos paneles están desalineados.

FASE 2 [MODELADO]:
En lugar de ajustar cada panel manualmente uno por uno, debes programar un bucle iterativo en Python que recorra los índices de los 8 servomotores (índices 0 al 7) y aplique el ángulo óptimo.

FASE 3 [EJECUCIÓN]:
Abre el script con 'nano calibrate_solar.py' o en la pestaña [EDITOR SCRIPT]. Completa el bucle for y ejecútalo. Si cometes un error de sintaxis o provocas un bucle infinito, la CPU drenará las baterías.`,
      objectives: [
        'Navegar a /sys/power y auditar solar_status.log con cat y grep',
        'Identificar el ángulo de captación óptimo (47.5°)',
        'Programar un bucle for range(8) en Python para orientar todos los paneles',
        'Ejecutar python calibrate_solar.py y restaurar la energía principal (≥90%)',
      ],
      solutionHint: 'Navega con cd /sys/power, lee solar_status.log con cat, y formula un bucle: for i in range(8): ajustar_panel_solar(i, 47.5)',
    },
    'm-carbon-filters': {
      title: 'Purga de Filtros de Carbono y Soporte Vital',
      conceptTaught: 'Iteración de Listas de Cadenas y Secuenciación de Válvulas',
      summary: 'La saturación de CO2 en cabina alcanzó el 94.2%. Inspecciona /sys/life_support, purga la lista de cartuchos tóxicos y activa la recirculación de O2.',
      briefing: `CRISIS AMBIENTAL EN HABITÁCULOS:
Los scrubbers de dióxido de carbono están bloqueados por micropartículas químicas. Si el oxígeno continúa decayendo, la tripulación perderá el conocimiento.

FASE 1 [DIAGNÓSTICO]:
Inspecciona los cartuchos bloqueados:
  cd /sys/life_support
  cat filter_status.log

FASE 2 [MODELADO]:
Observa los nombres de los cartuchos saturados (F_ALPHA, F_BETA, F_GAMMA, F_DELTA). Debes crear una lista en Python o Java con estos identificadores y recorrerla con un bucle para purgarlos secuencialmente.

FASE 3 [EJECUCIÓN]:
Abre carbon_filters.py. Tras la purga de cada filtro con purgar_filtro_carbono(), no olvides abrir las válvulas maestras con activar_recirculacion_o2().`,
      objectives: [
        'Inspeccionar los cartuchos en /sys/life_support/filter_status.log',
        'Definir la lista de filtros y recorrerla mediante un bucle de elementos',
        'Activar la recirculación de oxígeno y recuperar la presión a ≥90%',
      ],
      solutionHint: 'Itera sobre la lista de filtros: for f in filtros: purgar_filtro_carbono(f), y luego ejecuta activar_recirculacion_o2().',
    },
    'm1-plasma': {
      title: 'Confinamiento Magnético y Control Térmico',
      conceptTaught: 'Variables, Rango Numérico Seguro y Cálculo Termodinámico',
      summary: 'El plasma de fusión supera los 15,400°C y el campo magnético cayó al 83%. Calcula los litros criogénicos necesarios y estabiliza el confinamiento.',
      briefing: `ALERTA TERMONUCLEAR:
La contención toroidal del reactor está desestabilizándose. La oscilación del plasma alcanza ±12.0% y la temperatura se acerca al punto de ruptura del casco (16,000°C).

FASE 1 [DIAGNÓSTICO]:
Inspecciona la telemetría del núcleo:
  cat /sys/reactor/core.telemetry

FASE 2 [MODELADO]:
1. El campo magnético debe situarse entre el 88% y 94% para evitar tanto fugas de plasma como sobrecarga electromagnética.
2. Cada litro de helio criogénico inyectado disipa 45°C. Calcula cuántos litros requieres para enfriar el núcleo a un nivel seguro (~13,000°C).

FASE 3 [EJECUCIÓN]:
Formula un script en Python (confinement.py) que asigne el campo con ajustar("CAMPO_MAGNETICO", 92), encienda el estabilizador con activar("SISTEMA_ESTABILIZADOR") e inyecte los litros calculados con inyectar_crio(litros).`,
      objectives: [
        'Auditar /sys/reactor/core.telemetry para conocer temperatura y campo',
        'Elevar el confinamiento magnético a ≥88% y encender el estabilizador',
        'Inyectar refrigerante criogénico para reducir la temperatura a <14,000°C',
        'Reducir la oscilación de plasma por debajo del 5%',
      ],
      solutionHint: 'Ejecuta en /sys/reactor: ajustar("CAMPO_MAGNETICO", 92), activar("SISTEMA_ESTABILIZADOR") e inyectar_crio(55).',
    },
    'm2-logic-gate': {
      title: 'Reparación de Compuerta Lógica AND y Telemetría',
      conceptTaught: 'Álgebra de Boole, Operadores Lógicos (AND, OR, NOT) y Tablas de Verdad',
      summary: 'El procesador del laboratorio perdió la señal de navegación por una compuerta dañada. Reconstruye la función booleana para reanudar el enlace.',
      briefing: `FALLO EN MATRIZ LÓGICA:
El subsistema de navegación secundaria depende de una compuerta AND de alta precisión. Actualmente emite valores erráticos, impidiendo la sincronización de relojes atómicos.

FASE 1 [DIAGNÓSTICO]:
Revisa la tabla de verdad esperada en /sys/lab/truth_table.dat. Observa que una compuerta AND solo es VERDADERA (1) cuando ambas entradas A y B son 1.

FASE 2 [EJECUCIÓN]:
Edita repair_gate.py y define la función logica_and(a, b) devolviendo a and b (o a && b en Java). Ejecuta el script para someter tu función a la suite de tests automatizados.`,
      objectives: [
        'Inspeccionar /sys/lab/truth_table.dat',
        'Implementar la compuerta AND binaria correcta',
        'Superar la batería de pruebas de verificación booleana',
      ],
      solutionHint: 'Escribe una función def compuerta_and(a, b): return a and b, o activa la compuerta física en la consola de diagnóstico.',
    },
    'm3-thrusters': {
      title: 'Calibración de Propulsores RCS y Órbita',
      conceptTaught: 'Vectores, Balance de Arrays y Corrección Balística',
      summary: 'La órbita de la estación está decayendo a 1.4 m/s por ciclo. Calibra los cuatro propulsores de maniobra para contrarrestar la atracción gravitatoria.',
      briefing: `DECAIMIENTO DE ALTITUD EN CURSO:
Los cuatro propulsores RCS están desbalanceados ([60, 45, 80, 50] % de empuje), induciendo un cabeceo que frena la estación contra la termosfera.

FASE 1 [DIAGNÓSTICO]:
Inspecciona la actitud actual:
  cat /sys/bridge/attitude.telemetry

FASE 2 [EJECUCIÓN]:
Modifica /sys/bridge/rcs_balance.py para balancear uniformemente los cuatro vectores a 95% de empuje nominal: propulsores = [95, 95, 95, 95], y llama a aplicar_propulsores(propulsores).`,
      objectives: [
        'Consultar la telemetría balística en /sys/bridge',
        'Balancear el vector de las 4 toberas RCS al 95%',
        'Reducir la tasa de decaimiento orbital a 0.0 m/s',
      ],
      solutionHint: 'Asigna a los 4 propulsores el valor 95: aplicar_propulsores([95, 95, 95, 95]).',
    },
    'm4-firewall': {
      title: 'Firewall Dinámico y Supresión de Malware',
      conceptTaught: 'Filtrado de Paquetes, Expresiones Condicionales y Diccionarios',
      summary: 'Una botnet automatizada está saturando el bus de datos con paquetes falsificados. Configura reglas de cortafuegos para purgar el tráfico hostil.',
      briefing: `INTRUSIÓN CIBERNÉTICA EN CURSO:
Múltiples direcciones IP externas desconocidas están inundando el puerto de escudos con tramas corruptas.

FASE 1 [DIAGNÓSTICO]:
Lee el log de tráfico con cat /sys/shields/firewall.log. Observa los puertos objetivo y las firmas maliciosas.

FASE 2 [EJECUCIÓN]:
Abre /sys/shields/filter_traffic.py, programa una condición que descarte paquetes con firma 'MALWARE' o puertos ajenos a la flota, y ejecuta el script para restaurar el ancho de banda.`,
      objectives: [
        'Auditar el tráfico en /sys/shields/firewall.log',
        'Activar las reglas del firewall para filtrar tráfico ilícito',
        'Neutralizar todos los paquetes maliciosos entrantes',
      ],
      solutionHint: 'Ejecuta activar_firewall() o define un filtro que bloquee paquetes hostiles en el script de seguridad.',
    },
    'm5-quantum-logic': {
      title: 'Sincronización Cuántica y Desencriptación',
      conceptTaught: 'Criptografía, Aritmética Modular y Matrices Cuánticas',
      summary: 'Descifra la señal de enlace cuántico entre la estación y el mando terrestre mediante una rutina de alineación de fase.',
      briefing: `ENLACE CUÁNTICO CIFRADO:
La telemetría de mando está desincronizada debido a una rotación de fase cuántica. Restablece la coherencia matricial para restablecer el enlace seguro.`,
      objectives: [
        'Alinear la fase de los qubits en /sys/lab',
        'Restablecer la tasa de coherencia por encima del 98%',
      ],
      solutionHint: 'Alinea los registros cuánticos y sincroniza la clave criptográfica.',
    },
    'm6-drone-queue': {
      title: 'Optimización de Enrutamiento de Drones',
      conceptTaught: 'Estructuras de Datos FIFO/LIFO, Colas y Priorización',
      summary: 'Los micro-drones de soldadura están atascados en un cuello de botella en el hangar. Implementa una cola de prioridad para despacharlos eficientemente.',
      briefing: `CONGESTIÓN EN EL HANGAR:
Las órdenes de reparación se acumulan desordenadas. Los drones intentan soldar brechas no prioritarias mientras los conductos de oxígeno continúan perdiendo presión.`,
      objectives: [
        'Organizar las órdenes de los drones por nivel de severidad',
        'Despachar los drones hacia las válvulas de soporte de vida',
      ],
      solutionHint: 'Ordena las tareas en orden de prioridad crítica y llama a despachar_drones().',
    },
    'm7-omega-crisis': {
      title: 'Protocolo Omega: Crisis Multisistema',
      conceptTaught: 'Algoritmos Concurrentes, Orquestación de Subsistemas y Resiliencia',
      summary: 'Fallo simultáneo en todos los compartimentos de la estación. Coordina la energía, escudos y propulsores antes de que el contador llegue a cero.',
      briefing: `CRISIS GENERAL NIVEL OMEGA:
Una eyección de masa coronal ha golpeado la estación. El reactor se sobrecalienta, los escudos oscilan y la órbita decae al mismo tiempo. Debes orquestar la estabilización de los tres sectores de forma sincronizada.`,
      objectives: [
        'Restaurar la contención del reactor a ≥90%',
        'Modular los escudos por encima del 80%',
        'Corregir el rumbo balístico antes del colapso',
      ],
      solutionHint: 'Estabiliza el reactor, propulsores y escudos de forma secuencial o mediante tu script maestro.',
    },
  },
  fr: {
    'm0-solar-collectors': {
      title: 'Crise des Collecteurs Solaires Extérieurs',
      conceptTaught: 'Navigation UNIX, Inspection de Logs et Boucles for in range(N)',
      summary: 'Les collecteurs solaires du secteur extérieur ont perdu leur orientation stellaire. Naviguez vers /sys/power, auditez la télémétrie et écrivez une boucle pour réorienter les 8 panneaux.',
      briefing: `ALERTE AVIONIQUE CRITIQUE :
La station subit une panne de courant progressive. Les réserves d'énergie ont chuté à 24% en raison d'un désalignement angulaire des capteurs photovoltaïques extérieurs.

PHASE 1 [DIAGNOSTIC] :
Accédez au terminal et entrez dans le répertoire de l'énergie :
  cd /sys/power
  cat solar_status.log
Utilisez grep pour identifier l'"ANGLE SOLAIRE OPTIMAL" et vérifier le nombre de panneaux désalignés.

PHASE 2 [MODÉLISATION] :
Au lieu d'ajuster chaque panneau manuellement un par un, vous devez programmer une boucle itérative en Python qui parcourt les indices des 8 servomoteurs (indices 0 à 7) et applique l'angle optimal.

PHASE 3 [EXÉCUTION] :
Ouvrez le script avec 'nano calibrate_solar.py' ou dans l'onglet [ÉDITEUR DE SCRIPT]. Complétez la boucle for et exécutez-la. Toute erreur de syntaxe ou boucle infinie drainera les batteries.`,
      objectives: [
        'Naviguer vers /sys/power et auditer solar_status.log avec cat et grep',
        'Identifier l\'angle de captation optimal (47.5°)',
        'Programmer une boucle for range(8) en Python pour orienter tous les panneaux',
        'Exécuter python calibrate_solar.py et restaurer l\'énergie principale (≥90%)',
      ],
      solutionHint: 'Naviguez avec cd /sys/power, lisez solar_status.log avec cat, et formulez la boucle : for i in range(8): ajuster_panel_solar(i, 47.5)',
    },
    'm-carbon-filters': {
      title: 'Purge des Filtres à Charbon et Support de Vie',
      conceptTaught: 'Itération de Listes de Chaînes et Séquençage de Vannes',
      summary: 'La saturation en CO2 dans l\'habitacle a atteint 94.2%. Inspectez /sys/life_support, purgez les cartouches toxiques et relancez la recirculation d\'O2.',
      briefing: `CRISE ENVIRONNEMENTALE DANS LES HABITACLES :
Les épurateurs de dioxyde de carbone sont colmatés par des microparticules chimiques. Si l'oxygène continue de chuter, l'équipage perdra connaissance.

PHASE 1 [DIAGNOSTIC] :
Inspectez les cartouches saturées :
  cd /sys/life_support
  cat filter_status.log

PHASE 2 [MODÉLISATION] :
Observez les identifiants des filtres bloqués (F_ALPHA, F_BETA, F_GAMMA, F_DELTA). Créez une liste en Python ou Java avec ces identifiants et parcourez-la avec une boucle pour les purger un par un.

PHASE 3 [EXÉCUTION] :
Ouvrez carbon_filters.py. Après la purge de chaque filtre avec purgar_filtro_carbono(), n'oubliez pas d'ouvrir les vannes principales avec activar_recirculacion_o2().`,
      objectives: [
        'Inspecter les cartouches dans /sys/life_support/filter_status.log',
        'Définir la liste de filtres et la parcourir avec une boucle d\'éléments',
        'Activer la recirculation d\'oxygène et rétablir la pression à ≥90%',
      ],
      solutionHint: 'Parcourez la liste : for f in filtros: purgar_filtro_carbono(f), puis appelez activar_recirculacion_o2().',
    },
    'm1-plasma': {
      title: 'Confinement Magnétique et Contrôle Thermique',
      conceptTaught: 'Variables, Plage Numérique Sûre et Calcul Thermodynamique',
      summary: 'Le plasma de fusion dépasse 15 400°C et le champ magnétique est tombé à 83%. Calculez les litres cryogéniques requis et stabilisez le confinement.',
      briefing: `ALERTE THERMONUCLÉAIRE :
Le confinement toroïdal du réacteur se déstabilise. L'oscillation du plasma atteint ±12.0% et la température approche du point de rupture de la coque (16 000°C).

PHASE 1 [DIAGNOSTIC] :
Inspectez la télémétrie du réacteur :
  cat /sys/reactor/core.telemetry

PHASE 2 [MODÉLISATION] :
1. Le champ magnétique doit être compris entre 88% et 94% pour éviter à la fois les fuites de plasma et la surcharge électromagnétique.
2. Chaque litre d'hélium cryogénique injecté dissipe 45°C. Calculez les litres nécessaires pour ramener le réacteur sous les 14 000°C.

PHASE 3 [EXÉCUTION] :
Écrivez un script Python (confinement.py) qui règle le champ avec ajustar("CAMPO_MAGNETICO", 92), active le stabilisateur avec activar("SISTEMA_ESTABILIZADOR") et injecte le fluide avec inyectar_crio(litros).`,
      objectives: [
        'Consulter /sys/reactor/core.telemetry pour relever température et champ',
        'Élever le confinement magnétique à ≥88% et enclencher le stabilisateur',
        'Injecter le liquide cryogénique pour abaisser la température sous 14 000°C',
        'Réduire l\'oscillation de plasma sous les 5%',
      ],
      solutionHint: 'Exécutez dans /sys/reactor : ajustar("CAMPO_MAGNETICO", 92), activar("SISTEMA_ESTABILIZADOR") et inyectar_crio(55).',
    },
    'm2-logic-gate': {
      title: 'Réparation de Porte Logique ET et Télémétrie',
      conceptTaught: 'Algèbre de Boole, Opérateurs Logiques (AND, OR, NOT) et Tables de Vérité',
      summary: 'Le processeur du laboratoire a perdu le signal de navigation à cause d\'une porte endommagée. Reconstruisez la fonction booléenne pour rétablir la liaison.',
      briefing: `DÉFAILLANCE DE LA MATRICE LOGIQUE :
Le sous-système de navigation secondaire repose sur une porte ET haute précision. Actuellement défaillante, elle empêche la synchronisation des horloges atomiques.

PHASE 1 [DIAGNOSTIC] :
Examinez la table de vérité dans /sys/lab/truth_table.dat. Rappel : une porte ET est VRAIE (1) uniquement si ses deux entrées A et B valent 1.

PHASE 2 [EXÉCUTION] :
Éditez repair_gate.py et définissez la fonction logica_and(a, b) renvoyant a and b (ou a && b en Java). Exécutez le script pour soumettre votre fonction aux tests unitaires.`,
      objectives: [
        'Inspecter /sys/lab/truth_table.dat',
        'Implémenter la porte binaire ET correcte',
        'Valider la suite de tests automatisés de logique booléenne',
      ],
      solutionHint: 'Définissez la fonction : def compuerta_and(a, b): return a and b, ou réparez la porte sur la console de diagnostic.',
    },
    'm3-thrusters': {
      title: 'Calibrage des Propulseurs RCS et Orbite',
      conceptTaught: 'Vecteurs, Équilibrage de Tableaux et Correction Balistique',
      summary: 'L\'orbite de la station décline de 1.4 m/s par cycle. Calibrez les quatre propulseurs pour contrer l\'attraction gravitationnelle.',
      briefing: `PERTE D'ALTITUDE ORBITALE :
Les quatre propulseurs RCS sont déséquilibrés ([60, 45, 80, 50] % de poussée), provoquant un tangage qui freine la station contre la haute atmosphère.

PHASE 1 [DIAGNOSTIC] :
Inspectez l'attitude actuelle :
  cat /sys/bridge/attitude.telemetry

PHASE 2 [EXÉCUTION] :
Modifiez /sys/bridge/rcs_balance.py pour aligner uniformément les quatre vecteurs à 95% de poussée nominale : propulseurs = [95, 95, 95, 95], puis appelez aplicar_propulsores(propulseurs).`,
      objectives: [
        'Consulter la télémétrie balistique dans /sys/bridge',
        'Équilibrer les 4 tuyères RCS à 95% de puissance',
        'Ramener le taux de déclin orbital à 0.0 m/s',
      ],
      solutionHint: 'Attribuez 95 aux 4 propulseurs : aplicar_propulsores([95, 95, 95, 95]).',
    },
    'm4-firewall': {
      title: 'Pare-feu Dynamique et Neutralisation de Malware',
      conceptTaught: 'Filtrage de Paquets, Expressions Conditionnelles et Dictionnaires',
      summary: 'Un botnet hostile sature le bus de données avec des paquets corrompus. Configurez les règles de pare-feu pour purger le trafic indésirable.',
      briefing: `INTRUSION CYBERNÉTIQUE EN COURS :
De multiples adresses IP externes inconnues inondent le port des boucliers avec des trames malveillantes.

PHASE 1 [DIAGNOSTIC] :
Lisez le journal de trafic avec cat /sys/shields/firewall.log. Notez les ports ciblés et les signatures suspectes.

PHASE 2 [EXÉCUTION] :
Ouvrez /sys/shields/filter_traffic.py, programmez une condition filtrant les paquets avec la signature 'MALWARE', et exécutez le script pour rétablir la bande passante.`,
      objectives: [
        'Auditer le trafic dans /sys/shields/firewall.log',
        'Activer les règles de filtrage contre le trafic illicite',
        'Neutraliser tous les paquets malveillants entrants',
      ],
      solutionHint: 'Exécutez activar_firewall() ou programmez le filtre de sécurité dans le script.',
    },
    'm5-quantum-logic': {
      title: 'Synchronisation Quantique et Décryptage',
      conceptTaught: 'Cryptographie, Arithmétique Modulaire et Matrices Quantiques',
      summary: 'Déchiffrez le signal de liaison quantique entre la station et le centre de contrôle terrestre grâce à un alignement de phase.',
      briefing: `LIAISON QUANTIQUE CHIFFRÉE :
La télémétrie de commandement est désynchronisée suite à une rotation de phase quantique. Rétablissez la cohérence matricielle pour restaurer la liaison sécurisée.`,
      objectives: [
        'Aligner la phase des qubits dans /sys/lab',
        'Rétablir le taux de cohérence au-dessus de 98%',
      ],
      solutionHint: 'Alignez les registres quantiques et synchronisez la clé cryptographique.',
    },
    'm6-drone-queue': {
      title: 'Optimisation du Routage des Drones',
      conceptTaught: 'Structures FIFO/LIFO, Files d\'Attente et Priorités',
      summary: 'Les micro-drones de soudure sont bloqués dans un goulot d\'étranglement au hangar. Implémentez une file prioritaire pour les déployer efficacement.',
      briefing: `CONGESTION AU HANGAR :
Les ordres de réparation s'accumulent sans ordre de priorité. Les drones tentent de colmater des brèches secondaires pendant que les circuits d'oxygène perdent leur pression.`,
      objectives: [
        'Classer les ordres d\'intervention des drones selon l\'urgence',
        'Déployer en priorité les drones vers les vannes de support de vie',
      ],
      solutionHint: 'Triez les tâches par ordre de criticité et appelez despachar_drones().',
    },
    'm7-omega-crisis': {
      title: 'Protocole Oméga : Crise Multisystème',
      conceptTaught: 'Algorithmes Parallèles, Orchestration de Systèmes et Résilience',
      summary: 'Défaillance simultanée sur tous les compartiments de la station. Coordonnez l\'énergie, les boucliers et les propulseurs avant la fin du décompte.',
      briefing: `CRISE GÉNÉRALE NIVEAU OMÉGA :
Une éjection de masse coronale a percuté la station. Le réacteur surchauffe, les boucliers oscillent et l'orbite décline simultanément. Vous devez orchestrer la stabilisation des trois secteurs de manière synchrone.`,
      objectives: [
        'Rétablir le confinement du réacteur à ≥90%',
        'Moduler les boucliers au-delà de 80%',
        'Corriger la trajectoire balistique avant le crash orbital',
      ],
      solutionHint: 'Stabilisez le réacteur, les propulseurs et les boucliers séquentiellement ou avec votre script maître.',
    },
  },
};

export const DILEMMA_TRANSLATIONS: Record<'es' | 'fr', Record<string, { title: string; urgency: string; situation: string; choices: Array<{ text: string; description: string; response: string }> }>> = {
  es: {
    'dilemma-energy-divert': {
      title: 'COLAPSO DE SUMINISTRO EN BOBINAS',
      urgency: 'CRÍTICA',
      situation: '¡Operador! El confinamiento magnético del reactor está sufriendo una sobretensión masiva. Si no inyectamos energía de inmediato, el plasma fundirá el núcleo. Podemos desviar el 30% del sistema de soporte vital de los módulos deshabitados o desviar energía de la matriz de escudos.',
      choices: [
        {
          text: 'Desviar energía de Soporte Vital',
          description: 'Mantiene los escudos intactos, pero reduce temporalmente los niveles de oxígeno de la estación.',
          response: 'Confinamiento estabilizado. El oxígeno en las cubiertas B y C ha bajado, pero el reactor sigue en una sola pieza.',
        },
        {
          text: 'Desviar energía de los Escudos',
          description: 'Mantiene el aire respirable al 100%, pero debilita la barrera deflectora contra la radiación exterior.',
          response: 'Escudos bajando al 40% para alimentar el reactor. Espero que no nos crucemos con ningún micrometeorito ahora...',
        },
      ],
    },
    'dilemma-alien-signal': {
      title: 'PAQUETE DE TELEMETRÍA DESCONOCIDO',
      urgency: 'ALTA',
      situation: 'La antena del sector de datos acaba de captar un paquete binario encriptado de alta densidad proveniente de un satélite a la deriva. Podría contener algoritmos de optimización cuántica o una rutina de malware espía. ¿Qué hacemos?',
      choices: [
        {
          text: 'Decodificar y Asimilar Datos',
          description: 'Arriesga la seguridad de los cortafuegos pero podría otorgar valiosos puntos de experiencia tecnológica.',
          response: '¡Increíble! Era una matriz matemática de navegación hiperbólica. +95 XP obtenidos, aunque tuvimos que aislar dos puertos infectados.',
        },
        {
          text: 'Purgar y Aislar Frecuencia',
          description: 'Prioridad de seguridad absoluta. Destruye el paquete para blindar la estación contra cualquier brecha.',
          response: 'Buena prudencia, operador. La seguridad de la tripulación de la Versalles es la primera directiva.',
        },
      ],
    },
    'dilemma-debris-field': {
      title: 'CAMPO DE ESCOMBROS EN CURSO DE COLISIÓN',
      urgency: 'EXTREMA',
      situation: '¡Atención puente! Los sensores de largo alcance detectan restos de un viejo carguero a 400 km. Pasarán a través de nuestra órbita en 4 minutos. ¿Quemamos combustible para una maniobra evasiva o reforzamos el escudo frontal al 100% y aguantamos el impacto?',
      choices: [
        {
          text: 'Encendido de Propulsores RCS (Evasión)',
          description: 'Consume 20% de reserva energética para alterar la trayectoria y evitar el impacto directo.',
          response: '¡Viraje completado con éxito! Los escombros nos pasaron rozando a 80 metros. Estación intacta.',
        },
        {
          text: 'Sobrecargar Escudo Frontal',
          description: 'Ahorra energía del motor pero algunos fragmentos menores perforarán la armadura del casco.',
          response: '¡Impacto absorbido! La barrera resistió casi todo, aunque tenemos microfisuras en el blindaje exterior.',
        },
      ],
    },
  },
  fr: {
    'dilemma-energy-divert': {
      title: 'EFFONDREMENT D\'ALIMENTATION DES BOBINES',
      urgency: 'CRITIQUE',
      situation: 'Opérateur ! Le confinement magnétique du réacteur subit une surtension massive. Si nous n\'injectons pas d\'énergie immédiatement, le plasma fera fondre le noyau. Nous pouvons délester 30% du support de vie des modules inoccupés ou dévier l\'énergie des boucliers.',
      choices: [
        {
          text: 'Dévier l\'énergie du Support de Vie',
          description: 'Maintient les boucliers intacts, mais réduit temporairement les réserves d\'oxygène de la station.',
          response: 'Confinement stabilisé. L\'oxygène sur les ponts B et C a diminué, mais le réacteur est intact.',
        },
        {
          text: 'Dévier l\'énergie des Boucliers',
          description: 'Garde l\'air respirable à 100%, mais fragilise la barrière déflectrice contre les radiations.',
          response: 'Boucliers réduits à 40% pour alimenter le réacteur. Espérons ne croiser aucune micrométéorite...',
        },
      ],
    },
    'dilemma-alien-signal': {
      title: 'PAQUET DE TÉLÉMÉTRIE INCONNU',
      urgency: 'ÉLEVÉE',
      situation: 'L\'antenne du laboratoire vient d\'intercepter un paquet binaire chiffré haute densité provenant d\'un satellite à la dérive. Il pourrait contenir des algorithmes d\'optimisation quantique ou un malware espion. Que faisons-nous ?',
      choices: [
        {
          text: 'Décoder et Assimiler les Données',
          description: 'Met en danger les pare-feu mais pourrait apporter de précieux points d\'expérience technologique.',
          response: 'Incroyable ! C\'était une matrice mathématique de navigation hyperbolique. +95 XP gagnés, bien que nous ayons dû isoler deux ports infectés.',
        },
        {
          text: 'Purger et Isoler la Fréquence',
          description: 'Priorité sécurité absolue. Détruit le paquet pour immuniser la station contre toute brèche.',
          response: 'Excellente prudence, opérateur. La sécurité de l\'équipage de Versailles est notre première directive.',
        },
      ],
    },
    'dilemma-debris-field': {
      title: 'CHAMP DE DÉBRIS SUR TRAJECTOIRE DE COLLISION',
      urgency: 'EXTRÊME',
      situation: 'Alerte passerelle ! Les capteurs longue portée détectent des épaves d\'un ancien cargo à 400 km. Elles croiseront notre orbite dans 4 minutes. Brûlons-nous du carburant pour une manœuvre d\'évitement, ou surchargeons-nous le bouclier frontal pour encaisser le choc ?',
      choices: [
        {
          text: 'Allumage des Propulseurs RCS (Évitement)',
          description: 'Consomme 20% d\'énergie pour dévier notre trajectoire et esquiver l\'impact direct.',
          response: 'Virage réussi ! Les débris nous ont frôlés à 80 mètres. Station intacte.',
        },
        {
          text: 'Surcharger le Bouclier Frontal',
          description: 'Économise l\'énergie de poussée mais certains fragments perceront l\'armure de coque.',
          response: 'Impact absorbé ! Le bouclier a presque tout paré, malgré quelques microfissures sur la coque.',
        },
      ],
    },
  },
};

export const RANKS_TRANSLATIONS: Record<'es' | 'fr', Record<string, string>> = {
  es: {
    'Cadete de Sistemas': 'Cadete de Sistemas',
    'Técnico de Subred': 'Técnico de Subred',
    'Ingeniero de Sistemas': 'Ingeniero de Sistemas',
    'Oficial de Ciber-Defensa': 'Oficial de Ciber-Defensa',
    'Comandante de Estación': 'Comandante de Estación',
  },
  fr: {
    'Cadete de Sistemas': 'Cadet des Systèmes',
    'Técnico de Subred': 'Technicien de Sous-Réseau',
    'Ingeniero de Sistemas': 'Ingénieur Système',
    'Oficial de Ciber-Defensa': 'Officier de Cyberdéfense',
    'Comandante de Estación': 'Commandant de Station',
  },
};
