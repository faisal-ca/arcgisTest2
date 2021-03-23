# coding: utf-8
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.sql.sqltypes import NullType
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

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


class Poi(Base):
    __tablename__ = 'poi'
    __table_args__ = {'schema': 'login'}

    objectid = Column(Integer, primary_key=True, unique=True)
    name = Column(String(50))
    userid = Column(ForeignKey('login.users.id'))
    shape = Column(NullType, index=True)

    user = relationship('User')
