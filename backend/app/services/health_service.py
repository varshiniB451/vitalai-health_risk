from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.health_profile import HealthProfile
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.health import HealthProfileCreate, HealthProfileUpdate


class HealthService:
    def get_profile(self, db: Session, user: User) -> HealthProfile:
        profile = db.scalar(select(HealthProfile).where(HealthProfile.user_id == user.id))
        if profile is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Health profile not found")
        return profile

    def get_profile_or_none(self, db: Session, user: User) -> HealthProfile | None:
        return db.scalar(select(HealthProfile).where(HealthProfile.user_id == user.id))

    def create_profile(self, db: Session, user: User, payload: HealthProfileCreate) -> HealthProfile:
        existing = self.get_profile_or_none(db, user)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Health profile already exists")
        profile = HealthProfile(user_id=user.id, **payload.model_dump())
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    def update_profile(self, db: Session, user: User, payload: HealthProfileUpdate) -> HealthProfile:
        profile = self.get_profile(db, user)
        updates = payload.model_dump(exclude_unset=True)
        if not updates:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid health data")
        for key, value in updates.items():
            setattr(profile, key, value)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    def delete_profile(self, db: Session, user: User) -> None:
        profile = self.get_profile(db, user)
        db.delete(profile)
        db.commit()
