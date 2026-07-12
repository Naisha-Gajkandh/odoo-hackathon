"""
fleet/serializers.py

VehicleSerializer with:
- Validated registration_number (strip + uppercase)
- Cleaned acquisition_cost (handles INR-formatted strings like "6,20,000")
- Read-only `status` (only changed via business logic, not direct API edits)
"""

from __future__ import annotations

import re

from rest_framework import serializers

from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            "id",
            "registration_number",
            "name_model",
            "vehicle_type",
            "max_load_capacity_kg",
            "odometer",
            "acquisition_cost",
            "status",
            "region",
            "created_at",
            "updated_at",
        ]
        # status only changes via business logic (dispatch/complete/cancel/retire/maintenance)
        read_only_fields = ["status"]

    def validate_acquisition_cost(self, value):
        """
        Accept INR-formatted strings like "6,20,000" from the frontend.
        DRF will usually parse these from JSON already, but guard the string case.
        """
        if isinstance(value, str):
            cleaned = re.sub(r"[^\d.]", "", value)
            return float(cleaned) if cleaned else 0
        return value

    def validate_registration_number(self, value: str) -> str:
        return value.strip().upper()
