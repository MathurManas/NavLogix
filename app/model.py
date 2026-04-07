import os
import json

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml-model", "model_params.json")

def load_model():
    """Fallback simple logic simulating ML model to avoid scikit-learn freeze issues."""
    return {}

def predict_risk(driver_score: float, temperature: float, wind_speed: float = 10.0, humidity: float = 60.0) -> str:
    """Predict route risk using rule-based ML simulation."""
    # Label logic mirroring the original dataset generator:
    # High risk   → 0: bad driver OR extreme weather
    # Moderate    → 1: average driver OR mild weather issue
    # Low risk    → 2: good driver AND good weather
    
    risk_score = 0
    if driver_score < 4:
        risk_score += 3
    elif driver_score < 7:
        risk_score += 1

    if temperature < 0 or temperature > 40:
        risk_score += 3
    elif temperature < 5 or temperature > 35:
        risk_score += 1

    if wind_speed > 60:
        risk_score += 3
    elif wind_speed > 40:
        risk_score += 1

    if humidity > 90:
        risk_score += 1

    # Map the score directly
    if risk_score >= 4:
        return "High"
    elif risk_score >= 2:
        return "Moderate"
    else:
        return "Low"
