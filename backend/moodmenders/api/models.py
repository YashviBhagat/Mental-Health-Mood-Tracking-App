from django.db import models

class Signup(models.Model):
    username = models.CharField(max_length=150, unique=True, blank=False, null=False)  # Ensure this field exists
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique=True, null=True, blank=True)  # Allows NULL values
    password = models.CharField(max_length=150)  # Hash this in production
    date_of_birth = models.DateField(null=True, blank=True)  # Allows NULL values

    gender = models.CharField(max_length=10, choices=[("male", "Male"), ("female", "Female")], blank=True, null=True)
    user_type = models.CharField(max_length=10, choices=[("user", "User"), ("therapist", "Therapist")], blank=True, null=True)

    # Therapist-Specific Fields
    licence_number = models.CharField(max_length=100, blank=True, null=True)
    consultation_type = models.CharField(max_length=100, blank=True, null=True)
    about_me = models.TextField(blank=True, null=True)

    # User-Specific Fields
    wellbeing_goal = models.CharField(max_length=100, blank=True, null=True)
    feelings = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.username
