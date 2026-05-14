FROM python:3.11-slim

WORKDIR /app

# On augmente le timeout à 100 secondes pour les connexions lentes
COPY requirements.txt .
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt

COPY . .

# Générer les données de simulation au démarrage
RUN python data/generate_data.py || true

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]