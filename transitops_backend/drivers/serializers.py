"""
drivers/serializers.py

Driver serializer with:
- `license_expired` computed field (read-only, booleanf)
- `is_assignable` computed field (read-only, boolean) — lets the frontend
  disable a driver in the dropdown without an extra API call
- status and safety_score are read-only (changed only via business logic)
"""

from __future__ import annotations

from rest_framework import serializers

from .models import Driver


class DriverSerializer(serializers.ModelSerializer):
    license_expired = serializers.BooleanField(read_only=True)
    is_assignable = serializers.SerializerMethodField()

    class Meta:
        model = Driver
        fields = [
            "id",
            "name",
            "license_number",
            "license_category",
            "license_expiry_date",
            "contact_number",
            "safety_score",
            "status",
            "license_expired",
            "is_assignable",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["status", "safety_score"]

    def get_is_assignable(self, obj: Driver) -> bool:
        return obj.is_assignable()
