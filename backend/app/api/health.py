from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.health import HealthProfileCreate, HealthProfileRead, HealthProfileUpdate
from app.services.health_service import HealthService

router = APIRouter(prefix="/api/health", tags=["Health Profile"])
service = HealthService()


@router.get("/profile", response_model=HealthProfileRead, summary="Get saved health profile")
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.get_profile(db, current_user)


@router.post(
    "/profile",
    response_model=HealthProfileRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create health profile",
)
def create_profile(
    payload: HealthProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.create_profile(db, current_user, payload)


@router.put("/profile", response_model=HealthProfileRead, summary="Update health profile")
def update_profile(
    payload: HealthProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.update_profile(db, current_user, payload)


@router.delete("/profile", status_code=status.HTTP_204_NO_CONTENT, summary="Delete health profile")
def delete_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service.delete_profile(db, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
