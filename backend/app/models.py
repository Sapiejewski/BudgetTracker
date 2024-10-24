from sqlalchemy import Integer, Boolean,String,Column
from app.db import Base

class User(Base):
    __tablename__ = 'Users'
    
    UserID = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), index=True, unique=True)
    name  = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    passwordHash = Column(String(100))
    creationDate = Column(String(100))