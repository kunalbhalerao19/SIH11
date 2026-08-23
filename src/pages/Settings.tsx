import { PageHeader, SectionCard } from '../components/ui';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Eye, Save } from 'lucide-react';

export default function Settings() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure system preferences and user settings" />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Sidebar nav */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden', alignSelf: 'flex-start' }}>
          {[
            { icon: <User size={15} />, label: 'User Profile' },
            { icon: <Bell size={15} />, label: 'Notifications' },
            { icon: <Shield size={15} />, label: 'Security & Access' },
            { icon: <Database size={15} />, label: 'Data Settings' },
            { icon: <Eye size={15} />, label: 'Display' },
          ].map((item, i) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
              borderBottom: '1px solid #f3f4f6', cursor: 'pointer',
              color: i === 0 ? '#003580' : '#374151', fontWeight: i === 0 ? 600 : 400,
              background: i === 0 ? '#eff6ff' : 'white', fontSize: 13,
            }}>
              {item.icon} {item.label}
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionCard title="User Profile">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Full Name', value: 'Govt. Official', type: 'text' },
                { label: 'Email', value: 'official@mospi.gov.in', type: 'email' },
                { label: 'Designation', value: 'Deputy Director, MoSPI', type: 'text' },
                { label: 'Department', value: 'Statistics & Programme Implementation', type: 'text' },
                { label: 'Employee ID', value: 'MOSPI-20261234', type: 'text' },
                { label: 'Access Level', value: 'Admin', type: 'text' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <input type={f.type} defaultValue={f.value} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '7px 10px', fontSize: 13, boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <button style={{ background: '#003580', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 4, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Save size={14} /> Save Changes
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Notification Preferences">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Critical Risk Alerts', desc: 'Alert when AI score ≥ 81 (CRITICAL)', enabled: true },
                { label: 'High Risk Alerts', desc: 'Alert when AI score 61-80 (HIGH)', enabled: true },
                { label: 'New Anomaly Detected', desc: 'Alert for every new anomaly', enabled: true },
                { label: 'Weekly Summary Report', desc: 'Weekly digest of monitoring metrics', enabled: false },
                { label: 'Fund Utilization Alerts', desc: 'Alert when unspent balance exceeds threshold', enabled: false },
              ].map((pref, i) => (
                <div key={pref.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{pref.label}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{pref.desc}</div>
                  </div>
                  <div style={{
                    width: 40, height: 22, borderRadius: 11,
                    background: pref.enabled ? '#003580' : '#d1d5db',
                    position: 'relative', cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: 'white',
                      position: 'absolute', top: 2,
                      left: pref.enabled ? 20 : 2,
                      transition: 'left 0.2s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="System Information">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Version', value: '1.0.0-demo' },
                { label: 'Environment', value: 'SIH 2026 Demo' },
                { label: 'Data Source', value: 'Synthetic Demo Data' },
                { label: 'AI Model Version', value: 'v0.1-prototype' },
                { label: 'Last Data Refresh', value: '22 Aug 2026' },
                { label: 'Build Date', value: 'Aug 2026' },
              ].map(item => (
                <div key={item.label} style={{ padding: '12px', background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6, fontSize: 11, color: '#92400e' }}>
              <strong>Prototype Notice:</strong> This system is a demonstration prototype built for SIH 2026. It does not connect to official MPLADS data and is not affiliated with the Government of India's official MPLADS portal.
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
