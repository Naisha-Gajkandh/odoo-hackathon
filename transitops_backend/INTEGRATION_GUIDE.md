# TransitOps Backend — Integration & Onboarding Guide

> **8-hour hackathon edition** — everything you need to go from zero to a running API in under 10 minutes.

---

## 0. Prerequisites

| Tool | Version | Install |
|---|---|---|
| Python | ≥ 3.11 | [python.org](https://www.python.org/downloads/) |
| pip | bundled with Python | — |
| Git | any | [git-scm.com](https://git-scm.com) |
| (optional) PostgreSQL | ≥ 14 | Only needed if you don't want SQLite |

---

## 1. First-time Setup (everyone does this once)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd odoo-hackathon/transitops_backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate it
#    Windows (PowerShell):
venv\Scripts\Activate.ps1
#    Windows (cmd):
venv\Scripts\activate.bat
#    macOS / Linux:
source venv/bin/activate

# 4. Install all dependencies
pip install -r requirements.txt

# 5. Copy the environment template
cp .env.example .env
#    → Open .env in your editor. For local SQLite dev, you only NEED to set DJANGO_SECRET_KEY.
#      Everything else has safe defaults.

# 6. Generate a secret key and paste it into .env
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# 7. Create the database tables
python manage.py makemigrations
python manage.py migrate

# 8. Create your admin user (use this to log in to /admin/ and seed test data)
python manage.py createsuperuser

# 9. Start the development server
python manage.py runserver
```

**That's it.** The API is now live at `http://localhost:8000`.

---

## 2. Every Session (after first-time setup)

```bash
cd odoo-hackathon/transitops_backend
venv\Scripts\Activate.ps1     # or source venv/bin/activate on Mac/Linux

git pull
pip install -r requirements.txt   # pick up any new packages teammates added
python manage.py migrate          # apply any new migrations teammates created
python manage.py runserver
```

---

## 3. Key URLs

| URL | What it is |
|---|---|
| `http://localhost:8000/api/schema/swagger-ui/` | **Swagger UI** — interactive docs for ALL endpoints |
| `http://localhost:8000/api/schema/redoc/` | ReDoc — clean read-only API docs |
| `http://localhost:8000/api/schema/` | Raw OpenAPI 3 JSON schema |
| `http://localhost:8000/admin/` | Django Admin — fastest way to seed test data |

### How to authenticate in Swagger UI

1. Open `http://localhost:8000/api/schema/swagger-ui/`
2. Call `POST /api/auth/login/` with your superuser credentials → copy the `access` value
3. Click the **Authorize 🔒** button at the top right
4. Paste: `Bearer <your_access_token>` → click Authorize
5. All subsequent requests will be authenticated automatically

---

## 4. API Endpoint Reference

### Authentication
| Method | URL | Description |
|---|---|---|
| POST | `/api/auth/login/` | Email + password login → returns JWT |
| POST | `/api/auth/refresh/` | Refresh expired access token |
| POST | `/api/auth/google/` | Google OAuth login (needs GOOGLE_CLIENT_ID in .env) |

### Fleet (Vehicles)
| Method | URL | Description |
|---|---|---|
| GET | `/api/fleet/vehicles/` | List all vehicles |
| POST | `/api/fleet/vehicles/` | Register a new vehicle |
| GET | `/api/fleet/vehicles/{id}/` | Vehicle detail |
| PUT/PATCH | `/api/fleet/vehicles/{id}/` | Update vehicle |
| DELETE | `/api/fleet/vehicles/{id}/` | Soft-delete vehicle |
| GET | `/api/fleet/vehicles/dispatchable/` | **Only Available vehicles** (use for trip dropdown!) |
| POST | `/api/fleet/vehicles/{id}/retire/` | Mark a vehicle as Retired |

### Drivers
| Method | URL | Description |
|---|---|---|
| GET | `/api/drivers/` | List all drivers |
| POST | `/api/drivers/` | Register a new driver |
| GET | `/api/drivers/{id}/` | Driver detail |
| PUT/PATCH | `/api/drivers/{id}/` | Update driver |
| DELETE | `/api/drivers/{id}/` | Soft-delete driver |
| GET | `/api/drivers/assignable/` | **Only Available + valid-license drivers** (use for trip dropdown!) |

### Trips
| Method | URL | Description |
|---|---|---|
| GET | `/api/trips/` | List all trips |
| POST | `/api/trips/` | Create a trip (auto-routes via Nominatim+OSRM) |
| GET | `/api/trips/{id}/` | Trip detail |
| POST | `/api/trips/{id}/dispatch/` | Dispatch trip (Draft → Dispatched) |
| POST | `/api/trips/{id}/complete/` | Complete trip (body: final_odometer + fuel_consumed_liters) |
| POST | `/api/trips/{id}/cancel/` | Cancel trip (Dispatched/In-Transit → Cancelled) |
| GET | `/api/trips/{id}/eta/` | Real-time ETA (OSRM-based if available) |

### Maintenance
| Method | URL | Description |
|---|---|---|
| GET | `/api/maintenance/` | List all maintenance records |
| POST | `/api/maintenance/` | Create record (auto-sets vehicle → In Shop) |
| PUT/PATCH | `/api/maintenance/{id}/` | Update (set status=Closed → vehicle goes Available) |
| DELETE | `/api/maintenance/{id}/` | Soft-delete |

### Finance
| Method | URL | Description |
|---|---|---|
| GET | `/api/finance/fuel-logs/` | List fuel logs |
| POST | `/api/finance/fuel-logs/` | Add fuel log |
| GET | `/api/finance/expenses/` | List expenses |
| POST | `/api/finance/expenses/` | Add expense (toll, other) |

### Analytics
| Method | URL | Description |
|---|---|---|
| GET | `/api/analytics/dashboard/` | 7 KPI cards (all roles) |
| GET | `/api/analytics/recent-trips/` | 4 most recent trips with ETA (all roles) |
| GET | `/api/analytics/reports/` | Fleet-wide fuel efficiency + utilization |
| GET | `/api/analytics/reports/roi/` | Per-vehicle ROI breakdown |
| GET | `/api/analytics/reports/export/csv/` | Download CSV report |

---

## 5. Free Routing APIs (no key required)

The backend automatically uses two free APIs when you create a trip:

### Nominatim (Geocoding)
- **What**: Converts location names like "Mumbai Central Depot" to GPS coordinates
- **URL**: `https://nominatim.openstreetmap.org/search`
- **Key**: None required
- **Rate limit**: 1 request/second (enforced in code — you won't get banned)
- **Result**: Cached for 24 hours (same depot name = 1 API call per day max)

### OSRM (Routing)
- **What**: Computes real driving distance (km) and travel time (seconds) between two coordinates
- **URL**: `https://router.project-osrm.org/route/v1/driving/{lon,lat};{lon,lat}`
- **Key**: None required
- **Result**: Cached for 1 hour

### What happens when you create a trip
```
POST /api/trips/  body: { source: "Mumbai", destination: "Pune", planned_distance_km: 100, ... }

1. Nominatim geocodes "Mumbai"   → (19.0760, 72.8777)   [cached 24h]
2. Nominatim geocodes "Pune"     → (18.5204, 73.8567)   [cached 24h]
3. OSRM routes between coords    → { distance_km: 148.3, duration_seconds: 9240 }
4. planned_distance_km is AUTO-UPDATED to 148.3 (real value overrides the 100 you typed)
5. estimated_duration_seconds = 9240 is stored
6. ETA = "2h 34m (OSRM)" is shown on /api/trips/{id}/eta/

If either API is unreachable: your typed planned_distance_km (100) is kept.
routing_source field will be "manual" instead of "osrm".
```

---

## 6. Division of Work

| Person | Module | Key files |
|---|---|---|
| Backend Lead | `core/`, `accounts/`, `trips/` | permissions.py, serializers.py, services.py, routing.py |
| Teammate A | `fleet/`, `maintenance/` | models, serializers, views, urls in both |
| Teammate B | `drivers/`, `finance/` | models, serializers, views, urls in both |
| Teammate C | `analytics/` + frontend integration | services.py, views.py, Swagger testing |

### Golden Rule
**Never set `vehicle.status` or `driver.status` directly in a view.**
All status changes must go through:
- `trips/services.py` → `dispatch_trip()`, `complete_trip()`, `cancel_trip()`
- `maintenance/signals.py` → auto-triggered on `MaintenanceRecord` save

Break this rule and the statuses get out of sync.

---

## 7. Seeding Test Data (Fastest Path)

### Via Django Admin (recommended for hackathon speed)
1. Go to `http://localhost:8000/admin/`
2. Log in with your superuser
3. Create **Users** with different roles (Fleet Manager, Dispatcher, etc.)
4. Create a few **Vehicles** and **Drivers**

### Via curl / Postman
```bash
# Step 1: Login and capture token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@transitops.co", "password": "yourpassword"}' \
  | python -c "import sys,json; print(json.load(sys.stdin)['access'])")

# Step 2: Register a vehicle
curl -X POST http://localhost:8000/api/fleet/vehicles/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"registration_number": "VAN-05", "name_model": "Toyota HiAce", "vehicle_type": "Van",
       "max_load_capacity_kg": "500.00", "odometer": 0, "acquisition_cost": "1500000.00", "region": "Mumbai"}'

# Step 3: Register a driver
curl -X POST http://localhost:8000/api/drivers/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Alex Kumar", "license_number": "MH0120240001", "license_category": "LMV",
       "license_expiry_date": "2027-12-31", "contact_number": "9876543210"}'

# Step 4: Create a trip (routing happens automatically)
curl -X POST http://localhost:8000/api/trips/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source": "Mumbai", "destination": "Pune", "vehicle": 1, "driver": 1,
       "cargo_weight_kg": "450.00", "planned_distance_km": "150.00"}'

# Step 5: Dispatch the trip
curl -X POST http://localhost:8000/api/trips/1/dispatch/ \
  -H "Authorization: Bearer $TOKEN"

# Step 6: Complete the trip
curl -X POST http://localhost:8000/api/trips/1/complete/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"final_odometer": 50150, "fuel_consumed_liters": "45.5"}'
```

---

## 8. Linting (CI Check)

The CI pipeline runs `ruff check .` on every push. Run it locally before committing:

```bash
# Install ruff (one-time)
pip install ruff

# Check for issues
ruff check .

# Auto-fix safe issues
ruff check --fix .

# Check only the backend folder
ruff check transitops_backend/
```

The `pyproject.toml` at the repo root configures ruff. Migration files are excluded from lint rules automatically.

---

## 9. Environment Variable Quick Reference

| Variable | Default | Description |
|---|---|---|
| `DJANGO_SECRET_KEY` | insecure-dev-key | **Change this!** |
| `DJANGO_DEBUG` | `True` | Set `False` in production |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Add your domain for production |
| `DB_ENGINE` | SQLite (unset) | Set `django.db.backends.postgresql` for Postgres |
| `DB_NAME/USER/PASSWORD/HOST/PORT` | — | Only if using PostgreSQL |
| `GOOGLE_CLIENT_ID` | (empty) | Only if using Google Sign-In |
| `CORS_ALLOWED_ORIGINS` | `localhost:5173,localhost:3000` | Frontend dev server URLs |
| `OSRM_BASE_URL` | OSRM public demo | Override with self-hosted OSRM |
| `NOMINATIM_BASE_URL` | OSM public Nominatim | Override with self-hosted instance |
| `NOMINATIM_USER_AGENT` | TransitOps-Hackathon/1.0 | Describe your app (Nominatim ToS) |
| `REDIS_URL` | (empty = in-memory cache) | Set for Redis-backed caching |

---

## 10. Common Issues & Fixes

| Error | Fix |
|---|---|
| `ModuleNotFoundError: No module named 'decouple'` | Run `pip install -r requirements.txt` |
| `django.db.utils.OperationalError: no such table` | Run `python manage.py migrate` |
| `401 Unauthorized` on API calls | Get a fresh JWT from `/api/auth/login/` |
| `403 Forbidden` | Your user's role doesn't have access to that module — check RBAC matrix in `core/permissions.py` |
| Nominatim returns 0 results | The location name is too vague — use a city name or add the country, e.g., "Mumbai, India" |
| OSRM times out | The public demo server is overloaded — the system falls back to manual distance automatically |
| `ruff check` fails on your file | Run `ruff check --fix .` for auto-fixable issues; check the output for manual fixes |
