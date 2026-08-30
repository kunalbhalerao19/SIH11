import pandas as pd


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Convert important columns to numbers
    numeric_columns = [
        "sanctioned_cost",
        "recommended_cost",
        "cumulative_fund_released",
        "cumulative_expenditure",
        "physical_progress_percent",
    ]

    for col in numeric_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    # 1. Cost deviation
    df["cost_deviation_pct"] = (
        (df["cumulative_expenditure"] - df["sanctioned_cost"])
        / df["sanctioned_cost"].replace(0, 1)
    ) * 100

    # 2. Fund utilization
    df["fund_utilization_pct"] = (
        df["cumulative_expenditure"]
        / df["cumulative_fund_released"].replace(0, 1)
    ) * 100

    # 3. Difference between financial and physical progress
    df["progress_gap"] = (
        df["fund_utilization_pct"]
        - df["physical_progress_percent"]
    )

    # 4. Contractor frequency
    if "contractor_id" in df.columns:
        df["contractor_frequency"] = (
            df.groupby("contractor_id")["contractor_id"]
            .transform("count")
        )
    else:
        df["contractor_frequency"] = 0

    # Clean infinite / missing values
    df = df.replace([float("inf"), float("-inf")], 0)
    df = df.fillna(0)

    return df