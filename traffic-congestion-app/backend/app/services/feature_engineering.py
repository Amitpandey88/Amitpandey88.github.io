from __future__ import annotations

import pandas as pd



def add_engineered_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out["Timestamp"] = pd.to_datetime(out["Timestamp"])
    out = out.sort_values(["Location", "Timestamp"])

    out["hour"] = out["Timestamp"].dt.hour
    out["day_of_week"] = out["Timestamp"].dt.dayofweek
    out["is_weekend"] = (out["day_of_week"] >= 5).astype(int)
    out["rush_hour_flag"] = out["hour"].isin([7, 8, 9, 10, 17, 18, 19, 20]).astype(int)
    out["rain_bucket"] = pd.cut(
        out["Rain (mm)"],
        bins=[-1, 0.1, 2.5, 7.5, 100],
        labels=["none", "light", "moderate", "heavy"],
    ).astype(str)

    out["accident_impact_flag"] = ((out["Accident"] == 1) & (out["Average Speed (km/h)"] < 30)).astype(int)
    out["event_impact_flag"] = ((out["Event"] == 1) & (out["Traffic Volume"] > out["Traffic Volume"].median())).astype(int)

    out["speed_volume_ratio"] = out["Average Speed (km/h)"] / out["Traffic Volume"].clip(lower=1)

    out["zone_avg_volume_6"] = (
        out.groupby("Location")["Traffic Volume"]
        .transform(lambda s: s.rolling(window=6, min_periods=1).mean())
        .astype(float)
    )
    out["lag_traffic_1"] = out.groupby("Location")["Traffic Volume"].shift(1).fillna(out["Traffic Volume"])
    out["lag_speed_1"] = out.groupby("Location")["Average Speed (km/h)"].shift(1).fillna(out["Average Speed (km/h)"])

    weather_risk = out["Weather"].map({"Clear": 0.05, "Cloudy": 0.1, "Rainy": 0.25, "Storm": 0.4}).fillna(0.1)
    out["risk_score"] = (
        weather_risk
        + 0.2 * out["Accident"].astype(float)
        + 0.15 * out["Event"].astype(float)
        + 0.35 * (1 - out["Average Speed (km/h)"].clip(upper=80) / 80)
        + 0.25 * (out["Traffic Volume"] / out["Traffic Volume"].quantile(0.95)).clip(upper=1)
    )

    return out
