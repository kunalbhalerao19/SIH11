import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AI_MODULE_DEFINITIONS,
  CROSS_SCHEME_DUPLICATIONS,
  PHOTO_EVIDENCE_ITEMS,
  VENDOR_ANALYTICS,
  DOCUMENT_VERIFICATIONS,
  INSPECTION_PRIORITY_QUEUE,
  calculateMultiModalEvidence,
} from '../lib/aiModulesEngine';
import { PROJECTS, STATES } from '../data/demoData';
import { PageHeader, SectionCard, KpiCard, ActionButton, StatusBadge } from '../components/ui';
import { RiskBadge, RiskScoreBar } from '../components/RiskBadge';
import { getRiskColor, getRiskBgColor, getScoreColor } from '../lib/riskEngine';
import type { AIModuleId, RiskLevel, Project } from '../types';
import {
  Brain, Camera, MapPin, Users, FileText, Clock,
  ShieldCheck, AlertTriangle, ChevronRight, RefreshCw,
  Eye, CheckCircle2, ArrowRight, Layers, Sliders,
  QrCode, Search, Download, Sparkles, Filter, ExternalLink
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export default function AIAnalyticsModules() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<AIModuleId>('financial');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS[0]?.project_id || 'MPL-2026-00451');
  const [customWeights, setCustomWeights] = useState<Record<AIModuleId, number>>({
    financial: 25,
    photo: 20,
    geospatial: 15,
    vendor: 15,
    document: 10,
    progress: 15,
  });
  const [showQrModal, setShowQrModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(INSPECTION_PRIORITY_QUEUE[0]);
  const [citizenFeedbackSubmitted, setCitizenFeedbackSubmitted] = useState(false);

  // Current selected project
  const selectedProject = useMemo(() => {
    return PROJECTS.find(p => p.project_id === selectedProjectId) || PROJECTS[0];
  }, [selectedProjectId]);

  // Compute multi-modal fusion evidence for the project
  const evidence = useMemo(() => {
    return calculateMultiModalEvidence(selectedProject, customWeights);
  }, [selectedProject, customWeights]);

  // Weight adjust helper
  const handleWeightChange = (mod: AIModuleId, val: number) => {
    setCustomWeights(prev => ({ ...prev, [mod]: val }));
  };

  // Reset weights
  const resetWeights = () => {
    setCustomWeights({
      financial: 25,
      photo: 20,
      geospatial: 15,
      vendor: 15,
      document: 10,
      progress: 15,
    });
  };

  // Radar chart data comparing the 6 module scores
  const radarData = [
    { module: 'Financial', score: evidence.moduleScores.financial.score, fullMark: 100 },
    { module: 'Photo (CV)', score: evidence.moduleScores.photo.score, fullMark: 100 },
    { module: 'Geospatial', score: evidence.moduleScores.geospatial.score, fullMark: 100 },
    { module: 'Vendor/HHI', score: evidence.moduleScores.vendor.score, fullMark: 100 },
    { module: 'Document', score: evidence.moduleScores.document.score, fullMark: 100 },
    { module: 'Timeline', score: evidence.moduleScores.progress.score, fullMark: 100 },
  ];

  return (
    <div>
      <PageHeader
        title="AI & Analytics Modules — Multi-Modal Sentinel"
        subtitle="End-to-end evidence fusion across 6 specialized machine learning engines (SIH 2026 Problem Statement 26102)"
      />

      {/* ─── Workflow Architecture Summary Bar ────────────────────────────── */}
      <div style={{ background: '#003580', borderRadius: 8, padding: '16px 20px', color: 'white', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Brain size={24} color="#FF6B00" />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>MPLADS AI SENTINEL ARCHITECTURE</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>
                Multi-source data ingestion → 6 Specialized AI Sub-Modules → Multi-Modal Evidence Fusion → Officer Triage & Citizen Verification
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowInspectionModal(true)}
              style={{
                background: '#FF6B00', color: 'white', border: 'none',
                padding: '7px 14px', borderRadius: 5, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <AlertTriangle size={14} /> View Priority Queue ({INSPECTION_PRIORITY_QUEUE.length})
            </button>
            <button
              onClick={() => setShowQrModal(true)}
              style={{
                background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)',
                padding: '7px 14px', borderRadius: 5, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <QrCode size={14} /> Citizen QR Sim
            </button>
          </div>
        </div>

        {/* 11-Stage Workflow Mini Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { step: '1. Ingestion', active: true },
            { step: '2. Clean & Storage', active: true },
            { step: '3. 6 AI Modules', active: true, highlight: true },
            { step: '4. Evidence Fusion', active: true, highlight: true },
            { step: '5. Risk Gauge', active: true },
            { step: '6. Triage Alerts', active: true },
            { step: '7. Officer Action', active: true },
            { step: '8. Citizen QR', active: true },
            { step: '9. Cross-Scheme', active: true },
            { step: '10. Retraining Loop', active: true },
          ].map((s, idx) => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: s.highlight ? 800 : 500,
                  padding: '3px 8px',
                  borderRadius: 4,
                  background: s.highlight ? '#FF6B00' : 'rgba(255,255,255,0.12)',
                  color: 'white',
                  border: s.highlight ? '1px solid #ff9e44' : 'none',
                }}
              >
                {s.step}
              </span>
              {idx < 9 && <ChevronRight size={10} color="rgba(255,255,255,0.5)" />}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Top Level Key Performance Cards ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <KpiCard
          title="AI Sub-Modules Active"
          value="6 ML Engines"
          subtitle="Financial, Vision, Geo, Vendor, Doc, Timeline"
          color="#003580"
          icon={<Layers size={18} color="#003580" />}
        />
        <KpiCard
          title="Cross-Scheme Flags"
          value={`${CROSS_SCHEME_DUPLICATIONS.length} Overlaps`}
          subtitle="PMGSY, JJM, Smart Cities duplicate funding"
          color="#dc2626"
          icon={<AlertTriangle size={18} color="#dc2626" />}
        />
        <KpiCard
          title="Photo Vision Audits"
          value="98.4% Accuracy"
          subtitle="pHash duplicate & GPS EXIF validation"
          color="#0891b2"
          icon={<Camera size={18} color="#0891b2" />}
        />
        <KpiCard
          title="Inspection Queue"
          value={`${INSPECTION_PRIORITY_QUEUE.length} High Priority`}
          subtitle="Ranked physical audit recommendations"
          color="#d97706"
          icon={<CheckCircle2 size={18} color="#d97706" />}
        />
      </div>

      {/* ─── Section 1: The 6 AI / Analytics Modules Interactive Tabs ─────── */}
      <div style={{ marginBottom: 24 }}>
        <SectionCard
          title="3. Dedicated AI / Analytics Sub-Modules"
          subtitle="Explore the individual feature extractors and anomaly scoring pipelines for each specialized domain"
        >
          {/* Module Selector Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 16 }}>
            {(Object.keys(AI_MODULE_DEFINITIONS) as AIModuleId[]).map(modId => {
              const def = AI_MODULE_DEFINITIONS[modId];
              const isSelected = activeModule === modId;
              const subScore = evidence.moduleScores[modId];
              return (
                <button
                  key={modId}
                  onClick={() => setActiveModule(modId)}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 6,
                    border: isSelected ? `2px solid ${def.color}` : '1px solid #e5e7eb',
                    background: isSelected ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? '0 2px 6px rgba(0,53,128,0.12)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: def.color }}>{def.title.split(' ')[0]}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: 3,
                        background: subScore.score >= 75 ? '#fee2e2' : subScore.score >= 50 ? '#fff7ed' : '#dcfce7',
                        color: subScore.score >= 75 ? '#dc2626' : subScore.score >= 50 ? '#ea580c' : '#166534',
                      }}
                    >
                      {subScore.score}/100
                    </span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>{def.title}</div>
                  <div style={{ fontSize: 10, color: '#6b7280', marginTop: 4 }}>Weight: {customWeights[modId]}%</div>
                </button>
              );
            })}
          </div>

          {/* Detailed Active Sub-Module View */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: AI_MODULE_DEFINITIONS[activeModule].color }}>
                    {AI_MODULE_DEFINITIONS[activeModule].title}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: evidence.moduleScores[activeModule].score >= 75 ? '#fee2e2' : '#f0fdf4',
                      color: evidence.moduleScores[activeModule].score >= 75 ? '#dc2626' : '#166534',
                    }}
                  >
                    Risk Score: {evidence.moduleScores[activeModule].score} / 100 ({evidence.moduleScores[activeModule].status})
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#475569' }}>
                  {AI_MODULE_DEFINITIONS[activeModule].description}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#64748b' }}>AI Confidence</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#003580' }}>
                  {evidence.moduleScores[activeModule].confidence}%
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Left Column: Sub-Features & Findings */}
              <div style={{ background: 'white', padding: '16px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} color={AI_MODULE_DEFINITIONS[activeModule].color} />
                  Engineered Features & Signals Monitored
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#334155', lineHeight: 1.8 }}>
                  {AI_MODULE_DEFINITIONS[activeModule].subFeatures.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>

                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
                    Live Diagnostic Findings for {selectedProject.project_id}:
                  </div>
                  {evidence.moduleScores[activeModule].keyFindings.map((finding, i) => (
                    <div key={i} style={{ fontSize: 11.5, color: '#475569', marginBottom: 4, display: 'flex', gap: 6 }}>
                      <span style={{ color: AI_MODULE_DEFINITIONS[activeModule].color, fontWeight: 700 }}>•</span>
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Dynamic Interactive Diagnostic Testbed for this Module */}
              <div style={{ background: 'white', padding: '16px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
                  Domain Telemetry & Metrics
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  {Object.entries(evidence.moduleScores[activeModule].metrics).map(([k, v]) => (
                    <div key={k} style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 5, border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>{k}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Specific Visualizer based on Active Module */}
                {activeModule === 'financial' && (
                  <div style={{ padding: '10px 12px', background: '#eff6ff', borderRadius: 5, border: '1px solid #bfdbfe', fontSize: 11, color: '#1e40af' }}>
                    <strong>Benford’s Law & Spending Velocity Check:</strong> High tranche frequency ({selectedProject.payment_count} payments) detected with cost deviation of {selectedProject.cost_deviation_pct}%.
                  </div>
                )}

                {activeModule === 'photo' && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Photo Verification Stage:</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ width: 80, height: 50, background: '#e2e8f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#64748b' }}>
                        Site Geotag
                      </div>
                      <div style={{ fontSize: 11, color: '#475569' }}>
                        <div>AI Computer Vision Estimate: <strong>{PHOTO_EVIDENCE_ITEMS[0]?.aiEstimatedProgress}%</strong></div>
                        <div>Claimed Progress in Portal: <strong>{selectedProject.physical_progress}%</strong></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeModule === 'geospatial' && (
                  <div style={{ padding: '10px 12px', background: '#f0fdf4', borderRadius: 5, border: '1px solid #bbf7d0', fontSize: 11, color: '#166534' }}>
                    <strong>GPS Coordinates:</strong> {selectedProject.constituency}, {selectedProject.state}. Proximity search shows 0 conflict within 200m buffer zone (except marked cross-scheme works).
                  </div>
                )}

                {activeModule === 'vendor' && (
                  <div style={{ padding: '10px 12px', background: '#faf5ff', borderRadius: 5, border: '1px solid #e9d5ff', fontSize: 11, color: '#6b21a8' }}>
                    <strong>Contractor ID:</strong> {selectedProject.contractor_id}. Concentration analysis tracks total won works across parliamentary constituency.
                  </div>
                )}

                {activeModule === 'document' && (
                  <div style={{ padding: '10px 12px', background: '#fffbeb', borderRadius: 5, border: '1px solid #fef3c7', fontSize: 11, color: '#92400e' }}>
                    <strong>OCR Sanction Verification:</strong> Sanction Order matches e-Sakshi portal reference code. Reconciling with contractor invoice schedules.
                  </div>
                )}

                {activeModule === 'progress' && (
                  <div style={{ padding: '10px 12px', background: '#fef2f2', borderRadius: 5, border: '1px solid #fecaca', fontSize: 11, color: '#991b1b' }}>
                    <strong>Progress-Expenditure Divergence:</strong> {selectedProject.progress_expenditure_gap}% gap between financial disbursement and physical milestone completion.
                  </div>
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ─── Section 2: 4 & 5. Evidence Fusion & Multi-Modal Composite Risk Engine */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Left: Interactive Weight Sliders and Project Selector */}
        <SectionCard
          title="4. Evidence Fusion Multi-Modal Engine"
          subtitle="Combines all 6 sub-risk scores into a unified AI Risk Score with customizable calibration weights"
          actions={
            <button
              onClick={resetWeights}
              style={{ background: 'none', border: '1px solid #d1d5db', padding: '4px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <RefreshCw size={11} /> Reset Weights
            </button>
          }
        >
          {/* Project Selector for Fusion */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>
              Select Project to Evaluate:
            </label>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 5,
                border: '1px solid #003580',
                background: '#f0f9ff',
                fontSize: 12,
                fontWeight: 600,
                color: '#003580',
              }}
            >
              {PROJECTS.map(p => (
                <option key={p.project_id} value={p.project_id}>
                  {p.project_id} — {p.work_name.slice(0, 45)} ({p.state}) [Score: {p.risk_score}]
                </option>
              ))}
            </select>
          </div>

          {/* 6 Weight Sliders */}
          <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
            Module Weights Calibration (Total: {Object.values(customWeights).reduce((a, b) => a + b, 0)}%):
          </div>
          {(Object.keys(AI_MODULE_DEFINITIONS) as AIModuleId[]).map(modId => {
            const def = AI_MODULE_DEFINITIONS[modId];
            const val = customWeights[modId];
            return (
              <div key={modId} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>{def.title}</span>
                  <span style={{ fontWeight: 700, color: def.color }}>{val}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={val}
                  onChange={e => handleWeightChange(modId, parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: def.color }}
                />
              </div>
            );
          })}
        </SectionCard>

        {/* Right: Multi-Modal Composite Risk Score & Radar Chart */}
        <SectionCard
          title="5. Risk Scoring & Explainable AI (XAI)"
          subtitle={`Multi-Modal Composite Assessment for ${selectedProject.project_id}`}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 14, padding: '12px', background: getRiskBgColor(evidence.riskLevel), borderRadius: 8, border: `1px solid ${getRiskColor(evidence.riskLevel)}40` }}>
            <div style={{ textAlign: 'center', minWidth: 90 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: getScoreColor(evidence.compositeScore), lineHeight: 1 }}>
                {evidence.compositeScore}
              </div>
              <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>OUT OF 100</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiskBadge level={evidence.riskLevel} size="md" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>
                  Confidence: {evidence.confidence}%
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: '#334155', marginTop: 4, lineHeight: 1.4 }}>
                <strong>Recommended Action:</strong> {evidence.recommendedAction}
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div style={{ height: 180, width: '100%', marginBottom: 10 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="module" tick={{ fontSize: 10, fill: '#475569' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Sub-Score" dataKey="score" stroke="#003580" fill="#003580" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Explainable AI Factor Waterfall */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
            Top Contributing Risk Factors (XAI Waterfall):
          </div>
          {evidence.explanationWaterfall.slice(0, 3).map((w, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#334155' }}>{w.factor}</span>
              <span style={{ fontWeight: 700, color: '#dc2626' }}>+{w.impact} pts</span>
            </div>
          ))}
        </SectionCard>
      </div>

      {/* ─── Section 3: 9. Cross-Scheme Duplication Detection ─────────────── */}
      <div style={{ marginBottom: 24 }}>
        <SectionCard
          title="9. Cross-Scheme Duplication Detection Engine"
          subtitle="Cross-references MPLADS works against PMGSY, Jal Jeevan Mission, AMRUT, and Smart Cities Mission to prevent double funding on identical GPS coordinates"
          actions={
            <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '3px 8px', borderRadius: 4 }}>
              {CROSS_SCHEME_DUPLICATIONS.length} Overlapping Works Flagged
            </span>
          }
          noPadding
        >
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>MPLADS Project</th>
                  <th>MPLADS Cost</th>
                  <th>Overlapping Scheme</th>
                  <th>Scheme Project Title</th>
                  <th>Scheme Cost</th>
                  <th>Proximity Distance</th>
                  <th>Title Match</th>
                  <th>Double-Funding Risk</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {CROSS_SCHEME_DUPLICATIONS.map(dup => (
                  <tr key={dup.mpladsProjectId}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#003580', fontSize: 12 }}>{dup.mpladsProjectId}</div>
                      <div style={{ fontSize: 11, color: '#475569' }}>{dup.mpladsWorkName}</div>
                    </td>
                    <td style={{ fontSize: 12, fontWeight: 600 }}>₹{dup.mpladsCost}L</td>
                    <td>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 4,
                          background: dup.overlappingScheme === 'PMGSY' ? '#eff6ff' : dup.overlappingScheme === 'Jal Jeevan Mission' ? '#ecfeff' : '#faf5ff',
                          color: dup.overlappingScheme === 'PMGSY' ? '#1e40af' : dup.overlappingScheme === 'Jal Jeevan Mission' ? '#0e7490' : '#7c3aed',
                        }}
                      >
                        {dup.overlappingScheme}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 11.5, fontWeight: 600 }}>{dup.schemeWorkName}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>ID: {dup.schemeProjectId}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>₹{dup.schemeCost}L</td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, color: dup.distanceMeters < 50 ? '#dc2626' : '#d97706' }}>
                        {dup.distanceMeters} meters
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#003580' }}>{dup.titleSimilarityPct}%</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 3, background: '#fee2e2', color: '#991b1b' }}>
                        {dup.potentialDuplicationRisk} (₹{dup.estimatedDoubleFundingLakhs}L)
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/projects/${dup.mpladsProjectId}`)}
                        style={{ background: 'none', border: '1px solid #003580', color: '#003580', padding: '3px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                      >
                        <Eye size={11} /> Investigate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* ─── Section 4: 6 & 11. Inspection Priority Queue & Triage ────────── */}
      <div style={{ marginBottom: 24 }}>
        <SectionCard
          title="6 & 11. Inspection Priority Queue & Automated Triage"
          subtitle="AI-ranked queue of projects recommended for urgent on-site physical verification and administrative action"
          noPadding
        >
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Project ID & Work Name</th>
                  <th>State & MP</th>
                  <th>Composite Score</th>
                  <th>Primary Flag</th>
                  <th>At-Risk Value</th>
                  <th>Inspection Status</th>
                  <th>Inspector</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {INSPECTION_PRIORITY_QUEUE.map(item => (
                  <tr key={item.projectId}>
                    <td style={{ fontWeight: 800, color: item.rank <= 3 ? '#dc2626' : '#003580', fontSize: 14 }}>
                      #{item.rank}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#003580', fontSize: 12 }}>{item.projectId}</div>
                      <div style={{ fontSize: 11, color: '#334155' }}>{item.workName}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 11, fontWeight: 600 }}>{item.state}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>{item.mpName}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: getScoreColor(item.compositeScore) }}>
                          {item.compositeScore}
                        </span>
                        <RiskBadge level={item.riskLevel} size="sm" />
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'capitalize', color: AI_MODULE_DEFINITIONS[item.primaryFlagModule].color }}>
                        {item.primaryFlagModule}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>
                      ₹{item.estimatedFinancialRiskLakhs}L
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 4,
                          background: item.status === 'Inspection Scheduled' ? '#fef3c7' : item.status === 'Report Submitted' ? '#dcfce7' : '#fee2e2',
                          color: item.status === 'Inspection Scheduled' ? '#92400e' : item.status === 'Report Submitted' ? '#166534' : '#991b1b',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: '#475569' }}>
                      {item.assignedInspector || <span style={{ color: '#9ca3af' }}>Unassigned</span>}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedInspection(item);
                          setShowInspectionModal(true);
                        }}
                        style={{
                          background: '#003580', color: 'white', border: 'none',
                          padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Generate Docket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* ─── Modal 1: Inspection Docket Modal ─────────────────────────────── */}
      {showInspectionModal && selectedInspection && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 8, maxWidth: 600, width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#003580' }}>Physical Inspection Docket</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Rank #{selectedInspection.rank} — Priority Verification Order</div>
              </div>
              <button onClick={() => setShowInspectionModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, fontSize: 12 }}>
              <div><span style={{ color: '#6b7280' }}>Project ID:</span> <strong>{selectedInspection.projectId}</strong></div>
              <div><span style={{ color: '#6b7280' }}>Composite Risk:</span> <strong>{selectedInspection.compositeScore}/100</strong></div>
              <div><span style={{ color: '#6b7280' }}>State:</span> <strong>{selectedInspection.state}</strong></div>
              <div><span style={{ color: '#6b7280' }}>Constituency:</span> <strong>{selectedInspection.constituency}</strong></div>
              <div><span style={{ color: '#6b7280' }}>At-Risk Fund:</span> <strong style={{ color: '#dc2626' }}>₹{selectedInspection.estimatedFinancialRiskLakhs} Lakhs</strong></div>
              <div><span style={{ color: '#6b7280' }}>Primary Flag:</span> <strong style={{ textTransform: 'capitalize' }}>{selectedInspection.primaryFlagModule} Anomaly</strong></div>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, marginBottom: 16 }}>
              <strong>Inspection Checklist for Field Officer:</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: 20, lineHeight: 1.6 }}>
                <li>Verify on-site GPS coordinates match geotag bounds</li>
                <li>Capture real-time timestamped site photos with compass orientation</li>
                <li>Cross-examine physical completion stage against the latest contractor invoice</li>
                <li>Ascertain if any other scheme signboards (e.g. PMGSY/JJM) exist on the asset</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setShowInspectionModal(false)}
                style={{ background: 'white', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Official Inspection Docket for ${selectedInspection.projectId} generated and dispatched to ${selectedInspection.assignedInspector || 'District Collector Office'}.`);
                  setShowInspectionModal(false);
                }}
                style={{ background: '#003580', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Download size={14} /> Download & Assign Docket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal 2: Citizen QR Verification Simulator (Step 8 & 10) ───── */}
      {showQrModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 8, maxWidth: 520, width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#003580' }}>8. Citizen QR-Based Verification Simulator</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Public Transparency & Retraining Feedback Loop</div>
              </div>
              <button onClick={() => setShowQrModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>

            {citizenFeedbackSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: '#166534' }}>Citizen Verification Received!</div>
                <p style={{ fontSize: 12, color: '#4b5563', margin: '8px 0 16px' }}>
                  The geotagged photo and progress feedback have been ingested into Step 10 (Continuous Learning Loop) to update the AI confidence score for <strong>{selectedProject.project_id}</strong>.
                </p>
                <button
                  onClick={() => { setCitizenFeedbackSubmitted(false); setShowQrModal(false); }}
                  style={{ background: '#003580', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, padding: '12px', background: '#f8fafc', borderRadius: 6 }}>
                  <div style={{ width: 80, height: 80, background: '#003580', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
                    <QrCode size={48} />
                  </div>
                  <div style={{ fontSize: 12, color: '#334155' }}>
                    <div style={{ fontWeight: 700, color: '#003580' }}>{selectedProject.work_name}</div>
                    <div style={{ color: '#64748b', marginTop: 2 }}>ID: {selectedProject.project_id}</div>
                    <div style={{ color: '#64748b' }}>Sanctioned: ₹{selectedProject.sanctioned_cost}L</div>
                  </div>
                </div>

                <form onSubmit={e => { e.preventDefault(); setCitizenFeedbackSubmitted(true); }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Simulate Citizen Observed Progress:</label>
                    <select style={{ width: '100%', padding: '7px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 12 }}>
                      <option>Work not yet started / Ground is empty (0%)</option>
                      <option>Foundation work only (10 - 25%)</option>
                      <option>Structure partially complete (40 - 60%)</option>
                      <option>Work fully complete & in public use (100%)</option>
                      <option>Work abandoned / stopped for months</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Citizen Remark / Geotagged Note:</label>
                    <textarea
                      placeholder="e.g. Foundation pit dug 6 months ago, no contractor seen since May..."
                      rows={3}
                      style={{ width: '100%', padding: '7px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setShowQrModal(false)}
                      style={{ background: 'white', border: '1px solid #d1d5db', padding: '8px 14px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Submit & Trigger AI Update
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
