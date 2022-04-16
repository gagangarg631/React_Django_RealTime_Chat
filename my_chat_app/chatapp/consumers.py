import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from . import util
from .models import Notification, People
from django.contrib.auth.models import User

class RequestConsumer(WebsocketConsumer):

    def fetchAllNotifications(self):
        if self.user.is_authenticated:
            incoming_requests = Notification.objects.filter(notify_to=self.people,notification="REQ").values_list('notify_from')
            
            self.send(text_data=json.dumps({
                'command': 'incoming_notifications',
                'incoming_requests_from': [item[0] for item in incoming_requests],
                'incoming_requests_messages': [item[0] + ' sent you a request' for item in incoming_requests]
            }))

    def connect(self):
        self.user = self.scope['user']
        self.people = People.objects.get(username=self.user.username)
        
        if self.user.is_authenticated:
            self.room_group_name = self.user.username
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )

            self.accept()
            self.fetchAllNotifications()
        else:
            print("please login to connect to requests")

    def accept_request(self,obj):
        try:
            sender_username = obj[util.sender]
            sender_people = People.objects.get(username=sender_username)

            Notification.objects.get(notification="REQ", notify_to=self.people,notify_from=sender_people).delete()

            self.people.friend.add(sender_people)

            async_to_sync(self.channel_layer.group_send)(
                sender_username,
                {
                    'type': 'request_accepted',
                    '_by': self.room_group_name
                }
            )
        except Exception as e:
            print("something wrong in accept request method ")
            print(e)

    def send_request(self,obj):
        try:
            dest_user = obj[util.dest_user]
            if People.objects.filter(username=dest_user).exists():
                request_to_People = People.objects.get(username=dest_user)

                if not Notification.objects.filter(notification="REQ", notify_to=request_to_People,notify_from=self.people).exists() and not Notification.objects.filter(notification="REQ", notify_to=self.people,notify_from=request_to_People).exists() and not self.people.friend.filter(username=request_to_People).exists():
                    
                    ntn = Notification(
                                notification = "REQ",
                                notify_to = request_to_People,
                                notify_from = self.people
                            )
                    ntn.save()

                    async_to_sync(self.channel_layer.group_send)(
                        dest_user,
                        {
                            'type': 'receive_request',
                            '_from': self.room_group_name
                        }
                    )
        except Exception as e:
            print("something wrong in send request method " + str(e))

    commands = {
        'send_request': send_request,
        'accept_request': accept_request
    }

        

    def receive(self, text_data):
        json_obj = json.loads(text_data)
        if json_obj['command'] in self.commands:
            self.commands[json_obj['command']](self,json_obj)

        
    def receive_request(self, event):
        req_from = event['_from']
        self.send(text_data=json.dumps({
            'command': 'receive_request',
            '_from': req_from,
            'message': req_from + ' sent you a request'
        }))

    def request_accepted(self, event):
        accepted_by = event['_by']
        self.send(text_data=json.dumps({
            'command': 'request_accepted',
            '_by': accepted_by,
            'message': accepted_by + ' accepted your request'
        }))