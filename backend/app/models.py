from sqlalchemy import Integer, Boolean, String ,Column, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base
from datetime import datetime

class User(Base):
    __tablename__ = 'Users'
    
    UserID = Column(Integer, primary_key=True, index=True)
    login = Column(String(100), index=True, unique=True)
    name  = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    passwordHash = Column(String(100))
    surname = Column(String(100))
    creationDate = Column(String(100))
    members = relationship("GroupMembers", back_populates="user")

class Group(Base):
    __tablename__ = 'Groups'
    
    GroupID = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    description = Column(String(255), nullable=True)
    creationDate = Column(DateTime, default=datetime.now())
    join_code = Column(String(8), unique=True, index=True)  

    members = relationship("GroupMembers", back_populates="group")


class GroupMembers(Base):
    __tablename__ = 'GroupMembers'
    
    id = Column(Integer, primary_key=True, index=True)
    UserID = Column(Integer, ForeignKey("Users.UserID"))
    GroupID = Column(Integer, ForeignKey("Groups.GroupID"))

    user = relationship("User", back_populates="members")
    group = relationship("Group", back_populates="members")