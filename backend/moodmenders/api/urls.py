from django.urls import path
from .views import signup, signin, submit_mood, get_mood_ratings, get_user_profile

urlpatterns = [
    path('signup/', signup),
    path('signin/', signin),
    path('submit-mood/', submit_mood),
    path('get-mood-ratings/<int:user_id>/', get_mood_ratings),
    path('get-user-profile/<int:user_id>/', get_user_profile),  # New API for fetching signup data
]
