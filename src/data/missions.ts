import { Mission } from '../types/game';

export function getMissionsForLocation(missions: Mission[], locationId: string): Mission[] {
  return missions.filter(m => (m.locationId || 'versalles') === locationId);
}

export const MISSIONS: Mission[] = [
  // ══════════════════════════════════════════════════════════════
  // NIVEL 1: FUNDAMENTOS Y ENTORNO UNIX (ESTACIÓN VERSALLES)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'm0-solar-collectors',
    locationId: 'versalles',
    sectorId: 'reactor',
    imageKey: 'mision_plasma_reactor',
    title: 'Crisis de Colectores Solares Exteriores',
    category: 'BUCLES_Y_ARRAYS',
    difficulty: 'BÁSICO',
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
    timeLimitSeconds: 180,
    initialCode: `# SCRIPT DE CALIBRACIÓN SOLAR - PYTHON 3
# Estación Versalles // Avionics
# 1. Consulta el ángulo óptimo en /sys/power/solar_status.log con 'cat'
# 2. Itera sobre los 8 servomotores (0 a 7) y reoriéntalos

ANGULO_OPTIMO = 0.0  # TODO: Reemplaza 0.0 con el ángulo hallado en el log (ej. 47.5)
TOTAL_PANELES = 8

# TODO: Escribe el bucle for que recorra range(TOTAL_PANELES)
# y oriente cada panel llamando a: ajustar_panel_solar(i, ANGULO_OPTIMO)
#
# for i in range(...):
#     ajustar_panel_solar(...)

print(">> Calibración de servomotores solares finalizada.")
`,
    solutionHint: 'Navega con cd /sys/power, lee solar_status.log con cat, y formula un bucle: for i in range(8): ajustar_panel_solar(i, 47.5)',
    availableCommands: ['ls', 'cd /sys/power', 'cat solar_status.log', 'grep "ÓPTIMO" solar_status.log', 'nano calibrate_solar.py', 'python calibrate_solar.py', 'AYUDA()'],
    rewardXP: 150,
    testCases: [
      {
        description: 'Energía de la estación restaurada al 90% o superior',
        check: (state) => state.vitals.energy >= 90,
        hint: 'Asegúrate de ejecutar el bucle sobre los 8 paneles.',
      },
      {
        description: 'Amenaza de apagón neutralizada (Nivel NOMINAL)',
        check: (state) => state.vitals.activeThreatLevel === 'NOMINAL',
        hint: 'Al restablecer la captación solar, la alarma crítica se extingue.',
      },
    ],
  },
  {
    id: 'm-carbon-filters',
    locationId: 'versalles',
    sectorId: 'drones',
    imageKey: 'mision_drones_carga',
    title: 'Purga de Filtros de Carbono y Soporte Vital',
    category: 'AUTOMATIZACION_DRONES',
    difficulty: 'INTERMEDIO',
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
    timeLimitSeconds: 160,
    initialCode: `# Soporte Vital - Regeneración Atmosférica
# Inspecciona /sys/life_support/filter_status.log para verificar los filtros

# TODO: Declara la lista con los 4 filtros saturados:
filtros = []

# TODO: Itera sobre cada filtro y llama a purgar_filtro_carbono(f)
# for f in filtros:
#     ...

# TODO: Abre las válvulas troncales de O2 llamando a activar_recirculacion_o2()

print(">> Ciclo de purga atmosférica concluido.")
`,
    solutionHint: 'Itera sobre la lista de filtros: for f in filtros: purgar_filtro_carbono(f), y luego ejecuta activar_recirculacion_o2().',
    availableCommands: ['ls', 'cd /sys/life_support', 'cat filter_status.log', 'python carbon_filters.py', 'nano carbon_filters.py', 'AYUDA()'],
    rewardXP: 200,
    testCases: [
      {
        description: 'Oxígeno de la estación restaurado por encima del 90%',
        check: (state) => state.vitals.oxygen >= 90,
        hint: 'Asegúrate de purgar todos los cartuchos y activar la recirculación.',
      },
      {
        description: 'Válvulas de soporte vital enrutadas correctamente',
        check: (state) => state.droneState.oxygenPumpsRouted === true,
        hint: 'Verifica la telemetría de soporte vital.',
      },
    ],
  },
  {
    id: 'm1-plasma',
    locationId: 'versalles',
    sectorId: 'reactor',
    imageKey: 'mision_plasma_reactor',
    title: 'Confinamiento Magnético y Control Térmico',
    category: 'VARIABLES_Y_CALIBRACION',
    difficulty: 'BÁSICO',
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
    timeLimitSeconds: 150,
    initialCode: `# Calibración del Reactor de Fusión - Python 3
# 1. Asigna el campo magnético (rango seguro 88 a 94%)
ajustar("CAMPO_MAGNETICO", 92)

# 2. Enciende el subsistema estabilizador
activar("SISTEMA_ESTABILIZADOR")

# 3. Inyecta el criorefrigerante necesario (cada litro enfría 45°C)
litros_necesarios = 55
inyectar_crio(litros_necesarios)
`,
    solutionHint: 'Ejecuta en /sys/reactor: ajustar("CAMPO_MAGNETICO", 92), activar("SISTEMA_ESTABILIZADOR") e inyectar_crio(55).',
    availableCommands: ['cd /sys/reactor', 'cat core.telemetry', 'python confinement.py', 'nano confinement.py', 'AYUDA()'],
    rewardXP: 180,
    testCases: [
      {
        description: 'Campo magnético configurado en 88% o superior',
        check: (state) => state.reactorState.magneticField >= 88,
        hint: 'El valor debe ser mínimo 88%.',
      },
      {
        description: 'Sistema estabilizador activo y oscilación < 5%',
        check: (state) => state.reactorState.stabilizerActive === true && state.reactorState.plasmaOscillation <= 5,
        hint: 'Activa el estabilizador.',
      },
      {
        description: 'Temperatura del núcleo dentro de márgenes seguros (<14,500°C)',
        check: (state) => state.vitals.coreTemp <= 14500,
        hint: 'Inyecta al menos 50 litros de criorefrigerante.',
      },
    ],
  },
  // ══════════════════════════════════════════════════════════════
  // NIVEL 2: LÓGICA BOOLEANA Y DECISIONES (LAB & SHIELDS)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'm2-logic-gate',
    locationId: 'versalles',
    sectorId: 'lab',
    imageKey: 'mision_puerta_logica',
    title: 'Reparación de Compuertas Lógicas y Tablas de Verdad',
    category: 'LOGICA_BOOLEANA',
    difficulty: 'BÁSICO',
    conceptTaught: 'Álgebra Booleana, Operadores AND/OR/NOT y Tablas de Verdad',
    summary: 'El procesador de navegación secundaria está fuera de línea por un cortocircuito en el Sector 12. Reemplaza la compuerta AND y valida su tabla de verdad.',
    briefing: `FALLO DE CÁLCULO BOOLEANO:
El bus de navegación secundaria no puede calcular trayectorias porque la compuerta AND del Sector 12 sufrió un colapso eléctrico.

FASE 1 [DIAGNÓSTICO]:
Lee el esquema de compuertas en el laboratorio:
  cat /sys/lab/gates.conf

FASE 2 [MODELADO]:
Una compuerta AND solo entrega '1' (TRUE) cuando AMBAS entradas son verdaderas simultáneamente:
  (0, 0) => 0
  (0, 1) => 0
  (1, 0) => 0
  (1, 1) => 1
Debes reemplazar el componente quemado especificando tipo "AND" y sector 12, probar su tabla unitaria y restablecer la navegación.

FASE 3 [EJECUCIÓN]:
Ejecuta las operaciones en secuencia desde Python o consola directa:
  reparar("PUERTA_LOGICA", "AND", 12)
  probar("PUERTA_LOGICA")
  activar("NAVEGACION_SECUNDARIA")`,
    objectives: [
      'Auditar /sys/lab/gates.conf para conocer el circuito dañado',
      'Sustituir la compuerta lógica AND en el sector 12 con reparar()',
      'Validar la tabla de verdad mediante probar("PUERTA_LOGICA")',
      'Reconectar la navegación secundaria',
    ],
    timeLimitSeconds: 140,
    initialCode: `# Reparación Lógica de Navegación - Python 3
# 1. Sustituir circuito quemado
reparar("PUERTA_LOGICA", "AND", 12)

# 2. Ejecutar banco de pruebas de tabla de verdad
probar("PUERTA_LOGICA")

# 3. Reactivar el bus de navegación secundaria
activar("NAVEGACION_SECUNDARIA")
`,
    solutionHint: 'Ejecuta en orden: reparar("PUERTA_LOGICA", "AND", 12) -> probar("PUERTA_LOGICA") -> activar("NAVEGACION_SECUNDARIA")',
    availableCommands: ['cd /sys/lab', 'cat gates.conf', 'python logic_repair.py', 'AYUDA()'],
    rewardXP: 180,
    testCases: [
      {
        description: 'Puerta AND reparada en sector 12',
        check: (state) => state.labState.andGateRepaired === true,
        hint: 'Ejecuta reparar("PUERTA_LOGICA", "AND", 12).',
      },
      {
        description: 'Prueba de tabla de verdad booleana exitosa',
        check: (state) => state.labState.logicTruthTableOk === true,
        hint: 'Ejecuta probar("PUERTA_LOGICA").',
      },
      {
        description: 'Navegación secundaria ONLINE',
        check: (state) => state.labState.secondaryNavOnline === true,
        hint: 'Ejecuta activar("NAVEGACION_SECUNDARIA").',
      },
    ],
  },
  // ══════════════════════════════════════════════════════════════
  // NIVEL 3: ARRAYS Y PROGRAMACIÓN EN JAVA (BRIDGE & DEFENSE)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'm3-thrusters',
    locationId: 'versalles',
    sectorId: 'bridge',
    imageKey: 'mision_propulsores_rcs',
    title: 'Calibración de Propulsores RCS y Balance Vectorial',
    category: 'BUCLES_Y_ARRAYS',
    difficulty: 'INTERMEDIO',
    conceptTaught: 'Bucles for en Java/Python, Arreglos y Empuje Simétrico',
    summary: 'La estación cae hacia la atmósfera a 1.4 km/h por empuje asimétrico. Calibra los 4 propulsores RCS al 95% usando un bucle en Java o Python.',
    briefing: `CRISIS DE PROPULSIÓN ORBITAL:
El rozamiento atmosférico está frenando la órbita de la estación. Los 4 propulsores de maniobra RCS tienen valores disparatados generando torsión descontrolada.

FASE 1 [DIAGNÓSTICO]:
Inspecciona el informe de telemetría de propulsión:
  cat /sys/propulsion/rcs.log

FASE 2 [MODELADO]:
Los 4 propulsores (T0, T1, T2, T3) deben estar exactamente al 95%. Si hay una sola tobera desfasada, el empuje asimétrico romperá la estabilidad giroscópica.
Esta misión fomenta el uso de **Java** con tipado fuerte y estructura de clases.

FASE 3 [EJECUCIÓN]:
Edita /sys/propulsion/thrusters.java o thrusters.py. Emplea un bucle para recorrer los 4 propulsores y fija la órbita con fijar_orbita_estable().`,
    objectives: [
      'Inspeccionar el desfase en /sys/propulsion/rcs.log',
      'Iterar sobre los 4 propulsores [0..3] asignando 95% de empuje',
      'Asegurar la órbita geoestacionaria (decaimiento = 0 km/h)',
    ],
    timeLimitSeconds: 130,
    initialCode: `// Calibración de Propulsores RCS en Java 21
public class CalibradorOrbital {
    public static void main(String[] args) {
        int totalPropulsores = 4;
        
        // Itera sobre los 4 propulsores [0, 1, 2, 3]:
        for (int i = 0; i < totalPropulsores; i++) {
            calibrar_propulsor_rcs(i, 95);
        }
        
        fijar_orbita_estable();
        System.out.println(">> Trayectoria orbital asegurada.");
    }
}
`,
    solutionHint: 'Itera sobre los 4 propulsores con for (int i=0; i<4; i++) calibrar_propulsor_rcs(i, 95) y ejecuta fijar_orbita_estable().',
    availableCommands: ['cd /sys/propulsion', 'cat rcs.log', 'javac thrusters.java', 'java CalibradorOrbital', 'python thrusters.py', 'AYUDA()'],
    rewardXP: 250,
    testCases: [
      {
        description: 'Los 4 propulsores calibrados al 95%',
        check: (state) => state.bridgeState.thrustersCalibrated.length === 4 && state.bridgeState.thrustersCalibrated.every(v => v >= 90),
        hint: 'Asegúrate de calibrar los 4 propulsores al 95%.',
      },
      {
        description: 'Trayectoria orbital geoestacionaria asegurada',
        check: (state) => state.bridgeState.trajectorySafe === true && state.bridgeState.orbitalDecayRate === 0,
        hint: 'Invoca fijar_orbita_estable() al concluir la calibración.',
      },
    ],
  },
  {
    id: 'm4-firewall',
    locationId: 'versalles',
    sectorId: 'shields',
    imageKey: 'mision_firewall_escudos',
    title: 'Guerra Electrónica: Purgar Malware Némesis',
    category: 'CIBER_DEFENSA',
    difficulty: 'INTERMEDIO',
    conceptTaught: 'Inspección de Tráfico de Red, Filtrado de Sockets y Limpieza de Búfer',
    summary: 'Una sonda hostil envía paquetes de desbordamiento de búfer por el puerto 8088. Analiza el tráfico en /sys/defense, levanta el firewall y purga la subred.',
    briefing: `INTRUSIÓN CIBERNÉTICA EN MATRIZ DE ESCUDOS:
La integridad de los escudos cayó al 55% debido a una inyección continua de paquetes hostiles.

FASE 1 [DIAGNÓSTICO]:
Inspecciona el log de red:
  cd /sys/defense
  cat network_traffic.log
  grep "MALW_" network_traffic.log

FASE 2 [MODELADO]:
Identifica el puerto comprometido (8088) y la regla necesaria ("BLOQUEAR_MALWARE").
Debes aplicar la regla al firewall perimetral, aislar el socket físico y vaciar la memoria RAM infectada.

FASE 3 [EJECUCIÓN]:
Ejecuta el script de defensa:
  aplicar_firewall("BLOQUEAR_MALWARE")
  aislar_puerto(8088)
  purgar_subred()`,
    objectives: [
      'Auditar /sys/defense/network_traffic.log para identificar el puerto vulnerable',
      'Activar la regla de firewall para aislar paquetes hostiles',
      'Desconectar el puerto comprometido (8088)',
      'Purgar la memoria troncal y restaurar los escudos al ≥90%',
    ],
    timeLimitSeconds: 110,
    initialCode: `# Ciberdefensa - Protocolo Némesis
# 1. Levanta el filtro perimetral
aplicar_firewall("BLOQUEAR_MALWARE")

# 2. Desconecta el socket comprometido
aislar_puerto(8088)

# 3. Purga la memoria troncal infectada
purgar_subred()
`,
    solutionHint: 'Ejecuta en /sys/defense: aplicar_firewall("BLOQUEAR_MALWARE"), aislar_puerto(8088) y purgar_subred().',
    availableCommands: ['cd /sys/defense', 'cat network_traffic.log', 'grep "MALW" network_traffic.log', 'python firewall_rules.py', 'AYUDA()'],
    rewardXP: 250,
    testCases: [
      {
        description: 'Reglas de cortafuegos activas contra malware',
        check: (state) => state.shieldState.firewallRulesActive === true,
        hint: 'Aplica la regla de cortafuegos.',
      },
      {
        description: 'Intrusión suprimida y búfer purgado',
        check: (state) => state.shieldState.intrusionSuppressed === true,
        hint: 'Aisla el puerto 8088 y purga la subred.',
      },
      {
        description: 'Escudos restaurados al 90% o más',
        check: (state) => state.vitals.shields >= 85,
        hint: 'Al purgar el malware, los escudos recuperan su potencia.',
      },
    ],
  },
  // ══════════════════════════════════════════════════════════════
  // NIVEL 4: ARQUITECTURA AVANZADA Y COLAS FIFO (DRONES & LAB)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'm5-quantum-logic',
    locationId: 'versalles',
    sectorId: 'lab',
    imageKey: 'mision_cuantica_lab',
    title: 'Desencriptación de Transpondedor Cuántico (XOR)',
    category: 'LOGICA_BOOLEANA',
    difficulty: 'AVANZADO',
    conceptTaught: 'Operadores Exclusivos (XOR), Disyunción Excluyente y Handshakes',
    summary: 'El enlace con la Tierra está cifrado con una compuerta XOR. Investiga /sys/lab/quantum_key.log y sincroniza las entradas booleanas asimétricas.',
    briefing: `MENSAJE CUÁNTICO CIFRADO:
El transpondedor de comunicaciones exige resolver una condición de máscara XOR:
Condición: (Canal_A ^ Canal_B) == TRUE.
En la lógica XOR, la salida solo es verdadera si una y solo una de las entradas es True. Si ambas son True o ambas son False, la señal se anula.

FASE 1 [DIAGNÓSTICO]:
Inspecciona el registro cuántico:
  cat /sys/lab/quantum_key.log

FASE 2 [MODELADO]:
Comprueba que actualmente Canal_A y Canal_B están ambos en True (error de colisión). Debes formular una configuración asimétrica (ej: A=True, B=False).

FASE 3 [EJECUCIÓN]:
Sincroniza la llave con configurar_cuantico() y confirma el handshake con sincronizar_enlace().`,
    objectives: [
      'Auditar /sys/lab/quantum_key.log para comprobar la máscara XOR',
      'Configurar las entradas asimétricas para satisfacer XOR(1, 0) == 1',
      'Sincronizar el enlace y restaurar telecomunicaciones al 100%',
    ],
    timeLimitSeconds: 100,
    initialCode: `# Handshake Cuántico XOR - Python 3
# Para que (A XOR B) sea verdadero, solo uno de los dos debe ser True:
canal_A = True
canal_B = False

configurar_cuantico({"canalA": canal_A, "canalB": canal_B})
sincronizar_enlace()
`,
    solutionHint: 'Configura las entradas para que no sean idénticas (A=True, B=False) y ejecuta sincronizar_enlace().',
    availableCommands: ['cd /sys/lab', 'cat quantum_key.log', 'python quantum_decoder.py', 'AYUDA()'],
    rewardXP: 300,
    testCases: [
      {
        description: 'Configuración cuántica satisface XOR',
        check: (state) => state.labState.logicTruthTableOk === true,
        hint: 'Canal A y Canal B deben ser distintos.',
      },
      {
        description: 'Telecomunicaciones restauradas al 100%',
        check: (state) => state.vitals.comms === 100,
        hint: 'Ejecuta sincronizar_enlace().',
      },
    ],
  },
  {
    id: 'm6-drone-queue',
    locationId: 'versalles',
    sectorId: 'drones',
    imageKey: 'mision_drones_carga',
    title: 'Logística de Emergencia: Reordenamiento de Colas FIFO',
    category: 'AUTOMATIZACION_DRONES',
    difficulty: 'AVANZADO',
    conceptTaught: 'Estructuras de Datos: Colas FIFO, Prioridades y Despacho Condicional',
    summary: 'Una fuga en ductos de ventilación amenaza a la tripulación. Inspecciona /sys/drones/queue.log y reprograma la cola para priorizar soporte vital.',
    briefing: `CRISIS DE LOGÍSTICA DE DRONES:
El hangar de drones está procesando tareas bajo una cola FIFO simple (primero en entrar, primero en salir). Mientras tareas cosméticas de baja prioridad se ejecutan, una fuga crítica de oxígeno en los sectores 1 y 4 no está siendo atendida.

FASE 1 [DIAGNÓSTICO]:
Lee el estado de la cola en el hangar:
  cat /sys/drones/queue.log

FASE 2 [MODELADO]:
Comprende la diferencia entre procesar en orden de llegada y aplicar una política de prioridad de emergencia ("PRIORIDAD_OXIGENO").

FASE 3 [EJECUCIÓN]:
Reprograma el despachador con despachar_drones("PRIORIDAD_OXIGENO") y enruta las válvulas selladoras con enrutar_valvulas([1, 4]).`,
    objectives: [
      'Auditar /sys/drones/queue.log y detectar la retención de soporte vital',
      'Reordenar la cola del hangar aplicando prioridad de emergencia',
      'Sellar las válvulas de fuga en los sectores 1 y 4',
      'Restablecer los niveles de oxígeno a ≥90%',
    ],
    timeLimitSeconds: 120,
    initialCode: `# Despacho de Drones - Prioridad FIFO vs Urgencia
# Reasigna la cola de despacho a soporte vital:
despachar_drones("PRIORIDAD_OXIGENO")

# Sella las válvulas de los sectores 1 y 4:
enrutar_valvulas([1, 4])
`,
    solutionHint: 'Ejecuta en /sys/drones: despachar_drones("PRIORIDAD_OXIGENO") y enrutar_valvulas([1, 4]).',
    availableCommands: ['cd /sys/drones', 'cat queue.log', 'python drone_dispatch.py', 'AYUDA()'],
    rewardXP: 300,
    testCases: [
      {
        description: 'Drones reorganizados por prioridad de emergencia',
        check: (state) => state.droneState.dronesSorted === true,
        hint: 'Aplica prioridad de oxígeno en el despacho.',
      },
      {
        description: 'Válvulas de sectores 1 y 4 selladas',
        check: (state) => state.droneState.oxygenPumpsRouted === true,
        hint: 'Enruta las válvulas [1, 4].',
      },
      {
        description: 'Oxígeno nominal restaurado al 95%',
        check: (state) => state.vitals.oxygen >= 90,
        hint: 'Comprueba los signos vitales de la estación.',
      },
    ],
  },
  {
    id: 'm7-omega-crisis',
    locationId: 'versalles',
    sectorId: 'reactor',
    imageKey: 'mision_crisis_omega',
    title: 'CÓDIGO ROJO: Crisis Multisistema en Tiempo Real',
    category: 'CRISIS_MULTISISTEMA',
    difficulty: 'CRÍTICO',
    conceptTaught: 'Triage de Sistemas, Concurrencia de Fallas y Programación Defensiva',
    summary: 'Colisión de restos satelitales causó fallas en cascada: reactor térmico, escudos y malware. Redacta un script de triage coordinado en 90 segundos.',
    briefing: `¡ALARMA GENERAL OMEGA!
Múltiples subsistemas han fallado simultáneamente:
1. El reactor se sobrecalienta hacia los 16,000°C.
2. Los escudos bajaron al 40% por un ataque de malware que consume energía residual.
3. El Capitán Juan Piña ha emitido la orden de emergencia de clase Alfa.

FASE 1 [DIAGNÓSTICO]:
Inspecciona /var/log/alarms.log para evaluar la cascada de fallas.

FASE 2 [MODELADO]:
Debes aplicar un script de triage que:
- Redirija el excedente de energía a los escudos (desviar_energia("ESCUDOS", 50))
- Ajuste el campo magnético del reactor al 95% y active el estabilizador
- Purgue la subred infectada para detener el drenaje de potencia
- Ejecute el diagnóstico global para certificar la supervivencia.

FASE 3 [EJECUCIÓN]:
Ejecuta la secuencia coordinada antes de que el temporizador llegue a cero.`,
    objectives: [
      'Redirigir 50% de energía excedente a los escudos',
      'Elevar el campo de contención del reactor a 95% con estabilizador',
      'Eliminar el malware activo con purgar_subred()',
      'Ejecutar diagnostico_global() antes del colapso de la nave',
    ],
    timeLimitSeconds: 90,
    initialCode: `# PROTOCOLO DE TRIAGE DE EMERGENCIA OMEGA
# 1. Reruta energía a la matriz defensiva
desviar_energia("ESCUDOS", 50)

# 2. Asegura el núcleo del reactor
ajustar("CAMPO_MAGNETICO", 95)
activar("SISTEMA_ESTABILIZADOR")

# 3. Elimina intrusiones de malware
purgar_subred()

# 4. Certifica los signos vitales
diagnostico_global()
`,
    solutionHint: 'Ejecuta en secuencia: desviar_energia("ESCUDOS", 50), ajustar("CAMPO_MAGNETICO", 95), activar("SISTEMA_ESTABILIZADOR"), purgar_subred() y diagnostico_global().',
    availableCommands: ['cat /var/log/alarms.log', 'python omega_triage.py', 'AYUDA()'],
    rewardXP: 500,
    testCases: [
      {
        description: 'Energía redirigida a escudos (≥75%)',
        check: (state) => state.vitals.shields >= 75,
        hint: 'Redirige energía a escudos.',
      },
      {
        description: 'Campo magnético del reactor en 95%',
        check: (state) => state.reactorState.magneticField >= 95,
        hint: 'Ajusta el campo a 95%.',
      },
      {
        description: 'Subred purgada de malware',
        check: (state) => state.shieldState.intrusionSuppressed === true,
        hint: 'Purga la subred.',
      },
      {
        description: 'Nivel de amenaza reducido a NOMINAL',
        check: (state) => state.vitals.activeThreatLevel === 'NOMINAL',
        hint: 'Ejecuta diagnostico_global().',
      },
    ],
  },
  // ══════════════════════════════════════════════════════════════
  // ACORAZADO ESTELAR HYPERION-9 (CINTURÓN DE ASTEROIDES)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'hyp-m1-ioncannon',
    locationId: 'hyperion',
    sectorId: 'bridge',
    imageKey: 'mision_canon_iones',
    title: 'Recalibración de Condensadores del Cañón de Iones',
    category: 'VARIABLES_Y_CALIBRACION',
    difficulty: 'INTERMEDIO',
    conceptTaught: 'Cálculo de Carga de Condensadores, Tensión y Diagnóstico Táctico',
    summary: 'Un enjambre de asteroides amenaza al Acorazado Hyperion-9. Inspecciona /sys/hyperion/cannon.telemetry, carga los condensadores al 95% y verifica el vector táctico.',
    briefing: `COMBATE EN EL CINTURÓN DE ASTEROIDES:
Los condensadores del cañón de iones pesado sufrieron una pérdida de carga dieléctrica tras una maniobra evasiva ante un bombardeo de rocas espaciales.

FASE 1 [DIAGNÓSTICO]:
Navega a la aviónica táctica de Hyperion:
  cd /sys/hyperion
  cat cannon.telemetry

FASE 2 [MODELADO]:
Los 4 bancos de condensadores magnéticos requieren una carga de al menos 92% para formar un rayo cohesivo de plasma. Si se cargan por debajo del 90%, el cañón sufrirá un arco inverso.

FASE 3 [EJECUCIÓN]:
Formula un script en Python o ejecuta en secuencia:
  cargar_canon_iones(95)
  diagnostico()`,
    objectives: [
      'Navegar a /sys/hyperion y auditar cannon.telemetry',
      'Calcular la potencia necesaria (≥92%) para energizar los condensadores de iones',
      'Cargar el cañón de iones mediante cargar_canon_iones(95)',
      'Ejecutar diagnostico() y certificar el estado NOMINAL del arma',
    ],
    timeLimitSeconds: 140,
    initialCode: `# Acorazado Hyperion-9 // Artillería de Iones
# FASE 1: Inspecciona /sys/hyperion/cannon.telemetry con 'cat'

potencia_nominal = 0  # TODO: Asigna la potencia requerida según telemetría (>= 90%)

# TODO: Transfiere energía al cañón llamando a:
# cargar_canon_iones(...)

# TODO: Audita los bancos con diagnóstico táctico:
# diagnostico()

print(">> Protocolo de cañón de iones finalizado.")
`,
    solutionHint: 'Navega con cd /sys/hyperion, lee cannon.telemetry con cat y ejecuta cargar_canon_iones(95) seguido de diagnostico().',
    availableCommands: ['cd /sys/hyperion', 'cat cannon.telemetry', 'python ion_cannon.py', 'AYUDA()'],
    rewardXP: 250,
    testCases: [
      {
        description: 'Bancos de condensadores cargados al 90% o superior',
        check: (state) => state.hyperionState?.ionCannonCharged === true,
        hint: 'Usa cargar_canon_iones(95).',
      },
      {
        description: 'Energía principal de reserva reactivada',
        check: (state) => state.vitals.energy >= 40,
        hint: 'La carga del cañón estabiliza el bus de combate.',
      },
      {
        description: 'Telemetría del sector puente validada',
        check: (state) => state.vitals.activeThreatLevel !== 'BRECHA_INMINENTE',
        hint: 'Asegura que el condensador esté en línea.',
      },
    ],
  },
  {
    id: 'hyp-m2-cortexfirewall',
    locationId: 'hyperion',
    sectorId: 'shields',
    imageKey: 'mision_cortex_firewall',
    title: 'Cortafuegos Militar CORTEX-9 y Encriptación de Flota',
    category: 'CIBER_DEFENSA',
    difficulty: 'INTERMEDIO',
    conceptTaught: 'Criptografía Militar, Protocolos de Autenticación y Aislamiento EMP',
    summary: 'Drones piratas emiten pulsos de interferencia electromagnética. Activa el protocolo de encriptación CORTEX-9, refuerza los escudos y purga la subred.',
    briefing: `GUERRA ELECTRÓNICA HOSTIL:
Una flotilla de sondas no identificadas está inyectando ruido y malware en el bus de escudos militares del Hyperion.

FASE 1 [DIAGNÓSTICO]:
Inspecciona el espectro de señal hostil en el sector de escudos defensivos.

FASE 2 [MODELADO]:
Para contrarrestar pulsos EMP dirigidos, se debe activar la llave militar de encriptación CORTEX-9 antes de purgar los búferes de memoria de la nave.

FASE 3 [EJECUCIÓN]:
Ejecuta la secuencia de contramedidas en Python o Java:
  activar_firewall_militar()
  purgar_subred()
  diagnostico()`,
    objectives: [
      'Inspeccionar la frecuencia hostil del pulso EMP',
      'Activar el protocolo de encriptación militar con activar_firewall_militar()',
      'Purgar los búferes de la subred para neutralizar la interferencia',
      'Elevar la integridad de los escudos militares por encima del 80%',
    ],
    timeLimitSeconds: 120,
    initialCode: `# Acorazado Hyperion-9 // Cortafuegos CORTEX-9
# TODO: Habilita el escudo electromagnético militar llamando a:
# activar_firewall_militar()

# TODO: Purga la memoria troncal de paquetes hostiles con:
# purgar_subred()

# TODO: Certifica los escudos llamando a:
# diagnostico()

print(">> Matriz CORTEX-9 procesada.")
`,
    solutionHint: 'Ejecuta en secuencia: activar_firewall_militar() seguido de purgar_subred().',
    availableCommands: ['activar_firewall_militar()', 'purgar_subred()', 'DIAGNOSTICO()', 'AYUDA()'],
    rewardXP: 260,
    testCases: [
      {
        description: 'Cortafuegos militar CORTEX-9 activo',
        check: (state) => state.hyperionState?.militaryFirewallActive === true,
        hint: 'Ejecuta activar_firewall_militar().',
      },
      {
        description: 'Escudos militares restaurados (≥80%)',
        check: (state) => state.vitals.shields >= 75,
        hint: 'Al purgar el malware militar, los escudos recuperan su potencia.',
      },
      {
        description: 'Infección electromagnética suprimida',
        check: (state) => state.shieldState.intrusionSuppressed === true,
        hint: 'Ejecuta purgar_subred().',
      },
    ],
  },
  {
    id: 'hyp-m3-fighterlaunch',
    locationId: 'hyperion',
    sectorId: 'drones',
    imageKey: 'mision_hangar_cazas',
    title: 'Secuenciador Electromagnético de Cazas Estelares',
    category: 'BUCLES_Y_ARRAYS',
    difficulty: 'AVANZADO',
    conceptTaught: 'Secuencias de Ignición, Presurización de Bahía y Despliegue de Escuadrones',
    summary: 'La bahía de cazas debe presurizar catapultas electromagnéticas y lanzar el escuadrón ALPHA para patrullar el perímetro del campo de asteroides.',
    briefing: `ORDEN DE COMBATE:
Los cazas de intercepción deben desplegarse inmediatamente para interceptar fragmentos de roca en curso de colisión con el Acorazado.

FASE 1 [DIAGNÓSTICO]:
Comprueba la presurización de las catapultas electromagnéticas en el hangar.

FASE 2 [MODELADO]:
Comprende la sintaxis de paso de parámetros tipo String en llamadas operativas de la nave ("ALPHA"). La secuencia debe presurizar las compuertas y disparar los anclajes magnéticos.

FASE 3 [EJECUCIÓN]:
Ejecuta:
  lanzar_cazas("ALPHA")
  diagnostico()`,
    objectives: [
      'Comprobar la telemetría del hangar de cazas',
      'Desplegar el escuadrón ALPHA mediante lanzar_cazas("ALPHA")',
      'Auditar la formación de vuelo en el radar perimetral',
      'Asegurar el perímetro del Acorazado Hyperion-9',
    ],
    timeLimitSeconds: 130,
    initialCode: `# Hangar de Cazas - Acorazado Hyperion-9
# TODO: Declara el nombre del escuadrón ("ALPHA" o "VANGUARD-ALPHA"):
escuadron_objetivo = ""

# TODO: Dispara la orden de eyección electromagnética con:
# lanzar_cazas(escuadron_objetivo)

# TODO: Audita el perímetro con diagnostico()

print(">> Orden de despliegue procesada.")
`,
    solutionHint: 'Usa lanzar_cazas("ALPHA") y ejecuta diagnostico().',
    availableCommands: ['lanzar_cazas("ALPHA")', 'DIAGNOSTICO()', 'AYUDA()'],
    rewardXP: 300,
    testCases: [
      {
        description: 'Escuadrón de cazas ALPHA en vuelo',
        check: (state) => state.hyperionState?.fightersLaunched === true,
        hint: 'Usa lanzar_cazas("ALPHA").',
      },
      {
        description: 'Catapultas electromagnéticas liberadas',
        check: (state) => state.droneState.dronesSorted === true || state.hyperionState?.fightersLaunched === true,
        hint: 'El lanzamiento despeja las bahías.',
      },
      {
        description: 'Alerta del sector drones en estado NOMINAL',
        check: (state) => state.vitals.activeThreatLevel !== 'CRÍTICO',
        hint: 'Despliega los cazas para neutralizar la amenaza.',
      },
    ],
  },
  // ══════════════════════════════════════════════════════════════
  // PUESTO MINERO TITÁN-IV (LUNAS DE SATURNO)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tit-m1-methanepumps',
    locationId: 'titan',
    sectorId: 'drones',
    imageKey: 'mision_refineria_metano',
    title: 'Compensación de Bombas Criogénicas de Metano',
    category: 'VARIABLES_Y_CALIBRACION',
    difficulty: 'BÁSICO',
    conceptTaught: 'Hidráulica Sub-Cero (-180°C) y Activación de Válvulas Térmicas',
    summary: 'Las tuberías de succión de metano líquido en el Kraken Mare están congeladas a -180°C. Inspecciona la telemetría y activa las bombas térmicas.',
    briefing: `REFINERÍA KRAKEN MARE // TITÁN-IV:
A -180°C, los hidrocarburos pesados han formado cristales de hielo de metano en los ductos de extracción submarinos.

FASE 1 [DIAGNÓSTICO]:
Inspecciona la presión barométrica en /sys/titan/cryo_drill.log.

FASE 2 [MODELADO]:
Las bombas primarias deben recibir la orden de ignición térmica para licuar el tapón de hielo y bombear a un caudal nominal de 1.200 L/min.

FASE 3 [EJECUCIÓN]:
Formula el arranque criogénico:
  activar_bombas_metano()
  diagnostico()`,
    objectives: [
      'Verificar telemetría criogénica en la refinería de Titán',
      'Activar las bombas térmicas con activar_bombas_metano()',
      'Restaurar el caudal de hidrocarburos a los tanques de combustible',
      'Recuperar las reservas energéticas de la colonia',
    ],
    timeLimitSeconds: 140,
    initialCode: `# Refinería Titán-IV // Kraken Mare
# FASE 1: Inspecciona la telemetría criogénica (-180°C)

# TODO: Activa las bombas térmicas submarinas con:
# activar_bombas_metano()

# TODO: Verifica el caudal de combustible llamando a:
# diagnostico()

print(">> Protocolo de bombas de metano enviado.")
`,
    solutionHint: 'Ejecuta activar_bombas_metano() y luego diagnostico().',
    availableCommands: ['activar_bombas_metano()', 'DIAGNOSTICO()', 'AYUDA()'],
    rewardXP: 220,
    testCases: [
      {
        description: 'Bombas criogénicas de metano operativas',
        check: (state) => state.titanState?.methanePumpsActive === true,
        hint: 'Ejecuta activar_bombas_metano().',
      },
      {
        description: 'Caudal de combustible restaurado (Energía ≥35%)',
        check: (state) => state.vitals.energy >= 35,
        hint: 'Las bombas reactivan el suministro de energía.',
      },
      {
        description: 'Telemetría de la refinería en estado NOMINAL',
        check: (state) => state.titanState?.methanePumpsActive === true,
        hint: 'Confirma con diagnostico().',
      },
    ],
  },
  {
    id: 'tit-m2-miningdrill',
    locationId: 'titan',
    sectorId: 'reactor',
    imageKey: 'mision_taladro_subterraneo',
    title: 'Perforación de Núcleo Geotérmico en Hielo',
    category: 'BUCLES_Y_ARRAYS',
    difficulty: 'INTERMEDIO',
    conceptTaught: 'Control de Profundidad, Torsión de Broca y Umbrales de Presión',
    summary: 'El taladro térmico debe alcanzar los 150 metros bajo la corteza de hielo. Audita /sys/titan/cryo_drill.log e inicia la perforación profunda a 180m.',
    briefing: `OPERACIONES MINERAS SUBTERRÁNEAS:
El taladro térmico principal está detenido en la superficie de hielo de Titán (profundidad 0m).

FASE 1 [DIAGNÓSTICO]:
Consulta /sys/titan/cryo_drill.log para comprobar la profundidad requerida.

FASE 2 [MODELADO]:
Se requiere una penetración de al menos 150 metros para atravesar la corteza de metano congelado y alcanzar la bolsa de gas geotérmico. Una profundidad de 180m asegura el suministro durante tormentas polares.

FASE 3 [EJECUCIÓN]:
Ejecuta iniciar_taladro(180) para activar el cabezal de diamante térmico.`,
    objectives: [
      'Auditar /sys/titan/cryo_drill.log en la consola',
      'Calcular la profundidad mínima de penetración (≥150m)',
      'Iniciar la perforación profunda con iniciar_taladro(180)',
      'Conectar el pozo de extracción al reactor de la base',
    ],
    timeLimitSeconds: 150,
    initialCode: `# Perforación Minera - Puesto Titán-IV
# FASE 1: Consulta /sys/titan/cryo_drill.log

profundidad_objetivo = 0  # TODO: Asigna la profundidad segura requerida (>= 150m)

# TODO: Inicia la perforación con:
# iniciar_taladro(profundidad_objetivo)

# TODO: Audita el acople térmico con diagnostico()

print(">> Maniobra de perforación de Titán en curso.")
`,
    solutionHint: 'Ejecuta iniciar_taladro(180) con un valor numérico mayor o igual a 150.',
    availableCommands: ['cd /sys/titan', 'cat cryo_drill.log', 'iniciar_taladro(metros)', 'DIAGNOSTICO()'],
    rewardXP: 260,
    testCases: [
      {
        description: 'Taladro a profundidad ≥ 150 metros',
        check: (state) => (state.titanState?.cryoDrillDepth || 0) >= 150,
        hint: 'Ejecuta iniciar_taladro(180).',
      },
      {
        description: 'Núcleo térmico acoplado al reactor',
        check: (state) => (state.titanState?.cryoDrillDepth || 0) >= 150,
        hint: 'La perforación suministra calor a la colonia.',
      },
      {
        description: 'Estabilidad de la corteza de hielo garantizada',
        check: (state) => state.vitals.hullIntegrity >= 85,
        hint: 'Verifica la integridad del complejo minero.',
      },
    ],
  },
  {
    id: 'tit-m3-subzero',
    locationId: 'titan',
    sectorId: 'lab',
    imageKey: 'mision_calefaccion_termica',
    title: 'Estabilización de Red Térmica Sub-Cero',
    category: 'LOGICA_BOOLEANA',
    difficulty: 'INTERMEDIO',
    conceptTaught: 'Termorregulación, Circuitos Radiantes y Compensación Criogénica',
    summary: 'La temperatura interna del laboratorio de Titán cayó a -60°C. Enciende la red térmica geotérmica antes del congelamiento del instrumental científico.',
    briefing: `ALERTA DE HIPOTERMIA EXTREMA:
El viento polar de hidrocarburos a -180°C está filtrando frío extremo por las juntas del laboratorio.

FASE 1 [DIAGNÓSTICO]:
Verifica los sensores térmicos en el módulo de ciencias de Titán.

FASE 2 [MODELADO]:
Los radiadores geotérmicos necesitan encenderse para contrarrestar la fuga térmica exterior y llevar el ambiente a +21°C nominales.

FASE 3 [EJECUCIÓN]:
Ejecuta:
  activar_red_termica()
  diagnostico()`,
    objectives: [
      'Auditar los sensores de temperatura en el laboratorio',
      'Activar la calefacción radiante con activar_red_termica()',
      'Estabilizar la temperatura a +21°C nominales',
      'Evitar el colapso térmico de las muestras criogénicas',
    ],
    timeLimitSeconds: 120,
    initialCode: `# Calefacción de Módulos - Titán-IV
# TODO: Enciende la red de radiadores geotérmicos:
# activar_red_termica()

# TODO: Audita la temperatura interna con diagnostico()

print(">> Red térmica sub-cero activada.")
`,
    solutionHint: 'Ejecuta activar_red_termica() seguido de diagnostico().',
    availableCommands: ['activar_red_termica()', 'DIAGNOSTICO()', 'AYUDA()'],
    rewardXP: 240,
    testCases: [
      {
        description: 'Red térmica radiante encendida',
        check: (state) => state.titanState?.thermalHeatingOnline === true,
        hint: 'Usa activar_red_termica().',
      },
      {
        description: 'Instrumental científico protegido contra congelamiento',
        check: (state) => state.titanState?.thermalHeatingOnline === true,
        hint: 'La temperatura sube a +21°C.',
      },
      {
        description: 'Soporte vital del laboratorio en estado NOMINAL',
        check: (state) => state.vitals.oxygen >= 80,
        hint: 'Verifica los signos vitales del laboratorio.',
      },
    ],
  },
  // ══════════════════════════════════════════════════════════════
  // LABORATORIO SOLAR HELIOS-PRIME (CORONA SOLAR)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'hel-m1-solarshield',
    locationId: 'helios',
    sectorId: 'shields',
    imageKey: 'mision_escudo_termico_solar',
    title: 'Deflexión Cuántica del Escudo Térmico Solar',
    category: 'VARIABLES_Y_CALIBRACION',
    difficulty: 'INTERMEDIO',
    conceptTaught: 'Disipación Fotónica, Ángulos de Deflexión y Nanomateriales',
    summary: 'Una eyección de masa coronal golpeará Helios-Prime en 100 segundos. Consulta /sys/helios/solar_shield.log y eleva el escudo cuántico a ≥90%.',
    briefing: `ALERTA SOLAR DE CLASE X:
Una fulguración coronal avanza a 2.000 km/s hacia la estación en órbita solar cerrada (0.15 UA). La deflexión actual es de apenas 40%.

FASE 1 [DIAGNÓSTICO]:
Inspecciona el estado del escudo en /sys/helios/solar_shield.log.

FASE 2 [MODELADO]:
Para reflejar la onda de radiación ionizante sin derretir la superestructura de grafeno, la deflexión debe ajustarse a un mínimo de 90% (recomendado 95%).

FASE 3 [EJECUCIÓN]:
Ejecuta:
  ajustar_escudo_solar(95)
  diagnostico()`,
    objectives: [
      'Auditar /sys/helios/solar_shield.log para medir la radiación',
      'Calcular el porcentaje de deflexión cuántica necesario (≥90%)',
      'Ajustar el escudo térmico con ajustar_escudo_solar(95)',
      'Verificar la reflectividad en la matriz defensiva',
    ],
    timeLimitSeconds: 100,
    initialCode: `# Escudo Térmico Cuántico - Helios-Prime
# FASE 1: Consulta /sys/helios/solar_shield.log

deflexion_requerida = 0  # TODO: Asigna la deflexión requerida (>= 85%)

# TODO: Modula el escudo cuántico con:
# ajustar_escudo_solar(deflexion_requerida)

# TODO: Audita los niveles térmicos con diagnostico()

print(">> Matriz de deflexión solar configurada.")
`,
    solutionHint: 'Navega a /sys/helios, lee solar_shield.log y ejecuta ajustar_escudo_solar(95).',
    availableCommands: ['cd /sys/helios', 'cat solar_shield.log', 'ajustar_escudo_solar(valor)', 'DIAGNOSTICO()'],
    rewardXP: 280,
    testCases: [
      {
        description: 'Escudo térmico ajustado a ≥85% de deflexión',
        check: (state) => (state.heliosState?.solarShieldDeflection || 0) >= 85,
        hint: 'Usa ajustar_escudo_solar(95).',
      },
      {
        description: 'Escudos de plasma reforzados (≥85%)',
        check: (state) => state.vitals.shields >= 80,
        hint: 'La deflexión protege la matriz de escudos.',
      },
      {
        description: 'Disipación fotónica activa contra tormenta solar',
        check: (state) => (state.heliosState?.solarShieldDeflection || 0) >= 85,
        hint: 'El escudo refleja la radiación ionizante.',
      },
    ],
  },
  {
    id: 'hel-m2-coronaharvest',
    locationId: 'helios',
    sectorId: 'reactor',
    imageKey: 'mision_colector_corona_solar',
    title: 'Recolección de Plasma en la Corona Solar',
    category: 'AUTOMATIZACION_DRONES',
    difficulty: 'AVANZADO',
    conceptTaught: 'Captura Iónica, Toberas Magnéticas de Ingesta y Recarga Extrema',
    summary: 'Aprovecha la proximidad del Sol para recargar los acumuladores de la flota canalizando iones de helio de la corona solar.',
    briefing: `PROYECTO PROMETEO // HELIOS-PRIME:
Helios-Prime puede recargar las baterías de toda la flota capturando iones de helio energéticos de la corona solar.

FASE 1 [DIAGNÓSTICO]:
Verifica los acumuladores fotovoltaicos con diagnostico().

FASE 2 [MODELADO]:
Se debe sincronizar el campo electromagnético de las toberas de absorción para canalizar el plasma solar hacia las baterías sin provocar sobrevoltaje.

FASE 3 [EJECUCIÓN]:
Ejecuta:
  activar_colector_corona()
  diagnostico()`,
    objectives: [
      'Auditar los acumuladores de reserva en el reactor solar',
      'Sincronizar las toberas magnéticas de absorción coronal',
      'Activar el colector de plasma con activar_colector_corona()',
      'Llenar las reservas de energía de la estación al 100%',
    ],
    timeLimitSeconds: 130,
    initialCode: `# Colector de Plasma Solar - Helios-Prime
# TODO: Abre las toberas magnéticas de absorción coronal:
# activar_colector_corona()

# TODO: Audita el flujo de recarga energética con:
# diagnostico()

print(">> Absorción de plasma coronal iniciada.")
`,
    solutionHint: 'Ejecuta activar_colector_corona() y luego diagnostico().',
    availableCommands: ['activar_colector_corona()', 'DIAGNOSTICO()', 'AYUDA()'],
    rewardXP: 320,
    testCases: [
      {
        description: 'Colector de plasma de la corona solar activado',
        check: (state) => state.heliosState?.coronaCollectorOnline === true,
        hint: 'Usa activar_colector_corona().',
      },
      {
        description: 'Reservas de energía restauradas al 100%',
        check: (state) => state.vitals.energy >= 95,
        hint: 'La recolección llena los acumuladores al máximo.',
      },
      {
        description: 'Flujo de iones canalizado al bus de potencia',
        check: (state) => state.heliosState?.coronaCollectorOnline === true,
        hint: 'Verifica la telemetría del reactor.',
      },
    ],
  },
  {
    id: 'hel-m3-neutrinomatrix',
    locationId: 'helios',
    sectorId: 'lab',
    imageKey: 'mision_matriz_neutrinos',
    title: 'Sincronización de la Matriz de Neutrinos',
    category: 'LOGICA_BOOLEANA',
    difficulty: 'AVANZADO',
    conceptTaught: 'Física de Partículas, Resonancia Cuántica y Transmisión de Datos',
    summary: 'El telescopio cuántico de neutrinos está desalineado por la gravedad solar. Sincroniza los resonadores cuánticos para transmitir a la Tierra.',
    briefing: `OBSERVACIÓN CUÁNTICA DE ESPACIO PROFUNDO:
El telescopio de neutrinos de Helios-Prime detecta fluctuaciones cuánticas del núcleo solar. Para transmitir los datos a la Tierra sin pérdida de paquetes, los resonadores deben sincronizarse para compensar la masa del Sol.

FASE 1 [DIAGNÓSTICO]:
Verifica el transpondedor de neutrinos en el laboratorio cuántico.

FASE 2 [MODELADO]:
Alinear la matriz de detección requiere calibrar el desfase gravitacional mediante resonancia cuántica.

FASE 3 [EJECUCIÓN]:
Ejecuta:
  alinear_neutrinos()
  diagnostico()`,
    objectives: [
      'Auditar el transpondedor cuántico de neutrinos',
      'Analizar el flujo de partículas subatómicas del núcleo solar',
      'Alinear la matriz de resonancia con alinear_neutrinos()',
      'Transmitir el paquete de datos cuánticos a la Tierra (Comms 100%)',
    ],
    timeLimitSeconds: 110,
    initialCode: `# Telescopio de Neutrinos - Helios-Prime
# TODO: Sincroniza los resonadores con el núcleo solar llamando a:
# alinear_neutrinos()

# TODO: Valida la transmisión interplanetaria con:
# diagnostico()

print(">> Enlace de neutrinos cuánticos alineado.")
`,
    solutionHint: 'Ejecuta alinear_neutrinos() seguido de diagnostico().',
    availableCommands: ['alinear_neutrinos()', 'DIAGNOSTICO()', 'AYUDA()'],
    rewardXP: 300,
    testCases: [
      {
        description: 'Matriz de neutrinos alineada y transmitiendo',
        check: (state) => state.heliosState?.quantumNeutrinoAligned === true,
        hint: 'Ejecuta alinear_neutrinos().',
      },
      {
        description: 'Enlace de telecomunicaciones con la Tierra al 100%',
        check: (state) => state.vitals.comms === 100,
        hint: 'La alineación restaura el transpondedor de espacio profundo.',
      },
      {
        description: 'Flujo de paquetes cuánticos sin interferencias',
        check: (state) => state.heliosState?.quantumNeutrinoAligned === true,
        hint: 'Confirma con diagnostico().',
      },
    ],
  },
];
