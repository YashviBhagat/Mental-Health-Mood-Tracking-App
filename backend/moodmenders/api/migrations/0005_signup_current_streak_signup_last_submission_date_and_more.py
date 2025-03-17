# Generated by Django 5.1.6 on 2025-03-17 17:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_moodrating"),
    ]

    operations = [
        migrations.AddField(
            model_name="signup",
            name="current_streak",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="signup",
            name="last_submission_date",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="signup",
            name="longest_streak",
            field=models.IntegerField(default=0),
        ),
    ]
