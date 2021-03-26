from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from livelinklist.lives.serializers import LiveSerializer
from livelinklist.users.models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
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
        data["user"] = {
            "id": self.user.id,
            "email": self.user.email,
            "name": f"{self.user.first_name} {self.user.last_name}",
        }

        return data


class LogOutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
