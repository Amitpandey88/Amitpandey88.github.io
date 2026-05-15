from __future__ import annotations

from pathlib import Path
from typing import Dict, Tuple
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier

try:
    from xgboost import XGBClassifier
except Exception:  # pragma: no cover
    XGBClassifier = None

from app.core.config import METADATA_PATH, MODEL_PATH
from app.services.feature_engineering import add_engineered_features
from app.services.preprocess import build_preprocessor, train_test_split_time



def _candidate_models() -> Dict[str, object]:
    models: Dict[str, object] = {
        "logistic_regression": LogisticRegression(max_iter=500, class_weight="balanced"),
        "decision_tree": DecisionTreeClassifier(max_depth=10, class_weight="balanced", random_state=42),
        "random_forest": RandomForestClassifier(
            n_estimators=240, max_depth=16, min_samples_leaf=2, class_weight="balanced_subsample", random_state=42
        ),
    }
    if XGBClassifier:
        models["xgboost"] = XGBClassifier(
            n_estimators=240,
            max_depth=6,
            learning_rate=0.08,
            subsample=0.9,
            colsample_bytree=0.9,
            objective="multi:softprob",
            random_state=42,
            eval_metric="mlogloss",
        )
    return models


def train_and_save(df: pd.DataFrame) -> Dict[str, Dict[str, float]]:
    fe_df = add_engineered_features(df)
    train_df, test_df = train_test_split_time(fe_df)

    train_prepared = build_preprocessor(train_df)
    test_prepared = build_preprocessor(test_df)

    scores: Dict[str, Dict[str, float]] = {}
    best_name = ""
    best_pipeline: Pipeline | None = None
    best_f1 = -1.0

    for name, model in _candidate_models().items():
        pipeline = Pipeline(steps=[("preprocessor", train_prepared.preprocessor), ("model", model)])
        try:
            pipeline.fit(train_prepared.X, train_prepared.y)
            pred = pipeline.predict(test_prepared.X)
            acc = accuracy_score(test_prepared.y, pred)
            f1 = f1_score(test_prepared.y, pred, average="weighted")
            scores[name] = {"accuracy": float(acc), "f1": float(f1)}
            if f1 > best_f1:
                best_f1 = f1
                best_name = name
                best_pipeline = pipeline
        except Exception:
            continue

    assert best_pipeline is not None
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(best_pipeline, MODEL_PATH)

    test_pred = best_pipeline.predict(test_prepared.X)
    report = classification_report(test_prepared.y, test_pred, output_dict=True)
    metadata = {
        "best_model": best_name,
        "scores": scores,
        "classes": sorted(pd.Series(fe_df["Congestion Level"]).unique().tolist()),
        "classification_report": report,
        "feature_columns": train_prepared.X.columns.tolist(),
    }
    joblib.dump(metadata, METADATA_PATH)
    return scores


def load_model_and_metadata() -> Tuple[Pipeline, Dict]:
    if not MODEL_PATH.exists() or not METADATA_PATH.exists():
        raise FileNotFoundError("Model artifacts not found. Run training script first.")
    model = joblib.load(MODEL_PATH)
    metadata = joblib.load(METADATA_PATH)
    return model, metadata


def predict_with_confidence(model: Pipeline, df: pd.DataFrame) -> Tuple[str, float]:
    probabilities = model.predict_proba(df)[0]
    classes = model.classes_
    idx = int(np.argmax(probabilities))
    return str(classes[idx]), float(probabilities[idx])
