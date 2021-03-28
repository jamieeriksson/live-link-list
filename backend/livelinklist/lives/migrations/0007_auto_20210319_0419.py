# Generated by Django 3.1.7 on 2021-03-19 04:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('lives', '0006_remove_live_is_expired'),
    ]

    operations = [
        migrations.AlterField(
            model_name='live',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='lives', to=settings.AUTH_USER_MODEL),
        ),
    ]