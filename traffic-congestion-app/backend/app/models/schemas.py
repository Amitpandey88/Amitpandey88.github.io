from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    timestamp: datetime
    location: str
    latitude: float
    longitude: float
    traffic_volume: float
    average_speed_kmh: float
    weather: str
    rain_mm: float
    accident: bool
    event: bool
    public_transport_density: float


class PredictResponse(BaseModel):
    predicted_congestion: str
    risk_level: str
    confidence: float
    key_factors: List[str]
    recommended_actions: List[str]


class RouteRequest(BaseModel):
    source: str
    destination: str
    departure_time: datetime
    mode: str = Field(default="balanced", description="budget|time-saving|balanced|emergency")


class RouteOption(BaseModel):
    name: str
    eta_minutes: int
    distance_km: float
    toll_fee: float
    traffic_level: str
    fuel_efficiency_score: float
    congestion_risk: str
    recommendation_tag: str
    toll_free: bool


class RouteResponse(BaseModel):
    routes: List[RouteOption]
    best_route: str


class TollRequest(BaseModel):
    route_name: str
    distance_km: float
    toll_checkpoints: int = 0


class TollResponse(BaseModel):
    route_name: str
    estimated_toll: float


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str


class AlertItem(BaseModel):
    id: int
    severity: str
    title: str
    message: str
    timestamp: datetime


class DashboardSummary(BaseModel):
    active_alerts: int
    high_risk_zones: int
    avg_city_speed: float
    predicted_hotspot: str
    congestion_distribution: Dict[str, int]
    trend_points: List[Dict[str, Any]]
