from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from livelinklist.users.models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "password",
            "is_staff",
            "credits",
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
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        return token


class LogOutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
