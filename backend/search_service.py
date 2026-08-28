"""
Allowlisted Natural-Language Search Engine for MPLADS Intelligence.
Strict Security Rule:
- Intent classification maps human queries to an ALLOWLISTED parameterized query builder.
- NEVER allows arbitrary or LLM-generated SQL strings to execute directly against the database.
"""

from typing import Dict, Any, List, Optional
import re
from backend.db import db_service


class AllowlistedSearchEngine:
    """
    Parses user natural language queries into safe, allowlisted parameter sets.
    """

    STATE_MAPPINGS = {
        "maharashtra": "IN-MH",
        "pune": "MH-PUN",
        "solapur": "MH-SOL",
        "bihar": "IN-BR",
        "patna": "BR-PAT",
        "begusarai": "BR-BEG",
        "uttar pradesh": "IN-UP",
        "varanasi": "UP-VAR",
        "lucknow": "UP-LKO",
        "rajasthan": "IN-RJ",
        "sikar": "RJ-SIK",
        "tamil nadu": "IN-TN",
        "chennai": "TN-CHE",
        "west bengal": "IN-WB",
        "kolkata": "WB-KOL"
    }

    SECTOR_MAPPINGS = {
        "water": "SEC-DRINK",
        "drinking water": "SEC-DRINK",
        "tubewell": "SEC-DRINK",
        "school": "SEC-EDU",
        "education": "SEC-EDU",
        "hospital": "SEC-HEALTH",
        "health": "SEC-HEALTH",
        "ambulance": "SEC-HEALTH",
        "road": "SEC-ROAD",
        "pathway": "SEC-ROAD",
        "bridge": "SEC-ROAD",
        "solar": "SEC-RENEW",
        "energy": "SEC-RENEW",
        "sanitation": "SEC-SAN",
        "toilet": "SEC-SAN",
        "drainage": "SEC-SAN",
        "community": "SEC-COMM",
        "hall": "SEC-COMM"
    }

    @classmethod
    def execute_search(cls, query_text: str, max_results: int = 10) -> Dict[str, Any]:
        """
        Translates NL query into safe allowlisted filters and fetches records.
        """
        clean_query = query_text.lower().strip()
        
        target_state: Optional[str] = None
        target_district: Optional[str] = None
        target_sector: Optional[str] = None
        target_status: Optional[str] = None

        # 1. State / District Entity Extraction
        for location_name, code in cls.STATE_MAPPINGS.items():
            if re.search(r'\b' + re.escape(location_name) + r'\b', clean_query):
                if code.startswith("IN-"):
                    target_state = code
                else:
                    target_district = code

        # 2. Sector Keyword Extraction
        for sector_name, code in cls.SECTOR_MAPPINGS.items():
            if re.search(r'\b' + re.escape(sector_name) + r'\b', clean_query):
                target_sector = code
                break

        # 3. Status Keyword Extraction
        if "completed" in clean_query:
            target_status = "Completed"
        elif "delayed" in clean_query:
            target_status = "Delayed"
        elif "ongoing" in clean_query:
            target_status = "Ongoing"

        # 4. Intent Classification
        if target_status == "Delayed":
            intent = "FILTER_DELAYED_WORKS"
            explanation = "Searching for overdue works with milestone divergence."
        elif target_sector and (target_state or target_district):
            intent = "FILTER_SECTOR_AND_LOCATION"
            explanation = f"Searching for sector '{target_sector}' in location '{target_district or target_state}'."
        elif target_state or target_district:
            intent = "FILTER_BY_GEOGRAPHY"
            explanation = f"Filtered by administrative territory '{target_district or target_state}'."
        else:
            intent = "GENERAL_KEYWORD_SEARCH"
            explanation = "Keyword search matching project title, sector, or contractor."

        # 5. Execute strictly parameterized query via DatabaseService
        all_works = db_service.get_all_works(
            state_code=target_state,
            district_code=target_district,
            status=target_status,
            sector_code=target_sector,
            limit=50
        )

        # Keyword match fallback if no specific structured entity matched
        if not target_state and not target_district and not target_sector and not target_status:
            words = [w for w in clean_query.split() if len(w) > 2]
            matched = []
            for item in all_works:
                text_blob = f"{item.get('work_name', '')} {item.get('contractor_name', '')} {item.get('sector_code', '')}".lower()
                if any(w in text_blob for w in words):
                    matched.append(item)
            results = matched[:max_results]
        else:
            results = all_works[:max_results]

        filter_summary = f"State: {target_state or 'All'} | District: {target_district or 'All'} | Sector: {target_sector or 'All'} | Status: {target_status or 'All'}"

        return {
            "query": query_text,
            "detected_intent": intent,
            "generated_filter_summary": filter_summary,
            "explanation": explanation,
            "total_matches": len(results),
            "results": results,
            "is_allowlisted_execution": True
        }
