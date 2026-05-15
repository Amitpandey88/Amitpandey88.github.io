from __future__ import annotations

from fastapi import APIRouter
import pandas as pd

from app.models.schemas import (
    ChatRequest,
    ChatResponse,
    DashboardSummary,
    PredictRequest,
    PredictResponse,
    RouteRequest,
    RouteResponse,
    TollRequest,
    TollResponse,
)
from app.services.alert_engine import generate_alerts
from app.services.chatbot_engine import answer_query
from app.services.data_loader import load_dataset
from app.services.feature_engineering import add_engineered_features
from app.services.prediction_engine import predict
from app.services.route_engine import recommend_routes
from app.services.toll_engine import estimate_toll

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "smart-traffic-api"}


@router.post("/predict", response_model=PredictResponse)
def predict_congestion(payload: PredictRequest):
    return predict(payload.model_dump())


@router.get("/high-risk-zones")
def high_risk_zones(limit: int = 8):
    df = add_engineered_features(load_dataset())
    high = df[df["Congestion Level"].isin(["High", "Very High"])].copy()
    grouped = (
        high.groupby("Location")
        .agg(
            risk_count=("Congestion Level", "count"),
            avg_speed=("Average Speed (km/h)", "mean"),
            lat=("Latitude", "mean"),
            lng=("Longitude", "mean"),
        )
        .sort_values("risk_count", ascending=False)
        .head(limit)
        .reset_index()
    )
    return grouped.to_dict(orient="records")


@router.get("/heatmap-data")
def heatmap_data():
    df = load_dataset().tail(250)
    weights = {"Low": 0.2, "Medium": 0.5, "High": 0.75, "Very High": 1.0}
    df["weight"] = df["Congestion Level"].map(weights).fillna(0.3)
    return df[["Latitude", "Longitude", "weight", "Location", "Congestion Level"]].to_dict(orient="records")


@router.post("/route-recommendation", response_model=RouteResponse)
def route_recommendation(payload: RouteRequest):
    return recommend_routes(payload.source, payload.destination, payload.departure_time, payload.mode)


@router.post("/toll-estimate", response_model=TollResponse)
def toll_estimate(payload: TollRequest):
    return {
        "route_name": payload.route_name,
        "estimated_toll": estimate_toll(payload.distance_km, payload.toll_checkpoints),
    }


@router.get("/alerts")
def alerts():
    return generate_alerts()


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    return {"answer": answer_query(payload.message)}


@router.get("/dashboard-summary", response_model=DashboardSummary)
def dashboard_summary():
    df = load_dataset()
    latest = df.tail(96).copy()
    trend = (
        latest.assign(hour=pd.to_datetime(latest["Timestamp"]).dt.strftime("%H:%M"))
        .groupby("hour", as_index=False)["Traffic Volume"]
        .mean()
        .tail(12)
    )
    cdist = latest["Congestion Level"].value_counts().to_dict()
    hotspot = (
        latest[latest["Congestion Level"].isin(["High", "Very High"])]["Location"].value_counts().head(1).index.tolist()
    )

    return {
        "active_alerts": len(generate_alerts()),
        "high_risk_zones": int(latest[latest["Congestion Level"].isin(["High", "Very High"])]["Location"].nunique()),
        "avg_city_speed": round(float(latest["Average Speed (km/h)"].mean()), 2),
        "predicted_hotspot": hotspot[0] if hotspot else "No major hotspot",
        "congestion_distribution": {k: int(v) for k, v in cdist.items()},
        "trend_points": [{"time": r["hour"], "volume": round(float(r["Traffic Volume"]), 2)} for _, r in trend.iterrows()],
    }
