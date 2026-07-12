"""
drivers/views.py

DriverViewSet — full CRUD plus:
  GET /api/drivers/assignable/  → only Available drivers with valid licenses
      (feeds the trip creation dropdown; hides Suspended + expired)
  GET /api/drivers/?search=     → search by name / license number
  GET /api/drivers/?ordering=   → sort by any field
"""

from __future__ import annotations

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from core.permissions import HasModulePermission

from .models import Driver
from .serializers import DriverSerializer


class DriverViewSet(viewsets.ModelViewSet):
    module = "drivers"
    permission_classes = [IsAuthenticated, HasModulePermission]
    serializer_class = DriverSerializer
    filterset_fields = ["status", "license_category"]
    search_fields = ["name", "license_number", "contact_number"]
    ordering_fields = ["name", "license_expiry_date", "safety_score", "status", "updated_at"]
    ordering = ["-updated_at"]
    filter_backends = [*viewsets.ModelViewSet.filter_backends, SearchFilter, OrderingFilter]

    def get_queryset(self):
        return Driver.objects.all()

    @action(detail=False, methods=["get"], url_path="assignable")
    def assignable(self, request: Request) -> Response:
        """
        GET /api/drivers/assignable/

        Returns only drivers who pass is_assignable():
          - status == Available
          - license not expired
          - not Suspended

        The trip creation form must use this list, never the full /drivers/ list.
        """
        available = Driver.objects.filter(status=Driver.Status.AVAILABLE)
        assignable_drivers = [d for d in available if d.is_assignable()]
        serializer = DriverSerializer(assignable_drivers, many=True)
        return Response(serializer.data)
