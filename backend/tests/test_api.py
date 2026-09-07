import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text

from app.core.config import settings
from app.main import app
from tests.sample import SAMPLE_PROFILE, TODAY_RECORD


def postgres_available() -> bool:
    try:
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


pytestmark = pytest.mark.skipif(
    not postgres_available(),
    reason="PostgreSQL is required for API tests. Start Postgres and run alembic upgrade head.",
)

client = TestClient(app, raise_server_exceptions=False)


def auth_headers(email: str, password: str = "password123") -> dict[str, str]:
    response = client.post("/api/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def unique_user():
    suffix = uuid.uuid4().hex[:10]
    return {
        "full_name": "Alex Rivera",
        "email": f"alex-{suffix}@example.com",
        "password": "password123",
    }


def test_register_login_and_me():
    user = unique_user()
    created = client.post("/api/auth/register", json=user)
    assert created.status_code == 200
    assert created.json()["message"] == "User registered successfully"

    duplicate = client.post("/api/auth/register", json=user)
    assert duplicate.status_code == 409
    assert duplicate.json()["detail"] == "Email already registered"

    headers = auth_headers(user["email"])
    me = client.get("/api/auth/me", headers=headers)
    assert me.status_code == 200
    body = me.json()
    assert body["email"] == user["email"]
    assert "password_hash" not in body

    profile = client.get("/api/users/me", headers=headers)
    assert profile.status_code == 200
    updated = client.put("/api/users/me", headers=headers, json={"full_name": "Alex"})
    assert updated.status_code == 200
    assert updated.json()["full_name"] == "Alex"


def test_health_profile_crud_and_prediction_flow():
    user = unique_user()
    client.post("/api/auth/register", json=user)
    headers = auth_headers(user["email"])

    missing = client.get("/api/health/profile", headers=headers)
    assert missing.status_code == 404
    assert missing.json()["detail"] == "Health profile not found"

    created = client.post("/api/health/profile", headers=headers, json=SAMPLE_PROFILE)
    assert created.status_code == 201
    assert created.json()["daily_steps"] == 7200

    fetched = client.get("/api/health/profile", headers=headers)
    assert fetched.status_code == 200

    updated = client.put("/api/health/profile", headers=headers, json={"daily_steps": 9000})
    assert updated.status_code == 200
    assert updated.json()["daily_steps"] == 9000

    predicted = client.post("/api/predict", headers=headers, json={})
    assert predicted.status_code == 200
    data = predicted.json()
    assert "overall_risk" in data
    assert data["risk_level"] in {"Low", "Moderate", "High"}
    assert "Estimated risk" in data["disclaimer"]

    explanation = client.get("/api/explain/latest", headers=headers)
    assert explanation.status_code == 200
    assert "summary" in explanation.json()
    assert "positive_factors" in explanation.json()

    simulated = client.post(
        "/api/simulate",
        headers=headers,
        json={
            "daily_steps": 9000,
            "sleep_hours": 8,
            "exercise_minutes": 30,
            "weight_kg": 65,
            "water_intake_liters": 2.5,
            "sugar_intake": "low",
        },
    )
    assert simulated.status_code == 200
    sim = simulated.json()
    assert "current_risk" in sim
    assert "simulated_risk" in sim
    assert "illustrative" in sim["message"].lower()

    still_same = client.get("/api/health/profile", headers=headers)
    assert still_same.json()["daily_steps"] == 9000

    plan = client.get("/api/prevention", headers=headers)
    assert plan.status_code == 200
    assert len(plan.json()) >= 5
    categories = {item["category"] for item in plan.json()}
    assert {"Movement", "Nutrition", "Sleep", "Hydration", "Mental Wellness"} <= categories

    tracked = client.post("/api/tracking", headers=headers, json=TODAY_RECORD)
    assert tracked.status_code == 201
    history = client.get("/api/tracking", headers=headers)
    assert history.status_code == 200
    assert len(history.json()) >= 1
    summary = client.get("/api/tracking/summary", headers=headers)
    assert summary.status_code == 200
    streak = client.get("/api/tracking/streak", headers=headers)
    assert streak.status_code == 200
    assert "streak_days" in streak.json()

    deleted = client.delete("/api/health/profile", headers=headers)
    assert deleted.status_code == 204


def test_user_ownership():
    first = unique_user()
    second = unique_user()
    client.post("/api/auth/register", json=first)
    client.post("/api/auth/register", json=second)
    headers_a = auth_headers(first["email"])
    headers_b = auth_headers(second["email"])

    client.post("/api/health/profile", headers=headers_a, json=SAMPLE_PROFILE)
    other = client.get("/api/health/profile", headers=headers_b)
    assert other.status_code == 404
