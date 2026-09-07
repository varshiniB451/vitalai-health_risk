from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PreventionItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    category: str
    title: str
    description: str
    target: str
    progress: int = Field(ge=0, le=100)
    completed: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None
