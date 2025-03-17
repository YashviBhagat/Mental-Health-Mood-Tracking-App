from rest_framework import serializers
from .models import Signup, MoodRating

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signup
        fields = '__all__'

class MoodRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodRating
        fields = '__all__'
