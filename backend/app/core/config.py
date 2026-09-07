from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/health_risk_ai"
    SECRET_KEY: str = "change-this-secret"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    FRONTEND_URL: str = "http://localhost:8000"
    CORS_ORIGINS: str = "http://localhost:8000,http://127.0.0.1:8000,http://localhost:5173,http://127.0.0.1:5173"
    ALGORITHM: str = "HS256"

    @property
    def cors_origin_list(self) -> list[str]:
        origins = [item.strip() for item in self.CORS_ORIGINS.split(",") if item.strip()]
        if self.FRONTEND_URL and self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)
        return origins


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
