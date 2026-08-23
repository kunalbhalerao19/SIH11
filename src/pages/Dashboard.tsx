// MPLADS AI Insight — Executive Dashboard
// Demo environment. Data shown for demonstration purposes only.

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  DollarSign, FolderOpen, CheckCircle, AlertTriangle,
  TrendingUp, ShieldAlert, Activity, Users,
} from 'lucide-react';

import { KPI, FUND_DATA, SECTOR_SPEND, RISK_TREND, PROJECTS, STATES, FINANCIAL_YEARS } from '../data/demoData';
import { KpiCard, SectionCard, FilterBar, Table, PageHeader, ActionButton } from '../components/ui';
import { RiskBadge } from '../components/RiskBadge';
import { formatCrore, formatNumber, getProgressColor, truncate } from '../lib/utils';
import type { RiskLevel } from '../types';

// ─── Color constants ───────────────────────────────────────────────────────────
const GOV_BLUE   = '#003580';
const GOV_ORANGE = '#FF6B00';
const GOV_GREEN  = '#16a34a';
const GOV_RED    = '#dc2626';

// ─── Work Status donut data ────────────────────────────────────────────────────
const WORK_STATUS_DATA = [
  { name: 'Completed',    value: 31248, color: GOV_GREEN  },
  { name: 'Ongoing',      value: 6240,  color: GOV_BLUE   },
  { name: 'Sanctioned',   value: 1753,  color: GOV_ORANGE },
  { name: 'Recommended',  value: 1077,  color: '#6b7280'  },
  { name: 'Non-Progress', value: 280,   color: GOV_RED    },
];

// ─── Risk Distribution donut data ─────────────────────────────────────────────
const RISK_DIST_DATA = [
  { name: 'Low',      value: 24832, color: GOV_GREEN  },
  { name: 'Medium',   value: 12341, color: '#d97706'  },
  { name: 'High',     value: 3803,  color: GOV_ORANGE },
  { name: 'Critical', value: 1342,  color: GOV_RED    },
];

// ─── Custom donut label renderer ──────────────────────────────────────────────
const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const r = outerRadius + 22;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  if (percent < 0.04) return null;
  return (
    <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight={500}>
      {name} ({(percent * 100).toFixed(0)}%)
    </text>
  );
};

// ─── Bar chart fund data (convert lakhs → crore) ──────────────────────────────
const fundChartData = FUND_DATA.map(d => ({
  year: d.year,
  Released: parseFloat((d.released / 100).toFixed(1)),
  Utilized: parseFloat((d.utilized / 100).toFixed(1)),
}));

// ─── Top 8 sector spend (horizontal bar) ──────────────────────────────────────
const sectorChartData = [...SECTOR_SPEND]
  .sort((a, b) => b.amount - a.amount)
  .slice(0, 8)
  .map(s => ({
    sector: s.sector.length > 20 ? s.sector.slice(0, 18) + '…' : s.sector,
    Amount: parseFloat((s.amount / 100).toFixed(1)),
  }));

// ─── Dashboard Component ───────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [filterYear,  setFilterYear]  = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterHouse, setFilterHouse] = useState('');
  const [filterRisk,  setFilterRisk]  = useState('');

  // ── Top suspicious projects (sorted by risk_score desc) ──────────────────────
  const topProjects = useMemo(() => {
    let data = [...PROJECTS].sort((a, b) => b.risk_score - a.risk_score);
    if (filterYear)  data = data.filter(p => p.financial_year === filterYear);
    if (filterState) data = data.filter(p => p.state === filterState);
    if (filterHouse) data = data.filter(p => p.house === filterHouse);
    if (filterRisk)  data = data.filter(p => p.risk_level === filterRisk.toUpperCase() as RiskLevel);
    return data.slice(0, 8);
  }, [filterYear, filterState, filterHouse, filterRisk]);

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f3f4f6', minHeight: '100vh', padding: '20px 24px' }}>

      {/* ── Alert Banner ──────────────────────────────────────────────────────── */}
      <div style={{
        background: '#fff7ed',
        border: '1px solid #FF6B0040',
        borderLeft: '4px solid #FF6B00',
        borderRadius: 6,
        padding: '10px 16px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <AlertTriangle size={16} color={GOV_ORANGE} />
        <span style={{ fontSize: 13, color: '#92400e', fontWeight: 500 }}>
          <strong>287 anomalies detected</strong> this monitoring cycle.{' '}
          <strong>48 require immediate attention.</strong>
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9a3412', fontStyle: 'italic' }}>
          Demo environment. Data shown for demonstration purposes.
        </span>
      </div>

      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <PageHeader
        title="Executive Dashboard"
        subtitle="Ministry of Statistics & Programme Implementation · MPLADS Monitoring System · Last updated: Aug 22, 2026 — 23:00 IST"
      />

      {/* ── Filter Bar ────────────────────────────────────────────────────────── */}
      <FilterBar filters={[
        { label: 'Financial Year', options: FINANCIAL_YEARS, value: filterYear,  onChange: setFilterYear  },
        { label: 'State',          options: STATES,           value: filterState, onChange: setFilterState },
        { label: 'House',          options: ['Lok Sabha', 'Rajya Sabha'], value: filterHouse, onChange: setFilterHouse },
        { label: 'Risk Level',     options: ['Low', 'Medium', 'High', 'Critical'], value: filterRisk, onChange: setFilterRisk },
      ]} />

      {/* ── KPI Grid (4-col, 2 rows) ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <KpiCard
          title="Total Funds Released"
          value={formatCrore(KPI.total_funds_released)}
          subtitle="Across all MPs & states"
          icon={<DollarSign size={18} color={GOV_BLUE} />}
          color={GOV_BLUE}
          trend={{ value: '+5.9% vs prev. year', up: true }}
        />
        <KpiCard
          title="Total Expenditure"
          value={formatCrore(KPI.total_expenditure)}
          subtitle={((KPI.total_expenditure / KPI.total_funds_released) * 100).toFixed(1) + '% utilization'}
          icon={<TrendingUp size={18} color={GOV_GREEN} />}
          color={GOV_GREEN}
          trend={{ value: '+6.6% vs prev. year', up: true }}
        />
        <KpiCard
          title="Works Recommended"
          value={formatNumber(KPI.works_recommended)}
          subtitle="FY 2025-26 & historical"
          icon={<FolderOpen size={18} color={GOV_BLUE} />}
          color={GOV_BLUE}
        />
        <KpiCard
          title="Works Sanctioned"
          value={formatNumber(KPI.works_sanctioned)}
          subtitle={((KPI.works_sanctioned / KPI.works_recommended) * 100).toFixed(1) + '% of recommended'}
          icon={<Activity size={18} color={GOV_BLUE} />}
          color={GOV_BLUE}
        />
        <KpiCard
          title="Works Completed"
          value={formatNumber(KPI.works_completed)}
          subtitle={((KPI.works_completed / KPI.works_sanctioned) * 100).toFixed(1) + '% completion rate'}
          icon={<CheckCircle size={18} color={GOV_GREEN} />}
          color={GOV_GREEN}
          trend={{ value: '+4.1% vs prev. year', up: true }}
        />
        <KpiCard
          title="High Risk Projects"
          value={formatNumber(KPI.high_risk_projects)}
          subtitle="Requiring close monitoring"
          icon={<ShieldAlert size={18} color={GOV_RED} />}
          color={GOV_RED}
          trend={{ value: '+12.4% vs prev. month', up: false }}
        />
        <KpiCard
          title="Anomalies Detected"
          value={formatNumber(KPI.anomalies_detected)}
          subtitle="Current monitoring cycle"
          icon={<AlertTriangle size={18} color={GOV_ORANGE} />}
          color={GOV_ORANGE}
          trend={{ value: '+8.3% vs prev. cycle', up: false }}
        />
        <KpiCard
          title="Financial Irregularities"
          value={String(KPI.financial_irregularities)}
          subtitle="Require immediate action"
          icon={<Users size={18} color={GOV_RED} />}
          color={GOV_RED}
          trend={{ value: 'Critical attention needed', up: false }}
        />
      </div>

      {/* ── Row 1: Fund Chart + Work Status Donut ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

        <SectionCard title="Fund Released vs Expenditure (Year-wise)" subtitle="Values in ₹ Crore">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={fundChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} width={68} />
              <Tooltip
                formatter={(value: any, name: any) => [`₹${value} Cr`, name]}
                contentStyle={{ fontSize: 12, borderRadius: 6 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Released" fill={GOV_BLUE}  radius={[3, 3, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Utilized" fill={GOV_GREEN} radius={[3, 3, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Work Status Distribution" subtitle="Across all MPs and financial years">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={WORK_STATUS_DATA}
                cx="42%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                label={renderCustomLabel}
                labelLine={false}
              >
                {WORK_STATUS_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any, name: any) => [formatNumber(v), name]}
                contentStyle={{ fontSize: 12, borderRadius: 6 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
                layout="vertical"
                align="right"
                verticalAlign="middle"
              />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

      </div>

      {/* ── Row 2: Risk Distribution Donut + AI Risk Trend Line ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

        <SectionCard title="Risk Distribution by Project" subtitle="AI-assessed across all active projects">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={RISK_DIST_DATA}
                cx="42%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                label={renderCustomLabel}
                labelLine={false}
              >
                {RISK_DIST_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any, name: any) => [formatNumber(v) + ' projects', name]}
                contentStyle={{ fontSize: 12, borderRadius: 6 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
                layout="vertical"
                align="right"
                verticalAlign="middle"
              />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="AI Risk Trend (Monthly)" subtitle="High Risk & Critical projects — Jan to Aug 2026">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={RISK_TREND} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="high_risk"
                name="High Risk"
                stroke={GOV_ORANGE}
                strokeWidth={2.5}
                dot={{ r: 3, fill: GOV_ORANGE }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="critical"
                name="Critical"
                stroke={GOV_RED}
                strokeWidth={2.5}
                dot={{ r: 3, fill: GOV_RED }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

      </div>

      {/* ── Sector-wise Spending Horizontal Bar ───────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <SectionCard title="Sector-wise Spending (Top 8)" subtitle="Total MPLADS expenditure by sector · ₹ Crore">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              layout="vertical"
              data={sectorChartData}
              margin={{ top: 4, right: 48, left: 12, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}Cr`} />
              <YAxis type="category" dataKey="sector" tick={{ fontSize: 11 }} width={138} />
              <Tooltip
                formatter={(v: any) => [`₹${v} Cr`, 'Expenditure']}
                contentStyle={{ fontSize: 12, borderRadius: 6 }}
              />
              <Bar dataKey="Amount" name="Expenditure (₹ Cr)" radius={[0, 3, 3, 0]} maxBarSize={20}>
                {sectorChartData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? GOV_BLUE : '#1d4ed8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* ── Top Suspicious Projects Table ─────────────────────────────────────── */}
      <SectionCard
        title="Top Suspicious Projects"
        subtitle="Ranked by AI Risk Score · Top 8 highest-risk projects this cycle"
        actions={
          <ActionButton
            label="View All Projects →"
            variant="secondary"
            onClick={() => navigate('/projects')}
          />
        }
        noPadding
      >
        <Table
          compact
          headers={[
            'Project ID', 'Work Name', 'State', 'MP Name',
            'Sanctioned', 'Expenditure', 'Progress',
            'Risk Score', 'Risk Level', 'Main Reason', 'Action',
          ]}
        >
          {topProjects.map(p => (
            <tr key={p.project_id}>

              {/* Project ID */}
              <td>
                <span
                  style={{ color: GOV_BLUE, fontWeight: 600, cursor: 'pointer', fontSize: 11, textDecoration: 'underline', textDecorationColor: '#00358050' }}
                  onClick={() => navigate(`/projects/${p.project_id}`)}
                  title={p.project_id}
                >
                  {p.project_id}
                </span>
              </td>

              {/* Work Name */}
              <td style={{ maxWidth: 180 }}>
                <span title={p.work_name} style={{ fontSize: 12 }}>
                  {truncate(p.work_name, 32)}
                </span>
              </td>

              {/* State */}
              <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{p.state}</td>

              {/* MP Name */}
              <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                {truncate(p.mp_name, 20)}
              </td>

              {/* Sanctioned Cost */}
              <td style={{ fontSize: 12, textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                {formatCrore(p.sanctioned_cost)}
              </td>

              {/* Expenditure */}
              <td style={{ fontSize: 12, textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                {formatCrore(p.expenditure)}
              </td>

              {/* Progress bar */}
              <td style={{ minWidth: 110 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                    <div
                      style={{
                        width: p.physical_progress + '%',
                        height: '100%',
                        background: getProgressColor(p.physical_progress),
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: getProgressColor(p.physical_progress), minWidth: 30, textAlign: 'right' }}>
                    {p.physical_progress}%
                  </span>
                </div>
              </td>

              {/* Risk Score */}
              <td style={{ textAlign: 'center' }}>
                <span style={{
                  fontWeight: 800,
                  fontSize: 14,
                  color: p.risk_score >= 81 ? GOV_RED : p.risk_score >= 61 ? GOV_ORANGE : p.risk_score >= 31 ? '#d97706' : GOV_GREEN,
                }}>
                  {p.risk_score}
                </span>
              </td>

              {/* Risk Level */}
              <td>
                <RiskBadge level={p.risk_level} size="sm" />
              </td>

              {/* Main Reason */}
              <td>
                <span style={{
                  fontSize: 11,
                  color: p.anomaly_type ? '#92400e' : '#6b7280',
                  background: p.anomaly_type ? '#fff7ed' : 'transparent',
                  padding: p.anomaly_type ? '2px 6px' : '0',
                  borderRadius: 4,
                  fontWeight: p.anomaly_type ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}>
                  {p.anomaly_type ?? 'Routine monitoring'}
                </span>
              </td>

              {/* Action */}
              <td>
                <ActionButton
                  label="Investigate"
                  variant="danger"
                  onClick={() => navigate('/projects/' + p.project_id)}
                />
              </td>

            </tr>
          ))}
        </Table>

        {/* Footer disclaimer */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#9ca3af',
          fontStyle: 'italic',
        }}>
          <span>⚠ Demo environment. Data shown for demonstration purposes. Does not represent official government statistics.</span>
          <span style={{ whiteSpace: 'nowrap', marginLeft: 16 }}>SIH 2026 · PS 26102</span>
        </div>
      </SectionCard>

    </div>
  );
}
