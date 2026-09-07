from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.health_service import HealthService
from app.services.prediction_service import PredictionService

router = APIRouter(prefix="/api", tags=["Prediction"])
health_service = HealthService()
prediction_service = PredictionService()


@router.post("/predict", response_model=PredictionResponse, summary="Estimate health risk (prototype scoring)")
def predict(
    payload: PredictionRequest = Body(default_factory=PredictionRequest),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = health_service.get_profile_or_none(db, current_user)
    overrides = payload.model_dump(exclude_unset=True)
    result = prediction_service.predict_from_inputs(db, current_user, profile, overrides)
    return PredictionResponse(**result)
