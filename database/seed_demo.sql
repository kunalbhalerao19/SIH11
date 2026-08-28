-- ==============================================================================
-- MPLADS INTELLIGENCE PLATFORM — SYNTHETIC DEMO DATASET
-- ALL ROWS IN THIS FILE ARE EXPLICITLY TAGGED WITH:
-- source_report = 'DEMO DATA - NOT OFFICIAL MPLADS DATA'
-- ==============================================================================

-- 1. Demo Agencies
INSERT INTO agencies (agency_id, agency_name, agency_type, state_code, district_code, contact_email)
VALUES
('AG-MH-PUN-01', 'District Rural Development Agency (DRDA) Pune', 'DRDA', 'IN-MH', 'MH-PUN', 'drda.pune@demo.gov.in'),
('AG-MH-SOL-01', 'Public Works Department (PWD) Solapur', 'PWD', 'IN-MH', 'MH-SOL', 'pwd.solapur@demo.gov.in'),
('AG-BR-PAT-01', 'Patna Municipal Infrastructure Board', 'Municipal Corporation', 'IN-BR', 'BR-PAT', 'pmc.works@demo.gov.in'),
('AG-BR-BEG-01', 'DRDA Begusarai Rural Works Division', 'DRDA', 'IN-BR', 'BR-BEG', 'drda.begusarai@demo.gov.in'),
('AG-UP-VAR-01', 'Varanasi Development Authority', 'Municipal Corporation', 'IN-UP', 'UP-VAR', 'vda.urban@demo.gov.in'),
('AG-RJ-SIK-01', 'Zilla Parishad Rural Works Sikar', 'Zilla Parishad', 'IN-RJ', 'RJ-SIK', 'zp.sikar@demo.gov.in'),
('AG-TN-CHE-01', 'Greater Chennai Corporation Works Div', 'Municipal Corporation', 'IN-TN', 'TN-CHE', 'gcc.mplads@demo.gov.in'),
('AG-WB-KOL-01', 'Kolkata Metropolitan Development Authority', 'Municipal Corporation', 'IN-WB', 'WB-KOL', 'kmda.works@demo.gov.in')
ON CONFLICT (agency_id) DO NOTHING;

-- 2. Demo MP Members
INSERT INTO members (mp_id, name, house, state_code, constituency_code, party, tenure_years)
VALUES
('MP-MH-PUN-01', 'Representative Pune (Lok Sabha)', 'LOK_SABHA', 'IN-MH', 'PC-MH-34', 'Indian National Party', 5.0),
('MP-MH-SOL-01', 'Representative Solapur (Lok Sabha)', 'LOK_SABHA', 'IN-MH', 'PC-MH-42', 'Progressive Democratic Alliance', 5.0),
('MP-MH-HIN-01', 'Representative Hingoli (Lok Sabha)', 'LOK_SABHA', 'IN-MH', 'PC-MH-15', 'Regional Peoples Front', 5.0),
('MP-BR-PAT-01', 'Representative Pataliputra (Lok Sabha)', 'LOK_SABHA', 'IN-BR', 'PC-BR-31', 'National United Front', 5.0),
('MP-BR-BEG-01', 'Representative Begusarai (Lok Sabha)', 'LOK_SABHA', 'IN-BR', 'PC-BR-24', 'Democratic Coalition', 5.0),
('MP-UP-VAR-01', 'Representative Varanasi (Lok Sabha)', 'LOK_SABHA', 'IN-UP', 'PC-UP-77', 'National Coalition', 5.0),
('MP-UP-LKO-01', 'Representative Lucknow (Lok Sabha)', 'LOK_SABHA', 'IN-UP', 'PC-UP-35', 'Peoples Party', 5.0),
('MP-RJ-SIK-01', 'Representative Sikar (Lok Sabha)', 'LOK_SABHA', 'IN-RJ', 'PC-RJ-04', 'Democratic Union', 5.0),
('MP-TN-CHE-01', 'Representative Chennai Central (Lok Sabha)', 'LOK_SABHA', 'IN-TN', 'PC-TN-04', 'Southern Progressive Party', 5.0),
('MP-WB-KOL-01', 'Representative Kolkata North (Lok Sabha)', 'LOK_SABHA', 'IN-WB', 'PC-WB-24', 'Eastern Alliance', 5.0)
ON CONFLICT (mp_id) DO NOTHING;

-- 3. Demo Works (Mix of completed, ongoing, delayed, and high-anomaly test cases)
INSERT INTO works (
    work_id, financial_year, work_name, sector_code, state_code, district_code, constituency_code,
    mp_id, implementing_agency_id, recommendation_date, sanction_date, expected_completion_date,
    actual_completion_date, recommended_cost, sanctioned_cost, cumulative_fund_released, cumulative_expenditure,
    physical_progress_percent, work_status, contractor_name, contractor_id, latitude, longitude,
    location_geotag_verified, has_photo_evidence, evidence_phash, source_report
)
VALUES
-- Case 1: Hadapsar Multipurpose Community Hall (High Anomaly: Cross-Scheme Overlap with Smart City)
('MPL-2026-00451', '2024-25', 'Construction of Multipurpose Community Hall at Hadapsar', 'SEC-COMM', 'IN-MH', 'MH-PUN', 'PC-MH-34', 'MP-MH-PUN-01', 'AG-MH-PUN-01', '2024-04-12', '2024-05-18', '2025-01-30', NULL, 48.00, 45.00, 40.50, 38.50, 42.00, 'Ongoing', 'Apex Infrastructure Ltd', 'VEN-MH-4401', 18.5089, 73.9260, TRUE, TRUE, '1100101010101100110010101010110011001010101011001100101010101100', 'DEMO DATA - NOT OFFICIAL MPLADS DATA'),

-- Case 2: Phulwari Sharif Concrete Road (High Anomaly: 88% Fund spent vs 20% Physical Progress)
('MPL-2026-00102', '2024-25', 'PCC Road Construction from NH-30 to Phulwari Ward 12', 'SEC-ROAD', 'IN-BR', 'BR-PAT', 'PC-BR-31', 'MP-BR-PAT-01', 'AG-BR-PAT-01', '2024-05-02', '2024-06-10', '2024-12-15', NULL, 28.00, 26.50, 26.50, 23.32, 20.00, 'Delayed', 'Kisan Infratech Projects', 'VEN-BR-0912', 25.5678, 85.0743, TRUE, TRUE, '1111000011110000111100001111000011110000111100001111000011110000', 'DEMO DATA - NOT OFFICIAL MPLADS DATA'),

-- Case 3: Begusarai Deep Tubewell & RO Plant (Overlap with Jal Jeevan Mission)
('MPL-2026-04131', '2024-25', 'Installation of Deep Tubewell and Solar RO Plant at Teghra', 'SEC-DRINK', 'IN-BR', 'BR-BEG', 'PC-BR-24', 'MP-BR-BEG-01', 'AG-BR-BEG-01', '2024-06-15', '2024-07-20', '2025-02-28', NULL, 18.50, 18.00, 16.20, 15.80, 50.00, 'Ongoing', 'Ganga Clean Water Works', 'VEN-BR-3391', 25.4182, 86.1272, TRUE, TRUE, '1010101010101010101010101010101010101010101010101010101010101010', 'DEMO DATA - NOT OFFICIAL MPLADS DATA'),

-- Case 4: Pandharpur Pilgrim Pathway (Overlap with PMGSY)
('MPL-2026-02984', '2024-25', 'Stone Pitching and Paver Block Pathway near Temple Complex', 'SEC-ROAD', 'IN-MH', 'MH-SOL', 'PC-MH-42', 'MP-MH-SOL-01', 'AG-MH-SOL-01', '2024-03-20', '2024-04-25', '2024-11-30', NULL, 32.00, 30.00, 27.00, 25.50, 48.00, 'Delayed', 'Maharashtra Roadways Consortium', 'VEN-MH-1120', 17.6780, 75.3245, TRUE, TRUE, '1100001111000011110000111100001111000011110000111100001111000011', 'DEMO DATA - NOT OFFICIAL MPLADS DATA'),

-- Case 5: Varanasi High School Digital Smart Classrooms (Normal / Completed)
('MPL-2026-01880', '2023-24', 'Setup of 10 Digital Smart Classrooms in Inter Colleges', 'SEC-EDU', 'IN-UP', 'UP-VAR', 'PC-UP-77', 'MP-UP-VAR-01', 'AG-UP-VAR-01', '2023-08-10', '2023-09-15', '2024-03-31', '2024-03-25', 25.00, 24.50, 24.50, 24.50, 100.00, 'Completed', 'EdTech Solutions India', 'VEN-UP-8812', 25.3176, 82.9739, TRUE, TRUE, '0011001100110011001100110011001100110011001100110011001100110011', 'DEMO DATA - NOT OFFICIAL MPLADS DATA'),

-- Case 6: Chennai Primary Health Center Modernization (Normal / Completed)
('MPL-2026-00317', '2023-24', 'Medical Equipment and Dialysis Center Addition at Royapettah', 'SEC-HEALTH', 'IN-TN', 'TN-CHE', 'PC-TN-04', 'MP-TN-CHE-01', 'AG-TN-CHE-01', '2023-07-05', '2023-08-14', '2024-02-28', '2024-02-20', 50.00, 48.00, 48.00, 47.60, 100.00, 'Completed', 'MedTech Health Equipments', 'VEN-TN-0491', 13.0827, 80.2707, TRUE, TRUE, '0101010101010101010101010101010101010101010101010101010101010101', 'DEMO DATA - NOT OFFICIAL MPLADS DATA'),

-- Case 7: Sikar High Mast Solar Lights in 50 Gram Panchayats (Ongoing Clean)
('MPL-2026-01044', '2024-25', 'Installation of 50 LED Solar High Mast Towers', 'SEC-RENEW', 'IN-RJ', 'RJ-SIK', 'PC-RJ-04', 'MP-RJ-SIK-01', 'AG-RJ-SIK-01', '2024-05-18', '2024-06-25', '2025-03-31', NULL, 35.00, 35.00, 28.00, 26.25, 75.00, 'Ongoing', 'Surya Urja Private Ltd', 'VEN-RJ-7721', 27.6094, 75.1398, TRUE, TRUE, '1111111100000000111111110000000011111111000000001111111100000000', 'DEMO DATA - NOT OFFICIAL MPLADS DATA'),

-- Case 8: Hingoli Rural Check Dam (March Rush Anomaly - 90% Sanction in Last Week of March)
('MPL-2026-01271', '2023-24', 'Rainwater Harvesting Check Dam across Nala at Basmat', 'SEC-IRRI', 'IN-MH', 'MH-HIN', 'PC-MH-15', 'MP-MH-HIN-01', 'AG-MH-PUN-01', '2024-03-24', '2024-03-29', '2024-11-30', NULL, 40.00, 39.50, 39.50, 37.50, 30.00, 'Delayed', 'Marathwada Jal Sanrakshan Ltd', 'VEN-MH-9902', 19.7167, 77.1500, TRUE, TRUE, '1001100110011001100110011001100110011001100110011001100110011001', 'DEMO DATA - NOT OFFICIAL MPLADS DATA'),

-- Case 9: Lucknow Community Health Centre Ambulance Deployment (Completed)
('MPL-2026-02119', '2024-25', 'Procurement of 4 Advance Life Support Mobile Ambulances', 'SEC-HEALTH', 'IN-UP', 'UP-LKO', 'PC-UP-35', 'MP-UP-LKO-01', 'AG-UP-VAR-01', '2024-04-10', '2024-05-15', '2024-09-30', '2024-09-20', 36.00, 36.00, 36.00, 35.80, 100.00, 'Completed', 'National Automotive Supply', 'VEN-UP-1184', 26.8467, 80.9462, TRUE, TRUE, '0000111100001111000011110000111100001111000011110000111100001111', 'DEMO DATA - NOT OFFICIAL MPLADS DATA'),

-- Case 10: Kolkata Ward Sanitation Modernization (Ongoing)
('MPL-2026-03421', '2024-25', 'Underground Sewerage Pipeline Extension in Ward 14', 'SEC-SAN', 'IN-WB', 'WB-KOL', 'PC-WB-24', 'MP-WB-KOL-01', 'AG-WB-KOL-01', '2024-06-01', '2024-07-10', '2025-04-30', NULL, 42.00, 40.00, 20.00, 18.00, 45.00, 'Ongoing', 'Bengal Infra Project Agency', 'VEN-WB-6019', 22.5726, 88.3639, TRUE, TRUE, '0110011001100110011001100110011001100110011001100110011001100110', 'DEMO DATA - NOT OFFICIAL MPLADS DATA')
ON CONFLICT (work_id) DO NOTHING;

-- 4. Demo Fund Releases
INSERT INTO fund_releases (release_id, work_id, financial_year, installment_number, release_amount, release_date, sanction_order_number)
VALUES
('REL-2024-451-01', 'MPL-2026-00451', '2024-25', 1, 22.50, '2024-05-25', 'SAN-MH-PUN-0819'),
('REL-2024-451-02', 'MPL-2026-00451', '2024-25', 2, 18.00, '2024-09-10', 'SAN-MH-PUN-1044'),
('REL-2024-102-01', 'MPL-2026-00102', '2024-25', 1, 26.50, '2024-06-15', 'SAN-BR-PAT-0092'),
('REL-2024-131-01', 'MPL-2026-04131', '2024-25', 1, 16.20, '2024-07-28', 'SAN-BR-BEG-4412'),
('REL-2024-984-01', 'MPL-2026-02984', '2024-25', 1, 27.00, '2024-05-05', 'SAN-MH-SOL-3391'),
('REL-2023-880-01', 'MPL-2026-01880', '2023-24', 1, 24.50, '2023-09-20', 'SAN-UP-VAR-9912'),
('REL-2023-317-01', 'MPL-2026-00317', '2023-24', 1, 48.00, '2023-08-20', 'SAN-TN-CHE-0411'),
('REL-2024-044-01', 'MPL-2026-01044', '2024-25', 1, 28.00, '2024-07-02', 'SAN-RJ-SIK-1192'),
('REL-2023-271-01', 'MPL-2026-01271', '2023-24', 1, 39.50, '2024-03-30', 'SAN-MH-HIN-7719'),
('REL-2024-119-01', 'MPL-2026-02119', '2024-25', 1, 36.00, '2024-05-20', 'SAN-UP-LKO-4401'),
('REL-2024-421-01', 'MPL-2026-03421', '2024-25', 1, 20.00, '2024-07-15', 'SAN-WB-KOL-8812')
ON CONFLICT (release_id) DO NOTHING;

-- 5. Demo Expenditures
INSERT INTO expenditures (expenditure_id, work_id, voucher_number, payment_date, expenditure_amount, payee_vendor_name)
VALUES
('EXP-451-01', 'MPL-2026-00451', 'VOUCH-MH-081', '2024-06-15', 20.00, 'Apex Infrastructure Ltd'),
('EXP-451-02', 'MPL-2026-00451', 'VOUCH-MH-192', '2024-10-02', 18.50, 'Apex Infrastructure Ltd'),
('EXP-102-01', 'MPL-2026-00102', 'VOUCH-BR-441', '2024-07-10', 14.00, 'Kisan Infratech Projects'),
('EXP-102-02', 'MPL-2026-00102', 'VOUCH-BR-682', '2024-09-18', 9.32, 'Kisan Infratech Projects'),
('EXP-131-01', 'MPL-2026-04131', 'VOUCH-BR-991', '2024-08-15', 15.80, 'Ganga Clean Water Works'),
('EXP-984-01', 'MPL-2026-02984', 'VOUCH-MH-771', '2024-06-20', 25.50, 'Maharashtra Roadways Consortium'),
('EXP-880-01', 'MPL-2026-01880', 'VOUCH-UP-102', '2024-03-15', 24.50, 'EdTech Solutions India'),
('EXP-317-01', 'MPL-2026-00317', 'VOUCH-TN-331', '2024-02-10', 47.60, 'MedTech Health Equipments'),
('EXP-044-01', 'MPL-2026-01044', 'VOUCH-RJ-552', '2024-09-05', 26.25, 'Surya Urja Private Ltd'),
('EXP-271-01', 'MPL-2026-01271', 'VOUCH-MH-009', '2024-04-12', 37.50, 'Marathwada Jal Sanrakshan Ltd'),
('EXP-119-01', 'MPL-2026-02119', 'VOUCH-UP-882', '2024-08-30', 35.80, 'National Automotive Supply'),
('EXP-421-01', 'MPL-2026-03421', 'VOUCH-WB-229', '2024-09-22', 18.00, 'Bengal Infra Project Agency')
ON CONFLICT (expenditure_id) DO NOTHING;

-- 6. Demo AI Risk Scores
INSERT INTO risk_scores (risk_id, work_id, risk_score, risk_level, delay_probability, expected_delay_days, feature_contributions)
VALUES
('RSK-451', 'MPL-2026-00451', 91.00, 'CRITICAL', 88.5, 140, '[{"feature": "Cross-Scheme Asset Proximity", "weight": 35}, {"feature": "Progress-Spend Divergence", "weight": 30}, {"feature": "Vendor HHI Concentration", "weight": 25}, {"feature": "Geotag Variance", "weight": 10}]'::jsonb),
('RSK-102', 'MPL-2026-00102', 88.00, 'CRITICAL', 92.0, 180, '[{"feature": "Progress-Spend Divergence (88% spent vs 20% progress)", "weight": 45}, {"feature": "Past Completion Delays", "weight": 30}, {"feature": "Vendor Risk Flag", "weight": 25}]'::jsonb),
('RSK-131', 'MPL-2026-04131', 82.00, 'CRITICAL', 78.0, 110, '[{"feature": "Jal Jeevan Mission Overlap (32m)", "weight": 40}, {"feature": "Rate Variance vs DSR", "weight": 30}, {"feature": "Voucher Velocity", "weight": 30}]'::jsonb),
('RSK-984', 'MPL-2026-02984', 79.00, 'HIGH', 84.0, 125, '[{"feature": "PMGSY Proximity Overlap (75m)", "weight": 40}, {"feature": "Physical Milestones Missed", "weight": 35}, {"feature": "Cost Variation", "weight": 25}]'::jsonb),
('RSK-271', 'MPL-2026-01271', 74.00, 'HIGH', 76.0, 95, '[{"feature": "March Rush Sanction Surge (Sanctioned March 29)", "weight": 50}, {"feature": "Progress-Spend Gap", "weight": 30}, {"feature": "Inspection Delay", "weight": 20}]'::jsonb),
('RSK-044', 'MPL-2026-01044', 28.00, 'LOW', 15.0, 0, '[{"feature": "Normal Milestone Progression", "weight": 40}, {"feature": "Verified Vendor", "weight": 35}, {"feature": "Balanced Fund Flow", "weight": 25}]'::jsonb),
('RSK-880', 'MPL-2026-01880', 12.00, 'LOW', 5.0, 0, '[{"feature": "Completed Ahead of Schedule", "weight": 50}, {"feature": "100% UC Reconciled", "weight": 50}]'::jsonb),
('RSK-317', 'MPL-2026-00317', 15.00, 'LOW', 8.0, 0, '[{"feature": "Clean Physical Completion", "weight": 60}, {"feature": "Exact Geotag Verified", "weight": 40}]'::jsonb)
ON CONFLICT (risk_id) DO NOTHING;

-- 7. Demo AI Anomaly Scores
INSERT INTO anomaly_scores (anomaly_id, work_id, anomaly_type, severity, ai_confidence, detected_value, expected_value, deviation, review_status)
VALUES
('ANOM-2026-001', 'MPL-2026-00451', 'Geospatial Overlap', 'CRITICAL', 94.0, 'Overlap with Smart City SCM-0842', 'Unique Geo-fence', '48m distance delta', 'Open'),
('ANOM-2026-002', 'MPL-2026-00102', 'Progress Mismatch', 'CRITICAL', 96.5, '88% fund spent', 'Expected <30% for 20% progress', '+58% divergence', 'Open'),
('ANOM-2026-003', 'MPL-2026-04131', 'Cross-Scheme Duplication', 'CRITICAL', 91.2, 'Double funding JJM-2918', 'Unique Water Asset', '32m proximity overlap', 'Open'),
('ANOM-2026-004', 'MPL-2026-01271', 'March Rush Surge', 'HIGH', 89.0, 'Sanctioned 29-March', 'Uniform Year Sanction', 'Last 48h of Financial Year', 'Under Review'),
('ANOM-2026-005', 'MPL-2026-02984', 'Contractor Concentration', 'HIGH', 87.5, 'HHI Index: 3840 (Monopoly)', 'HHI < 2500 Normal', '+1340 points above competitive cap', 'Under Review')
ON CONFLICT (anomaly_id) DO NOTHING;
