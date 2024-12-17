import os
import datetime
import random
import string
from fastapi import FastAPI, HTTPException,Depends, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel,Field,validator, EmailStr
from typing import Annotated,List
import app.models as models
from app.db import engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
import app.auth as auth 
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import timedelta, timezone,datetime

class UserBase(BaseModel):
    login:str= Field(..., min_length=3, max_length=50, description="User login") 
    name:str = Field(..., min_length=3, max_length=50, description="User name") 
    surname:str =Field(..., min_length=3, max_length=50, description="User surname") 
    email:EmailStr 
    password:str = Field(..., min_length=3, max_length=50, description="User password") 
    
class GroupBase(BaseModel):
    name:str
    description:str
    memebers:List[int]
    join_code:str

class LoginRequest(BaseModel):
    login: str = Field(..., min_length=3, max_length=50, description="User login")  
    password: str = Field(..., min_length=5, max_length=100, description="User password")



SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30


app = FastAPI()
app.include_router(auth.router)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
models.Base.metadata.create_all(bind=engine)

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return bcrypt_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt



def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
db_dependency = Annotated[Session,Depends(get_db)]
Token= Annotated[str, Depends(oauth2_scheme)]

origins = [
    "http://localhost:8081",  
    "http://127.0.0.1:8081",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_current_user(token: Token, db: db_dependency):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        user = db.query(models.User).filter(models.User.UserID == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
def generate_join_code(db: Session):
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        if not db.query(models.Group).filter_by(join_code=code).first():
            return code


# TODO tu trzeba jeszcze zrobić walidację 
@app.post("/register",status_code=status.HTTP_201_CREATED)
async def register(user: UserBase,db: db_dependency):
    existing_user = db.query(models.User).filter((models.User.login == user.login) | (models.User.email == user.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this login or email already exists."
        )
    db_user = models.User(login=user.login,name=user.name,surname=user.surname,email=user.email,passwordHash=bcrypt_context.hash(user.password),creationDate=datetime.datetime.now().strftime("%Y-%m-%d")) 
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"db_user":db_user}


@app.post("/login",status_code=status.HTTP_200_OK)
async def login(request:LoginRequest, db:db_dependency):
    user = db.query(models.User).filter(models.User.login==request.login).first()
    if not user:
        raise HTTPException(status_code=404,detail="Login is incorrect")
    if not bcrypt_context.verify(request.password,user.passwordHash):
        raise HTTPException(status_code=404,detail="password is incorrect")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.login, "user_id": user.UserID}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/create_group", status_code=status.HTTP_201_CREATED)
async def create_group(group: GroupBase, token: Token, db: db_dependency):
    current_user = get_current_user(token, db)
    join_code = generate_join_code(db)
    new_group = models.Group(
        name=group.name,
        description=group.description,
        join_code=join_code
    )
    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    membership = models.GroupMembers(UserID=current_user.UserID, GroupID=new_group.GroupID)
    db.add(membership)
    db.commit()
    return {"group_id": new_group.GroupID, "name": new_group.name, "members": [current_user.UserID]}



##TODO USERNAME NA LOGIN 

@app.get("/get_join_code", status_code=status.HTTP_200_OK)
async def get_join_code(group_id: int, token: Token, db: db_dependency):
    current_user = get_current_user(token, db)
    group = db.query(models.Group).filter(models.Group.GroupID == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return {"join_code": group.join_code}


@app.put("/join_group_by_code", status_code=status.HTTP_201_CREATED)
async def join_group_by_code(join_code: str, token: Token, db: db_dependency):
    current_user = get_current_user(token, db)
    group = db.query(models.Group).filter(models.Group.join_code == join_code).first()
    if not group:
        raise HTTPException(
            status_code=404,
            detail="The group with this join code does not exist"
        )
    existing_member = (
        db.query(models.GroupMembers)
        .filter(
            models.GroupMembers.UserID == current_user.UserID,
            models.GroupMembers.GroupID == group.GroupID
        )
        .first()
    )
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member of this group")
    new_member = models.GroupMembers(UserID=current_user.UserID, GroupID=group.GroupID)
    db.add(new_member)
    db.commit()
    return {"message": "User successfully added to the group"}