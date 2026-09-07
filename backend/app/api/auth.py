from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.auth import LoginRequest, MessageResponse, RegisterRequest, TokenResponse
from app.schemas.user import UserPublic
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
service = AuthService()


@router.post("/register", response_model=MessageResponse, summary="Register a new user")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    service.register(db, payload)
    return MessageResponse(message="User registered successfully")


@router.post("/login", response_model=TokenResponse, summary="Login and receive a JWT")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token = service.login(db, payload)
    return TokenResponse(access_token=token, token_type="bearer")


@router.get("/me", response_model=UserPublic, summary="Current authenticated user")
def me(current_user: User = Depends(get_current_user)):
    return current_user
