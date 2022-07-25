from email.mime import image
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from . import util
from .models import Chats, People, FileData

from django.core.files.base import ContentFile
import base64
import binascii

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        path = self.scope['path']
        username = path[path.rindex('/') +1 : ]
        self.username = username
        self.room_group_name = self.username
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def send_message(self, obj):
        try:

            msg = obj[util.msg]
            receiver = obj[util.receiver]
            file = obj['FILE']
            print(obj)
            people = People.objects.get(username=self.username)
            people.friend.add(receiver)

            
            chat = Chats(sender=self.username, receiver=receiver, message=msg)
            chat.save()
            if file:
                format, imgstr = file.split(';base64,') 
                ext = format.split('/')[-1] 
                file_data = ContentFile(base64.b64decode(imgstr),name='kd')
                new_file = FileData(chat=chat, file=file_data)
                new_file.save()


            async_to_sync(self.channel_layer.group_send)(
                receiver,
                {
                    'type': 'receive_message',
                    'message': msg,
                    '_from': self.room_group_name,
                    'images': file

                }
            )
        except Exception as e:
            print("send message function error " + str(e))
            
    commands = {
        'send_message': send_message
    }

    def receive(self,text_data):
        if text_data:
            json_obj = json.loads(text_data)
            if json_obj['command'] in self.commands:
                self.commands[json_obj['command']](self, json_obj)
        

    def receive_message(self, event):
        msg = event['message']
        _from = event['_from']
        images = event['images']
        
        _obj = {
            'command': 'receive_message',
            '_from': _from,
            'message': msg,
            'images': images
        }
        self.send(text_data=json.dumps(_obj))


        