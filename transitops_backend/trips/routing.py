"""
trips/routing.py

Nominatim (OpenStreetMap) geocoding + OSRM routing integration.

Pair usage:
  1. geocode("Depot A")  → (lat, lon)  via Nominatim (free, no key, 1 req/sec)
  2. geocode("Depot B")  → (lat, lon)
  3. route(src, dst)     → RouteResult(distance_km, duration_seconds)

Rate limiting:
  Nominatim ToS requires max 1 request/second. We enforce this with a
  module-level _last_nominatim_call timestamp + time.sleep() when needed.
  Results are cached in Django's cache for 24 hours so repeat lookups for
  the same depot name don't burn requests.

Fallback strategy:
  If geocoding fails (bad place name, API unreachable) or OSRM fails
  (network timeout), we return None and the caller falls back to the
  manually supplied planned_distance_km.

Both APIs are completely free with no API key required.
"""

from __future__ import annotations

import logging
import threading
import time
from dataclasses import dataclass

import httpx
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)

# ── Thread-safe rate limiter for Nominatim (1 req/sec ToS) ───────────────────
_nominatim_lock = threading.Lock()
_last_nominatim_call: float = 0.0
_NOMINATIM_MIN_INTERVAL = 1.1  # seconds — slightly above 1s to be safe

# Cache TTL constants
_GEOCODE_CACHE_TTL = 86400  # 24 hours — depot coordinates rarely change
_ROUTE_CACHE_TTL = 3600  # 1 hour — routes don't change but a shorter TTL is safer

# HTTP timeouts (seconds)
_NOMINATIM_TIMEOUT = 8.0
_OSRM_TIMEOUT = 10.0


@dataclass
class RouteResult:
    """Result of a successful Nominatim + OSRM routing call."""

    distance_km: float
    duration_seconds: int
    source_coords: tuple[float, float]   # (lat, lon)
    destination_coords: tuple[float, float]  # (lat, lon)
    routing_source: str = "osrm"         # "osrm" | "manual"


def _nominatim_headers() -> dict[str, str]:
    """Nominatim requires a descriptive User-Agent — ToS violation otherwise."""
    return {
        "User-Agent": getattr(settings, "NOMINATIM_USER_AGENT", "TransitOps-Hackathon/1.0"),
        "Accept-Language": "en",
    }


def _rate_limit_nominatim() -> None:
    """Block the calling thread until the 1 req/sec ToS limit is satisfied."""
    global _last_nominatim_call  # noqa: PLW0603
    with _nominatim_lock:
        now = time.monotonic()
        elapsed = now - _last_nominatim_call
        if elapsed < _NOMINATIM_MIN_INTERVAL:
            time.sleep(_NOMINATIM_MIN_INTERVAL - elapsed)
        _last_nominatim_call = time.monotonic()


def geocode(place_name: str) -> tuple[float, float] | None:
    """
    Convert a human-readable place name to (latitude, longitude) via Nominatim.

    Returns None on any error — callers must handle the fallback case.

    The result is cached for 24 hours so "Depot A" → coords is only fetched
    once per day regardless of how many trips use it.
    """
    if not place_name or not place_name.strip():
        return None

    cache_key = f"nominatim:geocode:{place_name.strip().lower()}"
    cached = cache.get(cache_key)
    if cached is not None:
        logger.debug("Geocode cache hit for '%s'", place_name)
        return tuple(cached)  # type: ignore[return-value]

    _rate_limit_nominatim()

    base_url = getattr(settings, "NOMINATIM_BASE_URL", "https://nominatim.openstreetmap.org")
    url = f"{base_url}/search"
    params = {
        "q": place_name.strip(),
        "format": "json",
        "limit": 1,
        "addressdetails": 0,
    }

    try:
        with httpx.Client(timeout=_NOMINATIM_TIMEOUT) as client:
            resp = client.get(url, params=params, headers=_nominatim_headers())
            resp.raise_for_status()
            results = resp.json()
    except (httpx.HTTPError, httpx.TimeoutException) as exc:
        logger.warning("Nominatim geocoding failed for '%s': %s", place_name, exc)
        return None

    if not results:
        logger.info("Nominatim: no results for '%s'", place_name)
        return None

    lat = float(results[0]["lat"])
    lon = float(results[0]["lon"])
    coords = (lat, lon)

    cache.set(cache_key, list(coords), _GEOCODE_CACHE_TTL)
    logger.debug("Geocoded '%s' → %s", place_name, coords)
    return coords


def route_between(
    src_coords: tuple[float, float],
    dst_coords: tuple[float, float],
) -> RouteResult | None:
    """
    Get real driving distance (km) and duration (seconds) between two
    lat/lon pairs using the OSRM public demo server.

    OSRM coordinate format: lon,lat (note: opposite of the usual lat/lon order)

    Returns None on any error.
    """
    src_lat, src_lon = src_coords
    dst_lat, dst_lon = dst_coords

    cache_key = f"osrm:route:{src_lat:.4f},{src_lon:.4f};{dst_lat:.4f},{dst_lon:.4f}"
    cached = cache.get(cache_key)
    if cached is not None:
        logger.debug("OSRM route cache hit")
        return RouteResult(**cached)

    base_url = getattr(settings, "OSRM_BASE_URL", "https://router.project-osrm.org")
    # OSRM expects lon,lat pairs separated by semicolons
    coordinates = f"{src_lon},{src_lat};{dst_lon},{dst_lat}"
    url = f"{base_url}/route/v1/driving/{coordinates}"
    params = {
        "overview": "false",   # we only need summary, not full geometry
        "alternatives": "false",
    }

    try:
        with httpx.Client(timeout=_OSRM_TIMEOUT) as client:
            resp = client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
    except (httpx.HTTPError, httpx.TimeoutException) as exc:
        logger.warning("OSRM routing failed: %s", exc)
        return None

    if data.get("code") != "Ok" or not data.get("routes"):
        logger.warning("OSRM returned non-Ok response: %s", data.get("code"))
        return None

    route = data["routes"][0]
    distance_m = route["distance"]   # metres
    duration_s = route["duration"]   # seconds

    result = RouteResult(
        distance_km=round(distance_m / 1000, 2),
        duration_seconds=int(duration_s),
        source_coords=src_coords,
        destination_coords=dst_coords,
        routing_source="osrm",
    )

    cache.set(cache_key, {
        "distance_km": result.distance_km,
        "duration_seconds": result.duration_seconds,
        "source_coords": list(result.source_coords),
        "destination_coords": list(result.destination_coords),
        "routing_source": result.routing_source,
    }, _ROUTE_CACHE_TTL)

    return result


def geocode_and_route(source: str, destination: str) -> RouteResult | None:
    """
    High-level convenience function: geocode both endpoints then route.

    Used in TripCreateSerializer.validate() to auto-fill planned_distance_km
    and estimated_duration_seconds when creating a trip.

    Returns None if either geocoding step fails — the serializer will then
    keep the manually-entered planned_distance_km value.
    """
    src_coords = geocode(source)
    if src_coords is None:
        logger.info("Could not geocode source '%s'; skipping OSRM routing", source)
        return None

    dst_coords = geocode(destination)
    if dst_coords is None:
        logger.info("Could not geocode destination '%s'; skipping OSRM routing", destination)
        return None

    return route_between(src_coords, dst_coords)
