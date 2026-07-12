"""
core/exceptions.py

The mockup gives an EXACT JSON shape that validation failures must return:

    {
      "status": "validation_failed",
      "errors": [
        "Vehicle Capacity: 250 kg",
        "Cargo Weight: 700 kg",
        "Capacity exceeded by 450 kg - dispatch blocked."
      ]
    }

Rather than building this by hand in every view, raise BusinessRuleError
anywhere in the codebase (serializers, services, signals) and this single
exception handler formats it consistently. Wire it in settings.py via
REST_FRAMEWORK["EXCEPTION_HANDLER"].
"""

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler


class BusinessRuleError(Exception):
    """Raise this for any business-rule violation (overload, suspended
    driver, expired license, double-booking, etc). Accepts either a
    single message or a list of messages (matches the multi-line error
    array in the spec)."""

    def __init__(self, errors):
        self.errors = errors if isinstance(errors, (list, tuple)) else [errors]
        super().__init__("; ".join(self.errors))


def custom_exception_handler(exc, context):
    # Our own explicit business-rule errors
    if isinstance(exc, BusinessRuleError):
        return Response(
            {"status": "validation_failed", "errors": exc.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Standard DRF serializer validation errors -> normalize to same shape
    if isinstance(exc, ValidationError):
        errors = []
        detail = exc.detail
        if isinstance(detail, dict):
            for field, msgs in detail.items():
                for m in msgs if isinstance(msgs, list) else [msgs]:
                    errors.append(f"{field}: {m}")
        elif isinstance(detail, list):
            errors = [str(m) for m in detail]
        else:
            errors = [str(detail)]
        return Response(
            {"status": "validation_failed", "errors": errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Fall back to DRF's default handling for everything else
    # (404, 401, 403, 500, etc.)
    return exception_handler(exc, context)
