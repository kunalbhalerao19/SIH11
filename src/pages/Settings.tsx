import { useState } from 'react';
import { PageHeader, SectionCard } from '../components/ui';
import { User, Bell, Database, Eye, Save, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '../lib/config';
import { useTheme } from '../context/useTheme';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'system'>('appearance');

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure system preferences, appearance, and user settings" />

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
        {/* Sidebar nav */}
        <div className="bg-white dark:bg-[#111e38] border border-gray-200 dark:border-slate-800 rounded-md overflow-hidden self-start transition-colors">
          {[
            { id: 'appearance', icon: <Eye size={15} />, label: 'Appearance & Theme' },
            { id: 'profile', icon: <User size={15} />, label: 'User Profile' },
            { id: 'notifications', icon: <Bell size={15} />, label: 'Notifications' },
            { id: 'system', icon: <Database size={15} />, label: 'System Info' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`w-full text-left flex items-center gap-2.5 px-3.5 py-3 border-b border-gray-100 dark:border-slate-800/60 cursor-pointer text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-[#003580] dark:text-[#60a5fa] font-bold bg-blue-50/80 dark:bg-blue-950/40 border-l-[3px] border-l-[#003580] dark:border-l-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-l-[3px] border-l-transparent'
                }`}
              >
                {item.icon} {item.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {/* Appearance & Theme Tab */}
          {activeTab === 'appearance' && (
            <SectionCard title="Appearance & Theme" subtitle="Customize the visual interface and display mode">
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-3">
                  Color Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Light Theme Card */}
                  <div
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === 'light'
                        ? 'border-[#003580] bg-blue-50/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-slate-100">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span>Light Mode</span>
                      </div>
                      {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-[#003580]" />}
                    </div>
                    {/* Visual mockup of light mode */}
                    <div className="rounded border border-slate-200 bg-[#f1f3f6] p-2.5 space-y-1.5 pointer-events-none">
                      <div className="h-3 w-1/3 bg-[#003580] rounded-xs" />
                      <div className="h-6 bg-white rounded border border-slate-200" />
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="h-8 bg-white rounded border border-slate-200" />
                        <div className="h-8 bg-white rounded border border-slate-200" />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                      Clean high-contrast theme optimized for standard daytime office environments.
                    </div>
                  </div>

                  {/* Dark Theme Card */}
                  <div
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'border-blue-500 bg-blue-950/30 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-slate-100">
                        <Moon className="w-4 h-4 text-blue-400" />
                        <span>Dark Mode</span>
                      </div>
                      {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                    {/* Visual mockup of dark mode */}
                    <div className="rounded border border-slate-800 bg-[#0b1329] p-2.5 space-y-1.5 pointer-events-none">
                      <div className="h-3 w-1/3 bg-blue-600 rounded-xs" />
                      <div className="h-6 bg-[#111e38] rounded border border-slate-800" />
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="h-8 bg-[#111e38] rounded border border-slate-800" />
                        <div className="h-8 bg-[#111e38] rounded border border-slate-800" />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                      Deep navy charcoal palette reducing eye fatigue for surveillance and intensive audits.
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* User Profile Tab */}
          {(activeTab === 'profile' || activeTab === 'appearance') && (
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
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      defaultValue={f.value}
                      className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3.5">
                <button className="bg-[#003580] dark:bg-blue-600 hover:opacity-90 text-white px-4 py-2 rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </SectionCard>
          )}

          {/* Notifications Tab */}
          {(activeTab === 'notifications' || activeTab === 'appearance') && (
            <SectionCard title="Notification Preferences">
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
                    className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-800"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{pref.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{pref.desc}</div>
                    </div>
                    <div
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                        pref.enabled ? 'bg-[#003580] dark:bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
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
          {(activeTab === 'system' || activeTab === 'appearance') && (
            <SectionCard title="System Information">
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
                    className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-800"
                  >
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 break-all">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded text-xs text-amber-900 dark:text-amber-200">
                <strong>Prototype Notice:</strong> This system is a demonstration prototype built for SIH 2026. It does not connect to official MPLADS data and is not affiliated with the Government of India's official MPLADS portal.
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
