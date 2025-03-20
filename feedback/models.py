
# Create your models here.
from django.db import models

class TherapistFeedback(models.Model):
    user_id = models.IntegerField()  # Replace with ForeignKey if you have a User model
    therapist_id = models.IntegerField()  # Replace with ForeignKey if you have a Therapist model
    rating = models.CharField(max_length=20)
    feedback_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback {self.id} - {self.rating}"
