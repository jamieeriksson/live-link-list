from django.urls import include, path
from rest_framework.routers import DefaultRouter

from livelinklist.lives.views import HashtagViewSet, LiveViewSet
from livelinklist.users.views import (
    LogInView,
    LogOutView,
    RefreshTokenView,
    UserViewSet,
)

router = DefaultRouter(trailing_slash=False)
router.register("lives", LiveViewSet)
router.register("hashtags", HashtagViewSet)
router.register("users", UserViewSet)

urlpatterns = [
    path("log-in", LogInView.as_view()),
    path("refresh-token", RefreshTokenView.as_view()),
    path("log-out", LogOutView.as_view()),
    path("", include(router.urls)),
]
