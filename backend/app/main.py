import os
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
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
import app.auth as auth 
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import timedelta

class UserBase(BaseModel):
    login:str
    name:str
    surname:str
    email:str
    password:str
    
class GroupBase(BaseModel):
    name:str
    description:str
    memebers:List[int]
    join_code:str




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
    expire = datetime.utcnow() + expires_delta if expires_delta else timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



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

def generate_join_code(db: Session):
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        if not db.query(models.Group).filter_by(join_code=code).first():
            return code


@app.post("/register",status_code=status.HTTP_201_CREATED)
async def register(user: UserBase,db: db_dependency):
    db_user = models.User(login=user.login,name=user.name,surname=user.surname,email=user.email,passwordHash=bcrypt_context.hash(user.password),creationDate=datetime.datetime.now().strftime("%Y-%m-%d")) 
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"db_user":db_user}

class LoginRequest(BaseModel):
    login:str
    password:str

@app.post("/login",status_code=status.HTTP_200_OK)
async def login(request:LoginRequest, db:db_dependency):
    print("ciota")
    user = db.query(models.User).filter(models.User.login==request.login).first()
    if not user:
        raise HTTPException(status_code=404,detail="Login is incorrect")
    if not  bcrypt_context.verify(request.password,user.passwordHash):
        raise HTTPException(status_code=404,detail="password is incorrect")
    return {"message": "Login successful", "user_id": user.UserID}
# Teraz zamiast zwracać jakis message zwracamy token. Pózniej chyba po froncie będę mógł odczytać sobie wartość ID  i mam esse

##TODO USERNAME NA LOGIN 

# @app.post("/create_group",status_code=status.HTTP_201_CREATED)
# async def create_group(group:GroupBase, user_id:int, db:db_dependency):
#     user = db.query(models.User).filter(models.User.UserID==user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User_id not found")
#     join_code = generate_join_code(db)

#     new_group = models.Group(
#         name=group.name,
#         description=group.description,
#         join_code=join_code
#     )
#     db.add(new_group)
#     db.commit()
#     db.refresh(new_group)
    
#     membership = models.GroupMembers(UserID=user_id, GroupID=new_group.GroupID)
#     db.add(membership)
#     db.commit()
#     return {"group_id": new_group.GroupID, "name": new_group.name, "members": [user_id],"token":token}



##TODO USERNAME NA LOGIN 
# @app.get("/get_join_code", status_code=status.HTTP_200_OK)
# async def get_join_code(group_id:int,db:db_dependency):
#     group = db.query(models.Group).filter(models.Group.GroupID==group_id).first()
#     if not group:
#         raise HTTPException(status_code=404, detail="Group not found")
#     return {"join_code": group.join_code}


##TODO USERNAME NA LOGIN 

# @app.put("/join_group_by_code", status_code=status.HTTP_201_CREATED)
# async def join_group_by_code(join_code:str,user_id: int, db:db_dependency):
#     group = db.query(models.Group).filter(models.Group.join_code==join_code).first()
#     user = db.query(models.User).filter(models.User.UserID==user_id).first()
#     if not group:
#         raise HTTPException(status_code=404, detail="The group with this join code does not exist")
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     existing_member = (
#         db.query(models.GroupMembers)
#         .filter(models.GroupMembers.UserID == user_id, models.GroupMembers.GroupID == group.GroupID)
#         .first()
#     )
#     if existing_member:
#         raise HTTPException(status_code=400, detail="User is already a member of this group")
#     new_member = models.GroupMembers(UserID=user_id, GroupID=group.GroupID)
#     db.add(new_member)
#     db.commit()
#     db.refresh(new_member)
#     return {"message": "User successfully added to the group"}