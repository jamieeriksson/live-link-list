from rest_framework.test import APIClient

from livelinklist.users.factories import UserFactory


def test_user_can_retrieve_self():
    user = UserFactory()

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")
    response = client.get(f"/users/{user.id}")

    assert response.status_code == 200


def test_user_cannot_retrieve_other_user():
    user = UserFactory()
    other_user = UserFactory()

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")
    response = client.get(f"/users/{other_user.id}")

    assert response.status_code == 403
    assert (
        response.json()["detail"]
        == "You do not have permission to perform this action."
    )


def test_user_not_found():
    user = UserFactory()

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")

    response = client.get(f"/users/1")

    assert response.status_code == 404
    assert response.json()["detail"] == "Not found."


def test_staff_can_retrieve_user():
    user = UserFactory()
    staff_user = UserFactory()
    staff_user.is_staff = True
    staff_user.save()

    client = APIClient()
    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {staff_user.get_auth_tokens()['access']}"
    )
    response = client.get(f"/users/{user.id}")

    assert response.status_code == 200
    assert response.json()["email"] == user.email
