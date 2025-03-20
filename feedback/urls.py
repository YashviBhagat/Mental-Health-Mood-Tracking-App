from django.urls import path
from .views import TherapistFeedbackListCreate

urlpatterns = [
    path('feedback/', TherapistFeedbackListCreate.as_view()),
]