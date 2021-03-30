import json,copy
from random import randint
from flask import Flask, jsonify, request,session,redirect,url_for,current_app
from .entities.models import Locationgeo,User
from .entities.models import LocationSchema,UserSchema,UserLocationSchema
from .entities.validate import valid_check,login_check,addloc_check,updateloc_check,userviewloc_check,signup_check
from sqlalchemy.orm import sessionmaker
from sqlalchemy import func
from flask_cors import CORS
from sqlalchemy import create_engine
from geoalchemy2.functions import ST_AsGeoJSON,ST_AsText,ST_Y,ST_X
from geoalchemy2.elements import WKTElement
from functools import wraps
from flask_login.config import COOKIE_NAME, EXEMPT_METHODS
from flask_mail import Mail, Message
from flask_login import (current_user, LoginManager,
                             login_user, logout_user)

engine = create_engine('postgresql+psycopg2://login:login@nestit-532/gis')
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

Session = sessionmaker(bind=engine)
app = Flask(__name__)
app.secret_key = 'some key'
CORS(app)
c_u=User()
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'



mail= Mail(app)

app.config['MAIL_SERVER']='smtp.office365.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'faisal.ca@nestgroup.net'
app.config['MAIL_PASSWORD'] = ''
app.config['MAIL_USE_TLS'] = True
mail = Mail(app)

def login_required(func):
   @wraps(func)
   def decorated_view(*args, **kwargs):
      global c_u
      if request.method in EXEMPT_METHODS:
            return func(*args, **kwargs)
      elif current_app.config.get('LOGIN_DISABLED'):
            return func(*args, **kwargs)
      elif not c_u.is_authenticated:
            #return current_app.login_manager.unauthorized()
            return jsonify({"success":False,"Message":"user not logged in","logged":False})
      return func(*args, **kwargs)
   return decorated_view

@login_manager.user_loader
def load_user(user_id):
   dbSession = Session()
   user_objects = dbSession.query(User).filter(User.id==user_id).first()
   if (user_objects != None):
      dbSession.close()
      return user_objects
   return None

@app.before_request
def before_request():
   '''
   if 'username' in session:
      c="hello"
   elif request.endpoint == 'login': 
      return redirect(url_for('login'))
   else:
      return jsonify({"success":False,"Message":"user not logged in"})
   '''
@app.route('/view')
@login_required
def get_locations():
   try:
      # fetching from the database
      dbSession = Session()
      exam_objects = dbSession.query(Locationgeo.objectid,Locationgeo.userid,Locationgeo.name,ST_X(Locationgeo.shape).label('longitude'),ST_Y(Locationgeo.shape).label('latitude')).all()

      
      # transforming into JSON-serializable objects
      schema = LocationSchema(many=True)
      locations = schema.dump(exam_objects)
      #dd=exams.data
      # serializing as JSON5
      dbSession.close()
      return jsonify(locations)
   except:
      return jsonify({"success":False,"Message":"error occured"})

@app.route('/viewuserloc',  methods=['POST'])
@login_required
def get_locationsUser():
   try:
      
      jj=request.get_json()
      userviewValidate=userviewloc_check(jj)
      if userviewValidate is not None:
         return jsonify({"success":False,"Message":"Json exception"})
      
      page=jj["page"]
      total_pages=0
      ROWS_PER_PAGE=5

      dbSession = Session()  
      obj_count=0
      if(jj["search"]==""):
         obj_count = dbSession.query(Locationgeo.userid).count()
      else: 
         obj_count = dbSession.query(Locationgeo.userid).filter(Locationgeo.name.ilike(jj["search"]+'%')).count()
      
      if(obj_count < ROWS_PER_PAGE):
         total_pages=1
      else:
         total_pages=int(obj_count/ROWS_PER_PAGE)
         if((obj_count % ROWS_PER_PAGE) != 0):
            total_pages=1+total_pages

      if(page > total_pages):
         page=total_pages
      if(page < 1):
         page=1

      offset=(page-1)*ROWS_PER_PAGE
      loc_objects = None
      if(jj["search"]==""):
         loc_objects = dbSession.query(Locationgeo.objectid,Locationgeo.userid,Locationgeo.name,ST_X(Locationgeo.shape).label('longitude'),ST_Y(Locationgeo.shape).label('latitude')).offset(offset).limit(ROWS_PER_PAGE)
      else:
         loc_objects = dbSession.query(Locationgeo.objectid,Locationgeo.userid,Locationgeo.name,ST_X(Locationgeo.shape).label('longitude'),ST_Y(Locationgeo.shape).label('latitude')).filter(Locationgeo.name.ilike(jj["search"]+'%')).offset(offset).limit(ROWS_PER_PAGE)
      schema = UserLocationSchema(many=True)
      locations = schema.dump(loc_objects)

      dbSession.close()
      return jsonify({"pages":total_pages,"list":locations})
   except:
      return jsonify({"success":False,"Message":"error occured"})

@app.route('/deleteloc',  methods=['POST'])
@login_required
def delete_loc():
   try:
      jj=request.get_json()
      errors=valid_check(jj)
      if errors is not None:
         return jsonify({"success":False,"Message":"Json exception"})
      if 'id' not in jj:
         return jsonify({"success":False,"Message":"Json exception"})
      dbSession = Session()
      loc_objects = dbSession.query(Locationgeo).filter(Locationgeo.objectid==jj["id"]).first()
      if (loc_objects != None):
         dbSession.delete(loc_objects)
         dbSession.commit()
         result={"success":True,"Message":"deleted","logged":True}
         dbSession.close()
         return jsonify(result)
      else:
         result={"success":False,"Message":"ID not found","logged":True}
         dbSession.close()
         return jsonify(result)
   except:
      return jsonify({"success":False,"Message":"error occured","logged":True})

@app.route('/addloc',  methods=['POST'])
@login_required
def addloc_loc():
   try:
      rj=request.get_json()
      addlocValidate=addloc_check(rj)
      if addlocValidate is not None:
         return jsonify({"success":False,"Message":"Json exception","logged":True})
      dbSession = Session()
      
      #locString="SRID=4326;POINT("+str(rj["longitude"])+" "+str(rj["latitude"])+")"
      locStr="POINT("+str(rj["longitude"])+" "+str(rj["latitude"])+")"
      c1 = Locationgeo(userid=current_user.id,name=rj["name"],location=locStr)

      dbSession.add(c1)
      dbSession.commit()
      dbSession.close()
      return jsonify({"success":True,"Message":"Location added succesfully","logged":True})

   except:
      return jsonify({"success":False,"Message":"error occured","logged":True})

@app.route('/updateloc',  methods=['POST'])
@login_required
def updateloc_loc():
   try:
      rj=request.get_json()
      addlocValidate=updateloc_check(rj)
      if addlocValidate is not None:
         return jsonify({"success":False,"Message":"Json exception","logged":True})
      dbSession = Session()
      loc_objects = dbSession.query(Locationgeo).filter(Locationgeo.objectid==rj["id"]).first()
      if (loc_objects != None):
         loc_objects.name=rj["name"]
         #locString="SRID=4326;POINT("+str(rj["longitude"])+" "+str(rj["latitude"])+")"
         locStr="POINT("+str(rj["longitude"])+" "+str(rj["latitude"])+")"
         loc_objects.location=locStr
         dbSession.commit()
         result={"success":True,"Message":"updated","logged":True}
         dbSession.close()
         return jsonify(result)
      else:
         result={"success":False,"Message":"ID not found","logged":True}
         dbSession.close()
         return jsonify(result)
   except:
      return jsonify({"success":False,"Message":"error occured","logged":True})

@app.route('/login',  methods=['POST'])
def login():
   try:
      rj=request.get_json()
      loginValidate=login_check(rj)
      if loginValidate is not None:
         return jsonify({"success":False,"Message":"Json exception","user":"","logged":False})
      dbSession = Session()
      user_objects = dbSession.query(User).filter(User.username==rj["username"], User.password==rj["password"]).first()
      if (user_objects != None):
         schema = UserSchema(many=False)
         userDetails = schema.dump(user_objects)
         result={"success":True,"Message":"User logged in","user":userDetails,"logged":True}
         dbSession.close()
         login_user(user_objects, remember=True)
         global c_u
         c_u=copy.deepcopy(current_user)
         return jsonify(result)
      else:
         result={"success":False,"Message":"ID not found","user":"","logged":False}
         dbSession.close()
         return jsonify(result)
   except:
      return jsonify({"success":False,"Message":"error occured"})

@app.route('/logout', methods=['POST'])
def logout():
    logout_user()
    global c_u
    c_u=copy.deepcopy(current_user)
    return jsonify(**{'result': 200,
                      'logged':False,
                      'data': {'message': 'logout success'}})

@app.route('/signup',  methods=['POST'])
def signup():
   try:
      rj=request.get_json()
      signupValidate=signup_check(rj)
      if signupValidate is not None:
         return jsonify({"success":False,"Message":"Json exception","user":"","username":False})
      dbSession = Session() 
      user_objects = dbSession.query(User).filter(User.username==rj["username"]).first()
      if (user_objects != None):
         dbSession.close()
         return jsonify({"success":False,"Message":"Username already excist","username":True})
      user_objects = User(name=rj["name"],email=rj["email"],username=rj["username"],password=rj["password"])
      dbSession.add(user_objects)
      dbSession.commit()
      dbSession.close()
      return jsonify({"success":True,"Message":"User added succesfully","username":False})

   except:
      return jsonify({"success":False,"Message":"error occured","username":False})

@app.route('/user_info', methods=['POST'])
def user_info():
   global c_u
   schema = UserSchema(many=False)
   user = schema.dump(c_u)
   
   if c_u.is_authenticated:
      resp = {"result": 200,
               "logged":True,
               "data": user}
   else:
      resp = {"result": 401,
               "logged":False,
               "data": {"message": "user no login","name":"","userid":-1,"email":"","username":""}}
   return jsonify(**resp)

@app.route('/user_id', methods=['POST'])
def user_idinfo():
   global c_u
   if c_u.is_authenticated:
      resp = {"result": 200,
               "logged":True,
               "userid": c_u.id}
   else:
      resp = {"result": 401,
               "logged":False,
               "userid": -1}
   return jsonify(**resp)

@app.route('/forgot',  methods=['POST'])
def forgotPassword():
   try:
      rj=request.get_json()
      # signupValidate=signup_check(rj)
      # if signupValidate is not None:
      #    return jsonify({"success":False,"Message":"Json exception","user":"","username":False})
      dbSession = Session() 
      user_objects = dbSession.query(User).filter(User.username==rj["username"]).first()
      if (user_objects == None or user_objects.email==""):
         dbSession.close()
         return jsonify({"success":False,"Message":"Username does not excist"})
      rand_num = random_with_N_digits(6)
      cu_email=user_objects.email
      user_objects.passwordkey=rand_num
      dbSession.commit()
      dbSession.close()

      msg = Message('Password reset', sender = 'faisal.ca@nestgroup.net', recipients = [cu_email])
      msg.body = "Your password reset key is : "+ str(rand_num)
      mail.send(msg)
      return jsonify({"success":True,"Message":"Email sent succesfully"})

   except:
      return jsonify({"success":False,"Message":"error occured"})

@app.route('/passkeycheck',  methods=['POST'])
def passkey():
   try:
      rj=request.get_json()
      # loginValidate=login_check(rj)
      # if loginValidate is not None:
      #    return jsonify({"success":False,"Message":"Json exception","user":"","logged":False})
      dbSession = Session()
      user_objects = dbSession.query(User).filter(User.username==rj["username"], User.passwordkey==rj["passwordkey"]).first()
      if (user_objects != None):
         schema = UserSchema(many=False)
         userDetails = schema.dump(user_objects)
         result={"success":True,"Message":"Username found","user":userDetails}
         dbSession.close()
         return jsonify(result)
      else:
         result={"success":False,"Message":"Incorrect OTP","user":""}
         dbSession.close()
         return jsonify(result)
   except:
      return jsonify({"success":False,"Message":"error occured"})

@app.route('/resetpass',  methods=['POST'])
def resetPass():
   try:
      rj=request.get_json()
      # signupValidate=signup_check(rj)
      # if signupValidate is not None:
      #    return jsonify({"success":False,"Message":"Json exception","user":"","username":False})
      dbSession = Session() 
      user_objects = dbSession.query(User).filter(User.username==rj["username"]).first()
      if (user_objects.email == None or user_objects.email==""):
         dbSession.close()
         return jsonify({"success":False,"Message":"username does not excist"})
      
      user_objects.password=rj["password"]
      dbSession.commit()
      dbSession.close()

      return jsonify({"success":True,"Message":"Password changed succesfully"})

   except:
      return jsonify({"success":False,"Message":"error occured","username":False})

@app.route('/')
def hi_world():
   msg = Message('Hello', sender = 'faisal.ca@nestgroup.net', recipients = ['praveen.roy@nestgroup.net'])
   msg.body = "Hello Flask message sent from Flask-Mail"
   mail.send(msg)
   return 'Hi'

def random_with_N_digits(n):
    range_start = 10**(n-1)
    range_end = (10**n)-1
    return randint(range_start, range_end)

if __name__ == '__main__':
   app.run(debug = True)