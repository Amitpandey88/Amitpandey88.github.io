import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.data_loader import load_dataset
from app.services.model_service import train_and_save


if __name__ == "__main__":
    df = load_dataset()
    scores = train_and_save(df)
    print("Model training complete")
    for name, score in scores.items():
        print(f"- {name}: accuracy={score['accuracy']:.4f}, f1={score['f1']:.4f}")
