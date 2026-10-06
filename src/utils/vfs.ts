export interface VFSFile {
  type: 'file';
  name: string;
  content: string;
  size: number;
  updatedAt: string;
}

export interface VFSDirectory {
  type: 'dir';
  name: string;
  children: Record<string, VFSNode>;
}

export type VFSNode = VFSFile | VFSDirectory;

export function createInitialVFS(): VFSDirectory {
  return {
    type: 'dir',
    name: '/',
    children: {
      sys: {
        type: 'dir',
        name: 'sys',
        children: {
          power: {
            type: 'dir',
            name: 'power',
            children: {
              'solar_status.log': {
                type: 'file',
                name: 'solar_status.log',
                size: 420,
                updatedAt: '2026-10-05 08:30:12',
                content: `[ALERTA DE ALINEACIÓN SOLAR - SECTOR EXTERIOR]
ESTADO: CRÍTICO - EFICIENCIA COLECTORES: 24%
ÁNGULO SOLAR ÓPTIMO DETECTADO: 47.5°

TELEMETRÍA DE MOTORES DE ROTACIÓN:
Panel #0: Ángulo actual = 12.0° [DESALINEADO]
Panel #1: Ángulo actual = 15.3° [DESALINEADO]
Panel #2: Ángulo actual = 08.4° [DESALINEADO]
Panel #3: Ángulo actual = 22.1° [DESALINEADO]
Panel #4: Ángulo actual = 10.0° [DESALINEADO]
Panel #5: Ángulo actual = 18.7° [DESALINEADO]
Panel #6: Ángulo actual = 05.2° [DESALINEADO]
Panel #7: Ángulo actual = 14.9° [DESALINEADO]

ACCIÓN REQUERIDA:
Ejecutar calibrate_solar.py para iterar sobre los 8 paneles y ajustar sus ángulos a 47.5°.`
              },
              'calibrate_solar.py': {
                type: 'file',
                name: 'calibrate_solar.py',
                size: 380,
                updatedAt: '2026-10-05 08:31:00',
                content: `# Calibración de Colectores Solares Exteriores
# Estación Versalles - Avionics v3.4
# FASE 1 [DIAGNÓSTICO]: Consulta el ángulo óptimo en /sys/power/solar_status.log con 'cat'
# FASE 2 [MODELADO]: Itera sobre los 8 servomotores (0 a 7) y reoriéntalos

ANGULO_OPTIMO = 0.0  # TODO: Reemplaza 0.0 con el ángulo de captación hallado en el log (ej. 47.5)
TOTAL_PANELES = 8

# TODO: Escribe el bucle for que itere sobre range(TOTAL_PANELES)
# y oriente cada panel llamando a: ajustar_panel_solar(i, ANGULO_OPTIMO)
#
# for i in range(...):
#     ajustar_panel_solar(...)

print(">> Protocolo de alineación solar finalizado.")
`
              },
              'calibrate_solar.java': {
                type: 'file',
                name: 'calibrate_solar.java',
                size: 520,
                updatedAt: '2026-10-05 08:31:00',
                content: `// Módulo de Calibración Solar en Java 21
public class CalibradorSolar {
    public static void main(String[] args) {
        // TODO: Asigna el ángulo hallado en la telemetría (ej. 47.5)
        double anguloOptimo = 0.0;
        int totalPaneles = 8;
        
        // TODO: Escribe un bucle for (int i = 0; i < totalPaneles; i++)
        // y ejecuta ajustar_panel_solar(i, anguloOptimo);
        
        System.out.println(">> Ejecución finalizada.");
    }
}
`
              },
              'power_grid.conf': {
                type: 'file',
                name: 'power_grid.conf',
                size: 180,
                updatedAt: '2026-10-05 07:00:00',
                content: `GRID_MODE=STANDBY
BATTERY_CAPACITY_KWH=120000
EMERGENCY_RESERVE_PCT=25
DRAIN_RATE_STANDARD=0.08
`
              }
            }
          },
          life_support: {
            type: 'dir',
            name: 'life_support',
            children: {
              'filter_status.log': {
                type: 'file',
                name: 'filter_status.log',
                size: 340,
                updatedAt: '2026-10-05 09:12:00',
                content: `[REPORTE DE SOPORTE VITAL - FILTROS DE CARBONO]
SATURACIÓN DE CO2: 94.2% [ALERTA DE ASFIXIA]
NIVEL DE O2 TRIPULACIÓN: CAYENDO
ESTADO DE PURGADORES: BLOQUEADOS POR TOXINAS

CARTUCHOS DETECTADOS:
- F_ALPHA : Saturación 98%
- F_BETA  : Saturación 95%
- F_GAMMA : Saturación 92%
- F_DELTA : Saturación 91%

ACCIÓN REQUERIDA:
Ejecutar purga cíclica en carbon_filters.py para drenar el CO2 residual y elevar el oxígeno por encima del 90%.`
              },
              'carbon_filters.py': {
                type: 'file',
                name: 'carbon_filters.py',
                size: 400,
                updatedAt: '2026-10-05 09:15:00',
                content: `# Sistema de Regeneración Atmosférica - Python 3
# FASE 1 [DIAGNÓSTICO]: Inspecciona /sys/life_support/filter_status.log con 'cat'

# TODO: Declara la lista con los 4 cartuchos saturados ("F_ALPHA", "F_BETA", ...)
filtros = []

# TODO: Itera sobre cada cartucho y purga sus toxinas con purgar_filtro_carbono(f)
# for f in filtros:
#     purgar_filtro_carbono(...)

# TODO: Reactiva las válvulas maestras de O2 llamando a:
# activar_recirculacion_o2()

print(">> Protocolo de purga atmosférica finalizado.")
`
              },
              'carbon_filters.java': {
                type: 'file',
                name: 'carbon_filters.java',
                size: 480,
                updatedAt: '2026-10-05 09:15:00',
                content: `public class SoporteVital {
    public static void main(String[] args) {
        // TODO: Declara el arreglo de cartuchos saturados:
        String[] filtros = {"F_ALPHA", "F_BETA", "F_GAMMA", "F_DELTA"};
        
        // TODO: Itera sobre el arreglo y llama a purgar_filtro_carbono(f):
        
        // TODO: Llama a activar_recirculacion_o2();
        System.out.println(">> Soporte vital procesado vía Java.");
    }
}
`
              }
            }
          },
          reactor: {
            type: 'dir',
            name: 'reactor',
            children: {
              'core.telemetry': {
                type: 'file',
                name: 'core.telemetry',
                size: 380,
                updatedAt: '2026-10-05 08:00:00',
                content: `[TELEMETRÍA NÚCLEO DE FUSIÓN DE PLASMA]
TEMPERATURA ACTUAL: 15,432°C (LÍMITE CRÍTICO: 16,000°C)
CAMPO MAGNÉTICO: 83% (UMBRAL MÍNIMO DE CONTENCIÓN: 88%)
OSCILACIÓN DE PLASMA: ±12.0% (MÁXIMO PERMITIDO: ±5.0%)
ESTABILIZADOR PRIMARIO: APAGADO [OFFLINE]

FÓRMULA TERMODINÁMICA:
Inyectar 1 litro de refrigerante criogénico reduce 45°C.
Para llevar el núcleo de 15,400°C a 13,000°C nominales se requieren aprox 53 litros.`
              },
              'confinement.py': {
                type: 'file',
                name: 'confinement.py',
                size: 420,
                updatedAt: '2026-10-05 08:05:00',
                content: `# Calibración del Reactor de Fusión - Control Térmico
# FASE 1 [DIAGNÓSTICO]: Consulta /sys/reactor/core.telemetry

# TODO: Fija el campo magnético en el rango seguro (88% a 94%)
# ajustar("CAMPO_MAGNETICO", ...)

# TODO: Enciende el estabilizador de plasma
# activar("SISTEMA_ESTABILIZADOR")

# TODO: Inyecta los litros de helio criogénico calculados (aprox 53-55L)
# inyectar_crio(...)

print(">> Parámetros de contención toroidal enviados al núcleo.")
`
              }
            }
          },
          lab: {
            type: 'dir',
            name: 'lab',
            children: {
              'gates.conf': {
                type: 'file',
                name: 'gates.conf',
                size: 310,
                updatedAt: '2026-10-05 07:45:00',
                content: `[MATRIZ LÓGICA DE NAVEGACIÓN SECUNDARIA]
SECTOR: 12
COMPONENTE COMPROMETIDO: PUERTA_LOGICA
TIPO REQUERIDO: "AND"
ESTADO: CIRCUITO QUEMADO POR PICOS DE VOLTAJE

TABLA DE VERDAD OBJETIVO AND:
(0, 0) => 0
(0, 1) => 0
(1, 0) => 0
(1, 1) => 1`
              },
              'quantum_key.log': {
                type: 'file',
                name: 'quantum_key.log',
                size: 300,
                updatedAt: '2026-10-05 09:30:00',
                content: `[REGISTRO TRANSPONDEDOR CUÁNTICO]
MÁSCARA DETECTADA: COMPUERTA XOR
CONDICIÓN DE DESENCRIPTACIÓN: (A != B) == True
CANAL A ACTUAL: True
CANAL B ACTUAL: True (ERROR: Entradas idénticas anulan la señal)`
              },
              'logic_repair.py': {
                type: 'file',
                name: 'logic_repair.py',
                size: 260,
                updatedAt: '2026-10-05 07:50:00',
                content: `# Reparación y validación de compuertas lógicas
reparar("PUERTA_LOGICA", "AND", 12)
probar("PUERTA_LOGICA")
activar("NAVEGACION_SECUNDARIA")
print(">> Procesador booleano reparado.")
`
              }
            }
          },
          propulsion: {
            type: 'dir',
            name: 'propulsion',
            children: {
              'rcs.log': {
                type: 'file',
                name: 'rcs.log',
                size: 350,
                updatedAt: '2026-10-05 06:10:00',
                content: `[AVIONICS - PROPULSORES DE MANIOBRA RCS]
DECAIMIENTO ORBITAL: -1.4 km/h (PELIGRO DE REENTRADA TÉRMICA)
EMPUJE ACTUAL POR TOBERA:
T0 = 60%  |  T1 = 45%  |  T2 = 80%  |  T3 = 50%
DIAGNÓSTICO: Vector de empuje asimétrico generando momento angular descontrolado.
OBJETIVO: Igualar las 4 toberas al 95% y asegurar órbita.`
              },
              'thrusters.py': {
                type: 'file',
                name: 'thrusters.py',
                size: 380,
                updatedAt: '2026-10-05 06:12:00',
                content: `# Calibración de Propulsores de Maniobra RCS en Python
# FASE 1 [DIAGNÓSTICO]: Inspecciona /sys/propulsion/rcs.log con 'cat'

TOTAL_PROPULSORES = 4

# TODO: Itera sobre las 4 toberas (índices 0 al 3) y calibra cada una al 95%:
# for id in range(...):
#     calibrar_propulsor_rcs(id, 95)

# TODO: Fija el vector orbital llamando a:
# fijar_orbita_estable()

print(">> Calibración de propulsores RCS finalizada.")
`
              },
              'thrusters.java': {
                type: 'file',
                name: 'thrusters.java',
                size: 480,
                updatedAt: '2026-10-05 06:12:00',
                content: `public class EstabilizadorRCS {
    public static void main(String[] args) {
        int totalToberas = 4;
        
        // TODO: Itera sobre las 4 toberas con for (int i = 0; i < totalToberas; i++)
        // y calibra cada una con calibrar_propulsor_rcs(i, 95);
        
        // TODO: Fija la órbita llamando a:
        // fijar_orbita_estable();
        
        System.out.println(">> Empuje simétrico aplicado vía Java.");
    }
}
`
              }
            }
          },
          defense: {
            type: 'dir',
            name: 'defense',
            children: {
              'network_traffic.log': {
                type: 'file',
                name: 'network_traffic.log',
                size: 390,
                updatedAt: '2026-10-05 09:40:00',
                content: `[MONITOR DE TRÁFICO DE ESCUDOS - RED LOCAL]
PUERTO AFECTADO: 8088 [ESTADO: ESCUCHA ABIERTA]
PAQUETES IDENTIFICADOS:
[1] SYS_TELEMETRY_OK (Válido)
[2] MALW_BUFFER_OVERFLOW_0x99 (Hostil)
[3] COM_CARRIER_SYNC (Válido)
[4] MALW_TROJAN_DROPPER (Hostil)

ACCIONES:
1. Activar regla "BLOQUEAR_MALWARE"
2. Desconectar físicamente el puerto 8088
3. Purgar subred troncal`
              },
              'firewall_rules.py': {
                type: 'file',
                name: 'firewall_rules.py',
                size: 340,
                updatedAt: '2026-10-05 05:40:00',
                content: `# Escudo Electrónico - Purga de Malware
# FASE 1: Inspecciona /sys/defense/network_traffic.log

# TODO: Aplica la regla contra el tráfico hostil detectado:
# aplicar_firewall("BLOQUEAR_MALWARE")

# TODO: Aísla el puerto vulnerable detectado en el log (puerto 8088):
# aislar_puerto(8088)

# TODO: Purga los búferes de memoria infectados:
# purgar_subred()

print(">> Matriz de defensa ejecutada.")
`
              }
            }
          },
          drones: {
            type: 'dir',
            name: 'drones',
            children: {
              'queue.log': {
                type: 'file',
                name: 'queue.log',
                size: 350,
                updatedAt: '2026-10-05 09:50:00',
                content: `[COLA DE DESPACHO DEL HANGAR DE DRONES]
ESTADO: COLA FIFO TRADICIONAL
TAREA 1: PULIDO_EXTERIOR (Baja prioridad)
TAREA 2: PINTURA_ANTIRADIACION (Baja prioridad)
TAREA 3: REPARAR_FUGA_OXIGENO (CRÍTICA - SECTOR 1 Y 4)

ANOMALÍA: Las tareas críticas de soporte vital están retenidas detrás de tareas estéticas.`
              },
              'drone_dispatch.py': {
                type: 'file',
                name: 'drone_dispatch.py',
                size: 360,
                updatedAt: '2026-10-05 09:52:00',
                content: `# Reprogramación de la Cola de Drones
# FASE 1: Inspecciona /sys/drones/queue.log con 'cat'

# TODO: Reordena la cola de despacho dando prioridad al oxígeno:
# despachar_drones("PRIORIDAD_OXIGENO")

# TODO: Enruta las válvulas críticas de los sectores 1 y 4:
# enrutar_valvulas([1, 4])

print(">> Cola de drones actualizada.")
`
              }
            }
          },
          hyperion: {
            type: 'dir',
            name: 'hyperion',
            children: {
              'cannon.telemetry': {
                type: 'file',
                name: 'cannon.telemetry',
                size: 320,
                updatedAt: '2026-10-05 10:00:00',
                content: `[HYPERION-9 // CAÑÓN DE IONES PESADOS]
CONDENSADORES DE FLUJO: DESCARGADOS (ACTUAL: 15% | REQUERIDO: >= 90%)
BARRERA DE RED MILITAR: DESCONECTADA
CATAPULTAS DE COMBATE: 0 PSI
AMENAZA: Enjambre de asteroides y cazas piratas detectados en rango.`
              },
              'ion_cannon.py': {
                type: 'file',
                name: 'ion_cannon.py',
                size: 360,
                updatedAt: '2026-10-05 10:02:00',
                content: `# Acorazado Hyperion-9 // Artillería de Iones
# FASE 1: Inspecciona cannon.telemetry para ver la potencia requerida

# TODO: Asigna la potencia calculada (>= 90%):
# cargar_canon_iones(...)

# TODO: Audita el estado del cañón llamando a:
# diagnostico()

print(">> Secuencia de artillería Hyperion completada.")
`
              },
              'cortex_firewall.py': {
                type: 'file',
                name: 'cortex_firewall.py',
                size: 380,
                updatedAt: '2026-10-05 10:03:00',
                content: `# Acorazado Hyperion-9 // Cortafuegos Militar CORTEX-9
# TODO: Habilita el escudo militar de la flota con:
# activar_firewall_militar()

# TODO: Purga el bus de memoria de interferencias hostiles:
# purgar_subred()

# TODO: Valida los signos de combate:
# diagnostico()
`
              },
              'fighter_launch.py': {
                type: 'file',
                name: 'fighter_launch.py',
                size: 360,
                updatedAt: '2026-10-05 10:04:00',
                content: `# Hangar de Cazas - Acorazado Hyperion-9
# TODO: Despliega el escuadrón de combate ("ALPHA" o "VANGUARD-ALPHA"):
# lanzar_cazas("ALPHA")

# TODO: Certifica el perímetro de vuelo:
# diagnostico()
`
              }
            }
          },
          titan: {
            type: 'dir',
            name: 'titan',
            children: {
              'cryo_drill.log': {
                type: 'file',
                name: 'cryo_drill.log',
                size: 320,
                updatedAt: '2026-10-05 10:05:00',
                content: `[BASE MINERA TITÁN // EXTRACCIÓN DE METANO]
PROFUNDIDAD ACTUAL: 0 METROS (REQUERIDO: >= 150M)
RED TÉRMICA: OFFLINE (-180°C AMBIENTE)
BOMBAS DE METANO KRAKEN MARE: INACTIVAS
OBJETIVO: Calentar la broca, iniciar bombas y perforar a >=150m.`
              },
              'thermal_drill.py': {
                type: 'file',
                name: 'thermal_drill.py',
                size: 380,
                updatedAt: '2026-10-05 10:06:00',
                content: `# Base Criogénica Titán // Perforación Térmica
# TODO: Enciende la red radiante térmica sub-cero:
# activar_red_termica()

# TODO: Activa las bombas criogénicas de metano:
# activar_bombas_metano()

# TODO: Inicia la perforación hasta alcanzar profundidad segura (>= 150m):
# iniciar_taladro(...)
`
              }
            }
          },
          helios: {
            type: 'dir',
            name: 'helios',
            children: {
              'solar_shield.log': {
                type: 'file',
                name: 'solar_shield.log',
                size: 320,
                updatedAt: '2026-10-05 10:10:00',
                content: `[HELIOS-SOL // ESCUDO DE DEFLEXIÓN CORONAL]
TEMPERATURA AMBIENTE: 5,400,000°K
COLECTOR DE PLASMA CORONAL: OFFLINE
DEFLEXIÓN MAGNÉTICA ACTUAL: 40% (REQUERIDO: >= 85%)
ENLACE DE NEUTRINOS: DESALINEADO`
              },
              'solar_shield.py': {
                type: 'file',
                name: 'solar_shield.py',
                size: 390,
                updatedAt: '2026-10-05 10:12:00',
                content: `# Sonda Solar Helios // Escudo Coronal
# TODO: Modula la deflexión electromagnética (rango seguro >= 85%):
# ajustar_escudo_solar(...)

# TODO: Activa los colectores de absorción de plasma coronal:
# activar_colector_corona()

# TODO: Alinea la matriz cuántica de neutrinos:
# alinear_neutrinos()
`
              }
            }
          }
        }
      },
      var: {
        type: 'dir',
        name: 'var',
        children: {
          log: {
            type: 'dir',
            name: 'log',
            children: {
              'alarms.log': {
                type: 'file',
                name: 'alarms.log',
                size: 310,
                updatedAt: '2026-10-05 09:20:00',
                content: `[08:14:02] WARN: Desfase angular en colectores solares exteriores (+35.5° off-sun)
[08:15:10] CRIT: Caída acelerada de reservas en bus eléctrico primario (-1.8%/min)
[09:02:18] WARN: Saturación de partículas en filtros de carbono de cabina
[09:10:44] WARN: Paquetes anómalos detectados en puerto de enlace 8088
`
              },
              'dmesg': {
                type: 'file',
                name: 'dmesg',
                size: 220,
                updatedAt: '2026-10-05 00:01:00',
                content: `VersallesOS kernel v5.19-avionics boot complete.
CPU cores: 8 OK.
Memory: 4096MB offline-verified.
Telemetry bus: ONLINE.
`
              }
            }
          }
        },
      },
      scripts: {
        type: 'dir',
        name: 'scripts',
        children: {
          'test.py': {
            type: 'file',
            name: 'test.py',
            size: 90,
            updatedAt: '2026-10-05 09:00:00',
            content: `# Script de prueba rápida en Python
print("Terminal Versalles conectada.")
`
          }
        }
      },
      docs: {
        type: 'dir',
        name: 'docs',
        children: {
          'unix_commands.txt': {
            type: 'file',
            name: 'unix_commands.txt',
            size: 850,
            updatedAt: '2026-10-05 09:00:00',
            content: `═══ COMANDOS UNIX DE LA ESTACIÓN VERSALLES ═══
  ls [ruta]              - Listar archivos y directorios
  cd <directorio>        - Cambiar directorio actual (soporta .., /sys/power, etc.)
  pwd                    - Mostrar ruta de trabajo actual
  cat <archivo>          - Mostrar contenido de un archivo
  grep <termino> <arch>  - Buscar patrones dentro de un archivo
  nano <archivo>         - Abrir archivo en el editor de código aeroespacial
  python <archivo.py>    - Ejecutar script Python en el subsistema local
  javac <archivo.java>   - Compilar código Java determinista
  java <Clase>           - Ejecutar clase Java compilada
  touch <archivo>        - Crear archivo vacío
  rm <archivo>           - Eliminar archivo
  clear / limpiar        - Limpiar la pantalla de la terminal
  help / ayuda           - Mostrar manual del sistema
`
          },
          'python_guide.txt': {
            type: 'file',
            name: 'python_guide.txt',
            size: 550,
            updatedAt: '2026-10-05 09:00:00',
            content: `═══ GUÍA RÁPIDA DE PYTHON PARA CADETES ESPACIALES ═══
- Variables y Asignación:
    energia = 100
    angulo = 47.5

- Bucles For con range:
    for i in range(8):
        ajustar_panel_solar(i, 47.5)

- Bucles sobre Listas:
    filtros = ["F_ALPHA", "F_BETA", "F_GAMMA"]
    for f in filtros:
        purgar_filtro_carbono(f)

- Condicionales:
    if temperatura > 15000:
        inyectar_crio(50)
`
          },
          'java_guide.txt': {
            type: 'file',
            name: 'java_guide.txt',
            size: 520,
            updatedAt: '2026-10-05 09:00:00',
            content: `═══ GUÍA RÁPIDA DE JAVA (POO) ═══
Estructura mínima de programa:
public class MiModulo {
    public static void main(String[] args) {
        int propulsores = 4;
        for (int i = 0; i < propulsores; i++) {
            calibrar_propulsor_rcs(i, 95);
        }
        System.out.println("Operación completada.");
    }
}
`
          }
        }
      }
    }
  };
}

export function normalizePath(path: string): string {
  const parts = path.split('/').filter(p => p && p !== '.');
  const resolvedParts: string[] = [];

  for (const part of parts) {
    if (part === '..') {
      resolvedParts.pop();
    } else {
      resolvedParts.push(part);
    }
  }

  return '/' + resolvedParts.join('/');
}

export function resolvePath(currentDir: string, targetPath: string): string {
  if (!targetPath) return currentDir;
  if (targetPath.startsWith('/')) {
    return normalizePath(targetPath);
  }
  return normalizePath(currentDir + '/' + targetPath);
}

export function getNode(vfs: VFSDirectory, path: string): VFSNode | null {
  const cleanPath = normalizePath(path);
  if (cleanPath === '/' || cleanPath === '') return vfs;

  const parts = cleanPath.split('/').filter(Boolean);
  let current: VFSNode = vfs;

  for (const part of parts) {
    if (current.type !== 'dir') return null;
    const next = current.children[part];
    if (!next) return null;
    current = next;
  }

  return current;
}

export function getFile(vfs: VFSDirectory, path: string): VFSFile | null {
  const node = getNode(vfs, path);
  if (node && node.type === 'file') return node;
  return null;
}

export function listDirectory(vfs: VFSDirectory, path: string): { entries: string[]; error?: string } {
  const node = getNode(vfs, path);
  if (!node) return { entries: [], error: `ls: no se pudo acceder a '${path}': No existe el fichero o el directorio` };
  if (node.type === 'file') return { entries: [node.name] };

  const entries: string[] = [];
  for (const key of Object.keys(node.children).sort()) {
    const child = node.children[key];
    entries.push(child.type === 'dir' ? `${key}/` : key);
  }
  return { entries };
}

export function writeFile(vfs: VFSDirectory, path: string, content: string): { vfs: VFSDirectory; error?: string } {
  const cleanPath = normalizePath(path);
  const parts = cleanPath.split('/').filter(Boolean);
  if (parts.length === 0) return { vfs, error: 'No se puede escribir en el directorio raíz' };

  const fileName = parts.pop()!;
  const parentPath = '/' + parts.join('/');

  // Deep clone to avoid mutating state directly
  const newVfs: VFSDirectory = JSON.parse(JSON.stringify(vfs));
  const parentNode = getNode(newVfs, parentPath);

  if (!parentNode || parentNode.type !== 'dir') {
    return { vfs, error: `No se pudo guardar el archivo: Directorio padre '${parentPath}' no existe.` };
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  parentNode.children[fileName] = {
    type: 'file',
    name: fileName,
    content,
    size: content.length,
    updatedAt: now,
  };

  return { vfs: newVfs };
}

export function removeNode(vfs: VFSDirectory, path: string): { vfs: VFSDirectory; error?: string } {
  const cleanPath = normalizePath(path);
  if (cleanPath === '/' || cleanPath === '') {
    return { vfs, error: 'rm: no se puede eliminar el directorio raíz' };
  }

  const parts = cleanPath.split('/').filter(Boolean);
  const targetName = parts.pop()!;
  const parentPath = '/' + parts.join('/');

  const newVfs: VFSDirectory = JSON.parse(JSON.stringify(vfs));
  const parentNode = getNode(newVfs, parentPath);

  if (!parentNode || parentNode.type !== 'dir' || !parentNode.children[targetName]) {
    return { vfs, error: `rm: no se puede borrar '${path}': Fichero o directorio inexistente` };
  }

  delete parentNode.children[targetName];
  return { vfs: newVfs };
}
