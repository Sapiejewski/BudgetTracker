from fastapi import FastAPI
from app.api.endpoints import login,register,GroupsInfo
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:8081",  # For development on localhost
    "http://127.0.0.1:8081",  # Another common development address
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include the login router
app.include_router(login.router)
app.include_router(GroupsInfo.router)
app.include_router(register.router)
