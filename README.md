# 🏛️ MPLADS AI Insight — AI Sentinel Platform

> **Smart India Hackathon 2026 — Problem Statement 26102**  
> **Theme:** Smart Governance & Public Financial Oversight  
> **Ministry:** Ministry of Statistics and Programme Implementation (MoSPI)  
> **Developed by:** Team Sentinel (Lead: Kunal Bhalerao)

[![SIH 2026](https://img.shields.io/badge/SIH-2026%20Submission-003580?style=for-the-badge&logo=gov.uk)](https://sih.gov.in)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Problem Overview

Under the **MPLAD Scheme**, Hon'ble Members of Parliament recommend local development works totaling **₹5 Crore per MP annually** (~₹8,300+ Cr nationwide). However, conventional monitoring systems suffer from critical blind spots:

1. **Expenditure vs. Physical Progress Disparity:** Multi-crore disbursements made while physical progress on site remains stalled.
2. **Cross-Scheme Double Funding:** Same infrastructure asset (e.g. rural roads, community halls, water pumps) claimed under both MPLADS and central schemes like **PMGSY**, **Jal Jeevan Mission**, or **Smart Cities**.
3. **Photographic & Geotag Tampering:** Reused stock photos or photos clicked miles away from the actual project site.
4. **Contractor Monopolies & Split-Tendering:** Artificially breaking large works into sub-₹25L packages to bypass open e-tendering.
5. **Black-Box Alert Fatigue:** Alerts without explainable attribution or audit trails.

---

## 💡 Our Solution: MPLADS AI Sentinel

**MPLADS AI Insight** is a multi-modal, explainable AI surveillance and decision-support platform designed for MoSPI, District Collectors, and Citizens.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              11-STAGE SENTINEL WORKFLOW                                 │
│                                                                                         │
│  Data Sources ➔ ETL & Storage ➔ 6 AI Sub-Modules ➔ Multi-Modal Evidence Fusion ➔        │
│  Risk Scoring (0-100) ➔ Priority Triage ➔ Officer Dashboard ➔ Citizen QR Verification ➔│
│  Cross-Scheme Duplication ➔ Continuous Feedback Loop ➔ Recovery & Action Enforcement   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 The 6 AI / Analytics Sub-Modules

| # | AI Engine | Methodology & Signals | Sub-Score |
|---|---|---|---|
| 1 | **Financial Anomaly** | Benford's Law analysis, "March Rush" payment velocity surges, cost deviation vs sector norms | `0–100` |
| 2 | **Photo & CV Verification** | Perceptual Image Hashing (pHash) for duplicate detection, EXIF GPS delta vs site (>100m flag), CNN visual progress estimation | `0–100` |
| 3 | **Geospatial Intelligence** | Boundary coordinate validation, spatial density clustering (DBSCAN), duplicate asset proximity search (<100m buffer) | `0–100` |
| 4 | **Vendor & Cartels** | Herfindahl-Hirschman Index (HHI > 2500 monopoly flag), split-tender detection, price benchmarking vs CPWD DSR rates | `0–100` |
| 5 | **Document Intelligence** | OCR extraction from DPR, Sanction Orders & UCs; invoice-to-sanction reconciliation; pre-dated UC temporal impossibility check | `0–100` |
| 6 | **Progress & Timeline** | S-Curve milestone tracking, progress-expenditure gap divergence (e.g. 90% funds spent vs 18% progress), delay velocity | `0–100` |

---

## 📊 Authentic 18th Lok Sabha Dataset

We ingested and analyzed the complete **18th Lok Sabha official allocation dataset**:
- **543 Lok Sabha Members of Parliament** loaded across all 36 States & Union Territories.
- **₹8,320.91 Crore** tracked funds with nationwide utilization breakdown.
- **67,982 Recommended Works** & **44,873 Completed Works** monitored.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/kunalbhalerao19/SIH11.git

# 2. Navigate into the project
cd SIH11/mplads-ai-insight

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application will run at **`http://localhost:5173/`**.

### Building for Production

```bash
npm run build
```

---

## 📂 Project Structure

```text
mplads-ai-insight/
├── src/
│   ├── components/       # Reusable UI components (KPI cards, tables, badges, sidebar)
│   ├── data/             # Master dataset (543 MPs, 36 States/UTs, 42k+ works)
│   ├── lib/              # AI Engines, Evidence Fusion, Risk Math, Formatters
│   │   ├── aiModulesEngine.ts   # 6 AI sub-engines & cross-scheme detector
│   │   ├── riskEngine.ts        # SHAP-style XAI scoring & thresholds
│   │   └── utils.ts             # Currency (Lakhs/Cr), date & string helpers
│   ├── pages/            # 15 interactive pages (Dashboard, AI Lab, MP Analytics, etc.)
│   ├── types/            # TypeScript data models & multi-modal interfaces
│   ├── App.tsx           # React Router v7 routes configuration
│   ├── index.css         # Tailwind v4 design tokens & government color palette
│   └── main.tsx          # React 19 root entry
├── public/               # Static assets & executive summary PDF
├── .env.example          # Environment variables template
├── .prettierrc           # Code formatting rules
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite 8 & Tailwind plugins
```

---

## 🏆 Key SIH Hackathon Highlights

- **Explainable AI (XAI):** Transparent SHAP-style waterfall attributions instead of unexplainable black-box scores.
- **Cross-Scheme Loss Prevention:** Detects overlapping funding with PMGSY, Jal Jeevan Mission, AMRUT, and Smart Cities.
- **Field Inspection Docket Generator:** 1-Click field dossier with on-site GPS verification checklist.
- **Citizen Empowerment:** QR-based ground feedback without leaking internal risk algorithms to the public.

---

## 👥 Team Sentinel (SIH 2026)

- **Kunal Bhalerao** — Team Lead & Full-Stack / AI Architecture ([@kunalbhalerao19](https://github.com/kunalbhalerao19))
- **Team Sentinel** — Smart India Hackathon 2026

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

*Disclaimer: Developed as a prototype for Smart India Hackathon 2026. Data and AI classifications are for demonstration purposes.*
