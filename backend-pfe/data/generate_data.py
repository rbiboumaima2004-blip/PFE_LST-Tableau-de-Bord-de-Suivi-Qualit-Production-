"""
generate_data.py
----------------
Lit le fichier mesures_pfe_filled.xlsx et génère capteurs.csv
avec des données simulées sur 30 jours basées sur les vraies mesures OCP.
"""
import pandas as pd
import numpy as np
import csv
import os
from datetime import datetime, timedelta
import random

# Données extraites du vrai fichier Excel OCP
SENSORS = [
    # PN (Pré-Neutraliseur)
    {"sensor_id": "FIC-001", "sensor_name": "ACP 29% vers PN", "ligne": "PN", "unit": "m3/h", "base_value": 95.4, "noise": 5},
    {"sensor_id": "FIC-002", "sensor_name": "Liquide Lavage AD01 vers PN", "ligne": "PN", "unit": "m3/h", "base_value": 18.11, "noise": 2},
    {"sensor_id": "FIC-003", "sensor_name": "ACP 54% vers PN", "ligne": "PN", "unit": "m3/h", "base_value": 45.73, "noise": 3},
    {"sensor_id": "FIC-004", "sensor_name": "H2SO4 vers PN", "ligne": "PN", "unit": "m3/h", "base_value": 14.76, "noise": 1.5},
    {"sensor_id": "FIC-028", "sensor_name": "Pulpe vers PN", "ligne": "PN", "unit": "m3/h", "base_value": 210.72, "noise": 15},
    {"sensor_id": "FIC-008", "sensor_name": "NH3 GAZ vers PN", "ligne": "PN", "unit": "T/h", "base_value": 6.46, "noise": 0.5},
    {"sensor_id": "TI-027", "sensor_name": "Temp Bouille", "ligne": "PN", "unit": "°C", "base_value": 108.69, "noise": 3},
    # Granulateur
    {"sensor_id": "FIC-033", "sensor_name": "Bouille AP01", "ligne": "Granulateur", "unit": "T/h", "base_value": 58.15, "noise": 4},
    {"sensor_id": "FIC-043", "sensor_name": "Bouille KP01", "ligne": "Granulateur", "unit": "T/h", "base_value": 32.89, "noise": 3},
    {"sensor_id": "FIC-072", "sensor_name": "NH3 Liquide vers AM03", "ligne": "Granulateur", "unit": "T/h", "base_value": 2.05, "noise": 0.3},
    {"sensor_id": "FIC-053A", "sensor_name": "ACP 54% vers AM03", "ligne": "Granulateur", "unit": "m3/h", "base_value": 6.83, "noise": 0.5},
    # Lavage
    {"sensor_id": "FIC-500", "sensor_name": "Liquide Lavage AR02 vers AD01", "ligne": "Lavage", "unit": "m3/h", "base_value": 118.1, "noise": 10},
    {"sensor_id": "TI-504", "sensor_name": "Temp AD01", "ligne": "Lavage", "unit": "°C", "base_value": 68.95, "noise": 2},
    {"sensor_id": "LIC-503", "sensor_name": "Niveau AD01", "ligne": "Lavage", "unit": "%", "base_value": 47.25, "noise": 5},
    {"sensor_id": "PDI-496", "sensor_name": "Dépression AD01", "ligne": "Lavage", "unit": "mm WC", "base_value": 75.5, "noise": 5},
    # Séchage
    {"sensor_id": "TI-138", "sensor_name": "Temp gaz sortie sécheur", "ligne": "Séchage", "unit": "°C", "base_value": 91.61, "noise": 4},
    {"sensor_id": "PI-159", "sensor_name": "Dépression AF01", "ligne": "Séchage", "unit": "mm WC", "base_value": -54.87, "noise": 5},
    {"sensor_id": "TI-216", "sensor_name": "Temp produit AT03", "ligne": "Séchage", "unit": "°C", "base_value": 60.41, "noise": 3},
    # Enrobage
    {"sensor_id": "FIC-384", "sensor_name": "Enrobage vers AM04", "ligne": "Enrobage", "unit": "Kg/h", "base_value": 248.09, "noise": 20},
    {"sensor_id": "TIC-716", "sensor_name": "Temp Bac Tampon", "ligne": "Enrobage", "unit": "°C", "base_value": 64.18, "noise": 2},
    # Produit Fini
    {"sensor_id": "PF-N", "sensor_name": "N (Azote)", "ligne": "PRODUIT FINI", "unit": "%", "base_value": 11.43, "noise": 0.3},
    {"sensor_id": "PF-P2O5", "sensor_name": "P2O5", "ligne": "PRODUIT FINI", "unit": "%", "base_value": 44.34, "noise": 0.5},
    {"sensor_id": "PF-K2O", "sensor_name": "K2O", "ligne": "PRODUIT FINI", "unit": "%", "base_value": 14.9, "noise": 0.4},
    {"sensor_id": "PF-TG24", "sensor_name": "T.G [2-4]", "ligne": "PRODUIT FINI", "unit": "%", "base_value": 88.69, "noise": 2},
]

def generate_csv(output_path: str, days: int = 30, interval_minutes: int = 10):
    start = datetime.now() - timedelta(days=days)
    rows = []
    current = start
    end = datetime.now()

    while current <= end:
        for sensor in SENSORS:
            # Simulation avec bruit gaussien + quelques anomalies aléatoires
            noise = np.random.normal(0, sensor["noise"])
            # 2% de chance d'anomalie (pic ou chute)
            if random.random() < 0.02:
                noise *= random.choice([2.5, -2.5])
            value = round(sensor["base_value"] + noise, 2)
            rows.append({
                "timestamp": current.isoformat(timespec="seconds"),
                "ligne": sensor["ligne"],
                "sensor_id": sensor["sensor_id"],
                "sensor_name": sensor["sensor_name"],
                "value": value,
                "unit": sensor["unit"]
            })
        current += timedelta(minutes=interval_minutes)

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["timestamp", "ligne", "sensor_id", "sensor_name", "value", "unit"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"✅ CSV généré: {len(rows)} lignes → {output_path}")

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(__file__), "capteurs.csv")
    generate_csv(out)
