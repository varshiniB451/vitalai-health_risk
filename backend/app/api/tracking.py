from datetime import date

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.tracking import TrackingCreate, TrackingRead, TrackingStreak, TrackingSummary
from app.services.tracking_service import TrackingService

router = APIRouter(prefix="/api/tracking", tags=["Tracking"])
service = TrackingService()


@router.post("", response_model=TrackingRead, status_code=status.HTTP_201_CREATED, summary="Log a daily health record")
def create_tracking(
    payload: TrackingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.create_record(db, current_user, payload)


@router.get("", response_model=list[TrackingRead], summary="List health history")
def list_tracking(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.list_records(db, current_user, start_date, end_date)


@router.get("/summary", response_model=TrackingSummary, summary="Tracking summary metrics")
def tracking_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.summary(db, current_user)


@router.get("/streak", response_model=TrackingStreak, summary="Current tracking streak")
def tracking_streak(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.streak(db, current_user)
