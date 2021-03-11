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


class HashtagViewSet(viewsets.ModelViewSet):
    queryset = Hashtag.objects.all()
    serializer_class = HashtagSerializer
    permission_classes = [permissions.IsAdminUser]


class PlatformViewSet(viewsets.ModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    permission_classes = [permissions.IsAdminUser]
