# Generated by Django 3.1.7 on 2021-04-09 00:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lives', '0007_auto_20210319_0419'),
    ]

    operations = [
        migrations.AddField(
            model_name='platform',
            name='live_url_extra',
            field=models.URLField(blank=True, null=True),
        ),
    ]
