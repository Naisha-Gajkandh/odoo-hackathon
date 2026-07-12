"""
maintenance/serializers.py

MaintenanceRecordSerializer — full model serializer.
Creating with status=Active automatically triggers the vehicle status
transition to In Shop via the post_save signal in maintenance/signals.py.
"""

from __future__ import annotations

from rest_framework import serializers

from .models import MaintenanceRecord


class MaintenanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRecord
        fields = [
            "id",
            "vehicle",
            "service_type",
            "cost",
            "date",
            "status",
            "created_at",
            "updated_at",
        ]
