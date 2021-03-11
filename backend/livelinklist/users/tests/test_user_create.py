from faker import Faker
from rest_framework.test import APIClient

from livelinklist.users.factories import UserFactory
from livelinklist.users.models import User
from livelinklist.users.serializers import UserSerializer

fake = Faker()


def test_can_create_user_no_usernames():
    user_data = UserSerializer(UserFactory.build()).data

    client = APIClient()
    response = client.post("/users", user_data)

    assert response.status_code == 201
    assert len(User.objects.all()) == 1


def test_can_create_user_with_usernames():
    user_data = UserSerializer(UserFactory.build()).data
    username = fake.user_name()
    user_data["tiktok_username"] = username
    user_data["instagram_username"] = username
    user_data["youtube_username"] = username
    user_data["facebook_username"] = username
    user_data["twitch_username"] = username

    client = APIClient()
    response = client.post("/users", user_data)

    assert response.status_code == 201
    assert len(User.objects.all()) == 1


def test_can_normalize_email_on_create():
    user_data = UserSerializer(UserFactory.build()).data
    user_data["email"] = "example@UPPERcASE.com"

    client = APIClient()
    response = client.post("/users", user_data)

    assert response.status_code == 201
    assert response.json()["email"] == "example@uppercase.com"
    assert len(User.objects.all()) == 1


def test_cannot_create_user_invalid_email():
    user_data = UserSerializer(UserFactory.build()).data
    user_data["email"] = "invalidemail/example.com"

    client = APIClient()
    response = client.post("/users", user_data)

    assert response.status_code == 400
    assert response.json()["email"][0] == "Enter a valid email address."


def test_staff_can_create_user():
    user_data = UserSerializer(UserFactory.build()).data
    staff_user = UserFactory()
    staff_user.is_staff = True
    staff_user.save()

    client = APIClient()
    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {staff_user.get_auth_tokens()['access']}"
    )
    response = client.post("/users", user_data)

    assert response.status_code == 201
    assert response.json()["email"] == user_data["email"]
    assert len(User.objects.all()) == 2
