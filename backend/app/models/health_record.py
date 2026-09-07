from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class HealthRecord(Base):
    __tablename__ = "health_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    record_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    steps: Mapped[int] = mapped_column(Integer, nullable=False)
    sleep_hours: Mapped[float] = mapped_column(Float, nullable=False)
    exercise_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    water_intake_liters: Mapped[float] = mapped_column(Float, nullable=False)
    health_score: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="health_records")
