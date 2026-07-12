from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .google_auth import login_or_create_with_google
from .serializers import RoleTokenObtainPairSerializer


class LoginView(TokenObtainPairView):
    serializer_class = RoleTokenObtainPairSerializer
    throttle_scope = "login"


class GoogleLoginView(APIView):
    """
    POST /api/auth/google/
    Body: {"id_token": "<token from Google Identity Services>", "role": "Dispatcher"}
    `role` is only required the FIRST time a given Google account logs in.
    """

    permission_classes = [AllowAny]
    throttle_scope = "login"

    def post(self, request):
        id_token_str = request.data.get("id_token")
        requested_role = request.data.get("role")
        if not id_token_str:
            return Response(
                {"status": "validation_failed", "errors": ["id_token is required."]},
                status=400,
            )

        data = login_or_create_with_google(id_token_str, requested_role)
        return Response(data, status=200)
