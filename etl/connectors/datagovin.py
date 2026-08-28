"""
Data.gov.in Open Government Data (OGD) Platform Connector (DISABLED BY DEFAULT)

IMPORTANT COMPLIANCE & VERIFICATION NOTICE:
------------------------------------------
1. Data.gov.in provides periodic aggregate summary datasets for MPLADS, not row-level
   asset coordinates, contractor pan, or invoice vouchers.
2. This connector is DISABLED by default until an official OGD API key is configured.

HUMAN VERIFICATION CHECKLIST BEFORE ENABLING:
---------------------------------------------
[ ] Step 1: Register on https://data.gov.in and generate an OGD API Key.
[ ] Step 2: Set `DATAGOVIN_API_KEY` in environment variables.
[ ] Step 3: Verify the Resource ID for MPLADS state summaries (`DATAGOVIN_RESOURCE_ID`).
[ ] Step 4: Toggle `IS_ENABLED = True` below.
"""

import os
from typing import Dict, Any, List, Optional

IS_ENABLED: bool = False


class DataGovInConnector:
    """
    Connector for India Open Government Data platform (data.gov.in).
    """

    def __init__(self):
        self.api_key = os.getenv("DATAGOVIN_API_KEY", "")
        self.resource_id = os.getenv("DATAGOVIN_RESOURCE_ID", "mplads-state-summary-resource-id")
        self.is_enabled = IS_ENABLED and bool(self.api_key)

    def fetch_state_aggregates(self) -> List[Dict[str, Any]]:
        """
        Fetches high-level state releases and expenditures.
        """
        if not self.is_enabled:
            return []

        # TODO (Developer): Connect to OGD REST API
        # url = f"https://api.data.gov.in/resource/{self.resource_id}?api-key={self.api_key}&format=json"
        # response = requests.get(url)
        # return response.json().get("records", [])
        return []
