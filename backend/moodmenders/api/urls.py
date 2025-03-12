from django.urls import path
from .views import get_login, create_login, login_detail

urlpatterns = [
    path('loginP/', get_login, name='get_login'),  
    path('loginP/create/', create_login, name='create_login'),  
    path('loginP/<int:pk>/', login_detail, name='login_detail'),  
]
