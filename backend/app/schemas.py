from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --- Wish Schemas ---
class WishBase(BaseModel):
    name: str
    wish_text: str

class WishCreate(WishBase):
    pass

class Wish(WishBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True # Cho phép Pydantic đọc dữ liệu từ model SQLAlchemy

# --- Confirmation Schemas ---
class ConfirmationBase(BaseModel):
    name: str
    attending: bool
    guests_count: int = 1
    message: Optional[str] = None

class ConfirmationCreate(ConfirmationBase):
    pass

class Confirmation(ConfirmationBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True