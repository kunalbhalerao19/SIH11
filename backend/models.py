"""
Pydantic Schemas for MPLADS FastAPI Backend.
Strict type checking and data validation.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class WorkBase(BaseModel):
    work_id: str
    financial_year: str
    work_name: str
    work_description: Optional[str] = None
    sector_code: str
    state_code: str
    district_code: str
    constituency_code: str
    mp_id: str
    implementing_agency_id: str
    recommendation_date: Optional[str] = None
    sanction_date: Optional[str] = None
    expected_completion_date: Optional[str] = None
    actual_completion_date: Optional[str] = None
    recommended_cost: float = Field(default=0.0, ge=0.0)
    sanctioned_cost: float = Field(default=0.0, ge=0.0)
    cumulative_fund_released: float = Field(default=0.0, ge=0.0)
    cumulative_expenditure: float = Field(default=0.0, ge=0.0)
    physical_progress_percent: float = Field(default=0.0, ge=0.0, le=100.0)
    work_status: str
    contractor_name: Optional[str] = None
    contractor_id: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_geotag_verified: bool = False
    has_photo_evidence: bool = False
    source_report: str = "DEMO DATA - NOT OFFICIAL MPLADS DATA"
    source_url: str = "https://mplads.gov.in"
    data_version: str = "v1.0-2026"
    last_updated: Optional[str] = None


class PaginatedWorksResponse(BaseModel):
    total: int
    page: int
    per_page: int
    records: List[WorkBase]


class DashboardSummary(BaseModel):
    total_works_recommended: int
    total_works_sanctioned: int
    total_works_completed: int
    total_works_ongoing: int
    total_funds_released_crore: float
    total_expenditure_crore: float
    overall_utilization_percent: float
    high_risk_works_count: int
    anomalies_detected_count: int
    data_classification: str = "DEMO DATA - NOT OFFICIAL MPLADS DATA"


class RiskPredictionResponse(BaseModel):
    work_id: str
    risk_score: float
    risk_level: str  # 'LOW' (0-39), 'MEDIUM' (40-69), 'HIGH' (70-100)
    delay_probability: float
    expected_delay_days: int
    cost_overrun_risk_percent: float
    contributing_factors: List[Dict[str, Any]]
    model_version: str
    is_sufficient_historical_data: bool
    status_note: str


class AnomalyItem(BaseModel):
    anomaly_id: str
    work_id: str
    work_name: str
    anomaly_type: str
    severity: str
    ai_confidence: float
    detected_value: str
    expected_value: str
    deviation: str
    review_status: str
    recommendation: str


class PriorityScoreItem(BaseModel):
    district_code: str
    district_name: str
    sector_code: str
    sector_name: str
    development_priority_score: float
    is_prototype_score: bool
    weights_breakdown: Dict[str, float]


class SearchRequest(BaseModel):
    query: str
    state_code: Optional[str] = None
    max_results: int = 10


class SearchResponse(BaseModel):
    query: str
    detected_intent: str
    generated_filter_summary: str
    total_matches: int
    results: List[Dict[str, Any]]
    is_allowlisted_execution: bool = True
