// const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Cách cũ
const API_BASE_URL = '/api'; // API được phục vụ từ cùng origin, đường dẫn /api

// --- COUNTDOWN TIMER ---
function startCountdown(targetDateString) {
    // ... (giữ nguyên code countdown)
    // THAY THẾ BẰNG NGÀY CƯỚI CỦA BẠN (YYYY-MM-DD HH:MM:SS)
    // const weddingDateTime = "[YYYY-MM-DDTHH:MM:SS]"; // Ví dụ: "2024-12-25T18:00:00"
    // Bạn cần điền ngày giờ cụ thể vào đây
    const weddingDateTime = "2025-07-20T18:00:00"; // <<<<----- VÍ DỤ: ĐIỀN NGÀY CỦA BẠN
    // ... (phần còn lại của hàm countdown)

    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    const targetDate = new Date(targetDateString).getTime(); // Sử dụng targetDateString được truyền vào

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById('days').innerText = "00";
            document.getElementById('hours').innerText = "00";
            document.getElementById('minutes').innerText = "00";
            document.getElementById('seconds').innerText = "00";
            if(document.querySelector('.hero-intro')) {
                const heroIntro = document.querySelector('.hero-intro');
                if (heroIntro) heroIntro.textContent = "Chúc Mừng Hạnh Phúc!";
            }
            // clearInterval(interval); // Cân nhắc dừng interval
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
}


document.addEventListener('DOMContentLoaded', () => {
    // THAY THẾ BẰNG NGÀY CƯỚI CỦA BẠN (YYYY-MM-DDTHH:MM:SS)
    const weddingDateTimeString = "2025-07-20T18:00:00"; // <<<<----- VÍ DỤ: ĐIỀN NGÀY CỦA BẠN
    startCountdown(weddingDateTimeString);


    const rsvpForm = document.getElementById('rsvpForm');
    const wishForm = document.getElementById('wishForm');
    const rsvpStatus = document.getElementById('rsvpStatus');
    const wishStatus = document.getElementById('wishStatus');
    const wishesListDiv = document.getElementById('wishesList');

    // Load wishes khi trang được tải
    loadWishes();

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (rsvpStatus) {
                rsvpStatus.textContent = 'Đang gửi...';
                rsvpStatus.style.color = '#8B4513';
            }
            const formData = new FormData(rsvpForm);
            const data = {
                name: formData.get('name'),
                attending: formData.get('attending') === 'true',
                guests_count: parseInt(formData.get('guests_count'), 10) || 0, // Đảm bảo là số
                message: formData.get('message')
            };

            try {
                const response = await fetch(`${API_BASE_URL}/confirmations/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (rsvpStatus) {
                    if (response.ok) {
                        rsvpStatus.textContent = 'Cảm ơn bạn đã xác nhận!';
                        rsvpStatus.style.color = 'green';
                        rsvpForm.reset();
                    } else {
                        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
                        rsvpStatus.textContent = `Lỗi: ${errorData.detail || response.statusText}`;
                        rsvpStatus.style.color = 'red';
                    }
                }
            } catch (error) {
                if (rsvpStatus) {
                    rsvpStatus.textContent = 'Lỗi kết nối đến server.';
                    rsvpStatus.style.color = 'red';
                }
                console.error('RSVP Error:', error);
            }
        });
    }

    if (wishForm) {
        wishForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (wishStatus) {
                wishStatus.textContent = 'Đang gửi...';
                wishStatus.style.color = '#8B4513';
            }
            const formData = new FormData(wishForm);
            const data = {
                name: formData.get('name'),
                wish_text: formData.get('wish_text'),
            };

            try {
                const response = await fetch(`${API_BASE_URL}/wishes/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (wishStatus) {
                    if (response.ok) {
                        wishStatus.textContent = 'Cảm ơn lời chúc của bạn!';
                        wishStatus.style.color = 'green';
                        wishForm.reset();
                        loadWishes(); // Tải lại danh sách lời chúc
                    } else {
                        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
                        wishStatus.textContent = `Lỗi: ${errorData.detail || response.statusText}`;
                        wishStatus.style.color = 'red';
                    }
                }
            } catch (error) {
                if (wishStatus) {
                    wishStatus.textContent = 'Lỗi kết nối đến server.';
                    wishStatus.style.color = 'red';
                }
                console.error('Wish Error:', error);
            }
        });
    }

    async function loadWishes() {
        if (!wishesListDiv) return;
        try {
            const response = await fetch(`${API_BASE_URL}/wishes/?limit=20`);
            if (response.ok) {
                const wishes = await response.json();
                wishesListDiv.innerHTML = ''; // Xóa lời chúc cũ
                if (wishes.length === 0) {
                    wishesListDiv.innerHTML = '<p>Chưa có lời chúc nào.</p>';
                    return;
                }
                wishes.forEach(wish => {
                    const wishElement = document.createElement('div');
                    wishElement.classList.add('wish-item');
                    wishElement.innerHTML = `
                        <p><strong>${escapeHtml(wish.name || 'Ẩn danh')}:</strong></p>
                        <p>${escapeHtml(wish.wish_text || '')}</p>
                        <small>Gửi lúc: ${new Date(wish.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</small>
                    `;
                    wishesListDiv.appendChild(wishElement);
                });
            } else {
                wishesListDiv.innerHTML = '<p>Không thể tải lời chúc.</p>';
            }
        } catch (error) {
            wishesListDiv.innerHTML = '<p>Lỗi kết nối khi tải lời chúc.</p>';
            console.error('Load Wishes Error:', error);
        }
    }

    // Hàm để tránh XSS
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') {
            return '';
        }
        return unsafe
             .replace(/&/g, "&")
             .replace(/</g, "<")
             .replace(/>/g, ">")
             .replace(/"/g, """)
             .replace(/'/g, "'");
    }
});