from app.database.connection import engine, Base
from app.models import sensor, incident, threshold
from app.services.sensor_service import load_csv_to_db

def create_tables():
    Base.metadata.create_all(bind=engine)
    load_csv_to_db()
