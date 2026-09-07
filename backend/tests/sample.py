from datetime import date

SAMPLE_PROFILE = {
    "age": 32,
    "gender": "Female",
    "height_cm": 168,
    "weight_kg": 72,
    "daily_steps": 7200,
    "exercise_frequency": 3,
    "exercise_minutes": 25,
    "sleep_hours": 6.5,
    "water_intake_liters": 1.6,
    "smoking": "Never",
    "alcohol_consumption": "Occasional",
    "systolic_bp": 122,
    "diastolic_bp": 78,
    "resting_heart_rate": 72,
    "family_history": ["Type 2 Diabetes"],
    "existing_conditions": [],
    "fruit_vegetable_intake": 3,
    "processed_food_frequency": "Often",
    "sugar_intake": "High",
}

TODAY_RECORD = {
    "record_date": date.today().isoformat(),
    "weight_kg": 72,
    "steps": 7200,
    "sleep_hours": 6.5,
    "exercise_minutes": 25,
    "water_intake_liters": 1.6,
}
