import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TranslationDictionary } from './types';
import { 
  UI_TRANSLATIONS, 
  SECTOR_TRANSLATIONS, 
  MISSION_TRANSLATIONS, 
  SOLAR_TRANSLATIONS, 
  CREW_TRANSLATIONS, 
  DILEMMA_TRANSLATIONS,
  RANKS_TRANSLATIONS 
} from './translations';
import { Sector, Mission, CrewMember } from '../types/game';
import { SolarDestination } from '../data/solarSystem';
import { RadioDilemma } from '../data/dilemmas';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
  getLocalizedSector: (sector: Sector) => Sector;
  getLocalizedMission: (mission: Mission) => Mission;
  getLocalizedDestination: (dest: SolarDestination) => SolarDestination;
  getLocalizedCrew: (crew: Record<string, CrewMember>) => Record<string, CrewMember>;
  getLocalizedDilemma: (dilemma: RadioDilemma) => RadioDilemma;
  getLocalizedRank: (rank: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'versalles_language_pref';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'fr' || saved === 'es') return saved;
      // Auto-detect browser language if french
      if (typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('fr')) {
        return 'fr';
      }
    } catch {
      // fallback to default
    }
    return 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleCustomLang = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      if (customEvent.detail === 'es' || customEvent.detail === 'fr') {
        setLanguageState(customEvent.detail);
      }
    };
    window.addEventListener('versalles_set_language', handleCustomLang);
    return () => window.removeEventListener('versalles_set_language', handleCustomLang);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'fr' : 'es');
  };

  const t = UI_TRANSLATIONS[language];

  const getLocalizedSector = (sector: Sector): Sector => {
    const loc = SECTOR_TRANSLATIONS[language]?.[sector.id];
    if (!loc) return sector;

    const localizedHotspots = sector.hotspots.map(hs => {
      const hsLoc = loc.hotspots?.[hs.id];
      if (!hsLoc) return hs;
      return {
        ...hs,
        title: hsLoc.title || hs.title,
        subtitle: hsLoc.subtitle || hs.subtitle,
        infoText: hsLoc.infoText || hs.infoText,
      };
    });

    return {
      ...sector,
      name: loc.name || sector.name,
      tag: loc.tag || sector.tag,
      description: loc.description || sector.description,
      hotspots: localizedHotspots,
    };
  };

  const getLocalizedMission = (mission: Mission): Mission => {
    const loc = MISSION_TRANSLATIONS[language]?.[mission.id];
    if (!loc) return mission;

    return {
      ...mission,
      title: loc.title || mission.title,
      conceptTaught: loc.conceptTaught || mission.conceptTaught,
      summary: loc.summary || mission.summary,
      briefing: loc.briefing || mission.briefing,
      objectives: loc.objectives || mission.objectives,
      solutionHint: loc.solutionHint || mission.solutionHint,
    };
  };

  const getLocalizedDestination = (dest: SolarDestination): SolarDestination => {
    const loc = SOLAR_TRANSLATIONS[language]?.[dest.id];
    if (!loc) return dest;

    return {
      ...dest,
      name: loc.name || dest.name,
      type: (loc.type as any) || dest.type,
      description: loc.description || dest.description,
      tacticalIntel: loc.tacticalIntel || dest.tacticalIntel,
    };
  };

  const getLocalizedCrew = (crew: Record<string, CrewMember>): Record<string, CrewMember> => {
    const crewLoc = CREW_TRANSLATIONS[language];
    if (!crewLoc) return crew;

    const result: Record<string, CrewMember> = {};
    for (const [key, member] of Object.entries(crew)) {
      const memberLoc = crewLoc[key];
      if (memberLoc) {
        result[key] = {
          ...member,
          rank: memberLoc.rank || member.rank,
          role: memberLoc.role || member.role,
          bio: memberLoc.bio || member.bio,
        };
      } else {
        result[key] = member;
      }
    }
    return result;
  };

  const getLocalizedDilemma = (dilemma: RadioDilemma): RadioDilemma => {
    const loc = DILEMMA_TRANSLATIONS[language]?.[dilemma.id];
    if (!loc) return dilemma;

    const localizedChoices: [RadioDilemma['choices'][0], RadioDilemma['choices'][1]] = [
      {
        ...dilemma.choices[0],
        text: loc.choices[0]?.text || dilemma.choices[0].text,
        description: loc.choices[0]?.description || dilemma.choices[0].description,
        consequences: {
          ...dilemma.choices[0].consequences,
          radioResponse: {
            ...dilemma.choices[0].consequences.radioResponse,
            text: loc.choices[0]?.response || dilemma.choices[0].consequences.radioResponse.text,
          },
        },
      },
      {
        ...dilemma.choices[1],
        text: loc.choices[1]?.text || dilemma.choices[1].text,
        description: loc.choices[1]?.description || dilemma.choices[1].description,
        consequences: {
          ...dilemma.choices[1].consequences,
          radioResponse: {
            ...dilemma.choices[1].consequences.radioResponse,
            text: loc.choices[1]?.response || dilemma.choices[1].consequences.radioResponse.text,
          },
        },
      },
    ];

    return {
      ...dilemma,
      title: loc.title || dilemma.title,
      urgency: (loc.urgency as any) || dilemma.urgency,
      situation: loc.situation || dilemma.situation,
      choices: localizedChoices,
    };
  };

  const getLocalizedRank = (rank: string): string => {
    return RANKS_TRANSLATIONS[language]?.[rank] || rank;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        getLocalizedSector,
        getLocalizedMission,
        getLocalizedDestination,
        getLocalizedCrew,
        getLocalizedDilemma,
        getLocalizedRank,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
