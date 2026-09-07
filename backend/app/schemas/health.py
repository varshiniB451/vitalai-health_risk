from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class HealthProfileBase(BaseModel):
    age: int = Field(ge=1, le=120)
    gender: str = Field(min_length=1, max_length=32)
    height_cm: float = Field(ge=80, le=250)
    weight_kg: float = Field(ge=20, le=300)
    daily_steps: int = Field(ge=0, le=100000)
    exercise_frequency: int = Field(ge=0, le=14)
    exercise_minutes: int = Field(default=25, ge=0, le=300)
    sleep_hours: float = Field(ge=0, le=16)
    water_intake_liters: float = Field(ge=0, le=10)
    smoking: str = Field(min_length=1, max_length=32)
    alcohol_consumption: str = Field(min_length=1, max_length=32)
    systolic_bp: int = Field(ge=70, le=250)
    diastolic_bp: int = Field(ge=40, le=160)
    resting_heart_rate: int = Field(ge=30, le=220)
    family_history: list[str] = Field(default_factory=list)
    existing_conditions: list[str] = Field(default_factory=list)
    fruit_vegetable_intake: int = Field(ge=0, le=20)
    processed_food_frequency: str = Field(min_length=1, max_length=32)
    sugar_intake: str = Field(min_length=1, max_length=32)


class HealthProfileCreate(HealthProfileBase):
    pass


class HealthProfileUpdate(BaseModel):
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


class HealthProfileRead(HealthProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
