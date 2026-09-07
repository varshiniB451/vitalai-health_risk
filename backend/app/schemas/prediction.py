from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """Health inputs for an estimated risk snapshot. Missing fields use the saved profile."""

    age: int | None = Field(default=None, ge=1, le=120)
    gender: str | None = None
    height_cm: float | None = Field(default=None, ge=80, le=250)
    weight_kg: float | None = Field(default=None, ge=20, le=300)
    daily_steps: int | None = Field(default=None, ge=0, le=100000)
    exercise_frequency: int | None = Field(default=None, ge=0, le=14)
    exercise_minutes: int | None = Field(default=None, ge=0, le=300)
    sleep_hours: float | None = Field(default=None, ge=0, le=16)
    water_intake_liters: float | None = Field(default=None, ge=0, le=10)
    smoking: str | None = None
    alcohol_consumption: str | None = None
    systolic_bp: int | None = Field(default=None, ge=70, le=250)
    diastolic_bp: int | None = Field(default=None, ge=40, le=160)
    resting_heart_rate: int | None = Field(default=None, ge=30, le=220)
    family_history: list[str] | None = None
    existing_conditions: list[str] | None = None
    fruit_vegetable_intake: int | None = Field(default=None, ge=0, le=20)
    processed_food_frequency: str | None = None
    sugar_intake: str | None = None


class PredictionResponse(BaseModel):
    overall_risk: int
    risk_level: str
    cardiovascular_risk: int
    diabetes_risk: int
    hypertension_risk: int
    lifestyle_risk: int
    health_score: int
    disclaimer: str = "Estimated risk for educational use. Prototype result — not medical advice."


class ExplanationFactor(BaseModel):
    factor: str
    impact: int
    description: str


class ExplanationResponse(BaseModel):
    positive_factors: list[ExplanationFactor]
    risk_factors: list[ExplanationFactor]
    summary: str
    disclaimer: str = "Illustrative prototype explanation. Not a diagnosis or medical advice."
