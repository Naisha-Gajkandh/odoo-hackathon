from django.db import models

from core.models import BaseModel
from fleet.models import Vehicle


class MaintenanceRecord(BaseModel):
    class Status(models.TextChoices):
        ACTIVE = "Active", "Active"
        CLOSED = "Closed", "Closed"

    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, related_name="maintenance_records"
    )
    service_type = models.CharField(max_length=128)  # e.g. "Oil Change"
    cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    date = models.DateField()
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.ACTIVE)

    def __str__(self):
        return f"{self.vehicle.registration_number} - {self.service_type}"
