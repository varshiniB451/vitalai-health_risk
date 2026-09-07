from app.utils.health_calculations import calculate_domain_risks, calculate_health_score, get_risk_contributions


def test_rule_based_scoring_is_deterministic():
    profile = {
        "height_cm": 168,
        "weight_kg": 72,
        "daily_steps": 7200,
        "exercise_minutes": 25,
        "sleep_hours": 6.5,
        "water_intake_liters": 1.6,
        "smoking": "Never",
        "systolic_bp": 122,
        "family_history": ["Type 2 Diabetes"],
        "sugar_intake": "High",
    }
    first = calculate_domain_risks(profile)
    second = calculate_domain_risks(profile)
    assert first == second
    assert 6 <= first["overall"] <= 72
    assert 28 <= calculate_health_score(profile) <= 96
    assert first["risk_level"] in {"Low", "Moderate", "High"}


def test_contributions_include_protective_and_risk_factors():
    profile = {
        "height_cm": 168,
        "weight_kg": 72,
        "daily_steps": 9000,
        "exercise_minutes": 30,
        "sleep_hours": 8,
        "water_intake_liters": 2.2,
        "smoking": "Never",
        "systolic_bp": 118,
        "family_history": [],
        "sugar_intake": "Low",
    }
    items = get_risk_contributions(profile)
    assert any(item["impact"] < 0 for item in items)
