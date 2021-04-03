from django.contrib.auth import password_validation
from django.db.models.fields import EmailField
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from sendgrid.helpers.mail.email import Email

from livelinklist.lives.serializers import LiveSerializer
from livelinklist.users.models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    lives = LiveSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "created_at",
            "modified_at",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "password",
            "is_staff",
            "credits",
            "tiktok_username",
            "instagram_username",
            "youtube_username",
            "facebook_username",
            "twitch_username",
            "lives",
            "email_confirmed",
        ]
        read_only_fields = ["is_staff", "credits"]

    def validate_email(self, email):
        """
        Normalize the address by lowercasing the domain part of the email
        address.
        """
        email = email or ""
        email_name, domain_part = email.strip().rsplit("@", 1)
        email = "@".join([email_name, domain_part.lower()])
        return email


class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        if not self.user.email_confirmed:
            data["user"] = {
                "id": self.user.id,
                "email": self.user.email,
                "name": f"{self.user.first_name} {self.user.last_name}",
                "email_confirmed": self.user.email_confirmed,
            }
        else:
            data["user"] = {
                "id": self.user.id,
                "email": self.user.email,
                "name": f"{self.user.first_name} {self.user.last_name}",
            }

        return data


class LogOutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ConfirmedResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField()
    password = serializers.CharField()

    def validate_password(self, value):
        password_validation.validate_password(value)


class ConfirmEmailPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField()

    def validate_password(self, value):
        password_validation.validate_password(value)


class ConfirmEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
