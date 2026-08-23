import { PageHeader, SectionCard, KpiCard, Table } from '../components/ui';
import { Brain, Activity, GitBranch, Database, Shield, CheckCircle, ArrowRight, Info, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FEATURE_WEIGHTS = [
  { name: 'Expenditure vs Progress Gap', weight: 25, color: '#dc2626' },
  { name: 'Cost Deviation', weight: 25, color: '#ea580c' },
  { name: 'Completion Delay', weight: 20, color: '#d97706' },
  { name: 'Payment Frequency', weight: 15, color: '#1e40af' },
  { name: 'Historical Comparison', weight: 10, color: '#7c3aed' },
  { name: 'Sector Cost Outlier', weight: 5, color: '#0891b2' },
];

const PIPELINE_STEPS = [
  { step: '01', title: 'MPLADS Data Ingestion', desc: 'Structured MPLADS data from MoSPI portal including project, MP, fund, and expenditure records.', icon: <Database size={18} color="#003580" /> },
  { step: '02', title: 'Data Cleaning & Validation', desc: 'Remove duplicates, handle missing values, validate data types, and normalize monetary fields.', icon: <Shield size={18} color="#1e40af" /> },
  { step: '03', title: 'Feature Engineering', desc: 'Derive key features: expenditure ratios, cost deviations, delay days, payment frequency metrics.', icon: <GitBranch size={18} color="#7c3aed" /> },
  { step: '04', title: 'Anomaly Detection (ML)', desc: 'Isolation Forest identifies statistical outliers. K-Means clustering groups unusual project patterns.', icon: <Brain size={18} color="#dc2626" /> },
  { step: '05', title: 'Risk Scoring Engine', desc: 'Weighted scoring system assigns 0-100 risk score. XGBoost classifies into LOW/MEDIUM/HIGH/CRITICAL.', icon: <BarChart3 size={18} color="#ea580c" /> },
  { step: '06', title: 'Explainable AI (SHAP)', desc: 'SHAP values decompose each risk score into contributing factors with percentage weights.', icon: <Activity size={18} color="#16a34a" /> },
  { step: '07', title: 'Official Verification', desc: 'All AI alerts require authorized officer review. AI suggests — humans decide.', icon: <CheckCircle size={18} color="#16a34a" /> },
];

const MODEL_CARDS = [
  {
    title: 'Isolation Forest',
    subtitle: 'Unsupervised Anomaly Detection',
    desc: 'Identifies outlier projects by isolating data points that differ significantly from the normal MPLADS project pattern across cost, progress, and payment dimensions.',
    features: 5, accuracy: 89, border: '#003580', bg: '#eff6ff',
  },
  {
    title: 'Random Forest / XGBoost',
    subtitle: 'Risk Classification',
    desc: 'Classifies projects into LOW/MEDIUM/HIGH/CRITICAL risk categories based on engineered features. Trained on labeled anomaly examples from domain experts.',
    features: 12, accuracy: 91, border: '#16a34a', bg: '#f0fdf4',
  },
  {
    title: 'K-Means Clustering',
    subtitle: 'Pattern Grouping',
    desc: 'Groups similar projects and identifies clusters with unusual characteristics — useful for detecting coordinated irregularities or systematic contractor patterns.',
    features: 8, accuracy: null, border: '#ea580c', bg: '#fff7ed',
  },
  {
    title: 'ARIMA / Time-Series',
    subtitle: 'Spending Pattern Analysis',
    desc: 'Detects unusual spending velocity, irregular payment timing, and deviations from expected fund flow patterns over a project timeline.',
    features: 6, accuracy: 85, border: '#7c3aed', bg: '#faf5ff',
  },
];

const RISK_TABLE = [
  { range: '0 – 30', level: 'LOW', desc: 'Normal project pattern. Within expected norms.', action: 'Routine monitoring', bg: '#f0fdf4', color: '#166534' },
  { range: '31 – 60', level: 'MEDIUM', desc: 'Some indicators deviate from expected. Review advisable.', action: 'Flag for periodic review', bg: '#fffbeb', color: '#92400e' },
  { range: '61 – 80', level: 'HIGH', desc: 'Significant anomalies detected. Official attention required.', action: 'Assign to officer', bg: '#fff7ed', color: '#9a3412' },
  { range: '81 – 100', level: 'CRITICAL', desc: 'Extreme deviations. Potential serious irregularity.', action: 'Immediate investigation', bg: '#fef2f2', color: '#991b1b' },
];

export default function AIModel() {
  return (
    <div>
      <PageHeader title="AI Model Insights" subtitle="How the system detects anomalies and calculates risk scores" />

      {/* Disclaimer */}
      <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
        <Info size={16} color="#ea580c" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: '#9a3412', lineHeight: 1.6 }}>
          <strong>Prototype Disclaimer:</strong> This is a demonstration system built for SIH 2026 Problem Statement 26102.
          The AI models shown are illustrative implementations. In production, these would be trained on actual MPLADS data by domain experts and validated by government authorities.
          All results require official human verification before administrative action.
        </div>
      </div>

      {/* AI Pipeline */}
      <SectionCard title="AI Anomaly Detection Pipeline" subtitle="End-to-end flow from raw data to official decision">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: '#eff6ff',
                  border: '2px solid #003580', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#003580', flexShrink: 0,
                }}>
                  {step.step}
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div style={{ width: 2, height: 24, background: '#e5e7eb', margin: '4px 0' }} />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  {step.icon}
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{step.title}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Model Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginTop: 16 }}>
        {MODEL_CARDS.map(m => (
          <div key={m.title} style={{ background: m.bg, border: `1px solid ${m.border}40`, borderTop: `3px solid ${m.border}`, borderRadius: 6, padding: '16px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{m.title}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: m.border, marginBottom: 8 }}>{m.subtitle}</div>
            <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, margin: '0 0 12px' }}>{m.desc}</p>
            <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
              <div><span style={{ color: '#9ca3af' }}>Features: </span><strong>{m.features}</strong></div>
              <div>
                <span style={{ color: '#9ca3af' }}>Demo Accuracy: </span>
                <strong style={{ color: m.border }}>{m.accuracy ? `${m.accuracy}%` : '—'}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Importance */}
      <div style={{ marginTop: 16 }}>
        <SectionCard title="Feature Importance (Prototype Scoring Weights)" subtitle="Relative contribution of each factor to the risk score — demo methodology only">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={FEATURE_WEIGHTS} layout="vertical" margin={{ left: 200, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 30]} tickFormatter={v => `${v}%`} fontSize={11} />
              <YAxis type="category" dataKey="name" fontSize={11} width={190} />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Bar dataKey="weight" name="Weight" radius={[0, 4, 4, 0]}>
                {FEATURE_WEIGHTS.map((f, i) => <Cell key={i} fill={f.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 4 }}>
            Weights shown are for the prototype demo model only and do not represent production methodology.
          </div>
        </SectionCard>
      </div>

      {/* Risk Scoring Table */}
      <div style={{ marginTop: 16 }}>
        <SectionCard title="Risk Score Thresholds — Demo Prototype">
          <table className="gov-table">
            <thead>
              <tr><th>Score Range</th><th>Risk Level</th><th>Description</th><th>Recommended Action</th></tr>
            </thead>
            <tbody>
              {RISK_TABLE.map(r => (
                <tr key={r.level}>
                  <td style={{ fontWeight: 700, color: r.color, fontSize: 14 }}>{r.range}</td>
                  <td><span style={{ background: r.bg, color: r.color, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{r.level}</span></td>
                  <td style={{ fontSize: 12 }}>{r.desc}</td>
                  <td style={{ fontSize: 12, fontWeight: 600, color: r.color }}>{r.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>

      {/* Explainable AI */}
      <div style={{ marginTop: 16 }}>
        <SectionCard title="Explainable AI — Why Every Alert Has a Reason" subtitle="AI transparency through factor decomposition">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.7, margin: '0 0 12px' }}>
                Every AI risk score is decomposed into contributing factors, similar to SHAP (SHapley Additive Explanations).
                This means government officials always know <strong>why</strong> a project was flagged — not just that it was flagged.
              </p>
              <div style={{ padding: '10px 14px', background: '#f0f9ff', borderRadius: 6, border: '1px solid #bae6fd', fontSize: 12 }}>
                <strong style={{ color: '#0c4a6e' }}>Key Benefit:</strong> Officials can verify whether the AI reason is valid,
                challenge false positives, and provide context — making the system a <em>decision support tool</em>, not an autonomous decision maker.
              </div>
            </div>
            <div style={{ padding: '14px', background: '#fef2f2', borderRadius: 6, border: '1px solid #fecaca' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>Example: MPL-2026-00451</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 10 }}>Risk Score: 91/100 — CRITICAL</div>
              {[
                { name: 'Cost Deviation', pct: 78 },
                { name: 'Progress Mismatch', pct: 65 },
                { name: 'Completion Delay', pct: 48 },
                { name: 'Payment Anomaly', pct: 41 },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600 }}>{f.name}</span>
                    <span style={{ color: '#dc2626', fontWeight: 700 }}>{f.pct}%</span>
                  </div>
                  <div style={{ height: 14, background: '#fee2e2', borderRadius: 2, overflow: 'hidden' }}>
                    <div className="feature-bar" style={{ width: `${f.pct}%`, height: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Model Performance */}
      <div style={{ marginTop: 16 }}>
        <SectionCard title="Model Performance Metrics" subtitle="Simulated metrics for demonstration purposes only">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'True Positive Rate', value: '87%', desc: 'Correctly flagged anomalies', color: '#16a34a' },
              { label: 'Precision', value: '89%', desc: 'Flagged items that are actual anomalies', color: '#1e40af' },
              { label: 'Recall', value: '83%', desc: 'Anomalies successfully detected', color: '#7c3aed' },
              { label: 'False Positive Rate', value: '12%', desc: 'Normal projects incorrectly flagged', color: '#ea580c' },
            ].map(m => (
              <div key={m.label} style={{ padding: '14px 16px', background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginTop: 4 }}>{m.label}</div>
                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
