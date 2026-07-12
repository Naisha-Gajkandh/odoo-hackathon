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

    license_number = models.CharField(
        max_length=32,
        unique=True
    )

    license_category = models.CharField(
        max_length=32
    )

    license_expiry_date = models.DateField()

    contact_number = models.CharField(
        max_length=20
    )

    safety_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=100
    )

    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.AVAILABLE,
        db_index=True
    )

    class Meta:
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["license_expiry_date"]),
        ]

    def __str__(self):
        return self.name

    @property
    def license_expired(self):
        return self.license_expiry_date < timezone.now().date()

    @property
    def is_assignable(self):
        return (
            self.status == Driver.Status.AVAILABLE
            and not self.license_expired
        )


class SafetyEvent(BaseModel):

    driver = models.ForeignKey(
        Driver,
        on_delete=models.CASCADE,
        related_name="safety_events"
    )

    event_type = models.CharField(
        max_length=64
    )

    score_delta = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    recorded_at = models.DateTimeField(
        auto_now_add=True
    )


def recalculate_safety_score(driver: Driver, window=50):

    from django.db.models import Avg

    recent_ids = (
        driver.safety_events
        .order_by("-recorded_at")
        .values_list("id", flat=True)[:window]
    )

    avg = (
        SafetyEvent.objects
        .filter(id__in=recent_ids)
        .aggregate(avg=Avg("score_delta"))["avg"]
    )

    if avg is not None:
        score = round(float(avg), 2)

        score = max(0, min(score, 100))

        driver.safety_score = score

        driver.save(
            update_fields=["safety_score"]
        )

    return driver.safety_score