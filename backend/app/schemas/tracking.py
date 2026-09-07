from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class TrackingCreate(BaseModel):
    record_date: date | None = None
    weight_kg: float = Field(ge=20, le=300)
    steps: int = Field(ge=0, le=100000)
    sleep_hours: float = Field(ge=0, le=16)
    exercise_minutes: int = Field(ge=0, le=300)
    water_intake_liters: float = Field(ge=0, le=10)
    health_score: int | None = Field(default=None, ge=0, le=100)


class TrackingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    record_date: date
    weight_kg: float
    steps: int
    sleep_hours: float
    exercise_minutes: int
    water_intake_liters: float
    health_score: int
    created_at: datetime


class TrackingSummary(BaseModel):
    current_health_score: int | None
    previous_health_score: int | None
    improvement_percentage: float
    current_weight: float | None
    average_steps: float | None
    average_sleep: float | None
    average_exercise: float | None


class TrackingStreak(BaseModel):
    streak_days: int
    last_record_date: date | None
