from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user

from app.models.user import User
from app.models.user_settings import UserSettings

from app.schemas.user import UserPublic, UserUpdate
from app.schemas.user_settings import (
    UserSettingsPublic,
    UserSettingsUpdate,
)

from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)

service = AuthService()


# =========================================================
# CURRENT USER
# =========================================================

@router.get(
    "/me",
    response_model=UserPublic,
    summary="Get current user profile",
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user


# =========================================================
# UPDATE CURRENT USER
# =========================================================

@router.put(
    "/me",
    response_model=UserPublic,
    summary="Update name or email",
)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.update_user(
        db,
        current_user,
        payload,
    )


# =========================================================
# GET USER SETTINGS
# =========================================================

@router.get(
    "/settings",
    response_model=UserSettingsPublic,
    summary="Get current user settings",
)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    settings = (
        db.query(UserSettings)
        .filter(
            UserSettings.user_id == current_user.id
        )
        .first()
    )

    # Create default settings automatically
    # if this user does not have a settings row yet.
    if settings is None:
        settings = UserSettings(
            user_id=current_user.id,
            notifications=True,
            email_updates=True,
            weekly_summary=True,
            health_reminders=True,
            theme="light",
            data_sharing=False,
        )

        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings


# =========================================================
# UPDATE USER SETTINGS
# =========================================================

@router.put(
    "/settings",
    response_model=UserSettingsPublic,
    summary="Update current user settings",
)
def update_settings(
    payload: UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    settings = (
        db.query(UserSettings)
        .filter(
            UserSettings.user_id == current_user.id
        )
        .first()
    )

    # Create settings if they don't exist.
    if settings is None:
        settings = UserSettings(
            user_id=current_user.id,
            notifications=True,
            email_updates=True,
            weekly_summary=True,
            health_reminders=True,
            theme="light",
            data_sharing=False,
        )

        db.add(settings)
        db.flush()

    # Update only fields actually sent by frontend.
    update_data = payload.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(settings, key, value)

    db.commit()
    db.refresh(settings)

    return settings