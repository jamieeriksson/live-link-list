import datetime
import uuid

from django.db import models

from livelinklist.models import BaseModel
from livelinklist.users.models import User


class Platform(BaseModel):
    name = models.TextField(unique=True)
    platform_url = models.URLField()
    live_url = models.URLField()


class Hashtag(BaseModel):
    name = models.TextField(unique=True)


class Live(BaseModel):
    link = models.URLField()
    username = models.TextField(blank=True, null=True)
    description = models.TextField(max_length=75, blank=True, null=True)
    duration = models.DurationField(default=datetime.timedelta(seconds=300))
    # is_expired = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    clicks = models.IntegerField(default=0)

    platform = models.ForeignKey(Platform, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    hashtags = models.ManyToManyField(Hashtag)
