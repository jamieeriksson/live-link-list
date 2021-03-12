import os

import requests
from django.db.models import F, Q
from django.db.models import Value as V
from django.db.models.functions import StrIndex
from django_filters import rest_framework as filters

from livelinklist.lives.models import Live


class LiveFilter(filters.FilterSet):
    platform = filters.CharFilter(field_name="name", method="platform_filter")

    class Meta:
        model = Live
        fields = ["platform"]

    def platform_filter(self, queryset, name, value):
        return queryset.filter(platform__name=value)
