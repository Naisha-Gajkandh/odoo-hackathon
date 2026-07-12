from django.db import models

from core.models import BaseModel
from fleet.models import Vehicle
from trips.models import Trip


class FuelLog(BaseModel):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="fuel_logs")
    date = models.DateField()
    liters = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=12, decimal_places=2)


class Expense(BaseModel):
    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        APPROVED = "Approved", "Approved"
        REJECTED = "Rejected", "Rejected"

    trip = models.ForeignKey(
        Trip, null=True, blank=True, on_delete=models.SET_NULL, related_name="expenses"
    )
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="expenses")
    toll_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    other_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    reason = models.CharField(max_length=255, blank=True, default="")
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)

    def clean(self):
        from core.exceptions import BusinessRuleError
        # Business rule (Module 6): expenses linked to a trip must
        # reference a valid, active (non-cancelled) trip record.
        if self.trip and self.trip.status == Trip.Status.CANCELLED:
            raise BusinessRuleError(
                f"Expense cannot be linked to cancelled trip {self.trip.trip_code}."
            )
