from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.alert_engine import get_active_alerts

router = APIRouter()

@router.get("/active")
def active_alerts(db: Session = Depends(get_db)):
    """Retourne toutes les alertes actives (seuils dépassés)."""
    return get_active_alerts(db)
