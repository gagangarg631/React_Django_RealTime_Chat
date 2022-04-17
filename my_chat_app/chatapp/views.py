import re
from django.dispatch import receiver
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from requests import request
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from .models import People, Chats
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from . import util
import os

from datetime import datetime

@api_view(['POST'])
def getChats(request):
    username = request.data['username']
    friend_username = request.data['friend_username']
    chats = Chats.objects.filter(Q(sender=username) | Q(sender=friend_username), 
                            Q(receiver=username) | Q(receiver=friend_username)).values()
    return Response(chats)

@api_view(['POST'])
def createUser(request):
    username = request.data['username']
    if not People.objects.filter(username=username).exists():
        people = People(username=username)
        people.save()
    
    return Response({'status': 'success'})

@api_view(['POST'])
def getFriends(request):
    username = request.data['username']
    people = People.objects.get(username=username)
    friends = people.friend.all().values()
    return Response(friends)

@api_view(['POST'])
def checkUser(request):
    username = request.data['username']
    response = {
        'found': '',
    }
    if People.objects.filter(username=username).exists():
        response['found'] = True
    else:
        response['found'] = False

    return Response(response)


        
            
            