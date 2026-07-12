"""
trips/serializers.py

TripCreateSerializer — validates all business rules at creation time and
auto-fills planned_distance_km + estimated_duration_seconds via OSRM routing.

trip_code is auto-generated (format: TR{id:04d}) so the frontend never
needs to supply it.

Validation order (all errors collected before raising so the frontend gets
a complete error list in one request):
  1. Cargo weight vs vehicle capacity
  2. Vehicle availability (not On Trip / In Shop / Retired)
  3. Driver availability (not Suspended / On Trip)
  4. Driver license expiry
"""

from __future__ import annotations

import logging

from rest_framework import serializers

from core.exceptions import BusinessRuleError
from drivers.models import Driver
from fleet.models import Vehicle

from .models import Trip
from .routing import geocode_and_route

logger = logging.getLogger(__name__)


class TripCreateSerializer(serializers.ModelSerializer):
    # Expose routing metadata as read-only so frontend can show ETA source
    routing_source = serializers.CharField(read_only=True)
    estimated_duration_seconds = serializers.IntegerField(read_only=True)

    class Meta:
        model = Trip
        fields = [
            "id",
            "trip_code",
            "trip_type",
            "source",
            "destination",
            "vehicle",
            "driver",
            "cargo_weight_kg",
            "planned_distance_km",
            "estimated_duration_seconds",
            "routing_source",
            "final_odometer",
            "fuel_consumed_liters",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "trip_code",
            "status",
            "estimated_duration_seconds",
            "routing_source",
        ]

    def validate(self, attrs: dict) -> dict:
        errors: list[str] = []
        vehicle: Vehicle | None = attrs.get("vehicle")
        driver: Driver | None = attrs.get("driver")
        cargo_weight = attrs.get("cargo_weight_kg")
        trip_type = attrs.get("trip_type", Trip.TripType.DELIVERY)

        # ── 0. Empty Return Validation ───────────────────────────────────────
        if trip_type == Trip.TripType.EMPTY_RETURN and cargo_weight and cargo_weight > 0:
            errors.append("Empty Return trips must have a cargo weight of 0 kg.")

        # ── 1. Cargo Overload Guard ──────────────────────────────────────────
        # Returns the EXACT structured error array required by the spec:
        # ["Vehicle Capacity: 250 kg", "Cargo Weight: 700 kg",
        #  "Capacity exceeded by 450 kg - dispatch blocked."]
        if vehicle and cargo_weight is not None:
            if cargo_weight > vehicle.max_load_capacity_kg:
                overage = cargo_weight - vehicle.max_load_capacity_kg
                errors.extend([
                    f"Vehicle Capacity: {vehicle.max_load_capacity_kg:g} kg",
                    f"Cargo Weight: {cargo_weight:g} kg",
                    f"Capacity exceeded by {overage:g} kg - dispatch blocked.",
                ])

        # ── 2. Vehicle availability ──────────────────────────────────────────
        if vehicle and vehicle.status != Vehicle.Status.AVAILABLE:
            errors.append(
                f"Vehicle {vehicle.registration_number} is currently "
                f"'{vehicle.status}' and cannot be assigned to a new trip."
            )

        # ── 3. Driver availability / suspension ─────────────────────────────
        if driver:
            if driver.status == Driver.Status.SUSPENDED:
                errors.append(f"Driver {driver.name} is Suspended and cannot be assigned.")
            elif driver.status != Driver.Status.AVAILABLE:
                errors.append(
                    f"Driver {driver.name} is currently '{driver.status}' "
                    "and cannot be assigned to a new trip."
                )

            # ── 4. License expiry ────────────────────────────────────────────
            if driver.license_expired:
                errors.append(
                    f"Driver {driver.name}'s license expired on "
                    f"{driver.license_expiry_date} and cannot be assigned."
                )

        if errors:
            raise BusinessRuleError(errors)

        # ── OSRM Routing: auto-fill distance & ETA ───────────────────────────
        # This runs AFTER all business-rule checks pass (no point routing if
        # the trip would be rejected anyway).
        source = attrs.get("source", "")
        destination = attrs.get("destination", "")

        if source and destination:
            try:
                route = geocode_and_route(source, destination)
                if route is not None:
                    # Overwrite manually-entered distance with the real routed value
                    attrs["planned_distance_km"] = route.distance_km
                    attrs["estimated_duration_seconds"] = route.duration_seconds
                    attrs["routing_source"] = Trip.ROUTING_SOURCE_OSRM
                    logger.info(
                        "OSRM routed %s→%s: %.1f km, %ds",
                        source,
                        destination,
                        route.distance_km,
                        route.duration_seconds,
                    )
                else:
                    # Geocoding or routing failed → keep the manually entered value
                    attrs.setdefault("routing_source", Trip.ROUTING_SOURCE_MANUAL)
                    logger.info(
                        "OSRM routing unavailable for %s→%s; using manual distance",
                        source,
                        destination,
                    )
            except Exception as exc:  # noqa: BLE001
                # Never let a routing failure block trip creation
                logger.warning(
                    "Unexpected error in routing for %s→%s: %s", source, destination, exc
                )
                attrs.setdefault("routing_source", Trip.ROUTING_SOURCE_MANUAL)

        return attrs
