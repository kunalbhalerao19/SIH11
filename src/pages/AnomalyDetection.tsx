import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ANOMALIES } from '../data/demoData';
import type { AnomalyType, AlertSeverity, InvestigationStatus, Anomaly } from '../types';
import { useToast } from '../context/ToastContext';
import { generateAnomaliesPDF, exportToCSV } from '../lib/exportUtils';
import {
  PageHeader,
  SectionCard,
  FilterBar,
  Table,
  ActionButton,
  StatusBadge,
  Pagination,
  KpiCard,
} from '../components/ui';
import { AlertTriangle, Search, Filter, Download, Eye, FileText } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ── Constants ────────────────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<AlertSeverity, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

const SEVERITY_COLORS: Record<AlertSeverity, { bg: string; color: string; border: string }> = {
  CRITICAL: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
  HIGH:     { bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
  MEDIUM:   { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
  LOW:      { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' },
};

const DONUT_DATA = [
  { name: 'CRITICAL', value: 48,  fill: '#dc2626' },
  { name: 'HIGH',     value: 124, fill: '#FF6B00' },
  { name: 'MEDIUM',   value: 89,  fill: '#d97706' },
  { name: 'LOW',      value: 26,  fill: '#6b7280' },
];

const ALL_ANOMALY_TYPES: AnomalyType[] = [
  'High Cost',
  'Unusual Payment',
  'Budget Utilization Mismatch',
  'Progress Mismatch',
  'Delayed Completion',
  'Repeated Payment',
  'Contractor Pattern',
  'Geographical Cost Outlier',
  'Sector Cost Outlier',
  'Unusual Expenditure Trend',
];

const ALL_STATUSES: InvestigationStatus[] = [
  'Open',
  'Under Review',
  'Resolved',
  'False Positive',
];

const ALL_STATES = Array.from(new Set(ANOMALIES.map((a) => a.state))).sort();

// Build bar chart data from anomaly type counts in demo data
const typeCountMap: Record<string, number> = {};
ANOMALIES.forEach((a) => {
  typeCountMap[a.anomaly_type] = (typeCountMap[a.anomaly_type] ?? 0) + 1;
});
const TYPE_BAR_DATA = Object.entries(typeCountMap)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count);

const PER_PAGE = 10;

// ── Sub-components ────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const c = SEVERITY_COLORS[severity];
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.05em',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {severity}
    </span>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 90 ? '#dc2626' : value >= 75 ? '#ea580c' : value >= 50 ? '#d97706' : '#16a34a';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 90 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: '#e5e7eb',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3 }}
        />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 30, textAlign: 'right' }}>
        {value}%
      </span>
    </div>
  );
}

function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}
    >
      <strong style={{ color: d.payload.fill }}>{d.name}</strong>
      <div style={{ color: '#374151' }}>{d.value} anomalies</div>
    </div>
  );
}

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        maxWidth: 200,
      }}
    >
      <strong style={{ color: '#003580' }}>{label}</strong>
      <div style={{ color: '#374151' }}>{payload[0].value} anomalies</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AnomalyDetection() {
  const navigate = useNavigate();
  const { success, info } = useToast();

  const [anomalyList, setAnomalyList] = useState<Anomaly[]>(ANOMALIES);
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterState, setFilterState] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return anomalyList.filter((a) => {
      if (filterSeverity && a.severity !== filterSeverity) return false;
      if (filterType && a.anomaly_type !== filterType) return false;
      if (filterStatus && a.status !== filterStatus) return false;
      if (filterState && a.state !== filterState) return false;
      return true;
    }).sort((a, b) => {
      const sevDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
      if (sevDiff !== 0) return sevDiff;
      return b.ai_confidence - a.ai_confidence;
    });
  }, [anomalyList, filterSeverity, filterType, filterStatus, filterState]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleMarkReviewed = (anomalyId: string) => {
    setAnomalyList(prev =>
      prev.map(a => (a.anomaly_id === anomalyId ? { ...a, status: 'Under Review' as InvestigationStatus } : a))
    );
    success('Anomaly Status Updated', `Marked ${anomalyId} as Under Review`);
  };

  const handleAssign = (anomalyId: string) => {
    info('Officer Assigned', `Vigilance inspection officer assigned to ${anomalyId}`);
  };

  const handleExportCSV = () => {
    exportToCSV(filtered, `MPLADS_Anomalies_${new Date().toISOString().slice(0, 10)}.csv`);
    success('CSV Export Completed', `Downloaded ${filtered.length} anomaly records as CSV`);
  };

  const handleExportPDF = () => {
    generateAnomaliesPDF(filtered);
    success('PDF Report Generated', `Downloaded official anomaly audit PDF`);
  };

  function handleFilter(setter: (v: string) => void) {
    return (v: string) => {
      setter(v);
      setPage(1);
    };
  }

  return (
    <div style={{ padding: '20px 24px', maxWidth: 1400, margin: '0 auto' }}>

      {/* Header */}
      <PageHeader
        title="Anomaly Detection"
        subtitle="AI-detected anomalies requiring official verification"
        badge={
          <span
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              padding: '3px 10px',
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <AlertTriangle size={11} />
            LIVE MONITORING
          </span>
        }
      />

      {/* Demo disclaimer */}
      <div
        style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 6,
          padding: '8px 14px',
          marginBottom: 20,
          fontSize: 12,
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Search size={13} />
        Demo environment. Data shown for demonstration purposes only.
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 20,
        }}
      >
        <KpiCard
          title="Total Anomalies"
          value="287"
          subtitle="Across all flagged projects"
          color="#FF6B00"
          icon={<AlertTriangle size={20} color="#FF6B00" />}
        />
        <KpiCard
          title="Critical"
          value="48"
          subtitle="Immediate review required"
          color="#dc2626"
          icon={<AlertTriangle size={20} color="#dc2626" />}
          trend={{ value: '+6 this week', up: false }}
        />
        <KpiCard
          title="High"
          value="124"
          subtitle="Escalated for review"
          color="#FF6B00"
          icon={<Filter size={20} color="#FF6B00" />}
          trend={{ value: '+14 this week', up: false }}
        />
        <KpiCard
          title="Under Review"
          value="31"
          subtitle="Being investigated"
          color="#003580"
          icon={<Eye size={20} color="#003580" />}
        />
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Donut — Severity breakdown */}
        <SectionCard title="Anomalies by Severity" subtitle="Distribution across severity levels">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={DONUT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {DONUT_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {DONUT_DATA.map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: d.fill,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, fontSize: 12, color: '#374151', fontWeight: 500 }}>
                    {d.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: d.fill,
                      minWidth: 28,
                      textAlign: 'right',
                    }}
                  >
                    {d.value}
                  </div>
                </div>
              ))}
              <div
                style={{
                  marginTop: 4,
                  paddingTop: 8,
                  borderTop: '1px solid #e5e7eb',
                  fontSize: 12,
                  color: '#6b7280',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Total</span>
                <span style={{ fontWeight: 700, color: '#111827' }}>287</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Bar — Anomaly types */}
        <SectionCard title="Anomalies by Type" subtitle="Count of detected anomaly types">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart
              data={TYPE_BAR_DATA}
              margin={{ top: 4, right: 8, left: -20, bottom: 44 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="count" fill="#003580" radius={[3, 3, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Filters */}
      <FilterBar
        filters={[
          {
            label: 'Severity',
            options: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
            value: filterSeverity,
            onChange: handleFilter(setFilterSeverity),
          },
          {
            label: 'Anomaly Type',
            options: ALL_ANOMALY_TYPES,
            value: filterType,
            onChange: handleFilter(setFilterType),
          },
          {
            label: 'Status',
            options: ALL_STATUSES,
            value: filterStatus,
            onChange: handleFilter(setFilterStatus),
          },
          {
            label: 'State',
            options: ALL_STATES,
            value: filterState,
            onChange: handleFilter(setFilterState),
          },
        ]}
      />

      {/* Anomaly Table */}
      <SectionCard
        title={`Detected Anomalies (${filtered.length})`}
        subtitle="Sorted by severity then AI confidence — descending"
        noPadding
        actions={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span
              style={{
                fontSize: 11,
                color: '#6b7280',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Download size={12} />
              {filtered.length} records
            </span>
            <ActionButton
              label="Export CSV"
              variant="ghost"
              onClick={handleExportCSV}
            />
            <ActionButton
              label="Export PDF"
              variant="secondary"
              onClick={handleExportPDF}
            />
          </div>
        }
      >
        <Table
          compact
          headers={[
            'Anomaly ID',
            'Project ID',
            'Work Name',
            'Anomaly Type',
            'Severity',
            'Detected Value',
            'Expected Value',
            'Deviation',
            'AI Confidence',
            'Status',
            'Actions',
          ]}
        >
          {paginated.length === 0 ? (
            <tr>
              <td
                colSpan={11}
                style={{
                  textAlign: 'center',
                  padding: '32px 16px',
                  color: '#9ca3af',
                  fontSize: 13,
                }}
              >
                No anomalies match the selected filters.
              </td>
            </tr>
          ) : (
            paginated.map((anomaly) => (
              <tr key={anomaly.anomaly_id}>
                {/* Anomaly ID */}
                <td>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 11,
                      color: '#003580',
                      fontWeight: 700,
                    }}
                  >
                    {anomaly.anomaly_id}
                  </span>
                </td>

                {/* Project ID */}
                <td>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#374151' }}>
                    {anomaly.project_id}
                  </span>
                </td>

                {/* Work Name */}
                <td style={{ maxWidth: 200 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#111827',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 190,
                    }}
                    title={anomaly.work_name}
                  >
                    {anomaly.work_name}
                  </div>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 1 }}>
                    {anomaly.state} · {anomaly.mp_name}
                  </div>
                </td>

                {/* Anomaly Type */}
                <td>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#374151',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      padding: '2px 6px',
                      borderRadius: 4,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {anomaly.anomaly_type}
                  </span>
                </td>

                {/* Severity */}
                <td>
                  <SeverityBadge severity={anomaly.severity} />
                </td>

                {/* Detected Value */}
                <td>
                  <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 500 }}>
                    {anomaly.detected_value}
                  </span>
                </td>

                {/* Expected Value */}
                <td>
                  <span style={{ fontSize: 12, color: '#16a34a' }}>
                    {anomaly.expected_value}
                  </span>
                </td>

                {/* Deviation */}
                <td>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: anomaly.deviation.startsWith('+') ? '#dc2626' : '#16a34a',
                    }}
                  >
                    {anomaly.deviation}
                  </span>
                </td>

                {/* AI Confidence */}
                <td style={{ minWidth: 110 }}>
                  <ConfidenceBar value={anomaly.ai_confidence} />
                </td>

                {/* Status */}
                <td>
                  <StatusBadge status={anomaly.status} />
                </td>

                {/* Actions */}
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <ActionButton
                      label="View Project"
                      variant="secondary"
                      onClick={() => navigate(`/projects/${anomaly.project_id}`)}
                    />
                    {anomaly.status === 'Open' && (
                      <ActionButton
                        label="Mark Reviewed"
                        variant="primary"
                        onClick={() => handleMarkReviewed(anomaly.anomaly_id)}
                      />
                    )}
                    {(anomaly.status === 'Open' || anomaly.status === 'Under Review') && (
                      <ActionButton
                        label="Assign"
                        variant="ghost"
                        onClick={() => handleAssign(anomaly.anomaly_id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </Table>

        {/* Pagination */}
        <div style={{ padding: '8px 16px 14px' }}>
          <Pagination
            page={page}
            total={filtered.length}
            perPage={PER_PAGE}
            onPage={setPage}
          />
        </div>
      </SectionCard>

      {/* Amber official disclaimer */}
      <div
        style={{
          marginTop: 20,
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderLeft: '4px solid #f59e0b',
          borderRadius: 6,
          padding: '12px 16px',
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}
      >
        <AlertTriangle
          size={18}
          color="#d97706"
          style={{ marginTop: 1, flexShrink: 0 }}
        />
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#92400e',
              marginBottom: 2,
            }}
          >
            Important Notice — Official Use Only
          </div>
          <div style={{ fontSize: 12, color: '#78350f', lineHeight: 1.6 }}>
            AI-detected anomalies are indicators of potential irregularities and do not confirm
            misconduct. All flagged items require official verification by authorized personnel
            before any administrative action.
          </div>
        </div>
      </div>
    </div>
  );
}
