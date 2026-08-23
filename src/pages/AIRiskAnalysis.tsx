import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECTS } from '../data/demoData';
import type { Project } from '../types';
import { PageHeader, SectionCard, Table, ActionButton, StatusBadge, Pagination } from '../components/ui';
import { RiskBadge, RiskScoreBar } from '../components/RiskBadge';
import { getRiskColor, getRiskBgColor, getScoreColor } from '../lib/riskEngine';
import { calculateMultiModalEvidence } from '../lib/aiModulesEngine';
import { formatCrore, formatDate, formatPct } from '../lib/utils';
import {
  Brain, AlertTriangle, Clock, DollarSign, ChevronRight,
  Activity, Info, TrendingUp, BarChart3, Layers, ExternalLink, Sparkles
} from 'lucide-react';

export default function AIRiskAnalysis() {
  const navigate = useNavigate();
  const highRiskProjects = [...PROJECTS]
    .filter(p => p.risk_level === 'HIGH' || p.risk_level === 'CRITICAL')
    .sort((a, b) => b.risk_score - a.risk_score);

  const [selectedId, setSelectedId] = useState(highRiskProjects[0]?.project_id || '');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const project = PROJECTS.find(p => p.project_id === selectedId) || highRiskProjects[0];

  const fundUtil = project ? (project.expenditure / Math.max(project.fund_released, 1)) * 100 : 0;

  const multiModal = useMemo(() => {
    return project ? calculateMultiModalEvidence(project) : null;
  }, [project]);

  const similarProjects = PROJECTS
    .filter(p => p.sector === project?.sector && p.project_id !== project?.project_id)
    .slice(0, 4);
  const simAvg = similarProjects.length
    ? similarProjects.reduce((s, p) => s + p.sanctioned_cost, 0) / similarProjects.length
    : 0;
  const costDevPct = project && simAvg > 0
    ? ((project.sanctioned_cost - simAvg) / simAvg * 100) : 0;

  const paged = highRiskProjects.slice((page - 1) * perPage, page * perPage);

  if (!project) return <div>No high-risk projects found.</div>;

  const scoreColor = getScoreColor(project.risk_score);

  return (
    <div>
      <PageHeader
        title="AI Risk Analysis"
        subtitle="Explainable AI risk scoring and anomaly investigation for MPLAD projects"
      />

      {/* Disclaimer */}
      <div style={{
        background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6,
        padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <Info size={16} color="#ea580c" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: '#9a3412' }}>
          <strong>Important:</strong> AI-generated risk scores are indicators of <em>potential anomalies</em> and do not confirm fraud or misconduct.
          Every flagged project requires official human verification before any administrative action. This is a prototype system for SIH 2026.
        </div>
      </div>

      {/* Project Selector */}
      <SectionCard
        title="Select Project for Analysis"
        actions={
          <button
            onClick={() => navigate('/ai-analytics')}
            style={{
              background: '#003580', color: 'white', border: 'none',
              padding: '6px 12px', borderRadius: 4, fontSize: 11.5, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Layers size={13} /> Open AI Analytics Lab <ExternalLink size={11} />
          </button>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>Project:</label>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            style={{
              border: '1px solid #d1d5db', borderRadius: 4, padding: '7px 12px',
              fontSize: 12, color: '#111827', flex: 1, maxWidth: 600,
            }}
          >
            {PROJECTS.sort((a, b) => b.risk_score - a.risk_score).map(p => (
              <option key={p.project_id} value={p.project_id}>
                [{p.risk_level}] {p.project_id} — {p.work_name} ({p.state})
              </option>
            ))}
          </select>
          <span style={{
            background: getRiskBgColor(project.risk_level),
            color: getRiskColor(project.risk_level),
            border: `1px solid ${getRiskColor(project.risk_level)}30`,
            padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700,
          }}>
            {project.risk_level} — {project.risk_score}/100
          </span>
        </div>

        {/* 6 Sub-Module Risk Scores Row */}
        {multiModal && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={12} color="#003580" />
              Multi-Modal AI Engines Breakdown (6 Domain Sub-Scores):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
              {[
                { label: 'Financial Risk', score: multiModal.moduleScores.financial.score, color: '#1e40af' },
                { label: 'Photo/Vision Risk', score: multiModal.moduleScores.photo.score, color: '#0891b2' },
                { label: 'Geographic Risk', score: multiModal.moduleScores.geospatial.score, color: '#059669' },
                { label: 'Vendor Risk', score: multiModal.moduleScores.vendor.score, color: '#7c3aed' },
                { label: 'Document Risk', score: multiModal.moduleScores.document.score, color: '#d97706' },
                { label: 'Progress Risk', score: multiModal.moduleScores.progress.score, color: '#dc2626' },
              ].map(sub => (
                <div key={sub.label} style={{ background: '#f8fafc', padding: '8px', borderRadius: 4, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{sub.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: sub.score >= 75 ? '#dc2626' : sub.score >= 50 ? '#ea580c' : '#166534', marginTop: 2 }}>
                    {sub.score}/100
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* Main Analysis Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: 16, marginTop: 16 }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Risk Overview */}
          <div style={{
            background: getRiskBgColor(project.risk_level),
            border: `2px solid ${getRiskColor(project.risk_level)}`,
            borderRadius: 6, padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 8 }}>
                  AI RISK SCORE (PROTOTYPE)
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 56, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                    {project.risk_score}
                  </span>
                  <span style={{ fontSize: 20, color: '#6b7280', fontWeight: 500 }}>/100</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <RiskBadge level={project.risk_level} size="lg" />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>AI Confidence</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor }}>
                  {project.anomaly_confidence ?? Math.round(project.risk_score * 0.97)}%
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ height: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${project.risk_score}%`, height: '100%',
                  background: scoreColor, borderRadius: 4,
                }} />
              </div>
            </div>
            <div style={{
              marginTop: 12, padding: '8px 12px',
              background: 'rgba(0,0,0,0.06)', borderRadius: 4,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <AlertTriangle size={14} color={getRiskColor(project.risk_level)} />
              <span style={{ fontSize: 12, fontWeight: 700, color: getRiskColor(project.risk_level) }}>
                POTENTIAL ANOMALY DETECTED — Requires Official Verification
              </span>
            </div>
          </div>

          {/* Why Flagged */}
          <SectionCard
            title="Why was this project flagged?"
            subtitle="AI Contributing Factors — Prototype Methodology"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {project.risk_factors.map((factor, i) => (
                <div key={i} style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{factor.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: factor.contribution > 60 ? '#dc2626' : factor.contribution > 30 ? '#d97706' : '#16a34a' }}>
                      {factor.contribution}%
                    </span>
                  </div>
                  <div style={{ height: 16, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                    <div className="feature-bar" style={{ width: `${Math.min(100, factor.contribution * 1.5)}%`, height: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280' }}>
                    <span>Detected: <strong style={{ color: '#dc2626' }}>{factor.value}</strong></span>
                    <span>Expected: {factor.expected}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Key Anomaly Indicators */}
          <SectionCard title="Key Anomaly Indicators">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {project.anomaly_type === 'Progress Mismatch' && (
                <div style={{ display: 'flex', gap: 10, padding: '10px 12px', background: '#fef2f2', borderRadius: 6, border: '1px solid #fecaca' }}>
                  <AlertTriangle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#991b1b' }}>Expenditure-Progress Mismatch</div>
                    <div style={{ fontSize: 11, color: '#b91c1c', marginTop: 2 }}>
                      {fundUtil.toFixed(0)}% of sanctioned funds utilized while physical progress is only {project.physical_progress}%.
                      Gap of {(fundUtil - project.physical_progress).toFixed(0)} percentage points — potential anomaly detected.
                    </div>
                  </div>
                </div>
              )}
              {project.anomaly_type === 'High Cost' && (
                <div style={{ display: 'flex', gap: 10, padding: '10px 12px', background: '#fef2f2', borderRadius: 6, border: '1px solid #fecaca' }}>
                  <DollarSign size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#991b1b' }}>Unusually High Project Cost</div>
                    <div style={{ fontSize: 11, color: '#b91c1c', marginTop: 2 }}>
                      Project cost of ₹{project.sanctioned_cost}L is {Math.abs(costDevPct).toFixed(1)}% {costDevPct > 0 ? 'above' : 'below'} the sector average of ₹{simAvg.toFixed(0)}L.
                      Significant cost deviation — unusual pattern identified.
                    </div>
                  </div>
                </div>
              )}
              {project.delay_days > 30 && (
                <div style={{ display: 'flex', gap: 10, padding: '10px 12px', background: '#fff7ed', borderRadius: 6, border: '1px solid #fed7aa' }}>
                  <Clock size={15} color="#ea580c" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9a3412' }}>Completion Delay</div>
                    <div style={{ fontSize: 11, color: '#c2410c', marginTop: 2 }}>
                      Project is {project.delay_days} days past the expected completion date ({formatDate(project.expected_completion_date)}).
                    </div>
                  </div>
                </div>
              )}
              {Math.abs(project.cost_deviation_pct) > 20 && (
                <div style={{ display: 'flex', gap: 10, padding: '10px 12px', background: '#fff7ed', borderRadius: 6, border: '1px solid #fed7aa' }}>
                  <TrendingUp size={15} color="#ea580c" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#9a3412' }}>Cost Deviation from Sector Average</div>
                    <div style={{ fontSize: 11, color: '#c2410c', marginTop: 2 }}>
                      Sanctioned cost deviates {project.cost_deviation_pct > 0 ? '+' : ''}{project.cost_deviation_pct.toFixed(1)}% from similar projects in the same sector.
                    </div>
                  </div>
                </div>
              )}
              {project.payment_count > 8 && (
                <div style={{ display: 'flex', gap: 10, padding: '10px 12px', background: '#fefce8', borderRadius: 6, border: '1px solid #fde68a' }}>
                  <BarChart3 size={15} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>Unusual Payment Frequency</div>
                    <div style={{ fontSize: 11, color: '#a16207', marginTop: 2 }}>
                      {project.payment_count} payments recorded. Expected 4-6 standard payments for this project type.
                    </div>
                  </div>
                </div>
              )}
              {!project.anomaly_type && project.risk_score < 40 && (
                <div style={{ padding: '12px 16px', background: '#f0fdf4', borderRadius: 6, border: '1px solid #bbf7d0', color: '#166534', fontSize: 12 }}>
                  No major anomalies detected. Project appears within normal parameters for the sector and district.
                  Continue routine monitoring.
                </div>
              )}
            </div>
          </SectionCard>

          {/* Similar Projects Comparison */}
          <SectionCard
            title="Similar Projects Comparison"
            subtitle={`Comparison with ${similarProjects.length} projects in same sector`}
          >
            <div style={{ overflowX: 'auto' }}>
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Project ID</th>
                    <th>Work Name</th>
                    <th>Sanctioned Cost</th>
                    <th>Progress</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#fff7ed' }}>
                    <td><strong style={{ color: '#003580' }}>{project.project_id}</strong><br /><span style={{ fontSize: 10, color: '#ea580c' }}>▶ CURRENT PROJECT</span></td>
                    <td style={{ maxWidth: 200 }}><strong>{project.work_name.slice(0, 40)}</strong></td>
                    <td><strong style={{ color: '#ea580c' }}>₹{project.sanctioned_cost}L</strong></td>
                    <td>{project.physical_progress}%</td>
                    <td><RiskBadge level={project.risk_level} score={project.risk_score} size="sm" /></td>
                  </tr>
                  {similarProjects.map(sp => (
                    <tr key={sp.project_id}>
                      <td style={{ fontSize: 11 }}>{sp.project_id}</td>
                      <td style={{ fontSize: 11, maxWidth: 200 }}>{sp.work_name.slice(0, 40)}</td>
                      <td style={{ fontSize: 11 }}>₹{sp.sanctioned_cost}L</td>
                      <td style={{ fontSize: 11 }}>{sp.physical_progress}%</td>
                      <td><RiskBadge level={sp.risk_level} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {simAvg > 0 && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: 24, fontSize: 12 }}>
                  <div><span style={{ color: '#6b7280' }}>Sector Average Cost:</span> <strong>₹{simAvg.toFixed(0)}L</strong></div>
                  <div><span style={{ color: '#6b7280' }}>Current Project:</span> <strong>₹{project.sanctioned_cost}L</strong></div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Deviation:</span>{' '}
                    <strong style={{ color: Math.abs(costDevPct) > 50 ? '#dc2626' : '#d97706' }}>
                      {costDevPct > 0 ? '+' : ''}{costDevPct.toFixed(1)}%
                    </strong>
                  </div>
                </div>
                {Math.abs(costDevPct) > 50 && (
                  <div style={{ marginTop: 6, fontSize: 11, color: '#dc2626', fontWeight: 600 }}>
                    ⚠ Significant cost deviation detected. Requires verification.
                  </div>
                )}
              </div>
            )}
          </SectionCard>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Project Summary */}
          <SectionCard title="Project Details">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              {[
                ['Project ID', project.project_id],
                ['Work Name', project.work_name],
                ['State', project.state],
                ['District', project.district],
                ['Constituency', project.constituency],
                ['MP Name', project.mp_name],
                ['House', project.house],
                ['Sector', project.sector],
                ['Implementing Agency', project.implementing_agency],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', gap: 8, borderBottom: '1px solid #f3f4f6', paddingBottom: 6 }}>
                  <span style={{ color: '#6b7280', minWidth: 130, flexShrink: 0 }}>{label}</span>
                  <span style={{ color: '#111827', fontWeight: 500 }}>{val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #f3f4f6', paddingBottom: 6 }}>
                <span style={{ color: '#6b7280', minWidth: 130, flexShrink: 0 }}>Sanctioned Cost</span>
                <span style={{ fontWeight: 700, color: '#003580' }}>₹{project.sanctioned_cost}L</span>
              </div>
              <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #f3f4f6', paddingBottom: 6 }}>
                <span style={{ color: '#6b7280', minWidth: 130, flexShrink: 0 }}>Expenditure</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>₹{project.expenditure}L</span>
              </div>
              <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #f3f4f6', paddingBottom: 6 }}>
                <span style={{ color: '#6b7280', minWidth: 130, flexShrink: 0 }}>Unspent Balance</span>
                <span style={{ fontWeight: 700, color: '#ea580c' }}>₹{project.unspent_balance}L</span>
              </div>
              <div style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#6b7280', fontSize: 12 }}>Physical Progress</span>
                  <span style={{ fontWeight: 700, color: project.physical_progress < 50 ? '#dc2626' : '#16a34a' }}>
                    {project.physical_progress}%
                  </span>
                </div>
                <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${project.physical_progress}%`, height: '100%',
                    background: project.physical_progress < 50 ? '#dc2626' : '#16a34a', borderRadius: 4,
                  }} />
                </div>
              </div>
              {[
                ['Start Date', formatDate(project.start_date)],
                ['Expected Completion', formatDate(project.expected_completion_date)],
                ['Work Status', project.work_status],
                ['Payment Count', String(project.payment_count)],
                ['Contractor ID', project.contractor_id],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', gap: 8, borderBottom: '1px solid #f3f4f6', paddingBottom: 6 }}>
                  <span style={{ color: '#6b7280', minWidth: 130, flexShrink: 0 }}>{label}</span>
                  <span style={{ color: '#111827' }}>{label === 'Work Status' ? <StatusBadge status={val} /> : val}</span>
                </div>
              ))}
              {project.delay_days > 0 && (
                <div style={{ padding: '6px 10px', background: '#fef2f2', borderRadius: 4, border: '1px solid #fecaca', fontSize: 11, color: '#991b1b', fontWeight: 600 }}>
                  ⚠ Overdue by {project.delay_days} days
                </div>
              )}
            </div>
          </SectionCard>

          {/* Financial Timeline */}
          <SectionCard title="Financial Timeline">
            <div style={{ position: 'relative', paddingLeft: 24 }}>
              {[
                { label: 'Work Recommended', date: project.start_date, amount: `₹${project.recommended_cost}L`, color: '#003580', flag: false },
                { label: 'Work Sanctioned', date: project.start_date, amount: `₹${project.sanctioned_cost}L`, color: '#003580', flag: false },
                { label: 'Fund Released', date: project.start_date, amount: `₹${project.fund_released}L`, color: '#16a34a', flag: false },
                ...Array.from({ length: project.payment_count }, (_, i) => ({
                  label: `Payment ${i + 1}`,
                  date: project.start_date,
                  amount: `₹${(project.expenditure / project.payment_count).toFixed(1)}L`,
                  color: i >= 6 ? '#ea580c' : '#6b7280',
                  flag: i >= 6,
                })),
                { label: 'Current Status', date: '', amount: project.work_status, color: project.work_status === 'Completed' ? '#16a34a' : '#d97706', flag: false },
              ].slice(0, 8).map((step, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: -24,
                    width: 14, height: 14, borderRadius: '50%',
                    background: step.flag ? '#ea580c' : step.color,
                    border: '2px solid white', boxShadow: '0 0 0 2px ' + step.color,
                    zIndex: 1,
                  }} />
                  {i < arr.length - 1 && (
                    <div style={{
                      position: 'absolute', left: -17, top: 14,
                      width: 2, height: 28, background: '#e5e7eb',
                    }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: step.flag ? '#ea580c' : '#111827' }}>{step.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: step.color }}>{step.amount}</span>
                    </div>
                    {step.flag && (
                      <div style={{ fontSize: 10, color: '#ea580c', marginTop: 2 }}>⚠ Unusual payment pattern</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* AI Investigation Summary */}
          <div style={{
            background: '#fffbeb', border: '1px solid #fde68a',
            borderLeft: '4px solid #FF6B00', borderRadius: 6, padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Brain size={16} color="#FF6B00" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>AI Investigation Summary</span>
            </div>
            <p style={{ fontSize: 11.5, color: '#78350f', margin: '0 0 10px', lineHeight: 1.6 }}>
              This project has been identified as requiring verification based on potential anomalies detected by the AI system.
              {project.anomaly_type && ` Primary concern: ${project.anomaly_type}.`}
              {' '}This does <strong>not</strong> constitute confirmed fraud or misconduct.
              Official investigation is required to determine the actual cause of these patterns.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <ActionButton label="Mark for Investigation" variant="primary" />
              <ActionButton label="False Positive" variant="secondary" />
              <ActionButton label="Export Report" variant="ghost" />
            </div>
          </div>
        </div>
      </div>

      {/* All High/Critical Projects Table */}
      <div style={{ marginTop: 20 }}>
        <SectionCard
          title={`All High & Critical Risk Projects (${highRiskProjects.length})`}
          subtitle="Click a row to analyze that project above"
        >
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Work Name</th>
                  <th>State</th>
                  <th>MP</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                  <th>Anomaly Type</th>
                  <th>AI Confidence</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(p => (
                  <tr
                    key={p.project_id}
                    style={{ cursor: 'pointer', background: p.project_id === selectedId ? '#eff6ff' : undefined }}
                    onClick={() => setSelectedId(p.project_id)}
                  >
                    <td style={{ fontSize: 11, fontWeight: 600, color: '#003580' }}>{p.project_id}</td>
                    <td style={{ fontSize: 11, maxWidth: 200 }}>{p.work_name.slice(0, 38)}...</td>
                    <td style={{ fontSize: 11 }}>{p.state}</td>
                    <td style={{ fontSize: 11 }}>{p.mp_name.split(' ').slice(0, 2).join(' ')}</td>
                    <td>
                      <RiskScoreBar score={p.risk_score} />
                    </td>
                    <td><RiskBadge level={p.risk_level} size="sm" /></td>
                    <td style={{ fontSize: 11, color: '#6b7280' }}>{p.anomaly_type || '—'}</td>
                    <td style={{ fontSize: 11 }}>
                      {p.anomaly_confidence ? <span style={{ fontWeight: 700, color: p.anomaly_confidence > 90 ? '#dc2626' : '#d97706' }}>{p.anomaly_confidence}%</span> : '—'}
                    </td>
                    <td>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedId(p.project_id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        style={{ background: '#003580', color: 'white', border: 'none', padding: '3px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                      >
                        Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={highRiskProjects.length} perPage={perPage} onPage={setPage} />
        </SectionCard>
      </div>
    </div>
  );
}
