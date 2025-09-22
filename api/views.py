from django.shortcuts import render
from django.http import HttpResponse
from requests.exceptions import HTTPError
from django.views.decorators.csrf import csrf_exempt # purely for test
import pyrebase
import json

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
# @csrf_exempt # purely for test
def Signup(request):
    if request.method != "POST":
        return HttpResponse("Form submission pls")
        
    email = request.POST.get("EMAIL")
    password = request.POST.get("PASSWORD")
    
    try:
        user = auth.create_user_with_email_and_password(email, password)
    except HTTPError as e:
        error_message = json.loads(e.args[1])['error']['message']
        if error_message == "EMAIL_EXISTS":
            return HttpResponse("Email already exists")
        elif error_message.startswith("WEAK_PASSWORD"):
            return HttpResponse("Password is too weak")
        else:
            return HttpResponse("Other error:" + error_message)

    request.session['tokenID'] = user['idToken']
    return HttpResponse(user['idToken'])

# @csrf_exempt # purely for test
def Login(request):
    if request.method != "POST":
        return HttpResponse("Form submission pls")
        
    email = request.POST.get("EMAIL")
    password = request.POST.get("PASSWORD")
    
    try:
        user = auth.sign_in_with_email_and_password(email, password)
    except HTTPError as e:
        error_message = json.loads(e.args[1])['error']['message']
        if error_message == "EMAIL_NOT_FOUND":
            return HttpResponse("Email already exists")
        elif error_message == "INVALID_PASSWORD":
            return HttpResponse("Password is too weak")
        else:
            return HttpResponse("Other error:" + error_message)

    request.session['tokenID'] = user['idToken']
    return HttpResponse(user['idToken'])

def AddStudent(request): 
    token_id = request.session.get('tokenID')
    if not token_id:
        return HttpResponse("Unauthorized")
    
    ID = request.GET.get("ID")

    if (database.child("Student").child(ID).get(token_id).val()):
        return HttpResponse("Student Already Exists")

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
    database.child("Student").child(ID).set(data, token_id)

    return HttpResponse("Added Student: "+NAME)

def DeleteStudent(request):
    token_id = request.session.get('tokenID')
    if not token_id:
        return HttpResponse("Unauthorized")

    ID = request.GET.get("ID")
    name = database.child("Student").child(ID).child("NAME").get(token_id).val()
    database.child("Student").child(ID).remove(token_id)
    return HttpResponse("Removed Student: "+name)

def AddFaculty(request): 
    token_id = request.session.get('tokenID')
    if not token_id:
        return HttpResponse("Unauthorized")

    ID = request.GET.get("ID")

    if (database.child("Faculty").child(ID).get(token_id).val()):
        return HttpResponse("Faculty Already Exists")

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
    database.child("Faculty").child(ID).set(data, token_id)
    return HttpResponse("Added Faculty: "+NAME)

def DeleteFaculty(request):
    token_id = request.session.get('tokenID')
    if not token_id:
        return HttpResponse("Unauthorized")

    ID = request.GET.get("ID")
    name = database.child("Faculty").child(ID).child("NAME").get(token_id).val()
    database.child("Faculty").child(ID).remove(token_id)
    return HttpResponse("Removed Faculty: "+name)