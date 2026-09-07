from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):
    daily_steps: int = Field(ge=0, le=100000)
    sleep_hours: float = Field(ge=0, le=16)
    exercise_minutes: int = Field(ge=0, le=300)
    weight_kg: float = Field(ge=20, le=300)
    water_intake_liters: float = Field(ge=0, le=10)
    sugar_intake: str = Field(min_length=1, max_length=32)


class SimulationResponse(BaseModel):
    current_risk: int
    simulated_risk: int
    improvement: int
    risk_level: str
    message: str
    disclaimer: str = "Illustrative simulation — not medical advice."
