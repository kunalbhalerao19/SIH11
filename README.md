# 🏛️ MPLADS AI Insight — AI Sentinel Platform

> **Smart India Hackathon 2026 — Problem Statement 26102**  
> **Theme:** Smart Governance & Public Financial Oversight  
> **Ministry:** Ministry of Statistics and Programme Implementation (MoSPI)  
> **Developed by:** Team Sentinel (Lead: Kunal Bhalerao)

[![SIH 2026](https://img.shields.io/badge/SIH-2026%20Submission-003580?style=for-the-badge&logo=gov.uk)](https://sih.gov.in)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Problem Overview

Under the **MPLAD Scheme**, Hon'ble Members of Parliament recommend local development works totaling **₹5 Crore per MP annually** (~₹8,300+ Cr nationwide across the 18th Lok Sabha & Rajya Sabha). However, conventional monitoring systems suffer from critical blind spots:

1. **Expenditure vs. Physical Progress Disparity:** Multi-crore disbursements made while physical progress on site remains stalled.
2. **Cross-Scheme Double Funding:** Same infrastructure asset (e.g. rural roads, community halls, water pumps) claimed under both MPLADS and central schemes like **PMGSY**, **Jal Jeevan Mission**, or **Smart Cities**.
3. **Photographic & Geotag Tampering:** Reused stock photos or photos clicked miles away from the actual project site.
4. **Contractor Monopolies & Split-Tendering:** Artificially breaking large works into sub-₹25L packages to bypass open e-tendering.
5. **Black-Box Alert Fatigue:** Alerts without explainable attribution or audit trails.

---

## ⚠️ Data Limitations & Governance Notice

> [!IMPORTANT]
> **CRITICAL DATA NOTICE**: As of 2026, **no confirmed public bulk CSV or unauthenticated REST API exists for row-level MPLADS works**. The official portal (`mplads.mospi.gov.in`, "eSAKSHI") is a session-gated, role-based operational transaction system for nodal officers, and does not provide pre-2023 historical records.

### Verified vs. Synthetic Data Matrix

| Domain / Table | Source Classification | Status | Description |
| :--- | :--- | :--- | :--- |
| **States & UTs** | `EXTERNAL GOVERNMENT DATA` | **Verified** | Official Local Government Directory (LGD) State Codes & Names. |
| **Districts & PCs** | `EXTERNAL GOVERNMENT DATA` | **Verified** | Official LGD District Codes & Election Commission of India (ECI) Delimitation Codes. |
| **Master Sectors** | `EXTERNAL GOVERNMENT DATA` | **Verified** | Official MoSPI 2023 MPLADS Guideline Scheme Classification Codes. |
| **Row-Level Works** | `DEMO DATA` | **Synthetic Seed** | Generated via `etl/connectors/demo_generator.py`. Every record carries `source_report = "DEMO DATA - NOT OFFICIAL MPLADS DATA"`. |
| **Releases & Vouchers** | `DEMO DATA` | **Synthetic Seed** | Deterministic synthetic financial ledgers for test-bed demonstration. |
| **AI Risk & Anomalies** | `AI-GENERATED OUTPUT` | **Prototype Inferences** | Phrased strictly as *"Potential anomaly requiring official verification"*, never legal determinations of fraud. |

### How to Connect Official eSAKSHI Data Once Authorized
1. Obtain official OAuth2 API client credentials from MoSPI.
2. Configure `ESAKSHI_API_URL` and `ESAKSHI_API_KEY` in server environment variables.
3. Open `etl/connectors/esakshi.py`, complete the documented human-verification checklist, and toggle `IS_ENABLED = True`.

---

## 💡 System Architecture: The 11-Stage Sentinel Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              11-STAGE SENTINEL WORKFLOW                                 │
│                                                                                         │
│  Data Sources ➔ ETL & Storage ➔ 6 AI Sub-Modules ➔ Multi-Modal Evidence Fusion ➔        │
│  Risk Scoring (0-100) ➔ Priority Triage ➔ Officer Dashboard ➔ Citizen QR Verification ➔│
│  Cross-Scheme Duplication ➔ Continuous Feedback Loop ➔ Recovery & Action Enforcement   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

Detailed technical specs are available in:
- 📖 [Technical Architecture Documentation](docs/architecture.md)
- 🗄️ [Complete Data Dictionary & Schema](docs/data_dictionary.md)

---

## 🧠 The 6 AI / Analytics Sub-Modules

| # | AI Engine | Methodology & Signals | Phrasing / Confidence |
|---|---|---|---|
| 1 | **Financial Anomaly** | Benford's Law analysis, "March Rush" payment velocity surges, cost deviation vs sector norms | Review Indicator |
| 2 | **Photo & CV Verification** | Client-Side Perceptual Difference Hashing (dHash) for duplicate detection, EXIF GPS delta vs site (>100m flag) | Real Computed Delta |
| 3 | **Geospatial Intelligence** | Boundary coordinate validation, spatial density clustering, duplicate asset proximity search (<100m buffer) | Proximity Buffer |
| 4 | **Vendor & Cartels** | Herfindahl-Hirschman Index (HHI > 2500 monopoly flag), split-tender detection, price benchmarking vs CPWD DSR rates | Market Concentration |
| 5 | **Document Intelligence** | OCR extraction from DPR, Sanction Orders & UCs; invoice-to-sanction reconciliation | Verification Flag |
| 6 | **Progress & Timeline** | S-Curve milestone tracking, progress-expenditure gap divergence, delay velocity | Milestone Gap |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+) & npm
- Python 3.10+ (for FastAPI & ETL pipeline)
- PostgreSQL 15+ with PostGIS (optional for local DB container)

### 1. Frontend Setup (React 19 + TypeScript + Vite)

```bash
cd mplads-ai-insight
npm install
npm run dev
```
Client runs at **`http://localhost:5173/`**.

### 2. Backend & ETL Setup (FastAPI)

```bash
cd mplads-ai-insight
pip install fastapi uvicorn pydantic httpx pytest

# Run Python Unit Tests
python3 -m pytest tests/ -v

# Start FastAPI server
uvicorn backend.main:app --reload --port 8000
```
Interactive Swagger API docs at **`http://localhost:8000/docs`**.

### 3. Database Ingestion (PostgreSQL DDL)

```bash
# Apply schema and reference seeds
psql -U postgres -d mplads_db -f database/schema.sql
psql -U postgres -d mplads_db -f database/seed_reference.sql
psql -U postgres -d mplads_db -f database/seed_demo.sql
```

---

## 📂 Project Repository Layout

```text
mplads-ai-insight/
├── backend/              # FastAPI Backend (Endpoints, AI Inference, Allowlisted Search)
│   ├── main.py           # REST API Routes (/api/works, /api/dashboard, /api/ai)
│   ├── models.py         # Pydantic Schemas
│   ├── db.py             # Parameterized Query Service
│   ├── ai_service.py     # Random Forest Delay Predictor & Isolation Forest Anomalies
│   └── search_service.py # Safe Allowlisted Natural Language Search
├── database/             # PostgreSQL + PostGIS Schemas & Seeds
│   ├── schema.sql        # 17 Tables with Source Tracking & Indexes
│   ├── seed_reference.sql# Real LGD & ECI Reference Masters
│   └── seed_demo.sql     # Synthetic Seed Dataset (source_report tagged)
├── docs/                 # Platform Engineering Documentation
│   ├── architecture.md   # Three-Tier Technical Architecture & Security
│   └── data_dictionary.md# Complete Table-by-Table Column Catalog
├── etl/                  # Modular ETL Data Pipeline
│   ├── connectors/       # eSAKSHI (Gated), Data.gov.in (OGD), Demo Generator
│   ├── cleaners/         # Normalizer & Deduplicator
│   ├── validators/       # Business Rules & Error Logging (data_quality_errors)
│   ├── feature_engineering/# Derived Metrics (NULLIF-guarded) & Priority Scoring
│   └── pipelines/        # 10-Stage Main ETL Pipeline
├── src/                  # React 19 Frontend Application
│   ├── components/       # UI Library, TopBar, Sidebar, Leaflet Map, Evidence Modal
│   ├── context/          # AuthContext, LanguageContext (i18n), ToastContext
│   ├── pages/            # 19 Views (Dashboard, Sector Analytics, Data Sources, etc.)
│   └── types/            # TypeScript Models with Source Tracking
└── tests/                # Test Suite (Parser, Validators, Metrics, API, Search)
    ├── test_etl.py
    ├── test_metrics.py
    ├── test_search.py
    └── test_api.py
```

---

## 👥 Team Sentinel (SIH 2026)

- **Kunal Bhalerao** — Team Lead & Full-Stack / AI Architecture ([@kunalbhalerao19](https://github.com/kunalbhalerao19))
- **Team Sentinel** — Smart India Hackathon 2026

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

*Disclaimer: Developed as a prototype for Smart India Hackathon 2026. All row-level works data is synthetic demonstration data.*
