import json
import random
from pathlib import Path

from django.core.management import call_command
from django.core.management.base import BaseCommand
from faker import Faker

from livelinklist.lives.factories import LiveFactory
from livelinklist.lives.models import Hashtag, Live, Platform
from livelinklist.lives.tests.initialize_models import (
    get_random_usernames,
    get_string_hashtags,
    initialize_platforms,
)
from livelinklist.users.factories import UserFactory
from livelinklist.users.models import User

fake = Faker()


class Command(BaseCommand):
    help = "Initializes database with platforms"

    def handle(self, *args, **kwargs):
        print("Initializing database...")

        Live.objects.all().delete()
        Platform.objects.all().delete()
        Hashtag.objects.all().delete()

        initialize_platforms()

        print("Database initialized successfully")
