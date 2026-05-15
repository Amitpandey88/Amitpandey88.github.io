# AI-Powered Smart Traffic Congestion Predictor for Smart Cities

A production-style, student-friendly smart mobility platform with **FastAPI + React + Tailwind + ML pipeline**.

## 1) Final Project Architecture

### System Layers
1. **Data Ingestion Layer**: CSV/historical traffic records + simulated near-real-time records.
2. **Preprocessing & Feature Engineering Layer**: cleaning, timestamp parsing, lag features, risk scores.
3. **ML Layer**: baseline + advanced classifiers; best model persisted via `joblib`.
4. **Prediction Engine**: 30–60 minute congestion forecast with confidence and actions.
5. **Routing & Toll Intelligence Layer**: fastest/lowest-toll/AI routes with toll + fuel-aware comparison.
6. **Preventive Action & Alert Layer**: dynamic signal, carpool, parking, event and emergency logic.
7. **API Layer**: FastAPI endpoints for dashboard and assistant.
8. **Frontend Dashboard Layer**: responsive smart-city UI with charts, map, alerts, chatbot.
9. **Database Layer**: SQLite schema for records, predictions, routes, toll estimates, alerts, chatbot logs.

### End-to-End Flow
Raw records → preprocessing/feature engineering → model inference → risk/hotspot generation → route+toll scoring → alerts/actions → API responses → React dashboard/map/widgets.

## 2) Folder Structure

```text
traffic-congestion-app/
  backend/
    app/
      api/routes.py
      core/config.py
      db/database.py
      models/schemas.py
      services/
        alert_engine.py
        chatbot_engine.py
        data_loader.py
        feature_engineering.py
        model_service.py
        prediction_engine.py
        preprocess.py
        route_engine.py
        toll_engine.py
      main.py
    data/
      sample_traffic.csv (auto-generated)
      schema.sql
    models/
      congestion_model.joblib (generated)
      model_metadata.joblib (generated)
    scripts/
      train_model.py
      inference_demo.py
    requirements.txt
  frontend/
    src/
      components/
      pages/
      services/api.js
      data/samplePayload.js
      App.jsx
      main.jsx
      styles.css
    index.html
    package.json
    tailwind.config.js
    postcss.config.js
    vite.config.js
  docs/
    architecture-and-analysis.md
    eda-plan.md
  deployment/
    DEPLOYMENT_GUIDE.md
    DEMO_SCRIPT.md
```

## 3) Dataset Analysis (Column-by-Column)

| Column | Type | Category | Meaning | Role |
|---|---|---|---|---|
| Timestamp | datetime | temporal | event time | time trend/seasonality |
| Location/Area | string | categorical | zone name | spatial-zone behavior |
| Latitude | float | geospatial | map coordinate | hotspot mapping |
| Longitude | float | geospatial | map coordinate | hotspot mapping |
| Traffic Volume | float/int | numerical | vehicle count | congestion pressure |
| Average Speed (km/h) | float | numerical | flow speed | inverse congestion signal |
| Weather | string | categorical | weather condition | exogenous impact |
| Rain (mm) | float | numerical | rain intensity | road capacity reduction |
| Accident | bool/int | binary | incident flag | sudden disruption |
| Event | bool/int | binary | event flag | demand surge |
| Public Transport Density | float | numerical | transit availability | modal shift proxy |
| Congestion Level | string | target | low→very high congestion | prediction target |

**Target variable:** `Congestion Level`  
**Inputs:** all other fields + engineered features.  
**Recommended strategy:** **Hybrid tabular classification + time-aware features** (best practical approach for this dataset type).

## 4) Data Preprocessing Pipeline

- Missing values: median (numeric), most-frequent (categorical)
- Timestamp parsing + sorting by zone/time
- Time features: hour, day_of_week, weekend, rush_hour_flag
- Categorical encoding: OneHotEncoder(handle_unknown="ignore")
- Scaling: StandardScaler for numeric features
- Binary fields: normalized to 0/1
- Outliers: robust handling via model choice + clipping in risk formulas
- Train/test split: **time-based split** to avoid leakage

### Engineered Features Included
- `hour`, `day_of_week`, `is_weekend`, `rush_hour_flag`
- `rain_bucket`
- `accident_impact_flag`, `event_impact_flag`
- `speed_volume_ratio`
- `zone_avg_volume_6`, `lag_traffic_1`, `lag_speed_1`
- `risk_score` (weather + accidents + events + speed + volume)

## 5) EDA Plan + Recommended Visuals

Implemented visualization modules and documented EDA plan in `docs/eda-plan.md`:
- Congestion distribution (pie/donut)
- Volume vs speed trend (line/scatter style trend)
- Congestion by zone (bar/ranking)
- Congestion by hour (line)
- Weather/rain impact (grouped bars)
- Accident/event impact (comparative bars)
- Public transport density relation (trend/correlation)
- Map heat zones and hotspot frequency cards

## 6) ML Pipeline

### Baselines
- Logistic Regression
- Decision Tree
- Random Forest

### Advanced
- XGBoost (if installed)

### Model Selection
`backend/app/services/model_service.py` trains all candidates, compares weighted F1/accuracy, selects best model, and stores:
- `congestion_model.joblib`
- `model_metadata.joblib`

### Metrics Covered
Accuracy, Precision, Recall, F1 (classification report).  
Class imbalance handled via class weights.  
Time-aware holdout split for reliable validation.

## 7) Prediction Engine Features

- 30–60 minute congestion prediction
- Risk level: Low / Medium / High / Very High
- Confidence score
- Key contributing factors
- Preventive actions
- High-risk zone detection + city hotspot ranking

## 8) Smart Routing + Toll Intelligence

`/route-recommendation` returns:
- Fastest Route
- Lowest Toll Route
- AI Recommended Route

Each includes ETA, toll fee, distance, traffic level, fuel score, congestion risk, recommendation tag, toll-free marker.  
Modes: budget, time-saving, balanced, emergency.

## 9) Preventive Action Engine

Rule-based trigger layer recommends:
- Dynamic signal timing
- Carpool/public transport nudge
- Smart parking diversion
- Event warning actions
- Green route guidance
- Emergency lane/signal priority steps

## 10) Backend API Endpoints

- `GET /health`
- `POST /predict`
- `GET /high-risk-zones`
- `GET /heatmap-data`
- `POST /route-recommendation`
- `POST /toll-estimate`
- `GET /alerts`
- `POST /chat`
- `GET /dashboard-summary`

## 11) Frontend Modules

1. Overview Dashboard
2. Prediction Panel
3. Live Map / Heatmap
4. Route & Toll Comparison
5. Alerts Center
6. Emergency Routing
7. AI Assistant
8. Analytics / History

Includes responsive sidebar, KPI cards, trend charts, congestion distribution, map overlays, route table, alerts, and chatbot widget.

## 12) Database Design

Schema in `backend/data/schema.sql` includes:
- `traffic_records`
- `predictions`
- `routes`
- `toll_estimates`
- `alerts`
- `chatbot_logs`

## 13) Run Instructions

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/train_model.py
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Set optional env:
```bash
VITE_API_URL=http://localhost:8000
```

## 14) Sample API Tests

```bash
curl http://localhost:8000/health

curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"timestamp":"2026-05-15T10:30:00","location":"Downtown","latitude":28.6139,"longitude":77.2090,"traffic_volume":200,"average_speed_kmh":20,"weather":"Rainy","rain_mm":4.2,"accident":true,"event":false,"public_transport_density":0.56}'
```

## 15) Future Scope

- Live map/routing APIs
- CCTV + computer vision
- Adaptive signal control
- RL-based traffic policy optimization
- IoT edge sensor integration
- Voice/multilingual assistant
- Smart-city command-center integration

## 16) Screenshots Placeholders

- `docs/screenshots/dashboard-overview.png`
- `docs/screenshots/prediction-panel.png`
- `docs/screenshots/route-comparison.png`
- `docs/screenshots/alerts-and-chatbot.png`

