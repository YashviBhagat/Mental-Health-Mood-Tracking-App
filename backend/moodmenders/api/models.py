from django.db import models

class Login(models.Model):
    name = models.CharField(max_length=50)
    password = models.IntegerField()

    def __str__(self):
        return self.name