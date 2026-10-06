/**
 * Custom background & illustration asset manager for user-provided artwork
 * Supports IndexedDB for high-resolution PNGs without localStorage 5MB limit.
 */

const DB_NAME = 'versalles_station_assets_db';
const STORE_NAME = 'backgrounds';
const listeners: Array<() => void> = [];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// In-memory cache for instant synchronous access
const memoryCache: Record<string, string> = {};

// Initialize from DB on startup
if (typeof window !== 'undefined' && window.indexedDB) {
  openDB().then(db => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const cursorReq = store.openCursor();
    cursorReq.onsuccess = (e: any) => {
      const cursor = e.target.result;
      if (cursor) {
        memoryCache[cursor.key as string] = cursor.value;
        cursor.continue();
      } else {
        notifyListeners();
      }
    };
  }).catch(() => {
    // fallback to localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('versalles_bg_')) {
          const id = k.replace('versalles_bg_', '');
          const val = localStorage.getItem(k);
          if (val) memoryCache[id] = val;
        }
      }
    } catch {}
  });
}

export function subscribeToCustomAssets(listener: () => void) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

function notifyListeners() {
  listeners.forEach(l => {
    try { l(); } catch {}
  });
}

/**
 * Default asset paths mapped to public assets
 */
export const DEFAULT_ASSET_MAP: Record<string, string> = {
  // Destinations
  'versalles': '/assets/Mapa General Estación Versalles.png',
  'hyperion': '/assets/hyperion.jpg',
  'titan': '/assets/titan.jpg',
  'helios': '/assets/helios.jpg',
  'solar_system': '/assets/sistema_solar.jpg',
  'map': '/assets/Mapa General Estación Versalles.png',

  // Versalles Sectors
  'reactor': '/assets/Vista Nucleo Reactor.png',
  'lab': '/assets/Vista Laboratorio de Datos.png',
  'bridge': '/assets/Puente de Navegacion.jpg',
  'shields': '/assets/Matriz de Escudos.jpg',
  'drones': '/assets/Estacion de Drones.jpg',

  // Versalles Missions
  'm1-plasma': '/assets/Vista Nucleo Reactor.png',
  'mision_plasma_reactor': '/assets/Vista Nucleo Reactor.png',
  'm2-logic-gate': '/assets/Vista Laboratorio de Datos.png',
  'mision_puerta_logica': '/assets/Vista Laboratorio de Datos.png',
  'm3-thrusters': '/assets/Puente de Navegacion.jpg',
  'mision_propulsores_rcs': '/assets/Puente de Navegacion.jpg',
  'm4-firewall': '/assets/Matriz de Escudos.jpg',
  'mision_firewall_escudos': '/assets/Matriz de Escudos.jpg',
  'm5-quantum-logic': '/assets/Vista Laboratorio de Datos.png',
  'mision_cuantica_lab': '/assets/Vista Laboratorio de Datos.png',
  'm6-drone-queue': '/assets/Estacion de Drones.jpg',
  'mision_drones_carga': '/assets/Estacion de Drones.jpg',
  'm7-omega-crisis': '/assets/Vista Nucleo Reactor.png',
  'mision_crisis_omega': '/assets/Vista Nucleo Reactor.png',

  // Hyperion Missions & Sectors
  'hyp-m1-ioncannon': '/assets/mision_canon_iones.jpg',
  'mision_canon_iones': '/assets/mision_canon_iones.jpg',
  'hyp-m2-cortexfirewall': '/assets/mision_cortex_firewall.jpg',
  'mision_cortex_firewall': '/assets/mision_cortex_firewall.jpg',
  'mision_ciberdefensa_militar': '/assets/mision_cortex_firewall.jpg',
  'hyp-m3-fighterlaunch': '/assets/mision_hangar_cazas.jpg',
  'mision_hangar_cazas': '/assets/mision_hangar_cazas.jpg',

  // Titan Missions & Sectors
  'tit-m1-methanepumps': '/assets/mision_refineria_metano.jpg',
  'mision_refineria_metano': '/assets/mision_refineria_metano.jpg',
  'tit-m2-miningdrill': '/assets/mision_taladro_subterraneo.jpg',
  'mision_taladro_subterraneo': '/assets/mision_taladro_subterraneo.jpg',
  'tit-m3-subzero': '/assets/mision_calefaccion_termica.jpg',
  'mision_calefaccion_termica': '/assets/mision_calefaccion_termica.jpg',

  // Helios Missions & Sectors
  'hel-m1-solarshield': '/assets/mision_escudo_termico_solar.jpg',
  'mision_escudo_termico_solar': '/assets/mision_escudo_termico_solar.jpg',
  'hel-m2-coronaharvest': '/assets/mision_colector_corona_solar.jpg',
  'mision_colector_corona_solar': '/assets/mision_colector_corona_solar.jpg',
  'hel-m3-neutrinomatrix': '/assets/mision_matriz_neutrinos.jpg',
  'mision_matriz_neutrinos': '/assets/mision_matriz_neutrinos.jpg',
};

/**
 * Bi-directional aliases to ensure lookups always find the image
 * whether queried by mission ID, imageKey, or common filename alias.
 */
export const ALIAS_MAP: Record<string, string[]> = {
  // Hyperion-9 Missions
  'mision_canon_iones': ['hyp-m1-ioncannon', 'hyp-m1', 'canon_iones', 'ion_cannon', 'mision_canon'],
  'hyp-m1-ioncannon': ['mision_canon_iones', 'hyp-m1', 'canon_iones'],

  'mision_ciberdefensa_militar': ['mision_cortex_firewall', 'hyp-m2-cortexfirewall', 'hyp-m2', 'cortex_firewall', 'cortex'],
  'mision_cortex_firewall': ['mision_ciberdefensa_militar', 'hyp-m2-cortexfirewall', 'hyp-m2', 'cortex_firewall'],
  'hyp-m2-cortexfirewall': ['mision_ciberdefensa_militar', 'mision_cortex_firewall', 'hyp-m2'],

  'mision_hangar_cazas': ['hyp-m3-fighterlaunch', 'hyp-m3', 'hangar_cazas', 'fighter_launch'],
  'hyp-m3-fighterlaunch': ['mision_hangar_cazas', 'hyp-m3', 'hangar_cazas'],

  // Titan-IV Missions
  'mision_refineria_metano': ['tit-m1-methanepumps', 'tit-m1', 'refineria_metano', 'methane_pumps'],
  'tit-m1-methanepumps': ['mision_refineria_metano', 'tit-m1', 'refineria_metano'],

  'mision_taladro_subterraneo': ['tit-m2-miningdrill', 'tit-m2', 'taladro_subterraneo', 'mining_drill'],
  'tit-m2-miningdrill': ['mision_taladro_subterraneo', 'tit-m2', 'taladro_subterraneo'],

  'mision_calefaccion_termica': ['tit-m3-subzero', 'tit-m3', 'calefaccion_termica', 'subzero_heat'],
  'tit-m3-subzero': ['mision_calefaccion_termica', 'tit-m3', 'calefaccion_termica'],

  // Helios-Prime Missions
  'mision_escudo_termico_solar': ['hel-m1-solarshield', 'hel-m1', 'escudo_termico_solar', 'solar_shield'],
  'hel-m1-solarshield': ['mision_escudo_termico_solar', 'hel-m1', 'escudo_termico_solar'],

  'mision_colector_corona_solar': ['hel-m2-coronaharvest', 'hel-m2', 'colector_corona_solar', 'corona_harvest'],
  'hel-m2-coronaharvest': ['mision_colector_corona_solar', 'hel-m2', 'colector_corona_solar'],

  'mision_matriz_neutrinos': ['hel-m3-neutrinomatrix', 'hel-m3', 'matriz_neutrinos', 'neutrino_matrix'],
  'hel-m3-neutrinomatrix': ['mision_matriz_neutrinos', 'hel-m3', 'matriz_neutrinos'],

  // Versalles Missions
  'mision_plasma_reactor': ['m1-plasma', 'm1', 'plasma_reactor'],
  'm1-plasma': ['mision_plasma_reactor', 'm1'],

  'mision_puerta_logica': ['m2-logic-gate', 'm2', 'puerta_logica'],
  'm2-logic-gate': ['mision_puerta_logica', 'm2'],

  'mision_propulsores_rcs': ['m3-thrusters', 'm3-rcs', 'm3', 'propulsores_rcs'],
  'm3-thrusters': ['mision_propulsores_rcs', 'm3-rcs', 'm3'],

  'mision_firewall_escudos': ['m4-firewall', 'm4', 'firewall_escudos'],
  'm4-firewall': ['mision_firewall_escudos', 'm4'],

  'mision_cuantica_lab': ['m5-quantum-logic', 'm5', 'quantum_logic'],
  'm5-quantum-logic': ['mision_cuantica_lab', 'm5'],

  'mision_drones_carga': ['m6-drone-queue', 'm6-drones', 'm6', 'drones_carga'],
  'm6-drone-queue': ['mision_drones_carga', 'm6'],

  'mision_crisis_omega': ['m7-omega-crisis', 'm7'],
  'm7-omega-crisis': ['mision_crisis_omega', 'm7'],

  // Locations
  'hyperion': ['acorazado_hyperion', 'hyperion-9'],
  'titan': ['puesto_titan', 'titan-iv'],
  'helios': ['laboratorio_helios', 'helios-prime'],
  'solar_system': ['solar', 'sistema_solar', 'mapa_solar']
};

export async function saveCustomBackground(sectorOrMapId: string, dataUrl: string): Promise<void> {
  // Save main key
  memoryCache[sectorOrMapId] = dataUrl;

  // Also save all aliases
  const aliases = ALIAS_MAP[sectorOrMapId] || [];
  aliases.forEach(alias => {
    memoryCache[alias] = dataUrl;
  });

  notifyListeners();

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(dataUrl, sectorOrMapId);
    aliases.forEach(alias => store.put(dataUrl, alias));
  } catch (e) {
    try {
      localStorage.setItem('versalles_bg_' + sectorOrMapId, dataUrl);
      aliases.forEach(alias => localStorage.setItem('versalles_bg_' + alias, dataUrl));
    } catch {}
  }
}

export function getCustomBackground(sectorOrMapId: string): string | null {
  // 1. Check in-memory / user-uploaded cache first
  if (memoryCache[sectorOrMapId]) {
    return memoryCache[sectorOrMapId];
  }

  // Check aliases in memory cache
  const aliases = ALIAS_MAP[sectorOrMapId] || [];
  for (const alias of aliases) {
    if (memoryCache[alias]) {
      return memoryCache[alias];
    }
  }

  // 2. Fall back to built-in default asset map
  if (DEFAULT_ASSET_MAP[sectorOrMapId]) {
    return DEFAULT_ASSET_MAP[sectorOrMapId];
  }
  for (const alias of aliases) {
    if (DEFAULT_ASSET_MAP[alias]) {
      return DEFAULT_ASSET_MAP[alias];
    }
  }

  return null;
}

/**
 * Resolves the distinct illustration for each sector according to the current planetary destination
 */
export function getSectorIllustration(destinationId: string | null | undefined, sectorId: string): string | null {
  // Check if user specifically uploaded an override for this sector or destination
  const userSectorOverride = memoryCache[sectorId];
  if (userSectorOverride) return userSectorOverride;

  if (destinationId === 'hyperion') {
    if (sectorId === 'bridge') return getCustomBackground('mision_canon_iones');
    if (sectorId === 'shields') return getCustomBackground('mision_cortex_firewall');
    if (sectorId === 'drones') return getCustomBackground('mision_hangar_cazas');
    return getCustomBackground('hyperion');
  }

  if (destinationId === 'titan') {
    if (sectorId === 'drones') return getCustomBackground('mision_refineria_metano');
    if (sectorId === 'reactor') return getCustomBackground('mision_taladro_subterraneo');
    if (sectorId === 'lab') return getCustomBackground('mision_calefaccion_termica');
    return getCustomBackground('titan');
  }

  if (destinationId === 'helios') {
    if (sectorId === 'shields') return getCustomBackground('mision_escudo_termico_solar');
    if (sectorId === 'reactor') return getCustomBackground('mision_colector_corona_solar');
    if (sectorId === 'lab') return getCustomBackground('mision_matriz_neutrinos');
    return getCustomBackground('helios');
  }

  // Default Versalles Station
  return getCustomBackground(sectorId);
}

export async function clearCustomBackground(sectorOrMapId: string): Promise<void> {
  delete memoryCache[sectorOrMapId];
  const aliases = ALIAS_MAP[sectorOrMapId] || [];
  aliases.forEach(alias => delete memoryCache[alias]);

  notifyListeners();

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(sectorOrMapId);
    aliases.forEach(alias => store.delete(alias));
  } catch {
    try {
      localStorage.removeItem('versalles_bg_' + sectorOrMapId);
      aliases.forEach(alias => localStorage.removeItem('versalles_bg_' + alias));
    } catch {}
  }
}

/**
 * Normalizes a string by stripping accents and converting to lowercase
 */
function normalizeStr(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n');
}

/**
 * Automatically maps a dropped file name to the target game view or mission illustration
 */
export function identifySectorFromFilename(
  filename: string, 
  fallbackSectorId: string,
  currentMissionKeyOrId?: string | null,
  currentLocationId?: string | null
): string {
  const norm = normalizeStr(filename);

  // If a mission modal is open and the user dropped an image:
  // If the filename contains generic words or matches this mission, bind directly to the active mission!
  if (currentMissionKeyOrId) {
    const isExplicitLocation = norm.includes('solar') || norm.includes('sistema') || norm.includes('interplanet') ||
      norm.includes('hyperion') || norm.includes('titan') || norm.includes('helios');
    const isExplicitStationMap = norm.includes('plano') || norm.includes('mapa general') || norm.includes('distribucion');
    
    if (!isExplicitLocation && !isExplicitStationMap) {
      return currentMissionKeyOrId;
    }
  }

  // 1. SPECIFIC MISSIONS: Hyperion-9
  if (norm.includes('canon') || norm.includes('ion') || norm.includes('canion') || norm.includes('hyp-m1') || norm.includes('hyp_m1')) {
    return 'mision_canon_iones';
  }
  if (norm.includes('cortex') || norm.includes('ciberdefensa') || norm.includes('firewall') || norm.includes('hyp-m2') || norm.includes('hyp_m2')) {
    return 'mision_ciberdefensa_militar';
  }
  if (norm.includes('caza') || norm.includes('escuadron') || norm.includes('hangar') || norm.includes('fighter') || norm.includes('hyp-m3') || norm.includes('hyp_m3')) {
    return 'mision_hangar_cazas';
  }

  // 2. SPECIFIC MISSIONS: Titan-IV
  if (norm.includes('metano') || norm.includes('kraken') || norm.includes('refineria') || norm.includes('bomba') || norm.includes('tit-m1') || norm.includes('tit_m1')) {
    return 'mision_refineria_metano';
  }
  if (norm.includes('taladro') || norm.includes('perforacion') || norm.includes('drill') || norm.includes('subterraneo') || norm.includes('tit-m2') || norm.includes('tit_m2')) {
    return 'mision_taladro_subterraneo';
  }
  if (norm.includes('calefaccion') || norm.includes('termica') || norm.includes('subcero') || norm.includes('tit-m3') || norm.includes('tit_m3')) {
    return 'mision_calefaccion_termica';
  }

  // 3. SPECIFIC MISSIONS: Helios-Prime
  if (norm.includes('escudo_solar') || norm.includes('escudo_termico') || norm.includes('deflexion') || norm.includes('solar_shield') || norm.includes('hel-m1') || norm.includes('hel_m1')) {
    return 'mision_escudo_termico_solar';
  }
  if (norm.includes('colector') || norm.includes('corona') || norm.includes('harvest') || norm.includes('hel-m2') || norm.includes('hel_m2')) {
    return 'mision_colector_corona_solar';
  }
  if (norm.includes('neutrino') || norm.includes('telescopio') || norm.includes('matriz_neutrinos') || norm.includes('hel-m3') || norm.includes('hel_m3')) {
    return 'mision_matriz_neutrinos';
  }

  // 4. SPECIFIC MISSIONS: Versalles
  if (norm.includes('plasma') || norm.includes('m1-plasma') || norm.includes('m1_plasma')) {
    return 'mision_plasma_reactor';
  }
  if (norm.includes('puerta_logica') || norm.includes('logica') || norm.includes('logic') || norm.includes('m2-logic')) {
    return 'mision_puerta_logica';
  }
  if (norm.includes('propulsor') || norm.includes('rcs') || norm.includes('m3-rcs')) {
    return 'mision_propulsores_rcs';
  }
  if (norm.includes('firewall_escudos') || norm.includes('m4-firewall')) {
    return 'mision_firewall_escudos';
  }
  if (norm.includes('drones_carga') || norm.includes('m5-drones')) {
    return 'mision_drones_carga';
  }

  // Generic Mission index numbering according to active location
  if (norm.includes('mision_1') || norm.includes('mision1') || norm.includes('mission_1') || norm.includes('mission1')) {
    if (currentLocationId === 'hyperion') return 'mision_canon_iones';
    if (currentLocationId === 'titan') return 'mision_refineria_metano';
    if (currentLocationId === 'helios') return 'mision_escudo_termico_solar';
    return 'mision_plasma_reactor';
  }
  if (norm.includes('mision_2') || norm.includes('mision2') || norm.includes('mission_2') || norm.includes('mission2')) {
    if (currentLocationId === 'hyperion') return 'mision_ciberdefensa_militar';
    if (currentLocationId === 'titan') return 'mision_taladro_subterraneo';
    if (currentLocationId === 'helios') return 'mision_colector_corona_solar';
    return 'mision_puerta_logica';
  }
  if (norm.includes('mision_3') || norm.includes('mision3') || norm.includes('mission_3') || norm.includes('mission3')) {
    if (currentLocationId === 'hyperion') return 'mision_hangar_cazas';
    if (currentLocationId === 'titan') return 'mision_calefaccion_termica';
    if (currentLocationId === 'helios') return 'mision_matriz_neutrinos';
    return 'mision_propulsores_rcs';
  }

  // 5. Interplanetary location backdrops
  if (norm.includes('solar') || norm.includes('sistema') || norm.includes('interplanet') || norm.includes('orbita')) {
    return 'solar_system';
  }
  if (norm.includes('hyperion') || norm.includes('acorazado')) {
    return 'hyperion';
  }
  if (norm.includes('titan') || norm.includes('minero')) {
    return 'titan';
  }
  if (norm.includes('helios')) {
    return 'helios';
  }

  // 6. Station Versalles Sectors & Map
  if (norm.includes('map') || norm.includes('distribucion') || norm.includes('interior') || norm.includes('plano')) {
    return 'map';
  }
  if (norm.includes('reactor') || norm.includes('fusion') || norm.includes('nucleo')) {
    return 'reactor';
  }
  if (norm.includes('laboratorio') || norm.includes('datos') || norm.includes('lab')) {
    return 'lab';
  }
  if (norm.includes('puente') || norm.includes('mando') || norm.includes('bridge') || norm.includes('vuelo')) {
    return 'bridge';
  }
  if (norm.includes('escudo') || norm.includes('shield')) {
    return 'shields';
  }
  if (norm.includes('drone') || norm.includes('bahia') || norm.includes('carga')) {
    return 'drones';
  }

  return fallbackSectorId;
}
