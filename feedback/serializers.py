from rest_framework import serializers
from .models import TherapistFeedback

class TherapistFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TherapistFeedback
        fields = '__all__'