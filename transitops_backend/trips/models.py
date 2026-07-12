"""
trips/models.py

Trip model with FSM-enforced lifecycle:
  Draft → Dispatched → In-Transit → Completed
  Dispatched / In-Transit → Cancelled (only branch allowed)

Added fields (v2):
  estimated_duration_seconds  — filled by OSRM routing at trip creation
  routing_source              — "osrm" | "manual"  (audit trail for the ETA)
"""

from __future__ import annotations

from django.db import models
from django_fsm import FSMField, transition

from core.models import BaseModel
from drivers.models import Driver
from fleet.models import Vehicle


class Trip(BaseModel):
    class Status:
        DRAFT = "Draft"
        DISPATCHED = "Dispatched"
        IN_TRANSIT = "In-Transit"
        COMPLETED = "Completed"
        CANCELLED = "Cancelled"

    STATUS_CHOICES = [
        (Status.DRAFT, "Draft"),
        (Status.DISPATCHED, "Dispatched"),
        (Status.IN_TRANSIT, "In-Transit"),
        (Status.COMPLETED, "Completed"),
        (Status.CANCELLED, "Cancelled"),
    ]

    ROUTING_SOURCE_MANUAL = "manual"
    ROUTING_SOURCE_OSRM = "osrm"

    trip_code = models.CharField(max_length=16, unique=True, db_index=True)
    source = models.CharField(max_length=128)
    destination = models.CharField(max_length=128)
    vehicle = models.ForeignKey(
        Vehicle, null=True, blank=True, on_delete=models.PROTECT, related_name="trips"
    )
    driver = models.ForeignKey(
        Driver, null=True, blank=True, on_delete=models.PROTECT, related_name="trips"
    )
    cargo_weight_kg = models.DecimalField(max_digits=10, decimal_places=2)
    planned_distance_km = models.DecimalField(max_digits=10, decimal_places=2)

    # Routing fields — populated automatically by OSRM when geocoding succeeds
    estimated_duration_seconds = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Driving duration in seconds from OSRM. Used for ETA calculation.",
    )
    routing_source = models.CharField(
        max_length=16,
        default=ROUTING_SOURCE_MANUAL,
        choices=[
            (ROUTING_SOURCE_MANUAL, "Manual entry"),
            (ROUTING_SOURCE_OSRM, "OSRM (real routing)"),
        ],
        help_text="Indicates whether planned_distance_km came from OSRM or was typed manually.",
    )

    # Trip completion fields
    final_odometer = models.PositiveIntegerField(null=True, blank=True)
    fuel_consumed_liters = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )

    # django-fsm field — transitions are ONLY valid through the decorated methods below.
    # Direct assignment (trip.status = "Completed") is blocked by FSM protection.
    status = FSMField(default=Status.DRAFT, choices=STATUS_CHOICES, protected=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self) -> str:
        return self.trip_code

    # ── State machine transitions ──────────────────────────────────────────────
    @transition(field=status, source=Status.DRAFT, target=Status.DISPATCHED)
    def dispatch(self) -> None:
        pass

    @transition(field=status, source=Status.DISPATCHED, target=Status.IN_TRANSIT)
    def start_transit(self) -> None:
        pass

    @transition(field=status, source=Status.IN_TRANSIT, target=Status.COMPLETED)
    def complete(self) -> None:
        pass

    @transition(
        field=status,
        source=[Status.DISPATCHED, Status.IN_TRANSIT],
        target=Status.CANCELLED,
    )
    def cancel(self) -> None:
        pass
