from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, List



def preventive_actions(predicted_congestion: str, accident: bool, event: bool) -> List[str]:
    actions: List[str] = []
    if predicted_congestion in {"High", "Very High"}:
        actions.extend(
            [
                "Increase green signal time by 20% on inbound corridors.",
                "Recommend carpool and metro-first commute notification.",
                "Divert drivers to smart parking lots near nearest metro hubs.",
                "Enable green-route preference for low-emission roads.",
            ]
        )
    if accident:
        actions.append("Trigger emergency lane clearance and reroute normal traffic away from incident zone.")
    if event:
        actions.append("Activate event dispersal traffic plan and temporary no-parking advisory.")
    if not actions:
        actions.append("Maintain current signal plan and monitor zone every 10 minutes.")
    return actions



def generate_alerts() -> List[Dict]:
    now = datetime.utcnow()
    return [
        {
            "id": 1,
            "severity": "critical",
            "title": "Very High Congestion Predicted",
            "message": "Downtown core expected to hit severe congestion in next 45 minutes.",
            "timestamp": now,
        },
        {
            "id": 2,
            "severity": "high",
            "title": "Accident Impact",
            "message": "Minor accident near Tech Park exit. Expect delays and reroutes.",
            "timestamp": now - timedelta(minutes=7),
        },
        {
            "id": 3,
            "severity": "medium",
            "title": "Event Warning",
            "message": "Concert crowd likely to increase traffic around City Mall after 7 PM.",
            "timestamp": now - timedelta(minutes=15),
        },
    ]
