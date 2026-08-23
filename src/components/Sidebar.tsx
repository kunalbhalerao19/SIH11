import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Brain, AlertTriangle, DollarSign,
  Users, Map, Bell, FileText, Database, Settings, ChevronRight,
  Activity, BarChart3, ShieldAlert, Globe
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderOpen },
  { path: '/ai-risk', label: 'AI Risk Analysis', icon: Brain },
  { path: '/anomalies', label: 'Anomaly Detection', icon: AlertTriangle },
  { path: '/fund-monitoring', label: 'Fund Monitoring', icon: DollarSign },
  { path: '/mp-analytics', label: 'MP Analytics', icon: Users },
  { path: '/state-analytics', label: 'State Analytics', icon: BarChart3 },
  { path: '/map', label: 'Map View', icon: Map },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/data-explorer', label: 'Data Explorer', icon: Database },
  { path: '/ai-model', label: 'AI Model', icon: Activity },
  { path: '/citizen', label: 'Citizen Portal', icon: Globe },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        background: '#003580',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldAlert size={22} color="#FF6B00" />
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>MPLADS AI Insight</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, marginTop: 2 }}>Anomaly & Fraud Detection</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <NavLink
              key={path}
              to={path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 14px',
                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: 12.5,
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid #FF6B00' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'white';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)';
                }
              }}
            >
              <Icon size={15} />
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && <ChevronRight size={12} />}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.12)', fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
        <div>Ministry of Statistics &amp; PI</div>
        <div>SIH 2026 — Prototype Demo</div>
      </div>
    </aside>
  );
}
