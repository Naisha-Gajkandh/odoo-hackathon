from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        FLEET_MANAGER = "Fleet Manager", "Fleet Manager"
        DISPATCHER = "Dispatcher", "Dispatcher"
        SAFETY_OFFICER = "Safety Officer", "Safety Officer"
        FINANCIAL_ANALYST = "Financial Analyst", "Financial Analyst"

    role = models.CharField(max_length=32, choices=Role.choices)

    # login page shows email, not username, so make email the identifier
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    failed_login_attempts = models.PositiveSmallIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
