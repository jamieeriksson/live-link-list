from django.db.models import DateTimeField, F
from django.db.models.expressions import ExpressionWrapper
from rest_framework import mixins, permissions, viewsets

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

    def get_queryset(self):
        return Live.objects.annotate(
            end_date=ExpressionWrapper(
                F("created_at") + F("duration"), output_field=DateTimeField()
            ),
        ).order_by("end_date")


class HashtagViewSet(viewsets.ModelViewSet):
    queryset = Hashtag.objects.all()
    serializer_class = HashtagSerializer
    permission_classes = [permissions.IsAdminUser]


class PlatformViewSet(viewsets.ModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    permission_classes = [permissions.IsAdminUser]
