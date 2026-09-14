import { useState } from 'react';
import { PageHeader, SectionCard } from '../components/ui';
import { User, Bell, Database, Save } from 'lucide-react';
import { APP_CONFIG } from '../lib/config';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'system'>('profile');

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure system preferences and user settings" />

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
        {/* Sidebar nav */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden self-start">
          {[
            { id: 'profile', icon: <User size={15} />, label: 'User Profile' },
            { id: 'notifications', icon: <Bell size={15} />, label: 'Notifications' },
            { id: 'system', icon: <Database size={15} />, label: 'System Info' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`w-full text-left flex items-center gap-2.5 px-3.5 py-3 border-b border-gray-100 cursor-pointer text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-[#003580] font-bold bg-blue-50/80 border-l-[3px] border-l-[#003580]'
                    : 'text-slate-700 hover:bg-slate-50 border-l-[3px] border-l-transparent'
                }`}
              >
                {item.icon} {item.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {/* User Profile Tab */}
          {activeTab === 'profile' && (
            <SectionCard title="User Profile" subtitle="Government official profile and credentials">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { label: 'Full Name', value: 'Govt. Official', type: 'text' },
                  { label: 'Email', value: 'official@mospi.gov.in', type: 'email' },
                  { label: 'Designation', value: 'Deputy Director, MoSPI', type: 'text' },
                  { label: 'Department', value: 'Statistics & Programme Implementation', type: 'text' },
                  { label: 'Employee ID', value: 'MOSPI-20261234', type: 'text' },
                  { label: 'Access Level', value: 'Admin', type: 'text' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      defaultValue={f.value}
                      className="w-full border border-slate-300 bg-white text-slate-900 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3.5">
                <button className="bg-[#003580] hover:opacity-90 text-white px-4 py-2 rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </SectionCard>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <SectionCard title="Notification Preferences" subtitle="Alert and reporting notifications">
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Critical Risk Alerts', desc: 'Alert when AI score ≥ 81 (CRITICAL)', enabled: true },
                  { label: 'High Risk Alerts', desc: 'Alert when AI score 61-80 (HIGH)', enabled: true },
                  { label: 'New Anomaly Detected', desc: 'Alert for every new anomaly', enabled: true },
                  { label: 'Weekly Summary Report', desc: 'Weekly digest of monitoring metrics', enabled: false },
                  { label: 'Fund Utilization Alerts', desc: 'Alert when unspent balance exceeds threshold', enabled: false },
                ].map(pref => (
                  <div
                    key={pref.label}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{pref.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{pref.desc}</div>
                    </div>
                    <div
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                        pref.enabled ? 'bg-[#003580]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                          pref.enabled ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* System Info Tab */}
          {activeTab === 'system' && (
            <SectionCard title="System Information" subtitle="Platform metadata and environment parameters">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: 'Platform Title', value: APP_CONFIG.title },
                  { label: 'Version', value: `v${APP_CONFIG.version}` },
                  { label: 'Environment', value: 'SIH 2026 Prototype' },
                  { label: 'API Base URL', value: APP_CONFIG.apiBaseUrl },
                  { label: 'Confidence Threshold', value: `${(APP_CONFIG.confidenceThreshold * 100).toFixed(0)}%` },
                  { label: 'Mock Data Mode', value: APP_CONFIG.enableMockData ? 'Enabled (Certified Seed)' : 'Live DB' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="p-3 bg-slate-50 rounded border border-slate-200"
                  >
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="text-xs font-bold text-slate-800 break-all">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                <strong>Prototype Notice:</strong> This system is a demonstration prototype built for SIH 2026. It does not connect to official MPLADS data and is not affiliated with the Government of India's official MPLADS portal.
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
