"""
accounts/google_auth.py

Flow:
  1. Frontend uses Google Identity Services (GSI) to get an `id_token`
     after the user clicks "Sign in with Google".
  2. Frontend POSTs that id_token to /api/auth/google/.
  3. We verify it against Google's public keys (google.oauth2.id_token) --
     NEVER trust a token without verifying it server-side.
  4. We look up/create a local User by email and issue OUR OWN JWT
     (with `role` embedded) via SimpleJWT, so every existing permission
     check in core/permissions.py keeps working unmodified.

Role handling for hackathon speed:
  - If the email already exists (e.g. seeded via /admin/ by the team
    lead with the correct role), we log them in with that role.
  - If it's a brand-new email, we require the frontend to also send the
    `role` the user selected on the login screen's Role Selector dropdown,
    and we create the account with that role. In a REAL product you'd
    gate this behind admin approval -- flagged below.
"""
from django.conf import settings
from django.contrib.auth import get_user_model
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from rest_framework_simplejwt.tokens import RefreshToken

from core.exceptions import BusinessRuleError

User = get_user_model()


def verify_google_token(token: str) -> dict:
    try:
        payload = google_id_token.verify_oauth2_token(
            token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise BusinessRuleError("Invalid or expired Google token.")

    if payload.get("aud") != settings.GOOGLE_CLIENT_ID:
        raise BusinessRuleError("Token audience mismatch.")
    if not payload.get("email_verified", False):
        raise BusinessRuleError("Google account email is not verified.")

    return payload  # contains email, name, sub (Google user id), picture, etc.


def issue_tokens_for_user(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role
    refresh["email"] = user.email
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": user.role,
        "email": user.email,
    }


def login_or_create_with_google(id_token_str: str, requested_role: str | None) -> dict:
    payload = verify_google_token(id_token_str)
    email = payload["email"]

    user = User.objects.filter(email=email).first()

    if user is None:
        # New account. In production: create as inactive and require an
        # admin to approve + assign role. For the hackathon demo we trust
        # the role selected on the login screen.
        if not requested_role or requested_role not in User.Role.values:
            raise BusinessRuleError(
                "New account: a valid role must be selected before first Google login."
            )
        user = User.objects.create(
            email=email,
            username=email.split("@")[0],
            first_name=payload.get("given_name", ""),
            last_name=payload.get("family_name", ""),
            role=requested_role,
        )
        user.set_unusable_password()  # this account can ONLY log in via Google
        user.save()

    return issue_tokens_for_user(user)
