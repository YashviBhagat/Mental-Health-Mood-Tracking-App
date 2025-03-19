from django.db import models
from django.contrib.auth.hashers import make_password

class Signup(models.Model):
    username = models.CharField(max_length=150, unique=True, blank=False, null=False)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    password = models.CharField(max_length=150)  # Hashed in `create_signup`
    date_of_birth = models.DateField(null=True, blank=True)

    gender = models.CharField(max_length=10, choices=[("male", "Male"), ("female", "Female")], blank=True, null=True)
    user_type = models.CharField(max_length=10, choices=[("user", "User"), ("therapist", "Therapist")], blank=True, null=True)

    licence_number = models.CharField(max_length=100, blank=True, null=True)
    consultation_type = models.CharField(max_length=100, blank=True, null=True)
    about_me = models.TextField(blank=True, null=True)

    wellbeing_goal = models.CharField(max_length=100, blank=True, null=True)
    feelings = models.JSONField(default=dict, blank=True)  # Change list → dict

    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_submission_date = models.DateField(blank=True, null=True)

    mood_ratings = models.JSONField(default=dict, blank=True)

    def save(self, *args, **kwargs):  
        if not self.pk:  # Hash password only on creation
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class MoodRating(models.Model):
    user = models.ForeignKey(Signup, on_delete=models.CASCADE)
    mood = models.CharField(max_length=50)
    rating = models.IntegerField()
    date = models.DateField(auto_now_add=True)
