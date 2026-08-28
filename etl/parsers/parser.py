"""
Raw Payload and CSV/JSON Parser for MPLADS ETL Pipeline.
"""

from typing import List, Dict, Any
import json
import csv
import io


class RawDataParser:
    """
    Parses heterogeneous raw data files (JSON, CSV, Dicts) into typed dictionaries.
    """

    @staticmethod
    def parse_json_payload(json_str: str) -> List[Dict[str, Any]]:
        """
        Parses JSON string into a list of records.
        """
        try:
            data = json.loads(json_str)
            if isinstance(data, list):
                return data
            elif isinstance(data, dict):
                return data.get("records", [data])
            return []
        except Exception as e:
            raise ValueError(f"JSON Parsing Error: {str(e)}")

    @staticmethod
    def parse_csv_stream(csv_text: str) -> List[Dict[str, Any]]:
        """
        Parses CSV string into a list of row dictionaries.
        """
        records = []
        reader = csv.DictReader(io.StringIO(csv_text))
        for row in reader:
            records.append(dict(row))
        return records
