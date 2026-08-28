"""
Unit Tests for MPLADS ETL Pipeline: Parser, Normalizer, Deduplicator, and Validators.
"""

import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from etl.parsers.parser import RawDataParser
from etl.cleaners.normalizer import DataNormalizer
from etl.cleaners.deduplicator import DataDeduplicator
from etl.validators.rules import DataValidator


def test_json_and_csv_parser():
    json_data = '[{"work_id": "W-01", "sanctioned_cost": 25.0}]'
    parsed = RawDataParser.parse_json_payload(json_data)
    assert len(parsed) == 1
    assert parsed[0]["work_id"] == "W-01"

    csv_data = "work_id,sanctioned_cost\nW-02,15.5"
    parsed_csv = RawDataParser.parse_csv_stream(csv_data)
    assert len(parsed_csv) == 1
    assert parsed_csv[0]["work_id"] == "W-02"


def test_data_normalizer():
    raw_record = {
        "work_id": "  MPL-001  ",
        "recommendation_date": "15/04/2024",
        "sanctioned_cost": "₹ 25,00,000.00",
        "physical_progress_percent": 150.0,  # Out of bounds test
    }
    normalized = DataNormalizer.normalize_work_record(raw_record)
    assert normalized["work_id"] == "MPL-001"
    assert normalized["recommendation_date"] == "2024-04-15"
    assert normalized["physical_progress_percent"] == 100.0  # Capped at 100


def test_deduplicator():
    records = [
        {"work_id": "W-100", "title": "A"},
        {"work_id": "W-100", "title": "A Duplicate"},
        {"work_id": "W-101", "title": "B"}
    ]
    unique, duplicates = DataDeduplicator.deduplicate_by_key(records, primary_key="work_id")
    assert len(unique) == 2
    assert len(duplicates) == 1


def test_validator_rules():
    # Valid record
    valid_record = {
        "work_id": "W-VALID-01",
        "sanctioned_cost": 20.0,
        "cumulative_fund_released": 20.0,
        "cumulative_expenditure": 15.0,
        "physical_progress_percent": 75.0,
        "recommendation_date": "2024-04-01",
        "sanction_date": "2024-05-01",
        "actual_completion_date": "2024-09-01",
        "source_report": "DEMO DATA - NOT OFFICIAL MPLADS DATA"
    }
    is_valid, errors = DataValidator.validate_work(valid_record)
    assert is_valid is True
    assert len(errors) == 0

    # Invalid record (Negative cost & Completion before sanction)
    invalid_record = {
        "work_id": "W-INVALID-01",
        "sanctioned_cost": -5.0,
        "physical_progress_percent": 120.0,
        "recommendation_date": "2024-05-01",
        "sanction_date": "2024-04-01",  # Sanction before recommendation
        "actual_completion_date": "2024-03-01",  # Completion before sanction
        "source_report": "DEMO DATA - NOT OFFICIAL MPLADS DATA"
    }
    is_valid, errors = DataValidator.validate_work(invalid_record)
    assert is_valid is False
    assert len(errors) >= 3
