#!/usr/bin/env python3
"""
Hospital Resource Prediction Model
===================================
Reads historical DailyData (JSON) from stdin.
Trains Linear Regression models for beds, ICU, and ventilators.
Predicts resource needs for the next 5 days based on given patient count.
Outputs prediction JSON to stdout.
"""

import sys
import json
import math
from datetime import datetime, timedelta

try:
    import numpy as np
    from sklearn.linear_model import LinearRegression
    from sklearn.preprocessing import PolynomialFeatures
    from sklearn.pipeline import make_pipeline
except ImportError:
    print(json.dumps({
        "error": "Required Python packages not installed. Run: pip install scikit-learn numpy"
    }))
    sys.exit(1)


def safe_int(value, minimum=0):
    """Clamp prediction to non-negative integer."""
    return max(minimum, int(round(value)))


def train_and_predict(X_train, y_train, X_predict, degree=2):
    """
    Train a polynomial regression model and return predictions.
    Falls back to degree=1 if not enough data for degree=2.
    """
    effective_degree = degree if len(X_train) >= 10 else 1
    model = make_pipeline(PolynomialFeatures(effective_degree), LinearRegression())
    model.fit(X_train, y_train)
    predictions = model.predict(X_predict)
    return predictions


def main():
    try:
        raw_input = sys.stdin.read().strip()
        if not raw_input:
            raise ValueError("No input received from stdin")

        payload = json.loads(raw_input)
        patients_input = int(payload.get("patients", 100))
        historical_data = payload.get("historicalData", [])

        if len(historical_data) < 5:
            raise ValueError(f"Need at least 5 data points, got {len(historical_data)}")

        # ── Build training arrays ─────────────────────────────────────
        X = np.array([[d["patients"]] for d in historical_data], dtype=float)
        y_beds = np.array([d["bedsUsed"] for d in historical_data], dtype=float)
        y_icu = np.array([d["icuUsed"] for d in historical_data], dtype=float)
        y_vent = np.array([d["ventilatorsUsed"] for d in historical_data], dtype=float)

        # ── Simulate next 5 days patient counts (±5% variation) ──────
        patient_forecast = []
        for i in range(1, 6):
            # Simple trend: assume slight daily variation ±3%
            variation = 1 + (0.03 * math.sin(i * 0.5))
            patient_forecast.append([patients_input * variation])

        X_predict = np.array(patient_forecast, dtype=float)

        # ── Predict ───────────────────────────────────────────────────
        pred_beds = train_and_predict(X, y_beds, X_predict)
        pred_icu = train_and_predict(X, y_icu, X_predict)
        pred_vent = train_and_predict(X, y_vent, X_predict)

        # ── Build output ──────────────────────────────────────────────
        today = datetime.utcnow()
        predictions = []
        for i in range(5):
            day = today + timedelta(days=i + 1)
            predictions.append({
                "day": i + 1,
                "date": day.strftime("%Y-%m-%d"),
                "expectedPatients": safe_int(patient_forecast[i][0]),
                "bedsRequired": safe_int(pred_beds[i]),
                "icuRequired": safe_int(pred_icu[i]),
                "ventilatorsRequired": safe_int(pred_vent[i]),
            })

        # ── Summary stats ─────────────────────────────────────────────
        output = {
            "inputPatients": patients_input,
            "predictions": predictions,
            "summary": {
                "avgBedsRequired": safe_int(np.mean(pred_beds)),
                "avgIcuRequired": safe_int(np.mean(pred_icu)),
                "avgVentilatorsRequired": safe_int(np.mean(pred_vent)),
                "peakBedsRequired": safe_int(np.max(pred_beds)),
                "peakIcuRequired": safe_int(np.max(pred_icu)),
                "peakVentilatorsRequired": safe_int(np.max(pred_vent)),
            },
            "modelInfo": {
                "algorithm": "Polynomial Regression (degree 2)",
                "trainingSamples": len(historical_data),
                "generatedAt": datetime.utcnow().isoformat() + "Z",
            },
        }

        print(json.dumps(output))

    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}))
        sys.exit(1)
    except ValueError as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Prediction failed: {str(e)}"}))
        sys.exit(1)


if __name__ == "__main__":
    main()
