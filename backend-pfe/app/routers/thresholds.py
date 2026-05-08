from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.threshold import Threshold

router = APIRouter()

@router.get("/")
def list_thresholds(db: Session = Depends(get_db)):
    return db.query(Threshold).all()

@router.post("/")
def create_threshold(
    sensor_id: str = Body(...),
    sensor_name: str = Body(...),
    ligne: str = Body(...),
    min_value: float = Body(None),
    max_value: float = Body(None),
    unit: str = Body(...),
    db: Session = Depends(get_db)
):
    existing = db.query(Threshold).filter(Threshold.sensor_id == sensor_id).first()
    if existing:
        existing.min_value = min_value
        existing.max_value = max_value
        db.commit()
        return {"message": "Seuil mis à jour", "id": existing.id}
    threshold = Threshold(
        sensor_id=sensor_id,
        sensor_name=sensor_name,
        ligne=ligne,
        min_value=min_value,
        max_value=max_value,
        unit=unit
    )
    db.add(threshold)
    db.commit()
    db.refresh(threshold)
    return threshold
