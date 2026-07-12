"""
config/urls.py

Root URL configuration for TransitOps.
- /admin/              → Django admin
- /api/auth/           → JWT + Google login
- /api/fleet/          → Vehicle CRUD
- /api/drivers/        → Driver CRUD
- /api/trips/          → Trip management + dispatch lifecycle
- /api/maintenance/    → Maintenance records
- /api/finance/        → Fuel logs & expenses
- /api/analytics/      → Dashboard KPIs, reports, CSV export
- /api/schema/         → Raw OpenAPI 3 JSON
- /api/schema/swagger-ui/  → Interactive Swagger UI  ← check all modules here
- /api/schema/redoc/   → ReDoc (clean read-only docs)
"""

from __future__ import annotations

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import GoogleLoginView, LoginView

urlpatterns = [
    # ── Django Admin ──────────────────────────────────────────────────────────
    path("admin/", admin.site.urls),

    # ── Authentication ────────────────────────────────────────────────────────
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/google/", GoogleLoginView.as_view(), name="google-login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token-refresh"),

    # ── Feature Apps (each owns its own urls.py + DRF router) ─────────────────
    path("api/fleet/", include("fleet.urls")),
    path("api/drivers/", include("drivers.urls")),
    path("api/trips/", include("trips.urls")),
    path("api/maintenance/", include("maintenance.urls")),
    path("api/finance/", include("finance.urls")),
    path("api/analytics/", include("analytics.urls")),

    # ── OpenAPI / Swagger ─────────────────────────────────────────────────────
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]
