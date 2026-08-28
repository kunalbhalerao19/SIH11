"""
Derived Metrics Engine & Feature Engineering for MPLADS Analytics.
All division operations are strictly guarded against zero division (NULLIF equivalent in Python).
"""

from typing import Dict, Any, Optional
from datetime import datetime


class DerivedMetricsCalculator:
    """
    Computes government-standard derived KPIs and ML features.
    """

    @staticmethod
    def calculate_fund_utilization_percent(expenditure: float, fund_released: float) -> float:
        """
        Formula: (Cumulative Expenditure / NULLIF(Cumulative Fund Released, 0)) * 100
        """
        if not fund_released or fund_released <= 0.0:
            return 0.0
        return round((expenditure / fund_released) * 100.0, 2)

    @staticmethod
    def calculate_physical_financial_gap(utilization_pct: float, progress_pct: float) -> float:
        """
        Formula: Fund Utilization % - Physical Progress %
        Positive gap indicates money spent faster than actual ground physical progress.
        """
        return round(utilization_pct - progress_pct, 2)

    @staticmethod
    def calculate_cost_variance_percent(sanctioned_cost: float, recommended_cost: float) -> float:
        """
        Formula: ((Sanctioned Cost - Recommended Cost) / NULLIF(Recommended Cost, 0)) * 100
        """
        if not recommended_cost or recommended_cost <= 0.0:
            return 0.0
        return round(((sanctioned_cost - recommended_cost) / recommended_cost) * 100.0, 2)

    @staticmethod
    def calculate_expenditure_velocity(expenditure: float, start_date_str: Optional[str], as_of_date_str: Optional[str] = None) -> float:
        """
        Formula: Cumulative Expenditure / NULLIF(Elapsed Days, 0) in Lakhs / Day
        """
        if not start_date_str or expenditure <= 0.0:
            return 0.0

        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
            as_of_date = datetime.strptime(as_of_date_str, "%Y-%m-%d") if as_of_date_str else datetime.utcnow()
            days = max(1, (as_of_date - start_date).days)
            return round(expenditure / days, 4)
        except Exception:
            return 0.0

    @staticmethod
    def calculate_development_priority_score(
        aspirational_index: float,
        sc_st_percent: float,
        infrastructure_gap_score: float,
        citizen_demand_count: int
    ) -> Dict[str, Any]:
        """
        Development Priority Score formula (0-100):
        - Aspirational / Backwardness Need (30%)
        - SC/ST Vulnerable Population (25%)
        - Sector Infrastructure Gap (25%)
        - Citizen Demand / Suggestion Intensity (20%)
        """
        w_asp = min(100.0, max(0.0, aspirational_index)) * 0.30
        w_scst = min(100.0, max(0.0, sc_st_percent)) * 0.25
        w_infra = min(100.0, max(0.0, infrastructure_gap_score)) * 0.25
        
        # Scale citizen demand (0 to 50 suggestions mapped to 0-100)
        demand_score = min(100.0, citizen_demand_count * 2.0)
        w_demand = demand_score * 0.20

        total_score = round(w_asp + w_scst + w_infra + w_demand, 2)

        return {
            "priority_score": total_score,
            "is_prototype_score": True,
            "weights_breakdown": {
                "aspirational_need_contribution": round(w_asp, 2),
                "sc_st_need_contribution": round(w_scst, 2),
                "infrastructure_gap_contribution": round(w_infra, 2),
                "citizen_demand_contribution": round(w_demand, 2)
            }
        }
