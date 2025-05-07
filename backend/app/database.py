from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv() # Tải biến môi trường từ file .env

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# print (f"Connecting to database: {SQLALCHEMY_DATABASE_URL}")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables. Please create a .env file.")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency để lấy DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()