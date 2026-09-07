from __future__ import annotations

from typing import Any


def clamp(value: float, min_value: float, max_value: float) -> float:
    return min(max_value, max(min_value, value))


def calc_bmi(weight_kg: float, height_cm: float) -> float:
    height_m = float(height_cm) / 100
    if not height_m or not weight_kg:
        return 0.0
    return round(float(weight_kg) / (height_m * height_m), 1)


def normalize_sugar(value: str | None) -> str:
    if not value:
        return "Moderate"
    lowered = value.strip().lower()
    if lowered in {"low", "high", "moderate"}:
        return lowered.title()
    return value


def risk_level_from_percent(percent: float) -> str:
    if percent < 20:
        return "Low"
    if percent < 40:
        return "Moderate"
    return "High"


def profile_to_dict(profile: Any) -> dict[str, Any]:
    if isinstance(profile, dict):
        data = dict(profile)
    else:
        data = {
            "age": profile.age,
            "gender": profile.gender,
            "height_cm": profile.height_cm,
            "weight_kg": profile.weight_kg,
            "daily_steps": profile.daily_steps,
            "exercise_frequency": profile.exercise_frequency,
            "exercise_minutes": getattr(profile, "exercise_minutes", 25),
            "sleep_hours": profile.sleep_hours,
            "water_intake_liters": profile.water_intake_liters,
            "smoking": profile.smoking,
            "alcohol_consumption": profile.alcohol_consumption,
            "systolic_bp": profile.systolic_bp,
            "diastolic_bp": profile.diastolic_bp,
            "resting_heart_rate": profile.resting_heart_rate,
            "family_history": list(profile.family_history or []),
            "existing_conditions": list(profile.existing_conditions or []),
            "fruit_vegetable_intake": profile.fruit_vegetable_intake,
            "processed_food_frequency": profile.processed_food_frequency,
            "sugar_intake": profile.sugar_intake,
        }
    data["sugar_intake"] = normalize_sugar(data.get("sugar_intake"))
    data["family_history"] = list(data.get("family_history") or [])
    data["exercise_minutes"] = int(data.get("exercise_minutes") or 25)
    return data


def calculate_health_score(profile: Any) -> int:
    data = profile_to_dict(profile)
    bmi = calc_bmi(data["weight_kg"], data["height_cm"])
    score = 78.0

    if 18.5 <= bmi < 25:
        score += 6
    elif 25 <= bmi < 30:
        score -= 6
    elif bmi >= 30:
        score -= 12
    else:
        score -= 4

    score += clamp((data["daily_steps"] - 6000) / 400, -8, 8)
    score += clamp((data["sleep_hours"] - 7) * 4, -8, 6)
    score += clamp((data["exercise_minutes"] - 20) / 8, -6, 6)
    score += clamp((data["water_intake_liters"] - 2) * 3, -5, 4)

    sugar = data["sugar_intake"]
    if sugar == "High":
        score -= 7
    elif sugar == "Moderate":
        score -= 3
    else:
        score += 2

    smoking = str(data.get("smoking") or "")
    if smoking == "Current":
        score -= 10
    elif smoking == "Former":
        score -= 3

    score -= len(data["family_history"]) * 2
    return int(round(clamp(score, 28, 96)))


def calculate_overall_risk(profile: Any) -> int:
    data = profile_to_dict(profile)
    bmi = calc_bmi(data["weight_kg"], data["height_cm"])
    risk = 18.0
    family = data["family_history"]

    if bmi >= 25:
        risk += (bmi - 25) * 1.4
    if bmi >= 30:
        risk += 4
    if "Heart disease" in family:
        risk += 7
    if "Type 2 Diabetes" in family:
        risk += 6
    if "Hypertension" in family:
        risk += 5
    if data["sugar_intake"] == "High":
        risk += 6
    if data["sugar_intake"] == "Moderate":
        risk += 3
    if data["daily_steps"] < 7000:
        risk += (7000 - data["daily_steps"]) / 900
    if data["sleep_hours"] < 7:
        risk += (7 - data["sleep_hours"]) * 2.2
    if data["water_intake_liters"] < 2:
        risk += (2 - data["water_intake_liters"]) * 2
    if data["exercise_minutes"] < 30:
        risk += (30 - data["exercise_minutes"]) / 10
    if data.get("smoking") == "Current":
        risk += 10
    if data["systolic_bp"] >= 130:
        risk += 5

    risk -= clamp((data["daily_steps"] - 8000) / 1200, 0, 5)
    if 7 <= data["sleep_hours"] <= 8.5:
        risk -= 3
    if data["exercise_minutes"] >= 30:
        risk -= 3

    return int(round(clamp(risk, 6, 72)))


def calculate_domain_risks(profile: Any) -> dict[str, int]:
    data = profile_to_dict(profile)
    overall = calculate_overall_risk(data)
    bmi = calc_bmi(data["weight_kg"], data["height_cm"])
    family = data["family_history"]

    heart = clamp(
        overall * 0.85
        + (4 if bmi > 25 else 0)
        + (8 if "Heart disease" in family else 0)
        - (4 if data["daily_steps"] > 8000 else 0),
        5,
        80,
    )
    diabetes = clamp(
        overall * 0.9
        + (8 if bmi > 27 else 2)
        + (10 if "Type 2 Diabetes" in family else 0)
        + (8 if data["sugar_intake"] == "High" else 0),
        8,
        85,
    )
    hypertension = clamp(
        overall * 0.8
        + (10 if data["systolic_bp"] >= 130 else 0)
        + (7 if "Hypertension" in family else 0),
        6,
        80,
    )
    lifestyle = clamp(
        12
        + (10 if data["daily_steps"] < 6000 else 0)
        + (8 if data["sleep_hours"] < 6.5 else 0)
        + (9 if data["sugar_intake"] == "High" else 0)
        + (5 if data["water_intake_liters"] < 1.5 else 0)
        - (6 if data["exercise_minutes"] >= 30 else 0),
        5,
        70,
    )
    return {
        "overall": overall,
        "cardiovascular": int(round(heart)),
        "diabetes": int(round(diabetes)),
        "hypertension": int(round(hypertension)),
        "lifestyle": int(round(lifestyle)),
        "health_score": calculate_health_score(data),
        "risk_level": risk_level_from_percent(overall),
    }


def get_risk_contributions(profile: Any) -> list[dict[str, Any]]:
    data = profile_to_dict(profile)
    bmi = calc_bmi(data["weight_kg"], data["height_cm"])
    items: list[dict[str, Any]] = []

    bmi_impact = round((bmi - 24) * 3.2) if bmi >= 25 else round((24.5 - bmi) * -1.5)
    items.append({"key": "bmi", "factor": "BMI", "impact": int(bmi_impact), "detail": f"{bmi} kg/m²"})

    family = data["family_history"]
    family_impact = len(family) * 7 + 8 if family else -2
    items.append(
        {
            "key": "family",
            "factor": "Family history",
            "impact": int(family_impact),
            "detail": ", ".join(family) if family else "None reported",
        }
    )

    sugar = data["sugar_intake"]
    sugar_impact = 11 if sugar == "High" else 5 if sugar == "Moderate" else -4
    items.append({"key": "sugar", "factor": "Sugar intake", "impact": sugar_impact, "detail": sugar})

    sleep_impact = -8 if data["sleep_hours"] >= 7 else round((7 - data["sleep_hours"]) * 4)
    items.append(
        {"key": "sleep", "factor": "Sleep", "impact": int(sleep_impact), "detail": f"{data['sleep_hours']} hrs"}
    )

    activity_impact = -12 if data["daily_steps"] >= 8000 else round((8000 - data["daily_steps"]) / 450)
    items.append(
        {
            "key": "activity",
            "factor": "Regular activity",
            "impact": int(activity_impact),
            "detail": f"{int(data['daily_steps']):,} steps",
        }
    )

    water_impact = -5 if data["water_intake_liters"] >= 2 else round((2 - data["water_intake_liters"]) * 4)
    items.append(
        {
            "key": "water",
            "factor": "Hydration",
            "impact": int(water_impact),
            "detail": f"{data['water_intake_liters']} L",
        }
    )
    return sorted(items, key=lambda item: item["impact"], reverse=True)
