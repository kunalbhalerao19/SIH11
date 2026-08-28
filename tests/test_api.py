"""
FastAPI Backend Endpoint Tests.
"""

from fastapi.testclient import TestClient
import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "data_notice" in response.json()
    assert response.json()["data_notice"] == "DEMO DATA - NOT OFFICIAL MPLADS DATA"


def test_states_endpoint():
    response = client.get("/api/states")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert response.json()[0]["state_code"] == "IN-MH"


def test_works_paginated():
    response = client.get("/api/works?page=1&per_page=5")
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert data["per_page"] == 5
    assert len(data["records"]) <= 5
    # Verify source tracking field on records
    assert data["records"][0]["source_report"] == "DEMO DATA - NOT OFFICIAL MPLADS DATA"


def test_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_works_sanctioned" in data
    assert "overall_utilization_percent" in data
    assert data["data_classification"] == "DEMO DATA - NOT OFFICIAL MPLADS DATA"


def test_ai_anomalies_phrasing():
    response = client.get("/api/ai/anomalies")
    assert response.status_code == 200
    anomalies = response.json()
    assert len(anomalies) > 0
    # Strict rule: always phrased as review / audit, never 'fraud confirmed'
    for anom in anomalies:
        assert "fraud confirmed" not in anom["recommendation"].lower()
        assert "review" in anom["recommendation"].lower() or "verification" in anom["recommendation"].lower() or "audit" in anom["recommendation"].lower()
