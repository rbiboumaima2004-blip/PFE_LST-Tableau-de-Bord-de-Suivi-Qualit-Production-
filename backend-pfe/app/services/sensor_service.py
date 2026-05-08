import csv
import os
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.sensor import SensorReading
from app.database.connection import SessionLocal

CSV_PATH = "/app/data/capteurs.csv"


def load_csv_to_db():
    db = SessionLocal()
    try:
        if not os.path.exists(CSV_PATH):
            print(f"CSV introuvable: {CSV_PATH}")
            return
        with open(CSV_PATH, newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                try:
                    ts = datetime.strptime(row["timestamp"], "%Y-%m-%d %H:%M")
                except ValueError:
                    try:
                        ts = datetime.strptime(row["timestamp"], "%Y-%m-%dT%H:%M")
                    except ValueError:
                        continue
                reading = SensorReading(
                    timestamp=ts,
                    ligne=row["ligne"],
                    sensor_id=row["sensor_id"],
                    sensor_name=row["sensor_name"],
                    value=float(row["value"]),
                    unit=row["unit"]
                )
                db.add(reading)
                if i % 1000 == 0:
                    db.commit()
        db.commit()
        print("CSV charge avec succes")
    except Exception as e:
        print(f"Erreur chargement CSV: {e}")
        db.rollback()
    finally:
        db.close()


def get_live_readings(db: Session, ligne: str = None):
    subq = (
        db.query(
            SensorReading.sensor_id,
            SensorReading.ligne,
            func.max(SensorReading.timestamp).label("max_ts")
        )
        .group_by(SensorReading.sensor_id, SensorReading.ligne)
        .subquery()
    )
    q = db.query(SensorReading).join(
        subq,
        (SensorReading.sensor_id == subq.c.sensor_id) &
        (SensorReading.ligne == subq.c.ligne) &
        (SensorReading.timestamp == subq.c.max_ts)
    )
    if ligne:
        q = q.filter(SensorReading.ligne == ligne)
    results = q.all()
    return [
        {
            "id": r.id,
            "timestamp": r.timestamp.isoformat(),
            "ligne": r.ligne,
            "sensor_id": r.sensor_id,
            "sensor_name": r.sensor_name,
            "value": r.value,
            "unit": r.unit
        }
        for r in results
    ]


def get_historical_readings(db: Session, sensor_id: str, limit: int = 100):
    results = (
        db.query(SensorReading)
        .filter(SensorReading.sensor_id == sensor_id)
        .order_by(SensorReading.timestamp.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "timestamp": r.timestamp.isoformat(),
            "value": r.value,
            "unit": r.unit
        }
        for r in results
    ]