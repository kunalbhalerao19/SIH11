import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, ChevronDown, User, AlertTriangle, Database, Globe, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export function TopBar({ title = 'Dashboard', subtitle }: TopBarProps) {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [search, setSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const roleStyles = {
    officer: 'bg-blue-100 text-blue-800 border-blue-200',
    collector: 'bg-amber-100 text-amber-800 border-amber-200',
    citizen: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  }[role];

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 sticky top-0 z-40 gap-4">
      {/* Left: Page Title */}
      <div>
        <h1 className="m-0 text-base font-bold text-[#003580] leading-tight">{title}</h1>
        {subtitle && <p className="m-0 text-[11px] text-gray-500">{subtitle}</p>}
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-sm relative hidden md:block">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search project ID, MP, constituency..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-xs bg-gray-50 focus:bg-white focus:outline-none focus:border-[#003580] text-gray-700 transition-colors"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Language Toggle (EN / HI) */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-300 hover:border-[#003580] bg-gray-50 hover:bg-blue-50 text-xs font-semibold text-gray-700 transition-colors"
          title="Change language / भाषा बदलें"
        >
          <Globe className="w-3.5 h-3.5 text-[#003580]" />
          <span>{language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
        </button>

        {/* Role Badge */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${roleStyles}`}>
          <Shield className="w-3 h-3" />
          <span>{t(`role.${role}`)}</span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => navigate('/alerts')}
          className="relative p-1.5 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100 transition-colors"
          title="View Active Alerts"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span className="absolute 1 top-0 right-0 w-3.5 h-3.5 bg-amber-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
            7
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 cursor-pointer pl-3 border-l border-gray-200 hover:opacity-90"
          >
            <div className="w-8 h-8 rounded-full bg-[#003580] text-white flex items-center justify-center text-xs font-bold shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[120px]">{user.name}</div>
              <div className="text-[10px] text-gray-500 truncate max-w-[120px]">{user.jurisdiction}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>

          {/* Profile Menu Popup */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-xs font-bold text-gray-900">{user.name}</div>
                <div className="text-[11px] text-gray-600 font-medium">{user.designation}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{user.jurisdiction}</div>
                <div className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-blue-50 text-[#003580] border border-blue-200">
                  Role: {role}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                >
                  <User className="w-3.5 h-3.5 text-[#003580]" />
                  <span>{t('nav.login')}</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
