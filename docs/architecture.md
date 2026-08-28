# MPLADS Intelligence & Monitoring Platform — Technical Architecture

**Smart India Hackathon 2026 • Problem Statement 26102 (MoSPI)**  
**System Designation:** MPLADS AI Sentinel Surveillance & Decision Support Architecture

---

## 1. System Architecture Overview

The platform is designed as a three-tier, micro-modular enterprise architecture compliant with Government of India open-source and data governance standards:

```
[ Data Ingestion & ETL ]  -->  [ PostgreSQL 15 + PostGIS ]  -->  [ FastAPI & AI Engines ]  -->  [ React 19 Frontend ]
 - eSAKSHI (Gated)               - 17 Schema Tables                - Delay Predictor (RF)        - Executive Dashboard
 - Data.gov.in (OGD)             - Source Tracking Headers         - Isolation Forest            - Priority GIS Map (Leaflet)
 - Demo Generator (Synthetic)    - Spatial Proximity Indexes       - Allowlisted NL Search       - Multi-Role Portal (i18n)
```

---

## 2. Strict Data Provenance & Governance Framework

Given that **no public row-level bulk API/CSV exists for MPLADS works**, the platform maintains a rigorous 4-category classification schema:

1. **OFFICIAL MPLADS DATA (`eSAKSHI`)**:
   - Gated, real-time MoSPI operational portal.
   - Connector (`etl/connectors/esakshi.py`) is modular and **disabled by default**.
2. **EXTERNAL GOVERNMENT DATA**:
   - Real public master codes from Local Government Directory (LGD) and Election Commission of India (ECI).
   - Macro state allocations from Data.gov.in.
3. **DEMO DATA (Synthetic Ingestion)**:
   - Generated via deterministic seed algorithm (`etl/connectors/demo_generator.py`).
   - Every single record carries:
     ```json
     {
       "source_report": "DEMO DATA - NOT OFFICIAL MPLADS DATA",
       "source_url": "https://mplads.gov.in",
       "data_version": "v1.0-2026",
       "last_updated": "2026-08-28T..."
     }
     ```
4. **AI-GENERATED OUTPUT**:
   - Model predictions labeled as prototype estimations. Output is strictly phrased as `"requires review"`, never confirming misconduct.

---

## 3. End-to-End ETL Pipeline

The ETL subsystem (`etl/pipelines/main_pipeline.py`) follows a 10-stage verified flow:

```
[1. Source Connector] ➔ [2. Download] ➔ [3. Raw Storage] ➔ [4. Parser] ➔ [5. Normalizer]
       │
       ▼
[6. Deduplicator] ➔ [7. Validator] ➔ [8. Database Loader] ➔ [9. Metrics Engine] ➔ [10. ML Features]
```

### Key Business Validation Rules (`etl/validators/rules.py`):
- **Rule 1 (Bounds):** $0.00 \le \text{physical\_progress\_percent} \le 100.00$.
- **Rule 2 (Non-Negative Financials):** $\text{sanctioned\_cost} \ge 0$, $\text{cumulative\_fund\_released} \ge 0$, $\text{expenditure} \ge 0$.
- **Rule 3 (Chronological Order):** $\text{recommendation\_date} \le \text{sanction\_date} \le \text{actual\_completion\_date}$.
- **Rule 4 (Zero-Division Protection):** All formulas use strict `NULLIF` guards:
  $$\text{Fund Utilization \%} = \frac{\text{Expenditure}}{\text{NULLIF}(\text{Fund Released}, 0)} \times 100$$
  $$\text{Physical-Financial Gap} = \text{Fund Utilization \%} - \text{Physical Progress \%}$$
  $$\text{Cost Variance \%} = \frac{\text{Sanctioned Cost} - \text{Recommended Cost}}{\text{NULLIF}(\text{Recommended Cost}, 0)} \times 100$$
  $$\text{Expenditure Velocity} = \frac{\text{Expenditure}}{\text{NULLIF}(\text{Elapsed Days}, 0)}$$

---

## 4. Machine Learning & Explainable AI (XAI)

### 4.1 Delay Risk Predictor (Random Forest / Heuristic Gradient)
- Computes `delay_probability` (0–100%) and categorizes risk:
  - **LOW**: 0 – 39
  - **MEDIUM**: 40 – 69
  - **HIGH / CRITICAL**: 70 – 100
- **Data Sufficiency Fallback:** If historical milestone timestamps are missing, returns `"AI model requires more historical data"` rather than an unsupported number.

### 4.2 Multi-Modal Anomaly Detection (Isolation Forest)
- Detects multi-dimensional outliers across:
  1. *Progress Mismatch* (High expenditure with low progress).
  2. *March Rush Surge* (Disproportionate year-end sanctions).
  3. *Vendor Monopoly* ($HHI > 2500$).
  4. *Geospatial Overlap* ($<100\text{m}$ proximity to PMGSY / JJM assets).

### 4.3 Client-Side Perceptual Hash (64-bit dHash)
- HTML5 Canvas computes 64-bit gradient difference hash.
- Compares against stored evidence hashes with Hamming distance similarity ($>85\%$ triggers duplicate image flag).

---

## 5. Security & Allowlisted Natural Language Search

To protect database integrity:
- **No Unrestricted LLM-Generated SQL:** The search service (`backend/search_service.py`) strictly parses user queries into an **allowlisted parameter schema** (`state_code`, `district_code`, `sector_code`, `status`).
- Parameterized queries are executed via standard database drivers.
- All secrets (`DATABASE_URL`, `ESAKSHI_API_KEY`) reside exclusively in server-side environment variables and are never bundled in the frontend client.
