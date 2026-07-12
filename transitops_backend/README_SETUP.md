# TransitOps Backend — Setup & Team Guide

## 1. One-time setup (whoever sets up the repo)

```bash
# from the project root
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

# scaffold the actual Django project + apps if not already done
django-admin startproject config .
python manage.py startapp core
python manage.py startapp accounts
python manage.py startapp fleet
python manage.py startapp drivers
python manage.py startapp trips
python manage.py startapp maintenance
python manage.py startapp finance
python manage.py startapp analytics
```

Then:
1. Copy everything from `config/settings_snippet.py` INTO the generated `config/settings.py` (replace the default `INSTALLED_APPS`, `MIDDLEWARE`, `DATABASES`, add the rest).
2. Copy `config/urls_snippet.py` content INTO `config/urls.py`.
3. Drop each app's provided files (`models.py`, `serializers.py`, `views.py`, `urls.py`, etc.) into the matching folder, overwriting the auto-generated empty ones.

```bash
# if Postgres is set up:
createdb transitops
# otherwise just swap settings.py to sqlite3 (commented option is in the snippet)

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser   # for /admin/ access — huge time-saver for manual testing
python manage.py runserver
```

## 2. Every teammate, every session

```bash
source venv/bin/activate      # activate the shared venv
git pull
pip install -r requirements.txt   # in case someone added a package
python manage.py migrate          # pick up any new migrations
python manage.py runserver
```

**Never commit the `venv/` folder.** Add to `.gitignore`:
```
venv/
__pycache__/
*.pyc
db.sqlite3
.env
```

## 3. Division of labor (matches the module priority from earlier)

| Person | Owns | Files |
|---|---|---|
| You (backend lead) | `core/`, `accounts/`, `trips/`, RBAC wiring | permissions.py, exceptions.py, trips/* |
| Teammate A | `fleet/`, `maintenance/` | models/serializers/views/urls in both apps |
| Teammate B | `drivers/`, `finance/` | models/serializers/views/urls in both apps |
| Teammate C | `analytics/` + frontend integration | services.py aggregations, testing endpoints against frontend |

**Golden rule:** nobody changes `Vehicle.status` or `Driver.status` directly in a view. All status changes go through `trips/services.py` (dispatch/complete/cancel) or the `maintenance/signals.py` hook. This is what keeps the whole system consistent — if everyone respects this one rule, most of the "spec compliance" bugs disappear on their own.

## 4. Testing the RBAC + business rules fast (no frontend needed)

Use the Django admin (`/admin/`) to seed a few Vehicles, Drivers, and Users with different roles — fastest way to get test data without building forms first.

Then hit the API with `curl` or Postman:

```bash
# login as a Dispatcher
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "dispatcher@transitops.co", "password": "yourpassword"}'

# use the returned access token
curl -X POST http://localhost:8000/api/trips/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"trip_code": "TR001", "source": "Depot A", "destination": "Depot B", "vehicle": 1, "driver": 1, "cargo_weight_kg": 700, "planned_distance_km": 120}'
```

Overloading the vehicle should return exactly:
```json
{"status": "validation_failed", "errors": ["Vehicle Capacity: 250 kg", "Cargo Weight: 700 kg", "Capacity exceeded by 450 kg - dispatch blocked."]}
```

## 5. Google Sign-In setup (free, ~10 min)

1. Go to [Google Cloud Console](https://console.cloud.google.com) → create a project (free, no billing needed).
2. **APIs & Services → OAuth consent screen** → External → fill app name/email → save (skip verification, "Testing" mode is fine for a hackathon).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID** → Application type: **Web application**.
   - Add your frontend's dev URL to "Authorized JavaScript origins" (e.g. `http://localhost:5173`).
4. Copy the generated **Client ID** into your `.env`:
   ```
   GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
   ```
5. Frontend loads Google Identity Services (`https://accounts.google.com/gsi/client`), renders the button, and on success gets an `id_token`. POST that to your backend:
   ```bash
   curl -X POST http://localhost:8000/api/auth/google/ \
     -H "Content-Type: application/json" \
     -d '{"id_token": "<token from Google>", "role": "Dispatcher"}'
   ```
   `role` is only required the first time that email logs in — after that the stored role is used and passing a different `role` has no effect.
6. Response shape matches normal login (`access`, `refresh`, `role`, `email`) — frontend doesn't need separate handling for Google vs email/password sessions.

**Security notes worth the extra few minutes:**
- Login is now throttled to 10 requests/min per IP (`ScopedRateThrottle`) on top of the existing 5-attempt account lockout — stops both brute-force and credential-stuffing style hammering.
- Google-created accounts get `set_unusable_password()` — they can never be logged into via the email/password endpoint, closing off a mixed-auth attack path.
- Never trust a Google ID token without server-side verification — `accounts/google_auth.py` verifies signature + audience + `email_verified` before trusting anything in the payload. Don't be tempted to skip this and just decode the JWT client-side.
- For anything beyond a hackathon demo: gate brand-new Google sign-ups behind admin approval instead of auto-creating with a self-selected role (flagged in the code comments in `google_auth.py`).

## 6. Known gaps to decide as a team (flagged during design)

- **Role mismatch between the two docs you shared**: the original problem statement has a "Driver" role that creates trips; the mockup's RBAC matrix uses "Dispatcher" instead and doesn't include "Driver" at all. `accounts/models.py` currently uses the mockup's 4 roles (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst). Confirm this before Teammate work diverges.
- **Dashboard KPI access**: the mockup shows every role landing on some dashboard, but the permission matrix only grants Fleet Manager and Financial Analyst "analytics" access. Either add a `"dashboard"` module key with `"read"` for all four roles, or confirm Dispatcher/Safety Officer don't need KPI cards.
- **In-Transit status**: the original problem statement's lifecycle is `Draft → Dispatched → Completed`, but the mockup's timeline component shows `Draft → Dispatched → In-Transit → Completed`. The code here follows the mockup (4 states) — flag if you want to drop `In-Transit`.
