from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path
import numpy as np
import pandas as pd

from app.core.config import DATA_PATH


WEATHERS = ["Clear", "Cloudy", "Rainy", "Storm"]
AREAS = ["Downtown", "Tech Park", "University Circle", "Airport Road", "City Mall", "Industrial Belt"]



def _derive_congestion(volume: float, speed: float, rain: float, accident: int, event: int) -> str:
    score = 0.45 * (volume / 250.0) + 0.35 * (1 - min(speed, 80) / 80.0) + 0.1 * min(rain / 12, 1) + 0.06 * accident + 0.04 * event
    if score < 0.35:
        return "Low"
    if score < 0.55:
        return "Medium"
    if score < 0.75:
        return "High"
    return "Very High"


def generate_sample_dataset(path: Path = DATA_PATH, rows: int = 1200) -> pd.DataFrame:
    np.random.seed(42)
    now = datetime.now().replace(minute=0, second=0, microsecond=0)
    records = []
    for i in range(rows):
        ts = now - timedelta(minutes=15 * (rows - i))
        area = np.random.choice(AREAS)
        base_lat, base_lng = 28.6139, 77.2090
        lat = base_lat + np.random.uniform(-0.08, 0.08)
        lng = base_lng + np.random.uniform(-0.08, 0.08)
        hour_factor = 1.5 if ts.hour in {8, 9, 10, 17, 18, 19} else 1.0
        volume = np.random.normal(120 * hour_factor, 35)
        speed = max(8, np.random.normal(45 / hour_factor, 12))
        weather = np.random.choice(WEATHERS, p=[0.45, 0.25, 0.25, 0.05])
        rain = np.random.gamma(shape=1.2, scale=1.8) if weather in {"Rainy", "Storm"} else 0.0
        accident = np.random.binomial(1, 0.08 if hour_factor > 1 else 0.03)
        event = np.random.binomial(1, 0.12)
        pt_density = np.clip(np.random.normal(0.55, 0.18), 0.1, 1.0)
        congestion = _derive_congestion(volume, speed, rain, accident, event)
        records.append(
            {
                "Timestamp": ts.isoformat(),
                "Location": area,
                "Latitude": round(lat, 6),
                "Longitude": round(lng, 6),
                "Traffic Volume": round(max(20, volume), 2),
                "Average Speed (km/h)": round(speed, 2),
                "Weather": weather,
                "Rain (mm)": round(rain, 2),
                "Accident": accident,
                "Event": event,
                "Public Transport Density": round(float(pt_density), 2),
                "Congestion Level": congestion,
            }
        )
    df = pd.DataFrame(records)
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(path, index=False)
    return df


def load_dataset(path: Path = DATA_PATH) -> pd.DataFrame:
    if not path.exists():
        return generate_sample_dataset(path)
    return pd.read_csv(path)
