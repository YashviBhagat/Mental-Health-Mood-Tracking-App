'''from django.urls import path
from .views import login_user, register_user, get_all_users

urlpatterns = [
    path('user/register/', register_user, name='register_user'),
    path('user/login/', login_user, name='login_user'),
    path('user/all/', get_all_users, name='get_all_users'), 
]
'''

'''
from django.urls import path
from .views import create_note, note_list, save_text, get_texts  # Import views from api/views.py

urlpatterns = [
    path('notes/', create_note, name='create_note'),  # POST request to save a note
    path('notes_list/', note_list, name='list_notes'),  # GET request to fetch notes
    path('save-text/', save_text, name='save-text'),
    path('get-texts/', get_texts, name='get-texts'),
]
'''
'''
from django.urls import path
from .views import save_new_note, save_text, get_texts, get_notes, update_note, retrieve_note # Import views from api/views.py  note_list,

urlpatterns = [
    path('notes/', save_new_note, name='save_new_note'),  # POST request to save a note
    #path('notes_list/', note_list, name='list_notes'),  # GET request to fetch notes
    path('save-text/', save_text, name='save-text'),
    path('get-texts/', get_texts, name='get-texts'),
    path('notes_list/', get_notes, name='get_notes'),
    path('retrieve_note/', retrieve_note, name='retrieve_note'), 
    path('update_note/', update_note, name = 'update_note'), 
    #path('api/update_note/<str:user_note>/', update_note, name = 'update_note'), 
    #path('api/retrieve_note/', retrieve_note, name='retrieve_note'),*/
]
'''

from django.urls import path
#from . import views  # ✅ Import the full `views` module instead of specific functions
from .views import save_new_note, save_text, get_texts, get_notes, update_note, retrieve_note  # ✅ Import functions directly


urlpatterns = [
    path('save-text/', save_text, name='save-text'), #save logged in user details
    path('get-texts/', get_texts, name='get-texts'), #get loggedin user details
    path('notes/', save_new_note, name='save_new_note'), #new_note form
    path('notes_list/', get_notes, name='get_notes'), #display list of logged in user notes
    path('retrieve_note/', retrieve_note, name='retrieve_note'), #retrieve saved notes
    path('update_note/', update_note, name='update_note'), #update notes
]
