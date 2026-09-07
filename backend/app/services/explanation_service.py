from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.health_profile import HealthProfile
from app.models.risk_assessment import RiskAssessment
from app.models.user import User
from app.models.user_settings import UserSettings
from app.utils.health_calculations import get_risk_contributions, profile_to_dict


class ExplanationService:
    def explain_latest(self, db: Session, user: User, profile: HealthProfile | None) -> dict:
        if profile is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Health profile not found")

        latest = db.scalar(
            select(RiskAssessment)
            .where(RiskAssessment.user_id == user.id)
            .order_by(RiskAssessment.created_at.desc())
        )
        contributions = get_risk_contributions(profile_to_dict(profile))
        positive = []
        risk_factors = []
        for item in contributions:
            payload = {
                "factor": item["factor"],
                "impact": item["impact"],
                "description": self._description(item),
            }
            if item["impact"] < 0:
                positive.append(payload)
            elif item["impact"] > 0:
                risk_factors.append(payload)

        top_risks = [item["factor"] for item in risk_factors[:2]] or ["your current lifestyle pattern"]
        top_positive = [item["factor"].lower() for item in positive[:2]]
        summary = (
            f"Your estimated risk is mainly influenced by {' and '.join(top_risks).lower()}."
        )
        if top_positive:
            summary += f" {' and '.join(top_positive).capitalize()} currently look protective in this prototype view."
        if latest:
            summary += f" Latest saved estimated overall risk is {int(latest.overall_risk)}% ({latest.risk_level})."

        return {
            "positive_factors": positive,
            "risk_factors": risk_factors,
            "summary": summary,
        }

    def _description(self, item: dict) -> str:
        if item["key"] == "activity" and item["impact"] < 0:
            return "Your activity level is helping reduce estimated risk."
        if item["key"] == "bmi" and item["impact"] > 0:
            return "Your current BMI contributes to estimated risk."
        if item["key"] == "family" and item["impact"] > 0:
            return "Family history can influence estimated risk."
        if item["impact"] < 0:
            return f"{item['factor']} is currently modeled as a protective factor in this prototype."
        return f"{item['factor']} is currently modeled as increasing estimated risk in this prototype."
