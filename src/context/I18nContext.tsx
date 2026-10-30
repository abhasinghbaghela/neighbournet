import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Navigation
  appName: { en: 'NeighbourNet', hi: 'नेबरनेट' },
  tagline: { en: 'Intelligent Community Safety Network', hi: 'स्मार्ट सामुदायिक सुरक्षा नेटवर्क' },
  navHome: { en: 'Home', hi: 'होम' },
  navMap: { en: 'Live Map', hi: 'लाइव मैप' },
  navReport: { en: 'Report Issue', hi: 'शिकायत दर्ज करें' },
  navFeed: { en: 'Community Feed', hi: 'समुदाय फ़ीड' },
  navHealth: { en: 'Health Score', hi: 'स्वास्थ्य स्कोर' },
  navInsights: { en: 'AI Insights', hi: 'एआई अंतर्दृष्टि' },
  navAdmin: { en: 'Admin Portal', hi: 'प्रशासन पोर्टल' },
  navLeaderboard: { en: 'Leaderboard', hi: 'लीडरबोर्ड' },
  emergencySos: { en: 'Emergency SOS', hi: 'आपातकालीन सहायता' },

  // Severities
  sevLow: { en: 'Low', hi: 'कम' },
  sevMedium: { en: 'Medium', hi: 'मध्यम' },
  sevHigh: { en: 'High', hi: 'गंभीर' },
  sevCritical: { en: 'Critical', hi: 'अति-गंभीर' },

  // Statuses
  statUnverified: { en: 'Unverified', hi: 'अपुष्ट' },
  statCommVerified: { en: 'Community Verified', hi: 'समुदाय द्वारा पुष्ट' },
  statAuthVerified: { en: 'Authority Verified', hi: 'प्राधिकरण द्वारा पुष्ट' },
  statInProgress: { en: 'In Progress', hi: 'प्रक्रिया जारी' },
  statResolved: { en: 'Resolved', hi: 'समाधान संपन्न' },
  statDisputed: { en: 'Disputed', hi: 'विवादित' },

  // Categories
  catTheft: { en: 'Theft & Security', hi: 'चोरी व सुरक्षा' },
  catRoad: { en: 'Road Hazards & Potholes', hi: 'सड़क गड्ढे व खतरे' },
  catWater: { en: 'Water Leakage & Shortage', hi: 'जल रिसाव व किल्लत' },
  catElectricity: { en: 'Electricity & Outages', hi: 'बिजली कटौती व तार' },
  catFire: { en: 'Fire & Emergencies', hi: 'आग व आपात स्थिति' },
  catAnimals: { en: 'Stray Animals', hi: 'आवारा पशु समस्या' },
  catGarbage: { en: 'Garbage & Sanitation', hi: 'कचरा व स्वच्छता' },
  catCivic: { en: 'Civic & Infrastructure', hi: 'नागरिक अवसंरचना' },

  // Actions & Buttons
  reportNew: { en: 'Report an Incident', hi: 'घटना रिपोर्ट करें' },
  confirmIncident: { en: 'Confirm (I see this too)', hi: 'पुष्टि करें (मैंने भी देखा)' },
  disputeIncident: { en: 'Dispute / Not True', hi: 'अस्वीकार करें / गलत है' },
  flagFalse: { en: 'Flag as False Report', hi: 'गलत रिपोर्ट चिह्नित करें' },
  anonymousToggle: { en: 'Post Anonymously', hi: 'गुमनाम रूप से पोस्ट करें' },
  useGps: { en: 'Detect My Location', hi: 'मेरा स्थान पहचानें' },
  scanWithAi: { en: 'AI Vision Analysis', hi: 'एआई चित्र विश्लेषण' },
  analyzingImage: { en: 'AI analyzing image...', hi: 'एआई चित्र का विश्लेषण कर रहा है...' },
  voiceDictation: { en: 'Voice to Text', hi: 'आवाज से लिखें' },
  listening: { en: 'Listening... speak now', hi: 'सुन रहे हैं... बोलिए' },
  assignAuthority: { en: 'Assign Department', hi: 'विभाग को सौंपें' },
  markResolved: { en: 'Mark Resolved', hi: 'समाधान चिह्नित करें' },
  duplicateDetected: { en: 'Possible Duplicate Detected', hi: 'संभावित डुप्लिकेट घटना मिली' },
  offlineSaved: { en: 'Saved offline. Will sync when reconnected.', hi: 'ऑफ़लाइन सहेजा गया। इंटरनेट आने पर सिंक होगा।' },
  healthScoreTitle: { en: 'Neighbourhood Health Score', hi: 'पड़ोस स्वास्थ्य स्कोर' },
  demoMode: { en: 'Guided Hackathon Demo', hi: 'हैकथॉन डेमो गाइड' },
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('neighbournet_lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('neighbournet_lang', lang);
  }, [lang]);

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][lang] || translations[key].en;
    }
    return key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
