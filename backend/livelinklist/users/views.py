from rest_framework import mixins, permissions, status, views, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from livelinklist.users.models import User
from livelinklist.users.permissions import UserPermission
from livelinklist.users.serializers import (
    LogOutSerializer,
    UserSerializer,
    UserTokenObtainPairSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [UserPermission]


class LogInView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        return response


class RefreshTokenView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]


class LogOutView(views.APIView):
    serializer_class = LogOutSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LogOutSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(request.data["refresh"])
            token.blacklist()
        except TokenError as e:
            raise ValidationError({"refresh": ["Invalid token."]}) from e

        return Response(status=status.HTTP_200_OK)
