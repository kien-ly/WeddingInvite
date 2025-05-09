from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse # Thêm FileResponse cho favicon
from sqlalchemy.orm import Session
from typing import List
import os

from . import crud, models, schemas # Đảm bảo các file này tồn tại và đúng
from .database import SessionLocal, engine, Base

# Tạo bảng trong DB nếu chưa có (nên dùng Alembic cho production)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Error creating database tables: {e}")
    # Cân nhắc việc thoát nếu không tạo được bảng, tùy theo logic ứng dụng
    # import sys
    # sys.exit(1)


app = FastAPI(title="Wedding Invitation API & Frontend")

# Dependency để lấy DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Cấu hình CORS ---
# Quan trọng nếu bạn tách frontend và backend ra các port/domain khác nhau khi test
# Hoặc nếu bạn dùng một web server riêng cho frontend (Cách 2 đã thảo luận)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cho phép tất cả cho dev, nên giới hạn trong production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---
@app.post("/api/wishes/", response_model=schemas.Wish, tags=["Wishes"])
def create_new_wish(wish: schemas.WishCreate, db: Session = Depends(get_db)):
    return crud.create_wish(db=db, wish=wish)

@app.get("/api/wishes/", response_model=List[schemas.Wish], tags=["Wishes"])
def read_all_wishes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    wishes = crud.get_wishes(db, skip=skip, limit=limit)
    return wishes

@app.post("/api/confirmations/", response_model=schemas.Confirmation, tags=["Confirmations"])
def create_new_confirmation(confirmation: schemas.ConfirmationCreate, db: Session = Depends(get_db)):
    return crud.create_confirmation(db=db, confirmation=confirmation)

@app.get("/api/confirmations/", response_model=List[schemas.Confirmation], tags=["Confirmations"])
def read_all_confirmations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Cân nhắc bảo mật endpoint này trong production
    confirmations = crud.get_confirmations(db, skip=skip, limit=limit)
    return confirmations

@app.get("/api", tags=["API Info"])
def read_api_root():
    return {"message": "Welcome to the Wedding API!"}

# --- Phục vụ Frontend ---
# Đường dẫn đến thư mục gốc của dự án (wedding_project)
# Giả sử file main.py nằm trong wedding_project/backend/app/
PROJECT_ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FRONTEND_DIR = os.path.join(PROJECT_ROOT_DIR, "frontend")

# Kiểm tra thư mục frontend
if not os.path.isdir(FRONTEND_DIR):
    print(f"FATAL ERROR: Frontend directory not found at {FRONTEND_DIR}")
    print("Please ensure your project structure is correct: wedding_project/frontend")
    # Có thể thoát ở đây nếu frontend là bắt buộc
    # import sys
    # sys.exit(1)
else:
    print(f"Serving frontend from: {FRONTEND_DIR}")

    # Mount static files cho các thư mục con
    for subdir in ["css", "js", "images"]:
        path = f"/{subdir}"
        directory = os.path.join(FRONTEND_DIR, subdir)
        if os.path.isdir(directory):
            app.mount(path, StaticFiles(directory=directory), name=subdir)
        else:
            print(f"Warning: Frontend subdirectory '{subdir}' not found at {directory}")

    # Route để phục vụ index.html
    @app.get("/", response_class=HTMLResponse, include_in_schema=False)
    async def serve_index_html():
        index_html_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_html_path):
            with open(index_html_path, "r", encoding="utf-8") as f:
                return HTMLResponse(content=f.read())
        return HTMLResponse(content="<h1>Error: index.html not found.</h1>", status_code=404)

    # Route để phục vụ favicon.ico
    @app.get("/favicon.ico", include_in_schema=False)
    async def favicon():
        favicon_path = os.path.join(FRONTEND_DIR, "favicon.ico")
        if os.path.exists(favicon_path):
            return FileResponse(favicon_path)
        # Trả về 204 No Content nếu không có favicon để tránh lỗi 404 trong log trình duyệt
        return HTMLResponse(content="", status_code=204)

print("FastAPI application initialized.")
if not os.path.isdir(FRONTEND_DIR):
    print("WARNING: Frontend will not be served as directory is missing.")