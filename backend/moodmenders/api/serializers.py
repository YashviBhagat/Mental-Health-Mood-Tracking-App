from rest_framework import serializers
from .models import SignIn, SignUp, MoodRating, MoodStreak

class SignInSerializer(serializers.ModelSerializer):
    class Meta:
        model = SignIn
        fields = '__all__'

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = SignUp
        fields = '__all__'

class MoodRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodRating
        fields = '__all__'

class MoodStreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodStreak
        fields = '__all__'
