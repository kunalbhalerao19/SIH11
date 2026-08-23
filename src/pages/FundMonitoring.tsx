// FundMonitoring.tsx
// MPLADS AI Insight — SIH 2026
// Demo environment. Data shown for demonstration purposes.

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

import { FUND_DATA, STATE_STATS, MPs, FINANCIAL_YEARS, STATES } from '../data/demoData';
import {
  PageHeader, SectionCard, FilterBar, KpiCard, Table, ActionButton, Pagination,
} from '../components/ui';
import { RiskBadge } from '../components/RiskBadge';
import { formatPct } from '../lib/utils';
import type { RiskLevel } from '../types';

// ─── helpers ────────────────────────────────────────────────────────────────

function utilColor(pct: number): string {
  if (pct >= 85) return '#16a34a';
  if (pct >= 70) return '#FF6B00';
  return '#dc2626';
}

function toCroreVal(lakhs: number): number {
  return lakhs / 100;
}

const fundTooltipFormatter = (value: any, name: any) => [
  `₹${toCroreVal(value).toFixed(1)} Cr`,
  name,
];

const pctTooltipFormatter = (value: any, name: any) => [
  `${value.toFixed(1)}%`,
  name,
];

// ─── Utilisation % bar cell ──────────────────────────────────────────────────
function UtilBar({ pct }: { pct: number }) {
  const color = utilColor(pct);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
      <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 44, textAlign: 'right' }}>
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

const croreTickFormatter = (v: number) => `₹${toCroreVal(v).toFixed(0)}Cr`;
const pctTickFormatter = (v: number) => `${v.toFixed(0)}%`;

// ─── Coloured horizontal bar shape ───────────────────────────────────────────
const StateBarShape = (props: Record<string, unknown>) => {
  const x = (props.x as number) ?? 0;
  const y = (props.y as number) ?? 0;
  const width = (props.width as number) ?? 0;
  const height = (props.height as number) ?? 0;
  const pct = (props.utilization_pct as number) ?? 0;
  return <rect x={x} y={y} width={width} height={height} fill={utilColor(pct)} rx={2} />;
};

// ─── Main component ──────────────────────────────────────────────────────────
export default function FundMonitoring() {
  const [filterYear, setFilterYear] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterHouse, setFilterHouse] = useState('');
  const [filterMP, setFilterMP] = useState('');
  const [mpPage, setMpPage] = useState(1);
  const mpPerPage = 15;

  const mpNames = useMemo(() => MPs.map(m => m.name), []);

  // KPI values from FY 2024-25
  const latest = FUND_DATA[4];
  const releasedCr   = toCroreVal(latest.released);
  const sanctionedCr = toCroreVal(latest.sanctioned);
  const utilizedCr   = toCroreVal(latest.utilized);
  const unspentCr    = toCroreVal(latest.unspent);
  const unsanctionedCr = toCroreVal(latest.released - latest.sanctioned);
  const utilizationPct = (latest.utilized / latest.released) * 100;

  // Bar chart data
  const barChartData = FUND_DATA.map(d => ({
    year: d.year,
    Released: d.released,
    Utilized: d.utilized,
    Unspent:  d.unspent,
  }));

  // Top-10 states by funds_released for horizontal chart
  const top10States = useMemo(() =>
    [...STATE_STATS]
      .sort((a, b) => b.funds_released - a.funds_released)
      .slice(0, 10)
      .map(s => ({
        state: s.state.length > 13 ? s.state.slice(0, 13) + '…' : s.state,
        utilization_pct: s.utilization_pct,
      })),
    [],
  );

  // Year-wise utilization % trend
  const trendData = FUND_DATA.map(d => ({
    year: d.year,
    'Utilization %': parseFloat(((d.utilized / d.released) * 100).toFixed(1)),
  }));

  // State fund table rows
  const stateFundRows = useMemo(() =>
    [...STATE_STATS]
      .filter(s => !filterState || s.state === filterState)
      .sort((a, b) => b.funds_released - a.funds_released),
    [filterState],
  );

  // MP table rows
  const mpRows = useMemo(() =>
    MPs.filter(m => {
      if (filterHouse && m.house !== filterHouse) return false;
      if (filterState && m.state !== filterState) return false;
      if (filterMP   && m.name  !== filterMP)    return false;
      return true;
    }),
    [filterHouse, filterState, filterMP],
  );

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1400, margin: '0 auto' }}>

      <PageHeader
        title="Fund Monitoring"
        subtitle="Track fund release, utilization and expenditure across MPs, States and Financial Years"
      />

      {/* disclaimer */}
      <div style={{
        background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 5,
        padding: '6px 12px', fontSize: 11, color: '#9a3412', marginBottom: 16,
      }}>
        ⚠️ Demo environment. Data shown for demonstration purposes only. Values are synthetic and do not represent official government statistics.
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={[
          { label: 'Financial Year', options: FINANCIAL_YEARS,               value: filterYear,  onChange: setFilterYear  },
          { label: 'State',          options: STATES,                         value: filterState, onChange: setFilterState },
          { label: 'House',          options: ['Lok Sabha', 'Rajya Sabha'],   value: filterHouse, onChange: setFilterHouse },
          { label: 'MP',             options: mpNames,                        value: filterMP,    onChange: setFilterMP    },
        ]}
      />

      {/* ── KPI Cards (2 × 3) ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <KpiCard
          title="Funds Released"
          value={`₹${releasedCr.toFixed(0)} Cr`}
          subtitle="FY 2024-25 · All States"
          icon={<DollarSign size={18} color="#003580" />}
          color="#003580"
          trend={{ value: '+5.0% vs prev year', up: true }}
        />
        <KpiCard
          title="Funds Sanctioned"
          value={`₹${sanctionedCr.toFixed(0)} Cr`}
          subtitle="FY 2024-25 · All States"
          icon={<BarChart3 size={18} color="#003580" />}
          color="#003580"
          trend={{ value: '+5.2% vs prev year', up: true }}
        />
        <KpiCard
          title="Funds Utilized"
          value={`₹${utilizedCr.toFixed(0)} Cr`}
          subtitle="Expenditure reported"
          icon={<TrendingUp size={18} color="#16a34a" />}
          color="#16a34a"
          trend={{ value: '+6.6% vs prev year', up: true }}
        />
        <KpiCard
          title="Unspent Balance"
          value={`₹${unspentCr.toFixed(0)} Cr`}
          subtitle="Released but not utilized"
          icon={<TrendingDown size={18} color="#FF6B00" />}
          color="#FF6B00"
          trend={{ value: '-4.3% vs prev year', up: false }}
        />
        <KpiCard
          title="Unsanctioned Balance"
          value={`₹${unsanctionedCr.toFixed(0)} Cr`}
          subtitle="Released but not sanctioned"
          icon={<DollarSign size={18} color="#6b7280" />}
          color="#6b7280"
        />
        <KpiCard
          title="Utilization %"
          value={formatPct(utilizationPct)}
          subtitle="Utilized / Released · FY 2024-25"
          icon={<BarChart3 size={18} color={utilizationPct >= 85 ? '#16a34a' : '#dc2626'} />}
          color={utilizationPct >= 85 ? '#16a34a' : '#dc2626'}
          trend={{ value: '+0.9pp vs prev year', up: true }}
        />
      </div>

      {/* ── Year-wise grouped BarChart (full width) ───────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <SectionCard
          title="Year-wise Fund Utilization"
          subtitle="Released vs Utilized vs Unspent (₹ Crore) — All Financial Years"
          actions={<ActionButton label="Export CSV" variant="ghost" />}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barChartData} margin={{ top: 8, right: 16, left: 12, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tickFormatter={croreTickFormatter} tick={{ fontSize: 11, fill: '#6b7280' }} width={72} />
              <Tooltip formatter={fundTooltipFormatter} contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Released" name="Released" fill="#003580" radius={[2,2,0,0]} maxBarSize={40} />
              <Bar dataKey="Utilized" name="Utilized" fill="#16a34a" radius={[2,2,0,0]} maxBarSize={40} />
              <Bar dataKey="Unspent"  name="Unspent"  fill="#FF6B00" radius={[2,2,0,0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* ── Two side-by-side charts ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

        {/* Left: State-wise horizontal bar */}
        <SectionCard
          title="State-wise Fund Utilization"
          subtitle="Top 10 states by funds released — color = utilization tier"
        >
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#6b7280', marginBottom: 8, flexWrap: 'wrap' }}>
            {[
              { color: '#16a34a', label: '≥85% Good' },
              { color: '#FF6B00', label: '70–84% Moderate' },
              { color: '#dc2626', label: '<70% Poor' },
            ].map(l => (
              <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, background: l.color, borderRadius: 2, display: 'inline-block' }} />
                {l.label}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={top10States} layout="vertical" margin={{ top: 4, right: 48, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={pctTickFormatter} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis type="category" dataKey="state" width={100} tick={{ fontSize: 10, fill: '#374151' }} />
              <Tooltip
                formatter={(v: any) => [`${v.toFixed(1)}%`, 'Utilization']}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar
                dataKey="utilization_pct"
                name="Utilization %"
                maxBarSize={14}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                shape={(props: any) => <StateBarShape {...props} />}
              />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Right: utilization % trend line */}
        <SectionCard
          title="Utilization % Trend"
          subtitle="Year-on-year utilization percentage (all states combined)"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 8, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis domain={[74, 94]} tickFormatter={pctTickFormatter} tick={{ fontSize: 11, fill: '#6b7280' }} width={42} />
              <Tooltip formatter={pctTooltipFormatter} contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="Utilization %"
                stroke="#003580"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#003580', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', fontSize: 11, color: '#6b7280', marginTop: 4 }}>
            Target threshold: ≥85% utilization
          </div>
        </SectionCard>
      </div>

      {/* ── State-wise Fund Table ─────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <SectionCard
          title="State-wise Fund Details"
          subtitle={`${stateFundRows.length} states · Sorted by funds released (desc)`}
          noPadding
          actions={<ActionButton label="Export" variant="ghost" />}
        >
          <Table
            compact
            headers={[
              'State',
              'Funds Released (Cr)',
              'Funds Utilized (Cr)',
              'Unspent (Cr)',
              'Utilization %',
              'Works Completed',
              'Anomalies',
            ]}
          >
            {stateFundRows.map(s => {
              const relCr  = toCroreVal(s.funds_released);
              const utilCr = toCroreVal(s.expenditure);
              const unspCr = toCroreVal(s.funds_released - s.expenditure);
              return (
                <tr key={s.state}>
                  <td>
                    <span style={{ fontWeight: 600, color: '#111827', fontSize: 12 }}>{s.state}</span>
                  </td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                    ₹{relCr.toFixed(1)} Cr
                  </td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', color: '#16a34a', fontWeight: 600 }}>
                    ₹{utilCr.toFixed(1)} Cr
                  </td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', color: '#FF6B00' }}>
                    ₹{unspCr.toFixed(1)} Cr
                  </td>
                  <td style={{ minWidth: 150 }}>
                    <UtilBar pct={s.utilization_pct} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{s.works_completed.toLocaleString('en-IN')}</span>
                    <span style={{ color: '#6b7280', fontSize: 11 }}> / {s.works_sanctioned.toLocaleString('en-IN')}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {s.anomalies > 0 ? (
                      <span style={{
                        background: s.anomalies > 30 ? '#fee2e2' : s.anomalies > 10 ? '#fff7ed' : '#f3f4f6',
                        color:      s.anomalies > 30 ? '#dc2626' : s.anomalies > 10 ? '#9a3412' : '#374151',
                        padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                      }}>
                        {s.anomalies}
                      </span>
                    ) : (
                      <span style={{ color: '#16a34a', fontWeight: 600, fontSize: 11 }}>0</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </Table>
        </SectionCard>
      </div>

      {/* ── MP-wise Fund Table ────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <SectionCard
          title="MP-wise Fund Utilization"
          subtitle={`${mpRows.length} MP(s) · Fund values in Crore (₹)`}
          noPadding
          actions={<ActionButton label="Export" variant="ghost" />}
        >
          <Table
            compact
            headers={[
              'MP Name',
              'House',
              'State',
              'Funds Released',
              'Expenditure',
              'Utilization %',
              'Works Completed',
              'Risk Exposure',
            ]}
          >
            {mpRows.slice((mpPage - 1) * mpPerPage, mpPage * mpPerPage).map(mp => {
              const relCr  = toCroreVal(mp.total_funds_released);
              const expCr  = toCroreVal(mp.total_expenditure);
              const utilPct = mp.total_funds_released > 0
                ? (mp.total_expenditure / mp.total_funds_released) * 100
                : 0;
              return (
                <tr key={mp.mp_id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: 12 }}>{mp.name}</div>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>{mp.constituency}</div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color:      mp.house === 'Lok Sabha' ? '#003580' : '#7c3aed',
                      background: mp.house === 'Lok Sabha' ? '#eff6ff' : '#ede9fe',
                      padding: '2px 6px', borderRadius: 4,
                    }}>
                      {mp.house === 'Lok Sabha' ? 'LS' : 'RS'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#374151' }}>{mp.state}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                    ₹{relCr.toFixed(1)} Cr
                  </td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', color: '#16a34a', fontWeight: 600 }}>
                    ₹{expCr.toFixed(1)} Cr
                  </td>
                  <td style={{ minWidth: 140 }}>
                    <UtilBar pct={utilPct} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{mp.works_completed}</span>
                    <span style={{ color: '#6b7280', fontSize: 11 }}> / {mp.works_sanctioned}</span>
                  </td>
                  <td>
                    <RiskBadge level={mp.risk_exposure as RiskLevel} />
                  </td>
                </tr>
              );
            })}
            {mpRows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#6b7280', padding: '24px 0', fontSize: 13 }}>
                  No MPs match the selected filters.
                </td>
              </tr>
            )}
          </Table>
          <div style={{ padding: '8px 16px' }}>
            <Pagination page={mpPage} total={mpRows.length} perPage={mpPerPage} onPage={setMpPage} />
          </div>
        </SectionCard>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', fontSize: 11, color: '#9ca3af',
        padding: '12px 0', borderTop: '1px solid #e5e7eb', marginTop: 8,
      }}>
        Demo environment. Data shown for demonstration purposes only · MPLADS AI Insight · SIH 2026
      </div>
    </div>
  );
}
