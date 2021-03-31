# coding: utf-8
from sqlalchemy import Column, Float, ForeignKey, Integer, MetaData, String
from sqlalchemy.orm import relationship
from sqlalchemy.schema import FetchedValue
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()
metadata = Base.metadata



class Bookmark(Base):
    __tablename__ = 'Bookmarks'
    __table_args__ = {'schema': 'login'}

    Id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    Xmin = Column(Float(53), nullable=False)
    Xmax = Column(Float(53), nullable=False)
    Ymin = Column(Float(53), nullable=False)
    Ymax = Column(Float(53), nullable=False)
    Uid = Column(ForeignKey('login.users.id'), nullable=False)

    user = relationship('User', primaryjoin='Bookmark.Uid == User.id', backref='bookmarks')



class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'login'}

    id = Column(Integer, primary_key=True, server_default=FetchedValue())
    name = Column(String, nullable=False)
    email = Column(String)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
