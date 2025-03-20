from django.urls import path
from .views import save_session,submit_feedback,update_user,get_user_moods,get_signup, create_signup, get_user_streaks, signup_detail, signin_user, submit_mood_rating,get_user_mood_ratings,update_mood_rating # Updated function names

urlpatterns = [
    path('signupP/', get_signup, name='get_signup'),  
    path('signupP/create/', create_signup, name='create_signup'),  
    path('signupP/<int:pk>/', signup_detail, name='signup_detail'), 
    path('signin/', signin_user, name='signin_user'), 
    
    path('submit-mood/', submit_mood_rating, name='submit_mood_rating'),
    path('get-user-moods/<int:user_id>/', get_user_mood_ratings, name='get_user_mood_ratings'),
    path('update-mood/<int:rating_id>/', update_mood_rating, name='update_mood_rating'),
    path('get-user-streaks/<int:user_id>/', get_user_streaks, name='get_user_streaks'),
    path("api/get-user-moods/<int:user_id>/", get_user_moods, name="get-user-moods"),
    path("update-user/<int:user_id>/", update_user, name="update-user"),
    path("submit/<int:user_id>/", submit_feedback, name="submit_feedback"),
    path("save-session/", save_session, name="save-session"),
     
    

]
