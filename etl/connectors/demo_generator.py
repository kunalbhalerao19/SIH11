"""
Synthetic Demo Data Generator for MPLADS Intelligence Platform.
Generates compliant synthetic works, fund releases, and expenditures.
All records strictly stamped with:
source_report = 'DEMO DATA - NOT OFFICIAL MPLADS DATA'
"""

from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

SOURCE_REPORT_TAG = "DEMO DATA - NOT OFFICIAL MPLADS DATA"
SOURCE_URL = "https://mplads.gov.in"
SOURCE_FILE = "synthetic_generator_sih2026.py"
DATA_VERSION = "v1.0-2026"


class DemoDataGenerator:
    """
    Generates realistic, schema-compliant synthetic MPLADS works and financial records.
    """

    STATES_DISTRICTS = [
        {"state": "IN-MH", "district": "MH-PUN", "pc": "PC-MH-34", "mp": "MP-MH-PUN-01", "agency": "AG-MH-PUN-01"},
        {"state": "IN-MH", "district": "MH-SOL", "pc": "PC-MH-42", "mp": "MP-MH-SOL-01", "agency": "AG-MH-SOL-01"},
        {"state": "IN-BR", "district": "BR-PAT", "pc": "PC-BR-31", "mp": "MP-BR-PAT-01", "agency": "AG-BR-PAT-01"},
        {"state": "IN-BR", "district": "BR-BEG", "pc": "PC-BR-24", "mp": "MP-BR-BEG-01", "agency": "AG-BR-BEG-01"},
        {"state": "IN-UP", "district": "UP-VAR", "pc": "PC-UP-77", "mp": "MP-UP-VAR-01", "agency": "AG-UP-VAR-01"},
        {"state": "IN-RJ", "district": "RJ-SIK", "pc": "PC-RJ-04", "mp": "MP-RJ-SIK-01", "agency": "AG-RJ-SIK-01"},
        {"state": "IN-TN", "district": "TN-CHE", "pc": "PC-TN-04", "mp": "MP-TN-CHE-01", "agency": "AG-TN-CHE-01"},
        {"state": "IN-WB", "district": "WB-KOL", "pc": "PC-WB-24", "mp": "MP-WB-KOL-01", "agency": "AG-WB-KOL-01"},
    ]

    SECTORS = ["SEC-DRINK", "SEC-EDU", "SEC-HEALTH", "SEC-SAN", "SEC-ROAD", "SEC-IRRI", "SEC-COMM", "SEC-RENEW"]

    WORK_TEMPLATES = [
        "Construction of Community Hall and Skill Center",
        "Installation of Deep Borewell with Solar Submersible Pump",
        "PCC Road and Concrete Paver Block Pathway",
        "Procurement of Diagnostic Equipment for Primary Health Center",
        "Development of Smart Classrooms and Science Lab",
        "Renovation of Village Irrigation Pond and Check Dam",
        "Installation of 50 LED Solar Street Lighting Units",
        "Underground Drainage and Solid Waste Management Facility"
    ]

    def generate_demo_works(self, count: int = 30) -> List[Dict[str, Any]]:
        """
        Generates N synthetic works with timestamps, progress, and financials.
        """
        random.seed(42)  # Deterministic seed for reproducible testing
        works = []
        base_date = datetime(2024, 4, 1)

        for i in range(1, count + 1):
            geo = random.choice(self.STATES_DISTRICTS)
            sector = random.choice(self.SECTORS)
            template = random.choice(self.WORK_TEMPLATES)
            work_id = f"MPL-2026-{1000 + i:05d}"

            rec_date = base_date + timedelta(days=random.randint(0, 60))
            sanc_date = rec_date + timedelta(days=random.randint(15, 45))
            expected_comp = sanc_date + timedelta(days=random.randint(120, 240))

            sanc_cost = round(random.uniform(10.0, 50.0), 2)
            rec_cost = round(sanc_cost * random.uniform(1.0, 1.15), 2)
            
            # Distribution of work statuses
            status_roll = random.random()
            if status_roll < 0.35:
                status = "Completed"
                progress = 100.0
                actual_comp = expected_comp - timedelta(days=random.randint(5, 30))
                fund_rel = sanc_cost
                exp = round(sanc_cost * random.uniform(0.95, 1.0), 2)
            elif status_roll < 0.70:
                status = "Ongoing"
                progress = round(random.uniform(30.0, 85.0), 1)
                actual_comp = None
                fund_rel = round(sanc_cost * random.uniform(0.5, 0.9), 2)
                exp = round(fund_rel * random.uniform(0.7, 0.95), 2)
            elif status_roll < 0.85:
                status = "Delayed"
                progress = round(random.uniform(15.0, 45.0), 1)
                actual_comp = None
                fund_rel = round(sanc_cost * random.uniform(0.8, 1.0), 2)
                # Potential anomaly: high expenditure vs low progress
                exp = round(fund_rel * random.uniform(0.85, 0.98), 2)
            else:
                status = "Sanctioned"
                progress = 0.0
                actual_comp = None
                fund_rel = round(sanc_cost * 0.4, 2)
                exp = 0.0

            works.append({
                "work_id": work_id,
                "financial_year": "2024-25",
                "work_name": f"{template} - Unit {i}",
                "work_description": f"Synthetic demo project unit {i} in {geo['district']}",
                "sector_code": sector,
                "state_code": geo["state"],
                "district_code": geo["district"],
                "constituency_code": geo["pc"],
                "mp_id": geo["mp"],
                "implementing_agency_id": geo["agency"],
                "recommendation_date": rec_date.strftime("%Y-%m-%d"),
                "sanction_date": sanc_date.strftime("%Y-%m-%d"),
                "expected_completion_date": expected_comp.strftime("%Y-%m-%d"),
                "actual_completion_date": actual_comp.strftime("%Y-%m-%d") if actual_comp else None,
                "recommended_cost": rec_cost,
                "sanctioned_cost": sanc_cost,
                "cumulative_fund_released": fund_rel,
                "cumulative_expenditure": exp,
                "physical_progress_percent": progress,
                "work_status": status,
                "contractor_name": f"Demo Infrastructure Partner {i % 6 + 1}",
                "contractor_id": f"VEN-DEMO-{i % 6 + 1:03d}",
                "location_geotag_verified": True,
                "has_photo_evidence": True,
                # Mandatory Source Tracking Columns
                "source_report": SOURCE_REPORT_TAG,
                "source_url": SOURCE_URL,
                "source_file": SOURCE_FILE,
                "data_version": DATA_VERSION,
                "last_updated": datetime.utcnow().isoformat()
            })

        return works
