"""
trips/views.py

TripViewSet — CRUD + lifecycle actions.

Custom actions:
  POST /api/trips/{id}/dispatch/   → Draft → Dispatched (vehicle+driver go On Trip)
  POST /api/trips/{id}/complete/   → In-Transit → Completed (vehicle+driver go Available)
       body: {final_odometer, fuel_consumed_liters}
  POST /api/trips/{id}/cancel/     → Dispatched/In-Transit → Cancelled (restore both)
  GET  /api/trips/{id}/eta/        → Returns human-readable ETA for active trips

trip_code auto-generation:
  The serializer marks trip_code as read_only. We generate it in perform_create()
  as "TR{id:04d}" using the database-assigned PK. A temporary placeholder is
  saved first, then immediately updated — this avoids a race on concurrent inserts.
"""

from __future__ import annotations

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from core.permissions import HasModulePermission

from . import services
from .models import Trip
from .serializers import TripCreateSerializer


class TripViewSet(viewsets.ModelViewSet):
    module = "trips"
    permission_classes = [IsAuthenticated, HasModulePermission]
    serializer_class = TripCreateSerializer
    filterset_fields = ["status", "vehicle", "driver"]
    search_fields = ["trip_code", "source", "destination"]
    ordering_fields = ["trip_code", "status", "created_at", "updated_at"]
    ordering = ["-updated_at"]
    filter_backends = [*viewsets.ModelViewSet.filter_backends, SearchFilter, OrderingFilter]

    def get_queryset(self):
        return Trip.objects.select_related("vehicle", "driver").all()

    def perform_create(self, serializer) -> None:
        """
        Save with a placeholder trip_code first (we need the PK to build it).
        Immediately update to the real code. This keeps the UNIQUE constraint
        happy while avoiding any application-layer sequence tracking.
        """
        instance = serializer.save(trip_code="TR-PENDING")
        instance.trip_code = f"TR{instance.pk:04d}"
        instance.save(update_fields=["trip_code"])

    # ── POST /api/trips/{id}/dispatch/ ─────────────────────────────────────────
    @action(detail=True, methods=["post"])
    def dispatch(self, request: Request, pk=None) -> Response:
        """
        Dispatch a Draft trip.

        - Validates vehicle + driver availability with row-level locks.
        - Sets vehicle.status = On Trip, driver.status = On Trip.
        - Returns the updated trip.
        """
        trip = self.get_object()
        trip = services.dispatch_trip(trip)
        return Response(TripCreateSerializer(trip).data, status=status.HTTP_200_OK)

    # ── POST /api/trips/{id}/complete/ ─────────────────────────────────────────
    @action(detail=True, methods=["post"])
    def complete(self, request: Request, pk=None) -> Response:
        """
        Complete an active trip.

        **Request body:**
        ```json
        {
          "final_odometer": 52000,
          "fuel_consumed_liters": 45.5
        }
        ```

        - Updates vehicle odometer.
        - Sets vehicle.status = Available, driver.status = Available.
        """
        trip = self.get_object()
        final_odometer = request.data.get("final_odometer")
        fuel_consumed = request.data.get("fuel_consumed_liters")

        if final_odometer is None or fuel_consumed is None:
            return Response(
                {
                    "status": "validation_failed",
                    "errors": ["Both 'final_odometer' and 'fuel_consumed_liters' are required."],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        trip = services.complete_trip(
            trip,
            final_odometer=int(final_odometer),
            fuel_consumed_liters=fuel_consumed,
        )
        return Response(TripCreateSerializer(trip).data, status=status.HTTP_200_OK)

    # ── POST /api/trips/{id}/cancel/ ───────────────────────────────────────────
    @action(detail=True, methods=["post"])
    def cancel(self, request: Request, pk=None) -> Response:
        """
        Cancel a Dispatched or In-Transit trip.

        Restores both vehicle.status and driver.status to Available.
        """
        trip = self.get_object()
        trip = services.cancel_trip(trip)
        return Response(TripCreateSerializer(trip).data, status=status.HTTP_200_OK)

    # ── GET /api/trips/{id}/eta/ ───────────────────────────────────────────────
    @action(detail=True, methods=["get"])
    def eta(self, request: Request, pk=None) -> Response:
        """
        Returns a human-readable ETA for an active trip.

        Uses OSRM-derived duration when available; falls back to distance/speed.
        Returns `null` for completed or cancelled trips.
        """
        from analytics.services import eta_string

        trip = self.get_object()
        if trip.status not in (Trip.Status.DISPATCHED, Trip.Status.IN_TRANSIT):
            return Response({"eta": None, "routing_source": trip.routing_source})

        eta = eta_string(
            planned_distance_km=trip.planned_distance_km,
            estimated_duration_seconds=trip.estimated_duration_seconds,
        )
        return Response({
            "trip_code": trip.trip_code,
            "eta": eta,
            "routing_source": trip.routing_source,
            "planned_distance_km": float(trip.planned_distance_km),
            "estimated_duration_seconds": trip.estimated_duration_seconds,
        })
