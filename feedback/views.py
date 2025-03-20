from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import TherapistFeedback
from .serializers import TherapistFeedbackSerializer

class TherapistFeedbackListCreate(generics.ListCreateAPIView):
    queryset = TherapistFeedback.objects.all()
    serializer_class = TherapistFeedbackSerializer