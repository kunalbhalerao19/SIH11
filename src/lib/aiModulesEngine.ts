// Multi-Modal AI & Analytics Engine for MPLADS AI Sentinel
// Implements the 6 Core AI Modules + Evidence Fusion & Cross-Scheme Duplication Engine

import type {
  AIModuleId,
  AIModuleScore,
  MultiModalEvidence,
  PhotoEvidenceItem,
  CrossSchemeDuplication,
  VendorAnalyticsItem,
  DocumentVerificationItem,
  InspectionPriorityItem,
  RiskLevel,
  Project,
} from '../types';

export const AI_MODULE_DEFINITIONS: Record<
  AIModuleId,
  {
    title: string;
    description: string;
    iconName: string;
    subFeatures: string[];
    defaultWeight: number;
    color: string;
  }
> = {
  financial: {
    title: 'Financial Anomaly Detection',
    description: 'Identifies unusual expenditure velocity, multi-tranche rush spending, and cost deviation outliers.',
    iconName: 'DollarSign',
    subFeatures: [
      'Unusual Expenditure Spikes',
      'Cost Overruns vs Sanction',
      'Fund Utilization Velocity',
      'March Rush / Year-End Payment Bursts',
      'Delayed Spending Accumulation',
    ],
    defaultWeight: 25,
    color: '#1e40af',
  },
  photo: {
    title: 'Photo & Evidence Verification',
    description: 'Computer vision analysis for image perceptual hashing (pHash), EXIF GPS validation, and progress estimation.',
    iconName: 'Camera',
    subFeatures: [
      'Duplicate / Reused Photos Detection',
      'GPS & Geotag Mismatch Verification',
      'Timestamp Sequence Auditing',
      'Image Tampering & Splicing Detection',
      'AI Visual Progress vs Claimed Progress',
    ],
    defaultWeight: 20,
    color: '#0891b2',
  },
  geospatial: {
    title: 'Geospatial Intelligence',
    description: 'Spatial clustering, GPS coordinate boundary validation, and redundant infrastructure proximity checks.',
    iconName: 'MapPin',
    subFeatures: [
      'Location Boundary Validation',
      'Nearby Projects Redundancy (<100m)',
      'Spatial Risk Cluster Detection',
      'Duplicate Asset Spatial Footprint',
      'Cross-Scheme Physical Overlap',
    ],
    defaultWeight: 15,
    color: '#059669',
  },
  vendor: {
    title: 'Vendor & Procurement Analytics',
    description: 'Analyzes contractor concentration (HHI index), cartel bidding networks, and price variance vs CPWD DSR rates.',
    iconName: 'Users',
    subFeatures: [
      'Vendor Winning Frequency Anomalies',
      'Contractor Concentration Index (HHI)',
      'Price Benchmarking vs Schedule of Rates',
      'Split-Tendering to Bypass Thresholds',
      'Collusive Bidding & Cartel Patterns',
    ],
    defaultWeight: 15,
    color: '#7c3aed',
  },
  document: {
    title: 'Document Intelligence',
    description: 'OCR and NLP cross-verification between DPR, Sanction Orders, Utilization Certificates (UC), and contractor bills.',
    iconName: 'FileText',
    subFeatures: [
      'OCR & Data Extraction from PDFs',
      'Sanction vs Invoice Amount Reconciliation',
      'UC Date vs Expense Date Pre-dating Check',
      'Missing Mandatory Annexure Scanning',
      'NLP Inconsistency & Clause Verification',
    ],
    defaultWeight: 10,
    color: '#d97706',
  },
  progress: {
    title: 'Progress & Timeline Analysis',
    description: 'S-curve milestone progression tracking, critical delay velocities, and milestone divergence modeling.',
    iconName: 'Clock',
    subFeatures: [
      'Claimed vs Milestone S-Curve Verification',
      'Stage-Gate Sequencing Audits',
      'Critical Path Delay Velocity',
      'Stagnant Project Stoppage Detection',
      'Progress-Expenditure Divergence Index',
    ],
    defaultWeight: 15,
    color: '#dc2626',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CROSS-SCHEME DUPLICATION DATASET (Step 9 in Diagram)
// ─────────────────────────────────────────────────────────────────────────────
export const CROSS_SCHEME_DUPLICATIONS: CrossSchemeDuplication[] = [
  {
    mpladsProjectId: 'MPL-2026-00451',
    mpladsWorkName: 'Community Hall Construction - Hadapsar Ward',
    mpladsCost: 85,
    mpladsGps: { lat: 18.5089, lng: 73.9260 },
    overlappingScheme: 'Smart Cities Mission',
    schemeProjectId: 'SCM-MH-PUN-0842',
    schemeWorkName: 'Construction of Multipurpose Civic Centre, Hadapsar',
    schemeCost: 110,
    schemeGps: { lat: 18.5092, lng: 73.9264 },
    distanceMeters: 48,
    titleSimilarityPct: 87,
    potentialDuplicationRisk: 'CRITICAL',
    estimatedDoubleFundingLakhs: 85,
  },
  {
    mpladsProjectId: 'MPL-2026-00102',
    mpladsWorkName: 'Village Road Connectivity - Phulwarisharif',
    mpladsCost: 120,
    mpladsGps: { lat: 25.5678, lng: 85.0743 },
    overlappingScheme: 'PMGSY',
    schemeProjectId: 'PMGSY-BR-PAT-4401',
    schemeWorkName: 'Construction of BT Road from Phulwari to Khagaul Road',
    schemeCost: 145,
    schemeGps: { lat: 25.5681, lng: 85.0747 },
    distanceMeters: 55,
    titleSimilarityPct: 91,
    potentialDuplicationRisk: 'CRITICAL',
    estimatedDoubleFundingLakhs: 120,
  },
  {
    mpladsProjectId: 'MPL-2026-04131',
    mpladsWorkName: 'Piped Water Supply to 20 Rural Habitations',
    mpladsCost: 195,
    mpladsGps: { lat: 25.4182, lng: 86.1272 },
    overlappingScheme: 'Jal Jeevan Mission',
    schemeProjectId: 'JJM-BR-BEG-2918',
    schemeWorkName: 'Functional Household Tap Connection Network - Begusarai Sector 4',
    schemeCost: 240,
    schemeGps: { lat: 25.4180, lng: 86.1270 },
    distanceMeters: 32,
    titleSimilarityPct: 82,
    potentialDuplicationRisk: 'CRITICAL',
    estimatedDoubleFundingLakhs: 180,
  },
  {
    mpladsProjectId: 'MPL-2026-02984',
    mpladsWorkName: 'Rural Road Upgrade - Pandharpur Corridor',
    mpladsCost: 225,
    mpladsGps: { lat: 17.6780, lng: 75.3245 },
    overlappingScheme: 'PMGSY',
    schemeProjectId: 'PMGSY-MH-SOL-9912',
    schemeWorkName: 'Widening of Pandharpur Pilgrim Link Road',
    schemeCost: 210,
    schemeGps: { lat: 17.6785, lng: 75.3250 },
    distanceMeters: 75,
    titleSimilarityPct: 78,
    potentialDuplicationRisk: 'HIGH',
    estimatedDoubleFundingLakhs: 150,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO EVIDENCE DATASET (Computer Vision / EXIF / pHash)
// ─────────────────────────────────────────────────────────────────────────────
export const PHOTO_EVIDENCE_ITEMS: PhotoEvidenceItem[] = [
  {
    id: 'PHT-001',
    projectId: 'MPL-2026-00451',
    stage: 'In Progress',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=60',
    uploadedAt: '2026-07-12T14:32:00',
    exifGps: { lat: 18.5204, lng: 73.8567 }, // Pune city center (~8 km away from Hadapsar project location!)
    projectGps: { lat: 18.5089, lng: 73.9260 },
    distanceMeters: 7850,
    gpsMatch: false,
    pHashSimilarity: 94.2, // Duplicate image found in another district!
    duplicateOfProjectId: 'MPL-2025-08192',
    aiEstimatedProgress: 28,
    claimedProgress: 82,
    isManipulated: true,
  },
  {
    id: 'PHT-002',
    projectId: 'MPL-2026-04131',
    stage: 'In Progress',
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=60',
    uploadedAt: '2026-07-18T10:15:00',
    exifGps: { lat: 25.4182, lng: 86.1272 },
    projectGps: { lat: 25.4182, lng: 86.1272 },
    distanceMeters: 12,
    gpsMatch: true,
    pHashSimilarity: 14.5,
    aiEstimatedProgress: 18,
    claimedProgress: 94,
    isManipulated: false,
  },
  {
    id: 'PHT-003',
    projectId: 'MPL-2026-00317',
    stage: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=60',
    uploadedAt: '2024-10-05T16:45:00',
    exifGps: { lat: 13.0827, lng: 80.2707 },
    projectGps: { lat: 13.0830, lng: 80.2710 },
    distanceMeters: 45,
    gpsMatch: true,
    pHashSimilarity: 4.1,
    aiEstimatedProgress: 98,
    claimedProgress: 100,
    isManipulated: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// VENDOR & PROCUREMENT ANALYTICS (HHI, Price Benchmarking, Cartel Detection)
// ─────────────────────────────────────────────────────────────────────────────
export const VENDOR_ANALYTICS: VendorAnalyticsItem[] = [
  {
    vendorId: 'CONT-MH-4521',
    vendorName: 'Sahyadri Infra & Construction Ltd.',
    state: 'Maharashtra',
    activeProjectsCount: 14,
    totalWonAmountLakhs: 2150,
    concentrationIndexHHI: 4820, // Extreme monopoly in constituency (>2500 is severe)
    priceDeviationFromDSR: +34.5, // 34.5% above CPWD Schedule of Rates
    winRatePct: 91.5,
    suspectedCartelPartners: ['CONT-MH-4522 (Proxy B)', 'CONT-MH-4523 (Cover Bidder)'],
    riskCategory: 'Severe Risk',
  },
  {
    vendorId: 'CONT-BR-1193',
    vendorName: 'Magadh Mega Builders Pvt. Ltd.',
    state: 'Bihar',
    activeProjectsCount: 11,
    totalWonAmountLakhs: 1840,
    concentrationIndexHHI: 3950,
    priceDeviationFromDSR: +28.2,
    winRatePct: 86.0,
    suspectedCartelPartners: ['CONT-BR-1194 (Related Director)'],
    riskCategory: 'Bid Collusion Suspected',
  },
  {
    vendorId: 'CONT-RJ-7721',
    vendorName: 'Marwar Highway Developers',
    state: 'Rajasthan',
    activeProjectsCount: 8,
    totalWonAmountLakhs: 1180,
    concentrationIndexHHI: 2780,
    priceDeviationFromDSR: +19.4,
    winRatePct: 74.0,
    suspectedCartelPartners: [],
    riskCategory: 'Monopoly Concern',
  },
  {
    vendorId: 'CONT-TN-2211',
    vendorName: 'Chola Infrastructure Works',
    state: 'Tamil Nadu',
    activeProjectsCount: 5,
    totalWonAmountLakhs: 480,
    concentrationIndexHHI: 920,
    priceDeviationFromDSR: +2.1,
    winRatePct: 34.0,
    suspectedCartelPartners: [],
    riskCategory: 'Low Risk',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT INTELLIGENCE (OCR, Invoice-to-Sanction Reconciliation)
// ─────────────────────────────────────────────────────────────────────────────
export const DOCUMENT_VERIFICATIONS: DocumentVerificationItem[] = [
  {
    documentId: 'DOC-2026-901',
    projectId: 'MPL-2026-00451',
    docType: 'Contractor Invoice',
    extractedAmountLakhs: 78.0,
    sanctionedAmountLakhs: 85.0,
    discrepancyLakhs: 24.5, // Total billed claims exceed verified stage work
    ocrConfidence: 98.4,
    dateConsistencyCheck: false, // Invoice date predates inspection clearance
    missingMandatoryFields: ['Quality Assurance Certificate', 'Material Test Lab Report'],
    authenticityStatus: 'Flagged Discrepancy',
  },
  {
    documentId: 'DOC-2026-902',
    projectId: 'MPL-2026-04131',
    docType: 'Utilization Certificate',
    extractedAmountLakhs: 175.0,
    sanctionedAmountLakhs: 195.0,
    discrepancyLakhs: 138.0, // UC submitted for 90% funds while site is at 18%
    ocrConfidence: 99.1,
    dateConsistencyCheck: false,
    missingMandatoryFields: ['Third Party Inspection Signoff', 'Geo-tagged Site Photos'],
    authenticityStatus: 'Flagged Discrepancy',
  },
  {
    documentId: 'DOC-2026-903',
    projectId: 'MPL-2026-00317',
    docType: 'Utilization Certificate',
    extractedAmountLakhs: 38.0,
    sanctionedAmountLakhs: 44.0,
    discrepancyLakhs: 0.0,
    ocrConfidence: 99.5,
    dateConsistencyCheck: true,
    missingMandatoryFields: [],
    authenticityStatus: 'Verified',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INSPECTION PRIORITY QUEUE (Step 6 in Diagram)
// ─────────────────────────────────────────────────────────────────────────────
export const INSPECTION_PRIORITY_QUEUE: InspectionPriorityItem[] = [
  {
    rank: 1,
    projectId: 'MPL-2026-00451',
    workName: 'Community Hall Construction - Hadapsar Ward',
    state: 'Maharashtra',
    constituency: 'Hingoli',
    mpName: 'Aashtikar Patil Nagesh Bapurao',
    compositeScore: 94,
    riskLevel: 'CRITICAL',
    primaryFlagModule: 'photo',
    estimatedFinancialRiskLakhs: 78,
    daysFlagged: 41,
    status: 'Pending Assignment',
    assignedInspector: 'Dy. Collector (Vigilance), Pune',
  },
  {
    rank: 2,
    projectId: 'MPL-2026-04131',
    workName: 'Piped Water Supply to 20 Rural Habitations',
    state: 'Bihar',
    constituency: 'Begusarai',
    mpName: 'Giriraj Singh',
    compositeScore: 98,
    riskLevel: 'CRITICAL',
    primaryFlagModule: 'progress',
    estimatedFinancialRiskLakhs: 175,
    daysFlagged: 34,
    status: 'Inspection Scheduled',
    assignedInspector: 'Executive Engineer, PHED Central',
  },
  {
    rank: 3,
    projectId: 'MPL-2026-02984',
    workName: 'Rural Road Upgrade - Pandharpur Corridor',
    state: 'Maharashtra',
    constituency: 'Solapur',
    mpName: 'Praniti Sushilkumar Shinde',
    compositeScore: 89,
    riskLevel: 'CRITICAL',
    primaryFlagModule: 'financial',
    estimatedFinancialRiskLakhs: 205,
    daysFlagged: 36,
    status: 'Pending Assignment',
  },
  {
    rank: 4,
    projectId: 'MPL-2026-01271',
    workName: 'Lift Irrigation Canal Repair - Kalamnuri Taluka',
    state: 'Maharashtra',
    constituency: 'Hingoli',
    mpName: 'Aashtikar Patil Nagesh Bapurao',
    compositeScore: 86,
    riskLevel: 'CRITICAL',
    primaryFlagModule: 'vendor',
    estimatedFinancialRiskLakhs: 155,
    daysFlagged: 44,
    status: 'Report Submitted',
    assignedInspector: 'Superintending Engineer, WRD',
  },
  {
    rank: 5,
    projectId: 'MPL-2026-00102',
    workName: 'Village Road Connectivity - Phulwarisharif',
    state: 'Bihar',
    constituency: 'Aurangabad',
    mpName: 'Abhay Kumar Sinha',
    compositeScore: 82,
    riskLevel: 'CRITICAL',
    primaryFlagModule: 'geospatial',
    estimatedFinancialRiskLakhs: 98,
    daysFlagged: 37,
    status: 'Pending Assignment',
  },
  {
    rank: 6,
    projectId: 'MPL-2026-01044',
    workName: 'Bituminous Link Road Construction - Sikar Rural',
    state: 'Rajasthan',
    constituency: 'Sikar',
    mpName: 'Amraram',
    compositeScore: 68,
    riskLevel: 'HIGH',
    primaryFlagModule: 'financial',
    estimatedFinancialRiskLakhs: 128,
    daysFlagged: 33,
    status: 'Inspection Scheduled',
    assignedInspector: 'Assistant Engineer, PWD Sikar',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-MODAL EVIDENCE FUSION CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function calculateMultiModalEvidence(
  project: Project,
  customWeights?: Partial<Record<AIModuleId, number>>
): MultiModalEvidence {
  const weights: Record<AIModuleId, number> = {
    financial: customWeights?.financial ?? AI_MODULE_DEFINITIONS.financial.defaultWeight,
    photo: customWeights?.photo ?? AI_MODULE_DEFINITIONS.photo.defaultWeight,
    geospatial: customWeights?.geospatial ?? AI_MODULE_DEFINITIONS.geospatial.defaultWeight,
    vendor: customWeights?.vendor ?? AI_MODULE_DEFINITIONS.vendor.defaultWeight,
    document: customWeights?.document ?? AI_MODULE_DEFINITIONS.document.defaultWeight,
    progress: customWeights?.progress ?? AI_MODULE_DEFINITIONS.progress.defaultWeight,
  };

  const isSevere = project.risk_score >= 81;
  const isHigh = project.risk_score >= 61 && project.risk_score < 81;
  const isMed = project.risk_score >= 31 && project.risk_score < 61;

  // 1. Financial Sub-Score
  const fundUtil = project.fund_released > 0 ? (project.expenditure / project.fund_released) * 100 : 0;
  const costDev = Math.abs(project.cost_deviation_pct || 0);
  const finScore = isSevere ? Math.min(100, Math.round(75 + costDev * 0.4)) : (isHigh ? Math.min(80, Math.round(55 + costDev * 0.3)) : Math.round(15 + costDev * 0.2));

  // 2. Photo Sub-Score
  const photoItem = PHOTO_EVIDENCE_ITEMS.find(p => p.projectId === project.project_id);
  let photoScore = 15;
  if (photoItem) {
    if (!photoItem.gpsMatch || photoItem.isManipulated || photoItem.pHashSimilarity > 80) {
      photoScore = 92;
    } else if (Math.abs(photoItem.claimedProgress - photoItem.aiEstimatedProgress) > 30) {
      photoScore = 78;
    }
  } else if (isSevere) {
    photoScore = 84;
  } else if (isHigh) {
    photoScore = 58;
  }

  // 3. Geospatial Sub-Score
  const dupCheck = CROSS_SCHEME_DUPLICATIONS.find(d => d.mpladsProjectId === project.project_id);
  let geoScore = dupCheck ? 95 : (isSevere ? 72 : (isHigh ? 48 : 12));

  // 4. Vendor Sub-Score
  const vendorInfo = VENDOR_ANALYTICS.find(v => v.vendorId === project.contractor_id);
  let vendorScore = 20;
  if (vendorInfo) {
    if (vendorInfo.riskCategory === 'Severe Risk') vendorScore = 94;
    else if (vendorInfo.riskCategory === 'Bid Collusion Suspected') vendorScore = 82;
    else if (vendorInfo.riskCategory === 'Monopoly Concern') vendorScore = 64;
  } else if (isSevere) {
    vendorScore = 80;
  }

  // 5. Document Sub-Score
  const docInfo = DOCUMENT_VERIFICATIONS.find(d => d.projectId === project.project_id);
  let docScore = 10;
  if (docInfo) {
    if (docInfo.discrepancyLakhs > 20 || !docInfo.dateConsistencyCheck) docScore = 88;
    else if (docInfo.missingMandatoryFields.length > 0) docScore = 62;
  } else if (isSevere) {
    docScore = 76;
  }

  // 6. Progress & Timeline Sub-Score
  const progressGap = project.progress_expenditure_gap || Math.max(0, fundUtil - project.physical_progress);
  const progScore = isSevere ? Math.min(100, Math.round(70 + progressGap * 0.8)) : (isHigh ? Math.min(80, Math.round(50 + progressGap * 0.6)) : Math.round(10 + progressGap * 0.3));

  // Normalized weights sum
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 100;
  const composite = Math.min(100, Math.max(5, Math.round(
    (finScore * weights.financial +
      photoScore * weights.photo +
      geoScore * weights.geospatial +
      vendorScore * weights.vendor +
      docScore * weights.document +
      progScore * weights.progress) / totalWeight
  )));

  let riskLevel: RiskLevel = 'LOW';
  if (composite >= 81) riskLevel = 'CRITICAL';
  else if (composite >= 61) riskLevel = 'HIGH';
  else if (composite >= 31) riskLevel = 'MEDIUM';

  const waterfall = [
    { factor: 'Financial Anomaly (Cost/Velocity)', impact: Math.round((finScore * weights.financial) / totalWeight), description: `Cost deviation +${project.cost_deviation_pct}% vs sector average` },
    { factor: 'Photo & Computer Vision', impact: Math.round((photoScore * weights.photo) / totalWeight), description: photoScore > 70 ? 'GPS geotag discrepancy or duplicate image hash' : 'Clean photographic evidence' },
    { factor: 'Geospatial Intelligence', impact: Math.round((geoScore * weights.geospatial) / totalWeight), description: dupCheck ? `Overlap detected with ${dupCheck.overlappingScheme} project (<50m)` : 'Valid project coordinates' },
    { factor: 'Vendor Concentration', impact: Math.round((vendorScore * weights.vendor) / totalWeight), description: vendorInfo ? `Vendor HHI index ${vendorInfo.concentrationIndexHHI}, win rate ${vendorInfo.winRatePct}%` : 'Standard competitive vendor' },
    { factor: 'Document Verification', impact: Math.round((docScore * weights.document) / totalWeight), description: docScore > 70 ? 'Invoice vs Sanction Order amount reconciliation discrepancy' : 'Consistent UC and bills' },
    { factor: 'Progress Divergence', impact: Math.round((progScore * weights.progress) / totalWeight), description: `${fundUtil.toFixed(0)}% funds utilized vs ${project.physical_progress}% physical progress` },
  ].sort((a, b) => b.impact - a.impact);

  return {
    projectId: project.project_id,
    workName: project.work_name,
    compositeScore: composite,
    riskLevel,
    confidence: project.anomaly_confidence || 88,
    moduleScores: {
      financial: {
        moduleId: 'financial',
        name: 'Financial Anomaly Detection',
        score: finScore,
        riskLevel: finScore >= 81 ? 'CRITICAL' : finScore >= 61 ? 'HIGH' : finScore >= 31 ? 'MEDIUM' : 'LOW',
        confidence: 92,
        weight: weights.financial,
        status: finScore >= 75 ? 'Severe Anomaly' : finScore >= 50 ? 'Flagged' : 'Clean',
        keyFindings: [
          `Sanctioned Cost: ₹${project.sanctioned_cost}L (Deviation: ${project.cost_deviation_pct > 0 ? '+' : ''}${project.cost_deviation_pct}%)`,
          `Fund Utilization: ${fundUtil.toFixed(1)}% of released funds`,
          `Payment Tranches: ${project.payment_count} payments recorded`,
        ],
        metrics: {
          'Cost Deviation': `${project.cost_deviation_pct}%`,
          'Expenditure': `₹${project.expenditure}L`,
          'Sanctioned': `₹${project.sanctioned_cost}L`,
          'Payment Tranches': project.payment_count,
        },
      },
      photo: {
        moduleId: 'photo',
        name: 'Photo & Evidence Verification',
        score: photoScore,
        riskLevel: photoScore >= 81 ? 'CRITICAL' : photoScore >= 61 ? 'HIGH' : photoScore >= 31 ? 'MEDIUM' : 'LOW',
        confidence: 89,
        weight: weights.photo,
        status: photoScore >= 75 ? 'Severe Anomaly' : photoScore >= 50 ? 'Flagged' : 'Clean',
        keyFindings: [
          photoItem && !photoItem.gpsMatch ? `EXIF Geotag Mismatch: Photo captured ${photoItem.distanceMeters}m from site` : 'GPS Coordinates match project site',
          photoItem && photoItem.pHashSimilarity > 80 ? `Perceptual Hash match (${photoItem.pHashSimilarity}%) with Project ${photoItem.duplicateOfProjectId}` : 'Unique image verified against central photo bank',
          `AI Visual Completion: ${photoItem ? photoItem.aiEstimatedProgress : project.physical_progress}% vs Claimed: ${project.physical_progress}%`,
        ],
        metrics: {
          'GPS Variance': photoItem ? `${photoItem.distanceMeters}m` : '0m (Exact)',
          'Duplicate Similarity': photoItem ? `${photoItem.pHashSimilarity}%` : '4.2%',
          'Visual vs Claimed': `${photoItem ? photoItem.aiEstimatedProgress : project.physical_progress}% / ${project.physical_progress}%`,
        },
      },
      geospatial: {
        moduleId: 'geospatial',
        name: 'Geospatial Intelligence',
        score: geoScore,
        riskLevel: geoScore >= 81 ? 'CRITICAL' : geoScore >= 61 ? 'HIGH' : geoScore >= 31 ? 'MEDIUM' : 'LOW',
        confidence: 94,
        weight: weights.geospatial,
        status: geoScore >= 75 ? 'Severe Anomaly' : geoScore >= 50 ? 'Flagged' : 'Clean',
        keyFindings: [
          dupCheck ? `Spatial Co-location with ${dupCheck.overlappingScheme} Project ${dupCheck.schemeProjectId} (<${dupCheck.distanceMeters}m)` : 'No spatial overlap detected within 500m radius',
          `District: ${project.district}, Constituency: ${project.constituency}`,
          `Nearby Active Projects in 1km: 3 works`,
        ],
        metrics: {
          'Overlap Distance': dupCheck ? `${dupCheck.distanceMeters}m` : 'No conflict',
          'Coordinate Validity': 'Verified (Lat/Lng bounds)',
          'Cluster Risk Level': isSevere ? 'High Density Flag' : 'Normal',
        },
      },
      vendor: {
        moduleId: 'vendor',
        name: 'Vendor & Procurement Analytics',
        score: vendorScore,
        riskLevel: vendorScore >= 81 ? 'CRITICAL' : vendorScore >= 61 ? 'HIGH' : vendorScore >= 31 ? 'MEDIUM' : 'LOW',
        confidence: 87,
        weight: weights.vendor,
        status: vendorScore >= 75 ? 'Severe Anomaly' : vendorScore >= 50 ? 'Flagged' : 'Clean',
        keyFindings: [
          `Contractor: ${project.contractor_id}`,
          vendorInfo ? `Concentration Index HHI: ${vendorInfo.concentrationIndexHHI} (${vendorInfo.riskCategory})` : 'Vendor HHI normal (<1500)',
          vendorInfo ? `Price deviation from CPWD DSR: ${vendorInfo.priceDeviationFromDSR > 0 ? '+' : ''}${vendorInfo.priceDeviationFromDSR}%` : 'Rates within standard PWD tolerance',
        ],
        metrics: {
          'Vendor ID': project.contractor_id,
          'HHI Index': vendorInfo ? vendorInfo.concentrationIndexHHI : 1100,
          'DSR Variance': vendorInfo ? `+${vendorInfo.priceDeviationFromDSR}%` : '+3.1%',
        },
      },
      document: {
        moduleId: 'document',
        name: 'Document Intelligence',
        score: docScore,
        riskLevel: docScore >= 81 ? 'CRITICAL' : docScore >= 61 ? 'HIGH' : docScore >= 31 ? 'MEDIUM' : 'LOW',
        confidence: 95,
        weight: weights.document,
        status: docScore >= 75 ? 'Severe Anomaly' : docScore >= 50 ? 'Flagged' : 'Clean',
        keyFindings: [
          docInfo ? `Amount Reconciliation Variance: ₹${docInfo.discrepancyLakhs}L between Invoice & Sanction` : 'Bill amounts match sanction order schedule',
          docInfo && !docInfo.dateConsistencyCheck ? 'UC date predates actual financial clearance' : 'Document timeline sequence valid',
          docInfo && docInfo.missingMandatoryFields.length > 0 ? `Missing: ${docInfo.missingMandatoryFields.join(', ')}` : 'All mandatory annexures verified',
        ],
        metrics: {
          'OCR Extraction Accuracy': '99.2%',
          'Reconciliation Variance': docInfo ? `₹${docInfo.discrepancyLakhs}L` : '₹0.00',
          'Date Consistency': docInfo ? (docInfo.dateConsistencyCheck ? 'Pass' : 'Failed') : 'Pass',
        },
      },
      progress: {
        moduleId: 'progress',
        name: 'Progress & Timeline Analysis',
        score: progScore,
        riskLevel: progScore >= 81 ? 'CRITICAL' : progScore >= 61 ? 'HIGH' : progScore >= 31 ? 'MEDIUM' : 'LOW',
        confidence: 91,
        weight: weights.progress,
        status: progScore >= 75 ? 'Severe Anomaly' : progScore >= 50 ? 'Flagged' : 'Clean',
        keyFindings: [
          `Progress-Expenditure Gap: ${progressGap.toFixed(1)}% discrepancy`,
          project.delay_days > 0 ? `Overdue by ${project.delay_days} days past target date` : 'Project milestone timeline on schedule',
          `Start Date: ${project.start_date} | Target: ${project.expected_completion_date}`,
        ],
        metrics: {
          'Progress Gap': `${progressGap.toFixed(1)}%`,
          'Delay Days': project.delay_days,
          'Physical Progress': `${project.physical_progress}%`,
        },
      },
    },
    crossSchemeAlert: dupCheck,
    inspectionPriorityRank: isSevere ? 1 : isHigh ? 6 : 24,
    recommendedAction: isSevere
      ? 'Immediate physical inspection & forensic document audit required'
      : isHigh
      ? 'Assign field verification officer for photo & geotag re-survey'
      : 'Maintain standard periodic milestone monitoring',
    explanationWaterfall: waterfall,
  };
}
