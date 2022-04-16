from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from chatapp.models import People

def Register(request):
    if request.method == "POST":
        data = request.POST
        username = data['username']
        email = data['email']
        password = data['password']

        new_user = User.objects.create_user(username, email, password)
        new_user.save()
        
        people = People(username=new_user.username)
        people.save()

        
        login(request, new_user)
        return redirect('/')
    else:
        return render(request, 'register.html')

def Login(request):
    if request.method == "POST":
        data = request.POST
        username = data['username']
        password = data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            # render the home page
            login(request, user)
            return redirect('/')
        else:
            # show invalid user message
            return render(request, 'login.html')
    else:
        return render(request, 'login.html')


def Logout(request):
    logout(request)
    return redirect('login')