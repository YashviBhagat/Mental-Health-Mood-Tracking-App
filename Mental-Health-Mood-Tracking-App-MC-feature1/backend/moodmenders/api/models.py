from django.db import models
           
class NewNote(models.Model):
    user_note = models.CharField(max_length=255, unique=True)
    username = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()
    last_updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_note
    
#login page data save to use it as id for other features
class SavedText(models.Model):
    username = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "User"

    def __str__(self):
        return self.content[:50] 
        
