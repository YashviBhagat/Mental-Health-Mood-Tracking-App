from django.urls import path
from .views import get_signup, create_signup, signup_detail, signin_user  # Updated function names

urlpatterns = [
    path('signupP/', get_signup, name='get_signup'),  
    path('signupP/create/', create_signup, name='create_signup'),  
    path('signupP/<int:pk>/', signup_detail, name='signup_detail'), 
    path('signin/', signin_user, name='signin_user'), 
]
