from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import crud, models, schemas
from .database import SessionLocal, engine, Base

# Tạo các bảng trong database (chỉ chạy 1 lần khi khởi động nếu bảng chưa có)
# Trong môi trường production, nên dùng Alembic migrations
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wedding API")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Endpoints cho Wishes
@app.post("/api/wishes/", response_model=schemas.Wish, tags=["Wishes"])
def create_new_wish(wish: schemas.WishCreate, db: Session = Depends(get_db)):
    return crud.create_wish(db=db, wish=wish)

@app.get("/api/wishes/", response_model=List[schemas.Wish], tags=["Wishes"])
def read_all_wishes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    wishes = crud.get_wishes(db, skip=skip, limit=limit)
    return wishes

# API Endpoints cho Confirmations
@app.post("/api/confirmations/", response_model=schemas.Confirmation, tags=["Confirmations"])
def create_new_confirmation(confirmation: schemas.ConfirmationCreate, db: Session = Depends(get_db)):
    return crud.create_confirmation(db=db, confirmation=confirmation)

@app.get("/api/confirmations/", response_model=List[schemas.Confirmation], tags=["Confirmations"])
def read_all_confirmations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Chú ý: Endpoint này có thể cần bảo vệ (chỉ admin mới xem được)
    confirmations = crud.get_confirmations(db, skip=skip, limit=limit)
    return confirmations

# Endpoint gốc để kiểm tra API hoạt động
@app.get("/api")
def read_root():
    return {"message": "Welcome to the Wedding API!"}

# Cấu hình CORS để frontend có thể gọi API từ domain khác (localhost:xxxx)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cho phép tất cả origins (thay bằng domain frontend của bạn khi deploy)
    allow_credentials=True,
    allow_methods=["*"], # Cho phép tất cả các method
    allow_headers=["*"], # Cho phép tất cả các header
)