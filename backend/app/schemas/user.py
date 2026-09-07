from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: str
    full_name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    full_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=120,
    )

    email: EmailStr | None = None


class UserSettingsPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    notifications: bool
    email_updates: bool
    weekly_summary: bool
    health_reminders: bool
    theme: str
    data_sharing: bool


class UserSettingsUpdate(BaseModel):
    notifications: bool | None = None
    email_updates: bool | None = None
    weekly_summary: bool | None = None
    health_reminders: bool | None = None
    theme: str | None = Field(
        default=None,
        pattern="^(light|dark|system)$",
    )
    data_sharing: bool | None = None