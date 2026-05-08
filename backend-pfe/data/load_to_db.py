import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import csv
from datetime import datetime, timezone
from app.database.connection import SessionLocal
from app.models.sensor import SensorReading

BATCH_SIZE = 1000

db = SessionLocal()

with open("data/capteurs.csv", newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)

    batch = []
    count = 0

    for row in reader:
        # Conversion timestamp string -> datetime UTC
        ts = datetime.strptime(row["timestamp"], "%Y-%m-%d %H:%M")
        ts = ts.replace(tzinfo=timezone.utc)

        sensor = SensorReading(
            timestamp=ts,
            ligne=row["ligne"],
            sensor_id=row["sensor_id"],
            sensor_name=row.get("sensor_name", "Unknown"),
            value=float(row["value"]),
            unit=row.get("unit", "")
        )
        batch.append(sensor)
        count += 1

        if count % BATCH_SIZE == 0:
            db.bulk_save_objects(batch)
            db.commit()
            batch = []
            print(f"{count} inserees...")

    if batch:
        db.bulk_save_objects(batch)
        db.commit()

db.close()
print(f"Termine - {count} mesures inserees dans la base")