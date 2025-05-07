from pydantic import BaseModel, ConfigDict # Thêm ConfigDict
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

    model_config = ConfigDict(from_attributes=True) # Đã sửa


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

    model_config = ConfigDict(from_attributes=True) # Đã sửa