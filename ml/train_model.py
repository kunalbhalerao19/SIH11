import os
import joblib
import pandas as pd

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

from ml.feature_engineering import create_features


DATA_PATH = "data/raw/mplads_data.csv"
MODEL_DIR = "ml/models"

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


def train_model():
    print("Loading MPLADS dataset...")

    df = pd.read_csv(DATA_PATH)

    print(f"Dataset loaded: {len(df)} works")

    # Create ML features
    df = create_features(df)

    # Select features used by the model
    X = df[FEATURES].copy()

    # Handle invalid values
    X = X.replace([float("inf"), float("-inf")], 0)
    X = X.fillna(0)

    print("Preparing features...")

    # Scale the features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print("Training Isolation Forest...")

    # Create model
    model = IsolationForest(
        n_estimators=200,
        contamination=0.10,
        random_state=42
    )

    # Train model
    model.fit(X_scaled)

    # Create model directory
    os.makedirs(MODEL_DIR, exist_ok=True)

    # Save model
    joblib.dump(
        model,
        os.path.join(MODEL_DIR, "isolation_forest.pkl")
    )

    # Save scaler
    joblib.dump(
        scaler,
        os.path.join(MODEL_DIR, "scaler.pkl")
    )

    print("=================================")
    print("MODEL TRAINING COMPLETE ✅")
    print("=================================")
    print(f"Works used for training: {len(df)}")
    print("Model saved to:")
    print("ml/models/isolation_forest.pkl")
    print("Scaler saved to:")
    print("ml/models/scaler.pkl")


if __name__ == "__main__":
    train_model()