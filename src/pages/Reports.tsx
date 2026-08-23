import { useState } from 'react';
import { PageHeader, SectionCard } from '../components/ui';
import {
  FileText, Download, Printer, BarChart3, AlertTriangle, DollarSign,
  Users, Map, Clock, CheckCircle, RefreshCw
} from 'lucide-react';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  count: string;
  border: string;
}

const REPORTS: ReportCard[] = [
  { id: 'anomaly', title: 'AI Anomaly Report', description: 'All AI-detected anomalies with risk scores, contributing factors, and investigation status.', icon: <AlertTriangle size={20} color="#dc2626" />, count: '287 anomalies', border: '#dc2626' },
  { id: 'state-perf', title: 'State Performance Report', description: 'State-wise fund utilization, completion rates, anomaly counts, and risk assessments.', icon: <Map size={20} color="#1e40af" />, count: '30 states', border: '#1e40af' },
  { id: 'mp-perf', title: 'MP Performance Report', description: 'MP-wise efficiency scores, expenditure analysis, and project completion statistics.', icon: <Users size={20} color="#7c3aed" />, count: '790 MPs', border: '#7c3aed' },
  { id: 'fund', title: 'Fund Utilization Report', description: 'Year-wise and state-wise fund release, utilization, and unspent balance tracking.', icon: <DollarSign size={20} color="#16a34a" />, count: '₹1,185 Cr tracked', border: '#16a34a' },
  { id: 'high-risk', title: 'High Risk Project Report', description: 'All HIGH and CRITICAL risk projects with AI explanations and recommended actions.', icon: <BarChart3 size={20} color="#ea580c" />, count: '1,342 projects', border: '#ea580c' },
  { id: 'delayed', title: 'Delayed Project Report', description: 'All projects running behind the expected completion schedule with delay analysis.', icon: <Clock size={20} color="#d97706" />, count: '2,841 projects', border: '#d97706' },
  { id: 'sector', title: 'Sector Analysis Report', description: 'Sector-wise spending patterns, anomaly rates, and performance comparison.', icon: <BarChart3 size={20} color="#0891b2" />, count: '10 sectors', border: '#0891b2' },
  { id: 'irregularity', title: 'Financial Irregularity Report', description: 'Potential financial irregularities detected by AI requiring official verification.', icon: <AlertTriangle size={20} color="#9f1239" />, count: '48 flagged', border: '#9f1239' },
  { id: 'completed', title: 'Completed Works Report', description: 'All completed works verification data including actual vs expected completion timelines.', icon: <CheckCircle size={20} color="#15803d" />, count: '31,248 works', border: '#15803d' },
];

export default function Reports() {
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState<Record<string, boolean>>({});

  const handleGenerate = (id: string) => {
    setGenerating(p => ({ ...p, [id]: true }));
    setReady(p => ({ ...p, [id]: false }));
    setTimeout(() => {
      setGenerating(p => ({ ...p, [id]: false }));
      setReady(p => ({ ...p, [id]: true }));
    }, 1800);
  };

  return (
    <div>
      <PageHeader title="Reports" subtitle="Generate and export government-grade MPLADS monitoring reports" />

      {/* Quick Actions */}
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 6, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Quick Export:</span>
        {[
          { label: 'All Projects CSV', icon: <Download size={12} /> },
          { label: 'Anomaly Summary', icon: <Download size={12} /> },
          { label: 'Print Dashboard', icon: <Printer size={12} /> },
          { label: 'Refresh Data', icon: <RefreshCw size={12} /> },
        ].map(btn => (
          <button
            key={btn.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'white', border: '1px solid #d1d5db', color: '#374151',
              padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer',
            }}
          >
            {btn.icon} {btn.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 11, color: '#9ca3af' }}>
          Last refresh: 22 Aug 2026, 22:30 IST
        </div>
      </div>

      {/* Report Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {REPORTS.map(report => (
          <div
            key={report.id}
            style={{
              background: 'white', border: '1px solid #e5e7eb',
              borderTop: `3px solid ${report.border}`,
              borderRadius: 6, padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, background: report.border + '15', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {report.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{report.title}</div>
                <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>{report.description}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 11, color: '#9ca3af' }}>
              <span>Records: <strong style={{ color: '#374151' }}>{report.count}</strong></span>
              {ready[report.id] && (
                <span style={{ color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={11} /> Report Ready
                </span>
              )}
              {!ready[report.id] && (
                <span>Last generated: 22 Aug 2026</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => handleGenerate(report.id)}
                disabled={generating[report.id]}
                style={{
                  flex: 1, background: generating[report.id] ? '#e5e7eb' : '#003580',
                  color: generating[report.id] ? '#6b7280' : 'white',
                  border: 'none', padding: '6px 0', borderRadius: 4, fontSize: 11,
                  cursor: generating[report.id] ? 'not-allowed' : 'pointer', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}
              >
                {generating[report.id] ? (
                  <><RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                ) : (
                  'Generate'
                )}
              </button>
              <button style={{ background: 'white', border: '1px solid #d1d5db', padding: '6px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', gap: 3 }}>
                <FileText size={11} /> PDF
              </button>
              <button style={{ background: 'white', border: '1px solid #d1d5db', padding: '6px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Download size={11} /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Reports */}
      <div style={{ marginTop: 20 }}>
        <SectionCard title="Automated Report Schedule" subtitle="Configure reports to be generated automatically">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Daily Anomaly Summary', schedule: 'Every day at 06:00 IST', status: 'Active' },
              { label: 'Weekly State Performance', schedule: 'Every Monday at 08:00 IST', status: 'Active' },
              { label: 'Monthly MP Report', schedule: '1st of each month', status: 'Inactive' },
            ].map(sr => (
              <div key={sr.label} style={{ padding: '12px 14px', background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{sr.label}</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>{sr.schedule}</div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3,
                  background: sr.status === 'Active' ? '#dcfce7' : '#f3f4f6',
                  color: sr.status === 'Active' ? '#166534' : '#6b7280',
                }}>
                  {sr.status}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
