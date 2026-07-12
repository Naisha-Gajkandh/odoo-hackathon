"""
analytics/views.py

Analytics endpoints:
  GET /api/analytics/dashboard/         → 7 KPI cards
  GET /api/analytics/recent-trips/      → 4 most recent trips with ETA
  GET /api/analytics/reports/           → Fleet-wide fuel efficiency + utilization
  GET /api/analytics/reports/roi/       → Per-vehicle ROI breakdown
  GET /api/analytics/reports/export/csv/ → CSV download (all vehicles)

All views use module = "dashboard" (readable by all roles) or module = "analytics"
(Fleet Manager + Financial Analyst only) — see core/permissions.py.
"""

from __future__ import annotations

import csv

from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import HasModulePermission
from trips.models import Trip

from . import services


class DashboardKPIView(APIView):
    """
    GET /api/analytics/dashboard/

    Returns the 7 KPI card values. Accessible to all authenticated roles
    (module='dashboard' is set to 'read' for everyone in the permission matrix).
    """

    module = "dashboard"
    permission_classes = [IsAuthenticated, HasModulePermission]

    def get(self, request: Request) -> Response:
        return Response(services.dashboard_kpis())


class RecentTripsView(APIView):
    """
    GET /api/analytics/recent-trips/

    Returns the 4 most recently updated trips with OSRM-aware ETA strings.
    Accessible to all roles (module='dashboard').
    """

    module = "dashboard"
    permission_classes = [IsAuthenticated, HasModulePermission]

    def get(self, request: Request) -> Response:
        trips = Trip.objects.select_related("vehicle", "driver").order_by("-updated_at")[:4]
        results = [
            {
                "trip_code": t.trip_code,
                "vehicle": t.vehicle.registration_number if t.vehicle else None,
                "driver": t.driver.name if t.driver else None,
                "source": t.source,
                "destination": t.destination,
                "status": t.status,
                "routing_source": t.routing_source,
                "eta": (
                    services.eta_string(
                        planned_distance_km=t.planned_distance_km,
                        estimated_duration_seconds=t.estimated_duration_seconds,
                    )
                    if t.status in (Trip.Status.DISPATCHED, Trip.Status.IN_TRANSIT)
                    else None
                ),
            }
            for t in trips
        ]
        return Response(results)


class ReportsSummaryView(APIView):
    """
    GET /api/analytics/reports/

    Fleet-wide summary: fuel efficiency, utilization, operational cost.
    Restricted to Fleet Manager + Financial Analyst (module='analytics').
    """

    module = "analytics"
    permission_classes = [IsAuthenticated, HasModulePermission]

    def get(self, request: Request) -> Response:
        return Response(
            {
                "fuel_efficiency_km_per_l": services.fuel_efficiency(),
                "fleet_utilization_percent": services.fleet_utilization_percent(),
                "operational_cost": float(services.fleet_operational_cost()),
                "redundancy_rate_percent": services.redundancy_rate_percent(),
            }
        )


class VehicleROIView(APIView):
    """
    GET /api/analytics/reports/roi/

    Per-vehicle ROI breakdown table.
    ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost.
    Note: Revenue is 0 in the current spec; extend Trip/Vehicle with a
    revenue field to make this meaningful.
    """

    module = "analytics"
    permission_classes = [IsAuthenticated, HasModulePermission]

    def get(self, request: Request) -> Response:
        return Response(services.per_vehicle_roi_list())


class ReportsCSVExportView(APIView):
    """
    GET /api/analytics/reports/export/csv/

    Per-vehicle cost + ROI breakdown as a downloadable CSV.
    (Mandatory deliverable: 'Support CSV export' — spec 3.8)
    """

    module = "analytics"
    permission_classes = [IsAuthenticated, HasModulePermission]

    def get(self, request: Request) -> HttpResponse:
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="transitops_report.csv"'

        writer = csv.writer(response)
        writer.writerow(
            [
                "Registration No",
                "Vehicle",
                "Status",
                "Acquisition Cost (INR)",
                "Operational Cost (Fuel + Maintenance)",
                "Odometer (km)",
                "ROI",
            ]
        )

        for row in services.per_vehicle_roi_list():
            writer.writerow(
                [
                    row["registration_number"],
                    row["name_model"],
                    row["status"],
                    row["acquisition_cost"],
                    row["operational_cost"],
                    row["odometer"],
                    row["roi"],
                ]
            )

        return response
