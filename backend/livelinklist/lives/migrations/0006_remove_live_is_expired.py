# Generated by Django 3.1.7 on 2021-03-18 20:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lives', '0005_auto_20210313_0116'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='live',
            name='is_expired',
        ),
    ]