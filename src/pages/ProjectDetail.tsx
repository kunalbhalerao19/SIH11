import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PROJECTS } from '../data/demoData';
import { SectionCard, StatusBadge, ActionButton } from '../components/ui';
import { RiskBadge } from '../components/RiskBadge';
import { getRiskColor, getRiskBgColor, getScoreColor } from '../lib/riskEngine';
import { formatDate } from '../lib/utils';
import { EvidenceUploadModal, type EvidenceAnalysisResult } from '../components/EvidenceUploadModal';
import {
  ArrowLeft, AlertTriangle, Clock, DollarSign, Brain,
  FileText, Camera, MapPin, User, Building, CheckCircle, Upload, Sparkles, CheckCircle2
} from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = PROJECTS.find(p => p.project_id === id);

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [uploadedEvidence, setUploadedEvidence] = useState<EvidenceAnalysisResult | null>(null);

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <AlertTriangle size={40} color="#dc2626" style={{ marginBottom: 12 }} />
        <h2 style={{ color: '#111827' }}>Project Not Found</h2>
        <p style={{ color: '#6b7280' }}>No project found with ID: {id}</p>
        <ActionButton label="← Back to Projects" onClick={() => navigate('/projects')} variant="primary" />
      </div>
    );
  }

  const fundUtil = project.fund_released > 0 ? (project.expenditure / project.fund_released) * 100 : 0;
  const similarProjects = PROJECTS
    .filter(p => p.sector === project.sector && p.project_id !== project.project_id)
    .slice(0, 4);
  const simAvg = similarProjects.length
    ? similarProjects.reduce((s, p) => s + p.sanctioned_cost, 0) / similarProjects.length : 0;
  const costDevPct = simAvg > 0 ? ((project.sanctioned_cost - simAvg) / simAvg * 100) : 0;

  return (
    <div>
      {/* Back + Header */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => navigate('/projects')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#003580', fontSize: 13, fontWeight: 500, padding: 0, marginBottom: 12,
          }}
        >
          <ArrowLeft size={15} /> Back to Projects
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, marginBottom: 4 }}>
              {project.project_id} • {project.financial_year}
            </div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
              {project.work_name}
            </h1>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <StatusBadge status={project.work_status} />
              <RiskBadge level={project.risk_level} score={project.risk_score} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <ActionButton label="Export Report" variant="secondary" />
            <ActionButton label="Mark for Investigation" variant="primary" />
          </div>
        </div>
      </div>

      {/* Project meta chips */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20, padding: '10px 14px', background: 'white', borderRadius: 6, border: '1px solid #e5e7eb' }}>
        {[
          { icon: <MapPin size={13} />, label: `${project.state}, ${project.district}` },
          { icon: <User size={13} />, label: project.mp_name },
          { icon: <Building size={13} />, label: project.implementing_agency },
          { icon: <FileText size={13} />, label: project.sector },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#374151' }}>
            <span style={{ color: '#9ca3af' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* Main 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: 16 }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Financial Summary */}
          <SectionCard title="Financial Summary">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 12 }}>
              {[
                { label: 'Recommended', value: `₹${project.recommended_cost}L`, color: '#6b7280' },
                { label: 'Sanctioned', value: `₹${project.sanctioned_cost}L`, color: '#003580' },
                { label: 'Fund Released', value: `₹${project.fund_released}L`, color: '#1e40af' },
                { label: 'Expenditure', value: `₹${project.expenditure}L`, color: '#16a34a' },
                { label: 'Unspent', value: `₹${project.unspent_balance}L`, color: '#ea580c' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: '10px 8px', background: '#f9fafb', borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11, color: '#6b7280' }}>
                <span>Fund Utilization</span>
                <span style={{ fontWeight: 700, color: fundUtil > 90 ? '#dc2626' : '#16a34a' }}>{fundUtil.toFixed(1)}%</span>
              </div>
              <div style={{ height: 10, background: '#e5e7eb', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, fundUtil)}%`, height: '100%',
                  background: fundUtil > 90 ? '#dc2626' : '#16a34a', borderRadius: 5,
                }} />
              </div>
            </div>
          </SectionCard>

          {/* Physical Progress */}
          <SectionCard title="Physical Progress">
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Completion Progress</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: project.physical_progress < 50 ? '#dc2626' : '#16a34a' }}>
                  {project.physical_progress}%
                </span>
              </div>
              <div style={{ height: 14, background: '#e5e7eb', borderRadius: 7, overflow: 'hidden' }}>
                <div style={{
                  width: `${project.physical_progress}%`, height: '100%',
                  background: project.physical_progress < 50 ? '#dc2626' : project.physical_progress < 80 ? '#d97706' : '#16a34a',
                  borderRadius: 7,
                }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, fontSize: 12 }}>
              <div style={{ padding: 10, background: '#f9fafb', borderRadius: 6 }}>
                <div style={{ color: '#9ca3af', fontSize: 10 }}>Start Date</div>
                <div style={{ fontWeight: 600 }}>{formatDate(project.start_date)}</div>
              </div>
              <div style={{ padding: 10, background: '#f9fafb', borderRadius: 6 }}>
                <div style={{ color: '#9ca3af', fontSize: 10 }}>Expected Completion</div>
                <div style={{ fontWeight: 600 }}>{formatDate(project.expected_completion_date)}</div>
              </div>
              <div style={{ padding: 10, background: project.delay_days > 0 ? '#fef2f2' : '#f0fdf4', borderRadius: 6 }}>
                <div style={{ color: '#9ca3af', fontSize: 10 }}>Delay Status</div>
                <div style={{ fontWeight: 700, color: project.delay_days > 0 ? '#dc2626' : '#16a34a' }}>
                  {project.delay_days > 0 ? `${project.delay_days} days overdue` : 'On schedule / Completed'}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* AI Risk Card */}
          <div style={{
            background: getRiskBgColor(project.risk_level),
            border: `2px solid ${getRiskColor(project.risk_level)}`,
            borderRadius: 6, padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Brain size={18} color={getRiskColor(project.risk_level)} />
              <span style={{ fontSize: 14, fontWeight: 700, color: getRiskColor(project.risk_level) }}>
                AI Risk Assessment (Prototype)
              </span>
            </div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>RISK SCORE</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: getScoreColor(project.risk_score), lineHeight: 1 }}>
                  {project.risk_score}<span style={{ fontSize: 16, color: '#9ca3af' }}>/100</span>
                </div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: 20 }}>
                <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>RISK LEVEL</div>
                <RiskBadge level={project.risk_level} size="lg" />
              </div>
            </div>
            {project.risk_factors.slice(0, 3).map((factor, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>{factor.name}</span>
                  <span style={{ color: '#6b7280' }}>{factor.value}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(0,0,0,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${factor.contribution}%`, height: '100%', background: getRiskColor(project.risk_level), borderRadius: 3 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 10, fontSize: 11, color: getRiskColor(project.risk_level), fontWeight: 600 }}>
              ⚠ POTENTIAL ANOMALY DETECTED — Requires Official Verification
            </div>
          </div>

          {/* Similar Projects */}
          <SectionCard title="Similar Projects Comparison">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>State</th>
                  <th>Cost (L)</th>
                  <th>Progress</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#fff7ed' }}>
                  <td style={{ fontWeight: 700, color: '#003580', fontSize: 11 }}>{project.project_id} ← THIS</td>
                  <td style={{ fontSize: 11 }}>{project.state}</td>
                  <td style={{ fontSize: 12, fontWeight: 700, color: Math.abs(costDevPct) > 40 ? '#dc2626' : '#111827' }}>
                    ₹{project.sanctioned_cost}
                  </td>
                  <td style={{ fontSize: 11 }}>{project.physical_progress}%</td>
                  <td><RiskBadge level={project.risk_level} size="sm" /></td>
                </tr>
                {similarProjects.map(sp => (
                  <tr key={sp.project_id}>
                    <td style={{ fontSize: 11 }}>{sp.project_id}</td>
                    <td style={{ fontSize: 11 }}>{sp.state}</td>
                    <td style={{ fontSize: 11 }}>₹{sp.sanctioned_cost}</td>
                    <td style={{ fontSize: 11 }}>{sp.physical_progress}%</td>
                    <td><RiskBadge level={sp.risk_level} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {simAvg > 0 && (
              <div style={{ marginTop: 10, fontSize: 12, padding: '8px 12px', background: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb' }}>
                Sector Average: <strong>₹{simAvg.toFixed(0)}L</strong> |
                Current: <strong>₹{project.sanctioned_cost}L</strong> |
                Deviation: <strong style={{ color: Math.abs(costDevPct) > 40 ? '#dc2626' : '#374151' }}>
                  {costDevPct > 0 ? '+' : ''}{costDevPct.toFixed(1)}%
                </strong>
              </div>
            )}
          </SectionCard>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Financial Timeline */}
          <SectionCard title="Financial Timeline">
            <div style={{ position: 'relative', paddingLeft: 24 }}>
              {[
                { label: 'Work Recommended', sub: `₹${project.recommended_cost}L`, date: project.start_date, color: '#003580', suspicious: false },
                { label: 'Work Sanctioned', sub: `₹${project.sanctioned_cost}L`, date: project.start_date, color: '#1e40af', suspicious: false },
                { label: 'Fund Released', sub: `₹${project.fund_released}L`, date: project.start_date, color: '#16a34a', suspicious: false },
                ...Array.from({ length: Math.min(project.payment_count, 5) }, (_, i) => ({
                  label: `Payment ${i + 1}`,
                  sub: `₹${(project.expenditure / project.payment_count).toFixed(1)}L`,
                  date: '',
                  color: i >= 4 ? '#ea580c' : '#6b7280',
                  suspicious: i >= 4,
                })),
                { label: 'Current Status', sub: project.work_status, date: '', color: project.work_status === 'Completed' ? '#16a34a' : '#d97706', suspicious: false },
              ].map((step, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: -24, width: 14, height: 14, borderRadius: '50%', background: step.suspicious ? '#ea580c' : step.color, border: '2px solid white', boxShadow: `0 0 0 2px ${step.color}`, zIndex: 1 }} />
                  {i < arr.length - 1 && <div style={{ position: 'absolute', left: -17, top: 14, width: 2, height: 20, background: '#e5e7eb' }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: step.suspicious ? '#ea580c' : '#111827' }}>{step.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: step.color }}>{step.sub}</span>
                    </div>
                    {step.suspicious && <div style={{ fontSize: 10, color: '#ea580c' }}>⚠ Unusual</div>}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* AI Investigation Summary */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '4px solid #FF6B00', borderRadius: 6, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Brain size={15} color="#FF6B00" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>AI Investigation Summary</span>
            </div>
            <p style={{ fontSize: 11, color: '#78350f', margin: '0 0 10px', lineHeight: 1.6 }}>
              This project has been flagged based on{' '}
              {project.anomaly_type ? <strong>{project.anomaly_type}</strong> : 'multiple anomaly indicators'}.
              The AI system detected unusual patterns that require official verification.
              This does <strong>not</strong> confirm fraud or misconduct.
            </p>
            <div style={{ fontSize: 10, color: '#92400e', marginBottom: 10, padding: '6px 8px', background: 'rgba(0,0,0,0.05)', borderRadius: 4 }}>
              Status: <strong>{project.anomaly_type ? 'Flagged for Review' : 'Normal Monitoring'}</strong> |
              AI Confidence: <strong>{project.anomaly_confidence ?? '—'}%</strong>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <ActionButton label="Mark for Investigation" variant="primary" />
              <ActionButton label="False Positive" variant="secondary" />
            </div>
          </div>

          {/* Project Documents */}
          <SectionCard title="Project Documents">
            {[
              'Detailed Project Report (DPR)',
              'Sanction Order',
              'Utilization Certificate',
              'Progress Report',
              'Inspection Report',
            ].map(doc => (
              <div key={doc} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#374151' }}>
                  <FileText size={13} color="#9ca3af" />
                  {doc}
                </div>
                <span style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic' }}>Not Uploaded</span>
              </div>
            ))}
          </SectionCard>

          {/* Project Evidence Photos */}
          <SectionCard
            title="Site Evidence Photographs"
            subtitle="AI EXIF Geotag & Perceptual Hash Verification"
            actions={
              <button
                onClick={() => setIsEvidenceModalOpen(true)}
                className="px-3 py-1.5 bg-[#003580] hover:bg-[#002860] text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Upload size={12} />
                <span>Upload Evidence Photo</span>
              </button>
            }
          >
            {uploadedEvidence ? (
              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-xs">
                  <img
                    src={uploadedEvidence.imagePreviewUrl}
                    alt="Verified Evidence"
                    className="w-20 h-20 object-cover rounded border border-gray-300 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="font-bold text-gray-900 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>{uploadedEvidence.fileName}</span>
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Geotag Distance: <strong className={uploadedEvidence.isGpsMismatch ? 'text-red-600' : 'text-emerald-700'}>{uploadedEvidence.distanceMeters}m</strong>
                    </div>
                    <div className="text-[11px] text-gray-600">
                      pHash Match: <strong>{uploadedEvidence.duplicateMatch.similarityPct}%</strong>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Sensor: {uploadedEvidence.exifData.cameraModel} • {uploadedEvidence.exifData.dateTime}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] px-2 py-1 bg-gray-100 rounded text-gray-700">
                  <span>Photo Risk Score: <strong>{uploadedEvidence.computedPhotoRiskScore}/100</strong></span>
                  <span className="font-bold text-[#003580]">Composite: {uploadedEvidence.computedCompositeRiskScore}/100</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2].map(i => (
                  <div
                    key={i}
                    onClick={() => setIsEvidenceModalOpen(true)}
                    className="h-20 bg-gray-50 hover:bg-blue-50/50 rounded-lg border border-dashed border-gray-300 hover:border-[#003580] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-gray-400 hover:text-[#003580]"
                  >
                    <Camera size={16} />
                    <span className="text-[10px] font-medium">+ Click to Upload Evidence</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Evidence Upload Modal */}
      {project && (
        <EvidenceUploadModal
          project={project}
          isOpen={isEvidenceModalOpen}
          onClose={() => setIsEvidenceModalOpen(false)}
          onEvidenceProcessed={result => setUploadedEvidence(result)}
        />
      )}
    </div>
  );
}
