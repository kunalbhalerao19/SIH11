"""
FastAPI Backend Application for MPLADS Intelligence and Monitoring Platform.
Provides RESTful APIs for Reference Data, Works Explorer, AI Risk Scoring,
Anomalies, Priority Scoring, and Allowlisted Natural Language Search.
"""

from fastapi import FastAPI, Query, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any

from backend.models import (
    WorkBase, PaginatedWorksResponse, DashboardSummary,
    RiskPredictionResponse, AnomalyItem, PriorityScoreItem,
    SearchRequest, SearchResponse
)
from backend.db import db_service
from backend.ai_service import AISentinelService
from backend.search_service import AllowlistedSearchEngine

app = FastAPI(
    title="MPLADS AI Insight & Vigilance API",
    description="MoSPI SIH 2026 Problem Statement 26102 Prototype Backend",
    version="1.0.0"
)

# Enable CORS for frontend client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "system": "MPLADS AI Insight Sentinel API",
        "version": "1.0.0",
        "data_notice": "DEMO DATA - NOT OFFICIAL MPLADS DATA",
        "docs_url": "/docs"
    }


# ------------------------------------------------------------------------------
# 1. REFERENCE & MASTER DATA ENDPOINTS
# ------------------------------------------------------------------------------

@app.get("/api/states")
def get_states():
    """Returns official LGD states list."""
    return [
        {"state_code": "IN-MH", "state_name": "Maharashtra", "lgd_code": "27", "lok_sabha_seats": 48},
        {"state_code": "IN-UP", "state_name": "Uttar Pradesh", "lgd_code": "09", "lok_sabha_seats": 80},
        {"state_code": "IN-BR", "state_name": "Bihar", "lgd_code": "10", "lok_sabha_seats": 40},
        {"state_code": "IN-WB", "state_name": "West Bengal", "lgd_code": "19", "lok_sabha_seats": 42},
        {"state_code": "IN-TN", "state_name": "Tamil Nadu", "lgd_code": "33", "lok_sabha_seats": 39},
        {"state_code": "IN-RJ", "state_name": "Rajasthan", "lgd_code": "08", "lok_sabha_seats": 25}
    ]


@app.get("/api/districts")
def get_districts(state_code: Optional[str] = None):
    """Returns official LGD districts list."""
    districts = [
        {"district_code": "MH-PUN", "state_code": "IN-MH", "district_name": "Pune", "latitude": 18.5204, "longitude": 73.8567},
        {"district_code": "MH-SOL", "state_code": "IN-MH", "district_name": "Solapur", "latitude": 17.6599, "longitude": 75.9064},
        {"district_code": "BR-PAT", "state_code": "IN-BR", "district_name": "Patna", "latitude": 25.5941, "longitude": 85.1376},
        {"district_code": "BR-BEG", "state_code": "IN-BR", "district_name": "Begusarai", "latitude": 25.4182, "longitude": 86.1272},
        {"district_code": "UP-VAR", "state_code": "IN-UP", "district_name": "Varanasi", "latitude": 25.3176, "longitude": 82.9739},
        {"district_code": "RJ-SIK", "state_code": "IN-RJ", "district_name": "Sikar", "latitude": 27.6094, "longitude": 75.1398}
    ]
    if state_code:
        return [d for d in districts if d["state_code"].upper() == state_code.upper()]
    return districts


@app.get("/api/constituencies")
def get_constituencies(state_code: Optional[str] = None):
    """Returns ECI parliamentary constituencies."""
    pcs = [
        {"constituency_code": "PC-MH-34", "state_code": "IN-MH", "name": "Pune", "house": "LOK_SABHA"},
        {"constituency_code": "PC-MH-42", "state_code": "IN-MH", "name": "Solapur", "house": "LOK_SABHA"},
        {"constituency_code": "PC-BR-31", "state_code": "IN-BR", "name": "Pataliputra", "house": "LOK_SABHA"},
        {"constituency_code": "PC-BR-24", "state_code": "IN-BR", "name": "Begusarai", "house": "LOK_SABHA"},
        {"constituency_code": "PC-UP-77", "state_code": "IN-UP", "name": "Varanasi", "house": "LOK_SABHA"}
    ]
    if state_code:
        return [p for p in pcs if p["state_code"].upper() == state_code.upper()]
    return pcs


@app.get("/api/members")
def get_members():
    """Returns parliamentary representatives (demo)."""
    return [
        {"mp_id": "MP-MH-PUN-01", "name": "Representative Pune", "house": "LOK_SABHA", "state": "Maharashtra", "source_report": "DEMO DATA - NOT OFFICIAL MPLADS DATA"},
        {"mp_id": "MP-BR-PAT-01", "name": "Representative Pataliputra", "house": "LOK_SABHA", "state": "Bihar", "source_report": "DEMO DATA - NOT OFFICIAL MPLADS DATA"}
    ]


@app.get("/api/sectors")
def get_sectors():
    """Returns MPLADS official sector master list."""
    return [
        {"sector_code": "SEC-DRINK", "sector_name": "Drinking Water Facility"},
        {"sector_code": "SEC-EDU", "sector_name": "Education"},
        {"sector_code": "SEC-HEALTH", "sector_name": "Health & Family Welfare"},
        {"sector_code": "SEC-SAN", "sector_name": "Sanitation & Public Health"},
        {"sector_code": "SEC-ROAD", "sector_name": "Roads, Pathways & Bridges"},
        {"sector_code": "SEC-IRRI", "sector_name": "Irrigation & Water Harvesting"},
        {"sector_code": "SEC-COMM", "sector_name": "Community & Cultural Centers"},
        {"sector_code": "SEC-RENEW", "sector_name": "Non-Conventional Energy"}
    ]


@app.get("/api/agencies")
def get_agencies():
    """Returns implementing agencies registry."""
    return [
        {"agency_id": "AG-MH-PUN-01", "agency_name": "District Rural Development Agency (DRDA) Pune", "type": "DRDA"},
        {"agency_id": "AG-BR-PAT-01", "agency_name": "Patna Municipal Infrastructure Board", "type": "Municipal Corporation"}
    ]


# ------------------------------------------------------------------------------
# 2. OPERATIONAL WORKS & FINANCIAL ENDPOINTS
# ------------------------------------------------------------------------------

@app.get("/api/works", response_model=PaginatedWorksResponse)
def get_works(
    state_code: Optional[str] = Query(None, description="State Code filter (e.g., IN-MH)"),
    district_code: Optional[str] = Query(None, description="District Code filter"),
    status: Optional[str] = Query(None, description="Status filter (Completed, Ongoing, Delayed)"),
    sector_code: Optional[str] = Query(None, description="Sector code filter"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """
    Paginated, filterable works explorer endpoint.
    """
    offset = (page - 1) * per_page
    records = db_service.get_all_works(
        state_code=state_code,
        district_code=district_code,
        status=status,
        sector_code=sector_code,
        limit=per_page,
        offset=offset
    )
    total_matching = len(db_service.get_all_works(state_code, district_code, status, sector_code, limit=10000, offset=0))

    return {
        "total": total_matching,
        "page": page,
        "per_page": per_page,
        "records": records
    }


@app.get("/api/works/{work_id}", response_model=WorkBase)
def get_work_detail(work_id: str = Path(..., description="Project Work ID")):
    """
    Returns single work dossier.
    """
    work = db_service.get_work_by_id(work_id)
    if not work:
        raise HTTPException(status_code=404, detail=f"Work with ID '{work_id}' not found.")
    return work


@app.get("/api/funds")
def get_funds_summary():
    """Returns fund release allocations."""
    return {
        "financial_year": "2024-25",
        "total_entitlement_crore": 2500.0,
        "total_released_crore": 2180.50,
        "total_unreleased_crore": 319.50,
        "source_report": "DEMO DATA - NOT OFFICIAL MPLADS DATA"
    }


@app.get("/api/expenditure")
def get_expenditure_summary():
    """Returns expenditure and utilization metrics."""
    return {
        "financial_year": "2024-25",
        "total_expenditure_crore": 1890.25,
        "unspent_balance_crore": 290.25,
        "utilization_percent": 86.7,
        "source_report": "DEMO DATA - NOT OFFICIAL MPLADS DATA"
    }


# ------------------------------------------------------------------------------
# 3. EXECUTIVE DASHBOARDS (NATIONWIDE, STATE, DISTRICT, CONSTITUENCY)
# ------------------------------------------------------------------------------

@app.get("/api/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary():
    """Returns nationwide executive monitoring summary."""
    return db_service.get_dashboard_summary()


@app.get("/api/dashboard/state/{state_code}")
def get_state_dashboard(state_code: str):
    """Returns state-level performance drilldown."""
    return {
        "state_code": state_code,
        "total_works": 420,
        "completed_works": 315,
        "funds_released_crore": 180.5,
        "expenditure_crore": 162.0,
        "utilization_percent": 89.7,
        "source_report": "DEMO DATA - NOT OFFICIAL MPLADS DATA"
    }


@app.get("/api/dashboard/district/{district_code}")
def get_district_dashboard(district_code: str):
    """Returns district-level performance drilldown."""
    return {
        "district_code": district_code,
        "total_works": 85,
        "completed_works": 62,
        "active_anomalies": 2,
        "source_report": "DEMO DATA - NOT OFFICIAL MPLADS DATA"
    }


@app.get("/api/dashboard/constituency/{constituency_code}")
def get_constituency_dashboard(constituency_code: str):
    """Returns constituency-level drilldown."""
    return {
        "constituency_code": constituency_code,
        "total_works": 45,
        "completion_rate": 78.5,
        "source_report": "DEMO DATA - NOT OFFICIAL MPLADS DATA"
    }


# ------------------------------------------------------------------------------
# 4. AI & MACHINE LEARNING INFERENCE ENDPOINTS
# ------------------------------------------------------------------------------

@app.get("/api/ai/risk/{work_id}", response_model=RiskPredictionResponse)
def get_work_risk_prediction(work_id: str):
    """
    Returns AI Delay Risk prediction with contributing factor explanation.
    """
    work = db_service.get_work_by_id(work_id)
    if not work:
        # Fallback dummy record for testing
        work = {"work_id": work_id, "sanctioned_cost": 25.0, "cumulative_expenditure": 20.0, "physical_progress_percent": 30.0, "work_status": "Delayed", "sanction_date": "2024-05-01"}
    
    return AISentinelService.predict_delay_risk(work)


@app.get("/api/ai/anomalies", response_model=List[AnomalyItem])
def get_anomalies():
    """
    Returns active anomalies flagged for administrative review.
    """
    return AISentinelService.get_detected_anomalies()


@app.get("/api/ai/priorities", response_model=List[PriorityScoreItem])
def get_priority_scores():
    """
    Returns Development Priority Scores (0-100) with weighted factor breakdown.
    """
    return [
        {
            "district_code": "BR-BEG",
            "district_name": "Begusarai",
            "sector_code": "SEC-DRINK",
            "sector_name": "Drinking Water Facility",
            "development_priority_score": 88.5,
            "is_prototype_score": True,
            "weights_breakdown": {
                "aspirational_need_contribution": 28.5,
                "sc_st_need_contribution": 22.0,
                "infrastructure_gap_contribution": 23.0,
                "citizen_demand_contribution": 15.0
            }
        },
        {
            "district_code": "MH-HIN",
            "district_name": "Hingoli",
            "sector_code": "SEC-IRRI",
            "sector_name": "Irrigation & Water Harvesting",
            "development_priority_score": 82.0,
            "is_prototype_score": True,
            "weights_breakdown": {
                "aspirational_need_contribution": 25.0,
                "sc_st_need_contribution": 20.0,
                "infrastructure_gap_contribution": 22.0,
                "citizen_demand_contribution": 15.0
            }
        }
    ]


@app.get("/api/ai/forecast/{work_id}")
def get_work_forecast(work_id: str):
    """
    Time-series forecasting endpoint (disabled if insufficient historical data).
    """
    return AISentinelService.get_fund_forecast(work_id)


# ------------------------------------------------------------------------------
# 5. ALLOWLISTED NATURAL LANGUAGE SEARCH
# ------------------------------------------------------------------------------

@app.post("/api/search", response_model=SearchResponse)
def execute_natural_language_search(body: SearchRequest):
    """
    Translates natural language questions into safe, allowlisted SQL queries.
    Never executes unrestricted arbitrary SQL.
    """
    return AllowlistedSearchEngine.execute_search(body.query, max_results=body.max_results)
