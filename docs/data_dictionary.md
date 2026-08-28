# MPLADS Intelligence & Monitoring Platform — Data Dictionary

**Document Version:** 1.0 (SIH 2026 Submission)  
**Database Engine:** PostgreSQL 15+ with PostGIS  
**Data Governance Tag:** `DEMO DATA - NOT OFFICIAL MPLADS DATA` (for all row-level operations)

---

## 1. Governance & Provenance Columns (Mandatory on All Tables)

To ensure strict accountability and clear separation between real public administrative codes and synthetic operational figures, every table implements these standard source-tracking fields:

| Column Name | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `source_report` | `VARCHAR(255)` | `NO` | Name of official report or `'DEMO DATA - NOT OFFICIAL MPLADS DATA'`. |
| `source_url` | `VARCHAR(500)` | `YES` | Provenance URL (`https://mplads.gov.in`, `https://lgdirectory.gov.in`, etc.). |
| `source_file` | `VARCHAR(255)` | `YES` | Ingestion script or source payload filename. |
| `data_version` | `VARCHAR(50)` | `YES` | Schema / ingestion version string (e.g., `'v1.0-2026'`). |
| `last_updated` | `TIMESTAMP WITH TIME ZONE` | `NO` | ISO 8601 timestamp of last record update. |

---

## 2. Table Specifications

### 2.1 `states` (Administrative Reference)
- **Primary Key:** `state_code` (e.g., `'IN-MH'`)
- **Source:** Local Government Directory (LGD) Public Reference

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `state_code` | `VARCHAR(10)` | `PRIMARY KEY` | ISO / LGD state code. |
| `state_name` | `VARCHAR(100)` | `NOT NULL` | Full state/UT name. |
| `state_type` | `VARCHAR(20)` | `DEFAULT 'STATE'` | `'STATE'` or `'UT'`. |
| `total_lok_sabha_seats` | `INTEGER` | `DEFAULT 0` | Parliamentary Lok Sabha constituency count. |
| `total_rajya_sabha_seats` | `INTEGER` | `DEFAULT 0` | Rajya Sabha seat quota. |
| `lgd_code` | `VARCHAR(10)` | `NULLABLE` | Official Census / LGD state numeric identifier. |

---

### 2.2 `districts` (Administrative Reference)
- **Primary Key:** `district_code` (e.g., `'MH-PUN'`)
- **Foreign Key:** `state_code REFERENCES states(state_code)`

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `district_code` | `VARCHAR(20)` | `PRIMARY KEY` | Unique LGD district code. |
| `state_code` | `VARCHAR(10)` | `FK -> states` | Parent state code. |
| `district_name` | `VARCHAR(100)` | `NOT NULL` | Official district name. |
| `lgd_code` | `VARCHAR(10)` | `NULLABLE` | LGD district numeric code. |
| `headquarters` | `VARCHAR(100)` | `NULLABLE` | District administrative headquarters. |
| `latitude` | `NUMERIC(9,6)` | `NULLABLE` | District centroid latitude for GIS plotting. |
| `longitude` | `NUMERIC(9,6)` | `NULLABLE` | District centroid longitude for GIS plotting. |

---

### 2.3 `constituencies` (Delimitation Reference)
- **Primary Key:** `constituency_code` (e.g., `'PC-MH-34'`)
- **Foreign Key:** `state_code REFERENCES states(state_code)`, `district_code REFERENCES districts(district_code)`

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `constituency_code` | `VARCHAR(20)` | `PRIMARY KEY` | ECI Parliamentary Constituency code. |
| `state_code` | `VARCHAR(10)` | `FK -> states` | Parent state. |
| `district_code` | `VARCHAR(20)` | `FK -> districts` | Nodal district jurisdiction. |
| `constituency_name` | `VARCHAR(100)` | `NOT NULL` | ECI constituency title. |
| `house_type` | `VARCHAR(20)` | `NOT NULL` | `'LOK_SABHA'` or `'RAJYA_SABHA'`. |
| `reservation_category` | `VARCHAR(10)` | `DEFAULT 'GEN'` | `'GEN'`, `'SC'`, or `'ST'`. |
| `eci_code` | `VARCHAR(20)` | `NULLABLE` | Delimitation order code. |

---

### 2.4 `sectors` (Master Development Sectors)
- **Primary Key:** `sector_code` (e.g., `'SEC-DRINK'`)
- **Source:** MPLADS Scheme Guidelines 2023 Master Sectors

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `sector_code` | `VARCHAR(20)` | `PRIMARY KEY` | Standard sector code. |
| `sector_name` | `VARCHAR(100)` | `NOT NULL` | Sector display title (e.g., `'Drinking Water Facility'`). |
| `description` | `TEXT` | `NULLABLE` | Permissible works description. |
| `priority_weight` | `NUMERIC(4,2)` | `DEFAULT 1.0` | National development multiplier. |
| `is_core_development` | `BOOLEAN` | `DEFAULT TRUE` | Core priority flag under MoSPI guidelines. |

---

### 2.5 `works` (Operational Row-Level Asset Records)
- **Primary Key:** `work_id` (e.g., `'MPL-2026-00451'`)
- **Status:** **`DEMO DATA - NOT OFFICIAL MPLADS DATA`**

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `work_id` | `VARCHAR(50)` | `PRIMARY KEY` | Unique asset tracking identifier. |
| `financial_year` | `VARCHAR(10)` | `NOT NULL` | Financial year (e.g., `'2024-25'`). |
| `work_name` | `VARCHAR(500)` | `NOT NULL` | Sanctioned work title. |
| `sector_code` | `VARCHAR(20)` | `FK -> sectors` | Development sector classification. |
| `state_code` | `VARCHAR(10)` | `FK -> states` | State location. |
| `district_code` | `VARCHAR(20)` | `FK -> districts` | District location. |
| `constituency_code` | `VARCHAR(20)` | `FK -> constituencies` | Parliamentary constituency. |
| `mp_id` | `VARCHAR(50)` | `FK -> members` | Recommending Member of Parliament. |
| `implementing_agency_id` | `VARCHAR(50)` | `FK -> agencies` | Assigned agency (DRDA/PWD/Zilla Parishad). |
| `recommendation_date` | `DATE` | `NULLABLE` | Date recommended by MP. |
| `sanction_date` | `DATE` | `NULLABLE` | Date administrative sanction granted. |
| `expected_completion_date` | `DATE` | `NULLABLE` | Stipulated target completion. |
| `actual_completion_date` | `DATE` | `NULLABLE` | Recorded physical completion date. |
| `recommended_cost` | `NUMERIC(15,2)` | `DEFAULT 0.00` | Recommended cost in ₹ Lakhs. |
| `sanctioned_cost` | `NUMERIC(15,2)` | `CHECK >= 0.00` | Sanctioned ceiling cost in ₹ Lakhs. |
| `cumulative_fund_released` | `NUMERIC(15,2)` | `CHECK >= 0.00` | Total installment release in ₹ Lakhs. |
| `cumulative_expenditure` | `NUMERIC(15,2)` | `CHECK >= 0.00` | Total vouchers paid in ₹ Lakhs. |
| `unspent_balance` | `NUMERIC(15,2)` | `STORED` | Generated as `fund_released - expenditure`. |
| `physical_progress_percent` | `NUMERIC(5,2)` | `CHECK 0..100` | Verified physical completion (0-100%). |
| `work_status` | `VARCHAR(30)` | `NOT NULL` | `'Recommended' \| 'Sanctioned' \| 'Ongoing' \| 'Completed' \| 'Delayed' \| 'Non-Progress'`. |
| `contractor_name` | `VARCHAR(200)` | `NULLABLE` | Assigned execution contractor. |
| `contractor_id` | `VARCHAR(50)` | `NULLABLE` | Masked vendor identification code. |
| `latitude` | `NUMERIC(9,6)` | `NULLABLE` | Geotagged site latitude. |
| `longitude` | `NUMERIC(9,6)` | `NULLABLE` | Geotagged site longitude. |
| `evidence_phash` | `VARCHAR(64)` | `NULLABLE` | 64-bit client-side perceptual difference hash (dHash). |

---

### 2.6 `fund_releases` & `expenditures` (Financial Ledgers)
- **Primary Keys:** `release_id`, `expenditure_id`
- **Foreign Keys:** `work_id REFERENCES works(work_id)`

---

### 2.7 `risk_scores` & `anomaly_scores` (AI ML Inferences)
- **Primary Keys:** `risk_id`, `anomaly_id`
- **Category:** `AI-GENERATED OUTPUT`
- Phrased strictly as `"Potential anomaly requiring official verification"`, never legal determinations of fraud.
