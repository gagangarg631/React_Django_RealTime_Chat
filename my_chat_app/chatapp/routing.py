from django.urls import re_path
from . import ChatConsumer

ws_urlpatterns = [
    re_path(r'ws/chat/(\w+)', ChatConsumer.ChatConsumer.as_asgi()),
]