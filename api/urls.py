from django.urls import path
from .views import *

urlpatterns = [
    path("AddStudent/", AddStudent),
    path("EditStudent/", EditStudent),
    path("AddFaculty/", AddFaculty),
    path("Login/", Login),
]