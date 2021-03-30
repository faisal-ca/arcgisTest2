# coding: utf-8
from sqlalchemy import Column, ForeignKey, Integer, String
from geoalchemy2.types import Geometry
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from marshmallow import Schema, fields

Base = declarative_base()
metadata = Base.metadata


class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'login'}

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    passwordkey = Column(Integer)

    def __init__(self, name=None, email=None, username=None,password=None):
        self.email = email
        self.name = name
        self.username = username
        self.password=password

    def to_json(self):
        return {"name": self.name,
                "email": self.email}
    def is_authenticated(self):
        return True
    def is_active(self):
        return True
    def is_anonymous(self):
        return False
    def get_id(self):
        return str(self.id)

   


class Locationgeo(Base):
    # __tablename__ = 'point_location'
    # __table_args__ = {'schema': 'login'}

    # id = Column(Integer, primary_key=True)
    # userid = Column(ForeignKey('login.users.id'))
    # name = Column(String(128))
    # location = Column(Geometry(from_text='ST_GeomFromEWKT', name='geometry'))

    __tablename__ = 'poi'
    __table_args__ = {'schema': 'login'}

    objectid = Column(Integer, primary_key=True, unique=True)
    name = Column(String(50))
    userid = Column(ForeignKey('login.users.id'))
    shape = Column(None, index=True)

    user = relationship('User')

    def __init__(self, userid, name, location,id=None):
        self.userid = userid
        self.name = name
        self.location = location
        self.id=id

class LocationSchema(Schema):
    ID = fields.Number()
    userid = fields.Number()
    name = fields.Str()
    location = fields.Str()

class UserSchema(Schema):
    id = fields.Number()
    name = fields.Str()
    email = fields.Str()
    username = fields.Str()
    password = fields.Str()

class UserLocationSchema(Schema):
    objectid = fields.Number()
    userid = fields.Number()
    name = fields.Str()
    longitude = fields.Number()
    latitude = fields.Number() 

        