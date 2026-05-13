from app.database.connection import engine, Base, SessionLocal
from app.models import sensor, incident, threshold
from app.models.threshold import Threshold

# Seuils d'ALARME réels (pas les plages normales)
# Logique : valeur normale ± tolérance d'alarme
INITIAL_THRESHOLDS = [
    # --- PN (Pré-Neutraliseur) ---
    # TI-027 : Temp Bouille normale ~108°C, alarme si < 100 ou > 112
    ("TI-027",  "Temp Bouille",      "PN",           100.0, 112.0, "C"),
    # FIC-001 : débit normal ~55 m3/h, alarme si < 48 ou > 63
    ("FIC-001", "ACP 29% vers PN",   "PN",            48.0,  63.0, "m3/h"),
    # FIC-002 : débit normal ~52 m3/h, alarme si < 47 ou > 58
    ("FIC-002", "Liq Lavage AD01",   "PN",            47.0,  58.0, "m3/h"),
    # FIC-003 : débit normal ~52 m3/h, alarme si < 46 ou > 60
    ("FIC-003", "ACP 54% vers PN",   "PN",            46.0,  60.0, "m3/h"),
    # FIC-004 : débit normal ~52 m3/h, alarme si < 48 ou > 58
    ("FIC-004", "H2SO4 vers PN",     "PN",            48.0,  58.0, "m3/h"),
    # RM-PN : rapport molaire normal ~1.5, alarme si < 1.42 ou > 1.58
    ("RM-PN",   "Rapport Molaire",   "PN",             1.42,  1.58, "-"),

    # --- Lavage ---
    # TI-504 : Temp AD01 normale ~65°C, alarme si < 55 ou > 78
    ("TI-504",  "Temp AD01",         "Lavage",        55.0,  78.0, "C"),
    # LIC-503 : Niveau AD01 normal ~50%, alarme si < 35 ou > 78
    ("LIC-503", "Niveau AD01",       "Lavage",        35.0,  78.0, "%"),
    # PDI-496 : dépression normale ~20mm, alarme si < 16 ou > 24
    ("PDI-496", "Depression AD01",   "Lavage",        16.0,  24.0, "mm"),
    # LIC-543 : Niveau AR02 normal ~50%, alarme si < 35 ou > 78
    ("LIC-543", "Niveau AR02",       "Lavage",        35.0,  78.0, "%"),

    # --- Séchage ---
    # TI-138 : Temp gaz sortie normale ~95°C, alarme si < 88 ou > 120
    ("TI-138",  "Temp Gaz Sortie",   "Sechage",       88.0, 120.0, "C"),
    # TI-216 : Temp produit normale ~30°C, alarme si < 26 ou > 34
    ("TI-216",  "Temp Produit",      "Sechage",       26.0,  34.0, "C"),
    # HUM-TQ : Humidité normale ~1.5%, alarme si > 2.9 (trop humide)
    ("HUM-TQ",  "Humidite",          "Sechage",        0.3,   2.9, "%"),

    # --- Enrobage ---
    # FIC-384 : débit enrobage normal ~30 Kg/h, alarme si < 26 ou > 34
    ("FIC-384", "Enrobage AM04",     "Enrobage",      26.0,  34.0, "Kg/h"),

    # --- Produit Fini (qualité) ---
    # Seuils qualité serrés : écart > 3% de la cible = alarme
    ("PF-N",    "N (Azote)",         "PRODUIT FINI",  11.0,  12.2, "%"),
    ("PF-P2O5", "P2O5",              "PRODUIT FINI",  43.5,  46.5, "%"),
    ("PF-K2O",  "K2O",               "PRODUIT FINI",  14.0,  16.0, "%"),
    ("PF-TG24", "T.G [2-4]",         "PRODUIT FINI",  85.0,  95.0, "%"),
]


def create_tables():
    Base.metadata.create_all(bind=engine)
    _seed_thresholds()


def _seed_thresholds():
    db = SessionLocal()
    try:
        # Supprimer les anciens seuils et recréer
        db.query(Threshold).delete()
        db.commit()

        for sid, name, ligne, vmin, vmax, unit in INITIAL_THRESHOLDS:
            db.add(Threshold(
                sensor_id=sid,
                sensor_name=name,
                ligne=ligne,
                min_value=vmin,
                max_value=vmax,
                unit=unit,
                is_active=True
            ))
        db.commit()
        print(f"✅ {len(INITIAL_THRESHOLDS)} seuils initialisés")
    except Exception as e:
        db.rollback()
        print(f"Erreur init seuils: {e}")
    finally:
        db.close()