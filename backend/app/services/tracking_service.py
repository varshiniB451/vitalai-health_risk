from datetime import date, timedelta

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.models.health_record import HealthRecord
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.tracking import TrackingCreate
from app.services.health_service import HealthService
from app.utils.health_calculations import calculate_health_score, profile_to_dict


class TrackingService:
    def __init__(self) -> None:
        self.health_service = HealthService()

    def create_record(self, db: Session, user: User, payload: TrackingCreate) -> HealthRecord:
        record_date = payload.record_date or date.today()
        score = payload.health_score
        if score is None:
            profile = self.health_service.get_profile_or_none(db, user)
            if profile is not None:
                merged = profile_to_dict(profile)
                merged.update(
                    {
                        "weight_kg": payload.weight_kg,
                        "daily_steps": payload.steps,
                        "sleep_hours": payload.sleep_hours,
                        "exercise_minutes": payload.exercise_minutes,
                        "water_intake_liters": payload.water_intake_liters,
                    }
                )
                score = calculate_health_score(merged)
            else:
                score = 70
        record = HealthRecord(
            user_id=user.id,
            record_date=record_date,
            weight_kg=payload.weight_kg,
            steps=payload.steps,
            sleep_hours=payload.sleep_hours,
            exercise_minutes=payload.exercise_minutes,
            water_intake_liters=payload.water_intake_liters,
            health_score=score,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    def list_records(
        self,
        db: Session,
        user: User,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> list[HealthRecord]:
        stmt: Select[tuple[HealthRecord]] = select(HealthRecord).where(HealthRecord.user_id == user.id)
        if start_date:
            stmt = stmt.where(HealthRecord.record_date >= start_date)
        if end_date:
            stmt = stmt.where(HealthRecord.record_date <= end_date)
        stmt = stmt.order_by(HealthRecord.record_date.asc(), HealthRecord.id.asc())
        return list(db.scalars(stmt).all())

    def summary(self, db: Session, user: User) -> dict:
        records = self.list_records(db, user)
        if not records:
            return {
                "current_health_score": None,
                "previous_health_score": None,
                "improvement_percentage": 0.0,
                "current_weight": None,
                "average_steps": None,
                "average_sleep": None,
                "average_exercise": None,
            }
        current = records[-1]
        previous = records[-2] if len(records) > 1 else None
        window = records[-7:]
        improvement = 0.0
        if previous and previous.health_score:
            improvement = round(
                ((current.health_score - previous.health_score) / previous.health_score) * 100,
                1,
            )
        return {
            "current_health_score": current.health_score,
            "previous_health_score": previous.health_score if previous else None,
            "improvement_percentage": improvement,
            "current_weight": current.weight_kg,
            "average_steps": round(sum(item.steps for item in window) / len(window), 1),
            "average_sleep": round(sum(item.sleep_hours for item in window) / len(window), 2),
            "average_exercise": round(sum(item.exercise_minutes for item in window) / len(window), 1),
        }

    def streak(self, db: Session, user: User) -> dict:
        records = self.list_records(db, user)
        dates = sorted({item.record_date for item in records}, reverse=True)
        if not dates:
            return {"streak_days": 0, "last_record_date": None}

        today = date.today()
        if dates[0] not in {today, today - timedelta(days=1)}:
            return {"streak_days": 0, "last_record_date": dates[0]}

        streak = 1
        cursor = dates[0]
        remaining = dates[1:]
        for item in remaining:
            if cursor - item == timedelta(days=1):
                streak += 1
                cursor = item
            elif item == cursor:
                continue
            else:
                break
        return {"streak_days": streak, "last_record_date": dates[0]}
