"""
alert_engine.py
---------------
Compare les dernières valeurs capteurs avec les seuils configurés.
Crée automatiquement des incidents si un seuil est franchi.
"""
from sqlalchemy.orm import Session
from app.models.sensor import SensorReading
from app.models.threshold import Threshold
from app.models.incident import Incident
from app.services.sensor_service import get_live_readings

def get_active_alerts(db: Session):
    """
    Compare live readings vs thresholds.
    Retourne les alertes actives et crée des incidents si nécessaire.
    """
    live = get_live_readings(db)
    thresholds = {t.sensor_id: t for t in db.query(Threshold).filter(Threshold.is_active == True).all()}
    alerts = []

    for reading in live:
        sid = reading["sensor_id"]
        if sid not in thresholds:
            continue
        thr = thresholds[sid]
        breached = False
        severity = "AVERTISSEMENT"

        if thr.max_value is not None and reading["value"] > thr.max_value:
            breached = True
            severity = "CRITIQUE" if reading["value"] > thr.max_value * 1.1 else "AVERTISSEMENT"
            description = (
                f"Valeur {reading['value']} {reading['unit']} dépasse le seuil max {thr.max_value} {thr.unit}"
            )
        elif thr.min_value is not None and reading["value"] < thr.min_value:
            breached = True
            description = (
                f"Valeur {reading['value']} {reading['unit']} en dessous du seuil min {thr.min_value} {thr.unit}"
            )

        if breached:
            alerts.append({
                "sensor_id": sid,
                "sensor_name": reading["sensor_name"],
                "ligne": reading["ligne"],
                "value": reading["value"],
                "unit": reading["unit"],
                "severity": severity,
                "description": description,
                "timestamp": reading["timestamp"]
            })
            # Créer incident si pas déjà ouvert
            existing = db.query(Incident).filter(
                Incident.sensor_id == sid,
                Incident.status == "OUVERT"
            ).first()
            if not existing:
                incident = Incident(
                    ligne=reading["ligne"],
                    sensor_id=sid,
                    sensor_name=reading["sensor_name"],
                    value=str(reading["value"]),
                    threshold_value=str(thr.max_value or thr.min_value),
                    severity=severity,
                    description=description
                )
                db.add(incident)
                db.commit()

    return alerts
