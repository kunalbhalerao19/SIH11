# MPLADS AI Insight

> **Smart India Hackathon 2026 — Problem Statement 26102**  
> *Development of an AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation.*

![MPLADS AI Insight](https://img.shields.io/badge/SIH-2026-003580?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🏛 Overview

**MPLADS AI Insight** is a government-grade monitoring and anomaly detection platform designed for the Members of Parliament Local Area Development Scheme (MPLADS). It ingests official constituency allocation records and utilizes machine learning models to detect suspicious spending velocities, expenditure-progress mismatches, cost outliers, contractor concentration patterns, and project delays.

---

## ✨ Key Features

- 🧠 **Explainable AI Risk Engine**: SHAP-style feature attribution bars for every flagged risk score (Cost Deviation, Progress Gap, Completion Delay, Payment Frequency).
- 👥 **543 Lok Sabha MPs Coverage**: Official 18th Lok Sabha allocations across all parliamentary constituencies and 36 States/UTs (~₹8,320 Cr tracked).
- 📊 **Executive Dashboard**: Real-time KPI summaries, year-over-year fund release vs. utilization, sector distribution, and risk trend metrics.
- 🔍 **Anomaly & Fraud Detection**: Automated flags for progress-cost disparities, contractor clustering, and geographic cost outliers.
- 💰 **Fund & Scheme Monitoring**: State and MP-wise utilization tracking, unspent balance alerts, and threshold analyses.
- 🗺 **State Map & Geo Analytics**: Color-coded state matrix with multi-metric drill-down (Expenditure, Completion %, Risk, Anomalies).
- 📢 **Alert & Investigation Center**: Role-based alert triage workflow (Assign Officer, Add Investigation Notes, Mark Reviewed).
- 🌐 **Citizen Transparency Portal**: Public-facing project tracker and community grievance reporting mechanism.
- 📑 **Automated MIS Reports**: Generation and export for PDF/CSV compliance dossiers.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, React Router v7 |
| **Styling** | Tailwind CSS v4, Government of India Design System tokens |
| **Visualizations** | Recharts v3 |
| **Icons** | Lucide React |
| **Build Tooling** | Vite 8, Rolldown |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/mplads-ai-insight.git

# Navigate into the project
cd mplads-ai-insight

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will run locally at **`http://localhost:5173/`**.

### Production Build

```bash
npm run build
```

---

## ⚖️ Disclaimer

*This application was developed as a prototype for Smart India Hackathon 2026. Official allocation figures reflect public 18th Lok Sabha records. Risk scores and AI classifications are generated using demo evaluation algorithms and require official administrative verification.*
