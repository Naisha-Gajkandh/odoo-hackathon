"""
core/permissions.py

ONE source of truth for the RBAC matrix. Every view declares a `module`
attribute and this class enforces access based on the logged-in user's role.

Access levels:
  "full" → read + write (all HTTP methods)
  "read" → GET / HEAD / OPTIONS only
  "none" → blocked entirely

Dashboard KPI fix: every role gets "read" on "dashboard" so the landing
page works for all four roles. The DashboardKPIView and RecentTripsView
use module = "dashboard" for this reason.
"""

from __future__ import annotations

from rest_framework.permissions import BasePermission

SAFE_METHODS = ("GET", "HEAD", "OPTIONS")

PERMISSION_MATRIX: dict[str, dict[str, str]] = {
    "Fleet Manager": {
        "dashboard": "read",
        "fleet": "full",
        "drivers": "full",
        "trips": "read",
        "maintenance": "full",
        "fuel_exp": "read",
        "analytics": "full",
    },
    "Dispatcher": {
        "dashboard": "read",
        "fleet": "read",
        "drivers": "none",
        "trips": "full",
        "maintenance": "none",
        "fuel_exp": "none",
        "analytics": "none",
    },
    "Safety Officer": {
        "dashboard": "read",
        "fleet": "none",
        "drivers": "full",
        "trips": "read",
        "maintenance": "none",
        "fuel_exp": "none",
        "analytics": "none",
    },
    "Financial Analyst": {
        "dashboard": "read",
        "fleet": "read",
        "drivers": "none",
        "trips": "none",
        "maintenance": "read",
        "fuel_exp": "full",
        "analytics": "full",
    },
}


class HasModulePermission(BasePermission):
    """
    Usage in a view:

        class VehicleViewSet(viewsets.ModelViewSet):
            module = "fleet"
            permission_classes = [IsAuthenticated, HasModulePermission]

    The view MUST declare `module` matching a key in PERMISSION_MATRIX values.
    Omitting `module` fails closed — access is denied.
    """

    message = "You do not have permission to access this module."

    def has_permission(self, request, view) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False

        module = getattr(view, "module", None)
        if module is None:
            # Fail closed: a view that forgets to declare its module is blocked.
            return False

        role = getattr(request.user, "role", None)
        role_permissions = PERMISSION_MATRIX.get(role, {})
        access_level = role_permissions.get(module, "none")

        if access_level == "full":
            return True
        if access_level == "read":
            return request.method in SAFE_METHODS
        return False
