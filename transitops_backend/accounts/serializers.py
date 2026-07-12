"""
accounts/serializers.py

- Embeds `role` in the JWT payload (needed since every API response must
  validate the JWT against the permission matrix).
- Implements the "Invalid credentials / account locked after 5 failed
  attempts" behavior shown in the login mockup's error callout.
"""
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from core.exceptions import BusinessRuleError

User = get_user_model()

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION = timedelta(minutes=15)


class RoleTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["email"] = user.email
        return token

    def validate(self, attrs):
        email = attrs.get("email") or attrs.get(self.username_field)
        user = User.objects.filter(email=email).first()

        if user and user.locked_until and user.locked_until > timezone.now():
            raise BusinessRuleError(
                "Invalid credentials / account locked after 5 failed attempts."
            )

        try:
            data = super().validate(attrs)
        except Exception:
            if user:
                user.failed_login_attempts += 1
                if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
                    user.locked_until = timezone.now() + LOCKOUT_DURATION
                user.save(update_fields=["failed_login_attempts", "locked_until"])
            raise BusinessRuleError(
                "Invalid credentials / account locked after 5 failed attempts."
            )

        # success -> reset counter
        if user:
            user.failed_login_attempts = 0
            user.locked_until = None
            user.save(update_fields=["failed_login_attempts", "locked_until"])

        data["role"] = user.role
        data["email"] = user.email
        return data
