from rest_framework.test import APIClient

from livelinklist.users.factories import UserFactory


def test_user_can_login():
    user = UserFactory()
    password = "my_password"
    user.set_password(password)
    user.save()

    client = APIClient()
    response = client.post("/log-in", {"email": user.email, "password": password})

    assert response.status_code == 200
    assert "access" in response.json()
    assert "refresh" in response.json()


def test_cannot_login_with_incorrect_password():
    user = UserFactory()
    password = "correctPassword"
    user.set_password(password)
    user.save()

    client = APIClient()
    response = client.post(
        "/log-in", {"email": user.email, "password": "incorretPassword"}
    )

    assert response.status_code == 401
    assert (
        response.json()["detail"]
        == "No active account found with the given credentials"
    )


def test_user_can_logout():
    user = UserFactory()
    tokens = user.get_auth_tokens()

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")

    client = APIClient()
    response = client.post("/log-out", {"refresh": tokens["refresh"]})

    assert response.status_code == 200


def test_user_cannot_logout_without_refresh_token():
    user = UserFactory()

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")
    response = client.post("/log-out")

    assert response.status_code == 400
    assert response.json()["refresh"][0] == "This field is required."


def test_user_cannot_logout_with_invalid_refresh_token():
    user = UserFactory()

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {user.get_auth_tokens()['access']}")
    response = client.post("/log-out", {"refresh": "Invalid token"})

    assert response.status_code == 400
    assert response.json()["refresh"][0] == "Invalid token."
