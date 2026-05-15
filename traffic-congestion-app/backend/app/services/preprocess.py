from __future__ import annotations

from dataclasses import dataclass
from typing import List, Tuple
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

TARGET_COL = "Congestion Level"


@dataclass
class PreparedData:
    X: pd.DataFrame
    y: pd.Series
    preprocessor: ColumnTransformer
    numeric_features: List[str]
    categorical_features: List[str]



def build_preprocessor(df: pd.DataFrame) -> PreparedData:
    y = df[TARGET_COL]
    X = df.drop(columns=[TARGET_COL, "Timestamp"], errors="ignore")

    categorical_features = [
        c
        for c in X.columns
        if X[c].dtype == "object" or str(X[c].dtype).startswith("category")
    ]
    numeric_features = [c for c in X.columns if c not in categorical_features]

    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features),
        ]
    )

    return PreparedData(
        X=X,
        y=y,
        preprocessor=preprocessor,
        numeric_features=numeric_features,
        categorical_features=categorical_features,
    )


def train_test_split_time(df: pd.DataFrame, test_ratio: float = 0.2) -> Tuple[pd.DataFrame, pd.DataFrame]:
    sorted_df = df.sort_values("Timestamp")
    split_idx = int((1 - test_ratio) * len(sorted_df))
    return sorted_df.iloc[:split_idx].copy(), sorted_df.iloc[split_idx:].copy()
