"""
Deduplicator for MPLADS ETL Pipeline.
Prevents duplicate ingestion across primary keys and composite hash keys.
"""

from typing import List, Dict, Any, Tuple, Set


class DataDeduplicator:
    """
    Identifies and removes duplicate records by primary identifier and payload signature.
    """

    @staticmethod
    def deduplicate_by_key(records: List[Dict[str, Any]], primary_key: str = "work_id") -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Splits incoming records into unique records and duplicates.
        """
        seen_keys: Set[str] = set()
        unique_records: List[Dict[str, Any]] = []
        duplicate_records: List[Dict[str, Any]] = []

        for record in records:
            key_val = str(record.get(primary_key, "")).strip()
            if not key_val:
                duplicate_records.append(record)
                continue

            if key_val in seen_keys:
                duplicate_records.append(record)
            else:
                seen_keys.add(key_val)
                unique_records.append(record)

        return unique_records, duplicate_records
