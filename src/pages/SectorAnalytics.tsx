import { useState } from 'react';
import { PageHeader, SectionCard, KpiCard } from '../components/ui';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PROJECTS, SECTORS } from '../data/demoData';

const SECTOR_CODES: Record<string, string> = {
  'Education': 'SEC-EDU',
  'Health': 'SEC-HEALTH',
  'Roads & Transport': 'SEC-ROAD',
  'Water Supply': 'SEC-WATER',
  'Sanitation': 'SEC-SAN',
  'Community Infrastructure': 'SEC-COMM',
  'Agriculture': 'SEC-AGRI',
  'Sports': 'SEC-SPORT',
  'Culture': 'SEC-CULT',
  'Other': 'SEC-OTHR',
};

const SECTOR_METRICS = SECTORS.map((sec) => {
  const pList = PROJECTS.filter(p => p.sector === sec);
  const allocLakhs = pList.reduce((s, p) => s + p.sanctioned_cost, 0);
  const expLakhs = pList.reduce((s, p) => s + p.expenditure, 0);
  const completed = pList.filter(p => p.work_status === 'Completed').length;
  const compRate = pList.length > 0 ? (completed / pList.length) * 100 : 0;
  const delayed = pList.filter(p => p.delay_days > 0);
  const avgDelay = delayed.length > 0 ? Math.round(delayed.reduce((s, p) => s + p.delay_days, 0) / delayed.length) : 0;
  const anomalies = pList.filter(p => p.anomaly_type || p.risk_level === 'HIGH' || p.risk_level === 'CRITICAL').length;
  const anmRate = pList.length > 0 ? (anomalies / pList.length) * 100 : 0;

  return {
    sector: sec,
    code: SECTOR_CODES[sec] || 'SEC-GEN',
    allocationCr: parseFloat((allocLakhs / 100).toFixed(1)),
    expenditureCr: parseFloat((expLakhs / 100).toFixed(1)),
    completionRate: parseFloat(compRate.toFixed(1)),
    avgDelayDays: avgDelay,
    anomalyRate: parseFloat(anmRate.toFixed(1)),
    priorityWeight: sec === 'Health' ? 1.3 : sec === 'Water Supply' ? 1.25 : sec === 'Education' ? 1.2 : 1.1,
  };
});

export default function SectorAnalytics() {
  const [selectedSector, setSelectedSector] = useState(SECTOR_METRICS[0]);

  const topAlloc = [...SECTOR_METRICS].sort((a, b) => b.allocationCr - a.allocationCr)[0];
  const topComp = [...SECTOR_METRICS].sort((a, b) => b.completionRate - a.completionRate)[0];
  const topFlags = [...SECTOR_METRICS].sort((a, b) => b.anomalyRate - a.anomalyRate)[0];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sector-Wise Analytics & Infrastructure Matrix"
        subtitle="Spending efficiency, completion velocity, and anomaly distribution across development sectors"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Core Sectors" value={`${SECTORS.length} Master Sectors`} subtitle="MPLADS 2023 Guidelines" color="blue" />
        <KpiCard title="Highest Allocation" value={topAlloc.sector} subtitle={`₹${topAlloc.allocationCr} Cr allocated`} color="blue" />
        <KpiCard title="Highest Completion Rate" value={`${topComp.sector} (${topComp.completionRate}%)`} subtitle={`Avg ${topComp.avgDelayDays} days delay`} color="green" />
        <KpiCard title="Highest Review Flags" value={`${topFlags.sector} (${topFlags.anomalyRate}%)`} subtitle="Cost overruns & flags" color="red" />
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
                    className={`cursor-pointer transition-colors ${selectedSector.code === s.code ? 'bg-blue-50/80 ring-1 ring-blue-300' : 'hover:bg-blue-50/50'}`}
                  >
                    <td className="font-mono font-bold text-[#003580]">{s.code}</td>
                    <td className="font-semibold text-gray-900">{s.sector}</td>
                    <td><span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{s.priorityWeight}x</span></td>
                    <td className="font-bold">₹{s.allocationCr}</td>
                    <td className="text-emerald-700 font-bold">₹{s.expenditureCr}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded overflow-hidden">
                          <div className="h-full bg-blue-800 rounded" style={{ width: `${util}%` }} />
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
