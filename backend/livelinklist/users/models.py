from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from rest_framework_simplejwt.tokens import RefreshToken

from livelinklist.models import BaseModel


class UserManager(models.Manager):
    def get_by_natural_key(self, username):
        return self.get(**{self.model.USERNAME_FIELD: username})

    def create(self, password=None, **kwargs):
        user = self.model(**kwargs)

        user.set_password(password)
        user.save()

        return user


class User(AbstractBaseUser, BaseModel):
    first_name = models.TextField()
    last_name = models.TextField()
    email = models.EmailField(unique=True)
    phone_number = models.TextField(blank=True, null=True)
    password = models.TextField()
    is_staff = models.BooleanField(default=False)
    credits = models.IntegerField(default=0)
    tiktok_username = models.TextField(blank=True, null=True)
    instagram_username = models.TextField(blank=True, null=True)
    youtube_username = models.TextField(blank=True, null=True)
    facebook_username = models.TextField(blank=True, null=True)
    twitch_username = models.TextField(blank=True, null=True)
    email_confirmed = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"

    def get_auth_tokens(self):
        token = RefreshToken.for_user(self)

        return {"refresh": str(token), "access": str(token.access_token)}
