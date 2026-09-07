from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.health_profile import HealthProfile
from app.models.prevention import PreventionPlan
from app.models.user import User
from app.models.user_settings import UserSettings
from app.utils.health_calculations import calc_bmi, profile_to_dict


class PreventionService:
    def get_or_generate(self, db: Session, user: User, profile: HealthProfile | None) -> list[PreventionPlan]:
        existing = list(
            db.scalars(select(PreventionPlan).where(PreventionPlan.user_id == user.id)).all()
        )
        templates = self._templates(profile)
        by_title = {row.title: row for row in existing}

        results: list[PreventionPlan] = []
        for item in templates:
            row = by_title.get(item["title"])
            if row is None:
                row = PreventionPlan(user_id=user.id, **item)
                db.add(row)
            else:
                if not row.completed:
                    row.description = item["description"]
                    row.target = item["target"]
                    row.progress = item["progress"]
                    row.category = item["category"]
            results.append(row)
        db.commit()
        for row in results:
            db.refresh(row)
        return results

    def _templates(self, profile: HealthProfile | None) -> list[dict]:
        data = profile_to_dict(profile) if profile is not None else {}
        steps = int(data.get("daily_steps") or 5000)
        sleep = float(data.get("sleep_hours") or 6)
        water = float(data.get("water_intake_liters") or 1.2)
        sugar = str(data.get("sugar_intake") or "High")
        bmi = calc_bmi(float(data.get("weight_kg") or 72), float(data.get("height_cm") or 168))

        return [
            {
                "category": "Movement",
                "title": "Walk 30 minutes",
                "description": "Aim for regular daily movement. Prototype suggestion based on your activity pattern.",
                "target": "8000 steps/day",
                "progress": min(100, int(steps / 80)),
                "completed": False,
            },
            {
                "category": "Movement",
                "title": "8,000 steps/day",
                "description": "Build volume gradually from your current step baseline.",
                "target": "8000 steps/day",
                "progress": min(100, int((steps / 8000) * 100)),
                "completed": False,
            },
            {
                "category": "Nutrition",
                "title": "Increase vegetables",
                "description": "Add produce at lunch and dinner. Illustrative nutrition target.",
                "target": "5 servings",
                "progress": min(100, int((data.get("fruit_vegetable_intake") or 2) / 5 * 100)),
                "completed": False,
            },
            {
                "category": "Nutrition",
                "title": "Reduce processed sugar",
                "description": "Swap one sweetened drink for water or unsweetened tea.",
                "target": "Low sugar days",
                "progress": 35 if sugar == "High" else 60 if sugar == "Moderate" else 85,
                "completed": False,
            },
            {
                "category": "Sleep",
                "title": "Target 7–8 hours",
                "description": "Protect a consistent wind-down window before 11 PM.",
                "target": "7–8 hrs",
                "progress": min(100, int((sleep / 7.5) * 100)),
                "completed": False,
            },
            {
                "category": "Hydration",
                "title": "2L / day",
                "description": "Keep a bottle visible during work blocks.",
                "target": "2 liters",
                "progress": min(100, int((water / 2) * 100)),
                "completed": False,
            },
            {
                "category": "Mental Wellness",
                "title": "10 minute mindfulness",
                "description": "A short breathing reset. Supportive lifestyle suggestion, not treatment.",
                "target": "10 min",
                "progress": 20 if bmi >= 25 else 40,
                "completed": False,
            },
        ]
