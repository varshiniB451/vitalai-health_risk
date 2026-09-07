from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.prevention import PreventionItem
from app.services.health_service import HealthService
from app.services.prevention_service import PreventionService

router = APIRouter(prefix="/api", tags=["Prevention"])
health_service = HealthService()
prevention_service = PreventionService()


@router.get("/prevention", response_model=list[PreventionItem], summary="Personalized prevention recommendations")
def get_prevention(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = health_service.get_profile_or_none(db, current_user)
    return prevention_service.get_or_generate(db, current_user, profile)
