from __future__ import annotations

BASE_TOLL_PER_KM = 1.4
CHECKPOINT_FEE = 22



def estimate_toll(distance_km: float, checkpoints: int) -> float:
    return round(distance_km * BASE_TOLL_PER_KM + checkpoints * CHECKPOINT_FEE, 2)
