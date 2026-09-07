from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.simulation import SimulationRequest, SimulationResponse
from app.services.health_service import HealthService
from app.services.simulation_service import SimulationService

router = APIRouter(prefix="/api", tags=["Simulation"])
health_service = HealthService()
simulation_service = SimulationService()


@router.post("/simulate", response_model=SimulationResponse, summary="Illustrative lifestyle what-if")
def simulate(
    payload: SimulationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = health_service.get_profile_or_none(db, current_user)
    result = simulation_service.simulate(profile, payload)
    return SimulationResponse(**result)
