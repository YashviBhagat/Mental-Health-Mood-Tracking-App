# Generated by Django 5.0.6 on 2025-03-15 00:31

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_user_lastlogin'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='last_login',
            field=models.CharField(default=django.utils.timezone.now, max_length=50),
            preserve_default=False,
        ),
    ]
