# VitalAI Backend (Phase 2)

FastAPI service for the VitalAI health digital twin prototype.

Risk scores are **estimated / illustrative**. This API does **not** diagnose disease and is **not medical advice**.

The Phase 1 React app is unchanged. Frontend integration comes later.

## Requirements

- Python 3.11+
- PostgreSQL 14+ (database name: `health_risk_ai`)
- Optional: Docker Desktop (easiest way to run Postgres on Windows)

This project uses **PostgreSQL only**. It will not fall back to SQLite.

---

## 1. Python setup

```powershell
cd C:\Vars\health-risk-ai\backend
python --version
```

Use Python 3.11 or newer.

## 2. Virtual environment

```powershell
cd C:\Vars\health-risk-ai\backend
python -m venv venv
venv\Scripts\activate
```

## 3. Install dependencies

```powershell
pip install -r requirements.txt
```

## 4. PostgreSQL setup

### Option A — Docker (recommended on this machine)

```powershell
cd C:\Vars\health-risk-ai\backend
docker compose up -d
```

This starts Postgres 16 on port `5432` with:

- user: `postgres`
- password: `password`
- database: `health_risk_ai`

### Option B — Local PostgreSQL

1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. Open SQL Shell (`psql`) or pgAdmin.
3. Create the database:

```sql
CREATE DATABASE health_risk_ai;
```

Windows service example (after install):

```powershell
# Start the Windows service if it exists (name varies by version)
Get-Service *postgres*
Start-Service postgresql-x64-16
```

`psql` example:

```powershell
psql -U postgres -c "CREATE DATABASE health_risk_ai;"
```

## 5. Environment

```powershell
cd C:\Vars\health-risk-ai\backend
copy .env.example .env
```

Edit `.env` if your Postgres credentials differ:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/health_risk_ai
SECRET_KEY=change-this-secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Change `SECRET_KEY` before any shared deployment. Never commit `.env`.

## 6. Database migration

From `backend` with the venv activated:

```powershell
alembic upgrade head
```

Tables created:

- `users`
- `health_profiles`
- `health_records`
- `risk_assessments`
- `prevention_plans`

## 7. Start the backend

```powershell
cd C:\Vars\health-risk-ai\backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

API: http://localhost:8000

## 8. API documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health check: http://localhost:8000/api/health

## 9. Example requests

Register:

```powershell
curl -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d "{\"full_name\":\"Alex\",\"email\":\"alex@example.com\",\"password\":\"password123\"}"
```

Login:

```powershell
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"alex@example.com\",\"password\":\"password123\"}"
```

Use the token:

```
Authorization: Bearer <access_token>
```

Current user:

```powershell
curl http://localhost:8000/api/auth/me -H "Authorization: Bearer <token>"
```

## 10. Authentication flow

1. `POST /api/auth/register` — hashes the password, stores the user.
2. `POST /api/auth/login` — verifies the hash, returns a JWT.
3. Send `Authorization: Bearer <token>` on all protected routes.
4. `GET /api/auth/me` or `GET /api/users/me` returns the current user (never `password_hash`).

Protected resources are always filtered by `user_id`.

---

## API map

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Service health check |
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | JWT login |
| GET | `/api/auth/me` | Yes | Current user |
| GET/PUT | `/api/users/me` | Yes | User profile |
| GET/POST/PUT/DELETE | `/api/health/profile` | Yes | Health profile |
| POST | `/api/predict` | Yes | Estimated risk (rule-based, saved) |
| GET | `/api/explain/latest` | Yes | Factor explanation |
| POST | `/api/simulate` | Yes | What-if (does not save profile) |
| GET | `/api/prevention` | Yes | Prevention plan |
| POST/GET | `/api/tracking` | Yes | Daily records / history |
| GET | `/api/tracking/summary` | Yes | Summary |
| GET | `/api/tracking/streak` | Yes | Streak |

Prediction uses `PredictionService.estimate()` — replace this method in Phase 3 with a trained model. Simulation uses `SimulationService` and never writes the saved profile.

## Tests

```powershell
cd C:\Vars\health-risk-ai\backend
venv\Scripts\activate
pytest
```

Scoring tests always run. Full API tests require PostgreSQL and a successful `alembic upgrade head`.
