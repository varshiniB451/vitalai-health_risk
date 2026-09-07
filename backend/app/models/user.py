from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    uuid: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        unique=True,
        default=lambda: str(uuid4()),
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Existing relationships
    health_profile = relationship(
        "HealthProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    health_records = relationship(
        "HealthRecord",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    risk_assessments = relationship(
        "RiskAssessment",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    prevention_plans = relationship(
        "PreventionPlan",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    # NEW: User settings
    settings = relationship(
        "UserSettings",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    health_profile = relationship(
        "HealthProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    health_records = relationship(
        "HealthRecord",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    risk_assessments = relationship(
        "RiskAssessment",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    prevention_plans = relationship(
        "PreventionPlan",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    settings = relationship(
        "UserSettings",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )   