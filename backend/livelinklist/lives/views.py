from datetime import datetime

from django.db.models import DateTimeField, F
from django.db.models.expressions import ExpressionWrapper
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets

from livelinklist.lives.filters import LiveFilter
from livelinklist.lives.models import Hashtag, Live, Platform
from livelinklist.lives.permissions import LivePermissions
from livelinklist.lives.serializers import (
    HashtagSerializer,
    LiveSerializer,
    PlatformSerializer,
)


class LiveViewSet(viewsets.ModelViewSet):
    queryset = Live.objects.all()
    serializer_class = LiveSerializer
    permission_classes = [LivePermissions]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ["hashtags__name", "username"]
    filterset_class = LiveFilter

    def get_queryset(self):
        today = timezone.now()

        return (
            Live.objects.annotate(
                expires_at=ExpressionWrapper(
                    F("created_at") + F("duration"), output_field=DateTimeField()
                )
            )
            .filter(expires_at__gt=today)
            .order_by("expires_at")
        )


class HashtagViewSet(viewsets.ModelViewSet):
    queryset = Hashtag.objects.all()
    serializer_class = HashtagSerializer
    permission_classes = [permissions.IsAdminUser]


class PlatformViewSet(viewsets.ModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    permission_classes = [permissions.IsAdminUser]
