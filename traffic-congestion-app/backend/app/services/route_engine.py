from __future__ import annotations

from datetime import datetime
from typing import Dict, List
from app.services.toll_engine import estimate_toll



def recommend_routes(source: str, destination: str, departure_time: datetime, mode: str = "balanced") -> Dict:
    seed = (len(source) + len(destination) + departure_time.hour) % 7
    base_distance = 8 + seed * 2.4

    routes: List[Dict] = [
        {
            "name": "Fastest Route",
            "distance_km": round(base_distance, 1),
            "eta_minutes": int(base_distance * 3.6),
            "toll_checkpoints": 3,
            "traffic_level": "High",
            "fuel_efficiency_score": 0.62,
            "congestion_risk": "Medium",
            "recommendation_tag": "Time Saver",
        },
        {
            "name": "Lowest Toll Route",
            "distance_km": round(base_distance * 1.2, 1),
            "eta_minutes": int(base_distance * 4.4),
            "toll_checkpoints": 0,
            "traffic_level": "Medium",
            "fuel_efficiency_score": 0.71,
            "congestion_risk": "Low",
            "recommendation_tag": "Budget",
        },
        {
            "name": "AI Recommended Route",
            "distance_km": round(base_distance * 1.05, 1),
            "eta_minutes": int(base_distance * 3.9),
            "toll_checkpoints": 1,
            "traffic_level": "Medium",
            "fuel_efficiency_score": 0.76,
            "congestion_risk": "Low",
            "recommendation_tag": "Balanced",
        },
    ]

    for route in routes:
        route["toll_fee"] = estimate_toll(route["distance_km"], route["toll_checkpoints"])
        route["toll_free"] = route["toll_checkpoints"] == 0

    if mode == "budget":
        best = "Lowest Toll Route"
    elif mode == "time-saving":
        best = "Fastest Route"
    elif mode == "emergency":
        best = "Fastest Route"
        routes[0]["recommendation_tag"] = "Emergency Priority"
        routes[0]["traffic_level"] = "Signal Priority Enabled"
    else:
        best = "AI Recommended Route"

    return {"routes": routes, "best_route": best}
