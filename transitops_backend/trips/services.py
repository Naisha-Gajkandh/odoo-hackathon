"""
trips/services.py

This is the single place where Trip <-> Vehicle <-> Driver status stays
consistent. NEVER change trip.status directly in a view -- always call
these functions. Every function is wrapped in transaction.atomic() so a
crash mid-way never leaves, e.g., a vehicle stuck as "On Trip" with no
trip actually pointing at it (the classic bug in this kind of system).
"""

from django.db import transaction

from core.exceptions import BusinessRuleError
from drivers.models import Driver
from fleet.models import Vehicle

from .models import Trip


@transaction.atomic
def dispatch_trip(trip: Trip) -> Trip:
    # lock the rows so two concurrent dispatch requests for the same
    # vehicle/driver can't both succeed
    vehicle = Vehicle.objects.select_for_update().get(pk=trip.vehicle_id)
    driver = Driver.objects.select_for_update().get(pk=trip.driver_id)

    if vehicle.status != Vehicle.Status.AVAILABLE:
        raise BusinessRuleError(f"Vehicle {vehicle.registration_number} is not Available.")
    if not driver.is_assignable():
        raise BusinessRuleError(f"Driver {driver.name} is not eligible for assignment.")
    if trip.cargo_weight_kg > vehicle.max_load_capacity_kg:
        overage = trip.cargo_weight_kg - vehicle.max_load_capacity_kg
        raise BusinessRuleError(
            [
                f"Vehicle Capacity: {vehicle.max_load_capacity_kg:g} kg",
                f"Cargo Weight: {trip.cargo_weight_kg:g} kg",
                f"Capacity exceeded by {overage:g} kg - dispatch blocked.",
            ]
        )

    trip.dispatch()  # FSM transition: Draft -> Dispatched
    trip.save()

    vehicle.status = Vehicle.Status.ON_TRIP
    vehicle.save(update_fields=["status"])

    driver.status = Driver.Status.ON_TRIP
    driver.save(update_fields=["status"])

    return trip


@transaction.atomic
def complete_trip(trip: Trip, final_odometer: int, fuel_consumed_liters) -> Trip:
    vehicle = Vehicle.objects.select_for_update().get(pk=trip.vehicle_id)
    driver = Driver.objects.select_for_update().get(pk=trip.driver_id)

    # allow completing straight from Dispatched or via In-Transit
    if trip.status == Trip.Status.DISPATCHED:
        trip.start_transit()
        trip.save()

    trip.final_odometer = final_odometer
    trip.fuel_consumed_liters = fuel_consumed_liters
    trip.complete()  # FSM transition: In-Transit -> Completed
    trip.save()

    vehicle.odometer = final_odometer
    vehicle.status = Vehicle.Status.AVAILABLE
    vehicle.save(update_fields=["odometer", "status"])

    driver.status = Driver.Status.AVAILABLE
    driver.save(update_fields=["status"])

    return trip


@transaction.atomic
def cancel_trip(trip: Trip) -> Trip:
    vehicle = Vehicle.objects.select_for_update().get(pk=trip.vehicle_id)
    driver = Driver.objects.select_for_update().get(pk=trip.driver_id)

    trip.cancel()  # FSM transition: Dispatched/In-Transit -> Cancelled
    trip.save()

    # Business rule: cancelling a dispatched trip restores both to Available
    vehicle.status = Vehicle.Status.AVAILABLE
    vehicle.save(update_fields=["status"])

    driver.status = Driver.Status.AVAILABLE
    driver.save(update_fields=["status"])

    return trip


@transaction.atomic
def reject_trip(trip: Trip) -> Trip:
    vehicle = Vehicle.objects.select_for_update().get(pk=trip.vehicle_id)
    driver = Driver.objects.select_for_update().get(pk=trip.driver_id)

    # If currently Dispatched, move to In-Transit first before rejecting
    if trip.status == Trip.Status.DISPATCHED:
        trip.start_transit()
        trip.save()

    trip.reject_delivery()  # FSM transition: In-Transit -> Rejected
    trip.save()

    # Releasing driver and vehicle
    vehicle.status = Vehicle.Status.AVAILABLE
    vehicle.save(update_fields=["status"])

    driver.status = Driver.Status.AVAILABLE
    driver.save(update_fields=["status"])

    return trip


@transaction.atomic
def return_damaged_trip(trip: Trip) -> Trip:
    vehicle = Vehicle.objects.select_for_update().get(pk=trip.vehicle_id)
    driver = Driver.objects.select_for_update().get(pk=trip.driver_id)

    # If currently Dispatched, move to In-Transit first before returning
    if trip.status == Trip.Status.DISPATCHED:
        trip.start_transit()
        trip.save()

    trip.return_damaged()  # FSM transition: In-Transit -> Returned
    trip.save()

    # Releasing driver and vehicle
    vehicle.status = Vehicle.Status.AVAILABLE
    vehicle.save(update_fields=["status"])

    driver.status = Driver.Status.AVAILABLE
    driver.save(update_fields=["status"])

    return trip
