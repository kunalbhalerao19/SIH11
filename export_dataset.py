import pandas as pd
from backend.db import db_service

# Get all existing demo MPLADS works
works = db_service.get_all_works(limit=1000)

# Convert to DataFrame
df = pd.DataFrame(works)

# Save as CSV
df.to_csv("data/raw/mplads_data.csv", index=False)

print("Dataset created successfully!")
print(f"Total works exported: {len(df)}")
print("\nColumns:")
print(df.columns.tolist())