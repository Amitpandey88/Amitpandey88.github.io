from __future__ import annotations

from datetime import timedelta
from typing import Dict, List
import pandas as pd

from app.services.alert_engine import preventive_actions
from app.services.feature_engineering import add_engineered_features
from app.services.model_service import load_model_and_metadata, predict_with_confidence



def _risk_label(congestion: str) -> str:
    mapping = {"Low": "Low", "Medium": "Medium", "High": "High", "Very High": "Very High"}
    return mapping.get(congestion, "Medium")


def _key_factors(payload: dict) -> List[str]:
    factors = []
    if payload["average_speed_kmh"] < 25:
        factors.append("Low average speed in selected corridor")
    if payload["traffic_volume"] > 180:
        factors.append("High incoming traffic volume")
    if payload["rain_mm"] > 3:
        factors.append("Rainfall reducing road capacity")
    if payload["accident"]:
        factors.append("Accident disrupting lane flow")
    if payload["event"]:
        factors.append("Nearby event increasing demand")
    return factors or ["Normal operating conditions"]



def predict(payload: dict) -> Dict:
    model, _ = load_model_and_metadata()

    base = pd.DataFrame(
        [
            {
                "Timestamp": payload["timestamp"],
                "Location": payload["location"],
                "Latitude": payload["latitude"],
                "Longitude": payload["longitude"],
                "Traffic Volume": payload["traffic_volume"],
                "Average Speed (km/h)": payload["average_speed_kmh"],
                "Weather": payload["weather"],
                "Rain (mm)": payload["rain_mm"],
                "Accident": int(payload["accident"]),
                "Event": int(payload["event"]),
                "Public Transport Density": payload["public_transport_density"],
            }
        ]
    )

    # generate tiny context window for lag/rolling features
    context = []
    for i in range(6, 0, -1):
        row = base.iloc[0].to_dict()
        row["Timestamp"] = pd.to_datetime(row["Timestamp"]) - timedelta(minutes=15 * i)
        row["Traffic Volume"] = max(20, row["Traffic Volume"] * (1 - 0.05 * i))
        row["Average Speed (km/h)"] = min(70, row["Average Speed (km/h)"] + i)
        context.append(row)
    frame = pd.concat([pd.DataFrame(context), base], ignore_index=True)

    fe = add_engineered_features(frame)
    infer_row = fe.tail(1).drop(columns=["Timestamp"], errors="ignore")

    pred, conf = predict_with_confidence(model, infer_row)
    actions = preventive_actions(pred, payload["accident"], payload["event"])

    return {
        "predicted_congestion": pred,
        "risk_level": _risk_label(pred),
        "confidence": round(conf, 4),
        "key_factors": _key_factors(payload),
        "recommended_actions": actions,
    }
