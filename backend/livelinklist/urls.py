from django.urls import include, path
from rest_framework.routers import DefaultRouter

from livelinklist.lives.views import HashtagViewSet, LiveViewSet, PlatformViewSet
from livelinklist.users.views import (
    ConfirmedResetPasswordView,
    LogInView,
    LogOutView,
    RefreshTokenView,
    ResetPasswordView,
    UserViewSet,
)

router = DefaultRouter(trailing_slash=False)
router.register("lives", LiveViewSet)
router.register("platforms", PlatformViewSet)
router.register("hashtags", HashtagViewSet)
router.register("users", UserViewSet)

urlpatterns = [
    path("log-in", LogInView.as_view()),
    path("refresh-token", RefreshTokenView.as_view()),
    path("log-out", LogOutView.as_view()),
    path("password-reset", ResetPasswordView.as_view()),
    path("password-reset-confirmed", ConfirmedResetPasswordView.as_view()),
    path("", include(router.urls)),
]

urlpatterns += [path("django-rq/", include("django_rq.urls"))]
