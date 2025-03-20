from django.urls import path
#from . import views  # ✅ Import the full `views` module instead of specific functions
from .views import save_text, get_texts, get_all_users, send_message, get_chat, get_chat_users  # ✅ Import functions directly


urlpatterns = [
    path('save-text/', save_text, name='save-text'), #save logged in user details
    path('get-texts/', get_texts, name='get-texts'), #get loggedin user details
    #path('notes/', save_new_note, name='save_new_note'), #new_note form
   # path('notes_list/', get_notes, name='get_notes'), #display list of logged in user notes
   # path('retrieve_note/', retrieve_note, name='retrieve_note'), #retrieve saved notes
    #path('update_note/', update_note, name='update_note'), #update notes
    path("get-users/", get_all_users, name="get_users"),  # New API (fetch all users)
   # path("send-message/", send_message, name="send_message"), #store messages
   # path("get-chat/<str:username>/<str:selected_username>/", get_chat_history, name="get_chat"), #retrieve chat
    path("get-chat-users/<str:username>/", get_chat_users, name="get_chat_users"),
    path("send-message/", send_message, name="send_message"),
    path("get-chat/<str:chat_id>/", get_chat, name="get_chat"),

]
