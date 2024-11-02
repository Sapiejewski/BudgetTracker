import datetime
import random
import string
from fastapi import FastAPI, HTTPException,Depends, status
from pydantic import BaseModel
from typing import Annotated,List
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
    
class GroupBase(BaseModel):
    name:str
    description:str
    memebers:List[int]
    join_code:str

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
db_dependency = Annotated[Session,Depends(get_db)]
def generate_join_code(db: Session):
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        if not db.query(models.Group).filter_by(join_code=code).first():
            return code

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

@app.post("/create_group",status_code=status.HTTP_201_CREATED)
async def create_group(group:GroupBase, user_id:int, db:db_dependency):
    user = db.query(models.User).filter(models.User.UserID==user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User_id not found")
    join_code = generate_join_code(db)

    new_group = models.Group(
        name=group.name,
        description=group.description,
        join_code=join_code
    )
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    
    membership = models.GroupMembers(UserID=user_id, GroupID=new_group.GroupID)
    db.add(membership)
    db.commit()
    return {"group_id": new_group.GroupID, "name": new_group.name, "members": [user_id]}
    
@app.get("/get_join_code", status_code=status.HTTP_200_OK)
async def get_join_code(group_id:int,db:db_dependency):
    group = db.query(models.Group).filter(models.Group.GroupID==group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return {"join_code": group.join_code}

@app.put("/join_group_by_code", status_code=status.HTTP_201_CREATED)
async def join_group_by_code(join_code:str,user_id: int, db:db_dependency):
    group = db.query(models.Group).filter(models.Group.join_code==join_code).first()
    user = db.query(models.User).filter(models.User.UserID==user_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="The group with this join code does not exist")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    existing_member = (
        db.query(models.GroupMembers)
        .filter(models.GroupMembers.UserID == user_id, models.GroupMembers.GroupID == group.GroupID)
        .first()
    )
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member of this group")
    new_member = models.GroupMembers(UserID=user_id, GroupID=group.GroupID)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return {"message": "User successfully added to the group"}