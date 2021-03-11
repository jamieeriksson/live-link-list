from rest_framework.test import APIClient

from livelinklist.users.factories import UserFactory
from livelinklist.users.serializers import UserSerializer


def test_can_update_self():
    user = UserFactory()

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")
    response = client.patch(f"/users/{user.id}", {"first_name": "New"})

    assert response.status_code == 200
    assert response.json()["first_name"] == "New"


def test_cannot_update_other_user():
    user = UserFactory()
    other_user = UserFactory()

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")
    response = client.patch(f"/users/{other_user.id}", {"first_name": "New"})

    assert response.status_code == 403
    assert (
        response.json()["detail"]
        == "You do not have permission to perform this action."
    )


def test_cannot_update_without_credentials():
    user = UserFactory.build()
    user_data = UserSerializer(user).data

    client = APIClient()
    client.post("/users", user_data)
    response = client.patch(f"/users/{user.id}", {"first_name": "New"})

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication credentials were not provided."


def test_can_normalize_email_on_update():
    user = UserFactory()

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")
    response = client.patch(f"/users/{user.id}", {"email": "example@UPPERcASE.com"})

    assert response.status_code == 200
    assert response.json()["email"] == "example@uppercase.com"


def test_staff_can_update_user():
    user = UserFactory()
    staff_user = UserFactory()
    staff_user.is_staff = True
    staff_user.save()

    client = APIClient()
    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {staff_user.get_auth_tokens()['access']}"
    )
    response = client.patch(f"/users/{user.id}", {"first_name": "New"})

    assert response.status_code == 200
    assert response.json()["first_name"] == "New"
