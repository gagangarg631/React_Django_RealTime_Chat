from django.db import models
from django.conf import settings


class People(models.Model):
    username = models.CharField(max_length=50,primary_key=True,default="null")

    # i m putting symmetical to false bcoz it occupy just double space
    friend = models.ManyToManyField("self", blank=True, symmetrical=True)
    
    def __str__(self):
        return self.username

    class Meta:
        pass

class Chats(models.Model):
    sender = models.CharField(max_length=50, default="deleted")
    receiver = models.CharField(max_length=50, default="deleted")
    image = models.ImageField(upload_to='Chats/',null=True)
    message = models.TextField()
    send_time = models.DateTimeField(auto_now=True)
    receive_time = models.DateTimeField(null=True)

