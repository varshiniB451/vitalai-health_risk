from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app, raise_server_exceptions=False)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "VitalAI Backend"}


def test_docs_available():
    assert client.get("/docs").status_code == 200
    assert client.get("/redoc").status_code == 200
    assert client.get("/openapi.json").status_code == 200


def test_protected_route_requires_auth():
    response = client.get("/api/auth/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required"
