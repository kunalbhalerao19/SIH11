// AI Risk Scoring Engine (Demo/Prototype)
// WARNING: This is a prototype scoring system for demonstration purposes only.
// It does NOT represent the official MPLADS risk methodology.

import type { Project, RiskLevel, RiskFactor } from '../types';

export interface RiskScoreResult {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  summary: string;
}

// Weights for risk factors (sum = 100)
const WEIGHTS = {
  costDeviation: 25,
  progressExpenditureMismatch: 25,
  completionDelay: 20,
  paymentAnomaly: 15,
  historicalComparison: 10,
  otherIndicators: 5,
};

function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return 'LOW';
  if (score <= 60) return 'MEDIUM';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
}

export function calculateRiskScore(params: {
  costDeviation: number;       // % deviation from similar projects
  physicalProgress: number;    // 0-100
  fundUtilization: number;     // 0-100
  delayDays: number;           // days behind schedule
  paymentCount: number;
  expectedPaymentCount: number;
  sectorAvgCost: number;
  projectCost: number;
}): RiskScoreResult {
  const {
    costDeviation,
    physicalProgress,
    fundUtilization,
    delayDays,
    paymentCount,
    expectedPaymentCount,
    sectorAvgCost,
    projectCost,
  } = params;

  // 1. Cost deviation score (0-100)
  const costScore = Math.min(100, Math.abs(costDeviation) * 1.2);

  // 2. Progress-expenditure mismatch (0-100)
  const progressGap = Math.max(0, fundUtilization - physicalProgress);
  const mismatchScore = Math.min(100, progressGap * 2.5);

  // 3. Completion delay score (0-100)
  const delayScore = Math.min(100, (delayDays / 365) * 80);

  // 4. Payment anomaly (0-100)
  const paymentRatio = expectedPaymentCount > 0
    ? Math.abs(paymentCount - expectedPaymentCount) / expectedPaymentCount
    : 0;
  const paymentScore = Math.min(100, paymentRatio * 100);

  // 5. Historical comparison (0-100)
  const historicalScore = Math.min(100, ((projectCost - sectorAvgCost) / sectorAvgCost) * 100);

  // 6. Other indicators
  const otherScore = fundUtilization > 90 && physicalProgress < 50 ? 80 : 20;

  // Weighted total
  const totalScore = Math.round(
    (costScore * WEIGHTS.costDeviation +
      mismatchScore * WEIGHTS.progressExpenditureMismatch +
      delayScore * WEIGHTS.completionDelay +
      paymentScore * WEIGHTS.paymentAnomaly +
      historicalScore * WEIGHTS.historicalComparison +
      otherScore * WEIGHTS.otherIndicators) / 100
  );

  const clampedScore = Math.max(0, Math.min(100, totalScore));
  const level = getRiskLevel(clampedScore);

  const factors: RiskFactor[] = [
    {
      name: 'Cost Deviation',
      contribution: Math.round(costScore * WEIGHTS.costDeviation / 100),
      value: `${costDeviation > 0 ? '+' : ''}${costDeviation.toFixed(1)}%`,
      expected: 'Within ±15%',
    },
    {
      name: 'Progress vs Expenditure',
      contribution: Math.round(mismatchScore * WEIGHTS.progressExpenditureMismatch / 100),
      value: `${fundUtilization.toFixed(0)}% funds, ${physicalProgress}% progress`,
      expected: 'Gap < 10%',
    },
    {
      name: 'Completion Delay',
      contribution: Math.round(delayScore * WEIGHTS.completionDelay / 100),
      value: `${delayDays} days overdue`,
      expected: 'On schedule',
    },
    {
      name: 'Payment Pattern',
      contribution: Math.round(paymentScore * WEIGHTS.paymentAnomaly / 100),
      value: `${paymentCount} payments`,
      expected: `~${expectedPaymentCount} expected`,
    },
    {
      name: 'Historical Comparison',
      contribution: Math.round(Math.max(0, historicalScore) * WEIGHTS.historicalComparison / 100),
      value: `₹${projectCost.toFixed(0)}L`,
      expected: `₹${sectorAvgCost.toFixed(0)}L avg`,
    },
  ].sort((a, b) => b.contribution - a.contribution);

  const summary = generateSummary(level, factors, costDeviation, progressGap, delayDays);

  return { score: clampedScore, level, factors, summary };
}

function generateSummary(
  level: RiskLevel,
  factors: RiskFactor[],
  costDeviation: number,
  progressGap: number,
  delayDays: number
): string {
  const top = factors[0];
  if (level === 'CRITICAL') {
    return `Potential critical anomaly detected. ${top.name} is the primary concern. Requires immediate official verification.`;
  }
  if (level === 'HIGH') {
    return `Unusual pattern identified. ${top.name} shows significant deviation. Requires official verification.`;
  }
  if (level === 'MEDIUM') {
    return `Potential anomaly detected. Some indicators show deviation from expected norms.`;
  }
  return 'Project appears within normal parameters. Continue routine monitoring.';
}

export function getRiskBadgeClass(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL': return 'badge-critical';
    case 'HIGH': return 'badge-high';
    case 'MEDIUM': return 'badge-medium';
    case 'LOW': return 'badge-low';
  }
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL': return '#991b1b';
    case 'HIGH': return '#9a3412';
    case 'MEDIUM': return '#92400e';
    case 'LOW': return '#166534';
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL': return '#fee2e2';
    case 'HIGH': return '#ffedd5';
    case 'MEDIUM': return '#fef3c7';
    case 'LOW': return '#dcfce7';
  }
}

export function getScoreColor(score: number): string {
  if (score >= 81) return '#dc2626';
  if (score >= 61) return '#ea580c';
  if (score >= 31) return '#d97706';
  return '#16a34a';
}
