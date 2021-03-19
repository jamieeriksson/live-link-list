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

    def get_queryset(self):
        return User.objects.all().prefetch_related("lives")


class AuthenticationFailed:
    pass


# class InvalidToken(AuthenticationFailed):
#     status_code = status.HTTP_401_UNAUTHORIZED
#     default_detail = _("Token is invalid or expired")
#     default_code = "token_not_valid"


class LogInView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]

    # def post(self, request, *args, **kwargs):
    #     response = super().post(request, *args, **kwargs)
    #     serializer = self.get_serializer(data=request.data)

    #     # try:
    #     serializer.is_valid(raise_exception=True)
    #     # except TokenError as e:
    #     #     raise InvalidToken(e.args[0])

    #     return Response(serializer.validated_data, status=status.HTTP_200_OK)

    #     print(response)
    #     response.data["user"] = {
    #         "user": {
    #             "email": response.user.email,
    #             "name": f"{response.user.first_name} {response.user.last_name}",
    #         }
    #     }

    #     return response


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
