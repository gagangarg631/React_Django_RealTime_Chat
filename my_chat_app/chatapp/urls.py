from django.urls import path

from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('checkUser/', views.checkUser),
    path('getFriends/', views.getFriends),
    path('getChats/', views.getChats),
    path('uploadChatImages/', views.uploadImages),
    path('createUser/', views.createUser),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)