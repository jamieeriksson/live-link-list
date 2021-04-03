from rest_framework.test import APIClient

from livelinklist.users.factories import UserFactory
from livelinklist.users.models import User
from livelinklist.users.serializers import UserSerializer


def test_user_can_delete_self():
    user = UserFactory()

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")
    response = client.delete(f"/users/{user.id}")

    assert response.status_code == 204
    assert len(User.objects.all()) == 0


def test_cannot_delete_other_user():
    user = UserFactory()
    other_user = UserFactory()

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")
    response = client.delete(f"/users/{other_user.id}")

    assert response.status_code == 403
    assert (
        response.json()["detail"]
        == "You do not have permission to perform this action."
    )


def test_cannot_delete_without_credentials():
    user = UserFactory.build()
    user_data = UserSerializer(user).data

    client = APIClient()
    client.post("/users", user_data)
    response = client.delete(f"/users/{user.id}")

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication credentials were not provided."


def test_staff_can_delete_user():
    user = UserFactory()
    staff_user = UserFactory()
    staff_user.is_staff = True
    staff_user.save()

    client = APIClient()
    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {staff_user.get_auth_tokens()['access']}"
    )
    response = client.delete(f"/users/{user.id}")

    assert response.status_code == 204
    assert len(User.objects.filter(pk=user.id)) == 0
    assert len(User.objects.all()) == 1
