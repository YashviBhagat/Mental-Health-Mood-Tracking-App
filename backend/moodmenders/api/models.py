from django.db import models
from django.utils import timezone

class SignIn(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=150)  # Store hashed password

class SignUp(models.Model):
    user = models.OneToOneField(SignIn, on_delete=models.CASCADE, null=True, blank=True)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[("male", "Male"), ("female", "Female")], blank=True, null=True)
    user_type = models.CharField(max_length=10, choices=[("user", "User"), ("therapist", "Therapist")], blank=True, null=True)
    licence_number = models.CharField(max_length=100, blank=True, null=True)
    consultation_type = models.CharField(max_length=100, blank=True, null=True)
    about_me = models.TextField(blank=True, null=True)

class MoodRating(models.Model):
    user = models.ForeignKey(SignIn, on_delete=models.CASCADE)  # FIXED: Changed SIGHUP → SignIn
    happy = models.IntegerField(default=0)
    excited = models.IntegerField(default=0)
    sad = models.IntegerField(default=0)
    nervous = models.IntegerField(default=0)
    worried = models.IntegerField(default=0)
    bored = models.IntegerField(default=0)
    angry = models.IntegerField(default=0)
    date = models.DateField(default=timezone.now)

class MoodStreak(models.Model):
    user = models.ForeignKey(SignIn, on_delete=models.CASCADE)  # FIXED: Changed SIGHUP → SignIn
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_submission_date = models.DateField(blank=True, null=True)
