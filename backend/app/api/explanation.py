from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.prediction import ExplanationResponse
from app.services.explanation_service import ExplanationService
from app.services.health_service import HealthService

router = APIRouter(prefix="/api/explain", tags=["Explanation"])
health_service = HealthService()
explanation_service = ExplanationService()


@router.get("/latest", response_model=ExplanationResponse, summary="Explain latest estimated risk factors")
def explain_latest(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = health_service.get_profile_or_none(db, current_user)
    return explanation_service.explain_latest(db, current_user, profile)
