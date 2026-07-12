"""
maintenance/signals.py

Automated State Hook (Module 5 backend requirement):
  - Saving a MaintenanceRecord with status=Active -> Vehicle.status = In Shop
  - Closing that record -> Vehicle.status = Available (unless the vehicle
    is Retired, which must never be overwritten back to Available)

Register this in maintenance/apps.py's ready() method so it's wired up
automatically.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver

from fleet.models import Vehicle

from .models import MaintenanceRecord


@receiver(post_save, sender=MaintenanceRecord)
def sync_vehicle_status_on_maintenance_save(sender, instance: MaintenanceRecord, created, **kwargs):
    vehicle = instance.vehicle

    if vehicle.status == Vehicle.Status.RETIRED:
        # Retired vehicles never flip back to Available/In Shop automatically
        return

    if instance.status == MaintenanceRecord.Status.ACTIVE:
        if vehicle.status != Vehicle.Status.IN_SHOP:
            vehicle.status = Vehicle.Status.IN_SHOP
            vehicle.save(update_fields=["status"])

    elif instance.status == MaintenanceRecord.Status.CLOSED:
        # only restore to Available if no OTHER active maintenance record
        # exists for this vehicle (a vehicle could have overlapping jobs)
        still_active = vehicle.maintenance_records.filter(
            status=MaintenanceRecord.Status.ACTIVE
        ).exclude(pk=instance.pk).exists()

        if not still_active and vehicle.status == Vehicle.Status.IN_SHOP:
            vehicle.status = Vehicle.Status.AVAILABLE
            vehicle.save(update_fields=["status"])
