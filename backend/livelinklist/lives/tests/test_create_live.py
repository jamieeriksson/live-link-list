import datetime

from rest_framework.test import APIClient

from livelinklist.lives.models import Live
from livelinklist.lives.tests.initialize_models import (
    get_live_data,
    initialize_platforms,
)
from livelinklist.users.factories import UserFactory


def test_can_create_live_no_user():
    initialize_platforms()
    client = APIClient()

    live_data = get_live_data()

    response = client.post("/lives", live_data)

    live = Live.objects.first()

    assert response.status_code == 201
    assert len(Live.objects.all()) == 1
    assert live.owner == None
    assert live.duration == datetime.timedelta(seconds=1800)
    assert live.is_featured == True


def test_user_can_create_live():
    initialize_platforms()
    user = UserFactory()
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")

    live_data = get_live_data()

    response = client.post("/lives", live_data)

    live = Live.objects.first()

    assert response.status_code == 201
    assert len(Live.objects.all()) == 1
    assert live.owner == user
    assert live.duration == datetime.timedelta(seconds=1800)
    assert live.is_featured == True


def test_cannot_create_live_without_link():
    initialize_platforms()
    client = APIClient()

    live_data = get_live_data()
    live_data["link"] = None

    response = client.post("/lives", live_data)

    assert response.status_code == 400
    assert response.json()["link"][0] == "This field may not be null."


def test_cannote_create_live_without_platform():
    initialize_platforms()
    client = APIClient()

    live_data = get_live_data()
    live_data["platform"] = None

    response = client.post("/lives", live_data)

    assert response.status_code == 400
    assert response.json()["platform"][0] == "This field may not be null."


def test_cannote_create_live_without_invalid_live_link():
    initialize_platforms()
    client = APIClient()

    live_data = get_live_data()
    live_data["link"] = "https://www.google.com/"

    response = client.post("/lives", live_data)

    assert response.status_code == 400
    assert (
        response.json()["link"][0]
        == f"Link must be a proper live url for {live_data['platform']}"
    )
