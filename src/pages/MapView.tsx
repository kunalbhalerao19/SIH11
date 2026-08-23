import { useState } from 'react';
import { STATE_STATS } from '../data/demoData';
import type { StateStats } from '../types';
import { PageHeader, SectionCard, ActionButton } from '../components/ui';
import { Map, Layers, Info, ChevronRight } from 'lucide-react';

type MetricKey = 'expenditure' | 'completion_pct' | 'avg_risk_score' | 'anomalies' | 'works_recommended';

const METRIC_OPTIONS: { key: MetricKey; label: string }[] = [
  { key: 'expenditure', label: 'Expenditure' },
  { key: 'completion_pct', label: 'Completion Rate' },
  { key: 'avg_risk_score', label: 'Risk Score' },
  { key: 'anomalies', label: 'Anomalies' },
  { key: 'works_recommended', label: 'Works' },
];

function getColor(value: number, metric: MetricKey): string {
  if (metric === 'avg_risk_score' || metric === 'anomalies') {
    if (value >= 60) return '#dc2626';
    if (value >= 40) return '#ea580c';
    if (value >= 25) return '#d97706';
    return '#16a34a';
  }
  if (metric === 'completion_pct') {
    if (value >= 85) return '#16a34a';
    if (value >= 70) return '#d97706';
    return '#dc2626';
  }
  // For expenditure, works: normalize to percentile
  return '#1e40af';
}

function getMetricLabel(s: StateStats, metric: MetricKey): string {
  switch (metric) {
    case 'expenditure': return `₹${(s.expenditure / 100).toFixed(0)} Cr`;
    case 'completion_pct': return `${s.completion_pct.toFixed(0)}%`;
    case 'avg_risk_score': return `${s.avg_risk_score}`;
    case 'anomalies': return `${s.anomalies}`;
    case 'works_recommended': return `${(s.works_recommended / 1000).toFixed(1)}K`;
  }
}

export default function MapView() {
  const [metric, setMetric] = useState<MetricKey>('avg_risk_score');
  const [selected, setSelected] = useState<StateStats | null>(null);

  const maxVal = Math.max(...STATE_STATS.map(s => s[metric] as number));

  return (
    <div>
      <PageHeader title="Map View" subtitle="Geographic distribution of MPLADS data by state" />

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', background: 'white', border: '1px solid #e5e7eb', borderRadius: 6 }}>
        <Layers size={14} color="#6b7280" />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginRight: 4 }}>View By:</span>
        {METRIC_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => setMetric(opt.key)}
            style={{
              padding: '5px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer',
              border: '1px solid ' + (metric === opt.key ? '#003580' : '#e5e7eb'),
              background: metric === opt.key ? '#003580' : 'white',
              color: metric === opt.key ? 'white' : '#374151',
              fontWeight: metric === opt.key ? 600 : 400,
            }}
          >{opt.label}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#6b7280' }}>
          <span>Legend:</span>
          {metric === 'avg_risk_score' || metric === 'anomalies' ? (
            <>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, background: '#16a34a', borderRadius: 2, display: 'inline-block' }} />Low</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, background: '#d97706', borderRadius: 2, display: 'inline-block' }} />Medium</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, background: '#dc2626', borderRadius: 2, display: 'inline-block' }} />High</span>
            </>
          ) : (
            <>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, background: '#dc2626', borderRadius: 2, display: 'inline-block' }} />Low</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, background: '#d97706', borderRadius: 2, display: 'inline-block' }} />Medium</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, background: '#16a34a', borderRadius: 2, display: 'inline-block' }} />High</span>
            </>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        <span>India</span>
        {selected && <><ChevronRight size={12} /><span style={{ color: '#003580', fontWeight: 600 }}>{selected.state}</span></>}
        {selected && <span style={{ color: '#9ca3af' }}>• District/Constituency level drill-down available in production</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '65% 35%' : '1fr', gap: 16 }}>
        {/* Grid Map */}
        <SectionCard title={`India — State Overview (${METRIC_OPTIONS.find(m => m.key === metric)?.label})`} subtitle="Click a state to view details">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {[...STATE_STATS].sort((a, b) => a.state.localeCompare(b.state)).map(s => {
              const val = s[metric] as number;
              const color = getColor(val, metric);
              const isSelected = selected?.state === s.state;
              return (
                <div
                  key={s.state}
                  onClick={() => setSelected(prev => prev?.state === s.state ? null : s)}
                  style={{
                    padding: '12px 10px', borderRadius: 6, cursor: 'pointer',
                    background: `${color}22`,
                    border: `2px solid ${isSelected ? '#003580' : color + '66'}`,
                    transition: 'all 0.15s',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#374151', lineHeight: 1.2, marginBottom: 4 }}>
                    {s.state.length > 15 ? s.state.split(' ').slice(0, 2).join(' ') : s.state}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color }}>
                    {getMetricLabel(s, metric)}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, padding: '8px 12px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 6, fontSize: 11, color: '#0c4a6e', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
            Geographic map visualization based on state-level aggregated data. District and constituency drill-down available in the production version with full map integration.
          </div>
        </SectionCard>

        {/* State Detail Panel */}
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SectionCard title={selected.state}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Funds Released', value: `₹${(selected.funds_released / 100).toFixed(0)} Cr` },
                  { label: 'Expenditure', value: `₹${(selected.expenditure / 100).toFixed(0)} Cr` },
                  { label: 'Works Recommended', value: selected.works_recommended.toLocaleString('en-IN') },
                  { label: 'Works Completed', value: selected.works_completed.toLocaleString('en-IN') },
                  { label: 'High Risk Projects', value: selected.high_risk_projects },
                  { label: 'Anomalies Detected', value: selected.anomalies },
                ].map(item => (
                  <div key={item.label} style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Utilization bar */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: '#6b7280' }}>Fund Utilization</span>
                  <span style={{ fontWeight: 700, color: selected.utilization_pct >= 85 ? '#16a34a' : '#d97706' }}>
                    {selected.utilization_pct.toFixed(1)}%
                  </span>
                </div>
                <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${selected.utilization_pct}%`, height: '100%', background: selected.utilization_pct >= 85 ? '#16a34a' : '#d97706', borderRadius: 4 }} />
                </div>
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <ActionButton label="View State Analytics" variant="primary" />
                <ActionButton label="View Projects" variant="secondary" />
              </div>
            </SectionCard>

            {/* Drill-down note */}
            <div style={{ padding: '12px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>Drill-down Navigation</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['India (National Level)', `${selected.state} (State Level)`, 'District Level →', 'Constituency Level →', 'MP Level →', 'Project Level →'].map((level, i) => (
                  <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: i <= 1 ? '#003580' : '#d1d5db', flexShrink: 0 }} />
                    <span style={{ color: i <= 1 ? '#003580' : '#9ca3af', fontWeight: i <= 1 ? 600 : 400 }}>{level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
