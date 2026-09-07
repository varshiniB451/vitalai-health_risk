from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

if not settings.DATABASE_URL.startswith("postgresql"):
    raise RuntimeError(
        "VitalAI requires PostgreSQL. Set DATABASE_URL to a postgresql:// connection string. "
        "Do not use SQLite or another engine for this project."
    )

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
