# 🏭 PFE OCP — Tableau de Bord Qualité Production

**Stack:** React.js (Frontend) + FastAPI Python (Backend) + PostgreSQL + Claude AI

---

## 📁 Structure du projet

```
pfe_ocp/
├── docker-compose.yml          ← Lance tout avec une commande
├── backend-pfe/                ← API FastAPI Python
│   ├── app/
│   │   ├── main.py             ← Point d'entrée FastAPI
│   │   ├── routers/            ← Endpoints REST
│   │   │   ├── sensors.py      ← GET /sensors/live
│   │   │   ├── alerts.py       ← GET /alerts/active
│   │   │   ├── incidents.py    ← GET/PATCH /incidents
│   │   │   ├── ai.py           ← POST /ai/query → Claude
│   │   │   └── thresholds.py   ← POST /thresholds
│   │   ├── models/             ← Tables SQLAlchemy
│   │   │   ├── sensor.py       ← sensor_readings
│   │   │   ├── incident.py     ← incidents
│   │   │   └── threshold.py    ← thresholds
│   │   ├── services/
│   │   │   ├── sensor_service.py   ← Lecture CSV → PostgreSQL
│   │   │   ├── alert_engine.py     ← Détection anomalies
│   │   │   └── claude_service.py   ← API Anthropic
│   │   └── database/
│   │       ├── connection.py   ← SQLAlchemy engine
│   │       └── init_db.py      ← Création des tables
│   ├── data/
│   │   ├── generate_data.py    ← Génère capteurs.csv (simulation)
│   │   └── capteurs.csv        ← Données simulées (généré)
│   ├── requirements.txt
│   └── .env.example
└── dashboard-pfe/              ← Frontend React.js
    ├── src/
    │   ├── App.jsx             ← Routeur principal
    │   ├── pages/
    │   │   ├── Dashboard.jsx   ← Page 1: KPI + capteurs temps réel
    │   │   ├── Alerts.jsx      ← Page 2: Alertes actives
    │   │   ├── Journal.jsx     ← Page 3: Journal incidents
    │   │   ├── AIAssistant.jsx ← Page 4: Chat IA Claude
    │   │   └── Settings.jsx    ← Page 5: Config seuils
    │   ├── components/
    │   ├── services/api.js     ← Appels HTTP vers backend
    │   ├── hooks/useRealtime.js ← Rafraîchissement auto 10s
    │   └── styles/global.css
    └── package.json
```

---

## 🗄️ ÉTAPE 1 — Configurer PostgreSQL

### Option A : Via Docker (recommandé)
```bash
docker run --name ocp-postgres \
  -e POSTGRES_USER=ocp_user \
  -e POSTGRES_PASSWORD=ocp_password \
  -e POSTGRES_DB=ocp_dashboard \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Option B : Installation locale (Windows)
1. Télécharger PostgreSQL sur https://www.postgresql.org/download/windows/
2. Installer avec le mot de passe: `ocp_password`
3. Ouvrir **pgAdmin 4** (comme dans votre screenshot)
4. Clic droit sur "Servers" → Register → Server
   - Name: `OCP Local`
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: votre mot de passe

### Créer la base de données dans pgAdmin
```sql
-- Dans pgAdmin: Tools → Query Tool → Coller ce SQL:
CREATE USER ocp_user WITH PASSWORD 'ocp_password';
CREATE DATABASE ocp_dashboard OWNER ocp_user;
GRANT ALL PRIVILEGES ON DATABASE ocp_dashboard TO ocp_user;
```

### Structure des tables (créées automatiquement au démarrage)

```sql
-- Table des mesures capteurs (série temporelle)
CREATE TABLE sensor_readings (
    id          SERIAL PRIMARY KEY,
    timestamp   TIMESTAMPTZ DEFAULT NOW(),
    ligne       VARCHAR,      -- PN, Granulateur, Lavage, Séchage, Enrobage
    sensor_id   VARCHAR,      -- FIC-001, TI-027, LIC-503...
    sensor_name VARCHAR,      -- Nom lisible du capteur
    value       FLOAT,        -- Valeur numérique
    unit        VARCHAR       -- °C, m3/h, T/h, %
);

-- Index pour requêtes rapides
CREATE INDEX idx_sensor_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX idx_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX idx_sensor_ligne ON sensor_readings(ligne);

-- Table des incidents détectés
CREATE TABLE incidents (
    id              SERIAL PRIMARY KEY,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    resolved_at     TIMESTAMPTZ,
    ligne           VARCHAR,
    sensor_id       VARCHAR,
    sensor_name     VARCHAR,
    value           VARCHAR,
    threshold_value VARCHAR,
    severity        VARCHAR,  -- CRITIQUE, AVERTISSEMENT
    status          VARCHAR DEFAULT 'OUVERT',  -- OUVERT, RESOLU
    description     TEXT,
    action_taken    TEXT
);

-- Table des seuils configurables
CREATE TABLE thresholds (
    id          SERIAL PRIMARY KEY,
    sensor_id   VARCHAR UNIQUE,
    sensor_name VARCHAR,
    ligne       VARCHAR,
    min_value   FLOAT,
    max_value   FLOAT,
    unit        VARCHAR,
    is_active   BOOLEAN DEFAULT TRUE
);
```

### Requêtes utiles dans pgAdmin
```sql
-- Voir les dernières mesures par capteur
SELECT DISTINCT ON (sensor_id)
    sensor_id, sensor_name, ligne, value, unit, timestamp
FROM sensor_readings
ORDER BY sensor_id, timestamp DESC;

-- Voir les incidents ouverts
SELECT * FROM incidents WHERE status = 'OUVERT' ORDER BY created_at DESC;

-- Voir l'historique d'un capteur
SELECT timestamp, value FROM sensor_readings
WHERE sensor_id = 'TI-027'
ORDER BY timestamp DESC LIMIT 100;

-- Stats par ligne
SELECT ligne, COUNT(*) as nb_lectures, AVG(value) as moyenne
FROM sensor_readings
GROUP BY ligne ORDER BY ligne;
```

---

## ⚙️ ÉTAPE 2 — Lancer le Backend

```bash
cd backend-pfe

# 1. Créer l'environnement virtuel Python
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env et mettre votre clé API Anthropic:
# ANTHROPIC_API_KEY=sk-ant-VOTRE_CLE_ICI
# DATABASE_URL=postgresql://ocp_user:ocp_password@localhost:5432/ocp_dashboard

# 4. Générer les données de simulation depuis le vrai fichier Excel OCP
python data/generate_data.py
# → Génère data/capteurs.csv avec 30 jours de données simulées

# 5. Lancer l'API FastAPI
uvicorn app.main:app --reload --port 8000
```

L'API sera disponible sur: http://localhost:8000
Documentation Swagger: http://localhost:8000/docs

### Endpoints disponibles:
- `GET /sensors/live` — Dernières valeurs de tous les capteurs
- `GET /sensors/live?ligne=PN` — Filtré par ligne
- `GET /sensors/history?sensor_id=TI-027` — Historique capteur
- `GET /alerts/active` — Alertes actives (seuils dépassés)
- `GET /incidents/` — Journal des incidents
- `PATCH /incidents/{id}` — Mettre à jour un incident
- `POST /ai/query` — Question à l'assistant IA Claude
- `GET /thresholds/` — Lister les seuils
- `POST /thresholds/` — Créer/modifier un seuil

---

## 🖥️ ÉTAPE 3 — Lancer le Frontend

```bash
cd dashboard-pfe

# 1. Installer les dépendances npm
npm install

# 2. Configurer l'URL de l'API
# Créer un fichier .env:
echo "VITE_API_URL=http://localhost:8000" > .env

# 3. Lancer en mode développement
npm run dev
```

L'interface sera disponible sur: http://localhost:5173

---

## 🐳 ÉTAPE 4 — Déploiement avec Docker (tout en une commande)

```bash
# À la racine du projet (où est docker-compose.yml)
# 1. Copier les fichiers .env
cp backend-pfe/.env.example backend-pfe/.env
# Éditer backend-pfe/.env avec votre vraie clé ANTHROPIC_API_KEY

# 2. Lancer tous les services
docker-compose up --build

# Services lancés:
# - PostgreSQL: localhost:5432
# - Backend: localhost:8000
# - Frontend: localhost:5173
```

---

## 🔑 Obtenir une clé API Anthropic
1. Créer un compte sur https://console.anthropic.com
2. Aller dans API Keys → Create Key
3. Copier la clé dans backend-pfe/.env

---

## 📊 Données OCP réelles (votre fichier Excel)

Le fichier `mesures_pfe_filled.xlsx` contient des données réelles de production avec ces feuilles:
- **PRODUIT FINI**: N, P2O5, K2O, S, B, Taux de granulométrie
- **PN**: Débits ACP, NH3, Pulpe, Température bouille
- **Granulateur**: Bouille AP01/KP01, NH3 liquide, ACP 54%
- **Lavage**: Liquide lavage, Températures AD01/AD02/AD03
- **Séchage**: Température gaz sortie, Dépression, Humidité
- **Enrobage**: Débit enrobage, Pression pulvérisation, Températures

Ces données sont transformées en CSV par `generate_data.py` puis stockées dans PostgreSQL.

---

## 🏗️ Architecture technique

```
[Capteurs OCP] → [CSV/Simulation] → [FastAPI Backend]
                                          ↓
                                    [PostgreSQL]
                                          ↓
                                    [React Frontend] ← Rafraîchissement 10s
                                          ↓
                                   [Claude API] ← Questions opérateurs
```

---

## 👨‍💻 Répartition du travail suggérée

| Étudiant A (Backend) | Étudiant B (Frontend) |
|---|---|
| FastAPI + PostgreSQL | React + Recharts |
| sensor_service.py | Dashboard.jsx + KPICard |
| alert_engine.py | Alerts.jsx + AlertPanel |
| claude_service.py | AIAssistant.jsx |
| generate_data.py | Journal.jsx + Settings.jsx |
| Docker + déploiement | Tests utilisateurs + UI |
