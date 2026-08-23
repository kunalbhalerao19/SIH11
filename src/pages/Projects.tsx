import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECTS, STATES, SECTORS, FINANCIAL_YEARS } from '../data/demoData';
import type { WorkStatus, RiskLevel, Sector } from '../types';
import { PageHeader, KpiCard, SectionCard, FilterBar, ActionButton, StatusBadge, Pagination } from '../components/ui';
import { RiskBadge, RiskScoreBar } from '../components/RiskBadge';
import { formatDate, truncate } from '../lib/utils';
import { getScoreColor } from '../lib/riskEngine';
import { Search, Download, Eye, FolderOpen, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

export default function Projects() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 15;

  const filtered = PROJECTS
    .filter(p => {
      if (filterState && p.state !== filterState) return false;
      if (filterSector && p.sector !== filterSector) return false;
      if (filterStatus && p.work_status !== filterStatus) return false;
      if (filterRisk && p.risk_level !== filterRisk) return false;
      if (filterYear && p.financial_year !== filterYear) return false;
      if (search) {
        const s = search.toLowerCase();
        return p.project_id.toLowerCase().includes(s) ||
          p.work_name.toLowerCase().includes(s) ||
          p.mp_name.toLowerCase().includes(s) ||
          p.state.toLowerCase().includes(s) ||
          p.district.toLowerCase().includes(s);
      }
      return true;
    })
    .sort((a, b) => b.risk_score - a.risk_score);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <PageHeader title="MPLAD Projects" subtitle="All works recommended, sanctioned, ongoing and completed" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <KpiCard title="Total Projects" value="42,318" icon={<FolderOpen size={18} color="#003580" />} color="#003580" />
        <KpiCard title="Completed Works" value="31,248" icon={<CheckCircle size={18} color="#16a34a" />} color="#16a34a" />
        <KpiCard title="Ongoing Works" value="6,240" icon={<Activity size={18} color="#d97706" />} color="#d97706" />
        <KpiCard title="High Risk Projects" value="1,342" icon={<AlertTriangle size={18} color="#dc2626" />} color="#dc2626" />
      </div>

      <FilterBar filters={[
        { label: 'Financial Year', options: FINANCIAL_YEARS, value: filterYear, onChange: v => { setFilterYear(v); setPage(1); } },
        { label: 'State', options: STATES, value: filterState, onChange: v => { setFilterState(v); setPage(1); } },
        { label: 'Sector', options: SECTORS, value: filterSector, onChange: v => { setFilterSector(v); setPage(1); } },
        { label: 'Work Status', options: ['Recommended', 'Sanctioned', 'Ongoing', 'Completed', 'Non-Progress', 'Dropped'], value: filterStatus, onChange: v => { setFilterStatus(v); setPage(1); } },
        { label: 'Risk Level', options: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], value: filterRisk, onChange: v => { setFilterRisk(v); setPage(1); } },
      ]} />

      <SectionCard
        title={`Projects (${filtered.length} records)`}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text" placeholder="Search project, MP, state..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '5px 10px 5px 26px', fontSize: 12, width: 220 }}
              />
            </div>
            <ActionButton label="Export CSV" variant="ghost" />
          </div>
        }
        noPadding
      >
        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Work Name</th>
                <th>State</th>
                <th>District</th>
                <th>MP Name</th>
                <th>Sector</th>
                <th>Status</th>
                <th>Sanctioned Cost (L)</th>
                <th>Expenditure (L)</th>
                <th>Progress</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(p => (
                <tr key={p.project_id}>
                  <td style={{ fontSize: 11, fontWeight: 600, color: '#003580', whiteSpace: 'nowrap' }}>{p.project_id}</td>
                  <td style={{ maxWidth: 200, fontSize: 11 }} title={p.work_name}>{truncate(p.work_name, 38)}</td>
                  <td style={{ fontSize: 11 }}>{p.state}</td>
                  <td style={{ fontSize: 11 }}>{p.district}</td>
                  <td style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{p.mp_name.split(' ').slice(0, 2).join(' ')}</td>
                  <td style={{ fontSize: 11 }}>{p.sector}</td>
                  <td><StatusBadge status={p.work_status} /></td>
                  <td style={{ fontSize: 12, fontWeight: 600 }}>{p.sanctioned_cost.toFixed(0)}</td>
                  <td style={{ fontSize: 12 }}>{p.expenditure.toFixed(0)}</td>
                  <td style={{ minWidth: 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          width: `${p.physical_progress}%`, height: '100%',
                          background: p.physical_progress >= 80 ? '#16a34a' : p.physical_progress >= 50 ? '#d97706' : '#dc2626',
                          borderRadius: 3,
                        }} />
                      </div>
                      <span style={{ fontSize: 11, minWidth: 28 }}>{p.physical_progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, fontWeight: 700, color: getScoreColor(p.risk_score) }}>{p.risk_score}</span>
                  </td>
                  <td><RiskBadge level={p.risk_level} size="sm" /></td>
                  <td>
                    <button
                      onClick={() => navigate(`/projects/${p.project_id}`)}
                      style={{
                        background: 'none', border: '1px solid #003580', color: '#003580',
                        padding: '3px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <Eye size={11} /> View
                    </button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={13} style={{ textAlign: 'center', color: '#9ca3af', padding: 32, fontSize: 13 }}>
                  No projects match the selected filters.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '8px 16px' }}>
          <Pagination page={page} total={filtered.length} perPage={perPage} onPage={setPage} />
        </div>
      </SectionCard>
    </div>
  );
}
