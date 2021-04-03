import datetime
import random

from faker import Faker

from livelinklist.lives.factories import HashtagFactory, LiveFactory, PlatformFactory
from livelinklist.lives.models import Hashtag, Platform
from livelinklist.lives.serializers import HashtagSerializer, LiveSerializer

fake = Faker()


def initialize_platforms():
    platforms = [
        {
            "name": "TikTok",
            "live_url": "https://vm.tiktok.com/",
            "platform_url": "https://www.tiktok.com/",
        },
        {
            "name": "Instagram",
            "live_url": "https://www.instagram.com/",
            "platform_url": "https://www.instagram.com/",
        },
        {
            "name": "Youtube",
            "live_url": "https://www.youtube.com/watch?v=",
            "platform_url": "https://www.youtube.com/",
        },
        {
            "name": "Facebook",
            "live_url": "https://fb.watch/",
            "platform_url": "https://www.facebook.com/",
        },
        {
            "name": "Twitch",
            "live_url": "https://www.twitch.tv/",
            "platform_url": "https://www.twitch.tv/",
        },
    ]

    for platform in platforms:
        PlatformFactory(
            name=platform["name"],
            platform_url=platform["platform_url"],
            live_url=platform["live_url"],
        )


def get_random_usernames():
    username_keys = [
        "tiktok_username",
        "instagram_username",
        "youtube_username",
        "facebook_username",
        "twitch_username",
    ]
    # platform_usernames = []
    # username = fake.user_name()

    for i in range(random.randint(0, 5)):
        key = username_keys[random.randint(0, len(username_keys) - 1)]
        # username_dict = {key: username}
        # platform_usernames.append(username_dict)
        username_keys.remove(key)

    return username_keys


def get_live_url(platform):
    url = platform.live_url
    username = fake.user_name()
    if platform.name == "TikTok":
        url += f"@{username}"
    elif platform.name == "Instagram":
        url += f"{username}/live"
    elif platform.name == "Youtube":
        url += f"{fake.password(length=11, special_chars=False)}"
    elif platform.name == "Facebook":
        url += f"{fake.password(length=10, special_chars=False)}"
    elif platform.name == "Twitch":
        url += f"{username}"

    return url


def get_duration():
    # options = [
    #     datetime.timedelta(minutes=5),
    #     datetime.timedelta(minutes=10),
    #     datetime.timedelta(minutes=15),
    #     datetime.timedelta(minutes=30),
    #     datetime.timedelta(minutes=60),
    # ]
    options = [
        "5",
        "10",
        "15",
        "30",
        "60",
    ]
    return random.choice(options)


def get_hashtags():
    live_hashtags = []

    for i in range(random.randint(1, 20)):
        hashtag = fake.word()
        if hashtag not in live_hashtags:
            live_hashtags.append(hashtag)
            if random.choice([True, False]):
                HashtagFactory(name=hashtag)

    return live_hashtags


def get_string_hashtags():
    live_hashtags = []

    for i in range(random.randint(0, 20)):
        hashtag = fake.word()
        live_hashtags.append(hashtag)

    return live_hashtags


def get_live_data():
    platform = random.choice(Platform.objects.all())

    url = get_live_url(platform)
    duration = get_duration()
    live_hashtags = get_hashtags()

    live_data = {
        # **LiveSerializer(LiveFactory.build()).data,
        "platform": platform.name,
        "link": url,
        "hashtags": live_hashtags,
        "description": fake.text(max_nb_chars=75),
        "duration": "00:30:00",
        "is_featured": True,
    }

    return live_data
