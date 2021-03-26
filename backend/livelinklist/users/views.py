from django.db.models import DateTimeField, F
from django.db.models.expressions import ExpressionWrapper
from django.db.models.query import Prefetch
from django.utils import timezone
from rest_framework import permissions, status, views, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from livelinklist.lives.models import Live
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

    def get_queryset(self):
        today = timezone.now().replace(hour=0, minute=0, second=0)

        annotated_lives = (
            Live.objects.all()
            .annotate(
                expires_at=ExpressionWrapper(
                    F("created_at") + F("duration"),
                    output_field=DateTimeField(),
                )
            )
            .filter(expires_at__gt=today)
            .order_by("expires_at")
        )

        return User.objects.all().prefetch_related(
            Prefetch("lives", queryset=annotated_lives)
        )


class LogInView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]


class RefreshTokenView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]


class LogOutView(views.APIView):
    serializer_class = LogOutSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = LogOutSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(request.data["refresh"])
            token.blacklist()
        except TokenError as e:
            raise ValidationError({"refresh": ["Invalid token."]}) from e

        return Response(status=status.HTTP_200_OK)
