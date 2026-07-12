"""
Paste/merge into config/urls.py. Each app should also get its own
urls.py with a DRF router registering its ViewSet -- this file just
wires the top-level paths.
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import GoogleLoginView, LoginView
from analytics.views import (
    DashboardKPIView,
    RecentTripsView,
    ReportsCSVExportView,
    ReportsSummaryView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Auth
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/google/", GoogleLoginView.as_view(), name="google-login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Feature apps -- each owns its own urls.py with a router
    path("api/fleet/", include("fleet.urls")),
    path("api/drivers/", include("drivers.urls")),
    path("api/trips/", include("trips.urls")),
    path("api/maintenance/", include("maintenance.urls")),
    path("api/finance/", include("finance.urls")),

    # Analytics / dashboard (single-purpose views, no router needed)
    path("api/analytics/dashboard/", DashboardKPIView.as_view(), name="dashboard-kpis"),
    path("api/analytics/recent-trips/", RecentTripsView.as_view(), name="recent-trips"),
    path("api/analytics/reports/", ReportsSummaryView.as_view(), name="reports-summary"),
    path("api/analytics/reports/export/csv/", ReportsCSVExportView.as_view(), name="reports-csv"),
]
