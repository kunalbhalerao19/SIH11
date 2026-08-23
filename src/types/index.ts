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
