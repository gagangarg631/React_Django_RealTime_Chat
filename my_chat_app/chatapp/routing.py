from django.urls import re_path
from . import consumers, ChatConsumer

ws_urlpatterns = [
    re_path(r'ws/requsets/', consumers.RequestConsumer.as_asgi()),
    re_path(r'ws/chat/', ChatConsumer.ChatConsumer.as_asgi()),
]