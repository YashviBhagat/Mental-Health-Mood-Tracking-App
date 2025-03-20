from django.db import models
from django.utils.timezone import now
           
    
#login page data save to use it as id for other features
class SavedText(models.Model):
    username = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    #class Meta:
     #   db_table = "User"

    def __str__(self):
        return self.content[:50] 
   
#chat messages between users
  
class ChatMessage(models.Model):
    chat_id = models.CharField(max_length=255)  # Unique chat ID
    username = models.CharField(max_length=255)  # Sender
    selected_username = models.CharField(max_length=255)  # Receiver
    sent_text = models.TextField(null=True, blank=True)  # Text if sent by user
    received_text = models.TextField(null=True, blank=True)  # Text if received by user
    text_time = models.DateTimeField(auto_now_add=True)  # Timestamp

    def __str__(self):
        return f"Chat {self.chat_id}: {self.username} -> {self.selected_username}"
    
        
