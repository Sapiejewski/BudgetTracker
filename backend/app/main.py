import datetime
from fastapi import FastAPI, HTTPException,Depends, status
from pydantic import BaseModel
from typing import Annotated
import app.models as models
from app.db import engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
models.Base.metadata.create_all(bind=engine)


class UserBase(BaseModel):
    username:str
    name:str
    email:str
    password:str


def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
db_dependency = Annotated[Session,Depends(get_db)]

origins = [
    "http://localhost:8081",  
    "http://127.0.0.1:8081",  
]

app.add_middleware(
    CORSMiddleware,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/register",status_code=status.HTTP_201_CREATED)
async def register(user: UserBase, db: db_dependency):
    db_user = models.User(username=user.username,name=user.name,email=user.email,passwordHash=user.password,creationDate=datetime.datetime.now().strftime("%Y-%m-%d")) 
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/login",status_code=status.HTTP_200_OK)
async def login(username :str, password:str,db:db_dependency):
    user = db.query(models.User).filter(models.User.username==username ).first()
    if not user:
        raise HTTPException(status_code=404,detail="Login is incorrect")
    if  password != user.passwordHash:
        raise HTTPException(status_code=404,detail="password is incorrect")
    return {"message": "Login successful", "user_id": user.UserID}