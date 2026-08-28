import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projects',
    'nav.aiAnalytics': 'AI Analytics Modules',
    'nav.aiRisk': 'AI Risk Analysis',
    'nav.anomalies': 'Anomaly Detection',
    'nav.fundMonitoring': 'Fund Monitoring',
    'nav.mpAnalytics': 'MP Analytics',
    'nav.stateAnalytics': 'State Analytics',
    'nav.mapView': 'Map View',
    'nav.alerts': 'Alerts',
    'nav.reports': 'Reports',
    'nav.dataExplorer': 'Data Explorer',
    'nav.aiModel': 'AI Model Pipeline',
    'nav.citizenPortal': 'Citizen Portal',
    'nav.settings': 'Settings',
    'nav.login': 'Login / Switch Role',
    'nav.logout': 'Logout',

    // Header & TopBar
    'topbar.systemTitle': 'MPLADS AI Insight',
    'topbar.ministry': 'Ministry of Statistics and Programme Implementation',
    'topbar.prototype': 'SIH 2026 Prototype',
    'topbar.role': 'Active Role',
    'topbar.switchRole': 'Switch Role',

    // Landing Page
    'landing.title': 'AI-Powered MPLADS Monitoring & Anomaly Detection System',
    'landing.subtitle': 'Detect anomalies. Monitor funds. Improve project efficiency. Strengthen accountability in MPLAD Scheme implementation.',
    'landing.openDashboard': 'Open Monitoring Dashboard',
    'landing.exploreData': 'Explore Public Data',
    'landing.demoBadge': 'Demo Environment — Prototype for SIH 2026 Problem Statement 26102',
    'landing.loginBtn': 'Login to Portal',
    'landing.statWorks': 'Works Monitored',
    'landing.statFunds': 'Funds Tracked',
    'landing.statAnomalies': 'Anomalies Detected',
    'landing.statMps': 'MPs Covered',

    // Common Actions
    'action.search': 'Search',
    'action.export': 'Export Report',
    'action.investigate': 'Investigate',
    'action.filter': 'Filter',
    'action.reset': 'Reset',
    'action.view': 'View',
    'action.close': 'Close',
    'action.submit': 'Submit',
    'action.back': 'Back',

    // Roles
    'role.officer': 'Ministry Officer (MoSPI)',
    'role.collector': 'District Collector',
    'role.citizen': 'Citizen Auditor',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड (Dashboard)',
    'nav.projects': 'परियोजनाएं (Projects)',
    'nav.aiAnalytics': 'एआई विश्लेषण मॉड्यूल',
    'nav.aiRisk': 'एआई जोखिम विश्लेषण',
    'nav.anomalies': 'विसंगति पहचान (Anomalies)',
    'nav.fundMonitoring': 'निधि निगरानी (Fund Monitoring)',
    'nav.mpAnalytics': 'सांसद विश्लेषण (MP Analytics)',
    'nav.stateAnalytics': 'राज्य विश्लेषण (State Analytics)',
    'nav.mapView': 'मानचित्र दृश्य (Map View)',
    'nav.alerts': 'सतर्कता सूचनाएं (Alerts)',
    'nav.reports': 'प्रतिवेदन (Reports)',
    'nav.dataExplorer': 'डेटा एक्सप्लोरर',
    'nav.aiModel': 'एआई मॉडल पाइपलाइन',
    'nav.citizenPortal': 'नागरिक पोर्टल (Citizen)',
    'nav.settings': 'सेटिंग्स (Settings)',
    'nav.login': 'लॉगिन / भूमिका बदलें',
    'nav.logout': 'लॉग आउट',

    // Header & TopBar
    'topbar.systemTitle': 'एमपीलैड्स एआई इनसाइट',
    'topbar.ministry': 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)',
    'topbar.prototype': 'स्मार्ट इंडिया हैकथॉन 2026 प्रोटोटाइप',
    'topbar.role': 'सक्रिय भूमिका',
    'topbar.switchRole': 'भूमिका बदलें',

    // Landing Page
    'landing.title': 'एआई-संचालित एमपीलैड्स निगरानी एवं विसंगति पहचान प्रणाली',
    'landing.subtitle': 'विसंगतियों की पहचान करें। निधियों की निगरानी करें। परियोजना दक्षता में सुधार करें और एमपीलैड्स योजना में जवाबदेही सुनिश्चित करें।',
    'landing.openDashboard': 'निगरानी डैशबोर्ड खोलें',
    'landing.exploreData': 'सार्वजनिक डेटा देखें',
    'landing.demoBadge': 'डेमो वातावरण — एसआईएच 2026 समस्या विवरण 26102 प्रोटोटाइप',
    'landing.loginBtn': 'पोर्टल लॉगिन',
    'landing.statWorks': 'कार्य निगरानी',
    'landing.statFunds': 'निधि ट्रैक की गई',
    'landing.statAnomalies': 'विसंगतियाँ चिन्हित',
    'landing.statMps': 'सांसद सम्मिलित',

    // Common Actions
    'action.search': 'खोजें',
    'action.export': 'रिपोर्ट निर्यात करें',
    'action.investigate': 'जांच करें',
    'action.filter': 'फ़िल्टर',
    'action.reset': 'रीसेट',
    'action.view': 'देखें',
    'action.close': 'बंद करें',
    'action.submit': 'जमा करें',
    'action.back': 'वापस जाएं',

    // Roles
    'role.officer': 'मंत्रालय अधिकारी (MoSPI)',
    'role.collector': 'जिलाधिकारी / कलेक्टर',
    'role.citizen': 'नागरिक अंकेक्षक (Citizen)',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mplads_lang') as Language | null;
    return saved === 'hi' ? 'hi' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mplads_lang', lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
