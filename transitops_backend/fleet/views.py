"""
fleet/views.py

VehicleViewSet — full CRUD plus:
  GET  /api/fleet/vehicles/dispatchable/  → only Available vehicles
       (feeds the trip creation dropdown; hides In Shop + Retired)
  GET  /api/fleet/vehicles/?search=       → search by reg number / model
  GET  /api/fleet/vehicles/?ordering=     → sort by any field
  POST /api/fleet/vehicles/{id}/retire/   → mark a vehicle as Retired
"""

from __future__ import annotations

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from core.permissions import HasModulePermission

from .models import Vehicle
from .serializers import VehicleSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    module = "fleet"
    permission_classes = [IsAuthenticated, HasModulePermission]
    serializer_class = VehicleSerializer
    filterset_fields = ["status", "vehicle_type", "region"]
    search_fields = ["registration_number", "name_model", "vehicle_type"]
    ordering_fields = [
        "registration_number", "name_model", "odometer", "acquisition_cost", "updated_at"
    ]
    ordering = ["-updated_at"]
    filter_backends = [*viewsets.ModelViewSet.filter_backends, SearchFilter, OrderingFilter]

    def get_queryset(self):
        # Soft-delete manager already excludes deleted rows
        return Vehicle.objects.all()

    @action(detail=False, methods=["get"], url_path="dispatchable")
    def dispatchable(self, request: Request) -> Response:
        """
        GET /api/fleet/vehicles/dispatchable/

        Returns only vehicles with status=Available. This is the authoritative
        list the trip creation form must use — never the full list.
        Business rule: Retired + In Shop vehicles are excluded automatically.
        """
        qs = Vehicle.dispatchable.all()
        serializer = VehicleSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="retire")
    def retire(self, request: Request, pk=None) -> Response:
        """
        POST /api/fleet/vehicles/{id}/retire/

        Permanently retires a vehicle. A retired vehicle cannot be dispatched
        and its status will never be restored by maintenance signals.
        Only a Fleet Manager can call this (RBAC: module='fleet', full access).
        """
        vehicle: Vehicle = self.get_object()
        if vehicle.status == Vehicle.Status.ON_TRIP:
            return Response(
                {
                    "status": "validation_failed",
                    "errors": [
                        f"Vehicle {vehicle.registration_number} is currently On Trip "
                        "and cannot be retired until the trip is completed or cancelled."
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        vehicle.status = Vehicle.Status.RETIRED
        vehicle.save(update_fields=["status"])
        return Response(VehicleSerializer(vehicle).data)
