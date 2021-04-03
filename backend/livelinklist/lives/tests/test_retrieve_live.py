import datetime
import random

from faker import Faker
from rest_framework.test import APIClient

from livelinklist.lives.factories import LiveFactory
from livelinklist.lives.models import Live, Platform
from livelinklist.lives.tests.initialize_models import (
    get_string_hashtags,
    initialize_platforms,
)

fake = Faker()


def test_can_retrieve_lives():
    initialize_platforms()
    client = APIClient()

    for i in range(5):
        LiveFactory.create(
            hashtags=(get_string_hashtags()),
            platform=random.choice(Platform.objects.all()),
        )

    response = client.get("/lives")

    assert response.status_code == 200
    assert len(Live.objects.all()) == len(response.json())
