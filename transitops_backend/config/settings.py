"""
config/settings.py

Full Django settings for TransitOps.
All secrets are read from .env via python-decouple.
Copy .env.example → .env and fill in your values before running.
"""

from __future__ import annotations

from datetime import timedelta
from pathlib import Path

import dj_database_url
from decouple import Csv, config

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# ── Security ──────────────────────────────────────────────────────────────────
SECRET_KEY = config("DJANGO_SECRET_KEY", default="insecure-dev-key-change-me")
DEBUG = config("DJANGO_DEBUG", default=True, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost,127.0.0.1", cast=Csv())

# ── Installed Apps ─────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    # Project apps
    "accounts",
    "core",
    "fleet",
    "drivers",
    "trips",
    "maintenance",
    "finance",
    "analytics",
]

AUTH_USER_MODEL = "accounts.User"

# ── Middleware ─────────────────────────────────────────────────────────────────
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # must be before CommonMiddleware
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# ── Database ───────────────────────────────────────────────────────────────────
# If DATABASE_URL is provided (e.g. from Neon), use it. Otherwise, fallback to SQLite.
_database_url = config("DATABASE_URL", default="")

if _database_url:
    DATABASES = {
        "default": dj_database_url.parse(_database_url)
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# ── Password Validation ─────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ── Internationalisation ────────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# ── Static Files ───────────────────────────────────────────────────────────────
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── CORS ──────────────────────────────────────────────────────────────────────
_cors_origins = config(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:5173,http://localhost:3000",
    cast=Csv(),
)
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOWED_ORIGINS = list(_cors_origins)

# ── Django REST Framework ──────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "EXCEPTION_HANDLER": "core.exceptions.custom_exception_handler",
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    # Throttle login attempts — 10/min per IP, plus 5-attempt account lockout in serializer
    "DEFAULT_THROTTLE_CLASSES": ("rest_framework.throttling.ScopedRateThrottle",),
    "DEFAULT_THROTTLE_RATES": {"login": "10/min"},
    # OpenAPI schema
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

# ── JWT ────────────────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    # Generous lifetime for 8-hour hackathon demo session
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ── drf-spectacular (Swagger / OpenAPI) ────────────────────────────────────────
SPECTACULAR_SETTINGS = {
    "TITLE": "TransitOps API",
    "DESCRIPTION": (
        "Smart Transport Operations Platform — manages vehicles, drivers, trips, "
        "maintenance, fuel & expenses, and fleet analytics.\n\n"
        "**Authentication**: All endpoints (except /api/auth/login/ and /api/auth/google/) "
        "require a Bearer JWT token. Use the /api/auth/login/ endpoint to obtain one, "
        "then click **Authorize** above and paste the `access` token."
    ),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "TAGS": [
        {"name": "auth", "description": "Authentication & JWT token management"},
        {"name": "fleet", "description": "Vehicle registry & lifecycle"},
        {"name": "drivers", "description": "Driver profiles & compliance"},
        {"name": "trips", "description": "Trip dispatch & lifecycle"},
        {"name": "maintenance", "description": "Maintenance records & vehicle shop status"},
        {"name": "finance", "description": "Fuel logs & expense tracking"},
        {"name": "analytics", "description": "Dashboard KPIs, reports & CSV export"},
    ],
}

# ── Google OAuth ────────────────────────────────────────────────────────────────
GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID", default="")

# ── Routing APIs ────────────────────────────────────────────────────────────────
OSRM_BASE_URL = config("OSRM_BASE_URL", default="https://router.project-osrm.org")
NOMINATIM_BASE_URL = config("NOMINATIM_BASE_URL", default="https://nominatim.openstreetmap.org")
NOMINATIM_USER_AGENT = config("NOMINATIM_USER_AGENT", default="TransitOps-Hackathon/1.0")

# ── Currency & Units (System-Wide) ─────────────────────────────────────────────
DEPOT_DEFAULTS = {
    "CURRENCY": "INR",
    "DISTANCE_UNIT": "km",
    "WEIGHT_UNIT": "kg",
}

# ── Caching ───────────────────────────────────────────────────────────────────
_redis_url = config("REDIS_URL", default="")
if _redis_url:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": _redis_url,
        }
    }
else:
    # In-memory cache: fast for hackathon demo; doesn't survive restarts
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        }
    }
