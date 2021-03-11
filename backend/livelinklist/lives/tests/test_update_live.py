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
from livelinklist.users.factories import UserFactory

fake = Faker()


def test_admin_can_update_live():
    initialize_platforms()
    client = APIClient()
    user = UserFactory(is_staff=True)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")

    live = LiveFactory.create(
        hashtags=(get_string_hashtags()), platform=random.choice(Platform.objects.all())
    )

    response = client.patch(f"/lives/{live.id}", {"duration": "00:60:00"})

    live = Live.objects.first()

    assert response.status_code == 200
    assert live.duration == datetime.timedelta(seconds=3600)


def test_owner_can_update_live():
    initialize_platforms()
    client = APIClient()
    user = UserFactory()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")

    live = LiveFactory.create(
        hashtags=(get_string_hashtags()),
        owner=user,
        platform=random.choice(Platform.objects.all()),
    )

    response = client.patch(f"/lives/{live.id}", {"duration": "00:60:00"})

    live = Live.objects.first()

    assert response.status_code == 200
    assert live.duration == datetime.timedelta(seconds=3600)


def test_user_cannot_update_other_user_live():
    initialize_platforms()
    client = APIClient()
    user = UserFactory()
    user2 = UserFactory()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")

    live = LiveFactory.create(
        hashtags=(get_string_hashtags()),
        owner=user2,
        platform=random.choice(Platform.objects.all()),
    )

    response = client.patch(f"/lives/{live.id}", {"duration": "00:60:00"})

    live = Live.objects.first()

    assert response.status_code == 403
    assert (
        response.json()["detail"]
        == "You do not have permission to perform this action."
    )


def test_cannot_update_live_without_user():
    initialize_platforms()
    client = APIClient()

    live = LiveFactory.create(
        hashtags=(get_string_hashtags()), platform=random.choice(Platform.objects.all())
    )

    response = client.patch(f"/lives/{live.id}", {"duration": "00:60:00"})

    live = Live.objects.first()

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication credentials were not provided."
