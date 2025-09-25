from django.urls import path
from .views import *

urlpatterns = [
    path("AddStudent/", AddStudent),
    path("EditStudent/", EditStudent),
    path("AddFaculty/", AddFaculty),
    path("Login/", Login),
    path("GetStudents/", GetStudents),
    path("GetFeesData/", GetFeesData),
    path("GetBooks/", GetBooks),
    path("AddBook/", AddBook),
    path("IssueBook/", IssueBook),
    path("ReturnBook/", ReturnBook),
    path("AddHostel/", AddHostel),
    path("AssignHostelRoom/", AssignHostelRoom),
    path("EmptyHostelRoom/", EmptyHostelRoom),
    path("GetHostelRoom/", GetHostelRoom),
]