import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from . import util
from .models import Chats

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        
        if self.user.is_authenticated:
            self.room_group_name = self.user.username
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )

            self.accept()
        else:
            print("please login to connect to chats")


    def send_message(self, obj):
        try:

            msg = obj[util.msg]
            receiver = obj[util.receiver]
            images = obj['IMAGES']

            if not images:
                chat = Chats(sender=self.user.username, receiver=receiver, message=msg)
                chat.save()
            

            async_to_sync(self.channel_layer.group_send)(
                receiver,
                {
                    'type': 'receive_message',
                    'message': msg,
                    '_from': self.room_group_name,
                    'images': images

                }
            )
        except Exception as e:
            print("send message function error " + str(e))
            
    commands = {
        'send_message': send_message
    }

    def receive(self,text_data):
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


        