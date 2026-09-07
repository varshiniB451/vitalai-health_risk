from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.auth import LoginRequest, RegisterRequest
from app.schemas.user import UserUpdate


class AuthService:
    def register(self, db: Session, payload: RegisterRequest) -> User:
        existing = db.scalar(select(User).where(User.email == payload.email.lower()))
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        user = User(
            full_name=payload.full_name.strip(),
            email=payload.email.lower(),
            password_hash=hash_password(payload.password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def login(self, db: Session, payload: LoginRequest) -> str:
        user = db.scalar(select(User).where(User.email == payload.email.lower()))
        if user is None or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
        return create_access_token(user.id)

    def update_user(self, db: Session, user: User, payload: UserUpdate) -> User:
        data = payload.model_dump(exclude_unset=True)
        if "email" in data:
            email = data["email"].lower()
            taken = db.scalar(select(User).where(User.email == email, User.id != user.id))
            if taken:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
            user.email = email
        if "full_name" in data and data["full_name"] is not None:
            user.full_name = data["full_name"].strip()
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
