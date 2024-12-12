# import os
# from jose import jwt,JWTError
# from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
# from passlib.context import CryptContext
# from app.models import User
# from datetime import  timedelta,datetime
# from fastapi import APIRouter, Depends, HTTPException, status
# from environment import load_environment
# from typing import Annotated
# from pydantic import BaseModel
# from sqlalchemy.orm import Session

# load_environment()
# router = APIRouter(prefix="/auth",tags=["auth"])

# ALGORITHM = os.getenv("ALGORITHM")
# SECRET_KEY = os.getenv("SECRET_KEY")
# bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# oauth2_bearer = OAuth2PasswordBearer(tokenURL="auth/token")

# class CreateUserRequest(BaseModel):
#     username:str
#     password:str
    
# class Token(BaseModel):
#     access_token: str
#     token_type: str
    
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
# db_dependency = Annotated[Session,Depends(get_db())]


# def autheticate_user(username:str, password:str,db):
#     user = db.query(models.User).filter(models.User.username == username).first()
#     if not user:
#         return False
#     if not bcrypt_context.verify(password,user.password):
#         return False
#     return user

# @router.post("/",status_code=status.HTTP_201_CREATED)
# async def create_user(db:db_dependency,create_user_request: CreateUserRequest):
#     User = models.User(username=create_user_request.username,password=bcrypt_context.hash(create_user_request.password))
#     db.add(User)
#     db.commit()

# @router.post("/token", response_model=Token)
# async def login_for_access_token(db: db_dependency, form_data: Annotated[OAuth2PasswordRequestForm,Depends()]):
#     user = autheticate_user(form_data.username,form_data.password,db)
#     if not user:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Incorrect username or password")
#     token = create_access_token(user.username,user.id,timedelta(minutes=20))
#     return {"access_token": token, "token_type": "bearer"}

# def create_access_token(username:str, user_id:int, expires_delta:timedelta):
#     expire = datetime.utcnow() + expires_delta
#     encode = {"sub": username, "user_id": user_id, "exp":expire}
#     print(expire)
#     return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

# async def get_current_user(token:Annotated[str,Depends(oauth2_bearer)]):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username:str = payload.get('sub')
#         user_id:int = payload.get('user_id')
#         if username is None or user_id is None:
#             raise HTTPException(status_code=400, detail="Invalid token")
#     except JWTError:
#         raise HTTPException(status_code=400, detail="Invalid token")
#     return username