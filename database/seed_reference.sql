-- ==============================================================================
-- MPLADS INTELLIGENCE PLATFORM — SEED REFERENCE DATA (Real Public LGD / ECI Codes)
-- Safe to hardcode public administrative master data
-- ==============================================================================

-- 1. States & Union Territories (LGD Standard)
INSERT INTO states (state_code, state_name, state_type, total_lok_sabha_seats, total_rajya_sabha_seats, lgd_code, source_report, source_url)
VALUES
('IN-MH', 'Maharashtra', 'STATE', 48, 19, '27', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-UP', 'Uttar Pradesh', 'STATE', 80, 31, '09', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-BR', 'Bihar', 'STATE', 40, 16, '10', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-WB', 'West Bengal', 'STATE', 42, 16, '19', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-TN', 'Tamil Nadu', 'STATE', 39, 18, '33', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-MP', 'Madhya Pradesh', 'STATE', 29, 11, '23', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-KA', 'Karnataka', 'STATE', 28, 12, '29', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-GJ', 'Gujarat', 'STATE', 26, 11, '24', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-RJ', 'Rajasthan', 'STATE', 25, 10, '08', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-AP', 'Andhra Pradesh', 'STATE', 25, 11, '28', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-OR', 'Odisha', 'STATE', 21, 10, '21', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-KL', 'Kerala', 'STATE', 20, 9, '32', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-TG', 'Telangana', 'STATE', 17, 7, '36', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-AS', 'Assam', 'STATE', 14, 7, '18', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-JH', 'Jharkhand', 'STATE', 14, 6, '20', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-PB', 'Punjab', 'STATE', 13, 7, '03', 'LGD Official Reference', 'https://lgdirectory.gov.in'),
('IN-DL', 'Delhi', 'UT', 7, 3, '07', 'LGD Official Reference', 'https://lgdirectory.gov.in')
ON CONFLICT (state_code) DO NOTHING;

-- 2. Master Sectors (MPLADS Official 2023 Guidelines)
INSERT INTO sectors (sector_code, sector_name, description, priority_weight, is_core_development)
VALUES
('SEC-DRINK', 'Drinking Water Facility', 'Tubewells, RO Plants, Water Pumping & Storage Infrastructure', 1.25, TRUE),
('SEC-EDU', 'Education', 'School Buildings, Digital Classrooms, Libraries, Laboratories', 1.20, TRUE),
('SEC-HEALTH', 'Health & Family Welfare', 'Primary Health Centers, Medical Equipment, Mobile Health Vans', 1.30, TRUE),
('SEC-SAN', 'Sanitation & Public Health', 'Community Toilets, Solid Waste Plants, Drainage Networks', 1.15, TRUE),
('SEC-ROAD', 'Roads, Pathways & Bridges', 'Rural Connectivity Roads, Small Bridges, Culverts, Solar Streetlights', 1.10, TRUE),
('SEC-IRRI', 'Irrigation & Water Harvesting', 'Check Dams, Ponds Renovation, Rainwater Harvesting Structures', 1.15, TRUE),
('SEC-COMM', 'Community & Cultural Centers', 'Community Halls, Crematoriums, Old Age Centers, Sports Complexes', 0.90, FALSE),
('SEC-RENEW', 'Non-Conventional Energy', 'Solar Power Plants, Solar Street Lighting in Villages', 1.05, TRUE)
ON CONFLICT (sector_code) DO NOTHING;

-- 3. Districts (Sample Real LGD Master)
INSERT INTO districts (district_code, state_code, district_name, lgd_code, headquarters, latitude, longitude)
VALUES
('MH-PUN', 'IN-MH', 'Pune', '490', 'Pune', 18.5204, 73.8567),
('MH-SOL', 'IN-MH', 'Solapur', '505', 'Solapur', 17.6599, 75.9064),
('MH-HIN', 'IN-MH', 'Hingoli', '486', 'Hingoli', 19.7167, 77.1500),
('BR-PAT', 'IN-BR', 'Patna', '208', 'Patna', 25.5941, 85.1376),
('BR-BEG', 'IN-BR', 'Begusarai', '193', 'Begusarai', 25.4182, 86.1272),
('UP-VAR', 'IN-UP', 'Varanasi', '178', 'Varanasi', 25.3176, 82.9739),
('UP-LKO', 'IN-UP', 'Lucknow', '157', 'Lucknow', 26.8467, 80.9462),
('RJ-SIK', 'IN-RJ', 'Sikar', '101', 'Sikar', 27.6094, 75.1398),
('TN-CHE', 'IN-TN', 'Chennai', '565', 'Chennai', 13.0827, 80.2707),
('WB-KOL', 'IN-WB', 'Kolkata', '318', 'Kolkata', 22.5726, 88.3639)
ON CONFLICT (district_code) DO NOTHING;

-- 4. Sample Real Constituencies (ECI Codes)
INSERT INTO constituencies (constituency_code, state_code, district_code, constituency_name, house_type, eci_code)
VALUES
('PC-MH-34', 'IN-MH', 'MH-PUN', 'Pune', 'LOK_SABHA', '27-34'),
('PC-MH-42', 'IN-MH', 'MH-SOL', 'Solapur', 'LOK_SABHA', '27-42'),
('PC-MH-15', 'IN-MH', 'MH-HIN', 'Hingoli', 'LOK_SABHA', '27-15'),
('PC-BR-31', 'IN-BR', 'BR-PAT', 'Pataliputra', 'LOK_SABHA', '10-31'),
('PC-BR-24', 'IN-BR', 'BR-BEG', 'Begusarai', 'LOK_SABHA', '10-24'),
('PC-UP-77', 'IN-UP', 'UP-VAR', 'Varanasi', 'LOK_SABHA', '09-77'),
('PC-UP-35', 'IN-UP', 'UP-LKO', 'Lucknow', 'LOK_SABHA', '09-35'),
('PC-RJ-04', 'IN-RJ', 'RJ-SIK', 'Sikar', 'LOK_SABHA', '08-04'),
('PC-TN-04', 'IN-TN', 'TN-CHE', 'Chennai Central', 'LOK_SABHA', '33-04'),
('PC-WB-24', 'IN-WB', 'WB-KOL', 'Kolkata North', 'LOK_SABHA', '19-24')
ON CONFLICT (constituency_code) DO NOTHING;

-- 5. Master Data Governance Registry (Initial state)
INSERT INTO data_sources (source_id, source_name, source_category, description, update_frequency, connector_module, is_active, notes_and_caveats)
VALUES
('SRC-ESAKSHI-OFFICIAL', 'eSAKSHI National MPLADS Portal', 'OFFICIAL MPLADS DATA', 'Ministry of Statistics & PI operational management portal for MPLADS works recommendation and sanctioning.', 'Real-time (Gated)', 'etl.connectors.esakshi', FALSE, 'No public bulk API/CSV exists. Login-gated portal; requires verified departmental credentials. Data pre-2023 is not available in eSAKSHI.'),
('SRC-DATAGOVIN-MPLADS', 'Data.gov.in Open Data Catalog', 'EXTERNAL GOVERNMENT DATA', 'National Data Sharing & Accessibility Policy (NDSAP) catalog for aggregate state-level summaries.', 'Monthly', 'etl.connectors.datagovin', FALSE, 'Provides aggregate financial releases, not row-level asset coordinates or transaction ledgers.'),
('SRC-LGD-ECI-CODES', 'Local Government Directory & ECI', 'EXTERNAL GOVERNMENT DATA', 'Standard public codes for States, Districts, Local Bodies, and Parliamentary Constituencies.', 'Annual', 'etl.connectors.reference', TRUE, 'Public reference master dataset safely incorporated.'),
('SRC-SYNTHETIC-DEMO', 'SIH Sentinel Synthetic Generator', 'DEMO DATA', 'Deterministic algorithmic seed generator producing compliant work records, financial flows, and anomaly test cases.', 'On-demand', 'etl.connectors.demo_generator', TRUE, 'All row-level works, fund releases, and progress updates carry explicit DEMO DATA labeling.'),
('SRC-AI-RISK-MODELS', 'Sentinel ML Risk & Anomaly Engines', 'AI-GENERATED OUTPUT', 'Multi-modal ML engines: Isolation Forest, Random Forest Delay Estimator, and SHAP XAI inference.', 'Dynamic In-Memory', 'backend.ai_service', TRUE, 'Prototype scores indicating review priorities, never definitive legal determinations.')
ON CONFLICT (source_id) DO NOTHING;
