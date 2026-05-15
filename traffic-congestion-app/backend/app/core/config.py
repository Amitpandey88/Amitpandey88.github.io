from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_PATH = BASE_DIR / "backend" / "data" / "sample_traffic.csv"
MODEL_PATH = BASE_DIR / "backend" / "models" / "congestion_model.joblib"
METADATA_PATH = BASE_DIR / "backend" / "models" / "model_metadata.joblib"
DB_PATH = BASE_DIR / "backend" / "data" / "traffic.db"
