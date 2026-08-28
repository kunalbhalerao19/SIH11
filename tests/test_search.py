"""
Unit Tests for Allowlisted Natural Language Search Engine.
Verifies intent classification, parameterized entity parsing, and SQL injection safety.
"""

import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.search_service import AllowlistedSearchEngine


def test_location_and_sector_intent_search():
    res = AllowlistedSearchEngine.execute_search("Show drinking water projects in Pune")
    assert res["is_allowlisted_execution"] is True
    assert "pune" in res["query"].lower()
    assert res["detected_intent"] in ("FILTER_SECTOR_AND_LOCATION", "FILTER_BY_GEOGRAPHY")
    assert isinstance(res["results"], list)


def test_delayed_works_intent():
    res = AllowlistedSearchEngine.execute_search("Find all delayed road construction works")
    assert res["detected_intent"] in ("FILTER_DELAYED_WORKS", "FILTER_SECTOR_AND_LOCATION")
    assert res["is_allowlisted_execution"] is True


def test_sql_injection_safety():
    malicious_query = "'; DROP TABLE works; SELECT * FROM works WHERE '1'='1"
    res = AllowlistedSearchEngine.execute_search(malicious_query)
    # The search engine safely maps this to general keyword search, never executes raw SQL
    assert res["is_allowlisted_execution"] is True
    assert res["detected_intent"] == "GENERAL_KEYWORD_SEARCH"
