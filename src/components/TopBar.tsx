import { Bell, Search, ChevronDown, User, AlertTriangle, Database } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export function TopBar({ title = 'Dashboard', subtitle }: TopBarProps) {
  const [search, setSearch] = useState('');
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <header style={{
      height: 56,
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      gap: 16,
    }}>
      {/* Left: Page title */}
      <div>
        <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#003580' }}>{title}</h1>
        {subtitle && <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>{subtitle}</p>}
      </div>

      {/* Center: Search */}
      <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input
          type="text"
          placeholder="Search project, MP, district..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 12px 6px 32px',
            border: '1px solid #e5e7eb',
            borderRadius: 4,
            fontSize: 12.5,
            background: '#f9fafb',
            outline: 'none',
            color: '#374151',
          }}
        />
      </div>

      {/* Right: Notifications, data update, profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Demo label */}
        <div style={{
          background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 4,
          padding: '3px 8px', fontSize: 10, color: '#92400e', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Database size={10} />
          Demo Environment
        </div>

        {/* Data Updated */}
        <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'right' }}>
          <div style={{ fontWeight: 500 }}>Data Updated</div>
          <div>{dateStr}, {timeStr}</div>
        </div>

        {/* Notifications */}
        <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
          <Bell size={18} color="#374151" />
          <span style={{
            position: 'absolute', top: 2, right: 2, width: 14, height: 14,
            background: '#dc2626', borderRadius: '50%', fontSize: 9, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
          }}>3</span>
        </button>

        {/* Alerts */}
        <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
          <AlertTriangle size={18} color="#ea580c" />
          <span style={{
            position: 'absolute', top: 2, right: 2, width: 14, height: 14,
            background: '#ea580c', borderRadius: '50%', fontSize: 9, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
          }}>7</span>
        </button>

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', borderLeft: '1px solid #e5e7eb', paddingLeft: 16 }}>
          <div style={{
            width: 30, height: 30, background: '#003580', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Govt. Official</div>
            <div style={{ fontSize: 10, color: '#6b7280' }}>MoSPI Administrator</div>
          </div>
          <ChevronDown size={14} color="#9ca3af" />
        </div>
      </div>
    </header>
  );
}
