import React, { useState } from 'react';
import { X, BookOpen, Terminal, Check, Copy } from 'lucide-react';
import { soundFx } from '../audio/synth';
import { useLanguage } from '../i18n/LanguageContext';

interface HandbookModalProps {
  onClose: () => void;
  onInsertCodeSnippet: (code: string) => void;
}

export const HandbookModal: React.FC<HandbookModalProps> = ({
  onClose,
  onInsertCodeSnippet,
}) => {
  const { language, t } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<'python_solar' | 'unix_vfs' | 'java_oop' | 'variables' | 'booleans' | 'loops' | 'security' | 'queues'>('python_solar');
  const [copied, setCopied] = useState(false);

  const topics = language === 'fr' ? [
    { id: 'python_solar', label: '01. Python : Boucles & Collecteurs Solaires' },
    { id: 'unix_vfs', label: '02. UNIX : Navigation Avionique (CLI)' },
    { id: 'java_oop', label: '03. Java : Classes et Structures POO' },
    { id: 'variables', label: '04. Variables & Calibrage' },
    { id: 'booleans', label: '05. Logique Booléenne & Tables' },
    { id: 'loops', label: '06. Boucles & Parcours de Tableaux' },
    { id: 'security', label: '07. Cyberdéfense & Filtres' },
    { id: 'queues', label: '08. Files & Priorités des Drones' },
  ] : [
    { id: 'python_solar', label: '01. Python: Bucles & Colectores Solares' },
    { id: 'unix_vfs', label: '02. UNIX: Navegación de Aviónica (CLI)' },
    { id: 'java_oop', label: '03. Java: Clases y Estructuras POO' },
    { id: 'variables', label: '04. Variables & Calibración' },
    { id: 'booleans', label: '05. Lógica Booleana & Tablas' },
    { id: 'loops', label: '06. Bucles & Recorrido de Arrays' },
    { id: 'security', label: '07. Ciber-Defensa & Filtros' },
    { id: 'queues', label: '08. Colas & Prioridades de Drones' },
  ];

  const topicContent: Record<string, { title: string; desc: string; code: string; breakdown: string[] }> = language === 'fr' ? {
    python_solar: {
      title: 'Python : Itération des Servomoteurs Solaires (range)',
      desc: 'En Python, la boucle for in range() permet d\'itérer sur des collections numériques de façon concise. C\'est le standard pour calibrer des actionneurs en série.',
      code: `# Calibrage des 8 collecteurs extérieurs à 47.5°
ANGULO_OPTIMO = 47.5
TOTAL_PANELES = 8

for i in range(TOTAL_PANELES):
    ajustar_panel_solar(i, ANGULO_OPTIMO)

print(">> Servomoteurs solaires synchronisés.")`,
      breakdown: [
        'range(8) génère les indices de 0 à 7 séquentiellement.',
        'L\'indentation avec 4 espaces définit le bloc exécuté à chaque cycle.',
        'Oublier les deux-points ":" ou l\'indentation déclenchera une SyntaxError.',
      ],
    },
    unix_vfs: {
      title: 'UNIX : Navigation dans les Répertoires et Lecture de Logs',
      desc: 'La console de la Station Versailles fonctionne sur une arborescence UNIX virtuelle permettant de localiser et modifier les fichiers de télémétrie.',
      code: `# Explorer les dossiers et auditer les anomalies
cd /sys/power
ls -la
cat solar_status.log
grep "DESALINEADO" solar_status.log
python calibrate_solar.py`,
      breakdown: [
        'cd /chemin : Déplace le répertoire de travail dans l\'arborescence.',
        'ls -la : Liste les fichiers avec détails et permissions.',
        'cat fichier : Affiche le contenu brut des journaux et scripts.',
        'grep motif fichier : Filtre les lignes contenant un mot-clé précis.',
      ],
    },
    java_oop: {
      title: 'Java : Programmation Orientée Objet et Typage Stricte',
      desc: 'Pour les sous-systèmes de contrôle critique longue durée, Java offre un typage strict et une encapsulation en classes.',
      code: `// Contrôle des Propulseurs RCS en Java
public class CalibradorRCS {
    public static void main(String[] args) {
        int propulsores = 4;
        for (int i = 0; i < propulsores; i++) {
            calibrar_propulsor_rcs(i, 95);
        }
        fijar_orbita_estable();
        System.out.println(">> Orbite stabilisée via JVM.");
    }
}`,
      breakdown: [
        'public class Nom : Toute logique Java réside dans une classe.',
        'public static void main(String[] args) : Point d\'entrée exécuté par le système.',
        'Chaque instruction requiert un point-virgule ";" à la fin.',
      ],
    },
    variables: {
      title: 'Variables et Paramètres Numériques',
      desc: 'Sur la Station Versailles, chaque actionneur physique répond à des valeurs numériques comprises dans des plages sécurisées.',
      code: `// Calibrage du Confinement Magnétique
let puissanceRequise = 92; // Seuil minimal sûr : 88%

AJUSTAR(CAMPO_MAGNETICO, puissanceRequise);
ACTIVAR(SISTEMA_ESTABILIZADOR);
DIAGNOSTICO();`,
      breakdown: [
        'Les variables stockent des valeurs temporaires en mémoire.',
        'Les seuils de sécurité doivent être vérifiés avant toute application.',
        'La fonction DIAGNOSTICO() confirme la mise à jour des paramètres.',
      ],
    },
    booleans: {
      title: 'Portes Logiques et Algèbre Booléenne',
      desc: 'Les processeurs quantiques évaluent des états de vérité (true / 1 ou false / 0). Si une porte grille, l\'autopilote est suspendu.',
      code: `// Table de Vérité ET (&&) :
// VRAI uniquement si les deux entrées sont vraies.
// 0 && 0 => 0
// 0 && 1 => 0
// 1 && 0 => 0
// 1 && 1 => 1

REPARAR(PUERTA_LOGICA, "AND", 12);
PROBAR(PUERTA_LOGICA);
ACTIVAR(NAVEGACION_SECUNDARIA);`,
      breakdown: [
        'ET (&&) : Nécessite que toutes les conditions soient réunies.',
        'OU (||) : Vrai dès qu\'au moins une condition est valide.',
        'NON (!) : Inverse la valeur (de true à false ou inversement).',
      ],
    },
    loops: {
      title: 'Boucles (for) et Parcours de Tableaux',
      desc: 'Lorsqu\'un vaisseau possède plusieurs tuyères ou capteurs identiques, itérer évite de dupliquer du code et prévient les déséquilibres.',
      code: `// Calibrage groupé des 4 propulseurs de manœuvre
const totalPropulseurs = 4;

for (let id = 0; id < totalPropulseurs; id++) {
  CALIBRAR_PROPULSOR(id, 95);
}

FIJAR_ORBITA();`,
      breakdown: [
        'let id = 0 initialise le compteur d\'itération.',
        'id < 4 définit la condition de maintien dans la boucle.',
        'id++ incrémente le pointeur à chaque cycle.',
      ],
    },
    security: {
      title: 'Cyber-Défense et Filtrage de Paquets',
      desc: 'Lors d\'attaques par injection, le pare-feu doit inspecter les signatures des paquets et isoler les ports exposés.',
      code: `// Purge du trafic malveillant
APLICAR_FIREWALL("BLOQUEAR_MALWARE");
AISLAR_PUERTO(8088);
PURGAR_SUBRED();`,
      breakdown: [
        'Les paquets légitimes ont les préfixes SYS_ ou COM_.',
        'Les sondes ennemies saturent les sockets ouverts comme le port 8088.',
        'PURGAR_SUBRED() vide les tampons infectés et restaure les boucliers.',
      ],
    },
    queues: {
      title: 'Files d\'Attente (FIFO) et Déploiement Automatisé',
      desc: 'En cas d\'urgence avec des ressources limitées, les tâches doivent être ordonnées par criticité avant l\'envoi des drones.',
      code: `// Réorganiser la file de dispatch
DESPACHAR_DRONES("PRIORIDAD_OXIGENO");
ENRUTAR_VALVULAS([1, 4]);`,
      breakdown: [
        'Les files fonctionnent en First-In, First-Out (premier entré, premier sorti).',
        'Le tri prioritaire permet aux urgences de supplanter les tâches courantes.',
      ],
    },
  } : {
    python_solar: {
      title: 'Python: Iteración de Servomotores Solares (range)',
      desc: 'En Python, el bucle for in range() permite iterar colecciones numéricas de forma concisa. Es el estándar de la industria para calibrar actuadores mecánicos por lotes.',
      code: `# Calibración de los 8 colectores exteriores a 47.5°
ANGULO_OPTIMO = 47.5
TOTAL_PANELES = 8

for i in range(TOTAL_PANELES):
    ajustar_panel_solar(i, ANGULO_OPTIMO)

print(">> Servomotores solares sincronizados.")`,
      breakdown: [
        'range(8) genera los índices del 0 al 7 de manera secuencial.',
        'La indentación con 4 espacios determina el bloque que se ejecuta en cada ciclo.',
        'Si cometes un fallo en los dos puntos ":" o en la indentación, el analizador emitirá un SyntaxError realista.',
      ],
    },
    unix_vfs: {
      title: 'UNIX: Navegación de Directorios y Lectura de Logs',
      desc: 'La consola de la Estación Versalles opera sobre un sistema de archivos virtual jerárquico tipo UNIX, permitiendo localizar y editar ficheros de calibración.',
      code: `# Explorar directorios y auditar anomalías
cd /sys/power
ls -la
cat solar_status.log
grep "DESALINEADO" solar_status.log
python calibrate_solar.py`,
      breakdown: [
        'cd /ruta: Desplaza el cursor de trabajo a través del árbol (/sys, /var, /scripts).',
        'ls -la: Lista los ficheros junto a sus permisos y tamaños.',
        'cat archivo: Muestra el contenido crudo de logs y scripts.',
        'grep patron archivo: Filtra líneas que contienen una palabra clave.',
      ],
    },
    java_oop: {
      title: 'Java: Programación Orientada a Objetos y Tipado Fuerte',
      desc: 'Para subsistemas de control crítico de largo plazo, Java ofrece tipado estricto, encapsulamiento en clases y el método de entrada universal main().',
      code: `// Clase de Control de Propulsores RCS en Java
public class CalibradorRCS {
    public static void main(String[] args) {
        int propulsores = 4;
        for (int i = 0; i < propulsores; i++) {
            calibrar_propulsor_rcs(i, 95);
        }
        fijar_orbita_estable();
        System.out.println(">> Órbita fijada mediante JVM.");
    }
}`,
      breakdown: [
        'public class Nombre: Toda lógica en Java debe residir dentro de una clase.',
        'public static void main(String[] args): Punto de entrada que ejecuta el sistema operativo.',
        'Las sentencias exigen punto y coma ";" al final; omitirlo produce un fallo de compilador javac.',
      ],
    },
    variables: {
      title: 'Variables y Parámetros Numéricos',
      desc: 'En los sistemas de la Estación Versalles, cada actuador físico (reactores, bombas, bobinas) responde a valores numéricos dentro de rangos seguros de operación.',
      code: `// Ejemplo: Calibrar Confinamiento Magnético
let potenciaRequerida = 92; // Umbral mínimo seguro: 88%

AJUSTAR(CAMPO_MAGNETICO, potenciaRequerida);
ACTIVAR(SISTEMA_ESTABILIZADOR);
DIAGNOSTICO();`,
      breakdown: [
        'Las variables almacenan valores temporales en memoria.',
        'Los umbrales de seguridad deben validarse antes de aplicar cambios destructivos.',
        'La función DIAGNOSTICO() permite confirmar que los valores asignados se reflejan en la telemetría.',
      ],
    },
    booleans: {
      title: 'Compuertas Lógicas y Álgebra Booleana',
      desc: 'Los procesadores cuánticos de navegación evalúan condiciones de verdad (true / 1 o false / 0). Si una compuerta falla, las decisiones algorítmicas se detienen.',
      code: `// Tabla de Verdad AND (&&):
// Solo es TRUE si AMBAS entradas son verdaderas.
// 0 && 0 => 0
// 0 && 1 => 0
// 1 && 0 => 0
// 1 && 1 => 1

REPARAR(PUERTA_LOGICA, "AND", 12);
PROBAR(PUERTA_LOGICA);
ACTIVAR(NAVEGACION_SECUNDARIA);`,
      breakdown: [
        'AND (&&): Requiere que todas las condiciones se cumplan.',
        'OR (||): Es verdadero si al menos una condición es válida.',
        'NOT (!): Invierte el valor (de true a false o viceversa).',
        'XOR: Es verdadero si exactamente una entrada es verdadera, no ambas.',
      ],
    },
    loops: {
      title: 'Bucles (for) y Recorrido de Arreglos',
      desc: 'Cuando una nave cuenta con múltiples toberas, válvulas o sensores repetidos, iterar sobre la colección evita escribir código duplicado y previene desbalanceos.',
      code: `// Calibración por lotes de los 4 propulsores de maniobra
const totalPropulsores = 4;

for (let id = 0; id < totalPropulsores; id++) {
  // Ajustamos cada tobera al 95% de potencia de empuje
  CALIBRAR_PROPULSOR(id, 95);
}

FIJAR_ORBITA();`,
      breakdown: [
        'La cláusula let id = 0 inicializa el contador.',
        'id < 4 define la condición de permanencia en el bucle.',
        'id++ incrementa el puntero en cada ciclo hasta abarcar todo el array.',
      ],
    },
    security: {
      title: 'Ciber-Guerra y Filtrado de Paquetes',
      desc: 'Durante ataques de inyección o desbordamiento de búfer, el firewall debe inspeccionar las firmas de los paquetes entrantes y aislar puertos en riesgo.',
      code: `// Inspeccionar y purgar tráfico malicioso
APLICAR_FIREWALL("BLOQUEAR_MALWARE");
AISLAR_PUERTO(8088);
PURGAR_SUBRED();`,
      breakdown: [
        'Los paquetes legítimos contienen prefijos SYS_ o COM_.',
        'Las sondas hostiles intentan saturar sockets abiertos como el puerto 8088.',
        'PURGAR_SUBRED() vacía los búferes de memoria infectados devolviendo potencia a los escudos.',
      ],
    },
    queues: {
      title: 'Colas (FIFO) y Despacho Automatizado',
      desc: 'En situaciones de emergencia con recursos limitados, las tareas deben ser ordenadas por impacto crítico antes de ser consumidas por los drones.',
      code: `// Reordenar la cola de despacho de soporte vital
DESPACHAR_DRONES("PRIORIDAD_OXIGENO");
ENRUTAR_VALVULAS([1, 4]);`,
      breakdown: [
        'Las colas operan bajo principio First-In, First-Out (primero en entrar, primero en salir).',
        'Al aplicar un algoritmo de prioridad, las emergencias vitales adelantan a las tareas estéticas.',
      ],
    },
  };

  const current = topicContent[selectedTopic];

  const handleCopy = () => {
    soundFx.playBeep(880, 0.04);
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    soundFx.playCommandExecute();
    onInsertCodeSnippet(current.code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020b18]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#020e1d] border border-[#00f5ff]/40 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#03172a] border-b border-[#00f5ff]/20 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h2 className="font-orbitron font-bold text-sm md:text-base text-amber-400 tracking-wider">
              {t.handbook.title}
            </h2>
          </div>
          <button
            onClick={() => {
              soundFx.playBeep(400, 0.03);
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Topics Sidebar */}
          <div className="w-full md:w-64 bg-[#010915] border-r border-[#00f5ff]/15 p-3 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-orbitron font-semibold text-slate-500 uppercase tracking-widest px-2 py-1 mb-1">
              {language === 'fr' ? "MODULES D'APPRENTISSAGE" : 'MÓDULOS DE APRENDIZAJE'}
            </div>
            {topics.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  soundFx.playBeep(600, 0.03);
                  setSelectedTopic(t.id as any);
                }}
                className={`w-full text-left px-3 py-2 rounded text-xs font-tech transition-colors cursor-pointer ${
                  selectedTopic === t.id
                    ? 'bg-[#00f5ff]/15 text-[#00f5ff] border border-[#00f5ff]/40 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Details Content */}
          <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-4">
            <div>
              <h3 className="font-orbitron font-bold text-base md:text-lg text-white">
                {current.title}
              </h3>
              <p className="font-tech text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
                {current.desc}
              </p>
            </div>

            {/* Code Box */}
            <div className="relative rounded-lg overflow-hidden border border-[#00f5ff]/30 bg-[#010610]">
              <div className="bg-[#021120] border-b border-[#00f5ff]/20 px-3 py-1.5 flex items-center justify-between text-[11px] font-tech text-slate-400">
                <span>{language === 'fr' ? 'EXTRAIT DE CODE CONSEILLÉ' : 'CÓDIGO ESPACIAL RECOMENDADO'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t.handbook.copied : t.handbook.copyCode}</span>
                  </button>
                </div>
              </div>
              <pre className="p-3.5 font-tech text-xs md:text-sm text-emerald-400 overflow-x-auto">
                {current.code}
              </pre>
            </div>

            {/* Explanations */}
            <div>
              <div className="text-[11px] font-orbitron font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                {language === 'fr' ? 'POINTS CLÉS À RETENIR :' : 'FUNDAMENTOS A RECORDAR:'}
              </div>
              <ul className="space-y-1.5 font-tech text-xs text-slate-300">
                {current.breakdown.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#00f5ff]">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={handleInsert}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-orbitron font-bold text-xs rounded transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,215,0,0.3)] cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{t.handbook.insertTerminal}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
