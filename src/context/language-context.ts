import { createContext } from 'react';

export type Language = 'en' | 'hi';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projects',
    'nav.sectorAnalytics': 'Sector Analytics',
    'nav.aiAnalytics': 'AI Analytics Modules',
    'nav.aiRisk': 'AI Risk Analysis',
    'nav.anomalies': 'Anomaly Detection',
    'nav.fundMonitoring': 'Fund Monitoring',
    'nav.mpAnalytics': 'MP Analytics',
    'nav.stateAnalytics': 'State Analytics',
    'nav.mapView': 'Priority Map View',
    'nav.dataSources': 'Data Sources & Registry',
    'nav.dataQuality': 'Data Quality & ETL',
    'nav.alerts': 'Alerts',
    'nav.reports': 'Reports',
    'nav.dataExplorer': 'Data Explorer',
    'nav.aiModel': 'AI Model Pipeline',
    'nav.citizenPortal': 'Citizen Portal',
    'nav.settings': 'Settings',
    'nav.login': 'Login / Switch Role',
    'nav.logout': 'Logout',
    'topbar.systemTitle': 'MPLADS AI Insight',
    'topbar.ministry': 'Ministry of Statistics and Programme Implementation',
    'topbar.prototype': 'SIH 2026 Prototype',
    'topbar.role': 'Active Role',
    'topbar.switchRole': 'Switch Role',
    'role.officer': 'Ministry Officer (PMO/MoSPI)',
    'role.collector': 'District Collector / DM',
    'role.citizen': 'Citizen Auditor',
  },
  hi: {
    'nav.dashboard': 'डैशबोर्ड (Dashboard)',
    'nav.projects': 'परियोजनाएं (Projects)',
    'nav.sectorAnalytics': 'क्षेत्रवार विश्लेषण (Sector)',
    'nav.aiAnalytics': 'एआई विश्लेषण मॉड्यूल (AI)',
    'nav.aiRisk': 'एआई जोखिम विश्लेषण (Risk)',
    'nav.anomalies': 'विसंगति पहचान (Anomalies)',
    'nav.fundMonitoring': 'निधि निगरानी (Funds)',
    'nav.mpAnalytics': 'सांसद विश्लेषण (MP)',
    'nav.stateAnalytics': 'राज्य विश्लेषण (State)',
    'nav.mapView': 'मानचित्र दृश्य (Map View)',
    'nav.dataSources': 'डेटा स्रोत एवं रजिस्टर',
    'nav.dataQuality': 'डेटा गुणवत्ता एवं ईटीएल',
    'nav.alerts': 'अलर्ट केंद्र (Alerts)',
    'nav.reports': 'रिपोर्ट्स (Reports)',
    'nav.dataExplorer': 'डेटा एक्सप्लोरर (MIS)',
    'nav.aiModel': 'एआई मॉडल अंतर्दृष्टि',
    'nav.citizenPortal': 'नागरिक पोर्टल (Public)',
    'nav.settings': 'सेटिंग्स (Settings)',
    'nav.login': 'लॉगिन / पद बदलें',
    'nav.logout': 'लॉगआउट',
    'topbar.systemTitle': 'एमपीलैड्स एआई इनसाइट',
    'topbar.ministry': 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय',
    'topbar.prototype': 'एसआईएच 2026 प्रोटोटाइप',
    'topbar.role': 'सक्रिय पद',
    'topbar.switchRole': 'पद बदलें',
    'role.officer': 'मंत्रालय अधिकारी (MoSPI)',
    'role.collector': 'जिलाधिकारी / कलेक्टर',
    'role.citizen': 'नागरिक अंकेक्षक (Citizen)',
  },
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
