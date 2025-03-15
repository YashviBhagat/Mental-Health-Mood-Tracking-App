from django.db import models

class User(models.Model):
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    dateOfBirth = models.CharField(max_length=50)
    gender = models.CharField(max_length=50)
    physicalActivityLevel = models.CharField(max_length=50)
    last_login = models.CharField(max_length=50)

    def __str__(self):
        return str(self.__dict__)
    
class Login(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)