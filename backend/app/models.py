from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from .database import Base

class Wish(Base):
    __tablename__ = "wishes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    wish_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Confirmation(Base):
    __tablename__ = "confirmations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    attending = Column(Boolean, default=True)
    guests_count = Column(Integer, default=1)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())