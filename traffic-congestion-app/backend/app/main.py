from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.services.data_loader import load_dataset
from app.services.model_service import train_and_save
from app.core.config import MODEL_PATH

app = FastAPI(title="AI-Powered Smart Traffic Congestion Predictor", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_bootstrap() -> None:
    df = load_dataset()
    if not MODEL_PATH.exists():
        train_and_save(df)


app.include_router(router)
