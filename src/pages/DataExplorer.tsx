import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECTS, STATES, SECTORS, FINANCIAL_YEARS } from '../data/demoData';
import { PageHeader, SectionCard, FilterBar, ActionButton, StatusBadge, Pagination } from '../components/ui';
import { RiskBadge } from '../components/RiskBadge';
import { getScoreColor } from '../lib/riskEngine';
import { truncate } from '../lib/utils';
import { Database, Download, Search, ArrowUpDown } from 'lucide-react';

type SortKey = 'risk_score' | 'sanctioned_cost' | 'expenditure' | 'physical_progress' | 'mp_name' | 'state';

export default function DataExplorer() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('risk_score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const perPage = 20;

  const handleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(k); setSortDir('desc'); }
    setPage(1);
  };

  const filtered = PROJECTS
    .filter(p => {
      if (filterState && p.state !== filterState) return false;
      if (filterSector && p.sector !== filterSector) return false;
      if (filterStatus && p.work_status !== filterStatus) return false;
      if (filterRisk && p.risk_level !== filterRisk) return false;
      if (filterYear && p.financial_year !== filterYear) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          p.project_id.toLowerCase().includes(s) ||
          p.work_name.toLowerCase().includes(s) ||
          p.mp_name.toLowerCase().includes(s) ||
          p.state.toLowerCase().includes(s) ||
          p.district.toLowerCase().includes(s) ||
          p.constituency.toLowerCase().includes(s)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const SortTh = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      onClick={() => handleSort(k)}
      style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {label}
        <ArrowUpDown size={10} color="rgba(255,255,255,0.7)" />
        {sortKey === k && <span style={{ fontSize: 10 }}>{sortDir === 'desc' ? '↓' : '↑'}</span>}
      </span>
    </th>
  );

  return (
    <div>
      <PageHeader title="Data Explorer" subtitle="Advanced MPLADS MIS data browser with full filter and search capabilities" />

      <FilterBar filters={[
        { label: 'State', options: STATES, value: filterState, onChange: v => { setFilterState(v); setPage(1); } },
        { label: 'Sector', options: SECTORS, value: filterSector, onChange: v => { setFilterSector(v); setPage(1); } },
        { label: 'Work Status', options: ['Recommended', 'Sanctioned', 'Ongoing', 'Completed', 'Non-Progress'], value: filterStatus, onChange: v => { setFilterStatus(v); setPage(1); } },
        { label: 'Risk Level', options: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], value: filterRisk, onChange: v => { setFilterRisk(v); setPage(1); } },
        { label: 'Financial Year', options: FINANCIAL_YEARS, value: filterYear, onChange: v => { setFilterYear(v); setPage(1); } },
      ]} />

      <SectionCard
        title={`Data Explorer — ${filtered.length} records found (of 42,318 total)`}
        subtitle="Click column headers to sort. Click a row to view project details."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search by project, MP, state, district..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '5px 10px 5px 28px', fontSize: 12, width: 260 }}
              />
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'white', border: '1px solid #d1d5db', padding: '5px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer',
            }}>
              <Download size={12} /> Export CSV
            </button>
          </div>
        }
        noPadding
      >
        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}>#</th>
                <th>Project ID</th>
                <SortTh label="MP Name" k="mp_name" />
                <th>House</th>
                <SortTh label="State" k="state" />
                <th>Constituency</th>
                <th>Sector</th>
                <th style={{ maxWidth: 220 }}>Work Name</th>
                <th>Work Status</th>
                <th>Sanc. Cost (L)</th>
                <SortTh label="Expenditure (L)" k="expenditure" />
                <SortTh label="Progress%" k="physical_progress" />
                <SortTh label="Risk Score" k="risk_score" />
                <th>Risk Level</th>
                <th>Anomaly</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p, i) => (
                <tr
                  key={p.project_id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/projects/${p.project_id}`)}
                >
                  <td style={{ fontSize: 11, color: '#9ca3af' }}>{(page - 1) * perPage + i + 1}</td>
                  <td style={{ fontSize: 11, fontWeight: 600, color: '#003580', whiteSpace: 'nowrap' }}>{p.project_id}</td>
                  <td style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{p.mp_name.split(' ').slice(0, 2).join(' ')}</td>
                  <td>
                    <span style={{
                      fontSize: 10, padding: '1px 5px', borderRadius: 3, fontWeight: 600,
                      background: p.house === 'Lok Sabha' ? '#dbeafe' : '#f3e8ff',
                      color: p.house === 'Lok Sabha' ? '#1e40af' : '#7c3aed',
                    }}>{p.house === 'Lok Sabha' ? 'LS' : 'RS'}</span>
                  </td>
                  <td style={{ fontSize: 11 }}>{p.state}</td>
                  <td style={{ fontSize: 11 }}>{p.constituency}</td>
                  <td style={{ fontSize: 11 }}>{p.sector}</td>
                  <td style={{ fontSize: 11, maxWidth: 220 }} title={p.work_name}>{truncate(p.work_name, 40)}</td>
                  <td><StatusBadge status={p.work_status} /></td>
                  <td style={{ fontSize: 12, fontWeight: 600 }}>{p.sanctioned_cost}</td>
                  <td style={{ fontSize: 12 }}>{p.expenditure}</td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 700, color: p.physical_progress < 40 ? '#dc2626' : p.physical_progress < 70 ? '#d97706' : '#16a34a' }}>
                      {p.physical_progress}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, fontWeight: 800, color: getScoreColor(p.risk_score) }}>{p.risk_score}</span>
                  </td>
                  <td><RiskBadge level={p.risk_level} size="sm" /></td>
                  <td>
                    {p.anomaly_type ? (
                      <span style={{ fontSize: 10, fontWeight: 700, background: '#fff7ed', color: '#9a3412', padding: '1px 6px', borderRadius: 3 }}>Flagged</span>
                    ) : (
                      <span style={{ fontSize: 10, fontWeight: 600, background: '#f0fdf4', color: '#166534', padding: '1px 6px', borderRadius: 3 }}>Normal</span>
                    )}
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={15} style={{ textAlign: 'center', padding: 32, color: '#9ca3af', fontSize: 13 }}>
                  No records match the selected filters.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '8px 16px' }}>
          <Pagination page={page} total={filtered.length} perPage={perPage} onPage={setPage} />
        </div>
      </SectionCard>

      {/* Disclaimer */}
      <div style={{ marginTop: 16, padding: '10px 14px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6, fontSize: 11, color: '#92400e', display: 'flex', gap: 8 }}>
        <Database size={14} style={{ flexShrink: 0 }} />
        <span>
          <strong>Demo Data Notice:</strong> This data explorer shows synthetic demonstration data only.
          Records shown do not represent actual government data or official MPLADS statistics.
          Generated for SIH 2026 Problem Statement 26102 demonstration purposes.
        </span>
      </div>
    </div>
  );
}
