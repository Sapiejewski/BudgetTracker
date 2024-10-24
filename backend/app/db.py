import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.engine import URL
from environment import load_environment

load_environment()
USERNAME = os.getenv("USERNAMEDB")
PASSWORD = os.getenv("PASSWORD")
HOST=os.getenv("HOST")
DATABASE=os.getenv("DATABASE")
DRIVER = os.getenv("DRIVER")

CONNECTION_URL = URL.create(
    "mssql+pyodbc",
    username=USERNAME,
    password=PASSWORD,
    host=HOST,
    database=DATABASE,
    query={
            "driver": DRIVER,
            "TrustServerCertificate": "yes",
})

engine  = create_engine(CONNECTION_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=True,bind=engine)

Base = declarative_base()