"""
analytics/urls.py

Analytics URL routing — all views are class-based (no router needed).
"""

from __future__ import annotations

from django.urls import path

from .views import (
    DashboardKPIView,
    RecentTripsView,
    ReportsCSVExportView,
    ReportsSummaryView,
    VehicleROIView,
)

urlpatterns = [
    path("dashboard/", DashboardKPIView.as_view(), name="dashboard-kpis"),
    path("recent-trips/", RecentTripsView.as_view(), name="recent-trips"),
    path("reports/", ReportsSummaryView.as_view(), name="reports-summary"),
    path("reports/roi/", VehicleROIView.as_view(), name="reports-roi"),
    path("reports/export/csv/", ReportsCSVExportView.as_view(), name="reports-csv"),
]
