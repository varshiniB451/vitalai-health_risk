from typing import Literal

from pydantic import BaseModel, ConfigDict


class UserSettingsPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int

    notifications: bool
    email_updates: bool
    weekly_summary: bool
    health_reminders: bool

    theme: Literal["light", "dark", "system"]

    data_sharing: bool


class UserSettingsUpdate(BaseModel):
    notifications: bool | None = None
    email_updates: bool | None = None
    weekly_summary: bool | None = None
    health_reminders: bool | None = None

    theme: Literal["light", "dark", "system"] | None = None

    data_sharing: bool | None = None