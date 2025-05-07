# Dự án Web Mời Cưới

Đây là một dự án web mời cưới đơn giản được xây dựng với backend FastAPI (Python) và database PostgreSQL. Frontend được viết bằng HTML, CSS, và JavaScript cơ bản.

## Các chức năng chính

*   Hiển thị thông tin mời cưới.
*   Form cho khách mời gửi lời chúc.
*   Form cho khách mời xác nhận tham dự.
*   Lưu trữ lời chúc và thông tin xác nhận vào database PostgreSQL.

## Yêu cầu cài đặt (Prerequisites)

*   Python 3.8+
*   pip (Python package installer)
*   PostgreSQL Server
*   `virtualenv` (khuyến nghị)
*   Git

## Hướng dẫn cài đặt và chạy chi tiết

1.  **Clone repository:**
    ```bash
    git clone <your-repository-url> wedding_project
    cd wedding_project
    ```

2.  **Thiết lập PostgreSQL:**
    *   Đảm bảo PostgreSQL server đang chạy.
    *   Sử dụng `psql` hoặc một công cụ quản lý PostgreSQL (như pgAdmin) để:
        *   Tạo một user mới (ví dụ: `wedding_user` với mật khẩu `wedding_pass`).
            ```sql
            CREATE USER wedding_user WITH PASSWORD 'wedding_pass';
            ```
        *   Tạo một database mới (ví dụ: `wedding_db`) và cấp quyền cho user vừa tạo.
            ```sql
            CREATE DATABASE wedding_db OWNER wedding_user;
            GRANT ALL PRIVILEGES ON DATABASE wedding_db TO wedding_user;
            ```
        *   **Quan trọng:** Bạn cần nhớ tên user, mật khẩu và tên database này để cấu hình ở bước sau.

3.  **Cấu hình Backend:**
    *   Di chuyển vào thư mục `backend`:
        ```bash
        cd backend
        ```
    *   Tạo và kích hoạt môi trường ảo (khuyến nghị):
        ```bash
        python3 -m venv venv
        source venv/bin/activate  # Trên Linux/macOS
        # venv\Scripts\activate    # Trên Windows
        ```
    *   Cài đặt các thư viện Python cần thiết:
        ```bash
        pip install -r requirements.txt
        ```
    *   Tạo file `.env` từ file `.env_example`:
        ```bash
        cp .env_example .env
        ```
    *   Mở file `.env` và chỉnh sửa dòng `DATABASE_URL` với thông tin PostgreSQL của bạn:
        ```
        DATABASE_URL=postgresql://wedding_user:wedding_pass@localhost:5432/wedding_db
        ```
        Thay `wedding_user`, `wedding_pass`, `localhost`, `5432`, `wedding_db` cho phù hợp với cài đặt PostgreSQL của bạn.

4.  **Chạy Backend (FastAPI server):**
    *   Vẫn đang ở trong thư mục `backend` và môi trường ảo đã được kích hoạt:
        ```bash
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
        ```
    *   Server API sẽ chạy tại `http://127.0.0.1:8000`.
    *   Bạn có thể truy cập `http://127.0.0.1:8000/docs` trong trình duyệt để xem tài liệu API tự động (Swagger UI).

5.  **Chạy Frontend:**
    *   Mở file `frontend/index.html` trực tiếp bằng trình duyệt web của bạn.
    *   **Lưu ý:** Frontend (`index.html`) giao tiếp với backend qua địa chỉ `http://127.0.0.1:8000/api` (đã được cấu hình trong `frontend/js/script.js`). Đảm bảo backend đang chạy.

## Script `setup_and_run.sh`

Script này giúp tự động hóa một vài bước cài đặt và khởi chạy server.

*   **Nội dung script `setup_and_run.sh` (đặt ở thư mục gốc `wedding_project`):**
    (Xem ở mục tiếp theo)

*   **Cách sử dụng:**
    1.  Cấp quyền thực thi cho script:
        ```bash
        chmod +x setup_and_run.sh
        ```
    2.  Chạy script:
        ```bash
        ./setup_and_run.sh
        ```
    Script sẽ hỏi bạn thông tin database và cố gắng khởi tạo.

## Cấu trúc thư mục

wedding_project/
├── backend/
│ ├── app/
│ │ ├── init.py
│ │ ├── main.py
│ │ ├── models.py
│ │ ├── schemas.py
│ │ ├── crud.py
│ │ └── database.py
│ ├── .env_example
│ └── requirements.txt
├── frontend/
│ ├── index.html
│ ├── css/style.css
│ └── js/script.js
├── .gitignore
├── README.md
└── setup_and_run.sh


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
