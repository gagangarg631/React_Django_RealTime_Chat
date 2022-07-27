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
    message = models.TextField()
    send_time = models.DateTimeField(auto_now=True)
    receive_time = models.DateTimeField(null=True)

class FileData(models.Model):
    file = models.FileField(upload_to='UserMediaFiles/')
    chat = models.ForeignKey('Chats', on_delete=models.CASCADE)
    file_type = models.CharField(max_length=20)

    def getFileUrl(self):
        return self.file.url