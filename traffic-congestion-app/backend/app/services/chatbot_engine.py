from __future__ import annotations

from datetime import datetime
from app.services.route_engine import recommend_routes



def answer_query(message: str) -> str:
    text = message.lower()
    if "congest" in text and "next" in text:
        return "Downtown and Airport Road are likely high-risk in the next 45 minutes based on volume + speed trend."
    if "low-toll" in text or "lowest toll" in text:
        route = recommend_routes("Downtown", "Airport", datetime.utcnow(), mode="budget")
        best = next(r for r in route["routes"] if r["name"] == route["best_route"])
        return f"Best low-toll option is {best['name']} with approx ₹{best['toll_fee']} toll and {best['eta_minutes']} min ETA."
    if "emergency" in text:
        return "Emergency mode enables signal-priority path on Fastest Route with corridor pre-clearance recommendations."
    if "why" in text and "congestion" in text:
        return "Likely drivers: high traffic volume, reduced average speed, weather/rain effects, and event spillover."
    if "preventive" in text or "action" in text:
        return "Recommended actions: dynamic signal timing, carpool nudges, parking diversion, and public transport boosts."
    return "I can help with congestion forecasts, toll-aware routes, emergency routing, and preventive traffic actions."
