from django.db import models
from django.utils import timezone

from core.models import BaseModel


class Driver(BaseModel):
    class Status(models.TextChoices):
        AVAILABLE = "Available", "Available"
        ON_TRIP = "On Trip", "On Trip"
        OFF_DUTY = "Off Duty", "Off Duty"
        SUSPENDED = "Suspended", "Suspended"

    name = models.CharField(max_length=128)
    license_number = models.CharField(max_length=32, unique=True)
    license_category = models.CharField(max_length=16)  # e.g. LMV
    license_expiry_date = models.DateField()
    contact_number = models.CharField(max_length=20)
    safety_score = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.AVAILABLE)

    def __str__(self):
        return self.name

    @property
    def license_expired(self):
        return self.license_expiry_date < timezone.now().date()

    def is_assignable(self):
        """Business rule (4): Drivers with expired licenses or Suspended
        status cannot be assigned to trips."""
        return self.status == Driver.Status.AVAILABLE and not self.license_expired


class SafetyEvent(BaseModel):
    """Raw telematics events feeding the rolling safety score average."""

    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name="safety_events")
    event_type = models.CharField(max_length=64)  # e.g. "hard_brake", "speeding", "clean_trip"
    score_delta = models.DecimalField(max_digits=5, decimal_places=2)
    recorded_at = models.DateTimeField(auto_now_add=True)


def recalculate_safety_score(driver: Driver, window=50):
    """
    Rolling average over the last `window` safety events. Call this after
    creating a new SafetyEvent (see drivers/signals.py).
    """
    from django.db.models import Avg

    recent = driver.safety_events.order_by("-recorded_at")[:window]
    avg = SafetyEvent.objects.filter(id__in=[e.id for e in recent]).aggregate(
        avg=Avg("score_delta")
    )["avg"]

    driver.safety_score = round(avg, 2) if avg is not None else driver.safety_score
    driver.save(update_fields=["safety_score"])
    return driver.safety_score
