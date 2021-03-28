import datetime
import random

import factory
import factory.django
from faker import Faker

from livelinklist.lives.models import Hashtag, Live, Platform
from livelinklist.users.factories import UserFactory

fake = Faker()

# platforms = [
#     {
#         "name": "TikTok",
#         "live_url": "https://vm.tiktok.com/",
#         "platform_url": "https://www.tiktok.com/",
#     },
#     {
#         "name": "Instagram",
#         "live_url": "https://www.instagram.com/",
#         "platform_url": "https://www.instagram.com/",
#     },
#     {
#         "name": "Youtube",
#         "live_url": "https://www.youtube.com/watch?v=",
#         "platform_url": "https://www.youtube.com/",
#     },
#     {
#         "name": "Facebook",
#         "live_url": "https://fb.watch/",
#         "platform_url": "https://www.facebook.com/",
#     },
#     {
#         "name": "Twitch",
#         "live_url": "https://www.twitch.tv/",
#         "platform_url": "https://www.twitch.tv/",
#     },
# ]


def get_duration():
    options = [
        datetime.timedelta(minutes=5),
        datetime.timedelta(minutes=10),
        datetime.timedelta(minutes=15),
        datetime.timedelta(minutes=30),
        datetime.timedelta(minutes=60),
    ]
    return random.choice(options)


def get_live_url(live_platform):
    url = live_platform.live_url

    if live_platform.name == "TikTok":
        url += f"{fake.password(length=9, special_chars=False)}"
    elif live_platform.name == "Instagram":
        url += f"{fake.user_name()}/live"
    elif live_platform.name == "Youtube":
        url += f"{fake.password(length=11, special_chars=False)}"
    elif live_platform.name == "Facebook":
        url += f"{fake.password(length=10, special_chars=False)}"
    elif live_platform.name == "Twitch":
        url += f"{fake.user_name()}"

    return url


class PlatformFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Platform


class HashtagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Hashtag

    name = factory.Faker("word")


class LiveFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Live

    platform = factory.Iterator(Platform.objects.all())
    link = factory.LazyAttribute(lambda o: get_live_url(o.platform))
    username = factory.Faker("user_name")
    description = factory.Faker("text", max_nb_chars=75)
    duration = factory.LazyFunction(get_duration)
    is_featured = factory.Faker("boolean", chance_of_getting_true=15)
    clicks = factory.Faker("random_number", digits=3, fix_len=False)

    @factory.post_generation
    def hashtags(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for hashtag in extracted:
                if not Hashtag.objects.filter(name=hashtag).exists():
                    hashtag_instance = HashtagFactory(name=hashtag)
                else:
                    hashtag_instance = Hashtag.objects.get(name=hashtag)
                self.hashtags.add(hashtag_instance)
