"""
Driver serializer.

Provides:
- license_expired computed field
- is_assignable computed field
- read-only status and safety_score
"""

from __future__ import annotations

from rest_framework import serializers

from .models import Driver


class DriverSerializer(serializers.ModelSerializer):
    license_expired = serializers.BooleanField(read_only=True)

    is_assignable = serializers.BooleanField(read_only=True)

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

        read_only_fields = [
            "status",
            "safety_score",
            "license_expired",
            "is_assignable",
            "created_at",
            "updated_at",
        ]
