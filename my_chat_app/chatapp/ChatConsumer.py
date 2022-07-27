from cgitb import text
from email.mime import image
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from . import util
from .models import Chats, People, FileData

from rest_framework.response import Response
from django.core.files.base import ContentFile
import base64
import binascii
from mimetypes import guess_extension

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
        # try:

        msg = obj[util.msg]
        receiver = obj[util.receiver]
        fileObj = obj[util.files]
        
        people = People.objects.get(username=self.username)
        people.friend.add(receiver)
        
        chat = Chats(sender=self.username, receiver=receiver, message=msg)
        chat.save()
        _file = None

        if fileObj:
            data,file_type,file_name = fileObj
            file = fileObj[data]
            format, imgstr = file.split(';base64,') 
            file_data = ContentFile(base64.b64decode(imgstr),name=fileObj[file_name])
            new_file = FileData(chat=chat, file=file_data, file_type=fileObj[file_type])
            new_file.save()
            
            _file = {
                    'url': new_file.getFileUrl(),
                    'type': new_file.file_type
                }
            
        

        async_to_sync(self.channel_layer.group_send)(
            receiver,
            {
                'type': 'receive_message',
                'message': msg,
                '_from': self.room_group_name,
                'file': _file
            }
        )

        # except Exception as e:
        #     print("send message function error " + str(e))
            
            
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
        file = event['file']
        
        _obj = {
            'command': 'receive_message',
            '_from': _from,
            'message': msg,
            'file': file
        }
        self.send(text_data=json.dumps(_obj))


        