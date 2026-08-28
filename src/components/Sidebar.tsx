import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Brain, AlertTriangle, DollarSign,
  Users, Map, Bell, FileText, Database, Settings, ChevronRight,
  Activity, BarChart3, ShieldAlert, Globe, Layers, UserCheck
} from 'lucide-react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface NavItemDef {
  path: string;
  translationKey: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  allowedRoles: UserRole[];
}

const ALL_NAV_ITEMS: NavItemDef[] = [
  { path: '/dashboard', translationKey: 'nav.dashboard', icon: LayoutDashboard, allowedRoles: ['officer', 'collector', 'citizen'] },
  { path: '/projects', translationKey: 'nav.projects', icon: FolderOpen, allowedRoles: ['officer', 'collector', 'citizen'] },
  { path: '/ai-analytics', translationKey: 'nav.aiAnalytics', icon: Layers, allowedRoles: ['officer'] },
  { path: '/ai-risk', translationKey: 'nav.aiRisk', icon: Brain, allowedRoles: ['officer', 'collector'] },
  { path: '/anomalies', translationKey: 'nav.anomalies', icon: AlertTriangle, allowedRoles: ['officer', 'collector'] },
  { path: '/fund-monitoring', translationKey: 'nav.fundMonitoring', icon: DollarSign, allowedRoles: ['officer', 'collector'] },
  { path: '/mp-analytics', translationKey: 'nav.mpAnalytics', icon: Users, allowedRoles: ['officer', 'collector'] },
  { path: '/state-analytics', translationKey: 'nav.stateAnalytics', icon: BarChart3, allowedRoles: ['officer', 'collector'] },
  { path: '/map', translationKey: 'nav.mapView', icon: Map, allowedRoles: ['officer', 'collector', 'citizen'] },
  { path: '/alerts', translationKey: 'nav.alerts', icon: Bell, allowedRoles: ['officer', 'collector'] },
  { path: '/reports', translationKey: 'nav.reports', icon: FileText, allowedRoles: ['officer', 'collector', 'citizen'] },
  { path: '/data-explorer', translationKey: 'nav.dataExplorer', icon: Database, allowedRoles: ['officer', 'collector', 'citizen'] },
  { path: '/ai-model', translationKey: 'nav.aiModel', icon: Activity, allowedRoles: ['officer'] },
  { path: '/citizen', translationKey: 'nav.citizenPortal', icon: Globe, allowedRoles: ['officer', 'collector', 'citizen'] },
  { path: '/settings', translationKey: 'nav.settings', icon: Settings, allowedRoles: ['officer'] },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const { t } = useLanguage();

  // Filter items visible to the active user role
  const visibleNavItems = ALL_NAV_ITEMS.filter(item => item.allowedRoles.includes(role));

  return (
    <aside className="w-[220px] min-h-screen bg-[#003580] flex flex-col fixed top-0 left-0 z-50 shadow-xl border-r border-blue-900/40 select-none">
      {/* Logo Header */}
      <div className="p-3.5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center shadow-sm shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-[13px] leading-tight">MPLADS AI Insight</div>
            <div className="text-white/60 text-[9px] mt-0.5 tracking-wide">Sentinel Surveillance</div>
          </div>
        </div>
      </div>

      {/* Active Role Indicator */}
      <div className="px-3.5 py-2 bg-black/15 border-b border-white/5 flex items-center justify-between">
        <div className="text-[10px] text-white/70">
          <span className="text-white/40">Role: </span>
          <span className="font-bold text-[#FF9E44] capitalize">{role}</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-[9px] text-white/80 hover:text-white underline cursor-pointer"
        >
          Switch
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-2">
        {visibleNavItems.map(({ path, translationKey, icon: Icon }) => {
          const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path + '/'));
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-2.5 px-3.5 py-2 text-xs transition-all ${
                isActive
                  ? 'text-white font-bold bg-white/15 border-l-[3px] border-[#FF6B00]'
                  : 'text-white/75 hover:text-white hover:bg-white/10 border-l-[3px] border-transparent'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-[#FF6B00]' : 'text-white/70'} />
              <span className="flex-1 truncate">{t(translationKey)}</span>
              {isActive && <ChevronRight size={12} className="text-white/80 shrink-0" />}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile & Ministry Badge */}
      <div className="p-3 border-t border-white/10 text-[10px] text-white/50 bg-black/10">
        <div className="font-semibold text-white/80 truncate">{user.name}</div>
        <div className="truncate text-white/40 text-[9px]">{user.jurisdiction}</div>
        <div className="mt-1.5 pt-1.5 border-t border-white/5 text-[9px] text-white/40">
          MoSPI • SIH 2026 Prototype
        </div>
      </div>
    </aside>
  );
}
