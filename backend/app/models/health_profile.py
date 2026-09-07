from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class HealthProfile(Base):
    __tablename__ = "health_profiles"
    __table_args__ = (UniqueConstraint("user_id", name="uq_health_profiles_user_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str] = mapped_column(String(32), nullable=False)
    height_cm: Mapped[float] = mapped_column(Float, nullable=False)
    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    daily_steps: Mapped[int] = mapped_column(Integer, nullable=False)
    exercise_frequency: Mapped[int] = mapped_column(Integer, nullable=False)
    exercise_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=25)
    sleep_hours: Mapped[float] = mapped_column(Float, nullable=False)
    water_intake_liters: Mapped[float] = mapped_column(Float, nullable=False)
    smoking: Mapped[str] = mapped_column(String(32), nullable=False)
    alcohol_consumption: Mapped[str] = mapped_column(String(32), nullable=False)
    systolic_bp: Mapped[int] = mapped_column(Integer, nullable=False)
    diastolic_bp: Mapped[int] = mapped_column(Integer, nullable=False)
    resting_heart_rate: Mapped[int] = mapped_column(Integer, nullable=False)
    family_history: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    existing_conditions: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    fruit_vegetable_intake: Mapped[int] = mapped_column(Integer, nullable=False)
    processed_food_frequency: Mapped[str] = mapped_column(String(32), nullable=False)
    sugar_intake: Mapped[str] = mapped_column(String(32), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user = relationship("User", back_populates="health_profile")
