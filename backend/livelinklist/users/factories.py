import factory
import factory.django

from livelinklist.users.models import User


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    email = factory.Faker("email")
    credits = factory.Faker("random_number", digits=2, fix_len=False)
