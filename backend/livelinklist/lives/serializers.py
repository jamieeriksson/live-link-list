from collections import OrderedDict

from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.relations import PrimaryKeyRelatedField

from livelinklist.lives.models import Hashtag, Live, Platform


class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = [
            "id",
            "name",
            "platform_url",
            "live_url",
            "live_url_extra",
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
            return

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


class PrimaryKeyIdRelatedField(PrimaryKeyRelatedField):
    """
    Name primary key related fields as e.g. "organization_id" instead of "organization"
    """

    def to_internal_value(self, data):
        if self.pk_field is not None:  # pragma: no cover
            data = self.pk_field.to_internal_value(data).id
        try:
            return self.get_queryset().get(pk=data).id
        except ObjectDoesNotExist:
            self.fail("does_not_exist", pk_value=data)
        except (TypeError, ValueError, ValidationError):
            self.fail("incorrect_type", data_type=type(data).__name__)


class LiveSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=OwnerDefault())

    platform_id = PrimaryKeyIdRelatedField(queryset=Platform.objects.all())

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
            "platform_id",
            "link",
            "username",
            "description",
            "duration",
            "is_featured",
            "clicks",
            "owner",
            "hashtags",
            "expires_at",
        ]

    def validate_link(self, value):
        data = self.get_initial()
        if Platform.objects.filter(id=data["platform_id"]).exists():
            platform = Platform.objects.get(id=data["platform_id"])
        else:
            return

        if platform.live_url_extra:
            if (
                platform.live_url not in data["link"]
                and platform.live_url_extra not in data["link"]
            ):
                raise ValidationError(
                    "Link must be a proper live url for {}".format(platform.name)
                )
        else:
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

        instance.platform_id = validated_data.get("platform_id", instance.platform_id)
        instance.link = validated_data.get("link", instance.link)
        instance.description = validated_data.get("description", instance.description)
        instance.username = validated_data.get("username", instance.username)
        instance.is_featured = validated_data.get("is_featured", instance.is_featured)
        instance.duration = validated_data.get("duration") + instance.duration

        instance.save()

        return instance
