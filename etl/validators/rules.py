"""
Data Validation Engine for MPLADS ETL Pipeline.
Enforces business rules and records data quality errors.
"""

from typing import List, Dict, Any, Tuple
from datetime import datetime


class DataValidator:
    """
    Validates work records against MoSPI MPLADS operational rules.
    """

    @staticmethod
    def validate_work(record: Dict[str, Any], run_id: str = "RUN-LOCAL") -> Tuple[bool, List[Dict[str, Any]]]:
        """
        Validates a single normalized work record.
        Returns (is_valid, list_of_error_entries)
        """
        errors = []
        work_id = str(record.get("work_id", "UNKNOWN"))

        # Rule 1: Physical progress range 0 <= progress <= 100
        progress = record.get("physical_progress_percent", 0.0)
        if progress < 0.0 or progress > 100.0:
            errors.append({
                "run_id": run_id,
                "table_name": "works",
                "record_id": work_id,
                "rule_violated": "RULE_PROGRESS_RANGE_0_TO_100",
                "error_description": f"Physical progress {progress}% is outside the permitted 0-100% boundary.",
                "severity": "CRITICAL",
                "raw_payload": record
            })

        # Rule 2: Financial values >= 0
        for fin_field in ["sanctioned_cost", "cumulative_fund_released", "cumulative_expenditure"]:
            val = record.get(fin_field, 0.0)
            if val < 0.0:
                errors.append({
                    "run_id": run_id,
                    "table_name": "works",
                    "record_id": work_id,
                    "rule_violated": "RULE_FINANCIAL_NON_NEGATIVE",
                    "error_description": f"Field '{fin_field}' has negative value {val} Lakhs.",
                    "severity": "CRITICAL",
                    "raw_payload": record
                })

        # Rule 3: Date order: recommendation_date <= sanction_date <= completion_date
        rec_str = record.get("recommendation_date")
        sanc_str = record.get("sanction_date")
        comp_str = record.get("actual_completion_date")

        try:
            rec_date = datetime.strptime(rec_str, "%Y-%m-%d") if rec_str else None
            sanc_date = datetime.strptime(sanc_str, "%Y-%m-%d") if sanc_str else None
            comp_date = datetime.strptime(comp_str, "%Y-%m-%d") if comp_str else None

            if rec_date and sanc_date and rec_date > sanc_date:
                errors.append({
                    "run_id": run_id,
                    "table_name": "works",
                    "record_id": work_id,
                    "rule_violated": "RULE_SANCTION_BEFORE_RECOMMENDATION",
                    "error_description": f"Sanction date ({sanc_str}) occurs before recommendation date ({rec_str}).",
                    "severity": "WARNING",
                    "raw_payload": record
                })

            if sanc_date and comp_date and sanc_date > comp_date:
                errors.append({
                    "run_id": run_id,
                    "table_name": "works",
                    "record_id": work_id,
                    "rule_violated": "RULE_COMPLETION_BEFORE_SANCTION",
                    "error_description": f"Actual completion date ({comp_str}) precedes sanction date ({sanc_str}).",
                    "severity": "CRITICAL",
                    "raw_payload": record
                })
        except Exception as e:
            errors.append({
                "run_id": run_id,
                "table_name": "works",
                "record_id": work_id,
                "rule_violated": "RULE_DATE_PARSING_FAILED",
                "error_description": f"Date parsing failure: {str(e)}",
                "severity": "WARNING",
                "raw_payload": record
            })

        # Rule 4: Mandatory source tracking columns check
        if not record.get("source_report"):
            errors.append({
                "run_id": run_id,
                "table_name": "works",
                "record_id": work_id,
                "rule_violated": "RULE_MANDATORY_SOURCE_TRACKING",
                "error_description": "Record missing mandatory 'source_report' attribution header.",
                "severity": "CRITICAL",
                "raw_payload": record
            })

        is_valid = len([e for e in errors if e["severity"] == "CRITICAL"]) == 0
        return is_valid, errors
