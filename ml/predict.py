import joblib
import pandas as pd

from ml.feature_engineering import create_features


MODEL_PATH = "ml/models/isolation_forest.pkl"
SCALER_PATH = "ml/models/scaler.pkl"


FEATURES = [
    "sanctioned_cost",
    "recommended_cost",
    "cumulative_fund_released",
    "cumulative_expenditure",
    "physical_progress_percent",
    "cost_deviation_pct",
    "fund_utilization_pct",
    "progress_gap",
    "contractor_frequency",
]


def predict_anomaly(work):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    df = pd.DataFrame([work])

    df = create_features(df)

    X = df[FEATURES].copy()
    X = X.replace([float("inf"), float("-inf")], 0)
    X = X.fillna(0)

    X_scaled = scaler.transform(X)

    prediction = model.predict(X_scaled)[0]
    anomaly_score = model.decision_function(X_scaled)[0]

    return {
        "is_anomaly": bool(prediction == -1),
        "anomaly_score": float(anomaly_score),
    }


if __name__ == "__main__":

    test_work = {
        "sanctioned_cost": 10,
        "recommended_cost": 10,
        "cumulative_fund_released": 10,
        "cumulative_expenditure": 9,
        "physical_progress_percent": 30,
        "contractor_id": "TEST001",
    }

    result = predict_anomaly(test_work)

    print("\nAI RESULT")
    print("---------")
    print("Anomaly:", result["is_anomaly"])
    print("Anomaly Score:", result["anomaly_score"])