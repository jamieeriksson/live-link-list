import datetime
from collections import OrderedDict

from django.core import validators
from django.core.validators import URLValidator
from django.db.models.fields import CharField
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import CurrentUserDefault

from livelinklist.lives.models import Hashtag, Live, Platform


class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = [
            "name",
            "platform_url",
            "live_url",
        ]


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ["name"]

    def to_internal_value(self, data):
        if Hashtag.objects.filter(name=data).exists():
            return Hashtag.objects.get(name=data)

        errors = OrderedDict()
        fields = self._writable_fields
        data_fields = []
        for field in fields:
            data_fields.append(field)
        try:
            validated_value = data_fields[0].run_validation(data)
            Hashtag.objects.create(name=validated_value)
        except ValidationError as exc:
            errors[data_fields[0].field_name] = exc.detail

        return Hashtag.objects.get(name=validated_value)


class OwnerDefault:
    requires_context = True

    def __call__(self, serializer_field):
        if serializer_field.context["request"].user.is_anonymous:
            return None
        print(serializer_field.context["request"].user)
        return serializer_field.context["request"].user

    def __repr__(self):
        return "%s()" % self.__class__.__name__


class LiveSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=OwnerDefault())
    # owner = serializers.HiddenField(default=CurrentUserDefault())

    platform = serializers.SlugRelatedField(
        queryset=Platform.objects.all(), slug_field="name"
    )

    # link = LinkField()

    hashtags = HashtagSerializer(many=True)
    duration = serializers.DurationField()
    expires_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Live
        fields = [
            "id",
            "created_at",
            "modified_at",
            "owner",
            "platform",
            "link",
            "username",
            "description",
            "duration",
            # "is_expired",
            "is_featured",
            "clicks",
            "owner",
            "hashtags",
            "expires_at",
        ]

    # def clean(self):
    #     if self.platform.live_url not in self.link:
    #         raise serializers.ValidationError(
    #             {
    #                 "link": "Link must be a proper live url for {}".format(
    #                     self.platform.name
    #                 )
    #             },
    #             code=400,
    #         )

    def validate_link(self, value):
        data = self.get_initial()
        if Platform.objects.filter(name=data["platform"]).exists():
            platform = Platform.objects.get(name=data["platform"])
        else:
            return

        if platform.live_url not in data["link"]:
            raise ValidationError(
                "Link must be a proper live url for {}".format(platform.name)
            )

        return value

    def create(self, validated_data):
        hashtags = validated_data.pop("hashtags")
        live = Live.objects.create(**validated_data)
        live.hashtags.set(hashtags)

        return live

    def update(self, instance, validated_data):
        hashtags_data = validated_data.pop("hashtags")
        instance.hashtags.set(hashtags_data)
        # hashtags = instance.hashtags

        instance.platform = validated_data.get("platform", instance.platform)
        instance.link = validated_data.get("link", instance.link)
        instance.description = validated_data.get("description", instance.description)
        instance.username = validated_data.get("username", instance.username)
        instance.is_featured = validated_data.get("is_featured", instance.is_featured)

        instance.save()

        return instance
