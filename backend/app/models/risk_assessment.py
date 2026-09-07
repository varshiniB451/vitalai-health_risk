from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    overall_risk: Mapped[float] = mapped_column(Float, nullable=False)
    cardiovascular_risk: Mapped[float] = mapped_column(Float, nullable=False)
    diabetes_risk: Mapped[float] = mapped_column(Float, nullable=False)
    hypertension_risk: Mapped[float] = mapped_column(Float, nullable=False)
    lifestyle_risk: Mapped[float] = mapped_column(Float, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(32), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="risk_assessments")
