import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, User, AlertTriangle, Globe, LogOut, Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useLanguage } from '../context/useLanguage';
import { useTheme } from '../context/useTheme';

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export function TopBar({ title = 'Dashboard', subtitle }: TopBarProps) {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [search, setSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roleStyles = {
    officer: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    collector: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    citizen: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  }[role];

  return (
    <header className="h-14 bg-white dark:bg-[#111e38] border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-5 sticky top-0 z-40 gap-4 transition-colors">
      {/* Left: Page Title */}
      <div>
        <h1 className="m-0 text-base font-bold text-[#003580] dark:text-[#60a5fa] leading-tight">{title}</h1>
        {subtitle && <p className="m-0 text-[11px] text-gray-500 dark:text-slate-400">{subtitle}</p>}
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-sm relative hidden md:block">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search project ID, MP, constituency..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded text-xs bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-[#003580] dark:focus:border-blue-500 text-gray-700 dark:text-slate-200 transition-colors"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Language Toggle (EN / HI) */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-gray-300 dark:border-slate-700 hover:border-[#003580] dark:hover:border-blue-400 bg-gray-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-200 transition-colors cursor-pointer"
          title="Change language / भाषा बदलें"
        >
          <Globe className="w-3.5 h-3.5 text-[#003580] dark:text-blue-400" />
          <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
        </button>

        {/* Role Badge */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[11px] font-bold ${roleStyles}`}>
          <Shield className="w-3 h-3" />
          <span>{t(`role.${role}`)}</span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => navigate('/alerts')}
          className="relative p-1.5 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="View Active Alerts"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-amber-600 rounded text-[9px] text-white font-bold flex items-center justify-center">
            7
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 cursor-pointer pl-2.5 border-l border-gray-200 dark:border-slate-700 hover:opacity-90"
          >
            <div className="w-7 h-7 rounded bg-[#003580] dark:bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-none">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-gray-900 dark:text-slate-100 leading-tight truncate max-w-[120px]">{user.name}</div>
              <div className="text-[10px] text-gray-500 dark:text-slate-400 truncate max-w-[120px]">{user.jurisdiction}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
          </div>

          {/* Profile Menu Popup */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111e38] rounded-md shadow-lg border border-gray-200 dark:border-slate-800 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                <div className="text-xs font-bold text-gray-900 dark:text-slate-100">{user.name}</div>
                <div className="text-[11px] text-gray-600 dark:text-slate-300 font-medium">{user.designation}</div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">{user.jurisdiction}</div>
                <div className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-[#003580] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Role: {role}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#003580] dark:text-blue-400" />
                  <span>{t('nav.login')}</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
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
