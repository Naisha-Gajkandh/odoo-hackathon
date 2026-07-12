"""
maintenance/views.py

MaintenanceRecordViewSet — full CRUD.
Status transitions (Active→In Shop, Closed→Available) happen automatically
via the post_save signal registered in maintenance/apps.py.
"""

from __future__ import annotations

from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated

from core.permissions import HasModulePermission

from .models import MaintenanceRecord
from .serializers import MaintenanceRecordSerializer


class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    module = "maintenance"
    permission_classes = [IsAuthenticated, HasModulePermission]
    serializer_class = MaintenanceRecordSerializer
    filterset_fields = ["status", "vehicle"]
    search_fields = ["service_type", "vehicle__registration_number"]
    ordering_fields = ["date", "cost", "status", "updated_at"]
    ordering = ["-updated_at"]
    filter_backends = [*viewsets.ModelViewSet.filter_backends, SearchFilter, OrderingFilter]

    def get_queryset(self):
        return MaintenanceRecord.objects.select_related("vehicle").all()
        # NOTE: creating/updating with status="Active" triggers
        # maintenance/signals.py automatically — no extra code needed here.
