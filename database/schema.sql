-- ==============================================================================
-- MPLADS INTELLIGENCE & MONITORING PLATFORM (SIH 2026)
-- Database: PostgreSQL 15+ with PostGIS Extension
-- Schema DDL: Reference, Operational, Analytics & Governance Tables
-- ==============================================================================

-- Enable PostGIS if available (for spatial GIS proximity queries)
CREATE EXTENSION IF NOT EXISTS postgis;

-- ------------------------------------------------------------------------------
-- 1. REFERENCE TABLES (Real LGD / ECI Codes)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS states (
    state_code VARCHAR(10) PRIMARY KEY, -- LGD / ISO State Code (e.g., 'IN-MH', '27')
    state_name VARCHAR(100) NOT NULL,
    state_type VARCHAR(20) DEFAULT 'STATE', -- 'STATE' or 'UT'
    total_lok_sabha_seats INTEGER DEFAULT 0,
    total_rajya_sabha_seats INTEGER DEFAULT 0,
    lgd_code VARCHAR(10),
    source_report VARCHAR(255) DEFAULT 'LGD Official Reference',
    source_url VARCHAR(500) DEFAULT 'https://lgdirectory.gov.in',
    source_file VARCHAR(255) DEFAULT 'lgd_states.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS districts (
    district_code VARCHAR(20) PRIMARY KEY, -- LGD District Code (e.g., 'MH-PUN', '490')
    state_code VARCHAR(10) NOT NULL REFERENCES states(state_code) ON DELETE CASCADE,
    district_name VARCHAR(100) NOT NULL,
    lgd_code VARCHAR(10),
    headquarters VARCHAR(100),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    source_report VARCHAR(255) DEFAULT 'LGD Official Reference',
    source_url VARCHAR(500) DEFAULT 'https://lgdirectory.gov.in',
    source_file VARCHAR(255) DEFAULT 'lgd_districts.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS constituencies (
    constituency_code VARCHAR(20) PRIMARY KEY, -- ECI Code (e.g., 'MH-34', 'ECI-27-34')
    state_code VARCHAR(10) NOT NULL REFERENCES states(state_code) ON DELETE CASCADE,
    district_code VARCHAR(20) REFERENCES districts(district_code) ON DELETE SET NULL,
    constituency_name VARCHAR(100) NOT NULL,
    house_type VARCHAR(20) NOT NULL, -- 'LOK_SABHA' or 'RAJYA_SABHA'
    reservation_category VARCHAR(10) DEFAULT 'GEN', -- 'GEN', 'SC', 'ST'
    eci_code VARCHAR(20),
    source_report VARCHAR(255) DEFAULT 'ECI Delimitation Reference',
    source_url VARCHAR(500) DEFAULT 'https://eci.gov.in',
    source_file VARCHAR(255) DEFAULT 'eci_constituencies.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
    mp_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    house VARCHAR(20) NOT NULL, -- 'LOK_SABHA' or 'RAJYA_SABHA'
    state_code VARCHAR(10) NOT NULL REFERENCES states(state_code),
    constituency_code VARCHAR(20) REFERENCES constituencies(constituency_code),
    party VARCHAR(100) DEFAULT 'Independent',
    term_start DATE,
    term_end DATE,
    tenure_years NUMERIC(4,1) DEFAULT 5.0,
    is_active BOOLEAN DEFAULT TRUE,
    source_report VARCHAR(255) DEFAULT 'DEMO DATA - NOT OFFICIAL MPLADS DATA',
    source_url VARCHAR(500) DEFAULT 'https://sansad.in',
    source_file VARCHAR(255) DEFAULT 'sansad_mps.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sectors (
    sector_code VARCHAR(20) PRIMARY KEY,
    sector_name VARCHAR(100) NOT NULL,
    description TEXT,
    priority_weight NUMERIC(4,2) DEFAULT 1.0,
    is_core_development BOOLEAN DEFAULT TRUE,
    source_report VARCHAR(255) DEFAULT 'MPLADS Guidelines 2023 Scheme Codes',
    source_url VARCHAR(500) DEFAULT 'https://mplads.gov.in',
    source_file VARCHAR(255) DEFAULT 'sector_master.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agencies (
    agency_id VARCHAR(50) PRIMARY KEY,
    agency_name VARCHAR(200) NOT NULL,
    agency_type VARCHAR(50) NOT NULL, -- 'DRDA', 'PWD', 'Zilla Parishad', 'Municipal Corporation'
    state_code VARCHAR(10) NOT NULL REFERENCES states(state_code),
    district_code VARCHAR(20) REFERENCES districts(district_code),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(50),
    source_report VARCHAR(255) DEFAULT 'DEMO DATA - NOT OFFICIAL MPLADS DATA',
    source_url VARCHAR(500) DEFAULT 'https://mplads.gov.in',
    source_file VARCHAR(255) DEFAULT 'agencies_master.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. OPERATIONAL TABLES (Row-Level Works, Releases, Expenditures, Progress)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS works (
    work_id VARCHAR(50) PRIMARY KEY,
    financial_year VARCHAR(10) NOT NULL, -- e.g. '2024-25'
    work_name VARCHAR(500) NOT NULL,
    work_description TEXT,
    sector_code VARCHAR(20) NOT NULL REFERENCES sectors(sector_code),
    state_code VARCHAR(10) NOT NULL REFERENCES states(state_code),
    district_code VARCHAR(20) NOT NULL REFERENCES districts(district_code),
    constituency_code VARCHAR(20) NOT NULL REFERENCES constituencies(constituency_code),
    mp_id VARCHAR(50) NOT NULL REFERENCES members(mp_id),
    implementing_agency_id VARCHAR(50) NOT NULL REFERENCES agencies(agency_id),
    recommendation_date DATE,
    sanction_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    recommended_cost NUMERIC(15,2) DEFAULT 0.00, -- in INR Lakhs
    sanctioned_cost NUMERIC(15,2) NOT NULL DEFAULT 0.00, -- in INR Lakhs
    cumulative_fund_released NUMERIC(15,2) NOT NULL DEFAULT 0.00, -- in INR Lakhs
    cumulative_expenditure NUMERIC(15,2) NOT NULL DEFAULT 0.00, -- in INR Lakhs
    unspent_balance NUMERIC(15,2) GENERATED ALWAYS AS (cumulative_fund_released - cumulative_expenditure) STORED,
    physical_progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    work_status VARCHAR(30) NOT NULL DEFAULT 'Recommended', -- 'Recommended', 'Sanctioned', 'Ongoing', 'Completed', 'Delayed', 'Non-Progress'
    contractor_name VARCHAR(200),
    contractor_pan_masked VARCHAR(20),
    contractor_id VARCHAR(50),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    location_geotag_verified BOOLEAN DEFAULT FALSE,
    has_photo_evidence BOOLEAN DEFAULT FALSE,
    evidence_phash VARCHAR(64),
    -- Source Tracking Columns (Critical Constraint)
    source_report VARCHAR(255) NOT NULL DEFAULT 'DEMO DATA - NOT OFFICIAL MPLADS DATA',
    source_url VARCHAR(500) DEFAULT 'https://mplads.gov.in',
    source_file VARCHAR(255) DEFAULT 'synthetic_works_2026.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_progress_range CHECK (physical_progress_percent >= 0.00 AND physical_progress_percent <= 100.00),
    CONSTRAINT check_financial_non_negative CHECK (sanctioned_cost >= 0.00 AND cumulative_fund_released >= 0.00 AND cumulative_expenditure >= 0.00)
);

CREATE TABLE IF NOT EXISTS fund_releases (
    release_id VARCHAR(50) PRIMARY KEY,
    work_id VARCHAR(50) NOT NULL REFERENCES works(work_id) ON DELETE CASCADE,
    financial_year VARCHAR(10) NOT NULL,
    installment_number INTEGER NOT NULL DEFAULT 1,
    release_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00, -- in INR Lakhs
    release_date DATE NOT NULL,
    sanction_order_number VARCHAR(100),
    disbursing_authority VARCHAR(150),
    source_report VARCHAR(255) NOT NULL DEFAULT 'DEMO DATA - NOT OFFICIAL MPLADS DATA',
    source_url VARCHAR(500) DEFAULT 'https://mplads.gov.in',
    source_file VARCHAR(255) DEFAULT 'synthetic_releases_2026.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_release_amount_positive CHECK (release_amount >= 0.00)
);

CREATE TABLE IF NOT EXISTS expenditures (
    expenditure_id VARCHAR(50) PRIMARY KEY,
    work_id VARCHAR(50) NOT NULL REFERENCES works(work_id) ON DELETE CASCADE,
    voucher_number VARCHAR(100),
    payment_date DATE NOT NULL,
    expenditure_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00, -- in INR Lakhs
    payee_vendor_name VARCHAR(200),
    payee_account_masked VARCHAR(50),
    utilization_certificate_number VARCHAR(100),
    uc_submission_date DATE,
    source_report VARCHAR(255) NOT NULL DEFAULT 'DEMO DATA - NOT OFFICIAL MPLADS DATA',
    source_url VARCHAR(500) DEFAULT 'https://mplads.gov.in',
    source_file VARCHAR(255) DEFAULT 'synthetic_expenditures_2026.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_expenditure_amount_positive CHECK (expenditure_amount >= 0.00)
);

CREATE TABLE IF NOT EXISTS work_progress (
    progress_id VARCHAR(50) PRIMARY KEY,
    work_id VARCHAR(50) NOT NULL REFERENCES works(work_id) ON DELETE CASCADE,
    inspection_date DATE NOT NULL,
    reported_stage VARCHAR(100) NOT NULL, -- 'Foundation', 'Structure', 'Finishing', 'Complete'
    physical_progress_percent NUMERIC(5,2) NOT NULL,
    inspecting_officer VARCHAR(150),
    photo_count INTEGER DEFAULT 0,
    remarks TEXT,
    source_report VARCHAR(255) NOT NULL DEFAULT 'DEMO DATA - NOT OFFICIAL MPLADS DATA',
    source_url VARCHAR(500) DEFAULT 'https://mplads.gov.in',
    source_file VARCHAR(255) DEFAULT 'synthetic_progress_2026.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS citizen_suggestions (
    suggestion_id VARCHAR(50) PRIMARY KEY,
    state_code VARCHAR(10) NOT NULL REFERENCES states(state_code),
    district_code VARCHAR(20) NOT NULL REFERENCES districts(district_code),
    constituency_code VARCHAR(20) REFERENCES constituencies(constituency_code),
    suggested_work_title VARCHAR(300) NOT NULL,
    sector_code VARCHAR(20) REFERENCES sectors(sector_code),
    citizen_name VARCHAR(100),
    citizen_phone_masked VARCHAR(20),
    submission_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Submitted', -- 'Submitted', 'Forwarded_to_MP', 'Recommended', 'Rejected'
    mp_action_remarks TEXT,
    source_report VARCHAR(255) NOT NULL DEFAULT 'DEMO DATA - NOT OFFICIAL MPLADS DATA',
    source_url VARCHAR(500) DEFAULT 'https://mplads.gov.in',
    source_file VARCHAR(255) DEFAULT 'synthetic_suggestions_2026.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS district_indicators (
    indicator_id VARCHAR(50) PRIMARY KEY,
    district_code VARCHAR(20) NOT NULL REFERENCES districts(district_code),
    financial_year VARCHAR(10) NOT NULL,
    population_census NUMERIC(12,0),
    literacy_rate NUMERIC(5,2),
    backwardness_index NUMERIC(5,2), -- e.g., NITI Aayog Aspirational District Score
    is_aspirational_district BOOLEAN DEFAULT FALSE,
    sc_st_population_percent NUMERIC(5,2),
    source_report VARCHAR(255) DEFAULT 'EXTERNAL GOVT DATA (NITI Aayog / Census)',
    source_url VARCHAR(500) DEFAULT 'https://niti.gov.in',
    source_file VARCHAR(255) DEFAULT 'aspirational_districts.json',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. AI & ANALYTICS DERIVED TABLES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS risk_scores (
    risk_id VARCHAR(50) PRIMARY KEY,
    work_id VARCHAR(50) NOT NULL UNIQUE REFERENCES works(work_id) ON DELETE CASCADE,
    risk_score NUMERIC(5,2) NOT NULL, -- 0 to 100
    risk_level VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    delay_probability NUMERIC(5,2), -- 0 to 100%
    expected_delay_days INTEGER DEFAULT 0,
    cost_overrun_risk NUMERIC(5,2) DEFAULT 0.00,
    feature_contributions JSONB, -- SHAP-style breakdown: [{"feature": "Fund Gap", "weight": 35}]
    model_version VARCHAR(50) DEFAULT 'RandomForest-DelayPredictor-v1.4',
    source_report VARCHAR(255) NOT NULL DEFAULT 'AI-GENERATED OUTPUT - PROTOTYPE PREDICTION',
    source_url VARCHAR(500) DEFAULT 'internal://ai-engine',
    source_file VARCHAR(255) DEFAULT 'risk_inference.py',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anomaly_scores (
    anomaly_id VARCHAR(50) PRIMARY KEY,
    work_id VARCHAR(50) NOT NULL REFERENCES works(work_id) ON DELETE CASCADE,
    anomaly_type VARCHAR(100) NOT NULL, -- 'Progress Mismatch', 'March Rush Surge', 'Contractor Concentration', 'Geospatial Overlap'
    severity VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    ai_confidence NUMERIC(5,2) NOT NULL,
    detected_value VARCHAR(255),
    expected_value VARCHAR(255),
    deviation VARCHAR(100),
    review_status VARCHAR(30) DEFAULT 'Open', -- 'Open', 'Under Review', 'Verified', 'False Positive'
    assigned_officer VARCHAR(150),
    audit_notes TEXT,
    source_report VARCHAR(255) NOT NULL DEFAULT 'AI-GENERATED OUTPUT - PROTOTYPE PREDICTION',
    source_url VARCHAR(500) DEFAULT 'internal://ai-engine',
    source_file VARCHAR(255) DEFAULT 'anomaly_isolation_forest.py',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS priority_scores (
    priority_id VARCHAR(50) PRIMARY KEY,
    district_code VARCHAR(20) NOT NULL REFERENCES districts(district_code),
    sector_code VARCHAR(20) NOT NULL REFERENCES sectors(sector_code),
    development_priority_score NUMERIC(5,2) NOT NULL, -- 0 to 100
    formula_weights_breakdown JSONB, -- {"aspirational_index": 30, "sc_st_need": 25, "infrastructure_gap": 25, "citizen_demand": 20}
    is_prototype_score BOOLEAN DEFAULT TRUE,
    source_report VARCHAR(255) NOT NULL DEFAULT 'AI-GENERATED OUTPUT - PROTOTYPE PREDICTION',
    source_url VARCHAR(500) DEFAULT 'internal://ai-engine',
    source_file VARCHAR(255) DEFAULT 'priority_scoring.py',
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 4. DATA GOVERNANCE, AUDIT & ETL TRACKING TABLES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS data_sources (
    source_id VARCHAR(50) PRIMARY KEY,
    source_name VARCHAR(150) NOT NULL,
    source_category VARCHAR(50) NOT NULL, -- 'OFFICIAL MPLADS DATA', 'EXTERNAL GOVERNMENT DATA', 'DEMO DATA', 'AI-GENERATED OUTPUT'
    description TEXT,
    update_frequency VARCHAR(50), -- 'Real-time', 'Daily', 'Monthly', 'Static Prototype'
    connector_module VARCHAR(100),
    is_active BOOLEAN DEFAULT FALSE,
    notes_and_caveats TEXT,
    last_ingested_at TIMESTAMP WITH TIME ZONE,
    source_report VARCHAR(255) DEFAULT 'System Governance Registry',
    source_url VARCHAR(500),
    source_file VARCHAR(255),
    data_version VARCHAR(50) DEFAULT 'v1.0-2026',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS data_quality_errors (
    error_id VARCHAR(50) PRIMARY KEY,
    run_id VARCHAR(50),
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(100),
    rule_violated VARCHAR(150) NOT NULL,
    error_description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'WARNING', -- 'INFO', 'WARNING', 'CRITICAL'
    raw_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS extraction_runs (
    run_id VARCHAR(50) PRIMARY KEY,
    connector_name VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL, -- 'STARTED', 'COMPLETED', 'FAILED', 'PARTIAL'
    records_extracted INTEGER DEFAULT 0,
    records_validated INTEGER DEFAULT 0,
    records_loaded INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    execution_duration_seconds NUMERIC(8,2),
    log_message TEXT
);

-- ------------------------------------------------------------------------------
-- 5. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_works_work_id ON works(work_id);
CREATE INDEX IF NOT EXISTS idx_works_financial_year ON works(financial_year);
CREATE INDEX IF NOT EXISTS idx_works_mp_id ON works(mp_id);
CREATE INDEX IF NOT EXISTS idx_works_state_code ON works(state_code);
CREATE INDEX IF NOT EXISTS idx_works_district_code ON works(district_code);
CREATE INDEX IF NOT EXISTS idx_works_constituency_code ON works(constituency_code);
CREATE INDEX IF NOT EXISTS idx_works_sector_code ON works(sector_code);
CREATE INDEX IF NOT EXISTS idx_works_work_status ON works(work_status);
CREATE INDEX IF NOT EXISTS idx_works_implementing_agency ON works(implementing_agency_id);

CREATE INDEX IF NOT EXISTS idx_fund_releases_work_id ON fund_releases(work_id);
CREATE INDEX IF NOT EXISTS idx_expenditures_work_id ON expenditures(work_id);
CREATE INDEX IF NOT EXISTS idx_work_progress_work_id ON work_progress(work_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_work_id ON risk_scores(work_id);
CREATE INDEX IF NOT EXISTS idx_anomaly_scores_work_id ON anomaly_scores(work_id);
