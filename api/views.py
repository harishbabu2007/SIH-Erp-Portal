from django.shortcuts import render
from django.http import HttpResponse
import pyrebase

config = {
    "apiKey": "AIzaSyAQrhF-jzclVk_1Ud4Jh4K5327Bd9Zq_C8",
    "authDomain": "sih25erp.firebaseapp.com",
    "databaseURL": "https://sih25erp-default-rtdb.firebaseio.com",
    "projectId": "sih25erp",
    "storageBucket": "sih25erp.firebasestorage.app",
    "messagingSenderId": "817995256788",
    "appId": "1:817995256788:web:e0a926d79e4797b64fbc41",
}

firebase = pyrebase.initialize_app(config)
auth  = firebase.auth()
database = firebase.database()

# Create your views here.
def AddStudent(request): 
    # Post Auth
    if (database.child("Student").child(ID).get().val()):
        return HttpResponse("Student Already Exists")

    ID = request.GET.get("ID")
    NAME = request.GET.get("NAME")
    MOBILE = request.GET.get("MOBILE")
    DOB = request.GET.get("DOB")
    GENDER = request.GET.get("GENDER")
    CATEGORY = request.GET.get("CATEGORY")
    BRANCH = request.GET.get("BRANCH")
    EMC_NAME = request.GET.get("EMC_NAME")
    EMC_MOBILE = request.GET.get("EMC_MOBILE")
    EMC_RELATIONSHIP = request.GET.get("EMC_RELATIONSHIP")

    data = {
        "NAME": NAME,
        "MOBILE": MOBILE,
        "DOB": DOB,
        "GENDER": GENDER,
        "CATEGORY": CATEGORY,
        "BRANCH": BRANCH,
        "EMERGENY_CONTACT":{
            "NAME": EMC_NAME,
            "MOBILE": EMC_MOBILE,
            "RELATIONSHIP": EMC_RELATIONSHIP
        }
    }
    database.child("Student").child(ID).set(data)

    return HttpResponse("Added Student: "+NAME)

def AddFaculty(request): 
    # Post Auth
    if (database.child("Faculty").child(ID).get().val()):
        return HttpResponse("Faculty Already Exists")

    ID = request.GET.get("ID")
    NAME = request.GET.get("NAME")
    MOBILE = request.GET.get("MOBILE")
    DOB = request.GET.get("DOB")
    GENDER = request.GET.get("GENDER")
    ACCESS_ID = request.GET.get("ACCESS_ID")

    data = {
        "NAME": NAME,
        "MOBILE": MOBILE,
        "DOB": DOB,
        "GENDER": GENDER,
        "ACCESS_ID": ACCESS_ID,
    }
    database.child("Faculty").child(ID).set(data)

    return HttpResponse("Added Faculty: "+NAME)
