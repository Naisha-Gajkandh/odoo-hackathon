from django.db import models

from core.models import BaseModel


class Vehicle(BaseModel):
    class Status(models.TextChoices):
        AVAILABLE = "Available", "Available"
        ON_TRIP = "On Trip", "On Trip"
        IN_SHOP = "In Shop", "In Shop"
        RETIRED = "Retired", "Retired"

    registration_number = models.CharField(max_length=32, unique=True, db_index=True)
    name_model = models.CharField(max_length=128)
    vehicle_type = models.CharField(max_length=64)
    max_load_capacity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    odometer = models.PositiveIntegerField(default=0)
    acquisition_cost = models.DecimalField(max_digits=14, decimal_places=2)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.AVAILABLE)
    region = models.CharField(max_length=64, blank=True, default="")

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.registration_number} ({self.name_model})"


class DispatchableVehicleManager(models.Manager):
    """
    Business rule (3.3 / 4): Retired or In Shop vehicles must NEVER appear
    in the dispatch selection pool. Trip Dispatcher's vehicle dropdown
    should query Vehicle.dispatchable.all(), never Vehicle.objects.all().
    """

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(
                is_deleted=False,
                status=Vehicle.Status.AVAILABLE,
            )
        )


# attach as an extra manager without disturbing the default `objects`
Vehicle.add_to_class("dispatchable", DispatchableVehicleManager())
