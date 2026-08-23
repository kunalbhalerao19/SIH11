import { useState } from 'react';
import { STATE_STATS } from '../data/demoData';
import type { StateStats } from '../types';
import { PageHeader, SectionCard, KpiCard } from '../components/ui';
import { RiskBadge } from '../components/RiskBadge';
import { formatNumber } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Map, AlertTriangle, TrendingUp, Search } from 'lucide-react';

type SortKey = keyof StateStats;

function getGrade(s: StateStats): { grade: string; color: string; bg: string } {
  if (s.completion_pct >= 85 && s.avg_risk_score < 30) return { grade: 'A', color: '#166534', bg: '#dcfce7' };
  if (s.completion_pct >= 75 && s.avg_risk_score < 45) return { grade: 'B', color: '#1e40af', bg: '#dbeafe' };
  if (s.completion_pct >= 60 && s.avg_risk_score < 60) return { grade: 'C', color: '#92400e', bg: '#fef3c7' };
  return { grade: 'D', color: '#991b1b', bg: '#fee2e2' };
}

function getRiskLevelForScore(score: number) {
  if (score >= 61) return 'HIGH';
  if (score >= 41) return 'MEDIUM';
  return 'LOW';
}

export default function StateAnalytics() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('funds_released');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedState, setSelectedState] = useState<StateStats | null>(null);

  const filtered = STATE_STATS
    .filter(s => !search || s.state.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const va = a[sortKey] as number;
      const vb = b[sortKey] as number;
      return sortDir === 'desc' ? vb - va : va - vb;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const top10Chart = [...STATE_STATS]
    .sort((a, b) => b.completion_pct - a.completion_pct)
    .slice(0, 10);

  const highRiskStates = STATE_STATS.filter(s => s.avg_risk_score >= 61).sort((a, b) => b.avg_risk_score - a.avg_risk_score);
  const mediumRiskStates = STATE_STATS.filter(s => s.avg_risk_score >= 41 && s.avg_risk_score < 61);
  const lowRiskStates = STATE_STATS.filter(s => s.avg_risk_score < 41);

  const totalFunds = STATE_STATS.reduce((s, x) => s + x.funds_released, 0);
  const avgCompletion = STATE_STATS.reduce((s, x) => s + x.completion_pct, 0) / STATE_STATS.length;

  const SortTh = ({ label, k }: { label: string; k: SortKey }) => (
    <th onClick={() => handleSort(k)} style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      {label} {sortKey === k ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}
    </th>
  );

  return (
    <div>
      <PageHeader title="State Analytics" subtitle="State-wise MPLADS performance, fund utilization and risk analysis" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <KpiCard title="States Covered" value="30" icon={<Map size={16} color="#003580" />} color="#003580" />
        <KpiCard title="Total Funds Released" value={`₹${(totalFunds / 100).toFixed(0)} Cr`} icon={<TrendingUp size={16} color="#16a34a" />} color="#16a34a" />
        <KpiCard title="Avg Completion Rate" value={`${avgCompletion.toFixed(1)}%`} color="#1e40af" />
        <KpiCard title="High Risk States" value={`${highRiskStates.length}`} icon={<AlertTriangle size={16} color="#dc2626" />} color="#dc2626" />
      </div>

      {/* Completion Chart */}
      <SectionCard title="Top 10 States by Completion Rate" subtitle="Works completed vs sanctioned">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={top10Chart} layout="vertical" margin={{ left: 120, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} fontSize={11} />
            <YAxis type="category" dataKey="state" fontSize={11} width={115} />
            <Tooltip formatter={(v: any) => `${v.toFixed(1)}%`} />
            <Bar dataKey="completion_pct" name="Completion %" radius={[0, 3, 3, 0]}>
              {top10Chart.map((s, i) => (
                <Cell key={i} fill={s.completion_pct >= 85 ? '#16a34a' : s.completion_pct >= 70 ? '#d97706' : '#dc2626'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 8px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text" placeholder="Search state..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '6px 10px 6px 28px', fontSize: 12, width: '100%' }}
          />
        </div>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Showing {filtered.length} states • Click column to sort</span>
      </div>

      {/* State Table */}
      <SectionCard noPadding title="">
        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>State</th>
                <SortTh label="Funds Released (Cr)" k="funds_released" />
                <SortTh label="Expenditure (Cr)" k="expenditure" />
                <SortTh label="Works Recommended" k="works_recommended" />
                <SortTh label="Works Completed" k="works_completed" />
                <SortTh label="Completion %" k="completion_pct" />
                <SortTh label="High Risk" k="high_risk_projects" />
                <SortTh label="Anomalies" k="anomalies" />
                <SortTh label="Avg Risk Score" k="avg_risk_score" />
                <SortTh label="Utilization %" k="utilization_pct" />
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const g = getGrade(s);
                return (
                  <tr key={s.state} style={{ cursor: 'pointer', background: selectedState?.state === s.state ? '#eff6ff' : undefined }} onClick={() => setSelectedState(prev => prev?.state === s.state ? null : s)}>
                    <td style={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>{s.state}</td>
                    <td style={{ fontSize: 12 }}>{(s.funds_released / 100).toFixed(0)}</td>
                    <td style={{ fontSize: 12 }}>{(s.expenditure / 100).toFixed(0)}</td>
                    <td style={{ fontSize: 12, textAlign: 'center' }}>{formatNumber(s.works_recommended)}</td>
                    <td style={{ fontSize: 12, textAlign: 'center' }}>{formatNumber(s.works_completed)}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: s.completion_pct >= 85 ? '#16a34a' : s.completion_pct >= 70 ? '#d97706' : '#dc2626', fontSize: 12 }}>
                        {s.completion_pct.toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ fontSize: 12, textAlign: 'center', color: s.high_risk_projects > 100 ? '#dc2626' : '#374151', fontWeight: s.high_risk_projects > 100 ? 700 : 400 }}>{s.high_risk_projects}</td>
                    <td style={{ fontSize: 12, textAlign: 'center' }}>{s.anomalies}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: s.avg_risk_score > 60 ? '#dc2626' : s.avg_risk_score > 40 ? '#d97706' : '#16a34a', fontSize: 12 }}>
                        {s.avg_risk_score}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: 12, color: s.utilization_pct >= 85 ? '#16a34a' : s.utilization_pct >= 70 ? '#d97706' : '#dc2626' }}>
                        {s.utilization_pct.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span style={{ background: g.bg, color: g.color, padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 800 }}>{g.grade}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Selected State Detail */}
      {selectedState && (
        <div style={{ marginTop: 16, padding: '16px 20px', background: 'white', border: '2px solid #003580', borderRadius: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#003580', marginBottom: 12 }}>{selectedState.state} — State Overview</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {[
              { label: 'Funds Released', value: `₹${(selectedState.funds_released / 100).toFixed(0)} Cr` },
              { label: 'Expenditure', value: `₹${(selectedState.expenditure / 100).toFixed(0)} Cr` },
              { label: 'Works Recommended', value: formatNumber(selectedState.works_recommended) },
              { label: 'Works Completed', value: formatNumber(selectedState.works_completed) },
              { label: 'High Risk Projects', value: selectedState.high_risk_projects },
              { label: 'Anomalies', value: selectedState.anomalies },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center', padding: '10px', background: '#f9fafb', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>
            → For district-level drill-down, visit the Map View page.
          </div>
        </div>
      )}

      {/* Risk Heatmap */}
      <div style={{ marginTop: 16 }}>
        <SectionCard title="States by Risk Level">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626' }} /> High Risk States ({highRiskStates.length})
              </div>
              {highRiskStates.map(s => (
                <div key={s.state} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', marginBottom: 3, background: '#fef2f2', borderRadius: 4, fontSize: 11 }}>
                  <span>{s.state}</span><span style={{ fontWeight: 700, color: '#dc2626' }}>{s.avg_risk_score}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#d97706', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#d97706' }} /> Medium Risk States ({mediumRiskStates.length})
              </div>
              {mediumRiskStates.map(s => (
                <div key={s.state} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', marginBottom: 3, background: '#fffbeb', borderRadius: 4, fontSize: 11 }}>
                  <span>{s.state}</span><span style={{ fontWeight: 700, color: '#d97706' }}>{s.avg_risk_score}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a' }} /> Low Risk States ({lowRiskStates.length})
              </div>
              {lowRiskStates.map(s => (
                <div key={s.state} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', marginBottom: 3, background: '#f0fdf4', borderRadius: 4, fontSize: 11 }}>
                  <span>{s.state}</span><span style={{ fontWeight: 700, color: '#16a34a' }}>{s.avg_risk_score}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
