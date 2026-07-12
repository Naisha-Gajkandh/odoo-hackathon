"""
drivers/views.py

DriverViewSet — full CRUD plus:

GET /api/drivers/assignable/
    Returns only drivers available for trip assignment.

GET /api/drivers/?search=
    Search by name, license number, contact.

GET /api/drivers/?ordering=
    Sort drivers.
"""

from __future__ import annotations

from django.utils import timezone
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

    filterset_fields = [
        "status",
        "license_category",
    ]

    search_fields = [
        "name",
        "license_number",
        "contact_number",
    ]

    ordering_fields = [
        "name",
        "license_expiry_date",
        "safety_score",
        "status",
        "updated_at",
    ]

    ordering = ["-updated_at"]

    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]

    def get_queryset(self):
        return Driver.objects.all()

    @action(detail=False, methods=["get"], url_path="assignable")
    def assignable(self, request: Request) -> Response:
        """
        GET /api/drivers/assignable/

        Returns drivers who can be assigned to trips:

        - Status = Available
        - License is not expired
        - Suspended drivers excluded automatically
        """

        today = timezone.now().date()

        queryset = Driver.objects.filter(
            status=Driver.Status.AVAILABLE,
            license_expiry_date__gte=today,
        )

        serializer = DriverSerializer(queryset, many=True)

        return Response(serializer.data)
