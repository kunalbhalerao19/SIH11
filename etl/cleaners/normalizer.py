"""
Data Normalizer for MPLADS ETL Pipeline.
Normalizes date formats, state/district codes, currency values, and string casing.
"""

from typing import Dict, Any, Optional
from datetime import datetime


class DataNormalizer:
    """
    Standardizes schema types, trims whitespace, and validates date formats.
    """

    @staticmethod
    def normalize_date(date_val: Any) -> Optional[str]:
        """
        Normalizes various date formats to ISO YYYY-MM-DD.
        """
        if not date_val or date_val in ("N/A", "null", "None", ""):
            return None

        if isinstance(date_val, datetime):
            return date_val.strftime("%Y-%m-%d")

        date_str = str(date_val).strip()
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%Y/%m/%d", "%d.%m.%Y"):
            try:
                return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
            except ValueError:
                continue
        return None

    @staticmethod
    def normalize_currency(val: Any) -> float:
        """
        Cleans numeric currency amounts in Lakhs.
        """
        if val is None or val == "":
            return 0.0
        try:
            cleaned = str(val).replace(",", "").replace("₹", "").replace("Rs.", "").strip()
            return round(float(cleaned), 2)
        except (ValueError, TypeError):
            return 0.0

    @classmethod
    def normalize_work_record(cls, record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalizes a full work dictionary.
        """
        normalized = dict(record)

        # Dates
        normalized["recommendation_date"] = cls.normalize_date(record.get("recommendation_date"))
        normalized["sanction_date"] = cls.normalize_date(record.get("sanction_date"))
        normalized["expected_completion_date"] = cls.normalize_date(record.get("expected_completion_date"))
        normalized["actual_completion_date"] = cls.normalize_date(record.get("actual_completion_date"))

        # Financials in Lakhs
        normalized["recommended_cost"] = cls.normalize_currency(record.get("recommended_cost"))
        normalized["sanctioned_cost"] = cls.normalize_currency(record.get("sanctioned_cost"))
        normalized["cumulative_fund_released"] = cls.normalize_currency(record.get("cumulative_fund_released"))
        normalized["cumulative_expenditure"] = cls.normalize_currency(record.get("cumulative_expenditure"))

        # Progress
        try:
            prog = float(record.get("physical_progress_percent", 0.0))
            normalized["physical_progress_percent"] = max(0.0, min(100.0, round(prog, 2)))
        except (ValueError, TypeError):
            normalized["physical_progress_percent"] = 0.0

        # Strings
        normalized["work_id"] = str(record.get("work_id", "")).strip()
        normalized["work_name"] = str(record.get("work_name", "")).strip()
        normalized["work_status"] = str(record.get("work_status", "Recommended")).strip().capitalize()

        return normalized
