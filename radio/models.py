from django.db import models

# Create your models here.

class Client(models.Model):
    id = models.TextField(primary_key=True)
    ct = models.IntegerField()
    ecg = models.IntegerField()

class CT(models.Model):
    id = models.IntegerField(primary_key=True)
    location = models.TextField()

class ECG(models.Model):
    id = models.IntegerField(primary_key=True)
    location = models.TextField()