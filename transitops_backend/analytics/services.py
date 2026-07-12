"""
analytics/services.py

The single calculation module for the whole platform.
Every number shown on the Dashboard and Reports screens is computed here
so the formulas exist in exactly one place.

Formulas:
  Total Operational Cost   = Fuel Cost + Maintenance Cost + Toll/Other Cost
  Fuel Efficiency           = Total Distance (completed trips) / Total Fuel (km/l)
  Fleet Utilization (%)     = (Vehicles On Trip / Total Active Vehicles) * 100
  Vehicle ROI               = (Revenue − (Maintenance + Fuel)) / Acquisition Cost

ETA calculation (v2 — OSRM-aware):
  If a trip has estimated_duration_seconds (set by OSRM at creation time) we
  use that directly. Otherwise we fall back to the distance/speed estimate.
"""

from __future__ import annotations

from decimal import Decimal

from django.core.cache import cache
from django.db.models import Count, Sum

from drivers.models import Driver
from finance.models import Expense, FuelLog
from fleet.models import Vehicle
from maintenance.models import MaintenanceRecord
from trips.models import Trip

CACHE_TTL_SECONDS = 60  # Short TTL is fine for a hackathon demo


def _sum(qs, field: str) -> Decimal:
    return qs.aggregate(total=Sum(field))["total"] or Decimal("0")


# ── Per-vehicle calculations ───────────────────────────────────────────────────


def vehicle_operational_cost(vehicle: Vehicle) -> Decimal:
    """Total Operational Cost per vehicle = Fuel + Maintenance (spec 3.7)."""
    fuel_cost = _sum(FuelLog.objects.filter(vehicle=vehicle), "cost")
    maintenance_cost = _sum(MaintenanceRecord.objects.filter(vehicle=vehicle), "cost")
    return fuel_cost + maintenance_cost


def vehicle_roi(vehicle: Vehicle, revenue: Decimal) -> float:
    """
    ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost.
    Returns 0.0 if acquisition_cost is zero (division guard).
    """
    if not vehicle.acquisition_cost:
        return 0.0
    cost = vehicle_operational_cost(vehicle)
    roi = (revenue - cost) / vehicle.acquisition_cost
    return round(float(roi), 4)


# ── Fleet-wide calculations ────────────────────────────────────────────────────


def fleet_operational_cost() -> Decimal:
    """Total Operational Cost across the whole fleet (Fuel + Maintenance + Toll/Other)."""
    fuel_cost = _sum(FuelLog.objects.all(), "cost")
    maintenance_cost = _sum(MaintenanceRecord.objects.all(), "cost")
    toll_cost = _sum(Expense.objects.all(), "toll_cost")
    other_cost = _sum(Expense.objects.all(), "other_cost")
    return fuel_cost + maintenance_cost + toll_cost + other_cost


def fuel_efficiency() -> float:
    """
    Fleet-wide fuel efficiency in km/l.
    Uses actual fuel_consumed_liters from completed trips when available;
    falls back to FuelLog totals.
    """
    completed = Trip.objects.filter(status=Trip.Status.COMPLETED)
    total_distance = _sum(completed, "planned_distance_km")
    # Prefer fuel recorded on the trip itself (most accurate)
    total_fuel_from_trips = _sum(
        completed.filter(fuel_consumed_liters__isnull=False), "fuel_consumed_liters"
    )
    total_fuel_logs = _sum(FuelLog.objects.all(), "liters")
    total_fuel = total_fuel_from_trips if total_fuel_from_trips else total_fuel_logs
    if total_fuel == 0:
        return 0.0
    return round(float(total_distance / total_fuel), 2)


def fleet_utilization_percent() -> float:
    """(Vehicles On Trip / Active Vehicles) * 100. 'Active' excludes Retired."""
    active_vehicles = Vehicle.objects.exclude(status=Vehicle.Status.RETIRED)
    total_active = active_vehicles.count()
    if total_active == 0:
        return 0.0
    on_trip = active_vehicles.filter(status=Vehicle.Status.ON_TRIP).count()
    return round((on_trip / total_active) * 100, 1)


def redundancy_rate_percent() -> float:
    """% of active vehicles that have never been used in any trip — idle asset signal."""
    total = Vehicle.objects.exclude(status=Vehicle.Status.RETIRED).count()
    if total == 0:
        return 0.0
    idle = (
        Vehicle.objects.filter(status=Vehicle.Status.AVAILABLE)
        .annotate(trip_count=Count("trips"))
        .filter(trip_count=0)
        .count()
    )
    return round((idle / total) * 100, 1)


def per_vehicle_roi_list() -> list[dict]:
    """
    Returns a list of per-vehicle ROI summaries for the Reports & Analytics screen.
    Revenue is approximated as 0 for now (no revenue model in the spec).
    Teams can extend this by adding a `revenue` field to Trip or Vehicle.
    """
    results = []
    for vehicle in Vehicle.objects.all():
        op_cost = vehicle_operational_cost(vehicle)
        results.append(
            {
                "id": vehicle.pk,
                "registration_number": vehicle.registration_number,
                "name_model": vehicle.name_model,
                "status": vehicle.status,
                "acquisition_cost": float(vehicle.acquisition_cost),
                "operational_cost": float(op_cost),
                "odometer": vehicle.odometer,
                "roi": vehicle_roi(vehicle, revenue=Decimal("0")),
            }
        )
    return results


# ── Dashboard KPIs ────────────────────────────────────────────────────────────


def dashboard_kpis(cache_key: str = "dashboard_kpis") -> dict:
    """
    Single aggregate endpoint backing the 7 KPI cards.
    Cached for CACHE_TTL_SECONDS since this is called on every dashboard load.
    """
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    vehicles = Vehicle.objects.all()
    drivers = Driver.objects.all()
    trips = Trip.objects.all()

    data = {
        "active_vehicles": vehicles.exclude(status=Vehicle.Status.RETIRED).count(),
        "available_vehicles": vehicles.filter(status=Vehicle.Status.AVAILABLE).count(),
        "vehicles_in_maintenance": vehicles.filter(status=Vehicle.Status.IN_SHOP).count(),
        "active_trips": trips.filter(
            status__in=[Trip.Status.DISPATCHED, Trip.Status.IN_TRANSIT]
        ).count(),
        "pending_trips": trips.filter(status=Trip.Status.DRAFT).count(),
        "drivers_on_duty": drivers.filter(status=Driver.Status.ON_TRIP).count(),
        "fleet_utilization_percent": fleet_utilization_percent(),
    }

    cache.set(cache_key, data, CACHE_TTL_SECONDS)
    return data


def invalidate_dashboard_cache(cache_key: str = "dashboard_kpis") -> None:
    """Call after any trip/vehicle/driver status change to prevent stale KPIs."""
    cache.delete(cache_key)


# ── ETA Engine ────────────────────────────────────────────────────────────────


def eta_string(
    planned_distance_km: Decimal | float | None,
    estimated_duration_seconds: int | None = None,
    avg_speed_kmph: Decimal = Decimal("40"),
) -> str:
    """
    Returns a formatted ETA string like '45 min' or '1h 10m'.

    Priority:
      1. Use estimated_duration_seconds from OSRM (real routing, most accurate).
      2. Fall back to distance / avg_speed calculation.
      3. Return '—' if no data is available.
    """
    if estimated_duration_seconds is not None and estimated_duration_seconds > 0:
        total_minutes = estimated_duration_seconds // 60
        hours, minutes = divmod(total_minutes, 60)
        suffix = " (OSRM)"
        if hours == 0:
            return f"{minutes} min{suffix}"
        return f"{hours}h {minutes:02d}m{suffix}"

    if not planned_distance_km or avg_speed_kmph == 0:
        return "—"

    total_minutes = int((Decimal(str(planned_distance_km)) / avg_speed_kmph) * 60)
    hours, minutes = divmod(total_minutes, 60)
    if hours == 0:
        return f"{minutes} min"
    return f"{hours}h {minutes:02d}m"
