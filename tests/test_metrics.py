"""
Unit Tests for Derived Metrics and Priority Formulas.
Verifies NULLIF-guarded zero division and weight calculations.
"""

import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from etl.feature_engineering.metrics import DerivedMetricsCalculator


def test_fund_utilization_guard():
    # Normal case
    util = DerivedMetricsCalculator.calculate_fund_utilization_percent(expenditure=20.0, fund_released=25.0)
    assert util == 80.0

    # Zero release division guard test
    util_zero = DerivedMetricsCalculator.calculate_fund_utilization_percent(expenditure=20.0, fund_released=0.0)
    assert util_zero == 0.0


def test_physical_financial_gap():
    gap = DerivedMetricsCalculator.calculate_physical_financial_gap(utilization_pct=85.0, progress_pct=25.0)
    assert gap == 60.0


def test_cost_variance_guard():
    # Normal variance
    var = DerivedMetricsCalculator.calculate_cost_variance_percent(sanctioned_cost=30.0, recommended_cost=25.0)
    assert var == 20.0

    # Zero recommended cost division guard
    var_zero = DerivedMetricsCalculator.calculate_cost_variance_percent(sanctioned_cost=30.0, recommended_cost=0.0)
    assert var_zero == 0.0


def test_priority_score_calculation():
    result = DerivedMetricsCalculator.calculate_development_priority_score(
        aspirational_index=80.0,
        sc_st_percent=40.0,
        infrastructure_gap_score=70.0,
        citizen_demand_count=15
    )
    assert 0.0 <= result["priority_score"] <= 100.0
    assert "aspirational_need_contribution" in result["weights_breakdown"]
    assert result["is_prototype_score"] is True
