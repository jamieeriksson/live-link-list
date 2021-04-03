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
    help = "Seeds database with users"

    def handle(self, *args, **kwargs):
        print("Seeding database...")

        # call_command("flush", "--no-input")

        # def clear_data():
        """Deletes all the table data"""
        print("Delete current instances")
        User.objects.all().delete()
        Live.objects.all().delete()
        Platform.objects.all().delete()
        Hashtag.objects.all().delete()

        initialize_platforms()

        for i in range(15):
            user = UserFactory()
            if random.choice([True, False]):
                LiveFactory.create(
                    hashtags=(get_string_hashtags()), owner=user, username=None
                )
        for i in range(15):
            username = fake.user_name()
            user = UserFactory(tiktok_username=username)
            if random.choice([True, False]):
                LiveFactory.create(
                    hashtags=(get_string_hashtags()), owner=user, username=username
                )
        for i in range(15):
            username = fake.user_name()
            user = UserFactory(tiktok_username=username, youtube_username=username)
            if random.choice([True, False]):
                LiveFactory.create(
                    hashtags=(get_string_hashtags()), owner=user, username=username
                )
        for i in range(15):
            username = fake.user_name()
            user = UserFactory(
                facebook_username=username,
                instagram_username=username,
                twitch_username=username,
            )
            if random.choice([True, False]):
                LiveFactory.create(
                    hashtags=(get_string_hashtags()), owner=user, username=None
                )
        for i in range(15):
            username = fake.user_name()
            user = UserFactory(
                tiktok_username=username,
                facebook_username=username,
                instagram_username=username,
                twitch_username=username,
            )
            if random.choice([True, False]):
                LiveFactory.create(
                    hashtags=(get_string_hashtags()), owner=user, username=None
                )
        for i in range(15):
            username = fake.user_name()
            user = UserFactory(
                tiktok_username=username,
                youtube_username=username,
                facebook_username=username,
                instagram_username=username,
                twitch_username=username,
            )
            if random.choice([True, False]):
                LiveFactory.create(
                    hashtags=(get_string_hashtags()), owner=user, username=username
                )
        for i in range(50):
            LiveFactory.create(hashtags=(get_string_hashtags()))

        print("Database seeded successfully")
