from fastapi import APIRouter
from pydantic import BaseModel

class RegisterUser(BaseModel):
    email:str
    name: str
    surname:str
    password:str

router = APIRouter()

@router.post("/register")
async def login(register:RegisterUser):
    print(register.email)
    return {"register": True}
