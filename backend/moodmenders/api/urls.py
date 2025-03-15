from django.urls import path
from .views import login_user, register_user, get_all_users

urlpatterns = [
    path('user/register/', register_user, name='register_user'),
    path('user/login/', login_user, name='login_user'),
    path('user/all/', get_all_users, name='get_all_users'), 
]
