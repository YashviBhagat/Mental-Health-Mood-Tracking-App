from rest_framework import serializers
from .models import Signup, MoodRating, Feedback

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signup
        fields = '__all__'

class MoodRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodRating
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
