from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from jsonschema import validate

# https://pythonhosted.org/Flask-Inputs/#module-flask_inputs
# https://json-schema.org/understanding-json-schema/
# we want an object containing a required greetee  string value

deleteloc_schema = {"type" : "object","properties" : {"id" : {"type" : "number"}}}

userviewloc_schema = {"type" : "object","properties" : {"page" : {"type" : "number"}}}

login_schema = {"type" : "object","properties" : {
    "username" : {"type" : "string"},
    "password" : {"type" : "string"}}}

login_schema = {"type" : "object","properties" : {
    "name" : {"type" : "string"},
    "email" : {"type" : "string"},
    "username" : {"type" : "string"},
    "password" : {"type" : "string"}}}

addloc_schema = {"type" : "object","properties" : {
    "name" : {"type" : "string"},
    "longitude" : {"type" : "number"},
    "latitude" : {"type" : "number"}}}

updateloc_schema = {"type" : "object","properties" : {
    "id" : {"type" : "number"},
    "name" : {"type" : "string"},
    "longitude" : {"type" : "number"},
    "latitude" : {"type" : "number"}}}

class GreetingInputs(Inputs):
   json = [JsonSchema(schema=deleteloc_schema)]


def validate_greeting(request):
   inputs = GreetingInputs(request)
   if inputs.validate():
       return None
   else:
       return inputs.errors

def valid_check(request):
    try:
        ff=validate(instance=request, schema=deleteloc_schema)
        if ff is None:
            return None
        else:
            return "error"
    except:
        return "error"

def userviewloc_check(request):
    try:
        ff=validate(instance=request, schema=userviewloc_schema)
        if ff is None:
            if ('page' not in request):
                return "error"
            else:
                return None
        else:
            return "error"
    except:
        return "error"

def login_check(request):
    try:
        ff=validate(instance=request, schema=login_schema)
        if ff is None:
            if (('username' not in request) or ('password' not in request)):
                return "error"
            else:
                return None
        else:
            return "error"
    except:
        return "error"

def signup_check(request):
    try:
        ff=validate(instance=request, schema=login_schema)
        if ff is None:
            if (('username' not in request) or ('password' not in request) or ('name' not in request) or ('email' not in request)):
                return "error"
            else:
                return None
        else:
            return "error"
    except:
        return "error"

def addloc_check(request):
    try:
        ff=validate(instance=request, schema=addloc_schema)
        if ff is None:
            if (('name' not in request) or ('longitude' not in request) or ('latitude' not in request)):
                return "error"
            else:
                return None
        else:
            return "error"
    except:
        return "error"

def updateloc_check(request):
    try:
        ff=validate(instance=request, schema=updateloc_schema)
        if ff is None:
            if (('name' not in request) or ('longitude' not in request) or ('latitude' not in request) or ('id' not in request)):
                return "error"
            else:
                return None
        else:
            return "error"
    except:
        return "error"
