import React, { useState } from 'react';
import { PageHeader, SectionCard, KpiCard } from '../components/ui';
import { SECTOR_SPEND, PROJECTS } from '../data/demoData';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Layers, TrendingUp, AlertTriangle, Clock, DollarSign, CheckCircle2, ShieldAlert } from 'lucide-react';

const SECTOR_METRICS = [
  { sector: 'Drinking Water Facility', code: 'SEC-DRINK', allocationCr: 215.4, expenditureCr: 198.2, completionRate: 84.5, avgDelayDays: 22, anomalyRate: 3.2, priorityWeight: 1.25 },
  { sector: 'Education', code: 'SEC-EDU', allocationCr: 248.6, expenditureCr: 225.8, completionRate: 88.0, avgDelayDays: 14, anomalyRate: 1.8, priorityWeight: 1.20 },
  { sector: 'Health & Family Welfare', code: 'SEC-HEALTH', allocationCr: 192.3, expenditureCr: 174.5, completionRate: 82.1, avgDelayDays: 28, anomalyRate: 4.1, priorityWeight: 1.30 },
  { sector: 'Sanitation & Public Health', code: 'SEC-SAN', allocationCr: 145.8, expenditureCr: 128.4, completionRate: 79.4, avgDelayDays: 35, anomalyRate: 5.4, priorityWeight: 1.15 },
  { sector: 'Roads & Pathways', code: 'SEC-ROAD', allocationCr: 285.2, expenditureCr: 242.6, completionRate: 74.2, avgDelayDays: 48, anomalyRate: 7.8, priorityWeight: 1.10 },
  { sector: 'Irrigation & Water Harvesting', code: 'SEC-IRRI', allocationCr: 110.5, expenditureCr: 94.2, completionRate: 81.0, avgDelayDays: 31, anomalyRate: 3.9, priorityWeight: 1.15 },
  { sector: 'Community & Cultural Centers', code: 'SEC-COMM', allocationCr: 88.4, expenditureCr: 72.1, completionRate: 71.5, avgDelayDays: 54, anomalyRate: 8.5, priorityWeight: 0.90 },
  { sector: 'Non-Conventional Energy', code: 'SEC-RENEW', allocationCr: 65.2, expenditureCr: 58.6, completionRate: 91.2, avgDelayDays: 8, anomalyRate: 1.2, priorityWeight: 1.05 },
];

const COLORS = ['#003580', '#0052cc', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

export default function SectorAnalytics() {
  const [selectedSector, setSelectedSector] = useState(SECTOR_METRICS[0]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sector-Wise Analytics & Infrastructure Matrix"
        subtitle="Spending efficiency, completion velocity, and anomaly distribution across development sectors"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Core Sectors" value="8 Master Sectors" subtitle="MPLADS 2023 Guidelines" color="blue" />
        <KpiCard title="Highest Allocation" value="Roads & Pathways" subtitle="₹285.2 Cr (24.8%)" color="blue" />
        <KpiCard title="Highest Completion Rate" value="Solar & Energy (91.2%)" subtitle="Avg 8 days delay" color="green" />
        <KpiCard title="Highest Review Flags" value="Community Halls (8.5%)" subtitle="Cost overruns & delays" color="red" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Sector Allocation vs Expenditure (₹ Crore)" subtitle="Fund flow tracking by developmental domain">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SECTOR_METRICS} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="code" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="allocationCr" name="Allocated (₹ Cr)" fill="#003580" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenditureCr" name="Utilized (₹ Cr)" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Completion Rate vs Average Project Delay" subtitle="Efficiency comparison across sectors">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SECTOR_METRICS} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="code" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line type="monotone" dataKey="completionRate" name="Completion Rate (%)" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="avgDelayDays" name="Avg Delay (Days)" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Sector Performance Matrix Table */}
      <SectionCard title="Master Sector Efficiency Table" subtitle="Detailed telemetry by sector code">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Sector Code</th>
                <th>Sector Name</th>
                <th>Priority Weight</th>
                <th>Allocation (Cr)</th>
                <th>Utilized (Cr)</th>
                <th>Utilization %</th>
                <th>Completion Rate</th>
                <th>Avg Delay</th>
                <th>Anomaly Flag Rate</th>
              </tr>
            </thead>
            <tbody>
              {SECTOR_METRICS.map(s => {
                const util = (s.expenditureCr / s.allocationCr) * 100;
                return (
                  <tr
                    key={s.code}
                    onClick={() => setSelectedSector(s)}
                    className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="font-mono font-bold text-[#003580]">{s.code}</td>
                    <td className="font-semibold text-gray-900">{s.sector}</td>
                    <td><span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{s.priorityWeight}x</span></td>
                    <td className="font-bold">₹{s.allocationCr}</td>
                    <td className="text-emerald-700 font-bold">₹{s.expenditureCr}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-800 rounded-full" style={{ width: `${util}%` }} />
                        </div>
                        <span className="text-xs font-bold">{util.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`font-bold ${s.completionRate >= 85 ? 'text-emerald-700' : s.completionRate >= 75 ? 'text-amber-700' : 'text-red-700'}`}>
                        {s.completionRate}%
                      </span>
                    </td>
                    <td>{s.avgDelayDays} Days</td>
                    <td>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        s.anomalyRate > 5.0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {s.anomalyRate}% Flagged
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
