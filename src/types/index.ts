// Core data types for MPLADS AI Insight

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type WorkStatus = 'Recommended' | 'Sanctioned' | 'Ongoing' | 'Completed' | 'Non-Progress' | 'Dropped';
export type House = 'Lok Sabha' | 'Rajya Sabha';
export type AnomalyType =
  | 'High Cost'
  | 'Unusual Payment'
  | 'Budget Utilization Mismatch'
  | 'Progress Mismatch'
  | 'Delayed Completion'
  | 'Repeated Payment'
  | 'Contractor Pattern'
  | 'Geographical Cost Outlier'
  | 'Sector Cost Outlier'
  | 'Unusual Expenditure Trend';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'Open' | 'Under Review' | 'Resolved' | 'False Positive';
export type InvestigationStatus = 'Open' | 'Under Review' | 'Verified' | 'False Positive' | 'Resolved';

export type Sector =
  | 'Education'
  | 'Health'
  | 'Roads & Transport'
  | 'Water Supply'
  | 'Sanitation'
  | 'Community Infrastructure'
  | 'Agriculture'
  | 'Sports'
  | 'Culture'
  | 'Other';

export interface Project {
  project_id: string;
  mp_name: string;
  mp_id: string;
  house: House;
  state: string;
  constituency: string;
  district: string;
  sector: Sector;
  work_name: string;
  recommended_cost: number; // in lakhs
  sanctioned_cost: number;  // in lakhs
  fund_released: number;
  expenditure: number;
  unspent_balance: number;
  work_status: WorkStatus;
  start_date: string;
  expected_completion_date: string;
  actual_completion_date?: string;
  physical_progress: number; // 0-100
  payment_count: number;
  contractor_id: string;
  risk_score: number; // 0-100
  risk_level: RiskLevel;
  anomaly_type?: AnomalyType;
  anomaly_confidence?: number; // 0-100
  financial_year: string;
  implementing_agency: string;
  // AI derived fields
  cost_deviation_pct: number;
  progress_expenditure_gap: number;
  delay_days: number;
  similar_project_avg_cost: number;
  risk_factors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  contribution: number; // 0-100
  value: string;
  expected: string;
}

export interface MP {
  mp_id: string;
  name: string;
  house: House;
  state: string;
  constituency: string;
  party: string;
  term_start: string;
  term_end: string;
  total_funds_released: number;
  total_expenditure: number;
  works_recommended: number;
  works_sanctioned: number;
  works_completed: number;
  ongoing_works: number;
  high_risk_works: number;
  efficiency_score: number;
  financial_efficiency: number;
  completion_efficiency: number;
  risk_exposure: RiskLevel;
}

export interface StateStats {
  state: string;
  funds_released: number;
  expenditure: number;
  works_recommended: number;
  works_sanctioned: number;
  works_completed: number;
  completion_pct: number;
  high_risk_projects: number;
  anomalies: number;
  avg_risk_score: number;
  utilization_pct: number;
}

export interface Anomaly {
  anomaly_id: string;
  project_id: string;
  work_name: string;
  anomaly_type: AnomalyType;
  severity: AlertSeverity;
  detected_value: string;
  expected_value: string;
  deviation: string;
  ai_confidence: number;
  status: InvestigationStatus;
  detected_date: string;
  state: string;
  mp_name: string;
}

export interface Alert {
  alert_id: string;
  project_id?: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  created_at: string;
  status: AlertStatus;
  assigned_to?: string;
  investigation_comment?: string;
  state?: string;
  district?: string;
}

export interface FundData {
  year: string;
  released: number;
  sanctioned: number;
  utilized: number;
  unspent: number;
}

export interface SectorSpend {
  sector: string;
  amount: number;
  count: number;
  avg_risk: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-MODAL AI / ANALYTICS MODULE TYPES (MPLADS AI SENTINEL WORKFLOW)
// ─────────────────────────────────────────────────────────────────────────────

export type AIModuleId =
  | 'financial'
  | 'photo'
  | 'geospatial'
  | 'vendor'
  | 'document'
  | 'progress';

export interface AIModuleScore {
  moduleId: AIModuleId;
  name: string;
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  confidence: number; // 0 - 100
  weight: number; // percentage (e.g. 20%)
  status: 'Clean' | 'Flagged' | 'Severe Anomaly';
  keyFindings: string[];
  metrics: Record<string, string | number>;
}

export interface MultiModalEvidence {
  projectId: string;
  workName: string;
  compositeScore: number; // 0 - 100
  riskLevel: RiskLevel;
  confidence: number;
  moduleScores: {
    financial: AIModuleScore;
    photo: AIModuleScore;
    geospatial: AIModuleScore;
    vendor: AIModuleScore;
    document: AIModuleScore;
    progress: AIModuleScore;
  };
  crossSchemeAlert?: CrossSchemeDuplication;
  inspectionPriorityRank: number;
  recommendedAction: string;
  explanationWaterfall: { factor: string; impact: number; description: string }[];
}

export interface PhotoEvidenceItem {
  id: string;
  projectId: string;
  stage: 'Before Work' | 'In Progress' | 'Completed';
  imageUrl: string;
  uploadedAt: string;
  exifGps: { lat: number; lng: number };
  projectGps: { lat: number; lng: number };
  distanceMeters: number;
  gpsMatch: boolean;
  pHashSimilarity: number; // 0-100 (high means duplicate of another project)
  duplicateOfProjectId?: string;
  aiEstimatedProgress: number; // 0-100
  claimedProgress: number;
  isManipulated: boolean;
}

export interface CrossSchemeDuplication {
  mpladsProjectId: string;
  mpladsWorkName: string;
  mpladsCost: number;
  mpladsGps: { lat: number; lng: number };
  overlappingScheme: 'PMGSY' | 'Jal Jeevan Mission' | 'AMRUT' | 'Samagra Shiksha' | 'Smart Cities Mission';
  schemeProjectId: string;
  schemeWorkName: string;
  schemeCost: number;
  schemeGps: { lat: number; lng: number };
  distanceMeters: number;
  titleSimilarityPct: number;
  potentialDuplicationRisk: 'HIGH' | 'CRITICAL';
  estimatedDoubleFundingLakhs: number;
}

export interface VendorAnalyticsItem {
  vendorId: string;
  vendorName: string;
  state: string;
  activeProjectsCount: number;
  totalWonAmountLakhs: number;
  concentrationIndexHHI: number; // 0 - 10,000
  priceDeviationFromDSR: number; // percentage variance from PWD schedule of rates
  winRatePct: number;
  suspectedCartelPartners: string[];
  riskCategory: 'Low Risk' | 'Monopoly Concern' | 'Bid Collusion Suspected' | 'Severe Risk';
}

export interface DocumentVerificationItem {
  documentId: string;
  projectId: string;
  docType: 'Detailed Project Report' | 'Sanction Order' | 'Utilization Certificate' | 'Contractor Invoice' | 'Inspection Report';
  extractedAmountLakhs: number;
  sanctionedAmountLakhs: number;
  discrepancyLakhs: number;
  ocrConfidence: number;
  dateConsistencyCheck: boolean;
  missingMandatoryFields: string[];
  authenticityStatus: 'Verified' | 'Flagged Discrepancy' | 'Missing Annexures';
}

export interface InspectionPriorityItem {
  rank: number;
  projectId: string;
  workName: string;
  state: string;
  constituency: string;
  mpName: string;
  compositeScore: number;
  riskLevel: RiskLevel;
  primaryFlagModule: AIModuleId;
  estimatedFinancialRiskLakhs: number;
  daysFlagged: number;
  status: 'Pending Assignment' | 'Inspection Scheduled' | 'Report Submitted' | 'Action Enforced';
  assignedInspector?: string;
}
