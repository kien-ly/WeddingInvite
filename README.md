# Dự án Web Mời Cưới

Trang web mời cưới đơn giản với backend FastAPI (Python) và database PostgreSQL. Frontend được viết bằng HTML, CSS, và JavaScript. Backend được cấu hình để phục vụ cả API và các file tĩnh của frontend.

## Cấu trúc thư mục
```
wedding_project/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI app, routers, phục vụ frontend
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── crud.py         # CRUD functions
│   │   └── database.py     # Database setup
│   ├── .env_example        # File mẫu biến môi trường
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   ├── js/script.js
│   ├── images/             # Chứa hình ảnh của bạn
│   └── (tùy chọn) favicon.ico
├── .gitignore
├── README.md
└── setup_and_run.sh      # Script cài đặt và chạy trên EC2 Ubuntu
```

## Chuẩn bị (Cho cả Local và EC2)

1.  **Thay thế placeholder thông tin:**
    *   Trong `frontend/index.html`: Thay thế tất cả `[Tên Chú Rể]`, `[Tên Cô Dâu]`, `[Ngày Tháng Năm]`, `[Địa Điểm]`, các link Google Maps, v.v.
    *   Trong `frontend/js/script.js`: **QUAN TRỌNG:** Cập nhật biến `weddingDateTimeString` (gần đầu file và trong `DOMContentLoaded`) thành ngày giờ cưới thực tế của bạn (định dạng `YYYY-MM-DDTHH:MM:SS`).
    *   Trong `frontend/images/`: Thay thế tất cả các ảnh `placeholder_*.jpg` bằng ảnh thật của bạn. Tham khảo mục "Hình Ảnh Cần Thay Thế" ở cuối README này.

2.  **(Chỉ cho EC2) Cập nhật `setup_and_run.sh`:**
    *   Mở file `setup_and_run.sh`.
    *   Thay thế `<your-git-repository-url-here>` bằng URL Git repo của bạn (nếu bạn dùng script để clone).
    *   Xem xét và thay đổi `DB_PASS` thành một mật khẩu mạnh hơn.

## Chạy Dự Án Trên Localhost (Ubuntu/Linux)

Cách này sẽ chạy toàn bộ trang web (frontend và backend) trên một port duy nhất từ máy local của bạn.

**Yêu cầu trên Localhost:**
*   Python 3.8+ và `pip`
*   `python3-venv`
*   PostgreSQL Server (đã cài đặt và đang chạy)
*   `libpq-dev` (thư viện phát triển PostgreSQL): `sudo apt install libpq-dev`

**Các bước thực hiện:**

1.  **Clone Repository (Nếu chưa có):**
    ```bash
    git clone <your-repository-url> wedding_project
    cd wedding_project
    ```

2.  **Thiết lập PostgreSQL (Nếu chưa làm):**
    *   Truy cập psql: `sudo -u postgres psql`
    *   Tạo user và database:
        ```sql
        CREATE USER wedding_user WITH PASSWORD 'your_local_db_password'; -- Đặt mật khẩu của bạn
        CREATE DATABASE wedding_db OWNER wedding_user;
        GRANT ALL PRIVILEGES ON DATABASE wedding_db TO wedding_user;
        \q
        ```

3.  **Cấu hình Backend:**
    *   Di chuyển vào thư mục backend: `cd backend`
    *   Tạo và kích hoạt môi trường ảo:
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    *   Cài đặt thư viện Python:
        ```bash
        pip install -r requirements.txt
        ```
    *   Tạo file `.env` từ `.env_example`:
        ```bash
        cp .env_example .env
        ```
    *   Mở file `.env` và chỉnh sửa `DATABASE_URL`:
        ```env
        DATABASE_URL=postgresql+psycopg2://wedding_user:your_local_db_password@localhost:5432/wedding_db
        ```
        (Thay `your_local_db_password` bằng mật khẩu bạn đã tạo ở trên).

4.  **Chạy Server FastAPI/Uvicorn:**
    *   Vẫn đang ở trong thư mục `backend` và môi trường ảo đã được kích hoạt:
        ```bash
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
        ```
        Server sẽ phục vụ cả API và frontend.

5.  **Truy cập Trang Web:**
    *   Mở trình duyệt và truy cập: `http://localhost:8000` hoặc `http://127.0.0.1:8000`
    *   API docs (Swagger): `http://localhost:8000/docs`

6.  **Dừng Server:** Nhấn `Ctrl+C` trong terminal đang chạy Uvicorn. Để thoát môi trường ảo: `deactivate`.

## Triển Khai Lên EC2 Ubuntu (Sử dụng `setup_and_run.sh`)

Script `setup_and_run.sh` được thiết kế để tự động hóa việc cài đặt trên một EC2 Ubuntu mới.

**Yêu cầu trên EC2:**
*   Một EC2 instance Ubuntu mới (ví dụ: t2.micro, t3.small).
*   Security Group của EC2 **phải cho phép inbound traffic trên port 80 (HTTP)** từ `0.0.0.0/0`.
*   Bạn có quyền `sudo` trên instance.

**Các bước thực hiện trên EC2:**

1.  **SSH vào EC2 instance của bạn.**

2.  **Cài đặt Git (nếu chưa có):**
    ```bash
    sudo apt update
    sudo apt install -y git
    ```

3.  **Clone Repository:**
    ```bash
    git clone <your-updated-repository-url> wedding_project # Đảm bảo repo đã có các file mới nhất
    cd wedding_project
    ```

4.  **Cấp quyền thực thi cho script:**
    ```bash
    chmod +x setup_and_run.sh
    ```

5.  **Chạy script với `sudo`:**
    ```bash
    sudo ./setup_and_run.sh
   ```
    *   Script sẽ cài đặt Python, PostgreSQL, Nginx, thiết lập database, môi trường Python, cấu hình Nginx, và khởi chạy backend.
    *   Bạn có thể được hỏi về tên miền (để trống nếu muốn dùng IP public của EC2).

6.  **Theo dõi output của script.** Nếu không có lỗi nghiêm trọng, script sẽ thông báo URL để truy cập trang web.

7.  **Truy cập trang web** bằng IP public của EC2 hoặc domain bạn đã cấu hình.

**Gỡ lỗi trên EC2:**
*   **Log Nginx:** `/var/log/nginx/access.log` và `/var/log/nginx/error.log`
*   **Log Uvicorn/Backend:** `backend/uvicorn.log` (trong thư mục dự án)
*   **Trạng thái Nginx:** `sudo systemctl status nginx`
*   **Trạng thái Uvicorn (PID):** `cat backend/uvicorn.pid` (trong thư mục dự án), rồi `ps -p <PID>`

## API Endpoints (Backend)

*   `POST /api/wishes/`: Tạo lời chúc mới.
*   `GET /api/wishes/`: Lấy danh sách tất cả lời chúc.
*   `POST /api/confirmations/`: Tạo xác nhận tham dự mới.
*   `GET /api/confirmations/`: Lấy danh sách tất cả xác nhận (cân nhắc bảo mật).
*   `GET /api/docs`: Giao diện Swagger UI để test API.
*   `GET /api/redoc`: Giao diện ReDoc để xem tài liệu API.

## Góp ý và Phát triển thêm

*   Cải thiện giao diện người dùng (CSS, layout).
*   Thêm xác thực cho các endpoint nhạy cảm (ví dụ: xem danh sách confirm).
*   Sử dụng Alembic để quản lý database migrations.
*   Triển khai dự án lên một server (ví dụ: Heroku, Docker, VPS).
*   Thêm các tính năng khác như album ảnh, câu chuyện tình yêu, bản đồ...



## Hình Ảnh Cần Thay Thế

Để trang web hiển thị đúng và đẹp mắt, bạn cần chuẩn bị và thay thế các hình ảnh placeholder sau đây. Các hình ảnh này nằm trong thư mục `frontend/images/`.

1.  **Ảnh Nền Hero Section:**
    *   Tên file trong code: `../images/placeholder_hero_bg.jpg` (trong `style.css`)
    *   Mục đích: Ảnh nền lớn, ấn tượng cho phần mở đầu trang.
    *   Gợi ý: Ảnh cặp đôi, ảnh phong cảnh lãng mạn. Kích thước lớn, tỷ lệ ngang (ví dụ: 1920x1080px).

2.  **Ảnh Chú Rể:**
    *   Tên file trong code: `images/placeholder_groom.jpg` (trong `index.html`)
    *   Mục đích: Ảnh chân dung hoặc bán thân của chú rể.
    *   Gợi ý: Ảnh vuông hoặc gần vuông (ví dụ: 400x400px).

3.  **Ảnh Cô Dâu:**
    *   Tên file trong code: `images/placeholder_bride.jpg` (trong `index.html`)
    *   Mục đích: Ảnh chân dung hoặc bán thân của cô dâu.
    *   Gợi ý: Ảnh vuông hoặc gần vuông (ví dụ: 400x400px).

4.  **Ảnh Câu Chuyện Tình Yêu (Ví dụ 3 ảnh):**
    *   Tên file trong code:
        *   `images/placeholder_story_1.jpg`
        *   `images/placeholder_story_2.jpg`
        *   `images/placeholder_story_3.jpg`
    *   Mục đích: Hình ảnh minh họa cho các mốc kỷ niệm trong câu chuyện tình yêu.
    *   Gợi ý: Kích thước vừa phải, có thể là ảnh ngang hoặc vuông (ví dụ: 600x400px hoặc 500x500px).

5.  **Ảnh Lễ Thành Hôn (Event):**
    *   Tên file trong code: `images/placeholder_ceremony.jpg`
    *   Mục đích: Hình ảnh minh họa cho địa điểm hoặc không khí lễ thành hôn.
    *   Gợi ý: Ảnh ngang, (ví dụ: 400x250px).

6.  **Ảnh Tiệc Cưới (Event):**
    *   Tên file trong code: `images/placeholder_reception.jpg`
    *   Mục đích: Hình ảnh minh họa cho địa điểm hoặc không khí tiệc cưới.
    *   Gợi ý: Ảnh ngang, (ví dụ: 400x250px).

7.  **Ảnh Album Cưới (Gallery - Ví dụ 4 ảnh):**
    *   Tên file trong code:
        *   `images/placeholder_gallery_1.jpg`
        *   `images/placeholder_gallery_2.jpg`
        *   `images/placeholder_gallery_3.jpg`
        *   `images/placeholder_gallery_4.jpg`
        *   (Bạn có thể thêm nhiều ảnh hơn)
    *   Mục đích: Các ảnh đẹp trong album cưới.
    *   Gợi ý: Nhiều kích thước và tỷ lệ khác nhau, grid sẽ tự sắp xếp.

**Lưu ý:**
*   Hãy tối ưu hóa kích thước file ảnh để trang web tải nhanh hơn.
*   Tên file không nhất thiết phải giữ nguyên là "placeholder...", bạn có thể đặt tên file theo ý muốn và cập nhật đường dẫn trong file HTML hoặc CSS tương ứng.
*   Đây chỉ là gợi ý, bạn có thể điều chỉnh số lượng hoặc loại bỏ bớt các mục ảnh không cần thiết.
