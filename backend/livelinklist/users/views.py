import os

import django_rq
import sendgrid
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.db.models import DateTimeField, F
from django.db.models.expressions import ExpressionWrapper
from django.db.models.query import Prefetch
from django.utils import timezone
from rest_framework import permissions, serializers, status, views, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from sendgrid.helpers.mail import *

from livelinklist.lives.models import Live
from livelinklist.users.models import User
from livelinklist.users.permissions import UserPermission
from livelinklist.users.serializers import (
    ConfirmedResetPasswordSerializer,
    ConfirmEmailPasswordSerializer,
    ConfirmEmailSerializer,
    LogOutSerializer,
    ResetPasswordSerializer,
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
        serializer = LogOutSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(request.data["refresh"])
            token.blacklist()
        except TokenError as e:
            raise ValidationError({"refresh": ["Invalid token."]}) from e

        return Response(status=status.HTTP_200_OK)


def send_email(to, template_id, dynamic_template_data=None):
    sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)

    mail = Mail(from_email="noreply@livelinklist.com", to_emails=to)
    mail.template_id = template_id

    if dynamic_template_data:
        mail.dynamic_template_data = dynamic_template_data

    if os.getenv("SENDGRID_SANDBOX") == "TRUE":
        print(dynamic_template_data)

        mail_settings = MailSettings()
        mail_settings.sandbox_mode = SandBoxMode(True)
        mail.mail_settings = mail_settings

        # # We patch the HTTP client here so that we don't try to make an actual request.
        # # In tests, use: patch("sendgrid.base_interface.BaseInterface.send")
        # with patch("python_http_client.Client._make_request"):
        #     sg.send(mail)
    else:  # pragma: no cover
        sg.send(mail)

    response = sg.client.mail.send.post(request_body=mail.get())

    print(response.status_code)
    print(response.body)
    print(response.headers)

    return


class ResetPasswordView(views.APIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=request.data["email"])

        except User.DoesNotExist:
            return Response(
                {"detail": ["No user found with this email."]},
                status=status.HTTP_404_NOT_FOUND,
            )

        django_rq.enqueue(
            send_email,
            to=[user.email],
            template_id="d-328f47f206fe46dc9d698c1a365b827d",
            dynamic_template_data={
                "base_url": request.META.get("HTTP_ORIGIN", "https://livelinklist.com"),
                "email": user.email,
                "token": PasswordResetTokenGenerator().make_token(user),
            },
        )

        return Response(status=status.HTTP_200_OK)


class ConfirmedResetPasswordView(views.APIView):
    serializer_class = ConfirmedResetPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = ConfirmedResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=request.data["email"])
        except User.DoesNotExist:
            return Response(
                {"detail": ["No user found with this email."]},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not PasswordResetTokenGenerator().check_token(user, request.data["token"]):
            raise ValidationError(
                {
                    "token": [
                        "Invalid token. This usually means the password reset link"
                        + " has expired, or it has already been used to change this"
                        + " account's password."
                    ]
                }
            )

        user.set_password(request.data["password"])
        user.save()

        return Response(user.get_auth_tokens(), status=status.HTTP_200_OK)


class SendConfirmEmailView(views.APIView):
    serializer_class = ConfirmEmailSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ConfirmEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=request.data["email"])

        except User.DoesNotExist:
            return Response(
                {"detail": ["No user found with this email."]},
                status=status.HTTP_404_NOT_FOUND,
            )

        django_rq.enqueue(
            send_email,
            to=[user.email],
            template_id="d-77f831b59c4b425db5527f8fb5ed9f7a",
            dynamic_template_data={
                "base_url": request.META.get("HTTP_ORIGIN", "https://livelinklist.com"),
                "email": user.email,
                "token": PasswordResetTokenGenerator().make_token(user),
            },
        )

        return Response(status=status.HTTP_200_OK)


class ConfirmEmailView(views.APIView):
    serializer_class = ConfirmedResetPasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ConfirmEmailPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=request.data["email"])
        except User.DoesNotExist:
            return Response(
                {"detail": ["No user found with this email."]},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not PasswordResetTokenGenerator().check_token(user, request.data["token"]):
            raise ValidationError(
                {
                    "token": [
                        "Invalid token. This usually means the link"
                        + " has expired, or it has already been used to confirm this"
                        + " account."
                    ]
                }
            )

        user.email_confirmed = True
        user.save()

        return Response(status=status.HTTP_200_OK)
