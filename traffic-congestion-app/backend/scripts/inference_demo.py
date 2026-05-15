import sys
from pathlib import Path
from datetime import datetime, timezone

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.prediction_engine import predict


if __name__ == "__main__":
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "location": "Downtown",
        "latitude": 28.62,
        "longitude": 77.22,
        "traffic_volume": 205,
        "average_speed_kmh": 19,
        "weather": "Rainy",
        "rain_mm": 5.2,
        "accident": True,
        "event": True,
        "public_transport_density": 0.58,
    }
    print(predict(payload))
