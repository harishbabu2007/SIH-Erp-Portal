from django.urls import path
from .views import *

urlpatterns = [
    path("AddStudent/", AddStudent),
    path("AddFaculty/", AddFaculty),
    path("DeleteStudent/", DeleteStudent),
    path("DeleteFaculty/", DeleteFaculty),
]
