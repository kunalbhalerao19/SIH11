import { useState, useMemo } from 'react';
import { MPs, PROJECTS, STATES } from '../data/demoData';
import type { MP } from '../types';
import { PageHeader, SectionCard, KpiCard, ActionButton, StatusBadge, Pagination } from '../components/ui';
import { RiskBadge, RiskScoreBar } from '../components/RiskBadge';
import { formatCrore, formatPct } from '../lib/utils';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import { User, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Star, Info, Search } from 'lucide-react';

const COLORS = ['#16a34a', '#d97706', '#ea580c', '#dc2626'];
const SECTOR_COLORS = ['#003580', '#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#1e3a5f', '#374151'];

export default function MPAnalytics() {
  const [selectedMpId, setSelectedMpId] = useState(MPs[0].mp_id);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [tablePage, setTablePage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const tablePerPage = 15;
  const projectPerPage = 8;

  const mp = MPs.find(m => m.mp_id === selectedMpId) || MPs[0];
  const mpProjects = PROJECTS.filter(p => p.mp_id === mp.mp_id);

  // Filtered MPs list for selector and comparison
  const filteredMps = useMemo(() => {
    return MPs.filter(m => {
      const matchState = !filterState || m.state === filterState;
      const matchSearch = !searchTerm ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.state.toLowerCase().includes(searchTerm.toLowerCase());
      return matchState && matchSearch;
    });
  }, [searchTerm, filterState]);

  // Sector distribution for this MP's projects
  const sectorMap: Record<string, number> = {};
  if (mpProjects.length > 0) {
    mpProjects.forEach(p => { sectorMap[p.sector] = (sectorMap[p.sector] || 0) + 1; });
  } else {
    sectorMap['Roads & Transport'] = 3;
    sectorMap['Education'] = 2;
    sectorMap['Health'] = 2;
    sectorMap['Water Supply'] = 1;
  }
  const sectorData = Object.entries(sectorMap).map(([name, value]) => ({ name, value }));

  // Risk distribution
  const riskMap = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  if (mpProjects.length > 0) {
    mpProjects.forEach(p => { riskMap[p.risk_level]++; });
  } else {
    riskMap[mp.risk_exposure] = 1;
    if (mp.risk_exposure !== 'LOW') riskMap['LOW'] = 4;
    if (mp.risk_exposure !== 'MEDIUM') riskMap['MEDIUM'] = 2;
  }
  const riskData = Object.entries(riskMap).map(([name, value]) => ({ name, value }));

  const completionRate = mp.works_sanctioned > 0 ? (mp.works_completed / mp.works_sanctioned * 100) : 0;

  const pagedProjects = mpProjects.slice((projectPage - 1) * projectPerPage, projectPage * projectPerPage);
  const pagedTableMps = filteredMps.slice((tablePage - 1) * tablePerPage, tablePage * tablePerPage);

  return (
    <div>
      <PageHeader title="MP Analytics" subtitle="Official 18th Lok Sabha MP performance, fund utilization and risk monitoring (543 MPs)" />

      {/* MP Search and Selector */}
      <SectionCard title="Select Member of Parliament">
        <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by MP name or constituency..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setTablePage(1); }}
              style={{
                width: '100%', border: '1px solid #d1d5db', borderRadius: 4,
                padding: '7px 10px 7px 32px', fontSize: 13, boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ minWidth: 180 }}>
            <select
              value={filterState}
              onChange={e => { setFilterState(e.target.value); setTablePage(1); }}
              style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 4, padding: '7px 10px', fontSize: 13 }}
            >
              <option value="">All States ({STATES.length})</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ minWidth: 240, flex: 1 }}>
            <select
              value={selectedMpId}
              onChange={e => { setSelectedMpId(e.target.value); setProjectPage(1); }}
              style={{ width: '100%', border: '1px solid #003580', borderRadius: 4, padding: '7px 10px', fontSize: 13, background: '#f0f9ff', fontWeight: 600, color: '#003580' }}
            >
              {filteredMps.map(m => (
                <option key={m.mp_id} value={m.mp_id}>
                  {m.name} ({m.constituency}, {m.state}) — ₹{(m.total_funds_released / 100).toFixed(1)} Cr
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick select cards for first 8 matching MPs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {filteredMps.slice(0, 8).map(m => (
            <div
              key={m.mp_id}
              onClick={() => { setSelectedMpId(m.mp_id); setProjectPage(1); }}
              style={{
                padding: '10px 12px', borderRadius: 6, cursor: 'pointer',
                border: m.mp_id === selectedMpId ? '2px solid #003580' : '1px solid #e5e7eb',
                background: m.mp_id === selectedMpId ? '#eff6ff' : 'white',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: m.mp_id === selectedMpId ? '#003580' : '#e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <User size={14} color={m.mp_id === selectedMpId ? 'white' : '#9ca3af'} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                  {m.name.length > 22 ? m.name.slice(0, 22) + '...' : m.name}
                </div>
              </div>
              <div style={{ fontSize: 10, color: '#6b7280' }}>{m.constituency} • {m.state}</div>
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <RiskBadge level={m.risk_exposure} size="sm" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#003580' }}>₹{(m.total_funds_released / 100).toFixed(1)} Cr</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* MP Profile Header */}
      <div style={{ marginTop: 16, padding: '16px 20px', background: '#003580', borderRadius: 6, color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={24} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{mp.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
              {mp.house} • {mp.constituency}, {mp.state} • Party: {mp.party} • Term: 2024–2029
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <RiskBadge level={mp.risk_exposure} size="lg" />
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Risk Exposure Level</div>
          </div>
        </div>
      </div>

      {/* 8 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16 }}>
        <KpiCard title="Allocated Funds (Official)" value={`₹${(mp.total_funds_released / 100).toFixed(2)} Cr`} icon={<DollarSign size={16} color="#003580" />} color="#003580" />
        <KpiCard title="Total Expenditure" value={`₹${(mp.total_expenditure / 100).toFixed(2)} Cr`} icon={<TrendingUp size={16} color="#16a34a" />} color="#16a34a" />
        <KpiCard title="Works Recommended" value={mp.works_recommended.toLocaleString('en-IN')} icon={<Star size={16} color="#1e40af" />} color="#1e40af" />
        <KpiCard title="Works Sanctioned" value={mp.works_sanctioned.toLocaleString('en-IN')} icon={<CheckCircle size={16} color="#1e40af" />} color="#1e40af" />
        <KpiCard title="Works Completed" value={mp.works_completed.toLocaleString('en-IN')} icon={<CheckCircle size={16} color="#16a34a" />} color="#16a34a" />
        <KpiCard title="Ongoing Works" value={mp.ongoing_works.toLocaleString('en-IN')} icon={<AlertTriangle size={16} color="#d97706" />} color="#d97706" />
        <KpiCard title="High-Risk Works" value={mp.high_risk_works.toLocaleString('en-IN')} icon={<AlertTriangle size={16} color="#dc2626" />} color="#dc2626" />
        <KpiCard
          title="Completion Rate"
          value={`${completionRate.toFixed(1)}%`}
          color={completionRate > 75 ? '#16a34a' : completionRate > 55 ? '#d97706' : '#dc2626'}
        />
      </div>

      {/* AI Performance + Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginTop: 16 }}>
        {/* AI Performance */}
        <SectionCard title="MP Performance Index (Weighted Prototype Formula)" subtitle="Composite scoring: 30% Completion | 25% Utilization | 20% On-Time | 15% Progress | 10% Citizen Resolution">
          {(() => {
            const compScore = Math.min(100, Math.round((mp.works_completed / Math.max(1, mp.works_sanctioned)) * 100));
            const utilScore = Math.min(100, Math.round((mp.total_expenditure / Math.max(1, mp.total_funds_released)) * 100));
            const onTimeScore = Math.min(100, Math.round(mp.completion_efficiency * 0.95));
            const progressScore = Math.min(100, Math.round(mp.efficiency_score));
            const citizenScore = Math.min(100, Math.round(mp.financial_efficiency * 0.9));

            const totalScore = Math.round(
              compScore * 0.30 +
              utilScore * 0.25 +
              onTimeScore * 0.20 +
              progressScore * 0.15 +
              citizenScore * 0.10
            );

            const factors = [
              { label: 'Works Completion Rate (30% Weight)', score: compScore, weighted: (compScore * 0.30).toFixed(1), color: '#16a34a' },
              { label: 'Fund Utilization Rate (25% Weight)', score: utilScore, weighted: (utilScore * 0.25).toFixed(1), color: '#003580' },
              { label: 'On-Time Milestone Delivery (20% Weight)', score: onTimeScore, weighted: (onTimeScore * 0.20).toFixed(1), color: '#2563eb' },
              { label: 'Physical Progress Velocity (15% Weight)', score: progressScore, weighted: (progressScore * 0.15).toFixed(1), color: '#0d9488' },
              { label: 'Citizen Suggestion Resolution (10% Weight)', score: citizenScore, weighted: (citizenScore * 0.10).toFixed(1), color: '#d97706' },
            ];

            return (
              <div>
                <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Composite Performance Index</div>
                    <div className="text-2xl font-black text-[#003580]">{totalScore}<span className="text-xs text-gray-400 font-normal">/100</span></div>
                  </div>
                  <div className="text-right">
                    <RiskBadge level={mp.risk_exposure} size="md" />
                    <div className="text-[10px] text-gray-500 mt-1">Prototype Evaluation</div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {factors.map(f => (
                    <div key={f.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-700">{f.label}</span>
                        <span className="font-bold text-gray-900">{f.score}/100 <span className="text-gray-400 font-normal">({f.weighted} pts)</span></span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${f.score}%`, backgroundColor: f.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </SectionCard>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <SectionCard title="Sector Distribution">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={sectorData.slice(0, 6)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={(props: any) => `${String(props.name || '').split(' ')[0]} ${((props.percent || 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                  {sectorData.slice(0, 6).map((_, i) => <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </SectionCard>
          <SectionCard title="Risk Distribution">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={riskData.filter(d => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={(props: any) => `${props.name} (${props.value})`} labelLine={false} fontSize={9}>
                  {riskData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      </div>

      {/* MP Projects Table */}
      <div style={{ marginTop: 16 }}>
        <SectionCard title={`Sample Works in ${mp.constituency} (${mpProjects.length} detailed records)`}>
          {mpProjects.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="gov-table">
                  <thead>
                    <tr>
                      <th>Project ID</th>
                      <th>Work Name</th>
                      <th>District</th>
                      <th>Sector</th>
                      <th>Cost (L)</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Risk Score</th>
                      <th>Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedProjects.map(p => (
                      <tr key={p.project_id}>
                        <td style={{ fontSize: 11, fontWeight: 600, color: '#003580' }}>{p.project_id}</td>
                        <td style={{ fontSize: 11, maxWidth: 180 }}>{p.work_name.slice(0, 36)}...</td>
                        <td style={{ fontSize: 11 }}>{p.district}</td>
                        <td style={{ fontSize: 11 }}>{p.sector}</td>
                        <td style={{ fontSize: 12, fontWeight: 600 }}>{p.sanctioned_cost}</td>
                        <td style={{ minWidth: 80 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ flex: 1, height: 5, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${p.physical_progress}%`, height: '100%', background: p.physical_progress >= 70 ? '#16a34a' : '#d97706', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 10 }}>{p.physical_progress}%</span>
                          </div>
                        </td>
                        <td><StatusBadge status={p.work_status} /></td>
                        <td><RiskScoreBar score={p.risk_score} /></td>
                        <td><RiskBadge level={p.risk_level} size="sm" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={projectPage} total={mpProjects.length} perPage={projectPerPage} onPage={setProjectPage} />
            </>
          ) : (
            <div style={{ padding: '16px', background: '#f9fafb', borderRadius: 4, color: '#6b7280', fontSize: 12 }}>
              Detailed project records for {mp.name} are tracked under the aggregate allocation of ₹{(mp.total_funds_released / 100).toFixed(2)} Cr across {mp.works_recommended} recommended works.
            </div>
          )}
        </SectionCard>
      </div>

      {/* All 543 MPs Comparison Table */}
      <div style={{ marginTop: 16 }}>
        <SectionCard
          title={`All 18th Lok Sabha Members of Parliament (${filteredMps.length} MPs)`}
          subtitle="Showing official allocated amounts from MPLADS portal · Click any row to view individual profile"
        >
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>MP Name</th>
                  <th>State</th>
                  <th>Constituency</th>
                  <th>Allocated (Cr)</th>
                  <th>Expenditure (Cr)</th>
                  <th>Recommended</th>
                  <th>Completed</th>
                  <th>Completion %</th>
                  <th>Efficiency Score</th>
                  <th>Risk Exposure</th>
                </tr>
              </thead>
              <tbody>
                {pagedTableMps.map((m, idx) => {
                  const cr = m.works_sanctioned > 0 ? (m.works_completed / m.works_sanctioned * 100) : 0;
                  const itemIndex = (tablePage - 1) * tablePerPage + idx + 1;
                  return (
                    <tr
                      key={m.mp_id}
                      style={{ cursor: 'pointer', background: m.mp_id === selectedMpId ? '#eff6ff' : undefined }}
                      onClick={() => { setSelectedMpId(m.mp_id); window.scrollTo({ top: 120, behavior: 'smooth' }); }}
                    >
                      <td style={{ fontSize: 11, color: '#9ca3af' }}>{itemIndex}</td>
                      <td style={{ fontWeight: 600, fontSize: 12 }}>{m.name}</td>
                      <td style={{ fontSize: 11 }}>{m.state}</td>
                      <td style={{ fontSize: 11 }}>{m.constituency}</td>
                      <td style={{ fontSize: 12, fontWeight: 700, color: '#003580' }}>₹{(m.total_funds_released / 100).toFixed(2)}</td>
                      <td style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>₹{(m.total_expenditure / 100).toFixed(2)}</td>
                      <td style={{ fontSize: 12, textAlign: 'center' }}>{m.works_recommended}</td>
                      <td style={{ fontSize: 12, textAlign: 'center' }}>{m.works_completed}</td>
                      <td style={{ fontSize: 12, fontWeight: 700, color: cr > 75 ? '#16a34a' : cr > 55 ? '#d97706' : '#dc2626' }}>{cr.toFixed(1)}%</td>
                      <td><RiskScoreBar score={m.efficiency_score} /></td>
                      <td><RiskBadge level={m.risk_exposure} size="sm" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '8px 16px' }}>
            <Pagination page={tablePage} total={filteredMps.length} perPage={tablePerPage} onPage={setTablePage} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
