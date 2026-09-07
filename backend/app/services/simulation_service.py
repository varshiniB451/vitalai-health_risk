from fastapi import HTTPException, status

from app.models.health_profile import HealthProfile
from app.schemas.simulation import SimulationRequest
from app.utils.health_calculations import calculate_domain_risks, profile_to_dict, risk_level_from_percent


class SimulationService:
    """Lifestyle what-if estimates. Never writes the saved health profile."""

    def simulate(self, profile: HealthProfile | None, payload: SimulationRequest) -> dict:
        if profile is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Health profile not found")

        current = calculate_domain_risks(profile_to_dict(profile))
        hypothetical = profile_to_dict(profile)
        hypothetical.update(
            {
                "daily_steps": payload.daily_steps,
                "sleep_hours": payload.sleep_hours,
                "exercise_minutes": payload.exercise_minutes,
                "weight_kg": payload.weight_kg,
                "water_intake_liters": payload.water_intake_liters,
                "sugar_intake": payload.sugar_intake,
            }
        )
        simulated = calculate_domain_risks(hypothetical)
        current_risk = current["overall"]
        simulated_risk = simulated["overall"]
        improvement = current_risk - simulated_risk
        return {
            "current_risk": current_risk,
            "simulated_risk": simulated_risk,
            "improvement": improvement,
            "risk_level": risk_level_from_percent(simulated_risk),
            "message": "This is an illustrative lifestyle simulation.",
        }
