"""Rule-based estimated risk scoring.

Swap `PredictionService.estimate` (or the calculator it calls) with a trained
model in Phase 3 without changing API contracts.
"""

from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.health_profile import HealthProfile
from app.models.risk_assessment import RiskAssessment
from app.models.user import User
from app.models.user_settings import UserSettings
from app.utils.health_calculations import calculate_domain_risks, profile_to_dict


class PredictionService:
    def estimate(self, profile_data: dict[str, Any]) -> dict[str, Any]:
        """Return an estimated, illustrative risk snapshot. Not a diagnosis."""
        return calculate_domain_risks(profile_data)

    def persist(self, db: Session, user: User, result: dict[str, Any]) -> RiskAssessment:
        row = RiskAssessment(
            user_id=user.id,
            overall_risk=result["overall"],
            cardiovascular_risk=result["cardiovascular"],
            diabetes_risk=result["diabetes"],
            hypertension_risk=result["hypertension"],
            lifestyle_risk=result["lifestyle"],
            risk_level=result["risk_level"],
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return row

    def predict_from_inputs(
        self,
        db: Session,
        user: User,
        profile: HealthProfile | None,
        overrides: dict[str, Any],
    ) -> dict[str, Any]:
        if profile is None and not self._complete(overrides):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Health profile not found",
            )
        base = profile_to_dict(profile) if profile is not None else {}
        merged = {**base, **{key: value for key, value in overrides.items() if value is not None}}
        if not self._complete(merged):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid health data")
        result = self.estimate(merged)
        self.persist(db, user, result)
        return {
            "overall_risk": result["overall"],
            "risk_level": result["risk_level"],
            "cardiovascular_risk": result["cardiovascular"],
            "diabetes_risk": result["diabetes"],
            "hypertension_risk": result["hypertension"],
            "lifestyle_risk": result["lifestyle"],
            "health_score": result["health_score"],
        }

    def _complete(self, data: dict[str, Any]) -> bool:
        required = (
            "height_cm",
            "weight_kg",
            "daily_steps",
            "sleep_hours",
            "water_intake_liters",
            "systolic_bp",
            "sugar_intake",
        )
        return all(data.get(key) is not None for key in required)
