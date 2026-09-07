from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UserSettings(Base):
    __tablename__ = "user_settings"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    notifications: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    email_updates: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    weekly_summary: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    health_reminders: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    theme: Mapped[str] = mapped_column(
        String(20),
        default="light",
        nullable=False,
    )

    data_sharing: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="settings",
    )